import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, CheckCircle, AlertCircle, List, LogOut } from 'lucide-react'; // Added LogOut icon
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../context/AuthContext';
import SectionHeading from '../../landing/components/ui/SectionHeading';
import Button from '../../landing/components/ui/Button';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, delay = 0 }) => {
  return (
    <motion.div
      className={`p-6 rounded-xl shadow-lg text-white ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
      <p className="text-4xl font-bold">{value}</p>
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth(); // Get logout function from useAuth
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    document.title = 'Dashboard - Swachh Bandhu';
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(); // Call your logout function
      navigate('/auth/login'); // Redirect to login page (adjust path if different)
    } catch (error) {
      console.error("Failed to logout:", error);
      // Optionally, show an error message to the user
    }
  };

  // Placeholder data
  const stats = [
    { title: 'Reports Submitted', value: 125, icon: <BarChart2 />, color: 'bg-teal-500', delay: 0.1 },
    { title: 'Active Volunteers', value: 34, icon: <Users />, color: 'bg-sky-500', delay: 0.2 },
    { title: 'Issues Resolved', value: 98, icon: <CheckCircle />, color: 'bg-green-500', delay: 0.3 },
    { title: 'Pending Actions', value: 12, icon: <AlertCircle />, color: 'bg-amber-500', delay: 0.4 },
  ];

  const recentActivity = [
    { id: 1, description: 'New cleanliness report submitted for Ward 5.', time: '2 hours ago', type: 'report' },
    { id: 2, description: 'Volunteer John Doe joined the platform.', time: '5 hours ago', type: 'user' },
    { id: 3, description: 'Issue #102 (Pothole) marked as resolved.', time: '1 day ago', type: 'resolved' },
    { id: 4, description: 'Scheduled cleanup drive for Sunday confirmed.', time: '2 days ago', type: 'event' },
  ];

  const getIconForActivity = (type: string) => {
    switch (type) {
      case 'report': return <BarChart2 className="text-teal-500" />;
      case 'user': return <Users className="text-sky-500" />;
      case 'resolved': return <CheckCircle className="text-green-500" />;
      case 'event': return <List className="text-purple-500" />;
      default: return <List className="text-gray-500" />;
    }
  }

  return (
    <div className="mt-20 min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            title={`Welcome back, ${user?.full_name || user?.email || 'User'}!`}
            subtitle="Here's an overview of your Swachh Bandhu activity."
            className="mb-8 text-left"
            titleClassName="!text-3xl"
          />
        </motion.div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Recent Activity & Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Changed to lg:grid-cols-2 for better layout */}
          {/* Recent Activity */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <List className="mr-2 text-gray-600" /> Recent Activity
            </h3>
            {recentActivity.length > 0 ? (
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 rounded-md transition-colors">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      {getIconForActivity(activity.type)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No recent activity to display.</p>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3"> {/* Increased spacing a bit */}
              <Button variant="primary" className="w-full">Submit New Report</Button>
              <Button variant="secondary" className="w-full">View My Reports</Button>
              <Button
                variant="danger" // Assuming you have a 'danger' or 'outline' variant, or style it accordingly
                className="w-full flex items-center justify-center" // For icon alignment
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" /> Logout
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;