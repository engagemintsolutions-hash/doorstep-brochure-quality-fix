"""
Computer vision adapter for property image analysis.
"""
from typing import List, Dict
from backend.schemas import ImageAnalysisResponse, ImageAttribute
from providers import VisionClient
from PIL import Image
from io import BytesIO
import logging

logger = logging.getLogger(__name__)


class ValidationError(Exception):
    """Raised when image validation fails."""
    pass


class VisionAdapter:
    """
    Analyzes property images using configurable vision providers.
    
    Handles:
    - File validation (size, type)
    - EXIF orientation correction
    - Provider-based analysis
    """
    
    def __init__(
        self,
        vision_client: VisionClient,
        max_size_mb: int = 8,
        allowed_types: List[str] = None
    ):
        """
        Initialize vision adapter.
        
        Args:
            vision_client: VisionClient implementation (mock or real provider)
            max_size_mb: Maximum file size in MB
            allowed_types: List of allowed file extensions
        """
        self.vision_client = vision_client
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.allowed_types = allowed_types or ["jpg", "jpeg", "png", "webp"]
        logger.info(
            f"Initialized VisionAdapter: max_size={max_size_mb}MB, "
            f"types={','.join(self.allowed_types)}"
        )
    
    async def analyze_image(
        self,
        image_data: bytes,
        filename: str
    ) -> ImageAnalysisResponse:
        """
        Analyze a property image.
        
        Args:
            image_data: Raw image bytes
            filename: Original filename
            
        Returns:
            ImageAnalysisResponse with detected attributes and caption
            
        Raises:
            ValidationError: If image validation fails
        """
        logger.debug(f"Analyzing image: {filename}")
        
        # Validate file
        self._validate_file_type(filename)
        self._validate_file_size(image_data)
        
        # Handle EXIF rotation
        corrected_image_data = self._correct_exif_orientation(image_data)
        
        # Analyze with provider
        try:
            analysis = await self.vision_client.analyze_image(
                corrected_image_data,
                filename
            )
            
            # Convert to response schema
            return self._convert_to_response(analysis)
            
        except Exception as e:
            logger.error(f"Vision analysis failed for {filename}: {str(e)}")
            raise
    
    def _validate_file_type(self, filename: str) -> None:
        """
        Validate file extension.
        
        Args:
            filename: Filename to validate
            
        Raises:
            ValidationError: If file type not allowed
        """
        extension = filename.lower().split('.')[-1] if '.' in filename else ''
        
        if extension not in self.allowed_types:
            raise ValidationError(
                f"File type '.{extension}' not allowed. "
                f"Allowed types: {', '.join(self.allowed_types)}"
            )
        
        logger.debug(f"File type validated: .{extension}")
    
    def _validate_file_size(self, image_data: bytes) -> None:
        """
        Validate file size.
        
        Args:
            image_data: Image bytes
            
        Raises:
            ValidationError: If file too large
        """
        size_bytes = len(image_data)
        
        if size_bytes > self.max_size_bytes:
            size_mb = size_bytes / (1024 * 1024)
            max_mb = self.max_size_bytes / (1024 * 1024)
            raise ValidationError(
                f"File size {size_mb:.2f}MB exceeds maximum {max_mb:.0f}MB"
            )
        
        logger.debug(f"File size validated: {size_bytes / 1024:.2f}KB")
    
    def _correct_exif_orientation(self, image_data: bytes) -> bytes:
        """
        Correct image orientation based on EXIF data.
        
        Args:
            image_data: Original image bytes
            
        Returns:
            Corrected image bytes
        """
        try:
            # Open image with PIL
            image = Image.open(BytesIO(image_data))
            
            # Check for EXIF orientation tag
            if hasattr(image, '_getexif') and image._getexif() is not None:
                exif = image._getexif()
                orientation = exif.get(0x0112)  # Orientation tag
                
                # Apply rotation based on orientation
                if orientation == 3:
                    image = image.rotate(180, expand=True)
                    logger.debug("Applied EXIF rotation: 180°")
                elif orientation == 6:
                    image = image.rotate(270, expand=True)
                    logger.debug("Applied EXIF rotation: 270°")
                elif orientation == 8:
                    image = image.rotate(90, expand=True)
                    logger.debug("Applied EXIF rotation: 90°")
                else:
                    logger.debug("No EXIF rotation needed")
            
            # Convert back to bytes
            output = BytesIO()
            image_format = image.format or 'JPEG'
            image.save(output, format=image_format)
            return output.getvalue()
            
        except Exception as e:
            logger.warning(f"EXIF correction failed, using original: {str(e)}")
            return image_data
    
    def _convert_to_response(self, analysis: Dict) -> ImageAnalysisResponse:
        """
        Convert provider analysis to response schema.
        
        Args:
            analysis: Raw analysis dict from provider
            
        Returns:
            ImageAnalysisResponse
        """
        # Combine features and finishes into attributes
        attributes = []
        
        # Add detected features
        for feature in analysis.get("detected_features", []):
            attributes.append(
                ImageAttribute(
                    attribute=feature.replace("_", " ").title(),
                    confidence=0.85,
                    description=f"Detected: {feature.replace('_', ' ')}"
                )
            )
        
        # Add finishes
        for finish in analysis.get("finishes", []):
            attributes.append(
                ImageAttribute(
                    attribute=finish.replace("_", " ").title(),
                    confidence=0.80,
                    description=f"Finish: {finish.replace('_', ' ')}"
                )
            )
        
        # Add light level as attribute
        light_level = analysis.get("light_level", "moderate")
        attributes.append(
            ImageAttribute(
                attribute=f"{light_level.title()} Lighting",
                confidence=0.75,
                description=f"Light level: {light_level}"
            )
        )
        
        # Add view hint if present
        if analysis.get("view_hint"):
            view_hint = analysis["view_hint"]
            attributes.append(
                ImageAttribute(
                    attribute=view_hint.replace("_", " ").title(),
                    confidence=0.70,
                    description=f"View: {view_hint.replace('_', ' ')}"
                )
            )
        
        # Validate caption length (8-20 words)
        caption = analysis.get("suggested_caption", "Well presented space")
        word_count = len(caption.split())
        
        if word_count < 8 or word_count > 20:
            logger.warning(
                f"Caption word count {word_count} outside range 8-20, adjusting"
            )
            words = caption.split()
            if word_count < 8:
                caption += " with quality finishes throughout"
            elif word_count > 20:
                caption = " ".join(words[:20])
        
        return ImageAnalysisResponse(
            filename=analysis["filename"],
            room_type=analysis.get("room_type", "unknown"),
            attributes=attributes[:8],  # Limit to top 8 attributes
            suggested_caption=caption
        )

