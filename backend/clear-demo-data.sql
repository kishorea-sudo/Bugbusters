-- NexaFlow Production Database - Clean Start
-- Run this in your Supabase SQL Editor to clear demo data and start fresh

-- =====================================================
-- CLEAR EXISTING DEMO DATA (Run this first)
-- =====================================================

-- Clear all sample/demo data from tables (in correct order due to foreign key constraints)
DELETE FROM public.activity_logs;
DELETE FROM public.task_dependencies; 
DELETE FROM public.project_milestones;
DELETE FROM public.notifications;
DELETE FROM public.documents;
DELETE FROM public.time_logs;
DELETE FROM public.comments;
DELETE FROM public.tasks;
DELETE FROM public.project_teams;
DELETE FROM public.projects;
DELETE FROM public.clients;
DELETE FROM public.profiles WHERE email LIKE '%@nexaflow.com%' OR email LIKE '%demo%';

-- Reset sequences to start fresh
SELECT setval('profiles_id_seq', 1, false);
-- Note: UUIDs don't use sequences, but if you have any serial columns, reset them here

-- =====================================================
-- PRODUCTION SETUP INSTRUCTIONS
-- =====================================================

/*
Now you're ready to add REAL data to your NexaFlow platform:

1. CREATE REAL USERS IN SUPABASE AUTH:
   - Go to Authentication > Users in your Supabase dashboard
   - Add your actual team members with real email addresses
   - Use strong passwords (not demo123)

2. ADD REAL USER PROFILES:
   After creating auth users, add their profiles:
   
   INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills) VALUES
   ('actual-uuid-from-auth-users', 'john.doe@yourcompany.com', 'John', 'Doe', 'admin', '+1-555-1234', 'Management', ARRAY['Leadership', 'Strategy']),
   ('actual-uuid-from-auth-users', 'jane.smith@yourcompany.com', 'Jane', 'Smith', 'project_manager', '+1-555-5678', 'Project Management', ARRAY['Agile', 'Scrum']);

3. ADD REAL CLIENTS:
   
   INSERT INTO public.clients (name, company, industry, contact_email, contact_phone) VALUES
   ('Client Name', 'Client Company Inc', 'Technology', 'contact@clientcompany.com', '+1-555-9999'),
   ('Another Client', 'Another Company LLC', 'Healthcare', 'info@anothercompany.com', '+1-555-8888');

4. CREATE REAL PROJECTS:
   
   INSERT INTO public.projects (name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget) VALUES
   ('Real Project Name', 'Actual project description', 'client-uuid', 'pm-uuid', 'planning', 'high', '2025-10-01', '2026-03-01', 50000.00);

5. ASSIGN REAL TEAM MEMBERS:
   
   INSERT INTO public.project_teams (project_id, user_id, role_in_project) VALUES
   ('project-uuid', 'team-member-uuid', 'Frontend Developer'),
   ('project-uuid', 'another-member-uuid', 'Backend Developer');

6. CREATE REAL TASKS:
   
   INSERT INTO public.tasks (title, description, project_id, assignee_id, created_by, status, priority, due_date) VALUES
   ('Real Task Title', 'Actual task description', 'project-uuid', 'assignee-uuid', 'creator-uuid', 'todo', 'high', '2025-10-15');
*/

-- =====================================================
-- HELPER QUERIES FOR PRODUCTION SETUP
-- =====================================================

-- Check current auth users (to get UUIDs for profiles)
-- SELECT id, email FROM auth.users ORDER BY created_at;

-- Verify profiles are created correctly
-- SELECT id, email, first_name, last_name, role FROM public.profiles ORDER BY created_at;

-- Check clients
-- SELECT id, name, company, contact_email FROM public.clients ORDER BY created_at;

-- Verify projects
-- SELECT p.id, p.name, c.company as client, pr.first_name || ' ' || pr.last_name as project_manager 
-- FROM public.projects p
-- LEFT JOIN public.clients c ON p.client_id = c.id
-- LEFT JOIN public.profiles pr ON p.project_manager_id = pr.id
-- ORDER BY p.created_at;

-- =====================================================
-- PRODUCTION DATA TEMPLATES
-- =====================================================

-- Template for adding a new user profile (after creating in Supabase Auth):
/*
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills) VALUES
('UUID_FROM_AUTH_USERS', 'user@yourcompany.com', 'First', 'Last', 'role', 'phone', 'department', ARRAY['skill1', 'skill2']);

Roles can be: 'admin', 'project_manager', 'team_member', 'client'
*/

-- Template for adding a new client:
/*
INSERT INTO public.clients (name, company, industry, contact_email, contact_phone, address) VALUES
('Contact Name', 'Company Name', 'Industry', 'email@company.com', '+1-555-0000', 'Company Address');
*/

-- Template for creating a new project:
/*
INSERT INTO public.projects (name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget) VALUES
('Project Name', 'Project Description', 'CLIENT_UUID', 'PM_UUID', 'planning', 'medium', 'YYYY-MM-DD', 'YYYY-MM-DD', 0.00);

Status options: 'planning', 'active', 'on_hold', 'completed', 'cancelled'
Priority options: 'low', 'medium', 'high', 'urgent'
*/

-- Template for assigning team members to project:
/*
INSERT INTO public.project_teams (project_id, user_id, role_in_project) VALUES
('PROJECT_UUID', 'USER_UUID', 'Role Description');
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these after adding real data to verify everything is working:

-- Count records in each table
SELECT 
    'profiles' as table_name, COUNT(*) as records FROM public.profiles
UNION ALL
SELECT 'clients', COUNT(*) FROM public.clients
UNION ALL  
SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL
SELECT 'project_teams', COUNT(*) FROM public.project_teams
UNION ALL
SELECT 'tasks', COUNT(*) FROM public.tasks;

-- Check data relationships
SELECT 
    p.name as project,
    c.company as client,
    CONCAT(pm.first_name, ' ', pm.last_name) as project_manager,
    COUNT(pt.user_id) as team_size
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN profiles pm ON p.project_manager_id = pm.id
LEFT JOIN project_teams pt ON p.id = pt.project_id
GROUP BY p.id, p.name, c.company, pm.first_name, pm.last_name
ORDER BY p.created_at;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Demo data cleared successfully!';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create real users in Supabase Auth > Users';
    RAISE NOTICE '2. Add their profiles using the templates above';
    RAISE NOTICE '3. Create real clients and projects';
    RAISE NOTICE '4. Start using your production NexaFlow platform!';
END $$;