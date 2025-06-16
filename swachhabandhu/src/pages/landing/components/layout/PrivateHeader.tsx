import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Award, User, LogOut, Menu, X, FilePenLine, FileText, CheckSquare, SlidersHorizontal 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo'; // Assuming you have a Logo component
import { useAuth } from '../../../../context/AuthContext'; // Make sure this path is correct

// --- A simple hook to detect clicks outside an element ---
const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// --- Avatar Component ---
const UserAvatar: React.FC<{ name: string; imageUrl?: string | null; className?: string; }> = ({ name, imageUrl, className = 'w-10 h-10' }) => {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    if (imageUrl) {
        return <img src={imageUrl} alt={name} className={`${className} rounded-full object-cover bg-gray-200`} />;
    }
    return (
        <div className={`${className} bg-teal-600 rounded-full flex items-center justify-center text-white font-semibold`}>
            {initials}
        </div>
    );
};


const PrivateHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  // --- FIX: Get user and logout from the AuthContext ---
  const { user, logout } = useAuth(); 

  useOnClickOutside(profileMenuRef, () => setIsProfileOpen(false));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    // The logout function in context will handle redirection
  };

  const navLinks = [
    { name: 'Dashboard', path: '/app/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Rewards', path: '/app/lottery', icon: <Award size={18} /> },
    { name: 'Report New', path: '/app/report/new', icon: <FilePenLine size={18} /> },
    { name: 'My Reports', path: '/app/reports', icon: <FileText size={18} /> },
    { name: 'Verify Reports', path: '/app/verify', icon: <CheckSquare size={18} /> },
  ];

  const profileLinks = [
    { name: 'My Profile', path: '/app/profile', icon: <User size={16} /> },
    { name: 'My Reports', path: '/app/reports', icon: <FileText size={16} /> },
  ];
  
  // Return null or a loading state if user data isn't available yet
  if (!user) {
      return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white py-4 shadow-sm">
            <div className="container mx-auto flex justify-between items-center">
                <Logo />
                <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
        </header>
      );
  }

  const isAdmin = ['MUNICIPAL_ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(user.role);

  return (
    <header
      className={`px-4 sm:px-6 lg:px-8 fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/90 backdrop-blur-sm shadow-md border-b border-slate-200/70 py-2'
        : 'bg-white py-4'
        }`}
    >
      <div className="mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <Logo />
            <span className="hidden sm:inline text-xl font-bold text-teal-700">Swachh Bandhu</span>
          </Link>
          
          <div className='flex items-center gap-3'>
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${location.pathname.startsWith(link.path)
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              {/* --- FIX: Use the 'isAdmin' boolean --- */}
              {isAdmin && (
                <Link
                  to="/app/manage/reports"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${location.pathname.startsWith('/app/manage/reports')
                    ? 'bg-teal-100 text-teal-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <SlidersHorizontal size={18} />
                  Manage Reports
                </Link>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="hidden lg:block">
                  {/* --- FIX: Use UserAvatar with user data --- */}
                  <UserAvatar name={user.full_name} imageUrl={user.profile_picture_url} className="w-10 h-10" />
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-200">
                          <p className="text-sm font-semibold text-slate-800 truncate">{user.full_name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <ul>
                        {profileLinks.map(link => (
                          <li key={link.name}>
                            <Link to={link.path} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100">
                              {link.icon}<span>{link.name}</span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            <LogOut size={16} /><span>Logout</span>
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
                className="lg:hidden p-2 text-slate-700 hover:text-teal-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-20 border-t border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={'mobile-' + link.name} to={link.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${location.pathname.startsWith(link.path) ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {link.icon} {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/app/manage/reports"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium ${location.pathname.startsWith('/app/manage/reports') ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'}`}>
                  <SlidersHorizontal size={18} /> Manage Reports
                </Link>
              )}
            </div>
            <div className="py-4 px-4 border-t border-slate-200">
                <div className="flex items-center mb-3">
                    <UserAvatar name={user.full_name} imageUrl={user.profile_picture_url} className="w-12 h-12" />
                    <div className="ml-3">
                        <p className="text-base font-medium text-slate-800">{user.full_name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <Link to="/app/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-700 hover:bg-slate-50">
                        <User size={18} /> My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50">
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PrivateHeader;