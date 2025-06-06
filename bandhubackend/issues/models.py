from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
import uuid

def issue_media_path(instance, filename):
    return f'issue_media/{instance.issue.id}/{filename}'

class IssueCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Issue Categories"

class ReportedIssue(models.Model):
    STATUS_CHOICES = [
        ('pending_verification', 'Pending Verification'),
        ('verified', 'Verified & Open'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected'),
        ('duplicate', 'Duplicate'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_issues')
    category = models.ForeignKey(IssueCategory, on_delete=models.PROTECT) # PROTECT to avoid deleting category if issues exist
    description = models.TextField()
    
    latitude = models.DecimalField(max_digits=10, decimal_places=7) # For GPS coordinates
    longitude = models.DecimalField(max_digits=10, decimal_places=7) # For GPS coordinates
    
    # User's current location at the time of reporting (for geo-fencing validation audit/reference)
    reporter_latitude_at_submission = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    reporter_longitude_at_submission = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)

    address = models.TextField(blank=True, null=True) # Optional, can be auto-filled by reverse geocoding
    
    timestamp = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_verification')
    
    qr_code_identifier = models.CharField(max_length=255, blank=True, null=True) 
    
    # Peer Verification Fields (can be expanded later)
    is_verified_by_peer = models.BooleanField(default=False)
    verification_timestamp = models.DateTimeField(null=True, blank=True)
    # verifiers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='verified_issues', blank=True)


    def __str__(self):
        return f"Issue {self.id} - {self.category.name} by {self.user.email}"

class IssueMedia(models.Model):
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    issue = models.ForeignKey(ReportedIssue, on_delete=models.CASCADE, related_name='media_files')
    file = models.FileField(upload_to=issue_media_path)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.media_type} for issue {self.issue.id}"