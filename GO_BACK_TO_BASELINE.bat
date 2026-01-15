@echo off
echo ====================================
echo RESTORE TO BASELINE
echo ====================================
echo.
echo Available baselines:
echo.

cd /d "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

git tag -l

echo.
set /p TAG="Enter the baseline name to restore (or press Enter to cancel): "

if "%TAG%"=="" (
    echo.
    echo Cancelled.
    pause
    exit
)

echo.
echo WARNING: This will restore to baseline: %TAG%
echo All current changes will be lost!
echo.
set /p CONFIRM="Type YES to confirm: "

if /i NOT "%CONFIRM%"=="YES" (
    echo.
    echo Cancelled.
    pause
    exit
)

echo.
echo Restoring to baseline %TAG%...
git restore --source=%TAG% .

echo.
echo ====================================
echo RESTORED TO BASELINE!
echo ====================================
echo Baseline: %TAG%
echo.
echo IMPORTANT: Press Ctrl+Shift+R in your browser to refresh!
echo.
pause
