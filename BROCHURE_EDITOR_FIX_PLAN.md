# Brochure Editor - Comprehensive Fix Plan
**Date**: October 17, 2025
**Issues**: Drag-and-drop not working, Floor plan missing, Location page missing

---

## Problem Analysis

### Issue #1: Drag-and-Drop Not Working for Photos and Content Blocks

**Symptom**:
- Blue overlay flashes when dragging
- Photos don't move between pages
- Content blocks don't reorder
- Drag operation appears to start but nothing happens on drop

**Root Cause**:
Event listeners are attached ONCE after initial render (line 106-109 in `interactive_brochure_editor_v2.js`):
```javascript
setTimeout(() => {
    initializeDragAndDrop();
    initializeKeyboardNavigation();
    initializePhotoDragBetweenPages();       // ← Attaches listeners to DOM elements
    initializeContentBlockDrag();            // ← Attaches listeners to DOM elements
}, 100);
```

When `renderInteractiveBrochureEditor()` is called again (after any change), it:
1. Regenerates ALL HTML with `previewContainer.innerHTML = ...` (line 51)
2. Destroys all existing DOM elements
3. Creates new DOM elements
4. **NEVER re-initializes drag-and-drop** on the new elements

The initialization functions attach listeners to specific DOM elements, but those elements no longer exist after a re-render.

**Evidence from Code**:

`initializePhotoDragBetweenPages()` (lines 1491-1561):
```javascript
function initializePhotoDragBetweenPages() {
    // ...
    const photoElements = photosGrid.querySelectorAll('[draggable="true"]');
    photoElements.forEach((photoEl) => {
        photoEl.addEventListener('dragstart', ...);   // ← Listener attached to OLD DOM element
        photoEl.addEventListener('dragend', ...);     // ← Lost on next render
    });
}
```

After `renderInteractiveBrochureEditor()` is called:
- Old `photoElements` are removed from DOM
- New `photoElements` are created with `draggable="true"`
- New elements have NO event listeners

---

### Issue #2: Floor Plan Not Populating on Designated Page

**Symptom**:
- Floor plan upload works
- Floor plan preview shows after upload
- Floor plan doesn't appear in brochure editor pages

**Root Cause #2A: State Not Transferred**:

In `interactive_brochure_editor_v2.js` line 122:
```javascript
const hasFloorPlan = state.floorPlan && index === 0;
```

Checks `state.floorPlan`, but this may not be set when brochure is generated.

**Root Cause #2B: Floor Plan Only on First Page**:

The check `index === 0` means floor plan ONLY shows on the very first page (cover page), not on a dedicated floor plan page.

**Root Cause #2C: No Dedicated Floor Plan Page**:

Floor plans are embedded into existing pages, not created as a separate page type with:
```javascript
{
    id: X,
    name: 'Floor Plan',
    type: 'floorplan',
    photos: [floorPlan],
    contentBlocks: []
}
```

---

### Issue #3: Location Page Missing

**Symptom**:
- No dedicated "Location" page in brochure
- Location information (schools, transport, amenities) not visible

**Root Cause**:

Location data is NOT created as a separate page. Instead, it's embedded into the first non-cover page as content blocks (unified_brochure_builder.js lines 563-569):

```javascript
// Add location info to the first non-cover page
if (pages.length > 1 && property.locationEnrichment) {
    pages[1].content = [
        {
            type: 'location_info',
            text: property.locationEnrichment.schools || property.locationEnrichment.amenities
        }
    ];
}
```

This means:
- Location data is mixed with property details
- No dedicated visual page for location
- User can't see/edit location as a separate entity

---

## Comprehensive Fix Strategy

### Fix #1: Re-initialize Drag-and-Drop After Every Render

**Location**: `interactive_brochure_editor_v2.js`

**Approach**: Call initialization functions at the END of `renderInteractiveBrochureEditor()`, not just once.

**Current Flow**:
```
renderInteractiveBrochureEditor() called
  → Generates HTML
  → setTimeout() → Initialize (ONCE)

User drags photo
  → renderInteractiveBrochureEditor() called again
  → Generates NEW HTML
  → NO re-initialization ❌
  → Event listeners gone
```

**Fixed Flow**:
```
renderInteractiveBrochureEditor() called
  → Generates HTML
  → initializeDragAndDrop()        ← EVERY TIME
  → initializePhotoDragBetweenPages()
  → initializeContentBlockDrag()

User drags photo
  → renderInteractiveBrochureEditor() called again
  → Generates NEW HTML
  → initializeDragAndDrop()        ← Event listeners re-attached ✅
  → initializePhotoDragBetweenPages()
  → initializeContentBlockDrag()
```

**Implementation**:

**Step 1**: Move initialization call from line 106 to END of `renderInteractiveBrochureEditor()`:

```javascript
function renderInteractiveBrochureEditor() {
    // ... existing HTML generation code ...

    // RE-INITIALIZE after DOM is updated
    setTimeout(() => {
        initializeDragAndDrop();
        initializeKeyboardNavigation();
        initializePhotoDragBetweenPages();
        initializeContentBlockDrag();
    }, 50);  // Short delay to ensure DOM is fully rendered
}
```

**Step 2**: Remove original initialization from line 104-110 (keep only first call, but move it into function)

---

### Fix #2: Ensure Floor Plan Page is Always Created

**Location**: `unified_brochure_builder.js` or page generation logic

**Approach #2A**: Add floor plan to global state when uploaded

In `app_v2.js` where floor plan upload is handled:
```javascript
function handleFloorPlanUpload(event) {
    // ... existing code ...

    // ADD THIS: Store in unified state
    if (window.UnifiedBrochureState) {
        window.UnifiedBrochureState.floorPlan = {
            dataUrl: e.target.result,
            name: file.name
        };
    }
}
```

**Approach #2B**: Create dedicated floor plan page

In `unified_brochure_builder.js` where pages are generated:
```javascript
// After generating photo pages, ALWAYS add floor plan page if available
if (window.uploadedFloorPlan || window.UnifiedBrochureState?.floorPlan) {
    const floorPlanData = window.uploadedFloorPlan || window.UnifiedBrochureState.floorPlan;

    state.pages.push({
        id: state.pages.length + 1,
        name: 'Floor Plan',
        type: 'floorplan',
        photos: [{
            dataUrl: floorPlanData.data || floorPlanData.dataUrl,
            name: floorPlanData.name || 'Floor Plan',
            category: 'floorplan'
        }],
        contentBlocks: [
            {
                icon: '🗺️',
                type: 'floorplan_info',
                text: 'Property Layout'
            }
        ],
        locked: false
    });

    console.log('✅ Added dedicated floor plan page');
}
```

---

### Fix #3: Create Dedicated Location Page

**Location**: `unified_brochure_builder.js`

**Approach**: Add location page generation logic

```javascript
// After generating all property pages, add location page if enrichment data exists
if (state.property.locationEnrichment) {
    const enrichment = state.property.locationEnrichment;
    const contentBlocks = [];

    // Schools
    if (enrichment.schools) {
        contentBlocks.push({
            icon: '🏫',
            type: 'schools',
            title: 'Schools & Education',
            text: enrichment.schools
        });
    }

    // Transport
    if (enrichment.transport) {
        contentBlocks.push({
            icon: '🚇',
            type: 'transport',
            title: 'Transport Links',
            text: enrichment.transport
        });
    }

    // Amenities
    if (enrichment.amenities) {
        contentBlocks.push({
            icon: '🏪',
            type: 'amenities',
            title: 'Local Amenities',
            text: enrichment.amenities
        });
    }

    if (contentBlocks.length > 0) {
        state.pages.push({
            id: state.pages.length + 1,
            name: 'Location',
            type: 'location',
            photos: [], // Could add map image if available
            contentBlocks: contentBlocks,
            locked: false
        });

        console.log('✅ Added dedicated location page');
    }
}
```

---

## Implementation Priority

1. **HIGHEST**: Fix #1 (Drag-and-drop) - Critical UX blocker
2. **HIGH**: Fix #2 (Floor plan page) - Expected functionality
3. **MEDIUM**: Fix #3 (Location page) - Enhancement

---

## Testing Checklist

### Test #1: Photo Drag-and-Drop
- [ ] Upload photos
- [ ] Generate brochure
- [ ] Drag photo from Page 2 to Page 3
- [ ] Verify photo moves successfully
- [ ] Verify photo appears on Page 3
- [ ] Verify photo removed from Page 2

### Test #2: Content Block Drag-and-Drop
- [ ] Open page with multiple content blocks
- [ ] Drag "Bedrooms" block to reorder
- [ ] Verify blocks reorder successfully
- [ ] Verify order persists after save

### Test #3: Floor Plan Page
- [ ] Upload floor plan during property setup
- [ ] Generate brochure
- [ ] Verify dedicated "Floor Plan" page exists
- [ ] Verify floor plan image displays correctly
- [ ] Verify floor plan page can be reordered

### Test #4: Location Page
- [ ] Fill in enrichment data (schools, transport, amenities)
- [ ] Generate brochure
- [ ] Verify dedicated "Location" page exists
- [ ] Verify all enrichment content blocks display
- [ ] Verify location page can be reordered

---

## Files to Modify

| File | Lines | Change |
|------|-------|--------|
| `frontend/interactive_brochure_editor_v2.js` | 33-112 | Move initialization to end of `renderInteractiveBrochureEditor()` |
| `frontend/interactive_brochure_editor_v2.js` | 1491-1561 | Add console logging for debugging |
| `frontend/interactive_brochure_editor_v2.js` | 1570-1638 | Add console logging for debugging |
| `frontend/app_v2.js` | Floor plan upload handler | Add state storage for floor plan |
| `frontend/unified_brochure_builder.js` | Page generation | Add floor plan page creation |
| `frontend/unified_brochure_builder.js` | Page generation | Add location page creation |

---

**Status**: READY TO IMPLEMENT

**Estimated Impact**: All drag-and-drop features will work, floor plan and location pages will always be created when data exists.
