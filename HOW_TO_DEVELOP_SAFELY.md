# HOW TO DEVELOP SAFELY
# Property Listing Generator - Idiot-Proof Workflow

## THE GOLDEN RULES (NEVER BREAK THESE!)

1. **NEVER work directly on `main` branch**
2. **NEVER commit without testing first**
3. **ALWAYS create a feature branch**
4. **ALWAYS test on Railway before merging**
5. **IF UNSURE, don't commit - ask first**

---

## DIRECTORY STRUCTURE (Keep It Clean!)

```
C:\Users\billm\Desktop\
├── Listing agent\
│   └── property-listing-generator-V10\  <-- WORK HERE ONLY
└── property-listing-STABLE-v1.11.0\     <-- EMERGENCY BACKUP (READ-ONLY!)
```

**RULE**: Only work in `property-listing-generator-V10`. NEVER modify the STABLE backup.

---

## SAFE WORKFLOW (Follow Every Time!)

### STEP 1: Create a Feature Branch

```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

# Create branch with descriptive name
git checkout -b feature/add-new-feature

# Or for bug fixes:
git checkout -b bugfix/fix-something-broken
```

**Branch naming**:
- `feature/description` - new features
- `bugfix/description` - bug fixes
- `refactor/description` - code improvements

### STEP 2: Make Your Changes

Edit files in VS Code or your editor. Test locally:

```bash
# Start local server
python -m uvicorn backend.main:app --reload

# Test at http://localhost:8000/static/index.html
```

### STEP 3: Commit to Feature Branch

```bash
# See what changed
git status
git diff

# Add files
git add frontend/file-you-changed.js
git add backend/file-you-changed.py

# Commit with clear message
git commit -m "Add feature X that does Y

- Changed file A to do B
- Fixed issue with C
"
```

### STEP 4: Push to GitHub

```bash
# Push your branch
git push origin feature/add-new-feature
```

### STEP 5: Test on Railway

Railway automatically deploys your branch to a test URL.

1. Go to Railway dashboard: https://railway.app
2. Find your branch deployment
3. Open the test URL (e.g., `feature-add-new-feature-abc123.up.railway.app`)
4. **TEST THOROUGHLY** - upload photos, generate brochures, check everything

### STEP 6: Merge if Tests Pass

**IF RAILWAY TESTS PASS:**

```bash
# Switch to main
git checkout main

# Merge your feature
git merge feature/add-new-feature

# Push to main
git push origin main

# Delete feature branch (cleanup)
git branch -d feature/add-new-feature
git push origin --delete feature/add-new-feature
```

**IF RAILWAY TESTS FAIL:**

```bash
# Stay on feature branch
git checkout feature/add-new-feature

# Fix the issue
# ... make changes ...

# Commit fix
git add .
git commit -m "Fix issue X"

# Push again
git push origin feature/add-new-feature

# Railway auto-deploys - test again
```

---

## EMERGENCY ROLLBACK (If Main Breaks)

### Option 1: Rollback to Last Tag (30 seconds)

```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

# See all tags
git tag -l

# Rollback to last working version
git checkout v1.11.0-vision-attributes-fixed

# If you want to stay there
git checkout -b hotfix-rollback
git push origin hotfix-rollback --force
```

### Option 2: Copy from Stable Backup (2 minutes)

```bash
# Kill the broken server first (Ctrl+C)

# Backup the broken version
cd "C:\Users\billm\Desktop\Listing agent"
move property-listing-generator-V10 property-listing-generator-V10-BROKEN

# Copy stable version
xcopy /E /I "C:\Users\billm\Desktop\property-listing-STABLE-v1.11.0" "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

# Start server
cd property-listing-generator-V10
python -m uvicorn backend.main:app --reload
```

Done. You're back to working state.

---

## COMMON MISTAKES & HOW TO AVOID THEM

### Mistake 1: "I forgot to create a branch"

**If you already made changes on main:**

```bash
# Stash your changes
git stash

# Create feature branch
git checkout -b feature/my-changes

# Apply changes to feature branch
git stash pop

# Now commit normally
git add .
git commit -m "My changes"
```

### Mistake 2: "I need to test something quickly"

**DON'T modify STABLE backup!** Instead:

```bash
# Create a test branch
git checkout -b test/quick-experiment

# Make changes
# ... edit files ...

# If it works, commit and merge
# If it doesn't work, just delete the branch
git checkout main
git branch -D test/quick-experiment
```

### Mistake 3: "I pushed broken code to main"

```bash
# Revert last commit
git revert HEAD

# Or force rollback (nuclear option)
git reset --hard v1.11.0-vision-attributes-fixed
git push origin main --force
```

---

## API KEY SAFETY

### Local Development

```bash
# Copy example
cp .env.example .env

# Edit with your key
# ANTHROPIC_API_KEY=YOUR_ANTHROPIC_API_KEY_HERE

# NEVER commit .env
# (It's in .gitignore automatically)
```

### Railway Deployment

1. Go to Railway dashboard
2. Click your service → "Variables" tab
3. Add variables manually:
   - `ANTHROPIC_API_KEY` = `YOUR_ANTHROPIC_API_KEY_HERE`
   - `VISION_PROVIDER` = `claude`
   - etc.

**NEVER put API keys in code files!**

---

## WHEN TO CREATE A NEW STABLE BACKUP

After major milestones:
- ✅ New feature works perfectly on Railway and local
- ✅ All tests pass
- ✅ You've used it for a few days with no issues

```bash
cd "C:\Users\billm\Desktop"

# Tag the version
cd "Listing agent\property-listing-generator-V10"
git tag -a v1.12.0-feature-name -m "Description"
git push origin v1.12.0-feature-name

# Create frozen backup
xcopy /E /I "Listing agent\property-listing-generator-V10" "property-listing-STABLE-v1.12.0"

# Archive old backup
move property-listing-STABLE-v1.11.0 "C:\Archive\property-listing-STABLE-v1.11.0"
```

---

## TESTING CHECKLIST

Before merging to main, test:

- [ ] Form loads without errors
- [ ] Photos upload successfully
- [ ] Vision API processes photos
- [ ] Brochure generates with all pages
- [ ] Text is readable and makes sense
- [ ] Export to PDF works
- [ ] No console errors
- [ ] Server doesn't crash

---

## GETTING HELP

**Before asking:**
1. Check git status: `git status`
2. Check which branch: `git branch`
3. Check recent commits: `git log --oneline -5`

**When asking for help, provide:**
- What you were trying to do
- What command you ran
- What error you got
- Output of `git status`

---

## SUMMARY: The One-Page Cheat Sheet

```bash
# START NEW FEATURE
git checkout -b feature/my-feature

# MAKE CHANGES
# ... edit files ...

# COMMIT
git add .
git commit -m "Add feature X"

# PUSH & TEST ON RAILWAY
git push origin feature/my-feature
# Test on Railway URL

# MERGE IF TESTS PASS
git checkout main
git merge feature/my-feature
git push origin main

# IF BREAKS: ROLLBACK
git checkout v1.11.0-vision-attributes-fixed
```

**Remember**: Feature branches keep main safe. Railway testing catches bugs before production. Git tags let you rollback instantly.

**NO MORE 20-HOUR DISASTERS!**
