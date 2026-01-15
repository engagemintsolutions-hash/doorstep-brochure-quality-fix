# Railway Deployment Setup Guide

Railway gives you a FREE test environment separate from your local machine. This prevents disasters by letting you test changes before they go live.

## Why Railway?

- **FREE** tier: 500 hours/month execution time + $5 credit
- **Auto-deployment**: Push to GitHub → Railway builds automatically
- **Test URLs**: Every branch gets its own URL for testing
- **Secure**: API keys stored in encrypted dashboard, not in code
- **Zero config**: Works with Python/FastAPI out of the box

---

## ONE-TIME SETUP (15 minutes)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway to access your repos

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `engagemintsolutions-hash/property-listing-generator-V10`
4. Click "Deploy Now"

Railway will automatically:
- Detect it's a Python project
- Install dependencies from requirements.txt
- Start the Uvicorn server
- Generate a public URL

### Step 3: Add Environment Variables

1. In Railway dashboard → Click your service
2. Go to "Variables" tab
3. Click "Raw Editor"
4. Paste this (with YOUR real API key):

```
ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE
VISION_PROVIDER=claude
ENRICHMENT_ENABLED=true
SHRINK_ENABLED=true
EDITOR_SHOW_HYGIENE=true
COMPLIANCE_REQUIRED_KEYWORDS=garden,parking,schools,epc,transport,bathroom,bedroom,kitchen
COMPLIANCE_STRICT_MODE=false
PDF_MAX_SIZE_MB=10
EXPORT_RETENTION_HOURS=24
LOG_LEVEL=INFO
```

5. Click "Update Variables"
6. Railway will auto-redeploy with your keys

### Step 4: Get Your Test URL

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Copy the URL (e.g., `property-listing-prod-abc123.up.railway.app`)

**Test it**: Open `https://your-url.up.railway.app/health`

You should see: `{"status": "healthy"}`

---

## DAILY WORKFLOW: Test Features Before Merging

### Example: Adding a New Feature

```bash
# 1. Create feature branch
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"
git checkout -b feature/add-export-button

# 2. Make your changes
# ... edit files ...

# 3. Commit
git add .
git commit -m "Add export button to brochure editor"

# 4. Push to GitHub
git push origin feature/add-export-button
```

### Railway Auto-Magic

Railway automatically:
1. Detects new branch
2. Creates deployment
3. Builds your code
4. Generates test URL

**Find your test URL:**
1. Railway dashboard → Deployments
2. Find your branch name
3. Click to see logs
4. URL shown in deployment info

### Testing on Railway

```
Your test URL: https://feature-add-export-button-xyz789.up.railway.app

Test checklist:
✅ Open /health - should return "healthy"
✅ Open /static/index.html - form loads
✅ Upload photos - no errors
✅ Generate brochure - works correctly
✅ New export button - appears and works
✅ Check browser console - no errors
```

### If Tests Pass → Merge to Main

```bash
git checkout main
git merge feature/add-export-button
git push origin main
```

Railway automatically deploys to your production URL.

### If Tests Fail → Fix Without Breaking Main

Main branch stays safe! Just:

```bash
# Stay on feature branch
git checkout feature/add-export-button

# Fix the issue
# ... edit files ...

# Commit fix
git add .
git commit -m "Fix export button bug"

# Push again
git push origin feature/add-export-button
```

Railway rebuilds your test URL. Test again.

---

## MONITORING & LOGS

### View Live Logs

1. Railway dashboard → Your service
2. Click "Deployments"
3. Select latest deployment
4. View real-time logs

Logs show:
- Server startup
- API requests
- Errors and warnings
- Vision API calls

### Common Issues

**Build fails:**
- Check requirements.txt has all dependencies
- Check logs for missing packages

**Server starts but crashes:**
- Check environment variables are set
- Look for missing API key errors in logs

**404 errors:**
- Check your test URL includes `/static/index.html`
- Production URL: `https://your-app.up.railway.app/static/index.html`

---

## COST MANAGEMENT (Stay Free!)

### Free Tier Limits

- **Execution time**: 500 hours/month
- **Credit**: $5/month
- **Pricing**: $0.000231/GB-hour RAM + $0.000463/vCPU-hour

**Your app costs ~$0.10/day** when running 24/7.

### Save Money Tips

1. **Delete old deployments**:
   - Railway → Deployments
   - Delete feature branch deployments after merging

2. **Sleep on idle** (paid plans only):
   - Free tier runs 24/7 by default
   - Upgrade to Hobby ($5/month) for sleep mode

3. **Monitor usage**:
   - Dashboard → Usage
   - Set up billing alerts

### If You Hit Limits

Railway pauses your service. Options:
1. Wait until next month (resets monthly)
2. Upgrade to Hobby plan ($5/month)
3. Delete old deployments to free resources

---

## SECURITY BEST PRACTICES

### ✅ DO THIS

- Store API keys in Railway Variables tab
- Use different keys for testing vs production (if possible)
- Check logs regularly for suspicious activity
- Enable 2FA on your GitHub account
- Keep `.env` in `.gitignore`

### ❌ NEVER DO THIS

- Commit API keys to git
- Share your Railway dashboard access
- Use production API keys for testing
- Leave test deployments running forever
- Ignore build errors

---

## TROUBLESHOOTING

### Problem: Build succeeds but app doesn't start

**Solution**: Check Procfile or railway.json

Railway looks for:
1. `railway.json` (we have this)
2. `Procfile` 
3. Auto-detects from package type

Our `railway.json` tells Railway:
```json
{
  "deploy": {
    "startCommand": "uvicorn backend.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

### Problem: "Module not found" error

**Solution**: Missing dependency in requirements.txt

```bash
# Add to requirements.txt
pip freeze | findstr package-name >> requirements.txt

# Commit and push
git add requirements.txt
git commit -m "Add missing dependency"
git push
```

### Problem: Can't access uploaded photos

**Solution**: Railway has ephemeral storage

Files uploaded to Railway are **temporary**. They disappear on redeployment.

For production, you'll need:
- AWS S3
- Cloudinary
- Railway Volumes (paid feature)

For now (testing), this is fine - just re-upload photos after each deploy.

### Problem: API key not working

**Checklist**:
1. Railway Variables tab - is key added?
2. Format: `ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE...` (no quotes)
3. After changing variables, redeploy
4. Check logs for "API key not found" errors

---

## NEXT STEPS

Now that Railway is set up:

1. **Test the workflow**:
   ```bash
   git checkout -b test/railway-demo
   # Make a small change (e.g., edit README)
   git add .
   git commit -m "Test Railway deployment"
   git push origin test/railway-demo
   ```

2. **Watch Railway build** your test branch

3. **Access test URL** and verify it works

4. **Delete the test branch**:
   ```bash
   git checkout main
   git branch -D test/railway-demo
   git push origin --delete test/railway-demo
   ```

5. **Read HOW_TO_DEVELOP_SAFELY.md** for the full workflow

---

## SUPPORT

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Our workflow**: See `HOW_TO_DEVELOP_SAFELY.md`

**Remember**: Railway is your safety net. Test everything there before merging to main!
