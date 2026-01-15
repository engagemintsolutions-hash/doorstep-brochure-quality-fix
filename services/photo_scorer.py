"""
Photo Scoring Service - Ranks photos by visual impact and selling power.

Integrates with existing vision analysis data to score photos 0-100.
Higher scores = more impactful photos for hero page placement.
"""

import logging
from typing import List, Tuple, Dict, Any, Optional
from backend.schemas import BrochurePhoto

logger = logging.getLogger(__name__)


class PhotoScorer:
    """
    Scores photos based on visual quality and emotional impact.

    Uses existing photo.analysis data from vision API.
    No new API calls - just intelligent ranking.
    """

    # Impact weights for different room types (from vision analysis)
    ROOM_TYPE_WEIGHTS = {
        # High-impact lifestyle features
        'pool': 100,
        'swimming pool': 100,
        'gym': 95,
        'home theater': 95,
        'wine cellar': 95,

        # Outdoor spaces (high selling power)
        'garden': 85,
        'patio': 85,
        'terrace': 85,
        'balcony': 80,

        # Heart of home
        'kitchen': 90,
        'dining room': 75,

        # Living spaces
        'living room': 80,
        'lounge': 80,
        'family room': 75,

        # Entrance (first impression)
        'entrance': 85,
        'hallway': 70,
        'foyer': 85,

        # Bedrooms
        'master bedroom': 75,
        'bedroom': 65,

        # Bathrooms
        'ensuite': 70,
        'bathroom': 60,

        # Utility/functional
        'garage': 50,
        'utility': 40,
        'storage': 30,

        # Exterior
        'exterior': 80,
        'facade': 85,
        'front': 85,

        # Default
        'other': 50
    }

    # Keywords that boost scores (from vision analysis attributes/captions)
    BOOST_KEYWORDS = {
        'modern': 10,
        'luxury': 15,
        'spacious': 10,
        'light': 8,
        'bright': 8,
        'contemporary': 10,
        'elegant': 12,
        'designer': 15,
        'panoramic': 15,
        'view': 12,
        'fireplace': 8,
        'chandelier': 10,
        'high ceiling': 12,
        'open plan': 10,
        'island': 8,  # kitchen island
        'marble': 10,
        'hardwood': 8,
        'french doors': 10,
        'bifold': 12,
        'skylight': 10,
        'landscaped': 12,
        'heated': 10  # heated pool
    }

    def score_photo(self, photo: BrochurePhoto, property_character: str = 'modern') -> float:
        """
        Score a single photo 0-100 based on impact.

        Args:
            photo: Photo with analysis data
            property_character: luxury/executive/family/compact/period/modern

        Returns:
            Score 0-100 (higher = more impactful)
        """
        score = 50.0  # Base score

        if not photo.analysis:
            logger.warning(f"Photo {photo.id} has no analysis data, using base score")
            return score

        # 1. Room Type Impact (40% weight)
        room_type = (photo.analysis.get('room_type') or 'other').lower()
        room_score = self._get_room_type_score(room_type)
        score += (room_score - 50) * 0.4

        # 2. Keyword Boosts from caption/attributes (30% weight)
        keyword_boost = self._calculate_keyword_boost(photo.analysis)
        score += keyword_boost * 0.3

        # 3. Visual Quality indicators (20% weight)
        visual_boost = self._calculate_visual_quality(photo.analysis)
        score += visual_boost * 0.2

        # 4. Property Character Alignment (10% weight)
        character_boost = self._calculate_character_alignment(
            room_type,
            photo.analysis,
            property_character
        )
        score += character_boost * 0.1

        # Clamp to 0-100
        score = max(0, min(100, score))

        logger.debug(f"Photo {photo.id} ({room_type}): score={score:.1f}")
        return score

    def _get_room_type_score(self, room_type: str) -> float:
        """Get base score for room type."""
        # Try exact match first
        if room_type in self.ROOM_TYPE_WEIGHTS:
            return self.ROOM_TYPE_WEIGHTS[room_type]

        # Try partial matches
        for key, value in self.ROOM_TYPE_WEIGHTS.items():
            if key in room_type or room_type in key:
                return value

        return self.ROOM_TYPE_WEIGHTS['other']

    def _calculate_keyword_boost(self, analysis: Dict[str, Any]) -> float:
        """Calculate boost from keywords in caption/attributes."""
        boost = 0.0

        # Check caption
        caption = (analysis.get('caption') or '').lower()

        # Check attributes
        attributes = analysis.get('attributes') or []
        if isinstance(attributes, list):
            attributes_text = ' '.join(attributes).lower()
        else:
            attributes_text = ''

        combined_text = f"{caption} {attributes_text}"

        for keyword, boost_value in self.BOOST_KEYWORDS.items():
            if keyword in combined_text:
                boost += boost_value
                logger.debug(f"  Keyword '{keyword}' found: +{boost_value}")

        return min(boost, 50)  # Cap total keyword boost at 50

    def _calculate_visual_quality(self, analysis: Dict[str, Any]) -> float:
        """Estimate visual quality from analysis data."""
        boost = 0.0

        # Look for quality indicators in attributes
        attributes = analysis.get('attributes') or []
        if isinstance(attributes, list):
            attrs_lower = [a.lower() for a in attributes]

            # Positive quality indicators
            if 'well lit' in attrs_lower or 'bright' in attrs_lower:
                boost += 10
            if 'clean' in attrs_lower or 'tidy' in attrs_lower:
                boost += 5
            if 'professional' in attrs_lower:
                boost += 10

        return boost

    def _calculate_character_alignment(
        self,
        room_type: str,
        analysis: Dict[str, Any],
        character: str
    ) -> float:
        """Boost score if photo aligns with property character."""
        boost = 0.0

        caption = (analysis.get('caption') or '').lower()
        attributes_text = ' '.join(analysis.get('attributes') or []).lower()
        combined = f"{caption} {attributes_text}"

        # Luxury properties
        if character == 'luxury':
            if any(kw in combined for kw in ['marble', 'chandelier', 'designer', 'pool']):
                boost += 15

        # Executive properties
        elif character == 'executive':
            if any(kw in combined for kw in ['modern', 'contemporary', 'open plan']):
                boost += 10

        # Family properties
        elif character == 'family':
            if room_type in ['kitchen', 'garden', 'family room']:
                boost += 10

        # Period properties
        elif character == 'period':
            if any(kw in combined for kw in ['traditional', 'period', 'original', 'fireplace']):
                boost += 10

        return boost

    def rank_photos(
        self,
        photos: List[BrochurePhoto],
        property_character: str = 'modern',
        limit: Optional[int] = None
    ) -> List[Tuple[BrochurePhoto, float]]:
        """
        Rank all photos by score descending.

        Args:
            photos: List of photos to rank
            property_character: Property type for scoring
            limit: Optional limit on number of results

        Returns:
            List of (photo, score) tuples sorted by score descending
        """
        scored_photos = []

        for photo in photos:
            score = self.score_photo(photo, property_character)
            scored_photos.append((photo, score))

        # Sort by score descending
        scored_photos.sort(key=lambda x: x[1], reverse=True)

        if limit:
            scored_photos = scored_photos[:limit]

        logger.info(f"📊 Ranked {len(photos)} photos, top 3 scores: {[s for _, s in scored_photos[:3]]}")

        return scored_photos

    def get_top_photos(
        self,
        photos: List[BrochurePhoto],
        n: int = 3,
        property_character: str = 'modern'
    ) -> List[BrochurePhoto]:
        """
        Get top N photos by score.

        Args:
            photos: List of photos
            n: Number of top photos to return
            property_character: Property type

        Returns:
            List of top N photos
        """
        ranked = self.rank_photos(photos, property_character, limit=n)
        return [photo for photo, score in ranked]


# Singleton instance
_scorer_instance = None

def get_photo_scorer() -> PhotoScorer:
    """Get singleton photo scorer instance."""
    global _scorer_instance
    if _scorer_instance is None:
        _scorer_instance = PhotoScorer()
    return _scorer_instance
