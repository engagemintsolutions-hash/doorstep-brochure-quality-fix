"""
Property listing copy generator.
"""
from typing import List, Dict, Optional
from backend.schemas import (
    GenerateRequest,
    GeneratedVariant,
    Channel,
    ToneStyle,
    PropertyType,
    AudienceType,
)
from services.length_policy import LengthPolicy
from services.keyword_coverage import KeywordCoverage
from services.compliance_checker import ComplianceChecker
from services.brand_styles import build_brand_prompt_section
from services.agency_templates import get_template_service, PropertyCharacter, TemplateType


class GenerationError(Exception):
    """Raised when generation fails."""
    pass


class Generator:
    """
    Generates property listing copy variants.
    """
    
    def __init__(self, claude_client=None):
        """
        Initialize generator.

        Args:
            claude_client: Optional Anthropic API client for real generation
        """
        self.claude_client = claude_client
        self.length_policy = LengthPolicy()
        self.keyword_coverage = KeywordCoverage()
        self.compliance_checker = ComplianceChecker()

        # Initialize agency template service
        try:
            self.template_service = get_template_service()
        except Exception:
            self.template_service = None

    def _get_template_config(self, request: GenerateRequest):
        """
        Get agency template configuration if available.

        Args:
            request: GenerateRequest

        Returns:
            tuple: (template_config, agency_branding) or (None, None)
        """
        if not self.template_service:
            return None, None

        # Check if request has agency_id (via brand or other field)
        agency_id = None
        if hasattr(request, 'brand') and request.brand and hasattr(request.brand, 'agency_id'):
            agency_id = request.brand.agency_id
        elif hasattr(request, 'agency_id'):
            agency_id = request.agency_id

        if not agency_id:
            # Default to Savills for now (can be made configurable)
            agency_id = "savills"

        # Determine property character based on property data
        prop = request.property_data
        property_character = self._determine_property_character(prop)

        try:
            # Get agency branding
            branding = self.template_service.get_agency_branding(agency_id)
            if not branding:
                return None, None

            # Select appropriate template
            template_type = self.template_service.select_template(
                agency_id=agency_id,
                property_character=property_character,
                price=getattr(prop, 'price', None),
                bedrooms=prop.bedrooms,
                property_type=prop.property_type.value if hasattr(prop, 'property_type') else None
            )

            # Get template config
            template_config = branding.templates.get(template_type)
            return template_config, branding

        except Exception:
            return None, None

    def _determine_property_character(self, prop) -> PropertyCharacter:
        """
        Determine property character from property data.

        Args:
            prop: PropertyData

        Returns:
            PropertyCharacter enum value
        """
        # Simple heuristic - can be enhanced with more sophisticated logic
        prop_type = prop.property_type.value if hasattr(prop.property_type, 'value') else str(prop.property_type)

        # Check for unique/loft-style properties
        if prop_type.lower() in ['loft', 'penthouse', 'studio']:
            return PropertyCharacter.UNIQUE

        # Check for period properties based on features
        if hasattr(prop, 'features') and prop.features:
            period_keywords = ['victorian', 'georgian', 'edwardian', 'period', 'character']
            if any(keyword in ' '.join(prop.features).lower() for keyword in period_keywords):
                return PropertyCharacter.PERIOD

        # Check for modern/contemporary
        if hasattr(prop, 'features') and prop.features:
            modern_keywords = ['contemporary', 'modern', 'new build', 'newly built']
            if any(keyword in ' '.join(prop.features).lower() for keyword in modern_keywords):
                return PropertyCharacter.MODERN

        # Check for luxury based on condition or features
        if hasattr(prop, 'condition'):
            if 'luxury' in str(prop.condition).lower():
                return PropertyCharacter.LUXURY

        # Default to traditional
        return PropertyCharacter.TRADITIONAL

    async def generate_variants(
        self,
        request: GenerateRequest,
        num_variants: int = 3,
        enrichment_data: dict = None,
        photo_analysis: any = None,
        brochure_sections: dict = None
    ) -> List[Dict]:
        """
        Generate multiple listing variants.

        Args:
            request: GenerateRequest with property data
            num_variants: Number of variants to generate
            enrichment_data: Optional enrichment data from EnrichmentService
            photo_analysis: Optional photo vision analysis
            brochure_sections: Optional section-photo mappings for brochures

        Returns:
            List of GeneratedVariant dicts

        Raises:
            GenerationError: If generation fails
        """
        # Import settings here to avoid circular imports
        from backend.config import settings

        # Check if mock mode is enabled
        if settings.mock_generation:
            return self._generate_mock(request, num_variants, enrichment_data)

        if self.claude_client is not None and self.claude_client.is_available():
            # Use real LLM generation
            return await self._generate_with_llm(request, num_variants, enrichment_data, photo_analysis, brochure_sections)
        else:
            # Use mock generation
            return self._generate_mock(request, num_variants, enrichment_data)
    
    async def _generate_with_llm(
        self,
        request: GenerateRequest,
        num_variants: int,
        enrichment_data: dict = None,
        photo_analysis: any = None,
        brochure_sections: dict = None
    ) -> List[Dict]:
        """
        Generate variants using Claude API.

        Args:
            request: GenerateRequest
            num_variants: Number of variants
            enrichment_data: Optional enrichment data
            photo_analysis: Optional photo vision analysis
            brochure_sections: Optional section-photo mappings

        Returns:
            List of variant dicts

        Raises:
            GenerationError: If API call fails
        """
        if self.claude_client is None:
            raise GenerationError("Claude client not initialized")

        try:
            # Build prompt with photo analysis and section mappings
            prompt = self._build_prompt(request, enrichment_data, photo_analysis, brochure_sections)

            # Generate variants
            variants = []
            for i in range(num_variants):
                # Call Claude API
                response_text = await self.claude_client.generate_completion(
                    prompt=prompt,
                    max_tokens=1000,
                    temperature=0.7 + (i * 0.1)  # Vary temperature for variety
                )

                # Parse response
                variant = self._parse_variant_response(response_text, i + 1)
                variants.append(variant)

            return variants

        except Exception as e:
            raise GenerationError(f"LLM generation failed: {str(e)}")
    
    def _build_prompt(self, request: GenerateRequest, enrichment_data: dict = None, photo_analysis: any = None, brochure_sections: dict = None) -> str:
        """
        Build prompt for Claude API.

        Args:
            request: GenerateRequest
            enrichment_data: Optional location enrichment
            photo_analysis: Optional photo vision analysis
            brochure_sections: Optional section-photo mappings for brochures

        Returns:
            Prompt string
        """
        prop = request.property_data
        loc = request.location_data
        audience = request.target_audience
        tone = request.tone
        channel = request.channel
        
        # Get length target
        target_words, hard_cap = self.length_policy.get_target_for_channel(channel.channel)
        if channel.target_words:
            target_words = channel.target_words
        if channel.hard_cap:
            hard_cap = channel.hard_cap
        
        # Build tone guidance
        tone_guidance = {
            ToneStyle.BASIC: "Use straightforward, factual language. Minimal adjectives. Focus on practical details.",
            ToneStyle.PUNCHY: "Write energetically with urgency. Use short, impactful sentences. Create excitement and FOMO.",
            ToneStyle.BOUTIQUE: "Write warmly with aspirational lifestyle storytelling. Focus on experience and emotion. Paint a picture.",
            ToneStyle.PREMIUM: "Write in a polished, sophisticated manner. Emphasize prestige, quality, and exclusivity. Use elegant language.",
            ToneStyle.HYBRID: "Blend professional facts with emotional appeal. Balance information with inspiration."
        }
        
        # Build neutral property-focused guidance (avoid buyer-persona limiting language)
        # User feedback: audience targeting limits potential buyers - keep it neutral and property-focused
        audience_guidance = {
            AudienceType.FAMILIES: "Focus on the property's space, layout, features, and location. Highlight practical benefits without assuming buyer profile.",
            AudienceType.PROFESSIONALS: "Focus on the property's space, layout, features, and location. Highlight practical benefits without assuming buyer profile.",
            AudienceType.INVESTORS: "Focus on the property's condition, features, location benefits, and practical aspects. Emphasize facts over lifestyle assumptions.",
            AudienceType.RETIREES: "Focus on the property's space, layout, features, and location. Highlight practical benefits without assuming buyer profile.",
            AudienceType.FIRST_TIME_BUYERS: "Focus on the property's space, layout, features, and location. Highlight practical benefits without assuming buyer profile.",
            AudienceType.DOWNSIZERS: "Focus on the property's space, layout, features, and location. Highlight practical benefits without assuming buyer profile."
        }
        
        # Build channel guidance
        channel_guidance = {
            Channel.RIGHTMOVE: "Portal listing - concise, scannable, keyword-rich. Lead with headline features.",
            Channel.BROCHURE: "Detailed narrative - tell the property's story, room by room. Paint a complete picture.",
            Channel.SOCIAL: "Attention-grabbing snippet - immediate hook, emoji-friendly if appropriate, shareable.",
            Channel.EMAIL: "Personal tone - direct appeal to recipient, clear call-to-action, conversational."
        }
        
        # Get brand style guidance
        brand_section = ""
        if hasattr(request, 'brand') and request.brand:
            brand_section = build_brand_prompt_section(request.brand)

        # Get agency template configuration
        template_config, agency_branding = self._get_template_config(request)

        # Override length targets if template specifies them
        if template_config and hasattr(template_config.writing_style, 'word_count_min'):
            target_words = template_config.writing_style.word_count_max
            hard_cap = template_config.writing_style.word_count_max

        # Build agency template guidance section
        template_guidance = ""
        if template_config:
            writing_style = template_config.writing_style
            template_guidance = f"""
AGENCY BRANDING - {agency_branding.agency_name.upper()} TEMPLATE ({template_config.template_type.value.upper()}):
Tone: {writing_style.tone}
Word count: {writing_style.word_count_min}-{writing_style.word_count_max} words

Structure Guide:
{writing_style.structure_notes}

Example Phrases to Use:
{chr(10).join(f"- {phrase}" for phrase in writing_style.example_phrases[:5])}

CRITICAL: Follow the {agency_branding.agency_name} {template_config.template_type.value} template style exactly.
This will be used for a {template_config.page_count}-page brochure with {template_config.photo_count_min}-{template_config.photo_count_max} photos.
"""

        prompt = f"""You are an expert property copywriter creating a listing for a UK estate agent.

{brand_section}
{template_guidance}

PROPERTY DETAILS:
- Type: {prop.property_type.value.title()}
- Bedrooms: {prop.bedrooms}
- Bathrooms: {prop.bathrooms}
- Condition: {prop.condition.value.title()}
- Features: {', '.join(prop.features) if prop.features else 'Not specified'}
- EPC Rating: {prop.epc_rating if prop.epc_rating else 'Not specified'}
{f"- Size: {prop.size_sqft} sq ft" if prop.size_sqft else ""}

LOCATION:
- Address: {loc.address}
- Setting: {loc.setting.value.title()}
{f"- Local Context: {loc.proximity_notes}" if loc.proximity_notes else ""}

{self._format_enrichment_data(enrichment_data) if enrichment_data else ""}

{self._format_photo_analysis(photo_analysis) if photo_analysis else ""}

{self._format_brochure_sections(brochure_sections) if brochure_sections else ""}

TARGET AUDIENCE:
{audience_guidance.get(audience.audience_type, "")}
{f"Additional Context: {audience.lifestyle_framing}" if audience.lifestyle_framing else ""}

WRITING STYLE:
{tone_guidance.get(tone.tone, "")}

CHANNEL:
{channel_guidance.get(channel.channel, "")}
Target length: {target_words} words (strict maximum: {hard_cap} words)

CRITICAL REQUIREMENTS (ALL TONES):
1. Write ONLY {target_words} words (±10%). Do not exceed {hard_cap} words under any circumstances.
2. Use the {tone.tone.value} tone consistently throughout.
3. Focus ONLY on STRUCTURAL features that come with the property (built-ins, room sizes, windows, doors, architectural details).
4. NEVER describe non-structural items: furniture, art, rugs, chandeliers, curtains, bedding, decorative items, appliances that may not stay.
5. NEVER use hyphens mid-sentence (e.g. "open-plan", "well-appointed"). Only use hyphens in bullet points.
6. Include CONCRETE FACTS: measurements (sq ft, room dimensions), dates (year built, renovated), specific counts (number of reception rooms).
7. NEVER use buyer-specific language like "perfect for families", "ideal for professionals", "family coffee rituals".
8. Describe what IS THERE structurally: "bespoke kitchen", "skylight", "French doors", "fireplace", "fitted wardrobes", "dressing room".
9. Write in flowing prose - NO bullet points, NO dashes, NO lists in the main description text.
10. Use natural paragraph structure with complete sentences.

BANNED AI SLOP PHRASES (ALL TONES - NEVER USE THESE):
- "nestled", "tucked away", "boasts", "exudes", "affords stunning", "commands views"
- "abundance of", "plethora of", "epitomises", "seamlessly blending", "verdant canvas", "sanctuary"
- "tranquil sophistication", "restorative repose", "enchanting vistas", "morning contemplation"
- "immersive natural setting", "offers a unique opportunity", "lifestyle choice", "everyday luxury"
- "curated living", "resort-style", "hotel-inspired", "distinguished residence"

{self._get_tone_specific_guardrails(tone.tone)}

CRITICAL WRITING STYLE:
- Write like Savills: professional, factual, specific measurements, simple language
- Start directly with descriptive content, not introductions
- Be specific and visual - help readers imagine living there
- NO redundant phrases like "This property", "The space", "creates an atmosphere"
- NEVER use promotional or superlative language without specific evidence
- Natural prose only - no bullet points in description paragraphs

BEFORE/AFTER EXAMPLES:

❌ BAD: "This stunning kitchen offers a unique blend of contemporary style and functional design, perfect for family gatherings."
✅ GOOD: "The 18ft kitchen features Carrera marble worktops and Siemens integrated appliances. East-facing windows provide morning light."

❌ BAD: "The property boasts an impressive master suite nestled on the first floor."
✅ GOOD: "The principal bedroom measures 16ft by 14ft with fitted wardrobes and an en-suite bathroom."

❌ BAD: "Beautifully landscaped gardens create a verdant canvas for outdoor entertaining."
✅ GOOD: "The south-facing garden extends to approximately 60ft with a paved terrace and mature borders."

FORMAT YOUR RESPONSE EXACTLY AS:

HEADLINE: [Write a compelling 8-12 word headline that captures the essence]

DESCRIPTION:
[Write the main property description here - {target_words} words maximum]

KEY_FEATURES:
- [Specific feature 1]
- [Specific feature 2]
- [Specific feature 3]
- [Specific feature 4]
- [Specific feature 5]

REMEMBER: Quality over quantity. Every sentence must earn its place. Write as if you're the agent who knows this property intimately."""
        
        return prompt

    def _get_tone_specific_guardrails(self, tone: ToneStyle) -> str:
        """
        Get tone-adaptive guardrails based on selected tone.

        BASIC/PUNCHY: Strict factual style with measurements
        BOUTIQUE/PREMIUM: Relaxed for flowing prose, but still ban AI slop
        HYBRID: Middle ground

        Args:
            tone: ToneStyle enum value

        Returns:
            Formatted guardrail rules string
        """
        if tone in [ToneStyle.BASIC, ToneStyle.PUNCHY]:
            # STRICT ENFORCEMENT - Measurement-focused, factual
            return """
TONE-SPECIFIC GUARDRAILS (STRICT - BASIC/PUNCHY):
11. Lead 70% of sentences with CONCRETE FACTS: measurements, materials, years, counts.
12. Maximum 25 words per sentence. Vary length: short → medium → short pattern.
13. Maximum 2 commas per sentence. Use periods to separate ideas.
14. Start sentences with nouns or specifics, NOT "This property", "The space", "There is".
15. Convert materials to EXACT terms: "oak flooring" = "engineered oak flooring", "marble" = "Carrera marble worktops".
16. Replace vague adjectives with MEASUREMENTS:
    - "spacious" → "measuring 28ft"
    - "generous" → "extends to 4700 sq ft"
    - "ample" → "three double bedrooms"
    - "recently" → "completed in 2021"
17. Use SIMPLE, DIRECT language: "wonderfully presented", "excellent proportions", "lovely aspect", "particularly well".
18. Write SHORT, factual sentences. No long, flowery descriptive clauses.
19. NO generic fluff: "stunning", "unique", "perfect", "exceptional" without specific evidence."""

        elif tone == ToneStyle.HYBRID:
            # MODERATE ENFORCEMENT - Balance facts with flow
            return """
TONE-SPECIFIC GUARDRAILS (MODERATE - HYBRID):
11. Lead 50% of sentences with concrete facts (measurements, materials, years).
12. Maximum 30 words per sentence. Mix short factual with medium descriptive.
13. Maximum 3 commas per sentence.
14. Balance specific measurements with descriptive flow.
15. Include materials and specifics, but allow some elevated language.
16. Replace most vague adjectives with measurements, but allow occasional descriptive terms.
17. Mix simple direct language with more polished phrasing.
18. Blend short factual sentences with medium descriptive ones."""

        else:  # BOUTIQUE or PREMIUM
            # RELAXED ENFORCEMENT - Allow flowing prose
            return """
TONE-SPECIFIC GUARDRAILS (RELAXED - BOUTIQUE/PREMIUM):
11. Include measurements and facts, but can lead with descriptive openings.
12. Maximum 35 words per sentence. Allow flowing, elegant prose.
13. Maximum 4 commas per sentence for complex, sophisticated structure.
14. May start with descriptive elements, but avoid "This property" clichés.
15. Include specific materials where appropriate, allow elevated descriptions.
16. Include measurements for key features, but can use descriptive adjectives.
17. Use polished, sophisticated language: "thoughtfully appointed", "beautifully proportioned", "distinguished by".
18. Allow longer, descriptive sentences that paint a picture.
19. May use elevated terms like "distinguished", "characterized by", "enhanced by" - but NEVER the banned AI slop."""

    def _format_enrichment_data(self, enrichment_data: dict) -> str:
        """
        Format enrichment data for inclusion in prompt.
        
        Args:
            enrichment_data: Enrichment data dictionary
            
        Returns:
            Formatted string for prompt
        """
        if not enrichment_data:
            return ""
        
        lines = ["LOCAL AREA INSIGHTS:"]
        
        # Add highlights
        highlights = enrichment_data.get("highlights", [])
        if highlights:
            for highlight in highlights:
                lines.append(f"- {highlight}")
        
        # Add descriptors
        descriptors = enrichment_data.get("descriptors", {})
        if descriptors:
            descriptor_items = []
            for key, value in descriptors.items():
                descriptor_items.append(f"{key.replace('_', ' ').title()}: {value}")
            if descriptor_items:
                lines.append(f"- Quality: {', '.join(descriptor_items)}")
        
        return "\n".join(lines) + "\n"

    def _format_photo_analysis(self, photo_analysis: any) -> str:
        """
        Format photo analysis data for inclusion in prompt.

        Args:
            photo_analysis: PhotoAnalysisData object with vision analysis results

        Returns:
            Formatted string for prompt
        """
        if not photo_analysis or not hasattr(photo_analysis, 'photos') or not photo_analysis.photos:
            return ""

        lines = ["PHOTO ANALYSIS - Use these specific visual details in your description:"]
        lines.append("(Write about what you see in the photos, not generic features)")
        lines.append("")

        # Group photos by category
        photos_by_category = {}
        for photo in photo_analysis.photos:
            category = photo.category
            if category not in photos_by_category:
                photos_by_category[category] = []
            photos_by_category[category].append(photo)

        # Format each category
        for category, photos in sorted(photos_by_category.items()):
            lines.append(f"{category.upper().replace('_', ' ')}:")
            for photo in photos:
                # Add attributes
                if photo.attributes:
                    attr_str = ", ".join(photo.attributes)
                    lines.append(f"  • {attr_str}")
                # Add caption if available
                if photo.caption:
                    lines.append(f"    Description: {photo.caption}")
            lines.append("")

        lines.append("CRITICAL RULES FOR USING PHOTO ANALYSIS:")
        lines.append("1. ONLY use photo details to enhance CONFIRMED features from the property data above")
        lines.append("2. DO NOT add new features that aren't mentioned in the property features list")
        lines.append("3. Photos provide CONTEXT and SPECIFICITY for verified features only")
        lines.append("4. Example: If 'garden' is confirmed, use photo details like 'decking' and 'mature trees'")
        lines.append("5. Example: If 'parking' is NOT confirmed, ignore any driveway/garage visible in photos")
        lines.append("6. Think: Photos show HOW the confirmed features look, not WHAT features exist")
        lines.append("")
        lines.append("VISION-TO-TEXT PROTOCOLS:")
        lines.append("7. Convert vision materials to SPECIFIC real estate terms:")
        lines.append("   - 'wood flooring' → 'engineered oak flooring' or 'herringbone parquet'")
        lines.append("   - 'marble' → 'Carrera marble worktops' or 'marble-effect tiles'")
        lines.append("   - 'stainless appliances' → 'Siemens integrated appliances' or 'stainless steel range'")
        lines.append("8. Translate spatial hints to measurements (ONLY if provided in property data):")
        lines.append("   - If property data says '18ft kitchen', use '18ft kitchen with...'")
        lines.append("   - If NO measurement provided, describe proportions: 'generous kitchen' or 'well-proportioned'")
        lines.append("9. Convert light analysis to factual descriptions:")
        lines.append("   - 'bright' → 'south-facing windows' or 'dual-aspect windows'")
        lines.append("   - 'natural light' → 'floor-to-ceiling windows' or 'skylight'")
        lines.append("10. NEVER infer room dimensions from photos - use only provided measurements")
        lines.append("11. NO buyer-persona language from vision captions - convert to neutral:")
        lines.append("    - ❌ 'perfect for family living' → ✅ 'open-plan layout with breakfast bar'")
        lines.append("    - ❌ 'ideal for entertaining' → ✅ 'spacious reception room with French doors'")
        lines.append("")

        return "\n".join(lines)

    def _format_brochure_sections(self, brochure_sections: dict) -> str:
        """
        Format brochure section mappings for inclusion in prompt.
        This tells the LLM which photos are in each section so it can write coordinated copy.

        Args:
            brochure_sections: Dict of section mappings from frontend

        Returns:
            Formatted string for prompt
        """
        if not brochure_sections:
            return ""

        lines = [
            "",
            "=" * 80,
            "BROCHURE SECTIONS - Write section-specific copy based on assigned photos",
            "=" * 80,
            "",
            "CRITICAL: You MUST write separate copy for EACH section below.",
            "Each section has specific photos assigned. Write about what's IN THOSE PHOTOS.",
            ""
        ]

        # Define sections in the order they should appear
        section_order = [
            ('introduction', 'INTRODUCTION'),
            ('living_spaces', 'LIVING SPACES'),
            ('kitchen_dining', 'KITCHEN & DINING'),
            ('bedrooms', 'BEDROOMS'),
            ('bathrooms', 'BATHROOMS'),
            ('garden_exterior', 'GARDEN & EXTERIOR')
        ]

        for section_key, section_title in section_order:
            section = brochure_sections.get(section_key)
            if not section or not section.get('photos'):
                continue

            lines.append(f"\n## {section_title}")
            lines.append(f"Photos in this section: {len(section['photos'])}")
            lines.append("")

            for photo in section['photos']:
                lines.append(f"📸 {photo.get('filename', 'Unknown')}")
                lines.append(f"   Category: {photo.get('category', 'N/A')}")

                attributes = photo.get('attributes', [])
                if attributes:
                    lines.append(f"   Features: {', '.join(attributes[:5])}")

                caption = photo.get('caption')
                if caption:
                    lines.append(f"   Caption: {caption}")

                lines.append("")

            lines.append(f"✍️ Write 80-120 words about the {section_title.lower()} based on these specific photos.")
            lines.append(f"   Reference the visual details you see (e.g., '{attributes[0] if attributes else 'features'}').")
            lines.append("")

        lines.append("=" * 80)
        lines.append("")
        lines.append("OUTPUT FORMAT:")
        lines.append("")
        lines.append("For EACH section with photos, generate:")
        lines.append("")
        lines.append("SECTION: Introduction")
        lines.append("[80-120 words about introduction section based on its assigned photos]")
        lines.append("")
        lines.append("SECTION: Living Spaces")
        lines.append("[80-120 words about living spaces based on its assigned photos]")
        lines.append("")
        lines.append("(Continue for ALL sections with photos)")
        lines.append("")
        lines.append("=" * 80)
        lines.append("")

        return "\n".join(lines)

    def _parse_variant_response(self, response_text: str, variant_id: int) -> Dict:
        """
        Parse Claude's response into a variant dict.
        
        Args:
            response_text: Raw response from Claude
            variant_id: Variant number
            
        Returns:
            Variant dict
        """
        # Parse sections
        lines = response_text.strip().split('\n')
        headline = ""
        description_lines = []
        features = []
        
        current_section = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith("HEADLINE:"):
                headline = line.replace("HEADLINE:", "").strip()
                current_section = "headline"
            elif line.startswith("DESCRIPTION:"):
                current_section = "description"
            elif line.startswith("KEY_FEATURES:"):
                current_section = "features"
            elif current_section == "description":
                description_lines.append(line)
            elif current_section == "features" and line.startswith("-"):
                features.append(line.lstrip("- ").strip())
        
        full_text = " ".join(description_lines)
        word_count = len(full_text.split())
        
        # Calculate quality score (mock)
        score = min(1.0, 0.7 + (word_count / 500) * 0.3)
        
        return {
            "variant_id": variant_id,
            "headline": headline or "Attractive Property",
            "full_text": full_text or "Property description not available.",
            "word_count": word_count,
            "key_features": features or ["Property features"],
            "score": round(score, 2),
        }
    
    def _generate_mock(
        self,
        request: GenerateRequest,
        num_variants: int,
        enrichment_data: dict = None
    ) -> List[Dict]:
        """
        Generate mock variants (fallback when no LLM client).
        
        Args:
            request: GenerateRequest
            num_variants: Number of variants
            enrichment_data: Optional enrichment data (not used in mock)
            
        Returns:
            List of variant dicts
        """
        prop = request.property_data
        loc = request.location_data
        tone = request.tone
        channel = request.channel
        
        # Get target length
        target_words, _ = self.length_policy.get_target_for_channel(channel.channel)
        if channel.target_words:
            target_words = channel.target_words
        
        variants = []
        
        for i in range(num_variants):
            # Generate mock headline
            headline = self._generate_mock_headline(prop, tone.tone, i)
            
            # Generate mock description
            full_text = self._generate_mock_description(
                prop, loc, tone.tone, target_words, i
            )
            
            # Generate mock features
            features = self._generate_mock_features(prop)
            
            word_count = len(full_text.split())
            
            variants.append({
                "variant_id": i + 1,
                "headline": headline,
                "full_text": full_text,
                "word_count": word_count,
                "key_features": features,
                "score": 0.75 + (i * 0.05),
            })
        
        return variants
    
    def _generate_mock_headline(
        self,
        prop: "PropertyData",
        tone: ToneStyle,
        variant_num: int
    ) -> str:
        """Generate mock headline."""
        headlines = {
            ToneStyle.BASIC: [
                f"{prop.bedrooms} Bedroom {prop.property_type.value.title()} For Sale",
                f"{prop.bedrooms} Bed {prop.property_type.value.title()} in {prop.condition.value.title()} Condition",
                f"Well-Presented {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
            ],
            ToneStyle.PUNCHY: [
                f"Don't Miss This {prop.bedrooms} Bed {prop.property_type.value.title()}!",
                f"Superb {prop.bedrooms} Bedroom {prop.property_type.value.title()} - View Now",
                f"Grab This {prop.condition.value.title()} {prop.bedrooms} Bed Home",
            ],
            ToneStyle.BOUTIQUE: [
                f"Charming {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
                f"Inviting {prop.bedrooms} Bed Home with Character",
                f"Beautifully Presented {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
            ],
            ToneStyle.PREMIUM: [
                f"Exceptional {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
                f"Distinguished {prop.bedrooms} Bed Residence",
                f"Refined {prop.bedrooms} Bedroom {prop.property_type.value.title()} of Quality",
            ],
            ToneStyle.HYBRID: [
                f"Outstanding {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
                f"Impressive {prop.bedrooms} Bed Home - Must View",
                f"Desirable {prop.bedrooms} Bedroom {prop.property_type.value.title()}",
            ],
        }
        
        options = headlines.get(tone, headlines[ToneStyle.BASIC])
        return options[variant_num % len(options)]
    
    def _generate_mock_description(
        self,
        prop: "PropertyData",
        loc: "LocationData",
        tone: ToneStyle,
        target_words: int,
        variant_num: int
    ) -> str:
        """Generate mock description."""
        # Base description
        base = f"This {prop.condition.value} {prop.bedrooms} bedroom {prop.property_type.value} "
        base += f"offers well-proportioned accommodation. "
        
        # Add location context
        base += f"Situated in a {loc.setting.value} location, the property benefits from "
        base += f"convenient access to local amenities. "
        
        # Add features
        if prop.features:
            base += f"Features include {', '.join(prop.features[:3])}. "
        
        # Add bathrooms
        base += f"The property comprises {prop.bathrooms} bathroom{'s' if prop.bathrooms > 1 else ''}. "
        
        # Pad to target length based on channel
        current_words = len(base.split())
        if current_words < target_words * 0.8:
            padding = "The accommodation has been well maintained throughout and viewing is highly recommended to appreciate the space and quality on offer. "
            base += padding
            
            # Add more padding for longer channels (brochure)
            if target_words > 200:
                base += f"This {prop.property_type.value} is ideally suited for those seeking a comfortable family home in a {loc.setting.value} setting. "
                base += f"The property boasts {prop.bedrooms} generously sized bedrooms providing ample space for a growing family. "
                if prop.features:
                    base += f"Additional highlights include the well-maintained {', '.join(prop.features[:2])} which enhance the overall appeal. "
                base += "Early viewing is strongly advised to avoid disappointment as properties of this calibre rarely remain available for long. "
                base += "The current owners have taken great care in maintaining the property to an excellent standard throughout their tenure. "
        
        return base.strip()
    
    def _generate_mock_features(self, prop: "PropertyData") -> List[str]:
        """Generate mock feature list."""
        features = [
            f"{prop.bedrooms} bedrooms",
            f"{prop.bathrooms} bathroom{'s' if prop.bathrooms > 1 else ''}",
            f"{prop.condition.value.title()} condition",
        ]
        
        if prop.features:
            features.extend(prop.features[:3])
        
        if prop.epc_rating:
            features.append(f"EPC rating {prop.epc_rating}")
        
        return features[:6]  # Limit to 6 features
