"""
Claude vision provider using Anthropic's Claude API with vision capabilities.
"""
from typing import Dict, List, Optional
import logging
import anthropic
import base64
import os

logger = logging.getLogger(__name__)


class VisionClaudeClient:
    """
    Claude vision client that uses Anthropic's API for image analysis.

    Uses Claude's multimodal capabilities to analyze property images and extract
    features, room types, finishes, and generate captions.
    """

    def __init__(self, api_key: str = None, rate_limiter=None):
        """
        Initialize Claude vision client.

        Args:
            api_key: Anthropic API key
            rate_limiter: Optional GlobalRateLimiter instance for rate limiting
        """
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is required for Claude vision")

        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.rate_limiter = rate_limiter
        logger.info("Initialized Claude vision client")

    async def analyze_image(self, image_bytes: bytes, filename: str) -> Dict:
        """
        Analyze property image using Claude's vision API.

        Args:
            image_bytes: Raw image data
            filename: Image filename (for metadata)

        Returns:
            Structured analysis dict
        """
        logger.debug(f"Claude analyzing: {filename}")

        # Encode image to base64
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')

        # Determine media type from filename
        media_type = self._get_media_type(filename)

        # Create the vision analysis prompt
        prompt = self._build_analysis_prompt()

        try:
            # Apply global rate limiting if available
            if self.rate_limiter:
                await self.rate_limiter.wait_if_needed()
                logger.debug(f"Rate limiter enforced for {filename}")

            # Call Claude with vision
            message = self.client.messages.create(
                model="claude-3-haiku-20240307",  # Claude 3 Haiku with vision (fast & affordable)
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": media_type,
                                    "data": image_base64,
                                },
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ],
                    }
                ],
            )

            # Parse Claude's response
            response_text = message.content[0].text
            analysis = self._parse_claude_response(response_text, filename)

            logger.debug(f"Successfully analyzed {filename}: {analysis['room_type']}")
            return analysis

        except Exception as e:
            logger.error(f"Claude vision analysis failed for {filename}: {str(e)}")
            # Fallback to basic analysis
            return self._fallback_analysis(filename)

    def _get_media_type(self, filename: str) -> str:
        """Determine media type from filename extension."""
        filename_lower = filename.lower()
        if filename_lower.endswith('.png'):
            return "image/png"
        elif filename_lower.endswith(('.jpg', '.jpeg')):
            return "image/jpeg"
        elif filename_lower.endswith('.webp'):
            return "image/webp"
        elif filename_lower.endswith('.gif'):
            return "image/gif"
        else:
            return "image/jpeg"  # Default

    def _build_analysis_prompt(self) -> str:
        """Build the prompt for Claude to analyze the property image."""
        return """Analyze this property photograph and identify SPECIFIC PROPERTY FEATURES visible in the image.

ROOM_TYPE: [kitchen|bedroom|bathroom|living_room|dining_room|garden|exterior|hallway|office|garage|other]

DETECTED_FEATURES: List ONLY physical features actually visible, such as: fireplace, garden, driveway, garage, parking, bay_window, sash_windows, french_doors, patio, balcony, terrace, decking, swimming_pool, conservatory, ensuite, walk_in_wardrobe, fitted_wardrobes, kitchen_island, breakfast_bar, range_cooker, exposed_beams, skylights, bifold_doors, double_glazing, etc.

FINISHES: List visible materials/finishes such as: hardwood_floors, granite_countertops, marble_flooring, porcelain_tiles, stainless_steel_appliances, integrated_appliances, recessed_lighting, pendant_lighting, underfloor_heating, etc.

LIGHT_LEVEL: [bright|moderate|dim]

VIEW_HINT: [garden_view|street_view|park_view|none]

INTERIOR: [true|false]

ORIENTATION_HINT: [north_facing|south_facing|east_facing|west_facing|front_aspect|rear_aspect|none]

CAPTION: [Write a compelling 8-20 word property caption]

CRITICAL: Only list features you can ACTUALLY SEE in this specific photo. Do not list generic quality terms like "well_presented" or "modern_finish". Be specific about physical features, fixtures, and materials."""

    def _parse_claude_response(self, response_text: str, filename: str) -> Dict:
        """Parse Claude's structured response into a dict."""
        lines = response_text.strip().split('\n')
        result = {
            "filename": filename,
            "room_type": "living_room",
            "detected_features": [],
            "finishes": [],
            "light_level": "moderate",
            "view_hint": None,
            "interior": True,
            "orientation_hint": None,
            "suggested_caption": ""
        }

        for line in lines:
            line = line.strip()
            if ':' not in line:
                continue

            key, value = line.split(':', 1)
            key = key.strip().lower()
            value = value.strip()

            if key == 'room_type':
                result['room_type'] = value.lower()
            elif key == 'detected_features':
                result['detected_features'] = [f.strip() for f in value.split(',') if f.strip()]
            elif key == 'finishes':
                result['finishes'] = [f.strip() for f in value.split(',') if f.strip()]
            elif key == 'light_level':
                result['light_level'] = value.lower()
            elif key == 'view_hint':
                result['view_hint'] = None if value.lower() == 'none' else value.lower()
            elif key == 'interior':
                result['interior'] = value.lower() == 'true'
            elif key == 'orientation_hint':
                result['orientation_hint'] = None if value.lower() == 'none' else value.lower()
            elif key == 'caption':
                result['suggested_caption'] = value

        return result

    def _fallback_analysis(self, filename: str) -> Dict:
        """Fallback analysis if Claude API fails."""
        return {
            "filename": filename,
            "room_type": "living_room",
            "detected_features": ["well_presented"],
            "finishes": ["modern_finish"],
            "light_level": "moderate",
            "view_hint": None,
            "interior": True,
            "orientation_hint": None,
            "suggested_caption": "Well presented property space with attractive features throughout"
        }
