from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaderboardView, UserGamificationProfileView, LotteryViewSet

router = DefaultRouter()
router.register(r'lotteries', LotteryViewSet, basename='lottery')

urlpatterns = [
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('profile-stats/', UserGamificationProfileView.as_view(), name='user-gamification-profile'),
    path('', include(router.urls)),
]