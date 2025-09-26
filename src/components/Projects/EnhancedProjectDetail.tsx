import React, { useState } from 'react';
import { ArrowLeft, Calendar, Users, Clock, CheckCircle, AlertCircle, Upload, Eye, MessageSquare, History } from 'lucide-react';
import { Project, Deliverable, ImportSource } from '../../types';
import FileUpload from '../FileUpload/FileUpload';
import ApprovalInterface from '../Approvals/ApprovalInterface';
import toast from 'react-hot-toast';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onUpdateDeliverableStatus: (deliverableId: string, status: Deliverable['status']) => void;
}

const EnhancedProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  onBack,
  onUpdateDeliverableStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'deliverables' | 'activity'>('deliverables');

  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<string | null>(null);

  const getStatusColor = (status: Deliverable['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'revision':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Deliverable['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'review':
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleFileUpload = (deliverableId: string) => {
    // Update deliverable status to review if it requires review
    const deliverable = project.deliverables.find(d => d.id === deliverableId);
    if (deliverable?.requiresReview) {
      onUpdateDeliverableStatus(deliverableId, 'review');
    }

    setShowUploadModal(null);
    toast.success('File uploaded successfully! Review process initiated.');
  };

  const handleFileImport = (source: ImportSource) => {
    toast.success(`Importing file from ${source.type}...`);
    setTimeout(() => {
      toast.success('File imported successfully!');
      setShowUploadModal(null);
    }, 2000);
  };

  const handleApproval = (deliverableId: string) => {
    onUpdateDeliverableStatus(deliverableId, 'approved');
    setShowApprovalModal(null);
  };

  const handleRejection = (deliverableId: string, reason: string) => {
    onUpdateDeliverableStatus(deliverableId, 'rejected');
    toast.error(`Deliverable rejected: ${reason}`);
    setShowApprovalModal(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'deliverables', label: 'Deliverables', icon: Upload },
    { id: 'activity', label: 'Activity', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {project.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            project.priority === 'high' 
              ? 'bg-red-100 text-red-800'
              : project.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {project.priority} priority
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Timeline</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Start:</span> {new Date(project.timeline.startDate).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="text-gray-600">End:</span> {new Date(project.timeline.endDate).toLocaleDateString()}
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Duration:</span> {Math.ceil((new Date(project.timeline.endDate).getTime() - new Date(project.timeline.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Team</h3>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {project.team.length} members assigned
              </div>
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                ))}
                {project.team.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border shadow-sm">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Progress</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-medium">{project.deliverables.filter(d => d.status === 'approved').length}/{project.deliverables.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${(project.deliverables.filter(d => d.status === 'approved').length / project.deliverables.length) * 100}%` 
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {Math.round((project.deliverables.filter(d => d.status === 'approved').length / project.deliverables.length) * 100)}% complete
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deliverables' && (
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Deliverables</h3>
              <div className="text-sm text-gray-600">
                {project.deliverables.filter(d => d.status === 'approved').length} of {project.deliverables.length} completed
              </div>
            </div>
          </div>
          
          <div className="divide-y">
            {project.deliverables.map((deliverable) => (
              <div key={deliverable.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{deliverable.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(deliverable.status)}`}>
                        {getStatusIcon(deliverable.status)}
                        <span>{deliverable.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{deliverable.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Due: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                        <span>Versions: {deliverable.versions.length}</span>
                        {deliverable.requiresReview && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Requires Review
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setShowUploadModal(deliverable.id)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </button>
                    
                    {deliverable.status === 'review' && (
                      <button
                        onClick={() => setShowApprovalModal(deliverable.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Review
                      </button>
                    )}
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Brand Guidelines approved</p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">New version uploaded for Logo Design</p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Website Mockup pending review</p>
                <p className="text-xs text-gray-600">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload File - {project.deliverables.find(d => d.id === showUploadModal)?.title}
              </h3>
              <button
                onClick={() => setShowUploadModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <FileUpload
                deliverableId={showUploadModal}
                onUpload={() => handleFileUpload(showUploadModal)}
                onImport={(source) => handleFileImport(source)}
                currentVersion={project.deliverables.find(d => d.id === showUploadModal)?.versions[0]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Review & Approve - {project.deliverables.find(d => d.id === showApprovalModal)?.title}
              </h3>
              <button
                onClick={() => setShowApprovalModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {project.deliverables.find(d => d.id === showApprovalModal)?.versions[0] && (
                <ApprovalInterface
                  version={project.deliverables.find(d => d.id === showApprovalModal)!.versions[0]}
                  onApprove={() => handleApproval(showApprovalModal!)}
                  onReject={(reason) => handleRejection(showApprovalModal!, reason)}
                  userRole="client"
                  showWhatsAppSimulator={true}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedProjectDetail;