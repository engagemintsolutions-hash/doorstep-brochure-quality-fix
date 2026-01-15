"""
Selenium UI Analysis V2 - Tests the brochure editor with proper server startup
"""

import os
import sys
import time
import json
import io
import subprocess
import signal
import atexit

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from pathlib import Path
from datetime import datetime

try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.common.action_chains import ActionChains
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError:
    print("Installing selenium...")
    os.system(f"{sys.executable} -m pip install selenium")
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.common.keys import Keys
    from selenium.webdriver.common.action_chains import ActionChains
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.chrome.options import Options
    from selenium.common.exceptions import TimeoutException, NoSuchElementException


class ServerManager:
    """Manages the backend server"""

    def __init__(self):
        self.process = None

    def start(self):
        """Start the uvicorn server"""
        print("Starting backend server...")
        self.process = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=str(Path(__file__).parent)
        )
        # Wait for server to start
        time.sleep(3)
        print("Server started on http://127.0.0.1:8000")
        return True

    def stop(self):
        """Stop the server"""
        if self.process:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except:
                self.process.kill()
            print("Server stopped")


class BrochureEditorAnalyzer:
    """Analyzes the brochure editor UI"""

    def __init__(self, headless=False):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "tests": [],
            "scores": {},
            "issues": [],
            "screenshots": [],
            "ui_analysis": {}
        }

        options = Options()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_experimental_option('excludeSwitches', ['enable-logging'])

        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.screenshot_dir = Path("screenshots/auto_brochure")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def take_screenshot(self, name):
        """Take a screenshot"""
        filename = f"{name}_{datetime.now().strftime('%H%M%S')}.png"
        filepath = self.screenshot_dir / filename
        self.driver.save_screenshot(str(filepath))
        self.results["screenshots"].append(str(filepath))
        print(f"  [Screenshot] {filename}")
        return filepath

    def add_result(self, name, passed, details="", score=None):
        """Add test result"""
        self.results["tests"].append({
            "name": name,
            "passed": passed,
            "details": details,
            "score": score
        })
        status = "[PASS]" if passed else "[FAIL]"
        print(f"  {status} {name}: {details}")

    def dismiss_modal(self):
        """Dismiss any error modals"""
        try:
            # Look for close button or X
            close_btns = self.driver.find_elements(By.CSS_SELECTOR,
                ".modal-close, .close-btn, button.close, [data-dismiss], .modal button")
            for btn in close_btns:
                try:
                    if btn.is_displayed():
                        btn.click()
                        time.sleep(0.5)
                        return True
                except:
                    pass

            # Try pressing Escape
            ActionChains(self.driver).send_keys(Keys.ESCAPE).perform()
            time.sleep(0.5)
            return True
        except:
            return False

    def inject_mock_session(self):
        """Inject mock session data so editor can load"""
        mock_data = {
            "propertyData": {
                "address": "123 Test Street, London, SW1A 1AA",
                "price": "850,000",
                "propertyType": "Detached House",
                "bedrooms": 4,
                "bathrooms": 2,
                "description": "A beautiful property in a prime location"
            },
            "images": [],
            "template": "modern-minimal"
        }

        script = f"""
            sessionStorage.setItem('brochureSession', JSON.stringify({json.dumps(mock_data)}));
            localStorage.setItem('brochureEditorData', JSON.stringify({json.dumps(mock_data)}));
        """
        self.driver.execute_script(script)

    def open_editor(self):
        """Open the brochure editor"""
        print("\n[INFO] Opening brochure editor...")

        # Try localhost first
        try:
            self.driver.get("http://127.0.0.1:8000/static/brochure_editor_v3.html")
        except:
            # Fallback to file://
            editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")
            self.driver.get(f"file:///{editor_path}")

        time.sleep(2)

        # Inject mock session data
        self.inject_mock_session()

        # Dismiss any error modals
        self.dismiss_modal()
        time.sleep(1)

        # Refresh to load with session data
        self.driver.refresh()
        time.sleep(2)
        self.dismiss_modal()

        self.take_screenshot("01_editor_initial")
        return True

    def analyze_header(self):
        """Analyze header elements"""
        print("\n[SECTION] Header Analysis...")

        header_items = {
            "Logo/Title": [".editor-header h1", ".brochure-editor-title", "h1"],
            "Save Button": ["button:has-text('Save')", ".save-btn", "[data-action='save']"],
            "Export Button": ["button:has-text('Export')", ".export-btn", "[data-action='export']"],
            "Undo/Redo": [".undo-btn", ".redo-btn", "[data-action='undo']"]
        }

        for item_name, selectors in header_items.items():
            found = False
            for sel in selectors:
                try:
                    elem = self.driver.find_element(By.CSS_SELECTOR, sel)
                    if elem.is_displayed():
                        found = True
                        break
                except:
                    pass
            self.add_result(f"Header: {item_name}", found)

    def analyze_sidebar(self):
        """Analyze sidebar/panel tabs"""
        print("\n[SECTION] Sidebar Analysis...")

        # Check for panel tabs
        tab_names = ["Layouts", "Templates", "Elements", "Effects", "Layers"]
        tabs_found = 0

        for tab in tab_names:
            try:
                # Try multiple ways to find tabs
                elem = self.driver.find_element(By.XPATH, f"//*[contains(text(), '{tab}')]")
                if elem.is_displayed():
                    tabs_found += 1
            except:
                pass

        self.add_result("Sidebar Tabs", tabs_found > 0, f"{tabs_found}/{len(tab_names)} tabs found")

        # Click on each tab and analyze content
        for tab in tab_names:
            try:
                tab_elem = self.driver.find_element(By.XPATH, f"//*[contains(text(), '{tab}')]")
                if tab_elem.is_displayed():
                    tab_elem.click()
                    time.sleep(0.5)
                    self.take_screenshot(f"tab_{tab.lower()}")
            except:
                pass

    def analyze_templates(self):
        """Analyze templates panel"""
        print("\n[SECTION] Templates Analysis...")

        try:
            # Click Templates tab
            templates_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Templates')]")
            templates_tab.click()
            time.sleep(1)

            # Count template cards
            templates = self.driver.find_elements(By.CSS_SELECTOR,
                ".template-card, .template-item, .template-thumbnail, [data-template]")

            self.add_result("Templates Available", len(templates) > 0,
                           f"{len(templates)} templates found",
                           score=min(len(templates) / 50 * 100, 100))

            self.take_screenshot("02_templates_panel")

            # Check for template categories
            categories = self.driver.find_elements(By.CSS_SELECTOR,
                ".template-category, .category-filter, [data-category]")
            self.add_result("Template Categories", len(categories) > 0,
                           f"{len(categories)} categories")

        except Exception as e:
            self.add_result("Templates Panel", False, str(e)[:80])

    def analyze_elements(self):
        """Analyze elements library"""
        print("\n[SECTION] Elements Library Analysis...")

        try:
            # Click Elements tab
            elements_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Elements')]")
            elements_tab.click()
            time.sleep(1)

            # Count shapes
            shapes = self.driver.find_elements(By.CSS_SELECTOR,
                ".shape-item, .shape-btn, [data-shape], svg.shape")
            self.add_result("Shapes Available", len(shapes) > 0, f"{len(shapes)} shapes")

            # Count icons
            icons = self.driver.find_elements(By.CSS_SELECTOR,
                ".icon-item, .icon-btn, [data-icon]")
            self.add_result("Icons Available", len(icons) > 0, f"{len(icons)} icons")

            # Count total elements
            all_elements = self.driver.find_elements(By.CSS_SELECTOR,
                ".element-item, .draggable-element, [draggable='true']")
            self.add_result("Total Draggable Elements", len(all_elements) > 0,
                           f"{len(all_elements)} elements",
                           score=min(len(all_elements) / 100 * 100, 100))

            self.take_screenshot("03_elements_panel")

        except Exception as e:
            self.add_result("Elements Library", False, str(e)[:80])

    def analyze_canvas(self):
        """Analyze main canvas area"""
        print("\n[SECTION] Canvas Analysis...")

        try:
            # Find canvas
            canvas = None
            for sel in [".brochure-canvas", "#canvas", ".editor-canvas", ".canvas-area"]:
                try:
                    canvas = self.driver.find_element(By.CSS_SELECTOR, sel)
                    if canvas.is_displayed():
                        break
                except:
                    pass

            if canvas:
                size = canvas.size
                self.add_result("Canvas Present", True, f"{size['width']}x{size['height']}px")

                # Check for page thumbnails
                pages = self.driver.find_elements(By.CSS_SELECTOR,
                    ".page-thumbnail, .page-item, [data-page]")
                self.add_result("Page Management", len(pages) > 0, f"{len(pages)} pages")

                # Check for zoom controls
                zoom = self.driver.find_elements(By.CSS_SELECTOR,
                    ".zoom-control, .zoom-slider, [data-zoom]")
                self.add_result("Zoom Controls", len(zoom) > 0)
            else:
                self.add_result("Canvas Present", False, "Canvas not found")

            self.take_screenshot("04_canvas_area")

        except Exception as e:
            self.add_result("Canvas Analysis", False, str(e)[:80])

    def analyze_effects(self):
        """Analyze effects panel"""
        print("\n[SECTION] Effects Analysis...")

        try:
            # Click Effects tab
            effects_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Effects')]")
            effects_tab.click()
            time.sleep(1)

            # Look for effect options
            effects = self.driver.find_elements(By.CSS_SELECTOR,
                ".effect-option, .filter-option, [data-effect], .effect-item")
            self.add_result("Effects Available", len(effects) > 0, f"{len(effects)} effects")

            # Check for shadow controls
            shadows = self.driver.find_elements(By.CSS_SELECTOR,
                "[data-effect='shadow'], .shadow-control, input[name*='shadow']")
            self.add_result("Shadow Effects", len(shadows) > 0)

            self.take_screenshot("05_effects_panel")

        except Exception as e:
            self.add_result("Effects Panel", False, str(e)[:80])

    def analyze_layers(self):
        """Analyze layers panel"""
        print("\n[SECTION] Layers Analysis...")

        try:
            # Click Layers tab
            layers_tab = self.driver.find_element(By.XPATH, "//*[contains(text(), 'Layers')]")
            layers_tab.click()
            time.sleep(1)

            # Count layer items
            layers = self.driver.find_elements(By.CSS_SELECTOR,
                ".layer-item, .layer-row, [data-layer]")
            self.add_result("Layers Panel", True, f"{len(layers)} layers visible")

            # Check for layer controls (visibility, lock, order)
            controls = self.driver.find_elements(By.CSS_SELECTOR,
                ".layer-visibility, .layer-lock, .move-up, .move-down, [data-layer-action]")
            self.add_result("Layer Controls", len(controls) > 0, f"{len(controls)} controls")

            self.take_screenshot("06_layers_panel")

        except Exception as e:
            self.add_result("Layers Panel", False, str(e)[:80])

    def analyze_export(self):
        """Analyze export functionality"""
        print("\n[SECTION] Export Analysis...")

        try:
            # Find export button
            export_btn = None
            for sel in [".export-btn", "button:has-text('Export')", "[data-action='export']",
                        "button.btn-export", ".export-pdf-btn"]:
                try:
                    export_btn = self.driver.find_element(By.CSS_SELECTOR, sel)
                    if export_btn.is_displayed():
                        break
                except:
                    pass

            # Try XPath for button with Export text
            if not export_btn:
                try:
                    export_btn = self.driver.find_element(By.XPATH, "//button[contains(., 'Export')]")
                except:
                    pass

            if export_btn:
                self.add_result("Export Button", True, "Found export functionality")
                export_btn.click()
                time.sleep(1)
                self.take_screenshot("07_export_dialog")
                self.dismiss_modal()
            else:
                self.add_result("Export Button", False, "Not found")

        except Exception as e:
            self.add_result("Export Analysis", False, str(e)[:80])

    def analyze_visual_quality(self):
        """Analyze overall visual quality"""
        print("\n[SECTION] Visual Quality Analysis...")

        try:
            analysis = self.driver.execute_script("""
                const body = document.body;
                const styles = getComputedStyle(body);

                return {
                    // Count UI elements
                    buttons: document.querySelectorAll('button, .btn').length,
                    inputs: document.querySelectorAll('input, select, textarea').length,
                    icons: document.querySelectorAll('svg, .icon, [class*="icon"]').length,

                    // CSS features
                    usesFlexbox: !!document.querySelector('[style*="flex"], .flex, .d-flex'),
                    usesGrid: !!document.querySelector('[style*="grid"], .grid'),
                    hasAnimations: document.querySelectorAll('[style*="animation"], .animate').length > 0,
                    hasShadows: document.querySelectorAll('[style*="shadow"], .shadow').length > 0,
                    hasGradients: document.querySelectorAll('[style*="gradient"]').length > 0,

                    // Typography
                    fontFamily: styles.fontFamily,
                    fontSize: styles.fontSize,

                    // Colors
                    bgColor: styles.backgroundColor,
                    textColor: styles.color,

                    // Layout
                    totalElements: document.querySelectorAll('*').length,
                    visibleElements: document.querySelectorAll(':not([hidden])').length
                };
            """)

            self.results["ui_analysis"] = analysis

            self.add_result("UI Elements", True,
                           f"{analysis['buttons']} buttons, {analysis['inputs']} inputs, {analysis['icons']} icons")
            self.add_result("Modern CSS", analysis['usesFlexbox'] or analysis['usesGrid'],
                           f"Flexbox: {analysis['usesFlexbox']}, Grid: {analysis['usesGrid']}")
            self.add_result("Visual Polish", analysis['hasShadows'] or analysis['hasGradients'],
                           f"Shadows: {analysis['hasShadows']}, Gradients: {analysis['hasGradients']}")
            self.add_result("Typography", True, analysis['fontFamily'][:50])

        except Exception as e:
            self.add_result("Visual Analysis", False, str(e)[:80])

    def count_features(self):
        """Count implemented features from the code"""
        print("\n[SECTION] Feature Count from Source...")

        frontend_dir = Path("frontend")

        feature_files = {
            "element_drag.js": "Drag & Drop",
            "layer_system.js": "Layer Management",
            "text_effects.js": "Text Effects",
            "elements_library.js": "Basic Elements",
            "alignment_system.js": "Smart Guides",
            "image_editor.js": "Image Editor",
            "qrcode_generator.js": "QR Codes",
            "prebuilt_sections.js": "Pre-built Sections",
            "stock_photos.js": "Stock Photos",
            "icons_expanded.js": "Extended Icons",
            "element_grouping.js": "Element Grouping",
            "property_charts.js": "Property Charts",
            "text_animations.js": "Text Animations",
            "template_mega_library.js": "Template Library"
        }

        features_found = 0
        for filename, feature_name in feature_files.items():
            filepath = frontend_dir / filename
            if filepath.exists():
                features_found += 1
                # Count lines
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = len(f.readlines())
                self.add_result(f"Feature: {feature_name}", True, f"{lines} lines")
            else:
                self.add_result(f"Feature: {feature_name}", False, "Not found")

        self.add_result("Total Feature Files", features_found > 10,
                       f"{features_found}/{len(feature_files)} features implemented")

    def calculate_scores(self):
        """Calculate overall scores"""
        print("\n[SECTION] Calculating Final Scores...")

        passed = sum(1 for t in self.results["tests"] if t["passed"])
        total = len(self.results["tests"])

        self.results["scores"] = {
            "total_tests": total,
            "passed_tests": passed,
            "pass_rate": round(passed / total * 100, 1) if total > 0 else 0,
            "issues": len(self.results["issues"]),
            "screenshots": len(self.results["screenshots"])
        }

    def print_summary(self):
        """Print final summary"""
        scores = self.results["scores"]

        print("\n" + "=" * 70)
        print("BROCHURE EDITOR UI ANALYSIS - FINAL REPORT")
        print("=" * 70)

        print(f"\nTests Passed: {scores['passed_tests']}/{scores['total_tests']} ({scores['pass_rate']}%)")
        print(f"Screenshots: {scores['screenshots']}")

        # Progress bar
        filled = int(scores['pass_rate'] / 10)
        bar = "#" * filled + "-" * (10 - filled)
        print(f"\nOverall: [{bar}] {scores['pass_rate']}%")

        # Rating
        rate = scores['pass_rate']
        if rate >= 90:
            rating = "EXCELLENT - Production Ready"
        elif rate >= 80:
            rating = "VERY GOOD - Minor Polish Needed"
        elif rate >= 70:
            rating = "GOOD - Some Features Missing"
        elif rate >= 60:
            rating = "FAIR - Needs Work"
        else:
            rating = "NEEDS IMPROVEMENT"

        print(f"Rating: {rating}")
        print(f"\nScreenshots saved to: {self.screenshot_dir}")
        print("=" * 70)

        return scores

    def save_results(self):
        """Save results to JSON"""
        results_file = self.screenshot_dir / "analysis_results.json"
        with open(results_file, "w") as f:
            json.dump(self.results, f, indent=2)
        print(f"Results saved to: {results_file}")

    def run_analysis(self):
        """Run complete analysis"""
        print("=" * 70)
        print("BROCHURE EDITOR UI ANALYSIS")
        print("=" * 70)

        try:
            self.open_editor()

            # Run all analyses
            self.analyze_header()
            self.analyze_sidebar()
            self.analyze_templates()
            self.analyze_elements()
            self.analyze_canvas()
            self.analyze_effects()
            self.analyze_layers()
            self.analyze_export()
            self.analyze_visual_quality()
            self.count_features()

            self.calculate_scores()
            self.print_summary()
            self.save_results()

            return self.results["scores"]

        except Exception as e:
            print(f"\nAnalysis failed: {e}")
            import traceback
            traceback.print_exc()
            return None
        finally:
            self.driver.quit()


def main():
    headless = "--headless" in sys.argv
    use_server = "--no-server" not in sys.argv

    print("Starting Brochure Editor UI Analysis...")
    print(f"Mode: {'Headless' if headless else 'Visual'}")
    print(f"Server: {'Enabled' if use_server else 'Disabled'}")

    server = None
    if use_server:
        server = ServerManager()
        server.start()
        atexit.register(server.stop)

    analyzer = BrochureEditorAnalyzer(headless=headless)
    scores = analyzer.run_analysis()

    if server:
        server.stop()

    if scores:
        sys.exit(0 if scores["pass_rate"] >= 60 else 1)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
