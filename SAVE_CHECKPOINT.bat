@echo off
echo ====================================
echo SAVING CHECKPOINT
echo ====================================
echo.

cd /d "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

REM Get current timestamp
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

echo Adding all files...
git add .

echo Creating checkpoint...
git commit -m "CHECKPOINT: %TIMESTAMP%"

echo.
echo ====================================
echo CHECKPOINT SAVED!
echo ====================================
echo Timestamp: %TIMESTAMP%
echo.
echo You can now safely test your changes.
echo If something breaks, run UNDO_LAST_CHANGE.bat
echo.
pause
