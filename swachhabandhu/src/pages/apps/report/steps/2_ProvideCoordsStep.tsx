import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocationDetails, type LocationDetails } from '../services/locationService';
import { isWithinGeofence } from './../utils/geo';
import type { UserCoordinates } from '../services/reportService';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Fix for default Leaflet icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconRetinaUrl: iconRetina, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
L.Marker.prototype.options.icon = DefaultIcon;
const TargetIcon = L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });

interface Props {
  locationId: string;
  onCoordsAndDetailsProvided: (coords: UserCoordinates, details: LocationDetails) => void;
  onBack: () => void;
}

const getLocationTypeIcon = (type: string) => {
    const icons: Record<string, string> = { PARK: '🌳', PUBLIC_TOILET: '🚻', BUS_STAND: '🚌', PUBLIC_BIN: '🗑️', GOVERNMENT_OFFICE: '🏢', STREET_SEGMENT: '🛣️' };
    return icons[type] || '📍';
};

const MapUpdater: React.FC<{ userCoords: UserCoordinates | null }> = ({ userCoords }) => {
    const map = useMap();
    useEffect(() => { if (userCoords) { map.setView([userCoords.latitude, userCoords.longitude], map.getZoom()); } }, [userCoords, map]);
    return null;
};

const ProvideCoordsStep: React.FC<Props> = ({ locationId, onCoordsAndDetailsProvided, onBack }) => {
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [userCoords, setUserCoords] = useState<UserCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
        try {
            setIsLoading(true);
            setError('');
            const details = await getLocationDetails(locationId);
            setLocationDetails(details);
        } catch (err) {
            setError("Could not load location details. Please try scanning again.");
        } finally {
            setIsLoading(false);
        }
    };
    fetchDetails();
  }, [locationId]);

  const handleUseDeviceLocation = () => {
    setIsVerifying(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        setIsVerifying(false);
      },
      () => {
        setError('Unable to retrieve your location. Please enable location services in your browser.');
        setIsVerifying(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleConfirmLocation = async () => {
    if (!userCoords || !locationDetails) return;
    setIsVerifying(true);
    setError('');
    try {
        if (isWithinGeofence(userCoords.latitude, userCoords.longitude, locationDetails.latitude, locationDetails.longitude, locationDetails.geofence_radius)) {
            onCoordsAndDetailsProvided(userCoords, locationDetails);
        } else {
            setError(`You must be within ${locationDetails.geofence_radius} meters of the location to report an issue.`);
        }
    } catch (err: any) {
        setError(err.message || "An unexpected error occurred during verification.");
    } finally {
        setIsVerifying(false);
    }
  };

  if (isLoading) return <div className="text-center text-gray-500 animate-pulse">Loading location details...</div>;
  if (error && !locationDetails) return <div className="text-center text-red-500 p-4 bg-red-50 rounded">{error}</div>;
  if (!locationDetails) return null;

  return (
    <div className="flex flex-col animate-fade-in">
        <h2 className="text-lg font-semibold mb-1 text-gray-700">Step 2: Confirm Your Location</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center mb-4">
            <h3 className="text-xl font-bold text-blue-700 my-1">{locationDetails.name}</h3>
            {locationDetails.description && <p className="text-xs text-gray-500 italic mt-1">"{locationDetails.description}"</p>}
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-2">
                <span>{getLocationTypeIcon(locationDetails.location_type)} {locationDetails.location_type.replace(/_/g, ' ')}</span>
                <span>📍 {locationDetails.municipality_name}</span>
            </div>
        </div>

        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-200">
             <MapContainer center={[locationDetails.latitude, locationDetails.longitude]} zoom={17} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                <Marker position={[locationDetails.latitude, locationDetails.longitude]} icon={TargetIcon}><Popup>Target Location</Popup></Marker>
                <Circle center={[locationDetails.latitude, locationDetails.longitude]} radius={locationDetails.geofence_radius} pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }} />
                {userCoords && <Marker position={[userCoords.latitude, userCoords.longitude]}><Popup>Your current location</Popup></Marker>}
                <MapUpdater userCoords={userCoords} />
            </MapContainer>
        </div>

        <button onClick={handleUseDeviceLocation} disabled={isVerifying} className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 transition-colors">
            {isVerifying ? 'Acquiring Location...' : 'Use My Device Location'}
        </button>

        {error && <p className="text-red-500 text-sm my-4 text-center">{error}</p>}
        
        <div className="flex justify-between mt-4">
            <button type="button" onClick={onBack} disabled={isVerifying} className="text-gray-600 hover:text-gray-800 disabled:text-gray-400">Back</button>
            <button onClick={handleConfirmLocation} disabled={!userCoords || isVerifying} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-green-300 disabled:cursor-not-allowed">
                {isVerifying ? 'Verifying...' : 'Confirm Location'}
            </button>
        </div>
    </div>
  );
};

export default ProvideCoordsStep;