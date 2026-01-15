# -*- coding: utf-8 -*-
"""Quick screenshot test"""
import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--window-size=1920,1080")

screenshots_dir = r"C:\BrochureAndSocialMedia\screenshots"
SESSION_ID = "20f3e0ae6a9649bab241aaf47a1fabd4"

driver = webdriver.Chrome(options=chrome_options)

try:
    print("Loading editor...")
    driver.get(f"http://127.0.0.1:8000/static/brochure_editor_v3.html?session={SESSION_ID}")
    time.sleep(2)

    # Screenshot 1: Loading state with skip button
    driver.save_screenshot(os.path.join(screenshots_dir, "test_01_loading.png"))
    print("Saved: test_01_loading.png")

    # Click skip button
    try:
        skip_btn = driver.find_element(By.ID, "skipGenerationBtn")
        if skip_btn:
            print("Found skip button, clicking...")
            skip_btn.click()
            time.sleep(2)
    except Exception as e:
        print(f"Skip button: {e}")

    # Screenshot 2: After skip
    driver.save_screenshot(os.path.join(screenshots_dir, "test_02_editor.png"))
    print("Saved: test_02_editor.png")

    # Check what loaded
    pages = driver.find_elements(By.CSS_SELECTOR, ".brochure-page")
    images = driver.find_elements(By.CSS_SELECTOR, ".brochure-page img")
    print(f"Pages: {len(pages)}, Images: {len(images)}")

    # Click an image if available
    if images:
        print("Clicking image...")
        driver.execute_script("arguments[0].click();", images[0])
        time.sleep(1)
        driver.save_screenshot(os.path.join(screenshots_dir, "test_03_image_panel.png"))
        print("Saved: test_03_image_panel.png")

    print("Done!")

except Exception as e:
    print(f"Error: {e}")
    driver.save_screenshot(os.path.join(screenshots_dir, "test_error.png"))

finally:
    driver.quit()
