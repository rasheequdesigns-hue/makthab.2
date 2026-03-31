import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLibraryStore } from '../store/useLibraryStore';
import { 
  Library, User, Database, 
  Menu, X, Moon, Sun, LogOut,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const { isAdminAuthenticated, currentUser, logout, theme, toggleTheme } = useLibraryStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const NavItem = ({ to, icon, label }) => (
    <NavLink 
      to={to} 
      onClick={() => setMobileMenuOpen(false)}
      className={({ isActive }) => `
        flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-white'}
      `}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <div 
              onClick={() => navigate('/')} 
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer"
            >
              <div className="p-2 bg-blue-600 text-white rounded-lg">
                 <Library size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Library System</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {currentUser && <NavItem to="/" icon={<Database size={18} />} label="Catalog" />}
              {currentUser && currentUser.role === 'student' && <NavItem to="/profile" icon={<User size={18} />} label="My Profile" />}
              {isAdminAuthenticated && <NavItem to="/admin" icon={<Shield size={18} />} label="Dashboard" />}
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
               onClick={toggleTheme}
               className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
               aria-label="Toggle Theme"
             >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {currentUser && (
               <button 
                 onClick={handleLogout}
                 className="hidden sm:flex items-center gap-2 p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                 title="Log out"
               >
                 <LogOut size={20} />
               </button>
             )}

             {/* Mobile menu button */}
             <div className="flex items-center sm:hidden ml-2">
               <button 
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                 className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
               >
                 {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
               </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {currentUser && <NavItem to="/" icon={<Database size={18} />} label="Catalog" />}
            {currentUser && currentUser.role === 'student' && <NavItem to="/profile" icon={<User size={18} />} label="My Profile" />}
            {isAdminAuthenticated && <NavItem to="/admin" icon={<Shield size={18} />} label="Dashboard" />}
            {currentUser && (
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors text-left"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
