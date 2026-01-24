"""
Custom Template Service
Allows users to save, load, and manage their own reusable brochure templates
"""

import json
import os
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class CustomTemplateService:
    """Service for managing user-created custom templates"""

    def __init__(self, storage_dir: str = "custom_templates"):
        self.storage_dir = storage_dir
        os.makedirs(storage_dir, exist_ok=True)
        logger.info(f"Custom template service initialized: {storage_dir}")

    def save_template(
        self,
        user_id: str,
        name: str,
        template_data: Dict[str, Any],
        description: str = "",
        category: str = "custom"
    ) -> Dict[str, Any]:
        """
        Save a custom template

        Args:
            user_id: User identifier
            name: Template name
            template_data: Template configuration (colors, layout, styles)
            description: Optional description
            category: Template category

        Returns:
            Saved template with ID
        """
        template_id = f"custom_{uuid.uuid4().hex[:12]}"

        template = {
            "id": template_id,
            "user_id": user_id,
            "name": name,
            "description": description,
            "category": category,
            "template_data": template_data,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }

        # Save to user's template file
        user_templates = self._load_user_templates(user_id)
        user_templates[template_id] = template
        self._save_user_templates(user_id, user_templates)

        logger.info(f"Saved custom template: {template_id} for user {user_id}")
        return template

    def get_template(self, user_id: str, template_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific template by ID"""
        user_templates = self._load_user_templates(user_id)
        return user_templates.get(template_id)

    def list_templates(self, user_id: str) -> List[Dict[str, Any]]:
        """List all templates for a user"""
        user_templates = self._load_user_templates(user_id)
        templates = list(user_templates.values())
        # Sort by created date, newest first
        templates.sort(key=lambda t: t.get("created_at", ""), reverse=True)
        return templates

    def update_template(
        self,
        user_id: str,
        template_id: str,
        updates: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update an existing template"""
        user_templates = self._load_user_templates(user_id)

        if template_id not in user_templates:
            return None

        template = user_templates[template_id]

        # Update allowed fields
        if "name" in updates:
            template["name"] = updates["name"]
        if "description" in updates:
            template["description"] = updates["description"]
        if "template_data" in updates:
            template["template_data"] = updates["template_data"]
        if "category" in updates:
            template["category"] = updates["category"]

        template["updated_at"] = datetime.utcnow().isoformat()

        user_templates[template_id] = template
        self._save_user_templates(user_id, user_templates)

        logger.info(f"Updated custom template: {template_id}")
        return template

    def delete_template(self, user_id: str, template_id: str) -> bool:
        """Delete a custom template"""
        user_templates = self._load_user_templates(user_id)

        if template_id not in user_templates:
            return False

        del user_templates[template_id]
        self._save_user_templates(user_id, user_templates)

        logger.info(f"Deleted custom template: {template_id}")
        return True

    def duplicate_template(
        self,
        user_id: str,
        template_id: str,
        new_name: str = None
    ) -> Optional[Dict[str, Any]]:
        """Duplicate an existing template"""
        original = self.get_template(user_id, template_id)
        if not original:
            return None

        name = new_name or f"{original['name']} (Copy)"
        return self.save_template(
            user_id=user_id,
            name=name,
            template_data=original["template_data"].copy(),
            description=original.get("description", ""),
            category=original.get("category", "custom")
        )

    def _get_user_file_path(self, user_id: str) -> str:
        """Get the file path for a user's templates"""
        safe_user_id = "".join(c for c in user_id if c.isalnum() or c in "-_")
        return os.path.join(self.storage_dir, f"{safe_user_id}_templates.json")

    def _load_user_templates(self, user_id: str) -> Dict[str, Dict[str, Any]]:
        """Load templates from user's file"""
        file_path = self._get_user_file_path(user_id)

        if not os.path.exists(file_path):
            return {}

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            logger.error(f"Error loading templates for {user_id}: {e}")
            return {}

    def _save_user_templates(self, user_id: str, templates: Dict[str, Dict[str, Any]]):
        """Save templates to user's file"""
        file_path = self._get_user_file_path(user_id)

        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(templates, f, indent=2)
        except IOError as e:
            logger.error(f"Error saving templates for {user_id}: {e}")
            raise


# Singleton instance
_custom_template_service: Optional[CustomTemplateService] = None

def get_custom_template_service() -> CustomTemplateService:
    """Get or create the custom template service singleton"""
    global _custom_template_service
    if _custom_template_service is None:
        _custom_template_service = CustomTemplateService()
    return _custom_template_service
