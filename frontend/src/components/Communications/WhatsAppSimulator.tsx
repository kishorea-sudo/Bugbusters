import React, { useState, useRef, useEffect } from 'react';
import { Send, Smartphone, User, Bot, X } from 'lucide-react';

interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'system';
  content: string;
  timestamp: Date;
  token?: string;
  action?: 'approve' | 'reject';
}

interface WhatsAppSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onApproval?: (token: string, action: 'approve' | 'reject', message: string) => void;
  pendingApprovals?: Array<{
    token: string;
    deliverableTitle: string;
    projectName: string;
  }>;
}

const WhatsAppSimulator: React.FC<WhatsAppSimulatorProps> = ({
  isOpen,
  onClose,
  onApproval,
  pendingApprovals = []
}) => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message and pending approvals
      const initialMessages: WhatsAppMessage[] = [
        {
          id: 'welcome',
          sender: 'system',
          content: '👋 Welcome to NexaFlow WhatsApp Approval System!\n\nYou can respond to approval requests here.',
          timestamp: new Date()
        }
      ];

      // Add pending approvals
      pendingApprovals.forEach((approval, index) => {
        initialMessages.push({
          id: `pending-${index}`,
          sender: 'system',
          content: `🔔 *Approval Request*\n\n*Project:* ${approval.projectName}\n*Deliverable:* ${approval.deliverableTitle}\n\nPlease respond:\n• "APPROVE ${approval.token}" to approve\n• "REJECT ${approval.token} [reason]" to reject\n\nToken: ${approval.token}`,
          timestamp: new Date(Date.now() + index * 1000),
          token: approval.token
        });
      });

      setMessages(initialMessages);
    }
  }, [isOpen, pendingApprovals]);

  const parseMessage = (content: string) => {
    const upperContent = content.toUpperCase();
    
    // Check for approval tokens
    const tokenMatch = content.match(/APP-([A-Z0-9]{6})/i);
    
    if (tokenMatch) {
      const token = tokenMatch[0];
      
      if (upperContent.includes('APPROVE')) {
        return { token, action: 'approve' as const };
      } else if (upperContent.includes('REJECT')) {
        return { token, action: 'reject' as const };
      }
    }
    
    // Check for general approval/rejection words
    if (/\b(approve|approved|yes|ok|accept|good|great)\b/i.test(content)) {
      return { action: 'approve' as const };
    } else if (/\b(reject|rejected|no|deny|decline|bad|wrong)\b/i.test(content)) {
      return { action: 'reject' as const };
    }
    
    return null;
  };

  const simulateSystemResponse = (userMessage: string, parsedResult: any) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let systemResponse = '';
      
      if (parsedResult?.token) {
        const approval = pendingApprovals.find(a => a.token === parsedResult.token);
        if (approval) {
          if (parsedResult.action === 'approve') {
            systemResponse = `✅ *Approval Confirmed*\n\nDeliverable: ${approval.deliverableTitle}\nProject: ${approval.projectName}\nStatus: APPROVED\n\nThank you! The team has been notified.`;
          } else if (parsedResult.action === 'reject') {
            const reason = userMessage.replace(new RegExp(`reject\\s+${parsedResult.token}`, 'i'), '').trim() || 'No reason provided';
            systemResponse = `❌ *Rejection Confirmed*\n\nDeliverable: ${approval.deliverableTitle}\nProject: ${approval.projectName}\nStatus: REJECTED\nReason: ${reason}\n\nThe team has been notified for revisions.`;
          }
          
          // Call the approval handler
          if (onApproval && parsedResult.action) {
            onApproval(parsedResult.token, parsedResult.action, userMessage);
          }
        } else {
          systemResponse = `⚠️ Token ${parsedResult.token} not found or already processed.`;
        }
      } else if (parsedResult?.action) {
        if (pendingApprovals.length > 0) {
          systemResponse = `I understand you want to ${parsedResult.action}, but please specify which deliverable using the token format:\n\n"${parsedResult.action.toUpperCase()} APP-XXXXXX"`;
        } else {
          systemResponse = `No pending approvals found. You can respond to approval requests when they arrive.`;
        }
      } else {
        // General responses for unrecognized messages
        const responses = [
          "I can help you approve or reject deliverables. Please use the format:\n• 'APPROVE APP-XXXXXX' to approve\n• 'REJECT APP-XXXXXX [reason]' to reject",
          "To process an approval, please include the token (APP-XXXXXX) in your message.",
          "I'm here to help with approvals! Send me approval requests with tokens to get started.",
          "Use the tokens provided in approval notifications to respond. For example: 'APPROVE APP-DEL123'"
        ];
        
        systemResponse = responses[Math.floor(Math.random() * responses.length)];
      }
      
      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        sender: 'system',
        content: systemResponse,
        timestamp: new Date()
      }]);
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay for realism
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: WhatsAppMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Parse the message for approval/rejection
    const parsedResult = parseMessage(currentMessage);
    
    if (parsedResult) {
      simulateSystemResponse(currentMessage, parsedResult);
    } else {
      simulateSystemResponse(currentMessage, null);
    }

    setCurrentMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Approve First', action: pendingApprovals[0] ? `APPROVE ${pendingApprovals[0].token}` : '' },
    { label: 'Reject First', action: pendingApprovals[0] ? `REJECT ${pendingApprovals[0].token} Needs revision` : '' },
    { label: 'Status Check', action: 'What approvals are pending?' },
    { label: 'Help', action: 'Help me with approvals' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">NexaFlow Bot</h3>
              <p className="text-xs text-green-100">WhatsApp Business</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-green-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end space-x-2 max-w-xs">
                {message.sender === 'system' && (
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                
                <div
                  className={`rounded-lg px-3 py-2 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {pendingApprovals.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.filter(action => action.action).map((action, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(action.action)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-gray-400 mt-2">
            Demo mode - simulating WhatsApp Business API
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSimulator;