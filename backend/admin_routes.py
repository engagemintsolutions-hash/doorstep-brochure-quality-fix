"""
Admin routes for database initialization and management.
"""
from fastapi import APIRouter, HTTPException
from backend.database import init_db, check_db_connection
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/init-db")
async def initialize_database():
    """
    Initialize database tables.
    WARNING: This is a one-time setup operation.
    """
    try:
        # Check connection first
        logger.info("🔍 Checking database connection...")
        connected = await check_db_connection()

        if not connected:
            raise HTTPException(
                status_code=500,
                detail="Failed to connect to database. Check DATABASE_URL environment variable."
            )

        # Create tables
        logger.info("📦 Creating database tables...")
        await init_db()

        return {
            "success": True,
            "message": "Database tables created successfully",
            "tables": ["social_accounts", "scheduled_posts"]
        }
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")


@router.get("/check-db")
async def check_database():
    """Check database connection status."""
    try:
        connected = await check_db_connection()
        return {
            "connected": connected,
            "message": "Database connection successful" if connected else "Database connection failed"
        }
    except Exception as e:
        return {
            "connected": False,
            "message": f"Database check failed: {str(e)}"
        }
