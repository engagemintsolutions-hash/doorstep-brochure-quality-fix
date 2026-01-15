"""
Mock vision provider for testing and demo.
"""
from typing import Dict, List
import logging
import re

logger = logging.getLogger(__name__)


class VisionMockClient:
    """
    Mock vision client that returns deterministic results based on filename.
    
    This allows for consistent testing and demo experiences without requiring
    real API credentials.
    """
    
    def __init__(self):
        """Initialize mock client."""
        logger.info("Initialized mock vision client")
    
    async def analyze_image(self, image_bytes: bytes, filename: str) -> Dict:
        """
        Analyze image with deterministic mock responses.
        
        Args:
            image_bytes: Raw image data (unused in mock)
            filename: Used to determine mock response
            
        Returns:
            Structured analysis dict
        """
        logger.debug(f"Mock analyzing: {filename}")
        
        # Normalize filename for pattern matching
        filename_lower = filename.lower()
        
        # Determine room type from filename
        room_type = self._detect_room_type(filename_lower)
        
        # Generate deterministic features based on room type
        detected_features, finishes = self._get_features_for_room(room_type)
        
        # Determine if interior
        interior = room_type not in ["exterior", "garden", "outdoor"]
        
        # Generate caption
        caption = self._generate_caption(room_type, detected_features)
        
        return {
            "filename": filename,
            "room_type": room_type,
            "detected_features": detected_features,
            "finishes": finishes,
            "light_level": self._get_light_level(filename_lower),
            "view_hint": self._get_view_hint(filename_lower, room_type),
            "interior": interior,
            "orientation_hint": self._get_orientation_hint(filename_lower),
            "suggested_caption": caption,
        }
    
    def _detect_room_type(self, filename: str) -> str:
        """Detect room type from filename."""
        room_patterns = {
            "kitchen": ["kitchen", "ktchn"],
            "bedroom": ["bedroom", "bed", "master", "guest_room"],
            "bathroom": ["bathroom", "bath", "ensuite", "shower"],
            "living_room": ["living", "lounge", "reception", "sitting"],
            "dining_room": ["dining"],
            "garden": ["garden", "yard", "patio", "terrace"],
            "exterior": ["exterior", "front", "facade"],
            "hallway": ["hall", "corridor", "entrance"],
            "office": ["office", "study"],
            "garage": ["garage", "parking"],
        }
        
        for room_type, patterns in room_patterns.items():
            if any(pattern in filename for pattern in patterns):
                return room_type
        
        # Default to living_room if no match
        return "living_room"
    
    def _get_features_for_room(self, room_type: str) -> tuple[List[str], List[str]]:
        """Get features and finishes for a room type."""
        feature_map = {
            "kitchen": (
                ["granite_countertops", "stainless_steel_appliances", "island_unit", "breakfast_bar"],
                ["hardwood_floors", "recessed_lighting", "tile_backsplash"]
            ),
            "bedroom": (
                ["fitted_wardrobes", "bay_window", "storage_space"],
                ["carpet", "neutral_decor", "pendant_lighting"]
            ),
            "bathroom": (
                ["walk_in_shower", "modern_fixtures", "vanity_unit"],
                ["porcelain_tiles", "chrome_fittings", "underfloor_heating"]
            ),
            "living_room": (
                ["fireplace", "bay_window", "built_in_storage"],
                ["hardwood_floors", "high_ceilings", "picture_rail"]
            ),
            "dining_room": (
                ["french_doors", "open_plan", "natural_light"],
                ["wood_flooring", "feature_lighting"]
            ),
            "garden": (
                ["lawn_area", "patio", "mature_planting", "garden_shed"],
                ["paved_pathways", "decking", "fence_boundaries"]
            ),
            "exterior": (
                ["driveway", "front_garden", "period_features"],
                ["brick_facade", "sash_windows", "tiled_roof"]
            ),
            "hallway": (
                ["staircase", "storage_cupboard", "wide_entrance"],
                ["tiled_floor", "neutral_walls"]
            ),
            "office": (
                ["fitted_desk", "shelving", "window_space"],
                ["carpet", "task_lighting"]
            ),
            "garage": (
                ["electric_door", "power_points", "storage_space"],
                ["concrete_floor", "lighting"]
            ),
        }
        
        return feature_map.get(room_type, (["spacious"], ["modern_finish"]))
    
    def _get_light_level(self, filename: str) -> str:
        """Determine light level from filename hints."""
        if any(word in filename for word in ["bright", "sunny", "light"]):
            return "bright"
        elif any(word in filename for word in ["dark", "dim"]):
            return "dim"
        else:
            return "moderate"
    
    def _get_view_hint(self, filename: str, room_type: str) -> str | None:
        """Determine view hint from filename and room type."""
        if "garden" in filename or room_type == "garden":
            return "garden_view"
        elif "street" in filename or room_type == "exterior":
            return "street_view"
        elif "park" in filename:
            return "park_view"
        elif any(word in filename for word in ["rear", "back"]):
            return "garden_view"
        return None
    
    def _get_orientation_hint(self, filename: str) -> str | None:
        """Determine orientation from filename."""
        orientation_map = {
            "north": "north_facing",
            "south": "south_facing",
            "east": "east_facing",
            "west": "west_facing",
            "front": "front_aspect",
            "rear": "rear_aspect",
            "back": "rear_aspect",
        }
        
        for keyword, orientation in orientation_map.items():
            if keyword in filename:
                return orientation
        
        return None
    
    def _generate_caption(self, room_type: str, features: List[str]) -> str:
        """Generate an 8-20 word caption - BUYER-NEUTRAL (no persona language)."""
        # Updated captions to remove buyer-persona language per guardrails Rule #7
        caption_templates = {
            "kitchen": "Kitchen featuring {f1} and {f2} with integrated appliances",
            "bedroom": "Bedroom featuring {f1} and {f2} with fitted storage",
            "bathroom": "Bathroom with {f1} and {f2} offering quality finishes",
            "living_room": "Reception room with {f1} and {f2} offering excellent proportions",
            "dining_room": "Dining room featuring {f1} and {f2} with natural light",
            "garden": "Garden featuring {f1} and {f2} with landscaped borders",
            "exterior": "Property exterior with {f1} and impressive frontage",
            "hallway": "Entrance hall with {f1} and original features",
            "office": "Study featuring {f1} with dedicated workspace",
            "garage": "Garage with {f1} providing secure parking",
        }
        
        template = caption_templates.get(room_type, "Well presented space with attractive features throughout")
        
        # Replace placeholders with features
        if "{f1}" in template and len(features) > 0:
            template = template.replace("{f1}", features[0].replace("_", " "))
        if "{f2}" in template and len(features) > 1:
            template = template.replace("{f2}", features[1].replace("_", " "))
        
        # Ensure caption is within 8-20 word range
        words = template.split()
        if len(words) < 8:
            template += " throughout the property"
        elif len(words) > 20:
            template = " ".join(words[:20])
        
        return template
