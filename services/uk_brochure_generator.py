"""
UK Property Brochure Narrative Generator

Generates cohesive, professional property brochures following the standard UK estate agent format:
- Opening Summary
- The Situation (location, transport, amenities)
- The Accommodation (room-by-room narrative with flow)
- Outside (gardens, parking, external features)
- Services (EPC, council tax, tenure)

Based on Savills, Knight Frank, and industry standard formats.
"""
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class BrochureSection:
    """A section of the property brochure."""
    title: str
    content: str
    word_count: int


@dataclass
class PropertyBrochure:
    """Complete property brochure with all sections."""
    property_name: str
    address: str
    price: Optional[str]

    # Standard UK brochure sections
    opening_summary: str
    situation: str
    accommodation: str
    outside: str
    services: str

    # Optional sections
    in_brief: Optional[List[str]] = None  # Bullet point highlights

    def to_dict(self) -> Dict:
        """Convert to dictionary for JSON serialization."""
        return {
            "property_name": self.property_name,
            "address": self.address,
            "price": self.price,
            "sections": {
                "opening_summary": self.opening_summary,
                "situation": self.situation,
                "accommodation": self.accommodation,
                "outside": self.outside,
                "services": self.services,
            },
            "in_brief": self.in_brief or [],
            "full_text": self.get_full_narrative(),
            "word_count": len(self.get_full_narrative().split()),
        }

    def get_full_narrative(self) -> str:
        """Get the complete brochure as flowing text."""
        sections = []

        if self.opening_summary:
            sections.append(self.opening_summary)

        if self.situation:
            sections.append(f"The Situation\n{self.situation}")

        if self.accommodation:
            sections.append(f"The Accommodation\n{self.accommodation}")

        if self.outside:
            sections.append(f"Outside\n{self.outside}")

        if self.services:
            sections.append(f"Services\n{self.services}")

        return "\n\n".join(sections)


class UKBrochureGenerator:
    """
    Generates UK-style property brochures with proper narrative flow.

    Uses Claude API to generate cohesive, professional content following
    the standard format used by Savills, Knight Frank, and other UK agents.
    """

    def __init__(self, claude_client=None):
        """
        Initialize the brochure generator.

        Args:
            claude_client: ClaudeClient instance for LLM generation
        """
        self.claude_client = claude_client
        logger.info("Initialized UK brochure generator")

    async def generate_brochure(
        self,
        property_data: Dict,
        location_data: Dict,
        photo_analysis: Optional[List[Dict]] = None,
        enrichment_data: Optional[Dict] = None,
        tone: str = "premium"
    ) -> PropertyBrochure:
        """
        Generate a complete UK-style property brochure.

        Args:
            property_data: Property details (bedrooms, bathrooms, features, etc.)
            location_data: Location info (address, postcode, setting)
            photo_analysis: Vision analysis results for each photo
            enrichment_data: Location enrichment data (transport, schools, etc.)
            tone: Writing tone (basic, premium, boutique)

        Returns:
            PropertyBrochure with all sections populated
        """
        logger.info(f"generate_brochure called: claude_client={self.claude_client is not None}, is_available={self.claude_client.is_available() if self.claude_client else False}")
        if self.claude_client and self.claude_client.is_available():
            return await self._generate_with_llm(
                property_data, location_data, photo_analysis, enrichment_data, tone
            )
        else:
            return self._generate_mock_brochure(
                property_data, location_data, photo_analysis, enrichment_data
            )

    async def _generate_with_llm(
        self,
        property_data: Dict,
        location_data: Dict,
        photo_analysis: Optional[List[Dict]],
        enrichment_data: Optional[Dict],
        tone: str
    ) -> PropertyBrochure:
        """Generate brochure using Claude API."""

        prompt = self._build_brochure_prompt(
            property_data, location_data, photo_analysis, enrichment_data, tone
        )

        logger.info(f"Generating brochure with LLM, prompt length: {len(prompt)}")

        try:
            response = await self.claude_client.generate_completion(
                prompt=prompt,
                max_tokens=3000,
                temperature=0.7
            )

            logger.info(f"LLM response received, length: {len(response) if response else 0}")
            if response:
                logger.info(f"Response preview: {response[:200]}...")

            brochure = self._parse_brochure_response(
                response,
                property_data,
                location_data
            )

            # If parsing returned empty content, fall back to mock
            if not brochure.opening_summary and not brochure.accommodation:
                logger.warning("LLM response parsed but empty - using mock")
                return self._generate_mock_brochure(
                    property_data, location_data, photo_analysis, enrichment_data
                )

            return brochure
        except Exception as e:
            logger.error(f"LLM brochure generation failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return self._generate_mock_brochure(
                property_data, location_data, photo_analysis, enrichment_data
            )

    def _build_brochure_prompt(
        self,
        property_data: Dict,
        location_data: Dict,
        photo_analysis: Optional[List[Dict]],
        enrichment_data: Optional[Dict],
        tone: str
    ) -> str:
        """Build the prompt for generating a UK property brochure."""

        # Format photo analysis into room descriptions
        photo_section = self._format_photo_analysis_for_prompt(photo_analysis)

        # Format enrichment data for situation section
        enrichment_section = self._format_enrichment_for_prompt(enrichment_data)

        # Get property details
        bedrooms = property_data.get('bedrooms', 3)
        bathrooms = property_data.get('bathrooms', 2)
        property_type = property_data.get('property_type', 'house')
        features = property_data.get('features', [])
        epc_rating = property_data.get('epc_rating', 'C')
        size_sqft = property_data.get('size_sqft')

        address = location_data.get('address', '')
        postcode = location_data.get('postcode', '')
        setting = location_data.get('setting', 'suburban')

        prompt = f"""You are writing UK property particulars. This is a LEGAL DOCUMENT - accuracy is mandatory.

CRITICAL INSTRUCTION: Generate the brochure content NOW using the data provided. Do NOT ask questions, seek clarification, or request additional information. Work with what is given below.

===== ABSOLUTE RULES - READ FIRST =====

RULE 1: ONLY describe what is EXPLICITLY listed in PROPERTY DETAILS, FEATURES, or PHOTO ANALYSIS below.
RULE 2: If something is not listed, DO NOT mention it. Silence is better than invention.
RULE 3: Use generic terms when specifics aren't provided.

BANNED PHRASES (NEVER USE):
- "nestled", "tucked away", "boasts", "exudes", "affords"
- "sanctuary", "oasis", "haven", "retreat"
- "perfect for", "ideal for", "suited to" + any buyer type
- "charming", "delightful", "welcoming", "inviting" (too flowery)
- "seamless", "effortless", "thoughtfully designed"
- "abundance of", "wealth of", "array of"
- "offering", "presents", "provides" (overused)

APPROVED ADJECTIVES (use sparingly):
- Size: "spacious", "generous", "well-proportioned"
- Light: "bright", "light-filled"
- Condition: "well-maintained", "presented"
- Neutral: "private", "convenient", "accessible"
DO NOT use any adjective not on this list.

BANNED INVENTIONS (NEVER ADD UNLESS IN DATA BELOW):
- Flooring types → just say "the flooring" or don't mention
- Window styles (sash, bay, dual-aspect) → just say "windows"
- Garden aspects (south-facing) → just say "the garden"
- Fireplaces → ONLY if "fireplace" in features list
- Fitted wardrobes → ONLY if in features or photo analysis
- En-suite → ONLY if explicitly stated or visible in photos
- Utility room, cloakroom → ONLY if in features
- Transport times → ONLY if in enrichment data
- School names → ONLY if in enrichment data
- Heating type → say "Central heating" only, don't specify gas/oil unless told

===== PROPERTY DATA (USE ONLY THIS) =====

Type: {property_type}
Bedrooms: {bedrooms}
Bathrooms: {bathrooms}
Size: {f'{size_sqft} sq ft' if size_sqft else 'Not specified'}
CONFIRMED FEATURES: {', '.join(features) if features else 'None specified'}
EPC Rating: {epc_rating}
Address: {address}
Postcode: {postcode}
Setting: {setting}

{photo_section}

{enrichment_section}

===== WRITING INSTRUCTIONS =====

TONE: {tone.upper()}
{"Factual, measurement-focused, simple language." if tone == "basic" else ""}
{"Professional, polished but grounded in facts." if tone == "premium" else ""}
{"Warm but factual, focus on character visible in photos." if tone == "boutique" else ""}

UK TERMINOLOGY (use these instead of American terms):
- "principal bedroom" not "master bedroom"
- "reception room" not "living room"
- "the garden" not "the yard"
- "fitted kitchen" not "custom kitchen"

STRUCTURE - Write as a walking tour:
- Start at front door
- Move through ground floor logically
- Then first floor
- Use: "From the entrance...", "A door leads to...", "To the rear...", "Ascending to the first floor..."

===== OUTPUT FORMAT =====

===OPENING SUMMARY===
[60-80 words. State: property type, location, bedrooms, bathrooms, and ONLY the confirmed features listed above.]

===IN BRIEF===
- [Only list features from CONFIRMED FEATURES above]
- [Do not add anything not in the list]

===THE SITUATION===
[60-80 words. If no enrichment data: "The property is located in {setting} {address.split(',')[-1] if ',' in address else 'the local area'}. Local amenities and transport links are available nearby." DO NOT invent specific amenities, stations, or schools.]

===THE ACCOMMODATION===
[150-200 words. Describe ONLY rooms visible in photo analysis or implied by bedroom/bathroom count. Use generic terms. Do not invent finishes, storage, or features not in the data.]

===OUTSIDE===
[40-60 words. ONLY describe what's in CONFIRMED FEATURES or photo analysis. If "garden" is listed, say "The property includes a garden." If "driveway" is listed, mention it. Do not add "mature borders" or aspects unless in photos.]

===SERVICES===
EPC Rating: {epc_rating}
Tenure: To be confirmed
Council Tax Band: To be confirmed

===END===
"""

        return prompt

    def _format_photo_analysis_for_prompt(self, photo_analysis: Optional[List[Dict]]) -> str:
        """Format photo analysis data for the prompt."""
        if not photo_analysis:
            return "PHOTO ANALYSIS: No photos provided - use generic descriptions."

        lines = ["PHOTO ANALYSIS - Describe these specific features from the images:"]

        # Group by room type
        rooms = {}
        for photo in photo_analysis:
            room_type = photo.get('room_type', 'other')
            if room_type not in rooms:
                rooms[room_type] = []
            rooms[room_type].append(photo)

        for room_type, photos in rooms.items():
            lines.append(f"\n{room_type.upper().replace('_', ' ')}:")
            for photo in photos:
                features = photo.get('detected_features', [])
                finishes = photo.get('finishes', [])
                caption = photo.get('suggested_caption', '')
                headline = photo.get('headline', '')
                selling_points = photo.get('selling_points', [])

                if headline:
                    lines.append(f"  Headline: {headline}")
                if features:
                    lines.append(f"  Features: {', '.join(features)}")
                if finishes:
                    lines.append(f"  Finishes: {', '.join(finishes)}")
                if caption:
                    lines.append(f"  Vision Caption: {caption}")
                if selling_points:
                    lines.append(f"  Key Points: {', '.join(selling_points)}")

        return "\n".join(lines)

    def _format_enrichment_for_prompt(self, enrichment_data: Optional[Dict]) -> str:
        """Format enrichment data for the situation section - ONLY POSITIVE FACTS."""
        if not enrichment_data:
            return "LOCATION ENRICHMENT: No data available - use generic: 'Local amenities and transport links are available nearby.'"

        lines = [
            "VERIFIED LOCATION DATA (use these EXACT facts in The Situation):",
            "IMPORTANT: Only include facts that are POSITIVE. Skip anything negative or distant."
        ]

        # Check if this is new location intelligence format
        if 'schools' in enrichment_data and 'supermarkets' in enrichment_data:
            return self._format_location_intelligence_for_prompt(enrichment_data)

        # Legacy format handling
        nearest = enrichment_data.get('nearest', {})
        if 'stations' in nearest:
            station = nearest['stations']
            distance = station.get('distance_miles', 99)
            name = station.get('name', '')
            if distance <= 1.0 and name:
                lines.append(f"  STATION: {name} is {distance} miles away")
            elif distance <= 0.5 and name:
                lines.append(f"  STATION: {name} is within walking distance ({distance} miles)")

        counts = enrichment_data.get('amenities', enrichment_data.get('counts', {}))
        primary_count = counts.get('primary_schools', 0)
        secondary_count = counts.get('secondary_schools', 0)

        if primary_count >= 2:
            lines.append(f"  SCHOOLS: {primary_count} primary schools within 1 mile")
        if secondary_count >= 1:
            lines.append(f"  SCHOOLS: {secondary_count} secondary schools within 1 mile")

        if 'supermarkets' in nearest:
            supermarket = nearest['supermarkets']
            distance = supermarket.get('distance_miles', 99)
            name = supermarket.get('name', '')
            if distance <= 0.5 and name:
                lines.append(f"  SHOPS: {name} is {distance} miles away")

        if 'parks' in nearest:
            park = nearest['parks']
            distance = park.get('distance_miles', 99)
            name = park.get('name', '')
            if distance <= 0.5 and name:
                lines.append(f"  GREEN SPACE: {name} is {distance} miles away")

        highlights = enrichment_data.get('highlights', [])
        if highlights:
            lines.append(f"  HIGHLIGHTS: {'; '.join(highlights[:3])}")

        if len(lines) <= 2:
            return "LOCATION ENRICHMENT: Limited local data - use generic: 'Local amenities are available nearby.'"

        lines.append("")
        lines.append("USE THESE EXACT DISTANCES AND NAMES. Do not round or embellish.")

        return "\n".join(lines)

    def _format_location_intelligence_for_prompt(self, data: Dict) -> str:
        """Format location intelligence data for brochure generation."""
        lines = [
            "VERIFIED LOCATION DATA (use these EXACT facts in The Situation):",
            "IMPORTANT: Only include facts that are POSITIVE. Do not embellish."
        ]

        # Schools with Ofsted ratings (most valuable for families)
        schools = data.get('schools', {})
        if schools.get('available', False):
            # Outstanding schools - highlight first
            outstanding_primary = schools.get('primary_outstanding', [])
            outstanding_secondary = schools.get('secondary_outstanding', [])

            if outstanding_primary:
                school = outstanding_primary[0]
                lines.append(f"  SCHOOL (OFSTED OUTSTANDING): {school['name']} - {school['distance_miles']} miles")

            if outstanding_secondary:
                school = outstanding_secondary[0]
                lines.append(f"  SCHOOL (OFSTED OUTSTANDING SECONDARY): {school['name']} - {school['distance_miles']} miles")

            # Good schools if no outstanding nearby
            if not outstanding_primary and not outstanding_secondary:
                good_primary = schools.get('primary_good', [])
                good_secondary = schools.get('secondary_good', [])
                total_good = len(good_primary) + len(good_secondary)
                if total_good >= 2:
                    lines.append(f"  SCHOOLS: {total_good} Ofsted Good-rated schools within 1 mile")

            # School highlights
            school_highlights = schools.get('highlights', [])
            for h in school_highlights[:2]:
                lines.append(f"  SCHOOL HIGHLIGHT: {h}")

        # Transport
        transport = data.get('transport', {})
        if transport.get('nearest_station'):
            station = transport['nearest_station']
            if station.get('name') and station['name'] != 'Unnamed':
                lines.append(f"  STATION: {station['name']} - {station['distance_miles']} miles")

        if transport.get('nearest_tube'):
            tube = transport['nearest_tube']
            if tube.get('name') and tube['name'] != 'Unnamed':
                lines.append(f"  TUBE: {tube['name']} - {tube['distance_miles']} miles")

        # Supermarkets (premium brands = affluent area indicator)
        supermarkets = data.get('supermarkets', {})
        if supermarkets.get('nearest_premium'):
            shop = supermarkets['nearest_premium']
            brand = shop.get('brand', shop.get('name', ''))
            lines.append(f"  PREMIUM SUPERMARKET: {brand} - {shop['distance_miles']} miles")
        else:
            # Show major supermarket if no premium
            major = supermarkets.get('major', [])
            if major:
                shop = major[0]
                lines.append(f"  SUPERMARKET: {shop.get('brand', shop.get('name', ''))} - {shop['distance_miles']} miles")

        # Medical
        medical = data.get('medical', {})
        gp_surgeries = medical.get('gp_surgeries', [])
        if gp_surgeries:
            lines.append(f"  GP SURGERY: Within {gp_surgeries[0]['distance_miles']} miles")

        # Leisure - parks
        leisure = data.get('leisure', {})
        parks = leisure.get('parks', [])
        named_parks = [p for p in parks if p.get('name') and p['name'] != 'Unnamed']
        if named_parks and named_parks[0]['distance_miles'] <= 0.5:
            lines.append(f"  PARK: {named_parks[0]['name']} - {named_parks[0]['distance_miles']} miles")

        # All highlights
        all_highlights = data.get('all_highlights', [])
        if all_highlights:
            lines.append("")
            lines.append("  KEY HIGHLIGHTS TO USE:")
            for h in all_highlights[:4]:
                lines.append(f"    - {h}")

        # Pre-written brochure text
        brochure_text = data.get('brochure_text', {})
        if brochure_text.get('situation_paragraph'):
            lines.append("")
            lines.append("  SUGGESTED SITUATION PARAGRAPH (you may use or adapt):")
            lines.append(f"    {brochure_text['situation_paragraph']}")

        if len(lines) <= 2:
            return "LOCATION ENRICHMENT: Limited local data - use generic: 'Local amenities are available nearby.'"

        lines.append("")
        lines.append("USE THESE EXACT DISTANCES AND NAMES. Do not round or embellish.")

        return "\n".join(lines)

    def _parse_brochure_response(
        self,
        response: str,
        property_data: Dict,
        location_data: Dict
    ) -> PropertyBrochure:
        """Parse the LLM response into a PropertyBrochure object."""

        sections = {
            'opening_summary': '',
            'in_brief': [],
            'situation': '',
            'accommodation': '',
            'outside': '',
            'services': ''
        }

        # Parse each section
        current_section = None
        current_content = []

        for line in response.split('\n'):
            line_stripped = line.strip()

            # Check for section headers
            if '===OPENING SUMMARY===' in line_stripped:
                current_section = 'opening_summary'
                current_content = []
            elif '===IN BRIEF===' in line_stripped:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = 'in_brief'
                current_content = []
            elif '===THE SITUATION===' in line_stripped:
                if current_section == 'in_brief' and current_content:
                    # Parse bullet points
                    sections['in_brief'] = [
                        line.lstrip('- •').strip()
                        for line in current_content
                        if line.strip().startswith(('-', '•'))
                    ]
                elif current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = 'situation'
                current_content = []
            elif '===THE ACCOMMODATION===' in line_stripped:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = 'accommodation'
                current_content = []
            elif '===OUTSIDE===' in line_stripped:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = 'outside'
                current_content = []
            elif '===SERVICES===' in line_stripped:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                current_section = 'services'
                current_content = []
            elif '===END===' in line_stripped:
                if current_section and current_content:
                    sections[current_section] = '\n'.join(current_content).strip()
                break
            elif current_section:
                current_content.append(line)

        # Handle final section if no END marker
        if current_section and current_content:
            if current_section == 'in_brief':
                sections['in_brief'] = [
                    line.lstrip('- •').strip()
                    for line in current_content
                    if line.strip().startswith(('-', '•'))
                ]
            else:
                sections[current_section] = '\n'.join(current_content).strip()

        # Create the brochure object
        property_type = property_data.get('property_type', 'property')
        bedrooms = property_data.get('bedrooms', '')
        address = location_data.get('address', 'Property Address')

        return PropertyBrochure(
            property_name=f"{bedrooms} Bedroom {property_type.title()}" if bedrooms else property_type.title(),
            address=address,
            price=property_data.get('price'),
            opening_summary=sections['opening_summary'],
            situation=sections['situation'],
            accommodation=sections['accommodation'],
            outside=sections['outside'],
            services=sections['services'],
            in_brief=sections['in_brief'] if sections['in_brief'] else None
        )

    def _generate_mock_brochure(
        self,
        property_data: Dict,
        location_data: Dict,
        photo_analysis: Optional[List[Dict]],
        enrichment_data: Optional[Dict]
    ) -> PropertyBrochure:
        """Generate a mock brochure when Claude is unavailable."""

        bedrooms = property_data.get('bedrooms', 4)
        bathrooms = property_data.get('bathrooms', 2)
        property_type = property_data.get('property_type', 'detached house')
        features = property_data.get('features', [])
        epc_rating = property_data.get('epc_rating', 'C')
        address = location_data.get('address', 'Prime Residential Location')
        setting = location_data.get('setting', 'suburban')

        # Generate photo-based room descriptions
        room_descriptions = self._get_room_descriptions_from_photos(photo_analysis)

        opening_summary = f"""An exceptional {bedrooms} bedroom {property_type} offering well-proportioned family accommodation in this highly sought-after {setting} location. The property benefits from {bathrooms} bathrooms, generous reception rooms, and a beautifully maintained garden. Presented in excellent condition throughout, this home represents an outstanding opportunity for discerning buyers."""

        # Build accommodation from photo analysis
        accommodation_parts = [
            f"The accommodation is arranged over two floors and briefly comprises:",
            "",
            "Ground Floor:",
            "An inviting entrance hall with stairs rising to the first floor and doors leading to the principal rooms."
        ]

        if 'living_room' in room_descriptions:
            accommodation_parts.append(f"The sitting room {room_descriptions['living_room']}")
        else:
            accommodation_parts.append("The sitting room features a bay window to the front aspect, flooding the space with natural light, and a focal fireplace.")

        if 'kitchen' in room_descriptions:
            accommodation_parts.append(f"The kitchen {room_descriptions['kitchen']}")
        else:
            accommodation_parts.append("To the rear, the kitchen/breakfast room is fitted with a comprehensive range of contemporary units with integrated appliances and space for informal dining.")

        accommodation_parts.extend([
            "",
            "First Floor:",
            f"The principal bedroom features fitted wardrobes and a well-appointed en-suite shower room."
        ])

        if 'bedroom' in room_descriptions:
            accommodation_parts.append(f"The additional bedrooms {room_descriptions['bedroom']}")
        else:
            accommodation_parts.append(f"There are {bedrooms - 1} further well-proportioned bedrooms, all benefiting from ample storage.")

        if 'bathroom' in room_descriptions:
            accommodation_parts.append(f"The family bathroom {room_descriptions['bathroom']}")
        else:
            accommodation_parts.append("The family bathroom is fitted with a contemporary white suite comprising bath with shower over, WC, and wash basin.")

        accommodation = "\n".join(accommodation_parts)

        # Build situation from enrichment
        situation = f"The property is situated in a {setting} setting with excellent access to local amenities."
        if enrichment_data:
            highlights = enrichment_data.get('highlights', [])
            if highlights:
                situation += f" Notable features of the area include {', '.join(highlights[:3])}."
        situation += " There are good transport links to the surrounding area with regular bus services and nearby railway stations providing access to major centres."

        # Outside section
        if 'exterior' in room_descriptions or 'garden' in room_descriptions:
            outside_desc = room_descriptions.get('exterior', '') or room_descriptions.get('garden', '')
            outside = f"Externally, {outside_desc} The rear garden is laid mainly to lawn with mature borders and a paved patio area providing space for outdoor entertaining."
        else:
            outside = "To the front, there is a driveway providing off-street parking. The rear garden is laid mainly to lawn with mature planted borders and a paved terrace ideal for alfresco dining. A side gate provides access to the front."

        services = f"Mains gas, electricity, water and drainage are connected to the property. Gas central heating. EPC Rating: {epc_rating}. Council Tax Band: To be confirmed. Tenure: Freehold (subject to verification)."

        in_brief = [
            f"{bedrooms} bedrooms ({bedrooms - 1} with fitted wardrobes)",
            f"{bathrooms} bathrooms (1 en-suite)",
            "Reception room with feature fireplace",
            "Modern fitted kitchen with integrated appliances",
            "Private rear garden with patio",
            f"EPC Rating: {epc_rating}"
        ]

        # Add features from property data
        for feature in features[:2]:
            if feature not in ' '.join(in_brief):
                in_brief.append(feature.title())

        return PropertyBrochure(
            property_name=f"{bedrooms} Bedroom {property_type.title()}",
            address=address,
            price=property_data.get('price'),
            opening_summary=opening_summary,
            situation=situation,
            accommodation=accommodation,
            outside=outside,
            services=services,
            in_brief=in_brief[:8]  # Limit to 8 points
        )

    def _get_room_descriptions_from_photos(
        self,
        photo_analysis: Optional[List[Dict]]
    ) -> Dict[str, str]:
        """Extract room descriptions from photo analysis."""
        if not photo_analysis:
            return {}

        descriptions = {}

        for photo in photo_analysis:
            room_type = photo.get('room_type', 'other')
            if room_type == 'other':
                continue

            # Build description from photo data
            parts = []

            features = photo.get('detected_features', [])
            finishes = photo.get('finishes', [])
            headline = photo.get('headline', '')
            caption = photo.get('suggested_caption', '')

            # Use headline or caption as base
            if headline and len(headline) > 10:
                parts.append(headline.lower())

            # Add specific features
            if features:
                feature_str = ', '.join(features[:3])
                parts.append(f"features {feature_str}")

            if finishes:
                finish_str = ', '.join(finishes[:2])
                parts.append(f"with {finish_str}")

            if parts:
                descriptions[room_type] = ' '.join(parts) + '.'

        return descriptions


# Convenience function for easy import
def get_brochure_generator(claude_client=None) -> UKBrochureGenerator:
    """Get an instance of the UK brochure generator."""
    return UKBrochureGenerator(claude_client=claude_client)
