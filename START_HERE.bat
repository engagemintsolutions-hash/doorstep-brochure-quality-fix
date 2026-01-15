@echo off
REM ========================================
REM   OpenBrick V2 - Start Here
REM ========================================

echo.
echo  ========================================
echo    OPENBRICK V2 PROPERTY GENERATOR
echo  ========================================
echo.

REM Kill any existing servers
echo [1/3] Checking for existing servers on port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo       Killing PID: %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/3] Starting fresh server...
echo.
echo  URLs:
echo  - Main App:  http://localhost:8000/static/index.html
echo  - Editor:    http://localhost:8000/static/brochure_editor.html
echo  - API Docs:  http://localhost:8000/docs
echo.

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start server
start /B python -m uvicorn backend.main:app --reload

REM Wait for server to initialize
timeout /t 3 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:8000/static/index.html

echo.
echo  SUCCESS! Keep this window open.
echo  Press Ctrl+C to stop the server.
echo  ========================================
echo.

REM Keep window open and show logs
python -m uvicorn backend.main:app --reload
