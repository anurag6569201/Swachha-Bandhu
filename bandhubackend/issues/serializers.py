# issues/serializers.py
from rest_framework import serializers
from .models import IssueCategory, ReportedIssue, IssueMedia
from django.conf import settings
from math import radians, sin, cos, sqrt, atan2 # For Haversine formula

class IssueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueCategory
        fields = ['id', 'name', 'description']

class IssueMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueMedia
        fields = ['id', 'file', 'media_type', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ReportedIssueCreateSerializer(serializers.ModelSerializer):
    media_files_payload = serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True, required=False # Allow no files initially
    )
    # These are sent by frontend based on navigator.geolocation
    user_current_latitude = serializers.DecimalField(max_digits=10, decimal_places=7, write_only=True)
    user_current_longitude = serializers.DecimalField(max_digits=10, decimal_places=7, write_only=True)

    class Meta:
        model = ReportedIssue
        fields = [
            'id', 'category', 'description', 'latitude', 'longitude', 'address',
            'qr_code_identifier', 'media_files_payload', 'user_current_latitude', 'user_current_longitude',
            # Read-only fields that are set by the system or shown in response
            'user', 'status', 'timestamp', 'media_files', 'reporter_latitude_at_submission', 'reporter_longitude_at_submission'
        ]
        read_only_fields = ['id', 'user', 'status', 'timestamp', 'media_files', 'reporter_latitude_at_submission', 'reporter_longitude_at_submission']

    def validate(self, data):
        reported_latitude = data.get('latitude')
        reported_longitude = data.get('longitude')
        user_current_latitude = data.get('user_current_latitude')
        user_current_longitude = data.get('user_current_longitude')

        # Geo-fencing validation
        # The reported location must be within GEO_FENCE_RADIUS of the user's current location
        if reported_latitude is not None and reported_longitude is not None and \
           user_current_latitude is not None and user_current_longitude is not None:
            
            # Using Haversine formula for distance calculation
            R = 6371e3  # Earth radius in meters

            lat1_rad = radians(float(user_current_latitude))
            lon1_rad = radians(float(user_current_longitude))
            lat2_rad = radians(float(reported_latitude))
            lon2_rad = radians(float(reported_longitude))

            dlon = lon2_rad - lon1_rad
            dlat = lat2_rad - lat1_rad

            a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
            c = 2 * atan2(sqrt(a), sqrt(1 - a))
            actual_distance_meters = R * c

            # Ensure GEO_FENCE_RADIUS is defined in your settings.py
            # e.g., GEO_FENCE_RADIUS = 500 (for 500 meters)
            if not hasattr(settings, 'GEO_FENCE_RADIUS'):
                 raise serializers.ValidationError("GEO_FENCE_RADIUS is not configured in settings.")

            if actual_distance_meters > settings.GEO_FENCE_RADIUS:
                raise serializers.ValidationError(
                    f"You seem to be too far from the reported issue location. "
                    f"Please report issues from within {settings.GEO_FENCE_RADIUS} meters. "
                    f"Distance detected: {actual_distance_meters:.2f}m"
                )
        else:
            # This validation should ideally be handled by making fields mandatory if that's the intent
            # For instance, latitude, longitude, user_current_latitude, user_current_longitude can be `required=True`
            # However, keeping explicit check here if they are conditionally mandatory.
            missing_fields = []
            if reported_latitude is None: missing_fields.append("latitude")
            if reported_longitude is None: missing_fields.append("longitude")
            if user_current_latitude is None: missing_fields.append("user_current_latitude")
            if user_current_longitude is None: missing_fields.append("user_current_longitude")
            if missing_fields:
                 raise serializers.ValidationError(f"Missing location data: {', '.join(missing_fields)}. All location fields are mandatory for validation.")
            
        return data

    def create(self, validated_data):
        media_payload = validated_data.pop('media_files_payload', [])
        user = self.context['request'].user
        
        # Store reporter's current location for reference/audit
        validated_data['reporter_latitude_at_submission'] = validated_data.pop('user_current_latitude')
        validated_data['reporter_longitude_at_submission'] = validated_data.pop('user_current_longitude')

        issue = ReportedIssue.objects.create(user=user, **validated_data)
        
        for media_file in media_payload:
            # Basic media type detection by extension (can be improved)
            media_type = 'image'
            if hasattr(media_file, 'name') and media_file.name:
                file_name_lower = media_file.name.lower()
                if file_name_lower.endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm')):
                    media_type = 'video'
                # Add more image extensions if default 'image' is not sufficient
                # elif file_name_lower.endswith(('.jpeg', '.jpg', '.png', '.gif', '.bmp', '.tiff')):
                #     media_type = 'image' 
            IssueMedia.objects.create(issue=issue, file=media_file, media_type=media_type)
            
        return issue

class ReportedIssueListSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField() # Shows user's __str__ representation
    category = serializers.StringRelatedField()
    media_files = IssueMediaSerializer(many=True, read_only=True)

    class Meta:
        model = ReportedIssue
        fields = [
            'id', 'user', 'category', 'description', 'latitude', 'longitude', 
            'address', 'status', 'timestamp', 'qr_code_identifier', 'media_files',
            'is_verified_by_peer', 'verification_timestamp',
            'reporter_latitude_at_submission', 'reporter_longitude_at_submission'
        ]