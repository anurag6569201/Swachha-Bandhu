# activity_pulse/urls.py

from django.urls import path
from . import views

app_name = 'activity_pulse'

urlpatterns = [
    # Main dashboard view
    path('dashboard/', views.dashboard_view, name='dashboard'),
    
    # API endpoints
    path('api/v1/analytics/', views.analytics_api, name='analytics_api'),
    path('api/v1/realtime/', views.realtime_api, name='realtime_api'),
    path('api/v1/event/', views.event_api, name='event_api'),
]