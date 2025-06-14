from math import radians, sin, cos, sqrt, atan2
from django.conf import settings
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.utils import timezone
from datetime import timedelta
from .models import Report

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Radius of Earth in meters
    lat1_rad, lon1_rad, lat2_rad, lon2_rad = map(radians, [lat1, lon1, lat2, lon2])

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

def is_user_within_geofence(user_lat, user_lon, location_lat, location_lon):
    distance = haversine_distance(user_lat, user_lon, location_lat, location_lon)
    max_distance_meters = getattr(settings, 'MAX_VERIFICATION_DISTANCE_METERS', 50)
    return distance <= max_distance_meters

def find_nearby_duplicate_report(location, issue_type):
    min_distance = getattr(settings, 'MIN_DISTANCE_BETWEEN_REPORTS_METERS', 10)
    time_threshold = timezone.now() - timedelta(days=7)
    
    target_point = location.point
    
    nearby_reports = Report.objects.annotate(
        distance=Distance('location__point', target_point)
    ).filter(
        distance__lte=min_distance,
        issue_type=issue_type,
        created_at__gte=time_threshold,
        status__in=[Report.ReportStatus.PENDING, Report.ReportStatus.VERIFIED, Report.ReportStatus.ACTIONED]
    ).order_by('created_at')
    
    return nearby_reports.first()