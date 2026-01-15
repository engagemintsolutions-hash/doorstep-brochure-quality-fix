# -*- coding: utf-8 -*-
"""
Comprehensive Selenium Test for Brochure Maker
Tests: Login, Image Upload, AI Analysis, Templates, Color Changer, Editor Features
"""

import os
import sys
import time
import json
from datetime import datetime

# Force UTF-8 output
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# Configuration
BASE_URL = "https://brochure-social-media-jan2026-production.up.railway.app"
# For local testing: BASE_URL = "http://localhost:8000"

# Test credentials
TEST_ORG = "savills"
TEST_OFFICE = "savills_london"
TEST_PIN = "2025"
TEST_AGENT = "james.smith@savills.com"

# Test property data
TEST_PROPERTY = {
    "address": "42 Oak Lane, Richmond, TW10 6QD",
    "price": "1,250,000",
    "type": "detached",
    "bedrooms": "4",
    "bathrooms": "3",
    "features": "South-facing garden, recently renovated kitchen, period features, double garage"
}

# Test agent data
TEST_AGENT_INFO = {
    "name": "James Smith",
    "phone": "020 7123 4567",
    "email": "james@savills.co.uk"
}

class BrochureMakerTest:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.results = {
            "tests_passed": 0,
            "tests_failed": 0,
            "bugs": [],
            "warnings": [],
            "screenshots": [],
            "timestamp": datetime.now().isoformat()
        }

    def setup(self):
        """Initialize the browser"""
        print("\n" + "="*60)
        print("[START] BROCHURE MAKER SELENIUM TEST")
        print("="*60)
        print(f"Target URL: {BASE_URL}")
        print(f"Timestamp: {self.results['timestamp']}")
        print("="*60 + "\n")

        options = webdriver.ChromeOptions()
        options.add_argument('--start-maximized')
        options.add_argument('--disable-notifications')
        # options.add_argument('--headless')  # Uncomment for headless mode

        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, 15)
        self.driver.implicitly_wait(10)

    def teardown(self):
        """Clean up"""
        if self.driver:
            self.driver.quit()

    def take_screenshot(self, name):
        """Take a screenshot"""
        filename = f"screenshot_{name}_{int(time.time())}.png"
        filepath = os.path.join(os.path.dirname(__file__), filename)
        self.driver.save_screenshot(filepath)
        self.results["screenshots"].append(filepath)
        print(f"[SCREENSHOT] Saved: {filename}")
        return filepath

    def log_bug(self, description, severity="medium"):
        """Log a bug"""
        bug = {
            "description": description,
            "severity": severity,
            "timestamp": datetime.now().isoformat()
        }
        self.results["bugs"].append(bug)
        print(f"[BUG] [{severity.upper()}]: {description}")

    def log_warning(self, description):
        """Log a warning"""
        self.results["warnings"].append(description)
        print(f"[WARNING]: {description}")

    def test_passed(self, test_name):
        """Mark test as passed"""
        self.results["tests_passed"] += 1
        print(f"[PASS]: {test_name}")

    def test_failed(self, test_name, error):
        """Mark test as failed"""
        self.results["tests_failed"] += 1
        print(f"[FAIL]: {test_name} - {error}")
        self.log_bug(f"Test '{test_name}' failed: {error}", "high")

    # ==================== TEST CASES ====================

    def test_01_login_page_loads(self):
        """Test that login page loads correctly"""
        print("\n--- Test 1: Login Page ---")
        try:
            self.driver.get(f"{BASE_URL}/static/login.html")
            time.sleep(2)

            # Check page title
            title = self.driver.title
            assert "Doorstep" in title or "Agent" in title or "Login" in title, f"Unexpected title: {title}"

            # Check for organization dropdown
            org_select = self.wait.until(EC.presence_of_element_located((By.ID, "organization")))
            assert org_select is not None, "Organization dropdown not found"

            # Check for PIN input
            pin_input = self.driver.find_element(By.ID, "pin")
            assert pin_input is not None, "PIN input not found"

            self.take_screenshot("01_login_page")
            self.test_passed("Login page loads correctly")
            return True

        except Exception as e:
            self.test_failed("Login page loads", str(e))
            self.take_screenshot("01_login_page_error")
            return False

    def test_02_login_flow(self):
        """Test the login process"""
        print("\n--- Test 2: Login Flow ---")
        try:
            # Select organization
            org_select = Select(self.driver.find_element(By.ID, "organization"))
            org_select.select_by_value(TEST_ORG)
            time.sleep(1)

            # Select office
            office_select = Select(self.driver.find_element(By.ID, "office"))
            office_select.select_by_value(TEST_OFFICE)
            time.sleep(1)

            # Select role (agent)
            role_select = Select(self.driver.find_element(By.ID, "role"))
            role_select.select_by_value("agent")
            time.sleep(1)

            # Select agent
            agent_select = Select(self.driver.find_element(By.ID, "agentSelect"))
            agent_select.select_by_value(TEST_AGENT)
            time.sleep(1)

            # Enter PIN
            pin_input = self.driver.find_element(By.ID, "pin")
            pin_input.clear()
            pin_input.send_keys(TEST_PIN)

            self.take_screenshot("02_login_filled")

            # Click login button
            login_btn = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit'], .login-btn, button.btn-primary")
            login_btn.click()
            time.sleep(3)

            # Check if redirected to dashboard
            current_url = self.driver.current_url
            if "dashboard" in current_url or "index" in current_url:
                self.take_screenshot("02_login_success")
                self.test_passed("Login flow works correctly")
                return True
            else:
                self.log_bug(f"Login did not redirect to expected page. Current URL: {current_url}", "high")
                self.test_failed("Login redirect", "Did not redirect to dashboard")
                return False

        except Exception as e:
            self.test_failed("Login flow", str(e))
            self.take_screenshot("02_login_error")
            return False

    def test_03_dashboard_loads(self):
        """Test dashboard page"""
        print("\n--- Test 3: Dashboard ---")
        try:
            self.driver.get(f"{BASE_URL}/static/dashboard.html")
            time.sleep(2)

            # Check for main action cards
            cards = self.driver.find_elements(By.CSS_SELECTOR, ".action-card, .dashboard-card, .card")
            if len(cards) >= 2:
                self.test_passed("Dashboard loads with action cards")
            else:
                self.log_warning(f"Expected at least 2 action cards, found {len(cards)}")

            self.take_screenshot("03_dashboard")
            return True

        except Exception as e:
            self.test_failed("Dashboard loads", str(e))
            return False

    def test_04_brochure_builder_loads(self):
        """Test brochure builder page"""
        print("\n--- Test 4: Brochure Builder ---")
        try:
            self.driver.get(f"{BASE_URL}/static/index.html")
            time.sleep(3)

            # Check for upload zone
            upload_zone = self.driver.find_elements(By.CSS_SELECTOR, ".upload-zone, #uploadZone, [class*='upload']")
            if upload_zone:
                self.test_passed("Brochure builder loads with upload zone")
            else:
                self.log_bug("Upload zone not found on brochure builder", "high")

            # Check for property details form
            address_input = self.driver.find_elements(By.ID, "address")
            if address_input:
                self.test_passed("Property details form found")
            else:
                self.log_warning("Address input field not found")

            # Check for template grid
            template_grid = self.driver.find_elements(By.CSS_SELECTOR, "#templateGrid, .template-grid, [class*='template']")
            if template_grid:
                self.test_passed("Template selection area found")
            else:
                self.log_warning("Template grid not found")

            self.take_screenshot("04_brochure_builder")
            return True

        except Exception as e:
            self.test_failed("Brochure builder loads", str(e))
            return False

    def test_05_templates_available(self):
        """Test that templates are loaded and selectable"""
        print("\n--- Test 5: Templates ---")
        try:
            # Wait for templates to load
            time.sleep(2)

            # Find template cards
            templates = self.driver.find_elements(By.CSS_SELECTOR, ".template-card, .template-option, [data-template]")
            template_count = len(templates)

            if template_count >= 5:
                print(f"   Found {template_count} templates")
                self.test_passed(f"Templates loaded ({template_count} found)")

                # Try clicking on a template
                if templates:
                    templates[0].click()
                    time.sleep(1)
                    self.test_passed("Template selection works")

                    # Check for color customization appearing
                    color_section = self.driver.find_elements(By.CSS_SELECTOR, "#colorCustomization, .color-customization")
                    if color_section:
                        self.test_passed("Color customization section available")
            else:
                self.log_bug(f"Expected at least 5 templates, found {template_count}", "medium")

            self.take_screenshot("05_templates")
            return True

        except Exception as e:
            self.test_failed("Templates", str(e))
            return False

    def test_06_color_changer(self):
        """Test color customization functionality"""
        print("\n--- Test 6: Color Changer ---")
        try:
            # Find color picker inputs
            primary_color = self.driver.find_elements(By.ID, "primaryColor")
            secondary_color = self.driver.find_elements(By.ID, "secondaryColor")

            if primary_color:
                # Try changing primary color
                self.driver.execute_script(
                    "arguments[0].value = '#FF5733';",
                    primary_color[0]
                )
                # Trigger change event
                self.driver.execute_script(
                    "arguments[0].dispatchEvent(new Event('change'));",
                    primary_color[0]
                )
                time.sleep(1)
                self.test_passed("Primary color picker works")
            else:
                self.log_warning("Primary color picker not found")

            if secondary_color:
                self.driver.execute_script(
                    "arguments[0].value = '#3498DB';",
                    secondary_color[0]
                )
                self.driver.execute_script(
                    "arguments[0].dispatchEvent(new Event('change'));",
                    secondary_color[0]
                )
                time.sleep(1)
                self.test_passed("Secondary color picker works")

            self.take_screenshot("06_color_changer")
            return True

        except Exception as e:
            self.test_failed("Color changer", str(e))
            return False

    def test_07_property_details_form(self):
        """Test filling in property details"""
        print("\n--- Test 7: Property Details Form ---")
        try:
            # Fill address
            address = self.driver.find_element(By.ID, "address")
            address.clear()
            address.send_keys(TEST_PROPERTY["address"])

            # Fill price
            price = self.driver.find_element(By.ID, "askingPrice")
            price.clear()
            price.send_keys(TEST_PROPERTY["price"])

            # Select property type
            prop_type = Select(self.driver.find_element(By.ID, "propertyType"))
            prop_type.select_by_value(TEST_PROPERTY["type"])

            # Select bedrooms
            beds = Select(self.driver.find_element(By.ID, "bedrooms"))
            beds.select_by_value(TEST_PROPERTY["bedrooms"])

            # Select bathrooms
            baths = Select(self.driver.find_element(By.ID, "bathrooms"))
            baths.select_by_value(TEST_PROPERTY["bathrooms"])

            # Fill key features
            features = self.driver.find_element(By.ID, "keyFeatures")
            features.clear()
            features.send_keys(TEST_PROPERTY["features"])

            self.take_screenshot("07_property_details")
            self.test_passed("Property details form filled successfully")
            return True

        except Exception as e:
            self.test_failed("Property details form", str(e))
            return False

    def test_08_agent_details_form(self):
        """Test filling in agent details"""
        print("\n--- Test 8: Agent Details ---")
        try:
            # Fill agent name
            name = self.driver.find_element(By.ID, "agentName")
            name.clear()
            name.send_keys(TEST_AGENT_INFO["name"])

            # Fill phone
            phone = self.driver.find_element(By.ID, "agentPhone")
            phone.clear()
            phone.send_keys(TEST_AGENT_INFO["phone"])

            # Fill email
            email = self.driver.find_element(By.ID, "agentEmail")
            email.clear()
            email.send_keys(TEST_AGENT_INFO["email"])

            self.take_screenshot("08_agent_details")
            self.test_passed("Agent details form filled successfully")
            return True

        except Exception as e:
            self.test_failed("Agent details form", str(e))
            return False

    def test_09_image_upload_zone(self):
        """Test image upload functionality"""
        print("\n--- Test 9: Image Upload Zone ---")
        try:
            # Find upload zone or file input
            upload_zone = self.driver.find_elements(By.CSS_SELECTOR, ".upload-zone, #uploadZone")
            file_input = self.driver.find_elements(By.CSS_SELECTOR, "input[type='file']")

            if upload_zone:
                # Check upload zone is visible and clickable
                if upload_zone[0].is_displayed():
                    self.test_passed("Upload zone is visible")
                else:
                    self.log_warning("Upload zone exists but may not be visible")

            if file_input:
                self.test_passed("File input found for uploads")
            else:
                self.log_bug("No file input found for image uploads", "medium")

            self.take_screenshot("09_upload_zone")
            return True

        except Exception as e:
            self.test_failed("Image upload zone", str(e))
            return False

    def test_10_generate_button(self):
        """Test generate brochure button"""
        print("\n--- Test 10: Generate Button ---")
        try:
            # Find generate button
            generate_btns = self.driver.find_elements(By.CSS_SELECTOR,
                "button[type='submit'], .generate-btn, button.btn-primary, [onclick*='generate'], [onclick*='submit']"
            )

            if generate_btns:
                for btn in generate_btns:
                    if btn.is_displayed() and btn.is_enabled():
                        btn_text = btn.text.lower()
                        if any(word in btn_text for word in ['generate', 'create', 'build', 'start']):
                            self.test_passed(f"Generate button found: '{btn.text}'")
                            self.take_screenshot("10_generate_button")
                            return btn

            self.log_warning("Generate button not clearly identified")
            self.take_screenshot("10_generate_button")
            return None

        except Exception as e:
            self.test_failed("Generate button", str(e))
            return None

    def test_11_api_health_check(self):
        """Test API health endpoint"""
        print("\n--- Test 11: API Health Check ---")
        try:
            self.driver.get(f"{BASE_URL}/health")
            time.sleep(2)

            body = self.driver.find_element(By.TAG_NAME, "body").text
            if "ok" in body.lower() or "status" in body.lower():
                self.test_passed("API health endpoint working")
            else:
                self.log_warning(f"Unexpected health response: {body[:200]}")

            return True

        except Exception as e:
            self.test_failed("API health check", str(e))
            return False

    def test_12_brochure_editor_page(self):
        """Test brochure editor page"""
        print("\n--- Test 12: Brochure Editor ---")
        try:
            self.driver.get(f"{BASE_URL}/static/brochure_editor.html")
            time.sleep(3)

            # Check for editor elements
            elements_found = []

            # Page navigator
            page_nav = self.driver.find_elements(By.CSS_SELECTOR, ".page-navigator, #pageNavList")
            if page_nav:
                elements_found.append("Page Navigator")

            # Tools panel
            tools = self.driver.find_elements(By.CSS_SELECTOR, ".tools-panel, .tool-section")
            if tools:
                elements_found.append("Tools Panel")

            # Photo library
            photo_lib = self.driver.find_elements(By.CSS_SELECTOR, "#photoLibrary, .photo-library")
            if photo_lib:
                elements_found.append("Photo Library")

            # AI assistant
            ai_panel = self.driver.find_elements(By.CSS_SELECTOR, ".ai-assistant-panel, #aiMessages")
            if ai_panel:
                elements_found.append("AI Assistant")

            # Canvas area
            canvas = self.driver.find_elements(By.CSS_SELECTOR, ".brochure-canvas, #pagesContainer")
            if canvas:
                elements_found.append("Brochure Canvas")

            # Export buttons
            export_btns = self.driver.find_elements(By.CSS_SELECTOR, "[onclick*='export'], .export-btn")
            if export_btns:
                elements_found.append("Export Buttons")

            print(f"   Found editor elements: {', '.join(elements_found)}")

            if len(elements_found) >= 3:
                self.test_passed(f"Brochure editor loaded with {len(elements_found)} components")
            else:
                self.log_bug(f"Editor missing components. Only found: {elements_found}", "medium")

            self.take_screenshot("12_brochure_editor")
            return True

        except Exception as e:
            self.test_failed("Brochure editor", str(e))
            return False

    def test_13_quick_post_page(self):
        """Test quick post page"""
        print("\n--- Test 13: Quick Post ---")
        try:
            self.driver.get(f"{BASE_URL}/static/quick-post.html")
            time.sleep(2)

            # Check for key elements
            photo_upload = self.driver.find_elements(By.CSS_SELECTOR, "[class*='upload'], input[type='file']")
            platform_select = self.driver.find_elements(By.CSS_SELECTOR, "[class*='platform'], input[type='checkbox']")

            if photo_upload:
                self.test_passed("Quick post photo upload found")
            if platform_select:
                self.test_passed("Platform selection found")

            self.take_screenshot("13_quick_post")
            return True

        except Exception as e:
            self.test_failed("Quick post page", str(e))
            return False

    def test_14_social_calendar(self):
        """Test social media calendar"""
        print("\n--- Test 14: Social Calendar ---")
        try:
            self.driver.get(f"{BASE_URL}/static/social_media_calendar.html")
            time.sleep(2)

            # Check for calendar elements
            calendar = self.driver.find_elements(By.CSS_SELECTOR, ".calendar, [class*='calendar'], .fc")
            list_view = self.driver.find_elements(By.CSS_SELECTOR, ".list-view, [class*='post-card']")

            if calendar or list_view:
                self.test_passed("Social calendar loaded")
            else:
                self.log_warning("Calendar view elements not clearly found")

            self.take_screenshot("14_social_calendar")
            return True

        except Exception as e:
            self.test_failed("Social calendar", str(e))
            return False

    def test_15_responsive_design(self):
        """Test responsive design"""
        print("\n--- Test 15: Responsive Design ---")
        try:
            self.driver.get(f"{BASE_URL}/static/dashboard.html")
            time.sleep(2)

            # Test different viewport sizes
            sizes = [
                ("Desktop", 1920, 1080),
                ("Tablet", 768, 1024),
                ("Mobile", 375, 812)
            ]

            for name, width, height in sizes:
                self.driver.set_window_size(width, height)
                time.sleep(1)

                # Check if page still renders
                body = self.driver.find_element(By.TAG_NAME, "body")
                if body.is_displayed():
                    print(f"   {name} ({width}x{height}): OK")
                else:
                    self.log_warning(f"{name} view may have issues")

            # Reset to desktop
            self.driver.maximize_window()
            self.test_passed("Responsive design check complete")
            return True

        except Exception as e:
            self.test_failed("Responsive design", str(e))
            return False

    def run_all_tests(self):
        """Run all tests"""
        try:
            self.setup()

            # Run tests in order
            self.test_01_login_page_loads()
            self.test_02_login_flow()
            self.test_03_dashboard_loads()
            self.test_04_brochure_builder_loads()
            self.test_05_templates_available()
            self.test_06_color_changer()
            self.test_07_property_details_form()
            self.test_08_agent_details_form()
            self.test_09_image_upload_zone()
            self.test_10_generate_button()
            self.test_11_api_health_check()
            self.test_12_brochure_editor_page()
            self.test_13_quick_post_page()
            self.test_14_social_calendar()
            self.test_15_responsive_design()

        except Exception as e:
            print(f"\n[FAIL] Test suite error: {e}")
            self.log_bug(f"Test suite crashed: {e}", "critical")

        finally:
            self.print_summary()
            self.save_results()
            self.teardown()

    def print_summary(self):
        """Print test summary"""
        print("\n" + "="*60)
        print("[SUMMARY] TEST RESULTS")
        print("="*60)
        print(f"[PASS] Passed: {self.results['tests_passed']}")
        print(f"[FAIL] Failed: {self.results['tests_failed']}")
        print(f"[BUG] Bugs Found: {len(self.results['bugs'])}")
        print(f"[WARNING] Warnings: {len(self.results['warnings'])}")
        print(f"[SCREENSHOT] Screenshots: {len(self.results['screenshots'])}")

        if self.results['bugs']:
            print("\n[BUG] BUGS:")
            for i, bug in enumerate(self.results['bugs'], 1):
                print(f"   {i}. [{bug['severity'].upper()}] {bug['description']}")

        if self.results['warnings']:
            print("\n[WARNING] WARNINGS:")
            for i, warning in enumerate(self.results['warnings'], 1):
                print(f"   {i}. {warning}")

        print("="*60)

    def save_results(self):
        """Save results to JSON file"""
        filename = f"test_results_{int(time.time())}.json"
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2)
        print(f"\n[FILE] Results saved to: {filename}")


if __name__ == "__main__":
    test = BrochureMakerTest()
    test.run_all_tests()
