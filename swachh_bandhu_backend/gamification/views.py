from django.db.models import F, Window
from django.db.models.functions import Rank
from django.utils import timezone
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from users.models import User, UserRole
from .models import Lottery
from .serializers import LeaderboardUserSerializer, LotterySerializer, UserProfileStatsSerializer

class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaderboardUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        period = self.request.query_params.get('period', 'all_time')
        
        # Currently only supports 'all_time'.
        # A more complex implementation would be needed for monthly leaderboards.
        queryset = User.objects.filter(is_active=True, role=UserRole.CITIZEN)

        # Annotate rank using a window function for efficiency
        return queryset.annotate(
            rank=Window(expression=Rank(), order_by=F('total_points').desc())
        ).order_by('rank', 'date_joined')[:100] # Increased leaderboard size


class UserProfileStatsView(generics.RetrieveAPIView):
    serializer_class = UserProfileStatsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        try:
            # Annotate the user object with its rank efficiently
            user_with_rank = User.objects.filter(
                is_active=True, role=UserRole.CITIZEN
            ).annotate(
                rank=Window(expression=Rank(), order_by=F('total_points').desc())
            ).get(pk=user.pk)
            return user_with_rank
        except User.DoesNotExist:
            # This can happen if the user is not a CITIZEN or if there's an issue.
            # Fallback to the original user object and set rank to None.
            user.rank = None 
            return user


class LotteryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LotterySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Lottery.objects.select_related('sponsor', 'winner', 'municipality').all().order_by('-end_date')