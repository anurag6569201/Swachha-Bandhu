# geofencing/views.py
from django.contrib.gis.geos import Point
from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import GeofenceZone, GeofenceEvent
from .serializers import (
    GeofenceZoneSerializer,
    GeofenceEventSerializer,
    LogEventSerializer
)
from .permissions import IsOwnerOrReadOnly
from .filters import GeofenceZoneFilter

class GeofenceZoneViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows a user's geofence zones to be viewed or edited.
    Provides GET, LIST, UPDATE, and custom actions for analysis and events.
    Creation and Deletion are disabled to align with the advanced dashboard.
    """
    serializer_class = GeofenceZoneSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filterset_class = GeofenceZoneFilter
    
    # Restrict the HTTP methods to only what the advanced dashboard needs.
    # This programmatically disables creation and deletion via the API.
    http_method_names = ['get', 'patch', 'head', 'options']

    def get_queryset(self):
        """
        This view returns a list of all geofence zones for the
        currently authenticated user.
        """
        return GeofenceZone.objects.filter(owner=self.request.user)

    @action(detail=True, methods=['post'], url_path='log-event', serializer_class=LogEventSerializer)
    def log_event(self, request, pk=None):
        """
        Custom action to log a geofence event for a specific zone.
        """
        zone = self.get_object() 

        if not zone.is_active:
            return Response(
                {'error': 'This geofence zone is not active for event logging.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        event_location = Point(data['longitude'], data['latitude'], srid=4326)

        event = GeofenceEvent.objects.create(
            zone=zone,
            event_type=data['event_type'],
            location=event_location
        )

        response_serializer = GeofenceEventSerializer(event)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'], url_path='events')
    def list_events(self, request, pk=None):
        """
        Retrieve a paginated list of all events for a specific geofence zone.
        """
        zone = self.get_object()
        queryset = zone.events.all()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = GeofenceEventSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = GeofenceEventSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='statistics')
    def statistics(self, request):
        """
        Provides high-level aggregate statistics for all zones owned by the user.
        This directly powers the "Global Statistics Dashboard" feature.
        """
        user_zones = self.get_queryset()

        total_zones = user_zones.count()
        active_zones = user_zones.filter(is_active=True).count()

        event_counts = GeofenceEvent.objects.filter(
            zone__owner=request.user
        ).values('event_type').annotate(
            count=Count('id')
        ).order_by('event_type')

        event_type_counts = {
            'ENTER': 0,
            'EXIT': 0,
            'CHECK_IN': 0,
        }
        for item in event_counts:
            event_type_counts[item['event_type']] = item['count']

        stats = {
            'total_zones': total_zones,
            'active_zones': active_zones,
            'event_type_counts': event_type_counts,
        }

        return Response(stats, status=status.HTTP_200_OK)