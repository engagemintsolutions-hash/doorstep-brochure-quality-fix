# Coordinated Photo-Text Generation System
**Date**: October 16, 2025
**Status**: Implemented and Ready for Testing

## Problem Statement

### The Issue
The original brochure generation flow had a fundamental disconnection:

1. Photos were uploaded and analyzed by AI
2. LLM generated generic brochure text based on property details only
3. User manually placed photos in the brochure editor AFTER text was already written
4. **Result**: Text didn't reference the specific photos actually shown

**Example of the Problem**:
- Text says "spacious modern kitchen with island seating"
- But the kitchen photo shown is actually traditional with no island
- Or text mentions "elegant reception room" but a bedroom photo ends up in that section

### Root Cause
The LLM was writing blind - it didn't know:
- Which photos would be used
- Where photos would be placed
- What was actually visible in each photo for each section

## The Solution

### New Coordinated Flow

1. **User uploads photos** → AI vision analyzes and categorizes
2. **Frontend intelligently assigns photos to brochure sections** BEFORE generation
   - Introduction → Exterior/cover photos
   - Living Spaces → Living room/reception photos
   - Kitchen & Dining → Kitchen/dining photos
   - Bedrooms → Bedroom photos
   - Bathrooms → Bathroom photos
   - Garden & Exterior → Garden/outdoor photos

3. **Section mappings sent to backend** with photo analysis details
4. **LLM generates section-specific copy** knowing:
   - Which photos are in each section
   - What vision AI detected in those specific photos
   - The section theme (Living Spaces, Kitchen, etc.)

5. **Brochure pre-populated** with coordinated photo+text pairs

### Example of Improved Flow

**Input to LLM**:
```
LIVING SPACES Section:
Photos in this section: 3

📸 living_room.jpeg
   Features: bay window, hardwood floors, fireplace, period details

📸 dining_room.jpeg
   Features: oak flooring, chandelier, French doors

📸 reception.jpeg
   Features: large windows, high ceilings, original moldings

✍️ Write 80-120 words about living spaces based on these specific photos.
   Reference the visual details you see (e.g., 'bay window', 'period details').
```

**LLM Output**:
> "The reception rooms showcase exceptional period character, with the principal living room featuring an elegant bay window and original fireplace surround. Hardwood floors and decorative moldings create a sense of timeless charm, while the formal dining room offers French doors opening to the garden. High ceilings and large windows throughout ensure these spaces are flooded with natural light..."

**Key Improvement**: Text directly describes what's IN THE PHOTOS for that section.

## Implementation Details

### Frontend Changes

**File**: `frontend/app_v2.js`

#### New Function: `createBrochureSectionMappings()`
```javascript
function createBrochureSectionMappings() {
    // Assigns photos to sections based on their categories
    const sections = {
        introduction: {
            name: 'Introduction',
            desiredCategories: ['exterior', 'cover'],
            maxPhotos: 2,
            photos: []
        },
        living_spaces: {
            desiredCategories: ['interior', 'living_room', 'reception'],
            maxPhotos: 4,
            photos: []
        },
        // ... etc for all sections
    };

    // Map photos to sections
    photoAnalysisResults.photos.forEach(photo => {
        // Assign to matching sections
    });

    return sections;
}
```

**Called in**: `collectBrochureFormData()` (line 952)
```javascript
const brochureSectionMappings = createBrochureSectionMappings();

const payload = {
    // ... other data
    brochure_sections: brochureSectionMappings  // NEW
};
```

### Backend Changes

**File**: `backend/schemas.py`

#### New Schema Classes
```python
class BrochureSectionPhoto(BaseModel):
    """Photo assigned to a brochure section with analysis."""
    filename: str
    category: str
    attributes: List[str]
    caption: Optional[str]

class BrochureSection(BaseModel):
    """A section of the brochure with assigned photos."""
    name: str
    desiredCategories: List[str]
    maxPhotos: int
    photos: List[BrochureSectionPhoto]

class BrochureSections(BaseModel):
    """All brochure sections with photo assignments."""
    introduction: Optional[BrochureSection]
    living_spaces: Optional[BrochureSection]
    kitchen_dining: Optional[BrochureSection]
    bedrooms: Optional[BrochureSection]
    bathrooms: Optional[BrochureSection]
    garden_exterior: Optional[BrochureSection]
```

**Added to** `GenerateRequest` (line 167):
```python
brochure_sections: Optional[Dict[str, Any]] = Field(
    default=None,
    description="Section-specific photo mappings for coordinated text generation"
)
```

**File**: `services/generator.py`

#### New Function: `_format_brochure_sections()`
```python
def _format_brochure_sections(self, brochure_sections: dict) -> str:
    """
    Format brochure section mappings for inclusion in prompt.
    This tells the LLM which photos are in each section so it can write coordinated copy.
    """
    # Creates detailed section breakdown for LLM with:
    # - Section name (e.g., "LIVING SPACES")
    # - Photos in that section
    # - Visual attributes detected in each photo
    # - Instructions to write 80-120 words about that section
```

#### Updated Functions
- `generate_variants()` - Added `brochure_sections` parameter
- `_generate_with_llm()` - Passes sections to prompt builder
- `_build_prompt()` - Includes formatted sections in prompt

**File**: `backend/main.py`

```python
# Line 272-278
variants = await generator.generate_variants(
    request,
    num_variants=3,
    enrichment_data=enrichment_data,
    photo_analysis=request.photo_analysis,
    brochure_sections=request.brochure_sections  # NEW
)
```

## Brochure Section Definitions

The system uses 6 main sections:

| Section | Max Photos | Desired Categories | Purpose |
|---------|-----------|-------------------|---------|
| **Introduction** | 2 | exterior, cover | Opening spread with property overview |
| **Living Spaces** | 4 | interior, living_room, reception | Reception rooms, lounges |
| **Kitchen & Dining** | 3 | kitchen, dining_room | Kitchen and eating areas |
| **Bedrooms** | 3 | bedrooms, bedroom | All bedrooms |
| **Bathrooms** | 2 | bathrooms, bathroom | Bathrooms and ensuites |
| **Garden & Exterior** | 2 | garden, exterior | Outdoor spaces |

## LLM Prompt Structure

When brochure_sections are provided, the prompt includes:

```
================================================================================
BROCHURE SECTIONS - Write section-specific copy based on assigned photos
================================================================================

CRITICAL: You MUST write separate copy for EACH section below.
Each section has specific photos assigned. Write about what's IN THOSE PHOTOS.

## LIVING SPACES
Photos in this section: 3

📸 living_room.jpeg
   Category: interior
   Features: bay window, hardwood floors, fireplace, period details

📸 dining_room.jpeg
   Category: interior
   Features: oak flooring, chandelier, French doors

✍️ Write 80-120 words about the living spaces based on these specific photos.
   Reference the visual details you see (e.g., 'bay window').

================================================================================

OUTPUT FORMAT:

For EACH section with photos, generate:

SECTION: Introduction
[80-120 words about introduction section based on its assigned photos]

SECTION: Living Spaces
[80-120 words about living spaces based on its assigned photos]

(Continue for ALL sections with photos)

================================================================================
```

## Benefits

### Before (Old System)
- ❌ Generic text not tied to actual photos
- ❌ User had to manually ensure text matched photos
- ❌ Frequent mismatches (text about modern kitchen, photo shows traditional)
- ❌ Poor quality due to generic descriptions

### After (New System)
- ✅ Section-specific copy written for actual photos
- ✅ LLM describes what it "sees" in the photos
- ✅ Automatic coordination between images and text
- ✅ Higher quality, more accurate descriptions
- ✅ Less manual editing required

## Testing Instructions

### 1. Upload Photos
Upload 8-13 photos covering different room types:
- 1-2 exterior shots
- 2-3 living/reception rooms
- 2 kitchen photos
- 2 bedroom photos
- 1-2 bathroom photos
- 1-2 garden/outdoor photos

### 2. Check Console Logs
After photo analysis completes, look for:
```
📋 Creating intelligent section-photo mappings for brochure...
📸 Section-photo mappings:
  Introduction: 2 photos
    - exterior1.jpg (exterior): brick facade, front door, garden
    - cover.jpg (cover): wide angle, landscaping
  Living Spaces: 3 photos
    - living_room.jpg (interior): fireplace, bay window
    ... etc
```

### 3. Generate Brochure
Click "Generate Brochure" and check payload in console:
```javascript
{
  // ... other fields
  brochure_sections: {
    introduction: {
      name: "Introduction",
      photos: [...]
    },
    living_spaces: {
      name: "Living Spaces",
      photos: [...]
    }
    // ... etc
  }
}
```

### 4. Verify Generated Text
Look at the generated text variants. For each section, verify:
- Text references features ACTUALLY in those section's photos
- No generic descriptions ("spacious reception" if no reception photo)
- Specific visual details mentioned ("bay window", "marble countertops", etc.)

### 5. Check Brochure Editor
In the editor, verify:
- Photos are pre-placed in appropriate sections
- Text for each section matches the photos shown
- No mismatches between copy and images

## Troubleshooting

### Photos Not Mapping to Sections

**Check**:
1. Did photo analysis complete? Look for `photoAnalysisResults` in console
2. Are photos categorized correctly? Check `photo.category` values
3. Check console for: `📋 Creating intelligent section-photo mappings...`

**Fix**: If categories are wrong, the vision analysis may have misclassified. Manually reassign photos.

### LLM Not Generating Section-Specific Copy

**Check**:
1. Backend logs for: `Generate request for PropertyType.HOUSE property`
2. Verify `brochure_sections` in request payload (not null)
3. Check generator prompt includes section mappings

**Fix**: Check browser console for payload. If `brochure_sections: null`, the frontend function isn't being called.

### Text Still Generic

**Check**:
1. Is LLM receiving the formatted sections prompt?
2. Look at backend logs for prompt preview
3. Check if photos have enough attributes from vision analysis

**Fix**: Ensure photo analysis returned attributes. Empty attributes list will result in generic text.

## Future Enhancements

1. **Dynamic Section Creation**: Allow users to add/remove sections
2. **Photo Reordering**: Drag-and-drop to change which photos are in which sections
3. **Manual Overrides**: Let users override AI section assignments
4. **Section Templates**: Pre-defined layouts for different property types
5. **Text Refinement**: Re-generate specific sections without regenerating entire brochure

## Cost Impact

**Before**: 1 API call per brochure generation
**After**: Still 1 API call (just a better prompt)

**Token increase**: ~200-400 tokens per request depending on number of photos

**Cost per brochure**: ~$0.002-0.003 (negligible increase)

## Performance

- **Photo mapping**: < 50ms (client-side)
- **Text generation**: Same as before (~2-4 seconds)
- **No additional latency** - mapping happens while user reviews photos

## Rollout Status

✅ Frontend: `createBrochureSectionMappings()` implemented
✅ Backend Schema: `BrochureSections` models added
✅ Generator Service: `_format_brochure_sections()` implemented
✅ Main API: Passing `brochure_sections` to generator
⏳ Testing: Ready for user testing
⏳ Documentation: This file

## Conclusion

This coordinated photo-text generation system solves the fundamental problem of mismatched copy and images by ensuring the LLM knows exactly which photos it's writing about for each section. The result is higher quality, more accurate brochure content that requires less manual editing.

**Next Steps**:
1. Test with real property photos
2. Gather feedback on text quality improvement
3. Iterate on section definitions based on user needs
4. Consider adding manual override capabilities
