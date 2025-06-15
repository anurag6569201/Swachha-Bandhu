from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Report, ReportStatusHistory

@receiver(post_save, sender=Report)
def create_report_status_history_and_update_location(sender, instance, created, **kwargs):
    if created:
        ReportStatusHistory.objects.create(
            report=instance,
            status=instance.status,
            changed_by=instance.user,
            notes="Report created."
        )
        # Update the location's last reported time
        instance.location.last_reported_at = timezone.now()
        instance.location.save(update_fields=['last_reported_at'])
    
    # History for status changes is now handled in the ReportModerateSerializer
    # to ensure the user who made the change is correctly attributed.