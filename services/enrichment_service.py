"""
Enrichment service for property locations.
Orchestrates geocoding and places search to provide local context.
"""
import logging
import asyncio
from typing import Optional
from providers.geocoding_client import GeocodingClient
from providers.places_client import PlacesClient
from services.cache_manager import CacheManager
from services.distance_utils import haversine_km, format_distance, km_to_miles

logger = logging.getLogger(__name__)


class EnrichmentService:
    """
    Service for enriching property locations with local context.
    
    Combines geocoding and places data to provide:
    - Amenity counts (schools, transport, cafes, etc.)
    - Nearest POIs with distances
    - Descriptive highlights
    - Quality descriptors (excellent/good/moderate/limited)
    """
    
    def __init__(
        self,
        geocoding_client: GeocodingClient,
        places_client: PlacesClient,
        cache_manager: Optional[CacheManager] = None,
    ):
        """
        Initialize the enrichment service.
        
        Args:
            geocoding_client: Client for geocoding postcodes
            places_client: Client for searching nearby places
            cache_manager: Optional cache for results
        """
        self.geocoding = geocoding_client
        self.places = places_client
        self.cache = cache_manager or CacheManager()
    
    async def enrich_location(
        self,
        postcode: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
    ) -> dict:
        """
        Enrich a location with local context data.
        
        Args:
            postcode: UK postcode (e.g., "M1 4BT")
            latitude: Latitude (used if postcode not provided)
            longitude: Longitude (used if postcode not provided)
            
        Returns:
            Dictionary with enrichment data:
            - postcode: str or None
            - coordinates: {latitude, longitude}
            - amenities: {category: count}
            - nearest: {category: {name, distance_miles}}
            - highlights: [str] - human-readable highlights
            - descriptors: {category: quality} - excellent/good/moderate/limited
        """
        # Step 1: Get coordinates
        coords = await self._get_coordinates(postcode, latitude, longitude)
        if not coords:
            return self._empty_result()
        
        lat = coords["latitude"]
        lon = coords["longitude"]
        
        # Step 2: Search for nearby amenities
        amenities_data = await self._search_amenities(lat, lon)
        
        # Step 3: Generate insights
        highlights = self._generate_highlights(amenities_data)
        descriptors = self._generate_descriptors(amenities_data)
        
        return {
            "postcode": coords.get("postcode"),
            "coordinates": {
                "latitude": lat,
                "longitude": lon,
            },
            "amenities": amenities_data["counts"],
            "nearest": amenities_data["nearest"],
            "highlights": highlights,
            "descriptors": descriptors,
        }
    
    async def _get_coordinates(
        self,
        postcode: Optional[str],
        latitude: Optional[float],
        longitude: Optional[float],
    ) -> Optional[dict]:
        """Get coordinates from postcode or direct lat/lon."""
        if postcode:
            # Try cache first
            cache_key = f"geocode:{postcode}"
            cached = self.cache.get(cache_key)
            if cached:
                logger.info(f"Cache hit for postcode: {postcode}")
                return cached
            
            # Geocode postcode
            result = await self.geocoding.lookup_postcode(postcode)
            if result:
                self.cache.set(cache_key, result, ttl_seconds=3600)
                return result
            return None
        
        elif latitude is not None and longitude is not None:
            return {
                "latitude": latitude,
                "longitude": longitude,
                "postcode": None,
            }
        
        return None
    
    async def _search_amenities(self, latitude: float, longitude: float) -> dict:
        """Search for all amenity categories and calculate distances."""
        categories = [
            "primary_schools",
            "secondary_schools",
            "stations",
            "cafes",
            "supermarkets",
            "parks",
            "gyms",
        ]

        counts = {}
        nearest = {}
        all_pois = {}

        for idx, category in enumerate(categories):
            # Add rate limiting delay between API requests (not for first request)
            if idx > 0:
                await asyncio.sleep(3.0)  # 3 second delay to avoid 429 errors from Overpass API

            # Try cache first
            cache_key = f"places:{latitude:.4f},{longitude:.4f}:{category}"
            cached_pois = self.cache.get(cache_key)

            if cached_pois is None:
                # Search for POIs
                pois = await self.places.search_nearby(
                    latitude, longitude, category, radius_meters=1600
                )
                self.cache.set(cache_key, pois, ttl_seconds=3600)
            else:
                logger.info(f"Cache hit for {category} near ({latitude}, {longitude})")
                pois = cached_pois

            all_pois[category] = pois
            counts[category] = len(pois)

            # Find nearest
            if pois:
                nearest_poi = min(
                    pois,
                    key=lambda p: haversine_km(
                        latitude, longitude, p["latitude"], p["longitude"]
                    )
                )
                distance_km = haversine_km(
                    latitude, longitude,
                    nearest_poi["latitude"], nearest_poi["longitude"]
                )
                nearest[category] = {
                    "name": nearest_poi["name"],
                    "distance_miles": round(km_to_miles(distance_km), 1),
                }

        return {
            "counts": counts,
            "nearest": nearest,
            "all_pois": all_pois,
        }
    
    def _generate_highlights(self, amenities_data: dict) -> list[str]:
        """Generate human-readable highlights."""
        highlights = []
        nearest = amenities_data["nearest"]
        counts = amenities_data["counts"]
        
        # Transport highlight
        if "stations" in nearest:
            station = nearest["stations"]
            distance = station["distance_miles"]
            if distance <= 0.5:
                highlights.append(
                    f"Walking distance to {station['name']} ({distance} miles)"
                )
            elif distance <= 1.5:
                highlights.append(
                    f"Close to {station['name']} ({distance} miles)"
                )
        
        # Schools highlight
        primary_count = counts.get("primary_schools", 0)
        if primary_count > 0:
            highlights.append(f"{primary_count} primary schools within 1 mile")
        
        # Parks/green space
        if "parks" in nearest:
            park = nearest["parks"]
            distance = park["distance_miles"]
            if distance <= 0.5:
                highlights.append(
                    f"{park['name']} just {distance} miles away"
                )
        
        # Amenities
        cafe_count = counts.get("cafes", 0)
        supermarket_count = counts.get("supermarkets", 0)
        if cafe_count >= 5 and supermarket_count >= 2:
            highlights.append("Excellent local amenities with cafes and shops nearby")
        
        return highlights[:5]  # Limit to 5 highlights
    
    def _generate_descriptors(self, amenities_data: dict) -> dict:
        """Generate quality descriptors for different aspects."""
        counts = amenities_data["counts"]
        nearest = amenities_data["nearest"]
        
        descriptors = {}
        
        # Transport descriptor
        station_count = counts.get("stations", 0)
        if "stations" in nearest:
            distance = nearest["stations"]["distance_miles"]
            if distance <= 0.5 and station_count >= 2:
                descriptors["transport"] = "excellent"
            elif distance <= 1.0:
                descriptors["transport"] = "good"
            elif distance <= 2.0:
                descriptors["transport"] = "moderate"
            else:
                descriptors["transport"] = "limited"
        else:
            descriptors["transport"] = "limited"
        
        # Schools descriptor
        primary_count = counts.get("primary_schools", 0)
        secondary_count = counts.get("secondary_schools", 0)
        total_schools = primary_count + secondary_count
        
        if total_schools >= 5:
            descriptors["schools"] = "excellent"
        elif total_schools >= 3:
            descriptors["schools"] = "good"
        elif total_schools >= 1:
            descriptors["schools"] = "moderate"
        else:
            descriptors["schools"] = "limited"
        
        # Amenities descriptor
        cafe_count = counts.get("cafes", 0)
        supermarket_count = counts.get("supermarkets", 0)
        gym_count = counts.get("gyms", 0)
        total_amenities = cafe_count + supermarket_count + gym_count
        
        if total_amenities >= 15:
            descriptors["amenities"] = "outstanding"
        elif total_amenities >= 8:
            descriptors["amenities"] = "excellent"
        elif total_amenities >= 4:
            descriptors["amenities"] = "good"
        else:
            descriptors["amenities"] = "moderate"
        
        # Green spaces descriptor
        park_count = counts.get("parks", 0)
        if park_count >= 3:
            descriptors["green_spaces"] = "excellent"
        elif park_count >= 2:
            descriptors["green_spaces"] = "good"
        elif park_count >= 1:
            descriptors["green_spaces"] = "moderate"
        else:
            descriptors["green_spaces"] = "limited"
        
        return descriptors
    
    def _empty_result(self) -> dict:
        """Return empty enrichment result for errors."""
        return {
            "postcode": None,
            "coordinates": None,
            "amenities": {},
            "nearest": {},
            "highlights": [],
            "descriptors": {},
        }
