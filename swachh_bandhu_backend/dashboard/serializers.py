from rest_framework import serializers

# --- SERIALIZERS FOR MUNICIPAL DASHBOARD (Existing) ---

class DashboardStatsSerializer(serializers.Serializer):
    total_reports = serializers.IntegerField()
    pending_reports = serializers.IntegerField()
    verified_reports = serializers.IntegerField()
    actioned_reports = serializers.IntegerField()
    rejected_reports = serializers.IntegerField()
    total_active_citizens = serializers.IntegerField()
    average_resolution_time_hours = serializers.FloatField(allow_null=True)
    total_locations = serializers.IntegerField()

class ReportHeatmapSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    intensity = serializers.IntegerField()

class TimeSeriesDataPointSerializer(serializers.Serializer):
    date = serializers.DateField()
    count = serializers.IntegerField()

class IssueTypeBreakdownSerializer(serializers.Serializer):
    issue_type = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()

class TopContributorSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    total_points = serializers.IntegerField()
    reports_filed = serializers.IntegerField()

# --- NEW SERIALIZERS FOR CITIZEN DASHBOARD ---

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