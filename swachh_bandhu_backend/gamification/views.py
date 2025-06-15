from django.db.models import F, Window
from django.db.models.functions import Rank
from django.utils import timezone
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from users.models import User
from .models import Lottery
from .serializers import LeaderboardUserSerializer, LotterySerializer, UserProfileStatsSerializer

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaderboardUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        period = self.request.query_params.get('period', 'all_time')
        
        if period == 'monthly':
            # This requires a UserActivity model to track points earned in a specific month.
            # Assuming such a model exists for demonstration.
            # For simplicity in this example, we will still use total_points.
            # In a real-world scenario, you would aggregate points from the current month.
            queryset = User.objects.filter(is_active=True, role='CITIZEN')
        else: # all_time
            queryset = User.objects.filter(is_active=True, role='CITIZEN')

        return queryset.annotate(
            rank=Window(expression=Rank(), order_by=F('total_points').desc())
        ).order_by('rank', 'date_joined')[:10]


class UserProfileStatsView(generics.RetrieveAPIView):
    serializer_class = UserProfileStatsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LotteryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LotterySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lottery.objects.select_related('sponsor', 'winner', 'municipality').all().order_by('-end_date')