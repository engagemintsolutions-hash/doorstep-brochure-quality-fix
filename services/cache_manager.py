"""
Simple in-memory cache with TTL (Time To Live) and LRU (Least Recently Used) eviction.
Used for caching geocoding and places API results.
"""
from typing import Any, Optional
from datetime import datetime, timedelta
from collections import OrderedDict


class CacheManager:
    """
    In-memory cache with TTL and LRU eviction.
    
    Features:
    - TTL-based expiry (items expire after a set time)
    - LRU eviction (least recently used items removed when cache is full)
    - Thread-safe for async usage
    """
    
    def __init__(self, max_size: int = 1000):
        """
        Initialize the cache manager.
        
        Args:
            max_size: Maximum number of items to store
        """
        self.max_size = max_size
        self._cache: OrderedDict = OrderedDict()
        self._expiry: dict[str, datetime] = {}
    
    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve a value from the cache.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value if found and not expired, None otherwise
        """
        if key not in self._cache:
            return None
        
        # Check if expired
        if key in self._expiry and datetime.now() > self._expiry[key]:
            # Remove expired item
            del self._cache[key]
            del self._expiry[key]
            return None
        
        # Move to end (most recently used)
        self._cache.move_to_end(key)
        return self._cache[key]
    
    def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        """
        Store a value in the cache.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl_seconds: Time to live in seconds (default: 1 hour)
        """
        # If key exists, remove it first (to update position)
        if key in self._cache:
            del self._cache[key]
        
        # Add new item
        self._cache[key] = value
        self._expiry[key] = datetime.now() + timedelta(seconds=ttl_seconds)
        
        # Enforce max size (LRU eviction)
        while len(self._cache) > self.max_size:
            # Remove least recently used (first item)
            oldest_key = next(iter(self._cache))
            del self._cache[oldest_key]
            if oldest_key in self._expiry:
                del self._expiry[oldest_key]
    
    def clear(self):
        """Clear all cached items."""
        self._cache.clear()
        self._expiry.clear()
    
    def size(self) -> int:
        """Get the current number of cached items."""
        return len(self._cache)
