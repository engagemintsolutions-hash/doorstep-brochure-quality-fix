"""
Vision client protocol and factory.
"""
from typing import Protocol, Dict, List
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class VisionProvider(Enum):
    """Supported vision providers."""
    MOCK = "mock"
    GOOGLE = "google"
    CLAUDE = "claude"


class VisionClient(Protocol):
    """
    Protocol for vision analysis clients.
    
    All providers must implement this interface.
    """
    
    async def analyze_image(self, image_bytes: bytes, filename: str) -> Dict:
        """
        Analyze a property image and return structured data.
        
        Args:
            image_bytes: Raw image data
            filename: Original filename (used for context)
            
        Returns:
            Dictionary with:
                - filename: str - Original filename
                - room_type: str - Room classification (kitchen, bedroom, etc.)
                - detected_features: List[str] - Physical features detected
                - finishes: List[str] - Surface finishes and materials
                - light_level: str - Lighting assessment (bright, moderate, dim)
                - view_hint: str | None - View description if applicable
                - interior: bool - Interior vs exterior
                - orientation_hint: str | None - Compass direction if detectable
                - suggested_caption: str - 8-20 word caption
        """
        ...


def make_vision_client(provider: VisionProvider, config: dict) -> VisionClient:
    """
    Factory function to create appropriate vision client.
    
    Args:
        provider: VisionProvider enum value
        config: Configuration dict with provider-specific settings
        
    Returns:
        VisionClient implementation
        
    Raises:
        ValueError: If provider is not supported
        RuntimeError: If provider initialization fails
    """
    logger.info(f"Creating vision client: {provider.value}")
    
    if provider == VisionProvider.MOCK:
        from providers.vision_mock import VisionMockClient
        return VisionMockClient()
    
    elif provider == VisionProvider.GOOGLE:
        from providers.vision_google import VisionGoogleClient
        credentials_path = config.get("google_credentials_path")
        if not credentials_path:
            logger.warning("Google credentials not configured, falling back to mock")
            from providers.vision_mock import VisionMockClient
            return VisionMockClient()
        return VisionGoogleClient(credentials_path=credentials_path)

    elif provider == VisionProvider.CLAUDE:
        from providers.vision_claude import VisionClaudeClient
        api_key = config.get("anthropic_api_key")
        if not api_key:
            logger.warning("Anthropic API key not configured, falling back to mock")
            from providers.vision_mock import VisionMockClient
            return VisionMockClient()
        rate_limiter = config.get("rate_limiter")  # Optional rate limiter
        return VisionClaudeClient(api_key=api_key, rate_limiter=rate_limiter)

    else:
        raise ValueError(f"Unsupported vision provider: {provider}")
