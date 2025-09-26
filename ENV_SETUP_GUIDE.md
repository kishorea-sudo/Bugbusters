# 🚀 NexaFlow Environment Configuration Guide

## 📋 **Quick Setup Options**

### **Option 1: Demo Mode (Immediate Testing)**
Copy this into your `.env` file for instant demo functionality:

```bash
# Demo Mode - No API keys required
VITE_DEMO_MODE=true

# Basic Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3001/api

# Feature Flags (Enable all for demo)
VITE_ENABLE_AI_REPORTS=true
VITE_ENABLE_AUTOMATION_RULES=true
VITE_ENABLE_WHATSAPP_APPROVALS=true
VITE_ENABLE_FILE_IMPORT=true
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_WHATSAPP_NOTIFICATIONS=true

# File Settings
VITE_MAX_FILE_SIZE=50MB
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip

# Security (Demo values)
VITE_JWT_SECRET=demo-jwt-secret-key-change-in-production
VITE_SESSION_TIMEOUT=24h

# Optional (can be empty for demo)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SENDGRID_API_KEY=
VITE_TWILIO_ACCOUNT_SID=
VITE_TWILIO_AUTH_TOKEN=
VITE_OPENAI_API_KEY=
```

---

### **Option 2: Production Setup**

## 🔑 **API Keys & Services Setup**

### **1. Supabase (Database) - REQUIRED for Production**
```bash
# 1. Go to https://supabase.com
# 2. Create new project
# 3. Copy these values from Settings > API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Setup Steps:**
1. Visit [supabase.com](https://supabase.com) → Create account
2. Create new project → Copy URL and anon key
3. Run the SQL from `supabase-schema.sql` in SQL Editor

---

### **2. OpenAI (AI Reports) - OPTIONAL**
```bash
# 1. Go to https://platform.openai.com
# 2. Create API key in API Keys section
VITE_OPENAI_API_KEY=sk-proj-abcd1234...
OPENAI_ORGANIZATION=org-abcd1234
```
**Setup Steps:**
1. Visit [platform.openai.com](https://platform.openai.com)
2. Create account → API Keys → Create new key
3. Copy key (starts with `sk-proj-` or `sk-`)
4. **Cost**: ~$0.01-0.05 per AI report generation

**⚠️ Without OpenAI**: App uses intelligent fallback responses

---

### **3. SendGrid (Email) - OPTIONAL**
```bash
# 1. Go to https://sendgrid.com
# 2. Create API key with Mail Send permissions
VITE_SENDGRID_API_KEY=SG.abcd1234...
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Your Company Name
```
**Setup Steps:**
1. Visit [sendgrid.com](https://sendgrid.com) → Create account
2. Settings → API Keys → Create key with "Mail Send" permission
3. Verify your sender email/domain
4. **Cost**: Free tier (100 emails/day)

**⚠️ Without SendGrid**: Email notifications are simulated

---

### **4. Twilio WhatsApp (Optional)**
```bash
# 1. Go to https://twilio.com
# 2. Get WhatsApp Business API access
VITE_TWILIO_ACCOUNT_SID=AC1234567890abcdef...
VITE_TWILIO_AUTH_TOKEN=your_auth_token_here
VITE_TWILIO_WHATSAPP_NUMBER=+14155551234
```
**Setup Steps:**
1. Visit [twilio.com](https://twilio.com) → Create account
2. Console → WhatsApp → Request access (business verification required)
3. Get sandbox number for testing
4. **Cost**: $0.005-0.02 per WhatsApp message

**⚠️ Without Twilio**: WhatsApp simulator works in demo mode

---

### **5. Google Drive (File Import) - OPTIONAL**
```bash
# 1. Go to https://console.cloud.google.com
# 2. Create project → Enable Drive API
VITE_GOOGLE_CLIENT_ID=123456789-abcd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcd1234...
```
**Setup Steps:**
1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → Enable Google Drive API
3. Credentials → Create OAuth 2.0 Client ID
4. **Cost**: Free (with usage limits)

---

### **6. Dropbox (File Import) - OPTIONAL**
```bash
# 1. Go to https://dropbox.com/developers
# 2. Create app with file access permissions
VITE_DROPBOX_APP_KEY=abcd1234567890
DROPBOX_APP_SECRET=your_app_secret_here
```

---

## 🎯 **Recommended Setup Sequence**

### **Phase 1: Immediate Demo (5 minutes)**
```bash
# Just set demo mode and basic URLs
VITE_DEMO_MODE=true
VITE_APP_URL=http://localhost:5173
```

### **Phase 2: Core Database (15 minutes)**
```bash
# Add Supabase for real data persistence
VITE_DEMO_MODE=false
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### **Phase 3: AI Features (10 minutes)**
```bash
# Add OpenAI for real AI reports
VITE_OPENAI_API_KEY=your_openai_key
```

### **Phase 4: Communications (20 minutes)**
```bash
# Add SendGrid for emails
VITE_SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_email
```

---

## 🔧 **Complete Production .env Template**

```bash
# Application Mode
VITE_DEMO_MODE=false

# Supabase (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SendGrid Email (Recommended)
VITE_SENDGRID_API_KEY=SG.your-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=NexaFlow

# OpenAI (Recommended)
VITE_OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_ORGANIZATION=org-your-org-id

# Twilio WhatsApp (Optional)
VITE_TWILIO_ACCOUNT_SID=AC_your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_WHATSAPP_NUMBER=+1234567890

# Google Drive (Optional)
VITE_GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Dropbox (Optional)
VITE_DROPBOX_APP_KEY=your-app-key
DROPBOX_APP_SECRET=your-app-secret

# Application URLs
VITE_APP_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com

# File Storage
VITE_MAX_FILE_SIZE=50MB
VITE_ALLOWED_FILE_TYPES=.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip

# Notification Settings
VITE_ENABLE_EMAIL_NOTIFICATIONS=true
VITE_ENABLE_WHATSAPP_NOTIFICATIONS=true
VITE_ENABLE_PUSH_NOTIFICATIONS=true

# Security
VITE_JWT_SECRET=your-super-secret-jwt-key-here
VITE_SESSION_TIMEOUT=24h

# Analytics
VITE_ENABLE_ANALYTICS=true
VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Performance Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Feature Flags
VITE_ENABLE_AI_REPORTS=true
VITE_ENABLE_AUTOMATION_RULES=true
VITE_ENABLE_WHATSAPP_APPROVALS=true
VITE_ENABLE_FILE_IMPORT=true
```

---

## 💰 **Cost Breakdown**

| Service | Free Tier | Paid Plans | Required? |
|---------|-----------|------------|-----------|
| **Supabase** | 500MB DB, 2GB bandwidth | $25/month unlimited | ✅ Yes |
| **OpenAI** | $5 credit trial | $0.01-0.03 per 1K tokens | 🔶 Recommended |
| **SendGrid** | 100 emails/day | $19.95/month 50K emails | 🔶 Recommended |
| **Twilio** | Trial credit | $0.005-0.02 per message | ❌ Optional |
| **Google Drive** | Standard limits | Pay per usage | ❌ Optional |
| **Dropbox** | Standard limits | $5/month+ | ❌ Optional |

**Total monthly cost for full features: ~$50-75/month**
**Minimum viable cost (Supabase + OpenAI): ~$25-30/month**

---

## 🏃‍♂️ **Quick Start Commands**

```bash
# 1. Copy environment file
cp .env.example .env

# 2. For demo mode (works immediately)
echo "VITE_DEMO_MODE=true" > .env

# 3. Start the application
npm run dev
```

**The app will work perfectly in demo mode while you gradually add real API keys!** 🎉