"""
Social Media Content Guardrails
Validates social media captions against quality rules to prevent generic AI slop.
"""

import re
from typing import List, Dict, Tuple
from dataclasses import dataclass

# Banned phrases - must NEVER appear in social media captions
SOCIAL_BANNED_PHRASES = [
    # Generic AI slop
    "nestled", "tucked away", "stunning", "breathtaking", "must-see",
    "dream home", "perfect for", "ideal for", "won't last long",
    "rare opportunity", "unique opportunity", "sanctuary", "oasis",
    "exudes", "boasts", "epitomises", "epitomizes",

    # Vague/flowery language
    "absolute gem", "hidden gem", "rare find", "exceptional opportunity",
    "truly special", "one of a kind", "something special",
    "beautifully appointed", "tastefully decorated", "thoughtfully designed",

    # Desperate urgency
    "act fast", "don't miss out", "hurry", "limited time",
    "first to view", "early viewing recommended",

    # Over-promising
    "lifestyle you deserve", "home of your dreams", "everything you need",
    "ticks all the boxes", "checks all the boxes",
]

# Weak/vague words to avoid
WEAK_WORDS = [
    "nice", "great", "lovely", "good", "beautiful", "amazing",
    "wonderful", "fantastic", "incredible", "superb", "excellent",
    "quality", "charming", "delightful", "attractive",
]

# Required specificity indicators (at least 2 should be present)
SPECIFICITY_INDICATORS = [
    # Measurements
    r'\d+\s*(bed|bedroom|bath|bathroom|reception|sq\s*ft|sqft|m2|metre|meter|ft)',
    # Specific materials/brands
    r'(marble|granite|oak|walnut|engineered|Bosch|Siemens|Miele|Neff)',
    # Specific locations
    r'(village|station|school|park|high street|town centre|city centre)',
    # Numbers/dates
    r'(built\s+in\s+\d{4}|\d+\s+year|£\d+|price|guide)',
]


@dataclass
class GuardrailViolation:
    """Represents a guardrail rule violation"""
    severity: str  # 'error', 'warning', 'info'
    rule: str
    message: str
    position: int = -1  # Character position of violation
    suggestion: str = None


class SocialGuardrails:
    """Validates social media content against quality guardrails"""

    def __init__(self):
        self.banned_pattern = re.compile(
            r'\b(' + '|'.join(re.escape(phrase) for phrase in SOCIAL_BANNED_PHRASES) + r')\b',
            re.IGNORECASE
        )
        self.weak_pattern = re.compile(
            r'\b(' + '|'.join(re.escape(word) for word in WEAK_WORDS) + r')\b',
            re.IGNORECASE
        )

    def validate_caption(
        self,
        caption: str,
        platform: str,
        variant_length: str
    ) -> Tuple[bool, List[GuardrailViolation]]:
        """
        Validate a social media caption against all guardrails.

        Args:
            caption: The caption text to validate
            platform: 'facebook' or 'instagram'
            variant_length: 'short', 'medium', or 'long'

        Returns:
            (is_valid, violations)
        """
        violations = []

        # Rule 1: Check for banned phrases (BLOCKING)
        banned_violations = self._check_banned_phrases(caption)
        violations.extend(banned_violations)

        # Rule 2: Check for weak/vague words (WARNING)
        weak_violations = self._check_weak_words(caption)
        violations.extend(weak_violations)

        # Rule 3: Check for specificity (WARNING)
        specificity_violations = self._check_specificity(caption)
        violations.extend(specificity_violations)

        # Rule 4: Check length constraints (ERROR)
        length_violations = self._check_length(caption, platform, variant_length)
        violations.extend(length_violations)

        # Rule 5: Check structure (INFO)
        structure_violations = self._check_structure(caption, variant_length)
        violations.extend(structure_violations)

        # Rule 6: Check emoji usage (INFO - Instagram specific)
        if platform == 'instagram':
            emoji_violations = self._check_emoji_usage(caption)
            violations.extend(emoji_violations)

        # Caption is invalid if there are any ERROR-level violations
        has_errors = any(v.severity == 'error' for v in violations)

        return (not has_errors, violations)

    def _check_banned_phrases(self, caption: str) -> List[GuardrailViolation]:
        """Check for banned AI slop phrases"""
        violations = []

        for match in self.banned_pattern.finditer(caption):
            phrase = match.group(0)
            violations.append(GuardrailViolation(
                severity='error',
                rule='banned_phrase',
                message=f'Banned phrase detected: "{phrase}". Use specific facts instead.',
                position=match.start(),
                suggestion='Replace with specific detail (e.g., measurements, materials, location)'
            ))

        return violations

    def _check_weak_words(self, caption: str) -> List[GuardrailViolation]:
        """Check for weak/vague adjectives"""
        violations = []

        matches = list(self.weak_pattern.finditer(caption))

        # Only warn if there are 3+ weak words
        if len(matches) >= 3:
            words = [m.group(0) for m in matches]
            violations.append(GuardrailViolation(
                severity='warning',
                rule='weak_words',
                message=f'Too many vague adjectives: {", ".join(set(words))}',
                suggestion='Replace with specific measurements, materials, or features'
            ))

        return violations

    def _check_specificity(self, caption: str) -> List[GuardrailViolation]:
        """Check that caption includes specific details"""
        violations = []

        # Count how many specificity indicators are present
        specificity_count = 0
        for pattern in SPECIFICITY_INDICATORS:
            if re.search(pattern, caption, re.IGNORECASE):
                specificity_count += 1

        # Require at least 2 specific details
        if specificity_count < 2:
            violations.append(GuardrailViolation(
                severity='warning',
                rule='lacks_specificity',
                message='Caption lacks specific details (measurements, materials, locations)',
                suggestion='Add concrete facts: room sizes, brand names, distances to amenities'
            ))

        return violations

    def _check_length(
        self,
        caption: str,
        platform: str,
        variant_length: str
    ) -> List[GuardrailViolation]:
        """Check caption length against platform limits and variant targets"""
        violations = []

        char_count = len(caption)

        # Platform maximums (hard limits)
        platform_limits = {
            'facebook': 63206,  # Effectively unlimited
            'instagram': 2200
        }

        # Variant targets
        variant_targets = {
            'short': (80, 120),
            'medium': (120, 180),
            'long': (180, 300)
        }

        # Check hard platform limit
        max_chars = platform_limits.get(platform, 500)
        if char_count > max_chars:
            violations.append(GuardrailViolation(
                severity='error',
                rule='exceeds_platform_limit',
                message=f'Caption exceeds {platform} limit: {char_count}/{max_chars} chars',
                suggestion=f'Reduce to under {max_chars} characters'
            ))

        # Check variant target (soft warning)
        if variant_length in variant_targets:
            min_chars, max_chars = variant_targets[variant_length]
            if char_count < min_chars:
                violations.append(GuardrailViolation(
                    severity='info',
                    rule='below_variant_target',
                    message=f'{variant_length.capitalize()} variant too short: {char_count} chars (target: {min_chars}-{max_chars})',
                ))
            elif char_count > max_chars:
                violations.append(GuardrailViolation(
                    severity='info',
                    rule='exceeds_variant_target',
                    message=f'{variant_length.capitalize()} variant too long: {char_count} chars (target: {min_chars}-{max_chars})',
                ))

        return violations

    def _check_structure(self, caption: str, variant_length: str) -> List[GuardrailViolation]:
        """Check that caption follows expected structure"""
        violations = []

        lines = [line.strip() for line in caption.split('\n') if line.strip()]

        # For medium/long variants, expect structured format
        if variant_length in ['medium', 'long']:
            # Should have multiple lines/sections
            if len(lines) < 3:
                violations.append(GuardrailViolation(
                    severity='info',
                    rule='structure_suggestion',
                    message=f'{variant_length.capitalize()} variant should have clear structure (hook + bullets + CTA)',
                    suggestion='Consider: Opening hook → Key features (bullets) → Call to action'
                ))

        return violations

    def _check_emoji_usage(self, caption: str) -> List[GuardrailViolation]:
        """Check emoji usage for Instagram (should be moderate, not excessive)"""
        violations = []

        # Count emojis (rough check for unicode emoji ranges)
        emoji_count = len(re.findall(r'[\U0001F300-\U0001F9FF]', caption))

        if emoji_count > 10:
            violations.append(GuardrailViolation(
                severity='info',
                rule='excessive_emojis',
                message=f'Too many emojis ({emoji_count}). Keep it professional with 3-5 highlights.',
                suggestion='Use emojis sparingly to highlight key features'
            ))

        return violations

    def get_guardrail_summary(self, violations: List[GuardrailViolation]) -> Dict:
        """Generate summary of guardrail results"""
        return {
            'total_violations': len(violations),
            'errors': len([v for v in violations if v.severity == 'error']),
            'warnings': len([v for v in violations if v.severity == 'warning']),
            'info': len([v for v in violations if v.severity == 'info']),
            'passes': len(violations) == 0 or all(v.severity == 'info' for v in violations),
            'violations': [
                {
                    'severity': v.severity,
                    'rule': v.rule,
                    'message': v.message,
                    'suggestion': v.suggestion
                }
                for v in violations
            ]
        }


# Module-level function for easy import
def validate_social_caption(
    caption: str,
    platform: str = 'facebook',
    variant_length: str = 'medium'
) -> Tuple[bool, Dict]:
    """
    Convenience function to validate a social media caption.

    Returns:
        (is_valid, summary_dict)
    """
    validator = SocialGuardrails()
    is_valid, violations = validator.validate_caption(caption, platform, variant_length)
    summary = validator.get_guardrail_summary(violations)

    return is_valid, summary
