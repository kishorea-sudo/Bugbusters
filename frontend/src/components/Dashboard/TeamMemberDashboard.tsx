import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  FileText, 
  MessageSquare,
  Calendar,
  Target,
  PlayCircle,
  Pause,
  CheckCircle
} from 'lucide-react';

const TeamMemberDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  // Mock data for assigned tasks (only for this team member)
  const myTasks = [
    {
      id: 'task-1',
      title: 'Implement User Authentication',
      description: 'Create login and registration functionality with JWT tokens',
      project: 'E-commerce Platform',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date('2025-10-05'),
      estimatedHours: 12,
      actualHours: 8,
      assignedBy: 'John Smith',
      tags: ['Frontend', 'Security']
    },
    {
      id: 'task-2',
      title: 'Design Database Schema',
      description: 'Create ERD and implement database tables for product management',
      project: 'E-commerce Platform', 
      status: 'todo',
      priority: 'medium',
      dueDate: new Date('2025-10-08'),
      estimatedHours: 6,
      actualHours: 0,
      assignedBy: 'John Smith',
      tags: ['Backend', 'Database']
    },
    {
      id: 'task-3',
      title: 'API Integration Testing',
      description: 'Write unit tests for payment gateway integration',
      project: 'Mobile Banking App',
      status: 'review',
      priority: 'high',
      dueDate: new Date('2025-09-30'),
      estimatedHours: 8,
      actualHours: 7,
      assignedBy: 'John Smith',
      tags: ['Testing', 'API']
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.todo;
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <CheckSquare className="w-4 h-4" />;
      case 'in-progress': return <PlayCircle className="w-4 h-4" />;
      case 'review': return <Pause className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <CheckSquare className="w-4 h-4" />;
    }
  };

  const TaskCard = ({ task }: { task: any }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
          </div>
          <h3 className="font-semibold text-gray-900">{task.title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <AlertCircle className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="font-medium text-blue-600">{task.project}</span>
        <span>Assigned by {task.assignedBy}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{task.dueDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{task.actualHours}h / {task.estimatedHours}h</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {task.tags.map((tag: string) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => alert('Task update sent to PM! Your progress will be communicated to the client.')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Update Status
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Updates → PM → Client</span>
            <button 
              onClick={() => {
                console.log('Communication flow details would show here');
              }}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const stats = [
    {
      title: 'My Active Tasks',
      value: myTasks.filter(t => t.status !== 'completed').length,
      icon: Target,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'In Progress',
      value: myTasks.filter(t => t.status === 'in-progress').length,
      icon: PlayCircle,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      title: 'Under Review',
      value: myTasks.filter(t => t.status === 'review').length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Completed',
      value: myTasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600">Manage your assigned tasks and track progress</p>
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

      {/* Task List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Assigned Tasks</h2>
            <div className="flex space-x-2">
              {['all', 'todo', 'in-progress', 'review'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveTab(filter)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    activeTab === filter
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

        <div className="p-6">
          <div className="grid gap-6">
            {myTasks
              .filter(task => activeTab === 'all' || task.status === activeTab)
              .map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>

          {myTasks.filter(task => activeTab === 'all' || task.status === activeTab).length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">No tasks match the selected filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Communication & Privacy Notice */}
      <div className="mt-8 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Communication Flow</h4>
              <p className="text-sm text-green-700 mt-1">
                <strong>Your Updates → Project Manager → Client:</strong> When you complete or update tasks, they are sent to your PM who then communicates consolidated progress to the client.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy & Isolation</h4>
              <p className="text-sm text-blue-700 mt-1">
                You can only view tasks assigned to you. Other team members' tasks and progress are not visible to maintain project confidentiality and focus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberDashboard;