# Brochure Editor Architecture Guide

This document explains how the brochure editor system works for future development sessions.

## Overview

The brochure editor is a Canva-style design tool for UK estate agents to create property brochures and social media posts. It runs as a web application with a FastAPI backend and vanilla JavaScript frontend.

## Quick Start

```bash
# Start the server
uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

# Open editor
http://127.0.0.1:8000/static/brochure_editor_v3.html
```

## File Structure

### Backend (Python/FastAPI)
```
backend/
├── main.py           # FastAPI routes, all API endpoints
├── config.py         # Settings from environment variables
├── schemas.py        # Pydantic models for validation

services/
├── generator.py      # Text generation for property descriptions
├── claude_client.py  # Anthropic API wrapper
├── background_remover.py  # AI background removal (rembg)
├── export_service.py # PDF/ZIP generation
├── pdf_generator.py  # ReportLab PDF creation
```

### Frontend (JavaScript Modules)

The frontend uses the **IIFE pattern** (Immediately Invoked Function Expression) for all modules:

```javascript
const ModuleName = (function() {
    'use strict';
    // Private vars and functions here

    return {
        // Public API
        init,
        someFunction,
        isLoaded: true  // Always include for testing
    };
})();

window.ModuleName = ModuleName;  // Global export
```

#### Core Editor Files
| File | Purpose |
|------|---------|
| `brochure_editor_v3.html` | Main editor HTML, loads all scripts |
| `brochure_editor_v3.css` | All editor styles |
| `brochure_editor_v3.js` | Core editor logic (EditorState, canvas) |

#### Phase 1 Features (Canva Basics)
| File | Module | Purpose |
|------|--------|---------|
| `element_drag.js` | ElementDrag | Drag & drop from sidebar to canvas |
| `elements_library.js` | ElementsLibrary | Shapes, text, icons library |
| `stock_photos_api.js` | StockPhotosAPI | Unsplash/Pexels/Pixabay integration |
| `real_templates.js` | RealTemplates | 24 unique template layouts |
| `template_previews.js` | TemplatePreviews | SVG preview generation |
| `export_modal.js` | ExportModal | PNG/JPG/PDF/WebP export |
| `color_picker.js` | ColorPicker | Rich color picker with palettes |
| `backgrounds_library.js` | BackgroundsLibrary | Patterns, gradients, solids |
| `photo_frames.js` | PhotoFrames | Shape frames, decorative, grids |
| `font_loader.js` | FontLoader | Google Fonts integration |

#### Phase 2 Features (Advanced)
| File | Module | Purpose |
|------|--------|---------|
| `photo_effects.js` | PhotoEffects | 29 filters, 14 adjustments |
| `background_removal.js` | BackgroundRemoval | AI background removal UI |
| `onboarding.js` | Onboarding | 10-step tutorial for new users |
| `keyboard_shortcuts.js` | KeyboardShortcuts | 43 shortcuts, help panel |

#### Phase 3 Features (Pro)
| File | Module | Purpose |
|------|--------|---------|
| `magic_resize.js` | MagicResize | 28 formats (print, social, property, web) |
| `animations.js` | Animations | 32 animations (entrance, emphasis, exit, text) |
| `version_history.js` | VersionHistory | IndexedDB storage, 50 versions max |

#### Phase 4-5 Features (Premium)
| File | Module | Purpose |
|------|--------|---------|
| `brand_kit_v2.js` | BrandKitV2 | 8 UK estate agent presets, custom colors |
| `ai_content.js` | AIContent | AI-powered content generation |
| `quick_actions.js` | QuickActions | Floating toolbar with 9 quick actions |

## Key APIs

### RealTemplates
```javascript
// 24 unique layouts
RealTemplates.COVER_LAYOUTS      // 10 cover page layouts
RealTemplates.DETAILS_LAYOUTS    // 5 details page layouts
RealTemplates.GALLERY_LAYOUTS    // 6 gallery layouts
RealTemplates.CONTACT_LAYOUTS    // 3 contact layouts
RealTemplates.FULL_TEMPLATES     // 5 complete templates

RealTemplates.getLayout(id, pageType)  // Get layout definition
RealTemplates.applyLayout(element, layoutId, pageType, data)
```

### PhotoEffects
```javascript
PhotoEffects.FILTER_PRESETS     // 29 presets (vintage, warm, cool, etc.)
PhotoEffects.ADJUSTMENTS        // 14 controls (brightness, contrast, etc.)
PhotoEffects.CATEGORIES         // 7 categories

PhotoEffects.generateFilterCSS(adjustments)  // Get CSS filter string
PhotoEffects.applyPreset(element, presetId)
PhotoEffects.show(element, position, onUpdate)  // Open panel
```

### BackgroundRemoval
```javascript
// Remove background via API
await BackgroundRemoval.removeBackground(imageElement, options)

// Show modal for user interaction
BackgroundRemoval.showModal(imageElement, onComplete)
```

### KeyboardShortcuts
```javascript
KeyboardShortcuts.SHORTCUTS     // All shortcuts by category
KeyboardShortcuts.showHelp()    // Open help modal (or press ?)
KeyboardShortcuts.registerHandler(action, callback)  // Add handler
```

### Onboarding
```javascript
Onboarding.TOUR_STEPS          // 10 tutorial steps
Onboarding.start()             // Start tutorial
Onboarding.hasCompleted()      // Check if user finished
Onboarding.reset()             // Clear completion status
```

### MagicResize
```javascript
MagicResize.FORMATS            // 28 formats in 4 categories (print, social, property, web)
MagicResize.getFormat(id)      // Get format definition
MagicResize.getAllFormats()    // Get flat list of all formats
MagicResize.showModal(currentFormat, onResize)  // Open resize modal
MagicResize.resizeElements(elements, from, to, mode)  // Resize element positions
```

### Animations
```javascript
Animations.ANIMATIONS          // 32 animations in 4 categories
Animations.EASINGS             // Easing presets
Animations.applyAnimation(element, animId, options)  // Apply animation
Animations.removeAnimation(element)
Animations.previewAnimation(element, animId)
Animations.showPanel(element, onApply)  // Open animation panel
```

### VersionHistory
```javascript
VersionHistory.saveVersion(projectId, data, label)  // Save snapshot
VersionHistory.getVersions(projectId)    // Get all versions
VersionHistory.restoreVersion(id, onRestore)  // Restore a version
VersionHistory.showPanel(onRestore)      // Open history panel
VersionHistory.startAutoSave(getData)    // Start auto-save (5 min)
VersionHistory.stopAutoSave()
VersionHistory.MAX_VERSIONS              // 50
```

### BrandKitV2
```javascript
BrandKitV2.PRESET_KITS         // 8 UK estate agent presets
BrandKitV2.getKit()            // Get current brand kit
BrandKitV2.updateKit(property, value)  // Update kit property
BrandKitV2.applyPreset(presetId)       // Apply a preset
BrandKitV2.addLogo(logoData)   // Add logo to kit
BrandKitV2.showPanel(onApply)  // Open brand kit panel
```

### AIContent
```javascript
AIContent.CONTENT_TYPES        // 6 types (headline, tagline, description, features, social, email)
AIContent.TONES                // 5 tones (professional, luxury, friendly, punchy, descriptive)
AIContent.generate(options)    // Generate via API
AIContent.quickGenerate(type, data, tone)  // Generate with fallback
AIContent.showModal(onInsert)  // Open generation modal
```

### QuickActions
```javascript
QuickActions.ACTIONS           // 9 quick actions
QuickActions.show()            // Show toolbar
QuickActions.hide()            // Hide toolbar
QuickActions.toggle()          // Toggle visibility
```

## Backend API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/generate` | POST | Generate property descriptions |
| `/api/remove-background` | POST | AI background removal |
| `/api/export/pdf` | POST | Generate PDF |
| `/api/export/pack` | POST | Generate marketing pack ZIP |

### Background Removal Request
```json
POST /api/remove-background
{
    "image_base64": "data:image/png;base64,...",
    "alpha_matting": false,
    "foreground_threshold": 240,
    "background_threshold": 10
}
```

## Testing

All test files are in the project root:

```bash
# Phase 1 comprehensive test
python test_phase1_final.py

# Phase 2 tests
python test_phase2.py
python test_phase2_deep.py

# Run with server already running on port 8000
```

Test pattern:
```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
driver = webdriver.Chrome(options=options)
driver.get("http://127.0.0.1:8000/static/brochure_editor_v3.html")

# Check module loaded
loaded = driver.execute_script("return typeof ModuleName !== 'undefined' && ModuleName.isLoaded")
```

## Adding New Features

1. Create new JS file with IIFE pattern
2. Add `isLoaded: true` to return object
3. Add script tag to `brochure_editor_v3.html`
4. Write test in `test_phaseX.py`

### Script Tag Location
Scripts are loaded at the end of `brochure_editor_v3.html`:
```html
<!-- Phase 2: Advanced Features -->
<script src="photo_effects.js?v=20260115_EFFECTS"></script>
<script src="background_removal.js?v=20260115_BGREM"></script>
...
```

## Feature Inventory

### Phase 1 (Complete)
- [x] Drag & drop elements
- [x] Stock photos (Unsplash/Pexels/Pixabay)
- [x] 24 real template layouts
- [x] Template previews (SVG)
- [x] Multi-format export (PNG/JPG/PDF/WebP)
- [x] Rich color picker (8 palettes)
- [x] Background patterns/gradients (63 options)
- [x] Photo frames (49 frames)
- [x] Google Fonts (47 fonts)

### Phase 2 (Complete)
- [x] Photo effects (29 filters, 14 adjustments)
- [x] AI background removal
- [x] Onboarding tutorial (10 steps)
- [x] Keyboard shortcuts (43 shortcuts)

### Phase 3 (Complete)
- [x] Magic Resize (28 formats across 4 categories)
- [x] Animation System (32 animations in 4 categories)
- [x] Version History (IndexedDB, max 50 versions, auto-save)

### Phase 4-5 (Complete)
- [x] Brand Kit V2 (8 UK estate agent presets, custom colors, logos)
- [x] AI Content Generation (6 content types, 5 tones)
- [x] Quick Actions Toolbar (9 quick actions, draggable)

## Common Issues

1. **Module not loaded**: Check script tag in HTML, check for JS errors in console
2. **Escape characters in Python tests**: Use single quotes for Python, double for JS
3. **Server not responding**: Run `uvicorn backend.main:app --reload`
4. **Background removal slow**: First call loads rembg model (~30s)

## Environment

- Python 3.x with FastAPI, uvicorn
- rembg for background removal
- Selenium + Chrome for testing
- No build step - vanilla JS
