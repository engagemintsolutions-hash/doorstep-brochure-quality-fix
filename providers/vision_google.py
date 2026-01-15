"""
Google Cloud Vision API provider.
"""
from typing import Dict, List
import logging
import os
from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
)

logger = logging.getLogger(__name__)


class VisionGoogleClient:
    """
    Google Cloud Vision API client for real image analysis.
    
    Requires google-cloud-vision package and valid credentials.
    """
    
    def __init__(self, credentials_path: str):
        """
        Initialize Google Vision client.
        
        Args:
            credentials_path: Path to Google Cloud credentials JSON file
            
        Raises:
            RuntimeError: If credentials are invalid or API unavailable
        """
        if not os.path.exists(credentials_path):
            raise RuntimeError(f"Google credentials not found: {credentials_path}")
        
        try:
            # Import here to make google-cloud-vision optional
            from google.cloud import vision
            from google.api_core import exceptions as google_exceptions
            
            self.vision = vision
            self.google_exceptions = google_exceptions
            
            # Set credentials
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
            
            # Initialize client
            self.client = vision.ImageAnnotatorClient()
            logger.info("Initialized Google Vision client")
            
        except ImportError as e:
            raise RuntimeError(
                "google-cloud-vision not installed. "
                "Install with: pip install google-cloud-vision"
            ) from e
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Google Vision: {str(e)}") from e
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(Exception),
        reraise=True,
    )
    async def analyze_image(self, image_bytes: bytes, filename: str) -> Dict:
        """
        Analyze image using Google Cloud Vision API.
        
        Args:
            image_bytes: Raw image data
            filename: Original filename (for context)
            
        Returns:
            Structured analysis dict
            
        Raises:
            Exception: If API call fails after retries
        """
        logger.info(f"Analyzing with Google Vision: {filename}")
        
        try:
            # Create Vision API image object
            image = self.vision.Image(content=image_bytes)
            
            # Perform multiple detections in one call
            response = self.client.annotate_image({
                'image': image,
                'features': [
                    {'type_': self.vision.Feature.Type.LABEL_DETECTION, 'max_results': 20},
                    {'type_': self.vision.Feature.Type.OBJECT_LOCALIZATION, 'max_results': 10},
                    {'type_': self.vision.Feature.Type.IMAGE_PROPERTIES},
                ],
            })
            
            # Check for errors
            if response.error.message:
                raise Exception(f"Google Vision API error: {response.error.message}")
            
            # Parse results
            labels = [label.description.lower() for label in response.label_annotations]
            objects = [obj.name.lower() for obj in response.localized_object_annotations]
            
            # Analyze image properties
            dominant_colors = []
            if response.image_properties_annotation.dominant_colors.colors:
                # Get top 3 dominant colors
                for color_info in response.image_properties_annotation.dominant_colors.colors[:3]:
                    color = color_info.color
                    dominant_colors.append({
                        'r': color.red,
                        'g': color.green,
                        'b': color.blue,
                    })
            
            # Classify and structure the results
            room_type = self._classify_room_type(labels, objects)
            detected_features = self._extract_features(labels, objects, room_type)
            finishes = self._extract_finishes(labels)
            light_level = self._assess_light_level(dominant_colors, labels)
            interior = self._is_interior(labels, objects)
            view_hint = self._extract_view_hint(labels)
            orientation_hint = self._extract_orientation_hint(filename, labels)
            
            # Generate caption
            caption = self._generate_caption(room_type, detected_features, finishes)
            
            result = {
                "filename": filename,
                "room_type": room_type,
                "detected_features": detected_features,
                "finishes": finishes,
                "light_level": light_level,
                "view_hint": view_hint,
                "interior": interior,
                "orientation_hint": orientation_hint,
                "suggested_caption": caption,
            }
            
            logger.debug(f"Google Vision analysis complete: {room_type}")
            return result
            
        except Exception as e:
            logger.error(f"Google Vision analysis failed: {str(e)}")
            raise
    
    def _classify_room_type(self, labels: List[str], objects: List[str]) -> str:
        """Classify room type from labels and objects."""
        all_items = labels + objects
        
        # Room type classification rules
        if any(item in all_items for item in ["kitchen", "stove", "oven", "refrigerator", "countertop"]):
            return "kitchen"
        elif any(item in all_items for item in ["bed", "bedroom", "mattress", "headboard"]):
            return "bedroom"
        elif any(item in all_items for item in ["bathroom", "toilet", "shower", "bathtub", "sink"]):
            return "bathroom"
        elif any(item in all_items for item in ["garden", "lawn", "yard", "patio", "deck"]):
            return "garden"
        elif any(item in all_items for item in ["building", "house", "facade", "exterior"]):
            return "exterior"
        elif any(item in all_items for item in ["dining", "dining table", "dining room"]):
            return "dining_room"
        elif any(item in all_items for item in ["office", "desk", "computer"]):
            return "office"
        elif any(item in all_items for item in ["living", "sofa", "couch", "living room"]):
            return "living_room"
        else:
            return "living_room"  # Default
    
    def _extract_features(self, labels: List[str], objects: List[str], room_type: str) -> List[str]:
        """Extract relevant features from labels and objects."""
        features = []
        all_items = set(labels + objects)
        
        # Feature keywords to look for
        feature_keywords = {
            "fireplace": "fireplace",
            "window": "large_windows",
            "bay window": "bay_window",
            "chandelier": "chandelier",
            "island": "island_unit",
            "appliance": "modern_appliances",
            "wardrobe": "fitted_wardrobes",
            "storage": "storage_space",
            "cabinet": "fitted_cabinets",
            "counter": "countertops",
            "sink": "modern_fixtures",
            "bathtub": "bathtub",
            "shower": "walk_in_shower",
            "patio": "patio_area",
            "lawn": "lawn_area",
            "deck": "decking",
            "fence": "fenced_garden",
            "driveway": "driveway",
            "balcony": "balcony",
        }
        
        for keyword, feature in feature_keywords.items():
            if keyword in " ".join(all_items):
                features.append(feature)
        
        # Add room-specific default features if none found
        if not features:
            room_defaults = {
                "kitchen": ["modern_appliances", "fitted_units"],
                "bedroom": ["spacious_layout", "storage_space"],
                "bathroom": ["modern_fixtures", "quality_fittings"],
                "living_room": ["bright_space", "comfortable_layout"],
                "garden": ["outdoor_space", "well_maintained"],
            }
            features = room_defaults.get(room_type, ["attractive_features"])
        
        return features[:5]  # Limit to top 5 features
    
    def _extract_finishes(self, labels: List[str]) -> List[str]:
        """Extract finish materials from labels."""
        finishes = []
        
        finish_keywords = {
            "wood": "hardwood_floors",
            "wooden": "hardwood_floors",
            "hardwood": "hardwood_floors",
            "tile": "tiled_floors",
            "tiles": "tiled_floors",
            "carpet": "carpeted",
            "granite": "granite_surfaces",
            "marble": "marble_finishes",
            "stainless": "stainless_steel",
            "chrome": "chrome_fittings",
            "glass": "glass_features",
            "brick": "brick_features",
            "stone": "stone_features",
        }
        
        for keyword, finish in finish_keywords.items():
            if keyword in " ".join(labels):
                finishes.append(finish)
        
        if not finishes:
            finishes = ["quality_finishes"]
        
        return list(set(finishes))[:4]  # Limit to 4 unique finishes
    
    def _assess_light_level(self, dominant_colors: List[Dict], labels: List[str]) -> str:
        """Assess light level from colors and labels."""
        # Check labels first
        if any(word in " ".join(labels) for word in ["bright", "sunlight", "sunny"]):
            return "bright"
        elif any(word in " ".join(labels) for word in ["dark", "dim"]):
            return "dim"
        
        # Analyze dominant colors
        if dominant_colors:
            avg_brightness = sum(
                (c['r'] + c['g'] + c['b']) / 3 for c in dominant_colors
            ) / len(dominant_colors)
            
            if avg_brightness > 180:
                return "bright"
            elif avg_brightness < 100:
                return "dim"
        
        return "moderate"
    
    def _is_interior(self, labels: List[str], objects: List[str]) -> bool:
        """Determine if image is interior or exterior."""
        exterior_keywords = [
            "outdoor", "building", "house", "facade", "garden",
            "lawn", "tree", "sky", "cloud", "exterior"
        ]
        
        all_items = " ".join(labels + objects)
        return not any(keyword in all_items for keyword in exterior_keywords)
    
    def _extract_view_hint(self, labels: List[str]) -> str | None:
        """Extract view information from labels."""
        all_labels = " ".join(labels)
        
        if "garden" in all_labels or "lawn" in all_labels:
            return "garden_view"
        elif "park" in all_labels:
            return "park_view"
        elif "street" in all_labels or "road" in all_labels:
            return "street_view"
        elif "water" in all_labels or "lake" in all_labels or "sea" in all_labels:
            return "water_view"
        
        return None
    
    def _extract_orientation_hint(self, filename: str, labels: List[str]) -> str | None:
        """Extract orientation from filename or labels."""
        filename_lower = filename.lower()
        
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
            if keyword in filename_lower:
                return orientation
        
        return None
    
    def _generate_caption(
        self,
        room_type: str,
        features: List[str],
        finishes: List[str]
    ) -> str:
        """Generate an 8-20 word caption."""
        # Clean up feature names for display
        feature_text = " and ".join(
            [f.replace("_", " ") for f in features[:2]]
        )
        
        caption_templates = {
            "kitchen": f"Modern kitchen featuring {feature_text}",
            "bedroom": f"Comfortable bedroom with {feature_text}",
            "bathroom": f"Contemporary bathroom offering {feature_text}",
            "living_room": f"Bright reception room with {feature_text}",
            "dining_room": f"Elegant dining space featuring {feature_text}",
            "garden": f"Well maintained garden with {feature_text}",
            "exterior": f"Attractive property exterior with impressive street presence",
            "office": f"Versatile home office with {feature_text}",
        }
        
        caption = caption_templates.get(
            room_type,
            f"Well presented {room_type.replace('_', ' ')} with quality finishes"
        )
        
        # Ensure caption is within word limit
        words = caption.split()
        if len(words) < 8:
            caption += " perfect for modern living"
        elif len(words) > 20:
            caption = " ".join(words[:20])
        
        return caption
