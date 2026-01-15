# BROCHURE LAYOUT GAP ANALYSIS
## Comparison: Current System vs Savills Professional Brochure

**Date**: 2025-10-20
**Reference**: `C:\Users\billm\Downloads\GUS250140_RPT25304947 (4).pdf` (Sefton House)
**Problem**: Current system produces category-based brochures, not narrative-driven professional brochures

---

## THE CORE PROBLEM

**User's Exact Words:**
> "most good brochures capture attention with the best photos of the property (not just simple categories, but a blend = the brochure we're working off has shown the swimming pool, kitchen and entrance to the house as the first 3 listed. It then has a featurelist overview on that opening page, almost like a setup and is populated with agent details. Our blended layout doesnt do that yet nor am i sure how the text is defining itself? Like if its typing purely on what it sees in the photo per page are we not limited to category brochures."

---

## SAVILLS BROCHURE STRUCTURE (WHAT WORKS)

### Page 1: Cover
- **Hero exterior shot** (maximum visual impact)
- Property name + address overlay
- Agency branding

### Page 2: **HERO SPREAD** (THIS IS THE GAP!)
Layout:
```
┌────────────────────────────────────────────────────────────┐
│  Photo 1: Swimming Pool (35%)    │   TITLE                 │
│  (Lifestyle/luxury feature)       │   Address               │
├───────────────────────────────────┤                         │
│  Photo 2: Kitchen (35%)           │   Guide Price           │
│  (Heart of home)                  │                         │
├───────────────────────────────────┤   Short Narrative       │
│  Photo 3: Entrance Hall (30%)     │   (1-2 sentences)       │
│  (First impression)               │                         │
│                                   │   FEATURE LIST:         │
│                                   │   • Popular residential  │
│                                   │   • Immaculate          │
│                                   │   • Modern interiors    │
│                                   │   • 5 reception rooms   │
│                                   │   • Kitchen/family room │
│                                   │   • 6 beds, 5 baths    │
│                                   │   • Landscaped garden   │
│                                   │   • Swimming pool       │
│                                   │   • Integral garage     │
│                                   │                         │
│                                   │   AGENT DETAILS         │
│                                   │   (name, office, phone) │
└────────────────────────────────────────────────────────────┘
```

**Key Insights:**
1. **NOT category-driven** - Photos are **BEST 3** regardless of room type
2. **Emotional impact photos** - Pool, not "all bathrooms"; Kitchen, not "all kitchens"
3. **Property-wide narrative** - Text describes ENTIRE property, not individual rooms
4. **Feature bullets are holistic** - They reference rooms NOT on this page

### Page 3: Full Property Description
- **Narrative storytelling** about the ENTIRE property
- Flows through property logically (entrance → living → kitchen → bedrooms → garden)
- **Photos support the narrative**, not the other way around
- Text is NOT "describing what's in the photo" - it's telling a story

### Remaining Pages: Supporting Details
- Room galleries (bedrooms, bathrooms)
- Gardens/exterior
- Location page
- Floorplans
- EPC/legal

---

## CURRENT SYSTEM ARCHITECTURE (THE PROBLEMS)

### 1. **Category-Based Photo Assignment**
**Location**: `frontend/smart_brochure_builder.js` lines 217-299

```javascript
// Current approach:
const photos = window.photoCategoryAssignments || {};
// { cover: [...], exterior: [...], kitchen: [...], bedroom: [...] }

// Page 2 logic (WRONG):
const introPhotos = [];
const bestExterior = getBestPhotos(photos.exterior || [], 1);
const bestInterior = getBestPhotos(photos.interior || photos.kitchen || [], 1);
introPhotos.push(...bestExterior, ...bestInterior);
```

**Problem**:
- Constrained by **categories** (exterior, kitchen, bedroom)
- Can't select "3 BEST photos from ALL photos regardless of category"
- Missing: **Photo impact scoring** (pool > bedroom > hallway)

---

### 2. **Per-Page Text Generation**
**Problem**: Each page generates text based ONLY on photos visible on that page

**Current Flow** (BROKEN):
```
User uploads 20 photos
  ↓
Photos categorized: kitchen[3], bedroom[5], exterior[4], pool[1]
  ↓
Page 2 created: [exterior[0], kitchen[0]]
  ↓
Text generated: "This kitchen features..." "The exterior shows..."
  ↓
RESULT: Disconnected room descriptions, no overall narrative
```

**What's Missing**:
- **Property-wide narrative generation** (like Savills Page 3)
- Text should flow: entrance → reception → kitchen → bedrooms → garden
- Photos should **illustrate** the narrative, not **define** it

---

### 3. **No Photo Impact Scoring**
**Current**: `getBestPhotos()` probably just takes first N photos in category

**What's Needed**: AI scoring based on:
- **Visual quality** (lighting, composition, sharpness)
- **Emotional impact** (pool > bathroom, kitchen island > cupboard)
- **Uniqueness** (architectural features > standard rooms)
- **Selling power** (lifestyle features first)

**Example Ranking**:
```
1. Swimming pool + landscaping (97/100) - Luxury lifestyle
2. Kitchen with island (92/100) - Heart of home
3. Dramatic entrance hall (89/100) - First impression
4. Master bedroom ensuite (78/100) - Standard luxury
5. Garden view (75/100) - Supporting feature
6. Hallway (45/100) - Functional, not emotive
```

---

### 4. **No Property-Wide Feature Extraction**
**Current**: No systematic way to generate bulleted feature list

**Savills Feature List** (Page 2):
```
• Popular and convenient residential road
• Immaculately presented throughout
• Stylish modern interiors
• Entrance hall, drawing room, dining room, study, media room
• High specification open plan kitchen / family room
• Six bedrooms and five bathrooms (four en suite)
• Landscaped rear garden
• Fabulous patio area
• Heated swimming pool and seating area
• Integral garage
```

**Data Sources**:
1. **Property metadata**: bedrooms, bathrooms, size, EPC
2. **Photo analysis**: Pool detected, modern kitchen, garden
3. **Location enrichment**: Residential area, village setting
4. **Agent input**: "Immaculately presented" (condition)

**What's Missing**: Extraction service that combines all sources into bullets

---

## THE ARCHITECTURAL CHANGES NEEDED

### Change 1: **AI Photo Scoring Service**
**New File**: `services/photo_scorer.py`

```python
class PhotoScorer:
    """
    Scores photos based on visual quality and selling impact.

    Scoring Criteria:
    - Visual quality (30%): Brightness, composition, sharpness
    - Emotional impact (40%): Pool/garden/views > bedrooms > hallways
    - Uniqueness (20%): Architectural features, luxury amenities
    - Context relevance (10%): Matches property character
    """

    def score_photo(self, photo: BrochurePhoto, property_character: str) -> float:
        """Returns 0-100 score."""

    def rank_photos(self, photos: List[BrochurePhoto], property_character: str) -> List[Tuple[BrochurePhoto, float]]:
        """Returns photos sorted by score descending."""
```

**Integration Point**: Called during brochure generation BEFORE page building

---

### Change 2: **Property-Wide Narrative Generator**
**New File**: `services/narrative_generator.py`

```python
class NarrativeGenerator:
    """
    Generates cohesive property narrative using ALL photos and data.
    NOT per-page descriptions.
    """

    def generate_property_story(
        self,
        property_data: PropertyData,
        all_photos: List[BrochurePhoto],
        location_enrichment: Optional[Dict] = None
    ) -> PropertyNarrative:
        """
        Returns:
        - opening_paragraph: 2-3 sentences (hero page)
        - full_description: 300-500 words (details page)
        - feature_bullets: List[str] (hero page sidebar)
        """
```

**Prompt Structure**:
```
You are writing a luxury property brochure description.

PROPERTY OVERVIEW:
- Type: Detached house
- Bedrooms: 6, Bathrooms: 5
- Size: 4700 sqft
- Condition: Excellent
- EPC: B

PHOTO ANALYSIS:
Photo 1 (score: 97): Swimming pool with seating area, modern landscaping
Photo 2 (score: 92): Open plan kitchen with island, bifold doors to garden
Photo 3 (score: 89): Entrance hall with chandelier, staircase
Photo 4 (score: 85): Master bedroom with ensuite
[... all photos with AI analysis ...]

LOCATION:
- Village setting: Cranleigh, Surrey
- Nearby: M&S, schools (Royal Grammar, Guildford High School)
- Transport: 10 miles to Guildford, mainline to London Waterloo (32 min)

TASK:
1. Write opening narrative (2-3 sentences) emphasizing swimming pool, modern kitchen, generous accommodation
2. Write full property description (400 words) flowing through: entrance → reception rooms → kitchen → bedrooms → garden → location
3. Generate 8-10 bullet points covering key features across ENTIRE property

TONE: Premium, factual, emphasize lifestyle and space
```

---

### Change 3: **Feature Extractor Service**
**New File**: `services/feature_extractor.py`

```python
class FeatureExtractor:
    """
    Extracts structured feature bullets from property data + photos.
    """

    def extract_features(
        self,
        property_data: PropertyData,
        photos: List[BrochurePhoto],
        location_data: LocationData
    ) -> List[str]:
        """
        Returns bullets like:
        - "Six bedrooms and five bathrooms (four en suite)"
        - "Heated swimming pool and seating area"
        - "High specification open plan kitchen / family room"
        """

        features = []

        # From property data
        if property_data.bedrooms and property_data.bathrooms:
            features.append(self._format_bed_bath(property_data))

        # From photo analysis
        pool_photos = [p for p in photos if 'pool' in (p.analysis or {}).get('caption', '').lower()]
        if pool_photos:
            features.append("Heated swimming pool and seating area")

        # From location enrichment
        if location_data.setting == Setting.VILLAGE:
            features.append(f"Convenient village location in {location_data.address.split(',')[-1]}")

        return features
```

---

### Change 4: **Refactor Page Building**
**Modified File**: `frontend/smart_brochure_builder.js`

**OLD Page 2** (lines 275-299):
```javascript
// WRONG: Category-constrained
const introPhotos = [];
const bestExterior = getBestPhotos(photos.exterior || [], 1);
const bestInterior = getBestPhotos(photos.interior || photos.kitchen || [], 1);
```

**NEW Page 2**:
```javascript
// ========================================
// PAGE 2: HERO SPREAD
// ========================================

// Get TOP 3 photos from ALL photos (not by category)
const allPhotos = Object.values(photos).flat();
const top3Photos = getTopScoredPhotos(allPhotos, 3);  // NEW FUNCTION

// Get property-wide content
const heroContent = [
    ...top3Photos.map(p => ({ type: 'photo', photoId: p.id })),
    { type: 'property_narrative', text: sessionData.opening_narrative },  // NEW
    { type: 'feature_bullets', bullets: sessionData.feature_list },      // NEW
    { type: 'agent_contact', agent: propertyData.agent }
];

pages.push({
    id: pageNumber++,
    name: 'Property Overview',
    contentBlocks: heroContent,
    layout: 'hero_spread',  // NEW LAYOUT TYPE
    theme: 'intro'
});
```

---

### Change 5: **New Page Type: `hero_spread`**
**Modified File**: `frontend/brochure_editor_v3.html` (new template)

```html
<!-- NEW: Hero Spread Layout -->
<div class="brochure-page layout-hero-spread" id="page-2">
    <!-- Left: 3 stacked photos (60% width) -->
    <div class="hero-photos">
        <div class="photo-slot photo-large"></div>
        <div class="photo-slot photo-large"></div>
        <div class="photo-slot photo-large"></div>
    </div>

    <!-- Right: Title + narrative + bullets + agent (40% width) -->
    <div class="hero-sidebar">
        <h1 class="property-title">[Property Name]</h1>
        <p class="property-address">[Address]</p>
        <p class="guide-price">Guide Price £X,XXX,XXX</p>

        <div class="opening-narrative">
            [Short narrative about property]
        </div>

        <ul class="feature-bullets">
            <!-- Generated bullets here -->
        </ul>

        <div class="agent-contact">
            <!-- Agent details -->
        </div>
    </div>
</div>
```

---

### Change 6: **Backend Session Data Structure**
**Modified**: `backend/schemas.py` - Add to `BrochureSessionData`

```python
class BrochureSessionData(BaseModel):
    # ... existing fields ...

    # NEW: Property-wide narrative (not per-page)
    opening_narrative: Optional[str] = Field(
        default=None,
        description="2-3 sentence opening summary for hero page"
    )

    full_description: Optional[str] = Field(
        default=None,
        description="Full 400-word property story for details page"
    )

    feature_bullets: Optional[List[str]] = Field(
        default_factory=list,
        description="Property-wide feature bullets for hero page"
    )

    # NEW: Photo scores
    photo_scores: Optional[Dict[str, float]] = Field(
        default_factory=dict,
        description="Photo ID -> Impact score (0-100)"
    )
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Photo Scoring (2-3 hours)
1. Create `services/photo_scorer.py`
2. Implement basic scoring:
   - Rule-based: pool/garden/kitchen > bedrooms > hallways
   - Use existing photo.analysis data from vision API
3. Test with sample photos
4. Add to brochure generation pipeline

### Phase 2: Feature Extraction (1-2 hours)
1. Create `services/feature_extractor.py`
2. Extract from:
   - Property data (beds, baths, size)
   - Photo analysis (pool, gym, garden)
   - Location enrichment (village, schools, transport)
3. Format as bullets
4. Store in session data

### Phase 3: Property-Wide Narrative (3-4 hours)
1. Create `services/narrative_generator.py`
2. Build prompt using:
   - ALL property data
   - ALL photos with scores
   - Location enrichment
3. Generate:
   - Opening paragraph (hero page)
   - Full description (details page)
4. Store in session data (NOT per-page)

### Phase 4: Hero Spread Layout (2-3 hours)
1. Create CSS for `layout-hero-spread`
2. Update `brochure_editor_v3.html` with new template
3. Modify `smart_brochure_builder.js`:
   - Get top 3 photos from ALL photos
   - Build hero spread page
   - Inject narrative + bullets
4. Test rendering

### Phase 5: Refactor Text Display (1-2 hours)
1. Page 3 shows `full_description` (property-wide narrative)
2. Remove per-page text generation
3. Photos become illustrative, not prescriptive

**Total Estimated Time**: 9-14 hours

---

## CRITICAL SUCCESS FACTORS

### 1. **Photo Scoring Must Be Smart**
Bad: First photo in each category
Good: Swimming pool ranks higher than hallway regardless of category

### 2. **Narrative Must Be Cohesive**
Bad: "This kitchen has..." "This bedroom has..."
Good: "Completed in 2017 to an exceptionally high standard, Sefton House represents..."

### 3. **Feature Bullets Must Reference Whole Property**
Bad: Only listing what's visible on Page 2
Good: "Six bedrooms and five bathrooms" even if only 1 bedroom photo on Page 2

### 4. **Layout Must Match Professional Standard**
Reference: Savills Page 2 layout
- 3 photos (stacked, left side, 60% width)
- Title, narrative, bullets, agent (right sidebar, 40% width)

---

## QUESTIONS FOR USER

1. **Photo Scoring**: Should we use AI vision analysis (complexity++) or rule-based scoring (simpler, faster)?

2. **Narrative Generation**: Do you want Claude to write the full narrative, or extract from existing descriptions?

3. **Feature Bullets**: Auto-generate from data, or allow agent manual editing?

4. **Hybrid Layout**: Do you want this ONLY for Page 2, or apply narrative approach to all pages?

5. **Backward Compatibility**: Keep old category-based builder as option, or fully replace?

---

## NEXT STEPS

Awaiting your direction on:
- **Start with Phase 1** (photo scoring) and iterate?
- **Build complete solution** all at once?
- **Prototype hero page layout** first to validate design?

Let me know which approach you prefer!
