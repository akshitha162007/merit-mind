@echo off
echo Testing Merit Mind Backend Connection...
echo.

REM Test if backend is running
curl -s http://localhost:8000/api/health
if errorlevel 1 (
    echo.
    echo ERROR: Backend is not responding on port 8000
    echo.
    echo Please start the backend first:
    echo   cd backend
    echo   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
    echo.
) else (
    echo.
    echo SUCCESS: Backend is running and responding!
    echo.
)

pause
