from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import models
from django.db.models import Count, Avg, F, Q, Window, ExpressionWrapper, fields
from django.db.models.functions import TruncDate, Rank
from django.utils import timezone
from datetime import timedelta
from reports.models import Report, IssueCategory
from users.models import User
from locations.models import Location
from gamification.models import PointLog, UserBadge, Badge
from core.permissions import IsMunicipalAdmin, IsCitizen
from .serializers import (
    MunicipalDashboardKPISerializer, ReportHeatmapSerializer, TimeSeriesDataPointSerializer,
    IssueCategoryBreakdownSerializer, SeverityBreakdownSerializer, TopContributorSerializer,
    CitizenDashboardStatsSerializer, RecentActivitySerializer, NextBadgeProgressSerializer
)

def get_percentage_change(current, previous):
    """Helper function to calculate safe percentage change."""
    if previous is None or current is None or previous == 0:
        return None
    return round(((current - previous) / previous) * 100, 2)

class MunicipalDashboardAPIView(APIView):
    """
    An advanced, performance-optimized dashboard for Municipal Admins.
    Provides aggregated KPIs, trends, and breakdowns with fewer database queries.
    """
    permission_classes = [IsMunicipalAdmin]

    def get(self, request, *args, **kwargs):
        municipality = request.user.municipality
        if not municipality:
            return Response({"error": "User is not associated with a municipality."}, status=400)

        # Base QuerySets
        reports_qs = Report.objects.filter(location__municipality=municipality)
        
        # Date ranges for trend analysis
        thirty_days_ago = timezone.now() - timedelta(days=30)

        # --- Data Fetching via Helper Methods ---
        kpi_data = self._get_kpi_stats(reports_qs, municipality, thirty_days_ago)
        heatmap_data = self._get_heatmap_data(reports_qs)
        report_trends_data = self._get_report_trends(reports_qs, thirty_days_ago)
        issue_breakdown_data = self._get_issue_category_breakdown(reports_qs, kpi_data['total_reports'])
        severity_breakdown_data = self._get_severity_breakdown(reports_qs, kpi_data['total_reports'])
        top_contributors_data = self._get_top_contributors(municipality)

        # --- Serialization ---
        kpi_serializer = MunicipalDashboardKPISerializer(instance=kpi_data)
        heatmap_serializer = ReportHeatmapSerializer(instance=heatmap_data, many=True)
        trends_serializer = TimeSeriesDataPointSerializer(instance=report_trends_data, many=True)
        issue_breakdown_serializer = IssueCategoryBreakdownSerializer(instance=issue_breakdown_data, many=True)
        severity_serializer = SeverityBreakdownSerializer(instance=severity_breakdown_data, many=True)
        contributors_serializer = TopContributorSerializer(instance=top_contributors_data, many=True)
        
        return Response({
            "kpis": kpi_serializer.data,
            "heatmap": heatmap_serializer.data,
            "report_trends_30_days": trends_serializer.data,
            "issue_category_breakdown": issue_breakdown_serializer.data,
            "severity_breakdown": severity_serializer.data, # NEW WIDGET
            "top_contributors": contributors_serializer.data
        })

    def _get_kpi_stats(self, reports_qs, municipality, thirty_days_ago):
        """Calculates all key performance indicators in a single efficient query."""
        sixty_days_ago = timezone.now() - timedelta(days=60)
        
        # Annotate once for resolution time calculation
        reports_with_duration = reports_qs.annotate(
            resolution_duration=ExpressionWrapper(
                F('updated_at') - F('created_at'), output_field=fields.DurationField()
            )
        )

        # Single aggregation call for most stats
        kpis = reports_with_duration.aggregate(
            total_reports=Count('id'),
            pending_reports=Count('id', filter=Q(status=Report.ReportStatus.PENDING)),
            verified_reports=Count('id', filter=Q(status=Report.ReportStatus.VERIFIED)),
            actioned_reports=Count('id', filter=Q(status=Report.ReportStatus.ACTIONED)),
            rejected_reports=Count('id', filter=Q(status=Report.ReportStatus.REJECTED)),
            
            # For trend calculation
            reports_last_30_days=Count('id', filter=Q(created_at__gte=thirty_days_ago)),
            reports_prev_30_days=Count('id', filter=Q(created_at__lt=thirty_days_ago, created_at__gte=sixty_days_ago)),

            # Average resolution time for reports actioned in the last 30 days
            avg_resolution=Avg('resolution_duration', filter=Q(status=Report.ReportStatus.ACTIONED, updated_at__gte=thirty_days_ago))
        )
        
        # Calculate resolution time in hours
        avg_res_time = kpis['avg_resolution']
        kpis['average_resolution_time_hours'] = round(avg_res_time.total_seconds() / 3600, 2) if avg_res_time else None

        # Add trend data for reports
        kpis['reports_in_last_30_days'] = {
            "current": kpis['reports_last_30_days'],
            "previous": kpis['reports_prev_30_days'],
            "change_percentage": get_percentage_change(kpis['reports_last_30_days'], kpis['reports_prev_30_days'])
        }

        # Fetch stats from other models (these require separate queries)
        kpis['total_active_citizens'] = User.objects.filter(
            role='CITIZEN', reports__location__municipality=municipality, reports__created_at__gte=thirty_days_ago
        ).distinct().count()
        kpis['total_locations'] = Location.objects.filter(municipality=municipality, is_active=True).count()
        
        return kpis

    def _get_heatmap_data(self, reports_qs):
        """Generates data for the report intensity heatmap."""
        heatmap_qs = reports_qs.values('location__point').annotate(intensity=Count('id')).order_by()
        return [
            {'latitude': p['location__point'].y, 'longitude': p['location__point'].x, 'intensity': p['intensity']}
            for p in heatmap_qs if p['location__point']
        ]

    def _get_report_trends(self, reports_qs, thirty_days_ago):
        """Generates time-series data for report counts."""
        return reports_qs.filter(created_at__gte=thirty_days_ago).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(count=Count('id')).order_by('date')
    
    def _get_issue_category_breakdown(self, reports_qs, total_reports):
        """Generates a breakdown of reports by issue category."""
        if total_reports == 0: return []
        return reports_qs.values('issue_category__name').annotate(
            count=Count('id'),
            percentage=ExpressionWrapper(Count('id') * 100.0 / total_reports, output_field=fields.FloatField())
        ).order_by('-count')[:5]

    def _get_severity_breakdown(self, reports_qs, total_reports):
        """NEW: Generates a breakdown of reports by severity level."""
        if total_reports == 0: return []
        
        # Use a subquery to get the display name for the choice field
        severity_display_subquery = next(
            (name for val, name in Report.SeverityLevel.choices if val == F('severity')), None
        )

        return reports_qs.annotate(
            get_severity_display=models.Value(severity_display_subquery, output_field=models.CharField())
        ).values('severity', 'get_severity_display').annotate(
            count=Count('id'),
            percentage=ExpressionWrapper(Count('id') * 100.0 / total_reports, output_field=fields.FloatField())
        ).order_by('-count')


    def _get_top_contributors(self, municipality):
        """Gets the top 5 contributors based on points."""
        return User.objects.filter(
            role='CITIZEN', municipality=municipality
        ).annotate(
            reports_filed=Count('reports', filter=Q(reports__location__municipality=municipality))
        ).order_by('-total_points')[:5]


class CitizenDashboardAPIView(APIView):
    """
    An advanced dashboard for Citizens, showing personal stats, activity,
    and progress towards gamification goals.
    """
    permission_classes = [IsCitizen]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Fetch core stats and rank once
        kpi_data = self._get_citizen_kpis(user)
        
        # Fetch other dashboard components
        activity_data = self._get_recent_activity(user, request)
        next_badge_data = self._get_next_badge_progress(user, kpi_data)

        # --- Serialization ---
        kpi_serializer = CitizenDashboardStatsSerializer(instance=kpi_data)
        activity_serializer = RecentActivitySerializer(instance=activity_data, many=True)
        # Use a different serializer for the new badge progress data
        progress_serializer = NextBadgeProgressSerializer(instance=next_badge_data, context={'request': request}) if next_badge_data else None

        return Response({
            "kpis": kpi_serializer.data,
            "recent_activity": activity_serializer.data,
            "next_badge_progress": progress_serializer.data if progress_serializer else None # NEW WIDGET
        })

    def _get_citizen_kpis(self, user):
        """Fetches all personal KPIs for the citizen."""
        user_reports = Report.objects.filter(user=user)
        
        # Get user rank
        try:
            user_with_rank = User.objects.filter(
                role='CITIZEN', is_active=True
            ).annotate(
                rank=Window(expression=Rank(), order_by=F('total_points').desc())
            ).get(pk=user.pk)
            rank = user_with_rank.rank
        except User.DoesNotExist:
            rank = None

        return {
            "total_points": user.total_points,
            "rank": rank,
            "reports_filed": user_reports.filter(verifies_report__isnull=True).count(),
            "reports_verified": user_reports.filter(verifies_report__isnull=False).count(),
            "reports_actioned": user_reports.filter(status=Report.ReportStatus.ACTIONED).count(),
            "reports_pending": user_reports.filter(status__in=[Report.ReportStatus.PENDING, Report.ReportStatus.VERIFIED]).count()
        }

    def _get_recent_activity(self, user, request):
        """Compiles a unified, sorted activity feed from points and badges."""
        recent_point_logs = PointLog.objects.filter(user=user).select_related('content_type')[:10]
        recent_badges = UserBadge.objects.filter(user=user).select_related('badge')[:5]

        activity_feed = []
        for log in recent_point_logs:
            activity_feed.append({
                "activity_type": "points", "details": log.get_reason_display(),
                "points": log.points, "timestamp": log.timestamp,
                "report_id": log.source_object.id if hasattr(log.source_object, 'id') else None,
                "badge_name": None, "badge_icon_url": None,
            })

        for user_badge in recent_badges:
            activity_feed.append({
                "activity_type": "badge", "details": f"Earned '{user_badge.badge.name}' badge",
                "points": 0, "timestamp": user_badge.earned_at,
                "report_id": None, "badge_name": user_badge.badge.name,
                "badge_icon_url": request.build_absolute_uri(user_badge.badge.icon.url) if user_badge.badge.icon else None
            })

        # Sort the combined list in Python
        activity_feed.sort(key=lambda x: x['timestamp'], reverse=True)
        return activity_feed[:15]

    def _get_next_badge_progress(self, user, kpi_data):
        """Calculates progress towards the most attainable un-earned badge."""
        earned_badge_ids = UserBadge.objects.filter(user=user).values_list('badge_id', flat=True)
        unearned_badges = Badge.objects.exclude(id__in=earned_badge_ids)

        best_badge_progress = None
        highest_progress_score = -1

        for badge in unearned_badges:
            progress_metrics = []
            
            # Points progress
            if badge.required_points > 0:
                progress_metrics.append(min(1.0, kpi_data['total_points'] / badge.required_points))
            
            # Reports progress
            if badge.required_reports > 0:
                progress_metrics.append(min(1.0, kpi_data['reports_filed'] / badge.required_reports))
                
            # Verifications progress
            if badge.required_verifications > 0:
                progress_metrics.append(min(1.0, kpi_data['reports_verified'] / badge.required_verifications))

            if not progress_metrics:
                continue

            # Calculate an overall progress score to find the 'closest' badge
            overall_progress = sum(progress_metrics) / len(progress_metrics)
            
            if overall_progress > highest_progress_score:
                highest_progress_score = overall_progress
                best_badge_progress = {
                    "badge": badge,
                    "current_points": kpi_data['total_points'],
                    "current_reports": kpi_data['reports_filed'],
                    "current_verifications": kpi_data['reports_verified'],
                    "overall_progress_percentage": round(overall_progress * 100, 2)
                }
                
        return best_badge_progress