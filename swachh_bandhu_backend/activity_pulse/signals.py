from django.dispatch import Signal

# Signal sent when a user's online status (True/False) changes.
# providing_args: ["user", "is_online"]
user_online_status_changed = Signal()

# Signal sent after a page view or API call is logged.
# providing_args: ["user", "log_instance"]
page_view_logged = Signal()