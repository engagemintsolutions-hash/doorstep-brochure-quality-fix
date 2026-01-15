@echo off
echo ====================================
echo EMERGENCY ROLLBACK
echo ====================================
echo.
echo This will UNDO all changes since last checkpoint!
echo.
set /p CONFIRM="Are you sure? Type YES to confirm: "

if /i NOT "%CONFIRM%"=="YES" (
    echo.
    echo Cancelled. No changes made.
    pause
    exit
)

cd /d "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

echo.
echo Rolling back...
git restore .

echo.
echo ====================================
echo ROLLBACK COMPLETE!
echo ====================================
echo All files restored to last checkpoint.
echo.
echo IMPORTANT: Press Ctrl+Shift+R in your browser to refresh!
echo.
pause
