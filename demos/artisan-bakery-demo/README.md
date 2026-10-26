# ATELIER LEVAIN — High-Fashion Parisian Bakery & Viennoiserie d'Auteur

A uniquely designed, light-themed editorial bakery website featuring interactive culinary mechanics, tailored specifically for artisan bakeries, viennoiseries, and patisseries.

---

## 🎨 Unique UI/UX Identity vs. Project 01 (Coffee Roastery)

| Feature | Project 01 (KURA Roastery) | Project 02 (ATELIER LEVAIN Bakery) |
| :--- | :--- | :--- |
| **Aesthetic Direction** | Dark roasted espresso luxury (`#0A0807` onyx & gold) | **Light Parisian High-Fashion Editorial** (`#FAF7F2` cream, terracotta `#C25B3E`, ink black) |
| **Typography** | Playfair Display & Plus Jakarta Sans | **Bodoni Moda, Space Mono & DM Sans** |
| **Navigation & Header** | Floating glassmorphism navbar | **Newspaper/Masthead style with live oven temp & batch ticker** |
| **Hero Layout** | Fullscreen ambient video hero | **Asymmetrical editorial layout with French Arch-framed media canvas** |
| **Commerce Paradigm** | Standard right-side slide-over cart drawer | **Interactive 4-Slot "Morning Tasting Box" Tray (slides up from bottom)** |
| **Sensory Interaction** | Video lightbox modal | **Interactive Web Audio Crust Crackle ASMR sound synthesis** |
| **Product Detail Page** | Standard e-commerce selectors | **Interactive Hotspot Pin Inspector (click pins to inspect alveoli, ear & ridges)** |
| **Story / Science Page** | Documentary video cards | **Interactive 68-Hour Fermentation Range Slider (scrub timeline 0h → 68h)** |
| **B2B / Catering Page** | Generic corporate form | **Restaurant Bread Allocation & Hospitality program calculator** |

---

## 📁 Multi-Page Structure

- **`index.html`** — Parisian editorial homepage with live hearth ticker, ASMR sound crackle simulator, marble counter items, and morning box launcher.
- **`menu.html`** — The Daily Bake Sheet brasserie menu with live counter availability and one-click box slot assignment.
- **`product.html`** — 68-Hour Country Miche Anatomy with 3 interactive hotspot pins, microscopic crumb dossier, and format selector.
- **`craft.html`** — Interactive 68-Hour Fermentation Dial where users scrub through the 4 stages of sourdough maturation.
- **`catering.html`** — Restaurant allocation portal with dawn bread route options.

---

## ⚡ How to Preview & Deploy

### 1. Instant Local Preview
Double-click `index.html` to open in any web browser, or run:
```powershell
cd "c:\Users\USER\Downloads\Finding Leads\artisan-bakery-demo"
python -m http.server 3001
```
Visit `http://localhost:3001`.

### 2. Free Cloudflare Pages Deployment
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) → **Compute (Workers & Pages)** → **Create Application** → **Pages** → **Upload Assets**.
2. Name the project `atelier-levain-bakery`.
3. Drag and drop the `artisan-bakery-demo` folder.
4. Live immediately at `https://atelier-levain-bakery.pages.dev`!
