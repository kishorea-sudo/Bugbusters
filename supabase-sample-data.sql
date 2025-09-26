-- Sample Data for NexaFlow Supabase Database
-- Run this in your Supabase SQL Editor after creating the schema

-- First, create some demo users manually in Supabase Auth
-- You'll need to go to Authentication > Users in Supabase dashboard and create these:

-- Admin user: admin@nexaflow.com (password: demo123)
-- PM user: pm@nexaflow.com (password: demo123)  
-- Team members: sarah@nexaflow.com, alex@nexaflow.com (password: demo123)
-- Client: client@nexaflow.com (password: demo123)

-- After creating the auth users, run this script to populate their profiles and sample data

-- =====================================================
-- INSERT SAMPLE PROFILES (Update UUIDs with actual user IDs from auth.users)
-- =====================================================

-- You'll need to replace these UUIDs with the actual user IDs from your Supabase auth.users table
-- Check your auth.users table first: SELECT id, email FROM auth.users;

-- Example profile inserts (replace UUIDs with real ones from your auth.users)
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@nexaflow.com', 'John', 'Smith', 'admin', '+1-555-0101', 'Management', ARRAY['Leadership', 'Strategy', 'Project Management']),
('00000000-0000-0000-0000-000000000002', 'pm@nexaflow.com', 'Mike', 'Johnson', 'project_manager', '+1-555-0102', 'Project Management', ARRAY['Agile', 'Scrum', 'Team Leadership']),
('00000000-0000-0000-0000-000000000003', 'sarah@nexaflow.com', 'Sarah', 'Wilson', 'team_member', '+1-555-0104', 'Engineering', ARRAY['React', 'TypeScript', 'Node.js']),
('00000000-0000-0000-0000-000000000004', 'alex@nexaflow.com', 'Alex', 'Chen', 'team_member', '+1-555-0105', 'Engineering', ARRAY['Python', 'Django', 'REST APIs']),
('00000000-0000-0000-0000-000000000005', 'client@nexaflow.com', 'Robert', 'Taylor', 'client', '+1-555-0108', 'Business', ARRAY['Business Analysis']);

-- =====================================================
-- INSERT SAMPLE CLIENTS
-- =====================================================

INSERT INTO public.clients (id, name, company, industry, contact_email, contact_phone) VALUES
('11111111-1111-1111-1111-111111111111', 'Robert Taylor', 'TechCorp Solutions', 'Technology', 'robert.taylor@techcorp.com', '+1-555-0201'),
('22222222-2222-2222-2222-222222222222', 'Emily Brown', 'StartupCo Inc', 'E-commerce', 'emily.brown@startupco.com', '+1-555-0202'),
('33333333-3333-3333-3333-333333333333', 'Global Enterprises', 'Global Enterprises Ltd', 'Manufacturing', 'contact@globalent.com', '+1-555-0203');

-- =====================================================
-- INSERT SAMPLE PROJECTS
-- =====================================================

INSERT INTO public.projects (id, name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget, actual_cost, progress) VALUES
('44444444-4444-4444-4444-444444444444', 'E-commerce Platform Redesign', 'Complete redesign and development of the client''s e-commerce platform with modern UI/UX', '11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 'active', 'high', '2024-01-15', '2024-06-15', 125000.00, 45000.00, 65),
('55555555-5555-5555-5555-555555555555', 'Mobile App Development', 'Native mobile application for iOS and Android with real-time features', '22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000002', 'active', 'medium', '2024-02-01', '2024-08-01', 85000.00, 25000.00, 40),
('66666666-6666-6666-6666-666666666666', 'Enterprise Dashboard', 'Business intelligence dashboard with advanced analytics', '33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000002', 'planning', 'medium', '2024-03-01', '2024-09-01', 95000.00, 5000.00, 10);

-- =====================================================
-- INSERT PROJECT TEAMS
-- =====================================================

INSERT INTO public.project_teams (project_id, user_id, role_in_project) VALUES
-- E-commerce Platform Team
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000003', 'Frontend Developer'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', 'Backend Developer'),

-- Mobile App Team  
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000003', 'React Native Developer'),
('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000004', 'Backend Developer'),

-- Enterprise Dashboard Team
('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000004', 'Full Stack Developer');

-- =====================================================
-- INSERT SAMPLE TASKS
-- =====================================================

INSERT INTO public.tasks (id, title, description, project_id, assignee_id, created_by, status, priority, estimated_hours, actual_hours, due_date, tags) VALUES
-- E-commerce Platform Tasks
('77777777-7777-7777-7777-777777777777', 'Design Product Catalog UI', 'Create modern, responsive product catalog interface with search and filtering', '44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'completed', 'high', 40, 38, '2024-02-15 17:00:00+00', ARRAY['ui', 'design', 'catalog']),
('88888888-8888-8888-8888-888888888888', 'Implement Product API', 'Develop RESTful API endpoints for product management and search', '44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'in_progress', 'high', 65, 32, '2024-03-01 17:00:00+00', ARRAY['api', 'backend', 'database']),
('99999999-9999-9999-9999-999999999999', 'Shopping Cart Frontend', 'Build interactive shopping cart with add/remove items functionality', '44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'in_progress', 'medium', 25, 15, '2024-03-15 17:00:00+00', ARRAY['frontend', 'cart', 'react']),

-- Mobile App Tasks
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'User Authentication Flow', 'Implement login, registration, and password reset for mobile app', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'completed', 'high', 30, 28, '2024-02-20 17:00:00+00', ARRAY['auth', 'mobile', 'security']),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Push Notification Service', 'Set up Firebase push notifications with custom targeting', '55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000002', 'in_progress', 'medium', 20, 12, '2024-03-30 17:00:00+00', ARRAY['notifications', 'firebase', 'backend']);

-- =====================================================
-- INSERT SAMPLE COMMENTS
-- =====================================================

INSERT INTO public.comments (id, content, author_id, task_id, is_internal) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Great work on the product catalog design! The search functionality looks intuitive.', '00000000-0000-0000-0000-000000000002', '77777777-7777-7777-7777-777777777777', false),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'The API endpoints are coming along well. I''ve implemented the core CRUD operations.', '00000000-0000-0000-0000-000000000004', '88888888-8888-8888-8888-888888888888', false),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Shopping cart component is 60% complete. Working on quantity updates next.', '00000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999999', false);

-- =====================================================
-- INSERT SAMPLE NOTIFICATIONS
-- =====================================================

INSERT INTO public.notifications (user_id, title, message, type, related_entity_type, related_entity_id) VALUES
-- Sarah Wilson notifications
('00000000-0000-0000-0000-000000000003', 'New Task Assigned', 'You have been assigned to "Shopping Cart Frontend"', 'task_assigned', 'task', '99999999-9999-9999-9999-999999999999'),
('00000000-0000-0000-0000-000000000003', 'Deadline Approaching', 'Task "Shopping Cart Frontend" is due in 3 days', 'deadline_approaching', 'task', '99999999-9999-9999-9999-999999999999'),

-- Alex Chen notifications  
('00000000-0000-0000-0000-000000000004', 'Comment Added', 'Mike Johnson commented on "Implement Product API"', 'comment_added', 'task', '88888888-8888-8888-8888-888888888888'),
('00000000-0000-0000-0000-000000000004', 'Task Completed', 'User Authentication Flow has been marked as completed', 'task_completed', 'task', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

-- =====================================================
-- INSERT SAMPLE TIME LOGS
-- =====================================================

INSERT INTO public.time_logs (user_id, task_id, project_id, hours_logged, description, log_date, billable, hourly_rate) VALUES
-- Sarah Wilson time logs
('00000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 4.5, 'Implemented cart state management and item addition logic', '2024-02-26', true, 85.00),
('00000000-0000-0000-0000-000000000003', '99999999-9999-9999-9999-999999999999', '44444444-4444-4444-4444-444444444444', 3.0, 'Created cart component UI and basic styling', '2024-02-27', true, 85.00),

-- Alex Chen time logs
('00000000-0000-0000-0000-000000000004', '88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', 8.0, 'Built product CRUD API endpoints with validation', '2024-02-25', true, 90.00),
('00000000-0000-0000-0000-000000000004', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555', 4.0, 'Set up Firebase push notification service', '2024-02-28', true, 90.00);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that data was inserted correctly
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'clients', COUNT(*) FROM public.clients  
UNION ALL
SELECT 'projects', COUNT(*) FROM public.projects
UNION ALL
SELECT 'tasks', COUNT(*) FROM public.tasks
UNION ALL
SELECT 'comments', COUNT(*) FROM public.comments
UNION ALL  
SELECT 'notifications', COUNT(*) FROM public.notifications
UNION ALL
SELECT 'time_logs', COUNT(*) FROM public.time_logs;

-- Test a simple join to verify relationships
SELECT 
    p.name as project_name,
    c.company as client_company,
    CONCAT(pm.first_name, ' ', pm.last_name) as project_manager,
    COUNT(t.id) as task_count
FROM projects p
LEFT JOIN clients c ON p.client_id = c.id
LEFT JOIN profiles pm ON p.project_manager_id = pm.id  
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name, c.company, pm.first_name, pm.last_name
ORDER BY p.created_at;