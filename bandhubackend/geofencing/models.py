# geofencing/models.py
from django.contrib.gis.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

class GeofenceZone(models.Model):
    """
    Represents a circular geofence zone owned by a user.
    """
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='geofence_zones',
        help_text="The user who owns this geofence zone."
    )
    name = models.CharField(
        max_length=100,
        help_text="A unique, human-readable name for the geofence zone."
    )
    description = models.TextField(
        blank=True,
        help_text="An optional description of the zone's purpose."
    )
    center = models.PointField(
        srid=4326, # WGS 84, standard for GPS coordinates
        help_text="The center point (longitude, latitude) of the geofence circle."
    )
    radius = models.FloatField(
        validators=[MinValueValidator(1.0)],
        help_text="The radius of the geofence circle in meters."
    )
    color = models.CharField(
        max_length=20,
        default='#3388ff',
        help_text="A CSS-compatible color for displaying the zone on the map."
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Enable or disable this geofence zone for event logging."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # A user cannot have two zones with the same name
        unique_together = ('owner', 'name')
        verbose_name = "Geofence Zone"
        verbose_name_plural = "Geofence Zones"

    def __str__(self):
        return f"{self.name} (Owner: {self.owner.username})"


class GeofenceEvent(models.Model):
    """
    Logs an event when a tracked device enters or exits a geofence zone.
    """
    class EventType(models.TextChoices):
        ENTER = 'ENTER', 'Enter'
        EXIT = 'EXIT', 'Exit'
        CHECK_IN = 'CHECK_IN', 'Check-in'

    zone = models.ForeignKey(
        GeofenceZone,
        on_delete=models.CASCADE,
        related_name='events',
        help_text="The zone associated with this event."
    )
    event_type = models.CharField(
        max_length=10,
        choices=EventType.choices,
        help_text="The type of event that occurred (Enter, Exit, Check-in)."
    )
    # Store the exact location where the event was triggered
    location = models.PointField(
        srid=4326,
        help_text="The geographic point where the event was triggered."
    )
    timestamp = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="The server-side timestamp of when the event was recorded."
    )
    # You might also add a ForeignKey to a 'Device' model in a real app
    # device = models.ForeignKey('Device', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Geofence Event"
        verbose_name_plural = "Geofence Events"

    def __str__(self):
        return f"{self.zone.name} - {self.get_event_type_display()} at {self.timestamp.isoformat()}"