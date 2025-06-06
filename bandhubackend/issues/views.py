from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from .models import IssueCategory, ReportedIssue
from .serializers import (
    IssueCategorySerializer, 
    ReportedIssueCreateSerializer,
    ReportedIssueListSerializer
)

class IssueCategoryListView(generics.ListAPIView):
    queryset = IssueCategory.objects.all().order_by('name')
    serializer_class = IssueCategorySerializer
    permission_classes = [permissions.IsAuthenticated] # Or AllowAny if categories are public

class ReportedIssueListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser] # For file uploads

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReportedIssueCreateSerializer
        return ReportedIssueListSerializer

    def get_queryset(self):
        # Users can only see their own reported issues, or implement admin/staff logic here
        return ReportedIssue.objects.filter(user=self.request.user).order_by('-timestamp')

    def perform_create(self, serializer):
        # The serializer's create method handles assigning the user via context
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            # Use ReportedIssueListSerializer for the response to include media_files details
            response_serializer = ReportedIssueListSerializer(serializer.instance, context=self.get_serializer_context())
            return Response(response_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except serializers.ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e: # Catch other potential errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Optional: View for a specific issue (Retrieve, Update, Delete)
class ReportedIssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated] # Add custom permission for owner or staff
    serializer_class = ReportedIssueListSerializer # Or a more detailed one for update

    def get_queryset(self):
        return ReportedIssue.objects.filter(user=self.request.user) # Ensure user can only access their own

    # Add logic for partial_update if needed, and ensure only certain fields can be updated by user