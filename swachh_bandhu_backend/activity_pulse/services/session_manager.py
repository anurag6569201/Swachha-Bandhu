# activity_pulse/services/session_manager.py

import logging
from datetime import timedelta
from urllib.parse import urlparse

from django.utils import timezone
from django.db import transaction

from ..models import Session
from .utils import get_config, get_real_ip, anonymize_ip
from .user_agent_parser import parse_user_agent
from .geoip_parser import geolocate_ip

logger = logging.getLogger(__name__)

def get_or_create_session(request):
    """
    The core logic for session handling. It retrieves an existing session
    or creates a new one based on a session key and timeout rules.
    """
    config = get_config()
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key

    session_id = request.session.get('activity_pulse_session_id')
    timeout_delta = timedelta(seconds=config['SESSION_TIMEOUT_SECONDS'])
    
    session = None
    if session_id:
        try:
            session = Session.objects.get(pk=session_id)
            # Check if the session has expired
            if timezone.now() > session.last_seen + timeout_delta:
                session.ended_at = session.last_seen
                session.save(update_fields=['ended_at'])
                session = None # Force creation of a new session
        except Session.DoesNotExist:
            session = None # Stale session ID in cookie, create a new one

    if session is None:
        with transaction.atomic():
            session = _create_new_session(request, config)
            request.session['activity_pulse_session_id'] = str(session.id)
    
    return session

def _create_new_session(request, config):
    """Creates a new Session instance with all available data."""
    ip_address = get_real_ip(request)
    user_agent_str = request.META.get('HTTP_USER_AGENT', '')
    
    # Parse User Agent
    ua_data = parse_user_agent(user_agent_str)
    
    # Geolocate IP
    geo_data = geolocate_ip(ip_address, config)
    
    # Anonymize IP if configured
    if config['ANONYMIZE_IP']:
        ip_address = anonymize_ip(ip_address)
        
    # Handle Referrer
    referrer_url = request.META.get('HTTP_REFERER', '')
    referrer_domain = ''
    if referrer_url:
        try:
            parsed_uri = urlparse(referrer_url)
            # Don't classify internal navigation as a referrer
            if parsed_uri.netloc != request.get_host():
                referrer_domain = parsed_uri.netloc
            else:
                 referrer_url = '' # It's an internal referrer, so clear it
        except Exception:
             referrer_url = '' # Malformed referrer url

    # Parse UTM parameters
    utm_params = {
        key: request.GET.get(key, '')
        for key in ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    }

    session = Session.objects.create(
        user=request.user if request.user.is_authenticated else None,
        ip_address=ip_address,
        user_agent=user_agent_str,
        referrer_url=referrer_url,
        referrer_domain=referrer_domain,
        **ua_data,
        **geo_data,
        **utm_params
    )
    logger.info(f"Created new Activity Pulse session: {session.id}")
    return session