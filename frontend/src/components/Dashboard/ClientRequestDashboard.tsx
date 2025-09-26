import React, { useState } from 'react';
import { 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  X,
  FileText,
  Calendar,
  DollarSign,
  MessageSquare,
  Eye
} from 'lucide-react';

interface ClientRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestType: 'feature' | 'bug-fix' | 'enhancement' | 'support';
  estimatedBudget?: number;
  desiredDeliveryDate: Date;
  status: 'submitted' | 'under-review' | 'approved' | 'assigned-to-pm' | 'in-progress' | 'completed' | 'rejected';
  createdAt: Date;
}

const ClientRequestDashboard: React.FC = () => {
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock client requests
  const [requests, setRequests] = useState<ClientRequest[]>([
    {
      id: 'req-1',
      clientId: '2',
      clientName: 'ABC Corp',
      title: 'Add Payment Gateway Integration',
      description: 'We need to integrate PayPal and Stripe payment gateways to our e-commerce platform for better customer experience.',
      priority: 'high',
      requestType: 'feature',
      estimatedBudget: 5000,
      desiredDeliveryDate: new Date('2025-10-15'),
      status: 'in-progress',
      createdAt: new Date('2025-09-20')
    },
    {
      id: 'req-2',
      clientId: '2',
      clientName: 'ABC Corp',
      title: 'Fix Shopping Cart Bug',
      description: 'Items are not being properly added to cart when clicked multiple times rapidly.',
      priority: 'critical',
      requestType: 'bug-fix',
      desiredDeliveryDate: new Date('2025-10-01'),
      status: 'assigned-to-pm',
      createdAt: new Date('2025-09-22')
    },
    {
      id: 'req-3',
      clientId: '2',
      clientName: 'ABC Corp',
      title: 'Mobile App Performance Optimization',
      description: 'The mobile app is loading slowly. Need performance improvements and optimization.',
      priority: 'medium',
      requestType: 'enhancement',
      estimatedBudget: 3000,
      desiredDeliveryDate: new Date('2025-11-01'),
      status: 'under-review',
      createdAt: new Date('2025-09-24')
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    requestType: 'feature' as const,
    estimatedBudget: '',
    desiredDeliveryDate: ''
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'submitted': 'bg-blue-100 text-blue-800',
      'under-review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'assigned-to-pm': 'bg-purple-100 text-purple-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.submitted;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Send className="w-4 h-4" />;
      case 'under-review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'assigned-to-pm': return <FileText className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-500',
      'medium': 'text-yellow-500',
      'high': 'text-orange-500',
      'critical': 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleCreateRequest = () => {
    if (!newRequest.title || !newRequest.description) return;

    const request: ClientRequest = {
      id: `req-${Date.now()}`,
      clientId: '2',
      clientName: 'ABC Corp',
      title: newRequest.title,
      description: newRequest.description,
      priority: newRequest.priority,
      requestType: newRequest.requestType,
      estimatedBudget: newRequest.estimatedBudget ? parseFloat(newRequest.estimatedBudget) : undefined,
      desiredDeliveryDate: new Date(newRequest.desiredDeliveryDate),
      status: 'submitted',
      createdAt: new Date()
    };

    setRequests(prev => [request, ...prev]);
    setNewRequest({
      title: '',
      description: '',
      priority: 'medium',
      requestType: 'feature',
      estimatedBudget: '',
      desiredDeliveryDate: ''
    });
    setShowCreateRequest(false);
  };

  const filteredRequests = requests.filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

  const stats = [
    {
      title: 'Total Requests',
      value: requests.length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'In Progress',
      value: requests.filter(r => r.status === 'in-progress').length,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Under Review',
      value: requests.filter(r => r.status === 'under-review').length,
      icon: Eye,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Completed',
      value: requests.filter(r => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
          <p className="text-gray-600">Submit and track your project requests</p>
        </div>
        <button
          onClick={() => setShowCreateRequest(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
            <div className="flex space-x-2">
              {['all', 'submitted', 'under-review', 'in-progress', 'completed'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedFilter === filter
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="p-6">
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{request.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)} flex items-center space-x-1`}>
                        {getStatusIcon(request.status)}
                        <span>{request.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{request.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`w-5 h-5 ${getPriorityColor(request.priority)}`} />
                    <span className={`text-sm font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-600">{request.requestType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {request.desiredDeliveryDate.toLocaleDateString()}</span>
                    </div>
                    {request.estimatedBudget && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>Budget: ${request.estimatedBudget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Created: {request.createdAt.toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>Add Comment</span>
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-600">No requests match the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Submit New Request</h2>
              <button 
                onClick={() => setShowCreateRequest(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your request..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed requirements, acceptance criteria, and any specific notes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <select
                    value={newRequest.requestType}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, requestType: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="feature">New Feature</option>
                    <option value="bug-fix">Bug Fix</option>
                    <option value="enhancement">Enhancement</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desired Delivery Date</label>
                  <input
                    type="date"
                    value={newRequest.desiredDeliveryDate}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, desiredDeliveryDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget (Optional)</label>
                  <input
                    type="number"
                    value={newRequest.estimatedBudget}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget in USD"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateRequest(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRequest}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Request Workflow</h4>
            <p className="text-sm text-blue-700 mt-1">
              Your requests go through: <strong>Client Submission → Admin Review → PM Assignment → Team Development → Completion</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRequestDashboard;