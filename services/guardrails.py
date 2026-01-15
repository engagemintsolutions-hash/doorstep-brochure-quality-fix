"""
Shared guardrails for all text generation endpoints.
Centralized to ensure consistency across main generation and brochure room descriptions.
"""

# AI SLOP PHRASES - Must match compliance_checker.py
AI_SLOP_BANNED_PHRASES = [
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

# CORPORATE JARGON TO AVOID
CORPORATE_JARGON = [
    "exemplifies",
    "epitomise",
    "distinguished",
    "sophisticated elegance",
]

# REDUNDANT PHRASES TO AVOID
REDUNDANT_PHRASES = [
    "This property",
    "The space",
    "creates an atmosphere",
    "creates a sense of",
]


def get_base_guardrails(target_words: int = 180) -> str:
    """
    Get base writing guardrails that apply to ALL generated text.
    These are the non-negotiable rules that prevent AI slop.

    Args:
        target_words: Target word count for this piece of text

    Returns:
        Formatted guardrails string to include in prompts
    """
    banned_list = ", ".join(f'"{phrase}"' for phrase in AI_SLOP_BANNED_PHRASES[:10])

    return f"""CRITICAL WRITING RULES:
1. Write in flowing prose - NO bullet points, NO dashes, NO lists
2. Use natural paragraph structure with complete sentences
3. BANNED AI SLOP PHRASES - Never use: {banned_list}, etc.
4. Avoid corporate jargon: "exemplifies", "epitomise", "distinguished", "sophisticated"
5. Use simple, elegant language: "beautiful", "charming", "spacious", "light-filled"
6. NO redundant phrases: "This property", "The space", "creates an atmosphere"
7. Start directly with descriptive content, not introductions
8. Target approximately {target_words} words
9. Write in a warm, inviting tone that feels personal, not corporate
10. Be specific and visual - help readers imagine living there
11. NEVER use promotional or superlative language ("stunning", "breathtaking", "remarkable")
12. Lead with CONCRETE FACTS: measurements, materials, years, specific features

BEFORE/AFTER EXAMPLES:

❌ BAD: "This stunning property is nestled in a tranquil location and boasts breathtaking views."
✅ GOOD: "The property occupies an elevated plot with south-facing views across open countryside."

❌ BAD: "The space exudes sophistication and creates an atmosphere of luxury living."
✅ GOOD: "The reception room features 11ft ceilings and original oak flooring throughout."

Remember: Specific facts, not flowery language. Measurements, not superlatives."""


def get_room_specific_additions() -> str:
    """
    Additional guidance specifically for room/section descriptions.

    Returns:
        Additional prompt instructions for room descriptions
    """
    return """
ROOM DESCRIPTION SPECIFICS:
- Focus on what makes THIS room distinctive
- Mention specific finishes, materials, dimensions if known
- Describe light, views, and spatial qualities
- Connect rooms to their function naturally
- Keep tone consistent with property's overall character

CRITICAL - ONLY DESCRIBE PERMANENT FEATURES:
✅ DESCRIBE: Windows, flooring, built-in wardrobes, ceiling height, fireplaces, architectural details, room dimensions, views, natural light
❌ IGNORE: Furniture, cushions, artwork, books, plants, rugs, lamps, decor items, personal belongings, staging items

WHY: Soft furnishings and personal items belong to the owner and won't be included in the sale. Only describe what the buyer will actually own.

EXAMPLE:
❌ BAD: "Soft cushions and carefully chosen artwork complete the room's inviting atmosphere"
✅ GOOD: "Large sash windows provide excellent natural light throughout the day"

❌ BAD: "The primary bedroom features elegant dark furniture and a basketball-themed piece"
✅ GOOD: "The primary bedroom offers space for king-size furniture with fitted wardrobes along one wall"""
