-- NexaFlow Supabase Database Schema (Optimized)
-- Copy and paste this into your Supabase SQL Editor and run it

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text NOT NULL,
    first_name text,
    last_name text,
    role text CHECK (role IN ('admin', 'project_manager', 'team_member', 'client')) DEFAULT 'team_member',
    avatar_url text,
    phone text,
    department text,
    skills text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- CLIENTS TABLE
-- =====================================================
CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    company text NOT NULL,
    industry text,
    contact_email text NOT NULL,
    contact_phone text,
    address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE public.projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    project_manager_id uuid REFERENCES public.profiles(id),
    status text CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')) DEFAULT 'planning',
    priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    start_date date,
    end_date date,
    budget decimal(12,2),
    actual_cost decimal(12,2) DEFAULT 0,
    progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PROJECT TEAMS TABLE
-- =====================================================
CREATE TABLE public.project_teams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role_in_project text,
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

-- =====================================================
-- TASKS TABLE
-- =====================================================
CREATE TABLE public.tasks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    assignee_id uuid REFERENCES public.profiles(id),
    created_by uuid REFERENCES public.profiles(id) NOT NULL,
    status text CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')) DEFAULT 'todo',
    priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    estimated_hours decimal(5,2),
    actual_hours decimal(5,2) DEFAULT 0,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- COMMENTS TABLE
-- =====================================================
CREATE TABLE public.comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    content text NOT NULL,
    author_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    is_internal boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TIME LOGS TABLE
-- =====================================================
CREATE TABLE public.time_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    hours_logged decimal(5,2) NOT NULL CHECK (hours_logged > 0),
    description text,
    log_date date DEFAULT CURRENT_DATE,
    billable boolean DEFAULT true,
    hourly_rate decimal(8,2),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================
CREATE TABLE public.documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    file_path text NOT NULL,
    file_size bigint,
    mime_type text,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
    task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
    uploaded_by uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text CHECK (type IN ('info', 'success', 'warning', 'error', 'task_assigned', 'task_completed', 'comment_added', 'deadline_approaching')),
    read boolean DEFAULT false,
    related_entity_type text,
    related_entity_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- PROJECT MILESTONES TABLE
-- =====================================================
CREATE TABLE public.project_milestones (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    due_date date NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TASK DEPENDENCIES TABLE
-- =====================================================
CREATE TABLE public.task_dependencies (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    depends_on_task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(task_id, depends_on_task_id)
);

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE public.activity_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    old_values jsonb,
    new_values jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Projects indexes
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_manager ON public.projects(project_manager_id);
CREATE INDEX idx_projects_status ON public.projects(status);

-- Tasks indexes
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- Time logs indexes
CREATE INDEX idx_time_logs_user ON public.time_logs(user_id);
CREATE INDEX idx_time_logs_task ON public.time_logs(task_id);
CREATE INDEX idx_time_logs_project ON public.time_logs(project_id);
CREATE INDEX idx_time_logs_date ON public.time_logs(log_date);

-- Comments indexes
CREATE INDEX idx_comments_task ON public.comments(task_id);
CREATE INDEX idx_comments_project ON public.comments(project_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admins and PMs can view all profiles
CREATE POLICY "Admins and PMs can view all profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'project_manager')
        )
    );

-- =====================================================
-- CLIENTS POLICIES
-- =====================================================

-- Admins and PMs can manage clients
CREATE POLICY "Admins and PMs can manage clients" ON public.clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'project_manager')
        )
    );

-- =====================================================
-- PROJECTS POLICIES
-- =====================================================

-- Users can view projects they're assigned to
CREATE POLICY "Users can view assigned projects" ON public.projects
    FOR SELECT USING (
        -- Admins see all
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR
        -- PMs see projects they manage
        project_manager_id = auth.uid()
        OR
        -- Team members see projects they're on
        EXISTS (
            SELECT 1 FROM public.project_teams 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
        OR
        -- Clients see their projects
        EXISTS (
            SELECT 1 FROM public.profiles p
            JOIN public.clients c ON c.contact_email = p.email
            WHERE p.id = auth.uid() 
            AND p.role = 'client' 
            AND c.id = projects.client_id
        )
    );

-- Admins and PMs can manage projects
CREATE POLICY "Admins and PMs can manage projects" ON public.projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'project_manager')
        )
    );

-- =====================================================
-- TASKS POLICIES
-- =====================================================

-- Users can view tasks on their projects
CREATE POLICY "Users can view project tasks" ON public.tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = tasks.project_id
            AND (
                -- Admin sees all
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
                OR
                -- PM sees projects they manage
                project_manager_id = auth.uid()
                OR
                -- Team members see project tasks
                EXISTS (
                    SELECT 1 FROM public.project_teams 
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
                OR
                -- Task assignee can see their tasks
                tasks.assignee_id = auth.uid()
            )
        )
    );

-- Team members and above can create/update tasks on their projects
CREATE POLICY "Team members can manage tasks" ON public.tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'project_manager', 'team_member')
        )
        AND
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = tasks.project_id
            AND (
                project_manager_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.project_teams 
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

-- =====================================================
-- OTHER TABLE POLICIES (Similar Pattern)
-- =====================================================

-- Time logs: Users can manage their own logs on accessible projects
CREATE POLICY "Users manage own time logs" ON public.time_logs
    FOR ALL USING (
        user_id = auth.uid()
        AND
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = time_logs.project_id
            AND (
                project_manager_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.project_teams 
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

-- Comments: Users can manage comments on accessible tasks/projects
CREATE POLICY "Users manage comments on accessible items" ON public.comments
    FOR ALL USING (
        author_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'project_manager')
        )
    );

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users see own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Documents: Based on project access
CREATE POLICY "Users access project documents" ON public.documents
    FOR SELECT USING (
        is_public = true
        OR
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = documents.project_id
            AND (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                )
                OR
                project_manager_id = auth.uid()
                OR
                EXISTS (
                    SELECT 1 FROM public.project_teams 
                    WHERE project_id = projects.id AND user_id = auth.uid()
                )
            )
        )
    );

-- =====================================================
-- FUNCTIONS FOR AUTOMATIC PROFILE CREATION
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (new.id, new.email, '', '');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

-- If you see this message, the schema was created successfully!
DO $$
BEGIN
    RAISE NOTICE 'NexaFlow database schema created successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create demo users in Authentication > Users';
    RAISE NOTICE '2. Run the sample data script';  
    RAISE NOTICE '3. Test your application!';
END $$;