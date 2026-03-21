from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from .models import Club, Court, Booking, Profile
from .serializers import ClubSerializer, CourtSerializer, BookingSerializer, UserSerializer

# --- IMPORTURI PENTRU EMAIL ȘI ACTIVARE ---
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator

# --- UTILITAR TRIMITE EMAIL (ADĂUGAT) ---
def send_activation_email(user, email):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    # Link-ul care duce la pagina de activare din React
    link = f"http://localhost:3000/activate/{uid}/{token}"
    
    subject = "Confirmă contul Padel Connect"
    message = f"Salut {user.username}!\n\nConfirmă adresa de email dând click aici: {link}"
    send_mail(subject, message, 'admin@padelconnect.ro', [email])

# --- ACTIVARE CONT (VIEW NOU) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def activate_account(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        profile = user.profile
        profile.email_confirmed = True
        profile.save()
        return Response({'message': 'Email confirmat cu succes!'}, status=200)
    return Response({'error': 'Link invalid sau expirat.'}, status=400)


# --- 1. PROFILUL UTILIZATORULUI ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# --- 2. LOGIN PERSONALIZAT ---
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # OPȚIONAL: Blocare login dacă nu a confirmat email-ul
        # if hasattr(user, 'profile') and not user.profile.email_confirmed:
        #     return Response({'error': 'Te rugăm să confirmi email-ul înainte de login!'}, status=403)

        token, created = Token.objects.get_or_create(user=user)
        is_manager = False
        if hasattr(user, 'profile'):
            is_manager = user.profile.is_manager

        return Response({
            'token': token.key,
            'is_manager': is_manager,
            'username': user.username
        })


# --- 3. VIEWSET CLUBURI ---
class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'dashboard']:
            if self.action == 'dashboard':
                return [IsAuthenticated()]
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user
        if hasattr(user, 'profile') and user.profile.is_manager:
            # Salvăm clubul legat de manager
            serializer.save(manager=user)
            
            # RECOMPENSA PENTRU MANAGER:
            profile = user.profile
            profile.loyalty_points += 50  # Bonus baban pentru club nou
            profile.save()
            print(f" BONUS: Managerul {user.username} a primit 50 puncte pentru club nou!")
        else:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Doar managerii pot crea cluburi!")
        
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def dashboard(self, request):
        user = request.user
        # Căutăm clubul unde ești manager
        club = Club.objects.filter(manager=user).first()
        
        if not club:
            return Response({"error": "Managerul nu are niciun club asignat."}, status=200)

        # DEBUG: Vedem în terminal ce club am găsit
        print(f"DEBUG: Managerul {user.username} administrează clubul {club.name}")

        # Luăm TOATE rezervările de la TOATE terenurile acestui club
        # Scoatem filtrul de dată pentru a vedea dacă "curge" informația
        bookings_qs = Booking.objects.filter(court__club=club).select_related('court', 'user')

        # Calculăm venitul
        total_revenue = sum(b.court.price_per_hour for b in bookings_qs)

        # Serializăm datele folosind serializerul tău
        serializer = BookingSerializer(bookings_qs, many=True)

        return Response({
            "stats": {
                "count_today": bookings_qs.count(),
                "revenue_today": total_revenue,
            },
            "today_bookings": serializer.data
        })
# --- 4. VIEWSET TERENURI ---
class CourtViewSet(viewsets.ModelViewSet):
    queryset = Court.objects.all()
    serializer_class = CourtSerializer
    def get_permissions(self):
        if self.action in ['list', 'retrieve']: return [AllowAny()]
        return [IsAuthenticated()]


# --- 5. VIEWSET REZERVĂRI ---
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous: return Booking.objects.none()
        club_id = self.request.query_params.get('club_id')
        date = self.request.query_params.get('date')
        if club_id and date:
            return Booking.objects.filter(court__club_id=club_id, start_time__date=date)
        my_own_bookings = Booking.objects.filter(user=user)
        if hasattr(user, 'profile') and user.profile.is_manager:
            bookings_at_my_clubs = Booking.objects.filter(court__club__manager=user)
            return (my_own_bookings | bookings_at_my_clubs).distinct().order_by('-start_time')
        return my_own_bookings.order_by('-start_time')
    
    def perform_create(self, serializer):
        # 1. Salvăm rezervarea
        booking = serializer.save(user=self.request.user)
        user = self.request.user
        
        # 2. Adăugăm puncte (doar dacă e Jucător, nu Manager)
        if hasattr(user, 'profile'):
            profile = user.profile
            profile.loyalty_points += 10  # Adaugi 10 puncte per rezervare
            profile.save()
            print(f"DEBUG: {user.username} a primit 10 puncte. Total: {profile.loyalty_points}")

    def destroy(self, request, *args, **kwargs):
        booking = self.get_object()
        user = request.user
        
        now = timezone.localtime(timezone.now())
        booking_start = timezone.localtime(booking.start_time)

        # Verificăm permisiunile de anulare
        is_owner = (booking.user == user)
        is_manager_of_this_club = (
            hasattr(user, 'profile') and
            user.profile.is_manager and
            booking.court.club.manager == user
        )

        if is_owner or is_manager_of_this_club:
            timp_pana_la_meci = booking_start - now

            # Restricție 4 ore (doar pentru jucători)
            if timp_pana_la_meci < timedelta(hours=4) and not is_manager_of_this_club:
                return Response(
                    {"error": "Nu mai poți anula! Rezervările pot fi anulate cu cel târziu 4 ore înainte."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --- LOGICA DE SCĂDERE PUNCTE ---
            if is_owner and hasattr(user, 'profile') and not user.profile.is_manager:
                profile = user.profile
                # Scădem 10 puncte, dar nu lăsăm să scadă sub 0
                profile.loyalty_points = max(0, profile.loyalty_points - 10)
                profile.save()
                print(f"DEBUG: {user.username} a pierdut 10 puncte. Total: {profile.loyalty_points}")
            # -------------------------------

            self.perform_destroy(booking)
            return Response({"message": "Anulat cu succes! Punctele au fost actualizate."}, status=status.HTTP_200_OK)

        return Response(
            {"error": "Nu ai permisiunea să anulezi această rezervare."},
            status=status.HTTP_403_FORBIDDEN
        )

# --- 6. ÎNREGISTRARE UTILIZATORI (ACTUALIZAT) ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email') # Luăm mail-ul din React
    phone = request.data.get('phone', '') # Luăm telefonul din React

    if not username or not password or not email:
        return Response({'error': 'Te rugăm să introduci Username, Parolă și Email!'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Utilizatorul există deja'}, status=400)
    
    # Creăm userul
    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Actualizăm profilul (creat automat de receiver)
    profile = user.profile
    profile.email = email
    profile.phone = phone
    profile.save()
    
    # Trimitem mailul (opțional pentru testare, asigură-te că ai funcția send_activation_email definită)
    # send_activation_email(user, email) 

    return Response({'message': 'Cont creat cu succes!'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_manager(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    
    if not all([username, password, email]):
        return Response({'error': 'Date incomplete'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Utilizatorul există deja'}, status=400)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    
    # Setăm manager pe True și trimitem email
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.is_manager = True
    profile.email = email
    profile.save()
    
    send_activation_email(user, email)
    
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'is_manager': True, 'username': user.username}, status=201)