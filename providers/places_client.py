"""
Places client for Overpass API (OpenStreetMap data).
Free, no API key required, worldwide coverage.

Enhanced with branded supermarkets and estate agent relevant POIs.
"""
import httpx
import logging
import math
from typing import Optional, List, Dict
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in km."""
    R = 6371  # Earth's radius in km
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c


class PlacesClient:
    """
    Client for Overpass API to search for nearby points of interest.

    API: https://overpass-api.de/
    Uses OpenStreetMap data, free, no authentication required.

    Enhanced categories for UK estate agents:
    - Branded supermarkets (Waitrose, M&S, Tesco, Sainsbury's, etc.)
    - Transport (train stations, tube stations)
    - Medical (GP surgeries, pharmacies)
    - Leisure (parks, gyms, restaurants, pubs, cafes)
    """

    BASE_URL = "https://overpass-api.de/api/interpreter"

    # Branded supermarket indicators (Waitrose = affluent area)
    SUPERMARKET_BRANDS = {
        "waitrose": "Waitrose",
        "marks_and_spencer": "M&S Food",
        "sainsburys": "Sainsbury's",
        "tesco": "Tesco",
        "asda": "Asda",
        "morrisons": "Morrisons",
        "coop": "Co-op",
        "aldi": "Aldi",
        "lidl": "Lidl",
        "whole_foods": "Whole Foods",
        "ocado": "Ocado"
    }

    # Mapping of category to OSM tags
    CATEGORY_QUERIES = {
        # Schools (basic - use schools_service for Ofsted data)
        "primary_schools": '["amenity"="school"]["school:type"~"primary"]',
        "secondary_schools": '["amenity"="school"]["school:type"~"secondary"]',
        "schools": '["amenity"="school"]',

        # Transport - comprehensive station queries
        "stations": '["railway"~"station|halt"]',
        "train_stations": '["railway"~"station|halt"]["station"!="subway"]["station"!="light_rail"]',
        "tube_stations": '["railway"="station"]["network"~"Underground|Tube|Metro",i]',
        "light_rail": '["railway"="station"]["station"="light_rail"]',
        "bus_stops": '["highway"="bus_stop"]',

        # Supermarkets - generic and branded
        "supermarkets": '["shop"="supermarket"]',
        "waitrose": '["shop"="supermarket"]["brand"~"Waitrose",i]',
        "marks_and_spencer": '["shop"~"supermarket|convenience"]["brand"~"M&S|Marks|Spencer",i]',
        "sainsburys": '["shop"="supermarket"]["brand"~"Sainsbury",i]',
        "tesco": '["shop"~"supermarket|convenience"]["brand"~"Tesco",i]',
        "asda": '["shop"="supermarket"]["brand"~"Asda",i]',
        "morrisons": '["shop"="supermarket"]["brand"~"Morrisons",i]',
        "coop": '["shop"~"supermarket|convenience"]["brand"~"Co-op|Coop",i]',
        "aldi": '["shop"="supermarket"]["brand"~"Aldi",i]',
        "lidl": '["shop"="supermarket"]["brand"~"Lidl",i]',

        # Medical
        "gp_surgeries": '["amenity"="doctors"]',
        "pharmacies": '["amenity"="pharmacy"]',
        "hospitals": '["amenity"="hospital"]',
        "dentists": '["amenity"="dentist"]',

        # Leisure & Dining
        "cafes": '["amenity"="cafe"]',
        "parks": '["leisure"="park"]',
        "gyms": '["leisure"="fitness_centre"]',
        "restaurants": '["amenity"="restaurant"]',
        "pubs": '["amenity"="pub"]',

        # Childcare & Family
        "nurseries": '["amenity"="childcare"]',
        "playgrounds": '["leisure"="playground"]',

        # Convenience
        "post_offices": '["amenity"="post_office"]',
        "banks": '["amenity"="bank"]',
        "atms": '["amenity"="atm"]',
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

    async def search_with_distance(
        self,
        latitude: float,
        longitude: float,
        category: str,
        radius_meters: int = 1600
    ) -> List[Dict]:
        """
        Search nearby POIs and include distance calculations.

        Returns list sorted by distance with distance_km and distance_miles added.
        """
        pois = await self.search_nearby(latitude, longitude, category, radius_meters)

        for poi in pois:
            dist_km = haversine_km(latitude, longitude, poi['latitude'], poi['longitude'])
            poi['distance_km'] = round(dist_km, 2)
            poi['distance_miles'] = round(dist_km * 0.621371, 2)

        # Sort by distance
        pois.sort(key=lambda x: x['distance_km'])
        return pois

    async def search_branded_supermarkets(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 2400  # 1.5 miles - supermarkets worth driving to
    ) -> Dict:
        """
        Search for branded supermarkets near a location.

        Returns dict with:
        - premium: List of Waitrose, M&S, Whole Foods (affluence indicators)
        - major: List of Sainsbury's, Tesco, Morrisons, Asda
        - budget: List of Aldi, Lidl, Co-op
        - nearest_premium: Closest premium supermarket (if any)
        - highlights: List of text highlights for brochure
        """
        result = {
            'premium': [],
            'major': [],
            'budget': [],
            'nearest_premium': None,
            'highlights': []
        }

        # Search each brand category
        premium_brands = ['waitrose', 'marks_and_spencer']
        major_brands = ['sainsburys', 'tesco', 'morrisons', 'asda']
        budget_brands = ['aldi', 'lidl', 'coop']

        all_supermarkets = []

        for brand in premium_brands + major_brands + budget_brands:
            try:
                pois = await self.search_with_distance(latitude, longitude, brand, radius_meters)
                for poi in pois:
                    poi['brand'] = self.SUPERMARKET_BRANDS.get(brand, brand)
                    all_supermarkets.append(poi)

                    if brand in premium_brands:
                        result['premium'].append(poi)
                    elif brand in major_brands:
                        result['major'].append(poi)
                    else:
                        result['budget'].append(poi)
            except Exception as e:
                logger.warning(f"Error searching {brand}: {e}")
                continue

        # Sort each category by distance
        for key in ['premium', 'major', 'budget']:
            result[key].sort(key=lambda x: x['distance_km'])

        # Find nearest premium
        if result['premium']:
            result['nearest_premium'] = result['premium'][0]

        # Generate highlights (ONLY POSITIVE)
        if result['nearest_premium']:
            dist = result['nearest_premium']['distance_miles']
            brand = result['nearest_premium']['brand']
            if dist <= 0.5:
                result['highlights'].append(f"{brand} within walking distance ({dist} miles)")
            elif dist <= 1.0:
                result['highlights'].append(f"{brand} just {dist} miles away")
            elif dist <= 1.5:
                result['highlights'].append(f"{brand} within {dist} miles")

        # Count total supermarkets
        total = len(result['premium']) + len(result['major']) + len(result['budget'])
        if total >= 3:
            result['highlights'].append(f"Choice of {total} supermarkets nearby")

        return result

    async def search_transport(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 2400
    ) -> Dict:
        """
        Search for transport links near a location.

        Returns dict with stations, tube_stations, and highlights.
        """
        result = {
            'stations': [],
            'tube_stations': [],
            'bus_stops': [],
            'nearest_station': None,
            'nearest_tube': None,
            'highlights': []
        }

        try:
            # Train stations (comprehensive search)
            result['stations'] = await self.search_with_distance(
                latitude, longitude, 'train_stations', radius_meters
            )
            # Fallback to general stations if train_stations empty
            if not result['stations']:
                result['stations'] = await self.search_with_distance(
                    latitude, longitude, 'stations', radius_meters
                )
            if result['stations']:
                result['nearest_station'] = result['stations'][0]

            # Tube stations (London)
            result['tube_stations'] = await self.search_with_distance(
                latitude, longitude, 'tube_stations', radius_meters
            )
            if result['tube_stations']:
                result['nearest_tube'] = result['tube_stations'][0]

        except Exception as e:
            logger.warning(f"Error searching transport: {e}")

        # Generate highlights (ONLY POSITIVE)
        if result['nearest_station']:
            dist = result['nearest_station']['distance_miles']
            name = result['nearest_station']['name']
            if name != "Unnamed":
                if dist <= 0.5:
                    result['highlights'].append(f"{name} station within walking distance ({dist} miles)")
                elif dist <= 1.0:
                    result['highlights'].append(f"{name} station just {dist} miles away")

        if result['nearest_tube']:
            dist = result['nearest_tube']['distance_miles']
            name = result['nearest_tube']['name']
            if name != "Unnamed" and dist <= 0.75:
                result['highlights'].append(f"{name} tube station {dist} miles away")

        return result

    async def search_medical(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 1600
    ) -> Dict:
        """
        Search for medical facilities near a location.
        """
        result = {
            'gp_surgeries': [],
            'pharmacies': [],
            'dentists': [],
            'hospitals': [],
            'highlights': []
        }

        try:
            result['gp_surgeries'] = await self.search_with_distance(
                latitude, longitude, 'gp_surgeries', radius_meters
            )
            result['pharmacies'] = await self.search_with_distance(
                latitude, longitude, 'pharmacies', radius_meters
            )
            result['dentists'] = await self.search_with_distance(
                latitude, longitude, 'dentists', radius_meters
            )
        except Exception as e:
            logger.warning(f"Error searching medical: {e}")

        # Generate highlights
        gp_count = len(result['gp_surgeries'])
        if gp_count >= 2:
            result['highlights'].append(f"{gp_count} GP surgeries within 1 mile")
        elif gp_count == 1:
            result['highlights'].append("GP surgery within 1 mile")

        return result

    async def search_leisure(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 1600
    ) -> Dict:
        """
        Search for leisure facilities near a location.
        """
        result = {
            'parks': [],
            'gyms': [],
            'restaurants': [],
            'pubs': [],
            'cafes': [],
            'highlights': []
        }

        try:
            result['parks'] = await self.search_with_distance(
                latitude, longitude, 'parks', radius_meters
            )
            result['pubs'] = await self.search_with_distance(
                latitude, longitude, 'pubs', radius_meters
            )
            result['restaurants'] = await self.search_with_distance(
                latitude, longitude, 'restaurants', radius_meters
            )
            result['cafes'] = await self.search_with_distance(
                latitude, longitude, 'cafes', radius_meters
            )
            result['gyms'] = await self.search_with_distance(
                latitude, longitude, 'gyms', radius_meters
            )
        except Exception as e:
            logger.warning(f"Error searching leisure: {e}")

        # Generate highlights (ONLY POSITIVE, only named places)
        named_parks = [p for p in result['parks'] if p['name'] != 'Unnamed']
        if named_parks and named_parks[0]['distance_miles'] <= 0.5:
            result['highlights'].append(f"{named_parks[0]['name']} within walking distance")

        if len(result['restaurants']) >= 5:
            result['highlights'].append("Wide choice of local restaurants")

        named_pubs = [p for p in result['pubs'] if p['name'] != 'Unnamed']
        if named_pubs and named_pubs[0]['distance_miles'] <= 0.3:
            result['highlights'].append(f"Local pub {named_pubs[0]['name']} nearby")

        return result

    async def get_location_summary(
        self,
        latitude: float,
        longitude: float
    ) -> Dict:
        """
        Get comprehensive location summary for estate agent brochures.

        Combines all categories and generates highlights suitable for
        property marketing. Only includes POSITIVE information.

        Returns dict with:
        - supermarkets: branded supermarket data
        - transport: station/tube data
        - medical: GP/pharmacy data
        - leisure: parks/pubs/restaurants data
        - all_highlights: combined list of top highlights
        """
        result = {
            'supermarkets': {},
            'transport': {},
            'medical': {},
            'leisure': {},
            'all_highlights': []
        }

        try:
            # Fetch all categories
            result['supermarkets'] = await self.search_branded_supermarkets(latitude, longitude)
            result['transport'] = await self.search_transport(latitude, longitude)
            result['medical'] = await self.search_medical(latitude, longitude)
            result['leisure'] = await self.search_leisure(latitude, longitude)

            # Combine all highlights, prioritize most impressive
            all_highlights = []

            # Transport first (most important for commuters)
            all_highlights.extend(result['transport'].get('highlights', []))

            # Premium supermarkets (affluence indicator)
            all_highlights.extend(result['supermarkets'].get('highlights', []))

            # Parks and leisure
            all_highlights.extend(result['leisure'].get('highlights', []))

            # Medical last
            all_highlights.extend(result['medical'].get('highlights', []))

            # Limit to top 5 highlights
            result['all_highlights'] = all_highlights[:5]

        except Exception as e:
            logger.error(f"Error getting location summary: {e}")

        return result
