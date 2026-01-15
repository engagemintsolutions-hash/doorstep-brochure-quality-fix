@echo off
echo ====================================
echo SAVE BASELINE (STABLE VERSION)
echo ====================================
echo.
echo This creates a TAGGED stable version you can always return to.
echo Use this when everything is working perfectly.
echo.
set /p TAG="Enter a name for this stable version (e.g. working-demo): "

if "%TAG%"=="" (
    echo.
    echo Cancelled. No tag created.
    pause
    exit
)

cd /d "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

echo.
echo Saving all changes...
git add .
git commit -m "STABLE BASELINE: %TAG%"

echo Creating tag...
git tag -a %TAG% -m "Stable baseline: %TAG%"

echo.
echo ====================================
echo BASELINE SAVED!
echo ====================================
echo Tag: %TAG%
echo.
echo You can return to this exact version anytime using:
echo GO_BACK_TO_BASELINE.bat
echo.
pause
