import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from locations.models import Location
from users.models import User

def report_media_upload_path(instance, filename):
    return f'reports/{instance.report.location.municipality.id}/{instance.report.id}/{uuid.uuid4()}_{filename}'

class IssueCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    municipality = models.ForeignKey('subscriptions.Municipality', on_delete=models.CASCADE, related_name='issue_categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('municipality', 'name')
        verbose_name_plural = "Issue Categories"

    def __str__(self):
        return f"{self.name} ({self.municipality.name})"

class Report(models.Model):
    class ReportStatus(models.TextChoices):
        PENDING = 'PENDING', _('Pending Verification')
        VERIFIED = 'VERIFIED', _('Verified & Awaiting Action')
        REJECTED = 'REJECTED', _('Rejected')
        IN_PROGRESS = 'IN_PROGRESS', _('Action In Progress')
        ACTIONED = 'ACTIONED', _('Action Taken')
        # Removed RESOLVED and DUPLICATE for simplicity; ACTIONED and REJECTED cover most cases.
        # Consider adding them back if finer-grained status is needed.
    
    class SeverityLevel(models.TextChoices):
        LOW = 'LOW', _('Low')
        MEDIUM = 'MEDIUM', _('Medium')
        HIGH = 'HIGH', _('High')

    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reports')
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name='reports')
    issue_category = models.ForeignKey(IssueCategory, on_delete=models.PROTECT, related_name='reports')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=ReportStatus.choices, default=ReportStatus.PENDING, db_index=True)
    severity = models.CharField(max_length=10, choices=SeverityLevel.choices, default=SeverityLevel.MEDIUM, db_index=True)
    moderator_notes = models.TextField(blank=True, null=True)
    action_taken_notes = models.TextField(blank=True, null=True)
    verifies_report = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='verifications')
    points_awarded = models.IntegerField(default=0, help_text=_("Points awarded or deducted for this report submission."))
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

class ReportStatusHistory(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Report.ReportStatus.choices)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = "Report Status Histories"