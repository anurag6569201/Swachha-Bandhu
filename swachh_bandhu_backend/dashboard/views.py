from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, F, ExpressionWrapper, fields, Sum, When, Case
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from reports.models import Report
from users.models import User
from locations.models import Location
from core.permissions import IsMunicipalAdmin
from .serializers import (
    DashboardStatsSerializer, ReportHeatmapSerializer,
    TimeSeriesDataPointSerializer, IssueTypeBreakdownSerializer,
    TopContributorSerializer
)

class MunicipalDashboardAPIView(APIView):
    permission_classes = [IsMunicipalAdmin]

    def get(self, request, *args, **kwargs):
        municipality = request.user.municipality
        if not municipality:
            return Response({"error": "User not associated with a municipality."}, status=400)
        
        reports_qs = Report.objects.filter(location__municipality=municipality)
        
        # --- 1. Key Performance Indicators (KPIs) ---
        report_counts = reports_qs.aggregate(
            total_reports=Count('id'),
            pending_reports=Count('id', filter=F('status') == 'PENDING'),
            verified_reports=Count('id', filter=F('status') == 'VERIFIED'),
            actioned_reports=Count('id', filter=F('status') == 'ACTIONED'),
            rejected_reports=Count('id', filter=F('status') == 'REJECTED')
        )

        thirty_days_ago = timezone.now() - timedelta(days=30)
        active_citizens = User.objects.filter(
            role=User.UserRole.CITIZEN,
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
        stats_serializer = DashboardStatsSerializer(data=stats_data)
        stats_serializer.is_valid(raise_exception=True)

        # --- 2. Geospatial Hotspot Data (Heatmap) ---
        heatmap_qs = reports_qs.values('location__point').annotate(intensity=Count('id'))
        heatmap_data = [{'latitude': p['location__point'].y, 'longitude': p['location__point'].x, 'intensity': p['intensity']} for p in heatmap_qs if p['location__point']]
        heatmap_serializer = ReportHeatmapSerializer(data=heatmap_data, many=True)
        heatmap_serializer.is_valid(raise_exception=True)
        
        # --- 3. Time Series Data for Report Trends ---
        trends_qs = reports_qs.filter(created_at__gte=thirty_days_ago).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(count=Count('id')).order_by('date')
        trends_serializer = TimeSeriesDataPointSerializer(trends_qs, many=True)

        # --- 4. Breakdown by Issue Type ---
        total_reports_for_percentage = report_counts['total_reports'] or 1
        breakdown_qs = reports_qs.values('issue_type').annotate(
            count=Count('id')
        ).annotate(
             percentage=ExpressionWrapper(F('count') * 100.0 / total_reports_for_percentage, output_field=fields.FloatField())
        ).order_by('-count')[:10]
        breakdown_serializer = IssueTypeBreakdownSerializer(breakdown_qs, many=True)

        # --- 5. Top Citizen Contributors ---
        top_contributors_qs = User.objects.filter(
            role=User.UserRole.CITIZEN,
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