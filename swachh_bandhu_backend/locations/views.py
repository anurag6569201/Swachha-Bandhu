# locations/views.py
from rest_framework import viewsets, permissions
from .models import Location
from .serializers import LocationSerializer

class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A read-only API endpoint for listing and retrieving locations.
    
    The frontend will use this to:
    1. Fetch details of a location after a QR code scan.
    2. (Optional) Display all available locations on a map.
    """
    queryset = Location.objects.all().order_by('name')
    serializer_class = LocationSerializer
    # We allow any user (even unauthenticated) to view location data.
    # This is necessary for the initial QR scan before a user might log in.
    permission_classes = [permissions.AllowAny]
    
    # Use the UUID 'id' field for lookup instead of the default 'pk'.
    lookup_field = 'id'