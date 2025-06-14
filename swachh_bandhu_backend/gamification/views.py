from rest_framework import generics, views, viewsets, permissions
from rest_framework.response import Response
from django.db.models.expressions import Window
from django.db.models.functions import Rank
from django.db.models import F
from django.utils import timezone
from users.models import User
from .models import UserBadge, Lottery
from .serializers import LeaderboardUserSerializer, UserBadgeSerializer, LotterySerializer

class LeaderboardView(generics.ListAPIView):
    serializer_class = LeaderboardUserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(
            is_active=True, role=User.UserRole.CITIZEN
        ).annotate(
            rank=Window(expression=Rank(), order_by=F('total_points').desc())
        ).order_by('rank', 'date_joined')[:100]

class UserGamificationProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        earned_badges = user.earned_badges.all()
        badges_serializer = UserBadgeSerializer(earned_badges, many=True)
        
        data = {
            'total_points': user.total_points,
            'badges': badges_serializer.data,
            'reports_count': user.reports.filter(verifies_report__isnull=True).count(),
            'verifications_count': user.reports.filter(verifies_report__isnull=False).count()
        }
        return Response(data)

class LotteryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Lottery.objects.filter(end_date__gte=timezone.now()).order_by('end_date')
    serializer_class = LotterySerializer
    permission_classes = [permissions.IsAuthenticated]