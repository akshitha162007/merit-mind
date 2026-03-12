# TROUBLESHOOTING GUIDE - Merit Mind

## Issues Fixed:

### 1. ✅ Backend requirements.txt was corrupted
   - **Fixed**: Created clean requirements.txt with essential dependencies

### 2. ✅ Frontend API port mismatch
   - **Problem**: Frontend was calling port 8080, but backend runs on port 8000
   - **Fixed**: Updated auth.js and bias.js to use port 8000

## How to Start the Application:

### Option 1: Use the automated script (RECOMMENDED)
```
Double-click: START-APP.bat
```

### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Common Issues:

### Backend won't start:
1. **Missing dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database connection error**
   - Check backend/.env file has valid DATABASE_URL
   - Current: postgresql://postgres.qhxhmsninmnfikoxzoih:akshitha2007@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

3. **Port 8000 already in use**
   ```bash
   # Find and kill process on port 8000
   netstat -ano | findstr :8000
   taskkill /PID <PID_NUMBER> /F
   ```

### Frontend won't start:
1. **Missing node_modules**
   ```bash
   cd frontend
   npm install
   ```

2. **Port 5173 already in use**
   - Vite will automatically try the next available port
   - Or kill the process using port 5173

### Frontend can't connect to backend:
1. **Check backend is running**
   - Visit: http://localhost:8000/api/health
   - Should return: {"status":"ok","message":"Merit Mind backend is running!"}

2. **Check API URLs are correct**
   - frontend/src/api/auth.js: Should use port 8000
   - frontend/src/api/bias.js: Should use port 8000
   - ✅ Already fixed!

### CORS errors:
- Backend already configured to allow localhost connections
- If you see CORS errors, restart the backend

## Verify Everything Works:

1. **Backend Health Check:**
   ```
   Open browser: http://localhost:8000/api/health
   Expected: {"status":"ok","message":"Merit Mind backend is running!"}
   ```

2. **Frontend Loading:**
   ```
   Open browser: http://localhost:5173
   Expected: Merit Mind login/register page
   ```

3. **Test Registration:**
   - Go to http://localhost:5173
   - Click "Sign Up"
   - Fill in details and register
   - Should redirect to dashboard

## Still Having Issues?

Check the console output in both terminal windows for specific error messages.

### Backend Logs:
- Look for "Application startup complete" message
- Check for database connection errors
- Check for missing module errors

### Frontend Logs:
- Look for "Local: http://localhost:5173" message
- Open browser console (F12) for JavaScript errors
- Check Network tab for failed API calls
