"""
Brochure Session Service - Manages editing sessions with photo storage.

Handles:
- Session creation with photo file storage
- Session loading with URL mapping
- Session updates (auto-save)
- Photo file management
- Session expiry and cleanup
"""

import json
import base64
import uuid
import re
import shutil
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional
import logging

from backend.schemas import (
    BrochureSessionData,
    BrochureSessionResponse,
    BrochurePhoto,
    BrochurePage
)

logger = logging.getLogger(__name__)


class BrochureSessionService:
    """Manages brochure editing sessions with persistent storage."""

    def __init__(self, base_dir: Path = None, expiry_hours: int = 24):
        """
        Initialize session service.

        Args:
            base_dir: Root directory for session storage
            expiry_hours: Hours until session expires
        """
        self.base_dir = base_dir or Path("brochure_sessions")
        self.expiry_hours = expiry_hours
        self.base_dir.mkdir(exist_ok=True, parents=True)
        logger.info(f"📁 Brochure session storage: {self.base_dir.absolute()}")

    def create_session(self, data: BrochureSessionData) -> BrochureSessionResponse:
        """
        Create new editing session with photo storage.

        Process:
        1. Generate unique session ID
        2. Create session directory structure
        3. Decode and save all photos as files
        4. Save metadata to session.json
        5. Return session info with photo URLs

        Args:
            data: Complete brochure state

        Returns:
            Session response with ID and photo URL mappings
        """
        # Generate session ID
        session_id = uuid.uuid4().hex
        session_dir = self.base_dir / session_id

        logger.info(f"📝 Creating session {session_id} for {data.user_email}")

        try:
            # Create directory structure
            session_dir.mkdir(parents=True, exist_ok=True)
            photos_dir = session_dir / "photos"
            photos_dir.mkdir(exist_ok=True)

            # Set timestamps
            now = datetime.utcnow()
            expires_at = now + timedelta(hours=self.expiry_hours)

            data.session_id = session_id
            data.created_at = now
            data.updated_at = now
            data.expires_at = expires_at

            # Save photos to disk and build URL mapping
            photo_urls = {}
            saved_photo_count = 0

            for photo in data.photos:
                try:
                    # Save photo file
                    photo_path = self._save_photo_file(session_id, photo)

                    # Build URL for this photo
                    photo_url = f"/api/brochure/session/{session_id}/photo/{photo.id}"
                    photo_urls[photo.id] = photo_url

                    saved_photo_count += 1

                except Exception as e:
                    logger.warning(f"⚠️ Failed to save photo {photo.id}: {e}")
                    continue

            logger.info(f"✅ Saved {saved_photo_count}/{len(data.photos)} photos")

            # Remove dataUrl from photos in metadata (we have files now)
            # This saves disk space in session.json
            session_data_dict = data.dict()

            # 🔥 FORENSIC: Log photos BEFORE cleaning dataUrl
            logger.info(f"🔥 [FORENSIC-PRE-JSON] Photos in dict BEFORE cleaning:")
            for i, photo in enumerate(session_data_dict.get('photos', [])[:2]):  # Just first 2
                logger.info(f"    Photo {i}: name={photo.get('name')}, has_analysis={'analysis' in photo}, analysis={photo.get('analysis')}")

            for photo in session_data_dict.get('photos', []):
                if 'dataUrl' in photo:
                    # Keep just a placeholder
                    photo['dataUrl'] = f"FILE_STORED_{photo['id']}"

            # Also clean dataUrl from page photos
            for page in session_data_dict.get('pages', []):
                for photo in page.get('photos', []):
                    if 'dataUrl' in photo:
                        photo['dataUrl'] = f"FILE_STORED_{photo['id']}"

            # 🔥 FORENSIC: Log photos AFTER cleaning dataUrl (before JSON save)
            logger.info(f"🔥 [FORENSIC-FINAL-JSON] Photos in dict AFTER cleaning (about to save):")
            for i, photo in enumerate(session_data_dict.get('photos', [])[:2]):  # Just first 2
                logger.info(f"    Photo {i}: name={photo.get('name')}, has_analysis={'analysis' in photo}, analysis={photo.get('analysis')}")

            # Save metadata
            session_file = session_dir / "session.json"
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session_data_dict, f, indent=2, default=str)

            logger.info(f"✅ Session {session_id} created successfully")

            return BrochureSessionResponse(
                session_id=session_id,
                expires_at=expires_at,
                photo_urls=photo_urls
            )

        except Exception as e:
            logger.error(f"❌ Failed to create session: {e}")
            # Cleanup on failure
            if session_dir.exists():
                shutil.rmtree(session_dir)
            raise

    def load_session(self, session_id: str) -> BrochureSessionData:
        """
        Load existing session from storage.

        Args:
            session_id: Session identifier

        Returns:
            Complete brochure session data

        Raises:
            ValueError: If session doesn't exist or is expired
        """
        # Validate session ID format (security)
        self._validate_session_id(session_id)

        session_dir = self.base_dir / session_id
        session_file = session_dir / "session.json"

        if not session_file.exists():
            raise ValueError(f"Session {session_id} not found")

        logger.info(f"📂 Loading session {session_id}")

        try:
            # Load metadata
            with open(session_file, 'r', encoding='utf-8') as f:
                data_dict = json.load(f)

            # Check expiry
            expires_at_str = data_dict.get('expires_at')
            if expires_at_str:
                expires_at = datetime.fromisoformat(expires_at_str.replace('Z', '+00:00'))
                if datetime.utcnow() > expires_at:
                    raise ValueError(f"Session {session_id} has expired")

            # Parse into Pydantic model
            session_data = BrochureSessionData(**data_dict)

            logger.info(f"✅ Session {session_id} loaded successfully")

            return session_data

        except Exception as e:
            logger.error(f"❌ Failed to load session {session_id}: {e}")
            raise

    def update_session(self, session_id: str, data: BrochureSessionData) -> None:
        """
        Update existing session (for auto-save).

        Args:
            session_id: Session identifier
            data: Updated brochure data
        """
        self._validate_session_id(session_id)

        session_dir = self.base_dir / session_id
        session_file = session_dir / "session.json"

        if not session_dir.exists():
            raise ValueError(f"Session {session_id} not found")

        logger.info(f"💾 Updating session {session_id}")

        try:
            # Update timestamp
            data.updated_at = datetime.utcnow()

            # Handle any new photos
            new_photos = []
            for photo in data.photos:
                if photo.dataUrl and photo.dataUrl.startswith('data:image'):
                    # Save to file for backward compatibility (localhost)
                    try:
                        self._save_photo_file(session_id, photo)
                        new_photos.append(photo.id)
                    except Exception as e:
                        logger.warning(f"Failed to save photo file (continuing with base64): {e}")

            if new_photos:
                logger.info(f"✅ Saved {len(new_photos)} new photos to disk")

            # Keep base64 data in JSON for Railway compatibility
            # This ensures photos persist even with ephemeral storage
            session_data_dict = data.dict()
            logger.info(f"📸 Preserving base64 photo data for Railway compatibility")

            # Save updated metadata
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session_data_dict, f, indent=2, default=str)

            logger.info(f"✅ Session {session_id} updated")

        except Exception as e:
            logger.error(f"❌ Failed to update session {session_id}: {e}")
            raise

    def get_photo_path(self, session_id: str, photo_id: str) -> Path:
        """
        Get filesystem path to a photo file.

        Args:
            session_id: Session identifier
            photo_id: Photo identifier

        Returns:
            Path to photo file

        Raises:
            FileNotFoundError: If photo doesn't exist
        """
        self._validate_session_id(session_id)

        # Try common extensions
        session_dir = self.base_dir / session_id / "photos"

        for ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
            photo_path = session_dir / f"{photo_id}{ext}"
            if photo_path.exists():
                return photo_path

        raise FileNotFoundError(f"Photo {photo_id} not found in session {session_id}")

    def get_photo_urls(self, session_id: str) -> Dict[str, str]:
        """
        Get URL mapping for all photos in a session.

        Args:
            session_id: Session identifier

        Returns:
            Dict mapping photo_id to URL path
        """
        self._validate_session_id(session_id)

        photos_dir = self.base_dir / session_id / "photos"
        photo_urls = {}

        if photos_dir.exists():
            for photo_file in photos_dir.iterdir():
                if photo_file.is_file():
                    # Extract photo ID from filename (remove extension)
                    photo_id = photo_file.stem
                    photo_url = f"/api/brochure/session/{session_id}/photo/{photo_id}"
                    photo_urls[photo_id] = photo_url

        return photo_urls

    def cleanup_expired(self) -> int:
        """
        Delete all expired sessions.

        Returns:
            Number of sessions deleted
        """
        deleted_count = 0
        now = datetime.utcnow()

        logger.info("🧹 Starting expired session cleanup...")

        for session_dir in self.base_dir.iterdir():
            if not session_dir.is_dir():
                continue

            session_file = session_dir / "session.json"
            if not session_file.exists():
                continue

            try:
                # Check expiry
                with open(session_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                expires_at_str = data.get('expires_at')
                if expires_at_str:
                    expires_at = datetime.fromisoformat(expires_at_str.replace('Z', '+00:00'))

                    if now > expires_at:
                        # Expired - delete
                        shutil.rmtree(session_dir)
                        deleted_count += 1
                        logger.info(f"🗑️ Deleted expired session {session_dir.name}")

            except Exception as e:
                logger.warning(f"⚠️ Failed to check session {session_dir.name}: {e}")
                continue

        logger.info(f"✅ Cleanup complete: {deleted_count} sessions deleted")
        return deleted_count

    def _save_photo_file(self, session_id: str, photo: BrochurePhoto) -> Path:
        """
        Decode base64 photo and save to disk.

        Args:
            session_id: Session identifier
            photo: Photo with base64 dataUrl

        Returns:
            Path to saved file
        """
        photos_dir = self.base_dir / session_id / "photos"
        photos_dir.mkdir(parents=True, exist_ok=True)

        # Decode base64 data
        image_data, extension = self._decode_base64_photo(photo.dataUrl)

        # Save file
        photo_path = photos_dir / f"{photo.id}{extension}"
        with open(photo_path, 'wb') as f:
            f.write(image_data)

        logger.debug(f"💾 Saved photo: {photo_path.name} ({len(image_data)} bytes)")

        return photo_path

    def _decode_base64_photo(self, data_url: str) -> Tuple[bytes, str]:
        """
        Extract image data and file extension from base64 data URL.

        Args:
            data_url: Base64 data URL (data:image/jpeg;base64,...)

        Returns:
            Tuple of (image_bytes, file_extension)
        """
        if not data_url.startswith('data:image'):
            raise ValueError("Invalid data URL format")

        # Extract MIME type and base64 data
        # Format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
        header, encoded = data_url.split(',', 1)

        # Decode base64
        image_data = base64.b64decode(encoded)

        # Determine file extension from MIME type
        if 'jpeg' in header or 'jpg' in header:
            extension = '.jpg'
        elif 'png' in header:
            extension = '.png'
        elif 'webp' in header:
            extension = '.webp'
        elif 'gif' in header:
            extension = '.gif'
        else:
            # Default to jpg
            extension = '.jpg'

        return image_data, extension

    def _validate_session_id(self, session_id: str) -> None:
        """
        Validate session ID format for security (prevent path traversal).

        Args:
            session_id: Session identifier to validate

        Raises:
            ValueError: If session ID format is invalid
        """
        # Accept two formats:
        # 1. 32 hex characters (UUID without hyphens): ^[a-f0-9]{32}$
        # 2. session_timestamp_random: ^session_\d+_[a-z0-9]+$
        if not (re.match(r'^[a-f0-9]{32}$', session_id) or
                re.match(r'^session_\d+_[a-z0-9]+$', session_id)):
            raise ValueError(f"Invalid session ID format: {session_id}")
