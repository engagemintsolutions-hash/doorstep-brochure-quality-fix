# BetaV4 Quick Start Guide

## This is Your Stable Version - BetaV4

This version was saved on **October 14, 2025** and represents a fully working multi-tenant property listing system.

---

## How to Start BetaV4

### Option 1: Run from this directory
```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator"
python -m uvicorn backend.main:app --reload
```

Then open: http://localhost:8000/static/login.html

### Option 2: Use the batch file
Double-click: `START_HERE.bat`

---

## What's Working in BetaV4

✅ Multi-tenant authentication (Savills + Generic)
✅ Agent portal with pre-populated details
✅ Photographer portal with upload system
✅ Photo categorization and management
✅ AI-powered listing generation
✅ PDF export and marketing packs
✅ Side-by-side photographer selector + folder grid
✅ 5MB photo upload limit
✅ Minimum 8 photos requirement

---

## Demo Login Credentials

### Agent (James Smith - Savills London)
- **Email:** james.smith@savills.com
- **Organization:** Savills
- **Office:** London
- **PIN:** 2025

### Photographer (Anya Rowlings)
- **Email:** photographer@savills.com
- **Organization:** Savills
- **Office:** London
- **PIN:** 2025

---

## Key Files in BetaV4

| File | Purpose |
|------|---------|
| `VERSION.md` | Complete feature documentation |
| `backend/main.py` | Server with auth + photographer endpoints |
| `frontend/index.html` | Agent portal (main interface) |
| `frontend/login.html` | Authentication page |
| `frontend/photographer_portal.html` | Photographer upload interface |
| `frontend/app_v2.js` | Main application logic |
| `auth_data.json` | User data, uploads, organizations |
| `brand_profiles.json` | Brand configurations |

---

## How to Restore BetaV4 (If Needed)

If you ever need to go back to this exact version:

```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator"
git checkout BetaV4
```

To see all saved versions:
```bash
git tag
```

To see what changed in BetaV4:
```bash
git show BetaV4
```

---

## What Was Added in This Session

### 1. Agent Details Pre-population
- James Smith's details auto-fill on portal load
- Office contact phone and email fields
- Agent headshot pre-loaded from server
- 5MB photo size limit (up from 2MB)

### 2. Photographer Multi-tenancy
- Photographer name field (Anya Rowlings)
- Multiple photographers can share same office
- Upload history tracks photographer name
- Dropdown filters folders by photographer

### 3. Layout Improvements
- **Left box:** Photographer selector (250px fixed)
- **Right box:** Folder grid (4 columns, responsive)
- No overlap between dropdown and folders
- Empty state when no selection
- Compact folder cards

### 4. Photo Requirements
- Minimum changed from 15 → 8 photos
- Cover: 1+ required
- Exterior: 3+ required
- Interior: 3+ required

---

## Troubleshooting

### Server won't start
```bash
# Check if another instance is running
netstat -ano | findstr :8000

# Kill the process if needed (replace PID with actual number)
taskkill /PID <PID> /F

# Restart
python -m uvicorn backend.main:app --reload
```

### Changes not showing
- Hard refresh browser: `Ctrl + Shift + R`
- Clear localStorage: Browser Dev Tools → Application → Local Storage → Clear
- Check server auto-reloaded: Look for "Detected changes" in terminal

### Photos not loading
- Check uploads folder exists: `uploads/savills_london/`
- Verify auth_data.json has photographer_uploads section
- Check browser console for 404 errors

---

## Next Time You Start Claude

To continue from BetaV4, just say:
> "I want to continue working on BetaV4. Here's what I need next: [your request]"

Claude will have access to:
- This BETAV4_QUICKSTART.md
- VERSION.md with full feature list
- All committed code in git
- The git tag `BetaV4` for exact restoration

---

## Current Git Status

- **Branch:** master
- **Tag:** BetaV4
- **Commit:** 89dc8ca - "BetaV4 - Multi-tenant Portal with Photographer Integration"
- **Date:** October 14, 2025

---

## File Locations

**Main Directory:**
```
C:\Users\billm\Desktop\Listing agent\property-listing-generator
```

**Agent Headshot:**
```
uploads/agent_assets/james_smith_headshot.png
```

**Photographer Uploads:**
```
uploads/savills_london/[property_name]/[photos]
```

---

🎉 **BetaV4 is ready to go!** 🎉

Start the server and log in with the credentials above.
Everything you built today is saved and version-controlled.

---

*Generated: October 14, 2025*
*Version: BetaV4*
*Status: Stable*
