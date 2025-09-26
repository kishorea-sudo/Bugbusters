# NexaFlow Frontend

Modern React TypeScript frontend for the NexaFlow project management platform.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase Client** - Backend integration
- **Lucide React** - Beautiful icon library

## 🎯 Features

### **Authentication System**
- ✅ Email/password authentication via Supabase
- ✅ Role-based access control (Admin, PM, Team Member, Client)
- ✅ Secure login with validation
- ✅ Profile management

### **Project Management**
- ✅ Create and manage projects
- ✅ Assign team members to projects
- ✅ Track project progress and budgets
- ✅ Project milestones and deadlines

### **Task Management**
- ✅ Create and assign tasks
- ✅ Task priority and status tracking
- ✅ Time logging with billable hours
- ✅ Task comments and collaboration

### **Dashboard Views**
- ✅ Role-specific dashboards
- ✅ Analytics and reporting
- ✅ Real-time notifications
- ✅ Activity feeds

### **Team Collaboration**
- ✅ Team member management
- ✅ Real-time updates
- ✅ File sharing and documents
- ✅ Client communication portal

## 🛠️ Installation

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase project (for backend)

### **Setup Steps**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Analytics/      # Dashboard analytics
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Role-based dashboards
│   ├── Layout/         # Header, sidebar, navigation
│   ├── Projects/       # Project management
│   ├── Tasks/          # Task management
│   └── Team/           # Team member management
├── context/            # React context providers
│   └── SupabaseAuthContext.tsx  # Authentication state
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client config
├── types/              # TypeScript definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 👥 User Roles & Access

### **🔴 Admin** 
- Full system access
- User and team management
- All project visibility
- System analytics and reports

### **🔵 Project Manager**
- Create and manage projects
- Assign tasks and team members  
- View team performance metrics
- Client communication

### **🟢 Team Member**
- View assigned tasks and projects
- Log time and update task progress
- Collaborate with team members
- Limited project visibility

### **🟡 Client**
- View own projects only
- Access project documents and reports
- Communicate with project team
- Track project progress

## 🎨 UI Components

### **Responsive Design**
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts
- Touch-friendly interfaces
- Progressive Web App capabilities

### **Component Library**
- Reusable UI components
- Consistent design system
- Accessible interfaces
- Dark/light theme support (planned)

## 🔐 Security Features

### **Authentication**
- Secure JWT-based authentication
- Password validation and requirements
- Session management
- Automatic logout on expiration

### **Authorization**
- Role-based component rendering
- API request authentication
- Protected routes
- Data access controls

## 📊 State Management

### **Context Providers**
- `SupabaseAuthContext` - Authentication state
- Global state management with React Context
- Optimistic UI updates
- Real-time data synchronization

### **Data Flow**
- Supabase client for API calls
- Real-time subscriptions for live updates
- Local state for UI interactions
- Optimistic updates for better UX

## 🚀 Build & Deploy

### **Development**
```bash
npm run dev          # Start dev server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Production Build**
```bash
npm run build
```

The `dist/` folder contains the production-ready static files.

### **Deployment Options**

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Static Hosting**
- AWS S3 + CloudFront
- GitHub Pages
- Firebase Hosting

## 🔧 Configuration

### **Environment Variables**
```bash
# Required
VITE_SUPABASE_URL=          # Your Supabase project URL
VITE_SUPABASE_ANON_KEY=     # Your Supabase anon key

# Optional
VITE_ENABLE_ANALYTICS=true  # Enable analytics features
VITE_DEBUG_MODE=false       # Enable debug logging
```

### **Build Configuration**
- **Vite**: Modern build tool with fast HMR
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing and optimization

## 🧪 Testing & Development

### **Available Scripts**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Check code quality with ESLint

### **Development Tools**
- React Developer Tools (browser extension)
- TypeScript language service
- Vite dev server with HMR
- Tailwind CSS IntelliSense

## 🔄 Real-time Features

### **Live Updates**
- Task status changes
- Project progress updates  
- New notifications
- Team member activity
- Comment additions

### **Supabase Integration**
```javascript
// Real-time subscriptions
useEffect(() => {
  const channel = supabase
    .channel('tasks')
    .on('postgres_changes', {
      event: '*',
      schema: 'public', 
      table: 'tasks'
    }, (payload) => {
      // Handle real-time updates
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [])
```

## 🚨 Error Handling

### **Error Boundaries**
- Component-level error boundaries
- Graceful error fallbacks
- Error reporting and logging
- User-friendly error messages

### **API Error Handling**
- Supabase error handling
- Network error recovery
- Retry mechanisms
- Toast notifications for feedback

## 📱 Mobile Support

### **Responsive Features**
- Touch-optimized interfaces
- Mobile navigation patterns
- Responsive data tables
- Mobile-friendly forms

### **PWA Capabilities** (Planned)
- Offline functionality
- Push notifications
- App-like experience
- Home screen installation

## 🆘 Troubleshooting

### **Common Issues**

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Supabase Connection:**
- Check environment variables are set
- Verify Supabase project is active
- Confirm API keys are correct

**TypeScript Errors:**
- Run `npm run lint` to check for issues
- Check import/export statements
- Verify type definitions

## 📞 Support & Documentation

- **React Documentation**: https://react.dev
- **Vite Documentation**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Supabase Client**: https://supabase.com/docs/reference/javascript

---

**Frontend Status:** ✅ Production Ready  
**Framework:** React 18 + TypeScript + Vite  
**Styling:** Tailwind CSS  
**Backend:** Supabase Integration  
**Build Time:** ~30 seconds  
**Bundle Size:** Optimized for performance