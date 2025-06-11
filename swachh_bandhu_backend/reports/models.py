# reports/models.py
import uuid
from django.db import models
from django.conf import settings
from locations.models import Location

# Define a dynamic upload path for media files to keep them organized.
def report_media_upload_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/reports/<report_id>/<filename>
    return f'reports/{instance.report.id}/{filename}'

class Report(models.Model):
    class ReportStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        VERIFIED = 'VERIFIED', 'Verified'
        REJECTED = 'REJECTED', 'Rejected'
        ACTIONED = 'ACTIONED', 'Action Taken'

    # Using a standard AutoField for the primary key is fine for internal use.
    id = models.BigAutoField(primary_key=True)

    # Foreign Keys linking the report to the user and location.
    # PROTECT ensures a location cannot be deleted if it has reports.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reports')
    location = models.ForeignKey(Location, on_delete=models.PROTECT, related_name='reports')
    
    # Report details
    issue_type = models.CharField(max_length=100, help_text="e.g., 'Broken Bench', 'Overflowing Bin'")
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=ReportStatus.choices,
        default=ReportStatus.PENDING,
        db_index=True
    )
    
    # Gamification and Verification (to be used more in later phases)
    points_awarded = models.IntegerField(default=0)
    # This FK links a peer verification report to the original one.
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
        verbose_name = "Report"
        verbose_name_plural = "Reports"

    def __str__(self):
        return f"Report #{self.id} by {self.user.email} at {self.location.name}"


class ReportMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='media')
    
    class MediaType(models.TextChoices):
        IMAGE = 'IMAGE', 'Image'
        VIDEO = 'VIDEO', 'Video'
        AUDIO = 'AUDIO', 'Audio'

    media_type = models.CharField(max_length=10, choices=MediaType.choices)
    file = models.FileField(upload_to=report_media_upload_path)
    
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.media_type} for Report #{self.report.id}"