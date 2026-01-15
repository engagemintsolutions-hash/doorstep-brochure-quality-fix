"""
Usage tracking service for free trial and subscription management.
"""
import json
import os
from datetime import datetime
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)

class UsageTracker:
    """
    Track user usage for free trial and billing purposes.

    Simple file-based storage for now (replace with DB in production).
    """

    def __init__(self, storage_path: str = "./user_usage_data.json"):
        """Initialize usage tracker."""
        self.storage_path = storage_path
        self._ensure_storage_exists()

    def _ensure_storage_exists(self):
        """Create storage file if it doesn't exist."""
        if not os.path.exists(self.storage_path):
            with open(self.storage_path, 'w') as f:
                json.dump({}, f)
            logger.info(f"Created usage storage at {self.storage_path}")

    def _load_data(self) -> Dict:
        """Load usage data from storage."""
        try:
            with open(self.storage_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading usage data: {e}")
            return {}

    def _save_data(self, data: Dict):
        """Save usage data to storage."""
        try:
            with open(self.storage_path, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving usage data: {e}")

    def get_user_usage(self, user_email: str) -> Dict:
        """
        Get usage data for a user.

        Returns:
            {
                "email": str,
                "brochures_created": int,
                "trial_brochures_used": int,
                "trial_limit": int,
                "is_trial": bool,
                "subscription_tier": Optional[str],
                "created_at": str,
                "last_used": str
            }
        """
        data = self._load_data()

        if user_email not in data:
            # Check if this is a Savills user (enterprise tier)
            is_savills = user_email.lower().endswith('@savills.com')

            if is_savills:
                # Savills users get enterprise tier automatically
                user_data = {
                    "email": user_email,
                    "brochures_created": 0,
                    "trial_brochures_used": 0,
                    "trial_limit": 100,
                    "is_trial": False,
                    "subscription_tier": "enterprise",
                    "created_at": datetime.utcnow().isoformat(),
                    "last_used": datetime.utcnow().isoformat()
                }
                logger.info(f"Created new Savills enterprise user: {user_email}")
            else:
                # Other users get trial
                user_data = {
                    "email": user_email,
                    "brochures_created": 0,
                    "trial_brochures_used": 0,
                    "trial_limit": 100,
                    "is_trial": True,
                    "subscription_tier": None,
                    "created_at": datetime.utcnow().isoformat(),
                    "last_used": datetime.utcnow().isoformat()
                }
                logger.info(f"Created new trial user: {user_email}")

            data[user_email] = user_data
            self._save_data(data)

        return data[user_email]

    def increment_usage(self, user_email: str) -> Dict:
        """
        Increment usage count for a user.

        Returns updated user data.
        """
        data = self._load_data()
        user_data = self.get_user_usage(user_email)

        user_data["brochures_created"] += 1

        if user_data["is_trial"]:
            user_data["trial_brochures_used"] += 1

        user_data["last_used"] = datetime.utcnow().isoformat()

        data[user_email] = user_data
        self._save_data(data)

        logger.info(f"Incremented usage for {user_email}: {user_data['brochures_created']} total, {user_data['trial_brochures_used']} trial")

        return user_data

    def can_create_brochure(self, user_email: str) -> tuple[bool, str]:
        """
        Check if user can create a brochure.

        Returns:
            (can_create: bool, reason: str)
        """
        user_data = self.get_user_usage(user_email)

        if user_data["is_trial"]:
            if user_data["trial_brochures_used"] >= user_data["trial_limit"]:
                return False, f"Free trial limit reached ({user_data['trial_limit']} brochures). Please upgrade to continue."
            else:
                remaining = user_data["trial_limit"] - user_data["trial_brochures_used"]
                return True, f"Trial: {remaining} free brochures remaining"

        # TODO: Add subscription tier checks here
        if user_data["subscription_tier"]:
            return True, f"Subscription active: {user_data['subscription_tier']}"

        # If not in trial and no subscription, require payment
        return False, "Please purchase a brochure or subscribe to continue."

    def upgrade_to_subscription(self, user_email: str, tier: str):
        """
        Upgrade user from trial to subscription.

        Args:
            tier: "solo", "small_agency", "medium_agency", or "enterprise"
        """
        data = self._load_data()
        user_data = self.get_user_usage(user_email)

        user_data["is_trial"] = False
        user_data["subscription_tier"] = tier
        user_data["upgraded_at"] = datetime.utcnow().isoformat()

        data[user_email] = user_data
        self._save_data(data)

        logger.info(f"Upgraded {user_email} to {tier}")

    def get_stats(self) -> Dict:
        """Get overall usage statistics."""
        data = self._load_data()

        total_users = len(data)
        trial_users = sum(1 for u in data.values() if u["is_trial"])
        paid_users = total_users - trial_users
        total_brochures = sum(u["brochures_created"] for u in data.values())

        return {
            "total_users": total_users,
            "trial_users": trial_users,
            "paid_users": paid_users,
            "total_brochures": total_brochures,
            "avg_brochures_per_user": total_brochures / total_users if total_users > 0 else 0
        }
