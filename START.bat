@echo off
cls
echo ========================================
echo   OPENBRICK - Listing Generator
echo ========================================
echo.
echo Starting server...
echo.

cd /d "%~dp0"

echo Killing any existing Python servers...
taskkill //F //IM python.exe >nul 2>&1

timeout /t 1 /nobreak >nul

echo.
echo Starting FastAPI server on http://localhost:8000
echo.
echo Opening browser in 3 seconds...
echo.

start /B python -m uvicorn backend.main:app --reload --port 8000

timeout /t 3 /nobreak >nul

start http://localhost:8000/static/index.html

echo.
echo ========================================
echo   Server is running!
echo ========================================
echo.
echo   App: http://localhost:8000/static/index.html
echo   API: http://localhost:8000/docs
echo.
echo   Press CTRL+C to stop the server
echo ========================================
echo.

pause
