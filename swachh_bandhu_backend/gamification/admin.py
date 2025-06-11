# gamification/admin.py
from django.contrib import admin
from .models import PointLog, Badge, UserBadge

@admin.register(PointLog)
class PointLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'reason', 'timestamp', 'source_object')
    list_filter = ('reason', 'timestamp')
    search_fields = ('user__email',)

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'required_points', 'required_reports')
    search_fields = ('name', 'description')

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    search_fields = ('user__email', 'badge__name')