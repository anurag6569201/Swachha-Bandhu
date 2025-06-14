from rest_framework import viewsets, permissions, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Report
from .serializers import (
    ReportReadSerializer, ReportCreateSerializer, 
    ReportVerificationSerializer, ReportModerateSerializer
)
from core.permissions import IsModerator, IsCitizen
from gamification.tasks import process_report_points

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all().select_related('user', 'location').prefetch_related('media', 'verifications')
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'status': ['in', 'exact'],
        'location': ['exact'],
        'location__municipality': ['exact'],
        'created_at': ['gte', 'lte'],
    }

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        if self.action == 'verify':
            return ReportVerificationSerializer
        if self.action == 'moderate':
            return ReportModerateSerializer
        return ReportReadSerializer

    def get_queryset(self):
        user = self.request.user
        qs = super().get_queryset()

        if user.is_authenticated:
            if user.role in ['MUNICIPAL_ADMIN', 'MODERATOR'] and user.municipality:
                return qs.filter(location__municipality=user.municipality)
            elif user.role == 'SUPER_ADMIN':
                return qs
            else: # Citizen
                return qs.filter(user=user)
        return Report.objects.none()

    def perform_create(self, serializer):
        report = serializer.save()
        process_report_points.delay(report.id)

    @action(detail=True, methods=['post'], url_path='verify', permission_classes=[IsCitizen])
    def verify(self, request, pk=None):
        original_report = self.get_object()
        serializer = self.get_serializer(
            data=request.data, 
            context={'request': request, 'original_report': original_report}
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        read_serializer = ReportReadSerializer(serializer.instance)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='moderate', permission_classes=[IsModerator])
    def moderate(self, request, pk=None):
        report = self.get_object()
        serializer = self.get_serializer(report, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_report = serializer.save()
        process_report_points.delay(updated_report.id)
        read_serializer = ReportReadSerializer(updated_report)
        return Response(read_serializer.data)