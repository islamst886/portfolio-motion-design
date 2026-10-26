// Global State & Cart Engine for KURA Coffee Roasters
const CART_STORAGE_KEY = 'aura_roastery_cart';

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [
  {
    id: 'ethiopia-guji',
    name: 'Ethiopia Guji Uraga Natural',
    roast: 'Light Roast • Candied Peach, Jasmine, Bergamot',
    size: '12 oz (340g)',
    grind: 'Whole Bean',
    price: 24.00,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80'
  }
];

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const countBadges = document.querySelectorAll('.cart-count-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const shippingProgressEl = document.getElementById('shipping-progress');
  const shippingTextEl = document.getElementById('shipping-text');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  countBadges.forEach(badge => {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-flex' : 'none';
  });

  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  // Free shipping over $60 threshold
  const freeShippingThreshold = 60;
  if (shippingProgressEl && shippingTextEl) {
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
    shippingProgressEl.style.width = `${progress}%`;
    if (subtotal >= freeShippingThreshold) {
      shippingTextEl.innerHTML = `<span class="text-amber-400 font-medium">Unlocked!</span> Free Carbon-Neutral NYC Delivery`;
    } else {
      const remaining = (freeShippingThreshold - subtotal).toFixed(2);
      shippingTextEl.innerHTML = `Add <span class="text-amber-400 font-medium">$${remaining}</span> more for Free NYC Delivery`;
    }
  }

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="py-16 text-center text-zinc-400">
          <svg class="w-12 h-12 mx-auto mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="text-sm">Your coffee bag is currently empty.</p>
          <a href="./shop.html" class="inline-block mt-4 text-xs font-semibold text-amber-300 uppercase tracking-widest hover:underline">Explore Single Origins →</a>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex gap-4 py-4 border-b border-zinc-800/80 items-center">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-lg border border-zinc-800 flex-shrink-0" />
          <div class="flex-grow min-w-0">
            <h4 class="text-sm font-semibold text-zinc-100 truncate">${item.name}</h4>
            <p class="text-xs text-zinc-400 mt-0.5">${item.size} • ${item.grind}</p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center border border-zinc-800 rounded-full px-2 py-0.5 bg-zinc-900/60">
                <button onclick="decrementCartItem('${item.id}')" class="text-zinc-400 hover:text-white px-1.5 text-sm font-bold">−</button>
                <span class="text-xs px-2 text-zinc-200">${item.quantity}</span>
                <button onclick="incrementCartItem('${item.id}')" class="text-zinc-400 hover:text-white px-1.5 text-sm font-bold">+</button>
              </div>
              <span class="text-sm font-medium text-amber-300">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
          <button onclick="removeCartItem('${item.id}')" class="text-zinc-500 hover:text-red-400 p-1" title="Remove item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      `).join('');
    }
  }
}

window.addToCart = function(product) {
  const existing = cart.find(i => i.id === product.id && i.grind === product.grind && i.size === product.size);
  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      roast: product.roast || 'Specialty Roast',
      size: product.size || '12 oz (340g)',
      grind: product.grind || 'Whole Bean',
      price: product.price,
      quantity: product.quantity || 1,
      image: product.image
    });
  }
  saveCart();
  openCartDrawer();
  showToast(`Added "${product.name}" to cart`);
};

window.incrementCartItem = function(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity++;
    saveCart();
  }
};

window.decrementCartItem = function(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
  }
};

window.removeCartItem = function(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
};

window.openCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    document.body.classList.add('overflow-hidden');
  }
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.classList.remove('overflow-hidden');
  }
};

// ==========================================
// BESPOKE CHECKOUT MODAL (REPLACING ALERTS)
// ==========================================
window.triggerDemoCheckout = function() {
  closeCartDrawer();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  let modal = document.getElementById('demo-order-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'demo-order-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300';
    document.body.appendChild(modal);
  }

  const orderNum = 'KURA-' + Math.floor(100000 + Math.random() * 900000);

  modal.innerHTML = `
    <div class="relative w-full max-w-lg bg-[#14100E] border border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl animate-fade-in text-white">
      <div class="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-5 shadow-lg">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <span class="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] tracking-widest uppercase mb-3">
        Demo Order Simulation Successful
      </span>

      <h3 class="font-serif text-3xl font-bold text-white mb-2">Order Confirmed</h3>
      <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
        Reference: <span class="font-mono text-amber-300 font-bold">#${orderNum}</span> • ${itemsCount} items (${cart.length > 0 ? cart[0].name : 'Micro-Lot'} ${cart.length > 1 ? `+${cart.length - 1} more` : ''})
      </p>

      <div class="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-left text-xs mb-6 space-y-2.5">
        <div class="flex justify-between text-zinc-300">
          <span>Roastery Dispatch</span>
          <span class="text-amber-300 font-medium">Tuesday Morning NYC Courier</span>
        </div>
        <div class="flex justify-between text-zinc-300">
          <span>Freshness Guarantee</span>
          <span class="text-zinc-100">Within 48h of Roast</span>
        </div>
        <div class="flex justify-between text-zinc-300 border-t border-zinc-800 pt-2 font-bold text-sm">
          <span>Total Billed (Demo)</span>
          <span class="text-amber-400 font-serif text-base">$${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div class="p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl text-[11px] text-zinc-400 mb-6 text-left">
        <strong class="text-amber-300 block mb-0.5">Agency Demo Note:</strong>
        In production, this checkout button seamlessly binds to your preferred gateway—such as Shopify Headless, Stripe Elements, Apple Pay, or Recharge Subscriptions.
      </div>

      <button onclick="closeDemoOrderModal()" class="w-full btn-gold text-xs py-3.5 justify-center font-bold uppercase tracking-wider">
        Continue Browsing Demo
      </button>
    </div>
  `;
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
};

window.closeDemoOrderModal = function() {
  const modal = document.getElementById('demo-order-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

window.triggerDemoLeadSuccess = function(title = 'Request Logged', message = 'Our Roastery Team will reach out within 24 hours.') {
  let modal = document.getElementById('demo-lead-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'demo-lead-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="relative w-full max-w-md bg-[#14100E] border border-amber-500/40 rounded-3xl p-8 text-center shadow-2xl text-white">
      <div class="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      </div>
      <h3 class="font-serif text-2xl font-bold text-white mb-2">${title}</h3>
      <p class="text-xs text-zinc-300 mb-6 leading-relaxed">${message}</p>
      <div class="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] text-zinc-400 mb-6 text-left">
        <span class="text-amber-400 font-semibold block mb-0.5">Demo Prototype:</span>
        Form state captured successfully. In your production build, this connects to Klaviyo, HubSpot, or direct SMS/email triggers.
      </div>
      <button onclick="document.getElementById('demo-lead-modal').classList.add('hidden');" class="w-full btn-gold text-xs py-3 justify-center">
        Done
      </button>
    </div>
  `;
  modal.classList.remove('hidden');
};

// ==========================================
// BULLETPROOF HYPER-MOTION VIDEO LIGHTBOX
// ==========================================
window.openVideoLightbox = function(videoUrl, title = 'Hyper-Motion Feature') {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('modal-video-player');
  const titleEl = document.getElementById('modal-video-title');
  const fallbackEl = document.getElementById('modal-video-fallback');

  if (titleEl) titleEl.textContent = title;
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');
  }

  if (videoEl) {
    // Reset video state
    videoEl.classList.remove('hidden');
    if (fallbackEl) fallbackEl.classList.add('hidden');

    // Safe direct source assignment
    videoEl.src = videoUrl;
    videoEl.load();

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay muted fallback if browser blocks unmuted sound
        videoEl.muted = true;
        videoEl.play().catch(() => {
          showVideoSimulationFallback();
        });
      });
    }

    videoEl.onerror = function() {
      showVideoSimulationFallback();
    };
  } else {
    showVideoSimulationFallback();
  }
};

function showVideoSimulationFallback() {
  const videoEl = document.getElementById('modal-video-player');
  const fallbackEl = document.getElementById('modal-video-fallback');
  if (videoEl) videoEl.classList.add('hidden');
  if (fallbackEl) fallbackEl.classList.remove('hidden');
}

window.closeVideoLightbox = function() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('modal-video-player');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }
};

// Toast Notification
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.className = 'bg-stone-900 border border-amber-500/30 text-amber-100 text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto';
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Mobile Menu Toggle
window.toggleMobileMenu = function() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeVideoLightbox();
      closeDemoOrderModal();
    }
  });
});
