from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'full_name', 'role', 'municipality', 'total_points', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff', 'municipality')
    search_fields = ('email', 'full_name')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone_number')}),
        ('Role & Affiliation', {'fields': ('role', 'municipality')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Gamification', {'fields': ('total_points',)}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password', 'password2'),
        }),
    )
    
    readonly_fields = ('last_login', 'date_joined')