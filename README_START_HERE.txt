========================================
  OPENBRICK V2 - QUICK START GUIDE
========================================

THIS IS THE OFFICIAL V2 VERSION!
Location: C:\Users\billm\Desktop\Listing agent\property-listing-generator

========================================
HOW TO START THE APP:
========================================

OPTION 1 (Recommended):
  Double-click: START_HERE.bat

OPTION 2:
  Go to Desktop and double-click: START_OPENBRICK_V2.bat

========================================
URLS:
========================================

Main App:     http://localhost:8000/static/index.html
Brochure Editor: http://localhost:8000/static/brochure_editor.html
API Docs:     http://localhost:8000/docs

========================================
IF YOU SEE OLD UI:
========================================

1. Press Ctrl+Shift+R (hard refresh)
2. Or press F12, right-click refresh button,
   select "Empty Cache and Hard Reload"

========================================
IMPORTANT:
========================================

✓ ONLY use this directory for V2
✓ All old versions have been deleted
✓ Always use START_HERE.bat to launch
✓ Keep the black window open while using app
✓ Press Ctrl+C in black window to stop server

========================================
TROUBLESHOOTING:
========================================

Problem: "Port already in use"
Solution: The startup script automatically kills
         old servers, but if it persists:
         taskkill /F /IM python.exe

Problem: Old UI still showing
Solution: Clear browser cache completely:
         Ctrl+Shift+Delete → Clear cache

Problem: Can't find project
Solution: The ONLY V2 location is:
         C:\Users\billm\Desktop\Listing agent\property-listing-generator

========================================
