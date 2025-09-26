import React, { useState } from 'react';
import { MessageCircle, Check, X, Clock, Smartphone, Mail, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { Version } from '../../types';

interface ApprovalInterfaceProps {
  version: Version;
  onApprove: (method: 'in-app' | 'whatsapp' | 'email', metadata?: any) => void;
  onReject: (reason: string, method: 'in-app' | 'whatsapp' | 'email') => void;
  userRole: 'admin' | 'pm' | 'client';
  showWhatsAppSimulator?: boolean;
}

const ApprovalInterface: React.FC<ApprovalInterfaceProps> = ({
  version,
  onApprove,
  onReject,
  userRole,
  showWhatsAppSimulator = false,
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [simulatingWhatsApp, setSimulatingWhatsApp] = useState(false);

  const approvalToken = `APP-${version.deliverableId.slice(-6).toUpperCase()}`;

  const handleInAppApproval = () => {
    onApprove('in-app', {
      ipAddress: '192.168.1.1',
      userAgent: navigator.userAgent,
      timestamp: new Date(),
    });
    toast.success('Deliverable approved successfully!');
  };

  const handleInAppRejection = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    onReject(rejectionReason, 'in-app');
    setRejectionReason('');
    setShowRejectionModal(false);
    toast.success('Rejection submitted with feedback');
  };

  const simulateWhatsAppReply = async () => {
    if (!whatsappMessage.trim()) {
      toast.error('Please enter a WhatsApp message');
      return;
    }

    setSimulatingWhatsApp(true);

    try {
      // Simulate WhatsApp message processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const message = whatsappMessage.toLowerCase();
      const containsToken = message.includes(approvalToken.toLowerCase());

      if (!containsToken) {
        toast.error(`Invalid token. Please include ${approvalToken} in your message.`);
        return;
      }

      if (message.includes('approve')) {
        onApprove('whatsapp', {
          phone: '+1234567890',
          messageId: 'msg_' + Date.now(),
          originalMessage: whatsappMessage,
          timestamp: new Date(),
        });
        toast.success('✅ WhatsApp approval processed successfully!');
      } else if (message.includes('reject')) {
        onReject(whatsappMessage, 'whatsapp');
        toast.success('❌ WhatsApp rejection processed successfully!');
      } else {
        toast.error('Invalid command. Use "approve" or "reject" with the token.');
        return;
      }

      setWhatsappMessage('');
    } catch (error) {
      toast.error('Failed to process WhatsApp message');
    } finally {
      setSimulatingWhatsApp(false);
    }
  };

  const generateWhatsAppMessage = (action: 'approve' | 'reject') => {
    return `${action} ${approvalToken}`;
  };

  if (version.status === 'approved') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Approved</h3>
            <p className="text-green-700">
              {version.signerMetadata ? (
                <>
                  Approved on {new Date(version.signerMetadata.signedAt).toLocaleDateString()}
                  {' '}via {version.signerMetadata.method}
                </>
              ) : (
                'This version has been approved'
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (version.status === 'rejected') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Rejected</h3>
            <p className="text-red-700">This version has been rejected</p>
          </div>
        </div>
      </div>
    );
  }

  if (userRole !== 'client') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900">Pending Approval</h3>
            <p className="text-yellow-700">
              Waiting for client review and approval
            </p>
            {version.signerMetadata?.method === 'whatsapp' && (
              <p className="text-sm text-yellow-600 mt-1">
                WhatsApp notification sent • Token: {approvalToken}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Approval Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Review & Approve
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* In-App Approval */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Monitor className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">In-App</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleInAppApproval}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-4 h-4 inline mr-2" />
                Approve
              </button>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <X className="w-4 h-4 inline mr-2" />
                Request Changes
              </button>
            </div>
          </div>

          {/* Email Notification */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Email</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Check your email for approval link
            </p>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Token: {approvalToken}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <MessageCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">WhatsApp</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Reply to WhatsApp message
            </p>
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Token: {approvalToken}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">Quick actions:</span>
          <button
            onClick={() => setWhatsappMessage(generateWhatsAppMessage('approve'))}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Copy Approve Message
          </button>
          <button
            onClick={() => setWhatsappMessage(generateWhatsAppMessage('reject'))}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Copy Reject Message
          </button>
        </div>
      </div>

      {/* WhatsApp Simulator */}
      {showWhatsAppSimulator && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Smartphone className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              WhatsApp Simulator
            </h3>
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              DEMO
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Simulate a WhatsApp reply to test the approval workflow:
          </p>
          
          <div className="space-y-3">
            <textarea
              value={whatsappMessage}
              onChange={(e) => setWhatsappMessage(e.target.value)}
              placeholder={`Type your message here... (include "${approvalToken}" with "approve" or "reject")`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              rows={3}
            />
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Example: "approve {approvalToken}" or "reject {approvalToken} - needs revision"
              </div>
              <button
                onClick={simulateWhatsAppReply}
                disabled={simulatingWhatsApp}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {simulatingWhatsApp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Send WhatsApp Reply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Request Changes
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide feedback on what needs to be changed:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Describe the changes needed..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleInAppRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalInterface;