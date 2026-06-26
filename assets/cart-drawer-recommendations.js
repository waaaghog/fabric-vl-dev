/**
 * cart-drawer-recommendations.js
 *
 * Custom element that fetches Shopify product recommendations and renders
 * simple product cards inside the cart drawer's "You may also like" panel.
 *
 * Attributes:
 *   data-product-id  - Shopify product ID to base recommendations on
 *   data-currency    - ISO currency code (e.g. "USD") for price formatting
 */

/**
 * Parses the total cart item count from a Shopify-rendered section HTML string.
 * @param {Record<string, string>} sections
 * @param {string | null | undefined} sectionId
 * @returns {number}
 */
function parseItemCount(sections, sectionId) {
  const html = sectionId ? sections?.[sectionId] : null;
  if (!html) return 0;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const countElement = /** @type {HTMLElement | null} */ (doc.querySelector('.cart-bubble__text-count'));
  return parseInt(countElement?.dataset.cartCountValue ?? countElement?.textContent?.trim() ?? '0', 10) || 0;
}

class CartDrawerRec extends HTMLElement {
  connectedCallback() {
    let { productId, currency = 'USD' } = this.dataset;
    /*if (!productId) {
      try {
        const viewed = JSON.parse(window.localStorage.getItem('viewedProducts') || '[]');
        productId = viewed[0]?.toString() || '';
      } catch (e) {}
    }*/
    /*if (!productId) {
		fetch('/collections/all/products.json?view=recommended&limit=1')
		.then((r) => (r.ok ? r.text() : Promise.reject()))
		.then((html) => {
			if (!html || !html.trim()) {
				this.#hide();
				return;
			}
			this.innerHTML = html;
		});
    }*/
    if (productId)
	{
		fetch(`/recommendations/products.json?product_id=${productId}&limit=12&intent=related`)
		.then((r) => (r.ok ? r.json() : Promise.reject()))
		.then(({ products }) => {
			if (!products?.length) {
				this.#hide();
				return;
			}
			this.innerHTML = /** @type {any[]} */ (products).map((p) => this.#renderCard(p, currency)).join('');
		})
		.catch(() => this.#hide());
	}
	else //no product in cart yet.
	{
		fetch(`/collections/all/products.json?view=recommended&limit=12`)
		.then((r) => (r.ok ? r.json() : Promise.reject()))
		.then(({ products }) => {
			if (!products?.length) {
				this.#hide();
				return;
			}
			this.innerHTML = /** @type {any[]} */ (products).map((p) => this.#renderCard(p, currency)).join('');
		});
	}
    this.addEventListener('click', this.#handleClick);
  }

  /** @param {Event} event */
  #handleClick = (event) => {
    const btn = /** @type {HTMLButtonElement | null} */ (/** @type {Element} */ (event.target).closest('[data-action="rec-add"]'));
    if (!btn) return;
    event.preventDefault();
    this.#addToCart(btn);
  };

  /** @param {HTMLButtonElement} btn */
  async #addToCart(btn) {
    const variantId = btn.dataset.variantId;
    if (!variantId || btn.disabled) return;
    btn.disabled = true;
    btn.dataset.state = 'loading';
    try {
      const sectionId = /** @type {HTMLElement | null} */ (document.querySelector('cart-items-component[data-drawer]'))?.dataset.sectionId;
      /** @type {Record<string, unknown>} */
      const body = { id: Number(variantId), quantity: 1 };
      if (sectionId) body.sections = sectionId;
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      btn.dataset.state = 'added';
      const sections = data.sections ?? {};
      const cart = await fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json());
      document.dispatchEvent(new CustomEvent('cart:update', {
        bubbles: true,
        detail: { cart, resource: cart, data: { sections, itemCount: cart.item_count ?? parseItemCount(sections, sectionId) } },
      }));
      setTimeout(() => { delete btn.dataset.state; btn.disabled = false; }, 1500);
    } catch {
      delete btn.dataset.state;
      btn.disabled = false;
    }
  }

  #hide() {
    this.closest('.sleek-cart-drawer__rec-panel')?.remove();
    // Shrink the dialog back to sidebar-only width
    this.closest('[class*="cart-recommendations"]')
      ?.classList.remove('cart-recommendations');
  }

  /**
   * @param {number} cents
   * @param {string} currency
   */
  #formatMoney(cents, currency) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  }

  /**
   * @param {any} product
   * @param {string} currency
   */
  #renderCard(product, currency) {
    const variant = product.variants?.[0];
    const price = variant?.price != null ? this.#formatMoney(variant.price, currency) : '';
    const comparePrice =
      variant?.compare_at_price > variant?.price
        ? this.#formatMoney(variant.compare_at_price, currency)
        : null;
    const imgRaw = product.featured_image ? product.featured_image : product.images[0];
    const imgUrl = imgRaw ? (typeof imgRaw === 'string' ? imgRaw : imgRaw.src) : '';
    const imgSrc = imgUrl ? imgUrl.replace(/\?.*$/, '') + '?v=' + (imgUrl.match(/[?&]v=(\d+)/)?.[1] ?? '') + '&width=250' : '';
    const title = product.title.replace(/"/g, '&quot;');
    const url = `/products/${product.handle}`;
    const isMultiVariant = (product.variants?.length ?? 1) > 1;
    const available = variant?.available === true;

    const bagIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M14.608 12.563v5m2.5-2.5h-5"/></svg>`;

    let btnHtml = '';
    if (!isMultiVariant && available && variant?.id) {
      btnHtml = `<button class="cart-rec-card__btn" data-action="rec-add" data-variant-id="${variant.id}" aria-label="Add to cart">${bagIcon}</button>`;
    } else if (isMultiVariant) {
      btnHtml = `<a href="${url}" class="cart-rec-card__btn" aria-label="View options">${bagIcon}</a>`;
    }

    return `
      <div class="cart-rec-card">
        <div class="cart-rec-card__media">
          <a href="${url}" class="cart-rec-card__img-link">
            <div class="cart-rec-card__img">
              ${imgSrc ? `<img src="${imgSrc}" alt="${title}" loading="lazy" width="80" height="80">` : ''}
              ${comparePrice ? '<span class="cart-rec-card__badge">Sale</span>' : ''}
            </div>
          </a>
          ${btnHtml}
        </div>
        <div class="cart-rec-card__info">
          <a href="${url}" class="cart-rec-card__title-link">
            <p class="cart-rec-card__title">${product.title}</p>
          </a>
          <p class="cart-rec-card__price">
            ${comparePrice ? `<s class="cart-rec-card__compare">${comparePrice}</s> ` : ''}${price}
          </p>
        </div>
      </div>`;
  }
}

customElements.define('cart-drawer-rec', CartDrawerRec);

class CartDrawerRecent extends HTMLElement {
  connectedCallback() {
    const { excludeId } = this.dataset;

    /** @type {any[]} */
    let items = [];
    try {
      items = JSON.parse(window.localStorage.getItem('viewedProducts') || '[]');
    } catch (e) {}

    if (excludeId) {
      items = items.filter((id) => id.toString() !== excludeId.toString());
    }

    if (!items.length) {
      this.#hide();
      return;
    }

    this.addEventListener('click', this.#handleClick);

    items = items.slice(0, 5);
    const queryParams = items.map((id) => 'id:' + id).join(' OR ');

    fetch(`/search/suggest.json?q=${encodeURIComponent(queryParams)}&resources[type]=product`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        const products = data.resources?.results?.products || [];
        if (!products.length) {
          this.#hide();
          return;
        }

        /** @type {any[]} */
        const orderedProducts = [];
        items.forEach((id) => {
          const match = products.find((p) => p.id.toString() === id.toString());
          if (match) orderedProducts.push(match);
        });

        if (!orderedProducts.length) {
          this.#hide();
          return;
        }

        this.innerHTML = orderedProducts.map((p) => this.#renderCard(p)).join('');
      })
      .catch(() => this.#hide());
  }

  /** @param {Event} event */
  #handleClick = (event) => {
    const btn = /** @type {HTMLButtonElement | null} */ (/** @type {Element} */ (event.target).closest('[data-action="rec-add"]'));
    if (!btn) return;
    event.preventDefault();
    this.#addToCart(btn);
  };

  /** @param {HTMLButtonElement} btn */
  async #addToCart(btn) {
    const handle = btn.dataset.handle;
    if (!handle || btn.disabled) return;
    btn.disabled = true;
    btn.dataset.state = 'loading';
    try {
      const productRes = await fetch(`/products/${handle}.js`);
      if (!productRes.ok) throw new Error();
      const product = await productRes.json();
      const variant = product.variants?.[0];
      if (!variant?.id || !variant?.available) {
        window.location.href = `/products/${handle}`;
        return;
      }
      const sectionId = /** @type {HTMLElement | null} */ (document.querySelector('cart-items-component[data-drawer]'))?.dataset.sectionId;
      /** @type {Record<string, unknown>} */
      const body = { id: variant.id, quantity: 1 };
      if (sectionId) body.sections = sectionId;
      const addRes = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        body: JSON.stringify(body),
      });
      if (!addRes.ok) throw new Error();
      const data = await addRes.json();
      btn.dataset.state = 'added';
      const sections = data.sections ?? {};
      const cart = await fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } }).then(r => r.json());
      document.dispatchEvent(new CustomEvent('cart:update', {
        bubbles: true,
        detail: { cart, resource: cart, data: { sections, itemCount: cart.item_count ?? parseItemCount(sections, sectionId) } },
      }));
      setTimeout(() => { delete btn.dataset.state; btn.disabled = false; }, 1500);
    } catch {
      delete btn.dataset.state;
      btn.disabled = false;
    }
  }

  #hide() {
    const tabBtn = document.getElementById('rec-tab-btn-recent');
    const tabPanel = document.getElementById('rec-tab-recent');
    if (tabBtn) {
      tabBtn.style.display = 'none';
      if (tabBtn.getAttribute('aria-selected') === 'true') {
        document.getElementById('rec-tab-btn-recommendations')?.click();
      }
    }
    if (tabPanel) {
      tabPanel.hidden = true;
      tabPanel.classList.remove('is-active');
    }
  }

  /** @param {any} product */
  #renderCard(product) {
    const price = product.price || '';
    const comparePrice = product.compare_at_price_min;
    const variantsCount = Number(product.variants_count) || 1;
    const isMultiVariant = variantsCount > 1;
    const url = product.url;

    let imgSrc = product.image || '';
    if (imgSrc && !imgSrc.includes('width=')) {
      imgSrc += imgSrc.includes('?') ? '&width=250' : '?width=250';
    }

    const title = product.title.replace(/"/g, '&quot;');

    const bagIcon = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16.608 9.421V6.906H3.392v8.016c0 .567.224 1.112.624 1.513.4.402.941.627 1.506.627H8.63M8.818 3h2.333c.618 0 1.212.247 1.649.686a2.35 2.35 0 0 1 .683 1.658v1.562H6.486V5.344c0-.622.246-1.218.683-1.658A2.33 2.33 0 0 1 8.82 3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M14.608 12.563v5m2.5-2.5h-5"/></svg>`;

    let btnHtml = '';
    if (isMultiVariant) {
      btnHtml = `<a href="${url}" class="cart-rec-card__btn" aria-label="View options">${bagIcon}</a>`;
    } else {
      btnHtml = `<button class="cart-rec-card__btn" data-action="rec-add" data-handle="${product.handle}" aria-label="Add to cart">${bagIcon}</button>`;
    }

    return `
      <div class="cart-rec-card">
        <div class="cart-rec-card__media">
          <a href="${url}" class="cart-rec-card__img-link">
            <div class="cart-rec-card__img">
              ${imgSrc ? `<img src="${imgSrc}" alt="${title}" loading="lazy" width="80" height="80">` : ''}
              ${comparePrice > price ? '<span class="cart-rec-card__badge">Sale</span>' : ''}
            </div>
          </a>
          ${btnHtml}
        </div>
        <div class="cart-rec-card__info">
          <a href="${url}" class="cart-rec-card__title-link">
            <p class="cart-rec-card__title">${product.title}</p>
          </a>
          <p class="cart-rec-card__price">
            ${comparePrice > price ? `<s class="cart-rec-card__compare">${comparePrice}</s> ` : ''}${price}
          </p>
        </div>
      </div>`;
  }
}

customElements.define('cart-drawer-recent', CartDrawerRecent);

class RecTabsController extends HTMLElement {
  constructor() {
    super();
    this.buttons = this.querySelectorAll('[role="tab"]');
    this.buttons.forEach((btn) => btn.addEventListener('click', this.#onTabClick.bind(this)));
  }

  /** @param {Event} event */
  #onTabClick(event) {
    const clickedTab = /** @type {HTMLElement} */ (event.currentTarget);
    if (clickedTab.getAttribute('aria-selected') === 'true') return;

    this.buttons.forEach((btn) => {
      btn.setAttribute('aria-selected', 'false');
      btn.classList.remove('is-active');
      const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
      if (panel) {
        panel.hidden = true;
        panel.classList.remove('is-active');
      }
    });

    clickedTab.setAttribute('aria-selected', 'true');
    clickedTab.classList.add('is-active');

    const targetPanel = document.getElementById(clickedTab.getAttribute('aria-controls') ?? '');
    if (targetPanel) {
      targetPanel.hidden = false;
      targetPanel.classList.add('is-active');
    }
  }
}

customElements.define('rec-tabs-controller', RecTabsController);
