# WealthWise Invoice & Quote Studio

A self-hosted Progressive Web App for creating, previewing, and exporting professional invoices and quotes for WealthWise Media.

## What it does

- Build invoices and quotes with your branded layout
- A4 preview that exports to PDF via the browser print dialog
- Persistent company settings and auto-incrementing invoice number (saved to your browser)
- Fully responsive — works on desktop and mobile
- Installable on your phone home screen as a PWA

---

## Prerequisites (one-time setup)

You need these installed on your machine:

1. **Node.js** (v18 or newer) — https://nodejs.org
2. **Git** — https://git-scm.com
3. A **GitHub account** — https://github.com
4. A **Vercel account** (free tier is fine) — https://vercel.com (sign up with GitHub for one-click connection)

---

## Step 1: Run it locally first (5 min)

Make sure it works on your machine before deploying.

Open a terminal in this project folder and run:

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). You should see the editor.

When done testing, hit `Ctrl+C` to stop the dev server.

---

## Step 2: Push to GitHub (5 min)

In the same terminal:

```bash
git init
git add .
git commit -m "Initial commit"
```

Then go to https://github.com/new, create a new **private** repo called `wealthwise-invoice` (don't add a README — leave it empty), and follow the "push an existing repository" instructions GitHub shows you. Roughly:

```bash
git remote add origin https://github.com/YOUR_USERNAME/wealthwise-invoice.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel (3 min)

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Pick the `wealthwise-invoice` repo you just pushed
4. Vercel auto-detects Vite — leave all defaults as-is
5. Click **Deploy**

About 60 seconds later you'll get a live URL like `wealthwise-invoice-xxx.vercel.app`. That's your app.

---

## Step 4: Add a custom subdomain (optional but recommended — 10 min)

Cleaner-looking URL for clients and yourself.

In Vercel:

1. Open your project → **Settings** → **Domains**
2. Type `invoice.wealthwisemedia.co.za`
3. Vercel shows you a CNAME record to add

In GoDaddy (your domain registrar):

1. Go to **DNS Management** for `wealthwisemedia.co.za`
2. Add a new **CNAME** record:
   - Type: `CNAME`
   - Name: `invoice`
   - Value: `cname.vercel-dns.com.` (Vercel will give you the exact value)
   - TTL: 1 hour
3. Save

Wait 5–30 minutes for DNS to propagate. Then `https://invoice.wealthwisemedia.co.za` will work and Vercel will auto-issue an SSL certificate.

---

## Step 5: Install on your phone (1 min)

### iPhone (Safari)

1. Open the URL in Safari (must be Safari, not Chrome on iOS)
2. Tap the **Share** button (square with up arrow)
3. Scroll down, tap **Add to Home Screen**
4. Tap **Add**

You'll get a WealthWise icon on your home screen. Tap it — it opens fullscreen, no browser bar, like a native app.

### Android (Chrome)

1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap **Install app** (or **Add to Home Screen**)
4. Confirm

Same result — icon on home screen, fullscreen launch.

---

## Updating the app later

Edit any file, then:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel auto-deploys within 60 seconds. Your installed PWA on your phone updates automatically next time you open it.

---

## Troubleshooting

**Build fails on Vercel** — Check the build logs. Most common issue is a missing dependency. Run `npm install` locally and `git push` again.

**App doesn't install on iPhone** — Must use Safari, not Chrome. Apple restricts PWA install to Safari only on iOS.

**Saved company info is wrong** — Open the app, go to ⚙ Settings, fix the field, hit Save. The app uses your phone's localStorage so each device has its own settings.

**Print/Export PDF cuts off** — Make sure print settings: A4 paper, no margins, "Save as PDF". On mobile Safari the print dialog has a "Show Details" option for these.

---

## Files in this project

```
wealthwise-invoice/
├── public/                    PWA icons + favicon
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-512-maskable.png
│   ├── apple-touch-icon.png
│   └── favicon.ico
├── src/
│   ├── InvoiceStudio.jsx     The main app component (1300+ lines)
│   └── main.jsx              React entry point
├── index.html                HTML shell with PWA meta tags
├── vite.config.js            Vite + PWA plugin config
├── vercel.json               Vercel deployment config
├── package.json              Dependencies
└── README.md                 This file
```

---

## Cost

**Zero**, on the free tiers of:

- Vercel (free for personal/hobby projects with generous limits)
- GitHub (free for unlimited private repos)

GoDaddy domain renewal is the only ongoing cost, and you already pay that.

---

Built for WealthWise Media | Marco McKenzie & Quinton Viljoen
