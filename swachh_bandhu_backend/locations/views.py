from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Location
from .serializers import LocationReadSerializer, LocationCreateUpdateSerializer
from core.permissions import IsMunicipalAdmin

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.filter(is_active=True).select_related('municipality')
    lookup_field = 'id'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['municipality', 'location_type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return LocationCreateUpdateSerializer
        return LocationReadSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsMunicipalAdmin]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        if user.is_authenticated and user.role in ['MUNICIPAL_ADMIN', 'MODERATOR'] and user.municipality:
            return qs.filter(municipality=user.municipality)
        
        return qs