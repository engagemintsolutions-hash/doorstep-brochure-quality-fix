# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
# Local development with auto-reload
uvicorn backend.main:app --reload

# Or using the main entry point
python -m backend.main

# Docker
docker build -t property-listing-generator .
docker run -p 8000:8000 property-listing-generator
```

Access points:
- Frontend: http://localhost:8000/static/index.html
- Editor: http://localhost:8000/static/editor.html
- API Docs: http://localhost:8000/docs

### Testing

```bash
# Run all tests
pytest

# Single test file
pytest tests/test_main.py -v

# Single test function
pytest tests/test_main.py::test_health_check -v

# With coverage report
pytest --cov=backend --cov=services --cov-report=html

# Verbose output (see print statements)
pytest -v -s
```

## Architecture Overview

### Three-Tier Structure

1. **Backend** (`backend/`): FastAPI application layer
   - `main.py`: Routes, service initialization, error handling
   - `schemas.py`: Pydantic models for validation
   - `schemas_export.py`: Export-specific schemas
   - `config.py`: Settings loaded from environment variables

2. **Services** (`services/`): Business logic layer
   - `generator.py`: Core text generation orchestration
   - `claude_client.py`: Anthropic API wrapper with error handling
   - `enrichment_service.py`: Location enrichment orchestration
   - `compliance_checker.py`: ASA/Rightmove validation rules
   - `keyword_coverage.py`: Required keyword analysis
   - `shrink_service.py`: Intelligent text compression
   - `export_service.py`: PDF and ZIP pack generation
   - `pdf_generator.py`: ReportLab PDF creation
   - `cache_manager.py`: TTL + LRU caching
   - `length_policy.py`: Channel-specific word count rules

3. **Providers** (`providers/`): External API clients
   - `vision_client.py`: Protocol for vision providers
   - `vision_mock.py`: Deterministic mock (default)
   - `vision_google.py`: Google Cloud Vision integration
   - `geocoding_client.py`: postcodes.io client (free, no key)
   - `places_client.py`: Overpass API client (OpenStreetMap)

### Service Orchestration Flow

```
User Request (POST /generate)
    ↓
1. EnrichmentService (optional)
   - geocoding_client.lookup_postcode() → coordinates
   - places_client.search_nearby() → POIs for 7 categories
   - cache_manager (TTL + LRU) → reduce API calls
   - Generate highlights and descriptors
    ↓
2. Generator.generate_variants()
   - Build prompt with property + location + enrichment data
   - ClaudeClient.generate_completion() → 3 variants (temp: 0.7, 0.8, 0.9)
   - Or _generate_mock() if Claude unavailable
   - Parse response into structured variants
    ↓
3. ComplianceChecker + KeywordCoverage (optional)
   - check_compliance() → ASA/Rightmove rule validation
   - analyze_coverage() → keyword presence scoring
   - Return warnings (error/warning/info severity)
    ↓
4. Return GenerateResponse with variants + metadata + compliance
```

### Export Flow

```
POST /export/pdf → generate_pdf()
    - pdf_generator.generate() → ReportLab PDF
    - Image optimization (resize if > PDF_MAX_SIZE_MB)
    - Optional QR code generation
    - Save to exports_tmp/

POST /export/pack → generate_marketing_pack()
    - generate_pdf() → listing_brochure.pdf
    - generate_portal_payloads() → portal_payload.json, portal_summary.txt
    - generate_social_content() → social_captions.txt (ultra-short + standard)
    - generate_email_content() → email_blurb.txt (subject + body + CTA)
    - ZIP all files with README.txt
    - Retention: 24 hours (configurable via EXPORT_RETENTION_HOURS)
```

## Key Patterns and Conventions

### Service Initialization with Graceful Fallbacks

In `backend/main.py`, services are initialized with try/except blocks to allow partial functionality:

```python
# Claude client initialization
try:
    claude_client = ClaudeClient()
    if not claude_client.is_available():
        logger.warning("Claude API not available - using mock generation")
except Exception as e:
    logger.warning(f"Failed to initialize Claude client: {e}")
    claude_client = None

# Generator works with OR without Claude
generator = Generator(claude_client=claude_client)
```

**Pattern**: Services should degrade gracefully. Generator uses mock generation if Claude unavailable. Enrichment is optional (controlled by `include_enrichment` flag).

### Prompt Engineering in Generator

The `generator.py` module builds detailed prompts with:
- **Tone guidance**: Different instructions for basic/punchy/boutique/premium/hybrid
- **Audience targeting**: Specific language for families/professionals/investors/retirees/first-time buyers/downsizers
- **Channel optimization**: Format guidance for Rightmove/brochure/social/email
- **Length policies**: Target words and hard caps per channel
- **Enrichment integration**: Local area insights from `_format_enrichment_data()`

**Pattern**: When modifying generation, update prompt templates in `_build_prompt()` and tone/audience/channel guidance dictionaries.

### Pluggable Provider Pattern

Vision and other external APIs use a provider protocol:

```python
# In providers/__init__.py
class VisionProvider(Enum):
    MOCK = "mock"
    GOOGLE = "google"

def make_vision_client(provider: VisionProvider, config: dict):
    if provider == VisionProvider.GOOGLE:
        return GoogleVisionClient(config)
    return MockVisionClient()

# In backend/main.py
provider = VisionProvider(settings.vision_provider.lower())
vision_client = make_vision_client(provider, {"google_credentials_path": ...})
```

**Pattern**: To add new providers (e.g., AWS Rekognition), create `vision_aws.py`, implement the protocol from `vision_client.py`, and update `make_vision_client()`.

### Cache Management

The `CacheManager` implements TTL (Time To Live) + LRU (Least Recently Used) eviction:
- Used for geocoding results (1 hour TTL)
- Used for POI searches (1 hour TTL)
- Configured via `ENRICHMENT_CACHE_TTL_SECONDS` and `ENRICHMENT_CACHE_MAX_SIZE`

**Pattern**: Cache keys use format `category:identifier` (e.g., `geocode:M1 4BT`, `places:53.4808,-2.2426:primary_schools`)

### Compliance and Keyword Coverage

Two separate but complementary services:
- **ComplianceChecker**: Rule-based validation (subjective terms, discriminatory language, EPC requirements)
- **KeywordCoverage**: Scoring based on required keywords from `COMPLIANCE_REQUIRED_KEYWORDS`

Both return severity levels: `error` (blocks), `warning` (attention), `info` (suggestions)

**Pattern**: Compliance is non-blocking in the editor UI (`COMPLIANCE_STRICT_MODE=false` by default). Set to `true` for strict enforcement.

### Length Policies

`LengthPolicy` defines word count targets and hard caps per channel:

| Channel | Target | Hard Cap |
|---------|--------|----------|
| Rightmove | 65 | 80 |
| Brochure | 450 | 600 |
| Social | 30 | 40 |
| Email | 100 | 120 |

**Pattern**: Targets are "ideal" lengths, hard caps are absolute maximums. ShrinkService uses these when compressing text.

## Configuration

### Required Environment Variables

```bash
# API Keys
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE  # Required for real generation

# Vision Provider (default: mock)
VISION_PROVIDER=mock  # mock | google
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json  # If using google

# Feature Flags
ENRICHMENT_ENABLED=true  # Location enrichment
SHRINK_ENABLED=true      # Text compression endpoint
EDITOR_SHOW_HYGIENE=true # Compliance panel in editor

# Compliance Keywords (comma-separated)
COMPLIANCE_REQUIRED_KEYWORDS=garden,parking,schools,epc,transport,bathroom,bedroom,kitchen
COMPLIANCE_STRICT_MODE=false  # true = warnings block compliance

# Export Settings
PDF_MAX_SIZE_MB=10
EXPORT_TMP_DIR=./exports_tmp
EXPORT_RETENTION_HOURS=24
```

See `.env.example` for all available settings.

### Vision Provider Setup

**Mock Provider** (default): No setup required, deterministic results based on filename patterns.

**Google Cloud Vision**:
1. Enable Vision API in Google Cloud Console
2. Create service account with "Cloud Vision API User" role
3. Download JSON credentials
4. Set `VISION_PROVIDER=google` and `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`
5. Install optional dependency: `pip install google-cloud-vision==3.5.0`

## Testing Patterns

### Async Tests

All async functions require `pytest-asyncio` (configured in `pytest.ini`):

```python
import pytest

@pytest.mark.asyncio
async def test_generate_variants():
    generator = Generator()
    variants = await generator.generate_variants(request)
    assert len(variants) == 3
```

### HTTP Mocking with respx

For testing external API clients:

```python
import respx
import httpx

@pytest.mark.asyncio
@respx.mock
async def test_geocoding_client():
    respx.get("https://api.postcodes.io/postcodes/M14BT").mock(
        return_value=httpx.Response(200, json={"result": {"latitude": 53.48, "longitude": -2.24}})
    )

    client = GeocodingClient()
    result = await client.lookup_postcode("M1 4BT")
    assert result["latitude"] == 53.48
```

### Fixtures for Common Objects

Define reusable fixtures in `tests/conftest.py` or individual test files:

```python
@pytest.fixture
def sample_request():
    return GenerateRequest(
        property_data=PropertyData(...),
        location_data=LocationData(...),
        target_audience=TargetAudience(...),
        tone=TonePreset(...),
        channel=ChannelPreset(...)
    )
```

## Important Implementation Notes

### Adding New Channels

1. Add enum value to `Channel` in `backend/schemas.py`
2. Add length policy in `services/length_policy.py` (`get_target_for_channel()`)
3. Add channel guidance in `services/generator.py` (`_build_prompt()`)
4. Add validation in `services/compliance_checker.py` if needed
5. Update tests in `tests/test_length_policy.py` and `tests/test_services.py`

### Adding New Tones

1. Add enum value to `ToneStyle` in `backend/schemas.py`
2. Add tone guidance in `services/generator.py` (`tone_guidance` dict in `_build_prompt()`)
3. Update ShrinkService to handle new tone in compression logic
4. Add test variants in `tests/test_services.py`

### Modifying Compliance Rules

Edit `services/compliance_checker.py`:
- `_check_subjective_claims()`: Detects superlatives and subjective terms
- `_check_discriminatory_language()`: Detects protected characteristics
- `_check_epc_requirement()`: UK-specific EPC validation
- Add new rule methods and call from `check_compliance()`

### Customizing PDF Templates

PDF generation uses ReportLab in `services/pdf_generator.py`:
- `_draw_cover_page()`: Hero image and property headline
- `_draw_details_page()`: Key features and description
- `_draw_image_pages()`: Room photos with captions
- Styling configured via branding parameters (colors, logo, fonts)

**Pattern**: To add new templates, create new draw methods and select based on `options.template` parameter.

## Working Directory Context

The application root is `property-listing-generator/`. When running commands:
- Use `python -m backend.main` (not `python backend/main.py`)
- Tests are in `tests/` and automatically discovered by pytest
- Static files served from `frontend/`
- Temporary exports stored in `exports_tmp/` (gitignored)
