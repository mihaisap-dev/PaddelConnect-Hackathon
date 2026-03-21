from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Club, Court, Booking, Profile 
from datetime import timedelta
from django.utils import timezone

# --- 1. User & Profile ---
class UserSerializer(serializers.ModelSerializer):
    # Folosim numele câmpurilor din modelul tău Profile: 'phone', nu 'phone_number'
    loyalty_points = serializers.IntegerField(source='profile.loyalty_points', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    is_manager = serializers.BooleanField(source='profile.is_manager', read_only=True)
    profile_email = serializers.EmailField(source='profile.email', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'loyalty_points', 'profile_email', 'phone', 'is_manager', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'loyalty_points']

# --- 2. Club ---
class ClubSerializer(serializers.ModelSerializer):
    # Dacă ai adăugat deja câmpul în models.py:
    rating = serializers.FloatField(required=False, default=5.0)    
    # Alternativă: un calcul simplu pentru design
    club_rating = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ['id', 'name', 'address', 'city', 'image_url', 'description', 'rating', 'club_rating']

    def get_club_rating(self, obj):
        # O notă implicită de 5 steluțe pentru design
        return 5
# --- 3. Teren (AICI ERA PROBLEMA) ---
class CourtSerializer(serializers.ModelSerializer):
    # Adăugăm club_name pentru ca React să știe cui aparține terenul în liste
    club_name = serializers.ReadOnlyField(source='club.name')

    class Meta:
        model = Court
        # Explicităm câmpurile pentru a evita erori de tip "__all__" dacă baza de date nu e migrată
        fields = ['id', 'name', 'club', 'club_name', 'price_per_hour']

# --- 4. Rezervare ---
class BookingSerializer(serializers.ModelSerializer):
    # Câmpurile pe care React le caută în map-ul b.court_name, b.user_name, etc.
    court_name = serializers.ReadOnlyField(source='court.name')
    price = serializers.ReadOnlyField(source='court.price_per_hour')
    user_name = serializers.ReadOnlyField(source='user.username')
    
    # Adăugăm un câmp formatat special pentru ora (HH:MM)
    start_time_display = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 
            'court', 
            'court_name', 
            'start_time', 
            'start_time_display', # <-- Adăugat
            'duration_minutes',   # <-- FOARTE IMPORTANT: Trebuie să fie aici!
            'price', 
            'user', 
            'user_name'
        ]
        read_only_fields = ['user']

    def get_start_time_display(self, obj):
        # Transformăm data în format "14:30" pentru tabelul din Dashboard
        return obj.start_time.strftime("%H:%M")

    def validate(self, data):
        # Păstrăm logica ta de validare (este foarte bună)
        court = data.get('court', self.instance.court if self.instance else None)
        start_time = data.get('start_time', self.instance.start_time if self.instance else None)
        # Ne asigurăm că luăm duration_minutes corect
        duration_minutes = data.get('duration_minutes', 60)

        if not start_time:
            return data

        now = timezone.now()
        if not self.instance and start_time < now:
            raise serializers.ValidationError({"error": "Nu poți face o rezervare în trecut!"})

        proposed_end_time = start_time + timedelta(minutes=duration_minutes)
        
        # Logica de suprapunere
        overlapping_bookings = Booking.objects.filter(
            court=court,
            start_time__lt=proposed_end_time,
            end_time__gt=start_time
        )

        if self.instance:
            overlapping_bookings = overlapping_bookings.exclude(pk=self.instance.pk)

        if overlapping_bookings.exists():
            raise serializers.ValidationError({"error": "Acest interval este ocupat!"})
        
        return data