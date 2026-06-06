# Turso Database Setup - Updated Guide

## Option 1: Web UI (Easiest - No CLI Needed) ⭐

### Step 1: Sign Up
1. Go to https://turso.tech
2. Click "Sign Up" / "Get Started"
3. Sign in with GitHub

### Step 2: Create Database
1. Click "Create Database"
2. Name: `nexora`
3. Location: Choose closest to you
4. Click "Create"

### Step 3: Get Credentials
1. Click on your `nexora` database
2. Copy **Database URL** (looks like: `libsql://nexora-yourname.turso.io`)
3. Click "Create Token" → Copy the token

### Step 4: Add to Vercel
Go to: Vercel → Your Project → Settings → Environment Variables

Add these 4 variables:
```
DATABASE_URL = libsql://nexora-yourname.turso.io
DATABASE_AUTH_TOKEN = eyJhbGc... (your token)
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
AUTH_SECRET = (run: openssl rand -hex 32)
```

### Step 5: Update Local .env
```env
DATABASE_URL=libsql://nexora-yourname.turso.io
DATABASE_AUTH_TOKEN=eyJhbGc...your-token
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your-random-secret
```

### Step 6: Test Locally
```bash
npm run db:migrate
npm run dev
```

### Step 7: Deploy to Vercel
```bash
git add .
git commit -m "Add Turso database"
git push
```

---

## Option 2: CLI Installation (Alternative)

### Windows (Using Scoop)
```powershell
# Install Scoop first (if not installed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Turso
scoop install turso
```

### Windows (Manual Download)
1. Go to https://github.com/tursodatabase/turso-cli/releases
2. Download `turso-windows-amd64.exe`
3. Rename to `turso.exe`
4. Move to `C:\Windows\System32\`
5. Open new PowerShell and run: `turso auth login`

### macOS
```bash
brew install tursodatabase/tap/turso
```

### Linux
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

---

## Using CLI After Installation

```bash
# Login
turso auth login

# Create database
turso db create nexora

# Get URL
turso db show nexora --url

# Create token
turso db tokens create nexora

# Run migrations
npm run db:migrate

# Check database
turso db shell nexora
```

---

## Quick Check: Is Turso Working?

After setup, test the connection:

```bash
npm run dev
```

Then go to http://localhost:3000 and:
1. Click "New drop"
2. Upload a file
3. If it works → Turso is connected! ✅

---

## Alternative: Use Neon (Postgres)

If Turso doesn't work, use **Neon** (even easier):

1. Go to https://neon.tech
2. Sign up (free)
3. Create project: `nexora`
4. Copy connection string
5. Add to Vercel env vars:
   ```
   DATABASE_URL=postgresql://user:pass@host.neon.tech/nexora?sslmode=require
   ```

6. Install Postgres driver:
   ```bash
   npm install @neondatabase/serverless
   ```

7. Update `lib/db/index.ts`:
   ```typescript
   import { drizzle } from 'drizzle-orm/neon-serverless';
   import { neon } from '@neondatabase/serverless';
   
   const sql = neon(process.env.DATABASE_URL!);
   export const db = drizzle(sql);
   ```

---

## Recommended: Use Web UI

**Just use the Turso Web UI** - it's the easiest:
1. https://turso.tech → Sign up
2. Create database
3. Copy URL + Token
4. Add to Vercel
5. Deploy!

No CLI needed! ✅
