from rest_framework.permissions import BasePermission
from users.models import UserRole

class IsAdminOrStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.SUPER_ADMIN, UserRole.MUNICIPAL_ADMIN]
        )

class IsMunicipalAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.MUNICIPAL_ADMIN
        )

class IsModerator(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role in [UserRole.MODERATOR, UserRole.MUNICIPAL_ADMIN, UserRole.SUPER_ADMIN]
        )

class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.SUPER_ADMIN
        )

class IsCitizen(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == UserRole.CITIZEN
        )