# 🚀 Production Database Setup - Remove Demo Data

This guide helps you transition from demo/sample data to real production data in your NexaFlow platform.

## 🗑️ Step 1: Clear Demo Data

### **Run the Cleanup Script:**
1. Open your Supabase SQL Editor
2. Copy and run the contents of `clear-demo-data.sql`
3. This will remove all demo users, projects, and sample data

### **What Gets Removed:**
- ❌ Demo user profiles (admin@nexaflow.com, pm@nexaflow.com, etc.)
- ❌ Sample clients (TechCorp, StartupCo, Global Enterprises)
- ❌ Demo projects (E-commerce Platform, Mobile App, etc.)
- ❌ Sample tasks and time logs
- ❌ Test notifications and comments

## 👥 Step 2: Create Real Users

### **In Supabase Authentication Dashboard:**
1. Go to **Authentication** > **Users**
2. Click **"Add user"** 
3. Create your actual team members:

```
✅ your-admin@company.com (Strong password)
✅ project-manager@company.com (Strong password)  
✅ developer1@company.com (Strong password)
✅ developer2@company.com (Strong password)
✅ client@clientcompany.com (Strong password)
```

### **Security Notes:**
- ✅ Use real email addresses
- ✅ Use strong passwords (not demo123)
- ✅ Enable email confirmation if needed
- ✅ Consider 2FA for admin users

## 📋 Step 3: Add Real User Profiles

### **Get User UUIDs:**
Run this in Supabase SQL Editor:
```sql
SELECT id, email FROM auth.users ORDER BY created_at;
```

### **Create Real Profiles:**
```sql
INSERT INTO public.profiles (id, email, first_name, last_name, role, phone, department, skills) VALUES
-- Replace UUIDs with actual values from auth.users
('actual-admin-uuid', 'your-admin@company.com', 'Your', 'Name', 'admin', '+1-555-0001', 'Management', ARRAY['Leadership', 'Strategy']),
('actual-pm-uuid', 'project-manager@company.com', 'Manager', 'Name', 'project_manager', '+1-555-0002', 'Project Management', ARRAY['Agile', 'Scrum']),
('actual-dev1-uuid', 'developer1@company.com', 'Dev', 'One', 'team_member', '+1-555-0003', 'Engineering', ARRAY['React', 'TypeScript']),
('actual-dev2-uuid', 'developer2@company.com', 'Dev', 'Two', 'team_member', '+1-555-0004', 'Engineering', ARRAY['Node.js', 'PostgreSQL']),
('actual-client-uuid', 'client@clientcompany.com', 'Client', 'Contact', 'client', '+1-555-0005', 'Business', ARRAY['Project Management']);
```

## 🏢 Step 4: Add Real Clients

### **Create Real Client Records:**
```sql
INSERT INTO public.clients (name, company, industry, contact_email, contact_phone, address) VALUES
('John Doe', 'Acme Corporation', 'Technology', 'john.doe@acme.com', '+1-555-1001', '123 Business St, City, State 12345'),
('Jane Smith', 'Beta Industries', 'Manufacturing', 'jane.smith@beta.com', '+1-555-1002', '456 Industrial Ave, City, State 12346'),
('Mike Johnson', 'Gamma Services', 'Consulting', 'mike.johnson@gamma.com', '+1-555-1003', '789 Service Blvd, City, State 12347');
```

## 📊 Step 5: Create Real Projects

### **Get Client and PM UUIDs:**
```sql
-- Get client IDs
SELECT id, company FROM public.clients;

-- Get project manager IDs  
SELECT id, first_name, last_name FROM public.profiles WHERE role = 'project_manager';
```

### **Create Real Projects:**
```sql
INSERT INTO public.projects (name, description, client_id, project_manager_id, status, priority, start_date, end_date, budget) VALUES
('Website Redesign Project', 'Complete redesign of company website with modern UI/UX and mobile responsiveness', 'client-uuid-1', 'pm-uuid', 'active', 'high', '2025-10-01', '2025-12-15', 75000.00),
('Mobile App Development', 'Native iOS and Android app with user authentication and data synchronization', 'client-uuid-2', 'pm-uuid', 'planning', 'medium', '2025-11-01', '2026-02-28', 120000.00),
('Database Migration', 'Migrate legacy database to modern PostgreSQL with improved performance', 'client-uuid-3', 'pm-uuid', 'planning', 'high', '2025-10-15', '2025-11-30', 45000.00);
```

## 👥 Step 6: Assign Team Members

### **Get Project and User UUIDs:**
```sql
-- Get project IDs
SELECT id, name FROM public.projects;

-- Get team member IDs
SELECT id, first_name, last_name FROM public.profiles WHERE role = 'team_member';
```

### **Assign Teams to Projects:**
```sql
INSERT INTO public.project_teams (project_id, user_id, role_in_project) VALUES
-- Website Redesign Team
('website-project-uuid', 'dev1-uuid', 'Frontend Developer'),
('website-project-uuid', 'dev2-uuid', 'Backend Developer'),

-- Mobile App Team
('mobile-project-uuid', 'dev1-uuid', 'React Native Developer'),
('mobile-project-uuid', 'dev2-uuid', 'API Developer'),

-- Database Migration Team
('database-project-uuid', 'dev2-uuid', 'Database Developer');
```

## ✅ Step 7: Create Initial Tasks

### **Add Real Tasks:**
```sql
INSERT INTO public.tasks (title, description, project_id, assignee_id, created_by, status, priority, estimated_hours, due_date) VALUES
('Set up development environment', 'Configure local development environment and project repository', 'website-project-uuid', 'dev1-uuid', 'pm-uuid', 'todo', 'high', 8, '2025-10-03'),
('Design system components', 'Create reusable UI components library', 'website-project-uuid', 'dev1-uuid', 'pm-uuid', 'todo', 'medium', 40, '2025-10-10'),
('API endpoint development', 'Develop RESTful API endpoints for frontend integration', 'website-project-uuid', 'dev2-uuid', 'pm-uuid', 'todo', 'high', 32, '2025-10-08');
```

## 🧪 Step 8: Test Your Production Setup

### **Verify Data:**
```sql
-- Check user profiles
SELECT email, first_name, last_name, role FROM public.profiles;

-- Check projects with clients
SELECT p.name, c.company, p.status, p.budget 
FROM public.projects p 
JOIN public.clients c ON p.client_id = c.id;

-- Check team assignments
SELECT p.name as project, pr.first_name || ' ' || pr.last_name as team_member, pt.role_in_project
FROM public.project_teams pt
JOIN public.projects p ON pt.project_id = p.id
JOIN public.profiles pr ON pt.user_id = pr.id;
```

### **Test Login:**
1. Go to your frontend: `http://localhost:5173`
2. Login with your real admin credentials
3. Verify you see your real projects and data
4. Test creating new tasks and projects

## 🔒 Step 9: Security Checklist

### **Production Security:**
- ✅ All demo passwords removed
- ✅ Strong passwords for all users
- ✅ Real email addresses used
- ✅ Email verification enabled (optional)
- ✅ Row Level Security policies active
- ✅ Environment variables secured

### **Data Privacy:**
- ✅ Client data properly isolated
- ✅ Team members can only see assigned projects
- ✅ Admin access properly controlled
- ✅ Audit logging enabled

## 🚀 Step 10: Go Live!

### **Your Production Platform is Ready:**
- ✅ Real users can now login with actual credentials
- ✅ Create and manage real projects
- ✅ Track actual time and progress
- ✅ Client portal shows real project data
- ✅ Team collaboration with real workflows

### **Next Steps:**
1. **Train your team** on using the platform
2. **Import existing projects** if migrating from other tools
3. **Set up backup strategies** for important data
4. **Monitor usage** via Supabase dashboard
5. **Plan for scaling** as your team grows

## 📊 Ongoing Management

### **Regular Tasks:**
- Review and update user permissions
- Monitor project progress and budgets
- Clean up completed projects periodically
- Back up important project data
- Update user profiles as team changes

### **Performance Monitoring:**
- Use Supabase Dashboard for database performance
- Monitor API usage and response times
- Track user activity and engagement
- Review and optimize slow queries

---

## 🎯 **Success!**

Your NexaFlow platform is now running with **real production data** instead of demo values. You have a professional project management system ready for your actual business needs!

**No more demo123 passwords or fake projects** - everything is now production-ready! 🚀