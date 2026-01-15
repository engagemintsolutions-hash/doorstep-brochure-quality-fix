"""
Database initialization script.
Run this once to create all tables on Railway.

Usage:
    python init_db.py
"""
import asyncio
import sys
import logging
from backend.database import init_db, check_db_connection
from backend.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    """Initialize database tables"""
    logger.info("🚀 Starting database initialization...")
    logger.info(f"📍 Database URL: {settings.database_url[:30]}...")

    # Check connection first
    logger.info("🔍 Checking database connection...")
    connected = await check_db_connection()

    if not connected:
        logger.error("❌ Failed to connect to database. Please check your DATABASE_URL environment variable.")
        sys.exit(1)

    # Create tables
    logger.info("📦 Creating database tables...")
    try:
        await init_db()
        logger.info("✅ Database initialization complete!")
        logger.info("")
        logger.info("Tables created:")
        logger.info("  - social_accounts (Connected Instagram/Facebook accounts)")
        logger.info("  - scheduled_posts (Scheduled social media posts)")
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
