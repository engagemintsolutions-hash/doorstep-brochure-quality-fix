"""
Keyword coverage analysis for property listings.
"""
from typing import List, Dict, Set, Optional


class KeywordCoverage:
    """
    Analyzes text for coverage of important property keywords.
    """
    
    # Essential keywords for property listings (with priorities)
    ESSENTIAL_KEYWORDS = {
        "high_priority": ["bedroom", "bathroom", "kitchen", "garden", "parking", "epc"],
        "medium_priority": ["living", "condition", "school", "transport", "station"],
        "low_priority": ["modern", "spacious", "light", "bright", "renovated", "amenities"],
    }
    
    # Channel-specific important keywords
    CHANNEL_KEYWORDS = {
        "rightmove": ["bedroom", "bathroom", "parking", "epc", "garden", "kitchen"],
        "brochure": ["bedroom", "bathroom", "kitchen", "living", "garden", "condition", "location"],
        "social": ["bedroom", "bathroom", "location", "key feature"],
        "email": ["bedroom", "bathroom", "garden", "parking", "price"],
    }
    
    def __init__(self, required_keywords: Optional[List[str]] = None):
        """
        Initialize keyword coverage analyzer.
        
        Args:
            required_keywords: Optional list of required keywords from config
        """
        self.required_keywords = required_keywords or []
    
    def analyze_coverage(
        self,
        text: str,
        channel: str = "rightmove",
        property_features: Optional[List[str]] = None
    ) -> Dict:
        """
        Analyze keyword coverage in text with channel-specific requirements.
        
        Args:
            text: Text to analyze
            channel: Publishing channel (rightmove, brochure, social, email)
            property_features: List of property features to check for
            
        Returns:
            Dict with coverage analysis:
                - covered_keywords: List of found keywords
                - missing_keywords: List of missing important keywords
                - coverage_score: Float 0-1 indicating coverage percentage
                - suggestions: List of suggested additions
        """
        text_lower = text.lower()
        
        # Combine all keywords to check
        all_keywords = set()
        covered = set()
        
        # Add essential keywords
        for priority, keywords in self.ESSENTIAL_KEYWORDS.items():
            all_keywords.update(keywords)
        
        # Add channel-specific keywords
        channel_keywords = self.CHANNEL_KEYWORDS.get(channel, [])
        all_keywords.update(channel_keywords)
        
        # Add configured required keywords
        all_keywords.update(self.required_keywords)
        
        # Add property-specific features
        if property_features:
            all_keywords.update([f.lower() for f in property_features])
        
        # Check which keywords are covered
        for keyword in all_keywords:
            if keyword in text_lower:
                covered.add(keyword)
        
        missing = all_keywords - covered
        
        # Calculate weighted coverage score
        coverage_score = self._calculate_weighted_score(covered, missing, channel)
        
        # Generate suggestions for missing important keywords
        suggestions = self._generate_suggestions(missing, channel, property_features)
        
        return {
            "covered_keywords": sorted(list(covered)),
            "missing_keywords": sorted(list(missing)),
            "coverage_score": round(coverage_score, 2),
            "suggestions": suggestions,
        }
    
    def _calculate_weighted_score(
        self,
        covered: Set[str],
        missing: Set[str],
        channel: str
    ) -> float:
        """
        Calculate weighted coverage score based on keyword priority.
        
        Args:
            covered: Set of covered keywords
            missing: Set of missing keywords
            channel: Publishing channel
            
        Returns:
            Float score between 0 and 1
        """
        total_weight = 0.0
        covered_weight = 0.0
        
        # Weight by priority
        priority_weights = {
            "high_priority": 3.0,
            "medium_priority": 2.0,
            "low_priority": 1.0,
        }
        
        # Add weights for essential keywords
        for priority, keywords in self.ESSENTIAL_KEYWORDS.items():
            weight = priority_weights[priority]
            for keyword in keywords:
                total_weight += weight
                if keyword in covered:
                    covered_weight += weight
        
        # Add extra weight for channel-specific keywords
        channel_keywords = self.CHANNEL_KEYWORDS.get(channel, [])
        for keyword in channel_keywords:
            total_weight += 2.0  # Channel-specific keywords are important
            if keyword in covered:
                covered_weight += 2.0
        
        # Add weight for required keywords
        for keyword in self.required_keywords:
            total_weight += 3.0  # Required keywords are high priority
            if keyword in covered:
                covered_weight += 3.0
        
        if total_weight == 0:
            return 1.0
        
        return covered_weight / total_weight
    
    def _generate_suggestions(
        self,
        missing_keywords: Set[str],
        channel: str,
        property_features: Optional[List[str]] = None
    ) -> List[str]:
        """
        Generate suggestions for missing keywords.
        
        Args:
            missing_keywords: Set of missing keywords
            channel: Publishing channel
            property_features: Property features list
            
        Returns:
            List of suggestion strings
        """
        suggestions = []
        
        # Check for missing high-priority keywords
        high_priority_missing = [
            kw for kw in self.ESSENTIAL_KEYWORDS["high_priority"]
            if kw in missing_keywords
        ]
        
        # Check for missing required keywords
        required_missing = [kw for kw in self.required_keywords if kw in missing_keywords]
        
        # Check for missing channel-specific keywords
        channel_missing = [
            kw for kw in self.CHANNEL_KEYWORDS.get(channel, [])
            if kw in missing_keywords
        ]
        
        # Prioritize suggestions
        if required_missing:
            for keyword in required_missing[:3]:  # Top 3
                suggestions.append(f"Required keyword missing: mention '{keyword}' in description")
        
        if high_priority_missing:
            for keyword in high_priority_missing[:2]:  # Top 2
                suggestions.append(f"Important: consider highlighting '{keyword}'")
        
        if channel_missing:
            for keyword in channel_missing[:2]:  # Top 2
                suggestions.append(f"For {channel}: mention '{keyword}'")
        
        # Property-specific features
        if property_features:
            for feature in property_features:
                if feature.lower() in missing_keywords and len(suggestions) < 5:
                    suggestions.append(f"Property feature not mentioned: '{feature}'")
        
        if not suggestions:
            suggestions.append("Good keyword coverage - all important terms mentioned")
        
        return suggestions[:5]  # Limit to 5 suggestions
    
    def get_keyword_density(self, text: str) -> Dict[str, int]:
        """
        Calculate keyword density (count of each keyword).
        
        Args:
            text: Text to analyze
            
        Returns:
            Dict mapping keywords to their counts
        """
        text_lower = text.lower()
        density = {}
        
        # Check all essential keywords
        for category, keywords in self.ESSENTIAL_KEYWORDS.items():
            for keyword in keywords:
                count = text_lower.count(keyword)
                if count > 0:
                    density[keyword] = count
        
        # Check required keywords
        for keyword in self.required_keywords:
            count = text_lower.count(keyword)
            if count > 0:
                density[keyword] = count
        
        return density
    
    def get_channel_requirements(self, channel: str) -> List[str]:
        """
        Get required keywords for a specific channel.
        
        Args:
            channel: Publishing channel
            
        Returns:
            List of required keywords
        """
        return self.CHANNEL_KEYWORDS.get(channel, [])
