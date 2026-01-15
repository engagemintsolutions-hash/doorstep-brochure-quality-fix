"""
Length policy management for different channels.
"""
from typing import Dict, Tuple, Optional
from backend.schemas import Channel


class LengthPolicy:
    """
    Manages word count targets and limits for different publishing channels.
    """
    
    # Default targets: (target_words, hard_cap)
    CHANNEL_DEFAULTS: Dict[Channel, Tuple[int, int]] = {
        Channel.RIGHTMOVE: (65, 80),
        Channel.BROCHURE: (450, 600),
        Channel.SOCIAL: (30, 40),
        Channel.EMAIL: (100, 120),
    }
    
    def __init__(self):
        """Initialize the length policy manager."""
        pass
    
    def get_target_for_channel(self, channel: Channel) -> Tuple[int, int]:
        """
        Get target word count and hard cap for a channel.
        
        Args:
            channel: Publishing channel
            
        Returns:
            Tuple of (target_words, hard_cap)
        """
        return self.CHANNEL_DEFAULTS.get(channel, (150, 200))
    
    def validate_length(
        self,
        text: str,
        channel: Channel,
        custom_target: Optional[int] = None,
        custom_cap: Optional[int] = None
    ) -> Dict[str, any]:
        """
        Validate text length against channel policy.
        
        Args:
            text: Text to validate
            channel: Target channel
            custom_target: Custom target word count (overrides default)
            custom_cap: Custom hard cap (overrides default)
            
        Returns:
            Dict with validation results:
                - word_count: Actual word count
                - target_words: Target word count
                - hard_cap: Maximum allowed words
                - within_target: Bool if within target range
                - within_cap: Bool if under hard cap
                - needs_compression: Bool if exceeds hard cap
        """
        word_count = len(text.split())
        target, cap = self.get_target_for_channel(channel)
        
        # Apply custom overrides
        if custom_target is not None:
            target = custom_target
        if custom_cap is not None:
            cap = custom_cap
        
        # Allow 10% variance on target
        target_min = int(target * 0.9)
        target_max = int(target * 1.1)
        
        return {
            "word_count": word_count,
            "target_words": target,
            "hard_cap": cap,
            "within_target": target_min <= word_count <= target_max,
            "within_cap": word_count <= cap,
            "needs_compression": word_count > cap,
        }
    
    def get_compression_factor(
        self,
        current_words: int,
        target_words: int
    ) -> float:
        """
        Calculate how much compression is needed.
        
        Args:
            current_words: Current word count
            target_words: Desired word count
            
        Returns:
            Compression factor (e.g., 0.8 means reduce to 80%)
        """
        if current_words == 0:
            return 1.0
        return target_words / current_words
