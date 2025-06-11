# reports/services.py
from math import radians, sin, cos, sqrt, atan2
from django.conf import settings

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the distance between two points on Earth
    in meters using the Haversine formula.
    """
    R = 6371000  # Radius of Earth in meters

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c
    return distance

def is_user_within_geofence(user_lat, user_lon, location_lat, location_lon):
    """
    Check if a user is within the allowed reporting distance of a location.
    """
    distance = haversine_distance(user_lat, user_lon, location_lat, location_lon)
    
    # Get the threshold from settings, with a sensible default.
    max_distance_meters = getattr(settings, 'MAX_REPORTING_DISTANCE_METERS', 50)
    
    return distance <= max_distance_meters