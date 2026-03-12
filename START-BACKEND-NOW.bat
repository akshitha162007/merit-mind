@echo off
echo Starting Backend...
cd backend
C:/Users/KUMAR/merit-mind/backend/venv/Scripts/python.exe -m uvicorn main:app --reload --port 8000
pause
