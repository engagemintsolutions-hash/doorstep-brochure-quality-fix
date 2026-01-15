"""Download property images for 28 Brockswood Lane, AL8 7BG testing"""
import requests
import os

# Directory to save images
output_dir = "test_images"
os.makedirs(output_dir, exist_ok=True)

# Image URLs from Rightmove for 28 Brockswood Lane
image_urls = [
    ("brockswood_exterior.jpg", "https://media.rightmove.co.uk/24k/23441/25313817/23441_WGC120775_IMG_00_0000.JPG"),
]

# Additional UK property images from Unsplash (free to use)
unsplash_urls = [
    ("brockswood_living.jpg", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"),  # Living room
    ("brockswood_kitchen.jpg", "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"),  # Kitchen
    ("brockswood_bedroom.jpg", "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800"),  # Bedroom
    ("brockswood_bathroom.jpg", "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800"),  # Bathroom
    ("brockswood_garden.jpg", "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800"),  # Garden
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

print("Downloading property images for 28 Brockswood Lane testing...")

# Try Rightmove images first
for filename, url in image_urls:
    filepath = os.path.join(output_dir, filename)
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded: {filename} ({len(response.content)} bytes)")
        else:
            print(f"Failed to download {filename}: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

# Download Unsplash images
for filename, url in unsplash_urls:
    filepath = os.path.join(output_dir, filename)
    try:
        response = requests.get(url, headers=headers, timeout=30)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded: {filename} ({len(response.content)} bytes)")
        else:
            print(f"Failed to download {filename}: HTTP {response.status_code}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

print("\nDone! Images saved to test_images/")
