"""
Smart Hashtag Generator for Social Media
Generates optimized hashtag sets based on property taxonomy and platform strategy.
"""

from typing import List, Dict, Set
from dataclasses import dataclass
import re


@dataclass
class HashtagSet:
    """Container for different hashtag strategies"""
    reach: List[str]  # High-reach broad hashtags
    local: List[str]  # Geo-specific local hashtags
    recommended: List[str]  # Hybrid 50/50 mix
    brand: List[str]  # Brand/agency hashtags


# Hashtag library organized by taxonomy
HASHTAG_LIBRARY = {
    # Property types
    'property_type': {
        'house': ['#HouseForSale', '#FamilyHome', '#PropertyForSale'],
        'flat': ['#FlatForSale', '#ApartmentForSale', '#CityLiving'],
        'apartment': ['#ApartmentForSale', '#FlatForSale', '#ModernLiving'],
        'bungalow': ['#BungalowForSale', '#SingleStoreyLiving', '#RetirementHome'],
        'cottage': ['#CottageForSale', '#CountryLiving', '#CharacterHome'],
        'detached': ['#DetachedHouse', '#FamilyHome', '#PropertyForSale'],
        'semi-detached': ['#SemiDetached', '#FamilyHome', '#PropertyForSale'],
        'terraced': ['#TerracedHouse', '#TownHouse', '#UrbanLiving'],
        'townhouse': ['#Townhouse', '#ModernLiving', '#CityLife'],
        'villa': ['#LuxuryVilla', '#PrestigeProperty', '#LuxuryHomes'],
        'penthouse': ['#Penthouse', '#LuxuryLiving', '#PenthouseSuite'],
    },

    # Price bands
    'price_band': {
        'budget': ['#AffordableHomes', '#FirstTimeBuyer', '#PropertyLadder'],
        'mid': ['#PropertyForSale', '#HouseHunting', '#HomeSweetHome'],
        'premium': ['#LuxuryProperty', '#PrestigeHomes', '#LuxuryRealEstate'],
        'luxury': ['#LuxuryHomes', '#LuxuryProperty', '#PrestigeProperty'],
    },

    # Features
    'features': {
        'garden': ['#GardenProperty', '#OutdoorSpace', '#GardenLife'],
        'parking': ['#ParkingSpace', '#OffStreetParking', '#Garage'],
        'new_build': ['#NewBuild', '#NewHome', '#BrandNewHome'],
        'period': ['#PeriodProperty', '#CharacterHome', '#VictorianHome'],
        'modern': ['#ModernHome', '#ContemporaryLiving', '#ModernDesign'],
        'countryside': ['#CountrysideProperty', '#RuralLiving', '#CountryLife'],
        'city': ['#CityLiving', '#UrbanLiving', '#CityLife'],
        'sea_view': ['#SeaView', '#CoastalLiving', '#OceanView'],
        'investment': ['#InvestmentProperty', '#BuyToLet', '#PropertyInvestment'],
    },

    # Platform generic (high reach)
    'generic_high_reach': [
        '#PropertyForSale', '#HouseForSale', '#RealEstate',
        '#Property', '#HouseHunting', '#DreamHome',
        '#HomeSweetHome', '#NewHome', '#PropertyGoals',
        '#RealEstateForSale', '#Properties', '#Homes',
    ],
}

# UK-specific location hashtags by region
LOCATION_HASHTAGS = {
    # Major cities
    'london': ['#LondonProperty', '#LondonHomes', '#LondonRealEstate'],
    'manchester': ['#ManchesterProperty', '#ManchesterHomes', '#ManchesterRealEstate'],
    'birmingham': ['#BirminghamProperty', '#BirminghamHomes', '#BirminghamRealEstate'],
    'glasgow': ['#GlasgowProperty', '#GlasgowHomes', '#ScotlandProperty'],
    'liverpool': ['#LiverpoolProperty', '#LiverpoolHomes', '#Merseyside'],
    'edinburgh': ['#EdinburghProperty', '#EdinburghHomes', '#ScotlandProperty'],
    'leeds': ['#LeedsProperty', '#LeedsHomes', '#YorkshireProperty'],
    'bristol': ['#BristolProperty', '#BristolHomes', '#BristolRealEstate'],

    # Regions
    'surrey': ['#SurreyProperty', '#SurreyHomes', '#SurreyRealEstate'],
    'kent': ['#KentProperty', '#KentHomes', '#GardenOfEngland'],
    'essex': ['#EssexProperty', '#EssexHomes', '#EssexRealEstate'],
    'yorkshire': ['#YorkshireProperty', '#YorkshireHomes', '#YorkshireLiving'],
    'lancashire': ['#LancashireProperty', '#LancashireHomes', '#NorthWest'],
    'cheshire': ['#CheshireProperty', '#CheshireHomes', '#CheshireLiving'],
}


class HashtagGenerator:
    """Generates optimized hashtag sets for social media posts"""

    def __init__(self, brand_tags: List[str] = None):
        """
        Initialize hashtag generator.

        Args:
            brand_tags: Agency/brand hashtags (e.g., ['#SavillsUK', '#SavillsManchester'])
        """
        self.brand_tags = brand_tags or []

    def generate(
        self,
        property_data: Dict,
        location_data: Dict = None,
        platform: str = 'facebook',
        max_tags: int = 6
    ) -> HashtagSet:
        """
        Generate hashtag sets based on property taxonomy.

        Args:
            property_data: Dict with property details (type, price, features, etc.)
            location_data: Dict with location info (postcode, area, region)
            platform: 'facebook' or 'instagram'
            max_tags: Maximum hashtags per set (6-8 recommended)

        Returns:
            HashtagSet with reach/local/recommended/brand sets
        """
        # Extract taxonomy from property data
        taxonomy = self._extract_taxonomy(property_data, location_data)

        # Build candidate pool
        candidates = self._build_candidate_pool(taxonomy, platform)

        # Dedupe and filter
        filtered = self._dedupe_and_filter(candidates)

        # Create reach set (broad, high-volume hashtags)
        reach_set = self._create_reach_set(filtered, max_tags)

        # Create local set (geo-specific hashtags)
        local_set = self._create_local_set(filtered, taxonomy.get('location', {}), max_tags)

        # Create recommended set (50/50 hybrid)
        recommended = self._create_recommended_set(reach_set, local_set, max_tags)

        # Add brand tags to all sets
        reach_set = self._add_brand_tags(reach_set, max_tags)
        local_set = self._add_brand_tags(local_set, max_tags)
        recommended = self._add_brand_tags(recommended, max_tags)

        return HashtagSet(
            reach=reach_set,
            local=local_set,
            recommended=recommended,
            brand=self.brand_tags
        )

    def _extract_taxonomy(self, property_data: Dict, location_data: Dict = None) -> Dict:
        """Extract searchable taxonomy from property data"""
        taxonomy = {}

        # Property type
        prop_type = property_data.get('property_type', '').lower()
        taxonomy['property_type'] = prop_type

        # Price band
        price = property_data.get('price', 0)
        if price < 300000:
            taxonomy['price_band'] = 'budget'
        elif price < 750000:
            taxonomy['price_band'] = 'mid'
        elif price < 2000000:
            taxonomy['price_band'] = 'premium'
        else:
            taxonomy['price_band'] = 'luxury'

        # Features (extract from description or features list)
        features = []
        description = property_data.get('description', '').lower()

        if 'garden' in description or property_data.get('has_garden'):
            features.append('garden')
        if 'parking' in description or 'garage' in description or property_data.get('has_parking'):
            features.append('parking')
        if 'new build' in description or property_data.get('is_new_build'):
            features.append('new_build')
        if 'period' in description or 'victorian' in description or 'georgian' in description:
            features.append('period')
        if 'modern' in description or 'contemporary' in description:
            features.append('modern')
        if 'countryside' in description or 'rural' in description:
            features.append('countryside')
        if 'sea view' in description or 'ocean view' in description or 'coastal' in description:
            features.append('sea_view')

        taxonomy['features'] = features

        # Location
        if location_data:
            location_info = {
                'postcode': location_data.get('postcode', ''),
                'area': location_data.get('area', '').lower(),
                'region': location_data.get('region', '').lower(),
                'city': location_data.get('city', '').lower(),
            }
            taxonomy['location'] = location_info

        return taxonomy

    def _build_candidate_pool(self, taxonomy: Dict, platform: str) -> List[str]:
        """Build pool of candidate hashtags from taxonomy"""
        candidates = []

        # Property type hashtags
        prop_type = taxonomy.get('property_type', '')
        if prop_type in HASHTAG_LIBRARY['property_type']:
            candidates.extend(HASHTAG_LIBRARY['property_type'][prop_type])

        # Price band hashtags
        price_band = taxonomy.get('price_band', '')
        if price_band in HASHTAG_LIBRARY['price_band']:
            candidates.extend(HASHTAG_LIBRARY['price_band'][price_band])

        # Feature hashtags
        for feature in taxonomy.get('features', []):
            if feature in HASHTAG_LIBRARY['features']:
                candidates.extend(HASHTAG_LIBRARY['features'][feature])

        # Generic high-reach hashtags
        candidates.extend(HASHTAG_LIBRARY['generic_high_reach'][:8])

        # Location hashtags
        location = taxonomy.get('location', {})
        city = location.get('city', '').lower()
        region = location.get('region', '').lower()
        area = location.get('area', '').lower()

        for loc_key in [city, region, area]:
            if loc_key in LOCATION_HASHTAGS:
                candidates.extend(LOCATION_HASHTAGS[loc_key])

        return candidates

    def _dedupe_and_filter(self, candidates: List[str]) -> List[str]:
        """Remove duplicates and filter invalid hashtags"""
        # Dedupe while preserving order
        seen = set()
        unique = []
        for tag in candidates:
            tag_lower = tag.lower()
            if tag_lower not in seen:
                seen.add(tag_lower)
                unique.append(tag)

        # Filter: hashtags must start with # and contain only alphanumeric
        filtered = [
            tag for tag in unique
            if tag.startswith('#') and len(tag) > 2
        ]

        return filtered

    def _create_reach_set(self, candidates: List[str], max_tags: int) -> List[str]:
        """Create high-reach hashtag set (broad, popular tags)"""
        # Prioritize generic high-reach tags
        high_reach = [
            tag for tag in candidates
            if any(generic in tag for generic in HASHTAG_LIBRARY['generic_high_reach'])
        ]

        # Take top max_tags, ensuring variety
        return high_reach[:max_tags]

    def _create_local_set(self, candidates: List[str], location: Dict, max_tags: int) -> List[str]:
        """Create local/geo-specific hashtag set"""
        # Prioritize location-specific tags
        local_tags = []

        city = location.get('city', '').lower()
        region = location.get('region', '').lower()
        area = location.get('area', '').lower()

        # Get location hashtags first
        for loc_key in [city, area, region]:
            if loc_key in LOCATION_HASHTAGS:
                local_tags.extend(LOCATION_HASHTAGS[loc_key])

        # Add specific property features for local appeal
        local_tags.extend([
            tag for tag in candidates
            if tag not in local_tags and not any(generic in tag for generic in HASHTAG_LIBRARY['generic_high_reach'][:5])
        ])

        return local_tags[:max_tags]

    def _create_recommended_set(self, reach_set: List[str], local_set: List[str], max_tags: int) -> List[str]:
        """Create recommended hybrid set (50/50 reach + local)"""
        half = max_tags // 2

        # Take half from each, avoiding duplicates
        recommended = reach_set[:half]

        for tag in local_set:
            if tag not in recommended and len(recommended) < max_tags:
                recommended.append(tag)

        return recommended[:max_tags]

    def _add_brand_tags(self, tag_set: List[str], max_total: int) -> List[str]:
        """Add brand tags to set, respecting max total"""
        # Reserve 1-2 slots for brand tags
        max_brand = min(2, len(self.brand_tags))
        max_tags = max_total - max_brand

        # Trim tag set to make room
        trimmed = tag_set[:max_tags]

        # Add brand tags
        return trimmed + self.brand_tags[:max_brand]


# Module-level convenience function
def generate_hashtags(
    property_data: Dict,
    location_data: Dict = None,
    platform: str = 'facebook',
    brand_tags: List[str] = None,
    max_tags: int = 6
) -> Dict:
    """
    Generate hashtag sets for a property.

    Returns:
        Dict with 'reach', 'local', 'recommended', 'brand' keys
    """
    generator = HashtagGenerator(brand_tags=brand_tags)
    hashtag_set = generator.generate(property_data, location_data, platform, max_tags)

    return {
        'reach': hashtag_set.reach,
        'local': hashtag_set.local,
        'recommended': hashtag_set.recommended,
        'brand': hashtag_set.brand
    }
