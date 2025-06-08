# geofencing/filters.py
import django_filters
from .models import GeofenceZone

class GeofenceZoneFilter(django_filters.FilterSet):
    """
    FilterSet for the GeofenceZone model to allow filtering by various fields.
    """
    name = django_filters.CharFilter(
        field_name='name',
        lookup_expr='icontains',
        label='Filter by zone name (case-insensitive, partial match).'
    )
    min_radius = django_filters.NumberFilter(
        field_name='radius',
        lookup_expr='gte',
        label='Filter by minimum radius (in meters).'
    )
    max_radius = django_filters.NumberFilter(
        field_name='radius',
        lookup_expr='lte',
        label='Filter by maximum radius (in meters).'
    )
    is_active = django_filters.BooleanFilter(
        field_name='is_active',
        label='Filter by active status.'
    )

    class Meta:
        model = GeofenceZone
        fields = ['name', 'min_radius', 'max_radius', 'is_active']