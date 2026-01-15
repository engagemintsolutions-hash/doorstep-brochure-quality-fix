"""
Extract and list ALL templates from the mega template library
"""

import json
import re
from pathlib import Path

# Read the JavaScript file
js_file = Path("frontend/template_mega_library.js")
content = js_file.read_text(encoding='utf-8')

# Extract COLOR_SCHEMES
color_schemes_match = re.search(r'const COLOR_SCHEMES = \{([\s\S]*?)\};', content)
color_schemes_text = color_schemes_match.group(1) if color_schemes_match else ""

# Parse color schemes
color_schemes = {}
scheme_pattern = r"(\w+):\s*\{\s*name:\s*'([^']+)'[^}]+\}"
for match in re.finditer(scheme_pattern, color_schemes_text):
    scheme_id = match.group(1)
    scheme_name = match.group(2)
    color_schemes[scheme_id] = scheme_name

# Extract BASE_TEMPLATES
base_templates_match = re.search(r'const BASE_TEMPLATES = \{([\s\S]*?)\n    \};', content)
base_templates_text = base_templates_match.group(1) if base_templates_match else ""

# Parse base templates
base_templates = {}
template_pattern = r"(\w+):\s*\{\s*name:\s*'([^']+)'[^}]+category:\s*'([^']+)'"
for match in re.finditer(template_pattern, base_templates_text):
    template_id = match.group(1)
    template_name = match.group(2)
    category = match.group(3)
    base_templates[template_id] = {"name": template_name, "category": category}

print("=" * 80)
print("COMPLETE TEMPLATE EXTRACTION FROM template_mega_library.js")
print("=" * 80)

print(f"\n{'='*80}")
print("COLOR SCHEMES ({} total)".format(len(color_schemes)))
print("=" * 80)

for i, (scheme_id, scheme_name) in enumerate(color_schemes.items(), 1):
    print(f"{i:2}. {scheme_id:25} -> {scheme_name}")

print(f"\n{'='*80}")
print("BASE TEMPLATES ({} total)".format(len(base_templates)))
print("=" * 80)

categories = {}
for tmpl_id, tmpl_data in base_templates.items():
    cat = tmpl_data['category']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append((tmpl_id, tmpl_data['name']))

for cat, templates in categories.items():
    print(f"\n--- {cat.upper().replace('_', ' ')} ({len(templates)}) ---")
    for tmpl_id, tmpl_name in templates:
        print(f"  - {tmpl_id:30} : {tmpl_name}")

print(f"\n{'='*80}")
print("TOTAL TEMPLATE COMBINATIONS")
print("=" * 80)

total = len(base_templates) * len(color_schemes)
print(f"Base Templates:  {len(base_templates)}")
print(f"Color Schemes:   {len(color_schemes)}")
print(f"Total Generated: {len(base_templates)} x {len(color_schemes)} = {total}")

print(f"\n{'='*80}")
print("ALL TEMPLATE COMBINATIONS (first 100 of {})".format(total))
print("=" * 80)

count = 0
for tmpl_id, tmpl_data in base_templates.items():
    for scheme_id, scheme_name in color_schemes.items():
        count += 1
        if count <= 100:
            print(f"{count:4}. {tmpl_data['name']} - {scheme_name}")
        elif count == 101:
            print(f"... and {total - 100} more templates ...")
            break
    if count > 100:
        break

print(f"\n{'='*80}")
print("SUMMARY")
print("=" * 80)
print(f"""
VERIFIED CONTENTS:
- {len(color_schemes)} unique color schemes
- {len(base_templates)} base template designs
- {total} total template combinations

CATEGORIES:
""")
for cat, templates in categories.items():
    print(f"  - {cat}: {len(templates)} templates")

print("""
The template system generates ALL combinations dynamically:
Each of the {} base templates is available in each of the {} color schemes.
""".format(len(base_templates), len(color_schemes)))
