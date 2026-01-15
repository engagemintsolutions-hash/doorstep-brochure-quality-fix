# Property Listing Generator

AI-powered property listing copy generation for estate agents. Generate human-quality property descriptions with multiple variants, tones, and channel optimizations.

**Version**: v1.11.0 | **Status**: Testing safe workflow with Railway deployment

## Features

- ✨ **AI Generation**: Real Claude API integration for human-quality property copy
- 🎨 **Multiple Tones**: Basic, Punchy, Boutique, Premium, Hybrid
- 📱 **Channel Optimization**: Rightmove, Brochure, Social, Email
- 📊 **Word Count Control**: Target lengths and hard caps per channel
- ✏️ **Editor UI**: Side-by-side variant editing with live counters
- 📉 **Shrink-to-Fit**: Tone-aware text compression with keyword preservation
- 📋 **Hygiene Panel**: Compliance warnings and keyword coverage feedback
- 🔍 **Keyword Coverage**: Weighted priority keywords, channel-specific requirements, configurable via .env
- ✅ **Compliance Checking**: ASA/Rightmove validation with EPC requirements, discriminatory language detection, severity levels (error/warning/info)
- 🖼️ **Image Analysis**: Pluggable vision providers (Mock, Google Cloud Vision)
- 🔄 **EXIF Rotation**: Automatic image orientation correction
- 📝 **Text Compression**: Shrink copy while preserving key information
- 🗺️ **Location Enrichment**: Automatic local context (schools, transport, amenities, parks)
- 📍 **Smart Geocoding**: UK postcode to coordinates via postcodes.io (free, no API key)
- 🏪 **POI Discovery**: Find nearby cafes, parks, gyms, stations via Overpass API
- 💾 **Intelligent Caching**: TTL cache with LRU eviction for API efficiency
- 🤖 **Intelligent Fallback**: Uses mock generation when API unavailable
- 📄 **PDF Export**: Branded multi-page brochures with image optimization
- 📦 **Marketing Pack**: One-click ZIP bundle with PDF, portal payloads, social captions, and email blurbs
- 🎯 **Multi-Channel**: Auto-generate portal summaries, social posts, and email marketing content

## Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: HTML/CSS/JavaScript
- **AI**: Anthropic Claude API (Task 2+)
- **Testing**: pytest, pytest-asyncio
- **CI/CD**: GitHub Actions

## Project Structure

```
property-listing-generator/
├── backend/
│   ├── __init__.py
│   ├── main.py           # FastAPI application
│   ├── schemas.py        # Pydantic models
│   ├── schemas_export.py # Export-specific schemas
│   └── config.py         # Configuration
├── services/
│   ├── __init__.py
│   ├── generator.py      # Main generation logic
│   ├── claude_client.py  # Claude API wrapper
│   ├── length_policy.py  # Word count policies
│   ├── rewrite_compressor.py
│   ├── shrink_service.py # Tone-aware compression
│   ├── keyword_coverage.py
│   ├── compliance_checker.py
│   ├── vision_adapter.py # Vision integration
│   ├── enrichment_service.py  # Location enrichment
│   ├── cache_manager.py  # TTL + LRU cache
│   ├── distance_utils.py # Haversine calculations
│   ├── export_service.py # Export orchestration
│   └── pdf_generator.py  # PDF brochure generation
├── providers/
│   ├── __init__.py
│   ├── vision_client.py  # Vision provider protocol
│   ├── vision_mock.py    # Mock provider (default)
│   ├── vision_google.py  # Google Cloud Vision provider
│   ├── geocoding_client.py  # Postcodes.io client
│   └── places_client.py  # Overpass API client
├── tests/
│   ├── __init__.py
│   ├── test_main.py
│   ├── test_services.py
│   ├── test_schemas.py
│   ├── test_llm_integration.py
│   ├── test_vision_adapter.py
│   ├── test_vision_client.py
│   ├── test_distance_utils.py
│   ├── test_cache_manager.py
│   ├── test_geocoding_client.py
│   ├── test_places_client.py
│   ├── test_enrichment_service.py
│   ├── test_task5_compliance.py
│   ├── test_task5_endpoints.py
│   ├── test_shrink_service.py    # Task 6: Shrink service tests
│   ├── test_editor_endpoints.py  # Task 6: Editor workflow tests
│   ├── test_pdf_generator.py     # Task 7: PDF generation tests
│   ├── test_export_service.py    # Task 7: Export service tests
│   └── test_export_endpoints.py  # Task 7: Export endpoint tests
├── frontend/
│   ├── index.html
│   ├── editor.html        # Editor UI
│   ├── app.js
│   ├── editor.js          # Editor logic
│   ├── styles.css
│   └── editor.css         # Editor styles
├── branding/
│   └── logo_placeholder.png  # Default branding assets
├── exports_tmp/           # Temporary export storage (gitignored)
├── .github/
│   └── workflows/
│       └── ci.yml
├── requirements.txt
├── Dockerfile
├── .env.example
├── pytest.ini
├── README.md
└── CHANGELOG.md
```

## Installation

### Prerequisites

- Python 3.11 or higher
- pip

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd property-listing-generator
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

## Running the Application

### Local Development

```bash
uvicorn backend.main:app --reload
```

The application will be available at:
- Frontend: http://localhost:8000/static/index.html
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Using Docker

```bash
docker build -t property-listing-generator .
docker run -p 8000:8000 property-listing-generator
```

## Testing

### Run all tests

```bash
pytest
```

### Run with coverage

```bash
pytest --cov=backend --cov=services --cov-report=html
```

### Run specific test file

```bash
pytest tests/test_main.py -v
```

## API Endpoints

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0"
}
```

### `POST /generate`

Generate property listing variants.

**Request Body:**
```json
{
  "property_data": {
    "property_type": "detached",
    "bedrooms": 3,
    "bathrooms": 2,
    "condition": "excellent",
    "features": ["garden", "parking"],
    "epc_rating": "B"
  },
  "location_data": {
    "address": "123 Main Street, Manchester",
    "setting": "suburban",
    "postcode": "M1 4BT"
  },
  "target_audience": {
    "audience_type": "families"
  },
  "tone": {
    "tone": "boutique"
  },
  "channel": {
    "channel": "rightmove",
    "target_words": 70
  },
  "include_enrichment": true,
  "include_compliance": true
}
```

**Response:**
```json
{
  "variants": [
    {
      "variant_id": 1,
      "headline": "Charming Family Home in Suburban Manchester",
      "full_text": "This excellent 3 bedroom detached property...",
      "word_count": 68,
      "key_features": ["3 bedrooms", "2 bathrooms", "Garden", "Parking"],
      "score": 0.85
    }
  ],
  "metadata": {
    "channel": "rightmove",
    "tone": "boutique",
    "target_words": 70,
    "enrichment_used": true
  },
  "compliance": {
    "compliant": true,
    "warnings": [],
    "compliance_score": 0.95,
    "keyword_coverage": {
      "covered_keywords": ["bedroom", "bathroom", "garden", "parking", "epc"],
      "missing_keywords": ["kitchen", "school"],
      "coverage_score": 0.85,
      "suggestions": ["Good keyword coverage - all important terms mentioned"]
    },
    "suggestions": ["Copy meets compliance guidelines"]
  }
}
```

### `POST /enrich`

Enrich a location with local context data.

**Request Body:**
```json
{
  "postcode": "M1 4BT"
}
```

OR

```json
{
  "latitude": 53.4808,
  "longitude": -2.2426
}
```

**Response:**
```json
{
  "postcode": "M1 4BT",
  "coordinates": {
    "latitude": 53.4808,
    "longitude": -2.2426
  },
  "amenities": {
    "primary_schools": 3,
    "secondary_schools": 2,
    "stations": 2,
    "cafes": 15,
    "supermarkets": 4,
    "parks": 2,
    "gyms": 5
  },
  "nearest": {
    "primary_schools": {
      "name": "St Mary's Primary",
      "distance_miles": 0.3
    },
    "stations": {
      "name": "Piccadilly Station",
      "distance_miles": 0.5
    }
  },
  "highlights": [
    "Walking distance to Piccadilly Station (0.5 miles)",
    "3 primary schools within 1 mile",
    "Excellent local amenities with cafes and shops nearby"
  ],
  "descriptors": {
    "transport": "excellent",
    "schools": "good",
    "amenities": "outstanding",
    "green_spaces": "moderate"
  }
}
```

### `POST /compliance/check`

Check property listing text for compliance with ASA/Rightmove guidelines and keyword coverage.

**Request Body:**
```json
{
  "text": "This well-maintained 3 bedroom property offers spacious accommodation with garden and parking. EPC rating: C",
  "channel": "rightmove",
  "property_data": {
    "property_type": "detached",
    "bedrooms": 3,
    "bathrooms": 2,
    "condition": "excellent",
    "features": ["garden", "parking"],
    "epc_rating": "C"
  }
}
```

**Response:**
```json
{
  "compliant": true,
  "warnings": [
    {
      "severity": "info",
      "message": "EPC rating available but not mentioned in text",
      "suggestion": "Consider mentioning: 'EPC Rating: C'"
    }
  ],
  "compliance_score": 0.95,
  "keyword_coverage": {
    "covered_keywords": ["bedroom", "garden", "parking", "spacious"],
    "missing_keywords": ["bathroom", "kitchen", "epc"],
    "coverage_score": 0.72,
    "suggestions": [
      "Required keyword missing: mention 'epc' in description",
      "Consider highlighting 'bathroom'",
      "Consider highlighting 'kitchen'"
    ]
  },
  "suggestions": [
    "Copy meets compliance guidelines"
  ]
}
```

**Compliance Features:**
- **ASA/Rightmove Rules**: Detects subjective terms, superlatives, discriminatory language
- **EPC Requirement**: UK property listings must include EPC rating
- **Channel-Specific**: Different word limits per channel (Rightmove: 1000, Social: 300, etc.)
- **Keyword Coverage**: Checks for important keywords (bedrooms, bathrooms, garden, parking, EPC, schools, transport)
- **Severity Levels**: `error` (blocks compliance), `warning` (needs attention), `info` (suggestions)

### `POST /shrink`

Compress text to target word count while preserving tone and keywords.

**Request Body:**
```json
{
  "text": "Long property description with many details about the location and features...",
  "target_words": 50,
  "tone": "punchy",
  "channel": "rightmove",
  "preserve_keywords": ["garden", "parking", "epc"]
}
```

**Parameters:**
- `text` (required): Text to compress
- `target_words` (required): Target word count
- `tone` (optional): Writing tone to preserve (`basic`, `punchy`, `boutique`, `premium`, `hybrid`)
- `channel` (optional): Publishing channel (`rightmove`, `brochure`, `social`, `email`)
- `preserve_keywords` (optional): Keywords that must be preserved during compression

**Response:**
```json
{
  "original_text": "Long property description...",
  "compressed_text": "Shortened description...",
  "original_word_count": 120,
  "compressed_word_count": 48,
  "compression_ratio": 0.4
}
```

**Behavior:**
- Uses Claude API for intelligent, tone-aware compression when available
- Falls back to sentence-based compression when Claude is unavailable
- Always preserves required keywords from `COMPLIANCE_REQUIRED_KEYWORDS` config
- Maintains full sentence boundaries (no awkward cuts)

### `POST /analyze-images`

Analyze property images (multipart/form-data).

**Form Data:**
- `files`: Multiple image files

### `POST /export/pdf`

Generate a branded PDF brochure for a property listing.

**Request Body:**
```json
{
  "listing_data": {
    "address": "123 Oak Street, Manchester M1 1AA",
    "price": "£495,000",
    "headline": "Stunning Victorian family home",
    "main_description": "Full property description...",
    "key_features": ["4 bedrooms", "Period features", "Garden"],
    "room_captions": [
      {"room": "Living Room", "caption": "Spacious with bay window"},
      {"room": "Kitchen", "caption": "Modern fitted kitchen"}
    ],
    "epc_rating": "C",
    "property_type": "detached",
    "bedrooms": 4,
    "bathrooms": 2
  },
  "images": [
    {
      "url": "/path/to/image.jpg",
      "caption": "Front exterior",
      "is_hero": true
    }
  ],
  "branding": {
    "agency_name": "Premier Properties",
    "phone": "+44 161 123 4567",
    "email": "contact@premier.com",
    "primary_color": "#0A5FFF",
    "secondary_color": "#0B1B2B",
    "logo_path": "./branding/logo.png"
  },
  "options": {
    "template": "simple",
    "enable_qr": true,
    "qr_target_url": "https://example.com/property/123"
  }
}
```

**Response:**
```json
{
  "export_id": "pdf_20231007_143022",
  "download_url": "/export/pdf_20231007_143022",
  "size_bytes": 8245120,
  "size_mb": 7.86,
  "size_warning_exceeded": false,
  "meta": {
    "template": "simple",
    "images_included": 5,
    "qr_enabled": true,
    "pages": 4
  }
}
```

**Features:**
- Branded header/footer with agency details
- Cover page with hero image
- Key features and room-by-room captions
- Optional QR code linking to property page
- Automatic image compression to meet size targets
- EPC rating display (or warning if missing)

### `POST /export/pack`

Generate a complete marketing pack (PDF + portal + social + email).

**Request Body:** Same as `/export/pdf`

**Response:**
```json
{
  "export_id": "pack_20231007_143045",
  "download_url": "/export/pack_20231007_143045",
  "size_bytes": 9120450,
  "size_mb": 8.69,
  "contents": {
    "pdf": "listing_brochure.pdf",
    "portal_json": "portal_payload.json",
    "portal_txt": "portal_summary.txt",
    "social_txt": "social_captions.txt",
    "email_txt": "email_blurb.txt",
    "readme": "README.txt"
  }
}
```

**ZIP Contents:**
- **PDF Brochure**: Branded multi-page property brochure
- **Portal Payload** (JSON): Structured data for Rightmove/Zoopla upload
- **Portal Summary** (TXT): Human-readable portal text
- **Social Captions** (TXT): Ultra-short (20-30 words) and standard social posts with hashtags
- **Email Blurb** (TXT): Subject line, body (80-120 words), and call-to-action
- **README** (TXT): Usage instructions and contents manifest

### `GET /export/{export_id}`

Retrieve a previously generated export (PDF or ZIP).

**Parameters:**
- `export_id`: Export identifier from `/export/pdf` or `/export/pack`

**Response:**
- Content-Type: `application/pdf` or `application/zip`
- File download with appropriate filename

**Note:** Exports are retained for 24 hours (configurable via `EXPORT_RETENTION_HOURS`).

## Editor UI

The editor provides a side-by-side interface for refining generated variants.

### Access

After generating listings on the main page, click **"✏️ Open in Editor"** to launch the editor with your generated variants.

### Features

#### Side-by-Side Comparison
- View 2-5 variants simultaneously
- Compare headlines, full text, and key features
- Select best elements from each variant

#### Live Counters
- **Word counters**: Track full text length against target
- **Character counters**: Monitor headline length (target: 50-90 chars)
- **Visual warnings**: Red highlighting when over limits

#### Shrink-to-Fit
- Click **"📉 Shrink to Fit"** on any variant
- Automatically compresses text to channel target
- Preserves tone (punchy stays punchy, premium stays premium)
- Keeps required keywords (garden, parking, EPC, etc.)
- Uses Claude API for intelligent compression

#### Hygiene Panel
Each variant displays:
- **Compliance Score**: 0-100% score based on ASA/Rightmove rules
- **Warnings**: Issues like subjective terms, missing EPC
- **Missing Keywords**: Keywords not found in text
- **Covered Keywords**: Keywords successfully included

Hygiene checks are **non-blocking** - they provide guidance but don't prevent editing or export.

#### Export
- **Text Export**: Download as .txt file
- **JSON Export**: Download as structured JSON with metadata

### Workflow

1. **Generate** variants on main page
2. **Open in Editor** using button
3. **Edit** text inline with live feedback
4. **Shrink** if needed to fit channel limits
5. **Review** hygiene panel for improvements
6. **Export** final version

### Storage

Editor data is stored in browser `sessionStorage` and persists for:
- Current browser session
- 1 hour maximum (auto-expires)

To start fresh, generate new listings from the main page.

## Development

### Running Tests

```bash
# All tests
pytest

# Specific test file
pytest tests/test_main.py

# With output
pytest -v -s

# Watch mode (requires pytest-watch)
ptw
```

### Code Style

Follow PEP 8 guidelines. Use type hints for all functions.

```python
def example_function(param: str) -> dict:
    """
    Function docstring.
    
    Args:
        param: Parameter description
        
    Returns:
        Return value description
    """
    return {"result": param}
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

**Backend Settings:**
- `BACKEND_HOST`: Server host (default: 0.0.0.0)
- `BACKEND_PORT`: Server port (default: 8000)
- `LOG_LEVEL`: Logging level (default: INFO)

**AI API Keys:**
- `ANTHROPIC_API_KEY`: Anthropic API key for Claude text generation

**Vision Provider Settings:**
- `VISION_PROVIDER`: Vision provider to use (default: `mock`)
  - `mock`: Deterministic mock provider (no API key needed)
  - `google`: Google Cloud Vision API
- `VISION_MAX_IMAGE_MB`: Maximum image size in MB (default: 8)
- `VISION_ALLOWED_TYPES`: Comma-separated allowed file types (default: `jpg,jpeg,png,webp`)

**Google Cloud Vision (only needed if `VISION_PROVIDER=google`):**
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to Google Cloud credentials JSON file
  - Download from Google Cloud Console → IAM & Admin → Service Accounts
  - Requires Vision API enabled

**Enrichment Settings:**
- `ENRICHMENT_ENABLED`: Enable/disable location enrichment (default: `true`)
- `ENRICHMENT_CACHE_TTL_SECONDS`: Cache time-to-live (default: `3600` = 1 hour)
- `ENRICHMENT_CACHE_MAX_SIZE`: Maximum cache entries (default: `1000`)
- `ENRICHMENT_TIMEOUT_SECONDS`: API timeout (default: `10` seconds)

**Compliance Settings:**
- `COMPLIANCE_REQUIRED_KEYWORDS`: Comma-separated list of required keywords (default: `garden,parking,schools,epc,transport,bathroom,bedroom,kitchen`)
  - Configurable per agency/deployment
  - Used for keyword coverage analysis
- `COMPLIANCE_STRICT_MODE`: Treat warnings as errors (default: `false`)
  - When `true`, warnings will block compliance
  - Use for stricter compliance enforcement

**Editor Settings:**
- `EDITOR_MAX_VARIANTS`: Maximum variants to display in editor (default: `5`)
  - Controls side-by-side variant layout
- `SHRINK_ENABLED`: Enable/disable shrink-to-fit feature (default: `true`)
  - Set to `false` to disable compression endpoint
- `EDITOR_SHOW_HYGIENE`: Show/hide hygiene panel (default: `true`)
  - Controls compliance warnings and keyword coverage display

### Vision Provider Setup

#### Using Mock Provider (Default)

No setup required! The mock provider works out of the box:

```bash
# .env
VISION_PROVIDER=mock
```

The mock provider returns deterministic results based on filename patterns:
- `kitchen.jpg` → Kitchen analysis with countertops, appliances
- `bedroom.jpg` → Bedroom analysis with wardrobes, windows
- `garden.jpg` → Garden analysis with lawn, patio

#### Using Google Cloud Vision

1. **Create Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Create a new project or select existing

2. **Enable Vision API**
   ```bash
   gcloud services enable vision.googleapis.com
   ```

3. **Create Service Account**
   - IAM & Admin → Service Accounts → Create Service Account
   - Grant "Cloud Vision API User" role
   - Create and download JSON key

4. **Install Google Cloud Vision SDK**
   ```bash
   pip install google-cloud-vision==3.5.0
   ```

5. **Configure Environment**
   ```bash
   # .env
   VISION_PROVIDER=google
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/service-account-key.json
   ```

### Channel Defaults

Default word counts per channel:

| Channel | Target | Hard Cap |
|---------|--------|----------|
| Rightmove | 65 | 80 |
| Brochure | 450 | 600 |
| Social | 30 | 40 |
| Email | 100 | 120 |

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Ensure all tests pass: `pytest`
4. Update CHANGELOG.md
5. Submit a pull request

## CI/CD

GitHub Actions runs on every push:
- Installs dependencies
- Runs pytest
- Lints code with flake8

## License

Proprietary - Internal use only

## Support

For issues or questions, contact the development team.

---

**Current Version**: 1.3.0 (Task 4 - Location Enrichment APIs)
**Last Updated**: 2025-10-07

### Recent Updates (Task 4)

- ✅ Location enrichment with UK postcodes or lat/lon coordinates
- ✅ Geocoding via postcodes.io (no API key required)
- ✅ Points of interest search via Overpass API (OpenStreetMap)
- ✅ Distance calculations with Haversine formula
- ✅ TTL + LRU caching for API results
- ✅ Local area insights (schools, transport, amenities, parks)
- ✅ Automated highlights and quality descriptors
- ✅ `/enrich` endpoint for standalone enrichment
- ✅ Optional enrichment in `/generate` endpoint
- ✅ Graceful degradation when APIs unavailable
- ✅ 53 new tests (126 total tests: 121 passed, 5 skipped)

### Previous Updates (Task 3)

- ✅ Pluggable vision provider system (Mock, Google Cloud Vision)
- ✅ File validation (size, type) with configurable limits
- ✅ Automatic EXIF orientation correction with Pillow
- ✅ Deterministic mock provider for testing/demo
- ✅ Google Cloud Vision integration with retry logic
- ✅ Room classification, feature detection, and caption generation
- ✅ 73 passing tests including 27 new vision-specific tests
- ✅ 8-20 word caption validation

### Previous Updates (Task 2)

- ✅ Integrated Anthropic Claude API for real text generation
- ✅ Advanced prompt engineering with tone/audience/channel-specific guidance
- ✅ Automatic fallback to mock generation when API unavailable
- ✅ Temperature variation for creating diverse variants
