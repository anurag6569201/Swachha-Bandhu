# gamification/serializers.py
from rest_framework import serializers
from users.models import User
from .models import Badge, UserBadge

class LeaderboardUserSerializer(serializers.ModelSerializer):
    """Serializer for displaying users on the leaderboard."""
    class Meta:
        model = User
        fields = ['id', 'full_name', 'total_points']

class BadgeSerializer(serializers.ModelSerializer):
    """Serializer for Badge details."""
    class Meta:
        model = Badge
        fields = ['name', 'description', 'icon_url']

class UserBadgeSerializer(serializers.ModelSerializer):
    """Serializer for displaying a user's earned badges."""
    badge = BadgeSerializer(read_only=True)
    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_at']