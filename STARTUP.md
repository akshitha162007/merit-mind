# Merit Mind - Startup Guide

## Prerequisites

- Python 3.9+ (for backend)
- Node.js 16+ (for frontend)
- PostgreSQL running (for database)

## Backend Setup & Startup

### 1. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

Ensure `.env` file exists in `backend/` with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/merit_mind
GROQ_API_KEY=your_groq_api_key
```

### 3. Start the Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The backend will run at `http://localhost:8000`

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

## Frontend Setup & Startup

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Ensure `.env` is Configured

Verify `frontend/.env` contains:
```
VITE_API_URL=http://localhost:8000
```

### 3. Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```

The frontend will run at `http://localhost:3000` (or next available port)

## Startup Order

**Always start the backend FIRST, then the frontend:**

1. Terminal 1 - Backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

2. Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Troubleshooting

### "Failed to Fetch" Error
- Ensure backend is running on `http://localhost:8000`
- Check CORS is configured in `backend/main.py`
- Verify `VITE_API_URL` in `frontend/.env` matches backend URL
- Restart frontend dev server after changing `.env`

### Connection Refused
- Backend is not running
- Backend is running on different port than `VITE_API_URL` specifies
- Check firewall settings

### Database Connection Error
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env` is correct
- Check database credentials

## Testing the Setup

1. Open `http://localhost:3000` in browser
2. Click "Get Started Free" or "Sign In"
3. Try registering a new account
4. Should redirect to role-based dashboard

If you see "Failed to Fetch" error, the backend is not running.
