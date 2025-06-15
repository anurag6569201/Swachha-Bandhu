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
        instance.location.last_reported_at = timezone.now()
        instance.location.save(update_fields=['last_reported_at'])
    
    else:
        # Avoid creating history on every save, only on status change.
        try:
            latest_history = instance.status_history.latest('timestamp')
            if latest_history.status != instance.status:
                ReportStatusHistory.objects.create(
                    report=instance,
                    status=instance.status,
                    # This assumes a 'request' object is somehow passed to the model, which is hard.
                    # A better approach is to handle history creation in the view/serializer where the user is known.
                    # For simplicity of this implementation, we leave changed_by as null on updates here.
                    changed_by=None, 
                    notes=instance.moderator_notes or ""
                )
        except ReportStatusHistory.DoesNotExist:
             ReportStatusHistory.objects.create(report=instance, status=instance.status)