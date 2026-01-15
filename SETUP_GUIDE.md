# Phase 1 Auto-Posting Setup Guide

## Complete Setup Instructions for Instagram/Facebook Auto-Posting

---

## Overview

This guide will walk you through setting up Instagram and Facebook auto-posting for your Property Listing Generator application. Follow each step carefully.

**What You'll Accomplish:**
- Create a Meta Developer App
- Connect your Railway app to Meta's API
- Enable Instagram and Facebook posting capabilities
- Configure automatic post scheduling

**Time Required:** 30-45 minutes

---

## Prerequisites

Before you begin, make sure you have:
- ✅ Railway account with deployed app
- ✅ PostgreSQL database setup on Railway (already done)
- ✅ Facebook account (for Meta Developer access)
- ✅ Your Railway app URL: `https://property-listing-generator-v10-production.up.railway.app`

---

## Part 1: Create Meta Developer Account

### Step 1.1: Visit Meta for Developers

1. Go to: **https://developers.facebook.com/**
2. Click **"Get Started"** in the top right corner
3. If you don't have a developer account:
   - Click **"Create Account"**
   - Accept Meta's Developer Terms
   - Verify your email if prompted

### Step 1.2: Verify Your Account

Meta may require additional verification steps:
- Phone number verification
- Business verification (optional for development)
- Two-factor authentication setup (recommended)

---

## Part 2: Create Your App

### Step 2.1: Create New App

1. Go to: **https://developers.facebook.com/apps**
2. Click the green **"Create App"** button
3. Choose use case: **"Other"** → Click **"Next"**
4. Select app type: **"Business"** → Click **"Next"**

### Step 2.2: Fill in App Details

| Field | Value |
|-------|-------|
| **App Name** | `Doorstep Property Listings` |
| **App Contact Email** | Your email address |
| **Business Account** | Create one if needed (optional) |

5. Click **"Create App"**
6. You may need to enter your Facebook password to confirm

### Step 2.3: Get Your App Credentials

**IMPORTANT:** You'll need these credentials later!

1. In your app dashboard, go to **Settings** → **Basic** (left sidebar)
2. Find and copy these values:

```
App ID: [Copy this number - looks like: 1234567890123456]
App Secret: [Click "Show", then copy - looks like: abcdef1234567890...]
```

**⚠️ SECURITY WARNING:**
- Keep these credentials private
- Never commit them to GitHub
- Never share them publicly

---

## Part 3: Add Instagram Basic Display

### Step 3.1: Add the Product

1. In your app dashboard, scroll to **"Add Products to Your App"**
2. Find **"Instagram Basic Display"**
3. Click **"Set Up"**

### Step 3.2: Configure Instagram Settings

1. Go to **Products** → **Instagram Basic Display** → **Basic Display** (left sidebar)
2. Scroll down and click **"Create New App"**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Display Name** | `Doorstep Property Listings` |
| **Valid OAuth Redirect URIs** | `https://property-listing-generator-v10-production.up.railway.app/auth/callback` |
| **Deauthorize Callback URL** | `https://property-listing-generator-v10-production.up.railway.app/auth/instagram/deauthorize` |
| **Data Deletion Request URL** | `https://property-listing-generator-v10-production.up.railway.app/auth/instagram/data-deletion` |

4. Click **"Save Changes"**

---

## Part 4: Add Facebook Login

### Step 4.1: Add the Product

1. In **"Add Products to Your App"**, find **"Facebook Login"**
2. Click **"Set Up"**
3. Select platform: **"Web"**
4. Enter Site URL: `https://property-listing-generator-v10-production.up.railway.app`
5. Click **"Save"** and **"Continue"**

### Step 4.2: Configure OAuth Settings

1. Go to **Products** → **Facebook Login** → **Settings** (left sidebar)
2. Find **"Valid OAuth Redirect URIs"**
3. Add this URL:
```
https://property-listing-generator-v10-production.up.railway.app/auth/callback
```
4. Click **"Save Changes"**

---

## Part 5: Request Permissions

Your app needs special permissions to post content. Here's how to request them:

### Step 5.1: Go to App Review

1. Click **"App Review"** in the left sidebar
2. Click **"Permissions and Features"** tab

### Step 5.2: Request Instagram Permissions

Search for and request these permissions:

| Permission | Purpose | Status |
|------------|---------|--------|
| `instagram_basic` | View Instagram account info | Click "Request" |
| `instagram_content_publish` | Publish posts to Instagram | Click "Request" |

### Step 5.3: Request Facebook Permissions

Search for and request these permissions:

| Permission | Purpose | Status |
|------------|---------|--------|
| `pages_show_list` | Show list of Pages | Click "Request" |
| `pages_read_engagement` | Read Page content | Click "Request" |
| `pages_manage_posts` | Create and manage posts | Click "Request" |

### Step 5.4: Provide Permission Details

For each permission, you'll need to provide:

**Detailed Description (example):**
```
Our app allows real estate agents to schedule and automatically publish
property listings to their Instagram and Facebook accounts. We need these
permissions to post property images and descriptions on behalf of the agent
at their scheduled times. This saves agents time and ensures consistent
social media presence for their property marketing.
```

**Screen Recording:**
- Meta requires a video demonstration
- Show: Login → Connect Account → Schedule a Post → Post Published
- Tools: Use Loom (loom.com) or OBS Studio (free)
- Keep it under 5 minutes

---

## Part 6: Add to Railway

Now connect your Meta app to Railway:

### Step 6.1: Go to Railway Dashboard

1. Visit: **https://railway.app/dashboard**
2. Click on your **property-listing-generator-V10** project
3. Click on your app service (not the database)
4. Click the **"Variables"** tab

### Step 6.2: Add Environment Variables

Click **"+ New Variable"** and add these three variables:

| Variable Name | Value |
|---------------|-------|
| `META_APP_ID` | [Paste your App ID from Step 2.3] |
| `META_APP_SECRET` | [Paste your App Secret from Step 2.3] |
| `META_REDIRECT_URI` | `https://property-listing-generator-v10-production.up.railway.app/auth/callback` |

### Step 6.3: Deploy Changes

1. After adding all variables, Railway will automatically redeploy
2. Wait 2-3 minutes for deployment to complete
3. Check the **"Deployments"** tab to see status

---

## Part 7: Test Your Setup (Development Mode)

While waiting for Meta's permission approval, you can test with your own accounts:

### Step 7.1: Add Test Users

1. In Meta Developer dashboard, go to **"Roles"** → **"Roles"**
2. Under **"Administrators"** or **"Developers"**, add yourself
3. This allows you to test the OAuth flow immediately

### Step 7.2: Test OAuth Connection

1. Visit your API docs: `https://property-listing-generator-v10-production.up.railway.app/docs`
2. Find the **`/auth/connect/instagram`** endpoint
3. Click **"Try it out"**
4. Enter your email in `user_email` parameter
5. Click **"Execute"**
6. You should be redirected to Instagram login

### Step 7.3: Verify Connection

After connecting, check:
```
GET /auth/accounts?user_email=your@email.com
```

You should see your connected account in the response.

---

## Part 8: Submit for App Review (Production)

To allow ANY user (not just you) to connect their accounts:

### Step 8.1: Prepare Submission

Before submitting, ensure you have:
- ✅ Screen recording demonstrating each permission's use
- ✅ Detailed description of your app's purpose
- ✅ Test credentials (Meta will create test account)
- ✅ App works in development mode

### Step 8.2: Submit Review Request

1. Go to **"App Review"** → **"Requests"**
2. For each pending permission, click **"Request"**
3. Upload your screen recording
4. Fill in all required fields
5. Click **"Submit"**

### Step 8.3: Review Timeline

- **Review time:** 3-7 business days typically
- **Email notifications:** Meta will email you with updates
- **Revisions:** If rejected, you can resubmit with fixes

---

## Part 9: Understanding App Modes

### Development Mode (Current)
- ✅ Works immediately after setup
- ⚠️ Only you and test users can connect
- ⚠️ Limited to people added in "Roles"
- Perfect for testing before launch

### Live Mode (After Approval)
- ✅ Any user can connect their account
- ✅ Full production functionality
- ✅ No restrictions on who can use it
- Requires completed App Review

---

## Important Limits & Restrictions

Be aware of these Meta API limits:

### Instagram Rate Limits
- **API calls:** 200 calls per hour per user
- **Posts per day:** 25 posts per day (includes Stories)
- **Token expiry:** 60 days (auto-refresh handled)

### Facebook Rate Limits
- **API calls:** 200 calls per hour per user
- **Posts per day:** No hard limit (avoid spam patterns)
- **Token expiry:** 60 days (auto-refresh handled)

### Content Restrictions
- No prohibited content (see Meta policies)
- No spam or misleading content
- Follow community guidelines
- Property listings are generally safe

---

## Troubleshooting Common Issues

### "Invalid OAuth Redirect URI"
**Problem:** URL doesn't match exactly
**Solution:**
- Ensure URL in Meta app matches Railway URL exactly
- No trailing slash: ❌ `.../callback/`  ✅ `.../callback`
- Must be HTTPS, not HTTP

### "App Not Setup"
**Problem:** Missing required products
**Solution:**
- Verify Instagram Basic Display is added
- Verify Facebook Login is added
- Check all settings are saved

### "User Not Authorized"
**Problem:** User not added to app roles
**Solution:**
- Add user as Administrator or Developer in "Roles"
- Or add as Test User in "Roles" → "Test Users"

### "Token Expired"
**Problem:** Access token expired (after 60 days)
**Solution:**
- App handles this automatically
- User will be prompted to reconnect
- Or call: `POST /auth/refresh-token/{account_id}`

---

## Testing Checklist

Before going live, test these scenarios:

- [ ] OAuth flow completes successfully
- [ ] Account appears in connected accounts list
- [ ] Can create a scheduled post
- [ ] Can view list of scheduled posts
- [ ] Can update a scheduled post
- [ ] Can cancel a scheduled post
- [ ] Background scheduler runs (check logs)
- [ ] Post publishes at scheduled time
- [ ] Failed post shows in "failed" status
- [ ] Can retry a failed post
- [ ] Can disconnect an account

---

## Next Steps After Setup

Once your Meta app is configured and approved:

1. **Build Frontend UI:**
   - OAuth connection buttons
   - Post scheduling form
   - Calendar view of scheduled posts
   - Post status dashboard

2. **Add Features:**
   - Post templates for property types
   - Bulk scheduling
   - Analytics tracking
   - Multi-platform posting (same post to Instagram + Facebook)

3. **Monitor Usage:**
   - Check Railway logs for scheduler activity
   - Monitor failed posts
   - Track API rate limits

---

## Support & Resources

### Official Documentation
- Meta for Developers: https://developers.facebook.com/docs
- Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api
- Facebook Login: https://developers.facebook.com/docs/facebook-login
- Graph API: https://developers.facebook.com/docs/graph-api

### Your App URLs
- Railway Dashboard: https://railway.app/dashboard
- API Documentation: https://property-listing-generator-v10-production.up.railway.app/docs
- Meta Developer Console: https://developers.facebook.com/apps

### Getting Help
- Check Railway deployment logs for errors
- Review Meta's permission review feedback
- Test in development mode first
- Contact Meta Developer Support for platform issues

---

## Quick Reference: Environment Variables

Copy this for your notes:

```bash
# Meta OAuth Credentials
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_REDIRECT_URI=https://property-listing-generator-v10-production.up.railway.app/auth/callback

# Database (already configured)
DATABASE_URL=postgresql+asyncpg://[your-railway-db-url]

# Scheduler Settings (optional overrides)
SCHEDULER_ENABLED=true
SCHEDULER_CHECK_INTERVAL_SECONDS=60
```

---

## Glossary

**OAuth:** Secure authorization protocol that lets users connect accounts without sharing passwords

**Access Token:** Temporary credential that allows your app to post on user's behalf

**Webhook:** Callback URL that Meta uses to send notifications about events

**Graph API:** Meta's main API for interacting with Instagram and Facebook

**App Review:** Meta's approval process for apps requesting advanced permissions

**Development Mode:** Testing mode where only specified users can use the app

**Live Mode:** Production mode where any user can connect and use the app

---

**End of Setup Guide**

*Need help? Check the troubleshooting section or review the official Meta documentation.*
