@echo off
echo ========================================
echo   Property Listing Generator
echo   Starting Server...
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Checking Python...
python --version
echo.

echo Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo.
echo Open your browser to:
echo   - Main App: http://localhost:8000/static/index.html
echo   - Editor: http://localhost:8000/static/editor.html
echo   - API Docs: http://localhost:8000/docs
echo.
echo Press CTRL+C to stop the server
echo.
echo ========================================

python -m uvicorn backend.main:app --reload

pause
