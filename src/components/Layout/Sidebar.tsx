import React from 'react';
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Settings, 
  Users, 
  Zap,
  Bell,
  Shield,
  Target,
  Eye,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Admin Dashboard', icon: Shield },
        { id: 'requests', label: 'Client Requests', icon: FileText },
        { id: 'projects', label: 'All Projects', icon: FolderOpen },
        { id: 'team', label: 'User Management', icon: Users },
        { id: 'analytics', label: 'System Analytics', icon: BarChart3 },
        { id: 'automations', label: 'Automations', icon: Zap },
        { id: 'notifications', label: 'System Alerts', icon: Bell },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ];
    } else if (user?.role === 'pm') {
      return [
        { id: 'dashboard', label: 'PM Dashboard', icon: Target },
        { id: 'projects', label: 'Assigned Projects', icon: FolderOpen },
        { id: 'team', label: 'Task Management', icon: Users },
        { id: 'communications', label: 'Client Communications', icon: MessageSquare },
        { id: 'analytics', label: 'Team Analytics', icon: BarChart3 },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    } else if (user?.role === 'member') {
      return [
        { id: 'dashboard', label: 'My Tasks', icon: CheckSquare },
        { id: 'documents', label: 'Resources', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Profile', icon: Settings },
      ];
    } else {
      return [
        { id: 'dashboard', label: 'Service Requests', icon: Eye },
        { id: 'communications', label: 'Project Updates', icon: MessageSquare },
        { id: 'projects', label: 'My Projects', icon: FolderOpen },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="NexaFlow" 
            className="h-10 w-auto"
          />
          <div>
            <p className="text-xs text-gray-500">Actually helps you finish things</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;