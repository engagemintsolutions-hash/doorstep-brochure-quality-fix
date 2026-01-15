# AUTOMATED BROCHURE GENERATOR - Product Roadmap

## 📊 CURRENT SYSTEM ANALYSIS

### ✅ What We Have Built (Working Components)

#### 1. **Frontend UI** ✅
- Navy/yellow branded interface
- Photo upload with drag & drop
- Photo category assignment (Cover, Exterior, Interior, Kitchen, Bedrooms, Bathrooms, Garden)
- Brand selector (Generic, Savills)
- Typography selector (Classic, Modern, Luxury, Boutique)
- Form inputs for property data, location, target audience, tone
- NO-CACHE headers for instant refresh
- Large readable fonts for older users

#### 2. **AI Vision Integration** ✅
- **Provider**: Claude Vision (Anthropic Haiku)
- **Endpoint**: `POST /analyze-images`
- **Function**: Analyzes uploaded property photos
- **Detects**: Room types, features (fireplace, garden, parking, etc.)
- **Auto-fills**: Property feature checkboxes based on detected features
- **Status**: FULLY WORKING ✅

#### 3. **Brand Style System** ✅
- **File**: `services/brand_styles.py`
- **Brands**: Savills (premium), Generic (standard)
- **Contains**:
  - Writing style guidelines (tone, voice, sentence structure)
  - Content approach (opening style, room order, emphasis)
  - Language patterns (preferred/avoid phrases)
  - Typography preferences
  - Example openings
- **Status**: CODED AND INTEGRATED ✅

#### 4. **Text Generation Engine** ✅
- **Service**: `Generator` class in `services/generator.py`
- **API**: Claude Sonnet 4 (Anthropic)
- **Endpoint**: `POST /generate`
- **Accepts**: All form data + brand + typography
- **Generates**: 3 text variants with different temperatures (0.7, 0.8, 0.9)
- **Includes**: Headlines, full text, key features, word counts
- **Brand Integration**: YES - uses `build_brand_prompt_section()` ✅
- **Status**: FULLY WORKING ✅

#### 5. **Location Enrichment** ✅
- **Services**: Geocoding (postcodes.io) + Places (Overpass API)
- **Detects**: Nearby schools, transport, parks, restaurants, etc.
- **Caching**: 1-hour TTL to reduce API calls
- **Status**: WORKING (optional feature) ✅

#### 6. **Compliance Checking** ✅
- **Service**: `ComplianceChecker`
- **Checks**: ASA/Rightmove rules, discriminatory language, EPC requirements
- **Severity**: Error/Warning/Info levels
- **Status**: WORKING ✅

#### 7. **PDF Export** ✅
- **Service**: `ExportService` + `PDFGenerator`
- **Library**: ReportLab
- **Endpoint**: `POST /export/pdf`
- **Creates**: Multi-page brochure PDF
- **Includes**: Cover page, property details, room photos, floor plans
- **Status**: WORKING ✅

---

## ❌ CRITICAL GAPS (What's Missing)

### 🚨 **GAP 1: Example Brochure PDF Processing**
**Problem**: User can upload example PDF, but we don't analyze it!

**What we have**:
- ✅ Frontend upload zone (`brochurePdfUploadZone`)
- ✅ Brand selector dropdown
- ✅ Typography selector dropdown

**What's missing**:
- ❌ Backend endpoint to receive PDF
- ❌ PDF parsing/extraction service
- ❌ Layout analysis (page structure, text blocks, image placement)
- ❌ Branding analysis (fonts, colors, logo placement)
- ❌ Storage of extracted layout rules
- ❌ Application of extracted rules to generated PDF

**Impact**: CRITICAL - Without this, brand/layout customization is superficial only!

---

### 🚨 **GAP 2: Photo-to-Page Assignment in Backend**
**Problem**: Frontend assigns photos to categories, but backend doesn't use assignments!

**What we have**:
- ✅ Frontend photo assignment UI (category grid with drag/drop)
- ✅ JavaScript tracking of photo→category mappings

**What's missing**:
- ❌ API to send photo assignments to backend
- ❌ Backend schema to receive category assignments
- ❌ PDF generator integration with photo categories
- ❌ Proper page ordering based on category assignments

**Impact**: HIGH - Photos won't appear on correct pages in brochure!

---

### 🚨 **GAP 3: Post-Generation Editing System**
**Problem**: No way to edit brochure after generation!

**What we have**:
- ❌ NOTHING - editing system not started

**What's needed**:
- ❌ Brochure preview interface (page-by-page view)
- ❌ Image swap/reorder UI
- ❌ Text editing per page (inline or modal)
- ❌ AI chat interface for text regeneration
- ❌ "Regenerate this section" button
- ❌ Save draft state
- ❌ Final PDF re-generation with edits

**Impact**: CRITICAL - Agents need to refine output!

---

### 🚨 **GAP 4: Brochure-Specific Text Generation**
**Problem**: Current generator creates "listing copy" not "brochure copy"!

**What we have**:
- ✅ Text generator with brand styles

**What's missing**:
- ❌ Page-by-page text structure (Cover, Intro, Room-by-room, Location, Floorplan pages)
- ❌ Different word counts per page (not just total word count)
- ❌ Section-specific prompts (hero intro vs room description vs location)
- ❌ Image-aware text generation (describe what's visible in assigned photo)

**Impact**: HIGH - Output won't match brochure format!

---

## 🎯 STEP-BY-STEP ACTION PLAN

### 🏗️ **PHASE 1: Core Brochure Generation (Make It Work)**
**Goal**: Generate a basic 8-page brochure PDF with photos on correct pages

#### **Task 1.1: Connect Photo Assignments to Backend** ⭐ START HERE
**Priority**: CRITICAL

**Steps**:
1. Update `frontend/app_v2.js` to send photo category assignments with generate request
2. Add `photo_assignments` field to `GenerateRequest` schema in `backend/schemas.py`
   ```python
   photo_assignments: Optional[Dict[str, List[str]]] = None  # {"cover": ["photo1.jpg"], "exterior": [...]}
   ```
3. Pass assignments to PDF generator
4. Update `PDFGenerator.generate()` to place photos on correct pages based on category

**Files to modify**:
- `frontend/app_v2.js` (collectFormData function)
- `backend/schemas.py` (GenerateRequest)
- `services/pdf_generator.py` (_draw_cover_page, _draw_details_page, etc.)

**Test**: Upload photos → assign to categories → generate → verify photos on correct PDF pages

---

#### **Task 1.2: Restructure Text Generation for Brochure Pages**
**Priority**: CRITICAL

**Steps**:
1. Create `services/brochure_generator.py` (new file)
2. Define brochure page structure:
   ```python
   BROCHURE_STRUCTURE = {
       "page_1": {"type": "cover", "text_sections": ["headline", "teaser"], "word_count": 50},
       "page_2_3": {"type": "introduction", "text_sections": ["opening", "overview"], "word_count": 300},
       "page_4_5": {"type": "interior", "text_sections": ["room_descriptions"], "word_count": 400},
       "page_6": {"type": "location", "text_sections": ["area_description"], "word_count": 200},
       "page_7": {"type": "features", "text_sections": ["key_features", "specifications"], "word_count": 150},
       "page_8": {"type": "floorplan", "text_sections": ["contact"], "word_count": 50},
   }
   ```
3. Generate page-specific text instead of one big blob
4. Modify Generator to call `generate_brochure_pages()` instead of `generate_variants()`

**Files to create/modify**:
- `services/brochure_generator.py` (NEW)
- `services/generator.py` (add brochure mode)
- `backend/main.py` (route to brochure generator when brand selected)

**Test**: Generate brochure → verify text distributed across correct pages → check word counts

---

#### **Task 1.3: Enhanced PDF Layout with Page Structure**
**Priority**: HIGH

**Steps**:
1. Update `PDFGenerator` to use brochure page structure
2. Create page templates:
   - Cover page (hero image + headline)
   - Introduction spread (image left, text right)
   - Interior pages (grid of images + descriptions)
   - Location page (map placeholder + area text)
   - Features page (bullet points + specs)
   - Floorplan page (large floor plan + contact)
3. Apply typography styles from frontend selector
4. Add page numbers and branding elements

**Files to modify**:
- `services/pdf_generator.py` (major refactor of draw methods)

**Test**: Generate brochure → verify all 8 pages formatted correctly → check typography

---

### 🎨 **PHASE 2: Brochure Example Analysis (Make It Smart)**
**Goal**: Extract branding and layout from uploaded example PDF

#### **Task 2.1: PDF Upload Backend**
**Priority**: HIGH

**Steps**:
1. Create `POST /upload-example-brochure` endpoint
2. Save uploaded PDF to temp storage
3. Return file ID to frontend

**Files to create/modify**:
- `backend/main.py` (new endpoint)
- Create `uploads/` directory

**Test**: Upload PDF → receive success response with file ID

---

#### **Task 2.2: PDF Analysis Service**
**Priority**: HIGH

**Steps**:
1. Create `services/pdf_analyzer.py` (new service)
2. Use `PyPDF2` or `pdfplumber` to extract:
   - Page count
   - Text blocks and positions
   - Image positions and sizes
   - Font families and sizes
   - Color palette (from images/text)
3. Use Claude Vision API to analyze each page:
   - Layout structure (text vs image ratio)
   - Brand elements (logo placement, color scheme)
   - Typography style (serif vs sans, hierarchy)
4. Store analysis results in session or database

**Libraries to add**:
```bash
pip install PyPDF2 pdfplumber pillow
```

**Files to create**:
- `services/pdf_analyzer.py` (NEW)
- `backend/schemas.py` (add PDFAnalysisResult schema)

**Test**: Upload example brochure → get back layout rules → verify accuracy

---

#### **Task 2.3: Apply Extracted Layout to Generated PDF**
**Priority**: MEDIUM

**Steps**:
1. Modify `PDFGenerator` to accept layout rules
2. Apply extracted rules:
   - Font families from analysis
   - Color palette
   - Image placement patterns
   - Text block sizes
   - Margin/spacing rules
3. Fall back to brand defaults if no PDF uploaded

**Files to modify**:
- `services/pdf_generator.py` (add layout rules parameter)
- `backend/main.py` (pass analysis results to generator)

**Test**: Upload Savills brochure → generate new brochure → compare layouts → verify similarity

---

### ✏️ **PHASE 3: Post-Generation Editing (Make It Flexible)**
**Goal**: Allow agents to refine brochure before final export

#### **Task 3.1: Brochure Preview Interface**
**Priority**: HIGH

**Steps**:
1. Create `frontend/brochure-editor.html` (new page)
2. Display brochure as paginated preview (page-by-page carousel)
3. Show each page with:
   - Images assigned to that page
   - Generated text for that page
   - Edit buttons
4. Load from session storage (passed from generate page)

**Files to create**:
- `frontend/brochure-editor.html` (NEW)
- `frontend/brochure-editor.js` (NEW)
- `frontend/brochure-editor.css` (NEW)

**Test**: Generate brochure → redirect to editor → see 8 pages displayed

---

#### **Task 3.2: Image Swap/Reorder UI**
**Priority**: MEDIUM

**Steps**:
1. Add "Change Image" button to each image slot
2. Show modal with all uploaded photos
3. Click to swap image
4. Drag to reorder images within page
5. Update photo assignments in memory

**Files to modify**:
- `frontend/brochure-editor.js` (add image swap logic)

**Test**: Open editor → swap cover image → verify change → regenerate PDF → confirm change

---

#### **Task 3.3: Text Editing UI**
**Priority**: HIGH

**Steps**:
1. Add "Edit Text" button to each text section
2. Options:
   - **Option A**: Inline contenteditable div
   - **Option B**: Modal with textarea
   - **Option C**: AI chat interface ("Make it more formal", "Add mention of schools")
3. For AI chat:
   - Send current text + user instruction to Claude
   - Get revised text
   - Preview before applying
4. Save edited text to state

**Files to modify**:
- `frontend/brochure-editor.js` (add text editing)
- `frontend/brochure-editor.html` (add edit modals)

**Create new endpoint**:
- `POST /refine-text` (Claude API to revise text based on instruction)

**Test**: Edit intro text manually → verify change → use AI to make text "more sophisticated" → verify

---

#### **Task 3.4: Section Regeneration**
**Priority**: MEDIUM

**Steps**:
1. Add "Regenerate" button to each page/section
2. When clicked:
   - Call backend with page context (page number, image, original text)
   - Generate 3 new variants for that section only
   - Show variants in modal
   - User selects preferred variant
   - Update text in editor
3. Keep original in history for undo

**Files to create/modify**:
- `POST /regenerate-section` endpoint (NEW)
- `frontend/brochure-editor.js` (regeneration UI)

**Test**: Click "Regenerate intro" → see 3 variants → select one → verify applied

---

#### **Task 3.5: Save Draft & Final Export**
**Priority**: HIGH

**Steps**:
1. Add "Save Draft" button (saves to session or backend)
2. Add "Generate Final PDF" button
3. When generating final:
   - Collect all edits (text changes, image swaps)
   - Send to `POST /export/brochure-final`
   - Backend regenerates PDF with all edits
   - Download PDF
4. Keep edit history for future sessions

**Files to create/modify**:
- `POST /export/brochure-final` (NEW endpoint)
- `frontend/brochure-editor.js` (save/export logic)

**Test**: Make edits → save draft → close → reopen → verify edits preserved → export final PDF

---

### 🔥 **PHASE 4: Advanced Features (Make It a Beast)**

#### **Task 4.1: Multi-Brand Library**
**Priority**: LOW

**Steps**:
1. Add more estate agent brands to `brand_styles.py`:
   - Knight Frank
   - Strutt & Parker
   - Hamptons
   - Foxtons
2. Scrape or manually analyze their brochure styles
3. Create comprehensive style guides for each

---

#### **Task 4.2: Dynamic Brochure Lengths**
**Priority**: LOW

**Steps**:
1. Allow 4-page, 8-page, 12-page, 16-page brochures
2. Adjust text distribution accordingly
3. Add/remove pages based on photo count

---

#### **Task 4.3: Version History**
**Priority**: LOW

**Steps**:
1. Store all generated versions
2. Show timeline of edits
3. Allow rollback to previous version
4. Compare versions side-by-side

---

#### **Task 4.4: Team Collaboration**
**Priority**: LOW

**Steps**:
1. Add user accounts
2. Share brochure drafts with team
3. Add comments on specific pages
4. Approval workflow

---

## 🚀 RECOMMENDED EXECUTION ORDER

### Week 1: Core Functionality
1. Task 1.1 - Connect photo assignments ⭐ **START HERE**
2. Task 1.2 - Restructure text generation
3. Task 1.3 - Enhanced PDF layout

**Deliverable**: Working 8-page brochure with photos on correct pages

---

### Week 2: Smart Analysis
4. Task 2.1 - PDF upload backend
5. Task 2.2 - PDF analysis service
6. Task 2.3 - Apply extracted layout

**Deliverable**: Brochure matches uploaded example style

---

### Week 3: Editing System
7. Task 3.1 - Preview interface
8. Task 3.3 - Text editing UI
9. Task 3.2 - Image swap UI

**Deliverable**: Agent can edit brochure before export

---

### Week 4: Polish & Refinement
10. Task 3.4 - Section regeneration
11. Task 3.5 - Save draft & final export
12. Testing & bug fixes

**Deliverable**: Complete production-ready system

---

## 📝 CURRENT API STATUS

### ✅ Working APIs:
1. **Claude Vision API** - Image analysis ✅
2. **Claude Sonnet API** - Text generation ✅
3. **Postcodes.io** - Geocoding ✅
4. **Overpass API** - POI search ✅

### ⚠️ Missing APIs/Endpoints:
1. ❌ `POST /upload-example-brochure`
2. ❌ `POST /analyze-brochure-pdf`
3. ❌ `POST /regenerate-section`
4. ❌ `POST /refine-text`
5. ❌ `POST /export/brochure-final`

### 📊 What Happens When User Clicks "Generate Brochure":

**Current Flow**:
1. Frontend collects form data (`collectFormData()`)
2. Sends `POST /generate` with:
   - Property data (type, beds, baths, features)
   - Location data (address, setting)
   - Target audience, tone, channel
   - ✅ Brand (Savills/Generic)
   - ✅ Typography style
   - ❌ Photo assignments (NOT SENT YET!)
   - ❌ Example brochure analysis (NOT IMPLEMENTED!)
3. Backend generates 3 text variants using Claude Sonnet
4. Returns JSON with text only (no PDF yet)
5. Frontend displays variants in cards
6. User can click "Open in Editor" (editor exists but basic)

**What SHOULD happen**:
1. Same as above PLUS photo assignments
2. Backend generates page-by-page text (not variants)
3. Backend immediately generates PDF with:
   - Photos on correct pages based on assignments
   - Text distributed across pages
   - Layout matching uploaded example (if provided)
   - Brand styling applied
4. Returns PDF URL + editable JSON
5. Redirects to brochure editor
6. Agent edits and exports final PDF

---

## 🎯 CRITICAL SUCCESS FACTORS

### For "Like-for-Like" Brochure Copy:
1. ✅ **Brand Voice** - Captured in brand_styles.py
2. ❌ **Layout Analysis** - MUST implement PDF analyzer
3. ❌ **Page Structure** - MUST restructure text generation
4. ❌ **Visual Matching** - Typography, colors, spacing
5. ❌ **Example Learning** - Store and reuse layout patterns

### For Agent Usability:
1. ❌ **Preview First** - Show before committing
2. ❌ **Easy Editing** - Inline text changes
3. ❌ **Image Control** - Swap and reorder
4. ❌ **AI Assistance** - "Make this more..." chat
5. ❌ **Draft Saving** - Don't lose work

---

## 💰 PRIORITY SCORE

| Task | Impact | Effort | Priority Score | Order |
|------|--------|--------|----------------|-------|
| 1.1 Photo Assignment | 10/10 | 3/10 | 🔥🔥🔥 HIGH | 1 |
| 1.2 Page Structure | 10/10 | 7/10 | 🔥🔥🔥 HIGH | 2 |
| 2.2 PDF Analysis | 9/10 | 8/10 | 🔥🔥 MEDIUM-HIGH | 4 |
| 3.1 Preview UI | 8/10 | 5/10 | 🔥🔥 MEDIUM-HIGH | 5 |
| 3.3 Text Editing | 9/10 | 4/10 | 🔥🔥 MEDIUM-HIGH | 6 |
| 1.3 Enhanced Layout | 7/10 | 6/10 | 🔥 MEDIUM | 3 |
| 3.5 Final Export | 8/10 | 3/10 | 🔥 MEDIUM | 7 |
| 2.3 Apply Layout | 6/10 | 5/10 | 🔥 MEDIUM | 8 |

---

## 🎓 TECHNICAL NOTES

### Architecture Decisions:
1. **Keep brochure logic separate** - Don't break existing listing generator
2. **Use job queue for long operations** - PDF generation can be slow
3. **Store analysis results** - Don't re-analyze same brochure
4. **Version everything** - Track edits for rollback
5. **Cache aggressively** - Brand styles, layouts, generated text

### Performance Considerations:
- PDF generation: 5-15 seconds (acceptable with progress bar)
- Image analysis: 2-5 seconds per photo (parallelize!)
- Text generation: 10-20 seconds (show step-by-step progress)
- PDF analysis: 30-60 seconds (do once, cache forever)

---

## 🏁 DEFINITION OF DONE

### Minimum Viable Product (MVP):
- [ ] Upload 8+ property photos
- [ ] Assign photos to categories (cover, exterior, etc.)
- [ ] Select brand (Savills) and typography
- [ ] Generate 8-page PDF brochure
- [ ] Photos appear on correct pages
- [ ] Text matches Savills brand style
- [ ] Edit text inline
- [ ] Swap images
- [ ] Export final PDF

### Full Product:
- [ ] Upload example brochure → extract layout
- [ ] Generated brochure matches example perfectly
- [ ] AI chat to refine text ("make more formal")
- [ ] Regenerate individual sections
- [ ] Save drafts for later
- [ ] Version history with rollback
- [ ] 5+ estate agent brands supported
- [ ] Sub-10 second generation time

---

**This roadmap provides a clear, actionable path from current state to production-ready automated brochure generator. Start with Task 1.1 and work sequentially through the priorities.**
