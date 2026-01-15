"""
Global rate limiter for API calls.

Enforces minimum time between API calls across all requests to prevent
acceleration limit errors.
"""
import asyncio
import time
from typing import Optional


class GlobalRateLimiter:
    """
    Thread-safe global rate limiter that enforces minimum delay between API calls.

    This prevents Claude API acceleration limit errors when multiple photos are
    analyzed in quick succession across different requests.
    """

    def __init__(self, min_delay_seconds: float = 1.2):
        """
        Initialize rate limiter.

        Args:
            min_delay_seconds: Minimum seconds between API calls (default: 1.2s)
        """
        self.min_delay = min_delay_seconds
        self.last_call_time: Optional[float] = None
        self._lock = asyncio.Lock()

    async def wait_if_needed(self):
        """
        Wait if necessary to enforce rate limit.

        This method should be called BEFORE making an API call.
        It will block until enough time has passed since the last call.
        """
        async with self._lock:
            if self.last_call_time is not None:
                elapsed = time.time() - self.last_call_time
                if elapsed < self.min_delay:
                    wait_time = self.min_delay - elapsed
                    await asyncio.sleep(wait_time)

            self.last_call_time = time.time()
