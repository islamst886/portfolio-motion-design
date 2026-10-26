// AURA BOTANICA — Luxury Botanical Skincare & Clinical Apothecary NYC

// ==========================================
// 0. AUTO-CACHE-BUSTING & MEDIA HOT-RELOADER
// ==========================================
window.getFreshMediaUrl = function(url, explicitTimestamp) {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  const base = url.split('?')[0];
  const t = explicitTimestamp || Date.now();
  const encoded = encodeURI(decodeURI(base));
  return `${encoded}?v=${t}`;
};

window.refreshAllPageMedia = function(showToast = false) {
  const timestamp = Date.now();
  let updatedCount = 0;

  document.querySelectorAll('video').forEach(video => {
    let changed = false;
    const directSrc = video.getAttribute('src');
    if (directSrc && (directSrc.includes('assets/') || directSrc.startsWith('./assets/'))) {
      const original = video.getAttribute('data-original-src') || directSrc;
      video.setAttribute('data-original-src', original.split('?')[0]);
      video.src = window.getFreshMediaUrl(original, timestamp);
      changed = true;
    }

    video.querySelectorAll('source').forEach(source => {
      const sourceSrc = source.getAttribute('src');
      if (sourceSrc && (sourceSrc.includes('assets/') || sourceSrc.startsWith('./assets/'))) {
        const original = source.getAttribute('data-original-src') || sourceSrc;
        source.setAttribute('data-original-src', original.split('?')[0]);
        source.src = window.getFreshMediaUrl(original, timestamp);
        changed = true;
      }
    });

    if (changed) {
      const wasPlaying = !video.paused;
      video.load();
      if (wasPlaying || video.hasAttribute('autoplay')) {
        video.play().catch(() => {});
      }
      updatedCount++;
    }
  });

  document.querySelectorAll('img').forEach(img => {
    const imgSrc = img.getAttribute('src');
    if (imgSrc && (imgSrc.includes('assets/') || imgSrc.startsWith('./assets/'))) {
      const original = img.getAttribute('data-original-src') || imgSrc;
      img.setAttribute('data-original-src', original.split('?')[0]);
      img.src = window.getFreshMediaUrl(original, timestamp);
      updatedCount++;
    }
  });

  if (showToast && typeof showCustomToast === 'function') {
    showCustomToast(`⚡ Auto-Synced ${updatedCount} media assets from disk!`);
  }
};

// Optional: media refresh can be triggered manually via window.refreshAllPageMedia(true)
// window.addEventListener('focus', () => window.refreshAllPageMedia(false));

function startBotanicalLiveWatcher() {
  if (location.protocol === 'file:') return;
  const watchedUrls = new Set();
  document.querySelectorAll('video source, video[src], img[src]').forEach(el => {
    const src = el.getAttribute('data-original-src') || el.getAttribute('src');
    if (src && (src.includes('assets/videos') || src.includes('assets/images'))) {
      watchedUrls.add(src.split('?')[0]);
    }
  });

  const urlHeaders = {};
  setInterval(async () => {
    for (const url of watchedUrls) {
      try {
        const pingUrl = url + (url.includes('?') ? '&' : '?') + '_sync=' + Date.now();
        const res = await fetch(pingUrl, { method: 'HEAD', cache: 'no-store' });
        if (res.ok) {
          const lastMod = res.headers.get('last-modified') || '';
          const length = res.headers.get('content-length') || '';
          const etag = res.headers.get('etag') || '';
          const sig = `${lastMod}__${length}__${etag}`;
          if (urlHeaders[url] && urlHeaders[url] !== sig) {
            urlHeaders[url] = sig;
            window.refreshAllPageMedia(false);
            if (typeof showCustomToast === 'function') {
              showCustomToast(`🔄 Updated file detected: ${decodeURI(url.split('/').pop())}`);
            }
          } else {
            urlHeaders[url] = sig;
          }
        }
      } catch (err) {}
    }
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  window.refreshAllPageMedia(false);
  startBotanicalLiveWatcher();
});

const ROUTINE_KEY = 'aura_botanica_routine';

let dailyRoutine = JSON.parse(localStorage.getItem(ROUTINE_KEY)) || [
  {
    id: 'bio-retinoid-serum',
    name: 'Cellular Renewal Bio-Retinoid',
    step: 'Step 02: Treat',
    volume: '30ml Opal Dropper',
    actives: '2.5% French Bakuchiol + 5% Niacinamide',
    price: 68.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
  }
];

function saveRoutine() {
  localStorage.setItem(ROUTINE_KEY, JSON.stringify(dailyRoutine));
  updateRoutineUI();
}

function updateRoutineUI() {
  const badgeCounts = document.querySelectorAll('.routine-badge-count');
  const itemsContainer = document.getElementById('routine-items-list');
  const subtotalEl = document.getElementById('routine-subtotal');
  const discountEl = document.getElementById('routine-discount-box');
  const totalEl = document.getElementById('routine-total');

  const totalQty = dailyRoutine.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = dailyRoutine.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 15% complete ritual savings if 3 or more steps
  const isCompleteRoutine = dailyRoutine.length >= 3;
  const discount = isCompleteRoutine ? subtotal * 0.15 : 0;
  const finalTotal = subtotal - discount;

  badgeCounts.forEach(b => {
    b.textContent = totalQty;
  });

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${finalTotal.toFixed(2)}`;

  if (discountEl) {
    if (isCompleteRoutine) {
      discountEl.innerHTML = `
        <div class="p-3 bg-[#E8EFEA] border border-[#1C3326]/20 rounded-xl text-xs font-mono text-[#1C3326] flex items-center justify-between">
          <span>✨ 3-Step Ritual Bundle (-15%):</span>
          <strong>-$${discount.toFixed(2)}</strong>
        </div>
      `;
    } else {
      const remaining = 3 - dailyRoutine.length;
      discountEl.innerHTML = `
        <div class="p-3 bg-white border border-[#E2E8E4] rounded-xl text-[11px] font-sans text-zinc-500">
          Add <strong class="text-[#1C3326] font-mono">${remaining} more step${remaining > 1 ? 's' : ''}</strong> (Cleanse, Treat, Hydrate) to unlock 15% bundle savings.
        </div>
      `;
    }
  }

  if (itemsContainer) {
    if (dailyRoutine.length === 0) {
      itemsContainer.innerHTML = `
        <div class="py-16 text-center text-zinc-400 font-sans text-xs">
          <p class="mb-3">Your daily skincare routine is empty.</p>
          <a href="./catalog.html" class="text-[#1C3326] font-bold uppercase underline tracking-wider font-mono">
            Discover Botanical Formulations →
          </a>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = dailyRoutine.map(item => `
        <div class="flex gap-4 py-4 border-b border-[#E2E8E4] items-center">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-xl bg-white border border-[#E2E8E4] flex-shrink-0" />
          <div class="flex-grow min-w-0">
            <span class="text-[10px] font-mono uppercase text-[#1C3326] font-bold block">${item.step || 'Targeted Treatment'}</span>
            <h4 class="text-xs font-semibold text-[#121E17] truncate mt-0.5">${item.name}</h4>
            <p class="text-[10px] text-zinc-500 font-mono mt-0.5">${item.actives || item.volume}</p>
            <div class="flex items-center justify-between mt-2.5">
              <div class="flex items-center border border-[#E2E8E4] rounded-full bg-white px-2.5 py-0.5 text-xs font-mono">
                <button onclick="decrementRoutineItem('${item.id}')" class="text-zinc-400 hover:text-black font-bold px-1">−</button>
                <span class="px-2 font-bold">${item.quantity}</span>
                <button onclick="incrementRoutineItem('${item.id}')" class="text-zinc-400 hover:text-black font-bold px-1">+</button>
              </div>
              <span class="text-xs font-mono font-bold text-[#1C3326]">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button onclick="removeRoutineItem('${item.id}')" class="text-zinc-400 hover:text-red-600 p-1 font-bold text-xs" title="Remove">✕</button>
        </div>
      `).join('');
    }
  }
}

window.addToRoutine = function(product) {
  const existing = dailyRoutine.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    dailyRoutine.push({
      id: product.id,
      name: product.name,
      step: product.step || 'Targeted Treatment',
      volume: product.volume || '30ml Dropper',
      actives: product.actives || 'Pharmaceutical Bio-Molecules',
      price: product.price,
      quantity: product.quantity || 1,
      image: product.image
    });
  }
  saveRoutine();
  openRoutineDrawer();
  showToast(`Added "${product.name}" to Daily Routine`);
};

window.incrementRoutineItem = function(id) {
  const item = dailyRoutine.find(i => i.id === id);
  if (item) {
    item.quantity++;
    saveRoutine();
  }
};

window.decrementRoutineItem = function(id) {
  const item = dailyRoutine.find(i => i.id === id);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      dailyRoutine = dailyRoutine.filter(i => i.id !== id);
    }
    saveRoutine();
  }
};

window.removeRoutineItem = function(id) {
  dailyRoutine = dailyRoutine.filter(i => i.id !== id);
  saveRoutine();
};

window.openRoutineDrawer = function() {
  const drawer = document.getElementById('routine-drawer');
  const backdrop = document.getElementById('routine-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  }
};

window.closeRoutineDrawer = function() {
  const drawer = document.getElementById('routine-drawer');
  const backdrop = document.getElementById('routine-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }
};

// ==========================================
// BESPOKE CLINICAL CHECKOUT MODAL (NO ALERT)
// ==========================================
window.triggerRoutineCheckout = function() {
  closeRoutineDrawer();
  const subtotal = dailyRoutine.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isCompleteRoutine = dailyRoutine.length >= 3;
  const discount = isCompleteRoutine ? subtotal * 0.15 : 0;
  const finalTotal = subtotal - discount;
  const rxCode = 'AURA-RX-' + Math.floor(10000 + Math.random() * 90000);

  let modal = document.getElementById('routine-order-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'routine-order-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border border-[#1C3326]/30 rounded-2xl p-8 shadow-2xl text-[#121E17] font-sans">
      <div class="flex items-center justify-between border-b border-[#E2E8E4] pb-4 mb-6">
        <div>
          <span class="text-[9px] font-mono text-[#1C3326] font-bold tracking-widest uppercase block">
            AURA BOTANICA LABS • SOHO ATELIER NYC
          </span>
          <h3 class="font-serif text-2xl font-bold mt-1 text-[#1C3326]">Custom Skin Regimen Confirmed</h3>
        </div>
        <span class="font-mono text-xs bg-[#E8EFEA] text-[#1C3326] px-3 py-1 rounded-full font-bold">#${rxCode}</span>
      </div>

      <div class="space-y-3 bg-[#F7F8F6] p-5 rounded-xl border border-[#E2E8E4] text-xs font-mono mb-6">
        <div class="flex justify-between text-zinc-500">
          <span>Formulation Facility:</span>
          <strong class="text-[#121E17]">SoHo Clean Room Atelier (NYC)</strong>
        </div>
        <div class="flex justify-between text-zinc-500">
          <span>Cold-Extraction Date:</span>
          <strong class="text-[#1C3326]">Compounded Within 48 Hours</strong>
        </div>
        <div class="flex justify-between text-zinc-500">
          <span>Carbon-Neutral Packaging:</span>
          <strong class="text-[#121E17]">100% Recycled Opal Glass</strong>
        </div>
        <div class="flex justify-between border-t border-[#E2E8E4] pt-3 text-sm font-bold">
          <span>Total Billed:</span>
          <span class="text-[#1C3326] font-mono text-base">$${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="p-4 bg-[#E8EFEA] rounded-xl text-xs text-zinc-700 mb-6 leading-relaxed">
        <strong class="text-[#1C3326] block mb-1">E-Commerce Architecture Note:</strong>
        This demo seamlessly connects to Shopify Plus, Recharge recurring auto-replenishment, or custom Stripe Billing with automated carbon-neutral shipping.
      </div>

      <button onclick="closeRoutineOrderModal()" class="w-full btn-botanical justify-center py-3.5 uppercase tracking-wider font-bold">
        Return To Storefront
      </button>
    </div>
  `;
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeRoutineOrderModal = function() {
  const modal = document.getElementById('routine-order-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

// ==========================================
// INTERACTIVE TEXTURE SWATCH SWITCHER
// ==========================================
window.switchViscosityTexture = function(type) {
  const dewBtn = document.getElementById('swatch-dew');
  const balmBtn = document.getElementById('swatch-balm');
  const oilBtn = document.getElementById('swatch-oil');

  const titleEl = document.getElementById('viscosity-title');
  const finishEl = document.getElementById('viscosity-finish');
  const absorbEl = document.getElementById('viscosity-absorb');
  const bestForEl = document.getElementById('viscosity-best');

  [dewBtn, balmBtn, oilBtn].forEach(b => {
    if (b) b.classList.remove('swatch-active', 'border-[#1C3326]');
  });

  if (type === 'dew') {
    if (dewBtn) dewBtn.classList.add('swatch-active', 'border-[#1C3326]');
    if (titleEl) titleEl.textContent = "Micro-Droplet Dewy Fluid";
    if (finishEl) finishEl.textContent = "Weightless Glass-Skin Sheen";
    if (absorbEl) absorbEl.textContent = "Instant (sub-8 seconds)";
    if (bestForEl) bestForEl.textContent = "Daytime Layering / Dehydrated Skin";
  } else if (type === 'balm') {
    if (balmBtn) balmBtn.classList.add('swatch-active', 'border-[#1C3326]');
    if (titleEl) titleEl.textContent = "Liposomal Velvet Balm Emulsion";
    if (finishEl) finishEl.textContent = "Velvety Cushion Seal";
    if (absorbEl) absorbEl.textContent = "Rich Nourishing Barrier (30 seconds)";
    if (bestForEl) bestForEl.textContent = "Night Renewal / Compromised Barrier";
  } else if (type === 'oil') {
    if (oilBtn) oilBtn.classList.add('swatch-active', 'border-[#1C3326]');
    if (titleEl) titleEl.textContent = "Biomimetic Lipid Nectar";
    if (finishEl) finishEl.textContent = "Luminous Golden Glow";
    if (absorbEl) absorbEl.textContent = "Deep Epidermal Infusion (20 seconds)";
    if (bestForEl) bestForEl.textContent = "Dry / Sensitive / Photo-Aged Skin";
  }
};

// ==========================================
// 12-WEEK CLINICAL TRIAL SCRUBBER (SCIENCE)
// ==========================================
window.updateTrialWeek = function(week) {
  const trialData = {
    0: {
      title: "Week 00: Initial Baseline",
      elasticity: "+0% (Baseline)",
      hydration: "28.4 AU (Severely Dehydrated)",
      barrier: "Compromised Acid Mantle",
      note: "High transepidermal water loss observed across 100% of study participants prior to formulation introduction."
    },
    4: {
      title: "Week 04: Rapid Cellular Quenching",
      elasticity: "+22% Tensile Bounce",
      hydration: "+38% Epidermal Moisture",
      barrier: "45% Reduction in Erythema",
      note: "Ectoin extremolytes and bio-fermented hyaluronic molecules replenish the stratum corneum with zero breakout reactivity."
    },
    8: {
      title: "Week 08: Deep Collagen Synthesis",
      elasticity: "+58% Measured Firmness",
      hydration: "+68% Moisture Retention",
      barrier: "38% Reduction in Fine Expression Lines",
      note: "Double-blind instrumental profilometry indicates substantial fibroblast proliferation and evening of photo-damage hyperpigmentation."
    },
    12: {
      title: "Week 12: Total Dermal Remodeling",
      elasticity: "+88% Maximum Elasticity",
      hydration: "+92% Sustained 24h Barrier Seal",
      barrier: "96% Full Stratum Corneum Renewal",
      note: "Complete cellular turnover cycle achieved. 100% of clinical subjects reported softer, smoother, luminous glass skin."
    }
  };

  const current = trialData[week] || trialData[12];
  const weekLabel = document.getElementById('trial-week-label');
  const titleEl = document.getElementById('trial-phase-title');
  const elastEl = document.getElementById('trial-elasticity');
  const hydEl = document.getElementById('trial-hydration');
  const barEl = document.getElementById('trial-barrier');
  const noteEl = document.getElementById('trial-doctor-note');

  if (weekLabel) weekLabel.textContent = `Week ${week.toString().padStart(2, '0')}`;
  if (titleEl) titleEl.textContent = current.title;
  if (elastEl) elastEl.textContent = current.elasticity;
  if (hydEl) hydEl.textContent = current.hydration;
  if (barEl) barEl.textContent = current.barrier;
  if (noteEl) noteEl.textContent = current.note;
};

// ==========================================
// INTERACTIVE 120 FPS FLUID KINEMATICS LABORATORY (INSTANT LOAD • ZERO BUFFERING)
// ==========================================
let skincareCanvasAnimId = null;
let fluidRipples = [];
let fluidParticles = [];

window.openSkincareVideo = function(videoUrl, title = '120 FPS Fluid Dispersion Kinematics') {
  let modal = document.getElementById('skincare-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'skincare-video-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#0A140F]/85 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-[#0E1E15] border border-[#1C3326] rounded-3xl overflow-hidden shadow-2xl text-white">
      <!-- Header -->
      <div class="p-4 md:px-6 border-b border-white/10 flex items-center justify-between bg-[#152B1E]">
        <div class="flex items-center gap-3">
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 class="font-serif text-sm md:text-base font-bold text-white tracking-wide">${title}</h3>
            <span class="text-[10px] font-mono text-emerald-300 uppercase tracking-widest block">Laboratory Optical Dispersion Analysis</span>
          </div>
        </div>
        <button onclick="closeSkincareVideo()" class="text-white/60 hover:text-white font-mono text-base px-3 py-1 bg-white/5 rounded-full hover:bg-white/10 transition">✕</button>
      </div>

      <!-- Main Kinematic Stage -->
      <div class="relative aspect-video w-full bg-[#07100B] overflow-hidden flex flex-col justify-between">
        <!-- Interactive HTML5 Canvas Ripple & Droplet Engine -->
        <canvas id="skincare-fluid-canvas" class="absolute inset-0 w-full h-full cursor-crosshair"></canvas>

        <!-- Top Telemetry HUD -->
        <div class="relative z-10 p-5 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div class="flex items-center gap-2 bg-[#0E1E15]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-mono text-[11px] text-white font-bold tracking-wider">120.0 FPS ULTRA-MACRO</span>
          </div>

          <div class="flex items-center gap-3 bg-[#0E1E15]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full font-mono text-[10px] text-emerald-200">
            <span>VISCOSITY: <strong class="text-white">312 mPa·s</strong></span>
            <span>•</span>
            <span>ABSORPTION: <strong class="text-white">0.84s</strong></span>
            <span>•</span>
            <span>pH: <strong class="text-emerald-400">5.4 SHIELD</strong></span>
          </div>
        </div>

        <!-- Center Prompt -->
        <div class="relative z-10 text-center pointer-events-none px-4">
          <p class="text-[11px] font-mono tracking-widest uppercase text-emerald-300/80 mb-1">Interactive Fluid Kinematics Stage</p>
          <p class="text-xs text-white/50 font-sans">Click anywhere on the stage to simulate high-speed pipette dispersion</p>
        </div>

        <!-- Bottom Stage Overlay Bar -->
        <div class="relative z-10 p-4 md:p-6 bg-gradient-to-t from-[#0E1E15] via-[#0E1E15]/90 to-transparent flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
          <div class="space-y-0.5">
            <span class="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Clinical Emulsion Observation</span>
            <p class="text-xs text-white/80 font-sans max-w-md">
              Immediate transdermal micro-droplet fusion with zero surface residue and active acid-mantle reinforcement.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="triggerDropletBurst()" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition border border-white/15">
              💧 Dispense Droplet
            </button>
            <button onclick="closeSkincareVideo(); showToast('Formulation selected.');" class="btn-botanical text-xs py-2 px-5 rounded-xl shadow-lg">
              Confirm Formula
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // Initialize Fluid Simulation Engine
  initFluidSimulation();
};

function initFluidSimulation() {
  const canvas = document.getElementById('skincare-fluid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();

  fluidRipples = [];
  fluidParticles = [];

  function addRipple(x, y, power = 1) {
    fluidRipples.push({
      x, y,
      radius: 5,
      maxRadius: Math.max(canvas.width, canvas.height) * 0.45 * power,
      alpha: 0.9,
      speed: 2.2 * power,
      color: power > 1.2 ? '#B89758' : '#34D399'
    });

    // Spawn micro particles
    const pCount = Math.floor(12 * power);
    for (let i = 0; i < pCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 2) * power;
      fluidParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1,
        alpha: 0.85,
        decay: Math.random() * 0.015 + 0.008,
        color: Math.random() > 0.5 ? '#34D399' : '#FBBF24'
      });
    }
  }

  window.triggerDropletBurst = function() {
    addRipple(canvas.width / 2, canvas.height / 2, 1.6);
  };

  canvas.onclick = function(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addRipple(x, y, 1.2);
  };

  // Initial burst
  addRipple(canvas.width / 2, canvas.height / 2, 1.4);

  let lastAutoDrip = Date.now();

  function render() {
    if (!document.getElementById('skincare-fluid-canvas')) return;

    ctx.fillStyle = 'rgba(7, 16, 11, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Auto drip every 3.5s if idle
    if (Date.now() - lastAutoDrip > 3500) {
      addRipple(canvas.width / 2 + (Math.random() - 0.5) * 80, canvas.height / 2 + (Math.random() - 0.5) * 40, 1.1);
      lastAutoDrip = Date.now();
    }

    // Draw ripples
    for (let i = fluidRipples.length - 1; i >= 0; i--) {
      const r = fluidRipples[i];
      r.radius += r.speed;
      r.alpha -= 0.008;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        fluidRipples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = r.alpha;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Secondary faint ring
      if (r.radius > 20) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius - 15, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = r.alpha * 0.35;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }

    // Draw particles
    for (let i = fluidParticles.length - 1; i >= 0; i--) {
      const p = fluidParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        fluidParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.restore();
    }

    skincareCanvasAnimId = requestAnimationFrame(render);
  }

  if (skincareCanvasAnimId) cancelAnimationFrame(skincareCanvasAnimId);
  skincareCanvasAnimId = requestAnimationFrame(render);
}

window.closeSkincareVideo = function() {
  const modal = document.getElementById('skincare-video-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if (skincareCanvasAnimId) {
      cancelAnimationFrame(skincareCanvasAnimId);
      skincareCanvasAnimId = null;
    }
  }
};

// ==========================================
// TOAST NOTIFICATION
// ==========================================
window.showToast = function(msg) {
  let toast = document.getElementById('aura-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'aura-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-[#1C3326] text-white px-5 py-3.5 rounded-full shadow-2xl font-sans text-xs flex items-center gap-3 transition-transform duration-300 transform translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
    <span>${msg}</span>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
};

document.addEventListener('DOMContentLoaded', () => {
  updateRoutineUI();
});
