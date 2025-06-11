# locations/serializers.py
from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Location model.
    Exposes all necessary fields to the frontend.
    """
    class Meta:
        model = Location
        fields = [
            'id',
            'name',
            'description',
            'latitude',
            'longitude',
            'location_type',
        ]