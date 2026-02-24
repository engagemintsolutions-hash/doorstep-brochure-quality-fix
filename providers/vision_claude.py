"""
Claude vision provider using Anthropic's Claude API with vision capabilities.
"""
from typing import Dict, List, Optional
import logging
import anthropic
import base64
import os

logger = logging.getLogger(__name__)

# Vision model options - Sonnet is best balance of quality/cost for property photos
VISION_MODELS = {
    "haiku": "claude-haiku-4-5-20251001",       # Cheapest, may hallucinate
    "sonnet": "claude-sonnet-4-20250514",       # Best value - recommended
    "opus": "claude-opus-4-20250514",           # Best quality, expensive
}


class VisionClaudeClient:
    """
    Claude vision client that uses Anthropic's API for image analysis.

    Uses Claude's multimodal capabilities to analyze property images and extract
    features, room types, finishes, and generate captions.
    """

    def __init__(self, api_key: str = None, rate_limiter=None, model: str = None):
        """
        Initialize Claude vision client.

        Args:
            api_key: Anthropic API key
            rate_limiter: Optional GlobalRateLimiter instance for rate limiting
            model: Vision model to use (haiku/sonnet/opus) - defaults to VISION_MODEL env var or sonnet
        """
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY is required for Claude vision")

        self.client = anthropic.Anthropic(api_key=self.api_key)
        self.rate_limiter = rate_limiter

        # Get model from parameter, env var, or default to haiku (cheapest)
        model_key = model or os.getenv('VISION_MODEL', 'haiku').lower()
        self.model = VISION_MODELS.get(model_key, VISION_MODELS['haiku'])

        logger.info(f"Initialized Claude vision client with model: {self.model}")

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

            # Call Claude with vision using configured model
            message = self.client.messages.create(
                model=self.model,
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

            # Validate the response - check for hallucination indicators
            analysis = self._validate_analysis(analysis, filename)

            logger.debug(f"Successfully analyzed {filename}: {analysis['room_type']}")
            return analysis

        except Exception as e:
            logger.error(f"Claude vision analysis failed for {filename}: {str(e)}")
            # Return minimal analysis that flags the image needs manual review
            return self._fallback_analysis(filename, error=str(e))

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
        """Build the prompt for Claude to analyze the property image with JSON output."""
        return """Analyze this property photograph. Describe ONLY what you can actually see.

You MUST respond with ONLY valid JSON in this exact format:
{
  "room_type": "kitchen|bedroom|bathroom|living_room|dining_room|garden|exterior|hallway|office|garage|other",
  "detected_features": ["feature1", "feature2"],
  "finishes": ["finish1", "finish2"],
  "light_level": "bright|moderate|dim",
  "view_hint": "garden_view|street_view|park_view|null",
  "interior": true|false,
  "orientation_hint": "front_aspect|rear_aspect|side_aspect|null",
  "caption": "Simple factual 8-12 word description of what is visible",
  "headline": "Room type in 2-4 words",
  "selling_points": ["visible feature 1", "visible feature 2"]
}

VALID FEATURES (ONLY list if clearly visible):
- Structural: fireplace, bay_window, sash_windows, french_doors, bifold_doors, skylights, exposed_beams
- Outdoor: garden, driveway, garage, parking, patio, decking
- Kitchen: kitchen_island, breakfast_bar, range_cooker, integrated_appliances
- Bedroom: ensuite, fitted_wardrobes
- Bathroom: freestanding_bath, walk_in_shower

VALID FINISHES (ONLY list if clearly visible):
- Floors: hardwood_floors, tiles, carpet, laminate
- Surfaces: granite_countertops, wooden_worktops
- Appliances: stainless_steel_appliances, integrated_appliances

CAPTION RULES - BE FACTUAL:
- ONLY describe what you can actually see in the photo
- DO NOT invent features, finishes, or qualities not visible
- DO NOT use marketing fluff like "stunning", "exceptional", "beautifully appointed"
- DO NOT claim "quality finishes" unless you can specifically identify them
- Simple descriptions like "Kitchen with cream units and tiled floor" are preferred
- For exteriors: describe the building style and visible features only

GOOD CAPTION EXAMPLES:
- "Kitchen with cream cabinets, built-in oven, and dining area"
- "Double bedroom with fitted wardrobes and carpet flooring"
- "Semi-detached house with front garden and driveway"
- "Living room with fireplace and bay window"

BAD CAPTIONS (DO NOT USE):
- "Stunning chef's kitchen with premium finishes" (marketing fluff)
- "Property photograph with quality finishes throughout" (generic, not descriptive)
- "Luxurious principal suite" (aspirational, not factual)

Respond with ONLY the JSON object."""

    def _parse_claude_response(self, response_text: str, filename: str) -> Dict:
        """Parse Claude's JSON response into a dict."""
        import json
        import re

        # Default result structure
        result = {
            "filename": filename,
            "room_type": "other",
            "detected_features": [],
            "finishes": [],
            "light_level": "moderate",
            "view_hint": None,
            "interior": True,
            "orientation_hint": None,
            "suggested_caption": "",
            "headline": "",
            "selling_points": []
        }

        try:
            # Try to extract JSON from the response (in case there's extra text)
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                json_str = json_match.group()
                parsed = json.loads(json_str)

                # Map parsed values to result
                if 'room_type' in parsed:
                    result['room_type'] = str(parsed['room_type']).lower()
                if 'detected_features' in parsed and isinstance(parsed['detected_features'], list):
                    result['detected_features'] = [str(f).strip() for f in parsed['detected_features'] if f]
                if 'finishes' in parsed and isinstance(parsed['finishes'], list):
                    result['finishes'] = [str(f).strip() for f in parsed['finishes'] if f]
                if 'light_level' in parsed:
                    result['light_level'] = str(parsed['light_level']).lower()
                if 'view_hint' in parsed:
                    vh = parsed['view_hint']
                    result['view_hint'] = None if vh in [None, 'null', 'none'] else str(vh).lower()
                if 'interior' in parsed:
                    result['interior'] = bool(parsed['interior'])
                if 'orientation_hint' in parsed:
                    oh = parsed['orientation_hint']
                    result['orientation_hint'] = None if oh in [None, 'null', 'none'] else str(oh).lower()
                if 'caption' in parsed:
                    result['suggested_caption'] = str(parsed['caption'])
                if 'headline' in parsed:
                    result['headline'] = str(parsed['headline'])
                if 'selling_points' in parsed and isinstance(parsed['selling_points'], list):
                    result['selling_points'] = [str(p).strip() for p in parsed['selling_points'] if p]

                logger.debug(f"Successfully parsed JSON response for {filename}")
            else:
                logger.warning(f"No JSON found in response for {filename}, falling back to text parsing")
                result = self._parse_text_response(response_text, filename, result)

        except json.JSONDecodeError as e:
            logger.warning(f"JSON parse error for {filename}: {e}, falling back to text parsing")
            result = self._parse_text_response(response_text, filename, result)

        return result

    def _parse_text_response(self, response_text: str, filename: str, result: Dict) -> Dict:
        """Fallback text parser for non-JSON responses."""
        lines = response_text.strip().split('\n')

        for line in lines:
            line = line.strip()
            if ':' not in line:
                continue

            key, value = line.split(':', 1)
            key = key.strip().lower().replace('"', '').replace("'", "")
            value = value.strip().strip('"').strip("'")

            if 'room_type' in key:
                result['room_type'] = value.lower()
            elif 'detected_features' in key or 'features' in key:
                result['detected_features'] = [f.strip().strip('"') for f in value.split(',') if f.strip()]
            elif 'finishes' in key:
                result['finishes'] = [f.strip().strip('"') for f in value.split(',') if f.strip()]
            elif 'light_level' in key:
                result['light_level'] = value.lower()
            elif 'view_hint' in key:
                result['view_hint'] = None if value.lower() in ['none', 'null'] else value.lower()
            elif 'interior' in key:
                result['interior'] = value.lower() == 'true'
            elif 'orientation' in key:
                result['orientation_hint'] = None if value.lower() in ['none', 'null'] else value.lower()
            elif 'caption' in key:
                result['suggested_caption'] = value

        return result

    def _validate_analysis(self, analysis: Dict, filename: str) -> Dict:
        """
        Validate the analysis to catch hallucinations and overly generic responses.
        Now tuned for estate agent language - allows aspirational terms but catches
        truly generic filler content.
        """
        # Only flag truly generic/filler terms that indicate lazy output
        # Estate agent terms like "stunning", "beautiful" are now allowed
        GENERIC_FILLER_TERMS = [
            "well_presented", "well presented", "modern_finish",
            "good condition", "nice property", "attractive property",
            "quality throughout", "well maintained"
        ]

        # Check detected features for generic filler (not real features)
        valid_features = []
        for feature in analysis.get('detected_features', []):
            feature_lower = feature.lower()
            # Only filter out if it's a generic filler, not a real feature
            if not any(filler in feature_lower for filler in GENERIC_FILLER_TERMS):
                valid_features.append(feature)

        analysis['detected_features'] = valid_features

        # Only flag caption if it's extremely generic (just "Property" or similar)
        caption = analysis.get('suggested_caption', '').strip()
        if len(caption) < 20 or caption.lower() in ['property', 'house', 'home', 'room']:
            room_type = analysis.get('room_type', 'room')
            analysis['needs_review'] = True
            logger.warning(f"Caption too short/generic for {filename}: '{caption}'")

        return analysis

    def _fallback_analysis(self, filename: str, error: str = None) -> Dict:
        """
        Fallback analysis if Claude API fails.
        Returns honest minimal data instead of hallucinated content.
        """
        logger.warning(f"Using fallback analysis for {filename}" + (f": {error}" if error else ""))

        return {
            "filename": filename,
            "room_type": "other",
            "detected_features": [],  # Empty - don't hallucinate features
            "finishes": [],
            "light_level": "moderate",
            "view_hint": None,
            "interior": True,
            "orientation_hint": None,
            "suggested_caption": "Property photograph",  # Honest minimal caption
            "needs_review": True,  # Flag that this needs manual review
            "analysis_error": error
        }
