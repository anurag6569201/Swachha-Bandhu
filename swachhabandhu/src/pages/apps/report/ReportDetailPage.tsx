// src/pages/apps/report/ReportDetailPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../../Api';
import { useApi } from './hooks/useApi'; // Make sure this path is correct
import type { ReportDetail } from '../../../types';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, User, Hash, MapPin, Tag, Shield, FileText, CheckCircle, Clock } from 'lucide-react';

const fetchReportDetail = async (reportId: string): Promise<ReportDetail> => {
    const response = await apiClient.get<ReportDetail>(`/reports/${reportId}/`);
    return response.data;
};

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- StatusTimeline Component (No Change) ---
const StatusTimeline: React.FC<{ history: ReportDetail['status_history'] }> = ({ history }) => (
    <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Status History</h3>
        <ol className="relative border-l border-gray-200">
            {history.map((item, index) => (
                <li key={item.timestamp} className="mb-6 ml-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                    </span>
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="items-center justify-between sm:flex">
                            <time className="mb-1 text-xs font-normal text-gray-500 sm:order-last sm:mb-0">
                                {format(new Date(item.timestamp), "PPP p")}
                            </time>
                            <div className="text-sm font-semibold text-gray-900">{item.status.replace(/_/g, ' ')}</div>
                        </div>
                        {item.notes && <div className="p-3 mt-2 text-xs italic text-gray-500 bg-gray-50 rounded-lg">{item.notes}</div>}
                        {item.changed_by_email && <div className="text-xs text-gray-500 mt-2">by {item.changed_by_email}</div>}
                    </div>
                </li>
            ))}
        </ol>
    </div>
);

// --- DetailItem Component ---
// FIX #1: The element that wraps the `value` prop is now a <div> instead of a <p>.
// This allows it to safely contain any type of content, including other paragraphs or complex elements.
const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; className?: string }> = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-start ${className}`}>
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-500">{icon}</div>
        <div className="ml-3">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="text-base font-medium text-gray-800">{value}</div>
        </div>
    </div>
);


// --- ReportDetailPage Main Component ---
const ReportDetailPage: React.FC = () => {
    const { reportId } = useParams<{ reportId: string }>();
    if (!reportId) return <div>Invalid Report ID</div>;

    const { data: report, isLoading, error } = useApi(() => fetchReportDetail(reportId), [reportId]);

    // --- FIX #2: Handle loading and error states before trying to render the component body ---
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      );
    }
    
    if (error) {
        return <div className="text-center p-10 text-red-500 bg-red-50 rounded-lg max-w-2xl mx-auto mt-10">Error loading report: {error}</div>;
    }
        
    if (!report) {
        return <div className="text-center p-10">Report not found.</div>;
    }

    // This code now only runs when `report` is guaranteed to have data.
    const locationPosition: [number, number] = [report.location_latitude, report.location_longitude];

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Report Details</h1>
                            <p className="text-gray-500 flex items-center gap-1 mt-1"><Hash size={14}/> ID: {report.id}</p>
                        </div>
                        <span className={`mt-3 md:mt-0 px-3 py-1.5 text-sm font-semibold rounded-full ${ {PENDING: 'bg-yellow-100 text-yellow-800', VERIFIED: 'bg-blue-100 text-blue-800', ACTIONED: 'bg-green-100 text-green-800', REJECTED: 'bg-red-100 text-red-800'}[report.status] || 'bg-gray-100'}`}>
                            {report.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem icon={<Calendar size={20}/>} label="Reported On" value={format(new Date(report.created_at), 'MMMM d, yyyy')} />
                        <DetailItem icon={<User size={20}/>} label="Reported By" value={report.user?.full_name || 'Anonymous'} />
                        <DetailItem icon={<MapPin size={20}/>} label="Location" value={report.location_name} />
                        <DetailItem icon={<Tag size={20}/>} label="Category" value={report.issue_category.name} />
                        <DetailItem icon={<Shield size={20}/>} label="Severity" value={report.severity} />
                        
                        {/* The fix in DetailItem allows this to work without nesting errors */}
                        <DetailItem 
                            icon={<FileText size={20}/>} 
                            label="Description" 
                            value={<p className="italic">"{report.description}"</p>}
                            className="md:col-span-2"
                        />
                    </div>

                    {report.media.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Attached Media</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {report.media.map(m => (
                                    <a key={m.id} href={m.file} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden shadow-md">
                                        <img src={m.file} alt="Report media" className="h-32 w-full object-cover transition-transform hover:scale-105" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 h-64 w-full rounded-lg overflow-hidden border">
                        <MapContainer center={locationPosition} zoom={16} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={locationPosition}><Popup>{report.location_name}</Popup></Marker>
                            <Circle center={locationPosition} radius={report.geofence_radius} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
                        </MapContainer>
                    </div>

                    <StatusTimeline history={report.status_history} />
                </div>
            </motion.div>
        </div>
    );
};

export default ReportDetailPage;