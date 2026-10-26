# KURA Coffee Roasters — Hyper-Premium Multi-Page Demo

A luxury, multi-page e-commerce and brand storytelling experience engineered for high-ticket cold outreach to specialty roasters, bakeries, and physical-product founders.

---

## 📁 Multi-Page Structure

This project is built with **zero external build friction**—pure HTML5, modern Tailwind CSS, and vanilla ES6 JavaScript. It runs instantly locally and deploys straight to **Cloudflare Pages** without needing complex compilation.

- **`index.html`** — Homepage featuring the dynamic motion hero, SCA scoring accolades, seasonal micro-lot collection, hyper-motion feature section, and Bushwick roastery dispatch banner.
- **`shop.html`** — Curated Single Origins catalog with real-time category filtering (Africa, Americas, Anaerobic Ferment) and quick-add to bag.
- **`product.html`** — Signature Reserve Product Detail Page (PDP) for *Ethiopia Guji Uraga Natural*, complete with multi-angle image switcher, grind selector, subscription toggle (Save 15%), and terroir specs.
- **`story.html`** — "Our Craft & Motion" documentary-style brand story with interactive video triggers showing terroir sourcing, Loring convection roasting, and nitrogen packaging.
- **`wholesale.html`** — B2B Roastery Partnership Portal with a dynamic inquiry form for cafes, restaurants, and boutique hotels.

---

## 🎥 Dropping in Your Ready Hyper-Motion Videos & Custom Images

### 1. Adding Your Video Files
Create a folder named `videos` inside this project:
```bash
artisan-roaster-demo/videos/
```
Drop your `.mp4` and `.webm` video files inside:
- `hero-loop.mp4` / `hero-loop.webm` (for background ambient loops)
- `roasting-reel.mp4` (for the full-screen motion lightbox)
- `extraction-clip.mp4`

In `index.html` (or `product.html`, `story.html`), simply update the `<video>` or `openVideoLightbox(...)` source:
```html
<button onclick="openVideoLightbox('./videos/your-video.mp4', '4K Hyper-Motion Product Reel')">
  Watch 4K Motion Reel
</button>
```

### 2. Adding Your Images
Place your high-res product photos or packaging renders in an `images/` directory:
```bash
artisan-roaster-demo/images/
```
Update the `src` attribute of any product card in `index.html` or `shop.html` to point to `./images/your-product.webp`.

---

## ⚡ How to Preview Locally

Because all paths are relative and self-contained, you have three instant options:

### Option A: Double-Click
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, or Safari.

### Option B: Built-in Python Server (Zero Install)
From this directory:
```bash
python -m http.server 3000
```
Then visit: `http://localhost:3000`

---

## ☁️ How to Deploy to Cloudflare Pages (100% Free)

### Method 1: Direct Drag & Drop (Fastest — 60 Seconds)
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → **Create Application** → **Pages** → **Upload Assets**.
3. Name your project (e.g., `kura-roasters` or `brooklyn-artisan-coffee`).
4. Drag and drop the `artisan-roaster-demo` folder into the upload box.
5. Click **Deploy Site**. Your live URL will be active immediately at `https://kura-roasters.pages.dev`!

### Method 2: Git Connected (Automatic Updates)
1. Push this directory to a GitHub repository.
2. In Cloudflare Pages, select **Connect to Git**.
3. Framework preset: **None** (Static HTML).
4. Build output directory: leave blank or `.`.
5. Every time you push a new video or tweak copy, Cloudflare automatically rebuilds and redeploys worldwide in seconds.

---

## 🎯 How to Pitch This Demo to Your Leads

When pitching the 100 leads from your list (e.g., Sey Coffee, Devoción, Variety Coffee):
1. Send a 15-second screen recording showing their brand aesthetic inside this multi-page demo.
2. Provide the live Cloudflare link: `https://kura-roasters.pages.dev` (or your custom subdomain).
3. Offer: *"I designed a live multi-page kinetic concept specifically for high-end roasters. Would you like me to drop your actual bags into a custom 3D motion prototype for you?"*
