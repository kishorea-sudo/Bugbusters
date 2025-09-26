-- NexaFlow Supabase Database Schema
-- Run these commands in your Supabase SQL editor

-- Enable Row Level Security and required extensions
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    email text UNIQUE NOT NULL,
    name text NOT NULL,
    role text CHECK (role IN ('admin', 'pm', 'client')) DEFAULT 'client',
    avatar_url text,
    phone text,
    whatsapp text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Projects table
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    client_id uuid REFERENCES public.users(id) NOT NULL,
    status text CHECK (status IN ('active', 'completed', 'on-hold', 'cancelled')) DEFAULT 'active',
    priority text CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    start_date date NOT NULL,
    end_date date NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Project team members
CREATE TABLE public.project_team (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL DEFAULT 'member',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Deliverables table
CREATE TABLE public.deliverables (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    status text CHECK (status IN ('draft', 'review', 'approved', 'rejected', 'revision')) DEFAULT 'draft',
    requires_review boolean DEFAULT true,
    assignee_id uuid REFERENCES public.users(id) NOT NULL,
    due_date date NOT NULL,
    current_version_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- File versions
CREATE TABLE public.versions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    deliverable_id uuid REFERENCES public.deliverables(id) ON DELETE CASCADE NOT NULL,
    version text NOT NULL,
    file_url text NOT NULL,
    file_name text NOT NULL,
    file_size bigint NOT NULL,
    uploader_id uuid REFERENCES public.users(id) NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key for current version
ALTER TABLE public.deliverables 
ADD CONSTRAINT fk_current_version 
FOREIGN KEY (current_version_id) REFERENCES public.versions(id);

-- Activities/Audit log
CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    actor_id uuid REFERENCES public.users(id) NOT NULL,
    type text NOT NULL,
    payload jsonb NOT NULL DEFAULT '{}',
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    channel text CHECK (channel IN ('in-app', 'email', 'whatsapp')) DEFAULT 'in-app',
    status text CHECK (status IN ('unread', 'read')) DEFAULT 'unread',
    action_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Automation rules
CREATE TABLE public.automation_rules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    trigger text NOT NULL,
    conditions jsonb NOT NULL DEFAULT '[]',
    actions jsonb NOT NULL DEFAULT '[]',
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Reports
CREATE TABLE public.ai_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    summary text NOT NULL,
    actions text[] NOT NULL DEFAULT '{}',
    risk text NOT NULL,
    generated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_at timestamp with time zone,
    recipients text[] NOT NULL DEFAULT '{}'
);

-- Approvals tracking
CREATE TABLE public.approvals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    version_id uuid REFERENCES public.versions(id) ON DELETE CASCADE NOT NULL,
    approver_id uuid REFERENCES public.users(id) NOT NULL,
    method text CHECK (method IN ('in-app', 'whatsapp', 'email')) NOT NULL,
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    token text UNIQUE NOT NULL,
    timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address inet,
    user_agent text,
    reason text
);

-- Comments on deliverables
CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    deliverable_id uuid REFERENCES public.deliverables(id) ON DELETE CASCADE NOT NULL,
    author_id uuid REFERENCES public.users(id) NOT NULL,
    content text NOT NULL,
    attachments text[] DEFAULT '{}',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Row Level Security Policies

-- Users can read all users but only update their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects: Clients can only see their projects, PMs and Admins can see all
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients see own projects" ON public.projects FOR SELECT USING (
    client_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.project_team pt WHERE pt.project_id = id AND pt.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

CREATE POLICY "Admins and PMs can create projects" ON public.projects FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

CREATE POLICY "Admins and PMs can update projects" ON public.projects FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

-- Project team access
ALTER TABLE public.project_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members can view team" ON public.project_team FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

-- Deliverables: Team members and clients can see project deliverables
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project stakeholders can view deliverables" ON public.deliverables FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR
            EXISTS (SELECT 1 FROM public.project_team pt WHERE pt.project_id = p.id AND pt.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
        )
    )
);

CREATE POLICY "Team members can create deliverables" ON public.deliverables FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

CREATE POLICY "Team members can update deliverables" ON public.deliverables FOR UPDATE USING (
    assignee_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
);

-- Versions: Same as deliverables
ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project stakeholders can view versions" ON public.versions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.deliverables d 
        JOIN public.projects p ON d.project_id = p.id
        WHERE d.id = deliverable_id AND (
            p.client_id = auth.uid() OR
            EXISTS (SELECT 1 FROM public.project_team pt WHERE pt.project_id = p.id AND pt.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
        )
    )
);

-- Activities: Project stakeholders can view
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Project stakeholders can view activities" ON public.activities FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.projects p 
        WHERE p.id = project_id AND (
            p.client_id = auth.uid() OR
            EXISTS (SELECT 1 FROM public.project_team pt WHERE pt.project_id = p.id AND pt.user_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'pm'))
        )
    )
);

-- Notifications: Users can only see their own
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Functions and Triggers

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables that need updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON public.deliverables FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_automation_rules_updated_at BEFORE UPDATE ON public.automation_rules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', 'New User'), 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Storage policies
CREATE POLICY "Users can upload deliverable files" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'deliverables' AND 
    auth.role() = 'authenticated'
);

CREATE POLICY "Project stakeholders can view deliverable files" ON storage.objects FOR SELECT USING (
    bucket_id = 'deliverables' AND 
    auth.role() = 'authenticated'
);

CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (
    bucket_id = 'avatars'
);

-- Indexes for performance
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_deliverables_project_id ON public.deliverables(project_id);
CREATE INDEX idx_deliverables_assignee_id ON public.deliverables(assignee_id);
CREATE INDEX idx_deliverables_status ON public.deliverables(status);
CREATE INDEX idx_versions_deliverable_id ON public.versions(deliverable_id);
CREATE INDEX idx_activities_project_id ON public.activities(project_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_status ON public.notifications(status);
CREATE INDEX idx_approvals_token ON public.approvals(token);
CREATE INDEX idx_approvals_version_id ON public.approvals(version_id);

-- Sample data (optional - for development)
-- Insert sample admin user (you'll need to replace with actual auth.users ID)
-- INSERT INTO public.users (id, email, name, role) VALUES 
-- ('00000000-0000-0000-0000-000000000001', 'admin@nexaflow.com', 'Admin User', 'admin');

COMMIT;