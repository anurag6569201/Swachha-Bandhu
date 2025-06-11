# reports/serializers.py
from rest_framework import serializers
from .models import Report, ReportMedia, Location
from .services import is_user_within_geofence
from users.serializers import UserSerializer # To display user info in reads

class ReportMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMedia
        fields = ['id', 'media_type', 'file']


# --- READ Serializer ---
class ReportReadSerializer(serializers.ModelSerializer):
    """Serializer for reading/listing reports."""
    user = UserSerializer(read_only=True)
    media = ReportMediaSerializer(many=True, read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'user', 'location', 'location_name', 'issue_type',
            'description', 'status', 'media', 'created_at'
        ]


# --- WRITE/CREATE Serializer ---
class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new reports. Includes geo-fencing validation."""
    # Frontend will send the location's UUID
    location = serializers.UUIDField(write_only=True)
    # Frontend must provide the user's current coordinates for validation
    user_latitude = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True)
    user_longitude = serializers.DecimalField(max_digits=10, decimal_places=6, write_only=True)
    
    # Allow multiple file uploads
    media_files = serializers.ListField(
        child=serializers.FileField(max_length=1000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False # Media is optional
    )

    class Meta:
        model = Report
        fields = [
            'location', 'issue_type', 'description', 
            'user_latitude', 'user_longitude', 'media_files'
        ]

    def validate(self, data):
        location_id = data.get('location')
        user_lat = data.get('user_latitude')
        user_lon = data.get('user_longitude')

        try:
            location = Location.objects.get(id=location_id)
        except Location.DoesNotExist:
            raise serializers.ValidationError("Location not found.")
        
        # --- Geo-fencing Check ---
        if not is_user_within_geofence(user_lat, user_lon, location.latitude, location.longitude):
            raise serializers.ValidationError(
                "You are too far from the location to submit a report. Please move closer and try again."
            )

        # Store the validated location object to use in create()
        self.context['location_obj'] = location
        return data

    def create(self, validated_data):
        location = self.context['location_obj']
        user = self.context['request'].user
        media_files = validated_data.pop('media_files', [])
        
        # Remove geo-fencing fields as they are not on the Report model
        validated_data.pop('user_latitude', None)
        validated_data.pop('user_longitude', None)
        
        report = Report.objects.create(
            user=user,
            location=location,
            **validated_data
        )

        # Create ReportMedia objects for each uploaded file
        for file in media_files:
            # Basic media type detection
            media_type = 'IMAGE' # Default
            if 'video' in file.content_type:
                media_type = 'VIDEO'
            elif 'audio' in file.content_type:
                media_type = 'AUDIO'
            
            ReportMedia.objects.create(report=report, file=file, media_type=media_type)

        # Here we will later call the gamification service
        # from gamification.services import award_points_for_report
        # award_points_for_report(user, report)
        
        return report