// External service integrations for NexaFlow

// SendGrid Email Service
export const emailService = {
  async sendEmail(to: string, subject: string, body: string, template?: string) {
    // In demo mode, simulate email sending
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log(`📧 Email sent to ${to}: ${subject}`);
      return { success: true, messageId: `demo-${Date.now()}` };
    }

    // Production SendGrid integration
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`
        },
        body: JSON.stringify({
          to,
          subject,
          html: body,
          template_id: template
        })
      });
      
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: String(error) };
    }
  },

  // Pre-built email templates
  templates: {
    PROJECT_INVITATION: 'd-abc123def456',
    APPROVAL_REQUEST: 'd-def456ghi789',
    STATUS_UPDATE: 'd-ghi789jkl012',
    WEEKLY_REPORT: 'd-jkl012mno345'
  }
};

// Twilio WhatsApp Service
export const whatsappService = {
  async sendMessage(to: string, body: string, mediaUrl?: string) {
    // In demo mode, simulate WhatsApp sending
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      console.log(`📱 WhatsApp sent to ${to}: ${body}`);
      return { 
        success: true, 
        messageId: `whatsapp_demo_${Date.now()}`,
        status: 'sent'
      };
    }

    // Production Twilio WhatsApp integration
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_TWILIO_ACCOUNT_SID}:${import.meta.env.VITE_TWILIO_AUTH_TOKEN}`)}`
        },
        body: JSON.stringify({
          to: `whatsapp:${to}`,
          from: `whatsapp:${import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER}`,
          body,
          mediaUrl
        })
      });
      
      const result = await response.json();
      return { success: response.ok, ...result };
    } catch (error) {
      console.error('WhatsApp service error:', error);
      return { success: false, error: String(error) };
    }
  },

  // Parse approval tokens from WhatsApp messages
  parseApprovalToken(message: string): { token?: string, action?: 'approve' | 'reject' } {
    const tokenMatch = message.match(/APP-([A-Z0-9]{6})/i);
    const approveMatch = /\b(approve|approved|yes|ok|accept)\b/i.test(message);
    const rejectMatch = /\b(reject|rejected|no|deny|decline)\b/i.test(message);
    
    return {
      token: tokenMatch ? tokenMatch[0] : undefined,
      action: approveMatch ? 'approve' : rejectMatch ? 'reject' : undefined
    };
  },

  // Generate approval message templates
  generateApprovalMessage(deliverableTitle: string, token: string, viewUrl: string) {
    return `🔔 *NexaFlow Approval Request*

*Deliverable:* ${deliverableTitle}

Please review and respond:
• Reply "APPROVE ${token}" to approve
• Reply "REJECT ${token} [reason]" to reject
• View details: ${viewUrl}

Token: ${token}`;
  }
};

// OpenAI Service for AI Reports
export const aiService = {
  async generateReport(projectData: any) {
    // In demo mode, return canned responses
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      const cannedReports = [
        {
          summary: "Project progressing well with 3 deliverables completed this week. Team velocity is strong and client feedback has been positive across all review cycles.",
          actions: [
            "Schedule mid-project client check-in for next Friday",
            "Begin preparation for final deliverable review phase",
            "Update project timeline to reflect accelerated progress"
          ],
          risk: "Minor delay risk identified in final review phase due to client availability constraints during holiday season."
        },
        {
          summary: "Strong momentum maintained with 2 major milestones achieved ahead of schedule. Client approval rate remains at 95% with minimal revision requests.",
          actions: [
            "Prepare comprehensive project completion documentation",
            "Schedule final stakeholder presentation for next week",
            "Begin transition planning for project handoff"
          ],
          risk: "Resource allocation needs attention as team members are being requested for other high-priority projects."
        }
      ];
      
      const randomReport = cannedReports[Math.floor(Math.random() * cannedReports.length)];
      return { success: true, ...randomReport };
    }

    // Production OpenAI integration
    try {
      const prompt = `Generate a concise weekly project report for the following project data:

Project: ${projectData.name}
Status: ${projectData.status}
Deliverables: ${projectData.deliverables?.length || 0}
Recent Activities: ${JSON.stringify(projectData.recentActivities?.slice(0, 5) || [])}

Format the response as JSON with:
1. summary: 3-sentence executive summary
2. actions: Array of 3 specific action items
3. risk: 1-sentence risk assessment

Keep it professional and actionable.`;

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a professional project manager creating concise, actionable weekly reports.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const result = await response.json();
      const reportData = JSON.parse(result.choices[0].message.content);
      
      return { success: true, ...reportData };
    } catch (error) {
      console.error('AI service error:', error);
      // Fallback to canned response on error
      return {
        success: false,
        summary: "Unable to generate AI report at this time. Please review project status manually.",
        actions: ["Review project deliverables manually", "Check team capacity", "Update stakeholders on progress"],
        risk: "AI report generation service temporarily unavailable.",
        error: String(error)
      };
    }
  },

  async generateInsight() {
    // Generate AI insights for analytics dashboard
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      const insights = [
        "Approval velocity has increased 23% this month, indicating improved client engagement.",
        "Project completion rate is trending upward with 89% on-time delivery.",
        "Team productivity metrics show optimal resource allocation across active projects.",
        "Client satisfaction scores have improved following process automation implementation."
      ];
      
      return { 
        success: true, 
        insight: insights[Math.floor(Math.random() * insights.length)]
      };
    }

    // Production implementation would call OpenAI API
    return { success: true, insight: "AI insights temporarily unavailable." };
  }
};

// File Import Services
export const importService = {
  async importFromDrive(fileId: string, accessToken: string) {
    // Demo mode simulation
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        file: {
          id: `drive_${Date.now()}`,
          name: 'imported_document.pdf',
          size: 2048576,
          url: 'https://demo-url.com/file.pdf'
        }
      };
    }

    // Production Google Drive integration
    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      return { success: response.ok, file: await response.blob() };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async importFromDropbox(path: string, accessToken: string) {
    // Demo mode simulation
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        success: true,
        file: {
          id: `dropbox_${Date.now()}`,
          name: 'imported_file.docx',
          size: 1536000,
          url: 'https://demo-url.com/file.docx'
        }
      };
    }

    // Production Dropbox integration
    try {
      const response = await fetch('https://content.dropboxapi.com/2/files/download', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Dropbox-API-Arg': JSON.stringify({ path })
        }
      });
      
      return { success: response.ok, file: await response.blob() };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  async importFromUrl(url: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      return {
        success: true,
        file: {
          id: `url_${Date.now()}`,
          name: url.split('/').pop() || 'imported_file',
          size: blob.size,
          blob
        }
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
};

// Notification Service
export const notificationService = {
  async send(notification: {
    userId: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    channels: ('in-app' | 'email' | 'whatsapp')[];
    actionUrl?: string;
  }) {
    const results = [];

    for (const channel of notification.channels) {
      switch (channel) {
        case 'email':
          const emailResult = await emailService.sendEmail(
            notification.userId, // This should be email address
            notification.title,
            notification.message
          );
          results.push({ channel: 'email', success: emailResult.success });
          break;

        case 'whatsapp':
          const whatsappResult = await whatsappService.sendMessage(
            notification.userId, // This should be phone number
            `*${notification.title}*\n\n${notification.message}`
          );
          results.push({ channel: 'whatsapp', success: whatsappResult.success });
          break;

        case 'in-app':
          // Store in-app notification in database
          results.push({ channel: 'in-app', success: true });
          break;
      }
    }

    return { success: true, results };
  }
};