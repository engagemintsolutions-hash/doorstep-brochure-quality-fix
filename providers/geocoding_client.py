"""
Geocoding client for UK postcodes using postcodes.io API.
Free, no API key required, UK-specific.
"""
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class GeocodingClient:
    """
    Client for postcodes.io API to geocode UK postcodes.
    
    API: https://postcodes.io/
    Free, no authentication required.
    """
    
    BASE_URL = "https://api.postcodes.io"
    
    def __init__(self, timeout_seconds: int = 10):
        """
        Initialize the geocoding client.
        
        Args:
            timeout_seconds: HTTP request timeout
        """
        self.timeout = timeout_seconds
        self.client = httpx.AsyncClient(timeout=self.timeout)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    async def lookup_postcode(self, postcode: str) -> Optional[dict]:
        """
        Look up a UK postcode and return coordinates and location data.
        
        Args:
            postcode: UK postcode (e.g., "M1 4BT", "SW1A 1AA")
            
        Returns:
            Dictionary with:
            - latitude: float
            - longitude: float
            - postcode: str (normalized)
            - district: str
            - county: str
            - country: str
            Returns None if postcode not found or API error.
        """
        # Normalize postcode (remove spaces, uppercase)
        normalized = postcode.replace(" ", "").upper()
        
        try:
            url = f"{self.BASE_URL}/postcodes/{normalized}"
            logger.info(f"Geocoding postcode: {postcode}")
            
            response = await self.client.get(url)
            
            if response.status_code == 404:
                logger.warning(f"Postcode not found: {postcode}")
                return None
            
            if response.status_code != 200:
                logger.error(f"Geocoding API error: {response.status_code}")
                return None
            
            data = response.json()
            
            if data.get("status") != 200:
                logger.error(f"Geocoding API returned non-200 status: {data}")
                return None
            
            result = data.get("result", {})

            return {
                "latitude": result.get("latitude"),
                "longitude": result.get("longitude"),
                "postcode": result.get("postcode"),
                "district": result.get("admin_district", ""),
                "county": result.get("admin_county", ""),
                "country": result.get("country"),
            }
            
        except httpx.TimeoutException:
            logger.error(f"Geocoding timeout for postcode: {postcode}")
            return None
        except httpx.RequestError as e:
            logger.error(f"Geocoding request error: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected geocoding error: {e}")
            return None

    async def autocomplete_postcode(self, partial_postcode: str) -> list[dict]:
        """
        Autocomplete a partial UK postcode to get address suggestions.

        Args:
            partial_postcode: Partial or full UK postcode (e.g., "M1 4", "SW1A 1AA")

        Returns:
            List of address dictionaries with:
            - postcode: str (full postcode)
            - line_1: str (primary address line)
            - line_2: str (secondary address line, may be empty)
            - line_3: str (tertiary address line, may be empty)
            - post_town: str
            - county: str
            - district: str
            Returns empty list if no matches or API error.
        """
        # Normalize postcode (remove extra spaces, uppercase)
        normalized = partial_postcode.strip().upper()

        try:
            url = f"{self.BASE_URL}/postcodes/{normalized}/autocomplete"
            logger.info(f"Autocompleting postcode: {partial_postcode}")

            response = await self.client.get(url)

            if response.status_code == 404:
                logger.warning(f"No autocomplete results for: {partial_postcode}")
                return []

            if response.status_code != 200:
                logger.error(f"Autocomplete API error: {response.status_code}")
                return []

            data = response.json()

            if data.get("status") != 200:
                logger.error(f"Autocomplete API returned non-200 status: {data}")
                return []

            # Get suggested postcodes
            suggested_postcodes = data.get("result", [])

            # For each suggested postcode, get full address details
            addresses = []
            for postcode in suggested_postcodes[:10]:  # Limit to 10 results
                details = await self.lookup_postcode(postcode)
                if details:
                    addresses.append({
                        "postcode": details["postcode"],
                        "district": details.get("district", ""),
                        "county": details.get("county", ""),
                        "latitude": details["latitude"],
                        "longitude": details["longitude"],
                    })

            logger.info(f"Found {len(addresses)} address suggestions")
            return addresses

        except httpx.TimeoutException:
            logger.error(f"Autocomplete timeout for postcode: {partial_postcode}")
            return []
        except httpx.RequestError as e:
            logger.error(f"Autocomplete request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected autocomplete error: {e}")
            return []
