"""
Social Media Caption Generator
Orchestrates Claude API to generate platform-optimized social media captions with guardrails.
"""

from typing import Dict, List, Optional
from dataclasses import dataclass
import json

from services.social_guardrails import SocialGuardrails, validate_social_caption
from services.hashtag_generator import HashtagGenerator
from services.guardrails import AI_SLOP_BANNED_PHRASES


@dataclass
class SocialCaption:
    """Represents a social media caption variant"""
    caption: str
    character_count: int
    word_count: int
    length_category: str  # 'short', 'medium', 'long'
    guardrail_valid: bool
    guardrail_summary: Dict


@dataclass
class SocialPost:
    """Complete social media post with variants and hashtags"""
    platform: str
    variants: List[SocialCaption]
    hashtags: Dict[str, List[str]]  # {' reach', 'local', 'recommended', 'brand'}
    image_requirements: Dict


class SocialMediaGenerator:
    """Generates social media content with Claude API and guardrails"""

    def __init__(self, claude_client=None):
        """
        Initialize social media generator.

        Args:
            claude_client: ClaudeClient instance (from services.claude_client)
        """
        self.claude = claude_client
        self.guardrails = SocialGuardrails()
        self.hashtag_gen = HashtagGenerator(brand_tags=['#SavillsUK', '#Savills'])

    def generate_post(
        self,
        session_data: Dict,
        platform: str = 'facebook',
        strategy: str = 'highlight_feature',
        template: str = 'classic'
    ) -> SocialPost:
        """
        Generate social media post with 3 variants and hashtags.

        Args:
            session_data: Brochure session data (property, location, content)
            platform: 'facebook' or 'instagram'
            strategy: 'highlight_feature', 'location_appeal', or 'price_value'
            template: 'classic', 'modern', or 'minimal'

        Returns:
            SocialPost with variants and hashtags
        """
        # Extract property data from session
        property_data = session_data.get('property_data', {})
        location_data = session_data.get('location_data', {})
        brochure_content = session_data.get('brochure_content', '')

        # Generate 3 variants
        variants = []
        for length in ['short', 'medium', 'long']:
            caption_text = self._generate_caption(
                property_data=property_data,
                location_data=location_data,
                brochure_content=brochure_content,
                platform=platform,
                strategy=strategy,
                template=template,
                variant_length=length
            )

            # Validate with guardrails
            is_valid, summary = validate_social_caption(caption_text, platform, length)

            variant = SocialCaption(
                caption=caption_text,
                character_count=len(caption_text),
                word_count=len(caption_text.split()),
                length_category=length,
                guardrail_valid=is_valid,
                guardrail_summary=summary
            )

            variants.append(variant)

        # Generate hashtags
        hashtags_dict = self.hashtag_gen.generate(
            property_data=property_data,
            location_data=location_data,
            platform=platform,
            max_tags=6 if platform == 'facebook' else 8
        )

        hashtags = {
            'reach': hashtags_dict.reach,
            'local': hashtags_dict.local,
            'recommended': hashtags_dict.recommended,
            'brand': hashtags_dict.brand
        }

        # Image requirements by platform
        image_requirements = self._get_image_requirements(platform)

        return SocialPost(
            platform=platform,
            variants=variants,
            hashtags=hashtags,
            image_requirements=image_requirements
        )

    def _generate_caption(
        self,
        property_data: Dict,
        location_data: Dict,
        brochure_content: str,
        platform: str,
        strategy: str,
        template: str,
        variant_length: str
    ) -> str:
        """Generate a single caption variant using Claude API"""

        # If Claude not available, use mock generation
        if not self.claude or not self.claude.is_available():
            return self._generate_mock_caption(
                property_data, location_data, platform, variant_length
            )

        # Build prompt
        prompt = self._build_prompt(
            property_data=property_data,
            location_data=location_data,
            brochure_content=brochure_content,
            platform=platform,
            strategy=strategy,
            template=template,
            variant_length=variant_length
        )

        # Call Claude API
        try:
            response = self.claude.generate_completion(
                prompt=prompt,
                max_tokens=500,
                temperature=0.7 if variant_length == 'short' else (0.8 if variant_length == 'medium' else 0.9)
            )

            # Extract caption from response
            caption = response.get('content', [{}])[0].get('text', '').strip()

            return caption

        except Exception as e:
            print(f"⚠️ Claude API failed: {e}. Using mock generation.")
            return self._generate_mock_caption(
                property_data, location_data, platform, variant_length
            )

    def _build_prompt(
        self,
        property_data: Dict,
        location_data: Dict,
        brochure_content: str,
        platform: str,
        strategy: str,
        template: str,
        variant_length: str
    ) -> str:
        """Build Claude API prompt with guardrails and strategy"""

        # Character targets by variant
        targets = {
            'short': (80, 120),
            'medium': (120, 180),
            'long': (180, 300)
        }
        min_chars, max_chars = targets[variant_length]

        # Banned phrases list for prompt
        banned_list = ', '.join(f'"{p}"' for p in AI_SLOP_BANNED_PHRASES[:15])

        # Strategy guidance
        strategy_guide = {
            'highlight_feature': 'Lead with the most distinctive feature of the property (garden, kitchen, location view, etc.). Make this the hook.',
            'location_appeal': 'Emphasize the location benefits: proximity to schools, transport, village/town center, local amenities. Make location the selling point.',
            'price_value': 'Focus on value proposition: price, size for price, investment potential, price per sq ft if relevant.'
        }

        # Template style
        template_style = {
            'classic': 'Professional estate agent tone. Formal, factual, structured. No emojis.',
            'modern': 'Lifestyle-focused with emoji highlights (2-4 emojis max). Conversational but professional. Use bullet points with emoji markers.',
            'minimal': 'Ultra-concise. Direct facts only. Short sentences. Punchy.',
        }

        # Platform specifics
        platform_specifics = {
            'facebook': 'Facebook caption. Can use full sentences and paragraphs. Professional tone.',
            'instagram': 'Instagram caption. Use line breaks and emojis if modern template. Add "Link in bio" or "DM for details" as CTA.'
        }

        prompt = f"""You are writing a {platform} social media caption for a property listing.

PROPERTY DETAILS:
{json.dumps(property_data, indent=2)}

LOCATION:
{json.dumps(location_data, indent=2)}

BROCHURE DESCRIPTION (for context):
{brochure_content[:500]}...

TASK:
Write a {variant_length} {platform} caption ({min_chars}-{max_chars} characters).

STRATEGY: {strategy_guide[strategy]}

STYLE: {template_style[template]}

PLATFORM: {platform_specifics[platform]}

CRITICAL GUARDRAILS (NON-NEGOTIABLE):
1. **Grounded in Facts**: Every claim must reference actual property details. NEVER make up features.
2. **BANNED PHRASES** - Absolutely forbidden: {banned_list}, and similar AI slop
3. **Structure**:
   - Short: Hook + CTA only
   - Medium: Hook + 1-2 bullet points + CTA
   - Long: Hook + 3-4 bullet points + CTA
4. **Tone**: Professional, specific, conversational (NOT corporate or flowery)
5. **Specificity**: Include measurements, materials, brand names, distances where possible
6. **NO HASHTAGS**: Do not include hashtags (handled separately)

EXAMPLES OF GOOD VS BAD:

❌ BAD: "This stunning property is nestled in a tranquil location and boasts breathtaking views."
✅ GOOD: "4-bedroom semi-detached home in Didsbury\n\nModern kitchen • South-facing garden • Near top schools\n\nView: savills.me/abc123"

❌ BAD: "A rare opportunity to own a beautifully appointed family home in a sought-after area."
✅ GOOD: "Family home 0.3 miles from Didsbury Village\n\n• 4 beds with fitted wardrobes\n• Kitchen with Bosch appliances\n• Garden (approx. 50ft)\n\n£625,000. Book viewing: 0161-XXX-XXXX"

Write ONLY the caption. No preamble, no explanation. Start directly with the content."""

        return prompt

    def _generate_mock_caption(
        self,
        property_data: Dict,
        location_data: Dict,
        platform: str,
        variant_length: str
    ) -> str:
        """Generate mock caption when Claude is unavailable"""

        beds = property_data.get('bedrooms', 3)
        prop_type = property_data.get('property_type', 'house')
        area = location_data.get('area', 'Local Area')
        price = property_data.get('price', 500000)

        if variant_length == 'short':
            return f"{beds}-bed {prop_type} in {area}\n\nView listing at savills.me/property"

        elif variant_length == 'medium':
            return f"{beds}-bedroom {prop_type} in {area}\n\n• Modern fitted kitchen\n• Private garden\n• Excellent local schools\n\n£{price:,}. Book a viewing today."

        else:  # long
            return f"Spacious {beds}-bedroom {prop_type} in the heart of {area}\n\nThis property offers:\n• {beds} well-proportioned bedrooms\n• Modern kitchen with integrated appliances\n• Private garden perfect for family living\n• Off-street parking\n• Walking distance to local amenities\n\nGuide Price: £{price:,}\n\nArrange a viewing: savills.me/property or call 0161-XXX-XXXX"

    def _get_image_requirements(self, platform: str) -> Dict:
        """Get image dimension requirements for platform"""
        if platform == 'facebook':
            return {
                'primary_aspect': '1.91:1',
                'dimensions': [
                    {'width': 1200, 'height': 628, 'label': 'Landscape (recommended)'}
                ]
            }
        elif platform == 'instagram':
            return {
                'primary_aspect': '1:1',
                'dimensions': [
                    {'width': 1080, 'height': 1080, 'label': 'Square (1:1)'},
                    {'width': 1080, 'height': 1350, 'label': 'Portrait (4:5)'}
                ]
            }
        return {}


# Module-level convenience function
def generate_social_post(
    session_data: Dict,
    platform: str = 'facebook',
    strategy: str = 'highlight_feature',
    template: str = 'classic',
    claude_client=None
) -> Dict:
    """
    Generate social media post with variants and hashtags.

    Returns:
        Dict with 'platform', 'variants', 'hashtags', 'image_requirements'
    """
    generator = SocialMediaGenerator(claude_client=claude_client)
    post = generator.generate_post(session_data, platform, strategy, template)

    return {
        'platform': post.platform,
        'variants': [
            {
                'caption': v.caption,
                'character_count': v.character_count,
                'word_count': v.word_count,
                'length': v.length_category,
                'valid': v.guardrail_valid,
                'guardrails': v.guardrail_summary
            }
            for v in post.variants
        ],
        'hashtags': post.hashtags,
        'image_requirements': post.image_requirements
    }
