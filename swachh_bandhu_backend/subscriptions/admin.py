from django.contrib import admin
from .models import SubscriptionPlan, Municipality

@admin.register(SubscriptionPlan)
class SubscriptionPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_per_month', 'max_locations', 'max_admins', 'analytics_access', 'is_active')
    list_filter = ('is_active', 'analytics_access')
    search_fields = ('name',)

@admin.register(Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'state', 'plan', 'subscribed_until', 'is_active', 'is_subscription_active')
    list_filter = ('is_active', 'state', 'plan')
    search_fields = ('name', 'city')
    ordering = ('state', 'name')

    @admin.display(boolean=True, description='Subscription Current?')
    def is_subscription_active(self, obj):
        return obj.is_subscription_active