// KINETIC CRAFT STUDIOS — Warm Editorial Light Luxury Engine

// ==========================================
// 0. AUTO-CACHE-BUSTING & MEDIA HOT-RELOADER
// ==========================================
window.getFreshMediaUrl = function(url, explicitTimestamp) {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // Clean off any previous timestamp query
  const base = url.split('?')[0];
  const t = explicitTimestamp || Date.now();
  const encoded = encodeURI(decodeURI(base));
  return `${encoded}?v=${t}`;
};

window.refreshAllPageMedia = function(showToast = false) {
  const timestamp = Date.now();
  let updatedCount = 0;

  // 1. Refresh inline <video> and <source> elements
  document.querySelectorAll('video').forEach(video => {
    let changed = false;
    
    // Check direct src on video
    const directSrc = video.getAttribute('src');
    if (directSrc && (directSrc.includes('assets/') || directSrc.startsWith('./assets/'))) {
      const original = video.getAttribute('data-original-src') || directSrc;
      video.setAttribute('data-original-src', original.split('?')[0]);
      video.src = window.getFreshMediaUrl(original, timestamp);
      changed = true;
    }

    // Check <source> children
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

  // 2. Refresh local <img> elements
  document.querySelectorAll('img').forEach(img => {
    const imgSrc = img.getAttribute('src');
    if (imgSrc && (imgSrc.includes('assets/') || imgSrc.startsWith('./assets/'))) {
      const original = img.getAttribute('data-original-src') || imgSrc;
      img.setAttribute('data-original-src', original.split('?')[0]);
      img.src = window.getFreshMediaUrl(original, timestamp);
      updatedCount++;
    }
  });

  if (showToast && typeof showStudioToast === 'function') {
    showStudioToast(`⚡ Auto-Synced ${updatedCount} media assets from disk!`);
  }
};

// Catch media changes automatically when switching back to browser tab
window.addEventListener('focus', () => {
  window.refreshAllPageMedia(false);
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    window.refreshAllPageMedia(false);
  }
});

// Live HTTP watcher: periodically checks HEAD headers for active media assets
function startMediaLiveWatcher() {
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
            console.log(`[Media Auto-Sync] Detected file update on disk: ${url}`);
            urlHeaders[url] = sig;
            window.refreshAllPageMedia(false);
            const fileName = decodeURI(url.split('/').pop());
            if (typeof showStudioToast === 'function') {
              showStudioToast(`🔄 Updated file detected: ${fileName} reloaded!`);
            }
          } else {
            urlHeaders[url] = sig;
          }
        }
      } catch (err) {
        // Silently ignore intermittent network hiccups
      }
    }
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Kinetic Craft Studios Warm Light Engine Initialized.');
  window.refreshAllPageMedia(false);
  startMediaLiveWatcher();
});

// ==========================================
// 1. BESPOKE HYPER-MOTION SHOWREEL PLAYER
// ==========================================
window.openShowreel = function(videoUrl, title = 'Hyper-Motion Cinematic Showreel') {
  let modal = document.getElementById('studio-showreel-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studio-showreel-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#1C1815]/75 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  // Always append fresh timestamp to defeat disk and memory cache
  const freshUrl = window.getFreshMediaUrl(videoUrl);

  modal.innerHTML = `
    <div class="relative w-full max-w-5xl bg-white border border-[#E8DFD3] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[#1C1815]">
      <div class="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FAF7F2]">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-[#B85D35] animate-ping"></span>
          <h3 class="font-grotesk text-sm font-bold uppercase tracking-wider text-[#1C1815] truncate max-w-xs sm:max-w-md md:max-w-xl">${title}</h3>
          <span class="pill-warm text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0">120 FPS MASTER</span>
        </div>
        
        <div class="flex items-center gap-3 shrink-0">
          <button onclick="closeShowreel()" class="text-[#6E6459] hover:text-[#1C1815] font-mono text-base px-2 py-1 rounded-lg hover:bg-black/5 transition" title="Close Lightbox">✕</button>
        </div>
      </div>

      <div class="aspect-video bg-[#1C1815] flex items-center justify-center relative overflow-hidden">
        <video id="studio-active-video" controls autoplay playsinline src="${freshUrl}" class="w-full h-full object-contain">
          <source src="${freshUrl}" type="video/mp4" />
        </video>

        <!-- Simulated Cinematic Motion Graphic Fallback -->
        <div id="studio-fallback-motion" class="hidden absolute inset-0 bg-[#241F1B] flex flex-col items-center justify-center p-8 text-center text-[#FAF7F2]">
          <div class="relative w-24 h-24 mb-6">
            <div class="absolute inset-0 rounded-full border-2 border-[#B85D35] animate-spin border-t-transparent"></div>
            <div class="absolute inset-2 rounded-full border-2 border-[#C58B42] animate-ping opacity-30"></div>
            <div class="absolute inset-0 flex items-center justify-center font-grotesk font-bold text-[#FAF7F2] text-lg">
              120<span class="text-[10px]">FPS</span>
            </div>
          </div>

          <span class="pill-warm text-xs font-mono uppercase tracking-widest px-3 py-1 rounded mb-3 bg-[#B85D35]/20 text-[#FAF7F2]">
            Kinematic Render Active
          </span>
          <h4 class="font-grotesk text-xl font-bold mb-2">High-Velocity Product Kinematics Reel</h4>
          <p class="text-xs text-[#D9CEBE] max-w-md font-mono mb-6 leading-relaxed">
            [ Local Video Stream Ready ] Seamlessly streams 4K 120 FPS high-frame-rate render files directly to physical-product clients.
          </p>

          <div class="flex items-center gap-3">
            <button onclick="closeShowreel()" class="btn-ghost text-xs px-6 py-2.5 rounded-lg font-mono">
              Close Vault
            </button>
            <button onclick="openCommissionModal('Your Brand')" class="btn-warm text-xs px-6 py-2.5 rounded-lg font-bold">
              Commission Custom Reel →
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 border-t border-[#E8DFD3] bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6E6459] gap-2">
        <span>Kinematic Render Engine: Blender 4.2 Cycles + WebGL 120 FPS</span>
        <span class="text-[#B85D35] font-bold">Zero Framedrop Guaranteed</span>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  const video = document.getElementById('studio-active-video');
  const fallback = document.getElementById('studio-fallback-motion');

  if (video) {
    video.load();
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

window.closeShowreel = function() {
  const modal = document.getElementById('studio-showreel-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    const video = document.getElementById('studio-active-video');
    if (video) video.pause();
  }
};

// ==========================================
// 1B. BESPOKE 3D CGI IMAGE LIGHTBOX
// ==========================================
window.openImageLightbox = function(imgSrc, title = '3D CGI Product Packshot', tag = '8K PHOTOREALISTIC RENDER', desc = 'Blender Cycles Raytraced Simulation') {
  let modal = document.getElementById('studio-image-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studio-image-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#1C1815]/80 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  // Always append fresh timestamp to defeat disk and memory cache
  const freshSrc = window.getFreshMediaUrl(imgSrc);

  modal.innerHTML = `
    <div class="relative w-full max-w-5xl bg-white border border-[#E8DFD3] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-[#1C1815] max-h-[90vh]">
      <div class="p-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FAF7F2]">
        <div class="flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-[#B85D35]"></span>
          <h3 class="font-grotesk text-sm font-bold uppercase tracking-wider text-[#1C1815] truncate max-w-xs sm:max-w-md md:max-w-xl">${title}</h3>
          <span class="pill-warm text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0">${tag}</span>
        </div>
        <button onclick="closeImageLightbox()" class="text-[#6E6459] hover:text-[#1C1815] font-mono text-base px-2">✕</button>
      </div>

      <div class="flex-grow bg-[#1C1815] flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-[300px]">
        <img src="${freshSrc}" alt="${title}" class="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg" />
      </div>

      <div class="p-4 border-t border-[#E8DFD3] bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#6E6459] gap-2">
        <span>${desc}</span>
        <button onclick="openCommissionModal('${title}')" class="btn-warm text-[11px] px-4 py-1.5 rounded-lg font-bold">
          Commission This Style →
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeImageLightbox = function() {
  const modal = document.getElementById('studio-image-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

// Keyboard listener for Escape key to close any active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeShowreel();
    closeImageLightbox();
    closeCommissionModal();
  }
});

// ==========================================
// 2. WARM EDITORIAL COMMISSION MODAL
// ==========================================
window.openCommissionModal = function(brandName = '') {
  let modal = document.getElementById('studio-commission-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'studio-commission-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#1C1815]/60 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white border border-[#E8DFD3] rounded-3xl p-8 shadow-2xl text-[#1C1815]">
      <div class="flex items-center justify-between border-b border-[#E8DFD3] pb-4 mb-6">
        <div>
          <span class="text-[10px] font-mono text-[#B85D35] tracking-widest uppercase block font-bold">
            COMMISSION YOUR FLAGSHIP STOREFRONT
          </span>
          <h3 class="font-grotesk text-2xl font-bold mt-1 text-[#1C1815]">Direct Studio Commission</h3>
        </div>
        <button onclick="closeCommissionModal()" class="text-[#6E6459] hover:text-[#1C1815] p-2 font-mono">✕</button>
      </div>

      <p class="text-xs text-[#6E6459] leading-relaxed font-sans mb-6">
        Transform your brand into a sensory digital flagship. Select your archetype below, provide your details, and place your commission order directly with our NYC creative studio.
      </p>

      <form onsubmit="handleCommissionSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-mono uppercase text-[#6E6459] mb-1 font-bold">Brand / Business Name</label>
          <input id="commission-brand-name" type="text" required value="${brandName}" placeholder="e.g. Gotham Roast Atelier" class="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-3 text-xs font-mono text-[#1C1815] focus:border-[#B85D35] focus:bg-white focus:outline-none transition" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-mono uppercase text-[#6E6459] mb-1 font-bold">Current Store URL or Instagram</label>
            <input id="commission-website" type="text" placeholder="https://yourbrand.com" class="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-3 text-xs font-mono text-[#1C1815] focus:border-[#B85D35] focus:bg-white focus:outline-none transition" />
          </div>
          <div>
            <label class="block text-xs font-mono uppercase text-[#6E6459] mb-1 font-bold">Founder / Client Email</label>
            <input id="commission-email" type="email" required placeholder="founder@yourbrand.com" class="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-3 text-xs font-mono text-[#1C1815] focus:border-[#B85D35] focus:bg-white focus:outline-none transition" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-mono uppercase text-[#6E6459] mb-1 font-bold">Selected Flagship Archetype</label>
          <select id="commission-archetype" class="w-full bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl px-4 py-3 text-xs font-mono text-[#1C1815] focus:border-[#B85D35] focus:bg-white focus:outline-none transition">
            <option value="coffee">Beverage & Craft Roaster (Dark Onyx Luxury + SCA Cupping)</option>
            <option value="bakery">Artisanal Bakery & Patisserie (Parisian Editorial Cream + Web Audio ASMR)</option>
            <option value="skincare">Botanical Skincare & Apothecary (SoHo Porcelain + Dermal Viscosity Swatches)</option>
            <option value="custom">Bespoke Physical Product Flagship (Custom 3D & 120 FPS Motion)</option>
          </select>
        </div>

        <button type="submit" class="btn-warm w-full py-4 rounded-xl text-xs uppercase tracking-wider font-bold mt-4 shadow-xl">
          Confirm & Place Flagship Commission →
        </button>
      </form>

      <div class="mt-6 pt-4 border-t border-[#E8DFD3] flex items-center justify-between text-[10px] font-mono text-[#9C8E80]">
        <span>✨ Handcrafted in SoHo, New York</span>
        <span>Hosted on Global Cloudflare Edge</span>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

// Aliases for compatibility
window.openAuditModal = window.openCommissionModal;
window.closeAuditModal = function() { closeCommissionModal(); };

window.closeCommissionModal = function() {
  const modal = document.getElementById('studio-commission-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

window.handleCommissionSubmit = function(e) {
  e.preventDefault();
  closeCommissionModal();

  const brand = document.getElementById('commission-brand-name')?.value || 'Your Brand';
  const email = document.getElementById('commission-email')?.value || 'founder@brand.com';
  const orderId = 'COMMISSION-NYC-' + Math.floor(1000 + Math.random() * 9000);

  let confirmModal = document.getElementById('studio-confirm-modal');
  if (!confirmModal) {
    confirmModal = document.createElement('div');
    confirmModal.id = 'studio-confirm-modal';
    confirmModal.className = 'fixed inset-0 z-50 bg-[#1C1815]/65 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(confirmModal);
  }

  confirmModal.innerHTML = `
    <div class="relative w-full max-w-lg bg-white border border-[#B85D35] rounded-3xl p-8 shadow-2xl text-[#1C1815]">
      <div class="w-12 h-12 rounded-full bg-[#B85D35]/10 border border-[#B85D35] text-[#B85D35] flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        ✓
      </div>
      <span class="text-[10px] font-mono text-[#B85D35] uppercase tracking-widest block text-center mb-1 font-bold">
        COMMISSION ORDER REGISTERED • #${orderId}
      </span>
      <h3 class="font-grotesk text-2xl font-bold text-center mb-2 text-[#1C1815]">Order Confirmed</h3>
      <p class="text-xs text-[#6E6459] font-sans text-center mb-6 leading-relaxed">
        Our studio has accepted the flagship commission for <strong class="text-[#1C1815]">${brand}</strong>. A dedicated onboarding package and project timeline have been queued for <strong class="text-[#B85D35]">${email}</strong>.
      </p>

      <div class="bg-[#FAF7F2] border border-[#E8DFD3] p-5 rounded-2xl text-xs font-mono space-y-2 mb-6">
        <div class="flex justify-between">
          <span class="text-[#6E6459]">Deliverable:</span>
          <strong class="text-[#B85D35]">Bespoke Multi-Page Digital Flagship</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-[#6E6459]">Studio Desk:</span>
          <strong class="text-[#1C1815]">SoHo Atelier NYC</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-[#6E6459]">Hosting Edge:</span>
          <strong class="text-[#1C1815]">Cloudflare Global 300+ Edge Nodes</strong>
        </div>
        <div class="flex justify-between">
          <span class="text-[#6E6459]">Status:</span>
          <strong class="text-emerald-700">Order Confirmed & In Production Queue</strong>
        </div>
      </div>

      <button onclick="document.getElementById('studio-confirm-modal').classList.add('hidden'); document.body.classList.remove('overflow-hidden');" class="btn-warm w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold">
        Return To Showcase
      </button>
    </div>
  `;

  confirmModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

// Aliases for compatibility
window.handleAuditSubmit = window.handleCommissionSubmit;

// ==========================================
// 3. CASE STUDY FILTER CONTROLLER
// ==========================================
window.filterCaseStudies = function(category) {
  const cards = document.querySelectorAll('.case-study-card');
  const buttons = document.querySelectorAll('.filter-pill-btn');

  buttons.forEach(btn => {
    btn.classList.remove('bg-[#B85D35]', 'text-white', 'font-bold');
    btn.classList.add('bg-white', 'text-[#6E6459]', 'border', 'border-[#E8DFD3]');
  });

  if (event && event.currentTarget) {
    event.currentTarget.classList.remove('bg-white', 'text-[#6E6459]');
    event.currentTarget.classList.add('bg-[#B85D35]', 'text-white', 'font-bold');
  }

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat.includes(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

// ==========================================
// 4. BESPOKE TOAST NOTIFICATION
// ==========================================
window.showStudioToast = function(msg) {
  let toast = document.getElementById('studio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'studio-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-white border border-[#B85D35] text-[#1C1815] px-5 py-3 rounded-2xl shadow-2xl font-mono text-xs flex items-center gap-3 transition-transform duration-300 transform translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-[#B85D35] animate-ping"></span>
    <span>${msg}</span>
  `;

  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3500);
};
