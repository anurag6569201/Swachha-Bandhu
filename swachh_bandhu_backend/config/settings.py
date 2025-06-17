import os
from pathlib import Path
from decouple import config, Csv
import dj_database_url
from datetime import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',

    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'drf_spectacular',
    'mapwidgets',

    'core.apps.CoreConfig',
    'users.apps.UsersConfig',
    'subscriptions.apps.SubscriptionsConfig',
    'locations.apps.LocationsConfig',
    'reports.apps.ReportsConfig',
    'gamification.apps.GamificationConfig',
    'notifications.apps.NotificationsConfig',
    'dashboard.apps.DashboardConfig',
    'activity_pulse.apps.ActivityPulseConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'activity_pulse.middleware.ActivityPulseMiddleware', # package testing middleware
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        engine='django.contrib.gis.db.backends.postgis'
    )
}

if 'azure.com' in DATABASES['default'].get('HOST', ''):
    DATABASES['default']['OPTIONS'] = {'sslmode': 'require'}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'users.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('rest_framework_simplejwt.authentication.JWTAuthentication',),
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated',],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=config('ACCESS_TOKEN_LIFETIME', default=15, cast=int)),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=config('REFRESH_TOKEN_LIFETIME', default=7, cast=int)),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=Csv())

SPECTACULAR_SETTINGS = {
    'TITLE': 'Swachh Bandhu API',
    'DESCRIPTION': 'Advanced API for the Swachh Bandhu civic reporting application, featuring gamification, municipal dashboards, and role-based access.',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}

FRONTEND_URL = config('FRONTEND_URL')
PASSWORD_RESET_TIMEOUT_HOURS = config('PASSWORD_RESET_TIMEOUT_HOURS', default=1, cast=int)
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@swachhbandhu.com')

MAX_VERIFICATION_DISTANCE_METERS = config('MAX_VERIFICATION_DISTANCE_METERS', default=50, cast=int)
MIN_DISTANCE_BETWEEN_REPORTS_METERS = config('MIN_DISTANCE_BETWEEN_REPORTS_METERS', default=10, cast=int)

MAP_WIDGETS = {
    "GoogleMap": {
        "apiKey": config("GOOGLE_MAPS_API_KEY"),
        "PointField": {"interactive": {"mapOptions": {"zoom": 15}}}
    },
}

GDAL_LIBRARY_PATH = config('GDAL_LIBRARY_PATH', default='')
GEOS_LIBRARY_PATH = config('GEOS_LIBRARY_PATH', default='')

POINTS_FOR_INITIAL_REPORT = config('POINTS_FOR_INITIAL_REPORT', default=10, cast=int)
POINTS_FOR_PEER_VERIFICATION = config('POINTS_FOR_PEER_VERIFICATION', default=5, cast=int)
PENALTY_FOR_FAKE_REPORT = config('PENALTY_FOR_FAKE_REPORT', default=-50, cast=int)

CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE
CELERY_BEAT_SCHEDULE = {
    'run-daily-lottery-draw': {
        'task': 'gamification.tasks.run_daily_lottery_draw',
        'schedule': timedelta(days=1),
    },
    'check-subscription-status': {
        'task': 'subscriptions.tasks.check_municipal_subscriptions',
        'schedule': timedelta(hours=24),
    },
}



# --- DJANGO ACTIVITY PULSE CONFIGURATION ---

ACTIVITY_PULSE_SETTINGS = {
    # How many seconds of inactivity marks the end of a session.
    'SESSION_TIMEOUT_SECONDS': 1800,  # 30 minutes

    # A path to the GeoLite2 City database (.mmdb file) from MaxMind for IP geolocation.
    # Download it from: https://www.maxmind.com/en/geolite2/signup
    # Example: 'path/to/your/GeoLite2-City.mmdb'
    'GEOIP_DATABASE_PATH': BASE_DIR / 'data' / 'GeoLite2-City.mmdb',

    # Anonymize IP addresses by masking the last octet (e.g., 192.168.1.1 -> 192.168.1.0).
    'ANONYMIZE_IP': True,

    # List of URL path prefixes (not regex) to consider as API calls.
    'API_PREFIXES': ['/api/', '/graphql/'],

    # List of user agents to ignore (e.g., bots and crawlers). Uses regex matching.
    'EXCLUDE_USER_AGENTS': [
        r'.*?bot.*?',
        r'.*?crawler.*?',
        r'.*?spider.*?',
        r'python-requests',
        r'UptimeRobot.*?',
    ],

    # List of URL paths (as regular expressions) to exclude from all tracking.
    'EXCLUDE_PATHS': [
        r'^/admin/.*',
        r'^/activity-pulse/.*', # Exclude the dashboard itself
    ],

    # If True, events and page views from superusers will be tracked.
    'TRACK_SUPERUSERS': False,

    # If True, events and page views from staff users will be tracked.
    'TRACK_STAFF': False,
    
    # The timezone for reporting. Defaults to Django's TIME_ZONE.
    'REPORTING_TIMEZONE': TIME_ZONE,
}