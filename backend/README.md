# NexaFlow Backend

PostgreSQL database backend using Supabase for the NexaFlow project management platform.

## 🗄️ Database Structure

This backend uses **Supabase** (PostgreSQL) with the following components:

### **Core Tables:**
- `profiles` - User profiles and roles
- `clients` - Client company information
- `projects` - Project management data
- `project_teams` - Team assignments
- `tasks` - Task tracking and management
- `comments` - Task and project comments
- `time_logs` - Time tracking entries
- `documents` - File management
- `notifications` - System notifications
- `project_milestones` - Project milestones
- `task_dependencies` - Task relationships
- `activity_logs` - Audit trail

### **Security Features:**
- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access policies
- ✅ Data isolation between clients
- ✅ Proper indexes for performance

## 🚀 Setup Instructions

### **1. Create Supabase Project**
1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Create a new project
3. Note your project URL and anon key

### **2. Deploy Database Schema**
1. Open Supabase SQL Editor
2. Copy and paste contents of `supabase-schema.sql`
3. Click "RUN" to create all tables and policies

### **3. Add Sample Data (Optional)**
1. First create demo users in Authentication > Users:
   ```
   admin@nexaflow.com (password: demo123)
   pm@nexaflow.com (password: demo123)
   sarah@nexaflow.com (password: demo123)
   alex@nexaflow.com (password: demo123)
   client@nexaflow.com (password: demo123)
   ```

2. Update user IDs in `supabase-sample-data.sql`
3. Run the sample data script in SQL Editor

## 🔧 Configuration

### **Environment Variables**
The frontend needs these Supabase credentials:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **API Endpoints**
Supabase provides automatic REST API endpoints:

- **Authentication**: `/auth/v1/`
- **Database**: `/rest/v1/`
- **Real-time**: `/realtime/v1/`
- **Storage**: `/storage/v1/`

## 🛡️ Security Policies

### **Row Level Security (RLS)**

All tables have RLS enabled with policies for:

- **Profiles**: Users can view/edit their own profile, admins see all
- **Projects**: Users see projects they're assigned to or manage
- **Tasks**: Users see tasks on their accessible projects
- **Comments**: Users manage comments on accessible items
- **Time Logs**: Users manage their own time logs
- **Documents**: Based on project access permissions
- **Notifications**: Users see only their own notifications

### **Role-Based Access**

- **Admin**: Full system access
- **Project Manager**: Manage assigned projects and teams
- **Team Member**: Access assigned tasks and projects
- **Client**: View own projects only

## 📊 Database Performance

### **Indexes Created:**
- Primary keys on all tables
- Foreign key indexes for relationships
- Composite indexes for common queries
- Performance indexes on frequently queried columns

### **Optimization Features:**
- Efficient data types
- Proper constraints and validations
- Optimized RLS policies
- Automatic timestamping

## 🔄 Real-time Features

Supabase provides real-time subscriptions for:
- Live task updates
- Real-time notifications
- Project progress tracking
- Team collaboration features

## 📈 Monitoring

Use Supabase Dashboard to monitor:
- API usage and performance
- Database query performance
- User authentication metrics
- Real-time connection stats

## 🚀 Deployment

### **Production Checklist:**
- ✅ RLS policies tested and working
- ✅ Indexes created for performance
- ✅ Backup strategy configured
- ✅ Environment variables secured
- ✅ User roles and permissions tested

### **Scaling Considerations:**
- Supabase handles automatic scaling
- Database connection pooling managed
- CDN for static assets (if using Storage)
- Monitor query performance in dashboard

## 🆘 Troubleshooting

### **Common Issues:**

**"Permission denied" errors:**
- Check RLS policies are correctly applied
- Verify user has proper role in profiles table
- Ensure authenticated user context

**"Relation does not exist" errors:**
- Verify all tables created successfully
- Check table names match exactly in queries
- Ensure proper schema permissions

**Performance issues:**
- Review slow queries in Supabase Performance tab
- Check if proper indexes exist
- Consider query optimization

## 📋 API Documentation

### **Authentication**
```javascript
// Sign in
supabase.auth.signInWithPassword({ email, password })

// Sign up  
supabase.auth.signUp({ email, password })

// Sign out
supabase.auth.signOut()
```

### **Database Operations**
```javascript
// Select with RLS
const { data } = await supabase
  .from('projects')
  .select('*')
  
// Insert with validation
const { data } = await supabase
  .from('tasks')
  .insert({ title, project_id, assignee_id })
  
// Real-time subscriptions
supabase
  .channel('tasks')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'tasks' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

## 📞 Support

- **Supabase Documentation**: https://supabase.com/docs
- **SQL Reference**: https://www.postgresql.org/docs/
- **RLS Guide**: https://supabase.com/docs/guides/auth/row-level-security

---

**Backend Status:** ✅ Production Ready  
**Database:** PostgreSQL via Supabase  
**Security:** Row Level Security + Role-based Access  
**Performance:** Optimized with proper indexes  
**Scalability:** Managed by Supabase infrastructure