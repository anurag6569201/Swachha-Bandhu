# geofencing/admin.py
from django.contrib.gis import admin
from .models import GeofenceZone, GeofenceEvent

@admin.register(GeofenceZone)
class GeofenceZoneAdmin(admin.GISModelAdmin):
    """
    Admin configuration for GeofenceZone with map support.
    """
    change_form_template = "admin/geofencing/geofencezone/change_form.html"
    
    # Use OpenStreetMap for the admin map
    gis_widget_kwargs = {
        'attrs': {
            'default_lon': -95,
            'default_lat': 38,
            'default_zoom': 4,
        },
    }
    list_display = ('name', 'owner', 'radius', 'is_active', 'created_at')
    list_display = ('name', 'owner', 'radius', 'is_active', 'created_at')
    list_filter = ('is_active', 'owner')
    search_fields = ('name', 'description', 'owner__username')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('owner', 'name', 'description', 'is_active')
        }),
        ('Geospatial Data', {
            'fields': ('center', 'radius', 'color')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )

@admin.register(GeofenceEvent)
class GeofenceEventAdmin(admin.GISModelAdmin):
    """
    Admin configuration for GeofenceEvent logs.
    """
    list_display = ('zone', 'event_type', 'timestamp')
    list_filter = ('event_type', 'zone__name')
    search_fields = ('zone__name', 'zone__owner__username')
    readonly_fields = ('zone', 'event_type', 'location', 'timestamp')
    # Make the entire model read-only in the admin as events should only be created via the API
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False