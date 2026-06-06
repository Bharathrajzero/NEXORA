# Vercel Deployment Guide

## Your Project Structure (Correct ✅)

```
d:\Nexora/  ← Root directory
├── app/
├── components/
├── lib/
├── public/
├── package.json
├── next.config.mjs
└── vercel.json
```

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/nexora.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository `nexora`

### 3. Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as root, don't change)

**Build Settings:**
- Build Command: `npm run build` (auto)
- Output Directory: `.next` (auto)
- Install Command: `npm install` (auto)

### 4. Add Environment Variables

Click **"Environment Variables"** and add:

```
DATABASE_URL = file:/tmp/nexora.db
DATABASE_AUTH_TOKEN = (leave empty)
NEXT_PUBLIC_APP_URL = https://your-project-name.vercel.app
AUTH_SECRET = (run: openssl rand -hex 32 and paste result)
```

**To generate AUTH_SECRET:**
```bash
openssl rand -hex 32
```

### 5. Deploy

Click **"Deploy"**

Wait 2-3 minutes for build to complete.

### 6. Test Deployment

Visit these URLs:
- `https://your-project-name.vercel.app/` → Redirects to dashboard
- `https://your-project-name.vercel.app/dashboard` → Dashboard page
- `https://your-project-name.vercel.app/auth` → Download page

### 7. Update NEXT_PUBLIC_APP_URL

After first deployment:
1. Copy your Vercel URL (e.g., `https://nexora-abc123.vercel.app`)
2. Go to Settings → Environment Variables
3. Edit `NEXT_PUBLIC_APP_URL` to match your actual URL
4. Redeploy

## If You Get 404 Error

### Check 1: Environment Variables
Make sure all 4 variables are set:
- DATABASE_URL
- DATABASE_AUTH_TOKEN (can be empty)
- NEXT_PUBLIC_APP_URL
- AUTH_SECRET

### Check 2: Build Logs
- Go to Deployments tab
- Click on the deployment
- Check "Build Logs" for errors

### Check 3: Function Logs
- Check "Function Logs" for runtime errors
- Look for database connection errors

### Quick Fix
Set `DATABASE_URL=file:/tmp/nexora.db` (SQLite in temp storage)

## Root Directory is CORRECT

Your project structure is perfect for Vercel:
- ✅ `package.json` in root
- ✅ `app/` directory in root
- ✅ `next.config.mjs` in root

**Do NOT change Root Directory setting in Vercel!**

Leave it as `./` (root)

## Common Mistakes

❌ Setting Root Directory to `app/` - WRONG
✅ Setting Root Directory to `./` - CORRECT

❌ Missing environment variables
✅ All 4 env vars added

❌ Wrong build command
✅ Use `npm run build` (default)

## Production Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] Root Directory = `./` (default)
- [ ] Environment variables added (4 total)
- [ ] Build successful
- [ ] `/dashboard` loads
- [ ] `/auth` loads
- [ ] Can create drops
- [ ] QR codes work

## After Successful Deploy

Update README with your live URL:
```bash
# Add to README.md
Live Demo: https://your-project-name.vercel.app
```

Commit and push:
```bash
git add README.md
git commit -m "Add live demo URL"
git push
```

Vercel will auto-deploy updates! 🚀

---

**Your root directory is correct. Just deploy!**
