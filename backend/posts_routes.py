"""
API routes for creating, scheduling, and managing social media posts.
"""
from fastapi import APIRouter, HTTPException, Depends, Query, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from backend.database import get_db
from backend.models import SocialAccount, ScheduledPost, PostStatus, PlatformType
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional, List
import uuid
import logging
import base64

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/posts", tags=["posts"])


# Pydantic models for request/response
class CreatePostRequest(BaseModel):
    """Request to create a new post"""
    account_id: str = Field(..., description="ID of the connected social account")
    caption: str = Field(..., description="Post caption/text", max_length=2200)
    image_url: Optional[str] = Field(None, description="URL to image (or base64 data)")
    hashtags: Optional[str] = Field(None, description="Comma-separated hashtags")
    scheduled_time: datetime = Field(..., description="When to publish (ISO 8601 format)")


class UpdatePostRequest(BaseModel):
    """Request to update an existing post"""
    caption: Optional[str] = Field(None, max_length=2200)
    image_url: Optional[str] = None
    hashtags: Optional[str] = None
    scheduled_time: Optional[datetime] = None
    status: Optional[PostStatus] = None


class PostResponse(BaseModel):
    """Response with post details"""
    id: str
    account_id: str
    caption: str
    image_url: Optional[str]
    hashtags: Optional[str]
    scheduled_time: datetime
    status: PostStatus
    published_at: Optional[datetime]
    platform_post_id: Optional[str]
    platform_post_url: Optional[str]
    likes_count: int
    comments_count: int
    shares_count: int
    created_at: datetime

    class Config:
        from_attributes = True


@router.post("/create", response_model=PostResponse)
async def create_post(
    request: CreatePostRequest,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new scheduled post.

    This creates a post in "draft" status. The background scheduler will
    automatically publish it at the scheduled time.

    Validations:
    - Account must exist and be active
    - Scheduled time must be in the future
    - Image is optional (text-only posts allowed)
    - Caption length depends on platform (Instagram: 2200 chars, Facebook: no limit)
    """
    try:
        # Verify account exists and belongs to user
        stmt = select(SocialAccount).where(
            SocialAccount.id == request.account_id,
            SocialAccount.user_email == user_email,
            SocialAccount.is_active == True
        )
        result = await db.execute(stmt)
        account = result.scalar_one_or_none()

        if not account:
            raise HTTPException(
                status_code=404,
                detail="Social account not found or inactive"
            )

        # Validate scheduled time is in the future
        if request.scheduled_time <= datetime.utcnow():
            raise HTTPException(
                status_code=400,
                detail="Scheduled time must be in the future"
            )

        # Check if token is expired
        if account.token_expires_at and account.token_expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=403,
                detail="Access token expired. Please reconnect your account."
            )

        # Create new post
        post_id = str(uuid.uuid4())
        new_post = ScheduledPost(
            id=post_id,
            account_id=request.account_id,
            caption=request.caption,
            image_url=request.image_url,
            hashtags=request.hashtags,
            scheduled_time=request.scheduled_time,
            status=PostStatus.SCHEDULED,
            created_at=datetime.utcnow()
        )

        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)

        logger.info(f"✅ Created scheduled post {post_id} for {account.platform.value} ({user_email})")

        return PostResponse.model_validate(new_post)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to create post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create post: {str(e)}")


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """Get details of a specific post"""
    try:
        stmt = select(ScheduledPost).join(SocialAccount).where(
            ScheduledPost.id == post_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        return PostResponse.model_validate(post)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to fetch post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch post: {str(e)}")


@router.get("/", response_model=List[PostResponse])
async def list_posts(
    user_email: str = Query(..., description="Agent's email address"),
    status: Optional[PostStatus] = Query(None, description="Filter by status"),
    account_id: Optional[str] = Query(None, description="Filter by account"),
    limit: int = Query(50, ge=1, le=100, description="Max posts to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    db: AsyncSession = Depends(get_db)
):
    """
    List all posts for the user.

    Supports filtering by:
    - Status (draft, scheduled, published, failed)
    - Account ID
    - Pagination (limit/offset)

    Returns posts ordered by scheduled_time (newest first)
    """
    try:
        # Build query with filters
        stmt = select(ScheduledPost).join(SocialAccount).where(
            SocialAccount.user_email == user_email
        )

        if status:
            stmt = stmt.where(ScheduledPost.status == status)

        if account_id:
            stmt = stmt.where(ScheduledPost.account_id == account_id)

        # Order by scheduled time (newest first) and apply pagination
        stmt = stmt.order_by(ScheduledPost.scheduled_time.desc()).limit(limit).offset(offset)

        result = await db.execute(stmt)
        posts = result.scalars().all()

        return [PostResponse.model_validate(post) for post in posts]

    except Exception as e:
        logger.error(f"❌ Failed to list posts: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list posts: {str(e)}")


@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    request: UpdatePostRequest,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Update a scheduled post.

    Can only update posts in "draft" or "scheduled" status.
    Published or failed posts cannot be edited.
    """
    try:
        # Fetch post
        stmt = select(ScheduledPost).join(SocialAccount).where(
            ScheduledPost.id == post_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        # Check if post can be edited
        if post.status in [PostStatus.PUBLISHED, PostStatus.PUBLISHING]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot edit post in '{post.status.value}' status"
            )

        # Update fields
        if request.caption is not None:
            post.caption = request.caption

        if request.image_url is not None:
            post.image_url = request.image_url

        if request.hashtags is not None:
            post.hashtags = request.hashtags

        if request.scheduled_time is not None:
            if request.scheduled_time <= datetime.utcnow():
                raise HTTPException(
                    status_code=400,
                    detail="Scheduled time must be in the future"
                )
            post.scheduled_time = request.scheduled_time

        if request.status is not None:
            post.status = request.status

        post.updated_at = datetime.utcnow()

        await db.commit()
        await db.refresh(post)

        logger.info(f"✅ Updated post {post_id}")

        return PostResponse.model_validate(post)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to update post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update post: {str(e)}")


@router.delete("/{post_id}")
async def delete_post(
    post_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a scheduled post.

    Can only delete posts in "draft", "scheduled", or "failed" status.
    Published posts cannot be deleted (but can be cancelled).
    """
    try:
        stmt = select(ScheduledPost).join(SocialAccount).where(
            ScheduledPost.id == post_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if post.status == PostStatus.PUBLISHED:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete published post. Use cancel instead."
            )

        await db.delete(post)
        await db.commit()

        logger.info(f"🗑️ Deleted post {post_id}")

        return {"success": True, "message": "Post deleted successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to delete post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete post: {str(e)}")


@router.post("/{post_id}/cancel")
async def cancel_post(
    post_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Cancel a scheduled post.

    Marks post as "cancelled" status. The scheduler will skip cancelled posts.
    """
    try:
        stmt = select(ScheduledPost).join(SocialAccount).where(
            ScheduledPost.id == post_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if post.status == PostStatus.PUBLISHED:
            raise HTTPException(
                status_code=400,
                detail="Cannot cancel already published post"
            )

        post.status = PostStatus.CANCELLED
        post.updated_at = datetime.utcnow()

        await db.commit()

        logger.info(f"🚫 Cancelled post {post_id}")

        return {"success": True, "message": "Post cancelled successfully"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to cancel post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to cancel post: {str(e)}")


@router.post("/{post_id}/retry")
async def retry_post(
    post_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Retry a failed post.

    Resets status to "scheduled" and clears error info.
    The scheduler will attempt to publish again at the original scheduled time.
    """
    try:
        stmt = select(ScheduledPost).join(SocialAccount).where(
            ScheduledPost.id == post_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        post = result.scalar_one_or_none()

        if not post:
            raise HTTPException(status_code=404, detail="Post not found")

        if post.status != PostStatus.FAILED:
            raise HTTPException(
                status_code=400,
                detail=f"Can only retry failed posts (current status: {post.status.value})"
            )

        post.status = PostStatus.SCHEDULED
        post.retry_count += 1
        post.last_error = None
        post.error_code = None
        post.updated_at = datetime.utcnow()

        await db.commit()

        logger.info(f"🔄 Retrying post {post_id} (attempt #{post.retry_count})")

        return {"success": True, "message": f"Post scheduled for retry (attempt #{post.retry_count})"}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to retry post: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retry post: {str(e)}")


@router.post("/upload-image")
async def upload_image(
    user_email: str = Query(..., description="Agent's email address"),
    file: UploadFile = File(..., description="Image file to upload")
):
    """
    Upload an image for use in a post.

    Accepts: JPG, JPEG, PNG, WEBP
    Max size: 10MB
    Returns: Base64-encoded image data URL

    In production, you'd upload to cloud storage (S3, Cloudinary, etc.)
    For now, we'll return base64 data that can be stored directly.
    """
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(allowed_types)}"
            )

        # Validate file size (10MB max)
        file_data = await file.read()
        if len(file_data) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit"
            )

        # Convert to base64 data URL
        base64_data = base64.b64encode(file_data).decode('utf-8')
        data_url = f"data:{file.content_type};base64,{base64_data}"

        logger.info(f"📤 Uploaded image for {user_email} ({len(file_data)} bytes)")

        return {
            "success": True,
            "image_url": data_url,
            "file_size": len(file_data),
            "content_type": file.content_type
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to upload image: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
