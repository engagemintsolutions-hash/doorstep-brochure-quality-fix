"""
Location Intelligence Service

Comprehensive location data for UK property brochures.
Uses OFFICIAL UK GOVERNMENT DATA SOURCES:

- Schools: Ofsted Management Information (gov.uk) - Updated monthly
- Transport: NaPTAN (Department for Transport) - Updated daily
- Medical: NHS Digital Organisation Data Service - Updated nightly
- Supermarkets: OpenStreetMap (crowdsourced) or Geolytix (if downloaded)
- Leisure: OpenStreetMap (crowdsourced)

DATA VERIFICATION:
All government data includes verification URLs and official codes.
Crowdsourced data is marked as unverified.
"""
import logging
from typing import Optional, Dict, List
from pathlib import Path

logger = logging.getLogger(__name__)


class LocationIntelligenceService:
    """
    Unified service for gathering all location data for a property.

    Uses official UK government data sources where available:
    - Schools: Ofsted (gov.uk) - VERIFIED
    - Transport: NaPTAN (DfT) - VERIFIED
    - Medical: NHS Digital - VERIFIED
    - Supermarkets: OpenStreetMap - UNVERIFIED (unless Geolytix downloaded)
    """

    def __init__(
        self,
        schools_service=None,
        transport_service=None,
        gp_service=None,
        places_client=None
    ):
        """Initialize with optional pre-created services."""
        self._schools_service = schools_service
        self._transport_service = transport_service
        self._gp_service = gp_service
        self._places_client = places_client

    @property
    def schools_service(self):
        """Lazy-load schools service (Ofsted data)."""
        if self._schools_service is None:
            try:
                from services.schools_service import get_schools_service
                self._schools_service = get_schools_service()
            except Exception as e:
                logger.warning(f"Could not load schools service: {e}")
        return self._schools_service

    @property
    def transport_service(self):
        """Lazy-load transport service (NaPTAN data)."""
        if self._transport_service is None:
            try:
                from services.transport_service import get_transport_service
                self._transport_service = get_transport_service()
            except Exception as e:
                logger.warning(f"Could not load transport service: {e}")
        return self._transport_service

    @property
    def gp_service(self):
        """Lazy-load GP service (NHS Digital data)."""
        if self._gp_service is None:
            try:
                from services.gp_service import get_gp_service
                self._gp_service = get_gp_service()
            except Exception as e:
                logger.warning(f"Could not load GP service: {e}")
        return self._gp_service

    @property
    def places_client(self):
        """Lazy-load places client (OpenStreetMap - for supermarkets/leisure)."""
        if self._places_client is None:
            try:
                from providers.places_client import PlacesClient
                self._places_client = PlacesClient()
            except Exception as e:
                logger.warning(f"Could not load places client: {e}")
        return self._places_client

    async def get_full_location_report(
        self,
        latitude: float,
        longitude: float,
        radius_km: float = 1.6
    ) -> Dict:
        """
        Get comprehensive location intelligence for a property.

        Returns all verified positive data about the location.
        Government data sources are marked as verified.
        """
        result = {
            'schools': {
                'available': False,
                'highlights': [],
                'data_source': 'Ofsted Management Information (gov.uk)',
                'data_verified': True
            },
            'transport': {
                'available': False,
                'highlights': [],
                'data_source': 'NaPTAN (Department for Transport)',
                'data_verified': True
            },
            'medical': {
                'available': False,
                'highlights': [],
                'data_source': 'NHS Digital Organisation Data Service',
                'data_verified': True
            },
            'supermarkets': {
                'available': False,
                'highlights': [],
                'data_source': 'OpenStreetMap (crowdsourced)',
                'data_verified': False
            },
            'leisure': {
                'available': False,
                'highlights': [],
                'data_source': 'OpenStreetMap (crowdsourced)',
                'data_verified': False
            },
            'all_highlights': [],
            'brochure_text': {
                'situation_paragraph': '',
                'amenities_bullets': []
            },
            'data_sources': {
                'schools': {
                    'name': 'Ofsted Management Information',
                    'url': 'https://www.gov.uk/government/statistical-data-sets/monthly-management-information-ofsteds-school-inspections-outcomes',
                    'official': True,
                    'update_frequency': 'Monthly'
                },
                'transport': {
                    'name': 'NaPTAN (Department for Transport)',
                    'url': 'https://beta-naptan.dft.gov.uk/',
                    'official': True,
                    'update_frequency': 'Daily'
                },
                'medical': {
                    'name': 'NHS Digital Organisation Data Service',
                    'url': 'https://digital.nhs.uk/services/organisation-data-service/',
                    'official': True,
                    'update_frequency': 'Nightly'
                },
                'supermarkets': {
                    'name': 'OpenStreetMap',
                    'url': 'https://www.openstreetmap.org',
                    'official': False,
                    'note': 'Crowdsourced - for verified data download Geolytix from geolytix.com'
                },
                'leisure': {
                    'name': 'OpenStreetMap',
                    'url': 'https://www.openstreetmap.org',
                    'official': False,
                    'note': 'Crowdsourced data'
                }
            }
        }

        # 1. Schools (OFFICIAL - Ofsted)
        if self.schools_service and self.schools_service.available:
            try:
                schools_summary = self.schools_service.get_school_summary(
                    latitude, longitude, radius_km
                )
                result['schools'] = schools_summary
                result['schools']['data_source'] = 'Ofsted Management Information (gov.uk)'
                result['schools']['data_verified'] = True
            except Exception as e:
                logger.warning(f"Error getting schools data: {e}")

        # 2. Transport (OFFICIAL - NaPTAN/DfT)
        if self.transport_service and self.transport_service.available:
            try:
                transport_summary = self.transport_service.get_transport_summary(
                    latitude, longitude, radius_km * 1.5  # Wider radius for transport
                )
                result['transport'] = transport_summary
            except Exception as e:
                logger.warning(f"Error getting transport data: {e}")

        # 3. Medical (OFFICIAL - NHS Digital)
        if self.gp_service and self.gp_service.available:
            try:
                gp_summary = self.gp_service.get_gp_summary(latitude, longitude, radius_km)
                result['medical'] = gp_summary
            except Exception as e:
                logger.warning(f"Error getting GP data: {e}")

        # 4. Supermarkets (OpenStreetMap - crowdsourced)
        if self.places_client:
            try:
                supermarket_data = await self.places_client.search_branded_supermarkets(
                    latitude, longitude, int(radius_km * 1500)
                )
                result['supermarkets'] = supermarket_data
                result['supermarkets']['data_source'] = 'OpenStreetMap (crowdsourced)'
                result['supermarkets']['data_verified'] = False
                result['supermarkets']['available'] = True
            except Exception as e:
                logger.warning(f"Error getting supermarket data: {e}")

        # 5. Leisure (OpenStreetMap - crowdsourced)
        if self.places_client:
            try:
                leisure_data = await self.places_client.search_leisure(
                    latitude, longitude, int(radius_km * 1000)
                )
                result['leisure'] = leisure_data
                result['leisure']['data_source'] = 'OpenStreetMap (crowdsourced)'
                result['leisure']['data_verified'] = False
                result['leisure']['available'] = True
            except Exception as e:
                logger.warning(f"Error getting leisure data: {e}")

        # Combine highlights - prioritize VERIFIED data first
        all_highlights = []

        # VERIFIED: Schools (most important for families)
        if result['schools'].get('available'):
            all_highlights.extend(result['schools'].get('highlights', []))

        # VERIFIED: Transport (commuter appeal)
        if result['transport'].get('available'):
            all_highlights.extend(result['transport'].get('highlights', []))

        # VERIFIED: Medical
        if result['medical'].get('available'):
            all_highlights.extend(result['medical'].get('highlights', []))

        # UNVERIFIED: Supermarkets (still useful but not official)
        if result['supermarkets'].get('available'):
            all_highlights.extend(result['supermarkets'].get('highlights', []))

        # UNVERIFIED: Leisure
        if result['leisure'].get('available'):
            all_highlights.extend(result['leisure'].get('highlights', []))

        result['all_highlights'] = all_highlights[:8]

        # Generate brochure text
        result['brochure_text'] = self._generate_brochure_text(result)

        return result

    def _generate_brochure_text(self, data: Dict) -> Dict:
        """Generate pre-formatted text for brochure sections."""
        brochure = {
            'situation_paragraph': '',
            'amenities_bullets': []
        }

        situation_parts = []
        bullets = []

        # Schools (VERIFIED)
        schools = data.get('schools', {})
        if schools.get('available') and schools.get('nearest_outstanding'):
            school = schools['nearest_outstanding']
            dist = school['distance_miles']
            name = school['name']
            phase = school.get('phase', '').lower()
            if dist <= 0.5:
                situation_parts.append(
                    f"The Ofsted Outstanding {phase} school {name} is within easy walking distance"
                )
            elif dist <= 1.0:
                situation_parts.append(
                    f"The Ofsted Outstanding {phase} school {name} is just {dist} miles away"
                )
            bullets.append(f"Ofsted Outstanding: {name} ({dist} miles)")

        # Transport (VERIFIED)
        transport = data.get('transport', {})
        if transport.get('available'):
            if transport.get('nearest_rail'):
                station = transport['nearest_rail']
                dist = station['distance_miles']
                name = station['name']
                if dist <= 1.0:
                    situation_parts.append(
                        f"{name} railway station provides convenient rail connections"
                    )
                    bullets.append(f"{name} station ({dist} miles)")

            if transport.get('nearest_tube'):
                tube = transport['nearest_tube']
                if tube['distance_miles'] <= 0.75:
                    bullets.append(f"{tube['name']} Underground ({tube['distance_miles']} miles)")

        # Medical (VERIFIED)
        medical = data.get('medical', {})
        if medical.get('available') and medical.get('count', 0) >= 1:
            bullets.append(f"GP surgery within {medical['nearest']['distance_miles']} miles")

        # Supermarkets (unverified but useful)
        supermarkets = data.get('supermarkets', {})
        if supermarkets.get('nearest_premium'):
            shop = supermarkets['nearest_premium']
            brand = shop.get('brand', 'Premium supermarket')
            dist = shop['distance_miles']
            if dist <= 1.0:
                situation_parts.append(f"{brand} is within easy reach for daily shopping")

        # Build paragraph
        if situation_parts:
            brochure['situation_paragraph'] = '. '.join(situation_parts) + '.'

        brochure['amenities_bullets'] = bullets[:6]

        return brochure

    def get_schools_only(self, latitude: float, longitude: float, radius_km: float = 1.6) -> Dict:
        """Get just schools data (synchronous)."""
        if not self.schools_service or not self.schools_service.available:
            return {'available': False, 'highlights': []}
        return self.schools_service.get_school_summary(latitude, longitude, radius_km)

    def get_transport_only(self, latitude: float, longitude: float, radius_km: float = 2.4) -> Dict:
        """Get just transport data (synchronous)."""
        if not self.transport_service or not self.transport_service.available:
            return {'available': False, 'highlights': []}
        return self.transport_service.get_transport_summary(latitude, longitude, radius_km)

    def get_medical_only(self, latitude: float, longitude: float, radius_km: float = 1.6) -> Dict:
        """Get just medical data (synchronous)."""
        if not self.gp_service or not self.gp_service.available:
            return {'available': False, 'highlights': []}
        return self.gp_service.get_gp_summary(latitude, longitude, radius_km)


def get_location_intelligence_service(
    schools_service=None,
    transport_service=None,
    gp_service=None,
    places_client=None
) -> LocationIntelligenceService:
    """Factory function to create location intelligence service."""
    return LocationIntelligenceService(
        schools_service=schools_service,
        transport_service=transport_service,
        gp_service=gp_service,
        places_client=places_client
    )
