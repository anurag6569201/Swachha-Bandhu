from django.contrib import admin
from .models import IssueCategory, ReportedIssue, IssueMedia

@admin.register(IssueCategory)
class IssueCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

class IssueMediaInline(admin.TabularInline):
    model = IssueMedia
    extra = 1 # Number of empty forms to display
    readonly_fields = ('uploaded_at',)

@admin.register(ReportedIssue)
class ReportedIssueAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'status', 'timestamp', 'latitude', 'longitude', 'is_verified_by_peer')
    list_filter = ('status', 'category', 'timestamp', 'is_verified_by_peer')
    search_fields = ('user__email', 'description', 'id', 'qr_code_identifier')
    readonly_fields = ('timestamp', 'id')
    inlines = [IssueMediaInline]
    fieldsets = (
        (None, {
            'fields': ('id', 'user', 'category', 'description', 'status')
        }),
        ('Location Details', {
            'fields': ('latitude', 'longitude', 'address', 'reporter_latitude_at_submission', 'reporter_longitude_at_submission')
        }),
        ('Source and Verification', {
            'fields': ('qr_code_identifier', 'is_verified_by_peer', 'verification_timestamp')
        }),
        ('Timestamps', {
            'fields': ('timestamp',)
        }),
    )

@admin.register(IssueMedia)
class IssueMediaAdmin(admin.ModelAdmin):
    list_display = ('id', 'issue_id_display', 'media_type', 'file', 'uploaded_at')
    list_filter = ('media_type',)
    search_fields = ('issue__id', 'issue__description')
    readonly_fields = ('uploaded_at', 'id')

    def issue_id_display(self, obj):
        return obj.issue.id
    issue_id_display.short_description = 'Issue ID'