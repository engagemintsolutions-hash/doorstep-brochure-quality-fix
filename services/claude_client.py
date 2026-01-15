"""
Claude API client wrapper for property listing generation.
"""
import anthropic
from typing import Optional
import logging

from backend.config import settings

logger = logging.getLogger(__name__)


class ClaudeClient:
    """
    Wrapper for Anthropic Claude API.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Claude client.
        
        Args:
            api_key: Anthropic API key (uses settings if not provided)
        """
        self.api_key = api_key or settings.anthropic_api_key
        if not self.api_key:
            logger.warning("No Anthropic API key provided")
            self.client = None
        else:
            self.client = anthropic.Anthropic(api_key=self.api_key)
    
    async def generate_completion(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        model: Optional[str] = None
    ) -> str:
        """
        Generate a completion using Claude.
        
        Args:
            prompt: The prompt to send to Claude
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0-1)
            model: Model to use
            
        Returns:
            Generated text
            
        Raises:
            Exception: If API call fails
        """
        if not self.client:
            raise Exception("Claude API client not initialized. Set ANTHROPIC_API_KEY.")

        # Use configured model if not specified
        if model is None:
            model = settings.claude_model

        try:
            logger.info(f"Calling Claude API ({model}) with {max_tokens} max tokens, temp={temperature}")

            message = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            # Extract text from response
            text_content = ""
            for block in message.content:
                if block.type == "text":
                    text_content += block.text
            
            logger.info(f"Claude API returned {len(text_content)} characters")
            return text_content
            
        except anthropic.APIError as e:
            logger.error(f"Claude API error: {e}")
            raise Exception(f"Claude API error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise Exception(f"Unexpected error: {str(e)}")
    
    def is_available(self) -> bool:
        """
        Check if the Claude API client is available.
        
        Returns:
            True if client is initialized with API key
        """
        return self.client is not None
