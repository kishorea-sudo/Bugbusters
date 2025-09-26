import React, { useState } from 'react';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Mail,
  Send,
  Calendar,
  FileText,
  User,
  TrendingUp,
  X,
  Reply
} from 'lucide-react';

interface PMMessage {
  id: string;
  projectId: string;
  projectName: string;
  pmId: string;
  pmName: string;
  subject: string;
  messageType: 'task-update' | 'milestone-complete' | 'issue-report' | 'approval-request';
  content: string;
  taskUpdates?: TaskUpdateSummary[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'responded';
  clientResponse?: string;
  responseDate?: Date;
  createdAt: Date;
}

interface TaskUpdateSummary {
  taskTitle: string;
  teamMemberName: string;
  updateType: string;
  progressPercentage?: number;
  description: string;
  hoursWorked?: number;
  status: string;
}

const ClientCommunicationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'unread' | 'responded'>('unread');
  const [selectedMessage, setSelectedMessage] = useState<PMMessage | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Mock PM messages with task updates
  const [messages, setMessages] = useState<PMMessage[]>([
    {
      id: 'msg-1',
      projectId: 'proj-1',
      projectName: 'E-commerce Platform',
      pmId: '3',
      pmName: 'John Smith',
      subject: 'Weekly Progress Update - Authentication & Database',
      messageType: 'task-update',
      content: 'Dear ABC Corp team, I\'m pleased to share this week\'s progress on your e-commerce platform. Our team has made significant strides in both user authentication and database implementation.',
      taskUpdates: [
        {
          taskTitle: 'Implement User Authentication',
          teamMemberName: 'Sarah Wilson',
          updateType: 'completed',
          progressPercentage: 100,
          description: 'Successfully implemented JWT-based authentication with secure login/logout functionality',
          hoursWorked: 12,
          status: 'completed'
        },
        {
          taskTitle: 'Database Schema Implementation', 
          teamMemberName: 'Sarah Wilson',
          updateType: 'blocked',
          progressPercentage: 60,
          description: 'Progress on database schema design, but need clarification on product categorization requirements',
          hoursWorked: 6,
          status: 'blocked'
        }
      ],
      priority: 'high',
      status: 'unread',
      createdAt: new Date('2025-09-26T09:00:00')
    },
    {
      id: 'msg-2',
      projectId: 'proj-2',
      projectName: 'Mobile Banking App',
      pmId: '3',
      pmName: 'John Smith',
      subject: 'API Integration Testing Complete - Ready for Review',
      messageType: 'approval-request',
      content: 'The payment gateway integration testing has been completed and is ready for your review and approval before we proceed to the next phase.',
      taskUpdates: [
        {
          taskTitle: 'API Integration Testing',
          teamMemberName: 'Alex Chen',
          updateType: 'review-ready',
          progressPercentage: 95,
          description: 'Completed comprehensive unit tests for payment gateway integration. All test cases passing.',
          hoursWorked: 8,
          status: 'review'
        }
      ],
      priority: 'medium',
      status: 'unread',
      createdAt: new Date('2025-09-26T14:30:00')
    },
    {
      id: 'msg-3',
      projectId: 'proj-1',
      projectName: 'E-commerce Platform',
      pmId: '3',
      pmName: 'John Smith',
      subject: 'Payment Gateway Integration Milestone Reached',
      messageType: 'milestone-complete',
      content: 'Great news! We have successfully completed the payment gateway integration milestone. The system now supports both PayPal and Stripe payments.',
      priority: 'high',
      status: 'responded',
      clientResponse: 'Excellent work! Please proceed with the user testing phase as planned.',
      responseDate: new Date('2025-09-25T16:20:00'),
      createdAt: new Date('2025-09-24T11:15:00')
    }
  ]);

  const getMessageTypeColor = (type: string) => {
    const colors = {
      'task-update': 'bg-blue-100 text-blue-800',
      'milestone-complete': 'bg-green-100 text-green-800',
      'issue-report': 'bg-red-100 text-red-800',
      'approval-request': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type as keyof typeof colors] || colors['task-update'];
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'text-gray-500',
      'medium': 'text-blue-500',
      'high': 'text-orange-500',
      'urgent': 'text-red-500'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getUpdateTypeIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'review-ready': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <TrendingUp className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleSendResponse = () => {
    if (!selectedMessage || !responseText.trim()) return;

    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { 
            ...msg, 
            status: 'responded' as const, 
            clientResponse: responseText,
            responseDate: new Date()
          }
        : msg
    ));

    setShowResponseModal(false);
    setResponseText('');
    setSelectedMessage(null);
    alert('Response sent to Project Manager successfully!');
  };

  const markAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ));
  };

  const filteredMessages = messages.filter(msg => {
    switch (selectedTab) {
      case 'unread': return msg.status === 'unread';
      case 'responded': return msg.status === 'responded';
      default: return true;
    }
  });

  const stats = [
    {
      title: 'Unread Messages',
      value: messages.filter(m => m.status === 'unread').length,
      icon: Mail,
      color: 'text-red-600 bg-red-100'
    },
    {
      title: 'Task Updates',
      value: messages.filter(m => m.messageType === 'task-update').length,
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Approval Requests',
      value: messages.filter(m => m.messageType === 'approval-request').length,
      icon: CheckCircle,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Completed Milestones',
      value: messages.filter(m => m.messageType === 'milestone-complete').length,
      icon: FileText,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Communications</h1>
        <p className="text-gray-600">Stay updated on project progress and communicate with your project manager</p>
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

      {/* Messages */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'unread', label: 'Unread', count: messages.filter(m => m.status === 'unread').length },
              { key: 'all', label: 'All Messages', count: messages.length },
              { key: 'responded', label: 'Responded', count: messages.filter(m => m.status === 'responded').length },
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
          <div className="grid gap-4">
            {filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`p-6 rounded-lg border cursor-pointer transition-colors ${
                  message.status === 'unread' 
                    ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setSelectedMessage(message);
                  markAsRead(message.id);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {message.status === 'unread' && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                      <h3 className="font-semibold text-gray-900">{message.subject}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMessageTypeColor(message.messageType)}`}>
                        {message.messageType.replace('-', ' ').toUpperCase()}
                      </span>
                      <div className={`${getPriorityColor(message.priority)}`}>
                        <span className="text-xs font-medium">{message.priority.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{message.content}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>From: {message.pmName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{message.projectName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{message.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Task Updates Summary */}
                    {message.taskUpdates && message.taskUpdates.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Task Updates Included:</h4>
                        <div className="grid gap-2">
                          {message.taskUpdates.map((update, index) => (
                            <div key={index} className="bg-white p-3 rounded border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getUpdateTypeIcon(update.updateType)}
                                  <span className="font-medium text-sm">{update.taskTitle}</span>
                                  <span className="text-xs text-gray-500">by {update.teamMemberName}</span>
                                </div>
                                {update.progressPercentage && (
                                  <span className="text-sm font-medium text-blue-600">{update.progressPercentage}%</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{update.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Client Response */}
                    {message.clientResponse && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <div className="flex items-center space-x-2 mb-1">
                          <Reply className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Your Response:</span>
                        </div>
                        <p className="text-sm text-green-700">{message.clientResponse}</p>
                        <p className="text-xs text-green-600 mt-1">
                          {message.responseDate?.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <span className="text-xs text-gray-400">
                      {message.createdAt.toLocaleTimeString()}
                    </span>
                    {message.status !== 'responded' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(message);
                          setShowResponseModal(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages</h3>
              <p className="text-gray-600">No messages match the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Reply to Project Manager</h2>
              <button 
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-1">Original Message:</h3>
              <p className="text-sm text-gray-600">{selectedMessage.subject}</p>
              <p className="text-xs text-gray-500 mt-1">
                From: {selectedMessage.pmName} • {selectedMessage.projectName}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Response</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your response to the project manager..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendResponse}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Response</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Communication Flow Info */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900">Direct Client-PM Communication</h4>
            <p className="text-sm text-green-700 mt-1">
              After task assignment, you communicate directly with your project manager about progress, approvals, and feedback. Your PM consolidates team member updates and keeps you informed about project status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCommunicationDashboard;