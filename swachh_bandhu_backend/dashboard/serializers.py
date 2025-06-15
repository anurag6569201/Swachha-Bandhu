# dashboard/serializers.py

from rest_framework import serializers

# --- SERIALIZERS FOR MUNICIPAL DASHBOARD ---

class KpiChangeSerializer(serializers.Serializer):
    """Serializer for a value and its change from the previous period."""
    current = serializers.FloatField()
    previous = serializers.FloatField()
    change_percentage = serializers.FloatField(allow_null=True)

class MunicipalDashboardKPISerializer(serializers.Serializer):
    total_reports = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    verified_reports = serializers.IntegerField()
    actioned_reports = serializers.IntegerField()
    rejected_reports = serializers.IntegerField()
    total_active_citizens = serializers.IntegerField()
    total_locations = serializers.IntegerField()
    average_resolution_time_hours = serializers.FloatField(allow_null=True)
    reports_in_last_30_days = serializers.SerializerMethodField()

    def get_reports_in_last_30_days(self, obj):
        # This wraps the change data in a nested object for clarity in the API response
        return KpiChangeSerializer(instance=obj['reports_in_last_30_days']).data

class ReportHeatmapSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    intensity = serializers.IntegerField()

class TimeSeriesDataPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()

class IssueCategoryBreakdownSerializer(serializers.Serializer):
    # Renamed from IssueType for clarity and consistency
    category_name = serializers.CharField(source='issue_category__name')
    count = serializers.IntegerField()
    percentage = serializers.FloatField()

class SeverityBreakdownSerializer(serializers.Serializer):
    """ NEW: Serializer for report severity breakdown. """
    severity = serializers.CharField(source='get_severity_display')
    count = serializers.IntegerField()
    percentage = serializers.FloatField()

class TopContributorSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    total_points = serializers.IntegerField()
    reports_filed = serializers.IntegerField()


# --- SERIALIZERS FOR CITIZEN DASHBOARD ---

class CitizenDashboardStatsSerializer(serializers.Serializer):
    total_points = serializers.IntegerField()
    rank = serializers.IntegerField(allow_null=True)
    reports_filed = serializers.IntegerField()
    reports_verified = serializers.IntegerField()
    reports_actioned = serializers.IntegerField()
    reports_pending = serializers.IntegerField()

class RecentActivitySerializer(serializers.Serializer):
    activity_type = serializers.CharField()
    details = serializers.CharField()
    points = serializers.IntegerField()
    timestamp = serializers.DateTimeField()
    report_id = serializers.IntegerField(allow_null=True)
    badge_name = serializers.CharField(allow_null=True)
    badge_icon_url = serializers.URLField(allow_null=True)

class NextBadgeProgressSerializer(serializers.Serializer):
    """ NEW: Serializer for showing progress towards the next badge. """
    name = serializers.CharField(source='badge.name')
    description = serializers.CharField(source='badge.description')
    icon_url = serializers.SerializerMethodField()
    
    current_points = serializers.IntegerField()
    required_points = serializers.IntegerField(source='badge.required_points')
    
    current_reports = serializers.IntegerField()
    required_reports = serializers.IntegerField(source='badge.required_reports')
    
    current_verifications = serializers.IntegerField()
    required_verifications = serializers.IntegerField(source='badge.required_verifications')
    
    overall_progress_percentage = serializers.FloatField()

    def get_icon_url(self, obj):
        request = self.context.get('request')
        badge_icon = obj['badge'].icon
        if request and badge_icon:
            return request.build_absolute_uri(badge_icon.url)
        return None