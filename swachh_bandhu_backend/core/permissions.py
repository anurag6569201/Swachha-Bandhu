# core/permissions.py
from rest_framework.permissions import BasePermission

class IsAdminOrModerator(BasePermission):
    """
    Allows access only to admin or staff users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff