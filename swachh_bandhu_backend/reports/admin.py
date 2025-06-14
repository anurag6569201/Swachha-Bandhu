from django.contrib import admin
from .models import Report, ReportMedia

class ReportMediaInline(admin.TabularInline):
    model = ReportMedia
    extra = 1
    readonly_fields = ('uploaded_at',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'location', 'issue_type', 'status', 'created_at')
    list_filter = ('status', 'location__municipality', 'location__location_type', 'created_at')
    search_fields = ('user__email', 'location__name', 'description')
    ordering = ('-created_at',)
    
    inlines = [ReportMediaInline]
    
    readonly_fields = ('user', 'location', 'verifies_report', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Report Details', {
            'fields': ('user', 'location', 'issue_type', 'description', 'verifies_report')
        }),
        ('Status & Moderation', {
            'fields': ('status', 'moderator_notes', 'action_taken_notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_verified', 'mark_as_rejected', 'mark_as_actioned']

    @admin.action(description='Mark selected reports as VERIFIED')
    def mark_as_verified(self, request, queryset):
        queryset.update(status=Report.ReportStatus.VERIFIED)

    @admin.action(description='Mark selected reports as REJECTED')
    def mark_as_rejected(self, request, queryset):
        queryset.update(status=Report.ReportStatus.REJECTED)

    @admin.action(description='Mark selected reports as ACTIONED')
    def mark_as_actioned(self, request, queryset):
        queryset.update(status=Report.ReportStatus.ACTIONED)