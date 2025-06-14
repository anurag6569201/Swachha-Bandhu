from django.db import transaction, F
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from reports.models import Report
from .models import PointLog, Badge, UserBadge, Lottery, LotteryTicket
from users.models import User

def _award_points(user, points, reason, source_object=None):
    if not user: return
    with transaction.atomic():
        user = User.objects.select_for_update().get(pk=user.pk)
        PointLog.objects.create(
            user=user,
            points=points,
            reason=reason,
            source_object=source_object
        )
        user.total_points = F('total_points') + points
        user.save(update_fields=['total_points'])

def _check_and_award_badges(user_id):
    user = User.objects.get(pk=user_id)
    earned_badge_ids = user.earned_badges.values_list('badge_id', flat=True)
    unearned_badges = Badge.objects.exclude(id__in=earned_badge_ids)
    
    reports_count = user.reports.filter(verifies_report__isnull=True).count()
    verifications_count = user.reports.filter(verifies_report__isnull=False).count()
    
    for badge in unearned_badges:
        earned = False
        if badge.required_points > 0 and user.total_points >= badge.required_points: earned = True
        if badge.required_reports > 0 and reports_count >= badge.required_reports: earned = True
        if badge.required_verifications > 0 and verifications_count >= badge.required_verifications: earned = True
        if earned: UserBadge.objects.create(user=user, badge=badge)

def _assign_lottery_ticket(user):
    active_lottery = Lottery.objects.filter(is_active=True).first()
    if active_lottery:
        LotteryTicket.objects.get_or_create(user=user, lottery=active_lottery)