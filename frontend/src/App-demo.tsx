import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProjects } from './hooks/useProjects';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ProjectCard from './components/Projects/ProjectCard';
import ProjectDetail from './components/Projects/ProjectDetail';
import CreateProjectModal from './components/Projects/CreateProjectModal';
import EnhancedAnalyticsDashboard from './components/Analytics/EnhancedAnalyticsDashboard';
import RulesEngine from './components/Automation/RulesEngine';
import WhatsAppSimulator from './components/Communications/WhatsAppSimulator';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ProjectManagerDashboard from './components/Dashboard/ProjectManagerDashboard';
import TeamMemberDashboard from './components/Dashboard/TeamMemberDashboard';
import ClientRequestDashboard from './components/Dashboard/ClientRequestDashboard';
import AdminRequestManagement from './components/Admin/AdminRequestManagement';
import AdminProjectCreation from './components/Admin/AdminProjectCreation';
import TaskManagement from './components/Tasks/TaskManagement';
import PMClientCommunication from './components/Communication/PMClientCommunication';
import ClientCommunicationDashboard from './components/Communication/ClientCommunicationDashboard';
import UserProfile from './components/Profile/UserProfile';
import AddTeamMemberModal from './components/Team/AddTeamMemberModal';
import { Project, Rule } from './types';
import { FileText, Users, MessageCircle, Settings, BarChart3 } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { projects, activities, updateDeliverableStatus } = useProjects();
  
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showWhatsAppSimulator, setShowWhatsAppSimulator] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Reset notification settings view when changing to a different view
    if (view !== 'notifications') {
      setShowNotificationSettings(false);
    }
  };
  
  // Team members state
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Sarah Wilson', role: 'Frontend Developer', status: 'Active', avatar: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', projects: 3, tasks: 12, email: 'sarah@nexaflow.com', phone: '+1 234-567-8901', department: 'Engineering', skills: 'React, TypeScript, CSS' },
    { id: '2', name: 'Alex Chen', role: 'Backend Developer', status: 'Active', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', projects: 2, tasks: 8, email: 'alex@nexaflow.com', phone: '+1 234-567-8902', department: 'Engineering', skills: 'Node.js, Python, MongoDB' },
    { id: '3', name: 'Mike Johnson', role: 'UI/UX Designer', status: 'Active', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', projects: 4, tasks: 15, email: 'mike@nexaflow.com', phone: '+1 234-567-8903', department: 'Design', skills: 'Figma, Adobe XD, Sketch' },
    { id: '4', name: 'Emma Davis', role: 'QA Engineer', status: 'Away', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', projects: 2, tasks: 6, email: 'emma@nexaflow.com', phone: '+1 234-567-8904', department: 'QA', skills: 'Selenium, Jest, Cypress' },
    { id: '5', name: 'John Smith', role: 'Project Manager', status: 'Active', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2', projects: 8, tasks: 25, email: 'john@nexaflow.com', phone: '+1 234-567-8905', department: 'Management', skills: 'Agile, Scrum, Leadership' }
  ]);
  
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 'rule-1',
      name: 'Auto Review on Upload',
      description: 'Automatically set deliverables to review status when files are uploaded',
      trigger: 'file.upload',
      conditions: [{ field: 'requiresReview', operator: 'equals', value: 'true' }],
      actions: [{ type: 'update_status', params: { status: 'review' } }],
      active: true,
      createdAt: new Date(),
    },
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/logo.png" 
              alt="NexaFlow" 
              className="h-20 w-auto animate-pulse"
            />
          </div>
          <p className="text-gray-600">Loading NexaFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  

  const renderContent = () => {
    if (selectedProject && activeView === 'projects') {
      return (
        <ProjectDetail
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
          onUpdateDeliverableStatus={updateDeliverableStatus}
        />
      );
    }

    switch (activeView) {
      case 'dashboard':
        // Role-specific dashboards
        if (user.role === 'admin') {
          return (
            <AdminDashboard 
              user={user}
              projects={projects}
              activities={activities}
            />
          );
        } else if (user.role === 'pm') {
          return (
            <ProjectManagerDashboard 
              user={user}
              projects={projects}
              activities={activities}
            />
          );
        } else if (user.role === 'member') {
          return (
            <TeamMemberDashboard />
          );
        } else {
          return (
            <ClientRequestDashboard />
          );
        }

      case 'projects':
        if (user.role === 'admin') {
          return <AdminProjectCreation />;
        }
        
        // Role-specific project view text
        const getProjectViewText = () => {
          if (user.role === 'client') {
            return {
              title: "My Project Requests",
              description: "Projects you have requested from our team"
            };
          } else if (user.role === 'pm') {
            return {
              title: "Assigned Projects", 
              description: "Projects assigned to you by admin"
            };
          } else {
            return {
              title: "My Tasks",
              description: "Tasks assigned to you by your project manager"
            };
          }
        };
        
        const { title, description } = getProjectViewText();
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-gray-600">{description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelect={(project) => {
                    setSelectedProject(project);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'analytics':
        // Only admins and PMs should have access to analytics
        if (user.role === 'admin' || user.role === 'pm') {
          return <EnhancedAnalyticsDashboard />;
        }
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You don't have permission to view analytics</p>
          </div>
        );

      case 'documents':
        const getDocumentViewInfo = () => {
          if (user.role === 'client') {
            return {
              title: "Project Documents",
              description: "View and download documents shared by your project team",
              canUpload: false,
              documents: [
                { name: 'Project Proposal.pdf', size: '2.4 MB', type: 'PDF', date: '2 hours ago', sharedBy: 'Project Manager' },
                { name: 'Design Mockups.figma', size: '15.2 MB', type: 'Figma', date: '1 day ago', sharedBy: 'Design Team' },
                { name: 'Progress Report.docx', size: '1.8 MB', type: 'Word', date: '3 days ago', sharedBy: 'Project Manager' },
                { name: 'Meeting Minutes.pdf', size: '245 KB', type: 'PDF', date: '1 week ago', sharedBy: 'Project Manager' }
              ]
            };
          } else if (user.role === 'member') {
            return {
              title: "Project Resources",
              description: "Access project documents and upload deliverables",
              canUpload: true,
              uploadText: "Upload Deliverable",
              documents: [
                { name: 'Technical Specs.docx', size: '1.8 MB', type: 'Word', date: '3 days ago', sharedBy: 'Project Manager' },
                { name: 'Design Guidelines.pdf', size: '987 KB', type: 'PDF', date: '1 week ago', sharedBy: 'Design Lead' },
                { name: 'API Documentation.md', size: '156 KB', type: 'Markdown', date: '2 weeks ago', sharedBy: 'Backend Team' },
                { name: 'Testing Checklist.xlsx', size: '245 KB', type: 'Excel', date: '3 weeks ago', sharedBy: 'QA Lead' }
              ]
            };
          } else {
            return {
              title: "Document Library",
              description: "Manage all project documents and files",
              canUpload: true,
              uploadText: "Upload Document",
              documents: [
                { name: 'Project Requirements.pdf', size: '2.4 MB', type: 'PDF', date: '2 hours ago', sharedBy: 'Admin' },
                { name: 'Design Guidelines.figma', size: '15.2 MB', type: 'Figma', date: '1 day ago', sharedBy: 'Design Team' },
                { name: 'Technical Specs.docx', size: '1.8 MB', type: 'Word', date: '3 days ago', sharedBy: 'Tech Lead' },
                { name: 'Meeting Notes.md', size: '245 KB', type: 'Markdown', date: '1 week ago', sharedBy: 'Project Manager' },
                { name: 'Budget Breakdown.xlsx', size: '987 KB', type: 'Excel', date: '2 weeks ago', sharedBy: 'Finance' },
                { name: 'Brand Assets.zip', size: '45.6 MB', type: 'Archive', date: '1 month ago', sharedBy: 'Marketing' }
              ]
            };
          }
        };

        const docInfo = getDocumentViewInfo();
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{docInfo.title}</h2>
                <p className="text-gray-600">{docInfo.description}</p>
              </div>
              {docInfo.canUpload && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>{docInfo.uploadText}</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {docInfo.documents.map((doc, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.type === 'PDF' ? 'bg-red-100 text-red-700' :
                      doc.type === 'Figma' ? 'bg-purple-100 text-purple-700' :
                      doc.type === 'Word' ? 'bg-blue-100 text-blue-700' :
                      doc.type === 'Excel' ? 'bg-green-100 text-green-700' :
                      doc.type === 'Markdown' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{doc.type}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{doc.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{doc.size}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">Modified {doc.date}</p>
                    {doc.sharedBy && (
                      <p className="text-xs text-blue-600">By {doc.sharedBy}</p>
                    )}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm hover:bg-blue-100">
                      Download
                    </button>
                    {user.role === 'client' && (
                      <button className="px-3 py-1 bg-gray-50 text-gray-600 rounded text-sm hover:bg-gray-100">
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'team':
        if (user.role === 'pm') {
          return <TaskManagement />;
        } else if (user.role === 'admin') {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                  <p className="text-gray-600">Manage team members and permissions</p>
                </div>
                <button 
                  onClick={() => setShowAddTeamMember(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Add Team Member</span>
                </button>
              </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=6366f1&color=fff&size=40`;
                      }}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{member.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Projects</span>
                      <span className="font-medium">{member.projects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Tasks</span>
                      <span className="font-medium">{member.tasks}</span>
                    </div>
                    {member.department && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Department</span>
                        <span className="font-medium">{member.department}</span>
                      </div>
                    )}
                    {member.skills && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Skills: {member.skills}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        }
        // Team members and clients should not have access to team management
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You don't have permission to view team management</p>
          </div>
        );

      case 'automations':
        // Only admins should have access to automations
        if (user.role === 'admin') {
          return (
            <RulesEngine
              rules={rules}
              onCreateRule={(rule) => {
                const newRule = {
                  ...rule,
                  id: `rule-${Date.now()}`,
                  createdAt: new Date(),
                };
                setRules(prev => [...prev, newRule]);
              }}
              onUpdateRule={(id, updates) => {
                setRules(prev => prev.map(rule => 
                  rule.id === id ? { ...rule, ...updates } : rule
                ));
              }}
              onDeleteRule={(id) => {
                setRules(prev => prev.filter(rule => rule.id !== id));
              }}
            />
          );
        }
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600">You don't have permission to view automation settings</p>
          </div>
        );

      case 'requests':
        if (user.role === 'admin') {
          return <AdminRequestManagement />;
        }
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Requests</h3>
            <p className="text-gray-600">Access denied</p>
          </div>
        );

      case 'communications':
        if (user.role === 'pm') {
          return <PMClientCommunication />;
        } else if (user.role === 'client') {
          return <ClientCommunicationDashboard />;
        }
        return (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Communications</h3>
            <p className="text-gray-600">Access denied</p>
          </div>
        );

      case 'notifications':
        if (showNotificationSettings) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                  <p className="text-gray-600">Customize how you receive notifications</p>
                </div>
                <button 
                  onClick={() => setShowNotificationSettings(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Back to Notifications
                </button>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { id: 'task-assigned', label: 'When tasks are assigned to me', enabled: true },
                    { id: 'task-due', label: 'Task deadline reminders', enabled: true },
                    { id: 'project-updates', label: 'Project status updates', enabled: false },
                    { id: 'comments', label: 'New comments on my tasks', enabled: true },
                    { id: 'mentions', label: 'When I am mentioned', enabled: true }
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{setting.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">In-App Notifications</h3>
                <div className="space-y-4">
                  {[
                    { id: 'browser-notifications', label: 'Browser notifications', enabled: false },
                    { id: 'sound-alerts', label: 'Sound alerts', enabled: true },
                    { id: 'desktop-notifications', label: 'Desktop notifications', enabled: true }
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between">
                      <span className="text-gray-700">{setting.label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequency Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly summary</option>
                      <option value="daily" selected>Daily digest</option>
                      <option value="weekly">Weekly summary</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quiet Hours</label>
                    <div className="flex items-center space-x-2">
                      <input type="time" defaultValue="22:00" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <span className="text-gray-500">to</span>
                      <input type="time" defaultValue="08:00" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">No notifications during these hours</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                  Reset to Defaults
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                <p className="text-gray-600">Stay updated with your project activities</p>
              </div>
              <button 
                onClick={() => setShowNotificationSettings(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  id: 1, 
                  title: 'Task Completed', 
                  message: 'Sarah Wilson completed "Implement User Authentication"', 
                  time: '5 minutes ago', 
                  type: 'success',
                  unread: true 
                },
                { 
                  id: 2, 
                  title: 'New Comment', 
                  message: 'Alex Chen added a comment to "API Documentation"', 
                  time: '1 hour ago', 
                  type: 'info',
                  unread: true 
                },
                { 
                  id: 3, 
                  title: 'Deadline Reminder', 
                  message: 'Project "E-commerce Platform" is due tomorrow', 
                  time: '2 hours ago', 
                  type: 'warning',
                  unread: false 
                },
                { 
                  id: 4, 
                  title: 'Team Member Added', 
                  message: 'Mike Johnson joined the "Brand Redesign" project', 
                  time: '1 day ago', 
                  type: 'info',
                  unread: false 
                },
                { 
                  id: 5, 
                  title: 'Project Created', 
                  message: 'New project "Mobile App Development" has been created', 
                  time: '2 days ago', 
                  type: 'success',
                  unread: false 
                }
              ].map((notification) => (
                <div key={notification.id} className={`p-4 rounded-lg border ${
                  notification.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return <UserProfile />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={handleViewChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onViewChange={handleViewChange} />
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
      
      {/* Modals */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        onCreateProject={(projectData) => {
          console.log('Creating project:', projectData);
          // In a real app, this would call an API
          setShowCreateProject(false);
        }}
      />
      
      <AddTeamMemberModal
        isOpen={showAddTeamMember}
        onClose={() => setShowAddTeamMember(false)}
        onAddMember={(memberData) => {
          setTeamMembers(prev => [...prev, memberData]);
        }}
      />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* WhatsApp Simulator Demo Button - Fixed Position */}
      <button
        onClick={() => setShowWhatsAppSimulator(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 hover:scale-105 z-40 flex items-center justify-center"
        title="WhatsApp Simulator (Demo)"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* WhatsApp Simulator Modal */}
      <WhatsAppSimulator
        isOpen={showWhatsAppSimulator}
        onClose={() => setShowWhatsAppSimulator(false)}
        onApproval={(token, action, message) => {
          console.log('WhatsApp approval:', { token, action, message });
          // Handle approval logic here
        }}
        pendingApprovals={[
          { token: 'APP-DEL123', deliverableTitle: 'Brand Guidelines V2', projectName: 'Brand Redesign Project' },
          { token: 'APP-DOC456', deliverableTitle: 'Marketing Strategy', projectName: 'Q4 Campaign' }
        ]}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;