# Merit Mind - Complete Integration Guide

## Architecture Overview

```
Frontend (React + Vite)          Backend (FastAPI)           Database (Supabase PostgreSQL)
├── Login/Register               ├── /api/auth/register      ├── users table
├── Role-based Dashboards        ├── /api/auth/login         ├── sessions table
└── Protected Routes             ├── /api/auth/logout        └── other tables
                                 └── CORS enabled
```

## Prerequisites

- **Backend**: Python 3.9+, PostgreSQL (Supabase)
- **Frontend**: Node.js 16+, npm
- **Database**: Supabase account with PostgreSQL database

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 1.2 Configure Environment Variables

Create `backend/.env`:
```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
GROQ_API_KEY=your_groq_api_key
```

Get `DATABASE_URL` from Supabase:
1. Go to Supabase Dashboard
2. Project Settings → Database → Connection String
3. Copy the PostgreSQL connection string
4. Replace `[YOUR-PASSWORD]` with your database password

### 1.3 Initialize Database

```bash
cd backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
```

This creates all tables in Supabase.

### 1.4 Start Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd frontend
npm install
```

### 2.2 Configure Environment Variables

Ensure `frontend/.env` contains:
```
VITE_API_URL=http://localhost:8000
```

**Important**: Vite only exposes variables prefixed with `VITE_`. Restart dev server after changes.

### 2.3 Start Frontend Dev Server

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  build 0.00s

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

## Step 3: Test Integration

### 3.1 Register a New User

1. Open `http://localhost:3000`
2. Click "Get Started Free"
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123` (min 8 chars)
   - Role: Select "Recruiter" or "Candidate"
4. Click "Create Account"

### 3.2 Verify Data in Supabase

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run:
```sql
SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 1;
```

You should see your newly registered user.

### 3.3 Test Login

1. Go to `http://localhost:3000/login`
2. Enter the email and password from registration
3. Click "Sign In"
4. Should redirect to role-based dashboard:
   - Recruiters → `/dashboard/recruiter`
   - Candidates → `/dashboard/candidate`

### 3.4 Test Logout

1. Click "Logout" button in dashboard
2. Should redirect to home page (`/`)
3. Verify session deleted in Supabase:
```sql
SELECT * FROM sessions WHERE user_id = '[your-user-id]';
```

Should return empty.

## Data Flow

### Registration Flow
```
Frontend Form
    ↓
POST /api/auth/register
    ↓
Backend validates & hashes password
    ↓
Inserts into users table (Supabase)
    ↓
Creates session token
    ↓
Inserts into sessions table (Supabase)
    ↓
Returns token + user data
    ↓
Frontend stores in localStorage
    ↓
Redirects to role-based dashboard
```

### Login Flow
```
Frontend Form
    ↓
POST /api/auth/login
    ↓
Backend queries users table
    ↓
Verifies password hash
    ↓
Creates new session token
    ↓
Inserts into sessions table (Supabase)
    ↓
Returns token + user data
    ↓
Frontend stores in localStorage
    ↓
Redirects to role-based dashboard
```

### Logout Flow
```
Frontend Logout Button
    ↓
POST /api/auth/logout?token=[token]
    ↓
Backend deletes session from sessions table
    ↓
Frontend clears localStorage
    ↓
Redirects to home page
```

## Troubleshooting

### "Failed to Fetch" Error

**Cause**: Backend not running or CORS misconfigured

**Solution**:
1. Ensure backend is running: `uvicorn main:app --reload --port 8000`
2. Check CORS in `backend/main.py` includes both ports:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"]
```
3. Restart frontend dev server

### "Email already registered"

**Cause**: User already exists in database

**Solution**: Use a different email or delete user from Supabase:
```sql
DELETE FROM users WHERE email = 'john@example.com';
```

### "Invalid email or password"

**Cause**: Wrong credentials or user doesn't exist

**Solution**: 
1. Verify email exists: `SELECT * FROM users WHERE email = 'john@example.com';`
2. Re-register if needed

### Database Connection Error

**Cause**: `DATABASE_URL` incorrect or PostgreSQL not running

**Solution**:
1. Verify `DATABASE_URL` in `backend/.env`
2. Test connection: `psql [DATABASE_URL]`
3. Check Supabase dashboard for connection status

### Redirect Not Working

**Cause**: Role not saved in localStorage

**Solution**:
1. Check browser DevTools → Application → Local Storage
2. Verify `role` key exists with value "recruiter" or "candidate"
3. Clear localStorage and re-login: `localStorage.clear()`

## File Structure

```
merit-mind-1/
├── backend/
│   ├── main.py              # FastAPI app + auth endpoints
│   ├── models.py            # SQLAlchemy models
│   ├── database.py          # Database connection
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── api/auth.js      # API calls
│   │   ├── context/AuthContext.jsx  # Auth state
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   └── CandidateDashboard.jsx
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── vite.config.js
└── STARTUP.md
```

## API Endpoints

### POST /api/auth/register
Register a new user

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "recruiter"
}
```

**Response** (201):
```json
{
  "token": "uuid-string",
  "user_id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "recruiter"
}
```

### POST /api/auth/login
Login existing user

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "token": "uuid-string",
  "user_id": "uuid-string",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "recruiter"
}
```

### POST /api/auth/logout
Logout user

**Query Parameters**:
- `token`: User's session token

**Response** (200):
```json
{
  "ok": true
}
```

## Next Steps

1. ✅ Backend running on `http://localhost:8000`
2. ✅ Frontend running on `http://localhost:3000`
3. ✅ Data persisting to Supabase
4. ✅ Role-based routing working
5. 🔄 Build additional features (Job Descriptions, Candidates, etc.)

## Support

For issues:
1. Check browser console for errors
2. Check backend terminal for logs
3. Verify Supabase connection
4. Check `.env` files are correct
5. Restart both servers
