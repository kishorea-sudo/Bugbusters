import React, { useState } from 'react';
import { Eye, Clock, CheckCircle, FileText, MessageSquare, Download, Bell, Calendar } from 'lucide-react';
import { User, Project } from '../../types';

interface ClientDashboardProps {
  user: User;
  projects: Project[];
  activities: any[];
  onViewChange?: (view: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ projects, activities, onViewChange }) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Client-specific metrics
  const clientStats = {
    totalProjects: projects.length,
    pendingApprovals: projects.reduce((acc, p) => 
      acc + p.deliverables.filter(d => d.status === 'review').length, 0),
    completedDeliverables: projects.reduce((acc, p) => 
      acc + p.deliverables.filter(d => d.status === 'approved').length, 0),
    projectsOnTrack: projects.filter(p => 
      new Date(p.timeline.endDate) > new Date() && p.status === 'active'
    ).length
  };

  const pendingApprovals = projects.flatMap(p => 
    p.deliverables
      .filter(d => d.status === 'review')
      .map(d => ({ ...d, projectName: p.name, projectId: p.id }))
  );

  const recentUpdates = activities
    .filter(activity => 
      selectedProject === 'all' || activity.projectId === selectedProject
    )
    .slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Client Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Client Portal</h1>
              <p className="text-blue-100">Track your projects and approve deliverables</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-blue-100">Projects Overview</p>
            <p className="text-2xl font-bold">{clientStats.totalProjects} Active</p>
          </div>
        </div>
      </div>

      {/* Client Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Projects</p>
              <p className="text-3xl font-bold text-gray-900">{clientStats.totalProjects}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">All active projects</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-3xl font-bold text-orange-600">{clientStats.pendingApprovals}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-sm text-orange-600 mt-2">Need your review</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600">{clientStats.completedDeliverables}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">Deliverables approved</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Track</p>
              <p className="text-3xl font-bold text-blue-600">{clientStats.projectsOnTrack}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-blue-600 mt-2">Projects on schedule</p>
        </div>
      </div>

      {/* Action Items & Project Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Approvals */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-orange-600" />
                Items Requiring Your Approval
              </h3>
              <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full">
                {pendingApprovals.length} pending
              </span>
            </div>
          </div>
          <div className="p-6">
            {pendingApprovals.length > 0 ? (
              <div className="space-y-4">
                {pendingApprovals.map((deliverable, index) => (
                  <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{deliverable.projectName}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            console.log('Review deliverable:', deliverable.title);
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Review
                        </button>
                        <button 
                          onClick={() => {
                            console.log('Download deliverable:', deliverable.title);
                          }}
                          className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-500">No pending approvals</p>
                <p className="text-sm text-gray-400">All deliverables are up to date</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => onViewChange && onViewChange('projects')}
                className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">View All Projects</span>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  // Create download functionality
                  console.log('Download functionality would go here');
                }}
                className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <Download className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">Download Files</span>
                </div>
              </button>
              
              <button 
                onClick={() => onViewChange && onViewChange('communication')}
                className="w-full flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <MessageSquare className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">Message Team</span>
                </div>
              </button>
              
              <button 
                onClick={() => {
                  // Create scheduling functionality
                  console.log('Schedule meeting functionality would go here');
                }}
                className="w-full flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-sm font-medium text-orange-900">Schedule Meeting</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Filter & Recent Updates */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Project Updates</h3>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentUpdates.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {activity.type.includes('file') ? <FileText className="w-5 h-5 text-blue-600" /> :
                   activity.type.includes('approved') ? <CheckCircle className="w-5 h-5 text-green-600" /> :
                   activity.type.includes('comment') ? <MessageSquare className="w-5 h-5 text-purple-600" /> :
                   <Clock className="w-5 h-5 text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.type.replace('_', ' ').replace('.', ' ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Project: {projects.find(p => p.id === activity.projectId)?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {recentUpdates.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No recent updates for selected project(s)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;