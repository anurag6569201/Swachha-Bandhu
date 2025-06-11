from rest_framework import viewsets, permissions, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Report
from .serializers import (
    ReportReadSerializer,
    ReportCreateSerializer,
    ModerateReportSerializer,
)
from gamification.services import award_points_for_report
from core.permissions import IsAdminOrModerator
from notifications.tasks import send_report_status_update_email


class ReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint for creating, viewing, verifying, and moderating reports.
    - `POST /`: Create a new report.
    - `GET /`: List reports (filtered for the current user).
    - `GET /{id}/`: Retrieve a specific report.
    - `POST /{id}/verify/`: Submit a peer verification for a report.
    - `PATCH /{id}/moderate/`: (Admin/Moderator only) Change the status of a report.
    """
    queryset = Report.objects.all().select_related('user', 'location').prefetch_related('media', 'verifications')
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def get_serializer_class(self):
        """
        Dynamically selects the appropriate serializer based on the action.
        """
        if self.action == 'create' or self.action == 'verify':
            return ReportCreateSerializer
        if self.action == 'moderate':
            return ModerateReportSerializer
        # For 'list', 'retrieve', and any other action
        return ReportReadSerializer

    def get_queryset(self):
        """
        Admins/staff can see all reports.
        Regular users can only see their own submitted reports.
        """
        user = self.request.user
        if user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=user)

    def perform_create(self, serializer):
        """
        Hook called after validation and before the object is saved.
        This handles both creating a new report and creating a verification report.
        """
        report_instance = serializer.save()
        
        # After the instance is created, award points.
        award_points_for_report(report_instance)

    @action(detail=True, methods=['post'], url_path='verify')
    def verify(self, request, pk=None):
        """
        Allows a user to submit a peer verification for an existing report.
        """
        original_report = self.get_object()

        # Validation checks
        if original_report.status != Report.ReportStatus.PENDING:
            return Response({'error': 'This report is no longer pending and cannot be verified.'}, status=status.HTTP_400_BAD_REQUEST)
        if original_report.user == request.user:
            return Response({'error': 'You cannot verify your own report.'}, status=status.HTTP_400_BAD_REQUEST)

        # We reuse the create serializer for its validation logic (geo-fence, etc.)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # The serializer context 'location_obj' is set during validation.
        # We now create the verification report instance.
        verification_report = serializer.save()

        # Link the new report to the one being verified
        verification_report.verifies_report = original_report
        # Ensure consistency
        verification_report.location = original_report.location
        verification_report.issue_type = f"Verification for: {original_report.issue_type}"
        verification_report.save()

        # The perform_create hook doesn't run for custom actions, so we call the service here.
        award_points_for_report(verification_report)

        # Return the data of the *new* verification report
        read_serializer = ReportReadSerializer(verification_report, context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='moderate', permission_classes=[IsAdminOrModerator])
    def moderate(self, request, pk=None):
        """
        (Admin/Moderator Only) Changes the status of a report.
        """
        report = self.get_object()
        serializer = self.get_serializer(report, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_report = serializer.save()

        # Trigger the asynchronous notification task
        send_report_status_update_email.delay(
            updated_report.user.id, updated_report.id, updated_report.get_status_display()
        )

        read_serializer = ReportReadSerializer(updated_report, context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_200_OK)