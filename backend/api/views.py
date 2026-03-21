


from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Club, Court, Booking
from .serializers import ClubSerializer, CourtSerializer, BookingSerializer

# ViewSet-urile se ocupă automat de GET, POST, PUT și DELETE
class ClubViewSet(viewsets.ModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class CourtViewSet(viewsets.ModelViewSet):
    queryset = Court.objects.all()
    serializer_class = CourtSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer