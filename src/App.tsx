import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useProjects } from './hooks/useProjects';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import StatsCards from './components/Dashboard/StatsCards';
import RecentActivity from './components/Dashboard/RecentActivity';
import ProjectCard from './components/Projects/ProjectCard';
import ProjectDetail from './components/Projects/ProjectDetail';
import CreateProjectModal from './components/Projects/CreateProjectModal';
import ReportGenerator from './components/AI/ReportGenerator';
import EnhancedAnalyticsDashboard from './components/Analytics/EnhancedAnalyticsDashboard';
import RulesEngine from './components/Automation/RulesEngine';
import WhatsAppSimulator from './components/Communications/WhatsAppSimulator';
import { Project, AIReport, Rule } from './types';
import { FileText, Users, Settings, Bell, MessageCircle } from 'lucide-react';

function AppContent() {
  const { user, isLoading } = useAuth();
  const { projects, activities, updateDeliverableStatus } = useProjects();
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [, setGeneratedReports] = useState<AIReport[]>([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showWhatsAppSimulator, setShowWhatsAppSimulator] = useState(false);
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
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <p className="text-gray-600">Loading NexaFlow...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleReportGenerated = (report: AIReport) => {
    setGeneratedReports(prev => [report, ...prev]);
  };

  const stats = {
    activeProjects: projects.filter(p => p.status === 'active').length,
    pendingApprovals: projects.reduce((acc, p) => 
      acc + p.deliverables.filter(d => d.status === 'review').length, 0
    ),
    completedThisMonth: projects.reduce((acc, p) => 
      acc + p.deliverables.filter(d => d.status === 'approved').length, 0
    ),
    overdueItems: projects.reduce((acc, p) => 
      acc + p.deliverables.filter(d => 
        d.status !== 'approved' && new Date(d.dueDate) < new Date()
      ).length, 0
    ),
  };

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
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your projects today.
              </p>
            </div>
            
            <StatsCards stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Projects</h3>
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={setSelectedProject}
                    />
                  ))}
                </div>
              </div>
              
              <RecentActivity activities={activities} />
            </div>

            {(user.role === 'admin' || user.role === 'pm') && (
              <ReportGenerator
                projectId={projects[0]?.id || ''}
                onGenerate={handleReportGenerated}
              />
            )}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-gray-600">Manage and track all your active projects</p>
              </div>
              {user.role !== 'client' && (
                <button 
                  onClick={() => setShowCreateProject(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Project
                </button>
              )}
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
        return <EnhancedAnalyticsDashboard />;

      case 'documents':
        return (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Library</h3>
            <p className="text-gray-600">All project documents and files in one place</p>
          </div>
        );

      case 'team':
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
            <p className="text-gray-600">Manage team members and permissions</p>
          </div>
        );

      case 'automations':
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

      case 'notifications':
        return (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h3>
            <p className="text-gray-600">Manage your notification preferences</p>
          </div>
        );

      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Customize your NexaFlow experience</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
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