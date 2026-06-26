/*
 * Valor product card — qty stepper + add-to-cart controller.
 * Ported from the {% javascript %} in blocks/valor-qty-add.liquid so the standalone
 * snippets/valor-product-card.liquid (used on collection + search) keeps working
 * without the block. Idempotent via the window._vqaAtcManager guard, so it safely
 * coexists if the block ever renders on the same page.
 */
if (!window._vqaAtcManager) {
  window._vqaAtcManager = new (class {
    constructor() {
      this._inFlight = new WeakSet();
      this._bind();
      this._initCart();
      window.__valorProductCardMarkAdded = (target, qty) => this.markAdded(target, qty);
    }

    _bind() {
      document.addEventListener('click', (e) => {
        /* +/- qty buttons */
        const qtyBtn = e.target.closest('.vqa .vqa__qty-btn');
        if (qtyBtn) {
          const input = qtyBtn.closest('.vqa')?.querySelector('.vqa__qty-input');
          if (!input) return;
          const min = Number.isNaN(parseInt(input.min)) ? 0 : parseInt(input.min);
          const cur = Number.isNaN(parseInt(input.value)) ? min : parseInt(input.value);
          input.value = qtyBtn.dataset.action === 'increase'
            ? cur + 1
            : Math.max(min, cur - 1);
          return;
        }

        /* ATC button */
        const atcBtn = e.target.closest('.vqa .vqa__btn');
        if (atcBtn) this._add(atcBtn);
      });

      document.addEventListener('cart:update', (e) => {
        const cart = e.detail?.cart || e.detail?.resource;
        if (cart) this._updateInfo(cart);
        else fetch('/cart.js').then(r => r.json()).then(c => this._updateInfo(c));
      });
    }

    _initCart() {
      fetch('/cart.js').then(r => r.json()).then(c => this._updateInfo(c));
    }

    _updateInfo(cart) {
      document.querySelectorAll('.vqa-wrap[data-variant-id]').forEach(wrap => {
        const variantId = parseInt(wrap.dataset.variantId);
        const cartEl = wrap.querySelector('.vqa-info__cart');
        if (!cartEl) return;
        const item = cart.items?.find(i => i.variant_id === variantId);
        if (item && item.quantity > 0) {
          cartEl.textContent = item.quantity + ' in cart';
          cartEl.removeAttribute('hidden');
        } else {
          cartEl.setAttribute('hidden', '');
        }
      });
    }

    markAdded(target, qty) {
      const wrap = target?.closest?.('.vqa-wrap') || target;
      if (!wrap) return;

      const card = wrap.closest('.vpc-card, .product-card, product-card');
      if (card) {
        card.classList.add('vpc-card--just-added', 'just-added');
      }

      const atcBtn = wrap.querySelector('.vqa__btn');
      if (atcBtn) {
        const label = atcBtn.querySelector('.vpc-add__label, .vqa__label');
        if (label) {
          if (!atcBtn.dataset.defaultLabel) atcBtn.dataset.defaultLabel = label.textContent.trim();
          label.textContent = 'Added · ' + qty;
        }
        delete atcBtn.dataset.loading;
        atcBtn.dataset.added = '';
        atcBtn.disabled = true;
      }

      const input = wrap.querySelector('.vqa__qty-input');
      if (input) {
        input.value = '';
        input.setAttribute('readonly', 'true');
        input.classList.add('vqa__qty-input--added');
      }
    }

    async _add(atcBtn) {
      const block = atcBtn.closest('.vqa');
      if (!block || this._inFlight.has(block)) return;

      const variantId = parseInt(block.dataset.variantId);
      const qty = Math.max(1, parseInt(block.querySelector('.vqa__qty-input')?.value) || 1);
      const body = { id: variantId, quantity: qty };

      this._inFlight.add(block);
      block.classList.add('vqa--loading');
      atcBtn.dataset.loading = '';

      try {
        const addRes = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!addRes.ok) return;

        const cartData = await (await fetch('/cart.js')).json();
        document.dispatchEvent(new CustomEvent('cart:update', {
          bubbles: true,
          detail: { cart: cartData, resource: cartData, sourceId: '', data: { itemCount: cartData.item_count ?? 0 } }
        }));

        delete atcBtn.dataset.loading;
        this.markAdded(block, qty);
        block.closest('.vqa-wrap')?.querySelector('.vqa__qty-input')?.dispatchEvent(new Event('input', { bubbles: true }));
      } catch (_) {
      } finally {
        delete atcBtn.dataset.loading;
        block.classList.remove('vqa--loading');
        this._inFlight.delete(block);
      }
    }
  })();
}
