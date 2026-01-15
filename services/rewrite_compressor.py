"""
Text compression service that maintains quality while reducing word count.
"""
from typing import List
from backend.schemas import ShrinkResponse


class RewriteCompressor:
    """
    Compresses text to target word count while preserving meaning and quality.
    """
    
    def __init__(self):
        """Initialize the compressor."""
        pass
    
    async def compress(
        self,
        text: str,
        target_words: int,
        preserve_keywords: List[str] = None
    ) -> ShrinkResponse:
        """
        Compress text to target word count.
        
        Args:
            text: Original text
            target_words: Target word count
            preserve_keywords: Keywords that must be preserved
            
        Returns:
            ShrinkResponse with compressed text and metrics
        """
        if preserve_keywords is None:
            preserve_keywords = []
        
        original_word_count = len(text.split())
        
        # Mock compression: simple sentence removal
        compressed_text = self._mock_compress(text, target_words, preserve_keywords)
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
    
    def _mock_compress(
        self,
        text: str,
        target_words: int,
        preserve_keywords: List[str]
    ) -> str:
        """
        Mock compression logic.
        
        Keeps first and last sentences, removes middle content to hit target.
        Ensures keywords are preserved.
        
        Args:
            text: Text to compress
            target_words: Target word count
            preserve_keywords: Keywords to preserve
            
        Returns:
            Compressed text
        """
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        if len(sentences) <= 2:
            # Too short to compress further
            return text
        
        # Keep first and last sentences
        first_sentence = sentences[0]
        last_sentence = sentences[-1]
        middle_sentences = sentences[1:-1]
        
        # Filter middle sentences to include those with keywords
        keyword_sentences = [
            s for s in middle_sentences
            if any(kw.lower() in s.lower() for kw in preserve_keywords)
        ]
        
        # Build compressed text
        compressed_parts = [first_sentence]
        compressed_parts.extend(keyword_sentences)
        compressed_parts.append(last_sentence)
        
        compressed = '. '.join(compressed_parts) + '.'
        
        # Trim further if still over target
        current_words = len(compressed.split())
        if current_words > target_words and len(keyword_sentences) > 1:
            # Remove some keyword sentences
            compressed_parts = [first_sentence, keyword_sentences[0], last_sentence]
            compressed = '. '.join(compressed_parts) + '.'
        
        return compressed
