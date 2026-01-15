"""
UK Property Data Client

Fetches real property data from UK Government open data sources:
- EPC (Energy Performance Certificate) data
- Council Tax bands
- Property information

Uses UK Government EPC API with HTTP Basic Authentication.
"""
import logging
import httpx
import os
import base64
from typing import Optional, Dict, List
from urllib.parse import quote

logger = logging.getLogger(__name__)


class UKPropertyDataClient:
    """
    Client for UK Government property data APIs.

    Data sources:
    - EPC: https://epc.opendatacommunities.org/
    - Council Tax: Derived from local authority data

    Requires UK_EPC_API_EMAIL and UK_EPC_API_KEY environment variables.
    """

    def __init__(self, api_email: Optional[str] = None, api_key: Optional[str] = None):
        """
        Initialize the UK property data client.

        Args:
            api_email: UK EPC API email (from UK_EPC_API_EMAIL env var)
            api_key: UK EPC API key (from UK_EPC_API_KEY env var)
        """
        self.epc_base_url = "https://epc.opendatacommunities.org/api/v1"
        self.timeout = 10.0

        # Use provided credentials or fallback to environment
        self.api_email = api_email or os.getenv("UK_EPC_API_EMAIL", "")
        self.api_key = api_key or os.getenv("UK_EPC_API_KEY", "")

        # Create Basic Auth token
        if self.api_email and self.api_key:
            credentials = f"{self.api_email}:{self.api_key}"
            self.auth_token = base64.b64encode(credentials.encode()).decode()
            logger.info("✅ UK EPC API credentials loaded")
        else:
            self.auth_token = None
            logger.warning("⚠️ UK EPC API credentials not found in environment")

    async def get_all_properties_for_postcode(self, postcode: str) -> List[Dict]:
        """
        Get ALL properties at a postcode (for dropdown selection).

        Args:
            postcode: UK postcode (e.g., "SW1A 1AA")

        Returns:
            List of properties with address and basic info
        """
        try:
            clean_postcode = postcode.replace(" ", "").upper()
            url = f"{self.epc_base_url}/domestic/search"
            params = {"postcode": clean_postcode, "size": 100}

            headers = {"Accept": "application/json"}
            if self.auth_token:
                headers["Authorization"] = f"Basic {self.auth_token}"

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params, headers=headers, follow_redirects=True)

                if response.status_code == 200:
                    data = response.json()
                    if data and "rows" in data and len(data["rows"]) > 0:
                        properties = []
                        for row in data["rows"]:
                            properties.append({
                                "address": row.get("address", ""),
                                "property_type": row.get("property-type", ""),
                                "built_form": row.get("built-form", ""),
                                "inspection_date": row.get("inspection-date", "")
                            })
                        logger.info(f"✅ Found {len(properties)} properties for postcode: {postcode}")
                        return properties
                return []
        except Exception as e:
            logger.error(f"❌ Error fetching property list: {e}")
            return []

    async def get_epc_data(self, postcode: str, address: Optional[str] = None) -> Optional[Dict]:
        """
        Get EPC data for a postcode (optionally filtered by address).

        Args:
            postcode: UK postcode (e.g., "SW1A 1AA")
            address: Optional specific address to match

        Returns:
            Dictionary with EPC data or None if not found:
            {
                "current_rating": "C",
                "current_score": 69,
                "potential_rating": "B",
                "potential_score": 81,
                "address": "1 Example Street, London, SW1A 1AA",
                "property_type": "House",
                "built_form": "Detached",
                "inspection_date": "2020-01-15",
                "local_authority": "Westminster",
                "constituency": "Cities of London and Westminster",
                "tenure": "Freehold",
                "total_floor_area": 120,
                "co2_emissions_current": 2.5,
                "co2_emissions_potential": 1.8,
                "heating_cost_current": 850,
                "heating_cost_potential": 650,
                "hot_water_cost_current": 200,
                "hot_water_cost_potential": 150,
                "lighting_cost_current": 100,
                "lighting_cost_potential": 75
            }
        """
        try:
            # Clean and format postcode
            clean_postcode = postcode.replace(" ", "").upper()

            # EPC API endpoint
            url = f"{self.epc_base_url}/domestic/search"
            params = {
                "postcode": clean_postcode,
                "size": 100  # Get up to 100 results for this postcode
            }

            logger.info(f"🔍 Fetching EPC data for postcode: {postcode}")

            # UK EPC API requires HTTP Basic Auth
            headers = {
                "Accept": "application/json"
            }

            # Add authorization if credentials available
            if self.auth_token:
                headers["Authorization"] = f"Basic {self.auth_token}"
                logger.info("🔐 Using HTTP Basic Auth for EPC API")
            else:
                logger.warning("⚠️ No auth token available, request may fail")

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params, headers=headers, follow_redirects=True)

                if response.status_code == 200:
                    data = response.json()

                    if data and "rows" in data and len(data["rows"]) > 0:
                        rows = data["rows"]

                        # If address specified, filter to matching property
                        if address:
                            matching_rows = [r for r in rows if address.lower() in r.get("address", "").lower()]
                            if not matching_rows:
                                logger.warning(f"⚠️ No property found matching address: {address}")
                                return None
                            rows = matching_rows

                        # Sort by inspection date (most recent first)
                        rows_sorted = sorted(
                            rows,
                            key=lambda x: x.get("inspection-date", ""),
                            reverse=True
                        )

                        latest = rows_sorted[0]

                        result = {
                            "current_rating": latest.get("current-energy-rating", "Unknown"),
                            "current_score": latest.get("current-energy-efficiency", 0),
                            "potential_rating": latest.get("potential-energy-rating", "Unknown"),
                            "potential_score": latest.get("potential-energy-efficiency", 0),
                            "address": latest.get("address", ""),
                            "property_type": latest.get("property-type", "Unknown"),
                            "built_form": latest.get("built-form", "Unknown"),
                            "inspection_date": latest.get("inspection-date", ""),
                            "local_authority": latest.get("local-authority", ""),
                            "constituency": latest.get("constituency", ""),
                            "tenure": latest.get("tenure", "Unknown"),
                            "total_floor_area": latest.get("total-floor-area", 0),
                            "co2_emissions_current": latest.get("co2-emissions-current", 0),
                            "co2_emissions_potential": latest.get("co2-emissions-potential", 0),
                            "heating_cost_current": latest.get("heating-cost-current", 0),
                            "heating_cost_potential": latest.get("heating-cost-potential", 0),
                            "hot_water_cost_current": latest.get("hot-water-cost-current", 0),
                            "hot_water_cost_potential": latest.get("hot-water-cost-potential", 0),
                            "lighting_cost_current": latest.get("lighting-cost-current", 0),
                            "lighting_cost_potential": latest.get("lighting-cost-potential", 0)
                        }

                        logger.info(f"✅ Found EPC data: {result['current_rating']} (score: {result['current_score']})")
                        return result
                    else:
                        logger.warning(f"⚠️ No EPC data found for postcode: {postcode}")
                        return None
                else:
                    logger.error(f"❌ EPC API error: {response.status_code}")
                    return None

        except Exception as e:
            logger.error(f"❌ Error fetching EPC data: {e}")
            return None

    async def get_council_tax_band(self, postcode: str, address: Optional[str] = None) -> Optional[str]:
        """
        Get Council Tax band for a property.

        Note: Council Tax data is managed by individual local authorities.
        This implementation uses the local authority from EPC data + heuristics.

        For production, you'd integrate with:
        - https://www.gov.uk/council-tax-bands
        - Individual local authority APIs

        Args:
            postcode: UK postcode
            address: Optional full address for better matching

        Returns:
            Council Tax band (A-H) or None
        """
        try:
            # Get EPC data which contains local authority info
            epc_data = await self.get_epc_data(postcode)

            if not epc_data:
                logger.warning(f"⚠️ No EPC data for Council Tax lookup: {postcode}")
                return None

            # Use VOA (Valuation Office Agency) API
            # Note: This is a simplified implementation
            # For production, use proper VOA API integration

            # Heuristic based on property value and type
            # This is a rough estimate - real data requires VOA API key
            property_type = epc_data.get("property_type", "").lower()
            built_form = epc_data.get("built_form", "").lower()
            floor_area = epc_data.get("total_floor_area", 0)
            # Convert to float if it's a string
            try:
                floor_area = float(floor_area) if floor_area else 0
            except (ValueError, TypeError):
                floor_area = 0

            # Rough heuristic (England 1991 values, adjusted)
            if floor_area < 40:
                return "A"
            elif floor_area < 52:
                return "B"
            elif floor_area < 69:
                return "C"
            elif floor_area < 88:
                return "D"
            elif floor_area < 120:
                return "E"
            elif floor_area < 160:
                return "F"
            elif floor_area < 320:
                return "G"
            else:
                return "H"

        except Exception as e:
            logger.error(f"❌ Error getting Council Tax band: {e}")
            return None

    async def get_property_summary(self, postcode: str, address: Optional[str] = None) -> Dict:
        """
        Get comprehensive property data summary.

        Args:
            postcode: UK postcode
            address: Optional specific property address

        Returns:
            Dictionary with all available property data
        """
        try:
            if address:
                logger.info(f"📊 Fetching property data for: {address}, {postcode}")
            else:
                logger.info(f"📊 Fetching property data for postcode: {postcode}")

            # Fetch EPC data (optionally filtered by address)
            epc_data = await self.get_epc_data(postcode, address)

            # Fetch Council Tax band
            council_tax_band = await self.get_council_tax_band(postcode, address)

            if not epc_data:
                logger.warning(f"⚠️ No property data found for: {postcode}")
                return {
                    "postcode": postcode,
                    "found": False,
                    "epc": None,
                    "council_tax_band": None
                }

            result = {
                "postcode": postcode,
                "found": True,
                "epc": epc_data,
                "council_tax_band": council_tax_band,
                "local_authority": epc_data.get("local_authority"),
                "constituency": epc_data.get("constituency"),
                "summary": self._generate_summary(epc_data, council_tax_band)
            }

            logger.info(f"✅ Property data retrieved successfully")
            return result

        except Exception as e:
            logger.error(f"❌ Error getting property summary: {e}")
            return {
                "postcode": postcode,
                "found": False,
                "error": str(e)
            }

    def _generate_summary(self, epc_data: Dict, council_tax_band: Optional[str]) -> str:
        """Generate human-readable summary of property data."""
        parts = []

        if epc_data.get("property_type"):
            parts.append(f"{epc_data['property_type']}")

        if epc_data.get("built_form"):
            parts.append(f"({epc_data['built_form']})")

        if epc_data.get("current_rating"):
            parts.append(f"EPC: {epc_data['current_rating']}")

        if council_tax_band:
            parts.append(f"Council Tax: Band {council_tax_band}")

        if epc_data.get("total_floor_area"):
            parts.append(f"{epc_data['total_floor_area']}m²")

        return " • ".join(parts) if parts else "Property data available"
