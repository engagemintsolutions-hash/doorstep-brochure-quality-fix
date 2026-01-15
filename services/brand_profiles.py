"""
Brand profile system for storing and applying agency branding templates.

Allows pre-configuration of perfect branding for clients like Savills.
"""
import json
import os
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)


class BrandProfile:
    """
    Brand profile containing all branding elements for an agency.
    """

    def __init__(self, profile_id: str, name: str, config: Dict):
        self.profile_id = profile_id
        self.name = name
        self.config = config

    def get_colors(self) -> Dict[str, str]:
        """Get brand color palette."""
        return self.config.get("colors", {})

    def get_fonts(self) -> Dict[str, str]:
        """Get brand font specifications."""
        return self.config.get("fonts", {})

    def get_layout_preferences(self) -> Dict:
        """Get layout and spacing preferences."""
        return self.config.get("layout", {})

    def get_tone_preferences(self) -> Dict:
        """Get writing tone and style preferences."""
        return self.config.get("tone", {})

    def get_logo_url(self) -> Optional[str]:
        """Get brand logo URL or path."""
        return self.config.get("logo_url")

    def get_prompt_enhancements(self) -> str:
        """
        Get prompt enhancements to inject into generation.

        These are brand-specific instructions added to the AI prompt.
        """
        return self.config.get("prompt_enhancements", "")


class BrandProfileManager:
    """
    Manage brand profiles for different agencies.
    """

    def __init__(self, profiles_path: str = "./brand_profiles.json"):
        """Initialize brand profile manager."""
        self.profiles_path = profiles_path
        self._ensure_storage_exists()

    def _ensure_storage_exists(self):
        """Create profiles file if it doesn't exist."""
        if not os.path.exists(self.profiles_path):
            # Pre-populate with Savills profile
            default_profiles = {
                "savills": self._create_savills_profile(),
                "generic": self._create_generic_profile()
            }
            with open(self.profiles_path, 'w') as f:
                json.dump(default_profiles, f, indent=2)
            logger.info(f"Created brand profiles at {self.profiles_path}")

    def _create_savills_profile(self) -> Dict:
        """
        Create Savills brand profile based on their existing brochures.

        Analyzed from: savills.co.uk property listings
        """
        return {
            "profile_id": "savills",
            "name": "Savills",
            "description": "Premium estate agent with 100+ UK offices",

            "colors": {
                "primary": "#002855",      # Savills navy blue
                "secondary": "#C5A572",    # Savills gold
                "accent": "#8B7355",       # Bronze/brown accent
                "text_primary": "#1a1a1a",
                "text_secondary": "#666666",
                "background": "#ffffff"
            },

            "fonts": {
                "heading": "Minion Pro, Georgia, serif",
                "body": "Helvetica Neue, Arial, sans-serif",
                "accent": "Futura, Avenir, sans-serif"
            },

            "layout": {
                "page_orientation": "portrait",
                "margin_top": "2cm",
                "margin_bottom": "2cm",
                "margin_left": "2cm",
                "margin_right": "2cm",
                "column_count": 1,
                "image_style": "full_bleed",  # Images extend to edges
                "logo_position": "top_right",
                "footer_style": "minimal"
            },

            "tone": {
                "style": "premium",  # premium, boutique, classic
                "formality": "formal_professional",
                "descriptive_level": "detailed",  # detailed, moderate, concise
                "emotional_appeal": "subtle",  # subtle, moderate, strong
                "unique_phrases": [
                    "enviable position",
                    "beautifully presented",
                    "elegantly proportioned",
                    "thoughtfully designed",
                    "exceptional standard",
                    "sought-after location"
                ]
            },

            "content_structure": {
                "headline_style": "address_focused",  # vs feature_focused
                "opening_sentence": "property_overview",
                "paragraph_count": 4,
                "bullet_points": True,
                "room_descriptions": "detailed",
                "include_measurements": True,
                "include_local_amenities": True
            },

            "prompt_enhancements": """
IMPORTANT BRAND GUIDELINES FOR SAVILLS:

Writing Style:
- Use sophisticated, premium language without being pretentious
- Focus on quality, heritage, and prestige
- Emphasize location desirability and exclusivity
- Use understated elegance (not flashy or hyperbolic)
- Favor British English spellings and terminology

Preferred Phrases:
- "enviable position" (not "great location")
- "beautifully presented" (not "nice")
- "elegantly proportioned" (not "spacious")
- "thoughtfully designed" (not "well-planned")
- "exceptional standard" (not "high quality")

Structure:
1. Opening: Property type and location positioning
2. Overview: General character and appeal
3. Interior: Room-by-room highlights with measurements
4. Exterior: Gardens, parking, outdoor spaces
5. Location: Local amenities, transport, schools

Avoid:
- Exclamation marks (use period for emphasis)
- Casual language ("amazing", "awesome", "wow")
- Over-selling or pushy sales language
- Abbreviations (spell out "square feet", not "sq ft")

Measurements:
- Always include room dimensions where available
- Use square feet or square meters consistently
- Reference plot size for houses with gardens
            """,

            "logo_url": "/static/brands/savills_logo.png",
            "watermark": "SAVILLS",
            "contact_template": {
                "phone": "+44 (0)20 7409 8756",
                "email": "residential@savills.com",
                "website": "savills.co.uk"
            }
        }

    def _create_generic_profile(self) -> Dict:
        """Create generic default profile."""
        return {
            "profile_id": "generic",
            "name": "Generic Estate Agent",
            "description": "Standard professional brochure template",

            "colors": {
                "primary": "#17A2B8",
                "secondary": "#FF6B6B",
                "accent": "#28a745",
                "text_primary": "#2a2a2a",
                "text_secondary": "#6c757d",
                "background": "#ffffff"
            },

            "fonts": {
                "heading": "Georgia, serif",
                "body": "Arial, sans-serif",
                "accent": "Helvetica, sans-serif"
            },

            "layout": {
                "page_orientation": "portrait",
                "margin_top": "1.5cm",
                "margin_bottom": "1.5cm",
                "margin_left": "1.5cm",
                "margin_right": "1.5cm",
                "column_count": 1,
                "image_style": "contained",
                "logo_position": "top_center",
                "footer_style": "full"
            },

            "tone": {
                "style": "professional",
                "formality": "balanced",
                "descriptive_level": "moderate",
                "emotional_appeal": "moderate",
                "unique_phrases": []
            },

            "content_structure": {
                "headline_style": "feature_focused",
                "opening_sentence": "hook",
                "paragraph_count": 3,
                "bullet_points": True,
                "room_descriptions": "moderate",
                "include_measurements": False,
                "include_local_amenities": True
            },

            "prompt_enhancements": """
Use professional, engaging language.
Focus on property features and benefits.
Balance information with emotional appeal.
            """,

            "logo_url": None,
            "watermark": None,
            "contact_template": {}
        }

    def _load_profiles(self) -> Dict:
        """Load all brand profiles from storage."""
        try:
            with open(self.profiles_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading profiles: {e}")
            return {}

    def _save_profiles(self, profiles: Dict):
        """Save all profiles to storage."""
        try:
            with open(self.profiles_path, 'w') as f:
                json.dump(profiles, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving profiles: {e}")

    def get_profile(self, profile_id: str) -> Optional[BrandProfile]:
        """
        Get a brand profile by ID.

        Args:
            profile_id: e.g., "savills", "generic"

        Returns:
            BrandProfile or None if not found
        """
        profiles = self._load_profiles()

        if profile_id not in profiles:
            logger.warning(f"Profile not found: {profile_id}, using generic")
            profile_id = "generic"

        config = profiles.get(profile_id)
        if not config:
            return None

        return BrandProfile(
            profile_id=config["profile_id"],
            name=config["name"],
            config=config
        )

    def create_profile(self, profile_data: Dict) -> BrandProfile:
        """
        Create a new brand profile.

        Args:
            profile_data: Complete profile configuration

        Returns:
            Created BrandProfile
        """
        profiles = self._load_profiles()
        profile_id = profile_data["profile_id"]

        profiles[profile_id] = profile_data
        self._save_profiles(profiles)

        logger.info(f"Created brand profile: {profile_id}")

        return BrandProfile(
            profile_id=profile_id,
            name=profile_data["name"],
            config=profile_data
        )

    def list_profiles(self) -> List[Dict]:
        """
        List all available brand profiles.

        Returns:
            List of profile summaries
        """
        profiles = self._load_profiles()

        return [
            {
                "profile_id": p["profile_id"],
                "name": p["name"],
                "description": p.get("description", "")
            }
            for p in profiles.values()
        ]

    def update_profile(self, profile_id: str, updates: Dict):
        """Update an existing profile."""
        profiles = self._load_profiles()

        if profile_id not in profiles:
            raise ValueError(f"Profile not found: {profile_id}")

        # Merge updates
        profiles[profile_id].update(updates)
        self._save_profiles(profiles)

        logger.info(f"Updated brand profile: {profile_id}")

    def analyze_example_brochure(self, brochure_pdf_path: str) -> Dict:
        """
        Analyze an example brochure to extract brand elements.

        This would use PDF parsing + vision AI to extract:
        - Color palette (from images)
        - Font styles (from text)
        - Layout structure (from page analysis)
        - Tone (from text analysis)

        Returns suggested profile configuration.

        TODO: Implement with PDF parser + Claude Vision
        """
        # Placeholder for future implementation
        logger.info(f"Analyzing brochure: {brochure_pdf_path}")

        return {
            "colors": {},
            "fonts": {},
            "layout": {},
            "tone_analysis": {},
            "suggested_profile": {}
        }


# Global instance
brand_manager = BrandProfileManager()


def get_brand_profile(profile_id: str = "generic") -> BrandProfile:
    """
    Convenience function to get a brand profile.

    Usage:
        profile = get_brand_profile("savills")
        prompt_additions = profile.get_prompt_enhancements()
    """
    return brand_manager.get_profile(profile_id)
