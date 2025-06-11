from rest_framework import serializers
from .models import Report, ReportMedia
from locations.models import Location
from .services import is_user_within_geofence
from users.serializers import UserSerializer

# --- READ/DISPLAY Serializers ---

class ReportMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMedia
        fields = ['id', 'media_type', 'file']
        read_only_fields = ['id', 'media_type', 'file']

class ReportReadSerializer(serializers.ModelSerializer):
    """Serializer for reading/listing reports with detailed, nested data."""
    user = UserSerializer(read_only=True)
    media = ReportMediaSerializer(many=True, read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    # Shows how many verifications this report has received
    verification_count = serializers.IntegerField(source='verifications.count', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'user', 'location', 'location_name', 'issue_type',
            'description', 'status', 'media', 'created_at', 'verification_count',
            'verifies_report'
        ]
        read_only_fields = fields


# --- WRITE/ACTION Serializers ---

class ReportCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new reports. Includes geo-fencing validation.
    Also used as the base for the 'verify' action.
    """
    location = serializers.UUIDField(write_only=True, required=True)
    user_latitude = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True, required=True)
    user_longitude = serializers.DecimalField(max_digits=10, decimal_places=6, write_only=True, required=True)
    
    media_files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False),
        write_only=True,
        required=False
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
            raise serializers.ValidationError({"location": "Location with this ID not found."})
        
        if not is_user_within_geofence(user_lat, user_lon, location.latitude, location.longitude):
            raise serializers.ValidationError(
                "Geo-fence check failed. You are too far from the location to submit a report."
            )
        
        # Pass the validated location object to the view via context for use in create()
        self.context['location_obj'] = location
        return data

    def create(self, validated_data):
        # Pop the non-model fields before creating the report instance
        location = self.context['location_obj']
        media_files = validated_data.pop('media_files', [])
        validated_data.pop('user_latitude')
        validated_data.pop('user_longitude')
        
        report = Report.objects.create(
            user=self.context['request'].user,
            location=location,
            **validated_data
        )

        media_to_create = []
        for file in media_files:
            media_type = 'IMAGE'
            if 'video' in file.content_type:
                media_type = 'VIDEO'
            elif 'audio' in file.content_type:
                media_type = 'AUDIO'
            media_to_create.append(ReportMedia(report=report, file=file, media_type=media_type))
        
        if media_to_create:
            ReportMedia.objects.bulk_create(media_to_create)
            
        return report


class ModerateReportSerializer(serializers.ModelSerializer):
    """A simple serializer for updating only the report's status by a moderator."""
    class Meta:
        model = Report
        fields = ['status']
        extra_kwargs = {
            'status': {'choices': [
                Report.ReportStatus.VERIFIED,
                Report.ReportStatus.REJECTED,
                Report.ReportStatus.ACTIONED
            ]}
        }