"""
Background scheduler service that automatically publishes scheduled posts.

This service runs in the background and checks every minute for posts
that need to be published. It uses the Meta Graph API to publish posts
to Instagram and Facebook.
"""
import asyncio
import httpx
import logging
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from sqlalchemy import select, and_
from backend.models import ScheduledPost, SocialAccount, PostStatus, PlatformType
from backend.config import settings
import base64
import re

logger = logging.getLogger(__name__)


class PostScheduler:
    """Background service for publishing scheduled posts"""

    def __init__(self, session_factory: async_sessionmaker):
        self.session_factory = session_factory
        self.is_running = False
        self.check_interval = settings.scheduler_check_interval_seconds

    async def start(self):
        """Start the background scheduler"""
        if not settings.scheduler_enabled:
            logger.info("⏸️ Post scheduler disabled (SCHEDULER_ENABLED=false)")
            return

        logger.info(f"🚀 Starting post scheduler (checking every {self.check_interval}s)")
        self.is_running = True

        while self.is_running:
            try:
                await self._check_and_publish_posts()
            except Exception as e:
                logger.error(f"❌ Scheduler error: {e}")

            # Wait before next check
            await asyncio.sleep(self.check_interval)

    async def stop(self):
        """Stop the background scheduler"""
        logger.info("🛑 Stopping post scheduler")
        self.is_running = False

    async def _check_and_publish_posts(self):
        """Check for posts that need to be published and publish them"""
        async with self.session_factory() as db:
            try:
                # Find posts scheduled for now or earlier that haven't been published
                current_time = datetime.utcnow()

                stmt = select(ScheduledPost).join(SocialAccount).where(
                    and_(
                        ScheduledPost.status == PostStatus.SCHEDULED,
                        ScheduledPost.scheduled_time <= current_time,
                        SocialAccount.is_active == True
                    )
                ).limit(10)  # Process max 10 posts per check to avoid rate limits

                result = await db.execute(stmt)
                posts = result.scalars().all()

                if posts:
                    logger.info(f"📬 Found {len(posts)} posts ready to publish")

                for post in posts:
                    try:
                        # Mark as publishing to prevent duplicate processing
                        post.status = PostStatus.PUBLISHING
                        await db.commit()

                        # Publish the post
                        await self._publish_post(post, db)

                    except Exception as e:
                        logger.error(f"❌ Failed to publish post {post.id}: {e}")
                        post.status = PostStatus.FAILED
                        post.last_error = str(e)
                        post.retry_count += 1
                        await db.commit()

            except Exception as e:
                logger.error(f"❌ Error checking posts: {e}")

    async def _publish_post(self, post: ScheduledPost, db: AsyncSession):
        """Publish a single post to Instagram or Facebook"""
        # Get the account
        stmt = select(SocialAccount).where(SocialAccount.id == post.account_id)
        result = await db.execute(stmt)
        account = result.scalar_one_or_none()

        if not account:
            raise Exception(f"Account {post.account_id} not found")

        if not account.is_active:
            raise Exception(f"Account {account.platform_username} is inactive")

        # Check if token is expired
        if account.token_expires_at and account.token_expires_at < datetime.utcnow():
            raise Exception(f"Access token expired. User needs to reconnect account.")

        logger.info(f"📤 Publishing post {post.id} to {account.platform.value} ({account.platform_username})")

        # Publish based on platform
        if account.platform == PlatformType.INSTAGRAM:
            platform_post_id, platform_post_url = await self._publish_to_instagram(
                post, account.access_token, account.platform_user_id
            )
        elif account.platform == PlatformType.FACEBOOK:
            platform_post_id, platform_post_url = await self._publish_to_facebook(
                post, account.access_token, account.platform_user_id
            )
        else:
            raise Exception(f"Unsupported platform: {account.platform}")

        # Update post status
        post.status = PostStatus.PUBLISHED
        post.published_at = datetime.utcnow()
        post.platform_post_id = platform_post_id
        post.platform_post_url = platform_post_url
        await db.commit()

        # Update account last used time
        account.last_used_at = datetime.utcnow()
        await db.commit()

        logger.info(f"✅ Successfully published post {post.id} (platform ID: {platform_post_id})")

    async def _publish_to_instagram(
        self, post: ScheduledPost, access_token: str, user_id: str
    ) -> tuple[str, Optional[str]]:
        """
        Publish post to Instagram using Meta Graph API.

        Instagram Content Publishing API flow:
        1. Create media container
        2. Publish the container
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Prepare caption (combine text + hashtags)
            caption = post.caption
            if post.hashtags:
                caption += f"\n\n{post.hashtags}"

            # Step 1: Create media container
            if post.image_url:
                # Handle base64 image data
                image_url = await self._prepare_image_url(post.image_url, client)

                container_params = {
                    "image_url": image_url,
                    "caption": caption,
                    "access_token": access_token
                }
            else:
                # Text-only post not supported by Instagram API
                raise Exception("Instagram requires an image. Text-only posts are not supported.")

            # Create container
            container_response = await client.post(
                f"https://graph.facebook.com/v18.0/{user_id}/media",
                data=container_params
            )

            if container_response.status_code != 200:
                error_detail = container_response.json()
                raise Exception(f"Failed to create media container: {error_detail}")

            container_data = container_response.json()
            creation_id = container_data["id"]

            # Step 2: Publish the container
            publish_response = await client.post(
                f"https://graph.facebook.com/v18.0/{user_id}/media_publish",
                data={
                    "creation_id": creation_id,
                    "access_token": access_token
                }
            )

            if publish_response.status_code != 200:
                error_detail = publish_response.json()
                raise Exception(f"Failed to publish media: {error_detail}")

            publish_data = publish_response.json()
            post_id = publish_data["id"]

            # Instagram doesn't return a direct URL, construct it
            post_url = f"https://www.instagram.com/p/{post_id}/"

            return post_id, post_url

    async def _publish_to_facebook(
        self, post: ScheduledPost, access_token: str, page_id: str
    ) -> tuple[str, Optional[str]]:
        """
        Publish post to Facebook Page using Meta Graph API.

        Facebook allows both text-only and photo posts.
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Prepare message (combine caption + hashtags)
            message = post.caption
            if post.hashtags:
                message += f"\n\n{post.hashtags}"

            if post.image_url:
                # Photo post
                image_url = await self._prepare_image_url(post.image_url, client)

                response = await client.post(
                    f"https://graph.facebook.com/v18.0/{page_id}/photos",
                    data={
                        "url": image_url,
                        "caption": message,
                        "access_token": access_token
                    }
                )
            else:
                # Text-only post
                response = await client.post(
                    f"https://graph.facebook.com/v18.0/{page_id}/feed",
                    data={
                        "message": message,
                        "access_token": access_token
                    }
                )

            if response.status_code != 200:
                error_detail = response.json()
                raise Exception(f"Failed to publish to Facebook: {error_detail}")

            data = response.json()
            post_id = data["id"]

            # Construct post URL
            post_url = f"https://www.facebook.com/{post_id}"

            return post_id, post_url

    async def _prepare_image_url(self, image_data: str, client: httpx.AsyncClient) -> str:
        """
        Prepare image URL for posting.

        If image_data is a base64 data URL, we need to either:
        1. Upload it to a CDN/cloud storage first (production approach)
        2. Use Facebook/Instagram's image upload endpoints

        For now, this assumes image_data is either:
        - A public HTTP/HTTPS URL
        - Base64 data that needs to be uploaded (not implemented yet)
        """
        if image_data.startswith("http://") or image_data.startswith("https://"):
            # Already a public URL
            return image_data

        elif image_data.startswith("data:image/"):
            # Base64 data URL - need to upload to a public location
            # For production, upload to S3, Cloudinary, etc.
            # For now, raise an error
            raise Exception(
                "Base64 images must be uploaded to public storage before posting. "
                "Please use a public image URL or implement cloud storage upload."
            )

        else:
            raise Exception("Invalid image format. Must be a public URL or base64 data URL.")


# Background task runner
_scheduler_task: Optional[asyncio.Task] = None


async def start_scheduler(session_factory: async_sessionmaker):
    """Start the background scheduler as an async task"""
    global _scheduler_task

    if _scheduler_task is not None:
        logger.warning("⚠️ Scheduler already running")
        return

    scheduler = PostScheduler(session_factory)
    _scheduler_task = asyncio.create_task(scheduler.start())
    logger.info("✅ Scheduler task created")


async def stop_scheduler():
    """Stop the background scheduler"""
    global _scheduler_task

    if _scheduler_task is None:
        return

    _scheduler_task.cancel()
    try:
        await _scheduler_task
    except asyncio.CancelledError:
        pass

    _scheduler_task = None
    logger.info("✅ Scheduler stopped")
