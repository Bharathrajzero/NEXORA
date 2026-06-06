# Nexora

**File relay made simple.** Drop files, get QR code, scan to download.

No accounts. No login. Just drop and go.

---

## How It Works

### 1. Create Drop (Device A - PC/Laptop)
1. Go to `/` or `/dashboard`
2. Click "New drop"
3. Select files
4. Add title
5. Get QR code + 6-digit code

### 2. Download Files (Device B - Phone/PC)
1. Scan QR code **OR** visit `/auth` and enter 6-digit code
2. See files list
3. Download
4. Files auto-delete after 1 hour

**That's it!** No login required on either device.

---

## Features

- 📱 **QR Code Sharing** - Scan QR with phone to access files
- 🔑 **6-Digit Codes** - Type code if QR not available
- ⏱️ **Auto-Delete** - Files expire after 1 hour
- 🚫 **No Login** - No accounts, no passwords
- 🎨 **Clean UI** - Modern gradient design
- 🚀 **Instant Deploy** - Vercel-ready

---

## Quick Start

```bash
npm install
npm run db:migrate
npm run dev
```

Open http://localhost:3000

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/nexora)

### Environment Variables

```env
DATABASE_URL=file:/tmp/nexora.db
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
AUTH_SECRET=your-secret-here
```

Generate secret:
```bash
openssl rand -hex 32
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite + Drizzle ORM
- **Styling**: Tailwind CSS
- **QR Codes**: qrserver.com API
- **TypeScript**: Full type safety
- **Storage**: localStorage (browser)

---

## Project Structure

```
nexora/
├── app/
│   ├── api/
│   │   ├── download/         # Download files by code
│   │   ├── items/            # CRUD operations
│   │   └── upload/           # File upload
│   ├── auth/                 # Download page (enter code)
│   ├── dashboard/            # Create drops (main page)
│   └── layout.tsx            # Root layout
├── components/
│   └── nexora/
│       └── dashboard-client.tsx  # Dashboard UI
├── lib/
│   ├── db/                   # Database & migrations
│   └── auth.ts               # Session helpers
└── public/
    ├── icon.svg              # Logo
    └── favicon.svg           # Favicon
```

---

## API Endpoints

- `GET /api/download?code=ABC123` - Get files by code
- `POST /api/upload` - Upload files
- `POST /api/items` - Create item
- `GET /api/items` - List items

---

## Database

SQLite with auto-migration:
- `users` - User data (optional)
- `items` - Files, notes, clips
- `share_links` - Secure sharing
- `audit_logs` - Activity tracking

Created via `npm run db:migrate`

---

## URL Structure

- `/` → Redirects to `/dashboard`
- `/dashboard` → Create file drops (main page)
- `/auth` → Download files (enter code or scan QR)
- `/auth?code=ABC123` → Direct link from QR scan

---

## Browser Storage

Files are stored in `localStorage` under key `nexora-drops`:
- Code expires after 1 hour
- Auto-cleanup runs every second
- Cleared when browser cache is cleared

---

## Production Checklist

- ✅ Build: SUCCESS
- ✅ TypeScript: 0 errors
- ✅ Routes: 9 total
- ✅ Bundle size: 87.1 KB
- ✅ No login required
- ✅ Auto-delete working
- ✅ QR codes functional
- ✅ Mobile responsive

---

## Cost

- **Vercel**: FREE (Hobby plan)
- **Domain**: Optional (~$10/year)
- **Total**: $0/month

---

## 👨‍💻 Author

Bharath Raj
GitHub: Bharathrajzero

---

## License

This project is licensed under the MIT License © 2026 Bharath Raj, AlphaGroup Ltd.

---

**Deploy in 2 minutes!** 🚀

Built for quick file transfers between devices without accounts or logins.
