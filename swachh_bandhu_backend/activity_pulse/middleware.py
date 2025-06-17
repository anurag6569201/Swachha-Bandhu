# activity_pulse/middleware.py

import re
import logging
from datetime import timedelta
from urllib.parse import urlparse

from django.utils import timezone
from django.conf import settings
from .services.session_manager import get_or_create_session
from .services.utils import get_config, get_real_ip
from .models import PageView

logger = logging.getLogger(__name__)

class ActivityPulseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.config = get_config()

    def _should_track(self, request):
        """Determine if the current request should be tracked."""
        user = getattr(request, 'user', None)

        if not self.config['TRACK_SUPERUSERS'] and user and user.is_authenticated and user.is_superuser:
            return False
        
        if not self.config['TRACK_STAFF'] and user and user.is_authenticated and user.is_staff:
            return False

        user_agent_str = request.META.get('HTTP_USER_AGENT', '')
        if not user_agent_str:
            return False # Ignore requests with no user agent
            
        for pattern in self.config['EXCLUDE_USER_AGENTS']:
            if re.search(pattern, user_agent_str, re.I):
                return False

        for pattern in self.config['EXCLUDE_PATHS']:
            if re.match(pattern, request.path):
                return False
        
        # Check for static files which Django might serve in DEBUG mode
        if any(request.path.startswith(prefix) for prefix in [settings.STATIC_URL, settings.MEDIA_URL]):
             return False

        return True

    def __call__(self, request):
        if not self._should_track(request):
            return self.get_response(request)

        # Use a try/except block to ensure analytics never crashes a request
        try:
            session = get_or_create_session(request)
            request.activity_pulse_session_id = str(session.id)
        except Exception as e:
            logger.error(f"[Activity Pulse] Error processing session: {e}", exc_info=True)
            return self.get_response(request)

        response = self.get_response(request)

        try:
            # Don't log redirects, server errors, or API calls as page views
            is_api_call = any(request.path.startswith(prefix) for prefix in self.config['API_PREFIXES'])
            is_html = 'text/html' in response.get('Content-Type', '')
            
            if 200 <= response.status_code < 300 and not is_api_call and is_html:
                PageView.objects.create(session=session, path=request.path)

            # Update last_seen on the session for every valid interaction
            timeout_delta = timedelta(seconds=self.config['SESSION_TIMEOUT_SECONDS'])
            if timezone.now() < session.last_seen + timeout_delta:
                session.last_seen = timezone.now()
                session.save(update_fields=['last_seen'])
        
        except Exception as e:
            logger.error(f"[Activity Pulse] Error logging page view: {e}", exc_info=True)

        return response