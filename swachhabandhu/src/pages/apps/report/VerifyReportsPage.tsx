// src/pages/apps/report/VerifyReportsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../Api';
import { useApi } from './hooks/useApi';
import type { Report } from '../../../types';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { MapPin, Tag, CheckSquare, ListChecks, HelpCircle } from 'lucide-react';

// --- Paginated Response Type ---
interface PaginatedReportsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Report[];
}


const fetchPendingReports = async (): Promise<Report[]> => {
    // Fetch reports that are specifically in PENDING status for verification
    const response = await apiClient.get<PaginatedReportsResponse>('/reports/?status=PENDING&exclude_user=true');
    return response.data.results;
};

const VerificationReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <motion.div 
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
    >
        <div className="p-5">
            <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
                <span className="flex items-center gap-1"><MapPin size={14} />{report.location_name}</span>
                <span className="flex items-center gap-1"><Tag size={14} />{report.issue_category.name}</span>
            </div>
            <p className="font-semibold text-gray-800 text-lg mb-3 line-clamp-2">{report.description}</p>
             <div className="text-xs text-gray-500">
                Reported {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
            </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
            <Link 
                to={`/app/report/verify/${report.id}`} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
                <CheckSquare size={16} className="mr-2" />
                Verify This Report
            </Link>
        </div>
    </motion.div>
);

const VerifyReportsPage: React.FC = () => {
    const { data: reports, isLoading, error } = useApi(fetchPendingReports);

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ListChecks /> Verify Reports
                </h1>
                <p className="text-gray-600 mt-2">Help your municipality by verifying reports from fellow citizens. You'll earn points for each successful verification!</p>
                 <div className="mt-4 p-4 bg-blue-50 text-blue-800 border-l-4 border-blue-500 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <HelpCircle className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm">
                                To verify a report, you must be physically present at the location to confirm the issue exists.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="text-center text-gray-500">Loading pending reports...</div>
            ) : error ? (
                <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</div>
            ) : reports && reports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reports.map(report => <VerificationReportCard key={report.id} report={report} />)}
                </div>
            ) : (
                <div className="text-center py-12 px-6 bg-white rounded-lg border-2 border-dashed">
                    <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">All Clear!</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no pending reports to verify right now. Great job, community!</p>
                </div>
            )}
        </div>
    );
};

export default VerifyReportsPage;