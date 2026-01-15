# Word-Like Editing System Proposal
**Property Listing Brochure Generator - V4 Editor Enhancement**

**Date**: 2025-10-20
**Status**: Strategic Proposal - Not Yet Implemented
**Estimated Development**: 4-6 weeks (full implementation)

---

## Executive Summary

Transform the brochure editor into an industry-leading product by implementing Microsoft Word-style editing capabilities. This includes:

- **Free-form image positioning** (drag anywhere on the page)
- **Text wrapping** around images (square, tight, through, top/bottom)
- **Inline editing** with rich text controls
- **Layer management** (bring forward, send backward)
- **Snap-to-grid** and alignment guides

### Key Differentiator
Most property brochure tools use rigid templates. A Word-like editor gives agents complete creative control while maintaining professional output quality. This is a major competitive advantage.

---

## Current State vs. Proposed State

### Current Editor (V3)
- ✅ Fixed layout grids (text-top, photo-right, etc.)
- ✅ Pre-defined page structures
- ✅ Contenteditable text blocks
- ❌ Images locked to grid cells
- ❌ No free positioning
- ❌ No text wrapping
- ❌ Limited layout flexibility

### Proposed Editor (V4)
- ✅ Everything from V3, plus:
- ✅ Drag-and-drop images anywhere
- ✅ Text wraps around images dynamically
- ✅ Resize images with handles
- ✅ Z-index layering controls
- ✅ Alignment guides and snapping
- ✅ Undo/redo for all actions

---

## Core Features

### 1. Free-Form Image Positioning

**User Experience:**
- Click and drag any image to move it anywhere on the page
- Drop zones show visual feedback (highlight)
- Images can overlap text or other images
- Position persisted in session data

**Technical Implementation:**
```javascript
// Image wrapper with absolute positioning
<div class="floating-image"
     style="position: absolute; left: 120px; top: 200px; width: 300px; z-index: 10;"
     data-image-id="img_123">
    <img src="..." />
    <div class="resize-handles">
        <!-- 8 resize handles: corners + sides -->
    </div>
</div>

// Drag handler
function enableImageDragging(imageElement) {
    let isDragging = false;
    let startX, startY, offsetX, offsetY;

    imageElement.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = imageElement.getBoundingClientRect();
        offsetX = startX - rect.left;
        offsetY = startY - rect.top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;
        imageElement.style.left = `${newX}px`;
        imageElement.style.top = `${newY}px`;

        // Trigger text reflow
        recalculateTextWrap();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            saveImagePosition(imageElement);
        }
    });
}
```

**Schema Changes:**
```python
# backend/schemas.py
class ImagePosition(BaseModel):
    x: float  # pixels from left
    y: float  # pixels from top
    width: float  # pixels
    height: float  # pixels
    z_index: int = 10
    wrap_mode: str = 'square'  # square | tight | through | top_bottom | behind

class BrochurePhoto(BaseModel):
    # ... existing fields ...
    position: Optional[ImagePosition] = None  # NEW FIELD
```

---

### 2. Text Wrapping

**Wrapping Modes:**
1. **Square** (default): Text flows around rectangular bounding box
2. **Tight**: Text follows the actual contours of the image
3. **Through**: Text overlays the image (semi-transparent background)
4. **Top/Bottom**: Text only above and below, not sides
5. **Behind**: Image is behind text (watermark effect)

**User Experience:**
- Right-click image → "Text Wrapping" menu
- Select wrapping mode from dropdown
- Text reflows instantly
- Padding controls (10px, 20px, 30px)

**Technical Implementation:**

Use CSS Shapes for text wrapping:

```css
.floating-image {
    position: absolute;
    float: left; /* Enable wrapping */
}

.floating-image.wrap-square {
    shape-outside: margin-box;
    margin: 20px; /* Padding around image */
}

.floating-image.wrap-tight {
    shape-outside: url('image.png'); /* Follows image contours */
    shape-margin: 20px;
}

.floating-image.wrap-through {
    /* No float, absolute positioning */
    z-index: 5;
}

.floating-image.wrap-behind {
    z-index: 1; /* Behind text */
    opacity: 0.3;
}
```

**Text Block Structure:**
```javascript
// Text must be in a container that respects CSS shapes
<div class="text-flow-container" contenteditable="true">
    <!-- Floating images inside here -->
    <div class="floating-image wrap-square" style="left: 100px; top: 50px;">
        <img src="..." />
    </div>

    <!-- Text content flows around the image -->
    <p>This stunning property offers exceptional living spaces with...</p>
</div>
```

**Browser Compatibility:**
- CSS Shapes supported in Chrome, Safari, Edge, Firefox 62+
- Fallback: Use `float: left/right` with rectangular boxes for older browsers

---

### 3. Image Resizing

**User Experience:**
- Select image to show 8 resize handles (4 corners + 4 sides)
- Drag handles to resize
- Shift+drag to maintain aspect ratio
- Double-click to reset to original size

**Technical Implementation:**
```javascript
function enableImageResizing(imageElement) {
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

    handles.forEach(handle => {
        const handleEl = document.createElement('div');
        handleEl.className = `resize-handle resize-${handle}`;
        handleEl.dataset.direction = handle;

        handleEl.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startResize(e, imageElement, handle);
        });

        imageElement.appendChild(handleEl);
    });
}

function startResize(e, imageElement, direction) {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = imageElement.offsetWidth;
    const startHeight = imageElement.offsetHeight;
    const aspectRatio = startWidth / startHeight;

    function onMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        if (direction.includes('e')) newWidth = startWidth + deltaX;
        if (direction.includes('w')) newWidth = startWidth - deltaX;
        if (direction.includes('s')) newHeight = startHeight + deltaY;
        if (direction.includes('n')) newHeight = startHeight - deltaY;

        // Maintain aspect ratio if Shift key pressed
        if (e.shiftKey) {
            newHeight = newWidth / aspectRatio;
        }

        imageElement.style.width = `${newWidth}px`;
        imageElement.style.height = `${newHeight}px`;

        recalculateTextWrap();
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        saveImagePosition(imageElement);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
```

**CSS for Resize Handles:**
```css
.resize-handle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #3498db;
    border: 2px solid white;
    border-radius: 50%;
    z-index: 100;
    cursor: pointer;
}

.resize-handle.resize-nw { top: -5px; left: -5px; cursor: nw-resize; }
.resize-handle.resize-n  { top: -5px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
.resize-handle.resize-ne { top: -5px; right: -5px; cursor: ne-resize; }
.resize-handle.resize-e  { top: 50%; right: -5px; transform: translateY(-50%); cursor: e-resize; }
.resize-handle.resize-se { bottom: -5px; right: -5px; cursor: se-resize; }
.resize-handle.resize-s  { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
.resize-handle.resize-sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.resize-handle.resize-w  { top: 50%; left: -5px; transform: translateY(-50%); cursor: w-resize; }
```

---

### 4. Layer Management (Z-Index Control)

**User Experience:**
- Right-click image → "Arrange" submenu:
  - Bring to Front (z-index: 1000)
  - Bring Forward (+10)
  - Send Backward (-10)
  - Send to Back (z-index: 1)
- Visual indicator showing layer order in sidebar

**Technical Implementation:**
```javascript
const LayerManager = {
    layers: [], // Array of {id, element, zIndex}

    bringToFront(imageElement) {
        const maxZ = Math.max(...this.layers.map(l => l.zIndex), 1000);
        this.setZIndex(imageElement, maxZ + 10);
    },

    bringForward(imageElement) {
        const currentZ = parseInt(imageElement.style.zIndex || 10);
        this.setZIndex(imageElement, currentZ + 10);
    },

    sendBackward(imageElement) {
        const currentZ = parseInt(imageElement.style.zIndex || 10);
        this.setZIndex(imageElement, Math.max(1, currentZ - 10));
    },

    sendToBack(imageElement) {
        this.setZIndex(imageElement, 1);
    },

    setZIndex(imageElement, zIndex) {
        imageElement.style.zIndex = zIndex;
        const layer = this.layers.find(l => l.id === imageElement.dataset.imageId);
        if (layer) layer.zIndex = zIndex;
        this.refreshLayerPanel();
        saveImagePosition(imageElement);
    }
};
```

**Layer Panel UI:**
```html
<div id="layerPanel" class="sidebar-panel">
    <h3>Layers</h3>
    <div id="layerList">
        <div class="layer-item" data-image-id="img_123">
            <span class="layer-icon">🖼️</span>
            <span class="layer-name">Swimming Pool</span>
            <span class="layer-z">Z: 50</span>
            <button class="layer-up">↑</button>
            <button class="layer-down">↓</button>
        </div>
        <!-- More layers... -->
    </div>
</div>
```

---

### 5. Alignment Guides and Snapping

**User Experience:**
- Drag image near edge/center → visual guide appears (red line)
- Image snaps to alignment when within 10px
- Snap to: page edges, center, other images, text blocks
- Toggle snapping on/off with Shift key

**Technical Implementation:**
```javascript
const AlignmentGuides = {
    threshold: 10, // pixels
    enabled: true,

    checkAlignment(draggingElement, x, y) {
        if (!this.enabled) return {x, y};

        const page = draggingElement.closest('.brochure-page');
        const pageRect = page.getBoundingClientRect();
        const elementRect = draggingElement.getBoundingClientRect();

        const guides = [];

        // Check page edges
        if (Math.abs(x) < this.threshold) {
            guides.push({type: 'vertical', position: 0, label: 'Left edge'});
            x = 0;
        }

        if (Math.abs(x + elementRect.width - pageRect.width) < this.threshold) {
            guides.push({type: 'vertical', position: pageRect.width, label: 'Right edge'});
            x = pageRect.width - elementRect.width;
        }

        // Check center
        const centerX = (pageRect.width - elementRect.width) / 2;
        if (Math.abs(x - centerX) < this.threshold) {
            guides.push({type: 'vertical', position: pageRect.width / 2, label: 'Center'});
            x = centerX;
        }

        // Check other images
        page.querySelectorAll('.floating-image').forEach(otherImage => {
            if (otherImage === draggingElement) return;
            const otherRect = otherImage.getBoundingClientRect();

            // Align left edges
            if (Math.abs(x - otherRect.left) < this.threshold) {
                guides.push({type: 'vertical', position: otherRect.left});
                x = otherRect.left;
            }

            // Align right edges
            if (Math.abs(x + elementRect.width - otherRect.right) < this.threshold) {
                guides.push({type: 'vertical', position: otherRect.right});
                x = otherRect.right - elementRect.width;
            }
        });

        this.showGuides(guides);
        return {x, y};
    },

    showGuides(guides) {
        this.clearGuides();
        guides.forEach(guide => {
            const line = document.createElement('div');
            line.className = `alignment-guide ${guide.type}`;
            line.style.position = 'absolute';
            if (guide.type === 'vertical') {
                line.style.left = `${guide.position}px`;
                line.style.top = '0';
                line.style.height = '100%';
                line.style.width = '2px';
            }
            document.body.appendChild(line);
        });

        setTimeout(() => this.clearGuides(), 1000);
    },

    clearGuides() {
        document.querySelectorAll('.alignment-guide').forEach(el => el.remove());
    }
};
```

**CSS for Guides:**
```css
.alignment-guide {
    background: #ff0000;
    opacity: 0.7;
    z-index: 10000;
    pointer-events: none;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 0.7; }
}
```

---

### 6. Undo/Redo System

**User Experience:**
- Ctrl+Z to undo last action
- Ctrl+Shift+Z (or Ctrl+Y) to redo
- Supports: move, resize, delete, text edit, layer order
- Undo stack shows history in sidebar (optional)

**Technical Implementation:**
```javascript
const UndoManager = {
    undoStack: [],
    redoStack: [],
    maxStackSize: 50,

    // Record an action
    record(action) {
        this.undoStack.push({
            type: action.type,
            before: action.before,
            after: action.after,
            timestamp: Date.now()
        });

        if (this.undoStack.length > this.maxStackSize) {
            this.undoStack.shift();
        }

        // Clear redo stack on new action
        this.redoStack = [];

        this.updateUI();
    },

    undo() {
        if (this.undoStack.length === 0) return;

        const action = this.undoStack.pop();
        this.applyReverse(action);
        this.redoStack.push(action);
        this.updateUI();
    },

    redo() {
        if (this.redoStack.length === 0) return;

        const action = this.redoStack.pop();
        this.applyForward(action);
        this.undoStack.push(action);
        this.updateUI();
    },

    applyReverse(action) {
        switch (action.type) {
            case 'moveImage':
                const img = document.querySelector(`[data-image-id="${action.before.id}"]`);
                img.style.left = `${action.before.x}px`;
                img.style.top = `${action.before.y}px`;
                break;
            case 'resizeImage':
                const img2 = document.querySelector(`[data-image-id="${action.before.id}"]`);
                img2.style.width = `${action.before.width}px`;
                img2.style.height = `${action.before.height}px`;
                break;
            case 'textEdit':
                const textBlock = document.querySelector(`[data-field="${action.before.field}"]`);
                textBlock.innerHTML = action.before.content;
                break;
            // ... other action types
        }
    },

    applyForward(action) {
        // Similar to applyReverse but uses 'after' state
    }
};

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
            UndoManager.redo();
        } else {
            UndoManager.undo();
        }
    }

    if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        UndoManager.redo();
    }
});

// Example: Recording a move action
function saveImagePosition(imageElement) {
    const before = {
        id: imageElement.dataset.imageId,
        x: parseFloat(imageElement.dataset.oldX || 0),
        y: parseFloat(imageElement.dataset.oldY || 0)
    };

    const after = {
        id: imageElement.dataset.imageId,
        x: parseFloat(imageElement.style.left),
        y: parseFloat(imageElement.style.top)
    };

    UndoManager.record({type: 'moveImage', before, after});

    // Store new position as old for next move
    imageElement.dataset.oldX = after.x;
    imageElement.dataset.oldY = after.y;
}
```

---

## UI/UX Design

### Context Menu (Right-Click on Image)
```
┌─────────────────────────┐
│ Cut              Ctrl+X │
│ Copy             Ctrl+C │
│ Paste            Ctrl+V │
├─────────────────────────┤
│ Text Wrapping       ▶   │ → ┌─────────────────┐
│ Arrange             ▶   │   │ Square          │
│ Size and Position...    │   │ Tight           │
├─────────────────────────┤   │ Through         │
│ Delete          Delete  │   │ Top and Bottom  │
└─────────────────────────┘   │ Behind Text     │
                               └─────────────────┘
```

### Toolbar Enhancement
Add image control buttons to existing toolbar:

```
[Undo] [Redo] | [Bold] [Italic] [Underline] | [Image+] [Align] [Layer] [Wrap]
```

### Floating Toolbar (When Image Selected)
```
┌──────────────────────────────────────────────────────────┐
│  [←] [↑] [↓] [→]  |  [↺] [-25%] [100%] [+25%]  |  [🗑️] │
│  Move 1px          Rotate  Resize                Delete │
└──────────────────────────────────────────────────────────┘
```

---

## Technical Architecture

### File Structure
```
frontend/
├── brochure_editor_v4.html          # New editor page
├── brochure_editor_v4.js            # Main editor logic
├── brochure_editor_v4.css           # Styling
└── modules/
    ├── image_drag_drop.js           # Drag-and-drop handler
    ├── text_wrap_engine.js          # Text wrapping calculations
    ├── resize_handler.js            # Image resizing
    ├── layer_manager.js             # Z-index management
    ├── alignment_guides.js          # Snap-to-grid
    ├── undo_manager.js              # Undo/redo system
    └── context_menu.js              # Right-click menu
```

### Backend Changes (Minimal)
```python
# backend/schemas.py - Add new fields
class ImagePosition(BaseModel):
    x: float
    y: float
    width: float
    height: float
    z_index: int = 10
    wrap_mode: str = 'square'
    wrap_padding: int = 20

class BrochurePhoto(BaseModel):
    # ... existing fields ...
    position: Optional[ImagePosition] = None

# No changes needed to:
# - backend/main.py (existing endpoints work)
# - services/* (text generation unchanged)
# - providers/* (vision/geocoding unchanged)
```

### Data Flow
```
User drags image
    ↓
frontend/modules/image_drag_drop.js
    ↓
Updates DOM position (left, top CSS)
    ↓
Triggers text_wrap_engine.js → recalculateTextWrap()
    ↓
Saves to EditorState.imagePositions
    ↓
On "Save Changes", POST /brochure/{session_id}/save
    ↓
Backend persists position in session JSON
    ↓
PDF export reads position and renders accordingly
```

---

## Migration Path (V3 → V4)

### Phase 1: Foundation (Week 1-2)
- Implement drag-and-drop for images
- Add absolute positioning system
- Update schema with `ImagePosition` field
- Backward compatibility: V3 sessions default to grid layout

### Phase 2: Text Wrapping (Week 3)
- Integrate CSS Shapes API
- Build text wrapping UI controls
- Test across browsers (Chrome, Safari, Firefox, Edge)

### Phase 3: Enhancements (Week 4)
- Add resize handles
- Implement layer management
- Build alignment guides

### Phase 4: Polish (Week 5-6)
- Undo/redo system
- Context menus
- Keyboard shortcuts
- User documentation

### Backward Compatibility Strategy
```javascript
// On session load, detect editor version
if (sessionData.editor_version === 'v3' || !sessionData.editor_version) {
    // Use grid-based layout (current behavior)
    renderPagesGridLayout(sessionData);
} else if (sessionData.editor_version === 'v4') {
    // Use free-form layout
    renderPagesFreeformLayout(sessionData);
}

// Allow users to upgrade session to V4
function upgradeToV4(sessionData) {
    sessionData.editor_version = 'v4';

    // Convert grid positions to absolute positions
    sessionData.photos.forEach(photo => {
        if (!photo.position) {
            // Calculate position based on current grid cell
            photo.position = {
                x: calculateXFromGrid(photo.gridColumn),
                y: calculateYFromGrid(photo.gridRow),
                width: 300,
                height: 200,
                z_index: 10,
                wrap_mode: 'square'
            };
        }
    });
}
```

---

## Competitive Analysis

### Current Competitors (Basic Templates)
- **Canva** - Rigid templates, limited customization
- **Venngage** - Template-based, drag-and-drop but not free-form
- **Lucidpress** - Better than most but still template-constrained

### With V4 (Word-Like Editing)
- **Microsoft Word** - Full control but not property-specific
- **Adobe InDesign** - Professional tool, steep learning curve
- **Our Product** - Property-specific + Word-like control + AI generation

### Unique Selling Points After V4
1. **AI-Generated Content** (already have this)
2. **Word-Like Editing** (NEW - no competitor has this)
3. **Property-Specific Templates** (already have this)
4. **Instant PDF Export** (already have this)
5. **Location Enrichment** (already have this)

---

## Success Metrics

### User Engagement
- **Time in Editor**: Should increase 20-30% (more time = more customization)
- **Actions Per Session**: Track drags, resizes, text edits
- **Feature Adoption**: % of users who use free-form vs. grid layout

### Product Quality
- **Brochure Variety**: Fewer identical-looking brochures
- **User Satisfaction**: NPS score should increase
- **Support Tickets**: Track "I can't move this image" complaints (should decrease to zero)

### Business Impact
- **Premium Feature**: Charge £X/month for V4 editor access
- **Churn Reduction**: Better product = lower churn
- **Competitive Advantage**: Marketing differentiator

---

## Risks and Mitigations

### Risk 1: Browser Compatibility
**Concern**: CSS Shapes not fully supported in older browsers
**Mitigation**: Feature detection + graceful fallback to rectangular wrapping

### Risk 2: Performance (Many Images)
**Concern**: Dragging/resizing with 20+ images could be slow
**Mitigation**:
- Virtual rendering (only render visible page)
- Throttle text reflow calculations (debounce 100ms)
- Use `requestAnimationFrame` for smooth animations

### Risk 3: User Learning Curve
**Concern**: Users unfamiliar with Word-style editing
**Mitigation**:
- In-app tutorial (first-time user guide)
- Video walkthroughs
- "Quick layouts" button for common patterns

### Risk 4: Accidental Breaks
**Concern**: User drags image over text, makes unreadable
**Mitigation**:
- "Reset Layout" button (revert to grid)
- Undo/redo (fix mistakes easily)
- Layout validation warnings

---

## Implementation Roadmap

### Week 1-2: Core Drag-and-Drop
- [ ] Research CSS Shapes API
- [ ] Build drag-and-drop prototype
- [ ] Implement absolute positioning system
- [ ] Update backend schema for `ImagePosition`
- [ ] Test with 3-5 images on a page

### Week 3: Text Wrapping
- [ ] Integrate CSS Shapes
- [ ] Build wrapping mode selector UI
- [ ] Test in Chrome, Firefox, Safari, Edge
- [ ] Implement fallback for unsupported browsers
- [ ] Add wrapping padding controls

### Week 4: Resize and Layers
- [ ] Add 8-handle resize system
- [ ] Implement aspect ratio locking (Shift key)
- [ ] Build layer management panel
- [ ] Add "Arrange" context menu
- [ ] Test z-index interactions

### Week 5: Alignment and Guides
- [ ] Implement snap-to-grid logic
- [ ] Build visual alignment guides
- [ ] Add keyboard shortcuts (arrow keys, Shift)
- [ ] Test snapping with multiple images
- [ ] Add toggle for disabling snap

### Week 6: Polish and Launch
- [ ] Build undo/redo system
- [ ] Add keyboard shortcuts (Ctrl+Z, Ctrl+Y)
- [ ] Create context menu UI
- [ ] Write user documentation
- [ ] Record video tutorials
- [ ] Beta test with 10 users
- [ ] Fix bugs from beta feedback
- [ ] Launch V4 editor

---

## Cost-Benefit Analysis

### Development Costs
- **Developer Time**: 4-6 weeks (1 full-time developer)
- **Estimated Cost**: £10,000 - £15,000 (salary + overhead)
- **Testing**: 1 week (QA + bug fixes)
- **Documentation**: 3 days (user guides, videos)

### Expected Benefits
- **Premium Pricing**: Charge £20/month extra for V4 editor
  - 100 users × £20 × 12 months = £24,000/year
- **Competitive Advantage**: Win deals against competitors
- **Reduced Churn**: Better product = happier users
- **Marketing Angle**: "Only brochure tool with Word-like editing"

### ROI Timeline
- **Break-even**: 8-12 months (after recovering dev costs)
- **Year 1 Revenue**: £24,000 (if 100 premium users)
- **Year 2 Revenue**: £60,000 (if 250 premium users)

---

## Alternatives Considered

### Alternative 1: Stay with Grid Layout
- **Pros**: No development cost, users already familiar
- **Cons**: Not differentiated, limits creativity, users request more control

### Alternative 2: Use Existing WYSIWYG Library (e.g., GrapesJS, TinyMCE)
- **Pros**: Faster development, battle-tested code
- **Cons**: Less control, licensing costs, bloated for our use case

### Alternative 3: Build Basic Drag-and-Drop (No Text Wrapping)
- **Pros**: Faster to build (2-3 weeks), still better than grid
- **Cons**: Not true "Word-like" editing, users will still ask for wrapping

### Recommendation: Full V4 Implementation
Text wrapping is the killer feature. Without it, free-form positioning is only half-useful.

---

## Next Steps

1. **Get Stakeholder Approval** - Present this proposal to product/business team
2. **Prioritize in Roadmap** - Allocate 6 weeks for V4 development
3. **Spike: CSS Shapes** - 2-day technical spike to validate wrapping approach
4. **Design Mockups** - Create Figma mockups for UI changes
5. **Start Development** - Begin Week 1 tasks (drag-and-drop)

---

## Appendix: Technical References

### CSS Shapes API
- MDN Guide: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Shapes
- Browser Support: https://caniuse.com/css-shapes

### Drag-and-Drop Patterns
- HTML5 Drag and Drop API: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- Interact.js (library for advanced dragging): https://interactjs.io/

### Similar Products (for inspiration)
- Canva Editor: https://www.canva.com
- Microsoft Word Online: https://office.live.com/start/Word.aspx
- Adobe InDesign: https://www.adobe.com/products/indesign.html

---

**End of Proposal**

**Questions? Contact the Product Team**
