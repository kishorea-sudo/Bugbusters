import React from 'react';
import { Users, Settings, Shield, Database, BarChart3, Key, Globe, AlertTriangle } from 'lucide-react';
import { User } from '../../types';

interface AdminDashboardProps {
  user: User;
  projects: any[];
  activities: any[];
  onViewChange?: (view: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ projects, onViewChange: _onViewChange }) => {
  const systemStats = {
    totalUsers: 24,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalStorage: '2.4 GB',
    apiCalls: '1,247',
    systemHealth: 'Excellent',
    securityAlerts: 0
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">System Administration</h1>
            <p className="text-blue-100">Complete platform control and monitoring</p>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-lg font-bold text-green-600">{systemStats.systemHealth}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">99.9% uptime</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">{systemStats.totalStorage}</p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-500 mt-2">of 10 GB limit</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{systemStats.securityAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">All systems secure</p>
        </div>
      </div>

      {/* Admin Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              User Management
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Active Users</p>
                  <p className="text-sm text-gray-600">Currently online: 8</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('Manage users functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  Manage
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Role Permissions</p>
                  <p className="text-sm text-gray-600">Configure access levels</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('Configure permissions functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Audit Logs</p>
                  <p className="text-sm text-gray-600">View system activity</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('View audit logs functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                >
                  View Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Configuration */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              System Configuration
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">API Keys</p>
                  <p className="text-sm text-gray-600">Manage external integrations</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('Manage API keys functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Key className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Environment Settings</p>
                  <p className="text-sm text-gray-600">Production/Demo mode</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('Environment settings functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Globe className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Backup & Recovery</p>
                  <p className="text-sm text-gray-600">Data protection settings</p>
                </div>
                <button 
                  onClick={() => {
                    console.log('Backup & Recovery functionality would go here');
                  }}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <Database className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent System Activities */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Activities</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { action: 'New user registration', user: 'john.doe@company.com', time: '2 minutes ago', type: 'user' },
              { action: 'API key generated', user: 'Admin', time: '15 minutes ago', type: 'security' },
              { action: 'Database backup completed', user: 'System', time: '1 hour ago', type: 'system' },
              { action: 'Storage cleanup executed', user: 'System', time: '2 hours ago', type: 'maintenance' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-l-4 border-l-purple-400 bg-purple-50">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">By {activity.user}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.time}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    activity.type === 'security' ? 'bg-red-100 text-red-700' :
                    activity.type === 'user' ? 'bg-green-100 text-green-700' :
                    activity.type === 'system' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;