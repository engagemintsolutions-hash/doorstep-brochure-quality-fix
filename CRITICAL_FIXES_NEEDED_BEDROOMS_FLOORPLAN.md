# CRITICAL FIXES - Bedrooms & Floor Plan Upload

**Date**: October 17, 2025
**Priority**: HIGH
**Status**: 🔴 IDENTIFIED - Ready to Fix

---

## ISSUE #1: Bedroom Detection Not Updating Input Field

### Problem:
- Visual AI detects bedrooms from photos
- `autoDetectRoomCounts()` checks the bedroom CHECKBOX (e.g., "3_bedrooms" feature)
- BUT does NOT update the bedroom NUMBER input field (`#bedrooms`)
- Brochure validation checks `state.property.bedrooms` (from input field)
- User sees checkbox ticked but still gets "Please select bedrooms" error

### Root Cause:
**File**: `frontend/app_v2.js:4382-4420`

```javascript
function autoDetectRoomCounts() {
    // ... counts bedroom photos ...

    // THIS ONLY CHECKS THE CHECKBOX:
    const bedroomCheckbox = document.querySelector(`input[value="${estimatedBedrooms}_bedrooms"]`);
    if (bedroomCheckbox && !bedroomCheckbox.checked) {
        bedroomCheckbox.checked = true;
        // ... but doesn't update #bedrooms input field!
    }
}
```

**Validation Check**: `frontend/unified_brochure_builder.js:128`
```javascript
// This checks the INPUT FIELD value, not the checkbox!
if (state.property.bedrooms === 0 && state.property.bathrooms === 0) {
    validationErrors.push('Please specify number of bedrooms or bathrooms');
}
```

### Fix Required:
Add input field update to `autoDetectRoomCounts()`:

```javascript
function autoDetectRoomCounts() {
    // ... existing bedroom photo counting code ...

    // Auto-check bedroom checkbox
    if (estimatedBedrooms > 0) {
        const bedroomCheckbox = document.querySelector(`input[value="${estimatedBedrooms}_bedrooms"]`);
        if (bedroomCheckbox && !bedroomCheckbox.checked) {
            bedroomCheckbox.checked = true;
            autoDetectedCheckboxes.add(`${estimatedBedrooms}_bedrooms`);

            // ADD THIS: Update the actual bedrooms input field
            const bedroomsInput = document.getElementById('bedrooms');
            if (bedroomsInput) {
                bedroomsInput.value = estimatedBedrooms;
                console.log(`✓ Auto-set bedrooms input to ${estimatedBedrooms}`);
            }

            // ... existing badge code ...
        }
    }

    // ... existing bathroom code (needs same fix) ...

    // ALSO ADD: Update bathrooms input field
    if (estimatedBathrooms > 0) {
        const bathroomCheckbox = document.querySelector(`input[value="${estimatedBathrooms}_bathrooms"]`);
        if (bathroomCheckbox && !bathroomCheckbox.checked) {
            bathroomCheckbox.checked = true;
            autoDetectedCheckboxes.add(`${estimatedBathrooms}_bathrooms`);

            // ADD THIS: Update the actual bathrooms input field
            const bathroomsInput = document.getElementById('bathrooms');
            if (bathroomsInput) {
                bathroomsInput.value = estimatedBathrooms;
                console.log(`✓ Auto-set bathrooms input to ${estimatedBathrooms}`);
            }

            // ... existing badge code ...
        }
    }
}
```

---

## ISSUE #2: Manual Bedroom Checkbox Doesn't Update Input

### Problem:
- User manually ticks bedroom checkbox (e.g., "3 bedrooms")
- Checkbox is checked ✅
- But bedroom INPUT field stays at 0
- Validation fails because input field is checked, not checkbox

### Root Cause:
No event listener connecting bedroom checkbox changes to the input field.

### Fix Required:
Add event listener for bedroom/bathroom checkboxes:

**Location**: After `autoDetectRoomCounts()` function in `frontend/app_v2.js`

```javascript
// NEW FUNCTION: Sync checkbox selections to input fields
function syncRoomCheckboxesToInputs() {
    // Listen for bedroom checkbox changes
    document.querySelectorAll('input[name="features"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const value = e.target.value;

            // Check if it's a bedroom checkbox (e.g., "3_bedrooms")
            if (value.includes('_bedrooms')) {
                const bedroomCount = parseInt(value.split('_')[0]);
                const bedroomsInput = document.getElementById('bedrooms');

                if (e.target.checked && bedroomsInput) {
                    // Checkbox ticked → update input field
                    bedroomsInput.value = bedroomCount;
                    console.log(`✓ Synced bedrooms input to ${bedroomCount} from checkbox`);
                }
            }

            // Check if it's a bathroom checkbox (e.g., "2_bathrooms")
            if (value.includes('_bathrooms')) {
                const bathroomCount = parseInt(value.split('_')[0]);
                const bathroomsInput = document.getElementById('bathrooms');

                if (e.target.checked && bathroomsInput) {
                    // Checkbox ticked → update input field
                    bathroomsInput.value = bathroomCount;
                    console.log(`✓ Synced bathrooms input to ${bathroomCount} from checkbox`);
                }
            }
        });
    });
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    syncRoomCheckboxesToInputs();
});
```

---

## ISSUE #3: Floor Plan Upload Requires Two Clicks

### Problem:
- User clicks "Upload Floor Plan" button
- Nothing happens first time
- Second click works

### Root Cause:
**File**: `frontend/app_v2.js:2345-2350`

```javascript
document.addEventListener('DOMContentLoaded', () => {
    initFloorPlanUpload();    // OLD function (camelCase)
    initLogoUpload();
    initAgentPhotoUpload();
    initFloorplanUpload();    // NEW function (lowercase) - DUPLICATE!
    initEPCUpload();
});
```

**Two functions are initializing floor plan upload:**
1. `initFloorPlanUpload()` (camelCase) - lines ~2353
2. `initFloorplanUpload()` (lowercase) - lines ~XXXX

This creates **conflicting event listeners**, causing the first click to be handled by one function and ignored, then the second click works.

### Fix Required:

#### Option 1: Remove Duplicate (Recommended)
Find and remove the duplicate `initFloorplanUpload()` function, keep only `initFloorPlanUpload()`:

```javascript
document.addEventListener('DOMContentLoaded', () => {
    initFloorPlanUpload();    // KEEP THIS
    initLogoUpload();
    initAgentPhotoUpload();
    // REMOVE: initFloorplanUpload();  // ← DELETE THIS LINE
    initEPCUpload();
});
```

#### Option 2: Merge Functions
If both functions have different logic, merge them into one:

```javascript
function initFloorPlanUpload() {
    const uploadZone = document.getElementById('floorPlanUploadZone');
    const fileInput = document.getElementById('floorPlanInput');

    if (!uploadZone || !fileInput) {
        console.warn('Floor plan elements not found');
        return;
    }

    // Prevent multiple initializations
    if (uploadZone.dataset.initialized === 'true') {
        console.log('Floor plan upload already initialized, skipping');
        return;
    }
    uploadZone.dataset.initialized = 'true';

    // ... rest of upload logic ...
}
```

---

## TESTING CHECKLIST

### Test #1: Bedroom Auto-Detection
1. Upload photos with bedroom images
2. Wait for AI analysis to complete
3. Check console: Should see "✓ Auto-set bedrooms input to X"
4. Verify bedroom input field (`#bedrooms`) shows correct number
5. Verify bedroom checkbox is also ticked
6. Click "Generate Brochure" → Should NOT get "Please select bedrooms" error

### Test #2: Manual Bedroom Selection
1. Don't upload bedroom photos (or clear them)
2. Manually tick "3 Bedrooms" checkbox
3. Check console: Should see "✓ Synced bedrooms input to 3 from checkbox"
4. Verify bedroom input field shows "3"
5. Click "Generate Brochure" → Should NOT get validation error

### Test #3: Floor Plan Upload
1. Click "Upload Floor Plan" button ONCE
2. File picker should open immediately (first time)
3. Select floor plan file
4. Verify file preview appears
5. Should NOT require clicking upload button twice

---

## IMPLEMENTATION PRIORITY

1. **FIX #1 & #2 TOGETHER** (Bedroom sync) - HIGHEST PRIORITY
   - Both fixes go in `frontend/app_v2.js`
   - Update `autoDetectRoomCounts()` function
   - Add new `syncRoomCheckboxesToInputs()` function

2. **FIX #3** (Floor plan) - HIGH PRIORITY
   - Remove duplicate `initFloorplanUpload()` call
   - Add initialization guard to prevent double-init

---

## FILES TO MODIFY

| File | Lines | Change |
|------|-------|--------|
| `frontend/app_v2.js` | 4402-4420 | Add bedroom input field update |
| `frontend/app_v2.js` | 4432-4450 | Add bathroom input field update |
| `frontend/app_v2.js` | After 4450 | Add new `syncRoomCheckboxesToInputs()` function |
| `frontend/app_v2.js` | 2349 | Remove duplicate `initFloorplanUpload()` call |
| `frontend/app_v2.js` | 2353+ | Add initialization guard to `initFloorPlanUpload()` |

---

## ESTIMATED IMPACT

### Before Fixes:
- ❌ Auto-detected bedrooms don't work (checkbox ticked but validation fails)
- ❌ Manually ticked bedrooms don't work (same issue)
- ❌ Floor plan upload requires 2 clicks
- ❌ User frustration, can't generate brochure despite "70% complete"

### After Fixes:
- ✅ Auto-detected bedrooms work correctly
- ✅ Manual bedroom selection works
- ✅ Floor plan uploads on first click
- ✅ Validation passes when bedrooms are selected (any method)
- ✅ Smooth user experience

---

## NEXT STEPS

1. Apply Fix #1 & #2 to `frontend/app_v2.js`
2. Apply Fix #3 to `frontend/app_v2.js`
3. Test all three scenarios
4. Verify no console errors
5. Deploy to production

---

*These fixes address the root causes of bedroom validation and floor plan upload issues.*
