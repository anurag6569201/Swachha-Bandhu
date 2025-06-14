from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import Location
from subscriptions.models import Municipality

class LocationCreateUpdateSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True)
    longitude = serializers.FloatField(write_only=True)

    class Meta:
        model = Location
        fields = ('id', 'name', 'description', 'location_type', 'municipality', 'latitude', 'longitude', 'is_active')

    def validate_municipality(self, value):
        user = self.context['request'].user
        if user.role == 'MUNICIPAL_ADMIN' and user.municipality != value:
            raise serializers.ValidationError("You can only create locations for your own municipality.")
        
        plan = value.plan
        if plan:
            current_location_count = Location.objects.filter(municipality=value).count()
            if self.instance is None and current_location_count >= plan.max_locations: # Check on create
                 raise serializers.ValidationError(f"Municipality has reached its limit of {plan.max_locations} locations for the current plan.")
        return value

    def create(self, validated_data):
        from django.contrib.gis.geos import Point
        point = Point(validated_data.pop('longitude'), validated_data.pop('latitude'), srid=4326)
        validated_data['point'] = point
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from django.contrib.gis.geos import Point
        if 'latitude' in validated_data and 'longitude' in validated_data:
            point = Point(validated_data.pop('longitude'), validated_data.pop('latitude'), srid=4326)
            instance.point = point
        return super().update(instance, validated_data)

class LocationReadSerializer(GeoFeatureModelSerializer):
    municipality_name = serializers.CharField(source='municipality.name', read_only=True)
    qr_code_url = serializers.ImageField(source='qr_code_image', read_only=True)

    class Meta:
        model = Location
        geo_field = "point"
        fields = ('id', 'name', 'description', 'location_type', 'municipality_name', 'qr_code_url', 'is_active')
        read_only_fields = ('id', 'municipality_name', 'qr_code_url')