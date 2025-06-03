# users/serializers.py
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.tokens import default_token_generator # Using Django's default for this example
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

User = get_user_model()

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name
        # Add other claims if needed
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        # user.set_password(validated_data['password']) # create_user handles this
        # user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'date_joined') # Add other fields you want to expose

# --- Password Reset Serializers ---
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User with this email does not exist or is not active."))
        return value

    def save(self):
        user = self.user
        token = user.generate_password_reset_token()
        
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}/"
        
        email_subject = "Password Reset Request for Swachh Bandhu"
        email_body = (
            f"Hello {user.full_name},\n\n"
            f"You requested a password reset for your Swachh Bandhu account.\n"
            f"Please click the link below to set a new password:\n"
            f"{reset_url}\n\n"
            f"If you did not request this, please ignore this email.\n"
            f"This link will expire in {settings.PASSWORD_RESET_TIMEOUT_HOURS} hour(s).\n\n"
            "Thanks,\nThe Swachh Bandhu Team"
        )
        
        send_mail(
            email_subject,
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        return {"message": "Password reset link sent to your email."}


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({"new_password": "Passwords didn't match."})
        
        try:
            # No decoding needed if token is sent as is from email
            self.user = User.objects.get(password_reset_token=attrs['token'])
            if not self.user.is_password_reset_token_valid():
                raise serializers.ValidationError(_("Password reset link is invalid or has expired."))
        except User.DoesNotExist:
            raise serializers.ValidationError(_("Invalid password reset token."))
        
        return attrs

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.clear_password_reset_token() # Clear the token
        self.user.save()
        return {"message": "Password has been reset successfully."}