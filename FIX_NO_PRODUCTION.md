# Fix "No Production Deployment" on Vercel

## Issue: Vercel shows "No production deployment" or preview only

## Solution Steps:

### Step 1: Check Current Branch

```bash
git branch
```

Should show `* main` or `* master`

If not on main:
```bash
git checkout main
```

### Step 2: Make Sure Code is Pushed

```bash
git status
git log --oneline -1
```

Check that latest commit is on GitHub:
- Go to https://github.com/YOUR_USERNAME/nexora
- Verify files are there

### Step 3: Set Production Branch in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Git**
4. Under **Production Branch**, set to `main`
5. Click **Save**

### Step 4: Trigger Production Deploy

**Method 1: Push a Change**
```bash
# Make a small change
echo "# Nexora" > DEPLOY.txt
git add .
git commit -m "Trigger production deploy"
git push origin main
```

**Method 2: Redeploy from Vercel**
1. Go to **Deployments** tab
2. Find latest deployment
3. Click **"..."** menu
4. Click **"Promote to Production"**

**Method 3: Manual Deploy**
1. Go to Vercel Dashboard
2. Click project
3. Click **"Deployments"** tab
4. Click **"Redeploy"** on any deployment
5. Check **"Use existing Build Cache"** (optional)
6. Click **"Redeploy"**

### Step 5: Verify Environment Variables

Go to **Settings** → **Environment Variables**

Make sure these are set for **Production**:
```
DATABASE_URL = file:/tmp/nexora.db
DATABASE_AUTH_TOKEN = (empty or leave blank)
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
AUTH_SECRET = your-secret-here
```

### Step 6: Check Deployment Status

1. Go to **Deployments** tab
2. Look for deployment with **"Production"** badge
3. Click on it to see logs

### Step 7: Force Production Deploy

```bash
# Create an empty commit
git commit --allow-empty -m "Force production deploy"
git push origin main
```

This triggers a new production deployment.

### Common Causes:

#### 1. Preview Branch Instead of Production
**Fix:** Push to `main` branch, not `dev` or feature branches

#### 2. Build Failed
**Fix:** Check build logs, fix errors, redeploy

#### 3. No Auto-Deploy
**Fix:** 
- Go to Settings → Git
- Enable "Automatically deploy all branches"
- Or enable "Production Branch" only

#### 4. Wrong Branch
**Fix:**
```bash
git checkout main
git push origin main
```

### Quick Test: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

This bypasses GitHub and deploys directly.

### Still Not Working?

#### Check Build Logs
1. Deployments tab
2. Click on deployment
3. Check "Building" section for errors

#### Check Function Logs
1. After deployment
2. Check "Functions" logs
3. Look for runtime errors

#### Verify Git Integration
1. Settings → Git
2. Check if GitHub is connected
3. Disconnect and reconnect if needed

### Manual Production Setup

If auto-deploy isn't working:

1. **Settings** → **Git**
2. **Production Branch**: `main`
3. **Deploy Hooks**: Copy webhook URL
4. GitHub repo → Settings → Webhooks → Add webhook
5. Paste Vercel webhook URL
6. Content type: `application/json`
7. Events: `Just the push event`
8. Save

Now every push to `main` triggers production deploy.

---

## Expected Result

After following these steps, you should see:

✅ Green checkmark on deployment
✅ "Production" badge next to deployment
✅ Live URL: `https://your-app.vercel.app`
✅ Works when you visit URL

## Quick Command Sequence

```bash
# Make sure you're on main
git checkout main

# Create empty commit to trigger deploy
git commit --allow-empty -m "Deploy to production"

# Push
git push origin main

# Check Vercel dashboard in 2 minutes
```

---

**The deployment should appear in 2-3 minutes with "Production" badge!** ✅
