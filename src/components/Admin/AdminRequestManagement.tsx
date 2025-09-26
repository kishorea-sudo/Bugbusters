import React, { useState } from 'react';
import { 
  Eye, 
  X, 
  User, 
  AlertTriangle,
  FileText,
  Calendar,
  DollarSign,
  Target,
  Users,
  ChevronRight
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
  assignedPMId?: string;
  createdAt: Date;
}

const AdminRequestManagement: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('submitted');
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  // Mock PMs
  const projectManagers = [
    { id: '3', name: 'John Smith', email: 'pm@nexaflow.com', workload: 3, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
    { id: '6', name: 'Emily Davis', email: 'emily@nexaflow.com', workload: 2, avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' },
  ];

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
      status: 'assigned-to-pm',
      assignedPMId: '3',
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
      status: 'submitted',
      createdAt: new Date('2025-09-22')
    },
    {
      id: 'req-3',
      clientId: '6',
      clientName: 'Tech Solutions Ltd',
      title: 'Mobile App Performance Optimization',
      description: 'The mobile app is loading slowly. Need performance improvements and optimization.',
      priority: 'medium',
      requestType: 'enhancement',
      estimatedBudget: 3000,
      desiredDeliveryDate: new Date('2025-11-01'),
      status: 'under-review',
      createdAt: new Date('2025-09-24')
    },
    {
      id: 'req-4',
      clientId: '7',
      clientName: 'Startup Inc',
      title: 'User Dashboard Analytics',
      description: 'Add comprehensive analytics dashboard for users to track their business metrics.',
      priority: 'high',
      requestType: 'feature',
      estimatedBudget: 8000,
      desiredDeliveryDate: new Date('2025-11-15'),
      status: 'submitted',
      createdAt: new Date('2025-09-25')
    }
  ]);

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

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-500 bg-gray-100',
      'medium': 'text-yellow-600 bg-yellow-100',
      'high': 'text-orange-600 bg-orange-100',
      'critical': 'text-red-600 bg-red-100'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const handleStatusChange = (requestId: string, newStatus: string, pmId?: string) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus as any, assignedPMId: pmId }
        : request
    ));
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter(request => 
    selectedFilter === 'all' || request.status === selectedFilter
  );

  const stats = [
    {
      title: 'New Requests',
      value: requests.filter(r => r.status === 'submitted').length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Under Review',
      value: requests.filter(r => r.status === 'under-review').length,
      icon: Eye,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Assigned to PMs',
      value: requests.filter(r => r.status === 'assigned-to-pm').length,
      icon: Users,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Critical Priority',
      value: requests.filter(r => r.priority === 'critical').length,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Request Management</h1>
        <p className="text-gray-600">Review client requests and assign them to project managers</p>
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
            <h2 className="text-xl font-semibold text-gray-900">Client Requests</h2>
            <div className="flex space-x-2">
              {['submitted', 'under-review', 'assigned-to-pm', 'all'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedFilter === filter
                      ? 'bg-purple-100 text-purple-700'
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
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{request.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium text-blue-600">{request.clientName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{request.requestType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {request.desiredDeliveryDate.toLocaleDateString()}</span>
                    </div>
                    {request.estimatedBudget && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${request.estimatedBudget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {request.assignedPMId && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Assigned to:</span>
                      <span className="font-medium text-purple-600">
                        {projectManagers.find(pm => pm.id === request.assignedPMId)?.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-400">
                    Created: {request.createdAt.toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    {request.status === 'submitted' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(request.id, 'under-review')}
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                        <button 
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                    
                    {request.status === 'under-review' && (
                      <button 
                        onClick={() => setSelectedRequest(request)}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center space-x-1"
                      >
                        <Target className="w-4 h-4" />
                        <span>Assign PM</span>
                      </button>
                    )}

                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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

      {/* Assign PM Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assign Project Manager</h2>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{selectedRequest.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{selectedRequest.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Client: <strong>{selectedRequest.clientName}</strong></span>
                <span>Priority: <strong className={getPriorityColor(selectedRequest.priority).split(' ')[0]}>{selectedRequest.priority}</strong></span>
                <span>Due: <strong>{selectedRequest.desiredDeliveryDate.toLocaleDateString()}</strong></span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">Available Project Managers</h4>
              <div className="grid gap-3">
                {projectManagers.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => handleStatusChange(selectedRequest.id, 'assigned-to-pm', pm.id)}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={pm.avatar} 
                        alt={pm.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{pm.name}</p>
                        <p className="text-sm text-gray-500">{pm.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        Current workload: <span className="font-medium">{pm.workload} projects</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Info */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Users className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900">Admin Workflow</h4>
            <p className="text-sm text-purple-700 mt-1">
              As an admin, you review client requests and assign them to appropriate project managers who will then break them down into tasks for team members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRequestManagement;