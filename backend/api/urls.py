from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClubViewSet, CourtViewSet

# Router-ul generează automat URL-urile pentru view-urile noastre
router = DefaultRouter()
router.register(r'clubs', ClubViewSet)
router.register(r'courts', CourtViewSet)

urlpatterns = [
    path('', include(router.urls)),
]