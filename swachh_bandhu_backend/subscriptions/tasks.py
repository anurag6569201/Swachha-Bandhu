from celery import shared_task
from django.utils import timezone
from .models import Municipality

@shared_task
def check_municipal_subscriptions():
    today = timezone.now().date()
    expired_municipalities = Municipality.objects.filter(
        is_active=True,
        subscribed_until__lt=today
    )
    
    count = expired_municipalities.update(is_active=False)
    
    if count > 0:
        return f"Deactivated {count} municipalities with expired subscriptions."
    return "No expired subscriptions found."