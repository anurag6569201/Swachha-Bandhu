from django.apps import AppConfig

class ActivityPulseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'activity_pulse'
    verbose_name = 'Django Activity Pulse'

    def ready(self):
        pass