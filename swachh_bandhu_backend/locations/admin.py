from django.contrib.gis import admin
from django.utils.html import format_html
from mapwidgets.widgets import GoogleMapPointFieldWidget, MapboxPointFieldWidget
from .models import Location

@admin.register(Location)
class LocationAdmin(admin.GISModelAdmin):
    list_display = ('name', 'municipality', 'location_type', 'is_active', 'display_qr_code')
    list_filter = ('municipality', 'location_type', 'is_active')
    search_fields = ('name', 'description')
    ordering = ('municipality', 'name')

    formfield_overrides = {
        Location.point: {"widget": GoogleMapPointFieldWidget}
    }
    
    fieldsets = (
        (None, {
            'fields': ('name', 'municipality', 'location_type', 'description', 'is_active')
        }),
        ('Geospatial Information', {
            'fields': ('point',),
            'description': "Use the map to select a location. The latitude and longitude will be determined by the marker."
        }),
        ('QR Code', {
            'fields': ('display_qr_code',),
        }),
    )

    readonly_fields = ('display_qr_code',)

    def display_qr_code(self, obj):
        if obj.qr_code_image:
            return format_html('<a href="{0}" target="_blank" title="Click to view full size"><img src="{0}" width="100" /></a>', obj.qr_code_image.url)
        return "Not Generated"
    display_qr_code.short_description = 'QR Code'