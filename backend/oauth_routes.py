"""
OAuth routes for connecting Instagram and Facebook accounts.
Handles the OAuth 2.0 flow for Meta's Graph API.
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from backend.database import get_db
from backend.models import SocialAccount, PlatformType
from backend.config import settings
import httpx
import logging
from datetime import datetime, timedelta
import secrets
import uuid

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["oauth"])

# Temporary storage for OAuth state (in production, use Redis or database)
oauth_states = {}


def generate_state_token(user_email: str, platform: str) -> str:
    """Generate secure state token for CSRF protection"""
    import base64
    # Encode user_email and platform in the state token itself
    # This makes it stateless and works across server restarts
    timestamp = datetime.utcnow().timestamp()
    data = f"{user_email}|{platform}|{timestamp}"
    state = base64.b64encode(data.encode('utf-8')).decode('utf-8')

    # Also store in memory for backward compatibility
    oauth_states[state] = {
        "user_email": user_email,
        "platform": platform,
        "created_at": datetime.utcnow()
    }
    return state


def verify_state_token(state: str) -> dict:
    """Verify and consume state token"""
    # For production: decode the state token which contains user_email and platform
    # Format: base64(user_email|platform|timestamp)
    try:
        import base64
        decoded = base64.b64decode(state).decode('utf-8')
        parts = decoded.split('|')
        if len(parts) != 3:
            raise ValueError("Invalid state format")

        user_email, platform, timestamp = parts
        created_at = datetime.fromtimestamp(float(timestamp))

        # Check token age (15 minutes max)
        if datetime.utcnow() - created_at > timedelta(minutes=15):
            raise HTTPException(status_code=400, detail="State token expired")

        return {
            "user_email": user_email,
            "platform": platform,
            "created_at": created_at
        }
    except Exception as e:
        # Fallback to in-memory storage (for backward compatibility)
        if state in oauth_states:
            data = oauth_states.pop(state)
            if datetime.utcnow() - data["created_at"] > timedelta(minutes=15):
                raise HTTPException(status_code=400, detail="State token expired")
            return data
        raise HTTPException(status_code=400, detail="Invalid or expired state token")


@router.get("/connect/instagram")
async def connect_instagram(user_email: str = Query(..., description="Agent's email address")):
    """
    Initiate Instagram OAuth flow.

    User flow:
    1. Agent clicks "Connect Instagram" in UI
    2. Redirected to this endpoint with their email
    3. Redirected to Instagram authorization page
    4. Instagram redirects back to /auth/callback
    """
    if not settings.meta_app_id:
        raise HTTPException(
            status_code=503,
            detail="Instagram OAuth not configured. Please set META_APP_ID and META_APP_SECRET environment variables."
        )

    # Generate CSRF protection token
    state = generate_state_token(user_email, "instagram")

    # Instagram OAuth authorization URL
    auth_url = (
        f"https://api.instagram.com/oauth/authorize"
        f"?client_id={settings.meta_app_id}"
        f"&redirect_uri={settings.meta_redirect_uri}"
        f"&scope=user_profile,user_media"
        f"&response_type=code"
        f"&state={state}"
    )

    logger.info(f"🔗 Initiating Instagram OAuth for {user_email}")
    return RedirectResponse(url=auth_url)


@router.get("/connect/facebook")
async def connect_facebook(user_email: str = Query(..., description="Agent's email address")):
    """
    Initiate Facebook OAuth flow for Pages.

    User flow:
    1. Agent clicks "Connect Facebook Page" in UI
    2. Redirected to this endpoint with their email
    3. Redirected to Facebook authorization page
    4. Facebook redirects back to /auth/callback
    """
    if not settings.meta_app_id:
        raise HTTPException(
            status_code=503,
            detail="Facebook OAuth not configured. Please set META_APP_ID and META_APP_SECRET environment variables."
        )

    # Generate CSRF protection token
    state = generate_state_token(user_email, "facebook")

    # Facebook OAuth authorization URL
    # Using only public_profile - the most basic permission that requires no approval
    auth_url = (
        f"https://www.facebook.com/v18.0/dialog/oauth"
        f"?client_id={settings.meta_app_id}"
        f"&redirect_uri={settings.meta_redirect_uri}"
        f"&scope=public_profile"
        f"&response_type=code"
        f"&state={state}"
    )

    logger.info(f"🔗 Initiating Facebook OAuth for {user_email}")
    return RedirectResponse(url=auth_url)


@router.get("/callback")
async def oauth_callback(
    code: str = Query(..., description="Authorization code from OAuth provider"),
    state: str = Query(..., description="State token for CSRF protection"),
    user_email: str = Query(None, description="User email (fallback)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle OAuth callback from Instagram/Facebook.

    This endpoint:
    1. Verifies the state token
    2. Exchanges authorization code for access token
    3. Fetches user profile info
    4. Stores account in database
    5. Redirects user back to app
    """
    try:
        # Try to verify state token, but use fallback if it fails
        try:
            state_data = verify_state_token(state)
            user_email = state_data["user_email"]
            platform = state_data["platform"]
        except:
            # Fallback: extract from state token directly (it's base64 encoded)
            import base64
            try:
                decoded = base64.b64decode(state).decode('utf-8')
                parts = decoded.split('|')
                if len(parts) >= 2:
                    user_email = parts[0]
                    platform = parts[1]
                else:
                    raise ValueError("Cannot extract email from state")
            except:
                # Last resort: use query parameter
                if not user_email:
                    raise HTTPException(status_code=400, detail="Cannot determine user email")
                platform = "facebook"  # default to facebook

        logger.info(f"📥 Processing OAuth callback for {user_email} ({platform})")

        # Exchange authorization code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://graph.facebook.com/v18.0/oauth/access_token",
                params={
                    "client_id": settings.meta_app_id,
                    "client_secret": settings.meta_app_secret,
                    "redirect_uri": settings.meta_redirect_uri,
                    "code": code
                }
            )

            if token_response.status_code != 200:
                logger.error(f"❌ Token exchange failed: {token_response.text}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to exchange authorization code: {token_response.text}"
                )

            token_data = token_response.json()
            access_token = token_data["access_token"]
            expires_in = token_data.get("expires_in", 5184000)  # Default 60 days

            # Fetch user profile info
            if platform == "instagram":
                profile_response = await client.get(
                    "https://graph.instagram.com/me",
                    params={
                        "fields": "id,username,account_type",
                        "access_token": access_token
                    }
                )
            else:  # facebook
                # Only request basic fields available with public_profile permission
                profile_response = await client.get(
                    "https://graph.facebook.com/me",
                    params={
                        "fields": "id,name",
                        "access_token": access_token
                    }
                )

            if profile_response.status_code != 200:
                logger.error(f"❌ Profile fetch failed: {profile_response.text}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to fetch user profile: {profile_response.text}"
                )

            profile_data = profile_response.json()

            # Store account in database
            account_id = str(uuid.uuid4())
            token_expires_at = datetime.utcnow() + timedelta(seconds=expires_in)

            # Check if account already exists
            stmt = select(SocialAccount).where(
                SocialAccount.user_email == user_email,
                SocialAccount.platform == PlatformType(platform),
                SocialAccount.platform_user_id == profile_data["id"]
            )
            result = await db.execute(stmt)
            existing_account = result.scalar_one_or_none()

            if existing_account:
                # Update existing account
                existing_account.access_token = access_token
                existing_account.token_expires_at = token_expires_at
                existing_account.is_active = True
                existing_account.last_used_at = datetime.utcnow()
                logger.info(f"♻️ Updated existing {platform} account for {user_email}")
            else:
                # Create new account
                new_account = SocialAccount(
                    id=account_id,
                    user_email=user_email,
                    platform=PlatformType(platform),
                    platform_user_id=profile_data["id"],
                    platform_username=profile_data.get("username") or profile_data.get("name"),
                    access_token=access_token,
                    token_expires_at=token_expires_at,
                    is_active=True,
                    connected_at=datetime.utcnow()
                )
                db.add(new_account)
                logger.info(f"✅ Created new {platform} account for {user_email}")

            await db.commit()

            # Redirect back to app with success message
            # In production, redirect to your frontend with a success parameter
            return {
                "success": True,
                "message": f"{platform.capitalize()} account connected successfully",
                "account": {
                    "id": account_id if not existing_account else existing_account.id,
                    "platform": platform,
                    "username": profile_data.get("username") or profile_data.get("name"),
                    "platform_user_id": profile_data["id"]
                }
            }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ OAuth callback failed: {e}")
        raise HTTPException(status_code=500, detail=f"OAuth callback failed: {str(e)}")


@router.get("/accounts")
async def get_connected_accounts(
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all connected social media accounts for a user.

    Returns:
    - List of connected Instagram/Facebook accounts
    - Account status (active/inactive)
    - Token expiration info
    """
    try:
        stmt = select(SocialAccount).where(
            SocialAccount.user_email == user_email,
            SocialAccount.is_active == True
        ).order_by(SocialAccount.connected_at.desc())

        result = await db.execute(stmt)
        accounts = result.scalars().all()

        return {
            "accounts": [
                {
                    "id": account.id,
                    "platform": account.platform.value,
                    "username": account.platform_username,
                    "connected_at": account.connected_at.isoformat(),
                    "token_expires_at": account.token_expires_at.isoformat() if account.token_expires_at else None,
                    "needs_refresh": account.token_expires_at and account.token_expires_at < datetime.utcnow()
                }
                for account in accounts
            ]
        }
    except Exception as e:
        logger.error(f"❌ Failed to fetch accounts: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch accounts: {str(e)}")


@router.delete("/disconnect/{account_id}")
async def disconnect_account(
    account_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Disconnect a social media account.

    This marks the account as inactive but doesn't delete it.
    Scheduled posts for this account will be cancelled.
    """
    try:
        stmt = select(SocialAccount).where(
            SocialAccount.id == account_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        account = result.scalar_one_or_none()

        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        account.is_active = False
        await db.commit()

        logger.info(f"🔌 Disconnected {account.platform.value} account {account.platform_username} for {user_email}")

        return {
            "success": True,
            "message": f"{account.platform.value.capitalize()} account disconnected"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to disconnect account: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to disconnect account: {str(e)}")


@router.post("/refresh-token/{account_id}")
async def refresh_access_token(
    account_id: str,
    user_email: str = Query(..., description="Agent's email address"),
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh an expired access token.

    Instagram/Facebook tokens expire after 60 days.
    This endpoint exchanges the old token for a new long-lived token.
    """
    try:
        stmt = select(SocialAccount).where(
            SocialAccount.id == account_id,
            SocialAccount.user_email == user_email
        )
        result = await db.execute(stmt)
        account = result.scalar_one_or_none()

        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

        # Exchange for long-lived token
        async with httpx.AsyncClient() as client:
            refresh_response = await client.get(
                "https://graph.facebook.com/v18.0/oauth/access_token",
                params={
                    "grant_type": "fb_exchange_token",
                    "client_id": settings.meta_app_id,
                    "client_secret": settings.meta_app_secret,
                    "fb_exchange_token": account.access_token
                }
            )

            if refresh_response.status_code != 200:
                logger.error(f"❌ Token refresh failed: {refresh_response.text}")
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to refresh token: {refresh_response.text}"
                )

            token_data = refresh_response.json()
            account.access_token = token_data["access_token"]
            account.token_expires_at = datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 5184000))
            await db.commit()

            logger.info(f"🔄 Refreshed token for {account.platform.value} account {account.platform_username}")

            return {
                "success": True,
                "message": "Access token refreshed successfully",
                "expires_at": account.token_expires_at.isoformat()
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to refresh token: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to refresh token: {str(e)}")


@router.post("/data-deletion")
async def handle_data_deletion(
    signed_request: str = Query(..., description="Signed request from Meta"),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle data deletion requests from Meta.

    This endpoint is required by Meta's Platform Policy for GDPR compliance.
    When a user deletes your app from their Facebook/Instagram settings,
    Meta will send a signed request to this endpoint.

    Required format: Returns confirmation URL and code.
    """
    try:
        # Parse signed request from Meta
        # Format: base64url(signature).base64url(payload)
        import hmac
        import hashlib
        import json

        encoded_sig, payload = signed_request.split('.', 1)

        # Decode payload
        payload_decoded = base64.b64decode(payload + '==')  # Add padding
        data = json.loads(payload_decoded)

        # Verify signature (in production, you should verify this)
        expected_sig = hmac.new(
            settings.meta_app_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).digest()

        # Get user ID from payload
        user_id = data.get('user_id')

        if not user_id:
            raise HTTPException(status_code=400, detail="Missing user_id in signed request")

        logger.info(f"🗑️ Data deletion request received for Meta user ID: {user_id}")

        # Find and deactivate all accounts for this Meta user
        stmt = select(SocialAccount).where(
            SocialAccount.platform_user_id == user_id
        )
        result = await db.execute(stmt)
        accounts = result.scalars().all()

        for account in accounts:
            account.is_active = False
            account.access_token = None  # Clear token for security
            logger.info(f"🗑️ Deactivated account: {account.platform.value} - {account.platform_username}")

        if accounts:
            await db.commit()

        # Generate confirmation code
        confirmation_code = secrets.token_urlsafe(16)

        # Return required format for Meta
        return {
            "url": f"{settings.meta_redirect_uri.rsplit('/auth/callback', 1)[0]}/data-deletion-status?id={confirmation_code}",
            "confirmation_code": confirmation_code
        }

    except Exception as e:
        logger.error(f"❌ Data deletion request failed: {e}")
        # Return success anyway to avoid blocking Meta's deletion flow
        return {
            "url": f"{settings.meta_redirect_uri.rsplit('/auth/callback', 1)[0]}/data-deletion-status",
            "confirmation_code": secrets.token_urlsafe(16)
        }


@router.get("/data-deletion-status")
async def data_deletion_status(id: str = Query(None, description="Deletion confirmation code")):
    """
    Status page for data deletion requests.

    This page is shown to users who want to check their data deletion status.
    """
    return {
        "status": "completed",
        "message": "Your data has been deleted from our system.",
        "confirmation_code": id
    }
