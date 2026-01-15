"""
Location Research Service

Uses Claude LLM to research and generate comprehensive area profiles
for property listings. Provides human-quality location context including:
- Major nearby towns and transport links
- Schools and education
- Local character and lifestyle
- Property market positioning
"""
import logging
import json
from typing import Optional, Dict
from services.claude_client import ClaudeClient
from services.cache_manager import CacheManager

logger = logging.getLogger(__name__)


class LocationResearchService:
    """
    LLM-powered location research service.

    Generates rich, human-quality area descriptions that enable
    estate agents to write informed, compelling location copy.
    """

    def __init__(
        self,
        claude_client: ClaudeClient,
        cache_manager: Optional[CacheManager] = None,
    ):
        """
        Initialize the location research service.

        Args:
            claude_client: Claude API client for LLM research
            cache_manager: Cache manager for storing results (30-day TTL)
        """
        self.claude = claude_client
        self.cache = cache_manager or CacheManager()

    async def research_area(
        self,
        postcode: str,
        district: Optional[str] = None,
        county: Optional[str] = None,
        coordinates: Optional[tuple] = None,
    ) -> Dict:
        """
        Research an area and generate comprehensive location profile.

        Args:
            postcode: UK postcode (e.g., "GU6 7HH")
            district: Town/district name (e.g., "Waverley")
            county: County name (e.g., "Surrey")
            coordinates: (latitude, longitude) tuple

        Returns:
            Dictionary with comprehensive area profile:
            {
                "area_name": str,
                "area_type": str,
                "character": str,
                "major_towns": [...],
                "transport": {...},
                "schools": {...},
                "lifestyle": {...},
                "property_market": {...},
                "narrative": str  # Ready-to-use description
            }
        """
        try:
            # Check cache first (30-day TTL for location research)
            cache_key = f"location_research:{postcode.replace(' ', '').upper()}"
            cached = self.cache.get(cache_key)
            if cached:
                logger.info(f"✅ Location research cache hit: {postcode}")
                return cached

            logger.info(f"🔍 Researching area for postcode: {postcode}")

            # Build research prompt
            prompt = self._build_research_prompt(postcode, district, county, coordinates)

            # Call Claude for research
            response = await self.claude.generate_completion(
                prompt=prompt,
                max_tokens=2000,
                temperature=0.3,  # Lower temperature for factual research
            )

            # Parse response into structured format
            research_data = self._parse_research_response(response, postcode, district, county)

            # Cache for 30 days (2,592,000 seconds)
            self.cache.set(cache_key, research_data, ttl_seconds=2592000)

            logger.info(f"✅ Location research completed for: {postcode}")
            return research_data

        except Exception as e:
            logger.error(f"❌ Location research failed: {e}")
            # Return minimal fallback data
            return self._fallback_profile(postcode, district, county)

    def _build_research_prompt(
        self,
        postcode: str,
        district: Optional[str],
        county: Optional[str],
        coordinates: Optional[tuple],
    ) -> str:
        """Build the research prompt for Claude."""

        location_info = f"Postcode: {postcode}"
        if district:
            location_info += f"\nDistrict/Town: {district}"
        if county:
            location_info += f"\nCounty: {county}"
        if coordinates:
            location_info += f"\nCoordinates: {coordinates[0]:.6f}, {coordinates[1]:.6f}"

        prompt = f"""You are a UK property market expert and location researcher. Research this location and provide a comprehensive area profile for use in property listings.

{location_info}

Please provide detailed, accurate information in the following JSON format:

{{
  "area_name": "The main area/village/town name",
  "area_type": "Brief description (e.g., 'Village in Surrey Hills AONB', 'Market town', 'Suburban area')",
  "character": "One sentence capturing the area's essence and appeal",

  "major_towns": [
    {{
      "name": "Town name",
      "distance_miles": 8.5,
      "drive_time_mins": 18,
      "description": "What this town offers (shopping, dining, etc.)"
    }}
  ],

  "transport": {{
    "nearest_station": {{
      "name": "Station name",
      "distance_miles": 4.5,
      "to_london": "XX minutes to London [Station]",
      "frequency": "X trains per hour peak times"
    }},
    "road_links": [
      "Key road access information",
      "Motorway/airport access"
    ]
  }},

  "schools": {{
    "primary": [
      {{
        "name": "School name",
        "type": "State/Independent/Church",
        "ofsted": "Outstanding/Good/etc",
        "distance_miles": 0.8
      }}
    ],
    "secondary": [
      {{
        "name": "School name",
        "type": "State/Independent/Grammar/etc",
        "reputation": "Brief reputation note",
        "distance_miles": 2.5
      }}
    ]
  }},

  "lifestyle": {{
    "area_character": [
      "Key lifestyle point 1",
      "Key lifestyle point 2",
      "Key lifestyle point 3"
    ],
    "nearby_attractions": [
      "Notable attraction 1 (distance)",
      "Notable attraction 2 (distance)"
    ],
    "amenities": [
      "Key local amenities",
      "Shopping/leisure facilities"
    ]
  }},

  "property_market": {{
    "desirability": "Highly sought-after/Popular/Emerging/etc",
    "buyer_profile": "Who typically buys here",
    "typical_prices": "Price range for family homes"
  }},

  "narrative": "A 2-3 paragraph FACTUAL, PROFESSIONAL description of the location for a property brochure. Focus on PRACTICAL information and MEASURABLE facts. NO flowery language, NO emotive descriptions, NO creative phrases. Be direct and informative."
}}

Important guidelines:
- Be accurate and factual about distances, train times, and school names
- If you're unsure about specific details, provide reasonable estimates or omit that field
- Focus on information most relevant to property buyers (families, professionals, retirees)
- The narrative MUST be factual and professional - state facts about transport, schools, amenities, and local facilities
- Mention specific place names, schools, and landmarks where possible
- Include practical information (commute times, road access, airports)
- CRITICAL: Avoid emotive or flowery language. NO phrases like "children's laughter", "birdsong", "charming atmosphere"
- Write in a clear, direct style focusing on factual information: "The area offers [X], located [Y] miles from [Z]"
- Think like a professional surveyor or planning report, NOT a lifestyle magazine

Return ONLY the JSON, no other text."""

        return prompt

    def _parse_research_response(
        self,
        response: str,
        postcode: str,
        district: Optional[str],
        county: Optional[str],
    ) -> Dict:
        """Parse Claude's research response into structured format."""
        try:
            # Try to extract JSON from response
            response = response.strip()

            # Remove markdown code blocks if present
            if response.startswith("```"):
                lines = response.split("\n")
                response = "\n".join(lines[1:-1])
            if response.startswith("```json"):
                response = response[7:]
            if response.endswith("```"):
                response = response[:-3]

            research_data = json.loads(response.strip())

            # Add metadata
            research_data["postcode"] = postcode
            research_data["source"] = "llm_research"

            logger.info(f"✅ Parsed location research for: {research_data.get('area_name', postcode)}")
            return research_data

        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse research JSON: {e}")
            logger.debug(f"Response was: {response[:500]}")

            # Return fallback with narrative from response
            return {
                "postcode": postcode,
                "area_name": district or "Area",
                "area_type": "Residential area",
                "character": f"Located in {district or 'the area'}, {county or 'UK'}",
                "narrative": response,  # Use raw response as narrative
                "source": "llm_research_fallback",
            }

    def _fallback_profile(
        self,
        postcode: str,
        district: Optional[str],
        county: Optional[str],
    ) -> Dict:
        """Generate minimal fallback profile if research fails."""
        area_name = district or "the area"

        return {
            "postcode": postcode,
            "area_name": area_name,
            "area_type": "Residential area",
            "character": f"Located in {area_name}" + (f", {county}" if county else ""),
            "major_towns": [],
            "transport": {},
            "schools": {},
            "lifestyle": {},
            "property_market": {},
            "narrative": f"{area_name} offers a range of local amenities and good transport connections." +
                        (f" Located in {county}, " if county else " ") +
                        "the area is popular with families and professionals alike.",
            "source": "fallback",
        }
