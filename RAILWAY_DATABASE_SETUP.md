# Railway Database Setup Guide

This guide walks you through setting up PostgreSQL on Railway for Phase 1 auto-posting functionality.

## Step 1: Add PostgreSQL to Railway Project

1. Go to your Railway dashboard: https://railway.app/dashboard
2. Select your `property-listing-generator-V10` project
3. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
4. Railway will automatically create a PostgreSQL database and provision it

## Step 2: Get Database Connection String

1. Click on the PostgreSQL service in Railway
2. Go to **"Variables"** tab
3. Copy the `DATABASE_URL` variable value
   - It will look like: `postgresql://user:pass@host.railway.app:5432/railway`

## Step 3: Update Application Environment Variables

1. Go back to your **main application service** (not the database)
2. Go to **"Variables"** tab
3. Add the following variable:
   ```
   DATABASE_URL=postgresql+asyncpg://user:pass@host.railway.app:5432/railway
   ```
   **IMPORTANT**: Add `+asyncpg` after `postgresql` (Railway gives you `postgresql://`, but we need `postgresql+asyncpg://`)

4. Optionally add these for development:
   ```
   DB_ECHO=false
   DB_USE_NULL_POOL=true
   ```

## Step 4: Initialize Database Tables

Once deployed, you need to create the tables. You have two options:

### Option A: Via Railway CLI (Recommended)

```bash
# Install Railway CLI if you haven't
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run python init_db.py
```

### Option B: Via Python shell in Railway

1. In Railway, go to your app service
2. Click **"Deployments"** tab
3. Click on the latest deployment
4. Click **"View Logs"**
5. In another tab, go to Railway dashboard and run a one-off command:
   ```
   python init_db.py
   ```

You should see output like:
```
✅ Database connection successful
✅ Database tables created successfully
Tables created:
  - social_accounts
  - scheduled_posts
```

## Step 5: Verify Database Setup

Check that tables were created:

1. In Railway, click on the PostgreSQL service
2. Click **"Data"** tab
3. You should see two tables:
   - `social_accounts`
   - `scheduled_posts`

## Database Schema

### `social_accounts` table
Stores connected Instagram/Facebook accounts for each agent.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique account ID |
| user_email | VARCHAR | Agent's email address |
| platform | ENUM | 'instagram' or 'facebook' |
| platform_user_id | VARCHAR | Platform's user ID |
| platform_username | VARCHAR | Display name |
| access_token | TEXT | Encrypted OAuth token |
| token_expires_at | TIMESTAMP | Token expiration |
| is_active | BOOLEAN | Account status |
| connected_at | TIMESTAMP | When account was connected |

### `scheduled_posts` table
Stores all scheduled social media posts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Unique post ID |
| account_id | UUID (FK) | References social_accounts |
| caption | TEXT | Post caption |
| image_url | TEXT | Image URL or base64 |
| scheduled_time | TIMESTAMP | When to publish |
| status | ENUM | draft/scheduled/publishing/published/failed |
| platform_post_id | VARCHAR | ID from Meta API after publishing |
| likes_count | INTEGER | Engagement metrics |
| comments_count | INTEGER | Engagement metrics |
| retry_count | INTEGER | Failed publish retry count |
| last_error | TEXT | Error message if failed |
| created_at | TIMESTAMP | When post was created |

## Troubleshooting

### Error: "could not connect to server"
- Check that `DATABASE_URL` is set correctly in your app's environment variables
- Make sure you added `+asyncpg` to the connection string
- Verify PostgreSQL service is running in Railway

### Error: "no module named asyncpg"
- Make sure `requirements.txt` includes `asyncpg==0.29.0`
- Redeploy your application

### Error: "relation does not exist"
- Tables haven't been created yet
- Run `python init_db.py` via Railway CLI or one-off command

## Next Steps

Once database is set up:
1. ✅ Database setup complete
2. ⏭️ Create Meta Developer App (for OAuth)
3. ⏭️ Implement OAuth endpoints
4. ⏭️ Build auto-posting scheduler

---

**Need help?** Check Railway logs or reach out in the team Slack!
