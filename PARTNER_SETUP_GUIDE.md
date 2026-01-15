# Property Listing Generator V10 - Complete Setup Guide

## Overview

This is a fully functional AI-powered property marketing platform with:
- **Brochure Generator** - AI-generated property descriptions with photo analysis
- **Social Media Generator** - Auto-generate social posts for properties
- **Agent Portal** - Login system with Savills demo data
- **Photo Analysis** - Claude Vision analyzes uploaded property photos
- **Facebook API Integration** - OAuth setup for auto-posting (Phase 1 complete)

**Total codebase: ~77,000 lines of code**

---

## Quick Start (5 minutes)

### Prerequisites
- Python 3.11+ installed
- pip package manager

### Step 1: Install Dependencies
```bash
cd property-listing-generator-V10
pip install -r requirements.txt
```

### Step 2: Start the Server
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 3: Open in Browser
Navigate to: **http://localhost:8000/static/index.html**

That's it! The app is running with all APIs configured.

---

## What's Included

### API Keys (Already Configured in .env)
| Service | Purpose | Status |
|---------|---------|--------|
| ANTHROPIC_API_KEY | Claude language model + vision | ✅ Active |
| IDEAL_POSTCODES_API_KEY | UK address lookup | ✅ Active |

### Directory Structure
```
property-listing-generator-V10/
├── backend/                 # FastAPI application
│   ├── main.py             # Main routes & service initialization
│   ├── config.py           # Environment configuration
│   ├── schemas.py          # Pydantic models
│   ├── models.py           # SQLAlchemy database models
│   ├── oauth_routes.py     # Facebook OAuth integration
│   ├── posts_routes.py     # Social media post management
│   └── admin_routes.py     # Admin endpoints
├── services/               # Business logic layer
│   ├── generator.py        # Core text generation
│   ├── claude_client.py    # Anthropic API wrapper
│   ├── social_generator.py # Social media content
│   ├── brochure_session_service.py # Brochure state management
│   ├── export_service.py   # PDF/ZIP generation
│   └── post_scheduler.py   # Auto-posting scheduler
├── providers/              # External API clients
│   ├── vision_claude.py    # Claude Vision for photo analysis
│   └── geocoding_client.py # Location services
├── frontend/               # UI files
│   ├── index.html          # Main generation page
│   ├── login.html          # Agent portal login
│   ├── dashboard.html      # Material selection hub
│   ├── brochure_editor_v3.html  # Interactive brochure editor
│   ├── social_media_editor_v2.html # Social post editor
│   ├── social_media_calendar.html  # Post scheduling calendar
│   └── quick-post.html     # Quick social post creator
├── .env                    # API keys and configuration
├── requirements.txt        # Python dependencies
└── CLAUDE.md              # AI assistant instructions
```

---

## Key Features & How They Work

### 1. Property Photo Analysis
- Upload property photos on the main page
- Claude Vision analyzes each image
- Extracts: room type, features, style, condition
- Auto-populates property details

### 2. AI Description Generation
- Select tone: Basic, Punchy, Boutique, Premium, Hybrid
- Select audience: Families, Professionals, Investors, etc.
- Click "Generate" - Claude creates 3 variants
- Each variant optimized for the selected channel

### 3. Brochure Editor
- Visual drag-and-drop editor
- Multiple templates available
- Export to PDF with QR codes
- Agency branding customization

### 4. Social Media Generator
- Auto-generates posts from property data
- Platform-specific formatting (Instagram, Facebook, LinkedIn)
- Hashtag suggestions
- Image optimization

### 5. Post Scheduler (Requires PostgreSQL)
- Schedule posts for future publishing
- Calendar view for planning
- Facebook auto-posting via OAuth

---

## Environment Variables (.env)

```env
# Core APIs (Already configured)
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE...
IDEAL_POSTCODES_API_KEY=ak_...

# Claude Models
CLAUDE_MODEL=claude-3-5-haiku-20241022
CLAUDE_VISION_MODEL=claude-3-5-haiku-20241022

# Vision Provider
VISION_PROVIDER=claude

# Features
ENRICHMENT_ENABLED=true
SHRINK_ENABLED=true
EDITOR_SHOW_HYGIENE=true

# Database (Optional - for auto-posting)
DATABASE_URL=postgresql+asyncpg://user:pass@host/db

# Facebook OAuth (Optional - for auto-posting)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_REDIRECT_URI=http://localhost:8000/auth/callback
```

---

## API Endpoints

### Generation
- `POST /generate` - Generate property descriptions
- `POST /analyze-images` - Analyze property photos
- `POST /shrink` - Compress text to target length

### Export
- `POST /export/pdf` - Generate PDF brochure
- `POST /export/pack` - Generate marketing pack (ZIP)

### Social Media
- `POST /social/generate` - Generate social posts
- `GET /posts` - List scheduled posts
- `POST /posts` - Create scheduled post

### Authentication
- `POST /auth/login` - Agent login
- `GET /auth/callback` - OAuth callback

### Health
- `GET /health` - Server health check
- `GET /docs` - Swagger API documentation

---

## Demo Login Credentials

The system includes demo data for Savills agency:

```
Email: demo@savills.com
Password: demo123
```

---

## Troubleshooting

### "ANTHROPIC_API_KEY not found"
The .env file must be in the root directory. Check it exists and contains the key.

### "ModuleNotFoundError"
Run: `pip install -r requirements.txt`

### "Connection refused" errors for PostgreSQL
This is normal if you haven't set up PostgreSQL. Core features work without it - only auto-posting requires the database.

### Photos not analyzing
- Check file size (max 8MB)
- Supported formats: jpg, jpeg, png, webp
- Check Claude API key is valid

### Server won't start
- Check port 8000 isn't in use
- Try: `uvicorn backend.main:app --reload --port 8001`

---

## Production Deployment (Railway)

See `RAILWAY_DATABASE_SETUP.md` for PostgreSQL setup.

### Environment Variables for Railway
```
ANTHROPIC_API_KEY=your_key
DATABASE_URL=postgresql+asyncpg://...  (Railway provides this)
DB_USE_NULL_POOL=true
META_APP_ID=your_facebook_app_id
META_APP_SECRET=your_facebook_app_secret
META_REDIRECT_URI=https://your-app.railway.app/auth/callback
```

---

## Development Commands

### Run with auto-reload
```bash
uvicorn backend.main:app --reload
```

### Run tests
```bash
pytest
```

### Check API docs
Open: http://localhost:8000/docs

---

## Architecture Notes

### Service Initialization Flow
1. Load .env configuration
2. Initialize Claude client (with fallback to mock)
3. Initialize Vision client (Claude Vision)
4. Initialize Enrichment service (location data)
5. Initialize Export service (PDF generation)
6. Start Post Scheduler (if database configured)

### Graceful Degradation
- If Claude API unavailable → Uses mock generation
- If PostgreSQL unavailable → Scheduler disabled, core features work
- If Ideal Postcodes unavailable → Manual address entry

---

## Contact

This codebase was developed collaboratively with Claude Code (Anthropic).

For questions about the architecture or features, the CLAUDE.md file contains detailed context for AI assistants to understand and extend the codebase.
