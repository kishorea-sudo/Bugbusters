# 🚀 NexaFlow Supabase Deployment Guide

This guide will walk you through deploying NexaFlow with Supabase backend in **under 15 minutes**.

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Supabase account (free tier works great!)
- [ ] Code editor (VS Code recommended)

## 🎯 Step-by-Step Deployment

### Phase 1: Supabase Setup (5 minutes)

#### 1.1 Create Supabase Project
```bash
# Go to https://app.supabase.com/
# Click "New Project"
# Fill in:
# - Name: nexaflow-production (or your choice)
# - Database Password: (generate a strong password)
# - Region: (choose closest to your users)
```

#### 1.2 Configure Database Schema
1. **Open SQL Editor** in your Supabase dashboard
2. **Copy and paste** the entire contents of `supabase-schema.sql`
3. **Click "RUN"** to execute the schema
4. **Verify tables created**: Go to Table Editor and confirm 12+ tables exist

#### 1.3 Set Up Row Level Security
```sql
-- The schema already includes RLS policies, but verify they're active:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All tables should show rowsecurity = true
```

### Phase 2: Authentication Setup (3 minutes)

#### 2.1 Create Demo Users
Go to **Authentication > Users** in Supabase dashboard:

```bash
# Click "Add user" for each:
1. admin@nexaflow.com (password: demo123)
2. pm@nexaflow.com (password: demo123)  
3. sarah@nexaflow.com (password: demo123)
4. alex@nexaflow.com (password: demo123)
5. client@nexaflow.com (password: demo123)
```

#### 2.2 Get User IDs and Add Sample Data
1. **Copy user IDs**: Go to Authentication > Users, copy each user's UUID
2. **Update sample data**: Edit `supabase-sample-data.sql`:
   ```sql
   -- Replace these UUIDs with actual user IDs from your Supabase:
   -- Get them with: SELECT id, email FROM auth.users;
   
   INSERT INTO public.profiles (id, email, first_name, last_name, role) VALUES
   ('your-actual-admin-uuid', 'admin@nexaflow.com', 'John', 'Smith', 'admin'),
   ('your-actual-pm-uuid', 'pm@nexaflow.com', 'Mike', 'Johnson', 'project_manager'),
   -- ... etc
   ```
3. **Run sample data script** in SQL Editor

### Phase 3: Local Development Setup (2 minutes)

#### 3.1 Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
# Go to Settings > API in Supabase dashboard
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 3.2 Install and Start
```bash
# Install dependencies
npm install

# Start development server  
npm run dev
```

**🎉 Success!** Your app should now be running at `http://localhost:5173`

### Phase 4: Test the Application (2 minutes)

#### 4.1 Login with Demo Users
Try logging in with each role:
- **Admin**: admin@nexaflow.com (full access)
- **PM**: pm@nexaflow.com (project management)
- **Team**: sarah@nexaflow.com (team member view)
- **Client**: client@nexaflow.com (client portal)

#### 4.2 Verify Core Features
- [ ] **Dashboard**: Stats cards show different data per role
- [ ] **Projects**: Create/view projects (admin/PM only)
- [ ] **Tasks**: Assign and track tasks  
- [ ] **Team**: Add team members (admin/PM only)
- [ ] **Time Tracking**: Log hours on tasks
- [ ] **Notifications**: Real-time updates work
- [ ] **Profile**: User profile management

### Phase 5: Production Deployment (3 minutes)

#### 5.1 Build for Production
```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

#### 5.2 Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI (one-time setup)
npm install -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to Vercel project? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - Project name: nexaflow-production
# - In which directory is your code? ./
# - Want to override build settings? N
```

#### 5.3 Set Production Environment Variables
In your Vercel dashboard:
1. Go to **Project > Settings > Environment Variables**
2. Add:
   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. **Redeploy** to apply environment variables

## 🔧 Configuration Options

### Email Configuration (Optional)
```bash
# In Supabase: Authentication > Settings
# Configure SMTP (or use Supabase's default)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Custom Domain (Optional)
```bash
# In Vercel: Project > Settings > Domains
# Add your custom domain: nexaflow.yourcompany.com
```

### Database Backup (Recommended)
```bash
# In Supabase: Settings > Database > Backups
# Enable automatic daily backups
```

## 📊 Monitoring and Analytics

### Built-in Supabase Analytics
- **Dashboard**: Monitor API usage, active users
- **Logs**: View real-time application logs
- **Performance**: Track query performance

### Optional: Add External Monitoring
```bash
# Add to .env.local for enhanced monitoring:
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn (for error tracking)
```

## 🚨 Security Checklist

- [ ] **RLS Policies**: Verify Row Level Security is active on all tables
- [ ] **API Keys**: Ensure only anon key is used in client (never service role key)
- [ ] **Environment Variables**: Keep sensitive keys in .env.local (not committed to git)
- [ ] **User Permissions**: Test that each role can only access appropriate data
- [ ] **HTTPS**: Production deployment uses HTTPS (Vercel provides this automatically)

## 🐛 Troubleshooting

### Common Issues:

**"Cannot connect to Supabase"**
```bash
# Check environment variables are set correctly
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify Supabase project is not paused (free tier auto-pauses after 1 week inactivity)
```

**"User login fails"**
```bash
# Verify user exists in Authentication > Users
# Check password is correct (demo123 for all demo users)
# Ensure user has a profile record in profiles table
```

**"Access denied" errors**
```bash
# Check RLS policies are correctly applied:
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

# Verify user role in profiles table matches expected role
```

**Build errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

## 📈 Performance Optimization

### Database Optimization
```sql
-- The schema includes these optimizations:
-- ✅ Proper indexes on foreign keys
-- ✅ Composite indexes for common queries  
-- ✅ Optimized RLS policies
-- ✅ Efficient data types

-- Monitor slow queries in Supabase Dashboard > Performance
```

### Frontend Optimization
```bash
# The app includes:
# ✅ Code splitting with React.lazy() 
# ✅ Optimized Tailwind CSS purging
# ✅ Vite optimization for fast builds
# ✅ Efficient state management

# Monitor performance with browser dev tools
```

## 🎯 Next Steps

After successful deployment:

1. **Custom Branding**: Replace logo and colors in Tailwind config
2. **Email Templates**: Customize authentication emails in Supabase
3. **Advanced Features**: Add integrations (Google Drive, Slack, etc.)
4. **User Training**: Create user guides for each role
5. **Data Migration**: Import existing project data if migrating from another system

## 🆘 Support

**Need help?**
- Check the README.md for detailed feature documentation
- Review Supabase documentation: https://supabase.com/docs
- Create an issue in the repository with error details

## 📋 Deployment Verification Checklist

Before going live, verify:

- [ ] All demo users can log in successfully
- [ ] Each user role sees appropriate interface and permissions
- [ ] Projects can be created and assigned to team members
- [ ] Tasks can be created, assigned, and updated
- [ ] Time logging works correctly
- [ ] Real-time updates function (test with multiple users)
- [ ] File uploads work (if implemented)
- [ ] Email notifications send (if configured)
- [ ] Mobile responsive design works on phones/tablets
- [ ] Production URL is accessible and fast

**🚀 Congratulations!** Your NexaFlow project management platform is now live and ready for your team to use!

---

**Deployment Time**: ~15 minutes  
**Estimated Setup Cost**: Free (Supabase free tier + Vercel free tier)  
**Users Supported**: Up to 50,000 monthly active users (free tier)  
**Storage**: 500MB database + 1GB file storage (free tier)