"""
Address lookup client for Ideal Postcodes API.
Provides full UK address data (PAF-licensed).
"""

import httpx
import logging
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)


class AddressLookupClient:
    """Client for Ideal Postcodes API"""

    BASE_URL = "https://api.ideal-postcodes.co.uk/v1"

    def __init__(self, api_key: str):
        """
        Initialize the address lookup client.

        Args:
            api_key: Ideal Postcodes API key
        """
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=10)

    async def lookup_addresses(self, postcode: str) -> List[Dict]:
        """
        Get all addresses for a postcode.

        Args:
            postcode: UK postcode (e.g., "GU6 7HH", "M1 4BT")

        Returns:
            List of addresses with full details:
            [
                {
                    "line_1": "Waverly House",
                    "line_2": "The Street",
                    "line_3": "Bramley",
                    "post_town": "Guildford",
                    "postcode": "GU6 7HH",
                    "county": "Surrey",
                    "latitude": 51.1234,
                    "longitude": -0.5678
                }
            ]
        """
        # Remove spaces from postcode for API call
        normalized = postcode.replace(" ", "").upper()

        url = f"{self.BASE_URL}/postcodes/{normalized}"
        params = {"api_key": self.api_key}

        try:
            response = await self.client.get(url, params=params)

            if response.status_code == 404:
                logger.warning(f"Postcode not found: {postcode}")
                return []

            if response.status_code != 200:
                logger.error(f"Address lookup failed with status {response.status_code}: {response.text}")
                return []

            data = response.json()
            addresses = data.get("result", [])

            logger.info(f"Found {len(addresses)} addresses for postcode {postcode}")
            return addresses

        except httpx.TimeoutException:
            logger.error(f"Address lookup timeout for {postcode}")
            return []
        except Exception as e:
            logger.error(f"Address lookup failed for {postcode}: {e}")
            return []

    async def autocomplete_postcode(self, partial_postcode: str) -> List[str]:
        """
        Autocomplete a partial postcode.

        Args:
            partial_postcode: Partial UK postcode (e.g., "GU6 7", "M1")

        Returns:
            List of matching postcodes (e.g., ["GU6 7HH", "GU6 7AB"])
        """
        normalized = partial_postcode.replace(" ", "").upper()

        url = f"{self.BASE_URL}/autocomplete/postcodes"
        params = {
            "api_key": self.api_key,
            "q": normalized,
            "limit": 10
        }

        try:
            response = await self.client.get(url, params=params)

            if response.status_code == 404:
                return []

            if response.status_code != 200:
                logger.error(f"Postcode autocomplete failed with status {response.status_code}")
                return []

            data = response.json()
            results = data.get("result", {}).get("hits", [])

            # Extract postcode from each hit
            postcodes = [hit.get("postcode", "") for hit in results]

            logger.info(f"Found {len(postcodes)} postcode matches for '{partial_postcode}'")
            return postcodes

        except Exception as e:
            logger.error(f"Postcode autocomplete failed for '{partial_postcode}': {e}")
            return []

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
