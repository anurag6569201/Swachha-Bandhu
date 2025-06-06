import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2c3e50',
  },
  mapWrapper: {
    flex: 1,
    height: '100%',
  },
  infoPanel: {
    width: '380px',
    height: '100%',
    backgroundColor: '#34495e',
    color: '#ecf0f1',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-5px 0 15px rgba(0,0,0,0.3)',
    transition: 'width 0.3s ease',
  },
  panelHeader: {
    borderBottom: '2px solid #7f8c8d',
    paddingBottom: '15px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  panelTitle: {
    margin: '0',
    fontSize: '24px',
    color: '#1abc9c',
  },
  panelSubtitle: {
    margin: '5px 0 0',
    fontSize: '14px',
    color: '#bdc3c7',
  },
  section: {
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#16a085',
    borderBottom: '1px solid #34495e',
    paddingBottom: '8px',
  },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '15px',
    borderBottom: '1px solid #34495e',
  },
  dataLabel: {
    fontWeight: 'bold',
    color: '#95a5a6',
  },
  dataValue: {
    color: '#ecf0f1',
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },
  statusMessageBase: {
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    margin: '0 0 20px 0',
  },
  statusLoading: {
    backgroundColor: '#f39c12',
    color: '#fff',
  },
  statusDenied: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  statusError: {
    backgroundColor: '#c0392b',
    color: '#fff',
  },
  statusSuccess: {
    backgroundColor: '#27ae60',
    color: '#fff',
  },
  geofenceItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #34495e',
  },
  geofenceName: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  geofenceStatus: {
    padding: '5px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  statusInside: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  statusOutside: {
    backgroundColor: '#95a5a6',
    color: '#2c3e50',
  },
  logContainer: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  logList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
    flex: '1',
    overflowY: 'auto',
    maxHeight: '200px',
  },
  logItem: {
    backgroundColor: '#34495e',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '13px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  logText: {
    color: '#bdc3c7',
  },
  logTimestamp: {
    color: '#7f8c8d',
    fontSize: '11px',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#1abc9c',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
    marginTop: 'auto',
  },
  buttonHover: {
    backgroundColor: '#16a085',
  },
  userMarkerSvg: {
    width: '32px',
    height: '32px',
    fill: '#2980b9',
    stroke: '#ffffff',
    strokeWidth: '2',
    filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.7))',
    transition: 'transform 0.5s linear',
  },
};

const GEOFENCE_ZONES = [
  {
    id: 'zone_a',
    name: 'Headquarters',
    center: [34.052235, -118.243683],
    radius: 250,
    color: 'blue',
  },
  {
    id: 'zone_b',
    name: 'Warehouse District',
    center: [34.0384, -118.2355],
    radius: 400,
    color: 'orange',
  },
  {
    id: 'zone_c',
    name: 'Restricted Airspace',
    center: [34.065, -118.25],
    radius: 150,
    color: 'red',
  },
];

const INITIAL_MAP_STATE = {
  center: [34.0522, -118.2437],
  zoom: 13,
};

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371e3;
  const lat1 = coords1[0];
  const lon1 = coords1[1];
  const lat2 = coords2[0];
  const lon2 = coords2[1];

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const formatCoordinate = (coord) => coord?.toFixed(6) || 'N/A';
const formatSpeed = (speed) => (speed ? `${(speed * 3.6).toFixed(2)} km/h` : '0.00 km/h');
const formatAccuracy = (acc) => (acc ? `${acc.toFixed(2)} m` : 'N/A');
const formatHeading = (head) => (head !== null && head >= 0 ? `${head.toFixed(1)}°` : 'N/A');

const MapController = ({ center, zoom, recenterMap }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
};

const UserMarker = ({ position, heading }) => {
  if (!position) return null;

  const iconAngle = heading || 0;
  const userIcon = new L.DivIcon({
    html: `<svg style="transform: rotate(${iconAngle}deg);" viewbox="0 0 24 24" width="32" height="32" fill="#2980b9" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0px 0px 3px rgba(0,0,0,0.7))"><path d="M12 2L19 21 12 17 5 21 12 2z"></path></svg>`,
    className: 'user-marker-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        You are here. <br /> Heading: {formatHeading(heading)}
      </Popup>
    </Marker>
  );
};

const StatusDisplay = ({ status, error }) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'idle':
        return { style: styles.statusLoading, text: 'Initializing Geolocation...' };
      case 'loading':
        return { style: styles.statusLoading, text: 'Acquiring your position...' };
      case 'denied':
        return { style: styles.statusDenied, text: 'Location access was denied. Please enable it in your browser settings.' };
      case 'error':
        return { style: styles.statusError, text: `Error: ${error?.message || 'An unknown error occurred.'}` };
      case 'success':
        return { style: styles.statusSuccess, text: 'Live position tracking active.' };
      default:
        return { style: {}, text: '' };
    }
  };

  const { style, text } = getStatusMessage();

  return <div style={{...styles.statusMessageBase, ...style}}>{text}</div>;
};

const GeofenceStatusList = ({ geofenceStatus }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Geofence Status</h3>
    {GEOFENCE_ZONES.map((zone) => (
      <div key={zone.id} style={styles.geofenceItem}>
        <span style={{ ...styles.geofenceName, color: zone.color }}>
          {zone.name}
        </span>
        <span style={{
          ...styles.geofenceStatus,
          ...(geofenceStatus[zone.id] ? styles.statusInside : styles.statusOutside)
        }}>
          {geofenceStatus[zone.id] ? 'INSIDE' : 'OUTSIDE'}
        </span>
      </div>
    ))}
  </div>
);

const EventLog = ({ logs }) => (
  <div style={{ ...styles.section, ...styles.logContainer }}>
    <h3 style={styles.sectionTitle}>Event Log</h3>
    <ul style={styles.logList}>
      {logs.length === 0 ? (
        <li style={styles.logItem}>
          <span style={styles.logText}>No geofence events yet.</span>
        </li>
      ) : (
        logs.map((log) => (
          <li key={log.id} style={styles.logItem}>
            <span style={styles.logText}>{log.message}</span>
            <span style={styles.logTimestamp}>{log.timestamp}</span>
          </li>
        ))
      )}
    </ul>
  </div>
);

const PositionDetails = ({ position, accuracy, speed, heading }) => (
  <div style={styles.section}>
    <h3 style={styles.sectionTitle}>Live Position Data</h3>
    <div style={styles.dataRow}>
      <span style={styles.dataLabel}>Latitude:</span>
      <span style={styles.dataValue}>{formatCoordinate(position?.[0])}</span>
    </div>
    <div style={styles.dataRow}>
      <span style={styles.dataLabel}>Longitude:</span>
      <span style={styles.dataValue}>{formatCoordinate(position?.[1])}</span>
    </div>
    <div style={styles.dataRow}>
      <span style={styles.dataLabel}>Accuracy:</span>
      <span style={styles.dataValue}>{formatAccuracy(accuracy)}</span>
    </div>
    <div style={styles.dataRow}>
      <span style={styles.dataLabel}>Speed:</span>
      <span style={styles.dataValue}>{formatSpeed(speed)}</span>
    </div>
    <div style={{...styles.dataRow, borderBottom: 'none'}}>
      <span style={styles.dataLabel}>Heading:</span>
      <span style={styles.dataValue}>{formatHeading(heading)}</span>
    </div>
  </div>
);

const ReportPage = () => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [heading, setHeading] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState(INITIAL_MAP_STATE.center);
  const [zoom, setZoom] = useState(INITIAL_MAP_STATE.zoom);
  const [eventLog, setEventLog] = useState([]);
  const [geofenceStatus, setGeofenceStatus] = useState(
    GEOFENCE_ZONES.reduce((acc, zone) => ({ ...acc, [zone.id]: false }), {})
  );

  const watchId = useRef(null);
  const isFirstUpdate = useRef(true);
  const geofenceStatusRef = useRef(geofenceStatus);
  // ADDED: A ref to hold a simple counter for unique log IDs.
  const logIdCounter = useRef(0);

  useEffect(() => {
    geofenceStatusRef.current = geofenceStatus;
  }, [geofenceStatus]);

  const addLog = useCallback((message) => {
    setEventLog(prevLog => {
      // CHANGED: Increment the counter before creating the log item.
      logIdCounter.current += 1;
      const newLog = {
        // CHANGED: Use the unique counter value for the ID.
        id: logIdCounter.current,
        message,
        timestamp: new Date().toLocaleTimeString(),
      };
      return [newLog, ...prevLog].slice(0, 50);
    });
  }, []);

  const handlePositionSuccess = useCallback((pos) => {
    const { latitude, longitude, accuracy, speed, heading } = pos.coords;
    const currentPosition = [latitude, longitude];

    setStatus('success');
    setPosition(currentPosition);
    setAccuracy(accuracy);
    setSpeed(speed);
    setHeading(heading);

    if (isFirstUpdate.current) {
      setMapCenter(currentPosition);
      setZoom(16);
      isFirstUpdate.current = false;
      addLog('Successfully acquired initial position.');
    }

    const newGeofenceStatus = {};
    GEOFENCE_ZONES.forEach(zone => {
      const distance = haversineDistance(currentPosition, zone.center);
      const isInside = distance <= zone.radius;
      newGeofenceStatus[zone.id] = isInside;

      const wasInside = geofenceStatusRef.current[zone.id];
      if (isInside && !wasInside) {
        addLog(`Entered ${zone.name}.`);
      } else if (!isInside && wasInside) {
        addLog(`Exited ${zone.name}.`);
      }
    });
    setGeofenceStatus(newGeofenceStatus);
  }, [addLog]);

  const handlePositionError = useCallback((err) => {
    if (err.code === 1) {
      setStatus('denied');
      addLog('Location access denied by user.');
    } else {
      setStatus('error');
      setError(err);
      addLog(`Geolocation error: ${err.message}`);
    }
  }, [addLog]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('error');
      setError({ message: "Geolocation is not supported by your browser." });
      addLog('Geolocation not supported.');
      return;
    }

    setStatus('loading');
    addLog('Requesting location access...');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    watchId.current = navigator.geolocation.watchPosition(
      handlePositionSuccess,
      handlePositionError,
      options
    );

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [handlePositionSuccess, handlePositionError, addLog]);

  const recenterMap = useCallback(() => {
    if (position) {
      setMapCenter(position);
      setZoom(16);
      addLog('Map recentered to user position.');
    }
  }, [position, addLog]);

  const [isHover, setIsHover] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.infoPanel}>
        <div style={styles.panelHeader}>
          <h1 style={styles.panelTitle}>GeoTrack Pro</h1>
          <p style={styles.panelSubtitle}>Live Position & Geofence Monitor</p>
        </div>

        <StatusDisplay status={status} error={error} />
        
        {status === 'success' && (
          <PositionDetails 
            position={position}
            accuracy={accuracy}
            speed={speed}
            heading={heading}
          />
        )}
        
        <GeofenceStatusList geofenceStatus={geofenceStatus} />
        
        <EventLog logs={eventLog} />

        <button 
          style={isHover ? {...styles.button, ...styles.buttonHover} : styles.button}
          onClick={recenterMap}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          disabled={!position}
        >
          Recenter on Me
        </button>
      </div>

      <div style={styles.mapWrapper}>
        <MapContainer center={INITIAL_MAP_STATE.center} zoom={INITIAL_MAP_STATE.zoom} style={{ height: '100%', width: '100%', backgroundColor: '#1d2c3b' }}>
          <MapController center={mapCenter} zoom={zoom} />
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <UserMarker position={position} heading={heading} />

          {GEOFENCE_ZONES.map(zone => (
            <Circle
              key={zone.id}
              center={zone.center}
              radius={zone.radius}
              pathOptions={{
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: geofenceStatus[zone.id] ? 0.3 : 0.15,
                weight: 2,
              }}
            >
              <Popup>
                <b>{zone.name}</b><br/>
                Radius: {zone.radius}m
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ReportPage;