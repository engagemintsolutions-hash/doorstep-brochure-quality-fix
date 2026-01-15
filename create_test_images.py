"""Create simple test images for vision API testing"""
from PIL import Image, ImageDraw, ImageFont
import os

# Create test images directory
os.makedirs("test_images", exist_ok=True)

# Define test images
test_images = [
    ("kitchen", "Modern Kitchen", (255, 220, 220)),
    ("bedroom", "Master Bedroom", (220, 220, 255)),
    ("bathroom", "Bathroom", (220, 255, 255)),
    ("living_room", "Living Room", (255, 255, 220)),
    ("exterior", "Property Exterior", (220, 255, 220))
]

for filename, label, color in test_images:
    # Create 800x600 image
    img = Image.new('RGB', (800, 600), color=color)
    draw = ImageDraw.Draw(img)

    # Add label text in center
    try:
        font = ImageFont.truetype("arial.ttf", 60)
    except:
        font = ImageFont.load_default()

    # Get text bounding box
    bbox = draw.textbbox((0, 0), label, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # Center text
    x = (800 - text_width) // 2
    y = (600 - text_height) // 2

    draw.text((x, y), label, fill=(0, 0, 0), font=font)

    # Save image
    img.save(f"test_images/{filename}.jpg", quality=85)
    print(f"Created test_images/{filename}.jpg")

print(f"\nCreated {len(test_images)} test images")
