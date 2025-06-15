from rest_framework import viewsets, permissions, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Report, IssueCategory
from .serializers import (
    ReportReadSerializer, ReportCreateSerializer, 
    ReportVerificationSerializer, ReportModerateSerializer,
    ReportDetailSerializer, ReportStatusHistorySerializer,
    IssueCategorySerializer
)
from core.permissions import IsModerator, IsCitizen
from gamification.tasks import process_report_points

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().select_related('user', 'location', 'issue_category').prefetch_related('media', 'verifications', 'status_history')
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'status': ['in', 'exact'],
        'location': ['exact'],
        'location__municipality': ['exact'],
        'issue_category': ['exact'],
        'severity': ['exact'],
        'created_at': ['gte', 'lte'],
    }

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        if self.action == 'retrieve':
            return ReportDetailSerializer
        if self.action == 'verify':
            return ReportVerificationSerializer
        if self.action == 'moderate':
            return ReportModerateSerializer
        if self.action == 'history':
            return ReportStatusHistorySerializer
        return ReportReadSerializer

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        if not user.is_authenticated:
            return Report.objects.none()

        # Admins and moderators see reports based on their municipality
        if user.role in ['SUPER_ADMIN', 'MUNICIPAL_ADMIN', 'MODERATOR']:
            if user.municipality:
                return qs.filter(location__municipality=user.municipality)
            return qs  # Super admin sees all

        # This uses the `?exclude_user=true` query parameter.
        exclude_current_user = self.request.query_params.get('exclude_user', 'false').lower() == 'true'
        if self.action == 'list' and exclude_current_user:
            return qs.exclude(user=user)

        # For the "My Reports" page (a standard list view), filter to ONLY the user's reports.
        if self.action == 'list':
            return qs.filter(user=user)
            
        # For all other actions (retrieve, verify, moderate, etc.), we DO NOT filter by user.
        # This is CRUCIAL. It allows a user to retrieve another user's report detail
        # to view it before verifying. The permission classes on the actions themselves
        # will handle security (e.g., a citizen can't moderate).
        return qs

    # CRITICAL FIX: Trigger gamification tasks after report creation
    def perform_create(self, serializer):
        report = serializer.save(user=self.request.user)
        process_report_points.delay(report.id)

    @action(detail=True, methods=['post'], url_path='verify', permission_classes=[IsCitizen])
    def verify(self, request, pk=None):
        original_report = self.get_object()
        serializer = self.get_serializer(
            data=request.data, 
            context={'request': request, 'original_report': original_report}
        )
        serializer.is_valid(raise_exception=True)
        # Manually save and trigger points, since perform_create is not called for actions
        verification_report = serializer.save(user=request.user)
        process_report_points.delay(verification_report.id)

        read_serializer = ReportReadSerializer(verification_report, context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='moderate', permission_classes=[IsModerator])
    def moderate(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(report, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        updated_report = serializer.save()
        read_serializer = ReportDetailSerializer(updated_report, context={'request': request})
        return Response(read_serializer.data)

    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        report = self.get_object()
        history = report.status_history.all()
        serializer = self.get_serializer(history, many=True)
        return Response(serializer.data)


class IssueCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IssueCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = IssueCategory.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['municipality']