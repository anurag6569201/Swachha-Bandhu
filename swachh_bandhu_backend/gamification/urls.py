from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaderboardViewSet, UserProfileStatsView, LotteryViewSet

router = DefaultRouter()
router.register(r'leaderboard', LeaderboardViewSet, basename='leaderboard')
router.register(r'lotteries', LotteryViewSet, basename='lottery')

urlpatterns = [
    path('profile-stats/', UserProfileStatsView.as_view(), name='user-gamification-profile'),
    path('', include(router.urls)),
]