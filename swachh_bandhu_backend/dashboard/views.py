from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, F, ExpressionWrapper, fields, Q
from django.db.models.functions import TruncDate, Rank
from django.db.models import Window
from django.utils import timezone
from datetime import timedelta
from itertools import chain
from reports.models import Report
from users.models import User
from locations.models import Location
from gamification.models import PointLog, UserBadge
from core.permissions import IsMunicipalAdmin, IsCitizen
from .serializers import (
    DashboardStatsSerializer, ReportHeatmapSerializer,
    TimeSeriesDataPointSerializer, IssueTypeBreakdownSerializer,
    TopContributorSerializer, CitizenDashboardStatsSerializer,
    RecentActivitySerializer
)

# --- MUNICIPAL DASHBOARD VIEW (Corrected for Best Practices) ---

class MunicipalDashboardAPIView(APIView):
    permission_classes = [IsMunicipalAdmin]

    def get(self, request, *args, **kwargs):
        municipality = request.user.municipality
        if not municipality:
            return Response({"error": "User not associated with a municipality."}, status=400)
        
        reports_qs = Report.objects.filter(location__municipality=municipality)
        
        report_counts = reports_qs.aggregate(
            total_reports=Count('id'),
            pending_reports=Count('id', filter=Q(status=Report.ReportStatus.PENDING)),
            verified_reports=Count('id', filter=Q(status=Report.ReportStatus.VERIFIED)),
            actioned_reports=Count('id', filter=Q(status=Report.ReportStatus.ACTIONED)),
            rejected_reports=Count('id', filter=Q(status=Report.ReportStatus.REJECTED))
        )

        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_citizens = User.objects.filter(
            role='CITIZEN',
            reports__location__municipality=municipality,
            reports__created_at__gte=thirty_days_ago
        ).distinct().count()

        resolution_time_agg = reports_qs.filter(status=Report.ReportStatus.ACTIONED, updated_at__isnull=False).annotate(
            resolution_duration=ExpressionWrapper(F('updated_at') - F('created_at'), output_field=fields.DurationField())
        ).aggregate(avg_time=Avg('resolution_duration'))
        avg_res_time_hours = resolution_time_agg['avg_time'].total_seconds() / 3600 if resolution_time_agg['avg_time'] else None
        
        total_locations = Location.objects.filter(municipality=municipality).count()

        stats_data = {
            **report_counts,
            "total_active_citizens": active_citizens,
            "average_resolution_time_hours": round(avg_res_time_hours, 2) if avg_res_time_hours else None,
            "total_locations": total_locations,
        }
        # FIX: Instantiate serializer for output (serialization). No .is_valid() needed.
        stats_serializer = DashboardStatsSerializer(instance=stats_data)

        heatmap_qs = reports_qs.values('location__point').annotate(intensity=Count('id'))
        heatmap_data = [{'latitude': p['location__point'].y, 'longitude': p['location__point'].x, 'intensity': p['intensity']} for p in heatmap_qs if p['location__point']]
        # FIX: Instantiate serializer for output (serialization). No .is_valid() needed.
        heatmap_serializer = ReportHeatmapSerializer(instance=heatmap_data, many=True)
        
        trends_qs = reports_qs.filter(created_at__gte=thirty_days_ago).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(count=Count('id')).order_by('date')
        trends_serializer = TimeSeriesDataPointSerializer(trends_qs, many=True)

        total_reports_for_percentage = report_counts['total_reports'] or 1
        breakdown_qs = reports_qs.values('issue_type').annotate(
            count=Count('id')
        ).annotate(
             percentage=ExpressionWrapper(F('count') * 100.0 / total_reports_for_percentage, output_field=fields.FloatField())
        ).order_by('-count')[:10]
        breakdown_serializer = IssueTypeBreakdownSerializer(breakdown_qs, many=True)

        top_contributors_qs = User.objects.filter(
            role='CITIZEN',
            reports__location__municipality=municipality
        ).annotate(
            reports_filed=Count('reports')
        ).order_by('-total_points')[:5]
        top_contributors_serializer = TopContributorSerializer(top_contributors_qs, many=True)

        return Response({
            "kpi": stats_serializer.data,
            "heatmap_data": heatmap_serializer.data,
            "report_trends": trends_serializer.data,
            "issue_type_breakdown": breakdown_serializer.data,
            "top_contributors": top_contributors_serializer.data
        })

# --- CITIZEN DASHBOARD VIEW (Corrected) ---

class CitizenDashboardAPIView(APIView):
    permission_classes = [IsCitizen]

    def get(self, request, *args, **kwargs):
        user = request.user

        # --- 1. User's Personal KPI Stats ---
        user_reports = Report.objects.filter(user=user)
        stats_data = {
            "total_points": user.total_points,
            "rank": self.get_user_rank(user),
            "reports_filed": user_reports.filter(verifies_report__isnull=True).count(),
            "reports_verified": user_reports.filter(verifies_report__isnull=False).count(),
            "reports_actioned": Report.objects.filter(user=user, status=Report.ReportStatus.ACTIONED).count(),
            "reports_pending": user_reports.filter(status__in=[Report.ReportStatus.PENDING, Report.ReportStatus.VERIFIED]).count()
        }
        # FIX: Instantiate serializer for output (serialization). No .is_valid() needed.
        stats_serializer = CitizenDashboardStatsSerializer(instance=stats_data)
        
        # --- 2. User's Recent Activity Feed ---
        recent_point_logs = PointLog.objects.filter(user=user).select_related('content_type')[:10]
        recent_badges = UserBadge.objects.filter(user=user).select_related('badge')[:5]

        activity_feed = []
        for log in recent_point_logs:
            report = log.source_object
            activity_feed.append({
                "activity_type": "points",
                "details": log.get_reason_display(),
                "points": log.points,
                "timestamp": log.timestamp,
                "report_id": report.id if report else None,
                "badge_name": None,
                "badge_icon_url": None,
            })

        for user_badge in recent_badges:
            activity_feed.append({
                "activity_type": "badge",
                "details": f"Earned '{user_badge.badge.name}' badge",
                "points": 0,
                "timestamp": user_badge.earned_at,
                "report_id": None,
                "badge_name": user_badge.badge.name,
                "badge_icon_url": request.build_absolute_uri(user_badge.badge.icon.url) if user_badge.badge.icon else None
            })

        activity_feed.sort(key=lambda x: x['timestamp'], reverse=True)
        
        # FIX: Instantiate the serializer for serialization (output).
        activity_serializer = RecentActivitySerializer(activity_feed[:15], many=True) 
        # FIX: REMOVED the call to .is_valid(), which caused the crash. It is not needed for serialization.
        
        return Response({
            "kpi": stats_serializer.data,
            "recent_activity": activity_serializer.data
        })

    def get_user_rank(self, user):
        try:
            user_with_rank = User.objects.filter(
                role='CITIZEN'
            ).annotate(
                rank=Window(expression=Rank(), order_by=F('total_points').desc())
            ).get(pk=user.pk)
            return user_with_rank.rank
        except User.DoesNotExist:
            return None