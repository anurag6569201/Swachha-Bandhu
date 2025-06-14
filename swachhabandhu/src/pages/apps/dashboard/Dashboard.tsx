import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../Api';
import { Award, BarChart3, Clock, Compass, FileCheck, FileClock, FileText, Globe, Hash, Map, UserCheck, Users, TrendingUp, Zap, LogOut } from 'lucide-react'; // Added LogOut icon

// --- TYPE DEFINITIONS for API Data ---
interface MunicipalKpi {
  total_reports: number;
  pending_reports: number;
  verified_reports: number;
  actioned_reports: number;
  rejected_reports: number;
  total_active_citizens: number;
  average_resolution_time_hours: number | null;
  total_locations: number;
}

interface CitizenKpi {
    total_points: number;
    rank: number | null;
    reports_filed: number;
    reports_verified: number;
    reports_actioned: number;
    reports_pending: number;
}

interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
}

interface TrendPoint {
  date: string;
  count: number;
}

interface IssueBreakdown {
  issue_type: string;
  count: number;
  percentage: number;
}

interface TopContributor {
    full_name: string;
    total_points: number;
    reports_filed: number;
}

interface RecentActivity {
    activity_type: 'points' | 'badge';
    details: string;
    points: number;
    timestamp: string;
    report_id: number | null;
    badge_name: string | null;
    badge_icon_url: string | null;
}

// --- REUSABLE UI COMPONENTS ---
const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; }> = ({ icon, title, value, color }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md border-l-4"
    style={{ borderColor: color }}
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="flex items-center">
      <div className={`mr-4 p-3 rounded-full bg-opacity-10`} style={{ backgroundColor: `${color}20`, color }}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </motion.div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
  <motion.div 
    className="bg-white p-6 rounded-xl shadow-md w-full"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-72">
      {children}
    </div>
  </motion.div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <motion.div
            className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-teal-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    </div>
);

// --- MAIN DASHBOARD PAGE COMPONENT ---
const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading, logout } = useAuth(); // Destructure logout from useAuth
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMunicipal = useMemo(() => user?.role === 'MUNICIPAL_ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'MODERATOR', [user]);

  useEffect(() => {
    document.title = 'Dashboard - Swachh Bandhu';
    if (authLoading || !user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const endpoint = isMunicipal ? '/dashboard/summary/municipal/' : '/dashboard/summary/citizen/';
      try {
        const response = await apiClient.get(endpoint);
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data. Please try refreshing the page.');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isMunicipal, authLoading, user]);

  const handleLogout = async () => {
    await logout();
  };

  if (authLoading || loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500">{error}</div>;
  }
  
  return (
    <div className="mt-20 min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8 flex justify-between items-center"> {/* Added flex container */}
            <div>
                <h1 className="pt-0 mt-0 text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    {isMunicipal ? `Welcome, ${user?.full_name}. Here is the overview for your municipality.` : `Welcome back, ${user?.full_name}! Here is your contribution summary.`}
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            >
                <LogOut size={20} className="mr-2" />
                Logout
            </button>
        </header>

        <AnimatePresence>
            {isMunicipal && dashboardData && <MunicipalDashboard data={dashboardData} />}
            {!isMunicipal && dashboardData && <CitizenDashboard data={dashboardData} />}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- MUNICIPAL DASHBOARD COMPONENT ---
const MunicipalDashboard: React.FC<{ data: any }> = ({ data }) => {
    const kpi: MunicipalKpi = data.kpi;
    const trends: TrendPoint[] = data.report_trends;
    const breakdown: IssueBreakdown[] = data.issue_type_breakdown;
    const contributors: TopContributor[] = data.top_contributors;

    const PIE_COLORS = ['#0d9488', '#0891b2', '#0284c7', '#4338ca', '#6d28d9'];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<FileText size={24} />} title="Total Reports" value={kpi.total_reports} color="#0d9488" />
                <StatCard icon={<FileClock size={24} />} title="Pending / Verified" value={`${kpi.pending_reports} / ${kpi.verified_reports}`} color="#0891b2" />
                <StatCard icon={<FileCheck size={24} />} title="Actioned Reports" value={kpi.actioned_reports} color="#16a34a" />
                <StatCard icon={<Clock size={24} />} title="Avg. Resolution (Hours)" value={kpi.average_resolution_time_hours || 'N/A'} color="#ca8a04" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ChartContainer title="Report Trends (Last 30 Days)">
                        <ResponsiveContainer>
                            <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '0.5rem' }} />
                                <defs>
                                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="count" stroke="#0d9488" fillOpacity={1} fill="url(#colorReports)" name="Reports" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
                <div>
                    <ChartContainer title="Top Issue Types">
                         <ResponsiveContainer>
                            <PieChart>
                                <Pie data={breakdown} dataKey="count" nameKey="issue_type" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                        return (
                                        <text x={x} y={y} fill="#4b5563" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                        );
                                }}>
                                    {breakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend iconSize={10} wrapperStyle={{fontSize: "10px"}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </div>

            {/* Top Contributors Table */}
            <div>
                 <div className="bg-white p-6 rounded-xl shadow-md w-full">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Citizen Contributors</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Rank</th>
                                    <th scope="col" className="px-6 py-3">Contributor</th>
                                    <th scope="col" className="px-6 py-3">Reports Filed</th>
                                    <th scope="col" className="px-6 py-3">Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributors.map((c, index) => (
                                <motion.tr 
                                    key={c.full_name} 
                                    className="bg-white border-b hover:bg-teal-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{c.full_name}</td>
                                    <td className="px-6 py-4">{c.reports_filed}</td>
                                    <td className="px-6 py-4 text-teal-600 font-bold">{c.total_points}</td>
                                </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            </div>
        </div>
    );
};

// --- CITIZEN DASHBOARD COMPONENT ---
const CitizenDashboard: React.FC<{ data: any }> = ({ data }) => {
    const kpi: CitizenKpi = data.kpi;
    const activities: RecentActivity[] = data.recent_activity;

    const getActivityIcon = (type: string) => {
        switch(type) {
            case 'points': return <Award size={20} className="text-amber-500" />;
            case 'badge': return <Award size={20} className="text-indigo-500" />;
            default: return <Zap size={20} className="text-gray-500" />;
        }
    }
    
    return (
         <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Award size={24} />} title="Total Points" value={kpi.total_points} color="#0d9488" />
                <StatCard icon={<TrendingUp size={24} />} title="Overall Rank" value={kpi.rank ? `#${kpi.rank}` : 'N/A'} color="#0891b2" />
                <StatCard icon={<FileText size={24} />} title="Reports Filed" value={kpi.reports_filed} color="#4338ca" />
                <StatCard icon={<UserCheck size={24} />} title="Reports Verified" value={kpi.reports_verified} color="#6d28d9" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* My Impact */}
                <div className="lg:col-span-1">
                    <ChartContainer title="My Impact">
                       <div className="h-full flex flex-col justify-around text-center">
                            <div>
                                <p className="text-4xl font-bold text-green-500">{kpi.reports_actioned}</p>
                                <p className="text-gray-500">Reports Resolved</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-yellow-500">{kpi.reports_pending}</p>
                                <p className="text-gray-500">Reports Pending</p>
                            </div>
                       </div>
                    </ChartContainer>
                </div>

                {/* Recent Activity Feed */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-md w-full">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {activities.map((activity, index) => (
                                <motion.div 
                                    key={index}
                                    className="flex items-center space-x-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        {getActivityIcon(activity.activity_type)}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-gray-800">{activity.details}</p>
                                        <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                                    </div>
                                    {activity.points !== 0 && (
                                        <p className={`text-sm font-bold ${activity.points > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {activity.points > 0 ? `+${activity.points}` : activity.points}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;