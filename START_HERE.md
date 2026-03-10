# CRITICAL: Backend Not Running!

## The Issue
Your backend server is NOT running on port 8000. That's why registration fails.

## Solution: Start Backend First

### Step 1: Open Terminal/CMD
```bash
cd c:\Users\DELL\merit-mind\backend
```

### Step 2: Start Backend Server
```bash
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 3: Verify Backend is Running
Open browser: http://localhost:8000/api/health

Should show:
```json
{"status":"ok","message":"Merit Mind backend is running!"}
```

### Step 4: Start Frontend (New Terminal)
```bash
cd c:\Users\DELL\merit-mind\frontend
npm run dev
```

### Step 5: Test Registration
1. Open http://localhost:5173
2. Click "Sign Up"
3. Fill form
4. Submit
5. Should work now!

## Quick Start Script

Double-click: `start-all.bat` (starts both automatically)

## Troubleshooting

### Backend won't start?
```bash
cd backend
python -m pip install fastapi uvicorn sqlalchemy bcrypt python-dotenv psycopg2-binary
python init_db.py
python -m uvicorn main:app --reload --port 8000
```

### Port 8000 already in use?
```bash
# Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### Database error?
```bash
cd backend
python init_db.py
```
