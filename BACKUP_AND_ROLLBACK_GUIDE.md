# BACKUP AND ROLLBACK GUIDE

## Quick Rollback (When Everything is Fucked)

If a feature breaks everything and you need to go back to the last working state:

```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

# Option 1: Restore all files to last commit
git restore .

# Option 2: Go back to a specific checkpoint (see list below)
git restore --source=CHECKPOINT_NAME .

# Option 3: Nuclear option - reset to clean V10
git restore --source=origin/main .
```

After restoring, **ALWAYS hard refresh browser**: `Ctrl + Shift + R`

---

## Workflow: Save Checkpoints After Successful Features

### STEP 1: After You Test a Feature and IT WORKS

```bash
cd "C:\Users\billm\Desktop\Listing agent\property-listing-generator-V10"

# Add all changed files
git add .

# Commit with descriptive message
git commit -m "✅ WORKING: [brief description of feature]"

# Example:
git commit -m "✅ WORKING: Claude enrichment for postcode autofill"
```

### STEP 2: Tag Major Stable Versions

When you have a REALLY stable version with multiple working features:

```bash
# Create a tagged checkpoint
git tag -a stable-2024-10-24 -m "Stable version with enrichment + autofill working"

# Push to GitHub (saves remotely)
git push origin main --tags
```

---

## View Your Checkpoints

### See all commits (recent first)

```bash
git log --oneline -20
```

Output example:
```
a1b2c3d ✅ WORKING: Claude enrichment for postcode autofill
e4f5g6h ✅ WORKING: Increased timeout to 180s
i7j8k9l ✅ WORKING: Fixed V3 editor redirect
```

### See all tagged stable versions

```bash
git tag -l
```

---

## Rollback to Specific Checkpoint

### Method 1: Restore to a specific commit (by hash)

```bash
# Find the commit hash from git log
git log --oneline -20

# Restore to that commit (example hash: a1b2c3d)
git restore --source=a1b2c3d .
```

### Method 2: Restore to a tagged version

```bash
# See available tags
git tag -l

# Restore to tagged version
git restore --source=stable-2024-10-24 .
```

### Method 3: Go back N commits

```bash
# Go back 1 commit
git restore --source=HEAD~1 .

# Go back 3 commits
git restore --source=HEAD~3 .
```

---

## My Workflow Moving Forward

### Before Starting Any New Feature:

```bash
# Make sure current state is committed
git add .
git commit -m "✅ WORKING: [describe current working state]"
```

### After Completing a Feature:

1. **Test it thoroughly**
2. If it works:
   ```bash
   git add .
   git commit -m "✅ WORKING: [feature description]"
   ```
3. If it breaks everything:
   ```bash
   git restore .
   ```

### Daily End-of-Session:

```bash
# Commit everything working
git add .
git commit -m "✅ EOD checkpoint - all features working"

# Push to GitHub for remote backup
git push origin main
```

---

## Emergency Recovery Commands

### When Claude breaks something:

```bash
# Discard ALL changes since last commit
git restore .

# Hard refresh browser
# Press Ctrl + Shift + R
```

### When you want to see what changed:

```bash
# See what files are modified
git status

# See actual code changes
git diff
```

### When you want to keep SOME changes but not all:

```bash
# Restore specific file
git restore path/to/file.py

# Example:
git restore frontend/app_v2.js
```

---

## Current Status

**Clean V10 Base**: Restored from `origin/main`
**Next Step**: Test current system, then create first checkpoint

Run this when ready:
```bash
git add .
git commit -m "✅ CHECKPOINT: Clean V10 baseline - all features working"
git tag -a baseline-v10 -m "Clean working V10 from GitHub"
git push origin main --tags
```

---

## Pro Tips

1. **Commit often** - After every successful feature test
2. **Use descriptive messages** - "✅ WORKING: [what works]" or "❌ BROKEN: [what broke]"
3. **Tag stable versions** - When everything works together nicely
4. **Push to GitHub daily** - Protects against disk failure
5. **Never commit .env with real API keys** - Already in .gitignore

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Save current state | `git add . && git commit -m "✅ WORKING: description"` |
| Undo everything since last commit | `git restore .` |
| Go back to clean V10 | `git restore --source=origin/main .` |
| See recent checkpoints | `git log --oneline -20` |
| Create stable tag | `git tag -a stable-YYYY-MM-DD -m "description"` |
| Push to GitHub | `git push origin main --tags` |
| Hard refresh browser | `Ctrl + Shift + R` |

