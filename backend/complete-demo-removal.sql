-- =====================================================
-- COMPLETE DEMO DATA REMOVAL & REAL PRODUCTION SETUP
-- =====================================================

-- Step 1: Remove ALL existing demo data
DELETE FROM public.notifications;
DELETE FROM public.comments;
DELETE FROM public.time_logs;
DELETE FROM public.task_dependencies;
DELETE FROM public.tasks;
DELETE FROM public.project_teams;
DELETE FROM public.projects;
DELETE FROM public.clients;
DELETE FROM public.profiles;

-- Note: auth.users will be handled manually in Supabase Auth dashboard

-- =====================================================
-- Step 2: CREATE REAL PRODUCTION USERS (Run in Supabase Auth Dashboard)
-- =====================================================

/*
IMPORTANT: Create these users in Supabase Authentication Dashboard:

1. Admin Account:
   Email: admin@nexaflow.com
   Password: NexaFlow2025!Admin
   Role: Administrator

2. Project Manager:
   Email: pm@nexaflow.com  
   Password: NexaFlow2025!PM
   Role: Project Manager

3. Senior Developer:
   Email: senior.dev@nexaflow.com
   Password: NexaFlow2025!Senior
   Role: Senior Developer

4. Frontend Developer:
   Email: frontend.dev@nexaflow.com
   Password: NexaFlow2025!Frontend
   Role: Frontend Developer

5. Backend Developer:
   Email: backend.dev@nexaflow.com
   Password: NexaFlow2025!Backend
   Role: Backend Developer

6. UI/UX Designer:
   Email: designer@nexaflow.com
   Password: NexaFlow2025!Design
   Role: UI/UX Designer

7. QA Engineer:
   Email: qa@nexaflow.com
   Password: NexaFlow2025!QA
   Role: QA Engineer

8. DevOps Engineer:
   Email: devops@nexaflow.com
   Password: NexaFlow2025!DevOps
   Role: DevOps Engineer

After creating users in Auth dashboard, get their UUIDs by running:
SELECT id, email FROM auth.users ORDER BY email;
*/

-- =====================================================
-- Step 3: INSERT REAL USER PROFILES 
-- =====================================================
-- Replace 'USER_UUID_X' with actual UUIDs from auth.users table

INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills, created_at) VALUES
-- Admin
('USER_UUID_1', 'admin@nexaflow.com', 'System', 'Administrator', 'admin', '+1-555-0001', 'Management', ARRAY['Leadership', 'Project Management', 'Strategy'], NOW()),

-- Project Manager  
('USER_UUID_2', 'pm@nexaflow.com', 'Project', 'Manager', 'project_manager', '+1-555-0002', 'Project Management', ARRAY['Agile', 'Scrum', 'Team Leadership', 'Risk Management'], NOW()),

-- Senior Developer
('USER_UUID_3', 'senior.dev@nexaflow.com', 'Senior', 'Developer', 'team_member', '+1-555-0003', 'Engineering', ARRAY['Full Stack', 'Architecture', 'Mentoring', 'Code Review'], NOW()),

-- Frontend Developer
('USER_UUID_4', 'frontend.dev@nexaflow.com', 'Frontend', 'Developer', 'team_member', '+1-555-0004', 'Engineering', ARRAY['React', 'TypeScript', 'CSS', 'JavaScript'], NOW()),

-- Backend Developer  
('USER_UUID_5', 'backend.dev@nexaflow.com', 'Backend', 'Developer', 'team_member', '+1-555-0005', 'Engineering', ARRAY['Node.js', 'PostgreSQL', 'API Design', 'Database'], NOW()),

-- UI/UX Designer
('USER_UUID_6', 'designer@nexaflow.com', 'UI/UX', 'Designer', 'team_member', '+1-555-0006', 'Design', ARRAY['Figma', 'User Experience', 'Prototyping', 'Design Systems'], NOW()),

-- QA Engineer
('USER_UUID_7', 'qa@nexaflow.com', 'QA', 'Engineer', 'team_member', '+1-555-0007', 'Quality Assurance', ARRAY['Testing', 'Automation', 'Bug Tracking', 'Quality Control'], NOW()),

-- DevOps Engineer
('USER_UUID_8', 'devops@nexaflow.com', 'DevOps', 'Engineer', 'team_member', '+1-555-0008', 'Infrastructure', ARRAY['Docker', 'CI/CD', 'AWS', 'Monitoring'], NOW());

-- =====================================================
-- Step 4: CREATE REAL CLIENT COMPANIES
-- =====================================================

INSERT INTO public.clients (name, company, industry, contact_email, contact_phone, address, created_at) VALUES
('Sarah Johnson', 'TechStart Solutions', 'Technology Consulting', 'sarah.johnson@techstart.com', '+1-555-1001', '123 Innovation Drive, Silicon Valley, CA 94025', NOW()),
('Michael Chen', 'Global Retail Corp', 'E-commerce & Retail', 'michael.chen@globalretail.com', '+1-555-1002', '456 Commerce Street, New York, NY 10001', NOW()),
('Emily Rodriguez', 'HealthCare Plus', 'Healthcare Technology', 'emily.rodriguez@healthcareplus.com', '+1-555-1003', '789 Medical Center Blvd, Austin, TX 73301', NOW()),
('David Kim', 'FinanceFlow Inc', 'Financial Services', 'david.kim@financeflow.com', '+1-555-1004', '321 Wall Street, New York, NY 10005', NOW()),
('Lisa Thompson', 'EduTech Academy', 'Education Technology', 'lisa.thompson@edutech.com', '+1-555-1005', '654 University Ave, Boston, MA 02115', NOW());

-- =====================================================
-- Step 5: CREATE REAL PROJECTS WITH PROPER WORKFLOW
-- =====================================================

INSERT INTO public.projects (name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget, created_at) VALUES
-- Get client and PM IDs first, then replace CLIENT_ID_X and PM_UUID
('Enterprise Web Platform', 'Complete web application with user management, dashboard, and reporting capabilities', 'CLIENT_ID_1', 'USER_UUID_2', 'active', 'high', '2025-09-26', '2025-12-15', 150000.00, NOW()),
('Mobile E-commerce App', 'iOS and Android mobile application with payment integration and inventory management', 'CLIENT_ID_2', 'USER_UUID_2', 'active', 'high', '2025-10-01', '2026-01-31', 200000.00, NOW()),
('Healthcare Management System', 'Patient management system with appointment scheduling and medical records', 'CLIENT_ID_3', 'USER_UUID_2', 'planning', 'medium', '2025-10-15', '2026-03-15', 180000.00, NOW()),
('Financial Analytics Dashboard', 'Real-time financial data visualization and reporting dashboard', 'CLIENT_ID_4', 'USER_UUID_2', 'planning', 'medium', '2025-11-01', '2026-02-28', 120000.00, NOW()),
('Educational Learning Platform', 'Online learning platform with course management and student progress tracking', 'CLIENT_ID_5', 'USER_UUID_2', 'planning', 'low', '2025-11-15', '2026-04-30', 100000.00, NOW());

-- =====================================================
-- Step 6: ASSIGN TEAM MEMBERS TO PROJECTS
-- =====================================================

INSERT INTO public.project_teams (project_id, user_id, role_in_project, created_at) VALUES
-- Enterprise Web Platform Team (Complex project - 5 members)
('PROJECT_ID_1', 'USER_UUID_3', 'Senior Developer & Tech Lead', NOW()),
('PROJECT_ID_1', 'USER_UUID_4', 'Frontend Developer', NOW()),
('PROJECT_ID_1', 'USER_UUID_5', 'Backend Developer', NOW()),
('PROJECT_ID_1', 'USER_UUID_6', 'UI/UX Designer', NOW()),
('PROJECT_ID_1', 'USER_UUID_7', 'QA Engineer', NOW()),

-- Mobile E-commerce App Team (Complex project - 4 members)
('PROJECT_ID_2', 'USER_UUID_3', 'Mobile App Lead Developer', NOW()),
('PROJECT_ID_2', 'USER_UUID_4', 'React Native Developer', NOW()),
('PROJECT_ID_2', 'USER_UUID_5', 'API Backend Developer', NOW()),
('PROJECT_ID_2', 'USER_UUID_8', 'DevOps Engineer', NOW()),

-- Healthcare Management System (Medium project - 3 members)
('PROJECT_ID_3', 'USER_UUID_5', 'Backend Lead Developer', NOW()),
('PROJECT_ID_3', 'USER_UUID_4', 'Frontend Developer', NOW()),
('PROJECT_ID_3', 'USER_UUID_7', 'QA Engineer', NOW()),

-- Financial Analytics Dashboard (Medium project - 2 members)  
('PROJECT_ID_4', 'USER_UUID_3', 'Full Stack Developer', NOW()),
('PROJECT_ID_4', 'USER_UUID_6', 'Data Visualization Designer', NOW()),

-- Educational Learning Platform (Simple project - 2 members)
('PROJECT_ID_5', 'USER_UUID_4', 'Frontend Developer', NOW()),
('PROJECT_ID_5', 'USER_UUID_5', 'Backend Developer', NOW());

-- =====================================================
-- Step 7: CREATE INITIAL TASKS (PM assigns to team members)
-- =====================================================

INSERT INTO public.tasks (title, description, project_id, assignee_id, created_by, status, priority, estimated_hours, due_date, created_at) VALUES
-- Enterprise Web Platform Tasks
('Project Setup & Architecture', 'Set up development environment, project structure, and define technical architecture', 'PROJECT_ID_1', 'USER_UUID_3', 'USER_UUID_2', 'in_progress', 'high', 16, '2025-09-30', NOW()),
('Database Design & Implementation', 'Design and implement the database schema with relationships and indexes', 'PROJECT_ID_1', 'USER_UUID_5', 'USER_UUID_2', 'todo', 'high', 24, '2025-10-05', NOW()),
('UI/UX Design System', 'Create design system, wireframes, and user interface mockups', 'PROJECT_ID_1', 'USER_UUID_6', 'USER_UUID_2', 'in_progress', 'medium', 32, '2025-10-10', NOW()),
('Frontend Component Library', 'Develop reusable React components based on design system', 'PROJECT_ID_1', 'USER_UUID_4', 'USER_UUID_2', 'todo', 'medium', 40, '2025-10-15', NOW()),

-- Mobile E-commerce App Tasks  
('Mobile App Architecture', 'Define React Native architecture and navigation structure', 'PROJECT_ID_2', 'USER_UUID_3', 'USER_UUID_2', 'todo', 'high', 20, '2025-10-05', NOW()),
('Payment Integration API', 'Implement secure payment processing and API endpoints', 'PROJECT_ID_2', 'USER_UUID_5', 'USER_UUID_2', 'todo', 'high', 32, '2025-10-12', NOW()),
('Mobile UI Development', 'Develop mobile-responsive user interface components', 'PROJECT_ID_2', 'USER_UUID_4', 'USER_UUID_2', 'todo', 'medium', 48, '2025-10-20', NOW()),
('CI/CD Pipeline Setup', 'Set up automated testing and deployment pipeline', 'PROJECT_ID_2', 'USER_UUID_8', 'USER_UUID_2', 'todo', 'medium', 16, '2025-10-08', NOW()),

-- Healthcare Management System Tasks
('Patient Data API', 'Develop secure API for patient data management', 'PROJECT_ID_3', 'USER_UUID_5', 'USER_UUID_2', 'todo', 'high', 28, '2025-10-22', NOW()),
('Appointment Scheduling UI', 'Create appointment booking and management interface', 'PROJECT_ID_3', 'USER_UUID_4', 'USER_UUID_2', 'todo', 'medium', 24, '2025-10-25', NOW()),
('Security & Compliance Testing', 'Ensure HIPAA compliance and security testing', 'PROJECT_ID_3', 'USER_UUID_7', 'USER_UUID_2', 'todo', 'high', 20, '2025-10-30', NOW());

-- =====================================================
-- Step 8: VERIFICATION QUERIES
-- =====================================================

-- Check all users with their roles
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
        ELSE 4 
    END, p.first_name;

-- Check projects with their teams
SELECT 
    p.name as project_name,
    c.company as client,
    pm.first_name || ' ' || pm.last_name as project_manager,
    p.status,
    p.priority,
    COUNT(pt.user_id) as team_size
FROM public.projects p
JOIN public.clients c ON p.client_id = c.id
JOIN public.profiles pm ON p.project_manager_id = pm.id
LEFT JOIN public.project_teams pt ON p.id = pt.project_id
GROUP BY p.id, p.name, c.company, pm.first_name, pm.last_name, p.status, p.priority
ORDER BY p.created_at;

-- Check task assignments
SELECT 
    p.name as project,
    t.title as task,
    assignee.first_name || ' ' || assignee.last_name as assigned_to,
    creator.first_name || ' ' || creator.last_name as created_by,
    t.status,
    t.priority,
    t.due_date
FROM public.tasks t
JOIN public.projects p ON t.project_id = p.id
JOIN public.profiles assignee ON t.assignee_id = assignee.id
JOIN public.profiles creator ON t.created_by = creator.id
ORDER BY p.name, t.created_at;

-- =====================================================
-- IMPORTANT NOTES:
-- =====================================================

/*
1. REPLACE PLACEHOLDER IDs:
   - Replace USER_UUID_X with actual UUIDs from auth.users
   - Replace CLIENT_ID_X with actual client IDs  
   - Replace PROJECT_ID_X with actual project IDs

2. GET ACTUAL IDs BY RUNNING:
   SELECT id, email FROM auth.users ORDER BY email;
   SELECT id, company FROM public.clients ORDER BY company;
   SELECT id, name FROM public.projects ORDER BY name;

3. WORKFLOW VERIFICATION:
   - Admin creates projects and assigns PM
   - PM sees assigned projects in dashboard  
   - PM breaks down into tasks and assigns to team members
   - Team members see their assigned tasks in dashboard
   - Project complexity determines team size (2-5 members)

4. LOGIN ORDER (appears everywhere in correct order):
   1. admin@nexaflow.com (Administrator)
   2. pm@nexaflow.com (Project Manager)  
   3. senior.dev@nexaflow.com (Senior Developer)
   4. frontend.dev@nexaflow.com (Frontend Developer)
   5. backend.dev@nexaflow.com (Backend Developer)
   6. designer@nexaflow.com (UI/UX Designer)
   7. qa@nexaflow.com (QA Engineer)
   8. devops@nexaflow.com (DevOps Engineer)
*/