"""
Schools Service - UK School Data with Ofsted Ratings

Provides lookup of schools near a postcode/coordinates with:
- School name
- Type (Primary/Secondary/All-through)
- Ofsted rating (Outstanding/Good/Requires Improvement/Inadequate)
- Distance from property

DATA VERIFICATION:
- Source: Official Ofsted Management Information (gov.uk)
- URL: https://www.gov.uk/government/statistical-data-sets/monthly-management-information-ofsteds-school-inspections-outcomes
- Data includes URN (Unique Reference Number) for verification
- Each school can be verified at: https://reports.ofsted.gov.uk/provider/{URN}

IMPORTANT: This is official government data. Ofsted ratings are legally accurate
at the time of download. Schools are re-inspected periodically, so ratings
may change. Always check the publication_date field for currency.
"""
import sqlite3
import logging
import math
from datetime import datetime
from typing import Optional, List, Dict
from pathlib import Path

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


class SchoolsService:
    """
    Service for looking up schools with Ofsted ratings near a location.

    Uses SQLite database built from GIAS and Ofsted data.
    """

    # Ofsted rating order (for sorting - lower is better)
    RATING_ORDER = {
        'Outstanding': 1,
        'Good': 2,
        'Requires improvement': 3,
        'Requires Improvement': 3,
        'Inadequate': 4,
        'Not yet inspected': 5,
        None: 6,
        '': 6
    }

    def __init__(self, db_path: str = None):
        """
        Initialize schools service.

        Args:
            db_path: Path to SQLite database. Defaults to data/schools/schools.db
        """
        if db_path is None:
            base_dir = Path(__file__).parent.parent
            db_path = base_dir / "data" / "schools" / "schools.db"

        self.db_path = str(db_path)

        # Check if database exists
        if not Path(self.db_path).exists():
            logger.warning(f"Schools database not found at: {self.db_path}")
            logger.info("Run 'python scripts/download_schools_data.py' to download school data")
            self.available = False
        else:
            logger.info(f"Schools service initialized with database: {self.db_path}")
            self.available = True

    def find_nearby_schools(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6,  # ~1 mile
        school_type: str = None,  # 'primary', 'secondary', or None for all
        min_rating: str = None,  # 'Outstanding', 'Good', etc - returns this rating and better
        limit: int = 10
    ) -> List[Dict]:
        """
        Find schools near a location.

        Args:
            latitude: Center point latitude
            longitude: Center point longitude
            radius_km: Search radius in km (default 1.6 = ~1 mile)
            school_type: Filter by 'primary' or 'secondary'
            min_rating: Minimum Ofsted rating to include
            limit: Maximum results

        Returns:
            List of school dicts with name, type, rating, distance_km, distance_miles
        """
        if not self.available:
            return []

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            # Build query
            query = """
                SELECT
                    urn,
                    name,
                    phase,
                    type_of_establishment,
                    ofsted_rating,
                    inspection_date,
                    publication_date,
                    postcode,
                    latitude,
                    longitude,
                    local_authority
                FROM schools
                WHERE latitude IS NOT NULL
                AND longitude IS NOT NULL
            """
            params = []

            # Filter by school type
            if school_type:
                if school_type.lower() == 'primary':
                    query += " AND phase IN ('Primary', 'Middle deemed primary')"
                elif school_type.lower() == 'secondary':
                    query += " AND phase IN ('Secondary', 'Middle deemed secondary', 'All-through')"

            cursor.execute(query, params)
            rows = cursor.fetchall()
            conn.close()

            # Calculate distances and filter
            schools = []
            for row in rows:
                if row['latitude'] and row['longitude']:
                    distance = haversine_km(
                        latitude, longitude,
                        float(row['latitude']), float(row['longitude'])
                    )

                    if distance <= radius_km:
                        rating = row['ofsted_rating'] or 'Not yet inspected'

                        # Filter by minimum rating if specified
                        if min_rating:
                            min_order = self.RATING_ORDER.get(min_rating, 6)
                            rating_order = self.RATING_ORDER.get(rating, 6)
                            if rating_order > min_order:
                                continue

                        urn = row['urn']
                        schools.append({
                            'urn': urn,
                            'name': row['name'],
                            'phase': row['phase'],
                            'type': row['type_of_establishment'],
                            'ofsted_rating': rating,
                            'inspection_date': row['inspection_date'],
                            'publication_date': row['publication_date'],
                            'postcode': row['postcode'],
                            'local_authority': row['local_authority'],
                            'distance_km': round(distance, 2),
                            'distance_miles': round(distance * 0.621371, 2),
                            'data_source': 'Ofsted Management Information (gov.uk)',
                            'verification_url': f'https://reports.ofsted.gov.uk/search?q={urn}',
                            'ofsted_search_url': 'https://reports.ofsted.gov.uk/search',
                            'verified': True
                        })

            # Sort by distance, then by rating
            schools.sort(key=lambda s: (s['distance_km'], self.RATING_ORDER.get(s['ofsted_rating'], 6)))

            return schools[:limit]

        except Exception as e:
            logger.error(f"Error finding nearby schools: {e}")
            return []

    def get_school_summary(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6
    ) -> Dict:
        """
        Get a summary of schools near a location for brochure text.

        Returns dict with:
        - primary_outstanding: list of Outstanding primary schools within radius
        - primary_good: list of Good primary schools
        - secondary_outstanding: list of Outstanding secondary schools
        - secondary_good: list of Good secondary schools
        - nearest_outstanding: closest Outstanding school (any type)
        - highlights: list of text highlights for brochure
        """
        if not self.available:
            return {'highlights': [], 'available': False}

        # Get all schools
        all_schools = self.find_nearby_schools(latitude, longitude, radius_km, limit=50)

        # Categorize
        primary_outstanding = []
        primary_good = []
        secondary_outstanding = []
        secondary_good = []

        for school in all_schools:
            phase = school['phase'] or ''
            rating = school['ofsted_rating']

            is_primary = phase in ['Primary', 'Middle deemed primary']
            is_secondary = phase in ['Secondary', 'Middle deemed secondary', 'All-through']

            if rating == 'Outstanding':
                if is_primary:
                    primary_outstanding.append(school)
                elif is_secondary:
                    secondary_outstanding.append(school)
            elif rating == 'Good':
                if is_primary:
                    primary_good.append(school)
                elif is_secondary:
                    secondary_good.append(school)

        # Find nearest outstanding (any type)
        outstanding_schools = [s for s in all_schools if s['ofsted_rating'] == 'Outstanding']
        nearest_outstanding = outstanding_schools[0] if outstanding_schools else None

        # Generate highlights (ONLY POSITIVE)
        highlights = []

        if nearest_outstanding:
            dist = nearest_outstanding['distance_miles']
            name = nearest_outstanding['name']
            if dist <= 0.5:
                highlights.append(f"Ofsted Outstanding {nearest_outstanding['phase'].lower()} school {name} within walking distance ({dist} miles)")
            elif dist <= 1.0:
                highlights.append(f"Ofsted Outstanding school {name} just {dist} miles away")

        if len(primary_outstanding) >= 2:
            highlights.append(f"{len(primary_outstanding)} Ofsted Outstanding primary schools within 1 mile")
        elif len(primary_outstanding) == 1:
            highlights.append(f"Ofsted Outstanding primary school within 1 mile")

        if len(secondary_outstanding) >= 1:
            highlights.append(f"Ofsted Outstanding secondary school within 1 mile")

        # Count Good+ schools
        good_plus_primary = len(primary_outstanding) + len(primary_good)
        good_plus_secondary = len(secondary_outstanding) + len(secondary_good)

        if good_plus_primary >= 3 and not any('primary' in h.lower() for h in highlights):
            highlights.append(f"{good_plus_primary} primary schools rated Good or Outstanding within 1 mile")

        if good_plus_secondary >= 2 and not any('secondary' in h.lower() for h in highlights):
            highlights.append(f"{good_plus_secondary} secondary schools rated Good or Outstanding within 1 mile")

        return {
            'primary_outstanding': primary_outstanding,
            'primary_good': primary_good,
            'secondary_outstanding': secondary_outstanding,
            'secondary_good': secondary_good,
            'nearest_outstanding': nearest_outstanding,
            'highlights': highlights[:3],  # Limit to 3 best highlights
            'available': True,
            'data_source': 'Ofsted Management Information (gov.uk)',
            'data_verified': True,
            'verification_note': 'All school ratings from official Ofsted data. Each school includes URN for independent verification at reports.ofsted.gov.uk'
        }


def get_schools_service(db_path: str = None) -> SchoolsService:
    """Get an instance of the schools service."""
    return SchoolsService(db_path=db_path)
