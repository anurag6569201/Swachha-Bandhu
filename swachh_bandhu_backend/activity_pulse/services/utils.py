# activity_pulse/services/utils.py

from django.conf import settings

DEFAULT_CONFIG = {
    'SESSION_TIMEOUT_SECONDS': 1800,
    'GEOIP_DATABASE_PATH': None,
    'ANONYMIZE_IP': True,
    'API_PREFIXES': ['/api/'],
    'EXCLUDE_USER_AGENTS': [r'.*?bot.*?', r'.*?crawler.*?', r'.*?spider.*?',],
    'EXCLUDE_PATHS': [r'^/admin/.*'],
    'TRACK_SUPERUSERS': False,
    'TRACK_STAFF': False,
    'REPORTING_TIMEZONE': settings.TIME_ZONE,
}

def get_config():
    """Merges user settings with defaults."""
    user_config = getattr(settings, 'ACTIVITY_PULSE_SETTINGS', {})
    config = DEFAULT_CONFIG.copy()
    config.update(user_config)
    return config

def get_real_ip(request):
    """Gets the real IP address, considering proxies."""
    ip = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0].strip() or \
         request.META.get('REMOTE_ADDR')
    return ip

def anonymize_ip(ip_address):
    """Anonymizes an IP address by setting the last octet to 0."""
    if not ip_address:
        return None
    try:
        parts = ip_address.split('.')
        if len(parts) == 4: # IPv4
            return f"{'.'.join(parts[:3])}.0"
        # Basic IPv6 anonymization (can be improved)
        parts = ip_address.split(':')
        if len(parts) > 4:
             return f"{':'.join(parts[:4])}::"
    except Exception:
        return ip_address # Return original if something goes wrong
    return ip_address