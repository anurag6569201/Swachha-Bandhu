import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from subscriptions.models import Municipality

class Sponsor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    logo = models.ImageField(upload_to='sponsors/logos/')
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class PointLog(models.Model):
    class PointReason(models.TextChoices):
        INITIAL_REPORT = 'INITIAL_REPORT', _('New Issue Reported')
        PEER_VERIFICATION = 'PEER_VERIFICATION', _('Verified an Issue')
        ADMIN_BONUS = 'ADMIN_BONUS', _('Admin Bonus')
        REPORT_REJECTED = 'REPORT_REJECTED', _('Penalty: Rejected Report')
        LOTTERY_WIN = 'LOTTERY_WIN', _('Lottery Prize')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='point_logs')
    points = models.IntegerField()
    reason = models.CharField(max_length=50, choices=PointReason.choices)
    timestamp = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    source_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.email}: {self.points} points for {self.get_reason_display()}"

class Badge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/icons/')
    required_points = models.PositiveIntegerField(default=0, help_text=_("Total points required to earn this badge."))
    required_reports = models.PositiveIntegerField(default=0, help_text=_("Number of initial reports (not verifications) required."))
    required_verifications = models.PositiveIntegerField(default=0, help_text=_("Number of verifications required."))

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='earned_badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE, related_name='awarded_to')
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'badge')
        ordering = ['-earned_at']

    def __str__(self):
        return f"{self.user.email} earned {self.badge.name}"

class Lottery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    sponsor = models.ForeignKey(Sponsor, on_delete=models.SET_NULL, null=True, blank=True)
    municipality = models.ForeignKey(Municipality, on_delete=models.CASCADE, related_name='lotteries', help_text=_("The lottery is available to citizens active in this municipality."))
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_lotteries')
    drawn_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.municipality.name})"

class LotteryTicket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lottery = models.ForeignKey(Lottery, on_delete=models.CASCADE, related_name='tickets')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lottery_tickets')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('lottery', 'user')

    def __str__(self):
        return f"Ticket for {self.user.email} in {self.lottery.name}"