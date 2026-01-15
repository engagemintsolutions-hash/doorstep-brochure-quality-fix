# Brochure Builder Improvements - Implementation Plan

**Date**: October 15, 2025
**Status**: Planning Phase
**Priority**: High

## Executive Summary

This document outlines 8 critical improvements to the brochure builder system, addressing both bugs and feature enhancements needed for a complete pre-payment UX.

---

## 🐛 BUGS TO FIX (Priority 1)

### Bug #55: Page Builder Section Not Turning Orange After Save
**Current Issue**: When users click "Save and Continue" in the page builder modal, the "Build Your Brochure Pages" section header doesn't turn orange (completed state).

**Root Cause**:
- File: `frontend/index.html` lines 1178-1183
- The `updateAllSections()` function only checks:
  - `imageSection` (photos uploaded)
  - `essentialDetailsSection` (address, postcode, price, EPC, tenure)
  - `styleSection` (tone selected)
- **Missing**: `pageBuilderSection` completion check

**Solution**:
```javascript
// Add to index.html around line 1183
function checkPageBuilderComplete() {
    const pages = window.builtPages || [];
    return pages.length > 0;  // At least one page configured
}

function updateAllSections() {
    updateSectionHeader('imageSection', checkImageSectionComplete());
    updateSectionHeader('essentialDetailsSection', checkEssentialDetailsComplete());
    updateSectionHeader('styleSection', checkStyleSectionComplete());
    updateSectionHeader('pageBuilderSection', checkPageBuilderComplete());  // ADD THIS
}
```

**Files to Modify**:
- `frontend/index.html` (add completion check function)
- `frontend/page_builder.js` (trigger `updateAllSections()` after save)

---

### Bug #56: "Please Select Bedrooms" Error on Generate
**Current Issue**: When clicking "Generate Brochure", popup shows "please select bedrooms" even though bedroom/bathroom data is already filled via the tracker.

**Root Cause**:
- There's likely a validation function checking for bedroom/bathroom **checkboxes** from the old listing mode
- These checkboxes don't exist in brochure mode (we use input fields instead)

**Investigation Needed**:
```bash
# Search for the validation error
grep -rn "please select bedroom" frontend/
```

**Expected Fix Location**:
- Likely in `frontend/app_v2.js` or `frontend/index.html`
- Remove or update the checkbox validation to check input fields instead

**Solution Pattern**:
```javascript
// OLD (wrong for brochure mode)
const bedroomCheckbox = document.querySelector('input[name="bedrooms"]:checked');

// NEW (correct for brochure mode)
const bedroomInput = document.getElementById('bedrooms');
const hasBedrooms = bedroomInput && bedroomInput.value && parseInt(bedroomInput.value) > 0;
```

---

## ✨ FEATURES TO ADD (Priority 2)

### Feature #1: Page Count Slider
**Requirement**: Agents need control over how many pages are in the brochure

**Proposed Design**:
```
┌─────────────────────────────────────────┐
│  Number of Pages: [====●====] 8 pages   │
│  Range: 4-16 pages                      │
└─────────────────────────────────────────┘
```

**Implementation**:
- Add slider to page builder modal header
- Min: 4 pages (cover + intro + 2 content)
- Max: 16 pages (reasonable upper limit)
- Default: Smart calculation based on photo count
  - Formula: `Math.ceil(photoCount / 2.5) + 2` (cover + back page)
  - Example: 20 photos = 10 pages (8 content + cover + back)

**Smart Page Distribution**:
```javascript
function calculateOptimalPages(photoCount) {
    const MIN_PAGES = 4;
    const MAX_PAGES = 16;
    const PHOTOS_PER_PAGE_AVG = 2.5;

    // +2 for cover and back page
    const calculated = Math.ceil(photoCount / PHOTOS_PER_PAGE_AVG) + 2;

    return Math.max(MIN_PAGES, Math.min(MAX_PAGES, calculated));
}
```

**Files to Modify**:
- `frontend/page_builder.js` (add slider UI + logic)
- `frontend/styles_v2.css` (slider styling)

---

### Feature #2: Word Count Slider
**Requirement**: Control over total word count for content density

**Proposed Design**:
```
┌─────────────────────────────────────────┐
│  Total Words: [====●========] 1,200     │
│  Range: 400-2,000 words                 │
│  Per page avg: ~150 words               │
└─────────────────────────────────────────┘
```

**Smart Word Distribution**:
- Calculate per-page allocation based on page type
- Cover page: 50 words (headline + tagline)
- Content pages: 100-200 words each
- Back page: 50 words (CTA + contact)

**Implementation**:
```javascript
function distributeWords(totalWords, pageCount) {
    const COVER_WORDS = 50;
    const BACK_WORDS = 50;
    const contentPages = pageCount - 2;
    const wordsPerPage = Math.floor((totalWords - COVER_WORDS - BACK_WORDS) / contentPages);

    return {
        cover: COVER_WORDS,
        content: wordsPerPage,
        back: BACK_WORDS
    };
}
```

**Files to Modify**:
- `frontend/page_builder.js` (slider + distribution logic)
- Backend generation needs to respect word limits per page

---

## 🎯 UX IMPROVEMENTS (Priority 2)

### Improvement #1: Smart Photo Distribution Across Pages
**Problem**: With 20+ photos, some pages have 6 photos while others have 1-2

**Current Logic Issues**:
- No balancing algorithm
- No photo-per-page limits
- No consideration of page aesthetics

**Proposed Solution - Balanced Distribution**:

```javascript
function distributePhotosAcrossPages(photos, pageCount) {
    const contentPages = pageCount - 2;  // Exclude cover and back
    const photosPerPage = Math.ceil(photos.length / contentPages);

    // MAX photos per page for aesthetics
    const MAX_PHOTOS_PER_PAGE = 4;
    const MIN_PHOTOS_PER_PAGE = 1;

    if (photosPerPage > MAX_PHOTOS_PER_PAGE) {
        // Need more pages!
        const newPageCount = Math.ceil(photos.length / MAX_PHOTOS_PER_PAGE) + 2;
        console.warn(`⚠️ ${photos.length} photos need ${newPageCount} pages (currently ${pageCount})`);
        // Auto-suggest increasing pages
        return autoSuggestPages(photos.length);
    }

    // Distribute evenly
    const distribution = [];
    for (let i = 0; i < contentPages; i++) {
        const start = i * photosPerPage;
        const end = Math.min(start + photosPerPage, photos.length);
        distribution.push(photos.slice(start, end));
    }

    return distribution;
}
```

**Auto-Page-Increase Logic**:
```javascript
function autoSuggestPages(photoCount) {
    const IDEAL_PHOTOS_PER_PAGE = 2.5;
    const suggested = Math.ceil(photoCount / IDEAL_PHOTOS_PER_PAGE) + 2;

    // Show notification to user
    showNotification(
        `📸 With ${photoCount} photos, we recommend ${suggested} pages for best layout`,
        'info',
        {
            action: 'Adjust',
            callback: () => setPageCount(suggested)
        }
    );

    return suggested;
}
```

**Files to Modify**:
- `frontend/page_builder.js` (add balancing algorithm)
- `services/generator.py` (backend Smart Defaults logic)

---

### Improvement #2: Photo-Text Relevance Validation
**Problem**: Kitchen photo shows "fireplace, walk-in wardrobe" which aren't relevant

**Root Cause**:
- AI analyzing ALL photos together
- Assigning features to wrong photos
- No per-photo feature validation

**Solution - Per-Photo Feature Validation**:

```javascript
// In app_v2.js - after AI analysis
function validatePhotoFeatures(photo, features) {
    const photoCategory = photo.aiCategory;  // e.g., "kitchen"
    const validFeatures = [];

    // Category-specific feature mapping
    const categoryFeatureMap = {
        'kitchen': ['kitchen_island', 'breakfast_bar', 'range_cooker', 'cabinets', 'appliances'],
        'bedroom': ['fitted_wardrobes', 'ensuite', 'built_in_storage', 'large_windows'],
        'bathroom': ['double_vanity', 'bathtub', 'shower', 'toilet', 'tiles'],
        'living_room': ['fireplace', 'bay_window', 'french_doors', 'high_ceilings'],
        'exterior': ['driveway', 'garage', 'garden', 'patio', 'decking'],
        // ... more categories
    };

    const allowedFeatures = categoryFeatureMap[photoCategory] || [];

    features.forEach(feature => {
        if (allowedFeatures.includes(feature.toLowerCase())) {
            validFeatures.push(feature);
        } else {
            console.warn(`❌ Filtered out irrelevant feature "${feature}" from ${photoCategory} photo`);
        }
    });

    return validFeatures;
}
```

**Enhanced Smart Defaults**:
```javascript
// When generating page content
function generatePageContent(page, photos) {
    const pageFeatures = [];

    photos.forEach(photo => {
        // Only add features that are ACTUALLY visible in THIS photo
        const photoFeatures = photo.detectedFeatures || [];
        const validated = validatePhotoFeatures(photo, photoFeatures);
        pageFeatures.push(...validated);
    });

    // Remove duplicates
    const uniqueFeatures = [...new Set(pageFeatures)];

    // Generate text using ONLY relevant features
    return {
        photos: photos,
        features: uniqueFeatures,
        text: generateTextFromFeatures(uniqueFeatures)
    };
}
```

**Files to Modify**:
- `frontend/app_v2.js` (add validation logic after AI analysis)
- `frontend/page_builder.js` (use validated features only)
- `services/generator.py` (backend Smart Defaults text generation)

---

### Improvement #3: Drag-and-Drop Page Builder
**Requirement**: Agents need to click and drag elements around

**Proposed Solution - SortableJS Library**:

**Why SortableJS?**
- Lightweight (20KB)
- Touch-friendly
- No dependencies
- Works with existing DOM structure

**Implementation**:

1. **Add Library**:
```html
<!-- In index.html <head> -->
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
```

2. **Make Photo Grid Sortable**:
```javascript
// In page_builder.js
function makePhotoGridSortable(pageIndex) {
    const gridElement = document.querySelector(`#page-${pageIndex} .photo-grid`);

    new Sortable(gridElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.photo-card',  // Drag by photo card

        // On drop, reorder the photos array
        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            // Update internal data structure
            const page = window.builtPages[pageIndex];
            const movedPhoto = page.photos.splice(oldIndex, 1)[0];
            page.photos.splice(newIndex, 0, movedPhoto);

            console.log(`📸 Moved photo from position ${oldIndex} to ${newIndex}`);

            // Save changes
            savePagesLocally();
        }
    });
}
```

3. **Make Pages Themselves Sortable**:
```javascript
function makePagesSortable() {
    const pagesContainer = document.getElementById('pagesList');

    new Sortable(pagesContainer, {
        animation: 200,
        handle: '.page-drag-handle',
        draggable: '.page-card',

        onEnd: function(evt) {
            // Reorder pages
            const movedPage = window.builtPages.splice(evt.oldIndex, 1)[0];
            window.builtPages.splice(evt.newIndex, 0, movedPage);

            console.log(`📄 Moved page from ${evt.oldIndex} to ${evt.newIndex}`);
            savePagesLocally();
            renderAllPages();
        }
    });
}
```

4. **Visual Feedback**:
```css
/* In styles_v2.css */
.sortable-ghost {
    opacity: 0.4;
    background: #f0f7fc;
    border: 2px dashed #17A2B8;
}

.sortable-chosen {
    cursor: grabbing !important;
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.sortable-drag {
    cursor: grabbing !important;
}

.photo-card {
    cursor: grab;
}

.photo-card:active {
    cursor: grabbing;
}
```

**Files to Modify**:
- `frontend/index.html` (add SortableJS library)
- `frontend/page_builder.js` (implement drag-and-drop)
- `frontend/styles_v2.css` (add visual feedback styles)

---

## 🎨 PRE-PAYMENT UX COMPLETENESS

### Current State Analysis

**What Works**:
- ✅ Photo upload and AI analysis
- ✅ Smart Defaults auto-generates pages
- ✅ Progress tracking
- ✅ Agent details pre-population

**What's Missing for Complete Experience**:
- ❌ Can't preview final brochure layout
- ❌ Can't see estimated page count
- ❌ Can't adjust content density
- ❌ Can't reorder photos/pages
- ❌ No indication of what's missing before payment

### Recommended Pre-Payment Enhancements

1. **Live Brochure Preview** (Most Important)
```
┌──────────────────────────────────────┐
│  📄 Your Brochure Preview            │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Page 1 │ │ Page 2 │ │ Page 3 │   │
│  │ Cover  │ │  Bed   │ │Kitchen │   │
│  └────────┘ └────────┘ └────────┘   │
│                                      │
│  8 pages • 1,200 words • 20 photos  │
│  [Preview Full Brochure →]          │
└──────────────────────────────────────┘
```

2. **Readiness Checklist**
```
┌──────────────────────────────────────┐
│  ✅ Completion Checklist              │
│  ✓ 20 photos uploaded                │
│  ✓ Property details complete         │
│  ✓ 8 pages built                     │
│  ✓ Style preferences set             │
│  ✓ Agent details added               │
│                                      │
│  🎉 Ready to generate!               │
│  [Generate Brochure (£X) →]         │
└──────────────────────────────────────┘
```

3. **Smart Recommendations**
```
💡 Recommendations:
• Consider adding 2 more pages for better photo spacing
• Word count is low - add more detail to key rooms
• No floor plan uploaded - consider adding (+5% value)
```

4. **Cost Calculator**
```
┌──────────────────────────────────────┐
│  💷 Cost Breakdown                    │
│  Base brochure (8 pages)     £15.00 │
│  Extra pages (2)              £4.00 │
│  Floor plan bonus            -£1.00 │
│  ─────────────────────────────────── │
│  Total                       £18.00 │
└──────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Critical Bugs (1-2 hours)
- [ ] Bug #55: Fix page builder section orange header
- [ ] Bug #56: Fix bedroom validation error
- [ ] Test validation flow end-to-end

### Phase 2: Control Sliders (2-3 hours)
- [ ] Add page count slider (4-16 range)
- [ ] Add word count slider (400-2000 range)
- [ ] Implement smart distribution logic
- [ ] Test with various photo counts

### Phase 3: Photo Distribution (3-4 hours)
- [ ] Implement balanced photo distribution algorithm
- [ ] Add auto-suggest page increase
- [ ] Add photo-text relevance validation
- [ ] Test with 5, 10, 20, 30 photo scenarios

### Phase 4: Drag-and-Drop (4-5 hours)
- [ ] Integrate SortableJS library
- [ ] Make photo grids sortable
- [ ] Make page order sortable
- [ ] Add visual feedback and animations
- [ ] Comprehensive testing

### Phase 5: UX Polish (2-3 hours)
- [ ] Add live preview thumbnails
- [ ] Add readiness checklist
- [ ] Add smart recommendations
- [ ] Add cost calculator
- [ ] Final end-to-end testing

**Total Estimated Time**: 12-17 hours

---

## 🚀 NEXT STEPS

1. **Review this plan** - Confirm priorities and approach
2. **Start with Phase 1** - Fix critical bugs first
3. **Implement Phase 2** - Add control sliders for immediate value
4. **User testing** - Get feedback before Phase 3-5
5. **Iterate** - Refine based on real agent usage

---

## 📊 SUCCESS METRICS

**Before Improvements**:
- Agents unsure if brochure is ready
- Manual photo distribution feels random
- No control over page count/density
- Can't reorder anything

**After Improvements**:
- Clear completion indicators
- Professional, balanced layouts
- Full control over output
- Intuitive drag-and-drop editing
- Confidence before payment

---

## QUESTIONS FOR DISCUSSION

1. **Page Count**: Is 16 pages a reasonable maximum? (More pages = more cost?)
2. **Word Count**: Should this be per-page or total? Both?
3. **Drag-and-Drop**: Do we need text editing too, or just photo reordering?
4. **Pre-Payment Preview**: Full PDF preview or just thumbnails?
5. **Smart Defaults**: Should agent approval be required, or auto-apply with edit option?

---

**Document Status**: Ready for Review
**Next Action**: Prioritize and begin Phase 1 implementation
