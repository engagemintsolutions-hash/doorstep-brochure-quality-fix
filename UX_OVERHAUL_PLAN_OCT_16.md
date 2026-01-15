# UX Overhaul Plan - Brochure Editor
## Comprehensive Analysis & Redesign Proposal

**Date**: October 16, 2025
**Status**: 🎯 Planning Phase
**Priority**: HIGH - User Experience Critical

---

## Executive Summary

The current brochure editor has a solid foundation but needs significant UX improvements to match industry-standard tools like Microsoft Word. This document outlines a comprehensive overhaul focusing on:

1. **Word-like text wrapping** around images
2. **Mouse-based image resizing** (drag corners/edges)
3. **AI text regeneration** with credit tracking
4. **Fixed AI assistant popup** (robot emoji)
5. **Improved layout engine** for dynamic content flow

---

## Current State Analysis

### ✅ What's Working

1. **Photo drag-and-drop**: Photos can be dragged from library to pages
2. **Text editing**: ContentEditable divs allow basic text editing
3. **AI assistance**: `ai_page_assistant.js` exists and is loaded
4. **Export system**: PDF and multi-format export working
5. **Page navigation**: Left sidebar with page thumbnails
6. **Undo/redo**: History tracking implemented

### ❌ Critical Issues

| Issue | Impact | User Pain Point |
|-------|--------|-----------------|
| **No text wrapping** | HIGH | Images push text down, wasting space |
| **Slider-based resize** | MEDIUM | Unintuitive, hard to control |
| **Robot emoji broken** | HIGH | Can't access AI assistant per page |
| **No regen tracking** | MEDIUM | Unlimited free regens (cost leak) |
| **Fixed layouts** | HIGH | Can't move images side-by-side with text |

---

## API Cost Analysis

### Current Anthropic Pricing (Claude Sonnet 4)

```
Input tokens:  $3.00 per 1M tokens
Output tokens: $15.00 per 1M tokens
```

### Text Regeneration Cost Calculation

**Typical property description regeneration**:
- Input: ~500 tokens (context: page content, property details, instruction)
- Output: ~150 tokens (regenerated paragraph)

**Cost per regeneration**:
```
Input:  500 tokens × $3.00/1M = $0.0015
Output: 150 tokens × $15.00/1M = $0.00225
Total: $0.00375 per regeneration (~£0.003 or 0.4 pence)
```

### Recommendation: Free Tier with Cap

**Proposed limits**:
- **First 3 regenerations per text box**: FREE
- **After 3 regens**: Notify user of credit usage
- **Monthly cap per user**: 100 total regenerations (~£0.40 cost)

**Why 3 free regens is generous**:
- Cost: 3 × £0.003 = £0.009 per text box (less than 1 pence)
- Average user needs: 1-2 regens typically enough
- Power users: Can use credits for 4+

---

## UX Overhaul: Detailed Design

### 1. Word-Like Text Wrapping System

#### Current Behavior
```
┌─────────────────────────┐
│ [Large Text Block]      │
│ Lorem ipsum dolor sit   │
│ amet, consectetur...    │
│                         │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │      IMAGE          │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ More text below...      │
└─────────────────────────┘
```

#### Proposed Behavior (Word-Style)
```
┌─────────────────────────┐
│ Lorem ipsum   ┌───────┐ │
│ dolor sit     │       │ │
│ amet, consec  │ IMAGE │ │
│ tetur adipis  │       │ │
│ cing elit...  └───────┘ │
│                         │
│ Sed do eiusmod tempor   │
│ incididunt ut labore... │
└─────────────────────────┘
```

#### Implementation Strategy

**Option A: CSS Shapes (Modern Browsers)**
```css
.photo-block {
    float: left; /* or right */
    shape-outside: margin-box;
    margin: 0 1rem 1rem 0;
}

.text-content {
    overflow: hidden; /* Creates BFC */
}
```

**Option B: CSS Grid Layout (More Control)**
```css
.page-content {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
}

.text-block {
    grid-column: span 8; /* 2/3 width */
}

.photo-block {
    grid-column: span 4; /* 1/3 width */
    grid-row: 1 / span 3; /* Spans multiple rows */
}
```

**Recommended: Hybrid Approach**
- Use CSS Grid for initial layout
- Use `float` + `shape-outside` for inline wrapping
- JavaScript to adjust grid spans when images are resized

#### User Actions
1. **Drag image to text area** → Auto-position to top-right, text wraps left
2. **Click "Position"** → Toggle between: Top, Right, Left, Bottom, Inline
3. **Resize image** → Text reflows automatically

---

### 2. Mouse-Based Image Resizing

#### Current Implementation (Slider)
```html
<input type="range" min="100" max="500" value="300"
       onchange="resizePhoto(zoneId, this.value)">
```

**Problems**:
- Hidden behind hover
- Doesn't show dimensions
- Hard to achieve precise size
- Not intuitive (no one expects a slider)

#### Proposed Implementation (Drag Corners)

**Visual Design**:
```
┌──────────────────────┐
│                      │
│                      │
│       IMAGE          │
│                      │
│                      │ ╲
└──────────────────────┘━ ← Resize handle
```

**Implementation**:
```javascript
function makeImageResizable(imageElement) {
    // Add resize handles to all 4 corners and 4 edges
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

    handles.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `resize-handle resize-${position}`;
        handle.style.cssText = `
            position: absolute;
            width: ${position.length === 1 ? '100%' : '12px'};
            height: ${position.length === 1 ? '100%' : '12px'};
            ${getHandlePositionCSS(position)}
            cursor: ${getCursorForHandle(position)};
            background: ${position.length === 2 ? '#00CED1' : 'transparent'};
            border: ${position.length === 2 ? '2px solid white' : 'none'};
            border-radius: 50%;
            z-index: 10;
        `;

        handle.addEventListener('mousedown', (e) => startResize(e, imageElement, position));
        imageElement.parentElement.appendChild(handle);
    });
}

function startResize(e, imageElement, handlePosition) {
    e.preventDefault();
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

        // Calculate new dimensions based on handle position
        if (handlePosition.includes('e')) newWidth = startWidth + deltaX;
        if (handlePosition.includes('w')) newWidth = startWidth - deltaX;
        if (handlePosition.includes('s')) newHeight = startHeight + deltaY;
        if (handlePosition.includes('n')) newHeight = startHeight - deltaY;

        // Maintain aspect ratio for corner handles
        if (handlePosition.length === 2) {
            newHeight = newWidth / aspectRatio;
        }

        // Apply constraints
        newWidth = Math.max(100, Math.min(800, newWidth));
        newHeight = Math.max(100, Math.min(600, newHeight));

        imageElement.style.width = newWidth + 'px';
        imageElement.style.height = newHeight + 'px';

        // Show dimensions tooltip
        showDimensionsTooltip(e.clientX, e.clientY, newWidth, newHeight);

        // Trigger text reflow
        reflowTextAroundImage(imageElement);
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        hideDimensionsTooltip();
        saveToUndoStack();
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}
```

**Features**:
- ✅ 8 resize handles (4 corners + 4 edges)
- ✅ Maintains aspect ratio on corner drag
- ✅ Shows dimensions while resizing (tooltip)
- ✅ Snap to grid (optional, 10px increments)
- ✅ Min/max constraints (100px - 800px)
- ✅ Auto-reflows text after resize

---

### 3. AI Text Regeneration with Credit Tracking

#### Implementation

**File**: `frontend/brochure_editor.js` or new `text_regeneration.js`

```javascript
// Track regenerations per text block
window.textRegenerationTracking = {
    // textBlockId: { count: 0, timestamps: [] }
};

const REGEN_FREE_LIMIT = 3;
const REGEN_COST_PER_USE = 0.00375; // £0.003 or $0.00375

async function regenerateTextBlock(textBlockId, pageId) {
    // Get current text
    const textElement = document.querySelector(`[data-text-id="${textBlockId}"]`);
    if (!textElement) {
        console.error('Text block not found');
        return;
    }

    const currentText = textElement.textContent;

    // Check regeneration count
    if (!window.textRegenerationTracking[textBlockId]) {
        window.textRegenerationTracking[textBlockId] = { count: 0, timestamps: [] };
    }

    const regenData = window.textRegenerationTracking[textBlockId];
    regenData.count++;
    regenData.timestamps.push(new Date().toISOString());

    // Show warning if exceeding free limit
    if (regenData.count > REGEN_FREE_LIMIT) {
        const willCharge = await confirmCreditUsage();
        if (!willCharge) {
            regenData.count--; // Rollback
            return;
        }
    }

    // Show loading state
    const originalHTML = textElement.innerHTML;
    textElement.innerHTML = '<div style="opacity: 0.5;">🤖 Regenerating...</div>';

    try {
        // Call API
        const response = await fetch('/generate-text-variant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                original_text: currentText,
                context: {
                    page_name: brochureData.pages.find(p => p.id === pageId)?.name,
                    property_type: brochureData.property?.propertyType,
                    tone: 'professional'
                },
                user_email: window.userEmail || 'anonymous'
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();

        // Show comparison modal
        showRegenerationComparison({
            original: currentText,
            regenerated: result.text,
            onAccept: () => {
                textElement.textContent = result.text;
                saveToUndoStack();
                showToast('success', '✅ Text updated');
            },
            onReject: () => {
                textElement.innerHTML = originalHTML;
                regenData.count--; // Rollback if rejected
            }
        });

    } catch (error) {
        console.error('Regeneration failed:', error);
        textElement.innerHTML = originalHTML;
        regenData.count--; // Rollback on error
        showToast('error', '❌ Failed to regenerate. Please try again.');
    }
}

function confirmCreditUsage() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h3>💳 Credit Usage</h3>
                <p>You've used your 3 free regenerations for this text block.</p>
                <p><strong>Cost:</strong> ~£0.003 per additional regeneration</p>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button onclick="this.closest('.modal-overlay').remove(); window.tempResolve(false);"
                            class="btn-secondary" style="flex: 1;">Cancel</button>
                    <button onclick="this.closest('.modal-overlay').remove(); window.tempResolve(true);"
                            class="btn-primary" style="flex: 1;">Continue (Use Credit)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        window.tempResolve = resolve;
    });
}

// Add regenerate button to each text block
function addRegenerateButton(textElement, textBlockId, pageId) {
    const regenBtn = document.createElement('button');
    regenBtn.className = 'text-regen-btn';
    regenBtn.innerHTML = '✨ Regenerate';
    regenBtn.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%);
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s;
        box-shadow: 0 2px 8px rgba(0,206,209,0.3);
    `;

    // Show on hover
    textElement.parentElement.addEventListener('mouseenter', () => {
        regenBtn.style.opacity = '1';
    });
    textElement.parentElement.addEventListener('mouseleave', () => {
        regenBtn.style.opacity = '0';
    });

    regenBtn.onclick = (e) => {
        e.stopPropagation();
        regenerateTextBlock(textBlockId, pageId);
    };

    textElement.parentElement.style.position = 'relative';
    textElement.parentElement.appendChild(regenBtn);
}
```

**Usage Counter Display**:
```html
<div class="regen-counter" style="font-size: 0.75rem; color: #6c757d; margin-top: 0.25rem;">
    🔄 <span id="regenCount-${textBlockId}">0</span> / 3 free regenerations used
</div>
```

**Backend Endpoint** (add to `backend/main.py`):
```python
@app.post("/generate-text-variant")
async def generate_text_variant(request: TextRegenerationRequest):
    """
    Generate a variant of existing text
    Cost: ~0.003 GBP per call
    """
    # Track usage
    usage_tracker.record_regeneration(request.user_email)

    # Build prompt
    prompt = f"""Rewrite the following property description in a {request.context.get('tone', 'professional')} tone.
Keep the same key information but make it more engaging and persuasive.

Original text:
{request.original_text}

Context:
- Page: {request.context.get('page_name', 'Unknown')}
- Property type: {request.context.get('property_type', 'Unknown')}

Provide only the rewritten text, no explanations."""

    # Call Claude
    response = await claude_client.generate_completion(
        prompt=prompt,
        max_tokens=300,
        temperature=0.8
    )

    return {"text": response.strip()}
```

---

### 4. Fix AI Assistant Robot Emoji

#### Current Issue
The robot emoji button calls `openAIAssistant(pageId)` but the function is defined in `ai_page_assistant.js` which loads AFTER `brochure_editor.js` renders the pages.

#### Solution: Make Function Globally Accessible

**File**: `frontend/ai_page_assistant.js` (line 34)

Already has:
```javascript
function openAIAssistant(pageId) {
    console.log(`🤖 Opening AI Assistant for page ${pageId}`);
    // ...
}
```

**Problem**: Function is not on `window` object when inline `onclick` is called.

**Fix**: Expose globally
```javascript
// At end of ai_page_assistant.js
window.openAIAssistant = openAIAssistant;
window.closeAIAssistant = closeAIAssistant;
```

**Alternative**: Use event delegation instead of inline onclick

**File**: `frontend/brochure_editor.js` (where robot emoji is rendered)

**Change from**:
```javascript
<button onclick="openAIAssistant(${page.id})">🤖</button>
```

**To**:
```javascript
<button class="ai-assistant-trigger" data-page-id="${page.id}">🤖</button>
```

**Add event listener**:
```javascript
// In setupEventListeners() or at bottom of file
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('ai-assistant-trigger')) {
        const pageId = parseInt(e.target.dataset.pageId);
        if (window.openAIAssistant) {
            window.openAIAssistant(pageId);
        } else {
            console.error('openAIAssistant not loaded yet');
        }
    }
});
```

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix AI assistant robot emoji (2 hours)
- [ ] Add regenerate button with credit tracking (4 hours)
- [ ] Test and deploy

### Phase 2: Resizing System (Week 2)
- [ ] Implement mouse-based resize handles (6 hours)
- [ ] Add dimensions tooltip (2 hours)
- [ ] Test across browsers (2 hours)

### Phase 3: Text Wrapping (Week 3-4)
- [ ] Research CSS Shapes vs Grid approach (2 hours)
- [ ] Implement wrapping engine (8 hours)
- [ ] Add positioning controls (4 hours)
- [ ] Handle edge cases (4 hours)
- [ ] Performance optimization (2 hours)

### Phase 4: Polish & Testing (Week 5)
- [ ] User testing with 5-10 agents
- [ ] Fix bugs and refine UX
- [ ] Write documentation
- [ ] Deploy to production

---

## Technical Specifications

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Shapes | ✅ 37+ | ✅ 62+ | ✅ 10.1+ | ✅ 79+ |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| Resize Observer | ✅ 64+ | ✅ 69+ | ✅ 13.1+ | ✅ 79+ |

**Target**: Support last 2 years of browsers (95%+ coverage)

### Performance Considerations

1. **Text Reflow**: Use `requestAnimationFrame` to batch reflows
2. **Resize Throttling**: Limit reflow calculations to 60fps
3. **Undo Stack**: Cap at 50 actions, clear on save
4. **Image Optimization**: Resize images to max 1200px width client-side

---

## Cost-Benefit Analysis

### Development Cost
- Developer time: ~40 hours (1 week)
- Cost at £50/hour: £2,000

### User Benefits (Per Agent, Per Month)
- Time saved: 10 minutes per brochure × 5 brochures = 50 min/month
- Value at £50/hour: £41.67/month saved
- Break-even: 48 users using it once

### Business Benefits
- Reduced support tickets (estimated 30% reduction)
- Higher user satisfaction (target: 4.5+ stars)
- Competitive advantage (no other UK prop tech has Word-like editor)

---

## Success Metrics

### Quantitative
- [ ] 80% of users complete brochure without support
- [ ] Average time to create brochure: < 15 minutes
- [ ] Text regeneration usage: < 100 regens/user/month (£0.40 cost)
- [ ] User satisfaction: 4.5+ / 5 stars

### Qualitative
- [ ] Users report editor feels "natural" and "intuitive"
- [ ] Agents can create brochures without training
- [ ] Support team reports fewer "how do I..." questions

---

## Appendix: API Cost Examples

### Scenario 1: Light User (5 brochures/month)
- Text regenerations: 15 total (3 per brochure)
- Cost: 15 × £0.003 = £0.045/month
- Revenue impact: Negligible

### Scenario 2: Power User (20 brochures/month)
- Text regenerations: 100 total (5 per brochure, heavy editing)
- Cost: 100 × £0.003 = £0.30/month
- Revenue impact: Still negligible

### Scenario 3: Office (10 agents, 50 brochures/month)
- Text regenerations: 250 total
- Cost: 250 × £0.003 = £0.75/month
- Revenue impact: £0.15 per agent/month (trivial)

**Conclusion**: Offering 3 free regenerations per text box is extremely affordable and creates great UX.

---

**Next Steps**: Approve plan → Begin Phase 1 implementation → Deploy incrementally

**Last Updated**: October 16, 2025
**Prepared by**: Claude Code AI Assistant
