"""
Places client for Overpass API (OpenStreetMap data).
Free, no API key required, worldwide coverage.
"""
import httpx
import logging
from typing import Optional
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)


class PlacesClient:
    """
    Client for Overpass API to search for nearby points of interest.
    
    API: https://overpass-api.de/
    Uses OpenStreetMap data, free, no authentication required.
    """
    
    BASE_URL = "https://overpass-api.de/api/interpreter"
    
    # Mapping of category to OSM tags
    CATEGORY_QUERIES = {
        "primary_schools": '["amenity"="school"]["school:type"~"primary"]',
        "secondary_schools": '["amenity"="school"]["school:type"~"secondary"]',
        "schools": '["amenity"="school"]',
        "stations": '["railway"="station"]',
        "cafes": '["amenity"="cafe"]',
        "supermarkets": '["shop"="supermarket"]',
        "parks": '["leisure"="park"]',
        "gyms": '["leisure"="fitness_centre"]',
        "restaurants": '["amenity"="restaurant"]',
        "pubs": '["amenity"="pub"]',
    }
    
    def __init__(self, timeout_seconds: int = 10):
        """
        Initialize the places client.
        
        Args:
            timeout_seconds: HTTP request timeout
        """
        self.timeout = timeout_seconds
        self.client = httpx.AsyncClient(timeout=self.timeout)
    
    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=4, max=30),
        retry=retry_if_exception_type((httpx.HTTPStatusError, httpx.TimeoutException)),
        reraise=True
    )
    async def search_nearby(
        self,
        latitude: float,
        longitude: float,
        category: str,
        radius_meters: int = 1600  # ~1 mile
    ) -> list[dict]:
        """
        Search for nearby places of a specific category.
        
        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            category: Category to search (e.g., "schools", "cafes", "parks")
            radius_meters: Search radius in meters (default: 1600m ≈ 1 mile)
            
        Returns:
            List of POI dictionaries with:
            - name: str
            - latitude: float
            - longitude: float
            - type: str (category)
            Returns empty list if no results or API error.
        """
        if category not in self.CATEGORY_QUERIES:
            logger.warning(f"Unknown category: {category}")
            return []
        
        query_filter = self.CATEGORY_QUERIES[category]
        
        # Build Overpass QL query
        overpass_query = f"""
        [out:json][timeout:10];
        (
          node{query_filter}(around:{radius_meters},{latitude},{longitude});
          way{query_filter}(around:{radius_meters},{latitude},{longitude});
        );
        out center;
        """
        
        try:
            logger.info(f"Searching {category} near ({latitude}, {longitude})")
            
            response = await self.client.post(
                self.BASE_URL,
                data={"data": overpass_query}
            )

            # Raise exception for 429/504 to trigger retry
            if response.status_code in [429, 504]:
                logger.warning(f"Overpass API {response.status_code}, will retry...")
                response.raise_for_status()

            if response.status_code != 200:
                logger.error(f"Overpass API error: {response.status_code}")
                return []
            
            data = response.json()
            elements = data.get("elements", [])
            
            pois = []
            for element in elements:
                # Extract name
                name = element.get("tags", {}).get("name", "Unnamed")
                
                # Extract coordinates
                if element.get("type") == "node":
                    lat = element.get("lat")
                    lon = element.get("lon")
                elif element.get("type") == "way":
                    # For ways, use center point
                    center = element.get("center", {})
                    lat = center.get("lat")
                    lon = center.get("lon")
                else:
                    continue
                
                if lat is None or lon is None:
                    continue
                
                pois.append({
                    "name": name,
                    "latitude": lat,
                    "longitude": lon,
                    "type": category,
                })
            
            logger.info(f"Found {len(pois)} {category} nearby")
            return pois
            
        except httpx.TimeoutException:
            logger.error(f"Overpass API timeout for {category}")
            return []
        except httpx.RequestError as e:
            logger.error(f"Overpass API request error: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected Overpass API error: {e}")
            return []
