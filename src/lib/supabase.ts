import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions
export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'project_manager' | 'team_member' | 'client';
  phone: string | null;
  avatar_url: string | null;
  department: string | null;
  skills: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Database helper functions
export const db = {
  // Projects
  async getProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        deliverables(*),
        team_members(*)
      `);
    return { data, error };
  },

  async createProject(project: any) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    return { data, error };
  },

  async updateProject(id: string, updates: any) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Deliverables
  async getDeliverables(projectId: string) {
    const { data, error } = await supabase
      .from('deliverables')
      .select(`
        *,
        versions(*),
        comments(*)
      `)
      .eq('project_id', projectId);
    return { data, error };
  },

  async updateDeliverableStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('deliverables')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // File uploads
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  },

  async getFileUrl(bucket: string, path: string) {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return data;
  },

  // Activities
  async logActivity(activity: any) {
    const { data, error } = await supabase
      .from('activities')
      .insert(activity)
      .select()
      .single();
    return { data, error };
  },

  // Notifications
  async createNotification(notification: any) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    return { data, error };
  },

  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Rules
  async getRules() {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async createRule(rule: any) {
    const { data, error } = await supabase
      .from('automation_rules')
      .insert(rule)
      .select()
      .single();
    return { data, error };
  }
};