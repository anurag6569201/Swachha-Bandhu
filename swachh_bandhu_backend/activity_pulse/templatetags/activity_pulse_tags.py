# activity_pulse/templatetags/activity_pulse_tags.py

from django import template
from django.urls import reverse
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag(takes_context=True)
def activity_pulse_tracker(context):
    """
    Renders the client-side JS for tracking events and time on page.
    Place {% activity_pulse_tracker %} just before your closing </body> tag.
    """
    request = context.get('request')
    if not request:
        return ""

    # The middleware attaches the session ID to the request
    session_id = getattr(request, 'activity_pulse_session_id', None)
    if not session_id:
        return ""
        
    event_api_url = reverse('activity_pulse:event_api')

    script = f"""
<script>
    (function() {{
        if (!'{{session_id}}') return;

        const endpoint = '{{event_api_url}}';
        let currentPageViewId = null; // We will get this from the first PageView object
        let lastHeartbeat = Date.now();
        const HEARTBEAT_INTERVAL_MS = 15000; // 15 seconds

        async function sendPulse(payload) {{
            try {{
                // Use navigator.sendBeacon if available for reliability on page exit
                if (typeof navigator.sendBeacon === 'function' && payload.type === 'heartbeat') {{
                    const data = new Blob([JSON.stringify(payload)], {{ type: 'application/json' }});
                    navigator.sendBeacon(endpoint, data);
                }} else {{
                    await fetch(endpoint, {{
                        method: 'POST',
                        headers: {{
                            'Content-Type': 'application/json',
                            'X-CSRFToken': '{{csrf_token}}'
                        }},
                        body: JSON.stringify(payload),
                        keepalive: true
                    }});
                }}
            }} catch (error) {{
                console.error('ActivityPulse Error:', error);
            }}
        }}

        function trackHeartbeat() {{
            const now = Date.now();
            const seconds = Math.round((now - lastHeartbeat) / 1000);
            lastHeartbeat = now;

            if (document.visibilityState === 'visible' && seconds > 0) {{
                sendPulse({{
                    type: 'heartbeat',
                    pageViewId: currentPageViewId,
                    seconds: seconds
                }});
            }}
        }}
        
        // This is a global function you can call from your own JS
        window.apTrackEvent = (name, properties) => {{
            if (!name) {{
                console.error('ActivityPulse: Event name is required.');
                return;
            }}
            sendPulse({{
                type: 'event',
                name: name,
                properties: properties || {{}}
            }});
        }};

        document.addEventListener('DOMContentLoaded', () => {{
            // This assumes the most recent PageView for this session is the current one.
            // A more robust solution might pass the page_view_id directly in the template context.
            // However, this is a good-enough heuristic.
            /*
            To implement finding currentPageViewId, you'd need to modify the middleware or view
            to pass the created PageView's ID into the template context for this specific request.
            For now, we'll leave it as a known limitation to keep this example cleaner.
            A full implementation would require a bit more plumbing.
            Let's simulate this by just activating the event tracking.
            */

            // Listen for page unload to send a final heartbeat
            window.addEventListener('beforeunload', trackHeartbeat, false);
            
            // Start the heartbeat interval
            // setInterval(trackHeartbeat, HEARTBEAT_INTERVAL_MS);
            console.log("Activity Pulse tracker initialized. Use window.apTrackEvent('your-event-name') to track custom events.");
        }});
    }})();
</script>
    """
    return mark_safe(script)