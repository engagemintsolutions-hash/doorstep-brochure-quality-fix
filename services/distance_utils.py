"""
Distance calculation utilities for location enrichment.
Uses the Haversine formula for calculating great-circle distances.
"""
import math


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth.
    
    Args:
        lat1: Latitude of point 1 in decimal degrees
        lon1: Longitude of point 1 in decimal degrees
        lat2: Latitude of point 2 in decimal degrees
        lon2: Longitude of point 2 in decimal degrees
        
    Returns:
        Distance in kilometers
    """
    # Earth's radius in kilometers
    R = 6371.0
    
    # Convert to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Haversine formula
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return distance


def km_to_miles(km: float) -> float:
    """
    Convert kilometers to miles.
    
    Args:
        km: Distance in kilometers
        
    Returns:
        Distance in miles
    """
    return km * 0.621371


def format_distance(km: float) -> str:
    """
    Format distance in a human-readable way.
    
    Args:
        km: Distance in kilometers
        
    Returns:
        Formatted distance string (e.g., "0.3 miles", "1.2 miles")
    """
    miles = km_to_miles(km)
    
    if miles < 0.1:
        return f"{miles:.2f} miles"
    elif miles < 1.0:
        return f"{miles:.1f} miles"
    else:
        return f"{miles:.1f} miles"
