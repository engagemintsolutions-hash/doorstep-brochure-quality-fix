"""
Additional content generators for Rightmove, social media, emails, etc.

Provides value-added content beyond the main brochure.
"""
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class RightmoveGenerator:
    """
    Generate Rightmove-optimized property descriptions.

    Rightmove requirements:
    - 80 words maximum (hard cap)
    - ASA compliant
    - Clear, factual language
    - Include key selling points
    """

    def __init__(self, claude_client=None):
        self.claude_client = claude_client

    async def generate(
        self,
        property_data: Dict,
        location_data: Dict,
        main_description: str = None,
        brand_profile: Optional[any] = None
    ) -> str:
        """
        Generate Rightmove description (80 words max).

        Args:
            property_data: Property details
            location_data: Location info
            main_description: Full brochure description (to condense from)
            brand_profile: Optional brand profile for tone

        Returns:
            80-word Rightmove description
        """
        if not self.claude_client or not self.claude_client.is_available():
            return self._generate_mock(property_data, location_data)

        prompt = self._build_prompt(property_data, location_data, main_description, brand_profile)

        try:
            description = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=200,  # 80 words ≈ 120-150 tokens
                temperature=0.5  # Lower temp for consistent, compliant output
            )

            # Ensure word count limit
            words = description.split()
            if len(words) > 80:
                description = ' '.join(words[:80]) + '...'

            return description.strip()

        except Exception as e:
            logger.error(f"Rightmove generation failed: {e}")
            return self._generate_mock(property_data, location_data)

    def _build_prompt(self, property_data: Dict, location_data: Dict, main_description: str, brand_profile) -> str:
        """Build prompt for Rightmove description."""
        prompt = f"""Generate a property description for Rightmove (UK property portal).

STRICT REQUIREMENTS:
- MAXIMUM 80 words (hard limit)
- ASA compliant (no superlatives, exaggerations, or unverifiable claims)
- Clear, factual, informative language
- Include: property type, bedrooms, bathrooms, key features, location
- British English spelling

Property Details:
- Type: {property_data.get('propertyType', 'Property')}
- Bedrooms: {property_data.get('bedrooms', 'N/A')}
- Bathrooms: {property_data.get('bathrooms', 'N/A')}
- Features: {', '.join(property_data.get('features', [])[:5])}
- Location: {location_data.get('address', 'N/A')}
"""

        if main_description:
            prompt += f"\nFull Description (to condense):\n{main_description[:500]}\n"

        if brand_profile:
            prompt += f"\nBrand Tone: {brand_profile.get_tone_preferences().get('style', 'professional')}\n"

        prompt += "\nWrite ONLY the 80-word description (no explanation, no headings):"

        return prompt

    def _generate_mock(self, property_data: Dict, location_data: Dict) -> str:
        """Generate mock Rightmove description."""
        prop_type = property_data.get('propertyType', 'property').replace('_', ' ').title()
        beds = property_data.get('bedrooms', '?')
        baths = property_data.get('bathrooms', '?')
        address = location_data.get('address', 'Desirable location')

        features = property_data.get('features', [])
        feature_str = ', '.join(features[:3]) if features else 'modern fixtures and fittings'

        description = f"Well-presented {beds}-bedroom {prop_type} located in {address}. "
        description += f"The property comprises {beds} bedrooms, {baths} bathrooms, and features {feature_str}. "
        description += "Internal viewing is highly recommended to appreciate the accommodation on offer."

        # Ensure under 80 words
        words = description.split()
        if len(words) > 80:
            description = ' '.join(words[:80])

        return description


class SocialMediaGenerator:
    """
    Generate social media content for property listings.

    Platforms:
    - Instagram (visual-focused, hashtags)
    - Facebook (longer, community-focused)
    - Twitter/X (concise, links)
    """

    def __init__(self, claude_client=None):
        self.claude_client = claude_client

    async def generate_instagram_posts(
        self,
        property_data: Dict,
        location_data: Dict,
        num_variants: int = 3
    ) -> List[Dict]:
        """
        Generate Instagram caption variants.

        Returns:
            List of {caption, hashtags, cta}
        """
        if not self.claude_client or not self.claude_client.is_available():
            return self._generate_mock_instagram(property_data, location_data, num_variants)

        prompt = self._build_instagram_prompt(property_data, location_data)

        try:
            response = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=400,
                temperature=0.8  # Higher creativity for social
            )

            # Parse response into variants
            return self._parse_instagram_response(response)

        except Exception as e:
            logger.error(f"Instagram generation failed: {e}")
            return self._generate_mock_instagram(property_data, location_data, num_variants)

    def _build_instagram_prompt(self, property_data: Dict, location_data: Dict) -> str:
        """Build prompt for Instagram captions."""
        return f"""Generate 3 Instagram caption variants for this property listing.

Property Details:
- Type: {property_data.get('propertyType', 'Property')}
- Bedrooms: {property_data.get('bedrooms', 'N/A')}
- Location: {location_data.get('address', 'N/A')}
- Features: {', '.join(property_data.get('features', [])[:5])}

Requirements:
- 3 different tones: Elegant, Excited, Informative
- 100-150 characters each (Instagram optimal length)
- Include emojis (house-related: 🏡 🏠 🌟 ✨ 🔑)
- Suggest 8-10 relevant hashtags
- Include call-to-action

Format each variant as:
VARIANT X: [tone]
Caption: [caption text]
Hashtags: [hashtags]
CTA: [call-to-action]

---

Generate all 3 variants:"""

    def _parse_instagram_response(self, response: str) -> List[Dict]:
        """Parse AI response into structured variants."""
        variants = []
        parts = response.split('VARIANT')

        for part in parts[1:]:  # Skip first empty part
            try:
                lines = part.strip().split('\n')
                caption = ''
                hashtags = ''
                cta = ''

                for line in lines:
                    if line.startswith('Caption:'):
                        caption = line.replace('Caption:', '').strip()
                    elif line.startswith('Hashtags:'):
                        hashtags = line.replace('Hashtags:', '').strip()
                    elif line.startswith('CTA:'):
                        cta = line.replace('CTA:', '').strip()

                if caption:
                    variants.append({
                        'caption': caption,
                        'hashtags': hashtags,
                        'cta': cta,
                        'platform': 'instagram'
                    })

            except Exception as e:
                logger.error(f"Error parsing variant: {e}")
                continue

        return variants if variants else self._generate_mock_instagram({}, {}, 3)

    def _generate_mock_instagram(self, property_data: Dict, location_data: Dict, num: int) -> List[Dict]:
        """Generate mock Instagram posts."""
        prop_type = property_data.get('propertyType', 'property').replace('_', ' ')
        beds = property_data.get('bedrooms', '?')
        address = location_data.get('address', 'prime location')

        variants = [
            {
                'caption': f"✨ Stunning {beds}-bed {prop_type} in {address}! Your dream home awaits 🏡🔑",
                'hashtags': '#NewListing #PropertyForSale #DreamHome #UKProperty #EstateAgent #HomeGoals #PropertySearch #HouseHunting',
                'cta': 'DM us for viewings!',
                'platform': 'instagram'
            },
            {
                'caption': f"🏠 NEW TO MARKET: Beautiful {beds}-bedroom {prop_type}. Viewing highly recommended!",
                'hashtags': '#JustListed #PropertySearch #UKHomes #ForSale #RealEstate #NewHome #PropertyMarket #HomeBuyers',
                'cta': 'Link in bio for details',
                'platform': 'instagram'
            },
            {
                'caption': f"🌟 {beds}-bed {prop_type} | {address} | Perfectly presented throughout. See photos! 📸",
                'hashtags': '#PropertyListing #HomeForSale #UKRealEstate #HouseTour #PropertyPhotography #InteriorGoals',
                'cta': 'Swipe to see more →',
                'platform': 'instagram'
            }
        ]

        return variants[:num]

    async def generate_facebook_posts(
        self,
        property_data: Dict,
        location_data: Dict,
        num_variants: int = 3
    ) -> List[Dict]:
        """
        Generate Facebook post variants.

        Returns:
            List of {post_text, cta, image_suggestion}
        """
        if not self.claude_client or not self.claude_client.is_available():
            return self._generate_mock_facebook(property_data, location_data, num_variants)

        prompt = self._build_facebook_prompt(property_data, location_data)

        try:
            response = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=500,
                temperature=0.7
            )

            return self._parse_facebook_response(response)

        except Exception as e:
            logger.error(f"Facebook generation failed: {e}")
            return self._generate_mock_facebook(property_data, location_data, num_variants)

    def _build_facebook_prompt(self, property_data: Dict, location_data: Dict) -> str:
        """Build prompt for Facebook posts."""
        return f"""Generate 3 Facebook post variants for this property listing.

Property Details:
- Type: {property_data.get('propertyType', 'Property')}
- Bedrooms: {property_data.get('bedrooms', 'N/A')}
- Bathrooms: {property_data.get('bathrooms', 'N/A')}
- Location: {location_data.get('address', 'N/A')}
- Features: {', '.join(property_data.get('features', [])[:6])}

Requirements:
- 3 different styles: Professional, Community-focused, Urgent
- 200-300 characters each (Facebook optimal)
- Use some emojis but not excessive
- Clear call-to-action
- Mention booking viewings

Format each variant as:
VARIANT X: [style]
Post: [post text]
CTA: [call-to-action button text]

---

Generate all 3 variants:"""

    def _parse_facebook_response(self, response: str) -> List[Dict]:
        """Parse AI response into structured variants."""
        variants = []
        parts = response.split('VARIANT')

        for part in parts[1:]:
            try:
                lines = part.strip().split('\n')
                post = ''
                cta = ''

                for line in lines:
                    if line.startswith('Post:'):
                        post = line.replace('Post:', '').strip()
                    elif line.startswith('CTA:'):
                        cta = line.replace('CTA:', '').strip()

                if post:
                    variants.append({
                        'post_text': post,
                        'cta': cta or 'Book Viewing',
                        'platform': 'facebook'
                    })

            except Exception as e:
                logger.error(f"Error parsing variant: {e}")
                continue

        return variants if variants else self._generate_mock_facebook({}, {}, 3)

    def _generate_mock_facebook(self, property_data: Dict, location_data: Dict, num: int) -> List[Dict]:
        """Generate mock Facebook posts."""
        prop_type = property_data.get('propertyType', 'property').replace('_', ' ')
        beds = property_data.get('bedrooms', '?')
        baths = property_data.get('bathrooms', '?')
        address = location_data.get('address', 'desirable location')

        variants = [
            {
                'post_text': f"🏡 NEW LISTING: {beds}-bedroom {prop_type} in {address}\n\n"
                           f"✓ {beds} bedrooms\n✓ {baths} bathrooms\n✓ Beautifully presented\n\n"
                           f"Don't miss out on this fantastic opportunity!",
                'cta': 'Book Viewing',
                'platform': 'facebook'
            },
            {
                'post_text': f"Looking for a {beds}-bed home in {address}? We've just listed this stunning {prop_type}! "
                           f"Perfect for families and featuring {baths} bathrooms. Early viewings recommended as properties in this area move quickly.",
                'cta': 'Learn More',
                'platform': 'facebook'
            },
            {
                'post_text': f"⚡ JUST LISTED ⚡\n\nExceptional {beds}-bedroom {prop_type} in sought-after {address}. "
                           f"This won't be on the market long! Call us today to arrange your viewing.",
                'cta': 'Call Now',
                'platform': 'facebook'
            }
        ]

        return variants[:num]


class EmailCampaignGenerator:
    """
    Generate email campaign templates for property listings.
    """

    def __init__(self, claude_client=None):
        self.claude_client = claude_client

    async def generate_just_listed_email(
        self,
        property_data: Dict,
        location_data: Dict,
        agent_details: Dict = None
    ) -> Dict:
        """
        Generate "Just Listed" email campaign.

        Returns:
            {subject, preview_text, body_html, body_text}
        """
        if not self.claude_client or not self.claude_client.is_available():
            return self._generate_mock_email(property_data, location_data, agent_details)

        prompt = self._build_email_prompt(property_data, location_data, agent_details)

        try:
            response = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=600,
                temperature=0.6
            )

            return self._parse_email_response(response)

        except Exception as e:
            logger.error(f"Email generation failed: {e}")
            return self._generate_mock_email(property_data, location_data, agent_details)

    def _build_email_prompt(self, property_data: Dict, location_data: Dict, agent_details: Dict) -> str:
        """Build prompt for email generation."""
        agent_name = agent_details.get('name', 'Your Estate Agent') if agent_details else 'Your Estate Agent'

        return f"""Generate a "Just Listed" email campaign for this property.

Property Details:
- Type: {property_data.get('propertyType', 'Property')}
- Bedrooms: {property_data.get('bedrooms', 'N/A')}
- Bathrooms: {property_data.get('bathrooms', 'N/A')}
- Location: {location_data.get('address', 'N/A')}
- Features: {', '.join(property_data.get('features', [])[:5])}

Agent: {agent_name}

Generate:
1. Subject Line (compelling, 50 chars max)
2. Preview Text (40 chars)
3. Email Body (HTML format, 150-200 words)
4. Clear CTA

Format:
SUBJECT: [subject line]
PREVIEW: [preview text]
BODY: [email body in plain text, indicate where images go]
CTA: [call-to-action button text]

Generate the email:"""

    def _parse_email_response(self, response: str) -> Dict:
        """Parse AI response into email components."""
        lines = response.split('\n')
        subject = ''
        preview = ''
        body = []
        cta = 'View Property'

        current_section = None

        for line in lines:
            if line.startswith('SUBJECT:'):
                subject = line.replace('SUBJECT:', '').strip()
            elif line.startswith('PREVIEW:'):
                preview = line.replace('PREVIEW:', '').strip()
            elif line.startswith('BODY:'):
                current_section = 'body'
            elif line.startswith('CTA:'):
                cta = line.replace('CTA:', '').strip()
                current_section = None
            elif current_section == 'body' and line.strip():
                body.append(line.strip())

        body_text = '\n\n'.join(body)

        return {
            'subject': subject or 'New Property Just Listed!',
            'preview_text': preview or 'See this stunning property before it\'s gone',
            'body_text': body_text,
            'body_html': self._convert_to_html(body_text),
            'cta': cta
        }

    def _convert_to_html(self, text: str) -> str:
        """Convert plain text to simple HTML email."""
        paragraphs = text.split('\n\n')
        html_parts = ['<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">']

        for p in paragraphs:
            html_parts.append(f'<p style="line-height: 1.6; color: #333;">{p}</p>')

        html_parts.append('</div>')

        return '\n'.join(html_parts)

    def _generate_mock_email(self, property_data: Dict, location_data: Dict, agent_details: Dict) -> Dict:
        """Generate mock email."""
        prop_type = property_data.get('propertyType', 'property').replace('_', ' ')
        beds = property_data.get('bedrooms', '?')
        address = location_data.get('address', 'prime location')

        return {
            'subject': f'New Listing: {beds}-Bed {prop_type} in {address}',
            'preview_text': 'This stunning property just hit the market!',
            'body_text': f"""Dear Valued Client,

We're excited to share this exceptional {beds}-bedroom {prop_type} that's just come to market in {address}.

This beautifully presented property offers spacious accommodation throughout and is situated in a highly sought-after location.

Key features include:
• {beds} bedrooms
• {property_data.get('bathrooms', '?')} bathrooms
• Desirable location
• Well-maintained throughout

Don't miss this opportunity - properties in this area move quickly!

Click below to view the full details and arrange your viewing.

Best regards,
{agent_details.get('name', 'Your Estate Agent') if agent_details else 'Your Estate Agent'}""",
            'body_html': '<p>Email body HTML...</p>',
            'cta': 'View Full Details'
        }
