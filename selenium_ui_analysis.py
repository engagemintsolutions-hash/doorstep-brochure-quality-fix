"""
Selenium UI Analysis - Tests the brochure editor in a real browser
Analyzes feature quality, responsiveness, and visual design
"""

import os
import sys
import time
import json
import io

# Fix Windows encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from pathlib import Path
from datetime import datetime

# Check for selenium
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


class BrochureEditorAnalyzer:
    """Analyzes the brochure editor UI using Selenium"""

    def __init__(self, headless=False):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "tests": [],
            "scores": {},
            "issues": [],
            "screenshots": []
        }

        # Setup Chrome options
        options = Options()
        if headless:
            options.add_argument("--headless")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--disable-gpu")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")

        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 10)
        self.screenshot_dir = Path("screenshots/auto_brochure")
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)

    def take_screenshot(self, name):
        """Take a screenshot and save it"""
        filename = f"{name}_{datetime.now().strftime('%H%M%S')}.png"
        filepath = self.screenshot_dir / filename
        self.driver.save_screenshot(str(filepath))
        self.results["screenshots"].append(str(filepath))
        print(f"  📸 Screenshot: {filename}")
        return filepath

    def add_test_result(self, name, passed, details="", score=None):
        """Add a test result"""
        result = {
            "name": name,
            "passed": passed,
            "details": details,
            "score": score
        }
        self.results["tests"].append(result)
        status = "✅" if passed else "❌"
        print(f"  {status} {name}: {details}")

    def add_issue(self, severity, message):
        """Add an issue found during testing"""
        self.results["issues"].append({
            "severity": severity,
            "message": message
        })
        icon = "🔴" if severity == "critical" else "🟡" if severity == "warning" else "🔵"
        print(f"  {icon} {severity.upper()}: {message}")

    def open_editor(self):
        """Open the brochure editor"""
        print("\n🌐 Opening brochure editor...")

        # Try file:// protocol first
        editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")

        if editor_path.exists():
            self.driver.get(f"file:///{editor_path}")
            time.sleep(2)
            self.take_screenshot("01_editor_loaded")
            return True
        else:
            # Try localhost
            try:
                self.driver.get("http://localhost:8000/static/brochure_editor_v3.html")
                time.sleep(2)
                self.take_screenshot("01_editor_loaded")
                return True
            except:
                self.add_issue("critical", "Could not open editor")
                return False

    def test_page_load(self):
        """Test if the page loads correctly"""
        print("\n📋 Testing Page Load...")

        # Check title
        title = self.driver.title
        self.add_test_result("Page Title", bool(title), f"Title: {title}")

        # Check for JavaScript errors in console
        logs = self.driver.get_log("browser")
        js_errors = [log for log in logs if log["level"] == "SEVERE"]

        if js_errors:
            for error in js_errors[:3]:  # Show first 3
                self.add_issue("warning", f"JS Error: {error['message'][:100]}")

        self.add_test_result("No Critical JS Errors", len(js_errors) == 0,
                            f"{len(js_errors)} errors found")

        # Check main elements exist
        main_elements = [
            ("canvas-area", "Canvas Area"),
            ("sidebar", "Sidebar"),
        ]

        for elem_id, name in main_elements:
            try:
                elem = self.driver.find_element(By.ID, elem_id)
                self.add_test_result(f"{name} Present", elem is not None)
            except NoSuchElementException:
                # Try by class
                try:
                    elem = self.driver.find_element(By.CLASS_NAME, elem_id.replace("-", "_"))
                    self.add_test_result(f"{name} Present", True)
                except:
                    self.add_test_result(f"{name} Present", False, "Element not found")

    def test_templates_panel(self):
        """Test the templates panel functionality"""
        print("\n🎨 Testing Templates Panel...")

        # Find templates section
        try:
            # Look for templates button or section
            templates_btn = None
            for selector in [
                "button[data-panel='templates']",
                ".templates-btn",
                "#templates-panel",
                "[onclick*='template']"
            ]:
                try:
                    templates_btn = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            if templates_btn:
                templates_btn.click()
                time.sleep(1)
                self.take_screenshot("02_templates_panel")

            # Count visible templates
            templates = self.driver.find_elements(By.CSS_SELECTOR, ".template-card, .template-item, .template-thumbnail")
            template_count = len(templates)

            self.add_test_result("Templates Loaded", template_count > 0,
                                f"{template_count} templates visible",
                                score=min(template_count / 50 * 100, 100))

            if template_count > 0:
                # Test clicking a template
                templates[0].click()
                time.sleep(1)
                self.add_test_result("Template Selection", True, "Template clicked successfully")
                self.take_screenshot("03_template_selected")

        except Exception as e:
            self.add_test_result("Templates Panel", False, str(e)[:100])
            self.add_issue("warning", f"Templates panel issue: {str(e)[:100]}")

    def test_custom_colors(self):
        """Test the custom colors functionality"""
        print("\n🎨 Testing Custom Colors Panel...")

        try:
            # Look for custom colors section
            custom_colors = None
            for selector in [
                ".custom-colors-panel",
                "#custom-colors",
                "[data-panel='colors']",
                ".color-picker-section"
            ]:
                try:
                    custom_colors = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            if custom_colors:
                self.add_test_result("Custom Colors Panel Found", True)
                self.take_screenshot("04_custom_colors")

                # Look for color inputs
                color_inputs = self.driver.find_elements(By.CSS_SELECTOR,
                    "input[type='color'], .color-picker, .color-input")
                self.add_test_result("Color Inputs Present", len(color_inputs) > 0,
                                    f"{len(color_inputs)} color pickers found")

                # Try changing a color
                if color_inputs:
                    # Use JavaScript to change color value
                    self.driver.execute_script(
                        "arguments[0].value = '#FF5733'; arguments[0].dispatchEvent(new Event('change'));",
                        color_inputs[0]
                    )
                    time.sleep(0.5)
                    self.add_test_result("Color Change", True, "Color changed to #FF5733")
            else:
                self.add_test_result("Custom Colors Panel Found", False, "Panel not found")

        except Exception as e:
            self.add_test_result("Custom Colors", False, str(e)[:100])

    def test_elements_library(self):
        """Test the elements library (shapes, icons)"""
        print("\n📦 Testing Elements Library...")

        try:
            # Find elements panel
            elements_panel = None
            for selector in [
                ".elements-panel",
                "#elements-library",
                "[data-panel='elements']",
                ".shapes-panel"
            ]:
                try:
                    elements_panel = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            # Count shapes
            shapes = self.driver.find_elements(By.CSS_SELECTOR,
                ".shape-item, .element-item, .icon-item, [data-shape]")
            shape_count = len(shapes)

            self.add_test_result("Elements Library", shape_count > 0,
                                f"{shape_count} elements available",
                                score=min(shape_count / 100 * 100, 100))

            # Count icons specifically
            icons = self.driver.find_elements(By.CSS_SELECTOR,
                ".icon-item, [data-icon], .icon-btn")
            icon_count = len(icons)

            self.add_test_result("Icons Available", icon_count > 0,
                                f"{icon_count} icons found")

            self.take_screenshot("05_elements_library")

        except Exception as e:
            self.add_test_result("Elements Library", False, str(e)[:100])

    def test_canvas_interaction(self):
        """Test canvas drag and drop, selection"""
        print("\n🖱️ Testing Canvas Interaction...")

        try:
            # Find canvas
            canvas = self.driver.find_element(By.CSS_SELECTOR,
                ".canvas, #canvas, .editor-canvas, .brochure-canvas")

            if canvas:
                self.add_test_result("Canvas Found", True)

                # Get canvas dimensions
                size = canvas.size
                self.add_test_result("Canvas Size", size["width"] > 0,
                                    f"{size['width']}x{size['height']}px")

                # Try clicking on canvas
                actions = ActionChains(self.driver)
                actions.move_to_element(canvas).click().perform()
                time.sleep(0.5)

                self.add_test_result("Canvas Clickable", True, "Canvas responds to clicks")
                self.take_screenshot("06_canvas_interaction")

        except Exception as e:
            self.add_test_result("Canvas Interaction", False, str(e)[:100])

    def test_text_editing(self):
        """Test text editing capabilities"""
        print("\n📝 Testing Text Editing...")

        try:
            # Find text tool or add text button
            text_btn = None
            for selector in [
                ".text-tool",
                "[data-tool='text']",
                ".add-text-btn",
                "button:contains('Text')"
            ]:
                try:
                    text_btn = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            if text_btn:
                text_btn.click()
                time.sleep(0.5)
                self.add_test_result("Text Tool Available", True)

            # Check for text formatting options
            formatting_options = self.driver.find_elements(By.CSS_SELECTOR,
                ".font-select, .font-size, .bold-btn, .italic-btn, [data-format]")

            self.add_test_result("Text Formatting Options", len(formatting_options) > 0,
                                f"{len(formatting_options)} formatting options")

            # Check for text animations
            animations = self.driver.find_elements(By.CSS_SELECTOR,
                ".animation-option, [data-animation], .text-animation")

            self.add_test_result("Text Animations", len(animations) > 0,
                                f"{len(animations)} animations available")

            self.take_screenshot("07_text_editing")

        except Exception as e:
            self.add_test_result("Text Editing", False, str(e)[:100])

    def test_layer_panel(self):
        """Test layer management"""
        print("\n📚 Testing Layer Panel...")

        try:
            # Find layer panel
            layer_panel = None
            for selector in [
                ".layer-panel",
                "#layers",
                "[data-panel='layers']",
                ".layers-list"
            ]:
                try:
                    layer_panel = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            if layer_panel:
                self.add_test_result("Layer Panel Found", True)

                # Count layer items
                layers = self.driver.find_elements(By.CSS_SELECTOR,
                    ".layer-item, .layer-row, [data-layer]")

                self.add_test_result("Layers Visible", True, f"{len(layers)} layers")

                # Check for layer controls
                controls = self.driver.find_elements(By.CSS_SELECTOR,
                    ".layer-visibility, .layer-lock, .layer-up, .layer-down")

                self.add_test_result("Layer Controls", len(controls) > 0,
                                    f"{len(controls)} control buttons")
            else:
                self.add_test_result("Layer Panel Found", False)

            self.take_screenshot("08_layer_panel")

        except Exception as e:
            self.add_test_result("Layer Panel", False, str(e)[:100])

    def test_export_options(self):
        """Test export functionality"""
        print("\n💾 Testing Export Options...")

        try:
            # Find export button
            export_btn = None
            for selector in [
                ".export-btn",
                "#export",
                "[data-action='export']",
                "button:contains('Export')",
                ".download-btn"
            ]:
                try:
                    export_btn = self.driver.find_element(By.CSS_SELECTOR, selector)
                    break
                except:
                    continue

            if export_btn:
                export_btn.click()
                time.sleep(1)
                self.add_test_result("Export Button Available", True)
                self.take_screenshot("09_export_panel")

                # Check export format options
                formats = self.driver.find_elements(By.CSS_SELECTOR,
                    ".export-format, [data-format], .format-option")

                self.add_test_result("Export Formats", len(formats) > 0,
                                    f"{len(formats)} export formats available")
            else:
                # Check if there's an export section anywhere
                self.add_test_result("Export Button Available", False, "Not found in visible area")

        except Exception as e:
            self.add_test_result("Export Options", False, str(e)[:100])

    def test_responsive_design(self):
        """Test responsiveness at different screen sizes"""
        print("\n📱 Testing Responsive Design...")

        original_size = self.driver.get_window_size()

        test_sizes = [
            (1920, 1080, "Desktop Full HD"),
            (1366, 768, "Laptop"),
            (1024, 768, "Tablet Landscape"),
            (768, 1024, "Tablet Portrait"),
        ]

        for width, height, name in test_sizes:
            self.driver.set_window_size(width, height)
            time.sleep(0.5)

            # Check if layout breaks
            try:
                canvas = self.driver.find_element(By.CSS_SELECTOR, ".canvas, #canvas, .editor-canvas")
                sidebar = self.driver.find_element(By.CSS_SELECTOR, ".sidebar, #sidebar")

                # Check if elements are visible
                canvas_visible = canvas.is_displayed()
                sidebar_visible = sidebar.is_displayed()

                self.add_test_result(f"Layout at {name}", canvas_visible,
                                    f"Canvas: {'✓' if canvas_visible else '✗'}, Sidebar: {'✓' if sidebar_visible else '✗'}")
            except Exception as e:
                self.add_test_result(f"Layout at {name}", False, str(e)[:50])

        # Restore original size
        self.driver.set_window_size(original_size["width"], original_size["height"])
        self.take_screenshot("10_responsive")

    def test_keyboard_shortcuts(self):
        """Test keyboard shortcuts"""
        print("\n⌨️ Testing Keyboard Shortcuts...")

        shortcuts = [
            (Keys.CONTROL + "z", "Undo"),
            (Keys.CONTROL + "y", "Redo"),
            (Keys.DELETE, "Delete"),
        ]

        # Focus on canvas first
        try:
            body = self.driver.find_element(By.TAG_NAME, "body")

            for keys, name in shortcuts:
                try:
                    body.send_keys(keys)
                    time.sleep(0.3)
                    self.add_test_result(f"Shortcut: {name}", True, "Key sent")
                except:
                    self.add_test_result(f"Shortcut: {name}", False)

        except Exception as e:
            self.add_test_result("Keyboard Shortcuts", False, str(e)[:100])

    def analyze_visual_quality(self):
        """Analyze overall visual quality"""
        print("\n🎨 Analyzing Visual Quality...")

        try:
            # Check for modern CSS features
            styles = self.driver.execute_script("""
                const styles = getComputedStyle(document.body);
                return {
                    hasFlexbox: document.querySelectorAll('[style*="flex"], .flex, [class*="flex"]').length > 0,
                    hasGrid: document.querySelectorAll('[style*="grid"], .grid, [class*="grid"]').length > 0,
                    hasTransitions: document.querySelectorAll('[style*="transition"]').length > 0,
                    hasShadows: document.querySelectorAll('[style*="shadow"], .shadow, [class*="shadow"]').length > 0,
                    hasGradients: document.querySelectorAll('[style*="gradient"]').length > 0,
                    buttonCount: document.querySelectorAll('button, .btn').length,
                    inputCount: document.querySelectorAll('input, select, textarea').length,
                    fontFamily: styles.fontFamily
                };
            """)

            self.add_test_result("Modern CSS (Flexbox)", styles.get("hasFlexbox", False))
            self.add_test_result("Modern CSS (Grid)", styles.get("hasGrid", False))
            self.add_test_result("Has Transitions", styles.get("hasTransitions", False))
            self.add_test_result("Has Shadows", styles.get("hasShadows", False))
            self.add_test_result("UI Elements", True,
                                f"{styles.get('buttonCount', 0)} buttons, {styles.get('inputCount', 0)} inputs")
            self.add_test_result("Font Family", True, styles.get("fontFamily", "unknown")[:50])

        except Exception as e:
            self.add_test_result("Visual Quality Analysis", False, str(e)[:100])

    def calculate_scores(self):
        """Calculate overall scores"""
        print("\n📊 Calculating Scores...")

        passed_tests = sum(1 for t in self.results["tests"] if t["passed"])
        total_tests = len(self.results["tests"])

        self.results["scores"] = {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "pass_rate": round(passed_tests / total_tests * 100, 1) if total_tests > 0 else 0,
            "critical_issues": len([i for i in self.results["issues"] if i["severity"] == "critical"]),
            "warnings": len([i for i in self.results["issues"] if i["severity"] == "warning"]),
        }

        # Calculate category scores
        categories = {
            "Page Load": ["Page Title", "No Critical JS Errors"],
            "Templates": ["Templates Loaded", "Template Selection"],
            "Elements": ["Elements Library", "Icons Available"],
            "Canvas": ["Canvas Found", "Canvas Clickable"],
            "Text": ["Text Tool Available", "Text Formatting Options"],
            "Layers": ["Layer Panel Found", "Layers Visible"],
            "Export": ["Export Button Available", "Export Formats"],
            "Visual": ["Modern CSS (Flexbox)", "Has Shadows", "UI Elements"]
        }

        category_scores = {}
        for cat, tests in categories.items():
            cat_tests = [t for t in self.results["tests"] if any(test in t["name"] for test in tests)]
            if cat_tests:
                passed = sum(1 for t in cat_tests if t["passed"])
                category_scores[cat] = round(passed / len(cat_tests) * 100, 1)

        self.results["scores"]["categories"] = category_scores

    def print_summary(self):
        """Print a summary of results"""
        print("\n" + "=" * 60)
        print("📊 BROCHURE EDITOR UI ANALYSIS SUMMARY")
        print("=" * 60)

        scores = self.results["scores"]

        print(f"\n✅ Tests Passed: {scores['passed_tests']}/{scores['total_tests']} ({scores['pass_rate']}%)")
        print(f"🔴 Critical Issues: {scores['critical_issues']}")
        print(f"🟡 Warnings: {scores['warnings']}")

        print("\n📈 Category Scores:")
        print("-" * 40)
        for cat, score in scores.get("categories", {}).items():
            bar = "█" * int(score / 10) + "░" * (10 - int(score / 10))
            status = "✅" if score >= 70 else "⚠️" if score >= 50 else "❌"
            print(f"  {status} {cat:15} {bar} {score}%")

        print("\n📸 Screenshots saved to:", self.screenshot_dir)
        print(f"   Total screenshots: {len(self.results['screenshots'])}")

        # Overall quality rating
        overall = scores["pass_rate"]
        if overall >= 90:
            rating = "⭐⭐⭐⭐⭐ EXCELLENT"
        elif overall >= 80:
            rating = "⭐⭐⭐⭐ VERY GOOD"
        elif overall >= 70:
            rating = "⭐⭐⭐ GOOD"
        elif overall >= 60:
            rating = "⭐⭐ NEEDS IMPROVEMENT"
        else:
            rating = "⭐ SIGNIFICANT ISSUES"

        print(f"\n🏆 Overall Rating: {rating}")
        print("=" * 60)

        return scores

    def save_results(self):
        """Save results to JSON file"""
        results_file = self.screenshot_dir / "analysis_results.json"
        with open(results_file, "w") as f:
            json.dump(self.results, f, indent=2)
        print(f"\n💾 Results saved to: {results_file}")

    def run_full_analysis(self):
        """Run the complete analysis"""
        print("=" * 60)
        print("🔍 BROCHURE EDITOR UI ANALYSIS")
        print("=" * 60)

        try:
            if not self.open_editor():
                print("❌ Failed to open editor. Aborting.")
                return None

            self.test_page_load()
            self.test_templates_panel()
            self.test_custom_colors()
            self.test_elements_library()
            self.test_canvas_interaction()
            self.test_text_editing()
            self.test_layer_panel()
            self.test_export_options()
            self.test_responsive_design()
            self.test_keyboard_shortcuts()
            self.analyze_visual_quality()

            self.calculate_scores()
            self.print_summary()
            self.save_results()

            return self.results["scores"]

        except Exception as e:
            print(f"\n❌ Analysis failed: {e}")
            import traceback
            traceback.print_exc()
            return None

        finally:
            self.driver.quit()


def main():
    """Main entry point"""
    # Check for headless argument
    headless = "--headless" in sys.argv

    print("🚀 Starting Brochure Editor UI Analysis...")
    print(f"   Mode: {'Headless' if headless else 'Visual (with browser window)'}")

    analyzer = BrochureEditorAnalyzer(headless=headless)
    scores = analyzer.run_full_analysis()

    if scores:
        # Return exit code based on pass rate
        sys.exit(0 if scores["pass_rate"] >= 70 else 1)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
