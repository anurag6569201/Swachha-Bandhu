from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from users.models import User
from reports.models import Report
from gamification.models import Badge, Lottery

@shared_task(rate_limit='10/m')
def send_email_task(subject, message, recipient_list):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False
        )
        return f"Email sent successfully to {recipient_list}"
    except Exception as e:
        return f"Failed to send email to {recipient_list}: {str(e)}"

@shared_task
def notify_user_of_status_change(report_id):
    try:
        report = Report.objects.select_related('user', 'location').get(pk=report_id)
        user = report.user
        if user and user.email:
            subject = f"Update on your Swachh Bandhu Report #{report.id}"
            message = (
                f"Hello {user.full_name},\n\n"
                f"Your report regarding '{report.issue_type}' at '{report.location.name}' has been updated.\n"
                f"The new status is: {report.get_status_display()}.\n\n"
                f"Thank you for your contribution to a cleaner community!\n\n"
                "The Swachh Bandhu Team"
            )
            send_email_task.delay(subject, message, [user.email])
    except Report.DoesNotExist:
        pass

@shared_task
def notify_user_of_new_badge(user_badge_id):
    from gamification.models import UserBadge
    try:
        user_badge = UserBadge.objects.select_related('user', 'badge').get(pk=user_badge_id)
        user = user_badge.user
        badge = user_badge.badge
        if user and user.email:
            subject = f"Congratulations! You've earned the '{badge.name}' badge!"
            message = (
                f"Hello {user.full_name},\n\n"
                f"Amazing work! You have just earned the '{badge.name}' badge.\n\n"
                f"Description: {badge.description}\n\n"
                "Keep up the great work and continue to make a difference!\n\n"
                "The Swachh Bandhu Team"
            )
            send_email_task.delay(subject, message, [user.email])
    except UserBadge.DoesNotExist:
        pass

@shared_task
def notify_lottery_winner(lottery_id):
    try:
        lottery = Lottery.objects.select_related('winner').get(pk=lottery_id)
        winner = lottery.winner
        if winner and winner.email:
            subject = f"You're a Winner! Congratulations from Swachh Bandhu!"
            message = (
                f"Hello {winner.full_name},\n\n"
                f"Congratulations! You have won the '{lottery.name}' lottery.\n\n"
                f"Description: {lottery.description}\n\n"
                "We will be in touch shortly with details on how to claim your prize.\n"
                "Thank you for being an active member of the Swachh Bandhu community!\n\n"
                "The Swachh Bandhu Team"
            )
            send_email_task.delay(subject, message, [winner.email])
    except Lottery.DoesNotExist:
        pass