"""Screenshot the 2026 palettes test page"""
import sys, io, time
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--window-size=1920,2000")
options.add_argument("--disable-gpu")
options.add_experimental_option('excludeSwitches', ['enable-logging'])

driver = webdriver.Chrome(options=options)

# Open the test page
test_path = Path("C:/BrochureAndSocialMedia/test_2026_palettes.html")
driver.get(f"file:///{test_path}")
time.sleep(2)

# Take full page screenshot
driver.save_screenshot("screenshots/auto_brochure/2026_palettes.png")
print("Saved: screenshots/auto_brochure/2026_palettes.png")

driver.quit()
