// src/pages/apps/report/MyReportsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../Api';
import { useApi } from './hooks/useApi'; // We'll create this shared hook
import type { Report } from '../../../types';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { FileText, MapPin, Tag, Clock, ChevronRight } from 'lucide-react';

const fetchMyReports = async (): Promise<Report[]> => {
    const response = await apiClient.get<{ results: Report[] }>('/reports/');
    return response.data.results;
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: { [key: string]: string } = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        VERIFIED: 'bg-blue-100 text-blue-800',
        IN_PROGRESS: 'bg-indigo-100 text-indigo-800',
        ACTIONED: 'bg-green-100 text-green-800',
        REJECTED: 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <motion.div whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <Link to={`/app/reports/${report.id}`} className="block p-5">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
                        <span className="flex items-center gap-1"><MapPin size={14} />{report.location_name}</span>
                        <span className="flex items-center gap-1"><Tag size={14} />{report.issue_category.name}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2">{report.description}</p>
                </div>
                <ChevronRight className="text-gray-400 flex-shrink-0 ml-4" />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                <StatusBadge status={report.status} />
                <span className="flex items-center gap-1"><Clock size={14} />{formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}</span>
            </div>
        </Link>
    </motion.div>
);

const ReportCardSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 animate-pulse">
        <div className="flex justify-between items-start">
            <div className="flex-grow space-y-3">
                <div className="flex items-center gap-4">
                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-6 w-6 bg-gray-200 rounded-full ml-4"></div>
        </div>
        <div className="flex justify-between items-center pt-4 mt-3 border-t border-gray-100">
            <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
    </div>
);


const MyReportsPage: React.FC = () => {
    const { data: reports, isLoading, error } = useApi(fetchMyReports);

    return (
        <div className="mx-auto p-4 sm:p-6 lg:p-8 mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText /> My Reports
                </h1>
                <p className="text-gray-600 mt-1">A history of all your submitted reports and their current status.</p>
            </motion.div>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <ReportCardSkeleton key={i} />)}
                </div>
            ) : error ? (
                <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</div>
            ) : reports && reports.length > 0 ? (
                <div className="space-y-4">
                    {reports.map(report => <ReportCard key={report.id} report={report} />)}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-white rounded-lg border-2 border-dashed">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No reports found</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't submitted any reports yet.</p>
                    <div className="mt-6">
                        <Link to="/app/report/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                            Submit Your First Report
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReportsPage;