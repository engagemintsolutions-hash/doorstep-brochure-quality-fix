# Intelligent Brochure Builder System

**Date**: October 16, 2025
**Status**: ✅ Fully Implemented
**File**: `frontend/smart_brochure_builder.js`

---

## Overview

The new intelligent brochure builder creates **narrative-driven, context-aware property brochures** that adapt to the property type and available content. This replaces the generic category-based approach with a sophisticated storytelling system.

---

## Key Features

### 1. **Property Character Detection** ✅
Automatically detects property type based on:
- **Price** (£1M+ = luxury)
- **Bedrooms** (5+ = luxury, 4+ = executive, 3+ = family, 1-2 = compact)
- **Property type** (apartment/flat = compact)
- **Condition** (period features = period character)
- **Photos** (pool/gym = luxury, large garden = family)

**Character Types**:
- `luxury` - £1M+, 5+ beds, pool/gym
- `executive` - £500k+, 4+ beds, 2000+ sqft
- `family` - 3+ beds with garden
- `compact` - Apartments, 1-2 beds
- `period` - Period features, low EPC rating
- `modern` - Contemporary properties (default)

### 2. **Dynamic Page Titles** ✅
Context-aware titles that match the property character:

| Page Type | Luxury | Executive | Family | Compact | Period |
|-----------|--------|-----------|--------|---------|--------|
| **Intro** | Executive Summary | Property Overview | Welcome to Your New Home | Your Perfect Space | Character & Heritage |
| **Living** | Entertain in Elegance | Sophisticated Living | Spaces for Living | Smart Living Design | Period Reception Rooms |
| **Kitchen** | Culinary Excellence | Designer Kitchen | The Heart of the Home | Stylish Kitchen | Traditional Kitchen |
| **Bedrooms** | Private Sanctuaries | Luxurious Bedrooms | Peaceful Retreats | Restful Bedrooms | Character Bedrooms |
| **Outdoor** | Private Oasis | Landscaped Grounds | Your Private Garden | Outdoor Space | Mature Gardens |

### 3. **Intelligent Page Structure** ✅

```
Page 1: COVER
├── Property name or address only
└── Best cover photo

Page 2: INTRODUCTION
├── 2 hero photos (1 exterior + 1 interior)
├── Property address, price, key details
└── ⭐ AGENT CONTACT (if enabled)

Page 3: LIVING AREAS
├── Kitchen + Dining + Living photos (up to 4)
└── Relevant features (kitchen, indoor)

Page 4: BEDROOMS & BATHROOMS
├── Bedroom photos (up to 3)
├── Bathroom photos (1)
└── Relevant features (bedrooms, bathrooms)

Page 5: OUTDOOR (CONDITIONAL)
├── ⚠️ ONLY CREATED IF GARDEN PHOTOS EXIST
├── Garden/outdoor photos (up to 4)
└── Outdoor features

Page X: FLOORPLAN (ALWAYS INCLUDED)
├── ⭐ ALWAYS CREATED IF FLOORPLAN UPLOADED
└── Property layout visualization

Final Page: AGENT CONTACT
├── ⭐ ALWAYS LAST PAGE
├── Agent photo (if enabled)
├── Contact details
└── Property summary
```

### 4. **Conditional Logic** ✅

**Garden Page**:
- ✅ Created ONLY if garden photos exist
- ⏭️ Skipped automatically if no garden photos

**Floorplan Page**:
- ✅ ALWAYS included if floorplan uploaded
- ✅ Positioned before final contact page
- ✅ Not limited by page count

**Agent Contact**:
- ✅ Appears on Page 2 (introduction)
- ✅ Always appears on final page
- ✅ Included if agent photo enabled OR agent details exist

### 5. **Photo Intelligence** ✅

**Quality Scoring**:
- Uses AI-generated quality scores if available
- Selects best photos from each category
- Example: Page 2 gets the best exterior + best interior photo

**Complementary Pairing**:
- Kitchen pairs with dining/living
- Master bedroom pairs with ensuite bathroom
- Garden pairs with exterior shots
- Creates visual storytelling flow

### 6. **Maximum Photo Limits** ✅
- **Cover page**: 1 photo
- **Introduction**: 2 photos (1 exterior + 1 interior)
- **Living areas**: 4 photos max
- **Bedrooms**: 3 photos max
- **Bathrooms**: 1 photo (prioritizes ensuite with master)
- **Garden**: 4 photos max

---

## How It Works

### Activation
When user clicks "Use Smart Defaults", the system:

1. **Analyzes property data** from form fields
2. **Detects character** (luxury/executive/family/etc)
3. **Evaluates photo inventory** (what exists, what doesn't)
4. **Generates intelligent pages** with:
   - Dynamic titles matching property character
   - Best photos selected by quality
   - Conditional pages (skip garden if no photos)
   - Always include floorplan if exists
   - Agent contact on page 2 AND final page
5. **Renders brochure** with narrative structure

### Example Output

**Luxury 5-bed with pool** (£1.5M):
```
Page 1: [Property Name]
Page 2: Executive Summary (2 photos + agent contact)
Page 3: Entertain in Elegance (4 photos: kitchen, dining, living)
Page 4: Private Sanctuaries (3 bedrooms + 1 ensuite)
Page 5: Private Oasis (4 garden photos with pool)
Page 6: Property Layout (floorplan)
Page 7: Get In Touch (agent contact)
```

**Compact 2-bed apartment** (£350k, no garden):
```
Page 1: [Address]
Page 2: Your Perfect Space (2 photos + agent contact)
Page 3: Smart Living Design (3 photos: kitchen, living)
Page 4: Restful Bedrooms (2 bedrooms + 1 bathroom)
[GARDEN PAGE SKIPPED - NO PHOTOS]
Page 5: Property Layout (floorplan)
Page 6: Get In Touch (agent contact)
```

---

## Technical Implementation

### Files Modified
1. **`frontend/smart_brochure_builder.js`** (NEW)
   - Property character detection
   - Dynamic title generation
   - Photo intelligence
   - Conditional page logic

2. **`frontend/page_builder.js`** (MODIFIED)
   - Integrated intelligent builder
   - Fallback to original if new system unavailable

3. **`frontend/index.html`** (MODIFIED)
   - Added script tag for smart_brochure_builder.js
   - Loads before page_builder.js

### Key Functions

```javascript
// Detect property type
detectPropertyCharacter(propertyData, photoAssignments)

// Generate contextual titles
generateDynamicPageTitle(pageType, character, photoCount)

// Select best photos by quality
getBestPhotos(photoIds, count)

// Find complementary photos for storytelling
getComplementaryPhotos(primaryCategory, allPhotos, maxCount)

// Main entry point
window.generateSmartDefaultPagesIntelligent()
```

---

## Benefits

### For Agents
✅ **Saves time** - Intelligent defaults require minimal manual adjustment
✅ **Professional brochures** - Narrative structure tells a story
✅ **Consistent quality** - Best photos automatically selected
✅ **Contextual titles** - Match the property's character

### For Properties
✅ **Better storytelling** - Living areas grouped together
✅ **No empty pages** - Garden only if photos exist
✅ **Floorplan always shown** - Critical info never missed
✅ **Contact visibility** - Agent details on page 2 AND final page

### For End Customers
✅ **Logical flow** - Cover → Overview → Living → Sleeping → Outdoor
✅ **Visual appeal** - Best photos featured prominently
✅ **Complete information** - All property details included
✅ **Easy contact** - Agent info accessible early and at end

---

## Configuration Options

### Adjustable Settings (Future Enhancement)
```javascript
// In smart_brochure_builder.js
const SETTINGS = {
  MAX_PHOTOS_PER_PAGE: 4,
  INTRO_PHOTOS: 2,           // How many hero photos on page 2
  BEDROOM_PHOTOS: 3,         // Max bedrooms shown
  GARDEN_PHOTOS: 4,          // Max garden photos
  ALWAYS_INCLUDE_FLOORPLAN: true,
  AGENT_ON_PAGE_2: true,
  AGENT_ON_FINAL: true
};
```

---

## Testing Checklist

When testing, verify:

- [ ] Property character detected correctly for different types
- [ ] Page titles match property character
- [ ] Garden page SKIPPED when no garden photos
- [ ] Garden page CREATED when garden photos exist
- [ ] Floorplan page ALWAYS created if floorplan uploaded
- [ ] Agent contact appears on Page 2 (if enabled)
- [ ] Agent contact ALWAYS appears on final page
- [ ] Best photos selected for introduction page
- [ ] Living areas grouped intelligently (kitchen + dining + living)
- [ ] Bedrooms and bathrooms paired appropriately
- [ ] No duplicate pages or empty pages
- [ ] Minimum 4 pages, maximum based on content

---

## Future Enhancements

### Phase 2 Ideas
1. **AI-Generated Page Descriptions**
   - Generate custom text for each page based on photos
   - Example: "This stunning kitchen features..."

2. **Multi-Language Support**
   - Translate page titles based on user locale
   - Maintain narrative flow in different languages

3. **Template Variations**
   - Allow users to choose between templates
   - Example: "Luxury Showcase", "Family Home", "Urban Living"

4. **Photo Composition Analysis**
   - Detect landscape vs portrait
   - Adjust page layouts accordingly
   - Optimize for visual balance

5. **Historical Learning**
   - Track which brochures perform best
   - Adapt defaults based on success patterns

---

## Troubleshooting

### Issue: Garden page still appears with no photos
**Solution**: Check that `photos.garden.length === 0` in console

### Issue: Floorplan not showing
**Solution**: Verify floorplan was uploaded and categorized correctly

### Issue: Agent contact missing from page 2
**Solution**: Check `includeAgentPhoto` checkbox and agent form fields

### Issue: Generic titles instead of dynamic
**Solution**: Verify property character detection in console logs

### Issue: Photos not appearing on pages
**Solution**: Check photo quality scoring and ID matching in console

---

## Console Debugging

Enable detailed logging:

```javascript
// In browser console
localStorage.setItem('debug_brochure_builder', 'true');
```

Look for these log messages:
- `🔍 Property analysis:` - Character detection results
- `🏠 Property character:` - Detected type
- `📝 Generated title for...` - Title generation
- `🔗 Found X complementary photos` - Photo pairing
- `✅ Page X: [Name]` - Page creation
- `⏭️  Skipped garden page` - Conditional logic

---

## Summary

The intelligent brochure builder transforms property listings into **professional, narrative-driven brochures** that adapt to property type, available content, and agent preferences. It eliminates manual page creation while ensuring consistent quality and optimal presentation.

**Key Differentiators**:
1. Context-aware (adapts to luxury vs compact properties)
2. Conditional (skips irrelevant pages)
3. Intelligent (best photos, complementary pairing)
4. Professional (dynamic titles, narrative flow)
5. Complete (always includes floorplan, agent contact)

---

**Status**: Ready for testing
**Compatibility**: Works with existing photo categorization system
**Fallback**: Original builder used if new system unavailable
**Performance**: Runs client-side, instant page generation
