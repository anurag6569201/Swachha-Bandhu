# reports/views.py
from rest_framework import viewsets, permissions, parsers
from .models import Report
from .serializers import ReportReadSerializer, ReportCreateSerializer

class ReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to create, list, and retrieve reports.
    """
    queryset = Report.objects.all().select_related('user', 'location').prefetch_related('media')
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser] # For file uploads

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportReadSerializer

    def get_queryset(self):
        """
        Filter reports to show only the user's own reports unless they are staff.
        """
        user = self.request.user
        if user.is_staff:
            return super().get_queryset()
        return super().get_queryset().filter(user=user)

    def perform_create(self, serializer):
        # The user is automatically passed to the serializer context by DRF,
        # so we don't need to pass it manually here.
        # The logic is handled inside the serializer's create method.
        serializer.save()