# MeritMind - Setup & Troubleshooting Guide

## Initial Setup (Run Once)

### 1. Initialize Database
```bash
cd backend
python init_db.py
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend  
```bash
cd frontend
npm run dev
```

## Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Common Issues & Fixes

### Issue: Blank Page / 500 Error

**Fix 1: Database not initialized**
```bash
cd backend
python init_db.py
```

**Fix 2: Backend not running**
- Check if backend is running on port 8000
- Visit http://localhost:8000/api/health
- Should return: `{"status":"ok","message":"Merit Mind backend is running!"}`

**Fix 3: CORS Error**
- Backend CORS is configured for ports 5173 and 3000
- Make sure frontend is on port 5173

### Issue: CSS Not Loading

**Fix: Clear cache and restart**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Issue: Module Not Found

**Fix: Reinstall dependencies**
```bash
cd frontend
npm install
```

### Issue: Database Connection Error

**Fix: Check .env file**
- Verify DATABASE_URL in `backend/.env`
- Test connection: `python init_db.py`

## Testing the Integration

1. Start backend (Terminal 1)
2. Start frontend (Terminal 2)
3. Open http://localhost:5173
4. You should see:
   - Purple/pink gradient "MeritMind" logo
   - "Hire for Merit. Not Bias." headline
   - Login and Sign Up buttons
   - Animated glowing background

5. Test Sign Up:
   - Click "Sign Up"
   - Fill: Name, Email, Password, Role
   - Submit
   - Should see "Welcome, [name]" in navbar

6. Test Logout:
   - Click "Logout"
   - Should return to Login/Sign Up buttons

7. Test Login:
   - Click "Login"
   - Enter credentials
   - Should see welcome message

## File Structure Check

```
merit-mind/
├── backend/
│   ├── main.py          ✓ FastAPI app
│   ├── database.py      ✓ DB connection
│   ├── models.py        ✓ User & Session models
│   ├── init_db.py       ✓ DB initialization
│   └── .env             ✓ Database URL
├── frontend/
│   ├── src/
│   │   ├── components/  ✓ All UI components
│   │   ├── hooks/       ✓ useAuth hook
│   │   ├── api/         ✓ auth.js
│   │   ├── App.jsx      ✓ Main app
│   │   ├── main.jsx     ✓ Entry point
│   │   └── index.css    ✓ Tailwind + animations
│   ├── postcss.config.js ✓ PostCSS config
│   └── package.json     ✓ Dependencies
```

## Quick Health Check

Run these commands to verify everything is working:

```bash
# Check backend
curl http://localhost:8000/api/health

# Check frontend (in browser)
# Open: http://localhost:5173
# Should see the landing page
```

## Still Having Issues?

1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify all files exist in the structure above
4. Try restarting both servers
5. Clear browser cache (Ctrl+Shift+R)
