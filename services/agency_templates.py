"""
Agency Template Service
Manages agency-specific branding, templates, and style guides
"""

from typing import Dict, List, Optional, Literal
from pydantic import BaseModel, Field
from enum import Enum
import json
from pathlib import Path


class TemplateType(str, Enum):
    """Template types available"""
    STANDARD = "standard"
    PREMIUM = "premium"
    CLASSIC = "classic"  # Future: for period properties


class PropertyCharacter(str, Enum):
    """Property character types for template selection"""
    TRADITIONAL = "traditional"  # Family homes, standard properties
    UNIQUE = "unique"  # Loft-style, character properties
    PERIOD = "period"  # Victorian, Georgian, etc.
    MODERN = "modern"  # Contemporary, new-build
    LUXURY = "luxury"  # High-end regardless of style


class LogoConfig(BaseModel):
    """Logo configuration"""
    logo_path: Optional[str] = Field(default=None, description="Path to logo image file")
    logo_position: str = Field(default="top-right", description="Logo position (top-right, top-left, etc.)")
    logo_width: int = Field(default=120, description="Logo width in pixels")
    logo_height: int = Field(default=50, description="Logo height in pixels")
    background_color: Optional[str] = Field(default=None, description="Logo background color (if using box)")
    text_color: Optional[str] = Field(default=None, description="Logo text color (if text-based)")
    show_on_every_page: bool = Field(default=True, description="Show logo on every page")


class ColorPalette(BaseModel):
    """Brand color scheme"""
    primary: str = Field(description="Primary brand color (hex)")
    secondary: str = Field(description="Secondary brand color (hex)")
    background: str = Field(description="Page background color (hex)")
    text_primary: str = Field(description="Main body text color (hex)")
    text_heading: str = Field(description="Headline text color (hex)")
    floor_plan_reception: str = Field(default="#F8D7DA", description="Floor plan reception room color")
    floor_plan_bedroom: str = Field(default="#D8BFD8", description="Floor plan bedroom color")
    floor_plan_bathroom: str = Field(default="#B0D4E3", description="Floor plan bathroom color")
    floor_plan_walls: str = Field(default="#000000", description="Floor plan wall color")


class Typography(BaseModel):
    """Typography settings"""
    headline_font: str = Field(description="Font family for headlines")
    body_font: str = Field(description="Font family for body text")
    headline_weight: str = Field(default="300", description="Font weight for headlines (thin, light, regular, bold)")
    body_weight: str = Field(default="400", description="Font weight for body text")


class WritingStyle(BaseModel):
    """Writing style guidelines"""
    template_type: TemplateType
    word_count_min: int = Field(description="Minimum word count")
    word_count_max: int = Field(description="Maximum word count")
    tone: str = Field(description="Overall tone (descriptive, aspirational, technical, etc.)")
    example_phrases: List[str] = Field(default_factory=list, description="Example phrases and language patterns")
    avoid_phrases: List[str] = Field(default_factory=list, description="Phrases to avoid")
    structure_notes: str = Field(default="", description="How to structure the description")


class TemplateConfig(BaseModel):
    """Configuration for a specific template"""
    template_type: TemplateType
    page_count: int = Field(description="Typical number of pages")
    photo_count_min: int = Field(description="Minimum photos required")
    photo_count_max: int = Field(description="Maximum photos recommended")
    show_icons_header: bool = Field(default=True, description="Show bed/bath/reception icons in header")
    contact_page_position: Literal["last", "second"] = Field(default="last", description="Where to show contact info")
    text_overlay_cover: bool = Field(default=False, description="Overlay text on cover photo (premium style)")
    writing_style: WritingStyle


class TemplateSelectionRule(BaseModel):
    """Rules for automatic template selection"""
    property_character: PropertyCharacter
    price_min: Optional[int] = None
    price_max: Optional[int] = None
    bedrooms_min: Optional[int] = None
    bedrooms_max: Optional[int] = None
    property_types: List[str] = Field(default_factory=list, description="flat, house, bungalow, etc.")
    template_type: TemplateType


class AgencyBranding(BaseModel):
    """Complete agency branding configuration"""
    agency_id: str = Field(description="Unique agency identifier (e.g., 'savills', 'foxtons')")
    agency_name: str = Field(description="Display name")

    # Visual branding
    logo: LogoConfig
    colors: ColorPalette
    typography: Typography

    # Templates
    templates: Dict[TemplateType, TemplateConfig] = Field(description="Template configurations")
    template_selection_rules: List[TemplateSelectionRule] = Field(
        default_factory=list,
        description="Rules for automatic template selection"
    )

    # Additional branding
    legal_disclaimer: str = Field(description="Standard legal disclaimer text")
    footer_branding: Optional[str] = Field(default="powered by FluxPro", description="Footer branding text")
    mandatory_elements: List[str] = Field(
        default_factory=lambda: [
            "logo", "address", "price", "floor_plan", "epc",
            "key_information", "contact", "viewing_notice",
            "references", "legal_disclaimer"
        ],
        description="Elements that must appear in brochure"
    )

    # Metadata
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    sample_brochures: List[str] = Field(default_factory=list, description="Paths to sample brochure PDFs")


class AgencyTemplateService:
    """Service for managing agency templates"""

    def __init__(self, templates_dir: str = "./agency_templates", logos_dir: str = "./static/logos"):
        self.templates_dir = Path(templates_dir)
        self.templates_dir.mkdir(exist_ok=True)

        self.logos_dir = Path(logos_dir)
        self.logos_dir.mkdir(parents=True, exist_ok=True)

        # Cache loaded templates
        self._cache: Dict[str, AgencyBranding] = {}

        # Load built-in Savills template
        self._load_savills_default()

    def _load_savills_default(self):
        """Load default Savills branding"""
        savills = AgencyBranding(
            agency_id="savills",
            agency_name="Savills",
            logo=LogoConfig(
                logo_path="logos/savills_logo.png",  # Official Savills logo file
                logo_position="top-right",
                logo_width=120,
                logo_height=50,
                background_color=None,  # Logo image already contains branding
                text_color=None,  # Logo image already contains branding
                show_on_every_page=True
            ),
            colors=ColorPalette(
                primary="#002855",  # Savills navy blue (official brand color)
                secondary="#C5A572",  # Savills gold (official brand color)
                background="#FFFFFF",  # Clean white background
                text_primary="#1a1a1a",  # Nearly black for readability
                text_heading="#002855",  # Savills navy for headings
            ),
            typography=Typography(
                headline_font="ITC Fenice",  # Elegant serif
                body_font="Helvetica Neue",  # Clean sans-serif
                headline_weight="300",  # Thin
                body_weight="400"  # Regular
            ),
            templates={
                TemplateType.STANDARD: TemplateConfig(
                    template_type=TemplateType.STANDARD,
                    page_count=6,
                    photo_count_min=7,
                    photo_count_max=10,
                    show_icons_header=True,
                    contact_page_position="last",
                    text_overlay_cover=False,
                    writing_style=WritingStyle(
                        template_type=TemplateType.STANDARD,
                        word_count_min=300,
                        word_count_max=500,
                        tone="descriptive, detailed, informative",
                        example_phrases=[
                            "Immaculate [property type] with [key feature]",
                            "beautifully finished", "elegantly designed",
                            "features sleek [material] and abundant natural light",
                            "Floor-to-ceiling glass doors open onto",
                            "Located within the vibrant [area] development",
                            "ideal for professionals, first-time buyers, or investors alike"
                        ],
                        structure_notes=(
                            "1. Opening: Property type + key feature + location\n"
                            "2. Reception/living: Layout, flooring, lighting, flow\n"
                            "3. Kitchen: Finishes, appliances, space, features\n"
                            "4. Bedrooms: Size, storage, views\n"
                            "5. Bathrooms: Fixtures, finishes\n"
                            "6. Outdoor space: Balcony, garden, terrace\n"
                            "7. Location benefits: Transport, amenities, lifestyle"
                        )
                    )
                ),
                TemplateType.PREMIUM: TemplateConfig(
                    template_type=TemplateType.PREMIUM,
                    page_count=10,
                    photo_count_min=10,
                    photo_count_max=15,
                    show_icons_header=False,
                    contact_page_position="second",
                    text_overlay_cover=True,
                    writing_style=WritingStyle(
                        template_type=TemplateType.PREMIUM,
                        word_count_min=150,
                        word_count_max=200,
                        tone="aspirational, minimal, lifestyle-focused",
                        example_phrases=[
                            "A truly unique [style] [property type]",
                            "artfully designed and thoughtfully presented",
                            "The views are stunning",
                            "bespoke luxury [feature]",
                            "artist commissioned décor",
                            "exceptional high standard"
                        ],
                        structure_notes=(
                            "1. Opening: Unique selling proposition\n"
                            "2. Overall impression: High-level features\n"
                            "3. Standout features: What makes it special\n"
                            "4. Lifestyle benefits: Views, ambiance, experience\n"
                            "5. Location context: Neighborhood character"
                        )
                    )
                )
            },
            template_selection_rules=[
                # Premium template for unique, high-value apartments
                TemplateSelectionRule(
                    property_character=PropertyCharacter.UNIQUE,
                    price_min=1000000,
                    property_types=["flat", "apartment", "penthouse", "loft"],
                    template_type=TemplateType.PREMIUM
                ),
                # Premium template for luxury properties
                TemplateSelectionRule(
                    property_character=PropertyCharacter.LUXURY,
                    price_min=2000000,
                    template_type=TemplateType.PREMIUM
                ),
                # Standard template for traditional properties
                TemplateSelectionRule(
                    property_character=PropertyCharacter.TRADITIONAL,
                    template_type=TemplateType.STANDARD
                ),
                # Standard template for family homes
                TemplateSelectionRule(
                    property_character=PropertyCharacter.TRADITIONAL,
                    bedrooms_min=2,
                    property_types=["house", "bungalow", "villa"],
                    template_type=TemplateType.STANDARD
                ),
                # Standard template for standard flats under £1M
                TemplateSelectionRule(
                    property_character=PropertyCharacter.TRADITIONAL,
                    price_max=1000000,
                    property_types=["flat", "apartment"],
                    template_type=TemplateType.STANDARD
                ),
            ],
            legal_disclaimer=(
                "Important Notice: Savills, its clients and any joint agents give notice that 1: They are not "
                "authorised to make or give any representations or warranties in relation to the property either "
                "here or elsewhere, either on their own behalf or on behalf of their client or otherwise. They "
                "assume no responsibility for any statement that may be made in these particulars. These particulars "
                "do not form part of any offer or contract and must not be relied upon as statements or representations "
                "of fact. 2: Any areas, measurements or distances are approximate. The text, photographs and plans are "
                "for guidance only and are not necessarily comprehensive. It should not be assumed that the property "
                "has all necessary planning, building regulation or other consents and Savills have not tested any "
                "services, equipment or facilities. Purchasers must satisfy themselves by inspection or otherwise."
            ),
            footer_branding="powered by FluxPro"
        )

        # Save to disk and cache
        self.save_agency_branding(savills)
        self._cache["savills"] = savills

    def get_agency_branding(self, agency_id: str) -> Optional[AgencyBranding]:
        """Get agency branding configuration"""
        # Check cache first
        if agency_id in self._cache:
            return self._cache[agency_id]

        # Load from disk
        file_path = self.templates_dir / f"{agency_id}.json"
        if file_path.exists():
            with open(file_path, "r") as f:
                data = json.load(f)
                branding = AgencyBranding(**data)
                self._cache[agency_id] = branding
                return branding

        return None

    def save_agency_branding(self, branding: AgencyBranding):
        """Save agency branding configuration"""
        file_path = self.templates_dir / f"{branding.agency_id}.json"
        with open(file_path, "w") as f:
            json.dump(branding.dict(), f, indent=2)

        # Update cache
        self._cache[branding.agency_id] = branding

    def select_template(
        self,
        agency_id: str,
        property_character: PropertyCharacter,
        price: Optional[int] = None,
        bedrooms: Optional[int] = None,
        property_type: Optional[str] = None
    ) -> TemplateType:
        """
        Automatically select appropriate template based on property characteristics
        """
        branding = self.get_agency_branding(agency_id)
        if not branding:
            return TemplateType.STANDARD  # Default fallback

        # Evaluate each rule and score matches
        best_match = None
        best_score = 0

        for rule in branding.template_selection_rules:
            score = 0

            # Character match (required)
            if rule.property_character != property_character:
                continue
            score += 10

            # Price range match
            if price is not None:
                if rule.price_min and price < rule.price_min:
                    continue
                if rule.price_max and price > rule.price_max:
                    continue
                score += 5

            # Bedrooms match
            if bedrooms is not None and (rule.bedrooms_min or rule.bedrooms_max):
                if rule.bedrooms_min and bedrooms < rule.bedrooms_min:
                    continue
                if rule.bedrooms_max and bedrooms > rule.bedrooms_max:
                    continue
                score += 3

            # Property type match
            if property_type and rule.property_types:
                if property_type.lower() not in [pt.lower() for pt in rule.property_types]:
                    continue
                score += 5

            # Update best match
            if score > best_score:
                best_score = score
                best_match = rule.template_type

        return best_match or TemplateType.STANDARD

    def save_logo(self, agency_id: str, logo_data: bytes, filename: str) -> str:
        """
        Save agency logo file
        Returns: Path to saved logo (relative to static directory)
        """
        # Create agency-specific logo directory
        agency_logo_dir = self.logos_dir / agency_id
        agency_logo_dir.mkdir(exist_ok=True)

        # Save logo file
        logo_path = agency_logo_dir / filename
        with open(logo_path, "wb") as f:
            f.write(logo_data)

        # Return relative path for use in branding config
        return f"logos/{agency_id}/{filename}"

    def get_logo_path(self, agency_id: str) -> Optional[Path]:
        """Get absolute path to agency logo"""
        branding = self.get_agency_branding(agency_id)
        if not branding or not branding.logo.logo_path:
            return None

        # Convert relative path to absolute
        return Path("./static") / branding.logo.logo_path

    def list_agencies(self) -> List[str]:
        """List all available agency IDs"""
        return list(self._cache.keys())


# Singleton instance
_service_instance = None

def get_template_service() -> AgencyTemplateService:
    """Get singleton template service instance"""
    global _service_instance
    if _service_instance is None:
        _service_instance = AgencyTemplateService()
    return _service_instance
