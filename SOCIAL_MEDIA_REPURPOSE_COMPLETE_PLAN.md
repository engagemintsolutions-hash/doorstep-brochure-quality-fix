# Social Media Repurpose System - Complete Implementation Plan

## Phase Plan & Exit Criteria

### Phase 0: MVP - Portal → Social Repurpose (Week 1-2)
**Goal:** Ship working repurpose flow with guardrails, editable output, and basic analytics

**Exit Criteria:**
- ✅ Repurpose button in brochure editor opens modal
- ✅ User selects FB/IG, clicks "Generate"
- ✅ System produces 3 caption variants (short/medium/long) with guardrails enforced
- ✅ Hashtag suggestions (6-8 tags) appear with A/B sets
- ✅ User can edit any field inline
- ✅ Preview shows IG 1:1 and FB 1.91:1 mockups with selected cover photo
- ✅ Download exports caption.txt + images at correct dimensions
- ✅ One analytics card: "Website Clicks (Last 7 Days)" with trend arrow
- ✅ No generic slop in generated captions (validated by test suite)

**Deliverables:**
- `POST /repurpose` endpoint
- `social_media_generator.py` service
- `social_media_repurpose.js` frontend modal
- Guardrails engine with banned phrases list
- Hashtag generation algorithm
- Image cropping utility (1:1, 4:5, 1.91:1)

---

### Phase 1: Newsletter/Email Repurpose + Multi-Platform (Week 3)
**Goal:** Add email marketing output and full FB/IG feature parity

**Exit Criteria:**
- ✅ User can select "Newsletter" or "Social" in repurpose modal
- ✅ Newsletter generates: Hero image, 60-word summary, bullet features, location blurb, CTA button
- ✅ Output is HTML email template (responsive, tested in Outlook/Gmail/Apple Mail)
- ✅ Both FB and IG can be selected simultaneously
- ✅ IG gets 4:5 portrait option alongside 1:1 square
- ✅ FB generates suggested first comment (property details in structured format)

**Deliverables:**
- Newsletter template system (3 variants: Classic, Modern, Minimal)
- Email HTML generator with inline CSS
- Platform-specific post-processing (FB first comment, IG alt text)

---

### Phase 2: Advanced Analytics Dashboard (Week 4)
**Goal:** Full analytics dashboard with Lead Signals and Winning Instructions

**Exit Criteria:**
- ✅ Dashboard shows 8 cards: Impressions, Reach, Website Clicks, Profile Visits, Saves, Follows, Engagement Rate, Lead Score
- ✅ Each card shows 7-day trend with % delta and sparkline
- ✅ Lead Score (0-100) calculated from weighted signals
- ✅ "Winning Instructions" panel shows 3 actionable insights (e.g., "Carousel posts drive +32% saves")
- ✅ Filter by date range, template type, posting time
- ✅ OAuth flow for FB/IG connects and refreshes tokens automatically

**Deliverables:**
- `analytics_service.py` with Meta Graph API integration
- Lead scoring algorithm with configurable weights
- Winning instructions generator (rule-based + LLM hybrid)
- OAuth token manager with refresh logic
- Dashboard frontend with charts (Chart.js or similar)

---

### Phase 3: Future-Ready UI + Smart Features (Week 5)
**Goal:** Polish, edge cases, and scaffolding for future paid ads/CRM

**Exit Criteria:**
- ✅ Template picker with visual previews (3 templates fully working)
- ✅ Scheduler stub: "Schedule Post" button shows "Coming Soon" modal with ISchedulerAdapter interface
- ✅ Paid ads tile: "Google Ads" and "Facebook Ads" cards in dashboard with "Coming Soon" badges
- ✅ Hashtag A/B testing: user can compare "Reach" vs "Local" sets and see which performed better
- ✅ Regenerate per-section: user clicks "🔄" next to any caption field to regenerate just that part
- ✅ Error handling: quota exceeded, token expired, generic content detection all show helpful messages

**Deliverables:**
- Template system JSON descriptors + visual renderer
- ISchedulerAdapter interface (stub only)
- Paid ads UI placeholders
- Per-field regeneration API
- Comprehensive error handling and user feedback

---

## Architecture (Text Diagram)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React/Vue/Vanilla JS)              │
├─────────────────────────────────────────────────────────────────────┤
│  Brochure Editor                                                     │
│    └─> [Repurpose Button] ──────────────────┐                      │
│                                               │                      │
│  Repurpose Modal                              │                      │
│    ├─> Platform Selector (FB/IG)             │                      │
│    ├─> Content Strategy Picker               │                      │
│    ├─> Template Picker                       │                      │
│    └─> [Generate] Button ─────────> POST /repurpose                │
│                                               │                      │
│  Preview & Edit Screen                        │                      │
│    ├─> Editable Caption Fields               │                      │
│    ├─> Hashtag Suggestions                   │                      │
│    ├─> Image Previews (platform mockups)     │                      │
│    ├─> [Regenerate Section] ────────> POST /generate/caption       │
│    ├─> [Regenerate Hashtags] ───────> POST /generate/hashtags      │
│    └─> [Download] ──────────────────> GET /jobs/{id}/download      │
│                                               │                      │
│  Analytics Dashboard                          │                      │
│    ├─> Metrics Cards                          │                      │
│    ├─> Lead Score Panel                       │                      │
│    ├─> Winning Instructions                   │                      │
│    └─> [Connect FB/IG] ──────────> OAuth Flow                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         BACKEND API (FastAPI)                        │
├─────────────────────────────────────────────────────────────────────┤
│  POST /repurpose                                                     │
│    ├─> Validates request (listing data, platforms, strategy)        │
│    ├─> Creates RepurposeJob (async task)                           │
│    └─> Returns job_id                                               │
│                                                                      │
│  GET /jobs/{id}                                                      │
│    ├─> Checks job status (pending/processing/complete/failed)      │
│    └─> Returns generated assets when complete                       │
│                                                                      │
│  POST /generate/caption                                              │
│    ├─> Regenerates single caption section                          │
│    └─> Returns new variant                                          │
│                                                                      │
│  POST /generate/hashtags                                             │
│    ├─> Generates hashtag sets (Reach vs Local)                     │
│    └─> Returns A/B options                                          │
│                                                                      │
│  GET /analytics/{accountId}                                          │
│    ├─> Fetches FB/IG metrics via Meta Graph API                    │
│    ├─> Calculates Lead Score                                        │
│    ├─> Generates Winning Instructions                               │
│    └─> Returns dashboard data                                       │
│                                                                      │
│  OAuth Endpoints                                                     │
│    ├─> GET /auth/facebook/authorize                                 │
│    ├─> GET /auth/facebook/callback                                  │
│    └─> POST /auth/refresh (token refresh)                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  SocialMediaGenerator                                                │
│    ├─> extract_listing_facts() → structured data                   │
│    ├─> generate_captions() → calls ClaudeClient with prompts       │
│    ├─> apply_guardrails() → validates output against rules         │
│    ├─> generate_variants() → produces short/medium/long            │
│    └─> format_for_platform() → FB vs IG specific tweaks            │
│                                                                      │
│  HashtagGenerator                                                    │
│    ├─> extract_taxonomy() → location, type, price, features        │
│    ├─> build_candidate_pool() → from taxonomy + brand tags         │
│    ├─> dedupe_and_filter() → removes duplicates, checks banned list│
│    ├─> create_ab_sets() → "Reach" (broad) vs "Local" (geo)        │
│    └─> Returns 6-8 tags per set                                     │
│                                                                      │
│  ImageProcessor                                                      │
│    ├─> crop_for_platform() → 1:1, 4:5, 1.91:1 with smart crop     │
│    ├─> apply_template() → overlays text, borders, branding         │
│    ├─> generate_mockup() → platform UI preview (IG/FB frame)       │
│    └─> Returns image URLs                                           │
│                                                                      │
│  AnalyticsService                                                    │
│    ├─> fetch_metrics() → Meta Graph API calls                      │
│    ├─> calculate_lead_score() → weighted formula                   │
│    ├─> detect_trends() → week-over-week deltas                     │
│    ├─> generate_winning_instructions() → rules + LLM               │
│    └─> Returns AnalyticsSnapshot                                    │
│                                                                      │
│  GuardrailsEngine                                                    │
│    ├─> check_banned_phrases() → red-flag list                      │
│    ├─> validate_structure() → Hook + Bullets + CTA format          │
│    ├─> check_specificity() → must reference actual listing facts   │
│    ├─> enforce_length() → caps per platform                        │
│    └─> Returns validation result + suggestions                      │
│                                                                      │
│  TemplateEngine                                                      │
│    ├─> load_template() → JSON descriptor                           │
│    ├─> apply_typography() → font, size, weight                     │
│    ├─> apply_colors() → brand colors + border accents              │
│    ├─> render() → PIL/Pillow image generation                      │
│    └─> Returns final image                                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────────┤
│  Claude API (Anthropic)                                              │
│    └─> Caption generation with guardrails in system prompt          │
│                                                                      │
│  Meta Graph API                                                      │
│    ├─> Facebook Pages API (metrics, posts)                         │
│    └─> Instagram Insights API (reach, engagement)                  │
│                                                                      │
│  OAuth Provider (Meta)                                               │
│    └─> Token exchange and refresh                                   │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  PostgreSQL / SQLite                                                 │
│    ├─> repurpose_jobs (id, listing_id, status, created_at)         │
│    ├─> generated_assets (job_id, type, content, metadata)          │
│    ├─> social_accounts (user_id, platform, access_token, expires)  │
│    ├─> analytics_snapshots (account_id, timestamp, metrics_json)   │
│    └─> templates (id, name, config_json)                           │
│                                                                      │
│  File Storage (S3 / Local)                                           │
│    └─> Generated images (social posts, newsletter headers)          │
└─────────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
1. User clicks "Repurpose" → Frontend sends listing data to `/repurpose`
2. Backend creates RepurposeJob → queues async task
3. SocialMediaGenerator extracts facts → builds prompts → calls Claude
4. GuardrailsEngine validates output → flags issues → regenerates if needed
5. HashtagGenerator creates tag sets → dedupes → returns A/B options
6. ImageProcessor crops photos → applies template → generates mockups
7. Job completes → assets stored → Frontend polls `/jobs/{id}`
8. User edits fields → clicks "Regenerate Section" → single field updated
9. User downloads → ZIP contains caption.txt + images at platform sizes

---

## Data Schemas (TypeScript/JSON)

```typescript
// ============================================================================
// LISTING & BROCHURE DATA
// ============================================================================

interface Listing {
  id: string;
  address: string;
  postcode: string;
  price: number;
  currency: string; // "GBP", "USD"
  bedrooms: number;
  bathrooms: number;
  propertyType: "house" | "flat" | "bungalow" | "new-build";
  sizeSqft?: number;
  tenure: "freehold" | "leasehold";
  epcRating?: string;
  features: string[]; // ["garden", "parking", "new-kitchen", "period-features"]
  location: {
    city: string;
    area: string;
    latitude?: number;
    longitude?: number;
  };
  enrichment?: {
    schools: string;
    transport: string;
    amenities: string;
  };
}

interface BrochureContent {
  headline: string;
  overview: string; // Main description (300-500 words)
  roomDescriptions: Record<string, string>; // "kitchen": "Modern fitted kitchen..."
  keyFeatures: string[]; // Bulleted list
  photos: Photo[];
}

interface Photo {
  id: string;
  url: string;
  category: "cover" | "exterior" | "interior" | "kitchen" | "bedrooms" | "bathrooms" | "garden";
  order: number;
  caption?: string;
}

// ============================================================================
// REPURPOSE REQUEST & JOB
// ============================================================================

interface RepurposeRequest {
  listing: Listing;
  brochure: BrochureContent;
  platforms: ("facebook" | "instagram")[]; // ["facebook", "instagram"]
  strategy: "highlight" | "location" | "price"; // Content angle
  template: string; // "classic", "modern", "minimal"
  selectedPhotos?: string[]; // Photo IDs (if not provided, auto-select cover + 2 best)
}

interface RepurposeJob {
  id: string; // UUID
  userId: string;
  listingId: string;
  status: "pending" | "processing" | "complete" | "failed";
  request: RepurposeRequest;
  assets?: GeneratedAsset[];
  error?: string;
  createdAt: string; // ISO timestamp
  completedAt?: string;
}

// ============================================================================
// GENERATED ASSETS
// ============================================================================

interface GeneratedAsset {
  id: string;
  jobId: string;
  type: "social_post" | "newsletter" | "email";
  platform?: "facebook" | "instagram";
  content: SocialPost | Newsletter;
  metadata: {
    templateUsed: string;
    strategyUsed: string;
    regenerationCount: number;
    guardrailsViolations: string[]; // If any were caught and fixed
  };
}

interface SocialPost {
  variants: PostVariant[]; // 3 variants (short, medium, long)
  hashtags: HashtagSet;
  images: ImageVariant[];
  platformSpecs: PlatformSpecs;
}

interface PostVariant {
  length: "short" | "medium" | "long";
  caption: string;
  structure: {
    hook: string; // First 1-2 sentences (≤12 words)
    bullets: string[]; // 2-3 fact bullets
    cta: string; // Call to action
  };
  characterCount: number;
  editable: boolean; // Always true
}

interface HashtagSet {
  reach: string[]; // Broad hashtags (e.g., #PropertyForSale, #DreamHome)
  local: string[]; // Geo-specific (e.g., #ManchesterHomes, #DidsburyProperty)
  recommended: string[]; // Combined set (6-8 tags)
  brand: string[]; // Agency tags (e.g., #{{BrandName}})
}

interface ImageVariant {
  platform: "facebook" | "instagram";
  size: "1:1" | "4:5" | "1.91:1";
  dimensions: { width: number; height: number }; // e.g., 1080x1080
  url: string; // Generated image URL
  mockupUrl?: string; // Platform UI preview (optional)
  templateApplied: string;
}

interface PlatformSpecs {
  platform: "facebook" | "instagram";
  maxCaptionLength: number; // FB: 63206, IG: 2200
  recommendedCaptionLength: number; // FB: 200, IG: 150
  hashtagLimit?: number; // IG: 30
  recommendedHashtags: number; // 6-8
  aspectRatios: string[]; // ["1:1", "4:5"]
  bestPostingTimes: string[]; // ["18:00-20:00", "06:00-08:00"]
}

// ============================================================================
// NEWSLETTER / EMAIL
// ============================================================================

interface Newsletter {
  html: string; // Full HTML email template
  sections: {
    hero: {
      imageUrl: string;
      headline: string;
    };
    summary: string; // ≤60 words
    features: string[]; // Bullet points
    location: string; // Location blurb (1-2 sentences)
    cta: {
      text: string; // "View Full Details"
      url: string; // {{ListingURL}}
    };
  };
  plainText: string; // Plain text fallback
  metadata: {
    templateUsed: string;
    preheaderText: string; // First 50 chars for email preview
  };
}

// ============================================================================
// ANALYTICS & LEAD SIGNALS
// ============================================================================

interface AnalyticsSnapshot {
  accountId: string;
  platform: "facebook" | "instagram";
  dateRange: {
    start: string; // ISO date
    end: string;
  };
  metrics: {
    impressions: MetricValue;
    reach: MetricValue;
    websiteClicks: MetricValue;
    profileVisits: MetricValue;
    saves: MetricValue;
    follows: MetricValue;
    likes: MetricValue;
    comments: MetricValue;
    shares: MetricValue;
    engagementRate: MetricValue; // (likes + comments + shares) / reach
  };
  leadScore: {
    score: number; // 0-100
    trend: "up" | "down" | "stable";
    delta: number; // % change week-over-week
    breakdown: Record<string, number>; // Contribution per signal
  };
  winningInstructions: WinningInstruction[];
}

interface MetricValue {
  current: number;
  previous: number; // Week-over-week comparison
  delta: number; // % change
  trend: "up" | "down" | "stable";
  sparkline?: number[]; // Last 7 days
}

interface WinningInstruction {
  id: string;
  priority: "high" | "medium" | "low";
  type: "template" | "timing" | "content" | "hashtags";
  message: string; // e.g., "Carousel posts drive +32% saves. Use Template 'Modern' next time."
  data: {
    metric: string; // "saves"
    improvement: number; // 32 (%)
    recommendation: string; // "Use Template 'Modern' with 2-line hook and 5 bullets"
  };
  actionable: boolean; // Can user act on this immediately?
}

// ============================================================================
// TEMPLATE SYSTEM
// ============================================================================

interface Template {
  id: string;
  name: string; // "Classic", "Modern", "Minimal"
  description: string;
  preview: string; // URL to preview image
  config: {
    typography: {
      fontFamily: string; // "Inter", "Playfair Display"
      sizes: {
        headline: number; // 48px
        body: number; // 24px
        caption: number; // 16px
      };
      weights: {
        headline: number; // 700
        body: number; // 400
        caption: number; // 300
      };
    };
    colors: {
      primary: string; // Brand color (hex)
      accent: string; // Border color (hex)
      text: string; // Text color (hex)
      background: string; // Background (hex or "transparent")
    };
    layout: {
      borderStyle: "none" | "solid" | "dashed";
      borderWidth: number; // 4px
      borderRadius: number; // 8px
      padding: number; // 32px (safe padding from edges)
      textBoxPosition: "bottom" | "top" | "overlay";
      textBoxOpacity: number; // 0.9 (semi-transparent)
    };
    branding: {
      logoPosition: "bottom-right" | "top-left" | "bottom-left";
      logoSize: number; // 80px width
      showWebsite: boolean; // Include {{WebsiteURL}} in text box
    };
  };
  platforms: ("facebook" | "instagram")[]; // Optimized for which platforms
}

// ============================================================================
// GUARDRAILS & VALIDATION
// ============================================================================

interface GuardrailsResult {
  passed: boolean;
  violations: Violation[];
  suggestions: string[];
  score: number; // 0-100 (content quality score)
}

interface Violation {
  severity: "error" | "warning" | "info";
  rule: string; // "banned_phrase", "missing_structure", "too_generic"
  message: string; // "Caption contains banned phrase: 'nestled'"
  location?: string; // "caption.hook" (field path)
  suggestion?: string; // "Replace with specific location detail"
}

// ============================================================================
// OAUTH & SOCIAL ACCOUNTS
// ============================================================================

interface SocialAccount {
  id: string;
  userId: string;
  platform: "facebook" | "instagram";
  accountId: string; // Platform-specific ID
  accountName: string; // Display name
  accessToken: string; // Encrypted
  refreshToken?: string; // Encrypted
  expiresAt: string; // ISO timestamp
  scopes: string[]; // ["pages_show_list", "pages_read_engagement"]
  status: "active" | "expired" | "revoked";
  lastSyncedAt?: string;
}
```

---

## Content Pipeline & Prompts (with Guardrails)

### Pipeline Steps

```
1. EXTRACTION
   ├─> Input: Listing + BrochureContent
   ├─> Extract: address, beds, baths, price, features, location, enrichment
   ├─> Normalize: price formatting, feature deduplication
   └─> Output: StructuredFacts (JSON)

2. TEMPLATING
   ├─> Input: StructuredFacts + Strategy (highlight/location/price)
   ├─> Select: Content angle and template structure
   ├─> Build: Prompt with placeholders filled
   └─> Output: PromptTemplate

3. LLM GENERATION
   ├─> Input: PromptTemplate + Guardrails (system prompt)
   ├─> Call: ClaudeClient.generate()
   ├─> Temperature: 0.7 for variant 1, 0.8 for variant 2, 0.9 for variant 3
   └─> Output: RawCaption[]

4. GUARDRAILS VALIDATION
   ├─> Input: RawCaption[]
   ├─> Check: Banned phrases, structure, specificity, length
   ├─> If violations: regenerate OR auto-fix OR flag for human review
   └─> Output: ValidatedCaption[]

5. POST-PROCESSING
   ├─> Input: ValidatedCaption[]
   ├─> Apply: Brand injection ({{BrandName}}, {{OfficePhone}})
   ├─> Format: Platform-specific (FB first comment, IG alt text)
   └─> Output: FinalCaption[]

6. HUMAN EDIT
   ├─> Input: FinalCaption[] (editable fields)
   ├─> User: Modifies any field inline
   ├─> User: Clicks "Regenerate Section" (calls pipeline from step 3 for that field only)
   └─> Output: EditedCaption[]

7. PUBLISH
   ├─> Input: EditedCaption[] + ImageVariant[]
   ├─> Export: caption.txt + images (1:1, 4:5, 1.91:1)
   └─> Optional: Direct publish to FB/IG via API (future)
```

---

### Guardrails System Prompt

```
SYSTEM PROMPT FOR SOCIAL MEDIA CAPTION GENERATION

You are a professional property marketing copywriter creating social media captions for {{Platform}} (Facebook or Instagram).

CRITICAL RULES (NON-NEGOTIABLE):
1. **Grounded in Facts**: Every claim must reference actual listing details (bedrooms, bathrooms, location, features, price). NEVER make up features or use vague descriptions.

2. **Banned Phrases** (DO NOT USE):
   - "nestled", "tucked away", "stunning", "breathtaking", "must-see", "dream home", "perfect for", "ideal for", "won't last long", "rare opportunity", "unique opportunity", "sanctuary", "oasis", "exudes", "boasts"

3. **Structure** (MANDATORY):
   - Hook (1-2 sentences, ≤12 words): attention-grabbing, specific fact
   - Bullets (2-3 points): concrete features with details
   - CTA (1 sentence): clear action (view listing, book viewing, enquire)

4. **Tone**: Professional, specific, conversational (not corporate). Use active voice. Avoid flowery language.

5. **Length Targets**:
   - Short variant: 80-120 characters (hook + CTA only)
   - Medium variant: 120-180 characters (hook + 1-2 bullets + CTA)
   - Long variant: 180-250 characters (full structure)

6. **Platform Specifics**:
   - Instagram: Use 1-2 emojis max (location 📍, price 💰, beds 🛏️). Friendly tone.
   - Facebook: Use emojis sparingly (1-2 total). More conversational, community-focused.

7. **Brand Injection**: Always end with "{{BrandName}} | {{OfficePhone}}" (we'll add this automatically, don't include in your output).

INPUTS YOU WILL RECEIVE:
- Property details: address, beds, baths, price, type, features
- Location enrichment: schools, transport, amenities
- Strategy: "highlight" (focus on key feature), "location" (emphasize area), or "price" (value angle)

OUTPUT FORMAT (JSON):
{
  "short": {
    "hook": "4-bed family home in Didsbury",
    "cta": "View listing at {{ListingURL}}"
  },
  "medium": {
    "hook": "4-bed family home in Didsbury with south-facing garden",
    "bullets": ["Modern kitchen with integrated appliances", "Walking distance to top-rated schools"],
    "cta": "Book a viewing today"
  },
  "long": {
    "hook": "Family living at its best in Didsbury",
    "bullets": [
      "4 spacious bedrooms with fitted wardrobes",
      "South-facing garden perfect for summer entertaining",
      "Modern kitchen with Bosch appliances"
    ],
    "cta": "Call {{OfficePhone}} to arrange a viewing"
  }
}

EXAMPLES:

BAD ❌:
"This stunning property is nestled in a sought-after location and boasts breathtaking views. A rare opportunity not to be missed! Your dream home awaits."
(Violations: banned phrases, no facts, generic, no structure)

GOOD ✅:
Hook: "4-bed Edwardian house in Didsbury's conservation area"
Bullets:
  - Original period features throughout (stained glass, fireplaces)
  - 2,000 sq ft across three floors
  - Off-street parking for two cars
CTA: "View full details at {{ListingURL}}"

Now generate 3 variants (short, medium, long) based on the listing data below.
```

---

### Example Prompts Per Strategy

#### Strategy: "Highlight" (Focus on Standout Feature)

```
LISTING DATA:
- Address: 123 Main Street, Didsbury, Manchester M20 2AB
- Bedrooms: 4
- Bathrooms: 2
- Property Type: Semi-detached house
- Price: £650,000
- Key Feature: "Professionally landscaped south-facing garden (60ft)"
- Other Features: Modern kitchen, period features, off-street parking

STRATEGY: Highlight the garden as the hero feature.

Generate captions that lead with the garden, then support with other strong points. Make it visual and specific.
```

**Expected Output (Medium Variant):**
```
Hook: "60ft south-facing garden in the heart of Didsbury"
Bullets:
  - Professionally landscaped with entertaining area and mature planting
  - 4-bed semi-detached house with period features
  - Modern kitchen and 2 bathrooms
CTA: "Book your viewing – call {{OfficePhone}}"
```

---

#### Strategy: "Location" (Emphasize Neighborhood)

```
LISTING DATA:
- Address: 123 Main Street, Didsbury, Manchester M20 2AB
- Bedrooms: 4
- Bathrooms: 2
- Property Type: Semi-detached house
- Price: £650,000
- Location Enrichment:
  - Schools: "Within 0.5 miles of two Outstanding-rated primary schools"
  - Transport: "8-minute walk to Didsbury Village tram stop"
  - Amenities: "Burton Road's independent shops and cafes on your doorstep"

STRATEGY: Lead with location appeal for families.

Generate captions that emphasize the convenience and community of Didsbury, then introduce the property.
```

**Expected Output (Long Variant):**
```
Hook: "Family living in Didsbury's most connected street"
Bullets:
  - 8-minute walk to tram stop (15 mins to city center)
  - Two Outstanding primary schools within 0.5 miles
  - Burton Road's shops, cafes, and restaurants at your doorstep
  - 4-bed semi-detached house with modern kitchen and garden
CTA: "Arrange a viewing – {{OfficePhone}}"
```

---

#### Strategy: "Price" (Value/Investment Angle)

```
LISTING DATA:
- Address: 123 Main Street, Didsbury, Manchester M20 2AB
- Bedrooms: 4
- Bathrooms: 2
- Property Type: Semi-detached house
- Price: £650,000
- Market Context: "Recent comparables sold at £680k-£720k"

STRATEGY: Position as excellent value in a competitive market.

Generate captions that lead with the price point and what buyers get for it, creating urgency without clichés.
```

**Expected Output (Medium Variant):**
```
Hook: "4-bed Didsbury semi at £650k (recent sales: £680-720k)"
Bullets:
  - 2,000 sq ft with period features and modern kitchen
  - South-facing garden and off-street parking
CTA: "Early viewings recommended – call {{OfficePhone}}"
```

---

### Guardrails Banned Phrases List (Comprehensive)

```python
BANNED_PHRASES = [
    # AI slop
    "nestled", "tucked away", "stunning", "breathtaking", "must-see", "rare opportunity",
    "unique opportunity", "dream home", "perfect for", "ideal for", "sanctuary", "oasis",
    "exudes", "boasts", "affords", "commands", "epitomizes", "epitomises",

    # Urgency clichés
    "won't last long", "act fast", "don't miss out", "once in a lifetime",

    # Vague descriptors
    "sought-after", "highly desirable", "prestigious", "exclusive", "luxury" (unless justified by price),

    # Flowery language
    "verdant", "resplendent", "immaculate", "impeccable", "tranquil", "serene",

    # Generic marketing
    "everyday luxury", "curated living", "lifestyle choice", "resort-style", "hotel-inspired",

    # Redundant phrases
    "This property", "The space", "creates an atmosphere", "offers a unique", "provides the perfect"
]
```

---

### Validation Rules

```python
class GuardrailsEngine:
    def validate(self, caption: dict) -> GuardrailsResult:
        violations = []

        # 1. Check banned phrases
        full_text = " ".join([caption.get("hook", ""), *caption.get("bullets", []), caption.get("cta", "")])
        for phrase in BANNED_PHRASES:
            if phrase.lower() in full_text.lower():
                violations.append(Violation(
                    severity="error",
                    rule="banned_phrase",
                    message=f"Contains banned phrase: '{phrase}'",
                    suggestion=f"Replace with specific factual detail"
                ))

        # 2. Check structure
        if "hook" not in caption or len(caption["hook"]) == 0:
            violations.append(Violation(
                severity="error",
                rule="missing_structure",
                message="Missing required 'hook' field"
            ))

        if len(caption.get("hook", "").split()) > 12:
            violations.append(Violation(
                severity="warning",
                rule="hook_too_long",
                message="Hook should be ≤12 words for impact"
            ))

        # 3. Check specificity (must mention at least 2 concrete facts)
        concrete_facts = [
            "bed", "bedroom", "bath", "bathroom", "sqft", "sq ft", "garden", "parking",
            "kitchen", "£", "conservation", "victorian", "edwardian", "period", "walk"
        ]
        fact_count = sum(1 for fact in concrete_facts if fact.lower() in full_text.lower())
        if fact_count < 2:
            violations.append(Violation(
                severity="error",
                rule="too_generic",
                message="Caption must include at least 2 specific property facts",
                suggestion="Add details like bed count, features, location specifics"
            ))

        # 4. Check length (platform-specific)
        char_count = len(full_text)
        if char_count > 250:
            violations.append(Violation(
                severity="warning",
                rule="too_long",
                message=f"Caption is {char_count} chars (recommend ≤250 for readability)"
            ))

        # 5. Calculate quality score
        score = 100
        score -= len([v for v in violations if v.severity == "error"]) * 20
        score -= len([v for v in violations if v.severity == "warning"]) * 10
        score = max(0, score)

        return GuardrailsResult(
            passed=len([v for v in violations if v.severity == "error"]) == 0,
            violations=violations,
            suggestions=self._generate_suggestions(violations),
            score=score
        )

    def _generate_suggestions(self, violations: List[Violation]) -> List[str]:
        suggestions = []
        if any(v.rule == "banned_phrase" for v in violations):
            suggestions.append("Use specific measurements, dates, or factual descriptions instead of superlatives")
        if any(v.rule == "too_generic" for v in violations):
            suggestions.append("Reference at least 2 concrete property details (e.g., '4 bedrooms', 'south-facing garden', 'off-street parking')")
        if any(v.rule == "hook_too_long" for v in violations):
            suggestions.append("Shorten the hook to 8-12 words for maximum impact")
        return suggestions
```

---

## UX Flows & Wireframe Notes

### Flow 1: Portal → Social Repurpose

```
1. USER STARTS IN BROCHURE EDITOR
   - Has completed brochure with photos and text
   - Clicks [Repurpose] button in toolbar

2. REPURPOSE MODAL OPENS (STEP 1: SELECT PLATFORMS)
   ┌──────────────────────────────────────────────────────────────┐
   │  Repurpose for Social Media                        [X Close] │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │  Select Platform(s):                                         │
   │  ┌──────────┐  ┌──────────┐                                 │
   │  │    📘    │  │    📷    │                                 │
   │  │ Facebook │  │ Instagram│                                 │
   │  └──────────┘  └──────────┘                                 │
   │  [✓ Selected]  [✓ Selected]                                 │
   │                                                               │
   │  Content Strategy:                                           │
   │  ( ) Highlight Feature  (•) Location Appeal  ( ) Price/Value│
   │                                                               │
   │  Visual Template:                                            │
   │  ┌────────┐ ┌────────┐ ┌────────┐                          │
   │  │Classic │ │Modern  │ │Minimal │                          │
   │  └────────┘ └────────┘ └────────┘                          │
   │  [Preview] [✓ Selected] [Preview]                           │
   │                                                               │
   │                    [Generate Content →]                      │
   └──────────────────────────────────────────────────────────────┘

   - Both FB and IG are selected (multi-select checkboxes)
   - "Location Appeal" strategy is chosen (radio buttons)
   - "Modern" template is selected (visual previews on hover)
   - [Generate Content] button is primary action (blue, prominent)

3. LOADING STATE
   ┌──────────────────────────────────────────────────────────────┐
   │  Generating your social media content...                     │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │              [🔄 Spinner animation]                          │
   │                                                               │
   │  Creating captions (3 variants)...                    ✓     │
   │  Generating hashtags (Reach & Local sets)...          ✓     │
   │  Processing images (1:1, 4:5, 1.91:1)...            ⏳    │
   │  Applying template...                                        │
   │                                                               │
   │  This usually takes 5-10 seconds                             │
   └──────────────────────────────────────────────────────────────┘

   - Progress indicators for each step
   - Checkmarks as steps complete
   - Estimated time shown

4. PREVIEW & EDIT SCREEN (STEP 2: REVIEW & DOWNLOAD)
   ┌──────────────────────────────────────────────────────────────┐
   │  Social Media Preview              [← Back] [Download All]  │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │  Platform: [Facebook ▼]  (dropdown: Facebook, Instagram)    │
   │                                                               │
   │  ┌─────────────────────┐  ┌──────────────────────────────┐ │
   │  │                     │  │  Caption (editable)    [🔄]  │ │
   │  │  [Visual Preview]   │  │                               │ │
   │  │  1080x1080px        │  │  Family living in Didsbury's │ │
   │  │  (IG Square)        │  │  most connected street        │ │
   │  │                     │  │                               │ │
   │  │  Shows cover photo  │  │  • 8-min walk to tram stop  │ │
   │  │  with text overlay  │  │  • Two Outstanding schools  │ │
   │  │  and border accent  │  │  • 4-bed semi with garden   │ │
   │  │                     │  │                               │ │
   │  │  [Agency Logo]      │  │  Call 0161-XXX-XXXX to view │ │
   │  └─────────────────────┘  │                               │ │
   │                            │  Savills | 0161-XXX-XXXX     │ │
   │  Aspect Ratio:             └──────────────────────────────┘ │
   │  [1:1 Square ▼]                                             │
   │                            ┌──────────────────────────────┐ │
   │  Variant:                  │  Hashtags           [🔄]    │ │
   │  [◉ Medium]  [ Short ]     │                               │ │
   │  [ Long ]                  │  Reach Set:                   │ │
   │                            │  #PropertyForSale #UKHomes   │ │
   │                            │  #FamilyHome #NewListing     │ │
   │                            │                               │ │
   │                            │  Local Set:                   │ │
   │                            │  #ManchesterProperty         │ │
   │                            │  #DidsburyHomes              │ │
   │                            │                               │ │
   │                            │  [Switch to Local Set]        │ │
   │                            └──────────────────────────────┘ │
   │                                                               │
   │  ✅ Caption length: 187 chars (optimal for Facebook)         │
   │  ✅ Image size: 1080x1080px (meets platform requirements)    │
   │                                                               │
   │  [Copy Caption]  [Download Image]  [Download Both]          │
   └──────────────────────────────────────────────────────────────┘

   KEY UI ELEMENTS:
   - Platform dropdown switches between FB and IG previews
   - Visual mockup shows real platform UI (IG feed frame or FB post layout)
   - Caption is fully editable (contenteditable div or textarea)
   - [🔄] buttons next to each section regenerate JUST that field
   - Variant selector (Short/Medium/Long) updates caption and preview
   - Aspect ratio dropdown (1:1, 4:5, 1.91:1) updates image crop
   - Hashtag sets shown separately (Reach vs Local) with toggle
   - Validation checks shown as green checkmarks at bottom
   - Three download options: caption only, image only, or both

5. USER INTERACTIONS:

   5a. Edit caption inline
       - User clicks in caption textarea
       - Types changes directly
       - Character count updates live
       - Validation re-checks on blur

   5b. Regenerate section
       - User clicks [🔄] next to caption
       - Modal shows: "Regenerating caption..."
       - New variant appears in 2-3 seconds
       - User can accept or regenerate again

   5c. Switch variants
       - User clicks "Long" variant button
       - Caption updates to long-form version
       - Visual preview updates with new text

   5d. Change aspect ratio
       - User selects "4:5 Portrait" from dropdown
       - Image re-crops intelligently (smart crop to keep focus)
       - Preview updates with new dimensions

   5e. Switch hashtag sets
       - User clicks "Switch to Local Set"
       - Hashtags update to geo-focused tags
       - Can regenerate hashtags with [🔄] button

6. DOWNLOAD
   - Clicking "Download All" creates ZIP with:
     - caption_facebook.txt
     - caption_instagram.txt
     - image_facebook_1.91x1.png
     - image_instagram_1x1.png
     - image_instagram_4x5.png
     - hashtags_reach.txt
     - hashtags_local.txt
   - User gets notification: "Downloaded to C:\Users\...\Downloads\repurpose_[timestamp].zip"
```

---

### Flow 2: Portal → Newsletter Repurpose

```
1. USER CLICKS [Repurpose] → SELECTS "NEWSLETTER"
   ┌──────────────────────────────────────────────────────────────┐
   │  Repurpose Content                                 [X Close] │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │  Output Format:                                              │
   │  ( ) Social Media  (•) Newsletter/Email                     │
   │                                                               │
   │  Template:                                                    │
   │  ┌────────┐ ┌────────┐ ┌────────┐                          │
   │  │Classic │ │Modern  │ │Minimal │                          │
   │  │Layout  │ │Layout  │ │Layout  │                          │
   │  └────────┘ └────────┘ └────────┘                          │
   │                                                               │
   │                    [Generate Newsletter →]                   │
   └──────────────────────────────────────────────────────────────┘

2. NEWSLETTER PREVIEW & EDIT
   ┌──────────────────────────────────────────────────────────────┐
   │  Newsletter Preview                    [← Back] [Download]  │
   ├──────────────────────────────────────────────────────────────┤
   │                                                               │
   │  ┌────────────────────────────────────────────────────────┐ │
   │  │  HERO IMAGE (cover photo, full-width)                  │ │
   │  │  [Family home exterior, professional crop]             │ │
   │  └────────────────────────────────────────────────────────┘ │
   │                                                               │
   │  Subject Line (editable):                          [🔄]    │
   │  ┌────────────────────────────────────────────────────────┐ │
   │  │ New Listing: 4-Bed Family Home in Didsbury            │ │
   │  └────────────────────────────────────────────────────────┘ │
   │                                                               │
   │  Summary (≤60 words):                              [🔄]    │
   │  ┌────────────────────────────────────────────────────────┐ │
   │  │ Beautifully presented 4-bedroom semi-detached house   │ │
   │  │ in Didsbury's conservation area. Features include...  │ │
   │  └────────────────────────────────────────────────────────┘ │
   │                                                               │
   │  Key Features:                                     [🔄]    │
   │  • 4 spacious bedrooms with fitted wardrobes                │
   │  • South-facing garden (60ft) with entertaining area        │
   │  • Modern kitchen with Bosch appliances                     │
   │  • Period features throughout (stained glass, fireplaces)   │
   │  • Off-street parking for two cars                          │
   │                                                               │
   │  Location:                                         [🔄]    │
   │  ┌────────────────────────────────────────────────────────┐ │
   │  │ Located in Didsbury's most sought-after street, just  │ │
   │  │ 8 minutes' walk from the tram stop and within 0.5    │ │
   │  │ miles of two Outstanding-rated primary schools.       │ │
   │  └────────────────────────────────────────────────────────┘ │
   │                                                               │
   │  Call to Action:                                   [🔄]    │
   │  ┌────────────────────────────────────────────────────────┐ │
   │  │        [View Full Details]        (button)            │ │
   │  │  Links to: {{ListingURL}}                             │ │
   │  └────────────────────────────────────────────────────────┘ │
   │                                                               │
   │  ✅ Email renders correctly in Outlook, Gmail, Apple Mail    │
   │  ✅ Mobile-responsive (tested on iOS and Android)            │
   │                                                               │
   │  [Download HTML]  [Download Plain Text]  [Send Test Email] │
   └──────────────────────────────────────────────────────────────┘

   KEY DIFFERENCES FROM SOCIAL:
   - Longer-form content (60-word summary vs 12-word hook)
   - Hero image is full-width banner (not square)
   - Features are bulleted list (5-7 items)
   - Location gets dedicated paragraph (2-3 sentences)
   - CTA is button (not text link)
   - Output is HTML file (responsive email template)
   - Option to send test email to user's inbox
```

---

### Wireframe Notes

**Visual Design Principles:**
1. **Borders Only** - Accent colors used for borders/frames, not backgrounds
2. **Clean Center** - Text and photos centered, no over-designed artwork
3. **Editable Fields** - Every text element has [🔄] regenerate button
4. **Platform Mockups** - Show real IG/FB UI so user knows what post will look like
5. **Live Validation** - Green checkmarks show when content meets platform requirements
6. **Smart Crops** - Image processor detects faces/focal points and crops intelligently
7. **Responsive** - Modal works on desktop and tablet (mobile = full screen)

**Color Scheme:**
- Primary action: #2563EB (blue)
- Secondary action: #64748B (gray)
- Success: #10B981 (green)
- Warning: #F59E0B (amber)
- Border accent: User's brand color (configurable)

**Typography:**
- Headings: Inter 600 (16px)
- Body: Inter 400 (14px)
- Captions: Inter 400 (12px)
- Monospace (for character counts): Monaco 12px

---

## Smart Social (Hashtag) Algorithm

### Hashtag Generation Pipeline

```python
class HashtagGenerator:
    """
    Generate platform-appropriate hashtags from listing taxonomy.

    Goals:
    - Relevant: Match property type, location, price band
    - Discoverable: Mix broad reach tags + local intent tags
    - Non-spammy: 6-8 tags max, no duplicates, no banned phrases
    - A/B Testable: Produce "Reach" and "Local" sets for comparison
    """

    def generate(
        self,
        listing: Listing,
        platform: str,
        brand_tags: List[str]
    ) -> HashtagSet:
        # Step 1: Extract taxonomy
        taxonomy = self._extract_taxonomy(listing)

        # Step 2: Build candidate pool
        candidates = self._build_candidate_pool(taxonomy, platform)

        # Step 3: Dedupe and filter
        filtered = self._dedupe_and_filter(candidates)

        # Step 4: Create A/B sets
        reach_set = self._create_reach_set(filtered)
        local_set = self._create_local_set(filtered, taxonomy.location)

        # Step 5: Add brand tags
        reach_set = self._add_brand_tags(reach_set, brand_tags)
        local_set = self._add_brand_tags(local_set, brand_tags)

        # Step 6: Build recommended set (hybrid)
        recommended = self._build_recommended(reach_set, local_set)

        return HashtagSet(
            reach=reach_set,
            local=local_set,
            recommended=recommended,
            brand=brand_tags
        )

    def _extract_taxonomy(self, listing: Listing) -> Taxonomy:
        """Extract categorizable attributes."""
        return Taxonomy(
            property_type=listing.propertyType,  # "house", "flat", "bungalow"
            location={
                "city": listing.location.city,
                "area": listing.location.area,
                "region": self._infer_region(listing.location.city)
            },
            price_band=self._categorize_price(listing.price),  # "under-500k", "500-750k", "750k+"
            features=listing.features,  # ["garden", "parking", "new-kitchen"]
            bedrooms=listing.bedrooms
        )

    def _build_candidate_pool(
        self,
        taxonomy: Taxonomy,
        platform: str
    ) -> List[HashtagCandidate]:
        """Build pool of candidate hashtags from taxonomy + library."""
        candidates = []

        # Property type tags
        if taxonomy.property_type == "house":
            candidates.extend([
                HashtagCandidate("#HouseForSale", category="type", reach=HIGH),
                HashtagCandidate("#FamilyHome", category="type", reach=MEDIUM),
                HashtagCandidate("#HouseTour", category="type", reach=HIGH)  # Instagram-specific
            ])
        elif taxonomy.property_type == "flat":
            candidates.extend([
                HashtagCandidate("#FlatForSale", category="type", reach=MEDIUM),
                HashtagCandidate("#ApartmentLiving", category="type", reach=HIGH),
                HashtagCandidate("#CityLiving", category="type", reach=HIGH)
            ])

        # Location tags (geo-specific)
        city = taxonomy.location["city"]
        area = taxonomy.location["area"]
        candidates.extend([
            HashtagCandidate(f"#{city}Property", category="location", reach=MEDIUM),
            HashtagCandidate(f"#{city}Homes", category="location", reach=MEDIUM),
            HashtagCandidate(f"#{area}Property", category="location", reach=LOW),  # Very local
            HashtagCandidate(f"#{area}", category="location", reach=LOW)
        ])

        # Price band tags
        if taxonomy.price_band == "750k+":
            candidates.extend([
                HashtagCandidate("#LuxuryProperty", category="price", reach=HIGH),
                HashtagCandidate("#PremiumHomes", category="price", reach=MEDIUM)
            ])

        # Feature tags
        if "garden" in taxonomy.features:
            candidates.append(HashtagCandidate("#GardenProperty", category="feature", reach=MEDIUM))
        if "parking" in taxonomy.features:
            candidates.append(HashtagCandidate("#Parking", category="feature", reach=LOW))
        if "new-kitchen" in taxonomy.features:
            candidates.append(HashtagCandidate("#ModernKitchen", category="feature", reach=MEDIUM))

        # Broad reach tags (generic but popular)
        candidates.extend([
            HashtagCandidate("#PropertyForSale", category="generic", reach=HIGH),
            HashtagCandidate("#RealEstate", category="generic", reach=HIGH),
            HashtagCandidate("#NewListing", category="generic", reach=HIGH),
            HashtagCandidate("#UKProperty", category="generic", reach=HIGH)
        ])

        return candidates

    def _dedupe_and_filter(
        self,
        candidates: List[HashtagCandidate]
    ) -> List[HashtagCandidate]:
        """Remove duplicates, banned phrases, and overly generic tags."""
        # Dedupe by lowercase tag
        seen = set()
        deduped = []
        for candidate in candidates:
            tag_lower = candidate.tag.lower()
            if tag_lower not in seen:
                seen.add(tag_lower)
                deduped.append(candidate)

        # Filter banned phrases
        filtered = [
            c for c in deduped
            if not any(banned in c.tag.lower() for banned in BANNED_HASHTAG_PHRASES)
        ]

        # Remove overly generic (if too many better options)
        # (Logic: if we have 20+ candidates, drop generic "reach=HIGH" tags)
        if len(filtered) > 20:
            filtered = [c for c in filtered if c.category != "generic"]

        return filtered

    def _create_reach_set(
        self,
        candidates: List[HashtagCandidate]
    ) -> List[str]:
        """Create 'Reach' set: prioritize HIGH reach tags for discovery."""
        # Sort by reach (HIGH first), then by category diversity
        sorted_candidates = sorted(
            candidates,
            key=lambda c: (-c.reach.value, c.category)
        )

        # Take top 6-8 tags
        reach_set = [c.tag for c in sorted_candidates[:8]]
        return reach_set

    def _create_local_set(
        self,
        candidates: List[HashtagCandidate],
        location: dict
    ) -> List[str]:
        """Create 'Local' set: prioritize location-specific tags."""
        # Filter for location + type + feature tags (skip generic)
        local_candidates = [
            c for c in candidates
            if c.category in ["location", "type", "feature"]
        ]

        # Sort by specificity (location tags first)
        sorted_local = sorted(
            local_candidates,
            key=lambda c: (c.category != "location", -c.reach.value)
        )

        # Take top 6-8 tags
        local_set = [c.tag for c in sorted_local[:8]]
        return local_set

    def _add_brand_tags(
        self,
        tag_set: List[str],
        brand_tags: List[str]
    ) -> List[str]:
        """Append brand tags (e.g., #{{BrandName}}) to the end."""
        # Limit total to 8 tags (platform recommendation)
        if len(tag_set) + len(brand_tags) > 8:
            tag_set = tag_set[:8 - len(brand_tags)]
        return tag_set + brand_tags

    def _build_recommended(
        self,
        reach_set: List[str],
        local_set: List[str]
    ) -> List[str]:
        """Build hybrid 'recommended' set (50/50 reach + local)."""
        # Take 4 from reach, 4 from local
        recommended = reach_set[:4] + local_set[:4]
        # Dedupe (in case of overlap)
        recommended = list(dict.fromkeys(recommended))
        return recommended[:8]


# ============================================================================
# DATA STRUCTURES
# ============================================================================

class Taxonomy(NamedTuple):
    property_type: str
    location: dict
    price_band: str
    features: List[str]
    bedrooms: int


class HashtagCandidate(NamedTuple):
    tag: str
    category: str  # "type", "location", "price", "feature", "generic"
    reach: ReachLevel  # HIGH, MEDIUM, LOW


class ReachLevel(Enum):
    HIGH = 3    # 100k+ posts
    MEDIUM = 2  # 10k-100k posts
    LOW = 1     # <10k posts (very niche)


BANNED_HASHTAG_PHRASES = [
    "nestled", "stunning", "mustsee", "dreamhome", "exclusive", "luxury" (unless price justifies)
]
```

---

### Example Outputs

**Listing:**
- Type: Semi-detached house
- Location: Didsbury, Manchester
- Price: £650,000
- Bedrooms: 4
- Features: garden, parking, new-kitchen

**Generated Hashtags:**

```json
{
  "reach": [
    "#PropertyForSale",
    "#UKProperty",
    "#HouseForSale",
    "#FamilyHome",
    "#RealEstate",
    "#NewListing",
    "#Savills"
  ],
  "local": [
    "#ManchesterProperty",
    "#DidsburyHomes",
    "#Didsbury",
    "#HouseForSale",
    "#GardenProperty",
    "#ModernKitchen",
    "#Savills"
  ],
  "recommended": [
    "#PropertyForSale",
    "#UKProperty",
    "#HouseForSale",
    "#FamilyHome",
    "#ManchesterProperty",
    "#DidsburyHomes",
    "#GardenProperty",
    "#Savills"
  ],
  "brand": ["#Savills"]
}
```

---

## Analytics: Metrics → Lead Signals + "Winning Instructions"

### Data Sources & OAuth

**Meta Graph API Endpoints:**
- Facebook Pages: `/v18.0/{page-id}/insights`
- Instagram Business: `/v18.0/{ig-user-id}/insights`

**Required Scopes:**
- `pages_show_list` - List user's pages
- `pages_read_engagement` - Read post metrics
- `instagram_basic` - Read IG profile info
- `instagram_manage_insights` - Read IG insights

**Token Management:**
```typescript
interface OAuthFlow {
  // 1. Initiate OAuth
  GET /auth/facebook/authorize
    → Redirects to Meta OAuth dialog
    → User grants permissions

  // 2. Callback with code
  GET /auth/facebook/callback?code=XXX
    → Exchange code for access_token
    → Store token + refresh_token (encrypted)
    → Return success page

  // 3. Auto-refresh before expiry
  POST /auth/refresh
    → Check if token expires in <7 days
    → Call Meta /oauth/access_token with refresh_token
    → Update stored token
}
```

---

### Lead Score Calculation

```python
class AnalyticsService:
    """
    Transform social media metrics into actionable lead signals.
    """

    LEAD_SIGNAL_WEIGHTS = {
        "website_clicks": 5,     # Direct intent (clicks to listing URL)
        "profile_visits": 4,      # High intent (researching agency)
        "saves": 3,               # Future intent (bookmarked post)
        "shares": 3,              # Referral potential
        "follows": 3,             # Relationship building
        "comments": 2,            # Engagement (may include questions)
        "likes": 1,               # Low intent (passive engagement)
        "impressions": 0,         # Reach metric (not intent)
        "reach": 0                # Reach metric (not intent)
    }

    def calculate_lead_score(
        self,
        metrics: Dict[str, int],
        reach: int
    ) -> LeadScore:
        """
        Calculate 0-100 score based on weighted intent signals.

        Formula:
        LeadScore = (Σ(signal × weight) / reach) × 1000
        Capped at 100.
        """
        weighted_sum = sum(
            metrics.get(signal, 0) * weight
            for signal, weight in self.LEAD_SIGNAL_WEIGHTS.items()
        )

        if reach == 0:
            return LeadScore(score=0, breakdown={})

        # Normalize by reach (converts to per-impression rate)
        score = (weighted_sum / reach) * 1000
        score = min(100, score)  # Cap at 100

        # Breakdown: contribution per signal
        breakdown = {
            signal: (metrics.get(signal, 0) * weight / reach) * 1000
            for signal, weight in self.LEAD_SIGNAL_WEIGHTS.items()
            if metrics.get(signal, 0) > 0
        }

        return LeadScore(
            score=round(score, 1),
            breakdown=breakdown
        )

    def detect_trends(
        self,
        current: Dict[str, int],
        previous: Dict[str, int]
    ) -> Dict[str, MetricValue]:
        """Week-over-week trend analysis."""
        trends = {}

        for metric in current.keys():
            curr_val = current.get(metric, 0)
            prev_val = previous.get(metric, 0)

            if prev_val == 0:
                delta = 100 if curr_val > 0 else 0
            else:
                delta = ((curr_val - prev_val) / prev_val) * 100

            trend = "stable"
            if delta > 5:
                trend = "up"
            elif delta < -5:
                trend = "down"

            trends[metric] = MetricValue(
                current=curr_val,
                previous=prev_val,
                delta=round(delta, 1),
                trend=trend
            )

        return trends

    def generate_winning_instructions(
        self,
        snapshots: List[AnalyticsSnapshot],
        post_metadata: List[PostMetadata]
    ) -> List[WinningInstruction]:
        """
        Analyze historical data to produce actionable insights.

        Rules:
        1. Template Performance: Which template drove most saves/clicks?
        2. Timing: Which posting times drove most profile visits?
        3. Content Strategy: Which strategy (highlight/location/price) performed best?
        4. Hashtags: Which hashtag set (reach/local) drove more engagement?
        """
        instructions = []

        # Rule 1: Template Performance
        template_analysis = self._analyze_by_template(snapshots, post_metadata)
        if template_analysis.best_template:
            instructions.append(WinningInstruction(
                id=str(uuid.uuid4()),
                priority="high",
                type="template",
                message=f"{template_analysis.best_template} template drove +{template_analysis.improvement}% {template_analysis.metric}. Use this template for your next post.",
                data={
                    "metric": template_analysis.metric,
                    "improvement": template_analysis.improvement,
                    "recommendation": f"Use '{template_analysis.best_template}' template with a 2-line hook and 5 bullets"
                },
                actionable=True
            ))

        # Rule 2: Timing
        timing_analysis = self._analyze_by_timing(snapshots, post_metadata)
        if timing_analysis.best_time:
            instructions.append(WinningInstruction(
                id=str(uuid.uuid4()),
                priority="medium",
                type="timing",
                message=f"Posts at {timing_analysis.best_time} local time led to +{timing_analysis.improvement}% profile visits. Schedule your next posts here.",
                data={
                    "metric": "profile_visits",
                    "improvement": timing_analysis.improvement,
                    "recommendation": f"Post between {timing_analysis.best_time} for maximum visibility"
                },
                actionable=True
            ))

        # Rule 3: Content Strategy
        strategy_analysis = self._analyze_by_strategy(snapshots, post_metadata)
        if strategy_analysis.best_strategy:
            instructions.append(WinningInstruction(
                id=str(uuid.uuid4()),
                priority="high",
                type="content",
                message=f"'{strategy_analysis.best_strategy}' strategy posts got +{strategy_analysis.improvement}% more {strategy_analysis.metric}. Focus on this angle.",
                data={
                    "metric": strategy_analysis.metric,
                    "improvement": strategy_analysis.improvement,
                    "recommendation": f"Use '{strategy_analysis.best_strategy}' strategy for your next 3 posts"
                },
                actionable=True
            ))

        # Sort by priority
        instructions.sort(key=lambda i: {"high": 0, "medium": 1, "low": 2}[i.priority])

        return instructions[:3]  # Return top 3
```

---

### Dashboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  Social Media Analytics                      [Last 7 Days ▼]      │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  METRICS OVERVIEW                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐│
│  │ Impressions  │ │    Reach     │ │ Website      │ │ Profile   ││
│  │              │ │              │ │ Clicks       │ │ Visits    ││
│  │   12,450     │ │    8,320     │ │     127      │ │    64     ││
│  │   ↑ +18%    │ │   ↑ +12%    │ │   ↑ +34%    │ │  ↑ +22%  ││
│  │ _/‾‾‾\_ (7d) │ │ _/‾‾‾\_ (7d) │ │ _/‾‾‾\_ (7d) │ │ _/‾\ (7d)││
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘│
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐│
│  │    Saves     │ │   Follows    │ │ Engagement   │ │  Lead     ││
│  │              │ │              │ │ Rate         │ │  Score    ││
│  │     89       │ │      24      │ │    6.8%      │ │    73     ││
│  │   ↑ +45%    │ │   ↑ +9%     │ │   ↑ +1.2%   │ │  ↑ +28%  ││
│  │ _/‾‾‾\_ (7d) │ │ __/‾\__ (7d) │ │ _/‾‾‾\_ (7d) │ │ _/‾\ (7d)││
│  └──────────────┘ └──────────────┘ └──────────────┘ └───────────┘│
│                                                                     │
│  LEAD SIGNALS (What matters for business)                          │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Lead Score: 73/100  ↑ +28% vs last week                    │  │
│  │                                                               │  │
│  │  Top Contributors:                                            │  │
│  │  ██████████████ Website Clicks (34 points)                  │  │
│  │  ████████ Profile Visits (22 points)                        │  │
│  │  █████ Saves (17 points)                                    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  WINNING INSTRUCTIONS (What to do next)                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  1. 🎨 Template: "Modern" drove +32% saves. Use this        │  │
│  │     template with a 2-line hook and 5 bullets next time.    │  │
│  │     [Apply to Next Post]                                     │  │
│  │                                                               │  │
│  │  2. ⏰ Timing: Posts at 6-8pm led to +27% profile visits.   │  │
│  │     Schedule your next 3 posts in this window.              │  │
│  │     [Schedule Posts]                                         │  │
│  │                                                               │  │
│  │  3. 📍 Strategy: "Location" posts got +19% more clicks.     │  │
│  │     Focus on neighborhood benefits in your next caption.     │  │
│  │     [Use Location Strategy]                                  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  [Connect Instagram] [View Detailed Report] [Export Data]         │
└────────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- 8 metric cards with sparklines (7-day trend)
- Lead Score panel shows weighted breakdown
- Winning Instructions are actionable (buttons link to repurpose modal with pre-filled settings)
- Date range filter (Last 7 Days, Last 30 Days, Custom)
- Connect Instagram/Facebook buttons if not yet linked

---

## APIs & Pseudo Code (TypeScript)

### Backend API Stubs

```typescript
// ============================================================================
// REPURPOSE ENDPOINTS
// ============================================================================

/**
 * POST /repurpose
 * Create a repurpose job (async processing).
 */
app.post('/repurpose', async (req, res) => {
  const request: RepurposeRequest = req.body;

  // Validate request
  if (!request.listing || !request.brochure) {
    return res.status(400).json({ error: "Missing listing or brochure data" });
  }

  if (!request.platforms || request.platforms.length === 0) {
    return res.status(400).json({ error: "At least one platform required" });
  }

  // Create job
  const job: RepurposeJob = {
    id: generateUUID(),
    userId: req.user.id,
    listingId: request.listing.id,
    status: "pending",
    request: request,
    createdAt: new Date().toISOString()
  };

  // Store job
  await db.repurposeJobs.insert(job);

  // Queue async processing
  await jobQueue.enqueue('repurpose', job.id);

  return res.json({
    job_id: job.id,
    status: "pending",
    poll_url: `/jobs/${job.id}`
  });
});


/**
 * GET /jobs/:id
 * Check job status and retrieve results.
 */
app.get('/jobs/:id', async (req, res) => {
  const job = await db.repurposeJobs.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // If job is complete, fetch assets
  if (job.status === "complete") {
    const assets = await db.generatedAssets.findByJobId(job.id);
    return res.json({
      status: "complete",
      job: job,
      assets: assets
    });
  }

  return res.json({
    status: job.status,
    job: job
  });
});


/**
 * POST /generate/caption
 * Regenerate a single caption section (for inline editing).
 */
app.post('/generate/caption', async (req, res) => {
  const { listing, brochure, platform, strategy, section } = req.body;

  // section: "hook" | "bullets" | "cta"

  // Build prompt for just this section
  const prompt = buildSectionPrompt(section, listing, brochure, strategy, platform);

  // Call Claude
  const result = await claudeClient.generate({
    prompt: prompt,
    temperature: 0.8,
    max_tokens: 200
  });

  // Validate with guardrails
  const validated = await guardrailsEngine.validate(result);

  if (!validated.passed) {
    // Regenerate once if guardrails failed
    const retry = await claudeClient.generate({ prompt, temperature: 0.9 });
    return res.json({ content: retry, warnings: validated.violations });
  }

  return res.json({ content: result });
});


/**
 * POST /generate/hashtags
 * Generate hashtag sets (Reach vs Local).
 */
app.post('/generate/hashtags', async (req, res) => {
  const { listing, platform, brand_tags } = req.body;

  const hashtagSet = await hashtagGenerator.generate(listing, platform, brand_tags);

  return res.json(hashtagSet);
});


/**
 * GET /jobs/:id/download
 * Download repurpose assets as ZIP.
 */
app.get('/jobs/:id/download', async (req, res) => {
  const job = await db.repurposeJobs.findById(req.params.id);

  if (!job || job.status !== "complete") {
    return res.status(404).json({ error: "Job not ready" });
  }

  // Build ZIP
  const zipPath = await exportService.createZip(job.assets);

  res.download(zipPath, `repurpose_${job.id}.zip`);
});


// ============================================================================
// ANALYTICS ENDPOINTS
// ============================================================================

/**
 * GET /analytics/:accountId
 * Fetch analytics dashboard data.
 */
app.get('/analytics/:accountId', async (req, res) => {
  const { dateRange } = req.query; // "7d", "30d", "custom"

  const account = await db.socialAccounts.findById(req.params.accountId);

  if (!account) {
    return res.status(404).json({ error: "Account not found" });
  }

  // Check token expiry
  if (new Date(account.expiresAt) < new Date()) {
    return res.status(401).json({ error: "Token expired. Please reconnect." });
  }

  // Fetch metrics from Meta Graph API
  const metrics = await metaClient.fetchMetrics(account, dateRange);

  // Calculate lead score
  const leadScore = await analyticsService.calculateLeadScore(metrics, metrics.reach);

  // Detect trends (week-over-week)
  const previousMetrics = await db.analyticsSnapshots.findPrevious(account.id, dateRange);
  const trends = await analyticsService.detectTrends(metrics, previousMetrics);

  // Generate winning instructions
  const snapshots = await db.analyticsSnapshots.findRecent(account.id, 30); // Last 30 days
  const postMetadata = await db.posts.findByAccountId(account.id);
  const instructions = await analyticsService.generateWinningInstructions(snapshots, postMetadata);

  // Store snapshot
  await db.analyticsSnapshots.insert({
    accountId: account.id,
    timestamp: new Date().toISOString(),
    metricsJson: JSON.stringify(metrics)
  });

  return res.json({
    metrics: trends,
    leadScore: leadScore,
    winningInstructions: instructions
  });
});


/**
 * GET /auth/facebook/authorize
 * Initiate OAuth flow.
 */
app.get('/auth/facebook/authorize', (req, res) => {
  const redirectUri = `${process.env.BASE_URL}/auth/facebook/callback`;
  const state = generateRandomString(32); // CSRF protection

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${process.env.FB_APP_ID}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights&` +
    `state=${state}`;

  // Store state in session for validation
  req.session.oauthState = state;

  res.redirect(authUrl);
});


/**
 * GET /auth/facebook/callback
 * Handle OAuth callback.
 */
app.get('/auth/facebook/callback', async (req, res) => {
  const { code, state } = req.query;

  // Validate state (CSRF protection)
  if (state !== req.session.oauthState) {
    return res.status(400).send("Invalid state parameter");
  }

  // Exchange code for access token
  const tokenResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `client_id=${process.env.FB_APP_ID}&` +
    `client_secret=${process.env.FB_APP_SECRET}&` +
    `redirect_uri=${encodeURIComponent(process.env.BASE_URL + '/auth/facebook/callback')}&` +
    `code=${code}`
  );

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return res.status(500).json({ error: tokenData.error });
  }

  // Fetch user pages and IG accounts
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`
  );
  const pagesData = await pagesResponse.json();

  // Store token and account info
  for (const page of pagesData.data) {
    await db.socialAccounts.upsert({
      userId: req.user.id,
      platform: "facebook",
      accountId: page.id,
      accountName: page.name,
      accessToken: encrypt(page.access_token), // Encrypt before storing
      expiresAt: calculateExpiryDate(tokenData.expires_in),
      scopes: tokenData.scope.split(','),
      status: "active"
    });
  }

  res.redirect('/analytics?success=true');
});


/**
 * POST /auth/refresh
 * Refresh expired access token.
 */
app.post('/auth/refresh', async (req, res) => {
  const { accountId } = req.body;

  const account = await db.socialAccounts.findById(accountId);

  if (!account || !account.refreshToken) {
    return res.status(404).json({ error: "Account not found or no refresh token" });
  }

  // Exchange refresh token for new access token
  const refreshResponse = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${process.env.FB_APP_ID}&` +
    `client_secret=${process.env.FB_APP_SECRET}&` +
    `fb_exchange_token=${decrypt(account.accessToken)}`
  );

  const refreshData = await refreshResponse.json();

  if (refreshData.error) {
    return res.status(500).json({ error: refreshData.error });
  }

  // Update stored token
  await db.socialAccounts.update(accountId, {
    accessToken: encrypt(refreshData.access_token),
    expiresAt: calculateExpiryDate(refreshData.expires_in),
    status: "active"
  });

  res.json({ success: true });
});
```

---

## Template System (JSON) + 3 Example Templates

### Template Schema

```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  preview: string; // URL to preview image
  config: {
    typography: {
      fontFamily: string;
      sizes: { headline: number; body: number; caption: number };
      weights: { headline: number; body: number; caption: number };
    };
    colors: {
      primary: string;
      accent: string;
      text: string;
      background: string;
    };
    layout: {
      borderStyle: "none" | "solid" | "dashed";
      borderWidth: number;
      borderRadius: number;
      padding: number;
      textBoxPosition: "bottom" | "top" | "overlay";
      textBoxOpacity: number;
    };
    branding: {
      logoPosition: "bottom-right" | "top-left" | "bottom-left";
      logoSize: number;
      showWebsite: boolean;
    };
  };
  platforms: ("facebook" | "instagram")[];
}
```

---

### Template 1: "Classic"

```json
{
  "id": "classic",
  "name": "Classic",
  "description": "Traditional estate agent aesthetic with serif typography and minimal borders",
  "preview": "/templates/classic_preview.png",
  "config": {
    "typography": {
      "fontFamily": "Playfair Display, serif",
      "sizes": {
        "headline": 42,
        "body": 20,
        "caption": 14
      },
      "weights": {
        "headline": 700,
        "body": 400,
        "caption": 300
      }
    },
    "colors": {
      "primary": "#1A1A1A",
      "accent": "#D4AF37",
      "text": "#FFFFFF",
      "background": "rgba(0, 0, 0, 0.5)"
    },
    "layout": {
      "borderStyle": "solid",
      "borderWidth": 6,
      "borderRadius": 0,
      "padding": 40,
      "textBoxPosition": "bottom",
      "textBoxOpacity": 0.85
    },
    "branding": {
      "logoPosition": "bottom-right",
      "logoSize": 80,
      "showWebsite": true
    }
  },
  "platforms": ["facebook", "instagram"]
}
```

**Visual Description:**
- Gold border (6px solid) around entire image
- Semi-transparent black box at bottom (85% opacity)
- White serif text (Playfair Display)
- Logo in bottom-right corner
- Website URL shown below property details

---

### Template 2: "Modern"

```json
{
  "id": "modern",
  "name": "Modern",
  "description": "Clean, contemporary design with sans-serif typography and bold accents",
  "preview": "/templates/modern_preview.png",
  "config": {
    "typography": {
      "fontFamily": "Inter, sans-serif",
      "sizes": {
        "headline": 48,
        "body": 24,
        "caption": 16
      },
      "weights": {
        "headline": 800,
        "body": 500,
        "caption": 400
      }
    },
    "colors": {
      "primary": "#2563EB",
      "accent": "#3B82F6",
      "text": "#FFFFFF",
      "background": "rgba(37, 99, 235, 0.9)"
    },
    "layout": {
      "borderStyle": "solid",
      "borderWidth": 8,
      "borderRadius": 12,
      "padding": 32,
      "textBoxPosition": "bottom",
      "textBoxOpacity": 0.95
    },
    "branding": {
      "logoPosition": "top-left",
      "logoSize": 100,
      "showWebsite": false
    }
  },
  "platforms": ["instagram"]
}
```

**Visual Description:**
- Bold blue border (8px solid) with rounded corners (12px radius)
- Blue gradient text box at bottom (95% opacity)
- White sans-serif text (Inter, heavy weight)
- Large logo in top-left corner
- No website URL (cleaner look for Instagram)

---

### Template 3: "Minimal"

```json
{
  "id": "minimal",
  "name": "Minimal",
  "description": "Ultra-clean design with no borders, just subtle text overlay",
  "preview": "/templates/minimal_preview.png",
  "config": {
    "typography": {
      "fontFamily": "Helvetica Neue, sans-serif",
      "sizes": {
        "headline": 36,
        "body": 18,
        "caption": 12
      },
      "weights": {
        "headline": 600,
        "body": 400,
        "caption": 300
      }
    },
    "colors": {
      "primary": "#000000",
      "accent": "#FFFFFF",
      "text": "#FFFFFF",
      "background": "transparent"
    },
    "layout": {
      "borderStyle": "none",
      "borderWidth": 0,
      "borderRadius": 0,
      "padding": 24,
      "textBoxPosition": "overlay",
      "textBoxOpacity": 0.0
    },
    "branding": {
      "logoPosition": "bottom-left",
      "logoSize": 60,
      "showWebsite": false
    }
  },
  "platforms": ["facebook", "instagram"]
}
```

**Visual Description:**
- NO borders or frames (photo bleeds to edges)
- Text overlaid directly on photo (no background box)
- Small logo in bottom-left corner (watermark style)
- White text with subtle shadow for readability
- Extremely clean, lets photo shine

---

## Acceptance Criteria & Test Plan

### Phase 0 Acceptance Criteria

| Requirement | Test Method | Pass Criteria |
|-------------|-------------|---------------|
| Repurpose button appears in brochure editor | Manual UI test | Button visible, clickable, opens modal |
| Modal allows FB/IG selection | Manual UI test | Both platforms can be selected simultaneously |
| System generates 3 caption variants | Automated test | 3 variants returned (short, medium, long) |
| Guardrails block banned phrases | Unit test | "nestled", "stunning" trigger errors |
| Captions reference actual listing facts | Snapshot test | Must include beds, price, location, or features |
| Hashtag generator produces 6-8 tags | Unit test | Output has 6-8 tags, no duplicates |
| Hashtag A/B sets are distinct | Unit test | Reach set ≠ Local set (at least 3 tags different) |
| Images crop correctly for IG 1:1 | Visual diff test | Compare generated image to expected output |
| Images crop correctly for FB 1.91:1 | Visual diff test | Compare generated image to expected output |
| User can edit any field inline | Manual UI test | Click caption → type → changes save |
| Regenerate section works | Integration test | Click [🔄] → API call → new content appears |
| Download exports caption.txt + images | Automated test | ZIP contains expected files |
| Analytics card shows website clicks | Manual test | Card displays number + trend arrow |
| No generic slop in output | Content quality test | Random sample of 10 captions scored >70/100 |

---

### Test Plan

#### Unit Tests

```typescript
// Test: Guardrails catch banned phrases
test('Guardrails block AI slop phrases', () => {
  const caption = {
    hook: "This stunning property is nestled in a quiet street",
    bullets: [],
    cta: "Book a viewing"
  };

  const result = guardrailsEngine.validate(caption);

  expect(result.passed).toBe(false);
  expect(result.violations).toContainEqual(
    expect.objectContaining({
      severity: "error",
      rule: "banned_phrase"
    })
  );
});


// Test: Captions must include specific facts
test('Captions reference concrete property details', () => {
  const caption = {
    hook: "Beautiful home in great location",
    bullets: ["Lovely rooms", "Nice garden"],
    cta: "Call us"
  };

  const result = guardrailsEngine.validate(caption);

  expect(result.passed).toBe(false);
  expect(result.violations).toContainEqual(
    expect.objectContaining({
      rule: "too_generic"
    })
  );
});


// Test: Hashtag generator produces correct count
test('Hashtag generator returns 6-8 tags', () => {
  const listing = createMockListing();
  const hashtags = hashtagGenerator.generate(listing, "instagram", ["#Savills"]);

  expect(hashtags.recommended.length).toBeGreaterThanOrEqual(6);
  expect(hashtags.recommended.length).toBeLessThanOrEqual(8);
});


// Test: Hashtag A/B sets are distinct
test('Reach and Local hashtag sets are different', () => {
  const listing = createMockListing();
  const hashtags = hashtagGenerator.generate(listing, "instagram", []);

  const overlap = hashtags.reach.filter(tag => hashtags.local.includes(tag));

  expect(overlap.length).toBeLessThan(5); // At least 3 tags should differ
});
```

---

#### Integration Tests

```typescript
// Test: End-to-end repurpose flow
test('POST /repurpose creates job and generates assets', async () => {
  const request: RepurposeRequest = {
    listing: createMockListing(),
    brochure: createMockBrochure(),
    platforms: ["facebook", "instagram"],
    strategy: "location",
    template: "modern"
  };

  // Step 1: Create job
  const createResponse = await fetch('/repurpose', {
    method: 'POST',
    body: JSON.stringify(request)
  });
  expect(createResponse.status).toBe(200);

  const { job_id } = await createResponse.json();

  // Step 2: Poll for completion (max 30 seconds)
  let status = "pending";
  for (let i = 0; i < 30; i++) {
    const pollResponse = await fetch(`/jobs/${job_id}`);
    const pollData = await pollResponse.json();
    status = pollData.status;

    if (status === "complete") break;
    await sleep(1000);
  }

  expect(status).toBe("complete");

  // Step 3: Verify assets
  const jobResponse = await fetch(`/jobs/${job_id}`);
  const { assets } = await jobResponse.json();

  expect(assets.length).toBeGreaterThan(0);
  expect(assets[0].content.variants.length).toBe(3); // short, medium, long
  expect(assets[0].content.images.length).toBeGreaterThan(0);
});


// Test: Regenerate caption section
test('POST /generate/caption updates single field', async () => {
  const request = {
    listing: createMockListing(),
    brochure: createMockBrochure(),
    platform: "instagram",
    strategy: "highlight",
    section: "hook"
  };

  const response = await fetch('/generate/caption', {
    method: 'POST',
    body: JSON.stringify(request)
  });

  expect(response.status).toBe(200);

  const { content } = await response.json();

  expect(content).toMatch(/bed/i); // Should mention bedrooms
  expect(content.split(' ').length).toBeLessThanOrEqual(12); // Hook ≤12 words
});
```

---

#### Snapshot Tests (Content Quality)

```typescript
// Test: Generated captions match expected style
test('Caption output matches snapshot', async () => {
  const listing = createMockListing();
  const brochure = createMockBrochure();

  const generator = new SocialMediaGenerator();
  const result = await generator.generate({
    listing,
    brochure,
    platforms: ["instagram"],
    strategy: "location",
    template: "modern"
  });

  // Compare to saved snapshot
  expect(result.variants[0].caption).toMatchSnapshot();
});
```

---

#### Visual Diff Tests (Image Generation)

```typescript
// Test: Generated images match expected output
test('Image cropping produces correct dimensions', async () => {
  const photo = loadTestImage('test_property.jpg');
  const processor = new ImageProcessor();

  const cropped = await processor.cropForPlatform(photo, "1:1", 1080);

  expect(cropped.width).toBe(1080);
  expect(cropped.height).toBe(1080);

  // Visual diff (compare to baseline)
  const baseline = loadTestImage('expected_1x1_crop.png');
  const diff = await visualDiff(cropped, baseline);
  expect(diff.percentDifferent).toBeLessThan(5); // <5% pixel difference
});
```

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **API Quota Exceeded** (Claude API calls) | High - generation stops | Medium | Rate limiting + usage monitoring + fallback to cached templates |
| **Token Expiry** (Meta OAuth) | Medium - analytics fail | High | Proactive refresh 7 days before expiry + user notification |
| **Generic Content** (AI slop bypasses guardrails) | High - brand damage | Medium | Multi-layer validation (banned list + specificity check + human review option) |
| **Image Copyright** (user uploads copyrighted photos) | High - legal risk | Low | Terms of service + disclaimer ("you own rights to uploaded images") |
| **Platform API Changes** (Meta changes endpoints) | Medium - analytics break | Medium | Version pinning (v18.0) + deprecation monitoring + automated tests |
| **Multi-Tenant Branding** (wrong logo on post) | High - brand confusion | Low | Per-user brand config + visual confirmation before download |
| **Slow Generation** (>10 seconds) | Medium - poor UX | Medium | Async jobs + progress indicators + parallel image processing |
| **GDPR Compliance** (storing user tokens) | High - legal risk | Low | Encrypt tokens at rest + right to deletion + data retention policy (30 days) |
| **Content Moderation** (offensive captions) | Medium - brand risk | Low | Additional guardrail: check for profanity/discriminatory language |
| **Image Size Limits** (uploads >10MB) | Low - upload fails | Medium | Client-side compression before upload + size validation |

---

## Phase 0 Implementation Checklist

### Backend

- [ ] Create `services/social_media_generator.py`
- [ ] Create `services/hashtag_generator.py`
- [ ] Create `services/guardrails_engine.py`
- [ ] Create `services/image_processor.py` (crop + template overlay)
- [ ] Add `POST /repurpose` endpoint
- [ ] Add `GET /jobs/:id` endpoint
- [ ] Add `POST /generate/caption` endpoint
- [ ] Add `POST /generate/hashtags` endpoint
- [ ] Add database tables (repurpose_jobs, generated_assets)
- [ ] Write unit tests for guardrails
- [ ] Write integration test for end-to-end flow

### Frontend

- [ ] Add [Repurpose] button to brochure editor toolbar
- [ ] Create repurpose modal (Step 1: Platform + Strategy + Template selection)
- [ ] Create preview screen (Step 2: Edit + Download)
- [ ] Implement platform dropdown (FB/IG switcher)
- [ ] Implement variant selector (Short/Medium/Long)
- [ ] Implement aspect ratio dropdown (1:1, 4:5, 1.91:1)
- [ ] Add inline caption editing (contenteditable)
- [ ] Add [🔄] regenerate buttons for each section
- [ ] Add hashtag set toggle (Reach vs Local)
- [ ] Add download functionality (ZIP export)
- [ ] Add loading states (spinner, progress indicators)

### Analytics (Minimal MVP)

- [ ] Add "Website Clicks" analytics card
- [ ] Implement 7-day trend calculation
- [ ] Add sparkline visualization
- [ ] Add [Connect Facebook] stub button (OAuth flow in Phase 2)

### Testing

- [ ] Test guardrails catch all banned phrases
- [ ] Test captions include ≥2 specific facts
- [ ] Test hashtag generator produces 6-8 tags
- [ ] Test image cropping for 1:1 and 1.91:1
- [ ] Manual QA: entire repurpose flow from button click to download
- [ ] Content quality check: random sample of 10 captions scored >70/100

---

**Ready to ship Phase 0 when all checklist items are ✅.**
