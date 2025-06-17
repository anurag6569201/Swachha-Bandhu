# activity_pulse/models.py

import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

USER_MODEL = settings.AUTH_USER_MODEL

class Session(models.Model):
    """
    Represents a single user session.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='ap_sessions'
    )
    
    # Session Timestamps
    started_at = models.DateTimeField(auto_now_add=True, db_index=True)
    last_seen = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    # Device & Location
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    browser_family = models.CharField(max_length=100, blank=True)
    browser_version = models.CharField(max_length=50, blank=True)
    os_family = models.CharField(max_length=100, blank=True)
    os_version = models.CharField(max_length=50, blank=True)
    device_family = models.CharField(max_length=100, blank=True, default='Desktop')
    device_brand = models.CharField(max_length=100, blank=True)
    device_model = models.CharField(max_length=100, blank=True)
    is_mobile = models.BooleanField(default=False)
    is_tablet = models.BooleanField(default=False)
    is_touch = models.BooleanField(default=False)
    is_pc = models.BooleanField(default=False)
    
    # Geolocation
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    
    # Referrer & Campaign
    referrer_url = models.URLField(max_length=2048, blank=True)
    referrer_domain = models.CharField(max_length=255, blank=True, db_index=True)
    
    # UTM Campaign Tracking
    utm_source = models.CharField(max_length=255, blank=True, db_index=True)
    utm_medium = models.CharField(max_length=255, blank=True, db_index=True)
    utm_campaign = models.CharField(max_length=255, blank=True, db_index=True)
    utm_term = models.CharField(max_length=255, blank=True)
    utm_content = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Session {self.id} for {self.user or 'Anonymous'}"
        
    @property
    def duration(self):
        if self.ended_at:
            return self.ended_at - self.started_at
        return self.last_seen - self.started_at

    class Meta:
        verbose_name = _("Session")
        verbose_name_plural = _("Sessions")
        ordering = ['-started_at']


class PageView(models.Model):
    """
    Logs an individual page view within a session.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='pageviews')
    path = models.CharField(max_length=2048)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    time_on_page_seconds = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"View of {self.path} at {self.timestamp}"

    class Meta:
        verbose_name = _("Page View")
        verbose_name_plural = _("Page Views")
        ordering = ['timestamp']


class Event(models.Model):
    """
    Tracks a specific, named event that occurs during a session.
    e.g., 'user-signup', 'add-to-cart', 'video-play'
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='events')
    name = models.CharField(_("Event Name"), max_length=100, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    # Optional JSON field for additional event properties
    properties = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Event '{self.name}' at {self.timestamp}"

    class Meta:
        verbose_name = _("Event")
        verbose_name_plural = _("Events")
        ordering = ['timestamp']


class Goal(models.Model):
    """
    Defines a conversion goal, which is achieved when a specific event occurs.
    """
    name = models.CharField(
        _("Goal Name"),
        max_length=255,
        help_text=_("A human-readable name for the goal (e.g., 'User Registration').")
    )
    event_name = models.CharField(
        _("Trigger Event Name"),
        max_length=100,
        unique=True,
        help_text=_("The 'Event Name' that triggers this goal's conversion.")
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Goal")
        verbose_name_plural = _("Goals")

class AnalyticsDashboard(Session):
    """
    A proxy model used to create a clickable link in the Django admin sidebar
    that redirects to our custom analytics dashboard view.
    """
    class Meta:
        proxy = True
        verbose_name = _('Pulse Dashboard')
        verbose_name_plural = _('Pulse Dashboard')