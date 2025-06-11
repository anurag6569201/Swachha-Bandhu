# locations/admin.py
from django import forms
from django.contrib import admin
from mapwidgets.widgets import GoogleMapPointFieldWidget
from .models import Location

class LocationAdminForm(forms.ModelForm):
    """
    Custom form for the Location admin. It uses the GoogleMapPointFieldWidget
    for a single, non-existent 'location' field, and then uses JavaScript
    to sync its value with the actual latitude and longitude fields.
    """
    location = forms.CharField(
        label="Location on Map",
        widget=GoogleMapPointFieldWidget,
        required=False
    )

    class Meta:
        model = Location
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Check if we are editing an existing instance
        if self.instance and self.instance.pk:
            # Set the initial value for our virtual 'location' field
            # The widget expects a "lat,lng" string.
            initial_location = f"{self.instance.latitude},{self.instance.longitude}"
            self.fields['location'].initial = initial_location
            
            # Make the lat/lon fields read-only to prevent manual edits
            # that would conflict with the map.
            self.fields['latitude'].widget.attrs['readonly'] = True
            self.fields['longitude'].widget.attrs['readonly'] = True

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    form = LocationAdminForm
    
    list_display = ('name', 'location_type', 'latitude', 'longitude')
    search_fields = ('name',)
    
    # We need to organize our fields, placing our virtual 'location' field.
    fieldsets = (
        (None, {
            'fields': ('name', 'location_type', 'description')
        }),
        ('Geospatial Information', {
            'fields': ('location', 'latitude', 'longitude'),
            'description': "Use the map to select a location. The latitude and longitude fields will be populated automatically."
        }),
        ('QR Code Information', {
            'fields': ('id', 'qr_code_url'),
        }),
    )

    readonly_fields = ('id', 'qr_code_url')

    class Media:
        """
        Adds custom JavaScript to the admin page to link the map widget
        to our latitude and longitude fields.
        """
        js = (
            'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', 
            'locations/js/map_admin.js',
        )