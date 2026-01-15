"""
Compliance checking for property listing copy.
"""
from typing import List, Dict, Optional
import re


class ComplianceChecker:
    """
    Checks property listings for compliance with ASA/Rightmove guidelines.
    """
    
    # Prohibited terms that may violate guidelines
    PROHIBITED_TERMS = [
        "perfect",
        "unique",
        "ideal",
        "stunning",
        "amazing",
        "breathtaking",
        "spectacular",
        "guaranteed",
        "best ever",
    ]

    # AI SLOP PHRASES - Expanded list from guardrails
    AI_SLOP_PHRASES = [
        "nestled",
        "tucked away",
        "boasts",
        "exudes",
        "affords stunning",
        "commands views",
        "abundance of",
        "plethora of",
        "epitomises",
        "epitomizes",
        "seamlessly blending",
        "verdant canvas",
        "sanctuary",
        "tranquil sophistication",
        "restorative repose",
        "enchanting vistas",
        "morning contemplation",
        "immersive natural setting",
        "offers a unique opportunity",
        "lifestyle choice",
        "everyday luxury",
        "curated living",
        "resort-style",
        "hotel-inspired",
        "distinguished residence",
        "thoughtfully curated",
    ]
    
    # Warning terms that need evidence
    EVIDENCE_REQUIRED_TERMS = [
        "newly renovated",
        "award-winning",
        "best in class",
        "luxury",
        "premium",
        "executive",
        "investment opportunity",
    ]
    
    # Discriminatory terms to flag
    DISCRIMINATORY_TERMS = [
        "perfect for families",
        "ideal for couples",
        "great for singles",
        "adults only",
        "no children",
        "mature tenants",
    ]
    
    # Channel-specific word limits
    CHANNEL_LIMITS = {
        "rightmove": 1000,
        "brochure": 2000,
        "social": 300,
        "email": 500,
    }
    
    def __init__(self, required_keywords: Optional[List[str]] = None):
        """
        Initialize compliance checker.
        
        Args:
            required_keywords: Optional list of required keywords (e.g., from config)
        """
        self.required_keywords = required_keywords or []
    
    def check_compliance(
        self,
        text: str,
        channel: str = "rightmove",
        property_data: Optional[Dict] = None
    ) -> Dict:
        """
        Check text for compliance issues.
        
        Args:
            text: Listing text to check
            channel: Publishing channel (rightmove, brochure, social, email)
            property_data: Optional property data for context
            
        Returns:
            Dict with compliance analysis:
                - compliant: Bool overall compliance (no errors)
                - warnings: List of warning dicts with severity, message, suggestion
                - score: Float 0-1 compliance score
                - suggestions: List of improvement suggestions
        """
        text_lower = text.lower()
        warnings = []
        
        # Check for prohibited terms
        for term in self.PROHIBITED_TERMS:
            if term in text_lower:
                warnings.append({
                    "severity": "warning",
                    "message": f"Subjective term '{term}' should be avoided or backed with evidence",
                    "suggestion": f"Replace '{term}' with factual descriptions like 'well-maintained' or 'recently renovated'"
                })

        # Check for AI slop phrases
        for phrase in self.AI_SLOP_PHRASES:
            if phrase.lower() in text_lower:
                warnings.append({
                    "severity": "error",
                    "message": f"AI-generated cliché detected: '{phrase}'",
                    "suggestion": "Use specific, factual descriptions instead of generic AI phrases"
                })

        # Check for terms requiring evidence
        for term in self.EVIDENCE_REQUIRED_TERMS:
            if term in text_lower:
                warnings.append({
                    "severity": "warning",
                    "message": f"Claim '{term}' requires supporting evidence",
                    "suggestion": f"Add specific evidence such as dates, certifications, or measurable facts"
                })
        
        # Check for discriminatory language
        for term in self.DISCRIMINATORY_TERMS:
            if term in text_lower:
                warnings.append({
                    "severity": "error",
                    "message": f"Potentially discriminatory language: '{term}'",
                    "suggestion": "Remove discriminatory language. Describe property features objectively"
                })
        
        # Check for exaggeration patterns
        if re.search(r"\b(never|always|every|all)\b", text_lower):
            warnings.append({
                "severity": "warning",
                "message": "Avoid absolute claims (never, always, every, all)",
                "suggestion": "Use qualified language like 'typically', 'often', or 'many'"
            })
        
        if re.search(r"\b(best|finest|most)\b", text_lower):
            warnings.append({
                "severity": "warning",
                "message": "Superlatives should be backed by evidence",
                "suggestion": "Replace with specific, verifiable attributes"
            })
        
        if re.search(r"!{2,}", text):
            warnings.append({
                "severity": "info",
                "message": "Multiple exclamation marks are unprofessional",
                "suggestion": "Use single exclamation marks sparingly or remove"
            })
        
        # Check EPC requirement
        epc_warnings = self.check_epc_requirement(text, property_data)
        warnings.extend(epc_warnings)
        
        # Check word count for channel
        word_count = len(text.split())
        max_words = self.CHANNEL_LIMITS.get(channel, 1000)
        if word_count > max_words:
            warnings.append({
                "severity": "error",
                "message": f"Text exceeds maximum word count for {channel} ({word_count}/{max_words} words)",
                "suggestion": f"Reduce text length to {max_words} words or fewer"
            })
        
        # Calculate compliance score
        error_count = sum(1 for w in warnings if w["severity"] == "error")
        warning_count = sum(1 for w in warnings if w["severity"] == "warning")
        info_count = sum(1 for w in warnings if w["severity"] == "info")
        
        # Weighted scoring: errors = -0.15, warnings = -0.05, info = -0.02
        score_deduction = (error_count * 0.15) + (warning_count * 0.05) + (info_count * 0.02)
        compliance_score = max(0.0, 1.0 - score_deduction)
        
        # Generate suggestions
        suggestions = self._generate_suggestions(warnings)
        
        # Compliant if no errors (warnings are okay)
        compliant = error_count == 0
        
        return {
            "compliant": compliant,
            "warnings": warnings,
            "score": round(compliance_score, 2),
            "suggestions": suggestions,
        }
    
    def check_epc_requirement(
        self,
        text: str,
        property_data: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Check if EPC is mentioned (required for UK property listings).
        
        Args:
            text: Listing text
            property_data: Optional property data with epc_rating field
            
        Returns:
            List of warning dicts
        """
        warnings = []
        text_lower = text.lower()
        
        # Check if EPC mentioned in text
        epc_mentioned = (
            "epc" in text_lower or
            "energy performance" in text_lower or
            "energy rating" in text_lower
        )
        
        # Check if EPC in property data
        has_epc_data = property_data and property_data.get("epc_rating")
        
        if not epc_mentioned and not has_epc_data:
            warnings.append({
                "severity": "error",
                "message": "EPC rating must be included (ASA/Rightmove requirement)",
                "suggestion": "Add EPC rating to the description (e.g., 'EPC Rating: C')"
            })
        elif has_epc_data and not epc_mentioned:
            warnings.append({
                "severity": "info",
                "message": "EPC rating available but not mentioned in text",
                "suggestion": f"Consider mentioning: 'EPC Rating: {property_data.get('epc_rating')}'"
            })
        
        return warnings
    
    def _generate_suggestions(self, warnings: List[Dict]) -> List[str]:
        """
        Generate actionable suggestions based on issues found.
        
        Args:
            warnings: List of warning dicts
            
        Returns:
            List of suggestion strings
        """
        suggestions = []
        
        error_warnings = [w for w in warnings if w["severity"] == "error"]
        regular_warnings = [w for w in warnings if w["severity"] == "warning"]
        
        if error_warnings:
            suggestions.append("Fix critical compliance errors before publishing")
        
        if regular_warnings:
            suggestions.append("Replace subjective language with factual descriptions")
            suggestions.append("Back claims with specific evidence (e.g., dates, certifications)")
        
        if not warnings:
            suggestions.append("Copy meets compliance guidelines")
        
        return suggestions
    
    def filter_text(self, text: str) -> str:
        """
        Automatically remove or replace non-compliant terms.
        
        Args:
            text: Original text
            
        Returns:
            Filtered text with compliance issues resolved
        """
        filtered = text
        
        # Replace prohibited terms with neutral alternatives
        replacements = {
            "perfect": "well-suited",
            "stunning": "impressive",
            "amazing": "notable",
            "breathtaking": "striking",
            "spectacular": "impressive",
            "guaranteed": "expected",
        }
        
        for prohibited, replacement in replacements.items():
            # Case-insensitive replacement
            pattern = re.compile(re.escape(prohibited), re.IGNORECASE)
            filtered = pattern.sub(replacement, filtered)
        
        # Remove multiple exclamation marks
        filtered = re.sub(r'!{2,}', '!', filtered)
        
        return filtered
