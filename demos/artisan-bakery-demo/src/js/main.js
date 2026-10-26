// ATELIER LEVAIN — Unique Editorial UX Engine

// 1. The Curated Morning Tasting Box State
const BOX_STORAGE_KEY = 'atelier_levain_box';

let tastingBox = JSON.parse(localStorage.getItem(BOX_STORAGE_KEY)) || [
  { id: 'croissant-classic', name: '27-Layer Normandy Croissant', price: 6.00, slot: 1, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80' },
  { id: 'country-miche', name: '68h Sourdough Miche (Quarter)', price: 4.50, slot: 2, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' }
];

const MAX_BOX_SLOTS = 4;

function saveTastingBox() {
  localStorage.setItem(BOX_STORAGE_KEY, JSON.stringify(tastingBox));
  updateBoxUI();
}

function updateBoxUI() {
  const badgeCounts = document.querySelectorAll('.box-slot-count');
  const slotCount = tastingBox.length;

  badgeCounts.forEach(b => {
    b.textContent = `${slotCount}/${MAX_BOX_SLOTS}`;
    b.classList.toggle('bg-[#C25B3E]', true);
  });

  const slotContainer = document.getElementById('box-slots-display');
  const boxTotalEl = document.getElementById('box-total-amount');

  if (slotContainer) {
    const total = tastingBox.reduce((sum, item) => sum + item.price, 0);
    if (boxTotalEl) boxTotalEl.textContent = `$${total.toFixed(2)}`;

    let html = '';
    for (let i = 0; i < MAX_BOX_SLOTS; i++) {
      const item = tastingBox[i];
      if (item) {
        html += `
          <div class="relative bg-white border border-[#E5DDD0] rounded p-3 flex flex-col justify-between group">
            <div class="flex items-start justify-between gap-2">
              <span class="text-[9px] font-mono uppercase text-[#C25B3E] tracking-wider font-bold">Slot 0${i+1}</span>
              <button onclick="removeFromBox(${i})" class="text-zinc-400 hover:text-[#C25B3E] text-xs leading-none">✕</button>
            </div>
            <div class="my-2">
              <h5 class="text-xs font-serif font-bold text-[#191715] leading-tight line-clamp-1">${item.name}</h5>
              <span class="text-[11px] font-mono text-[#5C554E]">$${item.price.toFixed(2)}</span>
            </div>
            <img src="${item.image}" class="w-full h-12 object-cover rounded filter brightness-95" alt="${item.name}" />
          </div>
        `;
      } else {
        html += `
          <div class="border border-dashed border-[#D8CEBE] rounded p-3 flex flex-col items-center justify-center text-center bg-[#FAF7F2]/50 min-h-[110px]">
            <span class="text-[9px] font-mono text-[#948A80] uppercase tracking-wider">Slot 0${i+1}</span>
            <span class="text-xs font-serif text-[#948A80] mt-1">+ Select Pastry</span>
          </div>
        `;
      }
    }
    slotContainer.innerHTML = html;
  }
}

window.addToBox = function(product) {
  if (tastingBox.length >= MAX_BOX_SLOTS) {
    showEditorialToast(`Your 4-Pastry Morning Box is full! Click 'Review Box' below.`, 'warning');
    openBoxDrawer();
    return;
  }
  tastingBox.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    slot: tastingBox.length + 1
  });
  saveTastingBox();
  showEditorialToast(`Added "${product.name}" to Slot 0${tastingBox.length}`);
  openBoxDrawer();
};

window.removeFromBox = function(index) {
  tastingBox.splice(index, 1);
  saveTastingBox();
};

window.openBoxDrawer = function() {
  const tray = document.getElementById('morning-box-tray');
  const backdrop = document.getElementById('box-backdrop');
  if (tray) {
    tray.classList.remove('translate-y-full');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
};

window.closeBoxDrawer = function() {
  const tray = document.getElementById('morning-box-tray');
  const backdrop = document.getElementById('box-backdrop');
  if (tray) {
    tray.classList.add('translate-y-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

// ==========================================
// BESPOKE MORNING BOX ORDER MODAL (NO ALERT)
// ==========================================
window.triggerMorningBoxOrder = function() {
  closeBoxDrawer();
  const total = tastingBox.reduce((sum, item) => sum + item.price, 0);
  const ticketCode = 'LEV-2026-' + Math.floor(1000 + Math.random() * 9000);

  let modal = document.getElementById('morning-order-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'morning-order-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  const itemsList = tastingBox.length > 0 
    ? tastingBox.map(item => `<li class="flex justify-between py-1 border-b border-[#E5DDD0] text-xs font-mono"><span>${item.name}</span><span class="font-bold">$${item.price.toFixed(2)}</span></li>`).join('')
    : '<li class="text-xs font-mono text-[#948A80]">Custom 4-Piece Daily Counter Curations</li>';

  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-[#FAF7F2] border border-[#191715] rounded-xl p-8 shadow-2xl text-[#191715]">
      
      <!-- Top French Postage Stamp Tag -->
      <div class="flex items-center justify-between border-b border-[#E5DDD0] pb-4 mb-6">
        <div>
          <span class="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C25B3E] font-bold block">
            ATELIER LEVAIN • BULLETIN DE COMMANDE
          </span>
          <h3 class="font-serif text-3xl font-bold mt-1">Morning Box Reserved</h3>
        </div>
        <div class="text-right">
          <span class="font-mono text-xs bg-[#E5DDD0] px-2.5 py-1 rounded font-bold">${ticketCode}</span>
        </div>
      </div>

      <p class="text-xs font-mono text-[#5C554E] mb-6 leading-relaxed">
        Your tasting box has been allocated for tomorrow's dawn hearth bake.
      </p>

      <!-- Order Details -->
      <div class="bg-white border border-[#E5DDD0] rounded p-5 mb-6 space-y-3">
        <div class="flex justify-between text-xs font-mono text-[#5C554E]">
          <span>Pickup / Courier Dispatch:</span>
          <strong class="text-[#191715]">Tomorrow 07:30 AM</strong>
        </div>
        <div class="flex justify-between text-xs font-mono text-[#5C554E]">
          <span>Atelier Station:</span>
          <strong class="text-[#191715]">Greenpoint Flagship (105 Freeman St)</strong>
        </div>
        
        <div class="pt-3 border-t border-[#E5DDD0]">
          <span class="text-[10px] font-mono uppercase text-[#948A80] tracking-wider block mb-2">Box Contents:</span>
          <ul class="space-y-1 mb-3">
            ${itemsList}
          </ul>
          <div class="flex justify-between text-sm font-mono font-bold text-[#191715] pt-2 border-t border-[#191715]">
            <span>Total Amount (Demo)</span>
            <span class="text-[#C25B3E] font-serif text-lg">$${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Demo Explanatory Note -->
      <div class="p-3 bg-[#F2ECE1] border border-[#E5DDD0] rounded text-[11px] font-mono text-[#5C554E] mb-6">
        <strong class="text-[#191715] block mb-1">Portfolio Showcase Note:</strong>
        This demonstrates a successful bakery morning box reservation flow. In production, this ties directly to your Point of Sale (Square, Toast, Stripe Terminal, or Shopify).
      </div>

      <button onclick="closeMorningOrderModal()" class="btn-terracotta w-full justify-center text-xs font-mono uppercase tracking-wider py-3.5">
        Return To Boulangerie
      </button>
    </div>
  `;
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeMorningOrderModal = function() {
  const modal = document.getElementById('morning-order-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

// ==========================================
// 2. Interactive Crust Sound Simulator
// ==========================================
let audioCtx = null;
let soundPlaying = false;

window.toggleCrustSound = function() {
  const btn = document.getElementById('crust-sound-btn');
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (soundPlaying) {
    soundPlaying = false;
    if (btn) btn.innerHTML = `<span>🔊 Crust Sound ASMR</span>`;
    showEditorialToast('Sound crackle paused');
    return;
  }

  soundPlaying = true;
  if (btn) btn.innerHTML = `<span class="text-[#C25B3E] font-bold animate-pulse">❚❚ Crackling Live • Hearth Sourdough</span>`;
  showEditorialToast('Simulating cooling crust crackle acoustic vibrations');

  function triggerCrackle() {
    if (!soundPlaying) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(240 + Math.random() * 850, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.09);

    const nextDelay = Math.random() * 240 + 70;
    setTimeout(triggerCrackle, nextDelay);
  }
  triggerCrackle();
};

// ==========================================
// 3. Hotspot Pin Inspector for PDP
// ==========================================
window.inspectHotspot = function(pinNumber) {
  const details = {
    1: {
      title: "Blistered Caramelized Ear",
      desc: "Razor-scored at a 30-degree angle prior to deck loading. As internal steam expands, this crust flap lifts, creating a deep, caramelized amber ridge rich in Maillard aromatic compounds."
    },
    2: {
      title: "Wild Open Honeycomb Crumb",
      desc: "86% hydration achieved with spring water. The irregular, translucent cell structure indicates gentle hand-folding without degassing, creating a light, custard-like texture that melts on the palate."
    },
    3: {
      title: "Flour Ridges from Spruce Bannetons",
      desc: "During its 48-hour cold retard in Austrian spruce pulp proofing baskets, the dough absorbs wood aromas and forms iconic spiral dusting ridges that bake into crisp micro-textures."
    }
  };

  const infoBox = document.getElementById('hotspot-details-card');
  const titleEl = document.getElementById('hotspot-title');
  const descEl = document.getElementById('hotspot-desc');

  if (infoBox && titleEl && descEl && details[pinNumber]) {
    titleEl.textContent = details[pinNumber].title;
    descEl.textContent = details[pinNumber].desc;
    infoBox.classList.remove('opacity-0', 'translate-y-2');
  }
};

// ==========================================
// 4. Interactive 68-Hour Fermentation Timeline Dial
// ==========================================
window.updateFermentDial = function(hour) {
  const stages = [
    { hour: 0, title: "Hour 00: The Autolyse", desc: "Stone-milled Hudson Valley flours meet spring water. Enzymatic proteolysis begins, naturally softening the gluten network without any kneading." },
    { hour: 12, title: "Hour 12: Levain Inoculation & Bulk", desc: "Our 14-year-old mother culture is folded in. Wild yeasts multiply in ambient 76°F warmth, and manual coil folds build tensile air pockets." },
    { hour: 36, title: "Hour 36: Cold Retardation Begins", desc: "Shaped loaves rest inside chilled bannetons at 38°F (3°C). Yeast dormancy begins while lactic and acetic acid bacteria continue slow, enzymatic sugar synthesis." },
    { hour: 68, title: "Hour 68: Deck Hearth Steam Bake", desc: "Transferred directly onto 485°F refractory hearth stones. Dry saturated steam is injected, causing maximum thermal oven-spring and blister formation." }
  ];

  let current = stages[0];
  for (let s of stages) {
    if (hour >= s.hour) current = s;
  }

  const hourDisplay = document.getElementById('ferment-hour-num');
  const titleDisplay = document.getElementById('ferment-stage-title');
  const descDisplay = document.getElementById('ferment-stage-desc');

  if (hourDisplay) hourDisplay.textContent = `${hour}h`;
  if (titleDisplay) titleDisplay.textContent = current.title;
  if (descDisplay) descDisplay.textContent = current.desc;
};

// ==========================================
// 5. BULLETPROOF BAKERY VIDEO LIGHTBOX
// ==========================================
window.openBakeryVideo = function(videoUrl, title = '120 FPS Motion Capture') {
  let modal = document.getElementById('bakery-video-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bakery-video-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-4xl bg-[#FAF7F2] border border-[#191715] rounded-xl overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-[#E5DDD0] flex items-center justify-between bg-[#F2ECE1]">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-[#C25B3E] animate-ping"></span>
          <h3 class="font-mono text-xs font-bold uppercase text-[#191715] tracking-wider">${title}</h3>
        </div>
        <button onclick="closeBakeryVideo()" class="text-zinc-500 hover:text-black font-mono text-sm px-2">✕</button>
      </div>
      
      <div class="aspect-video bg-[#191715] flex items-center justify-center relative overflow-hidden">
        <video id="bakery-video-player" controls playsinline class="w-full h-full object-contain">
          <source src="${videoUrl}" type="video/mp4" />
        </video>

        <!-- Motion Graphic Fallback Simulation -->
        <div id="bakery-fallback-reel" class="hidden absolute inset-0 bg-[#191715] flex flex-col items-center justify-center p-8 text-center text-white">
          <div class="w-16 h-16 rounded-full bg-[#C25B3E]/30 text-[#E5A952] border border-[#C25B3E] flex items-center justify-center mb-4">
            <svg class="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span class="px-3 py-1 rounded bg-[#C25B3E] text-white font-mono text-[10px] tracking-widest uppercase mb-2">
            120 FPS Macro Kinematics Active
          </span>
          <h4 class="font-serif text-2xl font-bold mb-2">Lamination Shatter & Crumb Simulation</h4>
          <p class="text-xs text-zinc-400 max-w-md font-light leading-relaxed mb-4">
            Demo Mode: In your production site, drop your 4K slow-motion croissant and crumb tear reels into <code class="text-[#E5A952]">/videos/</code> to stream uncompressed footage.
          </p>
          <div class="font-mono text-[11px] text-zinc-300 bg-black/60 px-4 py-1.5 rounded border border-white/10">
            4K HDR • 120 FPS • 14°C Lamination Studio
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  const player = document.getElementById('bakery-video-player');
  const fallback = document.getElementById('bakery-fallback-reel');

  if (player) {
    const playPromise = player.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        player.muted = true;
        player.play().catch(() => {
          if (player) player.classList.add('hidden');
          if (fallback) fallback.classList.remove('hidden');
        });
      });
    }
    player.onerror = function() {
      if (player) player.classList.add('hidden');
      if (fallback) fallback.classList.remove('hidden');
    };
  }
};

window.closeBakeryVideo = function() {
  const modal = document.getElementById('bakery-video-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.innerHTML = '';
    document.body.classList.remove('overflow-hidden');
  }
};

// 6. Toast System
function showEditorialToast(message, type = 'normal') {
  let container = document.getElementById('editorial-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'editorial-toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const borderCol = type === 'warning' ? 'border-[#C25B3E]' : 'border-[#191715]';
  toast.className = `bg-white ${borderCol} border text-[#191715] font-mono text-xs px-4 py-3 rounded shadow-xl flex items-center gap-3 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
  toast.innerHTML = `
    <span class="w-1.5 h-1.5 rounded-full bg-[#C25B3E]"></span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 3200);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  updateBoxUI();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBoxDrawer();
      closeBakeryVideo();
      closeMorningOrderModal();
    }
  });
});
