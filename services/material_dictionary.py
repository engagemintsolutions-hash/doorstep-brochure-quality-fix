"""
Material specificity dictionary for vision-to-text conversion.
Maps generic vision terms to specific real estate terminology.
"""

# Flooring materials
FLOORING_MATERIALS = {
    "wood flooring": ["engineered oak flooring", "solid oak flooring", "herringbone parquet", "chevron parquet"],
    "wooden floor": ["engineered oak flooring", "solid oak flooring", "parquet flooring"],
    "hardwood": ["solid oak flooring", "solid walnut flooring", "solid maple flooring"],
    "laminate": ["wood-effect laminate", "oak-effect laminate flooring"],
    "tiles": ["porcelain tiles", "ceramic tiles", "natural stone tiles"],
    "carpet": ["wool carpet", "Berber carpet", "fitted carpet"],
}

# Kitchen/Bathroom surfaces
SURFACE_MATERIALS = {
    "marble": ["Carrera marble worktops", "marble-effect tiles", "marble vanity unit"],
    "granite": ["granite worktops", "polished granite surfaces"],
    "quartz": ["quartz composite worktops", "engineered quartz surfaces"],
    "stone": ["natural stone worktops", "limestone surfaces", "sandstone features"],
    "tiles": ["subway tiles", "metro tiles", "mosaic tiles"],
}

# Appliances
APPLIANCES = {
    "stainless appliances": ["Siemens integrated appliances", "Miele integrated appliances", "stainless steel range"],
    "integrated appliances": ["Siemens integrated appliances", "Bosch integrated appliances", "AEG integrated appliances"],
    "oven": ["built-in oven", "double oven", "range cooker"],
    "dishwasher": ["integrated dishwasher", "Bosch dishwasher"],
}

# Windows and doors
WINDOWS_DOORS = {
    "large windows": ["floor-to-ceiling windows", "bay windows", "sash windows"],
    "glass doors": ["French doors", "bi-fold doors", "sliding doors"],
    "windows": ["double-glazed windows", "triple-glazed windows", "sash windows"],
}

# Bathroom fixtures
BATHROOM_FIXTURES = {
    "bath": ["freestanding bath", "roll-top bath", "built-in bath"],
    "shower": ["walk-in shower", "rainfall shower", "power shower"],
    "sink": ["vanity unit", "basin", "pedestal basin"],
}

# Storage
STORAGE = {
    "closet": ["fitted wardrobes", "walk-in wardrobe", "built-in storage"],
    "cabinets": ["floor-to-ceiling units", "wall units", "base units"],
    "shelving": ["built-in shelving", "floating shelves", "alcove shelving"],
}

# Complete mapping dictionary
MATERIAL_SPECIFICITY_MAP = {
    **FLOORING_MATERIALS,
    **SURFACE_MATERIALS,
    **APPLIANCES,
    **WINDOWS_DOORS,
    **BATHROOM_FIXTURES,
    **STORAGE,
}


def get_specific_term(generic_term: str) -> str:
    """
    Convert generic vision term to specific real estate term.

    Args:
        generic_term: Generic term from vision analysis

    Returns:
        Specific real estate term (first option from list)
    """
    generic_lower = generic_term.lower()

    # Check for exact match
    if generic_lower in MATERIAL_SPECIFICITY_MAP:
        return MATERIAL_SPECIFICITY_MAP[generic_lower][0]

    # Check for partial matches
    for key, values in MATERIAL_SPECIFICITY_MAP.items():
        if key in generic_lower or generic_lower in key:
            return values[0]

    # Return original if no match found
    return generic_term


def get_alternative_terms(generic_term: str) -> list[str]:
    """
    Get all alternative specific terms for a generic term.

    Args:
        generic_term: Generic term from vision analysis

    Returns:
        List of specific alternatives
    """
    generic_lower = generic_term.lower()

    # Check for exact match
    if generic_lower in MATERIAL_SPECIFICITY_MAP:
        return MATERIAL_SPECIFICITY_MAP[generic_lower]

    # Check for partial matches
    for key, values in MATERIAL_SPECIFICITY_MAP.items():
        if key in generic_lower or generic_lower in key:
            return values

    # Return original as single-item list if no match
    return [generic_term]
