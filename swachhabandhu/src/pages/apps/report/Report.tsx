// src/components/ReportPage.tsx

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// --- INTEGRATION CHANGE ---
// Import the centralized apiClient and the useAuth hook.
import apiClient from '../../../Api'; // Adjust path if necessary
import { useAuth } from '../../../context/AuthContext'; // Adjust path if necessary

import { MapContainer, TileLayer, Marker, Circle, Popup, useMap, useMapEvents } from 'react-leaflet';
import { type LatLngExpression, Icon } from 'leaflet';

// --- TYPE DEFINITIONS ---
interface User {
  id: number;
  email: string;
  full_name: string;
}

interface GeofenceZoneProperties {
  id: number;
  owner: User;
  name: string;
  description: string;
  radius: number;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface GeofenceZoneFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: GeofenceZoneProperties;
}

interface GeofenceEvent {
  id: number;
  zone: number;
  zone_name: string;
  event_type: 'ENTER' | 'EXIT' | 'CHECK_IN';
  location_coords: [number, number]; // [longitude, latitude]
  timestamp: string;
}

interface NearbyZoneInfo {
    zone: GeofenceZoneFeature;
    distance: number;
}

interface SimulatedDevice {
    position: [number, number];
    isInsideZone: boolean;
}

type EventFilterType = 'ALL' | 'ENTER' | 'EXIT' | 'CHECK_IN';

// --- UTILITY & HELPER FUNCTIONS ---
function getHaversineDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// --- LEAFLET ICONS & HELPERS ---
const defaultIcon = new Icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [41, 41] });
const eventIcon = new Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [41, 41] });
const hoveredEventIcon = new Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', iconSize: [35, 57], iconAnchor: [17, 57], popupAnchor: [1, -48], shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [57, 57] });
const analysisIcon = new Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [41, 41] });
const simulationIcon = new Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', shadowSize: [41, 41] });

const MapController: React.FC<{ center: LatLngExpression }> = ({ center }) => {
    const map = useMap();
    useEffect(() => { map.flyTo(center, 13); }, [center, map]);
    return null;
};

const MapClickHandler: React.FC<{ onMapClick: (coords: [number, number]) => void, isEnabled: boolean }> = ({ onMapClick, isEnabled }) => {
    const map = useMap();
    useMapEvents({ click(e) { if (isEnabled) onMapClick([e.latlng.lat, e.latlng.lng]); } });
    useEffect(() => {
        const mapContainer = map.getContainer();
        mapContainer.style.cursor = isEnabled ? 'crosshair' : '';
        return () => { mapContainer.style.cursor = ''; };
    }, [isEnabled, map]);
    return null;
};

// --- MAIN COMPONENT ---
const ReportPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    // State Management
    const [zones, setZones] = useState<GeofenceZoneFeature[]>([]);
    const [selectedZone, setSelectedZone] = useState<GeofenceZoneFeature | null>(null);
    const [events, setEvents] = useState<GeofenceEvent[]>([]);
    const [dashboardStats, setDashboardStats] = useState<any | null>(null);
    const [editingZone, setEditingZone] = useState<GeofenceZoneFeature | null>(null);
    const [filters, setFilters] = useState({ name: '', min_radius: '', max_radius: '', is_active: '' });
    const [eventFilter, setEventFilter] = useState<EventFilterType>('ALL');
    const [hoveredEventId, setHoveredEventId] = useState<number | null>(null);
    const [loading, setLoading] = useState<{ zones: boolean, events: boolean, stats: boolean }>({ zones: true, events: false, stats: true });
    const [error, setError] = useState<string | null>(null);
    const [isAnalysisMode, setIsAnalysisMode] = useState<boolean>(false);
    const [analysisPoint, setAnalysisPoint] = useState<[number, number] | null>(null);
    const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
    const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
    const [simulatedDevice, setSimulatedDevice] = useState<SimulatedDevice | null>(null);
    const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const initialFormState = useMemo(() => ({ name: '', description: '', radius: 1000, color: '#3388ff', is_active: true, center_lat: '', center_lon: '' }), []);
    const [zoneFormData, setZoneFormData] = useState(initialFormState);

    // API & Data Fetching
    const fetchZones = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(prev => ({ ...prev, zones: true }));
        setError(null);
        try {
            const params = new URLSearchParams(Object.entries(filters).filter(([, value]) => value !== ''));
            const response = await apiClient.get<{ features: GeofenceZoneFeature[] }>(`/geofences/?${params.toString()}`);
            setZones(response.data.features || []);
        } catch (err: any) {
            setError(err.response?.status === 401 ? 'Your session has expired. Please log in again.' : 'Failed to fetch geofence zones.');
            setZones([]);
        } finally {
            setLoading(prev => ({ ...prev, zones: false }));
        }
    }, [isAuthenticated, filters]);

    const fetchEventsForZone = useCallback(async (zoneId: number) => {
        if (!isAuthenticated) return;
        setLoading(prev => ({ ...prev, events: true }));
        try {
            const response = await apiClient.get<{ results: GeofenceEvent[] } | GeofenceEvent[]>(`/geofences/${zoneId}/events/`);
            setEvents('results' in response.data ? response.data.results : response.data);
        } catch (err) {
            setError('Failed to fetch events for this zone.');
        } finally {
            setLoading(prev => ({ ...prev, events: false }));
        }
    }, [isAuthenticated]);

    const fetchDashboardStats = useCallback(async () => {
        if (!isAuthenticated) return;
        setLoading(prev => ({ ...prev, stats: true }));
        try {
            const response = await apiClient.get('/geofences/statistics/');
            setDashboardStats(response.data);
        } catch (err) {
             console.error("Could not fetch dashboard statistics", err);
        } finally {
            setLoading(prev => ({ ...prev, stats: false }));
        }
    }, [isAuthenticated]);

    // Lifecycle & Data Effects
    useEffect(() => {
        if (isAuthenticated) {
            fetchZones();
            fetchDashboardStats();
        } else {
            setZones([]);
            setDashboardStats(null);
            setSelectedZone(null);
        }
    }, [isAuthenticated, fetchZones, fetchDashboardStats]);
    
    useEffect(() => {
        if (selectedZone) {
            fetchEventsForZone(selectedZone.id);
        } else {
            setEvents([]);
        }
    }, [selectedZone, fetchEventsForZone]);

    useEffect(() => {
        if (editingZone) {
            setZoneFormData({
                name: editingZone.properties.name, description: editingZone.properties.description,
                radius: editingZone.properties.radius, color: editingZone.properties.color,
                is_active: editingZone.properties.is_active,
                center_lat: editingZone.geometry.coordinates[1].toString(),
                center_lon: editingZone.geometry.coordinates[0].toString(),
            });
        } else {
            setZoneFormData(initialFormState);
        }
    }, [editingZone, initialFormState]);

    // Live Simulation Effect
    useEffect(() => {
        if (simulationRunning && selectedZone) {
            let deviceState = simulatedDevice;
            if (!deviceState) {
                const startPos: [number, number] = [selectedZone.geometry.coordinates[1] + 0.02, selectedZone.geometry.coordinates[0] + 0.02];
                const startDistance = getHaversineDistance(startPos, [selectedZone.geometry.coordinates[1], selectedZone.geometry.coordinates[0]]) * 1000;
                deviceState = { position: startPos, isInsideZone: startDistance <= selectedZone.properties.radius };
                setSimulatedDevice(deviceState);
            }
            simulationIntervalRef.current = setInterval(() => {
                setSimulatedDevice(prevDevice => {
                    if (!prevDevice || !selectedZone) return null;
                    const newPos: [number, number] = [prevDevice.position[0] - 0.0005, prevDevice.position[1] - 0.0005];
                    const zoneCenter: [number, number] = [selectedZone.geometry.coordinates[1], selectedZone.geometry.coordinates[0]];
                    const distanceToCenter = getHaversineDistance(newPos, zoneCenter) * 1000;
                    const isNowInside = distanceToCenter <= selectedZone.properties.radius;
                    if (isNowInside && !prevDevice.isInsideZone) {
                        apiClient.post(`/geofences/${selectedZone.id}/log-event/`, { longitude: newPos[1], latitude: newPos[0], event_type: 'ENTER' }).then(() => { fetchEventsForZone(selectedZone.id); fetchDashboardStats(); });
                    } else if (!isNowInside && prevDevice.isInsideZone) {
                        apiClient.post(`/geofences/${selectedZone.id}/log-event/`, { longitude: newPos[1], latitude: newPos[0], event_type: 'EXIT' }).then(() => { fetchEventsForZone(selectedZone.id); fetchDashboardStats(); });
                    }
                    return { position: newPos, isInsideZone: isNowInside };
                });
            }, 2000);
        } else {
            if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        }
        return () => { if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current); };
    }, [simulationRunning, selectedZone, fetchEventsForZone, simulatedDevice, fetchDashboardStats]);

    // Handlers
    const handleAnalysisClick = useCallback((coords: [number, number]) => {
        setAnalysisPoint(coords);
        setIsAnalysisMode(false);
    }, []);

    const nearbyZones = useMemo((): NearbyZoneInfo[] => {
        if (!analysisPoint || zones.length === 0) return [];
        return zones.map(zone => ({ zone, distance: getHaversineDistance(analysisPoint, [zone.geometry.coordinates[1], zone.geometry.coordinates[0]]) })).sort((a, b) => a.distance - b.distance);
    }, [analysisPoint, zones]);

    const handleSelectZone = (zone: GeofenceZoneFeature) => {
        setSelectedZone(zone);
        setEditingZone(null);
        setAnalysisPoint(null);
        if (simulationRunning) setSimulationRunning(false);
    };

    const handleSaveZone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingZone) return;
        const payload = {
            name: zoneFormData.name, description: zoneFormData.description, radius: parseFloat(zoneFormData.radius as any), color: zoneFormData.color, is_active: zoneFormData.is_active,
            center: { type: 'Point', coordinates: [parseFloat(zoneFormData.center_lon), parseFloat(zoneFormData.center_lat)] }
        };
        try {
            await apiClient.patch(`/geofences/${editingZone.id}/`, payload);
            setEditingZone(null);
            fetchZones();
            fetchDashboardStats();
        } catch (err: any) {
            setError(`Failed to update zone: ${JSON.stringify(err.response?.data)}`);
        }
    };

    const handleLogEvent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedZone) return;
        const formData = new FormData(e.currentTarget);
        const eventPayload = {
            longitude: parseFloat(formData.get('longitude') as string), latitude: parseFloat(formData.get('latitude') as string), event_type: formData.get('event_type') as string,
        };
        try {
            await apiClient.post(`/geofences/${selectedZone.id}/log-event/`, eventPayload);
            fetchEventsForZone(selectedZone.id);
            fetchDashboardStats();
            e.currentTarget.reset();
        } catch (err) {
            setError('Failed to log event. Check coordinates.');
        }
    };
    
    const filteredEvents = useMemo(() => {
        if (eventFilter === 'ALL') return events;
        return events.filter(event => event.event_type === eventFilter);
    }, [events, eventFilter]);

    const mapCenter = useMemo((): LatLngExpression => {
        if (selectedZone) return [selectedZone.geometry.coordinates[1], selectedZone.geometry.coordinates[0]];
        if (zones.length > 0) return [zones[0].geometry.coordinates[1], zones[0].geometry.coordinates[0]];
        return [40.7128, -74.0060];
    }, [selectedZone, zones]);
    
    // --- RENDER LOGIC ---
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600">Please log in to access the Geofence Operations dashboard.</p>
                </div>
            </div>
        );
    }

    const renderSidebarContent = () => (
        <div className="p-4 space-y-6 overflow-y-auto">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome, {user?.full_name || 'Operator'}!</h3>
                {loading.stats ? <p className="text-sm text-gray-500">Loading dashboard stats...</p> : dashboardStats ? (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-gray-100 p-3 rounded-lg"><p className="text-2xl font-bold text-blue-600">{dashboardStats.total_zones}</p><p className="text-sm text-gray-600">Total Zones</p></div>
                            <div className="bg-gray-100 p-3 rounded-lg"><p className="text-2xl font-bold text-green-600">{dashboardStats.active_zones}</p><p className="text-sm text-gray-600">Active Zones</p></div>
                        </div>
                        <div className="text-sm bg-gray-100 p-3 rounded-lg">
                            <h4 className="font-semibold mb-1">Events by Type:</h4>
                            <div className="flex justify-between"><span>ENTER:</span> <strong>{dashboardStats.event_type_counts.ENTER || 0}</strong></div>
                            <div className="flex justify-between"><span>EXIT:</span> <strong>{dashboardStats.event_type_counts.EXIT || 0}</strong></div>
                            <div className="flex justify-between"><span>CHECK_IN:</span> <strong>{dashboardStats.event_type_counts.CHECK_IN || 0}</strong></div>
                        </div>
                    </div>
                ) : <p className="text-sm text-red-500">Could not load stats.</p>}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Filter Zones</h3>
                <form onSubmit={e => { e.preventDefault(); fetchZones(); }} className="space-y-2">
                    <input type="text" placeholder="Name contains..." value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} className="w-full rounded-md border-gray-300 shadow-sm text-sm"/>
                    <button type="submit" className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Apply Filter</button>
                </form>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">My Zones ({zones.length})</h3>
                <ul className="h-48 overflow-y-auto divide-y divide-gray-200 border rounded-md">
                    {loading.zones ? <p className="p-2 text-sm text-gray-500">Loading zones...</p> : zones.map(zone => (
                        <li key={zone.id} onClick={() => handleSelectZone(zone)} className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedZone?.id === zone.id ? 'bg-blue-100' : ''}`}>
                            <h4 className="font-semibold text-gray-900">{zone.properties.name}</h4>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderDetailPanel = () => {
        if (editingZone) {
            return (
                <div className="p-4">
                    <h3 className="text-xl font-bold text-blue-600 mb-4">Edit: {editingZone.properties.name}</h3>
                    <form onSubmit={handleSaveZone} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" value={zoneFormData.name} onChange={e => setZoneFormData({...zoneFormData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Radius (m)</label>
                            <input type="number" value={zoneFormData.radius} onChange={e => setZoneFormData({...zoneFormData, radius: Number(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium text-gray-700">Latitude</label><input type="number" step="any" value={zoneFormData.center_lat} onChange={e => setZoneFormData({...zoneFormData, center_lat: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Longitude</label><input type="number" step="any" value={zoneFormData.center_lon} onChange={e => setZoneFormData({...zoneFormData, center_lon: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                        </div>
                        <div className="flex items-center space-x-4"><label className="block text-sm font-medium text-gray-700">Color</label><input type="color" value={zoneFormData.color} onChange={e => setZoneFormData({...zoneFormData, color: e.target.value})} className="h-10 w-10 rounded-md border-gray-300 shadow-sm"/></div>
                        <div className="flex items-center"><input type="checkbox" checked={zoneFormData.is_active} onChange={e => setZoneFormData({...zoneFormData, is_active: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" /><label className="ml-2 block text-sm text-gray-900">Is Active</label></div>
                        <div className="flex space-x-2"><button type="submit" className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">Save Changes</button><button type="button" onClick={() => setEditingZone(null)} className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button></div>
                    </form>
                </div>
            );
        }

        if (analysisPoint) {
            return (
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Proximity Analysis</h3>
                    <p className="text-sm text-gray-600 mb-3">Zones ranked by distance from the marked point.</p>
                    <button onClick={() => setAnalysisPoint(null)} className="w-full mb-3 py-2 px-4 text-sm rounded-md bg-gray-200 hover:bg-gray-300">Clear Analysis</button>
                    <ul className="max-h-96 overflow-y-auto divide-y">
                        {nearbyZones.map(({zone, distance}) => (
                            <li key={zone.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectZone(zone)}><p className="font-semibold">{zone.properties.name}</p><p className="text-sm text-blue-600">{distance.toFixed(2)} km away</p></li>
                        ))}
                    </ul>
                </div>
            );
        }

        if (selectedZone) {
            return (
                <div className="p-4 space-y-6 overflow-y-auto">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedZone.properties.name}</h3>
                        <p className="text-sm text-gray-500">Radius: {selectedZone.properties.radius}m | Status: {selectedZone.properties.is_active ? 'Active' : 'Inactive'}</p>
                        <div className="mt-4 flex space-x-2">
                            <button onClick={() => setEditingZone(selectedZone)} className="flex-1 py-2 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">Edit</button>
                            <button onClick={() => setIsLiveMode(!isLiveMode)} className={`flex-1 py-2 text-sm font-medium rounded-md text-white ${isLiveMode ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}`}>{isLiveMode ? 'Exit Live Mode' : 'Live Mode'}</button>
                        </div>
                    </div>
                    {isLiveMode && (
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-md">
                            <h4 className="font-semibold text-purple-800">Live Simulation</h4><p className="text-sm text-purple-700 mb-3">Simulates a device moving towards the zone center.</p>
                            <button onClick={() => setSimulationRunning(!simulationRunning)} className={`w-full py-2 text-sm font-medium rounded-md text-white ${simulationRunning ? 'bg-red-500' : 'bg-green-500'}`}>{simulationRunning ? 'Stop Simulation' : 'Start Simulation'}</button>
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Events</h4>
                        <div className="flex space-x-1 p-1 bg-gray-200 rounded-md mb-2">{ (['ALL', 'ENTER', 'EXIT', 'CHECK_IN'] as EventFilterType[]).map(type => (<button key={type} onClick={() => setEventFilter(type)} className={`flex-1 text-xs py-1 rounded-md ${eventFilter === type ? 'bg-white shadow' : 'bg-transparent'}`}>{type}</button>))}</div>
                        <ul className="h-48 overflow-y-auto divide-y border rounded-md">
                           {loading.events ? <p className="p-2 text-sm text-gray-500">Loading events...</p> : filteredEvents.map(event => (<li key={event.id} onMouseEnter={() => setHoveredEventId(event.id)} onMouseLeave={() => setHoveredEventId(null)} className="p-2 text-sm hover:bg-blue-50"><p className="font-semibold">{event.event_type}</p><p className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</p></li>))}
                        </ul>
                    </div>
                </div>
            );
        }
        
        return (<div className="p-4 text-center text-gray-500 flex items-center justify-center h-full"><p>Select a zone from the list to view its details, or use a tool from the top bar.</p></div>);
    };

    return (
        <div className="h-screen w-screen flex flex-col font-sans bg-gray-50">
            <header className="bg-white border-b p-4 shadow-sm z-20 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Geofence Operations</h1>
                <div className="flex items-center space-x-4"><button onClick={() => { setIsAnalysisMode(!isAnalysisMode); setSelectedZone(null); }} className={`py-2 px-4 text-sm font-medium rounded-md border ${isAnalysisMode ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}>Analyze Point</button></div>
            </header>
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 z-10" role="alert"><p>{error}</p></div>}
            <div className="flex flex-grow overflow-hidden">
                <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">{renderSidebarContent()}</aside>
                <aside className="w-96 bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">{renderDetailPanel()}</aside>
                <main className="flex-grow h-full">
                    <MapContainer center={mapCenter} zoom={10} scrollWheelZoom={true} className="h-full w-full">
                        <TileLayer attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        <MapController center={mapCenter} />
                        <MapClickHandler onMapClick={handleAnalysisClick} isEnabled={isAnalysisMode} />
                        {zones.map(zone => {
                             const center: LatLngExpression = [zone.geometry.coordinates[1], zone.geometry.coordinates[0]];
                             return (<React.Fragment key={`zone-${zone.id}`}><Marker position={center} icon={defaultIcon} eventHandlers={{ click: () => handleSelectZone(zone) }} /><Circle center={center} radius={zone.properties.radius} pathOptions={{ color: zone.properties.color, fillColor: zone.properties.color, fillOpacity: selectedZone?.id === zone.id ? 0.5 : 0.2, weight: selectedZone?.id === zone.id ? 3 : 1 }} eventHandlers={{ click: () => handleSelectZone(zone) }} /></React.Fragment>)
                        })}
                        {selectedZone && filteredEvents.map(event => (<Marker key={`event-${event.id}`} position={[event.location_coords[1], event.location_coords[0]]} icon={hoveredEventId === event.id ? hoveredEventIcon : eventIcon} zIndexOffset={hoveredEventId === event.id ? 1000 : 0}/>))}
                        {analysisPoint && <Marker position={analysisPoint} icon={analysisIcon} />}
                        {isLiveMode && simulatedDevice && <Marker position={simulatedDevice.position} icon={simulationIcon} />}
                    </MapContainer>
                </main>
            </div>
        </div>
    );
};

export default ReportPage;