@echo off
echo ========================================
echo MeritMind - Complete Startup
echo ========================================
echo.

echo [1/3] Initializing Database...
cd backend
python init_db.py
if %errorlevel% neq 0 (
    echo ERROR: Database initialization failed!
    pause
    exit /b 1
)
echo Database OK!
echo.

echo [2/3] Starting Backend Server...
start "MeritMind Backend" cmd /k "python -m uvicorn main:app --reload --port 8000"
timeout /t 3 /nobreak > nul
echo Backend started on http://localhost:8000
echo.

echo [3/3] Starting Frontend Server...
cd ..\frontend
start "MeritMind Frontend" cmd /k "npm run dev"
echo Frontend starting on http://localhost:5173
echo.

echo ========================================
echo MeritMind is starting up!
echo ========================================
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo ========================================
pause
