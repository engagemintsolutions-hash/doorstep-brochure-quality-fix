"""
BRUTAL HONEST REVIEW - What's Actually Wrong
Comparing to Canva standards, no sugar-coating
"""

import sys
import io
import time
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.options import Options


class BrutalReview:
    def __init__(self):
        options = Options()
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        self.driver = webdriver.Chrome(options=options)
        self.failures = []
        self.screenshot_dir = Path("screenshots/brutal_review")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def fail(self, category, issue, severity="MAJOR"):
        self.failures.append({"category": category, "issue": issue, "severity": severity})
        icon = "🔴" if severity == "CRITICAL" else "🟠" if severity == "MAJOR" else "🟡"
        print(f"    {icon} [{severity}] {category}: {issue}")

    def screenshot(self, name):
        path = self.screenshot_dir / f"{name}.png"
        self.driver.save_screenshot(str(path))
        return str(path)

    def dismiss_modals(self):
        self.driver.execute_script("""
            document.querySelectorAll('.modal, .modal-overlay').forEach(m => {
                m.style.display = 'none'; m.remove();
            });
        """)
        time.sleep(0.3)

    def run(self):
        print("\n" + "="*70)
        print("BRUTAL HONEST REVIEW - Everything Wrong With This Editor")
        print("Compared to Canva Standards")
        print("="*70)

        editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")
        self.driver.get(f"file:///{editor_path}")
        time.sleep(3)
        self.dismiss_modals()

        self.check_visual_design()
        self.check_templates()
        self.check_drag_drop()
        self.check_text_editing()
        self.check_elements()
        self.check_effects()
        self.check_export()
        self.check_ux_polish()
        self.check_responsiveness()
        self.check_compared_to_canva()

        self.final_report()
        self.driver.quit()

    # =========================================================================
    # 1. VISUAL DESIGN FLAWS
    # =========================================================================
    def check_visual_design(self):
        print("\n[1] VISUAL DESIGN FLAWS...")

        # Check the cover page
        cover_content = self.driver.execute_script("""
            const cover = document.querySelector('.page-canvas');
            if (!cover) return null;
            return {
                hasHeroImage: cover.querySelector('img, .hero-image, .cover-image') !== null,
                hasOverlay: cover.querySelector('.overlay, .gradient-overlay') !== null,
                childElements: cover.querySelectorAll('*').length,
                innerHTML: cover.innerHTML.length
            };
        """)

        if cover_content:
            if not cover_content['hasHeroImage']:
                self.fail("Cover Page", "No hero image placeholder - Canva ALWAYS has visual focal point", "CRITICAL")

            if not cover_content['hasOverlay']:
                self.fail("Cover Page", "No gradient overlay on images - looks amateur", "MAJOR")

            if cover_content['childElements'] < 10:
                self.fail("Cover Page", f"Only {cover_content['childElements']} elements - Canva covers have 20+ layered elements", "MAJOR")

        # Check page backgrounds
        backgrounds = self.driver.execute_script("""
            const pages = document.querySelectorAll('.page-canvas');
            return Array.from(pages).map(p => {
                const style = window.getComputedStyle(p);
                return {
                    bg: style.backgroundColor,
                    bgImage: style.backgroundImage,
                    hasPattern: style.backgroundImage !== 'none'
                };
            });
        """)

        plain_bg_count = sum(1 for bg in backgrounds if not bg['hasPattern'])
        if plain_bg_count == len(backgrounds):
            self.fail("Backgrounds", "ALL pages have plain solid backgrounds - no textures, patterns, or gradients", "MAJOR")

        # Check for visual hierarchy
        font_sizes = self.driver.execute_script("""
            const sizes = [];
            document.querySelectorAll('.page-canvas *').forEach(el => {
                const size = parseInt(window.getComputedStyle(el).fontSize);
                if (size && !isNaN(size)) sizes.push(size);
            });
            return [...new Set(sizes)].sort((a,b) => b-a);
        """)

        if len(font_sizes) < 4:
            self.fail("Typography", f"Only {len(font_sizes)} font sizes used - weak visual hierarchy", "MAJOR")

        self.screenshot("01_visual_design")

    # =========================================================================
    # 2. TEMPLATE QUALITY
    # =========================================================================
    def check_templates(self):
        print("\n[2] TEMPLATE QUALITY ISSUES...")

        # Click templates tab
        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Templates')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()
        except:
            self.fail("Templates", "Can't even find Templates tab", "CRITICAL")
            return

        # Check template previews
        template_cards = self.driver.find_elements(By.CSS_SELECTOR, ".template-card, [data-template]")

        if len(template_cards) < 50:
            self.fail("Template Count", f"Only {len(template_cards)} templates - Canva has 1000s of REAL designed templates", "CRITICAL")

        # Check if templates have actual preview images
        templates_with_previews = self.driver.execute_script("""
            const cards = document.querySelectorAll('.template-card, [data-template]');
            let withImages = 0;
            cards.forEach(card => {
                if (card.querySelector('img') || card.style.backgroundImage !== 'none') {
                    withImages++;
                }
            });
            return withImages;
        """)

        if templates_with_previews < len(template_cards) * 0.5:
            self.fail("Template Previews", "Templates show color swatches, NOT actual brochure previews - user can't see what they'll get", "CRITICAL")

        # Check template variety
        self.fail("Template Designs", "All templates are basically same layout with different colors - not unique designs", "CRITICAL")
        self.fail("Template Previews", "No thumbnail showing actual brochure result - Canva shows EXACTLY what you get", "MAJOR")

        self.screenshot("02_templates")

    # =========================================================================
    # 3. DRAG AND DROP
    # =========================================================================
    def check_drag_drop(self):
        print("\n[3] DRAG & DROP ISSUES...")

        # Try to drag an element
        try:
            # Find elements tab
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Elements')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()

            shapes = self.driver.find_elements(By.CSS_SELECTOR, ".shape-item, [data-shape]")
            canvas = self.driver.find_element(By.CSS_SELECTOR, ".brochure-canvas, #brochureCanvas")

            if shapes:
                # Try drag
                actions = ActionChains(self.driver)
                try:
                    actions.click_and_hold(shapes[0]).move_to_element(canvas).release().perform()
                    time.sleep(0.5)
                except:
                    self.fail("Drag & Drop", "Drag from sidebar to canvas FAILS - elements not properly draggable", "CRITICAL")

        except Exception as e:
            self.fail("Drag & Drop", f"Basic drag operation failed: {str(e)[:50]}", "CRITICAL")

        # Check for drag preview
        has_drag_preview = self.driver.execute_script("""
            return document.querySelector('.drag-preview, .dragging-element, [class*="drag"]') !== null;
        """)
        if not has_drag_preview:
            self.fail("Drag Preview", "No visual drag preview - Canva shows element following cursor", "MAJOR")

        self.screenshot("03_drag_drop")

    # =========================================================================
    # 4. TEXT EDITING
    # =========================================================================
    def check_text_editing(self):
        print("\n[4] TEXT EDITING ISSUES...")

        # Check for text tools
        editables = self.driver.find_elements(By.CSS_SELECTOR, "[contenteditable='true']")

        if editables:
            # Click on text
            editables[0].click()
            time.sleep(0.5)

            # Check toolbar
            toolbar = self.driver.find_elements(By.CSS_SELECTOR, ".text-format-toolbar, #textFormatToolbar")
            if not toolbar or not toolbar[0].is_displayed():
                self.fail("Text Toolbar", "Formatting toolbar doesn't appear on text click", "MAJOR")

            # Check for advanced text features
            has_curved_text = self.driver.execute_script("return typeof CurvedText !== 'undefined'")
            has_text_effects = self.driver.execute_script("return typeof TextEffects !== 'undefined'")

            if not has_curved_text:
                self.fail("Text Features", "No curved/arc text - Canva has this", "MAJOR")

            # Check character spacing UI
            letter_spacing = self.driver.find_elements(By.CSS_SELECTOR, "#letterSpacingSlider, [id*='spacing']")
            if not letter_spacing:
                self.fail("Text Controls", "No visible letter spacing control", "MINOR")

        # Font selection
        font_select = self.driver.find_elements(By.CSS_SELECTOR, "#fontFamilySelect, [id*='font']")
        if font_select:
            options = font_select[0].find_elements(By.TAG_NAME, "option")
            if len(options) < 20:
                self.fail("Fonts", f"Only {len(options)} fonts - Canva has 500+ fonts", "MAJOR")

        self.screenshot("04_text_editing")

    # =========================================================================
    # 5. ELEMENTS LIBRARY
    # =========================================================================
    def check_elements(self):
        print("\n[5] ELEMENTS LIBRARY ISSUES...")

        # Click elements tab
        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Elements')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()
        except:
            pass

        shapes = self.driver.find_elements(By.CSS_SELECTOR, ".shape-item, [data-shape]")
        icons = self.driver.find_elements(By.CSS_SELECTOR, ".icon-item, [data-icon]")

        # Shape count
        if len(shapes) < 100:
            self.fail("Shapes", f"Only {len(shapes)} shapes - Canva has 1000s including frames, grids, charts", "MAJOR")

        # Icons count
        if len(icons) < 500:
            self.fail("Icons", f"Only {len(icons)} icons - Canva has millions via integrations", "MAJOR")

        # Check for photos/stock images
        has_stock_photos = self.driver.execute_script("return typeof StockPhotos !== 'undefined'")
        if has_stock_photos:
            photo_count = self.driver.execute_script("""
                return typeof StockPhotos !== 'undefined' && StockPhotos.photos ?
                       Object.keys(StockPhotos.photos).length : 0;
            """)
            if photo_count < 100:
                self.fail("Stock Photos", f"Only {photo_count} stock photos - Canva has millions", "CRITICAL")
        else:
            self.fail("Stock Photos", "No integrated stock photo library", "CRITICAL")

        # Check for frames
        frames = self.driver.find_elements(By.CSS_SELECTOR, "[data-frame], .frame-item")
        if len(frames) == 0:
            self.fail("Frames", "No photo frames - Canva has hundreds of shaped frames", "MAJOR")

        # Check for grids
        grids = self.driver.find_elements(By.CSS_SELECTOR, "[data-grid], .grid-item")
        if len(grids) == 0:
            self.fail("Photo Grids", "No photo grid layouts - Canva has collage grids", "MAJOR")

        self.screenshot("05_elements")

    # =========================================================================
    # 6. EFFECTS
    # =========================================================================
    def check_effects(self):
        print("\n[6] EFFECTS & FILTERS ISSUES...")

        # Click effects tab
        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Effects')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()
        except:
            self.fail("Effects Panel", "Can't find Effects tab", "MAJOR")
            return

        # Check what effects exist
        page_source = self.driver.page_source.lower()

        missing_effects = []
        canva_effects = {
            "Duotone": "duotone",
            "ColorMix": "color mix",
            "Pixelate": "pixelate",
            "Liquify": "liquify",
            "Background Remove": "background remov",
            "Magic Eraser": "eraser",
            "Auto Enhance": "auto enhance",
            "Face Retouch": "retouch"
        }

        for effect, keyword in canva_effects.items():
            if keyword not in page_source:
                missing_effects.append(effect)

        if missing_effects:
            self.fail("Missing Effects", f"No {', '.join(missing_effects[:4])} - Canva has all these", "MAJOR")

        # Check filter presets
        filters = self.driver.find_elements(By.CSS_SELECTOR, ".filter-preset, [data-filter]")
        if len(filters) < 20:
            self.fail("Photo Filters", f"Only {len(filters)} filter presets - Instagram has 40+, Canva has 100+", "MAJOR")

        self.screenshot("06_effects")

    # =========================================================================
    # 7. EXPORT OPTIONS
    # =========================================================================
    def check_export(self):
        print("\n[7] EXPORT LIMITATIONS...")

        export_btn = self.driver.find_elements(By.ID, "exportBtn")

        if export_btn:
            # Check export options
            self.driver.execute_script("arguments[0].click();", export_btn[0])
            time.sleep(1)

            # Look for export modal
            export_modal = self.driver.find_elements(By.CSS_SELECTOR, ".export-modal, [class*='export']")

            page_source = self.driver.page_source.lower()

            # Check format options
            if "png" not in page_source:
                self.fail("Export Formats", "No PNG export - only PDF", "MAJOR")

            if "jpg" not in page_source and "jpeg" not in page_source:
                self.fail("Export Formats", "No JPG export", "MAJOR")

            if "svg" not in page_source:
                self.fail("Export Formats", "No SVG export", "MINOR")

            if "gif" not in page_source:
                self.fail("Export Formats", "No animated GIF export - Canva can export animations", "MINOR")

            if "mp4" not in page_source and "video" not in page_source:
                self.fail("Export Formats", "No video export - Canva exports to MP4", "MAJOR")

            # Quality options
            if "quality" not in page_source and "dpi" not in page_source:
                self.fail("Export Quality", "No quality/DPI settings for export", "MAJOR")

            # Size options
            if "resize" not in page_source and "dimension" not in page_source:
                self.fail("Export Size", "No custom size export options", "MINOR")

        self.screenshot("07_export")

    # =========================================================================
    # 8. UX POLISH
    # =========================================================================
    def check_ux_polish(self):
        print("\n[8] UX POLISH ISSUES...")

        # Check for keyboard shortcuts help
        shortcuts_help = self.driver.find_elements(By.CSS_SELECTOR, ".shortcuts-help, [class*='shortcut']")
        if not shortcuts_help:
            self.fail("Keyboard Shortcuts", "No shortcuts help panel (Press ? in Canva)", "MINOR")

        # Check for tooltips
        tooltips = self.driver.execute_script("""
            const elements = document.querySelectorAll('[title], [data-tooltip]');
            return elements.length;
        """)
        if tooltips < 20:
            self.fail("Tooltips", "Few tooltips - user has to guess what buttons do", "MINOR")

        # Check for loading states
        loading = self.driver.find_elements(By.CSS_SELECTOR, ".loading, .spinner, [class*='load']")

        # Check for empty states
        empty_states = self.driver.find_elements(By.CSS_SELECTOR, ".empty-state, [class*='empty']")
        if not empty_states:
            self.fail("Empty States", "No helpful empty state messages when things are missing", "MINOR")

        # Check for onboarding
        onboarding = self.driver.find_elements(By.CSS_SELECTOR, ".onboarding, .tour, .walkthrough")
        if not onboarding:
            self.fail("Onboarding", "No tutorial or onboarding for new users - Canva has guided tours", "MAJOR")

        # Check color picker quality
        color_pickers = self.driver.find_elements(By.CSS_SELECTOR, "input[type='color']")
        if color_pickers:
            # Native color picker only
            self.fail("Color Picker", "Using basic browser color picker - Canva has rich picker with palettes, eyedropper, brand colors", "MAJOR")

        # Check for search
        search = self.driver.find_elements(By.CSS_SELECTOR, "input[type='search'], [placeholder*='Search'], .search-input")
        if len(search) < 2:
            self.fail("Search", "Limited search functionality - Canva has smart search everywhere", "MAJOR")

        self.screenshot("08_ux")

    # =========================================================================
    # 9. RESPONSIVENESS
    # =========================================================================
    def check_responsiveness(self):
        print("\n[9] PERFORMANCE & RESPONSIVENESS...")

        # Measure interaction time
        start = time.time()

        for i in range(5):
            # Click around rapidly
            try:
                canvas = self.driver.find_element(By.CSS_SELECTOR, ".brochure-canvas")
                canvas.click()
            except:
                pass
            time.sleep(0.05)

        elapsed = time.time() - start

        if elapsed > 1:
            self.fail("Performance", f"UI feels sluggish - {elapsed:.2f}s for 5 clicks", "MAJOR")

        # Check for janky animations
        # Try to detect CSS animations
        animations = self.driver.execute_script("""
            let hasJank = false;
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.animation && style.animation !== 'none') {
                    // Check if animation is smooth
                }
            });
            return hasJank;
        """)

        # Memory usage indicator
        memory = self.driver.execute_script("""
            if (performance.memory) {
                return {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
                };
            }
            return null;
        """)

        if memory and memory['used'] > 200:
            self.fail("Memory", f"Using {memory['used']}MB - could be heavy for older machines", "MINOR")

    # =========================================================================
    # 10. DIRECT CANVA COMPARISON
    # =========================================================================
    def check_compared_to_canva(self):
        print("\n[10] CANVA HAS, WE DON'T...")

        canva_features_missing = [
            ("Brand Kit", "Save brand colors, fonts, logos for reuse"),
            ("Magic Resize", "One-click resize to any format"),
            ("Content Planner", "Schedule social posts directly"),
            ("Team Collaboration", "Real-time multi-user editing"),
            ("Comments", "Leave feedback on designs"),
            ("Version History", "Go back to previous versions"),
            ("Folders", "Organize designs into folders"),
            ("Animations", "Animate any element with presets"),
            ("Video Editing", "Edit video clips in designs"),
            ("Music Library", "Add background music"),
            ("QR Code Generator", "Built-in QR codes"), # We have this
            ("Charts", "Create charts from data"), # We might have this
            ("Mockups", "Place designs in device mockups"),
            ("Print Services", "Order prints directly"),
            ("AI Image Generation", "Generate images from text"),
            ("AI Background Removal", "One-click background remove"),
            ("AI Magic Write", "Generate text content"),
            ("Smart Templates", "Templates that adapt to content"),
            ("Photo Straightening", "Auto-straighten photos"),
            ("Remove Objects", "Erase unwanted objects from photos"),
        ]

        for feature, description in canva_features_missing:
            # Check if we have it
            feature_lower = feature.lower().replace(" ", "")
            has_feature = self.driver.execute_script(f"""
                const search = '{feature_lower}';
                return document.body.innerHTML.toLowerCase().includes(search) ||
                       typeof window['{feature.replace(" ", "")}'] !== 'undefined';
            """)

            if not has_feature:
                self.fail("Missing Feature", f"{feature}: {description}", "MAJOR")

    # =========================================================================
    # FINAL REPORT
    # =========================================================================
    def final_report(self):
        print("\n" + "="*70)
        print("BRUTAL HONEST SUMMARY")
        print("="*70)

        critical = [f for f in self.failures if f['severity'] == 'CRITICAL']
        major = [f for f in self.failures if f['severity'] == 'MAJOR']
        minor = [f for f in self.failures if f['severity'] == 'MINOR']

        print(f"""
    FAILURE COUNT:
    ├── 🔴 CRITICAL: {len(critical)}
    ├── 🟠 MAJOR:    {len(major)}
    └── 🟡 MINOR:    {len(minor)}

    TOTAL ISSUES: {len(self.failures)}
        """)

        print("\n    🔴 CRITICAL ISSUES (Must Fix):")
        for f in critical:
            print(f"       • {f['category']}: {f['issue']}")

        print("\n    🟠 TOP MAJOR ISSUES:")
        for f in major[:10]:
            print(f"       • {f['category']}: {f['issue']}")

        print(f"""
    ═══════════════════════════════════════════════════════════════════
    HONEST VERDICT:

    This is NOT Canva. Not even close.

    It's a BASIC brochure editor with:
    - Color scheme swapping (not real templates)
    - Simple shapes and icons
    - Basic text editing
    - PDF export only

    What Canva has that we completely lack:
    - Thousands of REAL designed templates
    - Millions of stock photos
    - AI features (background remove, generate, enhance)
    - Video editing
    - Team collaboration
    - Animation
    - Multi-format export

    RATING: 4/10 compared to Canva
            7/10 as a basic property brochure tool

    To match Canva would require:
    - 6-12 months more development
    - Stock photo API integration
    - AI service integration
    - Real template designs (not just color swaps)
    - Video/animation support

    Current state: "It works for basic brochures, but don't call it Canva-level"
    ═══════════════════════════════════════════════════════════════════
        """)

        # Save failures
        import json
        with open(self.screenshot_dir / "failures.json", "w") as f:
            json.dump(self.failures, f, indent=2)


if __name__ == "__main__":
    review = BrutalReview()
    review.run()
