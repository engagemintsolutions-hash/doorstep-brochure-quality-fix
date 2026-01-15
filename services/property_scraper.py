"""
Property URL Scraper Service
Uses Claude AI to intelligently extract property data from Rightmove/Zoopla URLs
"""
from typing import Dict, Optional, List
import logging
import re
import httpx
import anthropic
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)


class PropertyScraper:
    """
    Scrapes property data from Rightmove and Zoopla using AI-powered extraction.

    Instead of brittle HTML selectors, uses Claude to intelligently parse
    the page content and extract structured property data.
    """

    def __init__(self, anthropic_api_key: str):
        """Initialize with Claude API key."""
        self.client = anthropic.Anthropic(api_key=anthropic_api_key)
        self.timeout = 15.0

    async def scrape_property_url(self, url: str) -> Dict:
        """
        Scrape property listing from Rightmove or Zoopla URL.

        Args:
            url: Property listing URL

        Returns:
            Dict with extracted property data
        """
        logger.info(f"Scraping property from URL: {url}")

        # Detect portal
        portal = self._detect_portal(url)
        if not portal:
            raise ValueError(f"URL not recognized as Rightmove or Zoopla: {url}")

        # Fetch page HTML
        html_content = await self._fetch_page(url)

        # Extract text content (Claude works better with clean text)
        text_content = self._extract_text_from_html(html_content)

        # Use Claude AI to extract structured data
        property_data = await self._extract_with_claude(text_content, portal, url)

        logger.info(f"Successfully scraped: {property_data.get('address', 'Unknown')}")
        return property_data

    def _detect_portal(self, url: str) -> Optional[str]:
        """Detect which property portal the URL is from."""
        url_lower = url.lower()
        if 'rightmove' in url_lower:
            return 'rightmove'
        elif 'zoopla' in url_lower:
            return 'zoopla'
        elif 'onthemarket' in url_lower:
            return 'onthemarket'
        return None

    async def _fetch_page(self, url: str) -> str:
        """Fetch HTML content from URL."""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                return response.text
        except Exception as e:
            logger.error(f"Failed to fetch URL {url}: {str(e)}")
            raise ValueError(f"Could not fetch property page: {str(e)}")

    def _extract_text_from_html(self, html: str) -> str:
        """
        Extract clean text from HTML for Claude analysis.
        Removes scripts, styles, and focuses on content.
        """
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            # Get text
            text = soup.get_text()

            # Break into lines and remove leading/trailing space
            lines = (line.strip() for line in text.splitlines())

            # Break multi-headlines into a line each
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

            # Drop blank lines
            text = '\n'.join(chunk for chunk in chunks if chunk)

            # Limit to first 8000 characters (Claude context)
            return text[:8000]

        except ImportError:
            # If BeautifulSoup not available, return raw HTML truncated
            logger.warning("BeautifulSoup not available, using raw HTML")
            return html[:8000]

    async def _extract_with_claude(self, text_content: str, portal: str, url: str) -> Dict:
        """
        Use Claude AI to extract structured property data from text.
        """
        prompt = f"""Extract property listing information from this {portal.upper()} page content.

PAGE CONTENT:
{text_content}

Extract the following information and return ONLY valid JSON (no markdown, no explanation):

{{
  "address": "full property address",
  "price": "asking price as string (e.g., '£450,000')",
  "property_type": "house|flat|bungalow|apartment|maisonette",
  "bedrooms": number,
  "bathrooms": number,
  "reception_rooms": number,
  "square_feet": number or null,
  "tenure": "freehold|leasehold|sharehold",
  "council_tax_band": "A|B|C|D|E|F|G|H or null",
  "epc_rating": "A|B|C|D|E|F|G or null",
  "key_features": ["feature 1", "feature 2", ...],
  "description": "full property description",
  "postcode": "property postcode (e.g., SW1A 1AA)",
  "has_garden": true|false,
  "has_parking": true|false,
  "has_garage": true|false,
  "listing_id": "portal listing ID if visible"
}}

CRITICAL: Return ONLY the JSON object, nothing else. If a field is not found, use null or reasonable default."""

        try:
            message = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2048,
                temperature=0.0,  # Deterministic extraction
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )

            response_text = message.content[0].text.strip()

            # Remove markdown code blocks if present
            response_text = re.sub(r'^```json\s*', '', response_text)
            response_text = re.sub(r'\s*```$', '', response_text)

            # Parse JSON
            import json
            data = json.loads(response_text)

            # Add metadata
            data['source_url'] = url
            data['portal'] = portal

            return data

        except Exception as e:
            logger.error(f"Claude extraction failed: {str(e)}")
            # Return minimal structure
            return {
                "address": "Could not extract",
                "price": None,
                "property_type": "flat",
                "bedrooms": 2,
                "bathrooms": 1,
                "reception_rooms": 1,
                "square_feet": None,
                "tenure": None,
                "council_tax_band": None,
                "epc_rating": None,
                "key_features": [],
                "description": "Property details could not be automatically extracted. Please fill in manually.",
                "postcode": None,
                "has_garden": False,
                "has_parking": False,
                "has_garage": False,
                "listing_id": None,
                "source_url": url,
                "portal": portal,
                "error": str(e)
            }
