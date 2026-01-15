"""
EPC Service - Property Energy Performance Certificate Lookup
Queries local SQLite database built from UK EPC data
"""
import sqlite3
import logging
from typing import Optional, List, Dict
from pathlib import Path

logger = logging.getLogger(__name__)


class EPCService:
    """Service for looking up EPC data by postcode"""

    def __init__(self, db_path: str = None):
        """
        Initialize EPC service

        Args:
            db_path: Path to SQLite database. Defaults to data/epc/epc.db
        """
        if db_path is None:
            base_dir = Path(__file__).parent.parent
            db_path = base_dir / "data" / "epc" / "epc.db"

        self.db_path = str(db_path)

        # Check if database exists
        if not Path(self.db_path).exists():
            logger.warning(f"EPC database not found at: {self.db_path}")
            self.available = False
        else:
            logger.info(f"EPC service initialized with database: {self.db_path}")
            self.available = True

    def search_by_postcode(self, postcode: str, limit: int = 50) -> List[Dict]:
        """
        Search for properties by postcode

        Args:
            postcode: UK postcode (e.g., "SW1A 1AA")
            limit: Maximum number of results

        Returns:
            List of property dictionaries with EPC data
        """
        if not self.available:
            logger.warning("EPC database not available")
            return []

        # Normalize postcode (remove spaces, uppercase)
        normalized_postcode = postcode.replace(" ", "").upper()

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # Return rows as dictionaries
            cursor = conn.cursor()

            cursor.execute("""
                SELECT
                    lmk_key,
                    address,
                    postcode,
                    current_energy_rating,
                    potential_energy_rating,
                    property_type,
                    built_form,
                    inspection_date,
                    lodgement_date,
                    tenure,
                    transaction_type,
                    total_floor_area,
                    number_habitable_rooms,
                    current_energy_efficiency,
                    potential_energy_efficiency
                FROM epc_certificates
                WHERE postcode = ?
                ORDER BY lodgement_date DESC
                LIMIT ?
            """, (normalized_postcode, limit))

            results = []
            for row in cursor.fetchall():
                results.append(dict(row))

            conn.close()

            logger.info(f"Found {len(results)} properties for postcode: {postcode}")
            return results

        except Exception as e:
            logger.error(f"Error querying EPC database: {e}")
            return []

    def get_property_by_address(self, postcode: str, address_line: str) -> Optional[Dict]:
        """
        Get specific property by postcode and address

        Args:
            postcode: UK postcode
            address_line: Address line to match (fuzzy)

        Returns:
            Property dictionary or None
        """
        if not self.available:
            return None

        normalized_postcode = postcode.replace(" ", "").upper()
        address_search = f"%{address_line.upper()}%"

        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute("""
                SELECT *
                FROM epc_certificates
                WHERE postcode = ? AND UPPER(address) LIKE ?
                ORDER BY lodgement_date DESC
                LIMIT 1
            """, (normalized_postcode, address_search))

            row = cursor.fetchone()
            conn.close()

            if row:
                return dict(row)
            return None

        except Exception as e:
            logger.error(f"Error querying EPC database: {e}")
            return None

    def get_statistics(self) -> Dict:
        """
        Get database statistics

        Returns:
            Dictionary with total records, unique postcodes, etc.
        """
        if not self.available:
            return {"available": False}

        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) FROM epc_certificates")
            total_records = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(DISTINCT postcode) FROM epc_certificates")
            unique_postcodes = cursor.fetchone()[0]

            cursor.execute("""
                SELECT current_energy_rating, COUNT(*) as count
                FROM epc_certificates
                WHERE current_energy_rating != ''
                GROUP BY current_energy_rating
                ORDER BY current_energy_rating
            """)
            rating_distribution = {row[0]: row[1] for row in cursor.fetchall()}

            conn.close()

            return {
                "available": True,
                "total_records": total_records,
                "unique_postcodes": unique_postcodes,
                "rating_distribution": rating_distribution
            }

        except Exception as e:
            logger.error(f"Error getting statistics: {e}")
            return {"available": False, "error": str(e)}
