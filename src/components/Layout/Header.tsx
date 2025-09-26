import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Shield, Target, Eye, Users, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onViewChange: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onViewChange }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleInfo = () => {
    switch (user?.role) {
      case 'admin':
        return {
          icon: Shield,
          title: 'System Administrator',
          color: 'text-purple-600 bg-purple-100',
          description: 'Full system access'
        };
      case 'pm':
        return {
          icon: Target,
          title: 'Project Manager',
          color: 'text-green-600 bg-green-100',
          description: 'Project oversight'
        };
      case 'member':
        return {
          icon: Users,
          title: 'Team Member',
          color: 'text-indigo-600 bg-indigo-100',
          description: 'Task execution'
        };
      default:
        return {
          icon: Eye,
          title: 'Client',
          color: 'text-blue-600 bg-blue-100',
          description: 'Project tracking'
        };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="NexaFlow" 
              className="h-10 w-auto"
            />
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${roleInfo.color}`}>
            <RoleIcon className="w-4 h-4" />
            <span className="font-medium">{roleInfo.title}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={user?.role === 'admin' ? 'Search system...' : 'Search projects...'}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          
          <button 
            onClick={() => {
              console.log('Notifications functionality would go here');
            }}
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{roleInfo.description}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onViewChange('settings');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;