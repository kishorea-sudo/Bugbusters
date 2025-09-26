import React, { useState } from 'react';
import { Bot, Send, Clock, FileText, Settings, MessageCircle, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { AIReport, ScheduledReport } from '../../types';

interface ReportGeneratorProps {
  projectId: string;
  onGenerate: (report: AIReport) => void;
  scheduledReports?: ScheduledReport[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  projectId,
  onGenerate,
  scheduledReports = [],
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<AIReport | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [sendChannels, setSendChannels] = useState({
    email: true,
    whatsapp: false,
    inApp: true,
  });

  const activeSchedule = scheduledReports.find(sr => sr.projectId === projectId && sr.active);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI processing with more realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate different report variations
      const summaries = [
        "Project momentum is strong with 3 deliverables approved this week. Client engagement remains high with quick turnaround on feedback. Team velocity has improved by 15% compared to last sprint.",
        "Steady progress across all workstreams with 2 major milestones completed. Minor scope adjustment requested by client but timeline impact is minimal. Quality metrics are exceeding expectations.",
        "Strong week with breakthrough on technical implementation. Client stakeholder meeting went exceptionally well with positive feedback on design direction. Ready to move into next phase ahead of schedule."
      ];

      const actionSets = [
        [
          "Finalize brand guidelines and submit for client approval by Thursday",
          "Schedule technical discovery session with client's IT team",
          "Complete user testing phase and compile feedback report"
        ],
        [
          "Review and incorporate client feedback on wireframe iterations",
          "Coordinate with external vendor for integration requirements", 
          "Prepare presentation materials for executive stakeholder review"
        ],
        [
          "Complete quality assurance testing on deliverable package",
          "Schedule final client presentation for Friday at 2 PM",
          "Document project learnings and update process templates"
        ]
      ];

      const risks = [
        "Potential resource constraint if additional scope is approved without timeline extension",
        "Client availability for feedback sessions may impact approval timeline next week",
        "Third-party integration dependency could introduce minor delays if not resolved by Monday"
      ];

      const randomIndex = Math.floor(Math.random() * 3);
      
      const report: AIReport = {
        id: `report-${Date.now()}`,
        projectId,
        summary: summaries[randomIndex],
        actions: actionSets[randomIndex],
        risk: risks[randomIndex],
        generatedAt: new Date(),
        recipients: []
      };
      
      setGeneratedReport(report);
      onGenerate(report);
      toast.success('AI report generated successfully!');
      
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReport = async () => {
    if (!generatedReport) return;

    try {
      const channels = [];
      if (sendChannels.email) channels.push('Email');
      if (sendChannels.whatsapp) channels.push('WhatsApp');
      if (sendChannels.inApp) channels.push('In-App');

      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Report sent via ${channels.join(', ')}`);
      
      // Simulate individual channel confirmations
      if (sendChannels.email) {
        setTimeout(() => toast.success('📧 Email report delivered'), 500);
      }
      if (sendChannels.whatsapp) {
        setTimeout(() => toast.success('📱 WhatsApp report sent'), 1000);
      }
      if (sendChannels.inApp) {
        setTimeout(() => toast.success('🔔 In-app notification sent'), 1500);
      }

      setGeneratedReport(null);
      setShowSendOptions(false);
    } catch (error) {
      toast.error('Failed to send report');
    }
  };

  const runScheduledReportsNow = () => {
    toast.success('Running all scheduled reports...');
    setTimeout(() => {
      toast.success('✅ 3 reports generated and sent successfully');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Main Report Generator */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bot className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Weekly Report Generator</h3>
          </div>
          <div className="flex items-center space-x-2">
            {activeSchedule && (
              <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 mr-1" />
                Next: {new Date(activeSchedule.nextDue).toLocaleDateString()}
              </div>
            )}
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!generatedReport ? (
          <div className="text-center">
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                  Analyzing project data...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 inline mr-2" />
                  Generate Weekly Report
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              AI will analyze recent activities, deliverable status, and team performance
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                📊 Executive Summary
              </h4>
              <p className="text-gray-700 leading-relaxed">{generatedReport.summary}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                ✅ Priority Actions
              </h4>
              <ul className="space-y-2">
                {generatedReport.actions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                ⚠️ Risk Assessment
              </h4>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-yellow-800">{generatedReport.risk}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Generated {new Date(generatedReport.generatedAt).toLocaleTimeString()}</span>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Regenerate
                </button>
                <button
                  onClick={() => setShowSendOptions(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Send Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Controls */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Demo Controls</h4>
            <p className="text-sm text-gray-600">Simulate scheduled report execution</p>
          </div>
          <button
            onClick={runScheduledReportsNow}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Run Scheduled Reports Now
          </button>
        </div>
      </div>

      {/* Scheduler Panel */}
      {showScheduler && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Report Scheduling</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Weekly Reports</span>
                <p className="text-sm text-gray-600">Every Monday at 9:00 AM</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              💡 <strong>Pro Tip:</strong> Scheduled reports automatically analyze project activity, 
              generate AI summaries, and send notifications to stakeholders via their preferred channels.
            </div>
          </div>
        </div>
      )}

      {/* Send Options Modal */}
      {showSendOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Send Report Options
            </h3>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sendChannels.email}
                  onChange={(e) => setSendChannels(prev => ({ ...prev, email: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 ml-2 mr-2 text-gray-500" />
                <span>Email (client@example.com)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sendChannels.whatsapp}
                  onChange={(e) => setSendChannels(prev => ({ ...prev, whatsapp: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <MessageCircle className="w-4 h-4 ml-2 mr-2 text-green-600" />
                <span>WhatsApp (+1234567890)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={sendChannels.inApp}
                  onChange={(e) => setSendChannels(prev => ({ ...prev, inApp: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Bot className="w-4 h-4 ml-2 mr-2 text-purple-600" />
                <span>In-App Notification</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSendOptions(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;