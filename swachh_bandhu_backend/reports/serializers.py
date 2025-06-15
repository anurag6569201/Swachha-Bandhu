from rest_framework import serializers
from .models import Report, ReportMedia, ReportStatusHistory, IssueCategory
from locations.models import Location
from .services import is_user_within_geofence, find_nearby_duplicate_report
from users.serializers import UserSerializer

class IssueCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueCategory
        fields = ['id', 'name', 'description']

class ReportMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportMedia
        fields = ['id', 'file', 'uploaded_at']

class ReportStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_email = serializers.EmailField(source='changed_by.email', read_only=True, allow_null=True)
    
    class Meta:
        model = ReportStatusHistory
        fields = ['status', 'timestamp', 'notes', 'changed_by_email']

class ReportReadSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    media = ReportMediaSerializer(many=True, read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    issue_category = IssueCategorySerializer(read_only=True)
    verification_count = serializers.IntegerField(source='verifications.count', read_only=True)
    
    class Meta:
        model = Report
        fields = [
            'id', 'user', 'location', 'location_name', 'issue_category',
            'description', 'status', 'severity', 'media', 'created_at', 'updated_at', 'verification_count',
            'verifies_report'
        ]

class ReportDetailSerializer(ReportReadSerializer):
    status_history = ReportStatusHistorySerializer(many=True, read_only=True)
    
    class Meta(ReportReadSerializer.Meta):
        fields = ReportReadSerializer.Meta.fields + ['moderator_notes', 'action_taken_notes', 'status_history']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context['request'].user
        if not (user.is_staff or (user.municipality and user.municipality == instance.location.municipality)):
            representation.pop('moderator_notes', None)
            representation.pop('action_taken_notes', None)
        return representation

class ReportCreateSerializer(serializers.ModelSerializer):
    location = serializers.UUIDField(write_only=True)
    user_latitude = serializers.DecimalField(max_digits=9, decimal_places=6, write_only=True)
    user_longitude = serializers.DecimalField(max_digits=10, decimal_places=6, write_only=True)
    issue_category = serializers.PrimaryKeyRelatedField(
        queryset=IssueCategory.objects.filter(is_active=True),
        pk_field=serializers.UUIDField()
    )

    class Meta:
        model = Report
        fields = [
            'location', 'issue_category', 'description', 'severity',
            'user_latitude', 'user_longitude'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        if request and hasattr(request.user, 'municipality'):
            location_id = self.initial_data.get('location')
            if location_id:
                try:
                    location_obj = Location.objects.get(id=location_id)
                    self.fields['issue_category'].queryset = IssueCategory.objects.filter(
                        municipality=location_obj.municipality, is_active=True
                    )
                except Location.DoesNotExist:
                    pass

    def validate(self, data):
        location_id = data.get('location')
        try:
            location_obj = Location.objects.get(id=location_id)
        except Location.DoesNotExist:
            raise serializers.ValidationError({"location": "Location not found."})
        
        if not location_obj.is_active:
            raise serializers.ValidationError({"location": "This location is inactive."})
        
        radius = location_obj.geofence_radius
        if not is_user_within_geofence(data['user_latitude'], data['user_longitude'], location_obj.latitude, location_obj.longitude, radius):
            raise serializers.ValidationError(
                {"detail": f"Geo-fence check failed. You must be within {radius} meters."}
            )

        nearby_report = find_nearby_duplicate_report(location_obj, data['issue_category'])
        if nearby_report:
            raise serializers.ValidationError({"duplicate": f"A similar report (ID: {nearby_report.id}) was recently filed."})

        data['location'] = location_obj
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        media_files = request.FILES.getlist('media_files', [])
        
        validated_data.pop('user_latitude', None)
        validated_data.pop('user_longitude', None)
        
        report = Report.objects.create(
            user=request.user,
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
            raise serializers.ValidationError("Original report context missing.")
        if original_report.status != Report.ReportStatus.PENDING:
            raise serializers.ValidationError("This report is no longer pending verification.")
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
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        old_status = instance.status
        new_status = validated_data.get('status', old_status)

        report = super().update(instance, validated_data)

        if old_status != new_status:
             ReportStatusHistory.objects.create(
                report=instance,
                status=new_status,
                changed_by=user,
                notes=validated_data.get('moderator_notes', "Status updated by moderator.")
            )
        return report