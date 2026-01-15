"""
Take detailed screenshots of each UI panel with scrolling
"""

import sys
import io
import time
from pathlib import Path
from datetime import datetime

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--window-size=1920,1080")
options.add_argument("--disable-gpu")
options.add_experimental_option('excludeSwitches', ['enable-logging'])

driver = webdriver.Chrome(options=options)
screenshot_dir = Path("screenshots/auto_brochure/detailed")
screenshot_dir.mkdir(parents=True, exist_ok=True)

def screenshot(name):
    path = screenshot_dir / f"{name}.png"
    driver.save_screenshot(str(path))
    print(f"Saved: {path}")
    return path

def dismiss_modals():
    driver.execute_script("""
        document.querySelectorAll('.modal, .modal-overlay, [class*="modal"]').forEach(m => {
            m.style.display = 'none';
            m.remove();
        });
    """)

# Open editor
print("Opening editor...")
editor_path = Path("C:/BrochureAndSocialMedia/frontend/brochure_editor_v3.html")
driver.get(f"file:///{editor_path}")
time.sleep(2)

# Inject session data and dismiss modal
driver.execute_script("""
    sessionStorage.setItem('brochureSession', JSON.stringify({
        propertyData: { address: "Test Property", price: "500000" },
        images: [],
        template: 'modern'
    }));
    window.SKIP_SESSION_CHECK = true;
""")
dismiss_modals()
time.sleep(1)

screenshot("00_full_editor")

# Test each panel tab in detail
panels = [
    ("Layouts", "layouts"),
    ("Templates", "templates"),
    ("Elements", "elements"),
    ("Effects", "effects"),
    ("Layers", "layers")
]

for panel_name, panel_id in panels:
    print(f"\nTesting {panel_name} panel...")
    try:
        # Click the tab
        tab = driver.find_element(By.XPATH, f"//*[contains(text(), '{panel_name}')]")
        driver.execute_script("arguments[0].click();", tab)
        time.sleep(1)
        dismiss_modals()

        # Take screenshot
        screenshot(f"01_{panel_id}_panel")

        # Get panel content info
        info = driver.execute_script(f"""
            const panel = document.querySelector('[data-panel="{panel_id}"], .{panel_id}-panel, #{panel_id}');
            if (!panel) return {{ found: false }};

            return {{
                found: true,
                children: panel.children.length,
                buttons: panel.querySelectorAll('button, .btn').length,
                items: panel.querySelectorAll('.item, .card, .template-card, .shape-item, .icon-item, [data-template]').length,
                text: panel.innerText.substring(0, 500)
            }};
        """)

        if info.get('found'):
            print(f"  - Children: {info.get('children', 0)}")
            print(f"  - Buttons: {info.get('buttons', 0)}")
            print(f"  - Items: {info.get('items', 0)}")
        else:
            print(f"  - Panel container not found, checking visible content...")

            # Count visible items in the sidebar area
            counts = driver.execute_script("""
                return {
                    templateCards: document.querySelectorAll('.template-card, [data-template]').length,
                    shapes: document.querySelectorAll('.shape-item, [data-shape]').length,
                    icons: document.querySelectorAll('.icon-item, [data-icon]').length,
                    buttons: document.querySelectorAll('button').length,
                    selects: document.querySelectorAll('select').length,
                    sliders: document.querySelectorAll('input[type="range"]').length
                };
            """)
            print(f"  - Template cards: {counts['templateCards']}")
            print(f"  - Shapes: {counts['shapes']}")
            print(f"  - Icons: {counts['icons']}")

        # Scroll down in the panel if possible and take another screenshot
        driver.execute_script("""
            const scrollable = document.querySelector('.panel-content, .sidebar-content, [class*="scroll"]');
            if (scrollable) {
                scrollable.scrollTop = 300;
            }
        """)
        time.sleep(0.5)
        screenshot(f"02_{panel_id}_scrolled")

    except Exception as e:
        print(f"  Error: {e}")

# Special: Expand templates section and count
print("\n" + "="*60)
print("COUNTING ALL VISIBLE ELEMENTS")
print("="*60)

# Click templates and count
try:
    tab = driver.find_element(By.XPATH, "//*[contains(text(), 'Templates')]")
    driver.execute_script("arguments[0].click();", tab)
    time.sleep(1)
    dismiss_modals()

    counts = driver.execute_script("""
        return {
            // Templates
            templateCards: document.querySelectorAll('.template-card, .template-item, [data-template-id]').length,
            templateThumbs: document.querySelectorAll('.template-thumbnail').length,

            // Elements
            shapes: document.querySelectorAll('.shape-item, .shape-btn, [data-shape]').length,
            icons: document.querySelectorAll('.icon-item, .icon-btn, [data-icon]').length,

            // UI
            buttons: document.querySelectorAll('button').length,
            inputs: document.querySelectorAll('input').length,
            selects: document.querySelectorAll('select').length,
            svgs: document.querySelectorAll('svg').length,

            // Check for specific UI text
            hasTemplatesText: document.body.innerText.includes('Templates'),
            hasElementsText: document.body.innerText.includes('Elements'),
            hasShadowText: document.body.innerText.includes('Shadow'),
            hasLayersText: document.body.innerText.includes('Layers')
        };
    """)

    print(f"\nTemplate cards found: {counts['templateCards']}")
    print(f"Template thumbnails: {counts['templateThumbs']}")
    print(f"Shape items: {counts['shapes']}")
    print(f"Icon items: {counts['icons']}")
    print(f"Total buttons: {counts['buttons']}")
    print(f"Total inputs: {counts['inputs']}")
    print(f"Total selects: {counts['selects']}")
    print(f"Total SVGs: {counts['svgs']}")
    print(f"\nUI Text verification:")
    print(f"  - 'Templates' text: {counts['hasTemplatesText']}")
    print(f"  - 'Elements' text: {counts['hasElementsText']}")
    print(f"  - 'Shadow' text: {counts['hasShadowText']}")
    print(f"  - 'Layers' text: {counts['hasLayersText']}")

except Exception as e:
    print(f"Error: {e}")

# Take final overview screenshot
screenshot("99_final_overview")

driver.quit()
print(f"\n\nAll screenshots saved to: {screenshot_dir}")
