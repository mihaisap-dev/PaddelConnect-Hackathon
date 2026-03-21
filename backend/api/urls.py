from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
# IMPORTANT: Importă register_user din views.py-ul tău
from .views import ClubViewSet, CourtViewSet, BookingViewSet, register_user 

router = DefaultRouter()
router.register(r'clubs', ClubViewSet)
router.register(r'courts', CourtViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Ruta pentru LOGIN (primește username/parolă -> dă Token)
    path('login/', obtain_auth_token, name='api_token_auth'),
    # Ruta pentru REGISTER (creează user nou -> dă Token)
    path('register/', register_user, name='api_register'), 
]