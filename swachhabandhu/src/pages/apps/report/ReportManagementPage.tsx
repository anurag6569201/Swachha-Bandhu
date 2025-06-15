// src/pages/apps/report/ReportManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import apiClient from '../../../Api';
import { useApi } from './hooks/useApi';
import type { Report, ReportDetail } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { SlidersHorizontal, MapPin, Tag, User, Clock, Shield } from 'lucide-react';

const fetchReports = async (status: string): Promise<Report[]> => {
    const params = new URLSearchParams();
    if (status && status !== 'ALL') {
        params.append('status', status);
    }
    const response = await apiClient.get<{ results: Report[] }>(`/reports/`, { params });
    return response.data.results;
};

const ReportManagementPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const currentStatus = searchParams.get('status') || 'PENDING';

    const { data: reports, isLoading, error, refetch } = useApi(() => fetchReports(currentStatus), [currentStatus]);

    const handleStatusChange = (status: string) => {
        setSearchParams({ status });
        setSelectedReport(null); // Close detail view on tab change
    };

    const handleReportUpdate = () => {
        refetch(); // Refetch the list of reports
        setSelectedReport(null); // Close the modal
    };

    const TABS = ['PENDING', 'VERIFIED', 'IN_PROGRESS', 'ACTIONED', 'REJECTED', 'ALL'];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar / Report List */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2"><SlidersHorizontal/> Manage Reports</h1>
                </div>
                <div className="p-2 border-b">
                    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => handleStatusChange(tab)}
                                className={`w-full px-2 py-1.5 text-xs font-semibold rounded-md transition-colors duration-200 
                                    ${currentStatus === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {isLoading && <p className="p-4 text-gray-500">Loading reports...</p>}
                    {error && <p className="p-4 text-red-500">{error}</p>}
                    {reports && reports.length > 0 ? (
                        <ul>
                            {reports.map(report => (
                                <li key={report.id}>
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className={`w-full text-left p-4 border-b hover:bg-blue-50 ${selectedReport?.id === report.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <p className="font-semibold text-gray-800 truncate">{report.issue_category.name}</p>
                                        <p className="text-sm text-gray-600 truncate">{report.description}</p>
                                        <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                            <span>{report.location_name}</span>
                                            <span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !isLoading && <p className="p-4 text-gray-500 text-center mt-8">No reports found for this status.</p>
                    )}
                </div>
            </div>

            {/* Main Content / Report Detail */}
            <div className="flex-grow bg-gray-50 overflow-y-auto">
                <AnimatePresence>
                    {selectedReport ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <ReportDetailView reportId={selectedReport.id} onUpdate={handleReportUpdate} />
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            <p>Select a report to view its details</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- Detail View Component specific to this page ---

const fetchDetail = (id: number) => apiClient.get<ReportDetail>(`/reports/${id}/`).then(res => res.data);

const ReportDetailView: React.FC<{ reportId: number, onUpdate: () => void }> = ({ reportId, onUpdate }) => {
    const { data: report, isLoading, error } = useApi(() => fetchDetail(reportId), [reportId]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateError, setUpdateError] = useState('');
    const [status, setStatus] = useState<string>('');
    const [notes, setNotes] = useState('');
    
    useEffect(() => {
        if(report) setStatus(report.status)
    }, [report])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setUpdateError('');
        try {
            await apiClient.patch(`/reports/${reportId}/moderate/`, {
                status,
                moderator_notes: notes,
            });
            onUpdate();
        } catch (err: any) {
            setUpdateError(err.response?.data?.detail || 'Failed to update report.');
        } finally {
            setIsUpdating(false);
        }
    };
    
    if (isLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;
    if (!report) return null;

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800">{report.issue_category.name}</h2>
            <p className="text-sm text-gray-500">at {report.location_name}</p>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><User size={16}/><span>By: {report.user?.full_name || 'N/A'}</span></div>
                <div className="flex items-center gap-2"><Clock size={16}/><span>{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span></div>
                <div className="flex items-center gap-2"><Shield size={16}/><span>Severity: {report.severity}</span></div>
            </div>

            <p className="mt-6 bg-gray-100 p-4 rounded-lg text-gray-700 italic">"{report.description}"</p>

            {report.media.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Media</h3>
                    <div className="flex gap-4">
                        {report.media.map(m => <a href={m.file} target="_blank" rel="noreferrer"><img src={m.file} className="h-24 w-24 object-cover rounded-lg"/></a>)}
                    </div>
                </div>
            )}
            
            <form onSubmit={handleUpdate} className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-lg mb-4">Moderate Report</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">New Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option>PENDING</option>
                            <option>VERIFIED</option>
                            <option>IN_PROGRESS</option>
                            <option>ACTIONED</option>
                            <option>REJECTED</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Moderator Notes (Optional)</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                            {isUpdating ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                    {updateError && <p className="text-red-500 text-sm text-right">{updateError}</p>}
                </div>
            </form>
        </div>
    )
};


export default ReportManagementPage;