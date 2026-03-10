# Merit Mind - Environment Setup Guide

## Supabase Setup

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email or GitHub
4. Create a new organization

### 2. Create a New Project
1. Click "New Project"
2. Fill in:
   - **Project Name**: `merit-mind`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
3. Click "Create new project"
4. Wait for project to initialize (2-3 minutes)

### 3. Get Database Connection String
1. Go to Project Settings (gear icon)
2. Click "Database"
3. Under "Connection String", select "URI"
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

Example:
```
postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

### 4. Create Backend .env File

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Create Frontend .env File

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:8000
```

## Backend Setup

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database Tables

```bash
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
```

This creates all tables in Supabase:
- `users` - User accounts
- `sessions` - Login sessions
- `job_descriptions` - Job postings
- `candidates` - Candidate profiles
- `resumes` - Resume data
- `applications` - Job applications
- `bias_reports` - Bias detection results
- And more...

### 3. Verify Tables Created

In Supabase Dashboard:
1. Go to SQL Editor
2. Run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all the tables listed.

### 4. Start Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

## Frontend Setup

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Start Dev Server

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  build 0.00s

  ➜  Local:   http://localhost:3000/
```

## Verify Integration

### 1. Test Backend Health

Open in browser: `http://localhost:8000/api/health`

Expected response:
```json
{
  "status": "ok",
  "message": "Merit Mind backend is running!"
}
```

### 2. Test Frontend

Open in browser: `http://localhost:3000`

Should see landing page with:
- Hero section
- Features
- Stats
- CTA buttons

### 3. Test Registration

1. Click "Get Started Free"
2. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Role: `Recruiter`
3. Click "Create Account"
4. Should redirect to `/dashboard/recruiter`

### 4. Verify Data in Supabase

In Supabase SQL Editor:
```sql
SELECT id, name, email, role, created_at FROM users 
WHERE email = 'test@example.com';
```

Should return your user record.

### 5. Test Login

1. Go to `http://localhost:3000/login`
2. Enter: `test@example.com` / `password123`
3. Click "Sign In"
4. Should redirect to dashboard

### 6. Test Logout

1. Click "Logout" button
2. Should redirect to home page
3. Verify session deleted:
```sql
SELECT * FROM sessions WHERE user_id = '[your-user-id]';
```

Should return empty.

## Troubleshooting

### Database Connection Error

**Error**: `could not translate host name "aws-0-..." to address`

**Solution**:
1. Check DATABASE_URL is correct
2. Verify password is correct (no special chars need escaping in URL)
3. Check internet connection
4. Try connecting with psql:
```bash
psql "postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
```

### Tables Not Created

**Error**: `relation "users" does not exist`

**Solution**:
1. Run initialization again:
```bash
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
```
2. Verify in Supabase SQL Editor:
```sql
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify backend CORS config in `backend/main.py`:
```python
allow_origins=["http://localhost:5173", "http://localhost:3000"]
```
2. Restart backend server
3. Clear browser cache

### Frontend Can't Connect to Backend

**Error**: `Failed to fetch` or `net::ERR_CONNECTION_REFUSED`

**Solution**:
1. Verify backend is running: `http://localhost:8000/api/health`
2. Check `VITE_API_URL` in `frontend/.env`
3. Restart frontend dev server after changing `.env`
4. Check firewall settings

## Environment Variables Reference

### Backend (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://...` | Supabase connection string |
| `GROQ_API_KEY` | `gsk_...` | Groq API key for AI features |

### Frontend (.env)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend | 8000 | `http://localhost:8000` |
| Frontend | 3000 | `http://localhost:3000` |
| Supabase | N/A | Cloud-hosted |

## File Locations

```
merit-mind-1/
├── backend/
│   ├── .env                 ← Add DATABASE_URL here
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── .env                 ← Add VITE_API_URL here
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── INTEGRATION_GUIDE.md
```

## Quick Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Test
curl http://localhost:8000/api/health
open http://localhost:3000
```

## Next Steps

1. ✅ Set up Supabase account
2. ✅ Create project and get connection string
3. ✅ Create `.env` files
4. ✅ Initialize database
5. ✅ Start backend and frontend
6. ✅ Test registration and login
7. 🔄 Build additional features

## Support

- Supabase Docs: https://supabase.com/docs
- FastAPI Docs: https://fastapi.tiangolo.com
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
