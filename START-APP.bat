@echo off
echo ========================================
echo   Merit Mind - Starting Application
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo WARNING: Some backend dependencies may have failed to install
)

echo [2/4] Starting backend server on port 8000...
start "Merit Mind Backend" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
timeout /t 3 >nul

echo [3/4] Installing frontend dependencies...
cd ..\frontend
if not exist "node_modules" (
    echo Installing npm packages... This may take a few minutes...
    call npm install
)

echo [4/4] Starting frontend server...
start "Merit Mind Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
echo (Backend and Frontend will continue running)
pause >nul
