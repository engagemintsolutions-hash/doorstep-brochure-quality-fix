"""
Background Removal Service using rembg.
AI-powered background removal for property photos.
"""
import logging
import io
import base64
from PIL import Image
from typing import Optional, Tuple

logger = logging.getLogger(__name__)

# Lazy load rembg to avoid import overhead
_rembg_session = None

def get_rembg_session():
    """Lazy load rembg session for better startup time."""
    global _rembg_session
    if _rembg_session is None:
        try:
            from rembg import new_session
            # Use u2net model - best quality for general images
            _rembg_session = new_session("u2net")
            logger.info("rembg session initialized with u2net model")
        except ImportError:
            logger.error("rembg not installed. Run: pip install rembg[cpu]")
            raise
        except Exception as e:
            logger.error(f"Failed to initialize rembg: {e}")
            raise
    return _rembg_session


class BackgroundRemover:
    """Service for removing backgrounds from images using AI."""

    def __init__(self):
        self.max_size = (2048, 2048)  # Max dimensions to process
        self.quality = 95  # PNG compression quality

    def remove_background(
        self,
        image_base64: str,
        alpha_matting: bool = False,
        foreground_threshold: int = 240,
        background_threshold: int = 10
    ) -> Tuple[str, dict]:
        """
        Remove background from an image.

        Args:
            image_base64: Base64 encoded image data
            alpha_matting: Enable alpha matting for softer edges
            foreground_threshold: Threshold for foreground (0-255)
            background_threshold: Threshold for background (0-255)

        Returns:
            Tuple of (result_base64, metadata)
        """
        try:
            from rembg import remove

            # Decode input image
            if ',' in image_base64:
                # Handle data URL format
                image_base64 = image_base64.split(',')[1]

            image_data = base64.b64decode(image_base64)
            input_image = Image.open(io.BytesIO(image_data))

            # Store original format and size
            original_format = input_image.format or 'PNG'
            original_size = input_image.size
            original_mode = input_image.mode

            logger.info(f"Processing image: {original_size[0]}x{original_size[1]}, mode={original_mode}")

            # Convert to RGB if needed (rembg works best with RGB)
            if input_image.mode == 'RGBA':
                # Keep RGBA
                pass
            elif input_image.mode != 'RGB':
                input_image = input_image.convert('RGB')

            # Resize if too large (to speed up processing)
            was_resized = False
            if input_image.width > self.max_size[0] or input_image.height > self.max_size[1]:
                input_image.thumbnail(self.max_size, Image.Resampling.LANCZOS)
                was_resized = True
                logger.info(f"Resized to {input_image.size[0]}x{input_image.size[1]} for processing")

            # Get rembg session
            session = get_rembg_session()

            # Remove background
            output_image = remove(
                input_image,
                session=session,
                alpha_matting=alpha_matting,
                alpha_matting_foreground_threshold=foreground_threshold,
                alpha_matting_background_threshold=background_threshold
            )

            # Ensure output is RGBA for transparency
            if output_image.mode != 'RGBA':
                output_image = output_image.convert('RGBA')

            # Encode result as PNG (preserves transparency)
            buffer = io.BytesIO()
            output_image.save(buffer, format='PNG', optimize=True)
            result_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Metadata about the processing
            metadata = {
                'original_size': original_size,
                'processed_size': output_image.size,
                'was_resized': was_resized,
                'original_format': original_format,
                'output_format': 'PNG',
                'has_transparency': True
            }

            logger.info(f"Background removed successfully. Output size: {len(result_base64)} bytes")

            return result_base64, metadata

        except ImportError:
            logger.error("rembg library not available")
            raise RuntimeError("Background removal service not available. Please install rembg.")
        except Exception as e:
            logger.error(f"Background removal failed: {e}")
            raise


# Singleton instance
_background_remover = None

def get_background_remover() -> BackgroundRemover:
    """Get singleton BackgroundRemover instance."""
    global _background_remover
    if _background_remover is None:
        _background_remover = BackgroundRemover()
    return _background_remover
