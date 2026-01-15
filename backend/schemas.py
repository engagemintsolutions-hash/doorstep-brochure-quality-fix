"""
Pydantic schemas for request/response validation.
"""
# Force reload
from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Dict, Any
from enum import Enum


class PropertyType(str, Enum):
    """Property types."""
    DETACHED = "detached"
    SEMI_DETACHED = "semi-detached"
    TERRACED = "terraced"
    FLAT = "flat"
    BUNGALOW = "bungalow"
    COTTAGE = "cottage"
    HOUSE = "house"


class Condition(str, Enum):
    """Property condition."""
    EXCELLENT = "excellent"
    GOOD = "good"
    FAIR = "fair"
    NEEDS_WORK = "needs_work"


class Setting(str, Enum):
    """Location setting types."""
    URBAN = "urban"
    SUBURBAN = "suburban"
    RURAL = "rural"
    COASTAL = "coastal"
    VILLAGE = "village"


class AudienceType(str, Enum):
    """Target audience types."""
    FAMILIES = "families"
    PROFESSIONALS = "professionals"
    INVESTORS = "investors"
    RETIREES = "retirees"
    FIRST_TIME_BUYERS = "first_time_buyers"
    DOWNSIZERS = "downsizers"


class ToneStyle(str, Enum):
    """Writing tone styles."""
    BASIC = "basic"
    PUNCHY = "punchy"
    BOUTIQUE = "boutique"
    PREMIUM = "premium"
    HYBRID = "hybrid"


class Channel(str, Enum):
    """Publishing channels."""
    RIGHTMOVE = "rightmove"
    BROCHURE = "brochure"
    SOCIAL = "social"
    EMAIL = "email"


class PropertyData(BaseModel):
    """Property characteristics."""
    property_type: PropertyType
    bedrooms: int = Field(gt=0, le=20)
    bathrooms: int = Field(gt=0, le=10)
    size_sqft: Optional[int] = Field(None, gt=0)
    condition: Condition
    features: List[str] = Field(default_factory=list)
    epc_rating: Optional[str] = Field(None, pattern="^[A-G]$")


class LocationData(BaseModel):
    """Location information."""
    address: str
    setting: Setting
    proximity_notes: Optional[str] = None
    postcode: Optional[str] = None  # NEW: UK postcode for enrichment


class TargetAudience(BaseModel):
    """Target audience specification."""
    audience_type: AudienceType
    lifestyle_framing: Optional[str] = None


class TonePreset(BaseModel):
    """Tone configuration."""
    tone: ToneStyle


class ChannelPreset(BaseModel):
    """Channel-specific settings."""
    channel: Channel
    target_words: Optional[int] = Field(None, gt=0)
    hard_cap: Optional[int] = Field(None, gt=0)


class PhotoAssignments(BaseModel):
    """Photo category assignments for brochure pages."""
    cover: List[int] = Field(default_factory=list, description="Photo indices for cover page")
    exterior: List[int] = Field(default_factory=list, description="Photo indices for exterior shots")
    interior: List[int] = Field(default_factory=list, description="Photo indices for interior shots")
    kitchen: List[int] = Field(default_factory=list, description="Photo indices for kitchen")
    bedrooms: List[int] = Field(default_factory=list, description="Photo indices for bedrooms")
    bathrooms: List[int] = Field(default_factory=list, description="Photo indices for bathrooms")
    garden: List[int] = Field(default_factory=list, description="Photo indices for garden/outdoor")


class PhotoDescription(BaseModel):
    """Vision analysis result for a single photo."""
    filename: str = Field(description="Original filename")
    category: str = Field(description="Detected category (e.g., kitchen, bedroom, exterior)")
    attributes: List[str] = Field(default_factory=list, description="Detected features (e.g., 'marble countertops', 'bay window')")
    caption: Optional[str] = Field(default=None, description="AI-generated descriptive caption")
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0, description="Confidence score")


class PhotoAnalysisData(BaseModel):
    """Collection of photo analysis results."""
    photos: List[PhotoDescription] = Field(default_factory=list, description="Analysis for each uploaded photo")


class BrochureSectionPhoto(BaseModel):
    """Photo assigned to a brochure section with analysis."""
    filename: str = Field(description="Photo filename")
    category: str = Field(description="Photo category")
    attributes: List[str] = Field(default_factory=list, description="Visual attributes detected")
    caption: Optional[str] = Field(default=None, description="AI-generated caption")


class BrochureSection(BaseModel):
    """A section of the brochure with assigned photos."""
    name: str = Field(description="Section name (e.g., 'Living Spaces')")
    desiredCategories: List[str] = Field(default_factory=list, description="Photo categories this section wants")
    maxPhotos: int = Field(description="Maximum number of photos for this section")
    photos: List[BrochureSectionPhoto] = Field(default_factory=list, description="Photos assigned to this section")


class BrochureSections(BaseModel):
    """All brochure sections with photo assignments."""
    introduction: Optional[BrochureSection] = None
    living_spaces: Optional[BrochureSection] = None
    kitchen_dining: Optional[BrochureSection] = None
    bedrooms: Optional[BrochureSection] = None
    bathrooms: Optional[BrochureSection] = None
    garden_exterior: Optional[BrochureSection] = None


class GenerateRequest(BaseModel):
    """Request to generate property copy."""
    property_data: PropertyData
    location_data: LocationData
    target_audience: TargetAudience
    tone: TonePreset
    channel: ChannelPreset
    include_enrichment: bool = False  # Enable location enrichment
    include_compliance: bool = True  # Enable compliance checking
    brand: Optional[str] = Field(default="generic", description="Estate agent brand (generic, savills)")
    typography_style: Optional[str] = Field(default="classic", description="Typography style (classic, modern, luxury, boutique)")
    orientation: Optional[str] = Field(default="landscape", description="Brochure orientation (landscape, portrait)")
    photo_assignments: Optional[PhotoAssignments] = Field(default=None, description="Photo category assignments for brochure pages")
    photo_analysis: Optional[PhotoAnalysisData] = Field(default=None, description="Vision AI analysis of uploaded photos")
    brochure_sections: Optional[Dict[str, Any]] = Field(default=None, description="Section-specific photo mappings for coordinated text generation")


class GeneratedVariant(BaseModel):
    """A single generated variant."""
    variant_id: int
    headline: str
    full_text: str
    word_count: int
    key_features: List[str]
    score: float = Field(ge=0.0, le=1.0)


class ComplianceWarning(BaseModel):
    """Individual compliance warning."""
    severity: str = Field(..., pattern="^(error|warning|info)$")
    message: str
    suggestion: Optional[str] = None


class KeywordCoverageResult(BaseModel):
    """Keyword coverage analysis result."""
    covered_keywords: List[str]
    missing_keywords: List[str]
    coverage_score: float = Field(ge=0.0, le=1.0)
    suggestions: List[str]


class ComplianceCheckRequest(BaseModel):
    """Request for compliance checking."""
    text: str
    channel: Channel
    property_data: Optional[PropertyData] = None


class ComplianceCheckResponse(BaseModel):
    """Compliance check results."""
    compliant: bool
    warnings: List[ComplianceWarning]
    compliance_score: float = Field(ge=0.0, le=1.0)
    keyword_coverage: KeywordCoverageResult
    suggestions: List[str]


class GenerateResponse(BaseModel):
    """Response with generated variants."""
    variants: List[GeneratedVariant]
    metadata: Dict[str, Any]
    compliance: Optional[ComplianceCheckResponse] = None


class ShrinkRequest(BaseModel):
    """Request to compress text."""
    text: str
    target_words: int = Field(gt=0)
    tone: Optional[ToneStyle] = None
    channel: Optional[Channel] = None
    preserve_keywords: List[str] = Field(default_factory=list)


class ShrinkResponse(BaseModel):
    """Compressed text response."""
    original_text: str
    compressed_text: str
    original_word_count: int
    compressed_word_count: int
    compression_ratio: float


class ImageAnalysisRequest(BaseModel):
    """Request for image analysis (multipart handled separately)."""
    pass


class ImageAttribute(BaseModel):
    """Detected image attribute."""
    attribute: str
    confidence: float = Field(ge=0.0, le=1.0)
    description: str


class ImageAnalysisResponse(BaseModel):
    """Image analysis results."""
    filename: str
    room_type: Optional[str] = None
    attributes: List[ImageAttribute]
    suggested_caption: str


class EnrichmentRequest(BaseModel):
    """Request for location enrichment."""
    postcode: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class POIResult(BaseModel):
    """Point of interest result."""
    name: str
    distance_miles: float


class EnrichmentResponse(BaseModel):
    """Location enrichment results."""
    postcode: Optional[str]
    coordinates: Optional[Dict[str, float]]
    amenities: Dict[str, int]
    nearest: Dict[str, POIResult]
    highlights: List[str]
    descriptors: Dict[str, str]


class PostcodeAutocompleteRequest(BaseModel):
    """Request for postcode autocomplete."""
    postcode: str = Field(..., description="Partial or full UK postcode (e.g., 'M1 4', 'SW1A 1AA')")


class AddressSuggestion(BaseModel):
    """Single address suggestion from postcode."""
    postcode: str
    district: Optional[str] = ""
    county: Optional[str] = ""
    latitude: float
    longitude: float

    @model_validator(mode='before')
    def convert_none_to_empty(cls, values):
        """Convert None values to empty strings for district and county."""
        if isinstance(values, dict):
            if values.get('district') is None:
                values['district'] = ""
            if values.get('county') is None:
                values['county'] = ""
        return values


class PostcodeAutocompleteResponse(BaseModel):
    """Response containing address suggestions."""
    addresses: List[AddressSuggestion]


class AddressLookupRequest(BaseModel):
    """Request for full address lookup."""
    postcode: str = Field(..., description="Full UK postcode (e.g., 'GU6 7HH', 'M1 4BT')")


class FullAddress(BaseModel):
    """Full address details from Ideal Postcodes."""
    line_1: str
    line_2: Optional[str] = ""
    line_3: Optional[str] = ""
    post_town: str
    postcode: str
    county: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    formatted: str  # Single-line formatted address


class AddressLookupResponse(BaseModel):
    """Response containing full addresses for a postcode."""
    addresses: List[FullAddress]


class ComplianceWarning(BaseModel):
    """Individual compliance warning."""
    severity: str = Field(..., pattern="^(error|warning|info)$")
    message: str
    suggestion: Optional[str] = None


class KeywordCoverageResult(BaseModel):
    """Keyword coverage analysis result."""
    covered_keywords: List[str]
    missing_keywords: List[str]
    coverage_score: float = Field(ge=0.0, le=1.0)
    suggestions: List[str]


class ComplianceCheckRequest(BaseModel):
    """Request for compliance checking."""
    text: str
    channel: Channel
    property_data: Optional[PropertyData] = None


class ComplianceCheckResponse(BaseModel):
    """Compliance check results."""
    compliant: bool
    warnings: List[ComplianceWarning]
    compliance_score: float = Field(ge=0.0, le=1.0)
    keyword_coverage: KeywordCoverageResult
    suggestions: List[str]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str = "1.0.0"


# ============================================================================
# COLLABORATION SCHEMAS
# ============================================================================

class UserSession(BaseModel):
    """Active user session."""
    user_email: str
    user_name: Optional[str] = None
    last_seen: float = Field(description="Unix timestamp of last heartbeat")


class BrochureState(BaseModel):
    """Complete brochure state for handoff."""
    # Form data
    property_data: Optional[PropertyData] = None
    location_data: Optional[LocationData] = None
    target_audience: Optional[TargetAudience] = None
    tone: Optional[TonePreset] = None
    channel: Optional[ChannelPreset] = None
    brand: Optional[str] = None
    typography_style: Optional[str] = None
    orientation: Optional[str] = None

    # Photo data
    uploaded_photos: List[Dict[str, Any]] = Field(default_factory=list, description="Photo metadata and data URLs")
    photo_assignments: Optional[PhotoAssignments] = None
    photo_analysis: Optional[PhotoAnalysisData] = None

    # Generated content
    generated_variants: Optional[List[GeneratedVariant]] = None
    selected_variant_id: Optional[int] = None
    custom_text: Optional[str] = None

    # Metadata
    address: Optional[str] = None
    price: Optional[str] = None


class ShareBrochureRequest(BaseModel):
    """Request to share brochure with another user."""
    recipient_email: str
    sender_name: Optional[str] = None
    brochure_state: BrochureState
    message: Optional[str] = None


class HandoffNotification(BaseModel):
    """Notification of pending brochure handoff."""
    handoff_id: str
    sender_email: str
    sender_name: Optional[str] = None
    timestamp: float
    address: Optional[str] = None
    message: Optional[str] = None


class PendingHandoffsResponse(BaseModel):
    """List of pending handoffs for a user."""
    handoffs: List[HandoffNotification]


class AcceptHandoffResponse(BaseModel):
    """Response after accepting a handoff."""
    brochure_state: BrochureState
    sender_email: str
    sender_name: Optional[str] = None


class HeartbeatRequest(BaseModel):
    """Heartbeat to keep session alive."""
    user_email: str
    user_name: Optional[str] = None


class ActiveUsersResponse(BaseModel):
    """List of currently active users."""
    users: List[UserSession]


# ============================================================================
# BROCHURE EDITOR SESSION SCHEMAS
# ============================================================================

from datetime import datetime


class BrochurePhoto(BaseModel):
    """Single photo in brochure with base64 data."""
    id: str = Field(description="Unique photo identifier")
    name: str = Field(description="Original filename")
    category: str = Field(description="Photo category (cover, exterior, interior, kitchen, bedrooms, bathrooms, garden)")
    dataUrl: str = Field(description="Base64 data URL (data:image/jpeg;base64,...)")
    caption: Optional[str] = Field(default=None, description="Photo caption")
    width: Optional[int] = Field(default=None, description="Image width in pixels")
    height: Optional[int] = Field(default=None, description="Image height in pixels")
    analysis: Optional[Dict[str, Any]] = Field(default=None, description="Vision AI analysis: {attributes: [...], caption: str, room_type: str}")
    impact_score: Optional[float] = Field(default=None, description="Photo impact score 0-100 (higher = better for hero page)")


class BrochurePage(BaseModel):
    """Single page in brochure."""
    id: str = Field(description="Unique page identifier")
    type: str = Field(description="Page type (cover, details, gallery, location, etc.)")
    title: str = Field(description="Page title")
    photos: List[BrochurePhoto] = Field(default_factory=list, description="Photos on this page")
    content: Dict[str, Any] = Field(default_factory=dict, description="Page content (flexible structure)")
    order: int = Field(description="Page order (0-based)")


class BrochureSessionData(BaseModel):
    """Complete brochure state for session storage."""
    session_id: Optional[str] = Field(default=None, description="Session identifier (set by server)")
    user_email: str = Field(description="User who created the session")
    property: Dict[str, Any] = Field(description="Property data from UnifiedBrochureState")
    agent: Dict[str, Any] = Field(description="Agent data from UnifiedBrochureState")
    photos: List[BrochurePhoto] = Field(default_factory=list, description="All photos")
    pages: List[BrochurePage] = Field(default_factory=list, description="All pages")
    preferences: Dict[str, Any] = Field(default_factory=dict, description="User preferences")
    created_at: Optional[datetime] = Field(default=None, description="Session creation time")
    updated_at: Optional[datetime] = Field(default=None, description="Last update time")
    expires_at: Optional[datetime] = Field(default=None, description="Session expiry time")

    # Usage tracking for API cost management
    usage_stats: Dict[str, Any] = Field(default_factory=lambda: {
        "initial_generation_cost": 0.183,  # USD
        "edits_count": 0,
        "transforms_count": 0,
        "photo_analyses_count": 0,
        "total_cost_usd": 0.183,
        "edit_limit": 100,
        "edit_limit_reached": False
    }, description="API usage and cost tracking")


class BrochureSessionResponse(BaseModel):
    """Response when creating/loading session."""
    session_id: str = Field(description="Unique session identifier")
    expires_at: datetime = Field(description="When session will expire")
    photo_urls: Dict[str, str] = Field(description="Mapping of photo_id to URL path")
    data: Optional[BrochureSessionData] = Field(default=None, description="Full session data (on load)")


class BrochureSessionCreateRequest(BaseModel):
    """Request to create new brochure editing session."""
    user_email: str
    property: Dict[str, Any]
    agent: Dict[str, Any]
    photos: List[BrochurePhoto]
    pages: List[BrochurePage]
    preferences: Dict[str, Any] = Field(default_factory=dict)


# ============================================================================
# TEXT TRANSFORMATION / CHATBOT SCHEMAS
# ============================================================================

class TextTransformationStyle(str, Enum):
    """Text transformation styles for the chatbot."""
    PARAGRAPH = "paragraph"  # Standard prose format
    BULLET_POINTS = "bullet_points"  # Bullet point list
    KEY_FEATURES = "key_features"  # Highlighted key features
    CONCISE = "concise"  # Shorter, punchy version
    ELABORATE = "elaborate"  # Longer, more detailed version
    PROFESSIONAL = "professional"  # Formal, professional tone
    FRIENDLY = "friendly"  # Warm, approachable tone
    LUXURY = "luxury"  # Luxury/boutique/lifestyle tone
    BOUTIQUE = "boutique"  # Boutique/lifestyle aspirational tone
    LIFESTYLE = "lifestyle"  # Lifestyle-focused aspirational tone
    STRAIGHTFORWARD = "straightforward"  # Basic, straightforward, factual
    FACTUAL = "factual"  # Pure facts, no embellishment


class TextTransformRequest(BaseModel):
    """Request to transform text content."""
    original_text: str = Field(description="Original text to transform")
    page_title: str = Field(description="Page title for context")
    transformation_style: TextTransformationStyle = Field(description="Desired transformation style")
    custom_instruction: Optional[str] = Field(default=None, description="Additional custom instructions")
    page_type: Optional[str] = Field(default=None, description="Type of page (e.g., 'kitchen', 'bedroom')")
    session_id: Optional[str] = Field(default=None, description="Brochure session ID for usage tracking")


class TextTransformResponse(BaseModel):
    """Response with transformed text and before/after comparison."""
    original_text: str = Field(description="Original text before transformation")
    transformed_text: str = Field(description="Transformed text after AI processing")
    transformation_style: TextTransformationStyle = Field(description="Style used for transformation")
    preview_message: str = Field(description="User-friendly message describing the changes")
    success: bool = Field(default=True, description="Whether transformation succeeded")


# ============================================================================
# REPURPOSE / CONTENT GENERATION SCHEMAS
# ============================================================================

class RepurposeRequest(BaseModel):
    """Request to repurpose brochure content for different platforms."""
    session_id: str = Field(description="Brochure session ID to repurpose from")
    platforms: List[str] = Field(description="List of platforms: 'rightmove', 'zoopla', 'onthemarket', 'facebook', 'instagram', 'linkedin', 'email'")


class PlatformContent(BaseModel):
    """Content generated for a specific platform."""
    platform: str = Field(description="Platform name")
    headline: str = Field(description="Headline/title for the listing")
    description: str = Field(description="Main description text")
    key_features: List[str] = Field(description="Key features list")
    hashtags: Optional[List[str]] = Field(default=None, description="Hashtags (for social media)")
    call_to_action: Optional[str] = Field(default=None, description="CTA text")
    character_count: int = Field(description="Total character count")
    word_count: int = Field(description="Total word count")


class RepurposeResponse(BaseModel):
    """Response with repurposed content for all requested platforms."""
    session_id: str = Field(description="Source brochure session ID")
    content: Dict[str, PlatformContent] = Field(description="Generated content per platform")
    total_cost_usd: float = Field(description="Total API cost for this repurpose operation")
    success: bool = Field(default=True, description="Whether repurposing succeeded")


# ============================================================================
# QUICK SOCIAL POST SCHEMAS
# ============================================================================

class QuickSocialPostRequest(BaseModel):
    """Request for quick social media post generation."""
    address: str = Field(description="Property address")
    price: str = Field(description="Property price")
    bedrooms: Optional[int] = Field(default=None, description="Number of bedrooms")
    bathrooms: Optional[int] = Field(default=None, description="Number of bathrooms")
    highlights: Optional[str] = Field(default=None, description="Key property highlights")
    platform: str = Field(description="Social media platform: instagram, facebook, linkedin, twitter")
    photos: List[str] = Field(description="Base64 encoded photo data URLs")


class SocialPostVariant(BaseModel):
    """A single social media caption variant."""
    text: str = Field(description="Caption text")
    character_count: int = Field(description="Character count")
    hashtags: Optional[List[str]] = Field(default=None, description="Suggested hashtags")


class QuickSocialPostResponse(BaseModel):
    """Response with 3 caption variants for quick social post."""
    variants: List[SocialPostVariant] = Field(description="3 caption variants with different tones")
    hashtags: List[str] = Field(default_factory=list, description="Recommended hashtags for the post")
    success: bool = Field(default=True, description="Whether generation succeeded")


# Background Removal Schemas
class BackgroundRemovalRequest(BaseModel):
    """Request to remove background from an image."""
    image: str = Field(description="Base64 encoded image data (with or without data URL prefix)")
    alpha_matting: bool = Field(default=False, description="Enable alpha matting for softer edges")
    foreground_threshold: int = Field(default=240, ge=0, le=255, description="Foreground threshold (0-255)")
    background_threshold: int = Field(default=10, ge=0, le=255, description="Background threshold (0-255)")


class BackgroundRemovalResponse(BaseModel):
    """Response with background-removed image."""
    success: bool = Field(default=True, description="Whether removal succeeded")
    image: str = Field(description="Base64 encoded PNG with transparent background")
    original_size: List[int] = Field(description="Original image dimensions [width, height]")
    processed_size: List[int] = Field(description="Processed image dimensions [width, height]")
    was_resized: bool = Field(description="Whether image was resized during processing")
    error: Optional[str] = Field(default=None, description="Error message if failed")
