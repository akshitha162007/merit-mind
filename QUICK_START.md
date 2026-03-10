# Merit Mind - Quick Start Checklist

## ✅ Pre-Flight Checks

- [ ] Supabase account created
- [ ] PostgreSQL database created in Supabase
- [ ] `DATABASE_URL` copied from Supabase
- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] npm installed

## 🔧 Backend Setup (Terminal 1)

```bash
# 1. Navigate to backend
cd backend

# 2. Create .env file with:
# DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
# GROQ_API_KEY=your_key

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize database (creates tables in Supabase)
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"

# 5. Start backend server
uvicorn main:app --reload --port 8000
```

**Expected**: Server running on `http://localhost:8000`

## 🎨 Frontend Setup (Terminal 2)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Verify .env contains:
# VITE_API_URL=http://localhost:8000

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

**Expected**: App running on `http://localhost:3000`

## 🧪 Test Integration

### Test 1: Register User
1. Open `http://localhost:3000`
2. Click "Get Started Free"
3. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Role: `Recruiter`
4. Click "Create Account"
5. Should redirect to `/dashboard/recruiter`

### Test 2: Verify Data in Supabase
1. Go to Supabase Dashboard
2. SQL Editor
3. Run:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
```
4. Should see your user

### Test 3: Login
1. Go to `http://localhost:3000/login`
2. Enter: `test@example.com` / `password123`
3. Click "Sign In"
4. Should redirect to dashboard

### Test 4: Logout
1. Click "Logout" in dashboard
2. Should redirect to home page
3. Verify session deleted in Supabase:
```sql
SELECT * FROM sessions WHERE user_id = '[user-id]';
```

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Failed to Fetch" | Backend not running | Start backend: `uvicorn main:app --reload --port 8000` |
| "Email already registered" | User exists | Use different email or delete from Supabase |
| "Invalid email or password" | Wrong credentials | Check email/password or re-register |
| Redirect not working | Role not in localStorage | Clear localStorage: `localStorage.clear()` |
| Database connection error | Wrong DATABASE_URL | Verify in Supabase → Settings → Database |

## 📁 Key Files Modified

- ✅ `backend/main.py` - CORS configured
- ✅ `frontend/src/api/auth.js` - API integration
- ✅ `frontend/src/context/AuthContext.jsx` - State management
- ✅ `frontend/src/pages/Login.jsx` - Login with redirect
- ✅ `frontend/src/pages/Register.jsx` - Register with redirect
- ✅ `frontend/src/pages/RecruiterDashboard.jsx` - Recruiter dashboard
- ✅ `frontend/src/pages/CandidateDashboard.jsx` - Candidate dashboard
- ✅ `frontend/src/App.jsx` - Routing setup
- ✅ `frontend/src/components/ProtectedRoute.jsx` - Route protection

## 🚀 Startup Order

**ALWAYS start backend FIRST:**

1. Terminal 1: `cd backend && uvicorn main:app --reload --port 8000`
2. Terminal 2: `cd frontend && npm run dev`
3. Open `http://localhost:3000`

## 📊 Data Flow Summary

```
User Registration
├── Frontend: Form submission
├── Backend: Validate & hash password
├── Supabase: Insert into users table
├── Backend: Create session token
├── Supabase: Insert into sessions table
├── Frontend: Store token in localStorage
└── Frontend: Redirect to dashboard

User Login
├── Frontend: Form submission
├── Backend: Query users table
├── Backend: Verify password
├── Backend: Create session token
├── Supabase: Insert into sessions table
├── Frontend: Store token in localStorage
└── Frontend: Redirect to dashboard

User Logout
├── Frontend: Click logout
├── Backend: Delete session from sessions table
├── Frontend: Clear localStorage
└── Frontend: Redirect to home
```

## ✨ Features Implemented

- ✅ User registration with role selection
- ✅ User login with credentials
- ✅ Password hashing with bcrypt
- ✅ JWT token-based sessions
- ✅ Role-based dashboard routing
- ✅ Protected routes
- ✅ Logout functionality
- ✅ Data persistence to Supabase
- ✅ CORS enabled for frontend
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states

## 🎯 Next Steps

After successful integration:
1. Build Job Description upload feature
2. Implement resume upload & parsing
3. Add bias detection agents
4. Create candidate matching system
5. Build fairness metrics dashboard
