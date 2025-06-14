import uuid
import secrets
from datetime import timedelta
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from subscriptions.models import Municipality

class UserRole(models.TextChoices):
    CITIZEN = 'CITIZEN', _('Citizen')
    MODERATOR = 'MODERATOR', _('Moderator')
    MUNICIPAL_ADMIN = 'MUNICIPAL_ADMIN', _('Municipal Admin')
    SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email field must be set'))
        if not full_name:
            raise ValueError(_('The Full Name field must be set'))
        
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('role', UserRole.SUPER_ADMIN)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        
        return self.create_user(email, full_name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_('email address'), unique=True)
    full_name = models.CharField(_('full name'), max_length=150)
    phone_number = models.CharField(_('phone number'), max_length=20, blank=True, null=True)
    
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.CITIZEN
    )
    municipality = models.ForeignKey(
        Municipality,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='staff_members',
        help_text=_("Required for Admins and Moderators.")
    )
    
    total_points = models.IntegerField(default=0, db_index=True)
    
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    password_reset_token = models.CharField(max_length=100, blank=True, null=True, unique=True)
    password_reset_token_created_at = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    def generate_password_reset_token(self):
        self.password_reset_token = secrets.token_urlsafe(32)
        self.password_reset_token_created_at = timezone.now()
        self.save(update_fields=['password_reset_token', 'password_reset_token_created_at'])
        return self.password_reset_token

    def is_password_reset_token_valid(self):
        if not self.password_reset_token_created_at:
            return False
        timeout_hours = getattr(settings, 'PASSWORD_RESET_TIMEOUT_HOURS', 1)
        expiry_duration = timedelta(hours=timeout_hours)
        return (timezone.now() < self.password_reset_token_created_at + expiry_duration)

    def clear_password_reset_token(self):
        self.password_reset_token = None
        self.password_reset_token_created_at = None
        self.save(update_fields=['password_reset_token', 'password_reset_token_created_at'])