# Feature Comparison: Canva & Photoshop vs Our Brochure Maker

## Current Features We Have
- Photo library and upload
- Basic text formatting (bold, italic, underline)
- Font size and font family selection
- 18 pre-built templates
- Color customization for templates
- Page navigation
- Undo/redo history
- AI text refinement assistant
- Export to PDF
- Auto-assign photos

---

## Missing Canva Features (Priority Order)

### HIGH PRIORITY - Essential for Canva-like Experience

#### 1. Elements Panel (MISSING FROM UI!)
- [ ] **Shapes library** - Rectangles, circles, triangles, stars, arrows, lines
- [ ] **Icons library** - Real estate icons, furniture, amenities
- [ ] **Frames** - Photo frames, decorative borders
- [ ] **Lines & arrows** - Connectors, dividers, pointers
- [ ] **Stickers** - Decorative elements, badges, ribbons
- [ ] **Graphics** - Pre-made graphic elements

#### 2. Shape/Element Properties
- [ ] **Corner radius slider** - Round corners on rectangles
- [ ] **Border/stroke controls** - Color, width, style (solid, dashed)
- [ ] **Fill color picker** - Solid, gradient, transparent
- [ ] **Opacity slider** - 0-100% transparency
- [ ] **Shadow controls** - Drop shadow, blur, offset
- [ ] **Rotation handle** - Free rotation with degree input

#### 3. Image Editing
- [ ] **Crop tool** - Freeform and preset aspect ratios
- [ ] **Image filters** - Brightness, contrast, saturation
- [ ] **Image effects** - Blur, sharpen, vignette
- [ ] **Flip horizontal/vertical**
- [ ] **Background remover** - AI-powered
- [ ] **Image masking** - Fit image into shapes

#### 4. Text Enhancements
- [ ] **Text effects** - Shadow, outline, glow
- [ ] **Curved text** - Text on a path
- [ ] **Letter spacing** - Character spacing control
- [ ] **Line height** - Line spacing control
- [ ] **Text alignment** - Left, center, right, justify
- [ ] **Text box resize** - Auto-fit or fixed size

#### 5. Layers Panel
- [ ] **Layer list** - Visual layer stack
- [ ] **Reorder layers** - Drag to reorder
- [ ] **Lock layers** - Prevent accidental edits
- [ ] **Hide/show layers** - Toggle visibility
- [ ] **Group layers** - Combine elements
- [ ] **Layer naming** - Custom names

### MEDIUM PRIORITY - Nice to Have

#### 6. Alignment Tools
- [ ] **Snap to grid**
- [ ] **Smart guides** - Alignment hints
- [ ] **Distribute evenly** - Horizontal/vertical
- [ ] **Align edges** - Left, right, top, bottom, center
- [ ] **Ruler** - Pixel-accurate positioning

#### 7. Page Management
- [ ] **Add new pages** - Blank or from template
- [ ] **Duplicate page**
- [ ] **Delete page**
- [ ] **Reorder pages** - Drag to rearrange
- [ ] **Page transitions** - For presentations

#### 8. Templates & Layouts
- [ ] **Page layouts** - Pre-designed layouts per page
- [ ] **Section templates** - Header, footer, gallery sections
- [ ] **Template categories** - Filter by style/purpose
- [ ] **Template search**
- [ ] **Favorites** - Save preferred templates

#### 9. Color Tools
- [ ] **Color palette extraction** - From uploaded images
- [ ] **Brand colors** - Save custom palette
- [ ] **Color harmony** - Complementary suggestions
- [ ] **Eyedropper tool** - Pick color from canvas
- [ ] **Gradient creator** - Custom gradients

#### 10. Collaboration
- [ ] **Share link** - View/edit permissions
- [ ] **Comments** - Annotate designs
- [ ] **Real-time editing** - Multiple users
- [ ] **Version history** - Restore previous versions

### LOW PRIORITY - Advanced Features

#### 11. Animation (for digital exports)
- [ ] **Element animations** - Fade, slide, zoom
- [ ] **Page transitions**
- [ ] **GIF export**
- [ ] **Video export**

#### 12. Brand Kit
- [ ] **Logo upload**
- [ ] **Brand fonts**
- [ ] **Brand colors**
- [ ] **Brand templates**

---

## Missing Photoshop Features

### Image Manipulation
- [ ] **Selection tools** - Lasso, magic wand, quick select
- [ ] **Clone stamp** - Copy areas
- [ ] **Healing brush** - Remove blemishes
- [ ] **Content-aware fill** - AI object removal
- [ ] **Transform tools** - Scale, skew, distort, perspective
- [ ] **Liquify** - Push, pull, warp pixels

### Advanced Editing
- [ ] **Adjustment layers** - Non-destructive edits
- [ ] **Blend modes** - Multiply, screen, overlay, etc.
- [ ] **Layer masks** - Selective visibility
- [ ] **Smart objects** - Linked/embedded
- [ ] **Layer styles** - Bevel, emboss, gradient overlay

### Color Correction
- [ ] **Curves** - Precise tonal control
- [ ] **Levels** - Histogram-based adjustment
- [ ] **Hue/Saturation** - Color shifting
- [ ] **Color balance** - Shadows, midtones, highlights
- [ ] **Vibrance** - Smart saturation

### Drawing & Painting
- [ ] **Brush tool** - Custom brushes
- [ ] **Pencil tool** - Hard-edge drawing
- [ ] **Eraser tool** - Various modes
- [ ] **Paint bucket** - Fill areas
- [ ] **Gradient tool** - Apply gradients

### Professional Features
- [ ] **Non-destructive editing** - Original always preserved
- [ ] **Artboards** - Multiple designs in one file
- [ ] **Actions/macros** - Recorded workflows
- [ ] **Batch processing** - Apply to multiple images
- [ ] **PSD export** - Layered file format

---

## Immediate Implementation Priorities

### Phase 1: Core Editor Features
1. **Add Elements Panel to UI** - Shapes, icons visible in sidebar
2. **Corner radius control** - For rectangles
3. **Basic shape properties** - Fill, stroke, opacity
4. **Drag-and-drop elements** - From panel to canvas

### Phase 2: Image Tools
5. **Image crop tool**
6. **Basic filters** - Brightness, contrast
7. **Flip/rotate images**
8. **Image replace** - Swap photos easily

### Phase 3: Text & Alignment
9. **Text shadow/outline**
10. **Letter/line spacing**
11. **Smart guides**
12. **Snap to grid**

### Phase 4: Layers & Organization
13. **Visual layer panel**
14. **Layer reordering**
15. **Group elements**
16. **Lock elements**

---

## Current Bugs Found in Testing

1. **Login page element IDs** - Test found `agentPin` and `agentName` instead of expected `pin` and `agentSelect`
2. **Zoom level** - Default 100% is too zoomed in (should be 60-70%)
3. **Elements panel not visible** - Shapes/icons exist in code but not shown in UI

---

## Notes

- Elements library V2 exists with shapes and icons but needs to be connected to the UI
- Many JS files exist for features (layers, alignment, etc.) but may not be integrated
- The brochure_editor.html needs to include the elements panel in the sidebar
