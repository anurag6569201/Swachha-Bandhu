import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer } from 'react-leaflet';
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend, RadialBarChart, RadialBar, PolarAngleAxis 
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../Api';
import { 
    Award, BarChart3, Clock, FileCheck, FileClock, FileText, Users, TrendingUp, 
    Zap, LogOut, ArrowUp, ArrowDown, Minus, Trophy, LineChart, ShieldCheck, Inbox,
    PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- TYPE DEFINITIONS ---
interface KpiChange { current: number; previous: number; change_percentage: number | null; }
interface HeatmapPoint { latitude: number; longitude: number; intensity: number; }
interface MunicipalKpi { total_reports: number; pending_reports: number; verified_reports: number; actioned_reports: number; rejected_reports: number; total_active_citizens: number; average_resolution_time_hours: number | null; total_locations: number; reports_in_last_30_days: KpiChange; }
interface CitizenKpi { total_points: number; rank: number | null; reports_filed: number; reports_verified: number; reports_actioned: number; reports_pending: number; }
interface SeverityBreakdown { severity: string; count: number; percentage: number; }
interface CategoryBreakdown { category_name: string; count: number; percentage: number; }
interface NextBadgeProgress { name: string; description: string; icon_url: string | null; current_points: number; required_points: number; current_reports: number; required_reports: number; current_verifications: number; required_verifications: number; overall_progress_percentage: number; }
interface TopContributor { full_name: string; total_points: number; reports_filed: number; profile_image_url?: string | null; }
interface RecentActivity { activity_type: 'points' | 'badge'; details: string; points: number; timestamp: string; report_id: number | null; badge_name: string | null; badge_icon_url: string | null; }

// --- LOADING SPINNER ---
const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
);

// --- ADVANCED HELPER & UI COMPONENTS ---

const UserAvatar: React.FC<{ name: string; imageUrl?: string | null; className?: string; }> = ({ name, imageUrl, className = 'w-10 h-10' }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const colors = ['bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
    const color = colors[name.charCodeAt(0) % colors.length];

    if (imageUrl) {
        return <img src={imageUrl} alt={name} className={`${className} rounded-full object-cover bg-gray-200`} />;
    }

    return (
        <div className={`${className} ${color} rounded-full flex items-center justify-center text-white font-bold`}>
            {initials}
        </div>
    );
};

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; message: string; }> = ({ icon, title, message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
        <div className="p-3 bg-slate-100 rounded-full mb-3">{icon}</div>
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <p className="text-sm">{message}</p>
    </div>
);

const TrendIcon: React.FC<{ change: number | null }> = ({ change }) => {
    if (change === null || change === 0) return <Minus size={14} className="text-gray-500" />;
    if (change > 0) return <ArrowUp size={14} className="text-green-500" />;
    return <ArrowDown size={14} className="text-red-500" />;
};

const KpiCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; changeData?: KpiChange; }> = ({ icon, title, value, color, changeData }) => (
    <motion.div 
        className="relative p-6 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
        style={{ background: `linear-gradient(135deg, white 60%, ${color}20)` }}
        whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px -5px rgba(0,0,0,0.1)" }} 
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center z-10">
                <div className={`mr-4 p-3 rounded-full bg-white shadow-md`} style={{ color }}>{icon}</div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
            </div>
            {changeData && (
                <div className="flex items-center text-sm z-10 bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <TrendIcon change={changeData.change_percentage} />
                    <span className={`ml-1 font-semibold ${changeData.change_percentage === null || changeData.change_percentage === 0 ? 'text-gray-600' : changeData.change_percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {changeData.change_percentage !== null ? `${Math.abs(changeData.change_percentage)}%` : '...'}
                    </span>
                </div>
            )}
        </div>
        {changeData && <p className="text-xs text-gray-500 mt-2 z-10 relative">vs previous 30 days</p>}
    </motion.div>
);

const ActionCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string; color: string }> = ({ to, icon, title, description, color }) => (
    <motion.div whileHover={{ y: -5 }} className="h-full">
        <Link to={to} className={`block h-full p-6 rounded-xl shadow-lg text-white transition-all duration-300 ${color}`}>
            <div className="flex items-center gap-4 mb-3">
                {icon}
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <p className="text-sm opacity-90">{description}</p>
        </Link>
    </motion.div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode; className?: string; isEmpty?: boolean; emptyStateProps?: { icon: React.ReactNode; title: string; message: string; } }> = ({ title, children, className = "", isEmpty = false, emptyStateProps }) => (
    <motion.div 
        className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg w-full ${className}`} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
    >
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="h-72 w-full">
            {isEmpty && emptyStateProps 
                ? <EmptyState {...emptyStateProps} /> 
                : children
            }
        </div>
    </motion.div>
);

const ReportHeatmap: React.FC<{ points: HeatmapPoint[] }> = ({ points }) => {
    const addressPoints: [number, number, number][] = points.map(p => [p.latitude, p.longitude, p.intensity]);
    const center: [number, number] = points.length > 0 ? [points[0].latitude, points[0].longitude] : [20.5937, 78.9629];

    return (
        <MapContainer center={center} zoom={points.length > 0 ? 12 : 5} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>' />
            {addressPoints.length > 0 && <HeatmapLayer points={addressPoints} longitudeExtractor={(m: any) => m[1]} latitudeExtractor={(m: any) => m[0]} intensityExtractor={(m: any) => m[2]} radius={25} blur={20} max={1.0} />}
        </MapContainer>
    );
};


// --- LOADING SKELETONS ---
const KpiCardSkeleton = () => (
    <div className="p-6 rounded-xl shadow-lg bg-gray-50 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-gray-200 w-12 h-12"></div>
                <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
            <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
        </div>
    </div>
);
const ChartSkeleton = () => <div className="h-full w-full bg-gray-50 rounded-lg animate-pulse"></div>;
const DashboardSkeleton: React.FC<{ isMunicipal: boolean }> = ({ isMunicipal }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCardSkeleton /> <KpiCardSkeleton /> <KpiCardSkeleton /> <KpiCardSkeleton />
        </div>
        <div className={`grid grid-cols-1 ${isMunicipal ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1"><ChartSkeleton /></div>
            <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1"><ChartSkeleton /></div>
            {!isMunicipal && <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-1"><ChartSkeleton /></div>}
        </div>
    </div>
);


// --- MUNICIPAL DASHBOARD COMPONENT ---
const MunicipalDashboard: React.FC<{ data: { kpis: MunicipalKpi; heatmap: HeatmapPoint[]; report_trends_30_days: { date: string, count: number }[]; issue_category_breakdown: CategoryBreakdown[]; severity_breakdown: SeverityBreakdown[]; top_contributors: TopContributor[] } }> = ({ data }) => {
    const { kpis, heatmap, report_trends_30_days: trends, issue_category_breakdown: categoryBreakdown, severity_breakdown: severityBreakdown, top_contributors: contributors } = data;
    const PIE_COLORS = ['#0d9488', '#0891b2', '#0284c7', '#4338ca', '#6d28d9'];
    const SEVERITY_COLORS: { [key: string]: string } = { 'LOW': '#22c55e', 'MEDIUM': '#f59e0b', 'HIGH': '#ef4444' };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard icon={<FileText size={28} />} title="Total Reports" value={(kpis.total_reports ?? 0).toLocaleString()} color="#0d9488" changeData={kpis.reports_in_last_30_days} />
                <KpiCard icon={<FileClock size={28} />} title="Pending / Verified" value={`${kpis.pending_reports ?? 0} / ${kpis.verified_reports ?? 0}`} color="#0891b2" />
                <KpiCard icon={<Users size={28} />} title="Active Citizens" value={(kpis.total_active_citizens ?? 0).toLocaleString()} color="#4338ca" />
                <KpiCard icon={<Clock size={28} />} title="Avg. Resolution (Hrs)" value={kpis.average_resolution_time_hours?.toFixed(1) || 'N/A'} color="#ca8a04" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title="Report Trends (Last 30 Days)" isEmpty={!trends || trends.length === 0} emptyStateProps={{ icon: <LineChart />, title: "No Recent Reports", message: "Report data for the last 30 days will appear here." }}>
                    <ResponsiveContainer><AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '0.5rem' }} /><defs><linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/><stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="count" stroke="#0d9488" fill="url(#colorReports)" /></AreaChart></ResponsiveContainer>
                </ChartContainer>
                <ChartContainer title="Report Intensity Heatmap" isEmpty={!heatmap || heatmap.length === 0} emptyStateProps={{ icon: <Inbox />, title: "No Location Data", message: "Report locations will be visualized on the map here." }}>
                    <Suspense fallback={<ChartSkeleton />}><ReportHeatmap points={heatmap} /></Suspense>
                </ChartContainer>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <ChartContainer title="Top Issue Categories" className="lg:col-span-2" isEmpty={!categoryBreakdown || categoryBreakdown.length === 0} emptyStateProps={{ icon: <BarChart3 />, title: "No Categories", message: "Report categories will be broken down here." }}>
                    <ResponsiveContainer><PieChart><Pie data={categoryBreakdown} dataKey="count" nameKey="category_name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} labelLine={false}>{categoryBreakdown.map((_entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
                </ChartContainer>
                <ChartContainer title="Reports by Severity" className="lg:col-span-3" isEmpty={!severityBreakdown || severityBreakdown.length === 0} emptyStateProps={{ icon: <ShieldCheck />, title: "No Severity Data", message: "Report severity levels will be displayed here." }}>
                    <ResponsiveContainer><BarChart data={severityBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" hide /><YAxis type="category" dataKey="severity" tickLine={false} axisLine={false} tick={{ fontSize: 14 }} width={80} /><Tooltip cursor={{ fill: '#f3f4f6' }} /><Bar dataKey="count" name="Reports" barSize={30} radius={[0, 10, 10, 0]}>{severityBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity?.toUpperCase()] || '#8884d8'} />))}</Bar></BarChart></ResponsiveContainer>
                </ChartContainer>
            </div>
             <motion.div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Citizen Contributors</h3>
                {contributors && contributors.length > 0 ? (
                    <div className="overflow-x-auto"><table className="w-full text-sm text-left text-gray-500"><thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th scope="col" className="px-6 py-3">Contributor</th><th scope="col" className="px-6 py-3 text-center">Reports Filed</th><th scope="col" className="px-6 py-3 text-right">Total Points</th></tr></thead><tbody>
                        {contributors.map((c, index) => (
                            <motion.tr key={c.full_name} className="bg-white border-b hover:bg-teal-50" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                                <td className="px-6 py-4 flex items-center gap-4"><strong className="text-lg text-teal-600">#{index + 1}</strong> <UserAvatar name={c.full_name} imageUrl={c.profile_image_url} /> <span className="font-medium text-gray-900">{c.full_name}</span></td>
                                <td className="px-6 py-4 text-center">{c.reports_filed}</td>
                                <td className="px-6 py-4 text-teal-600 font-bold text-right">{c.total_points.toLocaleString()}</td>
                            </motion.tr>
                        ))}
                    </tbody></table></div>
                ) : <EmptyState icon={<Users />} title="No Top Contributors Yet" message="Recognized citizens will be listed here." />}
            </motion.div>
        </div>
    );
};

// --- CITIZEN DASHBOARD COMPONENT ---
const CitizenDashboard: React.FC<{ data: { kpis: CitizenKpi; recent_activity: RecentActivity[]; next_badge_progress: NextBadgeProgress | null } }> = ({ data }) => {
    const { kpis, recent_activity: activities, next_badge_progress: nextBadge } = data;
    const getActivityIcon = (type: string) => ({ 'points': <TrendingUp size={20} className="text-amber-500" />, 'badge': <Award size={20} className="text-indigo-500" /> }[type] || <Zap size={20} />);
    const chartData = [{ name: 'Resolved', value: kpis.reports_actioned ?? 0, fill: '#22c55e' }, { name: 'Pending', value: kpis.reports_pending ?? 0, fill: '#f59e0b' }];
    const totalReportsFiled = kpis.reports_filed ?? 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard icon={<Trophy size={28} />} title="Total Points" value={(kpis.total_points ?? 0).toLocaleString()} color="#0d9488" />
                <KpiCard icon={<BarChart3 size={28} />} title="Overall Rank" value={kpis.rank ? `#${kpis.rank}` : 'N/A'} color="#0891b2" />
                <KpiCard icon={<FileText size={28} />} title="Reports Filed" value={totalReportsFiled} color="#4338ca" />
                <KpiCard icon={<FileCheck size={28} />} title="Reports Verified" value={kpis.reports_verified ?? 0} color="#6d28d9" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard 
                    to="/app/report/new" 
                    icon={<PlusCircle size={28}/>}
                    title="Report a New Issue"
                    description="Found a problem? Scan a QR code to submit a new report and earn points."
                    color="bg-gradient-to-br from-blue-600 to-blue-500"
                />
                 <ActionCard 
                    to="/app/verify" 
                    icon={<ShieldCheck size={28}/>}
                    title="Verify Reports"
                    description="Help the community by verifying pending reports. Your contribution matters (and earns rewards!)."
                    color="bg-gradient-to-br from-teal-600 to-teal-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ChartContainer title="My Impact" className="lg:col-span-1" isEmpty={totalReportsFiled === 0} emptyStateProps={{ icon: <FileText/>, title:"No Reports Filed", message:"File a report to see your impact here."}}>
                    <ResponsiveContainer><RadialBarChart innerRadius="25%" outerRadius="90%" data={chartData} startAngle={180} endAngle={0} barSize={35}>
                        <PolarAngleAxis type="number" domain={[0, totalReportsFiled]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey='value' angleAxisId={0} data={[{ value: totalReportsFiled }]} fill="#e5e7eb" cornerRadius={10} />
                        <RadialBar dataKey='value' angleAxisId={0} cornerRadius={10} />
                        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-gray-700">{totalReportsFiled}</text>
                        <text x="50%" y="70%" textAnchor="middle" dominantBaseline="middle" className="text-sm fill-gray-500">Total Reports</text>
                        <Legend iconSize={10} wrapperStyle={{ fontSize: "12px", bottom: '10px' }} />
                    </RadialBarChart></ResponsiveContainer>
                </ChartContainer>
                <motion.div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                        {activities && activities.length > 0 ? activities.map((activity, index) => (
                            <motion.div key={`${activity.timestamp}-${index}`} className="flex items-center space-x-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                                <div className="p-3 bg-slate-100 rounded-full">{getActivityIcon(activity.activity_type)}</div>
                                <div className="flex-grow"><p className="text-sm font-medium text-gray-800">{activity.details}</p><p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p></div>
                                {activity.points !== 0 && (<p className={`text-sm font-bold ${activity.points > 0 ? 'text-green-500' : 'text-red-500'}`}>{activity.points > 0 ? `+${activity.points}` : activity.points}</p>)}
                            </motion.div>
                        )) : <EmptyState icon={<Zap/>} title="No Recent Activity" message="Your points and badges will appear here."/>}
                    </div>
                </motion.div>
            </div>

            {nextBadge && (
                <motion.div className="bg-gradient-to-tr from-teal-50 to-cyan-50 p-6 rounded-xl shadow-lg w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Next Goal: <span className="text-teal-600">{nextBadge.name}</span></h3>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <motion.div className="flex-shrink-0 text-center" whileHover={{ y: -5 }}><img src={nextBadge.icon_url || `https://placehold.co/96x96/0d9488/FFFFFF?text=B`} alt={nextBadge.name} className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white" /><p className="text-xs text-gray-600 mt-2 max-w-xs mx-auto">{nextBadge.description}</p></motion.div>
                        <div className="flex-grow w-full space-y-4">
                            {nextBadge.required_points > 0 && <ProgressDisplay label="Points" current={nextBadge.current_points} required={nextBadge.required_points} color="#0d9488" />}
                            {nextBadge.required_reports > 0 && <ProgressDisplay label="Reports Filed" current={nextBadge.current_reports} required={nextBadge.required_reports} color="#4338ca" />}
                            {nextBadge.required_verifications > 0 && <ProgressDisplay label="Verifications" current={nextBadge.current_verifications} required={nextBadge.required_verifications} color="#6d28d9" />}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const ProgressDisplay: React.FC<{ label: string; current: number; required: number; color: string }> = ({ label, current, required, color }) => {
    const percent = required > 0 ? Math.min(100, Math.round((current / required) * 100)) : 0;
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{current.toLocaleString()} / {required.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="h-3 rounded-full transition-all duration-300" style={{ width: `${percent}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD PAGE COMPONENT (Orchestrator) ---
const DashboardPage: React.FC = () => {
    const { user, isLoading: authLoading, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMunicipal = useMemo(() => user?.role === 'MUNICIPAL_ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR', [user]);

    useEffect(() => {
        if (authLoading) return;
        document.title = 'Dashboard - Swachh Bandhu';
        if (!user) { setLoading(false); return; }

        const fetchDashboardData = async () => {
            setLoading(true); setError(null);
            const endpoint = isMunicipal ? '/dashboard/summary/municipal/' : '/dashboard/summary/citizen/';
            try {
                const response = await apiClient.get(endpoint);
                setDashboardData(response.data);
            } catch (err) {
                setError('Failed to load dashboard data. Please try again.');
                console.error('Dashboard fetch error:', err);
            } finally { setLoading(false); }
        };

        fetchDashboardData();
    }, [isMunicipal, authLoading, user]);
    
    if (authLoading) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="mx-auto p-4 sm:p-6 lg:p-8 mt-20">
            <motion.div className="mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <header className="mb-8 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        {user && <UserAvatar name={user.full_name} imageUrl={user.profile_picture_url} className="w-14 h-14" />}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1">{user ? `Welcome back, ${user.full_name}!` : 'Welcome to the Dashboard'}</p>
                        </div>
                    </div>
                </header>

                {loading ? <DashboardSkeleton isMunicipal={isMunicipal} /> : 
                 error ? <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">{error}</div> :
                    <AnimatePresence mode="wait">
                        <motion.div key={isMunicipal ? 'municipal' : 'citizen'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                            {isMunicipal && dashboardData ? <MunicipalDashboard data={dashboardData} /> : 
                             !isMunicipal && dashboardData ? <CitizenDashboard data={dashboardData} /> :
                             <div className="text-gray-500 text-center p-8">Could not load dashboard data.</div>
                            }
                        </motion.div>
                    </AnimatePresence>
                }
            </motion.div>
        </div>
    );
};

export default DashboardPage;