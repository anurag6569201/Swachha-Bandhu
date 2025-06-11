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
    list_display = ('id', 'user', 'location', 'issue_type', 'status', 'created_at')
    list_filter = ('status', 'location__name', 'created_at')
    search_fields = ('user__email', 'location__name', 'description')
    ordering = ('-created_at',)
    inlines = [ReportMediaInline]
    
    # Make fields read-only that should not be changed in the admin
    readonly_fields = ('user', 'location', 'created_at', 'updated_at')