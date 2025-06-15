from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer as BaseTokenObtainPairSerializer
from django.conf import settings
from notifications.tasks import send_email_task

User = get_user_model()

class TokenObtainPairSerializer(BaseTokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['role'] = user.role
        if user.municipality:
            token['municipality_id'] = str(user.municipality.id)
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label=_("Confirm Password"))

    class Meta:
        model = User
        fields = ('email', 'full_name', 'password', 'password2', 'phone_number')
        extra_kwargs = {
            'phone_number': {'required': False}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": _("Password fields didn't match.")})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    municipality_name = serializers.CharField(source='municipality.name', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone_number', 'role', 'total_points', 'municipality', 'municipality_name', 'date_joined')
        read_only_fields = ('role', 'total_points', 'municipality', 'municipality_name', 'date_joined')

class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(label=_("Email Address"))

    def validate_email(self, value):
        try:
            self.user = User.objects.get(email=value, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User with this email does not exist or is not active."))
        return value

    def save(self):
        user = self.user
        token = user.generate_password_reset_token()
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}"
        
        email_subject = "Password Reset Request for Swachh Bandhu"
        email_body = (
            f"Hello {user.full_name},\n\n"
            f"You requested a password reset. Please click the link below to set a new password:\n{reset_url}\n\n"
            f"If you did not request this, please ignore this email.\n"
            f"This link will expire in {getattr(settings, 'PASSWORD_RESET_TIMEOUT_HOURS', 1)} hour(s).\n\n"
            "Thanks,\nThe Swachh Bandhu Team"
        )
        
        send_email_task.delay(email_subject, email_body, [user.email])
        return {"message": _("Password reset link has been sent to your email.")}

class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({"new_password": _("Passwords didn't match.")})
        
        try:
            self.user = User.objects.get(password_reset_token=attrs['token'])
            if not self.user.is_password_reset_token_valid():
                raise serializers.ValidationError(_("Password reset link is invalid or has expired."))
        except User.DoesNotExist:
            raise serializers.ValidationError(_("Invalid password reset token."))
        
        return attrs

    def save(self):
        self.user.set_password(self.validated_data['new_password'])
        self.user.clear_password_reset_token()
        self.user.save()
        return {"message": _("Password has been reset successfully.")}

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'phone_number']