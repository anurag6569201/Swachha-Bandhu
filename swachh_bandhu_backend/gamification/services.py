# gamification/services.py
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from reports.models import Report
from .models import PointLog, Badge, UserBadge

@transaction.atomic
def award_points_for_report(report_instance: Report):
    """
    Awards points for a new report and updates the user's total score.
    This function is designed to be called after a report is successfully created.
    """
    user = report_instance.user
    points_to_award = 0
    reason = ''

    # Check if this report is a verification of another report
    if report_instance.verifies_report:
        points_to_award = 50 # Points for peer verification
        reason = PointLog.PointReason.PEER_VERIFICATION
    else:
        # Check if this is the first report for this issue at this location
        # Note: This is a simplified check. A more complex system might check for
        # similar issue_type at the same location within a time window.
        is_first_report = not Report.objects.filter(
            location=report_instance.location,
            issue_type=report_instance.issue_type,
            status__in=['PENDING', 'VERIFIED', 'ACTIONED']
        ).exclude(pk=report_instance.pk).exists()

        if is_first_report:
            points_to_award = 100 # Points for being the first to report
            reason = PointLog.PointReason.INITIAL_REPORT
        else:
            # For now, we don't award points for duplicate initial reports
            # but we could change this rule here.
            return # No points to award

    if points_to_award > 0:
        # Create a log entry for the transaction
        PointLog.objects.create(
            user=user,
            points=points_to_award,
            reason=reason,
            source_object=report_instance
        )
        # Update the user's denormalized total points
        user.total_points += points_to_award
        user.save(update_fields=['total_points'])
        
        # After awarding points, check if the user has earned any new badges
        check_and_award_badges(user)


@transaction.atomic
def check_and_award_badges(user):
    """
    Checks a user's stats against all available badges and awards any new ones.
    """
    # Get IDs of badges the user has already earned
    earned_badge_ids = user.earned_badges.values_list('badge_id', flat=True)

    # Find badges the user has NOT yet earned
    unearned_badges = Badge.objects.exclude(id__in=earned_badge_ids)
    
    user_reports_count = user.reports.count()
    # Add more user stats as needed (e.g., user_verifications_count)
    
    for badge in unearned_badges:
        earned = False
        # Check criteria. Can be made more complex.
        if badge.required_points > 0 and user.total_points >= badge.required_points:
            earned = True
        if badge.required_reports > 0 and user_reports_count >= badge.required_reports:
            earned = True
        
        if earned:
            UserBadge.objects.create(user=user, badge=badge)
            send_badge_earned_email.delay(user.id, badge.id)