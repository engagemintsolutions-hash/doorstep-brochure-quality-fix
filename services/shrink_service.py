"""
Enhanced text compression service using Claude API for tone-aware shrinking.
Falls back to simple compression when Claude is unavailable.
"""
from typing import List, Optional
from backend.schemas import ShrinkResponse, ToneStyle, Channel
from services.claude_client import ClaudeClient
import logging

logger = logging.getLogger(__name__)


class ShrinkService:
    """
    Compresses property listing text while preserving tone and keywords.
    Uses Claude API for intelligent compression, falls back to simple trimming.
    """
    
    def __init__(self, claude_client: Optional[ClaudeClient] = None, required_keywords: List[str] = None):
        """
        Initialize shrink service.
        
        Args:
            claude_client: Optional Claude API client for intelligent compression
            required_keywords: Keywords that must be preserved during compression
        """
        self.claude_client = claude_client
        self.required_keywords = required_keywords or []
    
    async def compress(
        self,
        text: str,
        target_words: int,
        tone: Optional[ToneStyle] = None,
        channel: Optional[Channel] = None,
        preserve_keywords: List[str] = None
    ) -> ShrinkResponse:
        """
        Compress text to target word count while preserving tone and keywords.
        
        Args:
            text: Original text to compress
            target_words: Target word count
            tone: Writing tone to preserve (basic, punchy, boutique, premium, hybrid)
            channel: Publishing channel (rightmove, brochure, social, email)
            preserve_keywords: Additional keywords to preserve (merged with required_keywords)
            
        Returns:
            ShrinkResponse with compressed text and metrics
        """
        if preserve_keywords is None:
            preserve_keywords = []
        
        # Merge preserve_keywords with required_keywords
        all_keywords = list(set(preserve_keywords + self.required_keywords))
        
        original_word_count = len(text.split())
        
        # If already under target, return as-is
        if original_word_count <= target_words:
            return ShrinkResponse(
                original_text=text,
                compressed_text=text,
                original_word_count=original_word_count,
                compressed_word_count=original_word_count,
                compression_ratio=1.0
            )
        
        # Try Claude API compression if available
        if self.claude_client and self.claude_client.is_available():
            try:
                compressed_text = await self._compress_with_claude(
                    text=text,
                    target_words=target_words,
                    tone=tone,
                    channel=channel,
                    keywords=all_keywords
                )
            except Exception as e:
                logger.warning(f"Claude compression failed, falling back to simple: {e}")
                compressed_text = self._simple_compress(text, target_words, all_keywords)
        else:
            # Fall back to simple compression
            compressed_text = self._simple_compress(text, target_words, all_keywords)
        
        compressed_word_count = len(compressed_text.split())
        compression_ratio = (
            compressed_word_count / original_word_count
            if original_word_count > 0 else 1.0
        )
        
        return ShrinkResponse(
            original_text=text,
            compressed_text=compressed_text,
            original_word_count=original_word_count,
            compressed_word_count=compressed_word_count,
            compression_ratio=compression_ratio
        )
    
    async def _compress_with_claude(
        self,
        text: str,
        target_words: int,
        tone: Optional[ToneStyle],
        channel: Optional[Channel],
        keywords: List[str]
    ) -> str:
        """
        Use Claude API to intelligently compress text while maintaining tone.
        
        Args:
            text: Text to compress
            target_words: Target word count
            tone: Tone to maintain
            channel: Channel context
            keywords: Keywords to preserve
            
        Returns:
            Compressed text
        """
        # Build tone description
        tone_desc = self._get_tone_description(tone) if tone else "the same style"
        channel_desc = f" for {channel.value}" if channel else ""
        keywords_str = ", ".join(keywords) if keywords else "all key selling points"
        
        prompt = f"""You are a property listing copywriter. Compress the following property description to approximately {target_words} words while maintaining {tone_desc}{channel_desc}.

CRITICAL REQUIREMENTS:
1. Keep these keywords/features: {keywords_str}
2. Maintain the {tone_desc} tone throughout
3. Target length: {target_words} words (±10% acceptable)
4. Preserve the most compelling selling points
5. Keep full sentences - no awkward cuts
6. Do NOT add new information

Original text ({len(text.split())} words):
{text}

Provide ONLY the compressed version, nothing else:"""

        try:
            compressed = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=800,
                temperature=0.3
            )
            
            # Clean up any extra whitespace
            compressed = " ".join(compressed.split())
            
            return compressed
            
        except Exception as e:
            logger.error(f"Claude API compression failed: {e}")
            raise
    
    def _get_tone_description(self, tone: ToneStyle) -> str:
        """Get description for tone style."""
        tone_map = {
            ToneStyle.BASIC: "straightforward, factual",
            ToneStyle.PUNCHY: "energetic, sales-driven",
            ToneStyle.BOUTIQUE: "warm, lifestyle-focused",
            ToneStyle.PREMIUM: "polished, luxury",
            ToneStyle.HYBRID: "balanced, versatile"
        }
        return tone_map.get(tone, "professional")
    
    def _simple_compress(
        self,
        text: str,
        target_words: int,
        keywords: List[str]
    ) -> str:
        """
        Simple fallback compression: keeps sentences with keywords, trims rest.
        
        Args:
            text: Text to compress
            target_words: Target word count
            keywords: Keywords to preserve
            
        Returns:
            Compressed text
        """
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        if len(sentences) <= 2:
            # Too short to compress meaningfully
            return text
        
        # Always keep first and last sentences
        first_sentence = sentences[0]
        last_sentence = sentences[-1]
        middle_sentences = sentences[1:-1]
        
        # Score sentences by keyword presence
        scored_sentences = []
        for s in middle_sentences:
            score = sum(1 for kw in keywords if kw.lower() in s.lower())
            scored_sentences.append((score, s))
        
        # Sort by score (highest first)
        scored_sentences.sort(reverse=True, key=lambda x: x[0])
        
        # Build compressed text, adding sentences until we hit target
        compressed_parts = [first_sentence]
        current_words = len(first_sentence.split()) + len(last_sentence.split())
        
        for score, sentence in scored_sentences:
            sentence_words = len(sentence.split())
            if current_words + sentence_words <= target_words:
                compressed_parts.append(sentence)
                current_words += sentence_words
            else:
                # Stop adding sentences
                break
        
        compressed_parts.append(last_sentence)
        
        return '. '.join(compressed_parts) + '.'
