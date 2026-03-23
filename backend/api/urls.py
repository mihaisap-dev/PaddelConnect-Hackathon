from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views 

router = DefaultRouter()
router.register(r'clubs', views.ClubViewSet)
router.register(r'courts', views.CourtViewSet)
router.register(r'bookings', views.BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register-user/', views.register_user, name='register_user'),
    path('register-manager/', views.register_manager, name='register_manager'),
    path('login/', views.CustomAuthToken.as_view(), name='login'),
    path('auth/user/', views.get_user_profile, name='user-profile'),
    path('activate/<str:uidb64>/<str:token>/', views.activate_account, name='activate_account'),
]