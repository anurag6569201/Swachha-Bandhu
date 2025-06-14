import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class SubscriptionPlan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    price_per_month = models.DecimalField(max_digits=8, decimal_places=2)
    max_locations = models.PositiveIntegerField(help_text=_("Maximum number of QR-coded locations allowed."))
    max_admins = models.PositiveIntegerField(help_text=_("Maximum number of municipal admin/moderator accounts."))
    analytics_access = models.BooleanField(default=False, help_text=_("Grants access to the advanced analytics dashboard."))
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Municipality(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200, unique=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='municipalities')
    is_active = models.BooleanField(default=True, help_text=_("Controls access for the entire municipality. Deactivates on subscription expiry."))
    subscribed_until = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Municipalities'
        ordering = ['state', 'name']

    def __str__(self):
        return self.name

    @property
    def is_subscription_active(self):
        if self.subscribed_until:
            return self.subscribed_until >= timezone.now().date()
        return False