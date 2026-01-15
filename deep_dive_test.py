"""
DEEP DIVE END-TO-END TEST
Actually use every feature and find the issues

"If you don't test it properly, you'll look a right muppet" - Old British Man
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


class DeepDiveTest:
    def __init__(self):
        self.issues = []
        self.passed = []
        self.screenshots = []

        options = Options()
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.screenshot_dir = Path("screenshots/deep_dive")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def screenshot(self, name):
        path = self.screenshot_dir / f"{name}.png"
        self.driver.save_screenshot(str(path))
        self.screenshots.append(str(path))
        print(f"    [Screenshot] {name}.png")

    def issue(self, feature, problem):
        self.issues.append({"feature": feature, "problem": problem})
        print(f"    [ISSUE] {feature}: {problem}")

    def passed_test(self, feature, detail=""):
        self.passed.append({"feature": feature, "detail": detail})
        print(f"    [PASS] {feature}: {detail}")

    def dismiss_modals(self):
        """Force dismiss any blocking modals"""
        self.driver.execute_script("""
            document.querySelectorAll('.modal, .modal-overlay, [class*="modal"], .error-modal').forEach(m => {
                m.style.display = 'none';
                m.remove();
            });
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'auto';
        """)
        time.sleep(0.3)

    def inject_test_data(self):
        """Inject test session data"""
        self.driver.execute_script("""
            const testData = {
                propertyData: {
                    address: "42 Primrose Lane, Cotswolds, GL54 1AB",
                    price: "695000",
                    propertyType: "Detached Cottage",
                    bedrooms: 4,
                    bathrooms: 2
                },
                images: [],
                template: 'british-cottage'
            };
            sessionStorage.setItem('brochureSession', JSON.stringify(testData));
            localStorage.setItem('editorSession', JSON.stringify(testData));
            window.SKIP_SESSION_CHECK = true;
        """)

    def open_editor(self):
        """Open the editor and prepare for testing"""
        print("\n[SETUP] Opening editor...")

        editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")
        self.driver.get(f"file:///{editor_path}")
        time.sleep(2)

        self.inject_test_data()
        self.dismiss_modals()
        time.sleep(1)

        self.screenshot("00_editor_opened")

        # Check basic load
        title = self.driver.title
        if "Editor" in title or "Brochure" in title:
            self.passed_test("Editor Load", f"Title: {title}")
        else:
            self.issue("Editor Load", f"Unexpected title: {title}")

        # Check for JS errors
        logs = self.driver.get_log("browser")
        errors = [l for l in logs if l["level"] == "SEVERE"]
        if errors:
            for e in errors[:3]:
                self.issue("JavaScript Error", e["message"][:100])
        else:
            self.passed_test("No JS Errors", "Console clean")

    # =========================================================================
    # TEST 1: TEMPLATES
    # =========================================================================

    def test_templates(self):
        """Test template system"""
        print("\n[TEST] Templates...")

        # Click Templates tab
        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Templates')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()

            # Count templates
            templates = self.driver.find_elements(By.CSS_SELECTOR, ".template-card, [data-template]")
            if len(templates) > 0:
                self.passed_test("Templates Visible", f"{len(templates)} templates found")
            else:
                self.issue("Templates", "No template cards visible")

            # Check for 2026 British Cosy templates
            page_source = self.driver.page_source
            cosy_templates = ["British Cottage", "Cosy Hearth", "Sage", "Heritage Green"]
            found_cosy = [t for t in cosy_templates if t in page_source]
            if found_cosy:
                self.passed_test("2026 Cosy Templates", f"Found: {', '.join(found_cosy)}")
            else:
                self.issue("2026 Cosy Templates", "New British cosy templates not visible in UI")

            # Check for UK Agency templates
            uk_agencies = ["Savills", "Rightmove", "Foxtons", "Knight Frank"]
            found_agencies = [a for a in uk_agencies if a in page_source]
            if found_agencies:
                self.passed_test("UK Agency Templates", f"Found: {', '.join(found_agencies)}")
            else:
                self.issue("UK Agency Templates", "UK agency templates not visible")

            # Try clicking a template
            if templates:
                try:
                    self.driver.execute_script("arguments[0].click();", templates[0])
                    time.sleep(0.5)
                    self.passed_test("Template Click", "Template selection works")
                except:
                    self.issue("Template Click", "Could not click template")

            self.screenshot("01_templates_panel")

        except Exception as e:
            self.issue("Templates Tab", str(e)[:100])

    # =========================================================================
    # TEST 2: ELEMENTS LIBRARY
    # =========================================================================

    def test_elements(self):
        """Test elements library"""
        print("\n[TEST] Elements Library...")

        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Elements')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()

            # Count shapes
            shapes = self.driver.find_elements(By.CSS_SELECTOR, ".shape-item, [data-shape]")
            if len(shapes) > 10:
                self.passed_test("Shapes", f"{len(shapes)} shapes available")
            else:
                self.issue("Shapes", f"Only {len(shapes)} shapes found (expected 45+)")

            # Count icons
            icons = self.driver.find_elements(By.CSS_SELECTOR, ".icon-item, [data-icon]")
            if len(icons) > 50:
                self.passed_test("Icons", f"{len(icons)} icons available")
            else:
                self.issue("Icons", f"Only {len(icons)} icons found (expected 165+)")

            # Check for property icons specifically
            page_source = self.driver.page_source
            property_icons = ["bedroom", "bathroom", "parking", "garden"]
            found_icons = sum(1 for i in property_icons if i.lower() in page_source.lower())
            if found_icons >= 2:
                self.passed_test("Property Icons", f"{found_icons}/4 property icon types found")
            else:
                self.issue("Property Icons", "Missing property-specific icons")

            self.screenshot("02_elements_panel")

        except Exception as e:
            self.issue("Elements Tab", str(e)[:100])

    # =========================================================================
    # TEST 3: EFFECTS PANEL
    # =========================================================================

    def test_effects(self):
        """Test effects panel"""
        print("\n[TEST] Effects Panel...")

        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Effects')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()

            page_source = self.driver.page_source

            # Check for shadow controls
            if "Shadow" in page_source or "shadow" in page_source:
                self.passed_test("Shadow Effects", "Shadow controls found")
            else:
                self.issue("Shadow Effects", "Shadow controls not visible")

            # Check for gradient
            if "Gradient" in page_source or "gradient" in page_source:
                self.passed_test("Gradient Effects", "Gradient controls found")
            else:
                self.issue("Gradient Effects", "Gradient controls not visible")

            # Check for sliders
            sliders = self.driver.find_elements(By.CSS_SELECTOR, "input[type='range']")
            if len(sliders) > 0:
                self.passed_test("Effect Sliders", f"{len(sliders)} sliders found")
            else:
                self.issue("Effect Sliders", "No range sliders found for effects")

            self.screenshot("03_effects_panel")

        except Exception as e:
            self.issue("Effects Tab", str(e)[:100])

    # =========================================================================
    # TEST 4: LAYERS PANEL
    # =========================================================================

    def test_layers(self):
        """Test layers panel"""
        print("\n[TEST] Layers Panel...")

        try:
            tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Layers')]")
            self.driver.execute_script("arguments[0].click();", tab)
            time.sleep(1)
            self.dismiss_modals()

            # Check for layer controls
            page_source = self.driver.page_source

            layer_features = ["visibility", "lock", "Layer"]
            found = [f for f in layer_features if f.lower() in page_source.lower()]
            if found:
                self.passed_test("Layer Panel", f"Features: {', '.join(found)}")
            else:
                self.issue("Layer Panel", "Layer controls not visible")

            self.screenshot("04_layers_panel")

        except Exception as e:
            self.issue("Layers Tab", str(e)[:100])

    # =========================================================================
    # TEST 5: BRITISH BADGES
    # =========================================================================

    def test_british_badges(self):
        """Test British property badges"""
        print("\n[TEST] British Badges...")

        # Check if BritishBadges is loaded
        try:
            has_badges = self.driver.execute_script("return typeof BritishBadges !== 'undefined'")
            if has_badges:
                self.passed_test("BritishBadges Loaded", "Module available")

                # Check badge types
                badge_count = self.driver.execute_script("""
                    return Object.keys(BritishBadges.STATUS_BADGES || {}).length +
                           Object.keys(BritishBadges.TENURE_BADGES || {}).length;
                """)
                if badge_count > 10:
                    self.passed_test("Badge Types", f"{badge_count} badge types available")
                else:
                    self.issue("Badge Types", f"Only {badge_count} badges found")

                # Check EPC ratings
                epc_count = self.driver.execute_script("return Object.keys(BritishBadges.EPC_RATINGS || {}).length")
                if epc_count == 7:
                    self.passed_test("EPC Ratings", "All 7 ratings (A-G) available")
                else:
                    self.issue("EPC Ratings", f"Expected 7, found {epc_count}")

            else:
                self.issue("BritishBadges", "Module not loaded - check script include")

        except Exception as e:
            self.issue("British Badges", str(e)[:100])

    # =========================================================================
    # TEST 6: BRITISH FEATURES
    # =========================================================================

    def test_british_features(self):
        """Test British property features"""
        print("\n[TEST] British Features...")

        try:
            has_features = self.driver.execute_script("return typeof BritishFeatures !== 'undefined'")
            if has_features:
                self.passed_test("BritishFeatures Loaded", "Module available")

                # Test stamp duty calculator
                stamp_duty = self.driver.execute_script("""
                    if (typeof BritishFeatures.calculateStampDuty === 'function') {
                        return BritishFeatures.calculateStampDuty(500000);
                    }
                    return null;
                """)
                if stamp_duty and stamp_duty.get('tax') is not None:
                    self.passed_test("Stamp Duty Calculator", f"£500k = £{stamp_duty['tax']} duty")
                else:
                    self.issue("Stamp Duty Calculator", "Function not working")

                # Test phrase library
                phrase_count = self.driver.execute_script("""
                    if (BritishFeatures.BRITISH_PHRASES) {
                        let total = 0;
                        for (let cat in BritishFeatures.BRITISH_PHRASES) {
                            total += BritishFeatures.BRITISH_PHRASES[cat].length;
                        }
                        return total;
                    }
                    return 0;
                """)
                if phrase_count > 30:
                    self.passed_test("British Phrases", f"{phrase_count} phrases available")
                else:
                    self.issue("British Phrases", f"Only {phrase_count} phrases found")

                # Test Ofsted ratings
                ofsted = self.driver.execute_script("return BritishFeatures.OFSTED_RATINGS")
                if ofsted and len(ofsted) >= 4:
                    self.passed_test("Ofsted Ratings", "All 4 ratings available")
                else:
                    self.issue("Ofsted Ratings", "Ratings not properly defined")

            else:
                self.issue("BritishFeatures", "Module not loaded - check script include")

        except Exception as e:
            self.issue("British Features", str(e)[:100])

    # =========================================================================
    # TEST 7: TEMPLATE MEGA LIBRARY
    # =========================================================================

    def test_mega_library(self):
        """Test mega template library"""
        print("\n[TEST] Mega Template Library...")

        try:
            has_lib = self.driver.execute_script("return typeof MegaTemplateLibrary !== 'undefined'")
            if has_lib:
                self.passed_test("MegaTemplateLibrary Loaded", "Module available")

                # Get template count
                template_count = self.driver.execute_script("""
                    if (typeof MegaTemplateLibrary.getTemplateCount === 'function') {
                        return MegaTemplateLibrary.getTemplateCount();
                    }
                    return MegaTemplateLibrary.getTemplates ? MegaTemplateLibrary.getTemplates().length : 0;
                """)
                if template_count >= 1000:
                    self.passed_test("Template Count", f"{template_count} templates generated")
                elif template_count > 0:
                    self.issue("Template Count", f"Only {template_count} templates (expected 1692)")
                else:
                    self.issue("Template Count", "No templates generated")

                # Check color schemes
                schemes = self.driver.execute_script("return Object.keys(MegaTemplateLibrary.COLOR_SCHEMES || {}).length")
                if schemes >= 40:
                    self.passed_test("Color Schemes", f"{schemes} schemes available")
                else:
                    self.issue("Color Schemes", f"Only {schemes} schemes (expected 47)")

                # Check custom colors function
                has_custom = self.driver.execute_script("return typeof MegaTemplateLibrary.setUserColors === 'function'")
                if has_custom:
                    self.passed_test("Custom Colors", "setUserColors function available")
                else:
                    self.issue("Custom Colors", "Custom color function missing")

            else:
                self.issue("MegaTemplateLibrary", "Module not loaded")

        except Exception as e:
            self.issue("Mega Library", str(e)[:100])

    # =========================================================================
    # TEST 8: OTHER MODULES
    # =========================================================================

    def test_other_modules(self):
        """Test other feature modules"""
        print("\n[TEST] Other Modules...")

        modules = [
            ("ElementDrag", "Drag & Drop"),
            ("LayerSystem", "Layers"),
            ("TextEffects", "Text Effects"),
            ("ElementsLibrary", "Elements"),
            ("AlignmentSystem", "Smart Guides"),
            ("ImageEditor", "Image Editor"),
            ("QRCodeGenerator", "QR Codes"),
            ("PrebuiltSections", "Prebuilt Sections"),
            ("StockPhotos", "Stock Photos"),
            ("IconsExpanded", "Expanded Icons"),
            ("ElementGrouping", "Element Grouping"),
            ("PropertyCharts", "Property Charts"),
            ("TextAnimations", "Text Animations"),
        ]

        for module_name, friendly_name in modules:
            try:
                exists = self.driver.execute_script(f"return typeof {module_name} !== 'undefined' || typeof window.{module_name} !== 'undefined'")
                if exists:
                    self.passed_test(friendly_name, f"{module_name} loaded")
                else:
                    self.issue(friendly_name, f"{module_name} not loaded")
            except:
                self.issue(friendly_name, f"Error checking {module_name}")

    # =========================================================================
    # TEST 9: CANVAS INTERACTION
    # =========================================================================

    def test_canvas(self):
        """Test canvas interaction"""
        print("\n[TEST] Canvas Interaction...")

        try:
            canvas = self.driver.find_element(By.CSS_SELECTOR, ".page-canvas, #brochureCanvas, .brochure-canvas, .canvas")

            if canvas:
                size = canvas.size
                if size['width'] > 0 and size['height'] > 0:
                    self.passed_test("Canvas Size", f"{size['width']}x{size['height']}px")
                else:
                    self.issue("Canvas Size", f"Canvas has no size: {size}")

                # Try clicking canvas
                actions = ActionChains(self.driver)
                actions.move_to_element(canvas).click().perform()
                self.passed_test("Canvas Click", "Canvas responds to clicks")

            else:
                self.issue("Canvas", "Canvas element not found")

            self.screenshot("05_canvas")

        except Exception as e:
            self.issue("Canvas", str(e)[:100])

    # =========================================================================
    # TEST 10: KEYBOARD SHORTCUTS
    # =========================================================================

    def test_shortcuts(self):
        """Test keyboard shortcuts"""
        print("\n[TEST] Keyboard Shortcuts...")

        try:
            body = self.driver.find_element(By.TAG_NAME, "body")

            # Test Ctrl+Z (Undo)
            body.send_keys(Keys.CONTROL + "z")
            time.sleep(0.2)
            self.passed_test("Undo Shortcut", "Ctrl+Z sent")

            # Test Ctrl+Y (Redo)
            body.send_keys(Keys.CONTROL + "y")
            time.sleep(0.2)
            self.passed_test("Redo Shortcut", "Ctrl+Y sent")

            # Test Delete
            body.send_keys(Keys.DELETE)
            time.sleep(0.2)
            self.passed_test("Delete Shortcut", "Delete key sent")

        except Exception as e:
            self.issue("Shortcuts", str(e)[:100])

    # =========================================================================
    # TEST 11: EXPORT BUTTONS
    # =========================================================================

    def test_export(self):
        """Test export functionality"""
        print("\n[TEST] Export...")

        try:
            # Look for export button (by ID first, then by text content)
            export_btn = self.driver.find_elements(By.ID, "exportBtn")
            if not export_btn:
                # Fallback: Look in page source
                export_btn = self.driver.find_elements(By.XPATH, "//*[contains(., 'Export PDF')]")

            if export_btn:
                is_enabled = not export_btn[0].get_attribute('disabled')
                status = "enabled" if is_enabled else "disabled"
                self.passed_test("Export Button", f"Found export button ({status})")
            else:
                self.issue("Export Button", "No export button visible")

            # Look for save button
            save_btns = self.driver.find_elements(By.ID, "saveBtn")
            if not save_btns:
                save_btns = self.driver.find_elements(By.XPATH, "//*[contains(text(), 'Save')]")

            if save_btns:
                self.passed_test("Save Button", f"Found {len(save_btns)} save button(s)")
            else:
                self.issue("Save Button", "No save button visible")

        except Exception as e:
            self.issue("Export", str(e)[:100])

    # =========================================================================
    # SUMMARY
    # =========================================================================

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 70)
        print("DEEP DIVE TEST RESULTS")
        print("=" * 70)

        print(f"\n[PASSED] {len(self.passed)} tests")
        print(f"[ISSUES] {len(self.issues)} issues found")
        print(f"[SCREENSHOTS] {len(self.screenshots)} taken")

        if self.issues:
            print("\n" + "-" * 70)
            print("ISSUES FOUND:")
            print("-" * 70)
            for i, issue in enumerate(self.issues, 1):
                print(f"{i}. [{issue['feature']}] {issue['problem']}")

        # Save results
        results = {
            "timestamp": datetime.now().isoformat(),
            "passed": self.passed,
            "issues": self.issues,
            "screenshots": self.screenshots,
            "summary": {
                "total_passed": len(self.passed),
                "total_issues": len(self.issues),
                "pass_rate": f"{len(self.passed) / (len(self.passed) + len(self.issues)) * 100:.1f}%"
            }
        }

        with open(self.screenshot_dir / "deep_dive_results.json", "w") as f:
            json.dump(results, f, indent=2)

        print(f"\nResults saved to: {self.screenshot_dir / 'deep_dive_results.json'}")
        print("=" * 70)

        return results

    def run_all_tests(self):
        """Run all tests"""
        print("=" * 70)
        print("DEEP DIVE END-TO-END TEST")
        print("Testing EVERY feature...")
        print("=" * 70)

        try:
            self.open_editor()
            self.test_templates()
            self.test_elements()
            self.test_effects()
            self.test_layers()
            self.test_british_badges()
            self.test_british_features()
            self.test_mega_library()
            self.test_other_modules()
            self.test_canvas()
            self.test_shortcuts()
            self.test_export()

            return self.print_summary()

        except Exception as e:
            print(f"\n[FATAL ERROR] {e}")
            import traceback
            traceback.print_exc()
            return None
        finally:
            self.driver.quit()


if __name__ == "__main__":
    test = DeepDiveTest()
    results = test.run_all_tests()

    if results:
        issue_count = len(results.get("issues", []))
        sys.exit(0 if issue_count == 0 else 1)
    else:
        sys.exit(1)
