-- =====================================================
-- COMPLETE PRODUCTION SETUP WITH 8 TEAM MEMBERS
-- =====================================================

-- Step 1: Clear ALL existing demo data
DELETE FROM public.notifications;
DELETE FROM public.comments;
DELETE FROM public.time_logs;
DELETE FROM public.task_dependencies;
DELETE FROM public.tasks;
DELETE FROM public.project_teams;
DELETE FROM public.projects;
DELETE FROM public.clients;
DELETE FROM public.profiles;

-- =====================================================
-- Step 2: CREATE THE 8 PRODUCTION USERS IN SUPABASE AUTH
-- =====================================================

/*
CRITICAL: Create these users FIRST in Supabase Authentication Dashboard
(Authentication > Users > Add User)

1. admin@nexaflow.com         (Password: NexaFlow2025!Admin)
2. pm@nexaflow.com           (Password: NexaFlow2025!PM)
3. senior.dev@nexaflow.com   (Password: NexaFlow2025!Senior)
4. frontend.dev@nexaflow.com (Password: NexaFlow2025!Frontend)
5. backend.dev@nexaflow.com  (Password: NexaFlow2025!Backend)  
6. designer@nexaflow.com     (Password: NexaFlow2025!Design)
7. qa@nexaflow.com          (Password: NexaFlow2025!QA)
8. devops@nexaflow.com      (Password: NexaFlow2025!DevOps)

After creating users, get their UUIDs by running:
SELECT id, email FROM auth.users ORDER BY email;

Then replace the UUIDs below with the actual values.
*/

-- =====================================================
-- Step 3: CREATE USER PROFILES (Replace UUIDs)
-- =====================================================

-- Get UUIDs first: SELECT id, email FROM auth.users ORDER BY email;

-- 1. Admin User
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('ADMIN_UUID', 'admin@nexaflow.com', 'System', 'Administrator', 'admin', '+1-555-0001', 'Management', 
 ARRAY['Leadership', 'Project Management', 'Strategy', 'Team Building'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW());

-- 2. Project Manager
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('PM_UUID', 'pm@nexaflow.com', 'Project', 'Manager', 'project_manager', '+1-555-0002', 'Project Management', 
 ARRAY['Agile', 'Scrum', 'Team Leadership', 'Risk Management', 'Client Communication'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=pm', NOW());

-- 3. Senior Developer
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('SENIOR_UUID', 'senior.dev@nexaflow.com', 'Senior', 'Developer', 'team_member', '+1-555-0003', 'Engineering', 
 ARRAY['Full Stack', 'Architecture', 'Mentoring', 'Code Review', 'System Design'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=senior', NOW());

-- 4. Frontend Developer
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('FRONTEND_UUID', 'frontend.dev@nexaflow.com', 'Frontend', 'Developer', 'team_member', '+1-555-0004', 'Engineering', 
 ARRAY['React', 'TypeScript', 'CSS', 'JavaScript', 'UI Development'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=frontend', NOW());

-- 5. Backend Developer  
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('BACKEND_UUID', 'backend.dev@nexaflow.com', 'Backend', 'Developer', 'team_member', '+1-555-0005', 'Engineering', 
 ARRAY['Node.js', 'PostgreSQL', 'API Design', 'Database', 'Server Architecture'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=backend', NOW());

-- 6. UI/UX Designer
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('DESIGNER_UUID', 'designer@nexaflow.com', 'UI/UX', 'Designer', 'team_member', '+1-555-0006', 'Design', 
 ARRAY['Figma', 'User Experience', 'Prototyping', 'Design Systems', 'User Research'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=designer', NOW());

-- 7. QA Engineer
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('QA_UUID', 'qa@nexaflow.com', 'QA', 'Engineer', 'team_member', '+1-555-0007', 'Quality Assurance', 
 ARRAY['Testing', 'Automation', 'Bug Tracking', 'Quality Control', 'Test Planning'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=qa', NOW());

-- 8. DevOps Engineer
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, avatar_url, created_at) VALUES 
('DEVOPS_UUID', 'devops@nexaflow.com', 'DevOps', 'Engineer', 'team_member', '+1-555-0008', 'Infrastructure', 
 ARRAY['Docker', 'CI/CD', 'AWS', 'Monitoring', 'Infrastructure as Code'], 
 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops', NOW());

-- =====================================================
-- Step 4: CREATE REAL CLIENT COMPANIES
-- =====================================================

INSERT INTO public.clients (id, name, company, industry, contact_email, contact_phone, address, created_at) VALUES 
('client-1', 'Sarah Johnson', 'TechStart Solutions', 'Technology Consulting', 'sarah.johnson@techstart.com', '+1-555-1001', '123 Innovation Drive, Silicon Valley, CA 94025', NOW()),
('client-2', 'Michael Chen', 'Global Retail Corp', 'E-commerce & Retail', 'michael.chen@globalretail.com', '+1-555-1002', '456 Commerce Street, New York, NY 10001', NOW()),
('client-3', 'Emily Rodriguez', 'HealthCare Plus', 'Healthcare Technology', 'emily.rodriguez@healthcareplus.com', '+1-555-1003', '789 Medical Center Blvd, Austin, TX 73301', NOW()),
('client-4', 'David Kim', 'FinanceFlow Inc', 'Financial Services', 'david.kim@financeflow.com', '+1-555-1004', '321 Wall Street, New York, NY 10005', NOW()),
('client-5', 'Lisa Thompson', 'EduTech Academy', 'Education Technology', 'lisa.thompson@edutech.com', '+1-555-1005', '654 University Ave, Boston, MA 02115', NOW());

-- =====================================================
-- Step 5: ADMIN CREATES PROJECTS & ASSIGNS TO PM
-- =====================================================

INSERT INTO public.projects (id, name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget, created_at) VALUES 
('project-1', 'Enterprise Web Platform', 'Complete web application with user management, dashboard, and reporting capabilities', 'client-1', 'PM_UUID', 'active', 'high', '2025-09-26', '2025-12-15', 150000.00, NOW()),
('project-2', 'Mobile E-commerce App', 'iOS and Android mobile application with payment integration and inventory management', 'client-2', 'PM_UUID', 'active', 'high', '2025-10-01', '2026-01-31', 200000.00, NOW()),
('project-3', 'Healthcare Management System', 'Patient management system with appointment scheduling and medical records', 'client-3', 'PM_UUID', 'planning', 'medium', '2025-10-15', '2026-03-15', 180000.00, NOW()),
('project-4', 'Financial Analytics Dashboard', 'Real-time financial data visualization and reporting dashboard', 'client-4', 'PM_UUID', 'planning', 'medium', '2025-11-01', '2026-02-28', 120000.00, NOW()),
('project-5', 'Educational Learning Platform', 'Online learning platform with course management and student progress tracking', 'client-5', 'PM_UUID', 'planning', 'low', '2025-11-15', '2026-04-30', 100000.00, NOW());

-- =====================================================
-- Step 6: ADMIN ASSIGNS TEAM MEMBERS TO PROJECTS (By COMPLEXITY)
-- =====================================================

-- Enterprise Web Platform (Complex - 5 members)
INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES 
('project-1', 'SENIOR_UUID', 'Senior Developer & Tech Lead', NOW()),
('project-1', 'FRONTEND_UUID', 'Frontend Developer', NOW()),
('project-1', 'BACKEND_UUID', 'Backend Developer', NOW()),
('project-1', 'DESIGNER_UUID', 'UI/UX Designer', NOW()),
('project-1', 'QA_UUID', 'QA Engineer', NOW());

-- Mobile E-commerce App (Complex - 4 members)
INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES 
('project-2', 'SENIOR_UUID', 'Mobile App Lead Developer', NOW()),
('project-2', 'FRONTEND_UUID', 'React Native Developer', NOW()),
('project-2', 'BACKEND_UUID', 'API Backend Developer', NOW()),
('project-2', 'DEVOPS_UUID', 'DevOps Engineer', NOW());

-- Healthcare Management System (Medium - 3 members)
INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES 
('project-3', 'BACKEND_UUID', 'Backend Lead Developer', NOW()),
('project-3', 'FRONTEND_UUID', 'Frontend Developer', NOW()),
('project-3', 'QA_UUID', 'QA Engineer', NOW());

-- Financial Analytics Dashboard (Medium - 2 members)  
INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES 
('project-4', 'SENIOR_UUID', 'Full Stack Developer', NOW()),
('project-4', 'DESIGNER_UUID', 'Data Visualization Designer', NOW());

-- Educational Learning Platform (Simple - 2 members)
INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES 
('project-5', 'FRONTEND_UUID', 'Frontend Developer', NOW()),
('project-5', 'BACKEND_UUID', 'Backend Developer', NOW());

-- =====================================================
-- Step 7: PM BREAKS DOWN PROJECTS INTO TASKS & ASSIGNS TO TEAM MEMBERS
-- =====================================================

-- Enterprise Web Platform Tasks
INSERT INTO public.tasks (id, title, description, project_id, assignee_id, created_by, status, priority, estimated_hours, due_date, created_at) VALUES 
('task-1', 'Project Setup & Architecture', 'Set up development environment, project structure, and define technical architecture', 'project-1', 'SENIOR_UUID', 'PM_UUID', 'in_progress', 'high', 16, '2025-09-30', NOW()),
('task-2', 'Database Design & Implementation', 'Design and implement the database schema with relationships and indexes', 'project-1', 'BACKEND_UUID', 'PM_UUID', 'todo', 'high', 24, '2025-10-05', NOW()),
('task-3', 'UI/UX Design System', 'Create design system, wireframes, and user interface mockups', 'project-1', 'DESIGNER_UUID', 'PM_UUID', 'in_progress', 'medium', 32, '2025-10-10', NOW()),
('task-4', 'Frontend Component Library', 'Develop reusable React components based on design system', 'project-1', 'FRONTEND_UUID', 'PM_UUID', 'todo', 'medium', 40, '2025-10-15', NOW()),
('task-5', 'Quality Assurance Planning', 'Create comprehensive testing strategy and test cases', 'project-1', 'QA_UUID', 'PM_UUID', 'todo', 'medium', 20, '2025-10-12', NOW()),

-- Mobile E-commerce App Tasks  
('task-6', 'Mobile App Architecture', 'Define React Native architecture and navigation structure', 'project-2', 'SENIOR_UUID', 'PM_UUID', 'todo', 'high', 20, '2025-10-05', NOW()),
('task-7', 'Payment Integration API', 'Implement secure payment processing and API endpoints', 'project-2', 'BACKEND_UUID', 'PM_UUID', 'todo', 'high', 32, '2025-10-12', NOW()),
('task-8', 'Mobile UI Development', 'Develop mobile-responsive user interface components', 'project-2', 'FRONTEND_UUID', 'PM_UUID', 'todo', 'medium', 48, '2025-10-20', NOW()),
('task-9', 'CI/CD Pipeline Setup', 'Set up automated testing and deployment pipeline', 'project-2', 'DEVOPS_UUID', 'PM_UUID', 'todo', 'medium', 16, '2025-10-08', NOW()),

-- Healthcare Management System Tasks
('task-10', 'Patient Data API', 'Develop secure API for patient data management', 'project-3', 'BACKEND_UUID', 'PM_UUID', 'todo', 'high', 28, '2025-10-22', NOW()),
('task-11', 'Appointment Scheduling UI', 'Create appointment booking and management interface', 'project-3', 'FRONTEND_UUID', 'PM_UUID', 'todo', 'medium', 24, '2025-10-25', NOW()),
('task-12', 'Security & Compliance Testing', 'Ensure HIPAA compliance and security testing', 'project-3', 'QA_UUID', 'PM_UUID', 'todo', 'high', 20, '2025-10-30', NOW()),

-- Financial Analytics Dashboard Tasks
('task-13', 'Real-time Data Processing', 'Implement real-time financial data processing system', 'project-4', 'SENIOR_UUID', 'PM_UUID', 'todo', 'high', 36, '2025-11-10', NOW()),
('task-14', 'Data Visualization Components', 'Design and implement interactive charts and graphs', 'project-4', 'DESIGNER_UUID', 'PM_UUID', 'todo', 'medium', 28, '2025-11-15', NOW'),

-- Educational Learning Platform Tasks
('task-15', 'Course Management Backend', 'Develop API for course creation and management', 'project-5', 'BACKEND_UUID', 'PM_UUID', 'todo', 'medium', 32, '2025-11-25', NOW()),
('task-16', 'Student Progress Frontend', 'Create student dashboard and progress tracking UI', 'project-5', 'FRONTEND_UUID', 'PM_UUID', 'todo', 'medium', 28, '2025-11-30', NOW());

-- =====================================================
-- Step 8: ADD SOME INITIAL NOTIFICATIONS FOR WORKFLOW
-- =====================================================

INSERT INTO public.notifications (id, user_id, title, message, type, project_id, task_id, is_read, created_at) VALUES 
('notif-1', 'PM_UUID', 'New Project Assignment', 'You have been assigned as Project Manager for Enterprise Web Platform', 'project_assignment', 'project-1', NULL, false, NOW()),
('notif-2', 'PM_UUID', 'New Project Assignment', 'You have been assigned as Project Manager for Mobile E-commerce App', 'project_assignment', 'project-2', NULL, false, NOW()),
('notif-3', 'SENIOR_UUID', 'New Task Assignment', 'You have been assigned: Project Setup & Architecture', 'task_assignment', 'project-1', 'task-1', false, NOW()),
('notif-4', 'BACKEND_UUID', 'New Task Assignment', 'You have been assigned: Database Design & Implementation', 'task_assignment', 'project-1', 'task-2', false, NOW()),
('notif-5', 'DESIGNER_UUID', 'New Task Assignment', 'You have been assigned: UI/UX Design System', 'task_assignment', 'project-1', 'task-3', false, NOW()),
('notif-6', 'FRONTEND_UUID', 'New Task Assignment', 'You have been assigned: Frontend Component Library', 'task_assignment', 'project-1', 'task-4', false, NOW()),
('notif-7', 'QA_UUID', 'New Task Assignment', 'You have been assigned: Quality Assurance Planning', 'task_assignment', 'project-1', 'task-5', false, NOW());

-- =====================================================
-- Step 9: VERIFICATION QUERIES
-- =====================================================

-- Check all users in login order
SELECT 
    p.email, 
    p.first_name || ' ' || p.last_name as full_name, 
    p.role, 
    p.department 
FROM public.profiles p 
ORDER BY 
    CASE p.role 
        WHEN 'admin' THEN 1 
        WHEN 'project_manager' THEN 2 
        WHEN 'team_member' THEN 3 
    END, 
    p.email;

-- Check admin → PM → team workflow
SELECT 
    'ADMIN CREATES PROJECT' as step,
    p.name as project_name,
    c.company as client,
    pm.first_name || ' ' || pm.last_name as assigned_pm,
    p.status,
    p.priority
FROM public.projects p
JOIN public.clients c ON p.client_id = c.id
JOIN public.profiles pm ON p.project_manager_id = pm.id
ORDER BY p.created_at;

-- Check team assignments by project complexity
SELECT 
    p.name as project,
    COUNT(pt.user_id) as team_size,
    STRING_AGG(pr.first_name || ' ' || pr.last_name || ' (' || pt.role_in_project || ')', ', ') as team_members
FROM public.projects p
LEFT JOIN public.project_teams pt ON p.id = pt.project_id
LEFT JOIN public.profiles pr ON pt.user_id = pr.id
GROUP BY p.id, p.name
ORDER BY team_size DESC;

-- Check PM task assignments to team members  
SELECT 
    p.name as project,
    t.title as task,
    assignee.first_name || ' ' || assignee.last_name as assigned_to,
    assignee.department,
    t.status,
    t.priority,
    t.due_date
FROM public.tasks t
JOIN public.projects p ON t.project_id = p.id
JOIN public.profiles assignee ON t.assignee_id = assignee.id
JOIN public.profiles creator ON t.created_by = creator.id
WHERE creator.role = 'project_manager'
ORDER BY p.name, t.created_at;

-- Check notification flow
SELECT 
    pr.email as user_email,
    pr.role,
    n.type,
    n.title,
    n.message
FROM public.notifications n
JOIN public.profiles pr ON n.user_id = pr.id
ORDER BY n.created_at;

-- =====================================================
-- WORKFLOW SUMMARY
-- =====================================================

/*
✅ COMPLETE WORKFLOW IMPLEMENTED:

1. ADMIN LEVEL:
   - Creates 5 projects for different clients
   - Assigns ALL projects to the PM  
   - Assigns team members to projects based on complexity:
     * Complex projects: 4-5 team members
     * Medium projects: 2-3 team members  
     * Simple projects: 2 team members

2. PM LEVEL:
   - Receives project assignments from admin
   - Sees all assigned projects in PM dashboard
   - Breaks down projects into specific tasks
   - Assigns tasks to appropriate team members based on skills
   - Manages team workload and task distribution

3. TEAM MEMBER LEVEL:
   - Each member sees only THEIR assigned tasks in dashboard
   - Tasks are properly isolated (no cross-member visibility)
   - Clear task assignments from PM with descriptions and deadlines
   - Proper notification system for task assignments

4. CLIENT LEVEL:
   - Projects created for real client companies
   - Clear client contact information and project scope

🔄 LOGIN ORDER (appears everywhere):
1. admin@nexaflow.com         (System Administrator)  
2. pm@nexaflow.com           (Project Manager)
3. senior.dev@nexaflow.com   (Senior Developer)
4. frontend.dev@nexaflow.com (Frontend Developer)  
5. backend.dev@nexaflow.com  (Backend Developer)
6. designer@nexaflow.com     (UI/UX Designer)
7. qa@nexaflow.com          (QA Engineer)
8. devops@nexaflow.com      (DevOps Engineer)

📋 NEXT STEPS:
1. Create the 8 users in Supabase Auth Dashboard
2. Get their UUIDs and replace placeholders in this script
3. Run this script in Supabase SQL Editor  
4. Test login and workflow at http://localhost:5174
5. Verify proper data isolation and task assignment flow
*/