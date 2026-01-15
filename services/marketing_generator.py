"""
Marketing Content Generator - Portal listings, email newsletters, and social media
Generates formatted content for Rightmove/Zoopla, email campaigns, and social platforms
"""
import logging
from typing import Optional, Dict, List
from services.claude_client import ClaudeClient

logger = logging.getLogger(__name__)


class MarketingGenerator:
    """
    Service for generating marketing content across different channels.

    Supports:
    - Portal listings (Rightmove/Zoopla) with bullet points
    - Email newsletters with HTML templates
    - Social media posts (Facebook/Twitter/Instagram)
    """

    def __init__(self, claude_client: Optional[ClaudeClient] = None):
        """Initialize marketing generator with Claude client"""
        self.claude = claude_client

    async def generate_portal_listing(
        self,
        property_name: str,
        address: str,
        price: Optional[str] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[int] = None,
        property_type: Optional[str] = None,
        key_features: Optional[List[str]] = None,
        description: Optional[str] = None,
        portal: str = "rightmove"
    ) -> Dict:
        """
        Generate formatted listing for Rightmove or Zoopla.

        Portal guidelines:
        - Rightmove: 50-1000 chars overview, bullet points for features
        - Zoopla: Similar format, slightly more casual tone

        Args:
            property_name: Name of property (e.g., "Sefton House")
            address: Full address
            price: Price (e.g., "£1,250,000")
            bedrooms: Number of bedrooms
            bathrooms: Number of bathrooms
            property_type: House/Flat/Apartment etc.
            key_features: List of key features
            description: Full property description
            portal: "rightmove" or "zoopla"

        Returns:
            Dictionary with formatted listing content
        """
        portal_lower = portal.lower()

        # Build prompt for portal listing
        prompt = self._build_portal_prompt(
            property_name, address, price, bedrooms, bathrooms,
            property_type, key_features, description, portal_lower
        )

        if self.claude and self.claude.is_available():
            try:
                content = await self.claude.generate_completion(
                    prompt=prompt,
                    max_tokens=800,
                    temperature=0.7
                )

                # Parse the response into sections
                parsed = self._parse_portal_response(content)

                return {
                    "portal": portal_lower,
                    "headline": parsed.get("headline", f"{property_name}, {address}"),
                    "overview": parsed.get("overview", ""),
                    "key_features": parsed.get("key_features", []),
                    "full_description": parsed.get("full_description", description or ""),
                    "word_count": len(parsed.get("overview", "").split()),
                    "raw_content": content
                }
            except Exception as e:
                logger.error(f"Error generating portal listing: {e}")
                return self._mock_portal_listing(property_name, address, portal_lower)
        else:
            return self._mock_portal_listing(property_name, address, portal_lower)

    async def generate_email_newsletter(
        self,
        property_name: str,
        address: str,
        price: Optional[str] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[int] = None,
        property_type: Optional[str] = None,
        key_features: Optional[List[str]] = None,
        description: Optional[str] = None,
        agent_name: Optional[str] = None,
        agent_phone: Optional[str] = None,
        agent_email: Optional[str] = None,
        hero_image_url: Optional[str] = None
    ) -> Dict:
        """
        Generate email newsletter with HTML template.

        Email newsletter guidelines:
        - Subject line: Property name + address
        - Engaging opening paragraph
        - Key features highlighted
        - Call-to-action (book viewing)
        - Agent contact details

        Args:
            property_name: Name of property
            address: Full address
            price: Price
            bedrooms: Number of bedrooms
            bathrooms: Number of bathrooms
            property_type: House/Flat/Apartment
            key_features: List of key features
            description: Full description
            agent_name: Agent name
            agent_phone: Agent phone
            agent_email: Agent email
            hero_image_url: URL to hero image

        Returns:
            Dictionary with email content and HTML template
        """
        # Build prompt for email content
        prompt = self._build_email_prompt(
            property_name, address, price, bedrooms, bathrooms,
            property_type, key_features, description
        )

        if self.claude and self.claude.is_available():
            try:
                content = await self.claude.generate_completion(
                    prompt=prompt,
                    max_tokens=1000,
                    temperature=0.7
                )

                parsed = self._parse_email_response(content)

                # Generate HTML template
                html = self._generate_email_html(
                    property_name=property_name,
                    address=address,
                    price=price,
                    bedrooms=bedrooms,
                    bathrooms=bathrooms,
                    property_type=property_type,
                    body_text=parsed.get("body", ""),
                    key_features=key_features or [],
                    agent_name=agent_name,
                    agent_phone=agent_phone,
                    agent_email=agent_email,
                    hero_image_url=hero_image_url
                )

                return {
                    "subject": f"{property_name}, {address}",
                    "preview_text": parsed.get("preview", "")[:150],
                    "body_text": parsed.get("body", ""),
                    "html_template": html,
                    "call_to_action": parsed.get("cta", "Book your viewing today"),
                    "word_count": len(parsed.get("body", "").split())
                }
            except Exception as e:
                logger.error(f"Error generating email newsletter: {e}")
                return self._mock_email_newsletter(property_name, address)
        else:
            return self._mock_email_newsletter(property_name, address)

    async def generate_social_post(
        self,
        property_name: str,
        address: str,
        price: Optional[str] = None,
        bedrooms: Optional[int] = None,
        bathrooms: Optional[int] = None,
        property_type: Optional[str] = None,
        key_features: Optional[List[str]] = None,
        description: Optional[str] = None,
        platform: str = "facebook",
        image_url: Optional[str] = None
    ) -> Dict:
        """
        Generate social media post for Facebook, Twitter, or Instagram.

        Platform guidelines:
        - Facebook: 80-120 words, engaging, use emojis sparingly
        - Twitter: 240-280 chars, concise, hashtags
        - Instagram: 125-150 words, visual focus, more emojis, hashtags

        Args:
            property_name: Name of property
            address: Full address
            price: Price
            bedrooms: Number of bedrooms
            bathrooms: Number of bathrooms
            property_type: House/Flat/Apartment
            key_features: List of key features
            description: Full description
            platform: "facebook", "twitter", or "instagram"
            image_url: URL to property image

        Returns:
            Dictionary with social post content and mockup data
        """
        platform_lower = platform.lower()

        # Build platform-specific prompt
        prompt = self._build_social_prompt(
            property_name, address, price, bedrooms, bathrooms,
            property_type, key_features, description, platform_lower
        )

        if self.claude and self.claude.is_available():
            try:
                content = await self.claude.generate_completion(
                    prompt=prompt,
                    max_tokens=400,
                    temperature=0.8
                )

                parsed = self._parse_social_response(content, platform_lower)

                return {
                    "platform": platform_lower,
                    "post_text": parsed.get("text", ""),
                    "hashtags": parsed.get("hashtags", []),
                    "character_count": len(parsed.get("text", "")),
                    "word_count": len(parsed.get("text", "").split()),
                    "image_url": image_url,
                    "call_to_action": parsed.get("cta", "Contact us for more details"),
                    "mockup_data": self._generate_social_mockup(platform_lower)
                }
            except Exception as e:
                logger.error(f"Error generating social post: {e}")
                return self._mock_social_post(property_name, address, platform_lower)
        else:
            return self._mock_social_post(property_name, address, platform_lower)

    def _build_portal_prompt(
        self, property_name, address, price, bedrooms, bathrooms,
        property_type, key_features, description, portal
    ) -> str:
        """Build prompt for portal listing generation"""
        features_str = "\n".join([f"- {f}" for f in (key_features or [])])

        return f"""Generate a professional property listing for {portal.upper()}.

Property Details:
- Name: {property_name}
- Address: {address}
- Price: {price or 'Not specified'}
- Type: {property_type or 'Not specified'}
- Bedrooms: {bedrooms or 'Not specified'}
- Bathrooms: {bathrooms or 'Not specified'}

Key Features:
{features_str or '(No features provided)'}

Full Description:
{description or '(No description provided)'}

Generate in this format:

HEADLINE: (A compelling 5-10 word headline)

OVERVIEW: (50-150 words summarizing the property - engaging but factual)

KEY FEATURES:
- (Bullet point 1)
- (Bullet point 2)
- (Bullet point 3)
- (Bullet point 4)
- (Bullet point 5)

FULL DESCRIPTION: (200-400 words flowing description)

Follow {portal} style: professional, accurate, highlight unique selling points."""

    def _build_email_prompt(
        self, property_name, address, price, bedrooms, bathrooms,
        property_type, key_features, description
    ) -> str:
        """Build prompt for email newsletter generation"""
        features_str = "\n".join([f"- {f}" for f in (key_features or [])])

        return f"""Generate engaging email newsletter content for a property.

Property Details:
- Name: {property_name}
- Address: {address}
- Price: {price or 'Not specified'}
- Type: {property_type or 'Not specified'}
- Bedrooms: {bedrooms or 'Not specified'}
- Bathrooms: {bathrooms or 'Not specified'}

Key Features:
{features_str or '(No features provided)'}

Generate in this format:

PREVIEW: (One compelling sentence to appear in email preview)

BODY: (150-250 words of flowing, engaging text for newsletter recipients. Start with an attention-grabbing opening, highlight what makes this property special, and create excitement about viewing it.)

CTA: (A clear call-to-action phrase)

Tone: Warm, professional, slightly more personal than portal listings."""

    def _build_social_prompt(
        self, property_name, address, price, bedrooms, bathrooms,
        property_type, key_features, description, platform
    ) -> str:
        """Build prompt for social media post generation"""
        features_str = ", ".join(key_features or [])

        char_limits = {
            "facebook": "80-120 words",
            "twitter": "240-280 characters",
            "instagram": "125-150 words"
        }

        style_guides = {
            "facebook": "Conversational, engaging, ask questions to drive engagement",
            "twitter": "Concise, punchy, use 2-3 relevant hashtags",
            "instagram": "Visual-focused, use emojis tastefully, 5-8 hashtags"
        }

        return f"""Generate a {platform.upper()} post for this property.

Property: {property_name}, {address}
Price: {price or 'Not specified'}
Type: {property_type or 'Not specified'} | {bedrooms or '?'} bed | {bathrooms or '?'} bath
Features: {features_str or 'Not specified'}

Platform: {platform.upper()}
Length: {char_limits.get(platform, "100-150 words")}
Style: {style_guides.get(platform, "Engaging and professional")}

Generate in this format:

TEXT: (The post text following platform guidelines)

HASHTAGS: (List relevant hashtags, separated by commas)

CTA: (Call-to-action phrase)"""

    def _parse_portal_response(self, content: str) -> Dict:
        """Parse Claude's response for portal listing"""
        sections = {}

        if "HEADLINE:" in content:
            headline = content.split("HEADLINE:")[1].split("\n")[0].strip()
            sections["headline"] = headline

        if "OVERVIEW:" in content:
            overview_section = content.split("OVERVIEW:")[1]
            if "KEY FEATURES:" in overview_section:
                overview = overview_section.split("KEY FEATURES:")[0].strip()
            else:
                overview = overview_section.split("\n\n")[0].strip()
            sections["overview"] = overview

        if "KEY FEATURES:" in content:
            features_section = content.split("KEY FEATURES:")[1]
            if "FULL DESCRIPTION:" in features_section:
                features_text = features_section.split("FULL DESCRIPTION:")[0]
            else:
                features_text = features_section

            features = []
            for line in features_text.split("\n"):
                line = line.strip()
                if line.startswith("-") or line.startswith("•"):
                    features.append(line.lstrip("-•").strip())
            sections["key_features"] = features

        if "FULL DESCRIPTION:" in content:
            full_desc = content.split("FULL DESCRIPTION:")[1].strip()
            sections["full_description"] = full_desc

        return sections

    def _parse_email_response(self, content: str) -> Dict:
        """Parse Claude's response for email newsletter"""
        sections = {}

        if "PREVIEW:" in content:
            preview = content.split("PREVIEW:")[1].split("\n")[0].strip()
            sections["preview"] = preview

        if "BODY:" in content:
            body_section = content.split("BODY:")[1]
            if "CTA:" in body_section:
                body = body_section.split("CTA:")[0].strip()
            else:
                body = body_section.strip()
            sections["body"] = body

        if "CTA:" in content:
            cta = content.split("CTA:")[1].strip().split("\n")[0].strip()
            sections["cta"] = cta

        return sections

    def _parse_social_response(self, content: str, platform: str) -> Dict:
        """Parse Claude's response for social media"""
        sections = {}

        if "TEXT:" in content:
            text_section = content.split("TEXT:")[1]
            if "HASHTAGS:" in text_section:
                text = text_section.split("HASHTAGS:")[0].strip()
            else:
                text = text_section.strip().split("\n\n")[0].strip()
            sections["text"] = text

        if "HASHTAGS:" in content:
            hashtags_section = content.split("HASHTAGS:")[1]
            if "CTA:" in hashtags_section:
                hashtags_text = hashtags_section.split("CTA:")[0].strip()
            else:
                hashtags_text = hashtags_section.strip().split("\n")[0].strip()

            hashtags = [h.strip() for h in hashtags_text.split(",")]
            # Ensure hashtags start with #
            hashtags = [h if h.startswith("#") else f"#{h}" for h in hashtags if h]
            sections["hashtags"] = hashtags

        if "CTA:" in content:
            cta = content.split("CTA:")[1].strip().split("\n")[0].strip()
            sections["cta"] = cta

        return sections

    def _generate_email_html(
        self, property_name, address, price, bedrooms, bathrooms,
        property_type, body_text, key_features, agent_name,
        agent_phone, agent_email, hero_image_url
    ) -> str:
        """Generate HTML email template"""
        features_html = "\n".join([
            f'            <li style="margin-bottom: 8px;">{feature}</li>'
            for feature in key_features
        ])

        hero_section = ""
        if hero_image_url:
            hero_section = f'''
        <tr>
            <td style="padding: 0;">
                <img src="{hero_image_url}" alt="{property_name}" style="width: 100%; max-width: 600px; height: auto; display: block;">
            </td>
        </tr>'''

        property_details = []
        if bedrooms:
            property_details.append(f"{bedrooms} Bedrooms")
        if bathrooms:
            property_details.append(f"{bathrooms} Bathrooms")
        if property_type:
            property_details.append(property_type)

        details_str = " | ".join(property_details)

        return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{property_name}, {address}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px 0; text-align: center;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #1a1a1a; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">{property_name}</h1>
                            <p style="margin: 10px 0 0; font-size: 16px; color: #cccccc;">{address}</p>
                        </td>
                    </tr>

                    <!-- Hero Image -->{hero_section}

                    <!-- Price and Details -->
                    <tr>
                        <td style="padding: 30px 40px 20px; text-align: center;">
                            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1a1a1a;">{price or 'Price on Application'}</p>
                            <p style="margin: 10px 0 0; font-size: 14px; color: #666666;">{details_str}</p>
                        </td>
                    </tr>

                    <!-- Main Body -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="font-size: 16px; line-height: 1.6; color: #333333;">
                                {body_text.replace(chr(10), '<br>')}
                            </div>
                        </td>
                    </tr>

                    <!-- Key Features -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <h2 style="margin: 0 0 15px; font-size: 20px; color: #1a1a1a;">Key Features</h2>
                            <ul style="margin: 0; padding-left: 20px; font-size: 15px; line-height: 1.8; color: #333333;">
{features_html}
                            </ul>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px; text-align: center;">
                            <a href="mailto:{agent_email or 'info@agency.com'}?subject=Viewing Request: {property_name}"
                               style="display: inline-block; padding: 15px 40px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px;">
                                Book Your Viewing
                            </a>
                        </td>
                    </tr>

                    <!-- Agent Contact -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #f8f8f8; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0 0 10px; font-size: 16px; font-weight: bold; color: #1a1a1a;">Contact Your Agent</p>
                            <p style="margin: 0; font-size: 14px; color: #666666;">
                                {agent_name or 'Your Estate Agent'}<br>
                                {agent_phone or 'Phone not provided'}<br>
                                <a href="mailto:{agent_email or 'info@agency.com'}" style="color: #1a1a1a;">{agent_email or 'info@agency.com'}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>'''

    def _generate_social_mockup(self, platform: str) -> Dict:
        """Generate mockup data for social media platforms"""
        mockups = {
            "facebook": {
                "platform_name": "Facebook",
                "profile_pic": "/static/agent-profile.png",
                "page_name": "Your Estate Agency",
                "post_type": "photo",
                "engagement_buttons": ["Like", "Comment", "Share"],
                "background_color": "#ffffff",
                "accent_color": "#1877f2"
            },
            "twitter": {
                "platform_name": "Twitter",
                "profile_pic": "/static/agent-profile.png",
                "handle": "@YourAgency",
                "post_type": "tweet",
                "engagement_buttons": ["Reply", "Retweet", "Like"],
                "background_color": "#ffffff",
                "accent_color": "#1da1f2"
            },
            "instagram": {
                "platform_name": "Instagram",
                "profile_pic": "/static/agent-profile.png",
                "username": "youragency",
                "post_type": "photo",
                "engagement_buttons": ["Like", "Comment", "Share", "Save"],
                "background_color": "#ffffff",
                "accent_color": "#e4405f"
            }
        }

        return mockups.get(platform, mockups["facebook"])

    def _mock_portal_listing(self, property_name: str, address: str, portal: str) -> Dict:
        """Generate mock portal listing when Claude unavailable"""
        return {
            "portal": portal,
            "headline": f"Stunning {property_name} on {address}",
            "overview": "This exceptional family home offers beautifully presented accommodation across three floors, combining period charm with modern convenience. Situated in a highly sought-after residential area, the property boasts generous living spaces, a contemporary kitchen/breakfast room, and a landscaped rear garden perfect for entertaining.",
            "key_features": [
                "Four double bedrooms with master en-suite",
                "Spacious reception rooms with feature fireplaces",
                "Modern kitchen/breakfast room with integrated appliances",
                "Landscaped south-facing garden with patio area",
                "Driveway parking for multiple vehicles",
                "Short walk to local schools and amenities",
                "EPC Rating: C",
                "Council Tax Band: F"
            ],
            "full_description": "A wonderful opportunity to acquire this impressive four-bedroom detached residence set within this prime residential location. The property has been sympathetically upgraded by the current owners whilst retaining many original features including high ceilings, sash windows, and ornate cornicing. \n\nThe ground floor comprises an elegant entrance hall, spacious reception room with bay window and feature fireplace, separate formal dining room, and a stunning kitchen/breakfast room fitted with a comprehensive range of contemporary units. French doors lead from the kitchen to the landscaped rear garden.\n\nUpstairs, the principal bedroom benefits from fitted wardrobes and a modern en-suite shower room. Three further well-proportioned double bedrooms and a family bathroom complete the first floor accommodation.\n\nExternally, the property enjoys a private driveway providing parking for several vehicles, whilst to the rear is a beautifully maintained south-facing garden with mature borders, lawn area, and paved entertaining space.",
            "word_count": 75
        }

    def _mock_email_newsletter(self, property_name: str, address: str) -> Dict:
        """Generate mock email when Claude unavailable"""
        return {
            "subject": f"New Listing: {property_name}, {address}",
            "preview_text": "Discover this exceptional family home in a highly sought-after location",
            "body_text": f"Dear Valued Client,\n\nWe are delighted to present {property_name}, an outstanding property that exemplifies elegant family living in one of the area's most desirable locations.\n\nThis beautifully presented home combines period charm with contemporary comfort, offering spacious accommodation across three floors. The property features four double bedrooms, two reception rooms, a stunning modern kitchen, and a landscaped south-facing garden.\n\nSituated on {address}, the property benefits from excellent local amenities, outstanding schools, and superb transport links to the city center. This is a rare opportunity to acquire a truly special home in this prime residential area.\n\nWe anticipate significant interest and recommend early viewing to avoid disappointment.",
            "html_template": "",
            "cta_text": "Book Your Exclusive Viewing",
            "cta_url": "#",
            "word_count": 125
        }

    def _mock_social_post(self, property_name: str, address: str, platform: str) -> Dict:
        """Generate mock social post when Claude unavailable"""
        posts = {
            "facebook": f"🏡 NEW LISTING | {property_name}, {address}\n\nWe're thrilled to present this exceptional four-bedroom family home in one of the area's most sought-after locations. \n\n✨ Highlights:\n• Four double bedrooms with master en-suite\n• Spacious reception rooms\n• Modern kitchen/breakfast room\n• South-facing landscaped garden\n• Driveway parking\n\nThis property combines period charm with contemporary living—perfect for growing families. Viewings are booking fast!\n\n📞 Call us today or visit our website to arrange your exclusive viewing.",
            "twitter": f"🏡 JUST LISTED: {property_name}\n\n✨ 4 bed detached home\n🌳 South-facing garden\n🚗 Driveway parking\n📍 {address}\n\nPeriod charm meets modern living. Book your viewing today! 👉 [Link in bio]\n\n#NewListing #PropertyForSale #DreamHome #FamilyHome",
            "instagram": f"✨ NEW LISTING ALERT ✨\n\nSwipe to fall in love with {property_name} 🏡\n\n📍 {address}\n🛏️ 4 Bedrooms | 3 Bathrooms\n🌳 Beautiful South-Facing Garden\n🏠 Period Features Throughout\n\nThis stunning family home combines elegance with modern comfort. From the spacious reception rooms to the landscaped garden, every detail has been thoughtfully designed.\n\nDouble tap if this could be your forever home! 💙\n\n👉 Link in bio to book your viewing\n📧 DM us for more details"
        }

        hashtags = {
            "facebook": ["#NewListing", "#PropertyForSale"],
            "twitter": ["#NewListing", "#PropertyForSale", "#DreamHome", "#FamilyHome"],
            "instagram": ["#NewListing", "#PropertyForSale", "#DreamHome", "#HouseHunting", "#RealEstate", "#PropertyGoals", "#InteriorDesign", "#HomeInspiration"]
        }

        return {
            "platform": platform,
            "post_text": posts.get(platform, posts["facebook"]),
            "hashtags": hashtags.get(platform, hashtags["facebook"]),
            "character_count": len(posts.get(platform, "")),
            "word_count": len(posts.get(platform, "").split()),
            "image_url": None,
            "call_to_action": "Book your viewing today",
            "mockup_data": self._generate_social_mockup(platform)
        }
