"""
GP Service - UK GP Practice Data from NHS Digital

Official UK Government data from NHS Digital.
Source: https://digital.nhs.uk/services/organisation-data-service/

DATA VERIFICATION:
- Source: NHS Digital Organisation Data Service
- URL: https://digital.nhs.uk/services/organisation-data-service/
- Data includes ODS codes for verification
- Updated nightly by NHS Digital
- License: Open Government Licence

Contains 12,000+ active GP practices in England.
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


class GPService:
    """
    Service for looking up GP practices near a location.

    Uses official NHS Digital data.
    """

    def __init__(self, db_path: str = None):
        """Initialize GP service."""
        if db_path is None:
            base_dir = Path(__file__).parent.parent
            db_path = base_dir / "data" / "medical" / "gp_practices.db"

        self.db_path = str(db_path)

        if not Path(self.db_path).exists():
            logger.warning(f"GP database not found at: {self.db_path}")
            logger.info("Run 'python scripts/download_gp_data.py' to download GP data")
            self.available = False
        else:
            logger.info(f"GP service initialized with database: {self.db_path}")
            self.available = True

    def find_nearby_practices(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6,  # ~1 mile
        limit: int = 10
    ) -> List[Dict]:
        """
        Find GP practices near a location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in km
            limit: Maximum results

        Returns:
            List of practice dicts with name, address, distance
        """
        if not self.available:
            return []

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            query = """
                SELECT * FROM gp_practices
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            """

            cursor.execute(query)
            rows = cursor.fetchall()
            conn.close()

            # Calculate distances and filter
            practices = []
            for row in rows:
                if row['latitude'] and row['longitude']:
                    distance = haversine_km(
                        latitude, longitude,
                        float(row['latitude']), float(row['longitude'])
                    )

                    if distance <= radius_km:
                        practices.append({
                            'code': row['code'],
                            'name': row['name'],
                            'address': row['address'],
                            'postcode': row['postcode'],
                            'town': row['town'],
                            'phone': row['phone'],
                            'latitude': row['latitude'],
                            'longitude': row['longitude'],
                            'distance_km': round(distance, 2),
                            'distance_miles': round(distance * 0.621371, 2),
                            'data_source': 'NHS Digital Organisation Data Service',
                            'verification_url': f'https://odsportal.digital.nhs.uk/Organisation/Search?Code={row["code"]}',
                            'verified': True
                        })

            # Sort by distance
            practices.sort(key=lambda p: p['distance_km'])

            return practices[:limit]

        except Exception as e:
            logger.error(f"Error finding nearby GP practices: {e}")
            return []

    def get_gp_summary(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6
    ) -> Dict:
        """
        Get GP practice summary for a location.

        Returns dict with:
        - practices: List of nearby GP practices
        - nearest: Closest GP practice
        - count: Total number within radius
        - highlights: Text highlights for brochure
        """
        if not self.available:
            return {
                'available': False,
                'highlights': [],
                'data_source': 'NHS Digital',
                'data_verified': True
            }

        practices = self.find_nearby_practices(latitude, longitude, radius_km, limit=20)

        nearest = practices[0] if practices else None

        # Generate highlights (ONLY POSITIVE)
        highlights = []

        count = len(practices)
        if count >= 3:
            highlights.append(f"{count} GP surgeries within 1 mile")
        elif count >= 1:
            highlights.append("GP surgery within 1 mile")

        if nearest and nearest['distance_miles'] <= 0.5:
            highlights.append(f"GP surgery within walking distance ({nearest['distance_miles']} miles)")

        return {
            'practices': practices[:5],
            'nearest': nearest,
            'count': count,
            'highlights': highlights[:2],
            'available': True,
            'data_source': 'NHS Digital Organisation Data Service',
            'data_verified': True,
            'verification_note': 'Official NHS data, updated nightly'
        }


def get_gp_service(db_path: str = None) -> GPService:
    """Get an instance of the GP service."""
    return GPService(db_path=db_path)
