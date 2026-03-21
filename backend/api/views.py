from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from .models import Club, Court, Booking
from .serializers import ClubSerializer, CourtSerializer, BookingSerializer

# --- View-urile existente (Modulul de Padel) ---

class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class CourtViewSet(viewsets.ModelViewSet):
    queryset = Court.objects.all()
    serializer_class = CourtSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        # Filtrează rezervările: returnează doar cele care aparțin userului logat
        return Booking.objects.filter(user=self.request.user)

# --- Funcția de Register (Nouă) ---

@api_view(['POST'])
@permission_classes([AllowAny]) # Oricine poate să își creeze cont
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Te rugăm să introduci user și parolă'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Acest utilizator există deja'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 1. Creăm userul în tabelul de Users al Django
        user = User.objects.create_user(username=username, password=password)
        
        # 2. Generăm token-ul de acces pentru acest user nou
        token, created = Token.objects.get_or_create(user=user)
        
        # 3. Trimitem token-ul înapoi la React ca să-l logăm instant
        return Response({'token': token.key}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)