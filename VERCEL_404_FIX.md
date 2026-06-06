# Fix Vercel 404 Error

## Issue: Vercel shows 404 after deployment

## Solutions:

### 1. Check Build Status
Go to Vercel Dashboard → Your Project → Deployments

**If build failed:**
- Check build logs for errors
- Make sure all environment variables are set

### 2. Verify Environment Variables
Go to: Settings → Environment Variables

**Required variables:**
```
DATABASE_URL = libsql://nexora-yourname.turso.io (or file:/tmp/nexora.db)
DATABASE_AUTH_TOKEN = your-turso-token (leave empty if using local file)
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
AUTH_SECRET = your-random-secret
```

### 3. Check Output Directory
Your `vercel.json` should have:
```json
{
  "outputDirectory": ".next"
}
```

### 4. Force Redeploy
```bash
# Make a small change
git commit --allow-empty -m "Trigger redeploy"
git push
```

### 5. Check Routes
After deployment, test these URLs:
- `https://your-app.vercel.app/` → Should redirect to `/dashboard`
- `https://your-app.vercel.app/dashboard` → Should show dashboard
- `https://your-app.vercel.app/auth` → Should show download page

### 6. Common Fixes

**Problem: Root URL shows 404**
**Solution:** Check that `app/page.tsx` exists and has redirect:
```typescript
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/dashboard");
}
```

**Problem: All pages show 404**
**Solution:** 
1. Delete `.next` folder locally
2. Run `npm run build`
3. Commit and push

**Problem: API routes return 404**
**Solution:** Check that all API routes have `route.ts` files

### 7. Local Test Before Deploy

```bash
# Build production
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

If it works locally but not on Vercel, the issue is environment-specific.

### 8. Minimal Vercel Config

Remove complex configs from `vercel.json`:

```json
{
  "framework": "nextjs"
}
```

Let Vercel auto-detect everything.

### 9. Check Node Version

Make sure Vercel uses Node 20+:

Add to `package.json`:
```json
"engines": {
  "node": ">=20.11.0"
}
```

### 10. Database Migration

If pages load but crash:
```bash
# Run migrations on Turso
export DATABASE_URL="libsql://nexora-yourname.turso.io"
export DATABASE_AUTH_TOKEN="your-token"
npm run db:migrate
```

## Quick Fix: Redeploy from Scratch

1. Go to Vercel Dashboard
2. Delete the project
3. Re-import from GitHub
4. Set environment variables
5. Deploy

## Still Not Working?

**Use dev mode to see errors:**

Go to Vercel Dashboard → Settings → Functions
- Set "Node.js Version" to 20.x
- Check "Function Logs" for errors

---

## Most Common Cause:

**Missing DATABASE_URL causes crashes**

**Quick fix:**
Set `DATABASE_URL=file:/tmp/nexora.db` in Vercel (temporary solution)

This uses local SQLite (data lost on redeploy, but app will work).

Later switch to Turso for persistence.
