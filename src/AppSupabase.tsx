import { SupabaseAuthProvider, useAuth } from './context/SupabaseAuthContext';
import { SupabaseLoginForm } from './components/Auth/SupabaseLoginForm';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { StatsCards } from './components/Dashboard/StatsCards';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { ProjectDetail } from './components/Projects/ProjectDetail';
import { ReportGenerator } from './components/AI/ReportGenerator';
import { UserProfile } from './components/Auth/UserProfile';
import { AddTeamMemberModal } from './components/Team/AddTeamMemberModal';
import { useState } from 'react';
import { Toaster } from 'sonner';

// Main app content component
function AppContent() {
  const { user, profile, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    if (view !== 'notifications') {
      setShowNotificationSettings(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user) {
    return <SupabaseLoginForm />;
  }

  // Main app layout for authenticated users
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView}
        onViewChange={handleViewChange}
        userRole={profile?.role || 'team_member'}
        onNotificationSettings={() => setShowNotificationSettings(!showNotificationSettings)}
        onAddTeamMember={() => setShowAddTeamMember(true)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userRole={profile?.role || 'team_member'}
          userName={profile ? `${profile.first_name} ${profile.last_name}` : user.email || 'User'}
          onProfileClick={() => setShowProfile(true)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
      
      {showAddTeamMember && (
        <AddTeamMemberModal onClose={() => setShowAddTeamMember(false)} />
      )}
      
      <Toaster position="top-right" />
    </div>
  );

  function renderActiveView() {
    if (!profile) return null;

    // Role-based view restrictions
    const canViewAnalytics = ['admin', 'project_manager'].includes(profile.role);
    const canViewReports = ['admin', 'project_manager'].includes(profile.role);
    const canViewAllProjects = ['admin', 'project_manager'].includes(profile.role);

    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <StatsCards userRole={profile.role} />
            <RecentActivity userRole={profile.role} />
          </div>
        );
      
      case 'projects':
        if (profile.role === 'client') {
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Your Projects</h3>
              <p className="text-gray-600">View your active projects and their progress.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              {canViewAllProjects && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  New Project
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project cards would go here */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="font-medium text-gray-900">Sample Project</h3>
                <p className="text-gray-600 text-sm mt-2">Project description...</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                  <span className="text-sm text-gray-500">75% Complete</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">My Tasks</h1>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                New Task
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <p className="text-gray-600">Your assigned tasks will appear here.</p>
              </div>
            </div>
          </div>
        );
      
      case 'analytics':
        if (!canViewAnalytics) {
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Access Restricted</h3>
              <p className="text-gray-600">You don't have permission to view analytics.</p>
            </div>
          );
        }
        return <AnalyticsDashboard />;
      
      case 'reports':
        if (!canViewReports) {
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Access Restricted</h3>
              <p className="text-gray-600">You don't have permission to generate reports.</p>
            </div>
          );
        }
        return <ReportGenerator />;
      
      case 'team':
        if (profile.role === 'client') {
          return (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">Access Restricted</h3>
              <p className="text-gray-600">Clients cannot view team management.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
              {['admin', 'project_manager'].includes(profile.role) && (
                <button 
                  onClick={() => setShowAddTeamMember(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Team Member
                </button>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <p className="text-gray-600">Team member management interface will be displayed here.</p>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
            {showNotificationSettings ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Notifications</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Push Notifications</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Task Reminders</span>
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-900">New task assigned: "Shopping Cart Frontend"</p>
                        <p className="text-sm text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-gray-900">Project milestone completed</p>
                        <p className="text-sm text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-6">
            <StatsCards userRole={profile.role} />
            <RecentActivity userRole={profile.role} />
          </div>
        );
    }
  }
}

// Main App component with Supabase provider
export default function App() {
  return (
    <SupabaseAuthProvider>
      <AppContent />
    </SupabaseAuthProvider>
  );
}