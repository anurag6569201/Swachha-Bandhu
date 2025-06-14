from django.contrib import admin
from .models import Sponsor, PointLog, Badge, UserBadge, Lottery, LotteryTicket

@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)

@admin.register(PointLog)
class PointLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'reason', 'timestamp')
    list_filter = ('reason', 'timestamp')
    search_fields = ('user__email',)
    date_hierarchy = 'timestamp'

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'required_points', 'required_reports', 'required_verifications')
    search_fields = ('name',)

@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    search_fields = ('user__email', 'badge__name')
    list_filter = ('badge',)
    date_hierarchy = 'earned_at'

@admin.register(Lottery)
class LotteryAdmin(admin.ModelAdmin):
    list_display = ('name', 'municipality', 'sponsor', 'start_date', 'end_date', 'is_active', 'winner')
    list_filter = ('is_active', 'sponsor', 'municipality')
    search_fields = ('name', 'description')

@admin.register(LotteryTicket)
class LotteryTicketAdmin(admin.ModelAdmin):
    list_display = ('user', 'lottery', 'report_id', 'created_at')
    list_filter = ('lottery',)
    search_fields = ('user__email', 'lottery__name')
    
    def report_id(self, obj):
        return obj.report.id