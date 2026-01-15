"""
Copy demo house images to frontend directory
"""
import shutil
import os
from pathlib import Path

source_dir = Path(r"C:\Users\billm\Desktop\house photos claude SM")
dest_dir = Path(r"C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10\frontend\demo_properties")

# Create destination directory
dest_dir.mkdir(parents=True, exist_ok=True)

# Copy all images
for img in source_dir.glob("*"):
    if img.is_file():
        shutil.copy2(img, dest_dir / img.name)
        print(f"Copied: {img.name}")

print(f"\n✓ All images copied to {dest_dir}")
