export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'pm' | 'client';
          avatar_url?: string;
          phone?: string;
          whatsapp?: string;
          created_at: string;
          updated_at: string;
          last_active: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'pm' | 'client';
          avatar_url?: string;
          phone?: string;
          whatsapp?: string;
          created_at?: string;
          updated_at?: string;
          last_active?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'pm' | 'client';
          avatar_url?: string;
          phone?: string;
          whatsapp?: string;
          created_at?: string;
          updated_at?: string;
          last_active?: string;
        };
      };

      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          client_id: string;
          status: 'active' | 'completed' | 'on-hold' | 'cancelled';
          priority: 'low' | 'medium' | 'high' | 'critical';
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          client_id: string;
          status?: 'active' | 'completed' | 'on-hold' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          client_id?: string;
          status?: 'active' | 'completed' | 'on-hold' | 'cancelled';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      project_team: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
      };

      deliverables: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          status: 'draft' | 'review' | 'approved' | 'rejected' | 'revision';
          requires_review: boolean;
          assignee_id: string;
          due_date: string;
          current_version_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description: string;
          status?: 'draft' | 'review' | 'approved' | 'rejected' | 'revision';
          requires_review?: boolean;
          assignee_id: string;
          due_date: string;
          current_version_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string;
          status?: 'draft' | 'review' | 'approved' | 'rejected' | 'revision';
          requires_review?: boolean;
          assignee_id?: string;
          due_date?: string;
          current_version_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      versions: {
        Row: {
          id: string;
          deliverable_id: string;
          version: string;
          file_url: string;
          file_name: string;
          file_size: number;
          uploader_id: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          deliverable_id: string;
          version: string;
          file_url: string;
          file_name: string;
          file_size: number;
          uploader_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          deliverable_id?: string;
          version?: string;
          file_url?: string;
          file_name?: string;
          file_size?: number;
          uploader_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
      };

      activities: {
        Row: {
          id: string;
          project_id: string;
          actor_id: string;
          type: string;
          payload: any;
          created_at: string;
          metadata?: any;
        };
        Insert: {
          id?: string;
          project_id: string;
          actor_id: string;
          type: string;
          payload: any;
          created_at?: string;
          metadata?: any;
        };
        Update: {
          id?: string;
          project_id?: string;
          actor_id?: string;
          type?: string;
          payload?: any;
          created_at?: string;
          metadata?: any;
        };
      };

      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          channel: 'in-app' | 'email' | 'whatsapp';
          status: 'unread' | 'read';
          action_url?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: 'info' | 'success' | 'warning' | 'error';
          channel: 'in-app' | 'email' | 'whatsapp';
          status?: 'unread' | 'read';
          action_url?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'info' | 'success' | 'warning' | 'error';
          channel?: 'in-app' | 'email' | 'whatsapp';
          status?: 'unread' | 'read';
          action_url?: string;
          created_at?: string;
        };
      };

      automation_rules: {
        Row: {
          id: string;
          name: string;
          description: string;
          trigger: string;
          conditions: any;
          actions: any;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          trigger: string;
          conditions: any;
          actions: any;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          trigger?: string;
          conditions?: any;
          actions?: any;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      ai_reports: {
        Row: {
          id: string;
          project_id: string;
          summary: string;
          actions: string[];
          risk: string;
          generated_at: string;
          sent_at?: string;
          recipients: string[];
        };
        Insert: {
          id?: string;
          project_id: string;
          summary: string;
          actions: string[];
          risk: string;
          generated_at?: string;
          sent_at?: string;
          recipients: string[];
        };
        Update: {
          id?: string;
          project_id?: string;
          summary?: string;
          actions?: string[];
          risk?: string;
          generated_at?: string;
          sent_at?: string;
          recipients?: string[];
        };
      };

      approvals: {
        Row: {
          id: string;
          version_id: string;
          approver_id: string;
          method: 'in-app' | 'whatsapp' | 'email';
          status: 'pending' | 'approved' | 'rejected';
          token: string;
          timestamp: string;
          ip_address?: string;
          user_agent?: string;
          reason?: string;
        };
        Insert: {
          id?: string;
          version_id: string;
          approver_id: string;
          method: 'in-app' | 'whatsapp' | 'email';
          status?: 'pending' | 'approved' | 'rejected';
          token: string;
          timestamp?: string;
          ip_address?: string;
          user_agent?: string;
          reason?: string;
        };
        Update: {
          id?: string;
          version_id?: string;
          approver_id?: string;
          method?: 'in-app' | 'whatsapp' | 'email';
          status?: 'pending' | 'approved' | 'rejected';
          token?: string;
          timestamp?: string;
          ip_address?: string;
          user_agent?: string;
          reason?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}