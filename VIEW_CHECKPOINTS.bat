@echo off
echo ====================================
echo YOUR SAVED CHECKPOINTS
echo ====================================
echo.

cd /d "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

git log --oneline -20

echo.
echo ====================================
echo.
echo The most recent checkpoint is at the top.
echo.
pause
