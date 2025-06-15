// src/pages/apps/components/AppLayout.tsx
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
    LayoutDashboard, FileText, CheckSquare, Award, User, LogOut, Menu, X, Landmark, SlidersHorizontal 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const UserAvatar: React.FC<{ name: string; className?: string; }> = ({ name, className = 'w-10 h-10' }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    return (
        <div className={`${className} bg-teal-600 rounded-full flex items-center justify-center text-white font-bold`}>
            {initials}
        </div>
    );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ to, icon, children }) => (
    <NavLink 
        to={to}
        className={({ isActive }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        {icon}
        <span className="ml-3">{children}</span>
    </NavLink>
);

const MobileNavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; onClick: () => void; }> = ({ to, icon, children, onClick }) => (
     <NavLink 
        to={to}
        onClick={onClick}
        className={({ isActive }) => `flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        {icon}
        <span className="ml-4">{children}</span>
    </NavLink>
);


const AppLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    if (!user) return null;

    const isAdmin = ['MUNICIPAL_ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(user.role);

    const navItems = (
        <>
            <NavItem to="/app/dashboard" icon={<LayoutDashboard size={20} />}>Dashboard</NavItem>
            <NavItem to="/app/reports" icon={<FileText size={20} />}>My Reports</NavItem>
            {/* We'll add this new page next */}
            <NavItem to="/app/verify" icon={<CheckSquare size={20} />}>Verify Reports</NavItem>
            <NavItem to="/app/lottery" icon={<Award size={20} />}>Rewards</NavItem>
            {isAdmin && (
                 <NavItem to="/app/manage/reports" icon={<SlidersHorizontal size={20} />}>Manage Reports</NavItem>
            )}
        </>
    );

    const mobileNavItems = (
        <>
            <MobileNavItem to="/app/dashboard" icon={<LayoutDashboard size={24} />} onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavItem>
            <MobileNavItem to="/app/reports" icon={<FileText size={24} />} onClick={() => setMobileMenuOpen(false)}>My Reports</MobileNavItem>
            <MobileNavItem to="/app/verify" icon={<CheckSquare size={24} />} onClick={() => setMobileMenuOpen(false)}>Verify Reports</MobileNavItem>
            <MobileNavItem to="/app/lottery" icon={<Award size={24} />} onClick={() => setMobileMenuOpen(false)}>Rewards</MobileNavItem>
             {isAdmin && (
                 <MobileNavItem to="/app/manage/reports" icon={<SlidersHorizontal size={24} />} onClick={() => setMobileMenuOpen(false)}>Manage Reports</MobileNavItem>
            )}
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-shrink-0">
                <div className="flex flex-col w-64">
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
                         <Landmark className="h-8 w-auto text-teal-600" />
                         <span className="ml-2 text-xl font-bold text-gray-800">Swachh Bandhu</span>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto bg-white border-r">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navItems}
                        </nav>
                        <div className="flex-shrink-0 p-4 border-t">
                             <NavLink to="/app/profile" className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100">
                                <UserAvatar name={user.full_name} />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">{user.full_name}</p>
                                    <p className="text-xs text-gray-500">{user.role.replace(/_/g, ' ')}</p>
                                </div>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col w-0 flex-1 overflow-hidden">
                {/* Mobile Header */}
                 <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow lg:hidden">
                    <button onClick={() => setMobileMenuOpen(true)} className="px-4 border-r border-gray-200 text-gray-500">
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                           <Landmark className="h-8 w-auto text-teal-600" />
                           <span className="ml-2 text-xl font-bold text-gray-800">Swachh Bandhu</span>
                        </div>
                         <button onClick={logout} className="text-gray-500 hover:text-red-600">
                           <LogOut size={22}/>
                        </button>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <Outlet /> {/* This is where the routed page component will be rendered */}
                </main>
            </div>
            
            {/* Mobile Menu */}
             <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-40"
                    >
                        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                            className="relative flex-1 flex flex-col max-w-xs w-full bg-white"
                        >
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button onClick={() => setMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                                <div className="flex-shrink-0 flex items-center px-4">
                                     <Landmark className="h-8 w-auto text-teal-600" />
                                     <span className="ml-2 text-xl font-bold text-gray-800">Swachh Bandhu</span>
                                </div>
                                <nav className="mt-5 px-2 space-y-1">{mobileNavItems}</nav>
                            </div>
                            <div className="flex-shrink-0 flex border-t p-4">
                                <NavLink to="/app/profile" onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0 group block">
                                    <div className="flex items-center">
                                        <div><UserAvatar name={user.full_name} /></div>
                                        <div className="ml-3">
                                            <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{user.full_name}</p>
                                            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AppLayout;