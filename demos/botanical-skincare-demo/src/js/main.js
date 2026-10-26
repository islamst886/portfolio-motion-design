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

window.addEventListener('focus', () => window.refreshAllPageMedia(false));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') window.refreshAllPageMedia(false);
});

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
// VIDEO LIGHTBOX (120 FPS KINEMATICS)
// ==========================================
window.openSkincareVideo = function(videoUrl, title = '120 FPS Fluid Dispersion') {
  let modal = document.getElementById('skincare-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'skincare-video-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  const freshUrl = window.getFreshMediaUrl(videoUrl);

  modal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-white border border-[#1C3326] rounded-2xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-[#E2E8E4] flex items-center justify-between bg-[#F7F8F6]">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#1C3326] animate-ping"></span>
          <h3 class="font-mono text-xs font-bold uppercase text-[#121E17] tracking-wider">${title}</h3>
        </div>
        <button onclick="closeSkincareVideo()" class="text-zinc-400 hover:text-black font-mono text-sm px-2">✕</button>
      </div>

      <div class="aspect-video bg-[#121E17] flex items-center justify-center relative overflow-hidden">
        <video id="skin-video-player" controls autoplay playsinline src="${freshUrl}" class="w-full h-full object-contain">
          <source src="${freshUrl}" type="video/mp4" />
        </video>

        <!-- Simulated Fluid Motion Fallback -->
        <div id="skin-fallback-reel" class="hidden absolute inset-0 bg-[#1C3326] flex flex-col items-center justify-center p-8 text-center text-white">
          <div class="w-16 h-16 rounded-full bg-white/10 text-[#B89758] border border-white/20 flex items-center justify-center mb-4">
            <svg class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span class="px-3 py-1 rounded bg-white text-[#1C3326] font-mono text-[10px] tracking-widest uppercase mb-2 font-bold">
            120 FPS Dropper Dispersion Active
          </span>
          <h4 class="font-serif text-2xl font-bold mb-2">Micro-Droplet Fluid Kinematics</h4>
          <p class="text-xs text-white/70 max-w-md font-sans mb-6">
            [ Local Video Stream Ready ] Uncompressed 120 FPS playback showing lipid emulsion blending and immediate dermal absorption.
          </p>
          <button onclick="closeSkincareVideo()" class="btn-botanical text-xs py-2.5 px-6">
            Close Reel
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  const video = document.getElementById('skin-video-player');
  const fallback = document.getElementById('skin-fallback-reel');

  if (video) {
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {
        if (fallback) {
          video.classList.add('hidden');
          fallback.classList.remove('hidden');
        }
      });
    });

    video.onerror = () => {
      if (fallback) {
        video.classList.add('hidden');
        fallback.classList.remove('hidden');
      }
    };
  }
};

window.closeSkincareVideo = function() {
  const modal = document.getElementById('skincare-video-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    const video = document.getElementById('skin-video-player');
    if (video) video.pause();
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
