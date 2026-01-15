# Meta Developer App Setup Guide

This guide walks you through creating a Meta (Facebook) Developer App for Instagram and Facebook posting.

## Prerequisites

- A Facebook account
- Your Railway app URL: `https://property-listing-generator-v10-production.up.railway.app`

## Step 1: Create Meta Developer Account

1. Go to https://developers.facebook.com/
2. Click **"Get Started"** in the top right
3. If you don't have a developer account:
   - Click **"Create Account"**
   - Accept the terms
   - Verify your email if needed

## Step 2: Create a New App

1. Go to https://developers.facebook.com/apps
2. Click **"Create App"**
3. Select use case: **"Other"** → Click **"Next"**
4. Select app type: **"Business"** → Click **"Next"**
5. Fill in app details:
   - **App Name**: `Doorstep Property Listings` (or your preferred name)
   - **App Contact Email**: Your email
   - **Business Account**: Create one if you don't have it (optional for development)
6. Click **"Create App"**

## Step 3: Add Instagram Basic Display

1. In your app dashboard, scroll down to **"Add Products"**
2. Find **"Instagram Basic Display"** → Click **"Set Up"**
3. This allows users to connect their Instagram accounts

## Step 4: Add Facebook Login

1. In **"Add Products"**, find **"Facebook Login"** → Click **"Set Up"**
2. Select **"Web"** as the platform
3. Enter your site URL: `https://property-listing-generator-v10-production.up.railway.app`

## Step 5: Configure OAuth Settings

### Facebook Login Settings:

1. Go to **"Facebook Login"** → **"Settings"** in the left sidebar
2. Add **Valid OAuth Redirect URIs**:
   ```
   https://property-listing-generator-v10-production.up.railway.app/auth/facebook/callback
   ```
3. Click **"Save Changes"**

### Instagram Basic Display Settings:

1. Go to **"Instagram Basic Display"** → **"Basic Display"** in the left sidebar
2. Click **"Create New App"**
3. Fill in:
   - **Display Name**: `Doorstep Property Listings`
   - **Valid OAuth Redirect URIs**:
     ```
     https://property-listing-generator-v10-production.up.railway.app/auth/instagram/callback
     ```
   - **Deauthorize Callback URL**:
     ```
     https://property-listing-generator-v10-production.up.railway.app/auth/instagram/deauthorize
     ```
   - **Data Deletion Request URL**:
     ```
     https://property-listing-generator-v10-production.up.railway.app/auth/instagram/data-deletion
     ```
4. Click **"Save Changes"**

## Step 6: Get App Credentials

1. Go to **"Settings"** → **"Basic"** in the left sidebar
2. You'll see:
   - **App ID**: Copy this (e.g., `1234567890123456`)
   - **App Secret**: Click **"Show"** and copy this (e.g., `abcdef1234567890...`)

**IMPORTANT**: Keep these credentials secure! Never commit them to git.

## Step 7: Add Environment Variables to Railway

1. Go to your Railway dashboard
2. Click on your **property-listing-generator-V10** service
3. Go to **"Variables"** tab
4. Add these variables:

```bash
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_REDIRECT_URI=https://property-listing-generator-v10-production.up.railway.app/auth/callback
```

5. Click **"Deploy"** to restart with new environment variables

## Step 8: Add App Permissions

### For Instagram Content Publishing:

1. Go to **"App Review"** → **"Permissions and Features"**
2. Request these permissions:
   - `instagram_basic` - View Instagram account info
   - `instagram_content_publish` - Publish posts to Instagram
   - `pages_read_engagement` - Read Page content
   - `pages_manage_posts` - Manage Page posts

### For Facebook Page Publishing:

1. In **"App Review"**, also request:
   - `pages_show_list` - Show list of Pages
   - `pages_manage_metadata` - Manage Page settings
   - `pages_read_user_content` - Read user-generated content on Pages

## Step 9: Submit for App Review (Required for Production)

**Development Mode vs Live Mode:**
- **Development Mode**: Only works with test users and app administrators
- **Live Mode**: Works with any Facebook/Instagram user (requires App Review approval)

### To submit for review:

1. Go to **"App Review"** → **"Requests"**
2. For each permission, click **"Request"**
3. Provide:
   - **Detailed Description**: Explain how your app uses each permission
     ```
     Our app allows real estate agents to schedule and auto-publish property
     listings to their Instagram and Facebook accounts. We need these permissions
     to post images and captions on behalf of the agent at scheduled times.
     ```
   - **Screen Recording**: Record a video showing the OAuth flow and posting workflow
   - **Test User Credentials**: Provide a test account (Meta will create one for you)

4. Submit and wait for approval (typically 3-7 days)

## Step 10: Test with Your Account (Development Mode)

While waiting for approval, you can test with your own account:

1. Go to **"Roles"** → **"Roles"** in the left sidebar
2. Add yourself as an **Administrator** or **Developer**
3. Your account can now connect and test the OAuth flow

## Step 11: Verify Setup

Once environment variables are added to Railway:

1. Visit: `https://property-listing-generator-v10-production.up.railway.app/docs`
2. You should see the OAuth endpoints in the API documentation
3. Try the OAuth flow:
   - Visit: `https://property-listing-generator-v10-production.up.railway.app/auth/connect/instagram`
   - You should be redirected to Instagram/Facebook login

## Important Notes

### Rate Limits:
- Instagram: 25 API calls per hour per user
- Facebook: 200 API calls per hour per user

### Content Publishing Limits:
- Instagram: 25 posts per day per account (including Stories)
- Facebook: No hard limit, but excessive posting may be flagged as spam

### Token Expiration:
- Instagram tokens: 60 days (must be refreshed)
- Facebook tokens: 60 days (must be refreshed)
- Our app will handle automatic token refresh

## Troubleshooting

### "Invalid OAuth Redirect URI" Error:
- Make sure the redirect URI in Meta app settings exactly matches your Railway URL
- Check for trailing slashes (should not have one)
- Ensure HTTPS (not HTTP)

### "App Not Setup" Error:
- Make sure you've added both Instagram Basic Display and Facebook Login products
- Check that all required fields are filled in the app settings

### "User Not Authorized" Error:
- Add yourself as a test user in **"Roles"** → **"Test Users"**
- Or add yourself as an Administrator

## Next Steps

After completing this setup:
1. ✅ Meta app created and configured
2. ✅ Environment variables added to Railway
3. ⏭️ Test OAuth flow with your account
4. ⏭️ Submit for App Review (for production use)
5. ⏭️ Build the scheduling interface

---

**Need Help?** Check Meta's documentation:
- Instagram Basic Display: https://developers.facebook.com/docs/instagram-basic-display-api
- Facebook Login: https://developers.facebook.com/docs/facebook-login
- Graph API: https://developers.facebook.com/docs/graph-api
