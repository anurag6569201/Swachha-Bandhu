# activity_pulse/admin.py

from django.contrib import admin
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.utils.translation import gettext_lazy as _
from .models import Session, PageView, Event, Goal, AnalyticsDashboard

@admin.register(AnalyticsDashboard)
class AnalyticsDashboardAdmin(admin.ModelAdmin):
    """Provides the redirect link in the admin."""
    def changelist_view(self, request, extra_context=None):
        return HttpResponseRedirect(reverse('activity_pulse:dashboard'))

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'started_at', 'duration', 'country', 'referrer_domain', 'utm_campaign')
    list_filter = ('started_at', 'is_mobile', 'is_tablet', 'is_pc', 'referrer_domain', 'utm_source', 'utm_medium')
    search_fields = ('user__username', 'ip_address', 'user_agent', 'utm_campaign', 'path')
    readonly_fields = [f.name for f in Session._meta.fields]
    date_hierarchy = 'started_at'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'path', 'session_user', 'time_on_page_seconds')
    list_filter = ('timestamp',)
    search_fields = ('path', 'session__user__username')
    readonly_fields = [f.name for f in PageView._meta.fields]
    date_hierarchy = 'timestamp'
    
    @admin.display(description=_('User'))
    def session_user(self, obj):
        return obj.session.user
        
    def has_add_permission(self, request):
        return False

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'name', 'session_user')
    list_filter = ('timestamp', 'name')
    search_fields = ('name', 'session__user__username')
    readonly_fields = [f.name for f in Event._meta.fields]
    date_hierarchy = 'timestamp'
    
    @admin.display(description=_('User'))
    def session_user(self, obj):
        return obj.session.user

    def has_add_permission(self, request):
        return False

@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ('name', 'event_name', 'created_at')
    search_fields = ('name', 'event_name')