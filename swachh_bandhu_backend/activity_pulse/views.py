# activity_pulse/views.py

from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_POST
from django.core.serializers.json import DjangoJSONEncoder
import json

from .services import data_aggregator
from .models import PageView, Event

@staff_member_required
def dashboard_view(request):
    """Renders the main analytics dashboard page."""
    context = {"title": "Activity Pulse Dashboard"}
    return render(request, 'activity_pulse/dashboard.html', context)

@staff_member_required
def analytics_api(request):
    """
    Provides aggregated JSON data for the dashboard based on a time period.
    """
    period = request.GET.get('period', '24h')
    data = data_aggregator.get_dashboard_data(period)
    return JsonResponse(data, encoder=DjangoJSONEncoder, safe=False)

@staff_member_required
def realtime_api(request):
    """Provides real-time visitor data."""
    data = data_aggregator.get_realtime_data()
    return JsonResponse(data, safe=False)
    
@require_POST
def event_api(request):
    """
    Client-side API endpoint for tracking custom events and page view heartbeats.
    """
    try:
        data = json.loads(request.body)
        session_id = request.activity_pulse_session_id
    except (json.JSONDecodeError, AttributeError):
        return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
        
    event_type = data.get('type')
    
    if event_type == 'heartbeat':
        page_view_id = data.get('pageViewId')
        seconds = data.get('seconds')
        if page_view_id and isinstance(seconds, int):
            try:
                # Use F() expression to prevent race conditions
                from django.db.models import F
                PageView.objects.filter(pk=page_view_id, session_id=session_id).update(
                    time_on_page_seconds=F('time_on_page_seconds') + seconds
                )
            except PageView.DoesNotExist:
                pass # Ignore if page view is not found
    
    elif event_type == 'event':
        name = data.get('name')
        properties = data.get('properties')
        if name:
            Event.objects.create(
                session_id=session_id,
                name=name,
                properties=properties if isinstance(properties, dict) else None
            )

    return JsonResponse({'status': 'ok'})