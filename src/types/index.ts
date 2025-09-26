export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'pm' | 'client' | 'member';
  avatar?: string;
  createdAt: Date;
  lastActive: Date;
  assignedToProjects?: string[]; // For team members
}

export interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
  };
  team: string[];
  deliverables: Deliverable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Deliverable {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'revision';
  requiresReview: boolean;
  assigneeId: string;
  dueDate: Date;
  currentVersionId?: string;
  versions: Version[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Version {
  id: string;
  deliverableId: string;
  version: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploaderId: string;
  status: 'pending' | 'approved' | 'rejected';
  signerMetadata?: {
    signerId: string;
    signedAt: Date;
    method: 'in-app' | 'whatsapp' | 'email';
    ipAddress: string;
  };
  createdAt: Date;
}

export interface Activity {
  id: string;
  projectId: string;
  actorId: string;
  type: 'project.created' | 'file.uploaded' | 'deliverable.approved' | 'deliverable.rejected' | 'comment.added' | 'milestone.completed';
  payload: Record<string, any>;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  deliverableIds: string[];
}

export interface ClientRequest {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestType: 'feature' | 'bug-fix' | 'enhancement' | 'support';
  estimatedBudget?: number;
  desiredDeliveryDate: Date;
  attachments?: string[];
  status: 'submitted' | 'under-review' | 'approved' | 'assigned-to-pm' | 'in-progress' | 'completed' | 'rejected';
  assignedAdminId?: string;
  assignedPMId?: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  clientRequestId?: string; // Links back to original client request
  title: string;
  description: string;
  assigneeId: string;
  assignedBy: string;
  assignedToRole: 'pm' | 'member'; // Whether assigned to PM or team member
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags?: string[];
  attachments?: string[];
  comments: Comment[];
  parentTaskId?: string; // For subtasks created by PM
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskUpdate {
  id: string;
  taskId: string;
  taskTitle: string;
  projectId: string;
  projectName: string;
  teamMemberId: string;
  teamMemberName: string;
  updateType: 'progress' | 'completed' | 'blocked' | 'review-ready';
  previousStatus: string;
  newStatus: string;
  progressPercentage?: number;
  description: string;
  attachments?: string[];
  hoursWorked?: number;
  nextSteps?: string;
  blockers?: string;
  createdAt: Date;
  reviewedByPM: boolean;
  sentToClient: boolean;
  clientFeedback?: string;
}

export interface PMClientCommunication {
  id: string;
  projectId: string;
  projectName: string;
  clientId: string;
  pmId: string;
  subject: string;
  messageType: 'task-update' | 'milestone-complete' | 'issue-report' | 'approval-request' | 'general';
  content: string;
  taskUpdates?: TaskUpdate[];
  attachments?: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'sent' | 'read' | 'responded';
  clientResponse?: string;
  responseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  channel: 'in-app' | 'email' | 'whatsapp';
  status: 'unread' | 'read';
  actionUrl?: string;
  createdAt: Date;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  active: boolean;
  createdAt: Date;
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

export interface RuleAction {
  type: 'update_status' | 'send_notification' | 'assign_user' | 'create_activity';
  params: Record<string, any>;
}

export interface AIReport {
  id: string;
  projectId: string;
  summary: string;
  actions: string[];
  risk: string;
  generatedAt: Date;
  sentAt?: Date;
  recipients: string[];
}

export interface Analytics {
  overdueCount: number;
  avgApprovalTime: number;
  openDeliverablesCount: number;
  activityVelocity: number;
  completionRate: number;
  clientSatisfaction: number;
}

export interface Approval {
  id: string;
  versionId: string;
  approverId: string;
  method: 'in-app' | 'whatsapp' | 'email';
  status: 'pending' | 'approved' | 'rejected';
  token: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  messageId?: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

export interface ImportSource {
  type: 'drive' | 'dropbox' | 'url';
  url: string;
  metadata?: Record<string, any>;
}

export interface ScheduledReport {
  id: string;
  projectId: string;
  schedule: 'weekly' | 'bi-weekly' | 'monthly';
  recipients: string[];
  lastSent?: Date;
  nextDue: Date;
  active: boolean;
}

export interface KPI {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  format: 'number' | 'percentage' | 'currency' | 'days';
}