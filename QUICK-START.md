# 🚀 NexaFlow Quick Start Guide

## 🎯 You're 10 Minutes Away from a Live Demo!

### **Step 1: Run Setup Wizard**
```bash
npm run setup
```
Enter your Supabase URL and Anon Key when prompted.

### **Step 2: Create Supabase Project** 
- Go to [https://app.supabase.com/](https://app.supabase.com/)
- Click "New Project" 
- Name: nexaflow-demo
- Set database password
- Choose region

### **Step 3: Database Setup**
1. **SQL Editor** → Paste contents of `supabase-schema.sql` → **RUN**
2. **Table Editor** → Verify 12+ tables created

### **Step 4: Create Demo Users**
**Authentication** → **Users** → **Add user** (manually create each):

```
Email: admin@nexaflow.com
Password: demo123
Role: Admin (full access)

Email: pm@nexaflow.com  
Password: demo123
Role: Project Manager

Email: sarah@nexaflow.com
Password: demo123
Role: Team Member

Email: alex@nexaflow.com
Password: demo123  
Role: Team Member

Email: client@nexaflow.com
Password: demo123
Role: Client (restricted access)
```

### **Step 5: Add Sample Data**
1. **SQL Editor** → Run `SELECT id, email FROM auth.users;`
2. Copy the user IDs
3. Update `supabase-sample-data.sql` with real IDs
4. **SQL Editor** → Paste updated sample data → **RUN**

### **Step 6: Test Your App**
```bash
npm run dev
```

Visit **http://localhost:5173** and login with:
- **admin@nexaflow.com / demo123** (see everything)
- **pm@nexaflow.com / demo123** (project management)
- **sarah@nexaflow.com / demo123** (team member view)  
- **client@nexaflow.com / demo123** (client portal)

## 🎉 **Demo Flow**
1. **Login as Admin** → Create project → Assign team
2. **Login as PM** → Add tasks → Set deadlines  
3. **Login as Team Member** → Complete tasks → Log time
4. **Login as Client** → View project progress

## 🆘 **Troubleshooting**
```bash
npm run health-check  # Verify setup
```

**Common Issues:**
- **"Cannot connect"**: Check `.env.local` has correct Supabase URL/key
- **"Login fails"**: Verify users exist in Supabase Auth → Users
- **"Access denied"**: Check user has profile in `profiles` table

## 📞 **Need Help?**
- Check `DEPLOYMENT.md` for detailed instructions
- Verify Supabase project is active (not paused)
- Ensure RLS policies are enabled in Table Editor