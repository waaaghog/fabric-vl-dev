import { Component } from '@theme/component';
import { debounce, onDocumentLoaded, setHeaderMenuStyle } from '@theme/utilities';
import { MegaMenuHoverEvent } from '@theme/events';

/**
 * A custom element that manages a header menu.
 *
 * @typedef {Object} State
 * @property {HTMLElement | null} activeItem - The currently active menu item link (used for overflow items).
 *
 * @typedef {object} Refs
 * @property {HTMLElement} overflowMenu - The overflow menu.
 *
 * @extends {Component<Refs>}
 */
class HeaderMenu extends Component {
  requiredRefs = ['overflowMenu'];

  /**
   * @type {MutationObserver | null}
   */
  #submenuMutationObserver = null;

  /**
   * The parent row element — used to scope pointerleave so padding areas
   * of the row don't trigger deactivation.
   * @type {Element | null}
   */
  #rowElement = null;

  /**
   * @type {State}
   */
  #state = {
    activeItem: null,
  };

  connectedCallback() {
    super.connectedCallback();
    document.documentElement.classList.add('header-menu-ready');
    onDocumentLoaded(this.#preloadImages);
    window.addEventListener('resize', this.#resizeListener);
    this.#rowElement = this.closest('.header__row');
    this.#rowElement?.addEventListener('pointerleave', this.#deactivate);
    this.#rowElement?.addEventListener('pointerover', this.#rowPointerOverListener);
    this.addEventListener('focusout', this.#focusOutListener);
    this.#checkHoverState();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.#resizeListener);
    this.#rowElement?.removeEventListener('pointerleave', this.#deactivate);
    this.#rowElement?.removeEventListener('pointerover', this.#rowPointerOverListener);
    this.#rowElement = null;
    this.removeEventListener('focusout', this.#focusOutListener);
    this.#cleanupMutationObserver();
  }

  #resizeListener = debounce(() => {
    setHeaderMenuStyle();
  }, 100);

  /**
   * Deactivate when the pointer moves over any element in the row that is
   * outside this header-menu component (e.g. logo, search, cart, account).
   */
  #rowPointerOverListener = (/** @type {PointerEvent} */ e) => {
    if (e.target instanceof Node && !this.contains(e.target)) {
      this.#deactivate();
    }
  };

  /**
   * Deactivate when focus moves outside the header-menu element entirely.
   */
  #focusOutListener = (/** @type {FocusEvent} */ e) => {
    if (!this.contains(/** @type {Node | null} */ (e.relatedTarget))) {
      this.#deactivate();
    }
  };

  /**
   * Get the overflow panel element (inside shadow DOM).
   */
  get overflowMenu() {
    return /** @type {HTMLElement | null} */ (this.refs.overflowMenu?.shadowRoot?.querySelector('[part="overflow"]'));
  }
  get headerComponent() {
    return /** @type {HTMLElement | null} */ (this.closest('header-component'));
  }

  #checkHoverState() {
    const hoveredItem = this.querySelector('.menu-list__list-item:hover');
    if (hoveredItem instanceof HTMLElement) {
      // Defer one frame so content-visibility: auto has time to lay out the submenu
      // before activate() reads offsetHeight for the underlay calculation.
      requestAnimationFrame(() => this.activate({ target: hoveredItem }));
    }
  }

  /**
   * Called by on:pointerenter / on:focus on each <li>, or synthetically from #checkHoverState.
   * @param {PointerEvent | FocusEvent | { target: Element }} event
   */
  activate = (event) => {
    this.dispatchEvent(new MegaMenuHoverEvent());

    if (!(event.target instanceof Element) || !this.headerComponent) return;

    const li = /** @type {HTMLElement} */ (event.target);
    const isDefaultSlot = li.slot === '' || !li.hasAttribute('slot');

    this.dataset.overflowExpanded = (!isDefaultSlot).toString();

    // Keep aria-expanded in sync on the <a> for header.liquid selectors and accessibility.
    const item = findMenuItem(li);
    if (!item) return;

    if (this.#state.activeItem && this.#state.activeItem !== item) {
      this.#state.activeItem.ariaExpanded = 'false';
    }
    this.#state.activeItem = item;
    this.ariaExpanded = 'true';
    item.ariaExpanded = 'true';

    // Calculate heights for the underlay background animation.
    let submenu = findSubmenu(item);
    const hasSubmenu = Boolean(submenu);

    if (!hasSubmenu && !isDefaultSlot) {
      submenu = this.overflowMenu;
    }

    if (submenu && isDefaultSlot && submenu.querySelector('.menu-list__submenu-inner--flat')) {
      const megaMenu = submenu.querySelector('.mega-menu');
      const sectionLeft = megaMenu?.getBoundingClientRect().left ?? 0;
      const linkTitle = li.querySelector('.menu-list__link-title');
      const itemLeft = (linkTitle ?? li).getBoundingClientRect().left;
      submenu.style.setProperty('--nav-item-left', `${Math.max(0, itemLeft - sectionLeft)}px`);
    }

    if (submenu) {
      submenu.dataset.active = '';
      this.#cleanupMutationObserver();
      this.#submenuMutationObserver = new MutationObserver(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (submenu.offsetHeight > 0) {
              this.headerComponent?.style.setProperty('--submenu-height', `${submenu.offsetHeight}px`);
              this.#cleanupMutationObserver();
            }
          });
        });
      });
      this.#submenuMutationObserver.observe(submenu, { childList: true, subtree: true });
      setTimeout(() => this.#cleanupMutationObserver(), 500);
    }

    let finalHeight = submenu?.offsetHeight || 0;

    if (!isDefaultSlot) {
      const overflowListHeight = this.#getOverflowListLinksHeight();
      if (hasSubmenu) {
        const overflowHeight = this.overflowMenu?.offsetHeight || 0;
        finalHeight = Math.max(overflowHeight, overflowListHeight);
      } else {
        finalHeight = overflowListHeight;
      }
    }

    if (!submenu) finalHeight = 0;

    this.headerComponent.style.setProperty('--submenu-height', `${finalHeight}px`);
    this.#setFullOpenHeaderHeight(finalHeight);
  };

  /**
   * Deactivate the active item.
   * Called when the pointer leaves the header row (including all its DOM-child submenus).
   */
  #deactivate = () => {
    const item = this.#state.activeItem;
    if (!item) return;

    this.#clearHeights();
    this.dataset.overflowExpanded = 'false';

    const submenu = findSubmenu(item);
    if (submenu) {
      delete submenu.dataset.active;
    }

    this.#state.activeItem = null;
    this.ariaExpanded = 'false';
    item.ariaExpanded = 'false';
  };

  #clearHeights() {
    this.headerComponent?.style.setProperty('--submenu-height', '0px');
    this.#setFullOpenHeaderHeight(0);
  }

  #getOverflowListLinksHeight() {
    const slottedMenuLinks = this.overflowMenu?.querySelector('slot')?.assignedElements();
    if (!slottedMenuLinks) return this.overflowMenu?.offsetHeight || 0;

    /**
     * @param {(submenu: HTMLElement) => void} cb
     */
    const mapSubmenus = (cb) => {
      slottedMenuLinks.forEach((link) => {
        const submenu = /** @type {HTMLElement | null} */ (link.querySelector('[ref="submenu[]"]'));
        if (submenu) cb(submenu);
      });
    };

    mapSubmenus((submenu) => submenu.style.setProperty('display', 'none'));
    const height = this.overflowMenu?.offsetHeight || 0;
    mapSubmenus((submenu) => submenu.style.removeProperty('display'));
    return height;
  }

  /**
   * @param {number} submenuHeight
   */
  #setFullOpenHeaderHeight(submenuHeight) {
    if (!this.headerComponent) return;

    const isOverlapSituation = this.headerComponent.hasAttribute('data-submenu-overlap-bottom-row');

    const headerVisibleHeight =
      isOverlapSituation && this.headerComponent.offsetHeight > 0
        ? /** @type {HTMLElement | null} */ (this.headerComponent.querySelector('.header__row--top'))?.offsetHeight ?? 0
        : this.headerComponent.offsetHeight;

    const nothingToOpen = submenuHeight === 0;
    const fullOpenHeaderHeight = nothingToOpen ? 0 : submenuHeight + (headerVisibleHeight ?? 0);

    this.headerComponent?.style.setProperty('--full-open-header-height', `${fullOpenHeaderHeight}px`);
  }

  #preloadImages = () => {
    const images = this.querySelectorAll('img[loading="lazy"]');
    images?.forEach((image) => image.removeAttribute('loading'));
  };

  #cleanupMutationObserver() {
    this.#submenuMutationObserver?.disconnect();
    this.#submenuMutationObserver = null;
  }
}

if (!customElements.get('header-menu')) {
  customElements.define('header-menu', HeaderMenu);
}

/**
 * Find the menu item link inside an element.
 * @param {Element | null | undefined} element
 * @returns {HTMLElement | null}
 */
function findMenuItem(element) {
  if (!(element instanceof Element)) return null;

  if (element.matches('[slot="more"]')) {
    return findMenuItem(element.parentElement?.querySelector('[slot="overflow"]'));
  }

  return /** @type {HTMLElement | null} */ (element.querySelector('[ref="menuitem"]'));
}

/**
 * Find the submenu for a given menu item link.
 * @param {Element | null | undefined} element
 * @returns {HTMLElement | null}
 */
function findSubmenu(element) {
  const container = element?.closest('.menu-list__list-item');
  const submenu = container?.querySelector('[ref="submenu[]"]');
  return submenu instanceof HTMLElement ? submenu : null;
}
