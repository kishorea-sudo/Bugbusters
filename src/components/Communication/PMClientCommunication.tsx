import React, { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye,
  User,
  Calendar,
  FileText,
  TrendingUp,
  X,
  Plus,
  Mail
} from 'lucide-react';

interface TaskUpdate {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  teamMemberId: string;
  teamMemberName: string;
  updateType: 'progress' | 'completed' | 'blocked' | 'review-ready';
  previousStatus: string;
  newStatus: string;
  progressPercentage?: number;
  description: string;
  hoursWorked?: number;
  nextSteps?: string;
  blockers?: string;
  createdAt: Date;
  reviewedByPM: boolean;
  sentToClient: boolean;
}

interface PMClientCommunication {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  pmId: string;
  subject: string;
  messageType: 'task-update' | 'milestone-complete' | 'issue-report' | 'approval-request';
  content: string;
  taskUpdates?: TaskUpdate[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'sent' | 'read' | 'responded';
  clientResponse?: string;
  responseDate?: Date;
  createdAt: Date;
}

const PMClientCommunication: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'sent' | 'compose'>('pending');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([]);

  // Mock task updates from team members
  const [taskUpdates] = useState<TaskUpdate[]>([
    {
      id: 'update-1',
      taskId: 'task-1',
      taskTitle: 'Implement User Authentication',
      projectId: 'proj-1',
      projectName: 'E-commerce Platform',
      teamMemberId: '4',
      teamMemberName: 'Sarah Wilson',
      updateType: 'completed',
      previousStatus: 'in-progress',
      newStatus: 'completed',
      progressPercentage: 100,
      description: 'Successfully implemented JWT-based authentication with login/logout functionality. Added password hashing and session management.',
      hoursWorked: 12,
      nextSteps: 'Ready for testing and integration with frontend components',
      createdAt: new Date('2025-09-26T10:30:00'),
      reviewedByPM: false,
      sentToClient: false
    },
    {
      id: 'update-2',
      taskId: 'task-3',
      taskTitle: 'API Integration Testing',
      projectId: 'proj-2',
      projectName: 'Mobile Banking App',
      teamMemberId: '5',
      teamMemberName: 'Alex Chen',
      updateType: 'review-ready',
      previousStatus: 'in-progress',
      newStatus: 'review',
      progressPercentage: 95,
      description: 'Completed unit tests for payment gateway integration. All test cases passing. Need PM review before client delivery.',
      hoursWorked: 8,
      nextSteps: 'Awaiting PM review and approval',
      createdAt: new Date('2025-09-26T14:15:00'),
      reviewedByPM: false,
      sentToClient: false
    },
    {
      id: 'update-3',
      taskId: 'task-4',
      taskTitle: 'Database Schema Implementation',
      projectId: 'proj-1',
      projectName: 'E-commerce Platform',
      teamMemberId: '4',
      teamMemberName: 'Sarah Wilson',
      updateType: 'blocked',
      previousStatus: 'in-progress',
      newStatus: 'blocked',
      progressPercentage: 60,
      description: 'Progress on database schema design. Need clarification on client requirements for product categorization.',
      hoursWorked: 6,
      blockers: 'Unclear product category requirements. Need client input on taxonomy structure.',
      createdAt: new Date('2025-09-26T16:45:00'),
      reviewedByPM: false,
      sentToClient: false
    }
  ]);

  // Mock sent communications
  const [sentCommunications] = useState<PMClientCommunication[]>([
    {
      id: 'comm-1',
      projectId: 'proj-1',
      projectName: 'E-commerce Platform',
      clientId: '2',
      clientName: 'ABC Corp',
      pmId: '3',
      subject: 'Weekly Progress Update - Payment Integration',
      messageType: 'task-update',
      content: 'Hello team, here\'s this week\'s progress on the payment integration module...',
      priority: 'medium',
      status: 'responded',
      clientResponse: 'Great progress! Please proceed with the testing phase.',
      responseDate: new Date('2025-09-25T11:30:00'),
      createdAt: new Date('2025-09-24T09:00:00')
    }
  ]);

  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
    priority: 'medium' as const,
    messageType: 'task-update' as const,
    projectId: ''
  });

  const projects = [
    { id: 'proj-1', name: 'E-commerce Platform', clientId: '2', clientName: 'ABC Corp' },
    { id: 'proj-2', name: 'Mobile Banking App', clientId: '6', clientName: 'Tech Solutions Ltd' },
  ];

  const getUpdateTypeColor = (type: string) => {
    const colors = {
      'progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'blocked': 'bg-red-100 text-red-800',
      'review-ready': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || colors.progress;
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'blocked': return <AlertCircle className="w-4 h-4" />;
      case 'review-ready': return <Eye className="w-4 h-4" />;
      case 'progress': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSendUpdatesToClient = () => {
    const updatesToSend = taskUpdates.filter(update => selectedUpdates.includes(update.id));
    
    if (updatesToSend.length === 0) return;
    
    const projectGroup = updatesToSend.reduce((acc: any, update) => {
      if (!acc[update.projectId]) {
        acc[update.projectId] = {
          projectName: update.projectName,
          updates: []
        };
      }
      acc[update.projectId].updates.push(update);
      return acc;
    }, {});

    // In real app, this would create and send communications to clients
    console.log('Sending updates to clients:', projectGroup);
    
    // Reset selection
    setSelectedUpdates([]);
    alert(`Successfully sent ${updatesToSend.length} task updates to clients!`);
  };

  const pendingUpdates = taskUpdates.filter(update => !update.sentToClient);

  const stats = [
    {
      title: 'Pending Updates',
      value: pendingUpdates.length,
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Completed Tasks',
      value: taskUpdates.filter(u => u.updateType === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Blocked Tasks',
      value: taskUpdates.filter(u => u.updateType === 'blocked').length,
      icon: AlertCircle,
      color: 'text-red-600 bg-red-100'
    },
    {
      title: 'Client Messages',
      value: sentCommunications.length,
      icon: MessageSquare,
      color: 'text-blue-600 bg-blue-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Communication</h1>
          <p className="text-gray-600">Review team updates and communicate progress to clients</p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Compose Message</span>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pending', label: 'Pending Updates', count: pendingUpdates.length },
              { key: 'sent', label: 'Sent Messages', count: sentCommunications.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'pending' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Member Task Updates</h3>
                {selectedUpdates.length > 0 && (
                  <button
                    onClick={handleSendUpdatesToClient}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send to Client ({selectedUpdates.length})</span>
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {pendingUpdates.map((update) => (
                  <div key={update.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedUpdates.includes(update.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUpdates(prev => [...prev, update.id]);
                            } else {
                              setSelectedUpdates(prev => prev.filter(id => id !== update.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{update.taskTitle}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getUpdateTypeColor(update.updateType)}`}>
                              {getUpdateTypeIcon(update.updateType)}
                              <span>{update.updateType.replace('-', ' ').toUpperCase()}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{update.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>{update.teamMemberName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{update.projectName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{update.hoursWorked}h worked</span>
                            </div>
                            {update.progressPercentage && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="w-4 h-4" />
                                <span>{update.progressPercentage}% complete</span>
                              </div>
                            )}
                          </div>

                          {update.nextSteps && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Next Steps: </span>
                              <span className="text-sm text-gray-600">{update.nextSteps}</span>
                            </div>
                          )}

                          {update.blockers && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-red-700">Blockers: </span>
                              <span className="text-sm text-red-600">{update.blockers}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {update.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pendingUpdates.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending updates</h3>
                  <p className="text-gray-600">All team member updates have been sent to clients.</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'sent' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sent Client Communications</h3>
              
              <div className="grid gap-4">
                {sentCommunications.map((comm) => (
                  <div key={comm.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{comm.subject}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            comm.status === 'responded' ? 'bg-green-100 text-green-800' : 
                            comm.status === 'read' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {comm.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{comm.content}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>To: {comm.clientName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{comm.projectName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{comm.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>

                        {comm.clientResponse && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center space-x-2 mb-1">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Client Response:</span>
                            </div>
                            <p className="text-sm text-blue-700">{comm.clientResponse}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              {comm.responseDate?.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Compose Message to Client</h2>
              <button 
                onClick={() => setShowComposeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={newMessage.projectId}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} - {project.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Type</label>
                  <select
                    value={newMessage.messageType}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, messageType: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="task-update">Task Update</option>
                    <option value="milestone-complete">Milestone Complete</option>
                    <option value="issue-report">Issue Report</option>
                    <option value="approval-request">Approval Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newMessage.priority}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter message subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your message to the client..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // In real app, this would send the message
                    console.log('Sending message:', newMessage);
                    setShowComposeModal(false);
                    alert('Message sent to client successfully!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Communication Flow Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Communication Flow</h4>
            <p className="text-sm text-blue-700 mt-1">
              <strong>Team Members → PM → Client:</strong> Team member task updates flow to you for review, then you communicate consolidated progress to clients. This maintains clear communication hierarchy and client relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMClientCommunication;