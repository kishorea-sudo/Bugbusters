import React, { useState } from 'react';
import { 
  Plus, 
  ArrowRight, 
  User, 
  Calendar, 
  DollarSign, 
  Target,
  CheckCircle,
  X,
  FileText
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
  status: string;
  assignedPMId?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  assignedPMId: string;
  assignedPMName: string;
  estimatedBudget?: number;
  timeline: {
    startDate: Date;
    endDate: Date;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'on-hold';
  sourceRequestId: string;
}

const AdminProjectCreation: React.FC = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ClientRequest | null>(null);

  // Mock approved client requests ready for project creation
  const approvedRequests: ClientRequest[] = [
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
      status: 'approved',
      assignedPMId: '3'
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
      status: 'approved',
      assignedPMId: '6'
    }
  ];

  // Mock existing projects
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'E-commerce Payment System',
      description: 'Integration of multiple payment gateways for enhanced customer experience',
      clientId: '2',
      clientName: 'ABC Corp',
      assignedPMId: '3',
      assignedPMName: 'John Smith',
      estimatedBudget: 5000,
      timeline: {
        startDate: new Date('2025-09-26'),
        endDate: new Date('2025-10-15')
      },
      priority: 'high',
      status: 'active',
      sourceRequestId: 'req-1'
    }
  ]);

  // Mock PMs
  const projectManagers = [
    { id: '3', name: 'John Smith', email: 'pm@nexaflow.com', workload: 2 },
    { id: '6', name: 'Emily Davis', email: 'emily@nexaflow.com', workload: 1 },
  ];

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    assignedPMId: '',
    startDate: '',
    endDate: '',
    estimatedBudget: ''
  });

  const handleCreateProject = () => {
    if (!selectedRequest || !newProject.name || !newProject.assignedPMId) return;

    const pm = projectManagers.find(p => p.id === newProject.assignedPMId);
    
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      clientId: selectedRequest.clientId,
      clientName: selectedRequest.clientName,
      assignedPMId: newProject.assignedPMId,
      assignedPMName: pm?.name || '',
      estimatedBudget: newProject.estimatedBudget ? parseFloat(newProject.estimatedBudget) : selectedRequest.estimatedBudget,
      timeline: {
        startDate: new Date(newProject.startDate),
        endDate: new Date(newProject.endDate)
      },
      priority: selectedRequest.priority,
      status: 'active',
      sourceRequestId: selectedRequest.id
    };

    setProjects(prev => [...prev, project]);
    setSelectedRequest(null);
    setShowCreateProject(false);
    setNewProject({
      name: '',
      description: '',
      assignedPMId: '',
      startDate: '',
      endDate: '',
      estimatedBudget: ''
    });
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Creation</h1>
          <p className="text-gray-600">Convert approved client requests into projects and assign to PMs</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{approvedRequests.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <Target className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available PMs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{projectManagers.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <User className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Approved Requests Ready for Project Creation */}
      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Approved Client Requests</h2>
          <p className="text-gray-600 text-sm">Convert these approved requests into projects and assign to project managers</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {approvedRequests.map((request) => (
              <div key={request.id} className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{request.title}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        ✓ APPROVED
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{request.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span className="font-medium text-blue-600">{request.clientName}</span>
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
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-green-200">
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setNewProject(prev => ({
                        ...prev,
                        name: request.title,
                        description: request.description,
                        assignedPMId: request.assignedPMId || '',
                        endDate: request.desiredDeliveryDate.toISOString().split('T')[0],
                        estimatedBudget: request.estimatedBudget?.toString() || ''
                      }));
                      setShowCreateProject(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {approvedRequests.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No approved requests</h3>
              <p className="text-gray-600">All approved client requests have been converted to projects.</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Projects</h2>
          <p className="text-gray-600 text-sm">Projects created from client requests and assigned to project managers</p>
        </div>
        <div className="p-6">
          <div className="grid gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Client: <strong className="text-blue-600">{project.clientName}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>PM: <strong className="text-purple-600">{project.assignedPMName}</strong></span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.timeline.startDate.toLocaleDateString()} - {project.timeline.endDate.toLocaleDateString()}</span>
                      </div>
                      {project.estimatedBudget && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${project.estimatedBudget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600">Create projects from approved client requests above.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateProject && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Project</h2>
              <button 
                onClick={() => {
                  setShowCreateProject(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Source Client Request</h3>
              <p className="text-gray-600 text-sm mb-2">{selectedRequest.title}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Client: <strong>{selectedRequest.clientName}</strong></span>
                <span>Type: <strong>{selectedRequest.requestType}</strong></span>
                <span>Priority: <strong>{selectedRequest.priority}</strong></span>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed project description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign Project Manager</label>
                <select
                  value={newProject.assignedPMId}
                  onChange={(e) => setNewProject(prev => ({ ...prev, assignedPMId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project Manager</option>
                  {projectManagers.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name} (Current workload: {pm.workload} projects)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget</label>
                <input
                  type="number"
                  value={newProject.estimatedBudget}
                  onChange={(e) => setNewProject(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter budget in USD"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateProject(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Workflow Info */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-purple-900">Admin Project Creation Workflow</h4>
            <p className="text-sm text-purple-700 mt-1">
              <strong>Only admins can create projects.</strong> Convert approved client requests into projects and assign them to project managers who will then break them down into tasks for team members.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectCreation;