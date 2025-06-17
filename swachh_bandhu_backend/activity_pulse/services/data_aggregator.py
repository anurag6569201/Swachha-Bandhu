# activity_pulse/services/data_aggregator.py

from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Avg, F, Sum, Q
from django.db.models.functions import Trunc
from .utils import get_config
from ..models import Session, PageView, Goal

def get_date_range(period_str):
    """Returns a timezone-aware start and end datetime based on a string."""
    now = timezone.now()
    if period_str == '24h':
        start_date = now - timedelta(days=1)
    elif period_str == '7d':
        start_date = now - timedelta(days=7)
    elif period_str == '30d':
        start_date = now - timedelta(days=30)
    else: # Default to 24h
        start_date = now - timedelta(days=1)
    return start_date, now

def get_dashboard_data(period):
    """The main aggregator for the dashboard view."""
    start_date, end_date = get_date_range(period)
    sessions = Session.objects.filter(started_at__range=(start_date, end_date))
    
    # 1. Key Metrics
    key_metrics = get_key_metrics(sessions, start_date, end_date)
    
    # 2. Sessions Chart
    sessions_chart = get_sessions_chart(sessions, period, start_date, end_date)
    
    # 3. Top Pages
    top_pages = get_top_list(PageView, sessions, 'path')
    
    # 4. Top Referrers
    top_referrers = get_top_list(Session, sessions, 'referrer_domain', filter_empty=True)
    
    # 5. Top Countries
    top_countries = get_top_list(Session, sessions, 'country', filter_empty=True)
    
    # 6. Device Breakdown
    device_breakdown = get_breakdown(sessions, ['is_pc', 'is_tablet', 'is_mobile'])
    
    # 7. Goal Performance
    goal_performance = get_goal_performance(sessions)

    return {
        'key_metrics': key_metrics,
        'charts': {
            'sessions': sessions_chart
        },
        'tables': {
            'pages': top_pages,
            'referrers': top_referrers,
            'countries': top_countries,
            'devices': device_breakdown,
            'goals': goal_performance
        }
    }

def get_key_metrics(sessions, start_date, end_date):
    """Calculate the main KPIs."""
    session_count = sessions.count()
    if not session_count:
        return {'unique_visitors': 0, 'sessions': 0, 'bounce_rate': 0, 'avg_duration': '0s'}
        
    unique_visitors = sessions.values('ip_address', 'user_agent').distinct().count()
    
    # Bounce rate: sessions with only one page view
    bounced_sessions = sessions.annotate(pageview_count=Count('pageviews')).filter(pageview_count=1).count()
    bounce_rate = (bounced_sessions / session_count * 100) if session_count > 0 else 0
    
    # Average session duration
    avg_duration_delta = sessions.annotate(
        duration=F('last_seen') - F('started_at')
    ).aggregate(avg_duration=Avg('duration'))['avg_duration'] or timedelta()
    
    return {
        'unique_visitors': unique_visitors,
        'sessions': session_count,
        'bounce_rate': round(bounce_rate, 1),
        'avg_duration_seconds': avg_duration_delta.total_seconds(),
    }
    
def get_sessions_chart(sessions, period, start_date, end_date):
    """Generate data for the sessions over time chart."""
    if period == '24h':
        trunc_kind = 'hour'
        date_format = 'H:00'
    else:
        trunc_kind = 'day'
        date_format = 'b %d' # Abbreviated month and day

    chart_data = sessions.annotate(
        date=Trunc('started_at', trunc_kind, tzinfo=timezone.get_current_timezone())
    ).values('date').annotate(count=Count('id')).order_by('date')
    
    labels = [item['date'].strftime(date_format) for item in chart_data]
    data = [item['count'] for item in chart_data]
    return {'labels': labels, 'data': data}

def get_top_list(model, sessions_qs, field_name, limit=10, filter_empty=False):
    """Generic function to get a 'top N' list (e.g., top pages, top referrers)."""
    # We need to import the Session model to check against it
    from ..models import Session

    # If the model we are analyzing is the Session model itself,
    # then the queryset is simply the sessions_qs we already have.
    if model == Session:
        qs = sessions_qs
    # Otherwise, for models like PageView, we filter by the session.
    else:
        qs = model.objects.filter(session__in=sessions_qs)

    if filter_empty:
        qs = qs.exclude(**{f'{field_name}__exact': ''})

    return list(qs.values(field_name)
                .annotate(count=Count('id'))
                .order_by('-count')[:limit])
                
def get_breakdown(sessions, fields):
    """Generic function to get a breakdown by boolean fields (e.g., device types)."""
    aggregation = {
        field: Count('id', filter=Q(**{field: True})) for field in fields
    }
    data = sessions.aggregate(**aggregation)
    
    # Format for chart.js
    labels = [f.split('_is_')[-1].capitalize() for f in fields]
    values = list(data.values())
    return {'labels': labels, 'data': values}
    
def get_goal_performance(sessions):
    """Calculates conversions for all defined goals within the sessions."""
    goals = Goal.objects.all().order_by('name')
    performance = []
    for goal in goals:
        conversions = sessions.filter(events__name=goal.event_name).distinct().count()
        total_sessions = sessions.count()
        conversion_rate = (conversions / total_sessions * 100) if total_sessions > 0 else 0
        performance.append({
            'name': goal.name,
            'event': goal.event_name,
            'conversions': conversions,
            'conversion_rate': round(conversion_rate, 2)
        })
    return performance

def get_realtime_data():
    """Aggregates data for the real-time view."""
    config = get_config()
    online_threshold = timezone.now() - timedelta(seconds=60) # Active in last 60 seconds
    
    recent_sessions = Session.objects.filter(last_seen__gte=online_threshold).order_by('-last_seen')
    
    visitors = []
    for session in recent_sessions.select_related('user'):
        last_pageview = session.pageviews.order_by('-timestamp').first()
        visitors.append({
            'user': session.user.get_username() if session.user else 'Anonymous',
            'country': session.country,
            'city': session.city,
            'device': session.device_family,
            'browser': session.browser_family,
            'path': last_pageview.path if last_pageview else 'N/A',
            'last_seen': session.last_seen
        })
        
    return {
        'active_users': len(visitors),
        'visitors': visitors,
    }