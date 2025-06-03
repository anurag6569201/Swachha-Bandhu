# users/urls.py
from django.urls import path
from .views import (
    RegisterView, 
    MyTokenObtainPairView, # Use this for login
    LogoutView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    UserProfileView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', MyTokenObtainPairView.as_view(), name='auth_login'), # Changed
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/verify/', TokenVerifyView.as_view(), name='token_verify'), # Optional

    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'), # The token will be in the POST body

    path('profile/', UserProfileView.as_view(), name='user_profile'), # Example protected route
]