"""
Multi-tenant authentication system for Savills demo portal.

Features:
- Organization/office selection
- PIN-based authentication
- Role-based access control (Agent, Photographer, Admin)
- Team collaboration with shared brochure library
"""
import json
import os
from datetime import datetime
from typing import Optional, Dict, List
from enum import Enum
import logging

logger = logging.getLogger(__name__)


class UserRole(str, Enum):
    """User roles in the system."""
    AGENT = "agent"
    PHOTOGRAPHER = "photographer"
    ADMIN = "admin"


class Organization:
    """
    Organization (estate agency brand).

    Example: Savills
    """
    def __init__(self, org_id: str, name: str, offices: List[Dict]):
        self.org_id = org_id
        self.name = name
        self.offices = offices  # List of office configs


class Office:
    """
    Individual office within an organization.

    Example: Savills London Office
    """
    def __init__(self, office_id: str, org_id: str, name: str, pin: str, brand_profile_id: str):
        self.office_id = office_id
        self.org_id = org_id
        self.name = name
        self.pin = pin  # PIN for office access (e.g., "2025")
        self.brand_profile_id = brand_profile_id  # e.g., "savills"


class User:
    """User account with role and office association."""
    def __init__(self, user_id: str, email: str, name: str, role: UserRole, office_id: str):
        self.user_id = user_id
        self.email = email
        self.name = name
        self.role = role
        self.office_id = office_id


class AuthSystem:
    """
    Authentication and multi-tenant management system.

    Handles:
    - Organization and office management
    - PIN authentication
    - User roles (Agent, Photographer, Admin)
    - Office-level brochure sharing
    """

    def __init__(self, storage_path: str = "./auth_data.json"):
        self.storage_path = storage_path
        self._ensure_storage_exists()

    def _ensure_storage_exists(self):
        """Create auth storage with Savills demo data."""
        if not os.path.exists(self.storage_path):
            demo_data = self._create_demo_data()
            with open(self.storage_path, 'w') as f:
                json.dump(demo_data, f, indent=2)
            logger.info(f"Created auth storage with Savills demo at {self.storage_path}")

    def _create_demo_data(self) -> Dict:
        """
        Create demo authentication data with Savills London office.

        Pre-configured:
        - Organization: Savills
        - Office: London (PIN: 2025)
        - Agents: 3 demo agents
        - Photographer: 1 demo photographer
        - 5+ saved brochures for demo
        """
        return {
            "organizations": {
                "savills": {
                    "org_id": "savills",
                    "name": "Savills",
                    "brand_profile_id": "savills",
                    "offices": [
                        {
                            "office_id": "savills_london",
                            "name": "London",
                            "pin": "2025",
                            "location": {
                                "city": "London",
                                "postcode": "SW1A 1AA",
                                "address": "33 Margaret Street, London"
                            }
                        },
                        {
                            "office_id": "savills_manchester",
                            "name": "Manchester",
                            "pin": "2025",
                            "location": {
                                "city": "Manchester",
                                "postcode": "M1 4BT",
                                "address": "Peter House, Oxford Street, Manchester"
                            }
                        }
                    ]
                },
                "generic": {
                    "org_id": "generic",
                    "name": "Independent Agency",
                    "brand_profile_id": "generic",
                    "offices": [
                        {
                            "office_id": "generic_main",
                            "name": "Main Office",
                            "pin": "1234",
                            "location": {
                                "city": "London",
                                "postcode": "N/A",
                                "address": "Main Office"
                            }
                        }
                    ]
                }
            },

            "users": {
                "james.smith@savills.com": {
                    "user_id": "usr_001",
                    "email": "james.smith@savills.com",
                    "name": "James Smith",
                    "role": "agent",
                    "office_id": "savills_london",
                    "created_at": "2025-10-01T10:00:00Z"
                },
                "emma.johnson@savills.com": {
                    "user_id": "usr_002",
                    "email": "emma.johnson@savills.com",
                    "name": "Emma Johnson",
                    "role": "agent",
                    "office_id": "savills_london",
                    "created_at": "2025-10-01T10:00:00Z"
                },
                "oliver.brown@savills.com": {
                    "user_id": "usr_003",
                    "email": "oliver.brown@savills.com",
                    "name": "Oliver Brown",
                    "role": "agent",
                    "office_id": "savills_london",
                    "created_at": "2025-10-01T10:00:00Z"
                },
                "photographer@savills.com": {
                    "user_id": "usr_photo_001",
                    "email": "photographer@savills.com",
                    "name": "Savills Photographer",
                    "role": "photographer",
                    "office_id": "savills_london",
                    "created_at": "2025-10-01T10:00:00Z"
                }
            },

            # Shared brochure library per office
            "office_brochures": {
                "savills_london": [
                    {
                        "brochure_id": "br_001",
                        "property_address": "15 Kensington Palace Gardens, London W8",
                        "asking_price": "£12,950,000",
                        "bedrooms": 6,
                        "created_by": "james.smith@savills.com",
                        "created_at": "2025-10-10T14:30:00Z",
                        "status": "published",
                        "pdf_url": "/exports/savills_london_br_001.pdf"
                    },
                    {
                        "brochure_id": "br_002",
                        "property_address": "The Penthouse, One Hyde Park, SW1",
                        "asking_price": "£75,000,000",
                        "bedrooms": 5,
                        "created_by": "emma.johnson@savills.com",
                        "created_at": "2025-10-11T09:15:00Z",
                        "status": "published",
                        "pdf_url": "/exports/savills_london_br_002.pdf"
                    },
                    {
                        "brochure_id": "br_003",
                        "property_address": "22 Chester Square, Belgravia, SW1",
                        "asking_price": "£18,500,000",
                        "bedrooms": 7,
                        "created_by": "oliver.brown@savills.com",
                        "created_at": "2025-10-12T11:45:00Z",
                        "status": "published",
                        "pdf_url": "/exports/savills_london_br_003.pdf"
                    },
                    {
                        "brochure_id": "br_004",
                        "property_address": "45 Grosvenor Square, Mayfair, W1",
                        "asking_price": "£22,000,000",
                        "bedrooms": 8,
                        "created_by": "james.smith@savills.com",
                        "created_at": "2025-10-13T16:20:00Z",
                        "status": "draft",
                        "pdf_url": "/exports/savills_london_br_004.pdf"
                    },
                    {
                        "brochure_id": "br_005",
                        "property_address": "The Garden House, Regent's Park, NW1",
                        "asking_price": "£14,750,000",
                        "bedrooms": 5,
                        "created_by": "emma.johnson@savills.com",
                        "created_at": "2025-10-14T10:00:00Z",
                        "status": "published",
                        "pdf_url": "/exports/savills_london_br_005.pdf"
                    },
                    {
                        "brochure_id": "br_006",
                        "property_address": "8 Eaton Square, Belgravia, SW1",
                        "asking_price": "£19,950,000",
                        "bedrooms": 6,
                        "created_by": "photographer@savills.com",
                        "created_at": "2025-10-14T12:30:00Z",
                        "status": "awaiting_photos",
                        "pdf_url": None,
                        "note": "Photos uploaded by photographer, pending agent review"
                    }
                ]
            },

            # Photographer upload queue
            "photographer_uploads": {
                "savills_london": [
                    {
                        "upload_id": "upl_001",
                        "property_address": "12 Cadogan Place, SW1",
                        "uploaded_by": "photographer@savills.com",
                        "uploaded_at": "2025-10-14T08:00:00Z",
                        "photo_count": 24,
                        "status": "pending_agent_assignment",
                        "photos": [
                            "/uploads/upl_001_exterior_001.jpg",
                            "/uploads/upl_001_reception_001.jpg",
                            "/uploads/upl_001_kitchen_001.jpg"
                        ]
                    }
                ]
            }
        }

    def _load_data(self) -> Dict:
        """Load auth data from storage."""
        try:
            with open(self.storage_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading auth data: {e}")
            return {}

    def _save_data(self, data: Dict):
        """Save auth data to storage."""
        try:
            with open(self.storage_path, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving auth data: {e}")

    def get_organizations(self) -> List[Dict]:
        """
        List all organizations.

        Returns:
            List of {org_id, name, offices}
        """
        data = self._load_data()
        orgs = data.get("organizations", {})

        return [
            {
                "org_id": org["org_id"],
                "name": org["name"],
                "office_count": len(org["offices"])
            }
            for org in orgs.values()
        ]

    def get_offices(self, org_id: str) -> List[Dict]:
        """
        Get offices for an organization.

        Args:
            org_id: e.g., "savills"

        Returns:
            List of offices
        """
        data = self._load_data()
        org = data.get("organizations", {}).get(org_id)

        if not org:
            return []

        return org.get("offices", [])

    def authenticate_office(self, org_id: str, office_id: str, pin: str) -> tuple[bool, str]:
        """
        Authenticate access to an office using PIN.

        Args:
            org_id: Organization ID
            office_id: Office ID
            pin: PIN code (e.g., "2025")

        Returns:
            (success: bool, message: str)
        """
        data = self._load_data()
        org = data.get("organizations", {}).get(org_id)

        if not org:
            return False, "Organization not found"

        office = next((o for o in org["offices"] if o["office_id"] == office_id), None)

        if not office:
            return False, "Office not found"

        if office["pin"] != pin:
            return False, "Invalid PIN"

        logger.info(f"Office authenticated: {org_id}/{office_id}")
        return True, "Authentication successful"

    def get_user(self, email: str) -> Optional[Dict]:
        """Get user by email."""
        data = self._load_data()
        return data.get("users", {}).get(email)

    def get_office_brochures(self, office_id: str) -> List[Dict]:
        """
        Get all brochures for an office (shared library).

        All agents and photographers in the office can see these.

        Args:
            office_id: e.g., "savills_london"

        Returns:
            List of brochure metadata
        """
        data = self._load_data()
        return data.get("office_brochures", {}).get(office_id, [])

    def add_brochure_to_office(self, office_id: str, brochure_data: Dict):
        """
        Add a brochure to the office's shared library.

        Args:
            office_id: Office ID
            brochure_data: Brochure metadata
        """
        data = self._load_data()

        if office_id not in data.get("office_brochures", {}):
            data["office_brochures"][office_id] = []

        brochure_data["brochure_id"] = f"br_{len(data['office_brochures'][office_id]) + 1:03d}"
        brochure_data["created_at"] = datetime.utcnow().isoformat() + "Z"

        data["office_brochures"][office_id].append(brochure_data)
        self._save_data(data)

        logger.info(f"Added brochure {brochure_data['brochure_id']} to {office_id}")

    def get_photographer_uploads(self, office_id: str) -> List[Dict]:
        """
        Get pending photographer uploads for an office.

        Photographers upload photos, agents assign properties and generate brochures.

        Args:
            office_id: Office ID

        Returns:
            List of photo upload batches
        """
        data = self._load_data()
        return data.get("photographer_uploads", {}).get(office_id, [])

    def add_photographer_upload(self, office_id: str, upload_data: Dict):
        """
        Add photographer upload batch.

        Args:
            office_id: Office ID
            upload_data: Upload metadata with photos
        """
        data = self._load_data()

        if office_id not in data.get("photographer_uploads", {}):
            data["photographer_uploads"][office_id] = []

        upload_data["upload_id"] = f"upl_{len(data['photographer_uploads'][office_id]) + 1:03d}"
        upload_data["uploaded_at"] = datetime.utcnow().isoformat() + "Z"
        upload_data["status"] = "pending_agent_assignment"

        data["photographer_uploads"][office_id].append(upload_data)
        self._save_data(data)

        logger.info(f"Added photographer upload {upload_data['upload_id']} to {office_id}")

    def get_office_users(self, office_id: str) -> List[Dict]:
        """
        Get all users in an office.

        Args:
            office_id: e.g., "savills_london"

        Returns:
            List of user dicts with email, name, role, etc.
        """
        data = self._load_data()
        users = []
        for email, user_data in data.get("users", {}).items():
            if user_data.get("office_id") == office_id:
                users.append({
                    "email": email,
                    "name": user_data.get("name", email),
                    "role": user_data.get("role", "agent"),
                    "user_id": user_data.get("user_id")
                })
        return users

    def get_office_stats(self, office_id: str) -> Dict:
        """
        Get statistics for an office.

        Returns:
            {
                "total_brochures": int,
                "published_brochures": int,
                "draft_brochures": int,
                "pending_uploads": int,
                "team_members": int
            }
        """
        data = self._load_data()

        brochures = data.get("office_brochures", {}).get(office_id, [])
        uploads = data.get("photographer_uploads", {}).get(office_id, [])

        # Count team members in this office
        team_members = sum(
            1 for user in data.get("users", {}).values()
            if user.get("office_id") == office_id
        )

        return {
            "total_brochures": len(brochures),
            "published_brochures": sum(1 for b in brochures if b.get("status") == "published"),
            "draft_brochures": sum(1 for b in brochures if b.get("status") == "draft"),
            "pending_uploads": len([u for u in uploads if u.get("status") == "pending_agent_assignment"]),
            "team_members": team_members
        }


# Global instance
auth_system = AuthSystem()


def get_auth_system() -> AuthSystem:
    """Convenience function to get auth system instance."""
    return auth_system
