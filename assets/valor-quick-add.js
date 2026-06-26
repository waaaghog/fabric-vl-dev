/* ── Quick View dialog (shared across all pages) ───────── */
if (!window._quickViewDialogHandler) {
  window._quickViewDialogHandler = true;
  window.openQuickViewDialog = async function(productUrl) {
    if (!productUrl) return;
    const dialogEl = document.getElementById('quick-add-dialog');
    if (!dialogEl) return;
    const modalContent = document.getElementById('quick-add-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = '<div class="quick-add-modal__loading" role="status" aria-label="Loading"></div>';
    dialogEl.showDialog();

    try {
      const response = await fetch(productUrl);
      if (!response.ok) { modalContent.innerHTML = ''; return; }
      const text = await response.text();
      const doc  = new DOMParser().parseFromString(text, 'text/html');
      const grid = doc.querySelector('[data-product-grid-content]');
      if (!grid) { modalContent.innerHTML = ''; return; }
      modalContent.innerHTML = '';
      modalContent.appendChild(document.adoptNode(grid));
      // Gallery thumbnails
      var mainImgEl = modalContent.querySelector('.vp-main-img');
      var heroImg   = modalContent.querySelector('.vp-hero-img');
      var imgCurEl  = modalContent.querySelector('.vp-image-current');
      var images = [];
      try { images = JSON.parse((mainImgEl && mainImgEl.dataset.images) || '[]'); } catch(_) {}
      var currentIdx = 0;
      function goToImage(idx) {
        if (idx < 0 || idx >= images.length) return;
        currentIdx = idx;
        var img = images[idx];
        if (heroImg) { heroImg.src = img.src; heroImg.alt = img.alt; heroImg.dataset.fullSrc = img.fullSrc; }
        if (imgCurEl) imgCurEl.textContent = idx + 1;
        var activeThumb;
        modalContent.querySelectorAll('.vp-thumb').forEach(function(b) {
          var isActive = parseInt(b.dataset.idx) === idx + 1;
          b.classList.toggle('active', isActive);
          if (isActive) activeThumb = b;
        });
        if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        var prev = modalContent.querySelector('.vp-arrow-prev');
        var next = modalContent.querySelector('.vp-arrow-next');
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx === images.length - 1;
      }
      modalContent.querySelectorAll('.vp-thumb').forEach(function(btn) {
        btn.addEventListener('click', function() { goToImage(parseInt(btn.dataset.idx) - 1); });
      });
      var prevBtn = modalContent.querySelector('.vp-arrow-prev');
      var nextBtn = modalContent.querySelector('.vp-arrow-next');
      if (prevBtn) prevBtn.addEventListener('click', function() { goToImage(currentIdx - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function() { goToImage(currentIdx + 1); });
      // Notify me
      modalContent.querySelectorAll('.vp-notify').forEach(function(btn) {
        btn.addEventListener('click', function() { btn.innerHTML = '\u2713 Subscribed'; btn.classList.add('subscribed'); });
      });
      window._pcqvAtcManager?._sync();
    } catch (err) {
      modalContent.innerHTML = '';
      console.error('[openQuickViewDialog]', err);
    }
  };
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-quick-view-url]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    window.openQuickViewDialog(btn.dataset.quickViewUrl);
  });
}

/* ── Sync cart qty when theme injects into quick-add modal ── */
if (!window._vqaModalSync) {
  window._vqaModalSync = true;
  const content = document.getElementById('quick-add-modal-content');
  if (content) {
    new MutationObserver((mutations) => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        window._pcqvAtcManager?._sync();
      }
    }).observe(content, { childList: true });
  }
}

/* ── Accordion in quick-add modal (delegated – works for all entry paths) ── */
if (!window._vqaAccordion) {
  window._vqaAccordion = true;
  document.addEventListener('click', function(e) {
    const head = e.target.closest('#quick-add-modal-content .vp-accordion-head');
    if (!head) return;
    const item = head.closest('[data-acc]');
    if (item) item.classList.toggle('open');
  });
}

/* ── Modal gallery arrows (delegated, for mobile quick-add) ── */
if (!window._vqaModalArrows) {
  window._vqaModalArrows = true;
  document.addEventListener('click', function(e) {
    const arrow = e.target.closest('#quick-add-modal-content .vp-arrow');
    if (!arrow) return;
    const mainImg = arrow.closest('.vp-main-img');
    if (!mainImg) return;

    let images = [];
    try { images = JSON.parse(mainImg.dataset.images || '[]'); } catch(_) {}
    if (!images.length) return;

    let idx = parseInt(mainImg.dataset.currentIdx || '0');
    if (arrow.classList.contains('vp-arrow-prev')) idx = Math.max(0, idx - 1);
    else idx = Math.min(images.length - 1, idx + 1);
    mainImg.dataset.currentIdx = idx;

    const heroImg = mainImg.querySelector('img');
    if (heroImg) { heroImg.src = images[idx].src; heroImg.alt = images[idx].alt || ''; heroImg.dataset.fullSrc = images[idx].fullSrc; }

    const countEl = mainImg.querySelector('.vp-image-count span');
    if (countEl) countEl.textContent = idx + 1;

    const prev = mainImg.querySelector('.vp-arrow-prev');
    const next = mainImg.querySelector('.vp-arrow-next');
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === images.length - 1;
  });
}

/* ── Quick View mode ───────────────────────────────────── */
if (!window._pcqvQvDelegated) {
  window._pcqvQvDelegated = true;
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.pcqv[data-mode="quick_view"] .pcqv__btn');
    if (!btn) return;
    const card = btn.closest('product-card');
    const trigger =
      card && (
        card.querySelector('.quick-add__button--choose') ||
        card.querySelector('.quick-add__button--add')
      );
    if (trigger) trigger.click();
  });
}

/* ── Shared lightbox (PDP + quick-add modal) ───────────── */
if (!window._vqaLightbox) {
  window._vqaLightbox = true;

  const lb = document.createElement('dialog');
  lb.style.cssText = 'padding:0;border:none;background:rgba(0,0,0,0.88);width:100vw;height:100vh;max-width:100vw;max-height:100vh;margin:0;align-items:center;justify-content:center;cursor:zoom-out;';
  const lbSpinner = document.createElement('div');
  lbSpinner.style.cssText = 'position:absolute;width:40px;height:40px;border:3px solid rgba(255,255,255,0.2);border-top-color:#fff;border-radius:50%;animation:vqaLbSpin 0.7s linear infinite;display:none;';
  const lbImg = document.createElement('img');
  lbImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:10px;cursor:zoom-out;display:none;';
  lb.appendChild(lbSpinner);
  lb.appendChild(lbImg);
  document.body.appendChild(lb);
  const lbStyle = document.createElement('style');
  lbStyle.textContent = '@keyframes vqaLbSpin{to{transform:rotate(360deg)}}';
  document.head.appendChild(lbStyle);

  function lbOpen(src, alt) {
    lbImg.src = '';
    lbImg.style.display = 'none';
    lbSpinner.style.display = 'block';
    lb.style.display = 'flex';
    lb.showModal();
    lbImg.alt = alt || '';
    lbImg.onload = function() { lbSpinner.style.display = 'none'; lbImg.style.display = 'block'; };
    lbImg.onerror = function() { lbSpinner.style.display = 'none'; };
    lbImg.src = src.replace(/width=\d+/, 'width=1800');
  }
  function lbClose() {
    lb.close();
    lb.style.display = '';
    lbImg.src = '';
  }

  document.addEventListener('click', function(e) {
    if (lb.open) { lbClose(); return; }
    const galleryImg = e.target.closest('#quick-add-modal-content .vp-all-img img');
    if (galleryImg) { e.preventDefault(); lbOpen(galleryImg.src); return; }
    const thumb = e.target.closest('.vp-variant-thumb[data-full-src]');
    if (thumb) { e.preventDefault(); lbOpen(thumb.dataset.fullSrc, thumb.querySelector('img')?.alt); return; }
    const heroImg = e.target.closest('.vp-main-img img[data-full-src]');
    if (heroImg) { e.preventDefault(); lbOpen(heroImg.dataset.fullSrc, heroImg.alt); }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lb.open) lbClose();
  });
}

/* ── Add to Cart mode ──────────────────────────────────── */
if (!window._pcqvAtcManager) {
  window._pcqvAtcManager = new (class {
    constructor() {
      this._cart = [];
      this._sync().then(() => this._bind());
    }

    /* Fetch cart and update all ATC blocks on the page */
    async _sync() {
      try {
        const res = await fetch('/cart.js');
        this._cartData = await res.json();
        this._cart = this._cartData.items;
        document.querySelectorAll('.pcqv[data-mode="add_to_cart"]').forEach(block => {
          const id = parseInt(block.dataset.variantId);
          const item = this._cart.find(i => i.variant_id === id);
          this._render(block, item ? item.quantity : 0);
        });
      } catch (_) {}
    }

    /* Notify the theme's cart components to re-render */
    _notifyCart() {
      document.dispatchEvent(new CustomEvent('cart:update', {
        bubbles: true,
        detail: { cart: this._cartData || {}, resource: this._cartData || {}, sourceId: '', data: { itemCount: (this._cartData || {}).item_count ?? 0 } }
      }));
    }

    _render(block, qty) {
      const btn   = block.querySelector('.pcqv__btn');
      const stepper = block.querySelector('.pcqv__qty');
      const input = block.querySelector('.pcqv__qty-input');
      if (!btn || !stepper || !input) return;
      btn.hidden     = qty > 0;
      stepper.hidden = qty <= 0;
      input.value    = qty;
    }

    _bind() {
      document.addEventListener('click', async (e) => {
        /* ATC button */
        const atcBtn = e.target.closest('.pcqv[data-mode="add_to_cart"] .pcqv__btn');
        if (atcBtn) {
          const block = atcBtn.closest('.pcqv');
          await this._setQty(block, parseInt(block.dataset.variantId), 1);
          return;
        }

        /* +/- stepper buttons */
        const stepBtn = e.target.closest('.pcqv[data-mode="add_to_cart"] .pcqv__qty-btn');
        if (stepBtn) {
          const block = stepBtn.closest('.pcqv');
          const input = block.querySelector('.pcqv__qty-input');
          const current = parseInt(input.value) || 0;
          const direction = stepBtn.dataset.action === 'increase' ? 'up' : 'down';
          const next = stepBtn.dataset.action === 'increase'
            ? current + 1
            : Math.max(0, current - 1);
          stepBtn.dataset.spinning = '';
          await this._setQty(block, parseInt(block.dataset.variantId), next, direction);
          delete stepBtn.dataset.spinning;
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const input = e.target.closest('.pcqv[data-mode="add_to_cart"] .pcqv__qty-input');
        if (!input) return;
        e.preventDefault();
        input.blur();
      });

      document.addEventListener('focusout', async (e) => {
        const input = e.target.closest('.pcqv[data-mode="add_to_cart"] .pcqv__qty-input');
        if (!input) return;
        /* Skip if focus moved to a +/- button — that click handler will commit */
        if (e.relatedTarget?.closest('.pcqv__qty-btn')) return;
        await this._commitInput(input);
      });
    }

    async _commitInput(input) {
      const block = input.closest('.pcqv');
      const variantId = parseInt(block.dataset.variantId);
      const newQty = Math.max(0, parseInt(input.value) || 0);
      const current = this._cart.find(i => i.variant_id === variantId)?.quantity || 0;
      if (newQty === current) { input.value = current; return; }
      const spinBtns = block.querySelectorAll('.pcqv__qty-btn');
      spinBtns.forEach(b => { b.dataset.spinning = ''; });
      await this._setQty(block, variantId, newQty, newQty > current ? 'up' : 'down');
      spinBtns.forEach(b => { delete b.dataset.spinning; });
    }

    async _setQty(block, variantId, quantity, direction = null) {
      const isNewAdd = !this._cart.find(i => i.variant_id === variantId) && quantity > 0;
      block.classList.add('pcqv--loading');
      const btn = block.querySelector('.pcqv__btn');
      if (btn) btn.dataset.loading = '';
      try {
        const existing = this._cart.find(i => i.variant_id === variantId);
        if (!existing && quantity > 0) {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity })
          });
        } else if (existing) {
          await fetch('/cart/change.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: existing.key, quantity })
          });
        }
        await this._sync();
        this._notifyCart();
      } catch (_) {
        await this._sync();
      } finally {
        block.classList.remove('pcqv--loading');
        if (btn) delete btn.dataset.loading;
      }
      if (!isNewAdd && quantity > 0 && direction) {
        const input = block.querySelector('.pcqv__qty-input');
        input.removeAttribute('data-slide');
        void input.offsetWidth; // force reflow to restart animation
        input.setAttribute('data-slide', direction);
        input.addEventListener('animationend', () => input.removeAttribute('data-slide'), { once: true });
      }
      if (isNewAdd) {
        const btn = block.querySelector('.pcqv__btn');
        const stepper = block.querySelector('.pcqv__qty');
        btn.hidden = false;
        if (stepper) stepper.hidden = true;
        btn.dataset.added = 'true';
        await new Promise(r => setTimeout(r, 1200));
        delete btn.dataset.added;
        const item = this._cart.find(i => i.variant_id === variantId);
        this._render(block, item ? item.quantity : 0);
      }
    }
  })();
}
