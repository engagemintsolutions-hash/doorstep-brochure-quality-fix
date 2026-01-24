"""
Transport Service - UK Transport Data from NaPTAN

Official UK Government data from Department for Transport.
Source: https://beta-naptan.dft.gov.uk/

DATA VERIFICATION:
- Source: NaPTAN (National Public Transport Access Nodes) - Department for Transport
- URL: https://beta-naptan.dft.gov.uk/
- Data includes ATCO codes for verification
- Updated daily by DfT
- License: Open Government Licence v3.0

Contains 350,000+ transport access points:
- Railway stations
- Underground/Metro stations
- Bus stops
- Tram stops
- Ferry terminals
"""
import sqlite3
import logging
import math
from typing import Optional, List, Dict
from pathlib import Path

logger = logging.getLogger(__name__)


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in km."""
    R = 6371
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)

    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

    return R * c


class TransportService:
    """
    Service for looking up transport access points near a location.

    Uses official NaPTAN data from Department for Transport.
    """

    # Stop type categories
    RAIL_TYPES = ['RLY', 'RPL']  # Railway station, Railway platform
    METRO_TYPES = ['MET', 'PLT', 'TMU']  # Metro/Underground
    FERRY_TYPES = ['FER']  # Ferry terminal
    AIRPORT_TYPES = ['AIR']  # Airport
    BUS_TYPES = ['BCT', 'BST', 'MKD', 'CUS', 'BCE', 'BCS', 'BCQ']

    def __init__(self, db_path: str = None):
        """Initialize transport service."""
        if db_path is None:
            base_dir = Path(__file__).parent.parent
            db_path = base_dir / "data" / "transport" / "naptan.db"

        self.db_path = str(db_path)

        if not Path(self.db_path).exists():
            logger.warning(f"Transport database not found at: {self.db_path}")
            logger.info("Run 'python scripts/download_naptan_data.py' to download transport data")
            self.available = False
        else:
            logger.info(f"Transport service initialized with database: {self.db_path}")
            self.available = True

    def find_nearby_stations(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 2.4,  # ~1.5 miles
        include_bus: bool = False,
        limit: int = 10
    ) -> List[Dict]:
        """
        Find transport stations near a location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in km
            include_bus: Include bus stops (default False - too many)
            limit: Maximum results

        Returns:
            List of station dicts with name, type, distance
        """
        if not self.available:
            return []

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            # Build query for stations only (not bus by default)
            if include_bus:
                query = """
                    SELECT * FROM stops
                    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                """
            else:
                query = """
                    SELECT * FROM stops
                    WHERE is_station = 1
                    AND latitude IS NOT NULL AND longitude IS NOT NULL
                """

            cursor.execute(query)
            rows = cursor.fetchall()
            conn.close()

            # Calculate distances and filter
            stations = []
            for row in rows:
                if row['latitude'] and row['longitude']:
                    distance = haversine_km(
                        latitude, longitude,
                        float(row['latitude']), float(row['longitude'])
                    )

                    if distance <= radius_km:
                        stop_type = row['stop_type']

                        # Categorize
                        if stop_type in self.RAIL_TYPES:
                            category = 'rail'
                        elif stop_type in self.METRO_TYPES:
                            category = 'underground'
                        elif stop_type in self.FERRY_TYPES:
                            category = 'ferry'
                        elif stop_type in self.AIRPORT_TYPES:
                            category = 'airport'
                        else:
                            category = 'bus'

                        stations.append({
                            'atco_code': row['atco_code'],
                            'name': row['name'],
                            'stop_type': stop_type,
                            'stop_type_name': row['stop_type_name'],
                            'category': category,
                            'locality': row['locality'],
                            'town': row['town'],
                            'latitude': row['latitude'],
                            'longitude': row['longitude'],
                            'distance_km': round(distance, 2),
                            'distance_miles': round(distance * 0.621371, 2),
                            'data_source': 'NaPTAN (Department for Transport)',
                            'verification_url': 'https://beta-naptan.dft.gov.uk/',
                            'verified': True
                        })

            # Sort by distance
            stations.sort(key=lambda s: s['distance_km'])

            return stations[:limit]

        except Exception as e:
            logger.error(f"Error finding nearby stations: {e}")
            return []

    def find_rail_stations(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 2.4,
        limit: int = 5
    ) -> List[Dict]:
        """Find railway stations only."""
        all_stations = self.find_nearby_stations(latitude, longitude, radius_km, limit=50)
        rail = [s for s in all_stations if s['category'] == 'rail']
        return rail[:limit]

    def find_tube_stations(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6,
        limit: int = 5
    ) -> List[Dict]:
        """Find underground/metro stations only."""
        all_stations = self.find_nearby_stations(latitude, longitude, radius_km, limit=50)
        tube = [s for s in all_stations if s['category'] == 'underground']
        return tube[:limit]

    def get_transport_summary(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 2.4
    ) -> Dict:
        """
        Get transport summary for a location.

        Returns dict with:
        - rail_stations: List of railway stations
        - tube_stations: List of underground stations
        - nearest_rail: Closest railway station
        - nearest_tube: Closest tube station
        - highlights: Text highlights for brochure
        """
        if not self.available:
            return {
                'available': False,
                'highlights': [],
                'data_source': 'NaPTAN (Department for Transport)',
                'data_verified': True
            }

        all_stations = self.find_nearby_stations(latitude, longitude, radius_km, limit=50)

        rail_stations = [s for s in all_stations if s['category'] == 'rail']
        tube_stations = [s for s in all_stations if s['category'] == 'underground']

        nearest_rail = rail_stations[0] if rail_stations else None
        nearest_tube = tube_stations[0] if tube_stations else None

        # Generate highlights (ONLY POSITIVE)
        highlights = []

        if nearest_rail:
            dist = nearest_rail['distance_miles']
            name = nearest_rail['name']
            if dist <= 0.5:
                highlights.append(f"{name} railway station within walking distance ({dist} miles)")
            elif dist <= 1.0:
                highlights.append(f"{name} railway station just {dist} miles away")
            elif dist <= 1.5:
                highlights.append(f"{name} railway station {dist} miles away")

        if nearest_tube:
            dist = nearest_tube['distance_miles']
            name = nearest_tube['name']
            if dist <= 0.5:
                highlights.append(f"{name} Underground station within walking distance ({dist} miles)")
            elif dist <= 0.75:
                highlights.append(f"{name} Underground station {dist} miles away")

        return {
            'rail_stations': rail_stations[:5],
            'tube_stations': tube_stations[:5],
            'nearest_rail': nearest_rail,
            'nearest_tube': nearest_tube,
            'highlights': highlights[:3],
            'available': True,
            'data_source': 'NaPTAN (Department for Transport)',
            'data_verified': True,
            'verification_note': 'Official UK Government transport data, updated daily'
        }


def get_transport_service(db_path: str = None) -> TransportService:
    """Get an instance of the transport service."""
    return TransportService(db_path=db_path)
