# reports/receivers.py
from django.dispatch import receiver
from activity_pulse.signals import user_online_status_changed

@receiver(user_online_status_changed)
def on_user_online_status_change(sender, user, is_online, **kwargs):
    """
    Receiver function to handle when a user's online status changes.
    """
    if is_online:
        print(f"✅ User '{user.get_username()}' just came ONLINE.")
    else:
        # Note: The 'offline' event is harder to trigger reliably in a live setting
        # as it depends on a request being made *after* the timeout has passed.
        print(f"❌ User '{user.get_username()}' is now considered OFFLINE.")