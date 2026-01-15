"""
SQLAlchemy database models for social media auto-posting.
"""
from sqlalchemy import Column, String, DateTime, Text, Boolean, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()


class PostStatus(str, enum.Enum):
    """Status of a scheduled post"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHING = "publishing"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PlatformType(str, enum.Enum):
    """Social media platform types"""
    INSTAGRAM = "instagram"
    FACEBOOK = "facebook"


class SocialAccount(Base):
    """Connected social media accounts"""
    __tablename__ = "social_accounts"

    id = Column(String(36), primary_key=True)  # UUID
    user_email = Column(String(255), nullable=False, index=True)  # Agent email
    platform = Column(SQLEnum(PlatformType), nullable=False)
    platform_user_id = Column(String(255), nullable=False)  # Platform's user ID
    platform_username = Column(String(255), nullable=True)  # Display name
    access_token = Column(Text, nullable=False)  # Encrypted access token
    token_expires_at = Column(DateTime(timezone=True), nullable=True)
    refresh_token = Column(Text, nullable=True)  # For token refresh

    # Account metadata
    is_active = Column(Boolean, default=True, nullable=False)
    profile_picture_url = Column(Text, nullable=True)
    follower_count = Column(Integer, nullable=True)

    # Timestamps
    connected_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    posts = relationship("ScheduledPost", back_populates="account", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<SocialAccount(id={self.id}, platform={self.platform}, username={self.platform_username})>"


class ScheduledPost(Base):
    """Scheduled social media posts"""
    __tablename__ = "scheduled_posts"

    id = Column(String(36), primary_key=True)  # UUID
    account_id = Column(String(36), ForeignKey("social_accounts.id", ondelete="CASCADE"), nullable=False, index=True)

    # Post content
    caption = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)  # URL or base64 data
    image_path = Column(Text, nullable=True)  # Local file path
    hashtags = Column(Text, nullable=True)  # JSON array as string

    # Scheduling
    scheduled_time = Column(DateTime(timezone=True), nullable=False, index=True)
    status = Column(SQLEnum(PostStatus), default=PostStatus.DRAFT, nullable=False, index=True)

    # Publishing metadata
    published_at = Column(DateTime(timezone=True), nullable=True)
    platform_post_id = Column(String(255), nullable=True)  # ID from Meta API
    platform_post_url = Column(Text, nullable=True)  # Permalink

    # Analytics (fetched after publishing)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    reach = Column(Integer, nullable=True)
    impressions = Column(Integer, nullable=True)

    # Error handling
    retry_count = Column(Integer, default=0, nullable=False)
    last_error = Column(Text, nullable=True)
    error_code = Column(String(50), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    account = relationship("SocialAccount", back_populates="posts")

    def __repr__(self):
        return f"<ScheduledPost(id={self.id}, status={self.status}, scheduled={self.scheduled_time})>"


# Create all tables (will be used by migration script)
def init_db(engine):
    """Initialize database tables"""
    Base.metadata.create_all(engine)
