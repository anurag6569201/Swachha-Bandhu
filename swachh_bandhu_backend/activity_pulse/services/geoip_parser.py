# activity_pulse/services/geoip_parser.py

import logging
import geoip2.database
from geoip2.errors import AddressNotFoundError

logger = logging.getLogger(__name__)
_reader = None

def _get_reader(config):
    """Initializes the GeoIP reader singleton."""
    global _reader
    if _reader:
        return _reader
    
    db_path = config.get('GEOIP_DATABASE_PATH')
    if not db_path:
        logger.warning("[Activity Pulse] GEOIP_DATABASE_PATH not set. Geolocation is disabled.")
        return None
        
    try:
        _reader = geoip2.database.Reader(db_path)
        return _reader
    except FileNotFoundError:
        logger.error(f"[Activity Pulse] GeoIP database not found at '{db_path}'.")
        return None
    except Exception as e:
        logger.error(f"[Activity Pulse] Failed to load GeoIP database: {e}")
        return None

def geolocate_ip(ip_address, config):
    """Geolocates an IP address and returns a dictionary."""
    data = {'country': '', 'city': ''}
    if not ip_address:
        return data

    reader = _get_reader(config)
    if not reader:
        return data

    try:
        response = reader.city(ip_address)
        data['country'] = response.country.name or ''
        data['city'] = response.city.name or ''
    except AddressNotFoundError:
        logger.debug(f"IP address not found in GeoIP database: {ip_address}")
    except Exception as e:
        logger.error(f"Error during IP geolocation for {ip_address}: {e}")
    
    return data