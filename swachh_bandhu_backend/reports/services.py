from django.utils import timezone
from datetime import timedelta
from django.contrib.gis.db.models.functions import Distance
from decimal import Decimal
from geopy.distance import geodesic
from .models import Report

def is_user_within_geofence(user_lat: Decimal, user_lng: Decimal, location_lat: float, location_lng: float, radius_meters: int) -> bool:
    if not all([user_lat is not None, user_lng is not None, location_lat is not None, location_lng is not None, radius_meters is not None]):
        return False
    user_coords = (user_lat, user_lng)
    location_coords = (location_lat, location_lng)
    distance_in_meters = geodesic(user_coords, location_coords).meters
    return distance_in_meters <= radius_meters

def find_nearby_duplicate_report(location, issue_category):
    time_threshold = timezone.now() - timedelta(days=7)
    
    nearby_reports = Report.objects.filter(
        location=location,
        issue_category=issue_category,
        created_at__gte=time_threshold,
        status__in=[Report.ReportStatus.PENDING, Report.ReportStatus.VERIFIED, Report.ReportStatus.IN_PROGRESS]
    ).order_by('created_at')
    
    return nearby_reports.first()