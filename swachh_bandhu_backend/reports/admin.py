# reports/admin.py
from django.contrib import admin
from .models import Report, ReportMedia

class ReportMediaInline(admin.TabularInline):
    """Allows editing media directly from the report admin page."""
    model = ReportMedia
    extra = 1 # Show one extra empty slot for new media
    readonly_fields = ('uploaded_at',)

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'location', 'issue_type', 'status', 'verifies_report', 'created_at')
    list_editable = ['status'] # Allow direct status changes from the list view
    
    # Add actions to the dropdown
    actions = ['mark_as_verified', 'mark_as_rejected']

    list_filter = ('status', 'location__name', 'created_at')
    search_fields = ('user__email', 'location__name', 'description')
    ordering = ('-created_at',)
    inlines = [ReportMediaInline]
    
    # Make fields read-only that should not be changed in the admin
    readonly_fields = ('user', 'location', 'created_at', 'updated_at')

    @admin.action(description='Mark selected reports as VERIFIED')
    def mark_as_verified(self, request, queryset):
        queryset.update(status=Report.ReportStatus.VERIFIED)
        self.message_user(request, "Selected reports have been marked as verified.")

    @admin.action(description='Mark selected reports as REJECTED')
    def mark_as_rejected(self, request, queryset):
        queryset.update(status=Report.ReportStatus.REJECTED)
        self.message_user(request, "Selected reports have been marked as rejected.")