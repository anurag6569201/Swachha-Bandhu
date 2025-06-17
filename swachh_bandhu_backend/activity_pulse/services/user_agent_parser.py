# activity_pulse/services/user_agent_parser.py

from user_agents import parse

def parse_user_agent(user_agent_string):
    """Parses a user agent string and returns a dictionary of data."""
    ua = parse(user_agent_string)
    return {
        'browser_family': ua.browser.family,
        'browser_version': ua.browser.version_string,
        'os_family': ua.os.family,
        'os_version': ua.os.version_string,
        'device_family': ua.device.family,
        'device_brand': ua.device.brand,
        'device_model': ua.device.model,
        'is_mobile': ua.is_mobile,
        'is_tablet': ua.is_tablet,
        'is_pc': ua.is_pc,
        'is_touch': ua.is_touch_capable,
    }