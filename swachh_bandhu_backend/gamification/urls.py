# gamification/urls.py
from django.urls import path
from .views import LeaderboardView, UserProfileDataView

urlpatterns = [
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('profile/stats/', UserProfileDataView.as_view(), name='user-profile-stats'),
]