"""Download sample property images for testing"""
import requests
import os

OUTPUT_DIR = r"C:\BrochureAndSocialMedia\test_images"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Unsplash images (free to use)
images = [
    ("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", "exterior1.jpg"),
    ("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", "exterior2.jpg"),
    ("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", "living_room.jpg"),
    ("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", "kitchen1.jpg"),
    ("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800", "kitchen2.jpg"),
    ("https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800", "bedroom1.jpg"),
    ("https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800", "bedroom2.jpg"),
    ("https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800", "bathroom.jpg"),
    ("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "garden.jpg"),
    ("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800", "exterior3.jpg"),
]

print(f"Downloading {len(images)} images to {OUTPUT_DIR}...")

for url, filename in images:
    filepath = os.path.join(OUTPUT_DIR, filename)
    print(f"  Downloading {filename}...", end=" ")
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(resp.content)
        print(f"OK ({len(resp.content)//1024}KB)")
    except Exception as e:
        print(f"FAILED: {e}")

print("\nDone! Listing files:")
for f in os.listdir(OUTPUT_DIR):
    fpath = os.path.join(OUTPUT_DIR, f)
    size = os.path.getsize(fpath) // 1024
    print(f"  {f}: {size}KB")
