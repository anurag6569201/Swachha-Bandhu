import uuid
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from locations.models import Location
from users.models import User

def report_media_upload_path(instance, filename):
    return f'reports/{instance.report.location.municipality.id}/{instance.report.id}/{uuid.uuid4()}_{filename}'

class Report(models.Model):
    class ReportStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Verification')
        VERIFIED = 'VERIFIED', _('Verified')
        REJECTED = 'REJECTED', _('Rejected')
        ACTIONED = 'ACTIONED', _('Action Taken')
        DUPLICATE = 'DUPLICATE', _('Duplicate')
    
    id = models.BigAutoField(primary_key=True)
    
    user = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='reports'
    )
    
    location = models.ForeignKey(
        Location, 
        on_delete=models.PROTECT, 
        related_name='reports'
    )
    
    issue_type = models.CharField(
        max_length=100, 
        help_text=_("e.g., 'Overflowing Bin', 'Broken Streetlight', 'Pothole'")
    )
    
    description = models.TextField()
    
    status = models.CharField(
        max_length=20, 
        choices=ReportStatus.choices, 
        default=ReportStatus.PENDING, 
        db_index=True
    )
    
    moderator_notes = models.TextField(
        blank=True, 
        null=True, 
        help_text=_("Internal notes for moderators/admins regarding the report's status.")
    )

    action_taken_notes = models.TextField(
        blank=True, 
        null=True, 
        help_text=_("Details of the action taken by the municipality to resolve the issue.")
    )

    verifies_report = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='verifications'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Report")
        verbose_name_plural = _("Reports")

    def __str__(self):
        user_email = self.user.email if self.user else 'Anonymous'
        return f"Report #{self.id} by {user_email} at {self.location.name}"

class ReportMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to=report_media_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Media for Report #{self.report.id}"