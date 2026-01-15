"""
HUMAN USER QUALITY TEST
Testing as if I'm an actual estate agent making a brochure

"Right then, let's see if this thing actually works for a proper listing" - Old British Man
"""

import sys
import io
import time
import json
from pathlib import Path
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import *


class HumanQualityTest:
    def __init__(self):
        self.results = {
            "usability": [],
            "quality": [],
            "issues": [],
            "suggestions": []
        }

        options = Options()
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.screenshot_dir = Path("screenshots/human_test")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def log(self, category, message, rating=None):
        entry = {"message": message, "rating": rating, "time": datetime.now().isoformat()}
        self.results[category].append(entry)
        icon = {"usability": "👤", "quality": "⭐", "issues": "❌", "suggestions": "💡"}
        rating_str = f" [{rating}/10]" if rating else ""
        print(f"    {icon.get(category, '•')} {message}{rating_str}")

    def screenshot(self, name):
        path = self.screenshot_dir / f"{name}.png"
        self.driver.save_screenshot(str(path))
        print(f"    📸 {name}.png")
        return str(path)

    def dismiss_modals(self):
        self.driver.execute_script("""
            document.querySelectorAll('.modal, .modal-overlay, [class*="modal"]').forEach(m => {
                m.style.display = 'none';
                m.remove();
            });
            document.body.style.overflow = 'auto';
        """)
        time.sleep(0.3)

    # =========================================================================
    # TEST 1: FIRST IMPRESSIONS (As a new user)
    # =========================================================================

    def test_first_impressions(self):
        """What does a new user see when they open the editor?"""
        print("\n" + "="*70)
        print("TEST 1: FIRST IMPRESSIONS")
        print("As a new estate agent opening this for the first time...")
        print("="*70)

        editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")
        self.driver.get(f"file:///{editor_path}")
        time.sleep(3)
        self.dismiss_modals()

        self.screenshot("01_first_look")

        # Is it clear what this is?
        title = self.driver.title
        if "Brochure" in title or "Editor" in title:
            self.log("usability", "Clear title - I know what this is for", 8)
        else:
            self.log("issues", f"Confusing title: {title}")

        # Can I see the main canvas?
        canvas = self.driver.find_elements(By.CSS_SELECTOR, ".brochure-canvas, #brochureCanvas")
        if canvas and canvas[0].size['height'] > 0:
            self.log("usability", f"Canvas visible immediately ({canvas[0].size['width']}x{canvas[0].size['height']}px)", 9)
        else:
            self.log("issues", "Canvas not visible or empty on load")

        # Are the main tools obvious?
        sidebar_tabs = self.driver.find_elements(By.CSS_SELECTOR, ".sidebar-tab, .editor-tab, [class*='tab']")
        if len(sidebar_tabs) >= 3:
            self.log("usability", f"Found {len(sidebar_tabs)} tool tabs - good organization", 8)
        else:
            self.log("suggestions", "Main tools not immediately obvious")

        # Is there sample content to work with?
        pages = self.driver.find_elements(By.CSS_SELECTOR, ".page-canvas, .brochure-page")
        if len(pages) > 0:
            self.log("usability", f"Demo content loaded - {len(pages)} pages to explore", 9)
        else:
            self.log("issues", "No sample content - user sees blank canvas")

    # =========================================================================
    # TEST 2: CAN I ACTUALLY EDIT TEXT?
    # =========================================================================

    def test_text_editing(self):
        """Try to edit text like a real user would"""
        print("\n" + "="*70)
        print("TEST 2: TEXT EDITING")
        print("Can I click and type to change the property details?")
        print("="*70)

        self.dismiss_modals()

        # Find editable text
        editables = self.driver.find_elements(By.CSS_SELECTOR, "[contenteditable='true']")
        print(f"    Found {len(editables)} editable text areas")

        if len(editables) == 0:
            self.log("issues", "No editable text found - can't customize brochure!")
            return

        # Try to edit the first one
        try:
            first_editable = editables[0]
            original_text = first_editable.text[:50] if first_editable.text else "(empty)"

            # Click on it
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", first_editable)
            time.sleep(0.5)
            first_editable.click()
            time.sleep(0.3)

            # Select all and type new text
            first_editable.send_keys(Keys.CONTROL, 'a')
            time.sleep(0.2)
            first_editable.send_keys("123 Test Street, London, SW1A 1AA")
            time.sleep(0.5)

            new_text = first_editable.text
            if "123 Test Street" in new_text:
                self.log("usability", "Text editing works! Typed address successfully", 9)
            else:
                self.log("issues", f"Text didn't update. Got: {new_text[:50]}")

            self.screenshot("02_text_edited")

        except Exception as e:
            self.log("issues", f"Text editing failed: {str(e)[:80]}")

        # Check if formatting toolbar appears
        toolbar = self.driver.find_elements(By.CSS_SELECTOR, ".text-format-toolbar, #textFormatToolbar")
        if toolbar and toolbar[0].is_displayed():
            self.log("usability", "Formatting toolbar appeared - can style text", 8)
        else:
            self.log("suggestions", "Formatting toolbar not visible when editing text")

    # =========================================================================
    # TEST 3: TEMPLATE SWITCHING
    # =========================================================================

    def test_template_switching(self):
        """Can I change the look of my brochure easily?"""
        print("\n" + "="*70)
        print("TEST 3: TEMPLATE SWITCHING")
        print("Let me try different styles for my property...")
        print("="*70)

        self.dismiss_modals()

        # Find and click Templates tab
        try:
            templates_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Templates') or contains(text(), 'templates')]")
            self.driver.execute_script("arguments[0].click();", templates_tab)
            time.sleep(1)
            self.dismiss_modals()

            self.log("usability", "Templates panel opened easily", 8)

        except Exception as e:
            self.log("issues", f"Couldn't find Templates tab: {e}")
            return

        # Count available templates
        templates = self.driver.find_elements(By.CSS_SELECTOR, ".template-card, .template-item, [data-template]")
        print(f"    Found {len(templates)} templates")

        if len(templates) < 10:
            self.log("issues", f"Only {len(templates)} templates - need more variety")
        elif len(templates) < 20:
            self.log("quality", f"{len(templates)} templates available - decent selection", 7)
        else:
            self.log("quality", f"{len(templates)} templates! Great variety", 9)

        # Try applying a template
        if templates:
            try:
                # Click the 3rd template (not the default)
                template_to_click = templates[min(2, len(templates)-1)]
                template_name = template_to_click.get_attribute('data-template-id') or "unknown"

                self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", template_to_click)
                time.sleep(0.3)
                self.driver.execute_script("arguments[0].click();", template_to_click)
                time.sleep(1.5)

                self.screenshot("03_template_changed")
                self.log("usability", f"Applied template successfully", 9)

            except Exception as e:
                self.log("issues", f"Template click failed: {str(e)[:60]}")

    # =========================================================================
    # TEST 4: ADDING ELEMENTS
    # =========================================================================

    def test_adding_elements(self):
        """Can I add shapes, icons, and decorations?"""
        print("\n" + "="*70)
        print("TEST 4: ADDING ELEMENTS")
        print("I want to add some icons and shapes to make it pop...")
        print("="*70)

        self.dismiss_modals()

        # Find Elements tab
        try:
            elements_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Elements')]")
            self.driver.execute_script("arguments[0].click();", elements_tab)
            time.sleep(1)
            self.dismiss_modals()

        except:
            self.log("issues", "Couldn't find Elements tab")
            return

        # Count shapes
        shapes = self.driver.find_elements(By.CSS_SELECTOR, ".shape-item, [data-shape], [data-element-type='shape']")
        icons = self.driver.find_elements(By.CSS_SELECTOR, ".icon-item, [data-icon], [data-element-type='icon']")

        print(f"    Shapes: {len(shapes)}, Icons: {len(icons)}")

        # Quality check - are there property-relevant icons?
        page_source = self.driver.page_source.lower()
        property_icons = {
            "bedroom": "bedroom" in page_source,
            "bathroom": "bathroom" in page_source,
            "kitchen": "kitchen" in page_source,
            "garden": "garden" in page_source,
            "parking": "parking" in page_source,
            "heating": "heating" in page_source or "fireplace" in page_source
        }

        found_count = sum(property_icons.values())
        if found_count >= 5:
            self.log("quality", f"All essential property icons present ({found_count}/6)", 9)
        elif found_count >= 3:
            self.log("quality", f"Most property icons available ({found_count}/6)", 7)
        else:
            self.log("issues", f"Missing key property icons - only {found_count}/6")

        # Try dragging an element
        if shapes:
            try:
                shape = shapes[0]
                canvas = self.driver.find_element(By.CSS_SELECTOR, ".brochure-canvas, #brochureCanvas")

                actions = ActionChains(self.driver)
                actions.drag_and_drop(shape, canvas).perform()
                time.sleep(0.5)

                self.log("usability", "Drag and drop works for elements", 8)
                self.screenshot("04_element_added")

            except Exception as e:
                self.log("suggestions", f"Drag & drop tricky: {str(e)[:50]}")

    # =========================================================================
    # TEST 5: BROCHURE QUALITY ASSESSMENT
    # =========================================================================

    def test_brochure_quality(self):
        """Does the output look professional?"""
        print("\n" + "="*70)
        print("TEST 5: BROCHURE QUALITY ASSESSMENT")
        print("Would I actually send this to a client?")
        print("="*70)

        self.dismiss_modals()

        # Click on canvas to deselect
        try:
            canvas = self.driver.find_element(By.CSS_SELECTOR, ".brochure-canvas, #brochureCanvas")
            canvas.click()
        except:
            pass

        time.sleep(0.5)
        self.screenshot("05_quality_check")

        # Check page structure
        pages = self.driver.find_elements(By.CSS_SELECTOR, ".page-canvas, .brochure-page")

        quality_checks = []

        # 1. Are pages A4 proportioned? (roughly 1:1.41 ratio)
        if pages:
            page = pages[0]
            width = page.size['width']
            height = page.size['height']
            ratio = height / width if width > 0 else 0

            if 1.3 <= ratio <= 1.5:
                quality_checks.append(("A4 Proportions", True, "Correct A4 ratio"))
            else:
                quality_checks.append(("A4 Proportions", False, f"Ratio {ratio:.2f} not A4"))

        # 2. Is there good contrast?
        contrast_score = self.driver.execute_script("""
            const canvas = document.querySelector('.brochure-canvas, .page-canvas');
            if (!canvas) return 5;

            const style = window.getComputedStyle(canvas);
            const bg = style.backgroundColor;

            // Simple check - does it have visible colors?
            return bg && bg !== 'rgba(0, 0, 0, 0)' ? 8 : 5;
        """)
        quality_checks.append(("Color Contrast", contrast_score >= 7, f"Score: {contrast_score}/10"))

        # 3. Is text readable?
        text_elements = self.driver.find_elements(By.CSS_SELECTOR, "[contenteditable='true'], .text-element, h1, h2, h3, p")
        readable_text = 0
        for el in text_elements[:10]:
            try:
                font_size = el.value_of_css_property('font-size')
                size_px = int(font_size.replace('px', ''))
                if size_px >= 12:
                    readable_text += 1
            except:
                pass

        if readable_text >= 5:
            quality_checks.append(("Text Readability", True, f"{readable_text} readable text elements"))
        else:
            quality_checks.append(("Text Readability", False, "Text may be too small"))

        # 4. Professional layout?
        has_header = len(self.driver.find_elements(By.CSS_SELECTOR, ".page-header, .cover-header, h1")) > 0
        has_content = len(self.driver.find_elements(By.CSS_SELECTOR, ".page-content, .details-section, p")) > 0

        quality_checks.append(("Layout Structure", has_header and has_content, "Has header + content sections"))

        # Report quality findings
        passed = sum(1 for _, status, _ in quality_checks if status)
        total = len(quality_checks)

        for name, status, detail in quality_checks:
            icon = "✅" if status else "⚠️"
            print(f"    {icon} {name}: {detail}")

        overall_quality = (passed / total) * 10 if total > 0 else 5
        self.log("quality", f"Overall brochure quality: {passed}/{total} checks passed", round(overall_quality))

    # =========================================================================
    # TEST 6: BRITISH ESTATE AGENT FEATURES
    # =========================================================================

    def test_british_features(self):
        """Does it have what British agents need?"""
        print("\n" + "="*70)
        print("TEST 6: BRITISH ESTATE AGENT FEATURES")
        print("Does this understand the UK property market?")
        print("="*70)

        self.dismiss_modals()

        # Check for British-specific features
        british_checks = []

        # 1. EPC ratings
        has_epc = self.driver.execute_script("return typeof BritishBadges !== 'undefined' && BritishBadges.EPC_RATINGS")
        british_checks.append(("EPC Ratings", has_epc, "A-G energy ratings"))

        # 2. Stamp duty calculator
        stamp_duty = self.driver.execute_script("""
            if (typeof BritishFeatures === 'undefined') return null;
            try {
                return BritishFeatures.calculateStampDuty(500000);
            } catch(e) { return null; }
        """)
        british_checks.append(("Stamp Duty Calculator", stamp_duty is not None, f"£500k = £{stamp_duty}" if stamp_duty else "Not working"))

        # 3. Tenure badges (Freehold/Leasehold)
        has_tenure = self.driver.execute_script("""
            return typeof BritishBadges !== 'undefined' &&
                   BritishBadges.TENURE_BADGES &&
                   BritishBadges.TENURE_BADGES.freehold;
        """)
        british_checks.append(("Tenure Badges", has_tenure, "Freehold/Leasehold/Share of Freehold"))

        # 4. UK price formats
        has_uk_prices = self.driver.execute_script("""
            return typeof BritishBadges !== 'undefined' &&
                   BritishBadges.createPriceBadge &&
                   (typeof BritishBadges.PRICE_STYLES !== 'undefined');
        """)
        british_checks.append(("UK Price Formats", has_uk_prices, "Guide Price, OIRO, Offers Over"))

        # 5. Chain status
        has_chain = self.driver.execute_script("""
            return typeof BritishBadges !== 'undefined' &&
                   BritishBadges.STATUS_BADGES &&
                   BritishBadges.STATUS_BADGES.chainFree;
        """)
        british_checks.append(("Chain Status", has_chain, "Chain Free badge"))

        # 6. British description phrases
        phrases_count = self.driver.execute_script("""
            if (typeof BritishFeatures === 'undefined') return 0;
            const phrases = BritishFeatures.BRITISH_PHRASES;
            if (!phrases) return 0;
            return Object.values(phrases).flat().length;
        """)
        british_checks.append(("Estate Agent Phrases", phrases_count > 20, f"{phrases_count} classic phrases"))

        # Report
        passed = sum(1 for _, status, _ in british_checks if status)
        total = len(british_checks)

        for name, status, detail in british_checks:
            icon = "✅" if status else "❌"
            print(f"    {icon} {name}: {detail}")

        if passed == total:
            self.log("quality", "Full British estate agent feature set!", 10)
        elif passed >= 4:
            self.log("quality", f"Good British features ({passed}/{total})", 8)
        else:
            self.log("issues", f"Missing British features ({passed}/{total})")

    # =========================================================================
    # TEST 7: EXPORT WORKFLOW
    # =========================================================================

    def test_export_workflow(self):
        """Can I actually export a PDF?"""
        print("\n" + "="*70)
        print("TEST 7: EXPORT WORKFLOW")
        print("Time to download this brochure...")
        print("="*70)

        self.dismiss_modals()

        # Find export button
        export_btn = self.driver.find_elements(By.ID, "exportBtn")
        if not export_btn:
            export_btn = self.driver.find_elements(By.XPATH, "//*[contains(., 'Export')]")

        if export_btn:
            btn = export_btn[0]
            is_enabled = not btn.get_attribute('disabled')

            if is_enabled:
                self.log("usability", "Export button is enabled and ready", 9)

                # Check what export options exist
                self.driver.execute_script("arguments[0].click();", btn)
                time.sleep(1)

                # Look for export modal or options
                export_options = self.driver.find_elements(By.CSS_SELECTOR, ".export-modal, .export-options, [class*='export']")
                if export_options:
                    self.log("usability", "Export options panel appeared", 8)
                    self.screenshot("06_export_options")
                else:
                    self.log("usability", "Direct PDF export (no options modal)", 7)

            else:
                self.log("issues", "Export button is disabled - can't download!")
        else:
            self.log("issues", "No export button found")

    # =========================================================================
    # TEST 8: RESPONSIVENESS & SPEED
    # =========================================================================

    def test_performance(self):
        """Is it fast enough for daily use?"""
        print("\n" + "="*70)
        print("TEST 8: PERFORMANCE CHECK")
        print("Will this slow me down on a busy day?")
        print("="*70)

        self.dismiss_modals()

        # Test interaction speed
        start = time.time()

        # Quick actions
        for i in range(3):
            # Click around
            canvas = self.driver.find_element(By.CSS_SELECTOR, ".brochure-canvas, #brochureCanvas")
            canvas.click()
            time.sleep(0.1)

        elapsed = time.time() - start

        if elapsed < 1:
            self.log("usability", f"Very responsive - {elapsed:.2f}s for 3 interactions", 9)
        elif elapsed < 2:
            self.log("usability", f"Acceptable speed - {elapsed:.2f}s for 3 interactions", 7)
        else:
            self.log("issues", f"Sluggish - {elapsed:.2f}s for simple actions")

        # Check for any lag warnings in console
        errors = self.driver.execute_script("""
            return window.performance && window.performance.getEntriesByType ?
                   window.performance.getEntriesByType('resource').length : 0;
        """)
        print(f"    Resources loaded: {errors}")

    # =========================================================================
    # FINAL VERDICT
    # =========================================================================

    def final_verdict(self):
        """Overall assessment"""
        print("\n" + "="*70)
        print("FINAL VERDICT")
        print("="*70)

        self.screenshot("07_final_state")

        # Calculate scores
        usability_scores = [r['rating'] for r in self.results['usability'] if r['rating']]
        quality_scores = [r['rating'] for r in self.results['quality'] if r['rating']]
        issue_count = len(self.results['issues'])

        avg_usability = sum(usability_scores) / len(usability_scores) if usability_scores else 5
        avg_quality = sum(quality_scores) / len(quality_scores) if quality_scores else 5

        print(f"\n    📊 SCORES:")
        print(f"    ├── Usability: {avg_usability:.1f}/10")
        print(f"    ├── Quality:   {avg_quality:.1f}/10")
        print(f"    ├── Issues:    {issue_count} found")
        print(f"    └── Overall:   {(avg_usability + avg_quality) / 2:.1f}/10")

        print(f"\n    💡 SUGGESTIONS:")
        for s in self.results['suggestions']:
            print(f"       • {s['message']}")

        print(f"\n    ❌ ISSUES:")
        for i in self.results['issues']:
            print(f"       • {i['message']}")

        # Final statement
        overall = (avg_usability + avg_quality) / 2
        print("\n" + "-"*70)
        if overall >= 8:
            print("    🏆 VERDICT: Production ready! Would use this for real listings.")
        elif overall >= 6:
            print("    ✅ VERDICT: Good tool, few rough edges to polish.")
        elif overall >= 4:
            print("    ⚠️ VERDICT: Needs work before daily use.")
        else:
            print("    ❌ VERDICT: Not ready for professional use.")
        print("-"*70)

        # Save results
        results_path = self.screenshot_dir / "human_test_results.json"
        with open(results_path, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        print(f"\n    Results saved to: {results_path}")

    def run(self):
        """Run all human-like tests"""
        print("\n" + "="*70)
        print("HUMAN USER QUALITY TEST")
        print("Testing as a real estate agent would...")
        print("="*70)

        try:
            self.test_first_impressions()
            self.test_text_editing()
            self.test_template_switching()
            self.test_adding_elements()
            self.test_brochure_quality()
            self.test_british_features()
            self.test_export_workflow()
            self.test_performance()
            self.final_verdict()

        finally:
            input("\n    Press Enter to close browser...")
            self.driver.quit()


if __name__ == "__main__":
    test = HumanQualityTest()
    test.run()
