"""
Brand-specific style guides for property listing generation.

This module contains detailed brand guidelines for estate agents,
including writing style, tone, structure, and visual preferences.
"""

BRAND_STYLES = {
    "savills": {
        "name": "Savills",
        "description": "Premium international estate agent known for luxury properties",

        "writing_style": {
            "tone": "Sophisticated, elegant, and refined without being overly formal",
            "voice": "Authoritative yet approachable - speak as the trusted expert",
            "sentence_structure": "Mix of medium and longer flowing sentences. Avoid short, punchy fragments.",
            "vocabulary": "Elevated but accessible - 'residence' over 'house', 'principal bedroom' over 'master bedroom'",
            "perspective": "Third-person narrative - describe the property, not 'this property offers'",
        },

        "content_approach": {
            "opening": "Begin with the property's defining characteristic - location, architecture, or heritage",
            "room_descriptions": "Lead with reception rooms, flow through to private spaces, end with gardens/outdoor",
            "emphasis": "Quality of finishes, architectural details, provenance, and location prestige",
            "local_area": "Weave location context naturally - mention villages, schools, amenities with sophistication",
            "features": "Integrate features into narrative rather than listing - 'underfloor heating throughout' becomes part of room description",
        },

        "language_patterns": {
            # NOTE: These phrases are designed for BOUTIQUE/PREMIUM tones
            # For BASIC/PUNCHY tones, system will override with measurement-focused language
            "preferred_phrases": [
                "beautifully proportioned",
                "elegantly presented",
                "distinguished by",  # Allowed in BOUTIQUE/PREMIUM only
                "characterized by",  # Allowed in BOUTIQUE/PREMIUM only
                "enhanced by",       # Allowed in BOUTIQUE/PREMIUM only
                "complemented by",   # Allowed in BOUTIQUE/PREMIUM only
                "thoughtfully appointed",  # Allowed in BOUTIQUE/PREMIUM only
                "principal reception room",
                "family accommodation",
                "formal dining room",
                "impressive entrance hall",
                "mature gardens",
                "private grounds",
                "measuring approximately",  # Added for measurement focus
                "extends to",               # Added for measurement focus
                "completed in",             # Added for temporal specificity
            ],
            "avoid_phrases": [
                "this property offers",
                "boasts",
                "amazing",
                "stunning (unless truly exceptional)",
                "must see",
                "fantastic",
                "great opportunity",
                "won't last long",
            ],
        },

        "typography": {
            "primary_font": "Baskerville (serif)",
            "body_font": "Gill Sans (sans-serif)",
            "style": "Classic elegance with contemporary clarity",
        },

        "structural_conventions": {
            "paragraph_length": "4-6 sentences per paragraph for brochures",
            "description_flow": "Opening hook → Architecture/period → Interior spaces → Gardens → Location → Practical details",
            "emphasis_technique": "Use descriptive narrative, not exclamation points or hype",
        },

        "example_openings": [
            "Set within mature grounds of approximately one acre, this elegant Georgian residence offers beautifully proportioned family accommodation.",
            "A distinguished Arts and Crafts home occupying a private position in one of the area's most sought after residential roads.",
            "This handsome Victorian villa has been thoughtfully renovated to create a sophisticated family home that seamlessly blends period character with contemporary comfort.",
        ],
    },

    "generic": {
        "name": "Generic",
        "description": "Standard professional estate agent style",

        "writing_style": {
            "tone": "Professional, clear, and engaging",
            "voice": "Friendly professional - approachable and informative",
            "sentence_structure": "Mix of short and medium sentences for easy reading",
            "vocabulary": "Clear and accessible - avoid jargon",
            "perspective": "Direct and descriptive",
        },

        "content_approach": {
            "opening": "Lead with the most compelling feature or property type",
            "room_descriptions": "Practical flow - entrance, living spaces, bedrooms, bathrooms, outdoor",
            "emphasis": "Space, condition, location, and practical benefits",
            "local_area": "Mention key amenities, transport links, and schools clearly",
            "features": "Highlight features that add value or convenience",
        },

        "language_patterns": {
            "preferred_phrases": [
                "well presented",
                "spacious accommodation",
                "convenient location",
                "modern kitchen",
                "family bathroom",
                "private garden",
                "off-street parking",
            ],
            "avoid_phrases": [
                "this property offers",
                "amazing",
                "perfect",
                "unique (unless truly is)",
            ],
        },

        "typography": {
            "primary_font": "Open Sans (sans-serif)",
            "body_font": "Open Sans (sans-serif)",
            "style": "Clean and modern",
        },

        "structural_conventions": {
            "paragraph_length": "3-4 sentences per paragraph",
            "description_flow": "Property type → Key features → Room details → Location → Practical info",
            "emphasis_technique": "Lead with benefits, support with details",
        },
    },
}


def get_brand_guidance(brand: str) -> dict:
    """
    Get brand-specific style guidance.

    Args:
        brand: Brand identifier ('savills', 'generic', etc.)

    Returns:
        Brand style dictionary
    """
    return BRAND_STYLES.get(brand.lower(), BRAND_STYLES["generic"])


def build_brand_prompt_section(brand: str) -> str:
    """
    Build prompt section for brand-specific writing style.

    Args:
        brand: Brand identifier

    Returns:
        Formatted prompt section
    """
    style = get_brand_guidance(brand)

    writing = style["writing_style"]
    content = style["content_approach"]
    language = style["language_patterns"]

    prompt = f"""
BRAND STYLE: {style['name']}
{style['description']}

WRITING STYLE:
- Tone: {writing['tone']}
- Voice: {writing['voice']}
- Sentence structure: {writing['sentence_structure']}
- Vocabulary: {writing['vocabulary']}
- Perspective: {writing['perspective']}

CONTENT APPROACH:
- Opening: {content['opening']}
- Room descriptions: {content['room_descriptions']}
- Emphasis: {content['emphasis']}
- Local area: {content['local_area']}
- Features: {content['features']}

LANGUAGE PATTERNS:
Preferred phrases: {', '.join(language['preferred_phrases'][:8])}
AVOID: {', '.join(language['avoid_phrases'])}

STRUCTURAL CONVENTIONS:
- Paragraph length: {style['structural_conventions']['paragraph_length']}
- Flow: {style['structural_conventions']['description_flow']}
- Emphasis: {style['structural_conventions']['emphasis_technique']}
"""

    if 'example_openings' in style:
        prompt += f"\nEXAMPLE OPENINGS (for inspiration):\n"
        for example in style['example_openings'][:2]:
            prompt += f"- {example}\n"

    return prompt.strip()
