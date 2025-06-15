from celery import shared_task
from django.db import transaction
from django.db.models import F
from django.conf import settings
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
import random
from reports.models import Report
from .models import PointLog, Badge, UserBadge, Lottery, LotteryTicket
from users.models import User
from notifications.tasks import notify_user_of_new_badge, notify_lottery_winner

@shared_task
def process_report_points(report_id):
    try:
        report = Report.objects.select_related('user').get(pk=report_id)
        user = report.user
        if not user: return

        content_type = ContentType.objects.get_for_model(Report)
        if PointLog.objects.filter(content_type=content_type, object_id=report.id).exists():
            return "Points already processed for this report."

        points = 0
        reason = ''

        if report.status == Report.ReportStatus.REJECTED:
            points = getattr(settings, 'PENALTY_FOR_FAKE_REPORT', -50)
            reason = PointLog.PointReason.REPORT_REJECTED
        elif report.verifies_report:
            points = getattr(settings, 'POINTS_FOR_PEER_VERIFICATION', 5)
            reason = PointLog.PointReason.PEER_VERIFICATION
        else:
            points = getattr(settings, 'POINTS_FOR_INITIAL_REPORT', 10)
            reason = PointLog.PointReason.INITIAL_REPORT
        
        if points != 0:
            with transaction.atomic():
                # Lock the user row to prevent race conditions when updating points
                user_locked = User.objects.select_for_update().get(pk=user.pk)
                
                point_log = PointLog.objects.create(
                    user=user_locked, points=points, reason=reason, source_object=report
                )
                
                # Update the report with the points awarded
                report.points_awarded = points
                report.save(update_fields=['points_awarded'])

                # Update user's total points
                user_locked.total_points = F('total_points') + points
                user_locked.save(update_fields=['total_points'])
            
            # Refresh the user object to get the latest point total for badge checks
            user.refresh_from_db()
            check_and_award_badges.delay(user.id)
            assign_lottery_ticket.delay(user.id, report.id)

    except Report.DoesNotExist:
        pass

@shared_task
def check_and_award_badges(user_id):
    user = User.objects.get(pk=user_id)
    earned_badge_ids = user.earned_badges.values_list('badge_id', flat=True)
    unearned_badges = Badge.objects.exclude(id__in=earned_badge_ids)
    
    reports_count = user.reports.filter(verifies_report__isnull=True).count()
    verifications_count = user.reports.filter(verifies_report__isnull=False).count()
    
    user.refresh_from_db()
    
    for badge in unearned_badges:
        earned = all([
            user.total_points >= badge.required_points,
            reports_count >= badge.required_reports,
            verifications_count >= badge.required_verifications
        ])
        
        if earned:
            user_badge, created = UserBadge.objects.get_or_create(user=user, badge=badge)
            if created:
                notify_user_of_new_badge.delay(user_badge.id)

@shared_task
def assign_lottery_ticket(user_id, report_id):
    try:
        report = Report.objects.select_related('location__municipality').get(pk=report_id)
        active_lottery = Lottery.objects.filter(
            municipality=report.location.municipality,
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).first()

        if active_lottery:
            user = User.objects.get(pk=user_id)
            LotteryTicket.objects.get_or_create(user=user, lottery=active_lottery)
    except (Report.DoesNotExist, User.DoesNotExist):
        pass

@shared_task
def run_daily_lottery_draw():
    today = timezone.now().date()
    lotteries_to_draw = Lottery.objects.filter(
        end_date__lt=today, 
        is_active=True,
        winner__isnull=True
    )
    for lottery in lotteries_to_draw:
        with transaction.atomic():
            tickets = list(lottery.tickets.all())
            if not tickets:
                lottery.is_active = False
                lottery.save()
                continue
            
            winner_ticket = random.choice(tickets)
            lottery.winner = winner_ticket.user
            lottery.drawn_at = timezone.now()
            lottery.is_active = False
            lottery.save()
            
            notify_lottery_winner.delay(lottery.id)