# geofencing/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer, GeometrySerializerMethodField
from .models import GeofenceZone, GeofenceEvent

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model, used for nesting."""
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class GeofenceZoneSerializer(GeoFeatureModelSerializer):
    """
    A GeoJSON-compatible serializer for the GeofenceZone model.
    """
    owner = UserSerializer(read_only=True)
    # The center field is automatically handled by GeoFeatureModelSerializer.

    class Meta:
        model = GeofenceZone
        geo_field = 'center' # This field contains the geometry
        fields = (
            'id',
            'owner',
            'name',
            'description',
            'radius',
            'color',
            'is_active',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

class GeofenceEventSerializer(serializers.ModelSerializer):
    """Serializer for GeofenceEvent logs."""
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    location_coords = GeometrySerializerMethodField()

    class Meta:
        model = GeofenceEvent
        fields = (
            'id',
            'zone',
            'zone_name',
            'event_type',
            'location_coords',
            'timestamp'
        )
        read_only_fields = ('id', 'zone_name', 'location_coords', 'timestamp')

    def get_location_coords(self, obj):
        # Return coordinates as a simple [lon, lat] array
        return obj.location.coords

class LogEventSerializer(serializers.Serializer):
    """
    Serializer for the input of the 'log_event' custom action.
    """
    longitude = serializers.FloatField()
    latitude = serializers.FloatField()
    event_type = serializers.ChoiceField(choices=GeofenceEvent.EventType.choices)

    def validate_longitude(self, value):
        if not -180 <= value <= 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180.")
        return value

    def validate_latitude(self, value):
        if not -90 <= value <= 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90.")
        return value