# Social Media Repurpose System - Implementation Plan

## 📋 Overview

A "Repurpose" button system in the brochure editor that transforms existing brochure content into platform-optimized social media posts with visual templates and instant export capabilities.

---

## 🎯 User Journey

### Current State
User has completed brochure with:
- ✅ Generated description text
- ✅ Categorized photos (cover, exterior, interior, kitchen, bedrooms, bathrooms, garden)
- ✅ Property details (address, price, beds, baths, etc.)

### New Flow
1. **User clicks "Repurpose" button** in brochure editor toolbar
2. **Modal opens** showing social media platform options
3. **User selects platform** (Instagram, Facebook, LinkedIn, Twitter/X, TikTok, Pinterest)
4. **System generates** platform-optimized content instantly
5. **Preview appears** with visual mockup + editable text
6. **User exports** as image + caption copy, or bulk download all platforms

---

## 🎨 UI/UX Design

### Location of "Repurpose" Button

**Option A: Toolbar Button (Recommended)**
```
[Brochure Editor Header]
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Form    [Repurpose 🎬]  [Save Draft]  [Export PDF]   │
└─────────────────────────────────────────────────────────────────┘
```
- Prominent placement next to Export
- Icon: 🎬 or recycling symbol ♻️
- Blue/purple accent color (different from export)

**Option B: Floating Action Button**
```
                                                    [🎬 Repurpose]
                                                    ↑ Floating FAB
                                                      (bottom-right)
```
- Always visible while scrolling
- Quick access from any page

**Recommendation:** **Option A** - keeps all actions in consistent toolbar location.

---

### Repurpose Modal Design

**Modal Structure:**

```
┌────────────────────────────────────────────────────────────────────┐
│  Repurpose for Social Media                               [X Close] │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Select Platform(s):                                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │
│  │  📷  │ │  📘  │ │  💼  │ │  🐦  │ │  🎵  │ │  📍  │           │
│  │ Insta│ │ Face │ │ Link │ │ Twit │ │ TikT │ │ Pint │           │
│  │ gram │ │ book │ │ edIn │ │ ter  │ │ ok   │ │ erest│           │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘           │
│  [Selected platforms highlight with blue border]                    │
│                                                                      │
│  Content Strategy:                                                  │
│  ( ) Highlight Feature  ( ) Location Appeal  ( ) Price/Value       │
│                                                                      │
│  Visual Style:                                                      │
│  ( ) Clean Minimal  ( ) Bold Statement  ( ) Carousel Story         │
│                                                                      │
│                    [Generate Content →]                             │
└────────────────────────────────────────────────────────────────────┘
```

**After Generation - Preview Screen:**

```
┌────────────────────────────────────────────────────────────────────┐
│  Instagram Post Preview                      [← Back] [Download] │
├────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────┐  ┌──────────────────────────┐    │
│  │                            │  │  Caption (editable):      │    │
│  │   [Visual Preview]         │  │                           │    │
│  │   1080x1080px mockup       │  │  🏡 Stunning 4-bed       │    │
│  │                            │  │  family home in...       │    │
│  │   Shows property image     │  │                           │    │
│  │   with text overlay        │  │  📍 Manchester          │    │
│  │   matching platform style  │  │  💰 £650,000            │    │
│  │                            │  │  🛏️ 4 bed | 🛁 2 bath   │    │
│  │                            │  │                           │    │
│  └────────────────────────────┘  │  #NewListing #Property  │    │
│                                    │  #Manchester #ForSale   │    │
│  [← Prev Image]  1 of 3  [Next →] │                           │    │
│                                    └──────────────────────────┘    │
│                                                                      │
│  Platform Guidelines: ✅ Optimal size ✅ Character count OK         │
│                                                                      │
│  [Copy Caption]  [Download Image]  [Download All Posts]             │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Technical Architecture

### New Files to Create

```
services/
├── social_media_generator.py    # NEW - Core repurposing logic
└── social_media_templates.py    # NEW - Platform-specific templates

frontend/
├── social_media_repurpose.js    # NEW - Modal + preview logic
└── social_media_repurpose.css   # NEW - Styling

backend/
└── main.py                       # MODIFY - Add /repurpose endpoint
```

---

### Backend Implementation

#### New Endpoint: POST /repurpose

**Location:** `backend/main.py`

```python
@app.post("/repurpose")
async def repurpose_for_social_media(request: RepurposeRequest):
    """
    Generate platform-optimized social media content from brochure data.

    Input:
    - platforms: List of target platforms
    - property_data: From brochure session
    - photos: Categorized images
    - strategy: "highlight", "location", "price"
    - visual_style: "minimal", "bold", "carousel"

    Output:
    - posts: Array of platform-specific content objects
    """
    pass
```

**Request Schema:**
```python
class RepurposeRequest(BaseModel):
    platforms: List[str]  # ["instagram", "facebook", "linkedin"]
    property_data: PropertyData
    selected_photos: List[PhotoInput]  # User-selected or auto-selected
    strategy: str = "highlight"  # highlight, location, price
    visual_style: str = "minimal"  # minimal, bold, carousel
```

**Response Schema:**
```python
class SocialMediaPost(BaseModel):
    platform: str
    caption: str
    character_count: int
    hashtags: List[str]
    image_variants: List[ImageVariant]  # Different crops/sizes
    platform_specs: PlatformSpecs

class ImageVariant(BaseModel):
    size: str  # "1080x1080", "1080x1350", "1200x628"
    url: str  # Generated image URL
    format: str  # "square", "portrait", "landscape"

class PlatformSpecs(BaseModel):
    optimal_size: str
    max_characters: int
    best_posting_times: List[str]
    hashtag_limit: int
```

---

### Service Layer: social_media_generator.py

**Core Logic:**

```python
class SocialMediaGenerator:
    """
    Transform brochure content into platform-optimized social posts.

    Key Responsibilities:
    1. Text Transformation - Adapt brochure text to platform tone/length
    2. Image Selection - Choose best photos for each platform
    3. Hashtag Generation - Create relevant, non-spammy tags
    4. Template Application - Apply platform-specific formatting
    """

    def generate_posts(
        self,
        platforms: List[str],
        property_data: PropertyData,
        photos: List[Photo],
        strategy: str,
        visual_style: str
    ) -> List[SocialMediaPost]:
        """Generate posts for multiple platforms."""
        pass

    def _transform_caption(
        self,
        platform: str,
        brochure_text: str,
        property_data: PropertyData,
        strategy: str
    ) -> str:
        """
        Use Claude to transform brochure text into platform voice.

        Examples:
        - Brochure: "This elegant four-bedroom residence features..."
        - Instagram: "✨ Dream family home alert! 4 beds..."
        - LinkedIn: "Investment opportunity: Premium 4-bed property..."
        - Facebook: "🏡 Your next home? Gorgeous 4-bedroom house..."
        """
        pass
```

**Platform-Specific Adapters:**

```python
PLATFORM_CONFIGS = {
    "instagram": {
        "max_chars": 2200,
        "optimal_size": "1080x1080",
        "aspect_ratios": ["1:1", "4:5"],
        "tone": "friendly_visual",
        "emoji_heavy": True,
        "hashtag_limit": 30,
        "optimal_hashtags": 15
    },
    "facebook": {
        "max_chars": 63206,  # But aim for ~200
        "optimal_size": "1200x630",
        "aspect_ratios": ["16:9", "1:1"],
        "tone": "conversational",
        "emoji_moderate": True,
        "hashtag_limit": None,
        "optimal_hashtags": 5
    },
    "linkedin": {
        "max_chars": 3000,
        "optimal_size": "1200x627",
        "aspect_ratios": ["1.91:1"],
        "tone": "professional",
        "emoji_minimal": True,
        "hashtag_limit": None,
        "optimal_hashtags": 3
    },
    "twitter": {
        "max_chars": 280,
        "optimal_size": "1200x675",
        "aspect_ratios": ["16:9"],
        "tone": "punchy",
        "emoji_moderate": True,
        "hashtag_limit": None,
        "optimal_hashtags": 2
    }
}
```

---

### Content Strategy Implementations

#### 1. **Highlight Feature Strategy**
Focus on standout property feature:
- Garden → "Private oasis in the city 🌿"
- Kitchen → "Chef's dream kitchen 👨‍🍳"
- Bedroom → "Wake up to these views ☀️"

#### 2. **Location Appeal Strategy**
Emphasize neighborhood:
- Schools → "Family-friendly location with top-rated schools"
- Transport → "Minutes from city center"
- Amenities → "Surrounded by cafes, parks, shops"

#### 3. **Price/Value Strategy**
Lead with investment angle:
- "Exceptional value at £X"
- "Motivated seller - offers invited"
- "Rare opportunity in [area]"

---

### Visual Generation

**Two Approaches:**

#### Approach A: Server-Side Rendering (Recommended)
- Use Python PIL/Pillow to generate composite images
- Apply text overlays, branding, filters
- Export as PNG/JPG ready for download
- **Pros:** Consistent output, no client-side dependencies
- **Cons:** Server load, need image processing libraries

#### Approach B: Client-Side Canvas
- JavaScript Canvas API for overlays
- Browser generates final images
- **Pros:** Zero server load
- **Cons:** Browser compatibility, quality control

**Recommendation:** **Approach A** for production quality, with Approach B as fallback.

---

### Image Processing Pipeline

```python
class SocialMediaImageGenerator:
    """Generate platform-optimized images with overlays."""

    def generate_image(
        self,
        base_photo: Photo,
        platform: str,
        overlay_text: str,
        branding: BrandingOptions,
        style: str
    ) -> Image:
        """
        Create final social media image.

        Steps:
        1. Load base photo
        2. Crop/resize to platform optimal size
        3. Apply filters (if "bold" style: increase saturation/contrast)
        4. Add text overlay (headline + price + logo)
        5. Add branding (agency logo, colors)
        6. Export at platform-specific dimensions
        """
        pass
```

**Text Overlay Positioning:**
```
┌────────────────────────────────┐
│                                │
│     [Property Image]           │
│                                │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🏡 4-Bed Family Home    │ │ ← Text overlay box
│  │ £650,000 | Manchester  │ │   (semi-transparent)
│  │ [Agency Logo]           │ │
│  └──────────────────────────┘ │
└────────────────────────────────┘
```

---

## 📱 Platform-Specific Templates

### Instagram Template
```
Caption Structure:
[Emoji Hook] [Property Headline]

[Brief Description - 1 sentence]

📍 [Location]
💰 [Price]
🛏️ [Beds] | 🛁 [Baths]

[Call to Action]

[Hashtags - 10-15 max]

Example:
✨ Your dream home awaits

Beautifully renovated 4-bedroom family home with stunning garden and modern kitchen throughout.

📍 Didsbury, Manchester
💰 £650,000
🛏️ 4 bed | 🛁 2 bath

DM to arrange a viewing 📲

#ManchesterProperty #DidsburyHomes #FamilyHome #PropertyForSale #DreamHome #UKProperty #HouseHunting #NewListing #PropertySearch #ManchesterHomes
```

### LinkedIn Template
```
Caption Structure:
[Professional Headline]

[Property Details - 2-3 sentences]

Key Features:
• [Feature 1]
• [Feature 2]
• [Feature 3]

[Investment/Market Context]

Contact [Agent Name] for details.

[3 hashtags max]

Example:
Premium 4-Bedroom Property in High-Demand Manchester Location

This exceptional family residence offers contemporary living across 2,000 sq ft, featuring a fully renovated kitchen, landscaped garden, and period features throughout.

Key Features:
• Four double bedrooms with fitted wardrobes
• South-facing garden with entertaining area
• Off-street parking for two vehicles

Located in Didsbury's conservation area, this property benefits from excellent transport links and top-rated schools within walking distance.

Contact Sarah Johnson for viewings.

#ManchesterProperty #RealEstateInvestment #UKProperty
```

### Facebook Template
```
Caption Structure:
[Friendly Hook]

[Description - 2-3 sentences]

[Bullet features with emojis]

[Call to Action]

[Hashtags - 3-5 max]

Example:
🏡 Just listed! Your next family home?

Gorgeous 4-bedroom house in the heart of Didsbury. This stunning property has been lovingly updated and is ready for you to move straight in.

✅ 4 spacious bedrooms
✅ Modern kitchen with integrated appliances
✅ Beautiful garden perfect for summer BBQs
✅ Walking distance to shops and schools

Ready to view? Message us today!

#ManchesterHomes #PropertyForSale #FamilyHome #Didsbury #UKProperty
```

---

## 🎨 Visual Style Options

### 1. Clean Minimal
- Simple text overlay
- White/light background box
- Clean sans-serif font
- Subtle branding
- Target: Professional audience

### 2. Bold Statement
- High contrast
- Vibrant colors
- Large text
- Heavy saturation
- Target: Instagram browsing

### 3. Carousel Story
- Multi-image sequence
- Story-style format
- Swipe-through design
- Progressive reveal
- Target: Engagement-focused

---

## 💾 Data Flow

```
User Clicks "Repurpose"
        ↓
Frontend collects:
- Brochure text (overview, descriptions)
- Property details (beds, price, address)
- Selected photos (cover, featured rooms)
        ↓
POST /repurpose
        ↓
Backend SocialMediaGenerator:
1. Transform caption for each platform
2. Select optimal photos
3. Generate hashtags
4. Create image variants
        ↓
Response with:
- Caption text (editable)
- Image URLs (downloadable)
- Platform specs
        ↓
Frontend displays preview modal
User can:
- Edit captions
- Regenerate with different strategy
- Download individual or bulk
```

---

## 🚀 Implementation Phases

### Phase 1: UI/UX Only (START HERE)
**Goal:** Visual design and mockups without backend

**Tasks:**
1. Add "Repurpose" button to brochure editor toolbar
2. Create modal HTML structure
3. Design platform selection grid
4. Build preview screen layout
5. Add mock data for visual testing

**Files:**
- `frontend/social_media_repurpose.html` (modal template)
- `frontend/social_media_repurpose.css` (styling)
- `frontend/social_media_repurpose.js` (modal logic, mock data)

**Mock Data Example:**
```javascript
const MOCK_SOCIAL_POSTS = {
    instagram: {
        caption: "✨ Your dream home awaits\n\nBeautifully renovated...",
        image_url: "/mock/instagram-post.png",
        hashtags: ["#ManchesterProperty", "#FamilyHome"]
    },
    // ... more platforms
};
```

**Deliverable:** Fully functional UI that shows what the feature will look like

---

### Phase 2: Backend Integration
**Goal:** Connect UI to real generation logic

**Tasks:**
1. Create `services/social_media_generator.py`
2. Implement Claude caption transformation
3. Add `/repurpose` endpoint
4. Wire frontend to API

**Deliverable:** Working end-to-end feature with AI-generated captions

---

### Phase 3: Image Generation
**Goal:** Server-side composite image creation

**Tasks:**
1. Implement PIL/Pillow image processing
2. Create text overlay system
3. Add branding application
4. Export at platform dimensions

**Deliverable:** Download-ready social media images

---

### Phase 4: Bulk Export
**Goal:** Download all platforms at once

**Tasks:**
1. ZIP bundle creation
2. Filename conventions
3. Organized folder structure

**Deliverable:** One-click export of all platform content

---

## 📊 Success Metrics

**User Engagement:**
- % of brochures that use Repurpose feature
- Average platforms selected per use
- Caption edit rate (shows quality of generation)

**Technical:**
- Generation speed < 5 seconds
- Image quality scores
- API cost per repurpose action

**Business:**
- Feature adoption rate
- User retention improvement
- Upgrade driver for premium tiers

---

## 🎯 User Feedback Questions

Before implementation, validate:

1. **Button Placement:** Toolbar vs Floating FAB?
2. **Default Strategy:** Which content strategy should be default?
3. **Platform Priority:** Which platforms are most important? (Instagram/Facebook likely top)
4. **Editing:** Do users want to edit captions before generating images?
5. **Bulk vs Individual:** Export all platforms at once, or one at a time?

---

## 🔮 Future Enhancements

**V2 Features:**
- Video generation for TikTok/Reels
- A/B testing suggestions
- Scheduled posting calendar
- Analytics integration
- AI-powered image selection (best photo per platform)
- Multi-language support
- Brand voice customization per agency

---

## 🏁 Next Steps

1. **Review this plan** with user for feedback
2. **Start Phase 1** - Build UI/UX mockup
3. **User testing** - Validate design before backend work
4. **Iterate** based on feedback
5. **Implement Phase 2+** once design is approved

---

**Questions for User:**

1. What platforms are priority? (Instagram, Facebook, LinkedIn most important?)
2. Should users be able to select specific photos, or auto-select best ones?
3. Do you have platform dimensions in mind or follow standard specs?
4. Paste your GPT prompt - I'll integrate your vision into this plan!
