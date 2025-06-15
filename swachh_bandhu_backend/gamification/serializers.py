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
    winner_name = serializers.CharField(source='winner.full_name', read_only=True, allow_null=True)
    municipality_name = serializers.CharField(source='municipality.name', read_only=True)

    class Meta:
        model = Lottery
        fields = ['id', 'name', 'description', 'sponsor', 'municipality_name', 'end_date', 'winner_name', 'drawn_at']

class UserProfileStatsSerializer(serializers.ModelSerializer):
    rank = serializers.SerializerMethodField()
    earned_badges = UserBadgeSerializer(many=True, read_only=True, source='userbadge_set')

    class Meta:
        model = User
        fields = ['id', 'full_name', 'total_points', 'rank', 'earned_badges']

    def get_rank(self, obj):
        all_users = User.objects.filter(
            is_active=True, role='CITIZEN'
        ).order_by('-total_points')
        
        user_ids = list(all_users.values_list('id', flat=True))
        
        try:
            rank = user_ids.index(obj.id) + 1
            return rank
        except ValueError:
            return None