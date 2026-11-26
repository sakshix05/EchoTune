@echo off
echo ==============================================
echo   Starting AuraBeat AI - Backend Server
echo ==============================================
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
pause
