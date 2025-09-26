import React, { useState } from 'react';
import { FolderOpen, Clock, TrendingUp, Users, CheckCircle, AlertCircle, Calendar, Target } from 'lucide-react';
import { User, Project } from '../../types';

interface ProjectManagerDashboardProps {
  user: User;
  projects: Project[];
  activities: any[];
}

const ProjectManagerDashboard: React.FC<ProjectManagerDashboardProps> = ({ projects, activities }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('week');

  // PM-specific metrics
  const pmStats = {
    activeProjects: projects.filter(p => p.status === 'active').length,
    overdueTasks: projects.reduce((acc, p) => acc + p.deliverables.filter(d => 
      new Date(d.dueDate) < new Date() && d.status !== 'approved'
    ).length, 0),
    teamUtilization: 87,
    clientSatisfaction: 92,
    avgProjectDuration: 45,
    onTimeDelivery: 94
  };

  const upcomingDeadlines = projects.flatMap(p => 
    p.deliverables
      .filter(d => d.status !== 'approved' && new Date(d.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      .map(d => ({ ...d, projectName: p.name }))
  ).slice(0, 5);

  const projectsByStatus = {
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on-hold').length,
    critical: projects.filter(p => p.priority === 'critical').length
  };

  return (
    <div className="space-y-8">
      {/* PM Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Project Management Hub</h1>
              <p className="text-green-100">Break down admin-assigned projects into team tasks</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {(['week', 'month', 'quarter'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-white text-green-600'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PM Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{pmStats.activeProjects}</p>
            </div>
            <FolderOpen className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 2 new this month</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Utilization</p>
              <p className="text-3xl font-bold text-gray-900">{pmStats.teamUtilization}%</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">Optimal range</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
              <p className="text-3xl font-bold text-gray-900">{pmStats.onTimeDelivery}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-green-600 mt-2">↑ 3% improvement</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
              <p className="text-3xl font-bold text-gray-900">{pmStats.overdueTasks}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-sm text-red-600 mt-2">Needs attention</p>
        </div>
      </div>

      {/* Project Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Status */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Project Portfolio Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{projectsByStatus.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{projectsByStatus.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{projectsByStatus.onHold}</p>
                <p className="text-sm text-gray-600">On Hold</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{projectsByStatus.critical}</p>
                <p className="text-sm text-gray-600">Critical</p>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Recent Project Updates</h4>
              {projects.slice(0, 4).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'active' ? 'bg-green-400' :
                      project.status === 'completed' ? 'bg-blue-400' :
                      project.status === 'on-hold' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">
                        {project.deliverables.filter(d => d.status === 'approved').length} / {project.deliverables.length} deliverables
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      project.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      project.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-red-600" />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingDeadlines.map((deliverable, index) => (
                <div key={index} className="border-l-4 border-l-red-400 pl-4 pb-3">
                  <p className="font-medium text-gray-900 text-sm">{deliverable.title}</p>
                  <p className="text-xs text-gray-600">{deliverable.projectName}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {upcomingDeadlines.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming deadlines this week
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Performance */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Team Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Client Satisfaction</span>
                <span className="text-sm font-bold text-green-600">{pmStats.clientSatisfaction}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${pmStats.clientSatisfaction}%` }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Avg Project Duration</span>
                <span className="text-sm font-bold text-blue-600">{pmStats.avgProjectDuration} days</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Team Utilization</span>
                <span className="text-sm font-bold text-purple-600">{pmStats.teamUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${pmStats.teamUtilization}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Team Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.type.replace('.', ' ').replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;