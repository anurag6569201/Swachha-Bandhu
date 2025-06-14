from rest_framework import serializers
from users.models import User
from .models import Badge, UserBadge, Lottery, Sponsor

class LeaderboardUserSerializer(serializers.ModelSerializer):
    rank = serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'full_name', 'total_points', 'rank']

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ['name', 'description', 'icon']

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_at']

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = ['name', 'logo', 'website', 'description']

class LotterySerializer(serializers.ModelSerializer):
    sponsor = SponsorSerializer(read_only=True)
    winner_name = serializers.CharField(source='winner.full_name', read_only=True, default=None)
    municipality_name = serializers.CharField(source='municipality.name', read_only=True)
    class Meta:
        model = Lottery
        fields = ['id', 'name', 'description', 'sponsor', 'municipality_name', 'end_date', 'winner_name', 'drawn_at']