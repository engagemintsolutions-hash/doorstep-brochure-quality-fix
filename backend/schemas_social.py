"""
Pydantic schemas for social media repurpose endpoints.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum


class Platform(str, Enum):
    """Social media platforms"""
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"


class Strategy(str, Enum):
    """Content generation strategies"""
    HIGHLIGHT_FEATURE = "highlight_feature"
    LOCATION_APPEAL = "location_appeal"
    PRICE_VALUE = "price_value"


class Template(str, Enum):
    """Caption style templates"""
    CLASSIC = "classic"
    MODERN = "modern"
    MINIMAL = "minimal"


class RepurposeRequest(BaseModel):
    """Request to repurpose brochure to social media"""
    session_id: str = Field(..., description="Brochure session ID")
    platforms: List[Platform] = Field(..., description="Target platforms (Facebook, Instagram)")
    strategy: Strategy = Field(default=Strategy.HIGHLIGHT_FEATURE, description="Content strategy")
    template: Template = Field(default=Template.CLASSIC, description="Caption style template")


class CaptionVariant(BaseModel):
    """Single caption variant"""
    caption: str
    character_count: int
    word_count: int
    length: str  # 'short', 'medium', 'long'
    valid: bool
    guardrails: Dict


class PlatformPost(BaseModel):
    """Social media post for a single platform"""
    platform: str
    variants: List[CaptionVariant]
    hashtags: Dict[str, List[str]]
    image_requirements: Dict


class RepurposeResponse(BaseModel):
    """Response with social media posts"""
    session_id: str
    posts: List[PlatformPost]
    metadata: Dict = {}


class RegenerateRequest(BaseModel):
    """Request to regenerate specific variant"""
    session_id: str
    platform: Platform
    variant_length: str  # 'short', 'medium', 'long'
    strategy: Optional[Strategy] = None
    template: Optional[Template] = None


class HashtagRequest(BaseModel):
    """Request to regenerate hashtags"""
    session_id: str
    platform: Platform
    max_tags: int = Field(default=6, ge=3, le=10)
