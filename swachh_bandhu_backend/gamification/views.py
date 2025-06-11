# gamification/views.py
from rest_framework import generics, permissions, views
from rest_framework.response import Response
from users.models import User
from .models import UserBadge
from .serializers import LeaderboardUserSerializer, UserBadgeSerializer

class LeaderboardView(generics.ListAPIView):
    """
    Provides a ranked list of top users based on total points.
    """
    queryset = User.objects.filter(is_active=True).order_by('-total_points', 'full_name')[:100]
    serializer_class = LeaderboardUserSerializer
    permission_classes = [permissions.IsAuthenticated] # Or AllowAny if it's a public leaderboard


class UserProfileDataView(views.APIView):
    """
    Provides a consolidated view of the current user's gamification stats.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        earned_badges = user.earned_badges.all()
        badges_serializer = UserBadgeSerializer(earned_badges, many=True)
        
        data = {
            'id': user.id,
            'full_name': user.full_name,
            'email': user.email,
            'total_points': user.total_points,
            'badges': badges_serializer.data
        }
        return Response(data)