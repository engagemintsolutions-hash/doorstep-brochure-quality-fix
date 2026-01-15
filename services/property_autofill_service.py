"""
Property Autofill Service

Auto-populates property data based on postcode lookup.
Includes demo presets for Savills luxury properties.
"""
from typing import Optional, Dict, Any
import re


class PropertyAutofillService:
    """Service for auto-populating property data from postcode."""

    def __init__(self):
        """Initialize with demo property presets."""
        # Demo property data for common postcodes
        self.demo_properties = {
            # Prime Central London - Belgravia
            "SW1X 7": {
                "address": "Belgrave Square, Belgravia, London SW1X 7LY",
                "property_type": "house",
                "bedrooms": 6,
                "bathrooms": 5,
                "reception_rooms": 3,
                "size_sqft": 4500,
                "size_sqm": 418,
                "guide_price": "£2,200,000",
                "price_value": 2200000,
                "tenure": "Freehold",
                "council_tax_band": "H",
                "council_tax_annual": "£3,264",
                "epc_rating": "D",
                "epc_score": 65,
                "epc_potential": "B",
                "local_authority": "Westminster",
                "parking": "Off-street parking for 2 vehicles",
                "garden": "Private rear garden (50ft)",
                "year_built": 1850,
                "year_renovated": 2020,
                "listing_type": "For Sale",
                "features": [
                    "Period property with modern renovation",
                    "High ceilings and original features",
                    "State-of-the-art kitchen",
                    "Master suite with dressing room",
                    "Off-street parking",
                    "Private garden",
                    "Close to Hyde Park",
                    "Excellent transport links"
                ],
                "location_enrichment": {
                    "schools": {
                        "primary": [
                            {"name": "Pimlico Primary", "distance_km": 0.7, "ofsted_rating": "Outstanding", "distance_text": "0.7km away"}
                        ],
                        "secondary": [
                            {"name": "Westminster School", "distance_km": 1.2, "ofsted_rating": "Outstanding", "distance_text": "1.2km away"}
                        ],
                        "summary": "0.7km from 2 primary schools rated excellent by Ofsted"
                    },
                    "amenities": {
                        "nearest_village": "Belgravia Village",
                        "distance_km": 0.3,
                        "description": "0.3km to Belgravia Village with boutique shops and restaurants",
                        "highlights": ["Luxury boutiques", "Fine dining", "Artisan cafes", "Elizabeth Street shopping"]
                    },
                    "transport": {
                        "nearest_station": "Victoria Station",
                        "distance_km": 0.8,
                        "journey_time": "15 minutes to London Waterloo",
                        "description": "0.8km to Victoria Station with direct access to Waterloo",
                        "connections": ["Underground (Victoria, Circle, District Lines)", "National Rail", "Gatwick Express"]
                    },
                    "parks": [
                        {"name": "Hyde Park", "distance_km": 0.5},
                        {"name": "St James's Park", "distance_km": 0.9}
                    ],
                    "summary": "Exceptional location in the heart of Belgravia, 0.7km from excellent primary schools, 0.3km from Belgravia Village, and 0.8km from Victoria Station with direct Waterloo access."
                }
            },
            # Kensington
            "SW7 2": {
                "address": "Queens Gate, South Kensington, London SW7 2JU",
                "property_type": "flat",
                "bedrooms": 3,
                "bathrooms": 2,
                "reception_rooms": 1,
                "size_sqft": 1850,
                "size_sqm": 172,
                "guide_price": "£1,850,000",
                "price_value": 1850000,
                "tenure": "Leasehold (125 years remaining)",
                "council_tax_band": "G",
                "council_tax_annual": "£2,851",
                "epc_rating": "C",
                "epc_score": 72,
                "epc_potential": "B",
                "local_authority": "Kensington and Chelsea",
                "parking": "Allocated underground parking",
                "garden": "Communal gardens",
                "year_built": 1890,
                "year_renovated": 2018,
                "listing_type": "For Sale",
                "features": [
                    "Elegant Victorian conversion",
                    "Spacious reception room",
                    "Modern fitted kitchen",
                    "Two en-suite bedrooms",
                    "Period features",
                    "Communal gardens",
                    "24-hour porter",
                    "Moments from South Kensington tube"
                ]
            },
            # Chelsea
            "SW3 4": {
                "address": "Cadogan Square, Chelsea, London SW3 4TG",
                "property_type": "house",
                "bedrooms": 5,
                "bathrooms": 4,
                "reception_rooms": 2,
                "size_sqft": 3200,
                "size_sqm": 297,
                "guide_price": "£4,750,000",
                "price_value": 4750000,
                "tenure": "Freehold",
                "council_tax_band": "H",
                "council_tax_annual": "£3,264",
                "epc_rating": "C",
                "epc_score": 69,
                "epc_potential": "B",
                "local_authority": "Kensington and Chelsea",
                "parking": "Secure underground parking",
                "garden": "Landscaped garden (40ft)",
                "year_built": 1880,
                "year_renovated": 2021,
                "listing_type": "For Sale",
                "features": [
                    "Stunning period townhouse",
                    "Beautifully refurbished throughout",
                    "Bespoke kitchen/breakfast room",
                    "Principal bedroom suite",
                    "Private garden",
                    "Wine cellar",
                    "Smart home technology",
                    "Prime Chelsea location"
                ]
            },
            # Cranleigh, Surrey - GU6 7LL
            "GU6 7": {
                "address": "Avenue Road, Cranleigh, Surrey GU6 7LL",
                "property_type": "house",
                "bedrooms": 5,
                "bathrooms": 4,
                "reception_rooms": 3,
                "size_sqft": 3500,
                "size_sqm": 325,
                "guide_price": "£1,850,000",
                "price_value": 1850000,
                "tenure": "Freehold",
                "council_tax_band": "G",
                "council_tax_annual": "£2,851",
                "epc_rating": "C",
                "epc_score": 72,
                "epc_potential": "B",
                "local_authority": "Waverley",
                "parking": "Driveway and garage",
                "garden": "Large rear garden",
                "year_built": 1920,
                "year_renovated": 2019,
                "listing_type": "For Sale",
                "features": [
                    "Spacious family home",
                    "Beautifully renovated throughout",
                    "Modern kitchen with breakfast area",
                    "Master bedroom with en-suite",
                    "Large private garden",
                    "Double garage",
                    "Village location",
                    "Excellent local schools"
                ],
                "location_enrichment": {
                    "schools": {
                        "primary": [
                            {"name": "Cranleigh Church of England Primary School", "distance_km": 0.7, "ofsted_rating": "Outstanding", "distance_text": "0.7km away"}
                        ],
                        "secondary": [
                            {"name": "Cranleigh School", "distance_km": 1.2, "ofsted_rating": "Outstanding", "distance_text": "1.2km away"}
                        ],
                        "summary": "0.7km from 2 primary schools rated excellent by Ofsted"
                    },
                    "amenities": {
                        "nearest_village": "Cranleigh Village",
                        "distance_km": 0.8,
                        "description": "0.8km from local amenities and Cranleigh village",
                        "highlights": ["Village shops", "Restaurants", "Cafes", "Post office", "Library"]
                    },
                    "transport": {
                        "nearest_station": "Guildford Station",
                        "distance_km": 15,
                        "journey_time": "Easy access to Waterloo station",
                        "description": "15km to Guildford train station with easy access to Waterloo",
                        "connections": ["South Western Railway to Waterloo", "Regular bus services", "Good road links"]
                    },
                    "parks": [
                        {"name": "Cranleigh Common", "distance_km": 0.5}
                    ],
                    "summary": "The property is 0.7km from 2 primary schools rated excellent by Ofsted, 0.8km from local amenities and Cranleigh village, 15km access to Guildford train station with easy access to Waterloo station."
                }
            },
            # Mayfair
            "W1K 6": {
                "address": "Grosvenor Square, Mayfair, London W1K 6JP",
                "property_type": "flat",
                "bedrooms": 4,
                "bathrooms": 3,
                "reception_rooms": 2,
                "size_sqft": 2400,
                "size_sqm": 223,
                "guide_price": "£3,950,000",
                "price_value": 3950000,
                "tenure": "Leasehold (999 years)",
                "council_tax_band": "H",
                "council_tax_annual": "£3,264",
                "epc_rating": "B",
                "epc_score": 85,
                "epc_potential": "A",
                "local_authority": "Westminster",
                "parking": "Valet parking service",
                "garden": "Residents' terrace",
                "year_built": 2019,
                "year_renovated": 2019,
                "listing_type": "For Sale",
                "features": [
                    "Luxury new build development",
                    "Concierge and valet services",
                    "Residents' gym and spa",
                    "Cinema room",
                    "Wine storage",
                    "Underfloor heating",
                    "Air conditioning",
                    "Heart of Mayfair"
                ]
            },
            # Default fallback for any other postcode
            "DEFAULT": {
                "address": None,  # Will use user input
                "property_type": "house",
                "bedrooms": 4,
                "bathrooms": 3,
                "reception_rooms": 2,
                "size_sqft": 2200,
                "size_sqm": 204,
                "guide_price": "£1,500,000",
                "price_value": 1500000,
                "tenure": "Freehold",
                "council_tax_band": "F",
                "council_tax_annual": "£2,416",
                "epc_rating": "C",
                "epc_score": 70,
                "epc_potential": "B",
                "local_authority": "Unknown",
                "parking": "Driveway parking",
                "garden": "Rear garden",
                "year_built": 1960,
                "year_renovated": 2015,
                "listing_type": "For Sale",
                "features": [
                    "Well-presented family home",
                    "Spacious reception rooms",
                    "Modern kitchen",
                    "Master bedroom with en-suite",
                    "Private garden",
                    "Off-street parking",
                    "Good local schools",
                    "Convenient transport links"
                ],
                "location_enrichment": {
                    "schools": {
                        "primary": [
                            {"name": "Local Primary School", "distance_km": 0.7, "ofsted_rating": "Outstanding", "distance_text": "0.7km away"}
                        ],
                        "secondary": [
                            {"name": "Local Secondary School", "distance_km": 1.2, "ofsted_rating": "Good", "distance_text": "1.2km away"}
                        ],
                        "summary": "0.7km from 2 primary schools rated excellent by Ofsted"
                    },
                    "amenities": {
                        "nearest_village": "Cranleigh Village",
                        "distance_km": 0.8,
                        "description": "0.8km from local amenities and Cranleigh village",
                        "highlights": ["Local shops", "Restaurants", "Cafes", "Post office"]
                    },
                    "transport": {
                        "nearest_station": "Guildford Station",
                        "distance_km": 15,
                        "journey_time": "Easy access to Waterloo station",
                        "description": "15km to Guildford train station with easy access to Waterloo",
                        "connections": ["South Western Railway to Waterloo", "Regular bus services", "Good road links"]
                    },
                    "parks": [
                        {"name": "Local Park", "distance_km": 0.5}
                    ],
                    "summary": "The property is 0.7km from 2 primary schools rated excellent by Ofsted, 0.8km from local amenities and Cranleigh village, 15km access to Guildford train station with easy access to Waterloo station."
                }
            }
        }

    def normalize_postcode(self, postcode: str) -> str:
        """Normalize postcode to match format (e.g., 'SW1X 7')."""
        # Remove spaces and convert to uppercase
        postcode = postcode.replace(" ", "").upper()

        # Extract district code (e.g., SW1X, SW7, W1K)
        # UK postcode format: AREA(1-2 letters) + DISTRICT(1-2 digits + optional letter) + SECTOR(digit) + UNIT(2 letters)
        match = re.match(r'^([A-Z]{1,2}\d{1,2}[A-Z]?)\d[A-Z]{2}$', postcode)
        if match:
            district = match.group(1)
            # Get first character of sector
            sector = postcode[len(district):len(district)+1]
            return f"{district} {sector}"

        return None

    def lookup_property_data(self, postcode: str, address: Optional[str] = None) -> Dict[str, Any]:
        """Look up property data by postcode.

        Args:
            postcode: UK postcode (e.g., "SW1X 7LY")
            address: Optional full address (will override demo address)

        Returns:
            Dictionary with property data
        """
        # Normalize postcode
        normalized = self.normalize_postcode(postcode)

        # Try to find matching demo property
        property_data = None
        if normalized:
            property_data = self.demo_properties.get(normalized)

        # Fall back to default if no match
        if not property_data:
            property_data = self.demo_properties["DEFAULT"].copy()
        else:
            property_data = property_data.copy()

        # Override address if provided
        if address:
            property_data["address"] = address

        # Add postcode
        property_data["postcode"] = postcode.upper()

        # Add enrichment data flag
        property_data["auto_populated"] = True
        property_data["data_source"] = "demo_preset" if normalized in self.demo_properties else "default"

        return property_data

    def get_council_tax_bands(self) -> Dict[str, Dict[str, Any]]:
        """Get council tax band information.

        Returns:
            Dictionary of council tax bands with annual charges
        """
        return {
            "A": {"range": "Up to £40,000", "annual": "£1,023"},
            "B": {"range": "£40,001 to £52,000", "annual": "£1,194"},
            "C": {"range": "£52,001 to £68,000", "annual": "£1,364"},
            "D": {"range": "£68,001 to £88,000", "annual": "£1,535"},
            "E": {"range": "£88,001 to £120,000", "annual": "£1,876"},
            "F": {"range": "£120,001 to £160,000", "annual": "£2,416"},
            "G": {"range": "£160,001 to £320,000", "annual": "£2,851"},
            "H": {"range": "Over £320,000", "annual": "£3,264"}
        }

    def get_epc_rating_info(self, rating: str) -> Dict[str, Any]:
        """Get EPC rating information.

        Args:
            rating: EPC rating (A-G)

        Returns:
            Dictionary with rating information
        """
        epc_info = {
            "A": {
                "score_range": "92-100",
                "description": "Very energy efficient - lower running costs",
                "color": "#00B050"
            },
            "B": {
                "score_range": "81-91",
                "description": "Energy efficient - lower running costs",
                "color": "#36B34A"
            },
            "C": {
                "score_range": "69-80",
                "description": "Fairly energy efficient - average running costs",
                "color": "#8EC429"
            },
            "D": {
                "score_range": "55-68",
                "description": "Average energy efficiency - typical running costs",
                "color": "#F6EB14"
            },
            "E": {
                "score_range": "39-54",
                "description": "Below average - higher running costs",
                "color": "#FDB913"
            },
            "F": {
                "score_range": "21-38",
                "description": "Poor - high running costs",
                "color": "#F36E15"
            },
            "G": {
                "score_range": "1-20",
                "description": "Very poor - very high running costs",
                "color": "#E12F26"
            }
        }

        return epc_info.get(rating, epc_info["D"])
