# geofencing/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeofenceZoneViewSet

# The router automatically generates the URLs for our ViewSet.
router = DefaultRouter()
router.register(r'geofences', GeofenceZoneViewSet, basename='geofencezone')

urlpatterns = [
    path('', include(router.urls)),
]