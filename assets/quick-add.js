import { morph } from '@theme/morph';
import { Component } from '@theme/component';
import { CartUpdateEvent, ThemeEvents, VariantSelectedEvent } from '@theme/events';
import { DialogComponent, DialogCloseEvent } from '@theme/dialog';
import { mediaQueryLarge, isMobileBreakpoint, getIOSVersion } from '@theme/utilities';
import VariantPicker from '@theme/variant-picker';

export class QuickAddComponent extends Component {
  /** @type {AbortController | null} */
  #abortController = null;
  /** @type {Map<string, Element>} */
  #cachedContent = new Map();
  /** @type {AbortController} */
  #cartUpdateAbortController = new AbortController();
  /** @type {AbortController | null} */
  #popupAbortController = null;

  get productPageUrl() {
    const productCard = /** @type {import('./product-card').ProductCard | null} */ (this.closest('product-card'));
    const hotspotProduct = /** @type {import('./product-hotspot').ProductHotspotComponent | null} */ (
      this.closest('product-hotspot-component')
    );
    const productLink = productCard?.getProductCardLink() || hotspotProduct?.getHotspotProductLink();

    const rawHref = productLink?.href || productLink?.getAttribute('xhref') || '';
    if (!rawHref) return '';

    const url = new URL(rawHref, window.location.origin);

    if (url.searchParams.has('variant')) {
      return url.toString();
    }

    const selectedVariantId = this.#getSelectedVariantId();
    if (selectedVariantId) {
      url.searchParams.set('variant', selectedVariantId);
    }

    return url.toString();
  }

  /**
   * Gets the currently selected variant ID from the product card
   * @returns {string | null} The variant ID or null
   */
  #getSelectedVariantId() {
    const productCard = /** @type {import('./product-card').ProductCard | null} */ (this.closest('product-card'));
    return productCard?.getSelectedVariantId() || null;
  }

  connectedCallback() {
    super.connectedCallback();

    mediaQueryLarge.addEventListener('change', this.#closeQuickAddModal);
    document.addEventListener(ThemeEvents.cartUpdate, this.#handleCartUpdate, {
      signal: this.#cartUpdateAbortController.signal,
    });
    document.addEventListener(ThemeEvents.variantSelected, this.#updateQuickAddButtonState.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    mediaQueryLarge.removeEventListener('change', this.#closeQuickAddModal);
    this.#abortController?.abort();
    this.#cartUpdateAbortController.abort();
    this.#popupAbortController?.abort();
    document.removeEventListener(ThemeEvents.variantSelected, this.#updateQuickAddButtonState.bind(this));
  }

  /**
   * Clears the cached content when cart is updated
   */
  #handleCartUpdate = () => {
    this.#cachedContent.clear();
  };

  /**
   * Re-renders the variant picker in the quick-add modal.
   * @param {Element} newHtml - The element to re-render.
   */
  #updateVariantPicker(newHtml) {
    const modalContent = document.getElementById('quick-add-modal-content');
    if (!modalContent) return;
    const variantPicker = /** @type {VariantPicker | null} */ (modalContent.querySelector('variant-picker'));
    if (!variantPicker) return;
    variantPicker.updateVariantPicker(newHtml);
  }

  /**
   * Handles quick add button click
   * @param {Event} event - The click event
   */
  handleClick = async (event) => {
    event.preventDefault();

    if (this.dataset.mode === 'quick_add') {
      this.#toggleVariantPopup();
      return;
    }

    const currentUrl = this.productPageUrl;

    // Check if we have cached content for this URL
    let productGrid = this.#cachedContent.get(currentUrl);

    if (productGrid) {
      // Cached — update modal content then open instantly
      const freshContent = /** @type {Element} */ (productGrid.cloneNode(true));
      await this.updateQuickAddModal(freshContent);
      this.#updateVariantPicker(productGrid);
      this.#openQuickAddModal();
    } else {
      // Not cached — show spinner on button, fetch in background, then open modal
      this.setAttribute('loading', '');
      this.toggleAttribute('stay-visible', true);

      try {
        const html = await this.fetchProductPage(currentUrl);
        if (html) {
          const gridElement = html.querySelector('[data-product-grid-content]');
          if (gridElement) {
            productGrid = /** @type {Element} */ (gridElement.cloneNode(true));
            this.#cachedContent.set(currentUrl, productGrid);

            const freshContent = /** @type {Element} */ (productGrid.cloneNode(true));
            this.#showLoadingState();
            this.#openQuickAddModal();
            await this.updateQuickAddModal(freshContent);
            this.#updateVariantPicker(productGrid);
          }
        }
      } finally {
        this.removeAttribute('loading');
        this.toggleAttribute('stay-visible', false);
      }
    }
  };

  #showLoadingState() {
    const modalContent = document.getElementById('quick-add-modal-content');
    if (!modalContent) return;
    modalContent.innerHTML = '<div class="quick-add-modal__loading" role="status" aria-label="Loading"></div>';
  }

  #resetScroll() {
    const dialogComponent = document.getElementById('quick-add-dialog');
    if (!(dialogComponent instanceof QuickAddDialog)) return;

    const productDetails = dialogComponent.querySelector('.product-details');
    const productMedia = dialogComponent.querySelector('.product-information__media');
    productDetails?.scrollTo({ top: 0, behavior: 'instant' });
    productMedia?.scrollTo({ top: 0, behavior: 'instant' });
  }

  /** @param {QuickAddDialog} dialogComponent */
  #stayVisibleUntilDialogCloses(dialogComponent) {
    this.toggleAttribute('stay-visible', true);

    dialogComponent.addEventListener(DialogCloseEvent.eventName, () => this.toggleAttribute('stay-visible', false), {
      once: true,
    });
  }

  #openQuickAddModal = () => {
    const dialogComponent = document.getElementById('quick-add-dialog');
    if (!(dialogComponent instanceof QuickAddDialog)) return;

    this.#stayVisibleUntilDialogCloses(dialogComponent);

    dialogComponent.showDialog();

    // is nondeterministic when the open attribute is set on the dialog element after .showDialog() is called.
    // Waiting until the open animation starts seemed to be the most reliable metric here.
    const dialog = dialogComponent.refs?.dialog;
    if (!dialog) return;
    dialog.addEventListener('animationstart', this.#resetScroll.bind(this), { once: true });
  };

  #closeQuickAddModal = () => {
    const dialogComponent = document.getElementById('quick-add-dialog');
    if (!(dialogComponent instanceof QuickAddDialog)) return;

    dialogComponent.closeDialog();
  };

  #toggleVariantPopup() {
    const popup = this.querySelector('.quick-add__variant-popup');
    if (!popup) return;

    if (popup.hidden) {
      popup.hidden = false;
      this.#popupAbortController = new AbortController();
      document.addEventListener('click', this.#handleOutsideClick, {
        signal: this.#popupAbortController.signal,
      });
    } else {
      this.#closeVariantPopup();
    }
  }

  #closeVariantPopup() {
    const popup = this.querySelector('.quick-add__variant-popup');
    if (popup) popup.hidden = true;
    this.#popupAbortController?.abort();
    this.#popupAbortController = null;
  }

  #handleOutsideClick = (event) => {
    if (event.target instanceof Node && !this.contains(/** @type {Node} */ (event.target))) {
      this.#closeVariantPopup();
    }
  };

  /**
   * Handles variant button click in the inline popup
   * @param {Event} event - The click event
   */
  handleVariantSelect = (event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;

    const variantId = button.dataset.variantId;
    if (!variantId) return;

    this.#closeVariantPopup();

    const variantInput = this.querySelector('input[name="id"]');
    if (variantInput instanceof HTMLInputElement) {
      variantInput.value = variantId;
      variantInput.disabled = button.dataset.variantAvailable === 'false';
    }

    const form = this.querySelector('form[data-type="add-to-cart-form"]');
    if (form instanceof HTMLFormElement) {
      form.requestSubmit();
    }
  };

  /**
   * Fetches the product page content
   * @param {string} productPageUrl - The URL of the product page to fetch
   * @returns {Promise<Document | null>}
   */
  async fetchProductPage(productPageUrl) {
    if (!productPageUrl) return null;

    // We use this to abort the previous fetch request if it's still pending.
    this.#abortController?.abort();
    this.#abortController = new AbortController();

    try {
      const response = await fetch(productPageUrl, {
        signal: this.#abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product page: HTTP error ${response.status}`);
      }

      const responseText = await response.text();
      const html = new DOMParser().parseFromString(responseText, 'text/html');

      return html;
    } catch (error) {
      if (error.name === 'AbortError') {
        return null;
      } else {
        throw error;
      }
    } finally {
      this.#abortController = null;
    }
  }

  /**
   * Re-renders the variant picker.
   * @param {Element} productGrid - The product grid element
   */
  async updateQuickAddModal(productGrid) {
    const modalContent = document.getElementById('quick-add-modal-content');

    if (!productGrid || !modalContent) return;

    if (isMobileBreakpoint()) {
      const productDetails = productGrid.querySelector('.product-details');
      const productFormComponent = productGrid.querySelector('product-form-component');
      const variantPicker = productGrid.querySelector('variant-picker');
      const productPrice = productGrid.querySelector('product-price');

      // Build image slider from all product media images
      const mediaImages = /** @type {HTMLImageElement[]} */ ([
        ...productGrid.querySelectorAll('.product-information__media .product-media__image'),
      ]);

      productGrid.querySelector('.product-information__media')?.remove();
      productDetails?.remove();

      if (mediaImages.length > 0) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('quick-add-mobile-slider-wrapper');

        const slider = document.createElement('div');
        slider.classList.add('quick-add-mobile-slider');

        for (const img of mediaImages) {
          const slide = document.createElement('div');
          slide.classList.add('quick-add-mobile-slider__slide');
          const clonedImg = /** @type {HTMLImageElement} */ (img.cloneNode(true));
          clonedImg.removeAttribute('loading');
          slide.appendChild(clonedImg);
          slider.appendChild(slide);
        }

        wrapper.appendChild(slider);

        if (mediaImages.length > 1) {
          const dots = document.createElement('div');
          dots.classList.add('quick-add-mobile-slider__dots');

          for (let i = 0; i < mediaImages.length; i++) {
            const dot = document.createElement('span');
            dot.classList.add('quick-add-mobile-slider__dot');
            if (i === 0) dot.classList.add('is-active');
            dots.appendChild(dot);
          }

          wrapper.appendChild(dots);

          slider.addEventListener(
            'scroll',
            () => {
              const index = Math.round(slider.scrollLeft / slider.offsetWidth);
              dots.querySelectorAll('.quick-add-mobile-slider__dot').forEach((dot, i) => {
                dot.classList.toggle('is-active', i === index);
              });
            },
            { passive: true },
          );
        }

        productGrid.prepend(wrapper);
      }

	  if (false)
	  {
		// Product header: title + price, stacked below the slider
		const productTitle = document.createElement('a');
		productTitle.textContent = this.dataset.productTitle || '';
		productTitle.href = this.productPageUrl;

		const productHeader = document.createElement('div');
		productHeader.classList.add('product-header');
		productHeader.appendChild(productTitle);
		if (productPrice) {
			productHeader.appendChild(productPrice);
		}
		productGrid.appendChild(productHeader);

		if (variantPicker) {
			productGrid.appendChild(variantPicker);
		}
		if (productFormComponent) {
			productGrid.appendChild(productFormComponent);
		}
	  }
    }

    morph(modalContent, productGrid);
    requestAnimationFrame(() => { modalContent.scrollTop = 0; });

    this.#syncVariantSelection(modalContent);

    // On desktop, open all accordions in the product details by default
    if (!isMobileBreakpoint()) {
      modalContent.querySelectorAll('.product-details details').forEach((details) => {
        if (details instanceof HTMLDetailsElement) details.open = true;
      });
    }
  }

  /**
   * Updates the quick-add button state based on whether a swatch is selected
   * @param {VariantSelectedEvent} event - The variant selected event
   */
  #updateQuickAddButtonState(event) {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.closest('product-card') !== this.closest('product-card')) return;
    this.setAttribute('data-quick-add-button', 'choose');
  }

  /**
   * Syncs the variant selection from the product card to the modal
   * @param {Element} modalContent - The modal content element
   */
  #syncVariantSelection(modalContent) {
    const selectedVariantId = this.#getSelectedVariantId();
    if (!selectedVariantId) return;

    // Find and check the corresponding input in the modal
    const modalInputs = modalContent.querySelectorAll('input[type="radio"][data-variant-id]');
    for (const input of modalInputs) {
      if (input instanceof HTMLInputElement && input.dataset.variantId === selectedVariantId && !input.checked) {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  }
}

if (!customElements.get('quick-add-component')) {
  customElements.define('quick-add-component', QuickAddComponent);
}

class QuickAddDialog extends DialogComponent {
  #abortController = new AbortController();

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener(ThemeEvents.cartUpdate, this.handleCartUpdate, { signal: this.#abortController.signal });
    this.addEventListener(ThemeEvents.variantUpdate, this.#updateProductTitleLink);

    this.addEventListener(DialogCloseEvent.eventName, this.#handleDialogClose);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.#abortController.abort();
    this.removeEventListener(DialogCloseEvent.eventName, this.#handleDialogClose);
  }

  /**
   * Closes the dialog
   * @param {CartUpdateEvent} event - The cart update event
   */
  handleCartUpdate = (event) => {
    if (event.detail.data.didError) return;
    this.closeDialog();
  };

  #updateProductTitleLink = (/** @type {CustomEvent} */ event) => {
    const anchorElement = /** @type {HTMLAnchorElement} */ (
      event.detail.data.html?.querySelector('.view-product-title a')
    );
    const viewMoreDetailsLink = /** @type {HTMLAnchorElement} */ (this.querySelector('.view-product-title a'));
    const mobileProductTitle = /** @type {HTMLAnchorElement} */ (this.querySelector('.product-header a'));

    if (!anchorElement) return;

    if (viewMoreDetailsLink) viewMoreDetailsLink.href = anchorElement.href;
    if (mobileProductTitle) mobileProductTitle.href = anchorElement.href;
  };

  #handleDialogClose = () => {
    const iosVersion = getIOSVersion();
    /**
     * This is a patch to solve an issue with the UI freezing when the dialog is closed.
     * To reproduce it, use iOS 16.0.
     */
    if (!iosVersion || iosVersion.major >= 17 || (iosVersion.major === 16 && iosVersion.minor >= 4)) return;

    requestAnimationFrame(() => {
      /** @type {HTMLElement | null} */
      const grid = document.querySelector('#ResultsList [product-grid-view]');
      if (grid) {
        const currentWidth = grid.getBoundingClientRect().width;
        grid.style.width = `${currentWidth - 1}px`;
        requestAnimationFrame(() => {
          grid.style.width = '';
        });
      }
    });
  };
}

if (!customElements.get('quick-add-dialog')) {
  customElements.define('quick-add-dialog', QuickAddDialog);
}
