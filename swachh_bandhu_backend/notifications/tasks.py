# notifications/tasks.py
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from gamification.models import Badge
from reports.models import Report

User = get_user_model()

@shared_task
def send_report_status_update_email(user_id, report_id, new_status):
    """
    Sends an email to a user when their report status is updated by a moderator.
    """
    try:
        user = User.objects.get(pk=user_id)
        report = Report.objects.get(pk=report_id)

        subject = f"Update on your Swachh Bandhu Report #{report.id}"
        message = (
            f"Hello {user.full_name},\n\n"
            f"Your report regarding '{report.issue_type}' at '{report.location.name}' has been updated.\n"
            f"The new status is: {new_status}.\n\n"
            f"Thank you for your contribution to a cleaner community!\n\n"
            "The Swachh Bandhu Team"
        )
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return f"Email sent to {user.email} for report {report.id}"
    except User.DoesNotExist:
        return f"Task failed: User with id {user_id} not found."
    except Report.DoesNotExist:
        return f"Task failed: Report with id {report_id} not found."


@shared_task
def send_badge_earned_email(user_id, badge_id):
    """
    Sends an email to a user when they earn a new badge.
    """
    try:
        user = User.objects.get(pk=user_id)
        badge = Badge.objects.get(pk=badge_id)

        subject = f"Congratulations! You've earned a new badge!"
        message = (
            f"Hello {user.full_name},\n\n"
            f"Congratulations! You have just earned the '{badge.name}' badge.\n\n"
            f"Description: {badge.description}\n\n"
            "Keep up the great work and continue to make a difference!\n\n"
            "The Swachh Bandhu Team"
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return f"Badge notification email sent to {user.email} for badge '{badge.name}'"
    except User.DoesNotExist:
        return f"Task failed: User with id {user_id} not found."
    except Badge.DoesNotExist:
        return f"Task failed: Badge with id {badge_id} not found."