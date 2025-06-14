from rest_framework import serializers
from .models import Report, ReportMedia
from locations.models import Location
from .services import is_user_within_geofence, find_nearby_duplicate_report
from users.serializers import UserSerializer

class ReportMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMedia
        fields = ['id', 'file', 'uploaded_at']

class ReportReadSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    media = ReportMediaSerializer(many=True, read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    verification_count = serializers.IntegerField(source='verifications.count', read_only=True)

    class Meta:
        model = Report
        fields = [
            'id', 'user', 'location', 'location_name', 'issue_type',
            'description', 'status', 'media', 'created_at', 'verification_count',
            'verifies_report', 'moderator_notes', 'action_taken_notes'
        ]

class ReportCreateSerializer(serializers.ModelSerializer):
    location = serializers.UUIDField(write_only=True)
    user_latitude = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True)
    user_longitude = serializers.DecimalField(max_digits=10, decimal_places=6, write_only=True)
    media_files = serializers.ListField(
        child=serializers.FileField(allow_empty_file=False), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Report
        fields = ['location', 'issue_type', 'description', 'user_latitude', 'user_longitude', 'media_files']
    
    def validate(self, data):
        location_id = data.get('location')
        try:
            location_obj = Location.objects.get(id=location_id)
        except Location.DoesNotExist:
            raise serializers.ValidationError({"location": "Location with this ID not found."})
        
        if not location_obj.is_active:
            raise serializers.ValidationError({"location": "This location is currently inactive and cannot receive new reports."})

        if not is_user_within_geofence(data['user_latitude'], data['user_longitude'], location_obj.latitude, location_obj.longitude):
            raise serializers.ValidationError("Geo-fence check failed. You are too far from the location to submit a report.")

        nearby_report = find_nearby_duplicate_report(location_obj, data['issue_type'])
        if nearby_report:
            raise serializers.ValidationError({"duplicate": f"A similar report (ID: {nearby_report.id}) was recently filed for this issue and is being processed."})

        self.context['location_obj'] = location_obj
        return data

    def create(self, validated_data):
        location = self.context['location_obj']
        media_files = validated_data.pop('media_files', [])
        
        validated_data.pop('user_latitude')
        validated_data.pop('user_longitude')

        report = Report.objects.create(
            user=self.context['request'].user,
            location=location,
            **validated_data
        )
        
        if media_files:
            media_to_create = [ReportMedia(report=report, file=file) for file in media_files]
            ReportMedia.objects.bulk_create(media_to_create)
            
        return report

class ReportVerificationSerializer(ReportCreateSerializer):
    def validate(self, data):
        data = super().validate(data)
        original_report = self.context.get('original_report')
        
        if not original_report:
            raise serializers.ValidationError("Original report context is missing.")

        if original_report.status != Report.ReportStatus.PENDING:
            raise serializers.ValidationError("This report cannot be verified as it is no longer pending.")
        
        if original_report.user == self.context['request'].user:
            raise serializers.ValidationError("You cannot verify your own report.")
            
        return data

    def create(self, validated_data):
        report = super().create(validated_data)
        report.verifies_report = self.context['original_report']
        report.save()
        return report

class ReportModerateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['status', 'moderator_notes', 'action_taken_notes']
        extra_kwargs = {
            'status': {'required': True},
            'moderator_notes': {'required': False},
            'action_taken_notes': {'required': False},
        }