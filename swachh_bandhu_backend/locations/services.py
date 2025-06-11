# gamification/services.py
from django.contrib.contenttypes.models import ContentType
from django.db import transaction
from .models import PointLog, Report
from users.models import User

# Define point values in settings for easy configuration
from django.conf import settings

POINTS_FOR_INITIAL_REPORT = getattr(settings, 'POINTS_FOR_INITIAL_REPORT', 100)
POINTS_FOR_PEER_VERIFICATION = getattr(settings, 'POINTS_FOR_PEER_VERIFICATION', 50)

@transaction.atomic
def award_points_for_report(user: User, report: Report):
    """
    Awards points to a user for submitting a report and updates their total score.
    This function is designed to be called right after a report is created.
    
    It checks if the report is an initial report or a peer verification.
    """
    points_to_award = 0
    reason = ''

    if report.verifies_report:
        # This is a peer verification
        points_to_award = POINTS_FOR_PEER_VERIFICATION
        reason = PointLog.PointReason.PEER_VERIFICATION
    else:
        # This is an initial report
        points_to_award = POINTS_FOR_INITIAL_REPORT
        reason = PointLog.PointReason.INITIAL_REPORT

    if points_to_award > 0:
        # Create a log entry for the audit trail
        PointLog.objects.create(
            user=user,
            points=points_to_award,
            reason=reason,
            content_object=report
        )

        # Update the denormalized score on the user model
        user.total_points += points_to_award
        user.save(update_fields=['total_points'])

        # Also update the points on the report itself for easy reference
        report.points_awarded = points_to_award
        report.save(update_fields=['points_awarded'])

        # Here, we would call the badge checking service in the future
        # check_and_award_badges(user)

    return points_to_award