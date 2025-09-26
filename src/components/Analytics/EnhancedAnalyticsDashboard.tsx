import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Download, Filter, MessageCircle, Mail, Monitor } from 'lucide-react';
import { KPI } from '../../types';
import toast from 'react-hot-toast';

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [showExportModal, setShowExportModal] = useState(false);

  const kpis: KPI[] = [
    { name: 'Active Projects', value: 12, change: 8.3, trend: 'up', format: 'number' },
    { name: 'Avg Approval Time', value: 2.4, change: -12.5, trend: 'down', format: 'days' },
    { name: 'Overdue Items', value: 3, change: -25.0, trend: 'down', format: 'number' },
    { name: 'Client Satisfaction', value: 94, change: 5.2, trend: 'up', format: 'percentage' },
    { name: 'Weekly Velocity', value: 15.8, change: 12.7, trend: 'up', format: 'number' },
    { name: 'Revenue This Month', value: 125000, change: 18.3, trend: 'up', format: 'currency' },
  ];

  const projectData = [
    { name: 'Jan', completed: 4, inProgress: 8, overdue: 1 },
    { name: 'Feb', completed: 6, inProgress: 12, overdue: 2 },
    { name: 'Mar', completed: 8, inProgress: 15, overdue: 1 },
    { name: 'Apr', completed: 10, inProgress: 18, overdue: 3 },
    { name: 'May', completed: 12, inProgress: 14, overdue: 1 },
    { name: 'Jun', completed: 14, inProgress: 16, overdue: 2 },
  ];

  const approvalTimeData = [
    { name: 'Week 1', avgTime: 3.2, target: 2.5 },
    { name: 'Week 2', avgTime: 2.8, target: 2.5 },
    { name: 'Week 3', avgTime: 2.1, target: 2.5 },
    { name: 'Week 4', avgTime: 1.9, target: 2.5 },
  ];

  const statusData = [
    { name: 'Completed', value: 65, color: '#10B981' },
    { name: 'In Progress', value: 25, color: '#F59E0B' },
    { name: 'Overdue', value: 10, color: '#EF4444' },
  ];

  const channelData = [
    { name: 'In-App', approvals: 45, color: '#3B82F6' },
    { name: 'Email', approvals: 32, color: '#8B5CF6' },
    { name: 'WhatsApp', approvals: 23, color: '#10B981' },
  ];

  const formatKPIValue = (kpi: KPI) => {
    switch (kpi.format) {
      case 'currency':
        return `$${(kpi.value / 1000).toFixed(0)}k`;
      case 'percentage':
        return `${kpi.value}%`;
      case 'days':
        return `${kpi.value} days`;
      default:
        return kpi.value.toString();
    }
  };

  const exportData = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting analytics data as ${format.toUpperCase()}...`);
    setTimeout(() => {
      toast.success(`Analytics report downloaded as ${format.toUpperCase()}`);
    }, 2000);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h2>
          <p className="text-gray-600">Monitor project performance and team productivity</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.name} className="bg-white rounded-lg p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatKPIValue(kpi)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                kpi.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Project Completion Trends */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Project Completion Trends</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" radius={[4, 4, 0, 0]} />
              <Bar dataKey="overdue" fill="#EF4444" name="Overdue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Approval Time Trends */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Approval Time Trends</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={approvalTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`${value} days`, name]} />
              <Line 
                type="monotone" 
                dataKey="avgTime" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 6 }}
                name="Avg Time"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#EF4444" 
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Approval Channels */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Approval Channels Usage</h3>
          <div className="space-y-4">
            {channelData.map((channel) => (
              <div key={channel.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  {channel.name === 'WhatsApp' && <MessageCircle className="w-5 h-5 text-green-600 mr-3" />}
                  {channel.name === 'Email' && <Mail className="w-5 h-5 text-purple-600 mr-3" />}
                  {channel.name === 'In-App' && <Monitor className="w-5 h-5 text-blue-600 mr-3" />}
                  <span className="font-medium">{channel.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${(channel.approvals / 50) * 100}%`,
                        backgroundColor: channel.color 
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{channel.approvals}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* System Performance */}
        <div className="bg-white rounded-lg p-6 border shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="font-semibold text-green-900">98.5%</p>
                  <p className="text-sm text-green-600">Uptime</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-semibold text-blue-900">1.2s</p>
                  <p className="text-sm text-blue-600">Avg Response</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <p className="font-semibold text-yellow-900">2</p>
                  <p className="text-sm text-yellow-600">Active Alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Insights */}
        <div className="bg-white rounded-lg p-6 border shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI-Powered Insights</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <p className="font-medium text-green-900">🎯 Performance Boost</p>
              <p className="text-sm text-green-700 mt-1">
                WhatsApp approvals are 40% faster than email. Consider promoting this channel to clients.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <p className="font-medium text-blue-900">📈 Trend Alert</p>
              <p className="text-sm text-blue-700 mt-1">
                Project completion rate increased 25% this month. Team productivity is at an all-time high.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
              <p className="font-medium text-yellow-900">⚠️ Action Needed</p>
              <p className="text-sm text-yellow-700 mt-1">
                3 projects approaching deadline next week. Consider scheduling check-ins with project teams.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Export Analytics Report
            </h3>
            
            <div className="space-y-3 mb-6">
              <button
                onClick={() => exportData('csv')}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-3 text-gray-500" />
                  <span>Export as CSV</span>
                </div>
                <span className="text-sm text-gray-500">Spreadsheet format</span>
              </button>
              
              <button
                onClick={() => exportData('pdf')}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-3 text-gray-500" />
                  <span>Export as PDF</span>
                </div>
                <span className="text-sm text-gray-500">Report format</span>
              </button>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAnalyticsDashboard;