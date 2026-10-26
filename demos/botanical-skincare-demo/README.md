# AURA BOTANICA — Luxury Botanical Skincare & Clinical Apothecary NYC
**Archetype 03 Demo Website for High-Converting Cold Outreach**

A 100% consumer-facing, ultra-luxury botanical skincare e-commerce experience tailored for physical-product skincare brands, clinical wellness apothecaries, and clean beauty makers.

---

## 🌿 Consumer Storefront Design & Architecture
- **Visual Aesthetic**: Luminous Porcelain (`#F7F8F6`), Deep Forest Eucalyptus (`#1C3326`), Celadon Sage (`#E8EFEA`), and warm botanical gold accents (`#B89758`) paired with Playfair Display editorial serif typography.
- **Consumer Navigation**: Luxury full-width header with top carbon-neutral shipping announcement ticker, center wordmark, and direct links to *Formulations*, *Enzyme Melt*, *Bio-Retinoid*, *Ceramide Balm*, *Clinical Proof*, and *Skin Diagnostic*.
- **Interactive Texture & Viscosity Swatches**: On the hero and PDP, users can click between *Dewy Fluid* (daytime glass sheen), *Velvet Balm* (nocturnal lipid cushion), and *Lipid Nectar* to see live dermal absorption velocity and finish updates.
- **Dedicated PDP For Every Single Product**: All 6 formulations feature their own independent product detail page with distinct inanimate packshot images, unique clinical features, packaging selectors, and synergistic "Pairs Clinically With" navigation.
- **3-Step Daily Skin Routine Drawer**: Slide-over routine cart featuring an automatic 15% bundle discount when all 3 ritual steps (Cleanse, Treat, Hydrate) are selected.
- **12-Week Clinical Proof Timeline Scrubber**: Interactive study slider scrubbing across Weeks 00, 04, 08, and 12 with live Cutometer (+88% elasticity), Corneometer hydration, and TEWL barrier readings.
- **Virtual Skin Diagnostic Quiz**: 3-question consumer quiz generating custom routine recommendations.
- **Zero Browser Alerts**: Checkout triggers an official `#AURA-RX-XXXXX` bespoke order confirmation modal.
- **120 FPS Dropper Kinematics Lightbox**: Video player with automated animated micro-pipette dispersion fallback.

---

## 📁 Multi-Page Structure (Dedicated PDP for All 6 Formulations)
- `index.html`: Consumer storefront hero with interactive viscosity swatches, 3-step ritual showcase, and 3 targeted solution cards (all 6 products with distinct packshots).
- `catalog.html`: The 6-Product Botanical Dispensary with molecular category filtering and direct links to each product's dedicated PDP.
- `product-cleanser.html`: Dedicated PDP for **Squalane Botanical Enzyme Melt ($48 / 100ml)** featuring the Oil-to-Milk Emulsification State simulator.
- `product.html`: Dedicated PDP for **Cellular Renewal Bio-Retinoid ($68 / 30ml)** featuring the Interactive Viscosity Swatch simulator.
- `product-balm.html`: Dedicated PDP for **Ceramide NP Liposomal Velvet Balm ($74 / 50ml)** featuring the Dermal Occlusion Barrier mode simulator.
- `product-vitamin-c.html`: Dedicated PDP for **15% THD Ascorbate Vitamin C ($82 / 30ml)** featuring AM Photoprotection vs PM Collagen Repair mode switcher.
- `product-ectoin.html`: Dedicated PDP for **Ectoin Hydro-Microbiome Elixir ($58 / 50ml)** featuring the Urban Micro-Particulate Shield simulator.
- `product-eye-matrix.html`: Dedicated PDP for **Bio-Peptide Eye Matrix Concentrate ($62 / 15ml)** featuring the Periorbital Micro-Circulation Drainage mode switcher.
- `science.html`: 12-Week longitudinal clinical trial scrubber with comparative molecular pathway telemetry.
- `consultation.html`: Consumer-facing virtual skin diagnostic questionnaire with tailored formulation matching.
- `src/css/style.css`: Luxury botanical design tokens, swatches, and frosted drawer styles.
- `src/js/main.js`: 3-Step routine cart engine, viscosity switcher, clinical scrubber, and #AURA-RX modal.

---

## ⚡ Instant Local Preview
- Double-click `botanical-skincare-demo/index.html` to open directly in any browser. Zero npm dependencies or build commands required.

---

## 🚀 60-Second Free Cloudflare Pages Deployment
1. Log into your free [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
3. Drag and drop the `botanical-skincare-demo` folder.
4. Your live custom HTTPS URL is ready instantly (e.g. `https://aura-botanica-demo.pages.dev`).
