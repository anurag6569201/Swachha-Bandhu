# gamification/models.py
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class PointLog(models.Model):
    """
    Logs every point transaction for a user. This provides a clear audit trail.
    """
    class PointReason(models.TextChoices):
        INITIAL_REPORT = 'INITIAL_REPORT', 'First Report for an Issue'
        PEER_VERIFICATION = 'PEER_VERIFICATION', 'Peer Verification of an Issue'
        ADMIN_BONUS = 'ADMIN_BONUS', 'Admin-Awarded Bonus'
        # Add more reasons as the app grows

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='point_logs')
    points = models.IntegerField()
    reason = models.CharField(max_length=50, choices=PointReason.choices)
    timestamp = models.DateTimeField(auto_now_add=True)

    # Generic Foreign Key to link to the source object (e.g., a Report)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    source_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-timestamp']
        verbose_name = "Point Log"

    def __str__(self):
        return f"{self.user.email} received {self.points} points for {self.get_reason_display()}"


class Badge(models.Model):
    """
    Defines the available badges in the system.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon_url = models.URLField(blank=True, null=True, help_text="URL to the badge icon image.")
    # Define the criteria for earning the badge
    required_points = models.PositiveIntegerField(default=0, help_text="Points required to earn this badge.")
    required_reports = models.PositiveIntegerField(default=0, help_text="Number of reports required.")
    # Add more criteria fields as needed (e.g., required_verifications)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    """
    A through model connecting a User to a Badge they have earned.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='awarded_to')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge') # A user can earn a badge only once
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.email} earned {self.badge.name}"