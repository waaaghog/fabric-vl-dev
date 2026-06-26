import { sectionRenderer } from '@theme/section-renderer';
import { Component } from '@theme/component';
import { FilterUpdateEvent, ThemeEvents } from '@theme/events';
import { debounce, startViewTransition } from '@theme/utilities';
import { convertMoneyToMinorUnits, formatMoney } from '@theme/money-formatting';
/**
 * Search query parameter.
 * @type {string}
 */
const SEARCH_QUERY = 'q';
const DESIGN_LAB_FILTER_CARD_SELECTOR = '[data-design-lab-filter-card]';
const DESIGN_LAB_FILTER_LINK_SELECTOR = '[data-design-lab-filter-value]';
const DESIGN_LAB_ACTIVE_FILTER_SELECTOR = '[data-design-lab-active-filter]';
const DESIGN_LAB_PILL_SELECTOR = '[data-design-lab-pill]';
const DESIGN_LAB_CLOSE_SVG =
  '<span class="svg-wrapper svg-wrapper--smaller">' +
  '<svg aria-hidden="true" width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<g opacity="var(--close-icon-opacity)">' +
  '<path d="M6 1.5L1 6.5" stroke="currentColor" stroke-width="var(--icon-stroke-width)" stroke-linecap="round"/>' +
  '<path d="M1 1.5L6 6.5" stroke="currentColor" stroke-width="var(--icon-stroke-width)" stroke-linecap="round"/>' +
  '</g></svg></span>' +
  '<span class="visually-hidden">Remove</span>';
const DEFAULT_FILTER_SUPPRESSION_STORAGE_KEY = 'fabric-vl.defaultFilterSuppressions';
const defaultFilterSuppressionsByPath = loadDefaultFilterSuppressions();

function createDefaultFilterSuppressions(value = {}) {
  return {
    stockStatus: Boolean(value.stockStatus),
    designLab: Boolean(value.designLab),
  };
}

function loadDefaultFilterSuppressions() {
  const suppressionsByPath = new Map();

  try {
    const storedSuppressions = sessionStorage.getItem(DEFAULT_FILTER_SUPPRESSION_STORAGE_KEY);
    if (!storedSuppressions) return suppressionsByPath;

    const parsedSuppressions = JSON.parse(storedSuppressions);
    if (!parsedSuppressions || typeof parsedSuppressions !== 'object') return suppressionsByPath;

    Object.entries(parsedSuppressions).forEach(([path, suppressions]) => {
      if (!path || !suppressions || typeof suppressions !== 'object') return;
      suppressionsByPath.set(path, createDefaultFilterSuppressions(suppressions));
    });
  } catch (_error) {
    return suppressionsByPath;
  }

  return suppressionsByPath;
}

function saveDefaultFilterSuppressions() {
  try {
    const suppressionsToStore = {};

    defaultFilterSuppressionsByPath.forEach((suppressions, path) => {
      if (!suppressions.stockStatus && !suppressions.designLab) return;
      suppressionsToStore[path] = suppressions;
    });

    sessionStorage.setItem(DEFAULT_FILTER_SUPPRESSION_STORAGE_KEY, JSON.stringify(suppressionsToStore));
  } catch (_error) {
    // Storage can be unavailable in private contexts; in-memory suppressions still work.
  }
}

function getDefaultFilterSuppressions(url = window.location.href) {
  const key = new URL(url, window.location.origin).pathname;
  const suppressions = defaultFilterSuppressionsByPath.get(key) || createDefaultFilterSuppressions();

  defaultFilterSuppressionsByPath.set(key, suppressions);
  return suppressions;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Handles the main facets form functionality
 *
 * @typedef {Object} FacetsFormRefs
 * @property {HTMLFormElement} facetsForm - The main facets form element
 * @property {HTMLElement | undefined} facetStatus - The facet status element
 *
 * @extends {Component<FacetsFormRefs>}
 */
class FacetsFormComponent extends Component {
  requiredRefs = ['facetsForm'];

  connectedCallback() {
    super.connectedCallback();
    this.#applyDefaultFiltersOnInitialLoad();
  }

  /**
   * Creates URL parameters from form data
   * @param {FormData} [formData] - Optional form data to use instead of the main form
   * @returns {URLSearchParams} The processed URL parameters
   */
  createURLParameters(formData = new FormData(this.refs.facetsForm)) {
    let newParameters = new URLSearchParams(/** @type any */ (formData));

    if (newParameters.get('filter.v.price.gte') === '') newParameters.delete('filter.v.price.gte');
    if (newParameters.get('filter.v.price.lte') === '') newParameters.delete('filter.v.price.lte');

    newParameters.delete('page');

    const searchQuery = this.#getSearchQuery();
    if (searchQuery) newParameters.set(SEARCH_QUERY, searchQuery);

    this.#applyDefaultStockStatus(newParameters);
    this.#applyDefaultDesignLabFilter(newParameters);

    return newParameters;
  }

  /**
   * Adds the default collection stock-status filter when no stock status is selected.
   * @param {URLSearchParams} parameters - URL parameters to mutate
   * @param {boolean} [resetPage] - Whether to reset pagination after adding the default
   */
  #applyDefaultStockStatus(parameters, resetPage = false) {
    const paramName = this.dataset.defaultStockStatusParam;
    const paramValue = this.dataset.defaultStockStatusValue;

    if (
      !paramName ||
      !paramValue ||
      this.#hasStockStatusParameter(parameters) ||
      getDefaultFilterSuppressions().stockStatus
    ) {
      return;
    }

    if (resetPage) parameters.delete('page');
    parameters.set(paramName, paramValue);
  }

  /**
   * Checks whether the current parameters already contain any stock-status choice.
   * @param {URLSearchParams} parameters - URL parameters to check
   * @returns {boolean} Whether a stock-status parameter is present
   */
  #hasStockStatusParameter(parameters) {
    const defaultParamName = this.dataset.defaultStockStatusParam?.toLowerCase() ?? '';

    return Array.from(parameters.keys()).some((paramName) => {
      const normalizedParamName = paramName.toLowerCase();

      return (
        normalizedParamName === defaultParamName ||
        normalizedParamName.includes('availability') ||
        normalizedParamName.includes('available') ||
        normalizedParamName.includes('stock_status') ||
        normalizedParamName.includes('stock-status')
      );
    });
  }

  /**
   * Adds the default collection Design Lab filter when no Design Lab status is selected.
   * @param {URLSearchParams} parameters - URL parameters to mutate
   * @param {boolean} [resetPage] - Whether to reset pagination after adding the default
   */
  #applyDefaultDesignLabFilter(parameters, resetPage = false) {
    if (this.#hasDesignLabParameter(parameters)) return;

    const currentDesignLabSelection = this.#getCurrentDesignLabSelection();
    if (currentDesignLabSelection) {
      if (resetPage) parameters.delete('page');
      parameters.set(currentDesignLabSelection.paramName, currentDesignLabSelection.value);
      return;
    }

    if (getDefaultFilterSuppressions().designLab) return;

    const designLabSelection = this.#getDefaultDesignLabSelection();
    if (!designLabSelection) return;

    if (resetPage) parameters.delete('page');
    parameters.set(designLabSelection.paramName, designLabSelection.value);
  }

  /**
   * Gets the current Design Lab value from the URL.
   * @returns {{ paramName: string, value: string } | null}
   */
  #getCurrentDesignLabSelection() {
    const currentUrl = new URL(window.location.href);
    const currentParamName = Array.from(currentUrl.searchParams.keys()).find((paramName) =>
      isDesignLabParamName(paramName)
    );

    if (currentParamName) {
      const currentValue = currentUrl.searchParams.get(currentParamName);
      if (currentValue != null) return { paramName: currentParamName, value: currentValue };
    }

    return null;
  }

  /**
   * Gets the default Design Lab value from the rendered card.
   * @returns {{ paramName: string, value: string } | null}
   */
  #getDefaultDesignLabSelection() {
    const designLabCard = this.querySelector(DESIGN_LAB_FILTER_CARD_SELECTOR) || document.querySelector(DESIGN_LAB_FILTER_CARD_SELECTOR);
    if (!(designLabCard instanceof HTMLElement)) return null;

    const paramName = designLabCard.dataset.designLabFilterParam || 'filter.p.m.custom.product_designlab';
    const links = Array.from(designLabCard.querySelectorAll(DESIGN_LAB_FILTER_LINK_SELECTOR)).filter(
      (link) => link instanceof HTMLElement
    );
    const defaultValue = designLabCard.dataset.designLabDefaultValue;
    const defaultLink = links.find(
      (link) => normalizeDesignLabValue(link.dataset.designLabFilterValue) === normalizeDesignLabValue(defaultValue)
    );
    const activeLink = links.find((link) => link.classList.contains('active'));
    const hideLink = links.find((link) => normalizeDesignLabValue(link.dataset.designLabFilterValue) === '0');
    const selectedLink = defaultLink || activeLink || hideLink || links[0];
    if (selectedLink?.hasAttribute('data-design-lab-filter-clears')) return null;

    const value = selectedLink?.dataset.designLabFilterValue || defaultValue || '0';

    return { paramName, value };
  }

  /**
   * Checks whether the current parameters already contain any Design Lab choice.
   * @param {URLSearchParams} parameters - URL parameters to check
   * @returns {boolean} Whether a Design Lab parameter is present
   */
  #hasDesignLabParameter(parameters) {
    return Array.from(parameters.keys()).some((paramName) => isDesignLabParamName(paramName));
  }

  /**
   * Remembers that default-only filters were intentionally removed.
   * @param {URL} currentUrl
   * @param {URL} nextUrl
   * @param {boolean} suppressAll
   */
  #suppressRemovedDefaultFilters(currentUrl, nextUrl, suppressAll) {
    const currentParameters = currentUrl.searchParams;
    const nextParameters = nextUrl.searchParams;
    const suppressions = getDefaultFilterSuppressions(nextUrl.toString());
    let didChangeSuppressions = false;

    if (suppressAll || (this.#hasStockStatusParameter(currentParameters) && !this.#hasStockStatusParameter(nextParameters))) {
      suppressions.stockStatus = true;
      didChangeSuppressions = true;
    }

    if (suppressAll || (this.#hasDesignLabParameter(currentParameters) && !this.#hasDesignLabParameter(nextParameters))) {
      suppressions.designLab = true;
      didChangeSuppressions = true;
    }

    if (didChangeSuppressions) saveDefaultFilterSuppressions();
  }

  /**
   * Carries intentional default-filter removals across tag-path URL changes.
   * @param {URL} currentUrl
   * @param {URL} nextUrl
   */
  #carryDefaultFilterSuppressions(currentUrl, nextUrl) {
    const currentSuppressions = getDefaultFilterSuppressions(currentUrl.toString());
    if (!currentSuppressions.stockStatus && !currentSuppressions.designLab) return;

    const nextSuppressions = getDefaultFilterSuppressions(nextUrl.toString());
    const previousStockStatusSuppression = nextSuppressions.stockStatus;
    const previousDesignLabSuppression = nextSuppressions.designLab;

    nextSuppressions.stockStatus = nextSuppressions.stockStatus || currentSuppressions.stockStatus;
    nextSuppressions.designLab = nextSuppressions.designLab || currentSuppressions.designLab;

    if (
      nextSuppressions.stockStatus !== previousStockStatusSuppression ||
      nextSuppressions.designLab !== previousDesignLabSuppression
    ) {
      saveDefaultFilterSuppressions();
    }
  }

  /**
   * Ensures first collection loads use the default filters without a full page navigation.
   */
  #applyDefaultFiltersOnInitialLoad() {
    const url = new URL(window.location.href);
    const originalUrl = url.toString();

    this.#applyDefaultStockStatus(url.searchParams, true);
    this.#applyDefaultDesignLabFilter(url.searchParams, true);

    if (url.toString() !== originalUrl) {
      history.replaceState({ urlParameters: url.searchParams.toString() }, '', url.toString());
      this.dispatchEvent(new FilterUpdateEvent(new URLSearchParams(url.search)));
      sectionRenderer.renderSection(this.sectionId, { cache: false, url });
    }
  }

  /**
   * Gets the search query parameter from the current URL
   * @returns {string} The search query
   */
  #getSearchQuery() {
    const url = new URL(window.location.href);
    return url.searchParams.get(SEARCH_QUERY) ?? '';
  }

  get sectionId() {
    const id = this.getAttribute('section-id');
    if (!id) throw new Error('Section ID is required');
    return id;
  }

  /**
   * Updates the URL hash with current filter parameters
   */
  #updateURLHash() {
    const url = new URL(window.location.href);
    const urlParameters = this.createURLParameters();

    url.search = '';
    for (const [param, value] of urlParameters.entries()) {
      url.searchParams.append(param, value);
    }

    history.pushState({ urlParameters: urlParameters.toString() }, '', url.toString());
  }

  /**
   * Updates filters and renders the section
   */
  updateFilters = () => {
    this.#updateURLHash();
    this.dispatchEvent(new FilterUpdateEvent(this.createURLParameters()));
    this.#updateSection()?.finally(() => queueDesignLabUISync());
  };

  /**
   * Updates the section
   */
  #updateSection() {
    const viewTransition = !this.closest('dialog');
    let renderPromise;
    const renderSection = () => {
      renderPromise = sectionRenderer.renderSection(this.sectionId);
      return renderPromise;
    };

    if (viewTransition) {
      return startViewTransition(renderSection, ['product-grid']).then(() => renderPromise);
    }

    return renderSection();
  }

  /**
   * Updates filters based on a provided URL
   * @param {string} url - The URL to update filters with
   * @param {{ applyDefaultFilters?: boolean, suppressRemovedDefaultFilters?: boolean, suppressAllDefaultFilters?: boolean }} [options] - Update behavior options
   */
  updateFiltersByURL(url, options = {}) {
    const {
      applyDefaultFilters = true,
      suppressRemovedDefaultFilters = false,
      suppressAllDefaultFilters = false,
    } = options;
    const currentUrl = new URL(window.location.href);
    const nextUrl = new URL(url, window.location.origin);

    this.#carryDefaultFilterSuppressions(currentUrl, nextUrl);

    if (suppressRemovedDefaultFilters) {
      this.#suppressRemovedDefaultFilters(currentUrl, nextUrl, suppressAllDefaultFilters);
    }

    if (applyDefaultFilters) {
      this.#applyDefaultStockStatus(nextUrl.searchParams, true);
      this.#applyDefaultDesignLabFilter(nextUrl.searchParams, true);
    } else {
      nextUrl.searchParams.delete('page');
    }

    history.pushState({ urlParameters: nextUrl.searchParams.toString() }, '', nextUrl.toString());
    this.dispatchEvent(new FilterUpdateEvent(new URLSearchParams(nextUrl.searchParams)));
    this.#updateSection()?.finally(() => queueDesignLabUISync());
  }
}

if (!customElements.get('facets-form-component')) {
  customElements.define('facets-form-component', FacetsFormComponent);
}

/**
 * @typedef {Object} FacetInputsRefs
 * @property {HTMLInputElement[]} facetInputs - The facet input elements
 */

/**
 * Handles individual facet input functionality
 * @extends {Component<FacetInputsRefs>}
 */
class FacetInputsComponent extends Component {
  get sectionId() {
    const id = this.closest('.shopify-section')?.id;
    if (!id) throw new Error('FacetInputs component must be a child of a section');
    return id;
  }

  /**
   * Updates filters and the selected facet summary
   * @param {Event} [event] - The change event
   */
  updateFilters(event) {
    const facetsForm = this.closest('facets-form-component');

    if (!(facetsForm instanceof FacetsFormComponent)) return;

    this.#syncExclusiveColorFilter(this.#getChangedInput(event));
    facetsForm.updateFilters();
    this.#updateSelectedFacetSummary();
  }

  /**
   * Gets the input that triggered a delegated facet change.
   * @param {Event} [event] - The change event
   * @returns {HTMLInputElement | null}
   */
  #getChangedInput(event) {
    const originalTarget = event?.composedPath?.()[0] ?? event?.target;
    return originalTarget instanceof HTMLInputElement ? originalTarget : null;
  }

  /**
   * Color swatches should switch colors instead of stacking unavailable values.
   * @param {HTMLInputElement | null} inputElement - The changed facet input
   */
  #syncExclusiveColorFilter(inputElement) {
    if (!inputElement || inputElement.dataset.valorColorFilter !== 'true' || !inputElement.checked) return;

    this.refs.facetInputs?.forEach((facetInput) => {
      if (
        facetInput instanceof HTMLInputElement &&
        facetInput !== inputElement &&
        facetInput.name === inputElement.name &&
        facetInput.dataset.valorColorFilter === 'true'
      ) {
        facetInput.checked = false;
      }
    });
  }

  /**
   * Handles keydown events for the facets form
   * @param {KeyboardEvent} event - The keydown event
   */
  handleKeyDown(event) {
    if (!(event.target instanceof HTMLElement)) return;
    const closestInput = event.target.querySelector('input');

    if (!(closestInput instanceof HTMLInputElement)) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closestInput.checked = !closestInput.checked;
      this.#syncExclusiveColorFilter(closestInput);
      this.updateFilters();
    }
  }

  /**
   * Handles mouseover events on facet labels
   * @param {MouseEvent} event - The mouseover event
   */
  prefetchPage = debounce((event) => {
    if (!(event.target instanceof HTMLElement)) return;

    const form = this.closest('form');
    if (!form) return;

    const formData = new FormData(form);
    const inputElement = event.target.querySelector('input');

    if (!(inputElement instanceof HTMLInputElement)) return;

    if (!inputElement.checked) formData.append(inputElement.name, inputElement.value);

    const facetsForm = this.closest('facets-form-component');
    if (!(facetsForm instanceof FacetsFormComponent)) return;

    const urlParameters = facetsForm.createURLParameters(formData);

    const url = new URL(window.location.pathname, window.location.origin);

    for (const [key, value] of urlParameters) url.searchParams.append(key, value);

    if (inputElement.checked) url.searchParams.delete(inputElement.name, inputElement.value);

    sectionRenderer.getSectionHTML(this.sectionId, true, url);
  }, 200);

  cancelPrefetchPage = () => this.prefetchPage.cancel();

  /**
   * Updates the selected facet summary
   */
  #updateSelectedFacetSummary() {
    if (!this.refs.facetInputs) return;

    const checkedInputElements = this.refs.facetInputs.filter((input) => input.checked);
    const details = this.closest('details');
    const statusComponent = details?.querySelector('facet-status-component');

    if (!(statusComponent instanceof FacetStatusComponent)) return;

    statusComponent.updateListSummary(checkedInputElements);
  }
}

if (!customElements.get('facet-inputs-component')) {
  customElements.define('facet-inputs-component', FacetInputsComponent);
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizeDesignLabParamName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
function normalizeDesignLabValue(value) {
  const normalizedValue = String(value || '').toLowerCase();

  if (['1', 'true', 'yes'].includes(normalizedValue)) return '1';
  if (['0', 'false', 'no'].includes(normalizedValue)) return '0';

  return normalizedValue;
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isDesignLabShowValue(value) {
  const normalizedValue = normalizeDesignLabValue(value);

  return normalizedValue !== '0' && !normalizedValue.includes('hide');
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isDesignLabParamName(value) {
  const normalizedValue = normalizeDesignLabParamName(value);
  return normalizedValue.includes('designlab') || normalizedValue.includes('productdesignlab');
}

/**
 * @param {URL} url
 * @returns {string[]}
 */
function getDesignLabParamNames(url) {
  return Array.from(url.searchParams.keys()).filter((key) => isDesignLabParamName(key));
}

/**
 * @param {URL} [url]
 * @returns {{ paramName: string, value: string, normalizedValue: string } | null}
 */
function getDesignLabSelection(url = new URL(window.location.href)) {
  const paramName = getDesignLabParamNames(url)[0];
  if (!paramName) return null;

  const value = url.searchParams.get(paramName);
  if (value == null) return null;

  return {
    paramName,
    value,
    normalizedValue: normalizeDesignLabValue(value),
  };
}

let isRenderingDesignLabActivePills = false;

function hasNativeDesignLabPill(container) {
  return Array.from(container?.querySelectorAll(`facet-remove-component:not(${DESIGN_LAB_PILL_SELECTOR})`) || []).some((pill) =>
    /design\s*lab|product\s*design/i.test(pill.textContent || '')
  );
}

function renderDesignLabActiveFilterPills() {
  const containers = document.querySelectorAll(DESIGN_LAB_ACTIVE_FILTER_SELECTOR);
  if (!containers.length) return;

  const currentUrl = new URL(window.location.href);
  const selection = getDesignLabSelection(currentUrl);
  const removeUrl = new URL(currentUrl);
  getDesignLabParamNames(removeUrl).forEach((paramName) => removeUrl.searchParams.delete(paramName));
  removeUrl.searchParams.delete('page');

  isRenderingDesignLabActivePills = true;

  containers.forEach((container) => {
    container.innerHTML = '';
    if (!selection || hasNativeDesignLabPill(container.closest('.facets-remove'))) return;

    const formId = container.closest('[data-remove-form]')?.dataset.removeForm || '';
    const pill = document.createElement('facet-remove-component');
    const label = isDesignLabShowValue(selection.value) ? 'Design Lab: Show' : 'Design Lab: Hide';

    pill.className = 'pills__pill pills__pill--desktop-small facets-remove__pill';
    pill.dataset.url = removeUrl.toString();
    pill.setAttribute('tabindex', '0');
    pill.setAttribute('role', 'button');
    pill.setAttribute('on:click', `/removeFilter?form=${formId}`);
    pill.setAttribute('on:keydown', `/removeFilter?form=${formId}`);
    pill.setAttribute('data-design-lab-pill', '');
    pill.innerHTML = escapeHtml(label) + DESIGN_LAB_CLOSE_SVG;
    container.appendChild(pill);
  });

  isRenderingDesignLabActivePills = false;
}

/**
 * Keeps the custom Design Lab card aligned with the real URL query string.
 */
function syncDesignLabFilterCards() {
  const url = new URL(window.location.href);
  const selection = getDesignLabSelection(url);

  document.querySelectorAll(DESIGN_LAB_FILTER_CARD_SELECTOR).forEach((card) => {
    if (!(card instanceof HTMLElement)) return;

    const configuredParamName = card.dataset.designLabFilterParam || 'filter.p.m.custom.product_designlab';
    const matchingParamNames = getDesignLabParamNames(url);
    const paramNamesToReplace = Array.from(new Set([configuredParamName, ...matchingParamNames]));
    const defaultValue = normalizeDesignLabValue(card.dataset.designLabDefaultValue || '0');
    const isDesignLabDefaultSuppressed = getDefaultFilterSuppressions(url.toString()).designLab;

    card.querySelectorAll(DESIGN_LAB_FILTER_LINK_SELECTOR).forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) return;

      const value = link.dataset.designLabFilterValue || '';
      const clearsDesignLabFilter = link.hasAttribute('data-design-lab-filter-clears');
      const nextUrl = new URL(window.location.href);
      paramNamesToReplace.forEach((paramName) => nextUrl.searchParams.delete(paramName));
      nextUrl.searchParams.delete('page');
      if (!clearsDesignLabFilter) nextUrl.searchParams.set(configuredParamName, value);
      const nextHref = nextUrl.toString();
      if (link.href !== nextHref) link.href = nextHref;

      let isActive;
      if (selection) {
        isActive = normalizeDesignLabValue(value) === selection.normalizedValue;
      } else if (isDesignLabDefaultSuppressed) {
        isActive = clearsDesignLabFilter;
      } else {
        isActive = normalizeDesignLabValue(value) === defaultValue;
      }

      link.classList.toggle('active', isActive);
      if (isActive) {
        if (link.getAttribute('aria-current') !== 'true') link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });
}

function syncDesignLabUI() {
  syncDesignLabFilterCards();
  renderDesignLabActiveFilterPills();
}

let isDesignLabUISyncQueued = false;

function queueDesignLabUISync() {
  if (isDesignLabUISyncQueued) return;

  isDesignLabUISyncQueued = true;
  requestAnimationFrame(() => {
    isDesignLabUISyncQueued = false;
    syncDesignLabUI();
  });
}

document.addEventListener('click', (event) => {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest(DESIGN_LAB_FILTER_LINK_SELECTOR);
  if (!(link instanceof HTMLAnchorElement)) return;

  const card = link.closest(DESIGN_LAB_FILTER_CARD_SELECTOR);
  if (!(card instanceof HTMLElement)) return;

  const facetsForm = link.closest('facets-form-component');
  if (facetsForm instanceof FacetsFormComponent) {
    event.preventDefault();
    const clearsDesignLabFilter = link.hasAttribute('data-design-lab-filter-clears');
    const defaultFilterSuppressions = getDefaultFilterSuppressions(link.href);

    if (clearsDesignLabFilter) {
      defaultFilterSuppressions.designLab = true;
      saveDefaultFilterSuppressions();
    } else if (defaultFilterSuppressions.designLab) {
      defaultFilterSuppressions.designLab = false;
      saveDefaultFilterSuppressions();
    }

    facetsForm.updateFiltersByURL(
      link.href,
      clearsDesignLabFilter
        ? {
            applyDefaultFilters: false,
            suppressRemovedDefaultFilters: true,
          }
        : undefined
    );
  }

  card.querySelectorAll(DESIGN_LAB_FILTER_LINK_SELECTOR).forEach((button) => {
    if (!(button instanceof HTMLElement)) return;
    const isActive = button === link;
    button.classList.toggle('active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', syncDesignLabUI);
} else {
  syncDesignLabUI();
}

document.addEventListener(ThemeEvents.FilterUpdate, queueDesignLabUISync);
window.addEventListener('popstate', syncDesignLabUI);

const observeDesignLabUI = () => {
  new MutationObserver((mutations) => {
    if (isRenderingDesignLabActivePills) return;

    const shouldSync = mutations.some((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.target instanceof Element &&
        mutation.target.closest(`${DESIGN_LAB_FILTER_CARD_SELECTOR}, ${DESIGN_LAB_ACTIVE_FILTER_SELECTOR}`)
      ) {
        return true;
      }

      return Array.from(mutation.addedNodes).some((node) => {
        if (!(node instanceof Element)) return false;
        return (
          node.matches(DESIGN_LAB_FILTER_CARD_SELECTOR) ||
          node.matches(DESIGN_LAB_ACTIVE_FILTER_SELECTOR) ||
          Boolean(node.querySelector(`${DESIGN_LAB_FILTER_CARD_SELECTOR}, ${DESIGN_LAB_ACTIVE_FILTER_SELECTOR}`))
        );
      });
    });

    if (shouldSync) queueDesignLabUISync();
  }).observe(document.body, {
    attributes: true,
    attributeFilter: ['class', 'aria-current', 'href', 'data-url'],
    childList: true,
    subtree: true,
  });
};

if (document.body) {
  observeDesignLabUI();
} else {
  document.addEventListener('DOMContentLoaded', observeDesignLabUI, { once: true });
}

/**
 * @typedef {Object} PriceFacetRefs
 * @property {HTMLInputElement} minInput - The minimum price input
 * @property {HTMLInputElement} maxInput - The maximum price input
 */

/**
 * Handles price facet functionality
 * @extends {Component<PriceFacetRefs>}
 */
class PriceFacetComponent extends Component {
  /** @type {string} */
  currency;
  /** @type {string} */
  moneyFormat;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keydown', this.#onKeyDown);
    this.currency = this.dataset.currency ?? 'USD';
    this.moneyFormat = this.#extractMoneyPlaceholder(this.dataset.moneyFormat ?? '{{amount}}');
    this.#syncRangeInputs();
    this.#updateRangeTrack();
    this.refs.minRangeInput?.addEventListener('input', this.#handleRangeInput);
    this.refs.maxRangeInput?.addEventListener('input', this.#handleRangeInput);
    this.refs.minRangeInput?.addEventListener('change', this.#handleRangeChange);
    this.refs.maxRangeInput?.addEventListener('change', this.#handleRangeChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this.#onKeyDown);
    this.refs.minRangeInput?.removeEventListener('input', this.#handleRangeInput);
    this.refs.maxRangeInput?.removeEventListener('input', this.#handleRangeInput);
    this.refs.minRangeInput?.removeEventListener('change', this.#handleRangeChange);
    this.refs.maxRangeInput?.removeEventListener('change', this.#handleRangeChange);
  }

  /**
   * Extracts the placeholder from a money format string, removing currency symbols.
   * @param {string} format - The money format (e.g., "${{amount}}", "{{amount}} USD")
   * @returns {string} Just the placeholder (e.g., "{{amount}}")
   */
  #extractMoneyPlaceholder(format) {
    const match = format.match(/{{\s*\w+\s*}}/);
    return match ? match[0] : '{{amount}}';
  }

  /**
   * Handles keydown events to restrict input to valid characters
   * @param {KeyboardEvent} event - The keydown event
   */
  #onKeyDown = (event) => {
    if (event.metaKey) return;

    const pattern = /[0-9]|\.|,|'| |Tab|Backspace|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|Delete|Escape/;
    if (!event.key.match(pattern)) event.preventDefault();
  };

  /**
   * Updates price filter and results
   */
  updatePriceFilterAndResults() {
    const { minInput, maxInput } = this.refs;

    this.#adjustToValidValues(minInput);
    this.#adjustToValidValues(maxInput);

    const facetsForm = this.closest('facets-form-component');
    if (!(facetsForm instanceof FacetsFormComponent)) return;

    facetsForm.updateFilters();
    this.#setMinAndMaxValues();
    this.#syncRangeInputs();
    this.#updateRangeTrack();
    this.#updateSummary();
  }

  /**
   * Syncs text inputs while the visual range controls move.
   * @param {Event} event - Range input event
   */
  #handleRangeInput = (event) => {
    const { minInput, maxInput, minRangeInput, maxRangeInput } = this.refs;
    if (
      !(minInput instanceof HTMLInputElement) ||
      !(maxInput instanceof HTMLInputElement) ||
      !(minRangeInput instanceof HTMLInputElement) ||
      !(maxRangeInput instanceof HTMLInputElement)
    ) {
      return;
    }

    let min = this.#parseRangeValue(minRangeInput.value);
    let max = this.#parseRangeValue(maxRangeInput.value);

    if (min > max) {
      if (event.target === minRangeInput) {
        min = max;
        minRangeInput.value = this.#formatRangeValue(min);
      } else {
        max = min;
        maxRangeInput.value = this.#formatRangeValue(max);
      }
    }

    const maxLimit = this.#parseRangeValue(maxRangeInput.max);
    minInput.value = min <= 0 ? '' : this.#formatRangeValue(min);
    maxInput.value = max >= maxLimit ? '' : this.#formatRangeValue(max);
    this.#setMinAndMaxValues();
    this.#updateRangeTrack();
    this.#updateSummary();
  };

  #handleRangeChange = () => {
    const facetsForm = this.closest('facets-form-component');
    if (!(facetsForm instanceof FacetsFormComponent)) return;

    facetsForm.updateFilters();
  };

  /**
   * Keeps range handles aligned with typed min/max values.
   */
  #syncRangeInputs() {
    const { minInput, maxInput, minRangeInput, maxRangeInput } = this.refs;
    if (
      !(minInput instanceof HTMLInputElement) ||
      !(maxInput instanceof HTMLInputElement) ||
      !(minRangeInput instanceof HTMLInputElement) ||
      !(maxRangeInput instanceof HTMLInputElement)
    ) {
      return;
    }

    const maxLimit = this.#parseRangeValue(maxRangeInput.max);
    minRangeInput.value = minInput.value ? this.#formatRangeValue(this.#parseRangeValue(minInput.value)) : '0';
    maxRangeInput.value = maxInput.value ? this.#formatRangeValue(this.#parseRangeValue(maxInput.value)) : this.#formatRangeValue(maxLimit);
  }

  #updateRangeTrack() {
    const { minRangeInput, maxRangeInput } = this.refs;
    if (!(minRangeInput instanceof HTMLInputElement) || !(maxRangeInput instanceof HTMLInputElement)) return;

    const maxLimit = this.#parseRangeValue(maxRangeInput.max);
    if (maxLimit <= 0) return;

    const min = this.#parseRangeValue(minRangeInput.value);
    const max = this.#parseRangeValue(maxRangeInput.value);
    const minPercent = Math.min(100, Math.max(0, (min / maxLimit) * 100));
    const maxPercent = Math.min(100, Math.max(0, (max / maxLimit) * 100));
    const track = this.querySelector('.price-facet__range-track');
    if (!(track instanceof HTMLElement)) return;

    track.style.setProperty('--price-min-percent', `${minPercent}%`);
    track.style.setProperty('--price-max-percent', `${maxPercent}%`);
    track.style.setProperty('--price-fill-right-percent', `${100 - maxPercent}%`);
  }

  /**
   * Parses the display number used by text/range inputs.
   * @param {string} value - Input value
   * @returns {number}
   */
  #parseRangeValue(value) {
    return parseFloat(String(value || '0').replace(/,/g, '')) || 0;
  }

  /**
   * Formats range values without unnecessary trailing zeroes.
   * @param {number} value - Range value
   * @returns {string}
   */
  #formatRangeValue(value) {
    return value.toFixed(2).replace(/\.?0+$/, '');
  }

  /**
   * Parses a formatted money value into minor units
   * displayValue can come from user input or API response
   * @param {string} displayValue - The display value (e.g., "10.50" for USD, "9,50" for EUR, "1000" for JPY)
   * @param {string} currency - The currency code
   * @returns {number} The value in minor units
   */
  #parseDisplayValue(displayValue, currency) {
    return convertMoneyToMinorUnits(displayValue, currency) ?? 0;
  }

  /**
   * Adjusts input values to be within valid range
   * @param {HTMLInputElement} input - The input element to adjust
   */
  #adjustToValidValues(input) {
    if (input.value.trim() === '') return;

    const { currency, moneyFormat } = this;
    // Parse the user's input value using currency-aware parsing
    const value = this.#parseDisplayValue(input.value, currency);

    // data-min and data-max now contain raw minor unit values (not formatted)
    const min = this.#parseDisplayValue(input.getAttribute('data-min') ?? '0', currency);
    const max = this.#parseDisplayValue(input.getAttribute('data-max') ?? '0', currency);

    if (value < min) {
      input.value = formatMoney(min, moneyFormat, currency);
    } else if (value > max) {
      input.value = formatMoney(max, moneyFormat, currency);
    }
  }

  /**
   * Sets min and max values for the inputs
   */
  #setMinAndMaxValues() {
    const { minInput, maxInput } = this.refs;

    if (maxInput.value) minInput.setAttribute('data-max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('data-min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('data-min', '0');
    if (maxInput.value === '') minInput.setAttribute('data-max', maxInput.getAttribute('data-max') ?? '');
  }

  /**
   * Updates the price summary
   */
  #updateSummary() {
    const { minInput, maxInput } = this.refs;
    const details = this.closest('details');
    const statusComponent = details?.querySelector('facet-status-component');

    if (!(statusComponent instanceof FacetStatusComponent)) return;

    statusComponent?.updatePriceSummary(minInput, maxInput);
  }
}

if (!customElements.get('price-facet-component')) {
  customElements.define('price-facet-component', PriceFacetComponent);
}

/**
 * Handles clearing of facet filters
 * @extends {Component}
 */
class FacetClearComponent extends Component {
  requiredRefs = ['clearButton'];

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('keyup', this.#handleKeyUp);
    document.addEventListener(ThemeEvents.FilterUpdate, this.#handleFilterUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(ThemeEvents.FilterUpdate, this.#handleFilterUpdate);
  }

  /**
   * Clears the filter
   * @param {Event} event - The click event
   */
  clearFilter(event) {
    if (!(event.target instanceof HTMLElement)) return;

    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
    }

    const container = event.target.closest('facet-inputs-component, price-facet-component');
    container?.querySelectorAll('[type="checkbox"]:checked, input').forEach((input) => {
      if (input instanceof HTMLInputElement) {
        input.checked = false;
        input.value = '';
      }
    });

    const details = event.target.closest('details');
    const statusComponent = details?.querySelector('facet-status-component');

    if (!(statusComponent instanceof FacetStatusComponent)) return;

    statusComponent.clearSummary();

    const facetsForm = this.closest('facets-form-component');
    if (!(facetsForm instanceof FacetsFormComponent)) return;

    facetsForm.updateFilters();
  }

  /**
   * Handles keyup events
   * @param {KeyboardEvent} event - The keyup event
   */
  #handleKeyUp = (event) => {
    if (event.metaKey) return;
    if (event.key === 'Enter') this.clearFilter(event);
  };

  /**
   * Toggle clear button visibility when filters are applied. Happens before the
   * Section Rendering Request resolves.
   *
   * @param {FilterUpdateEvent} event
   */
  #handleFilterUpdate = (event) => {
    const { clearButton } = this.refs;
    if (clearButton instanceof Element) {
      clearButton.classList.toggle('facets__clear--active', event.shouldShowClearAll());
    }
  };
}

if (!customElements.get('facet-clear-component')) {
  customElements.define('facet-clear-component', FacetClearComponent);
}

/**
 * @typedef {Object} FacetRemoveComponentRefs
 * @property {HTMLInputElement | undefined} clearButton - The button to clear filters
 */

/**
 * Handles removal of individual facet filters
 * @extends {Component<FacetRemoveComponentRefs>}
 */
class FacetRemoveComponent extends Component {
  connectedCallback() {
    super.connectedCallback();
    document.addEventListener(ThemeEvents.FilterUpdate, this.#handleFilterUpdate);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener(ThemeEvents.FilterUpdate, this.#handleFilterUpdate);
  }

  /**
   * Removes the filter
   * @param {Object} data - The data object
   * @param {string} data.form - The form to remove the filter from
   * @param {Event} event - The click event
   */
  removeFilter({ form }, event) {
    if (event instanceof KeyboardEvent) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }
      event.preventDefault();
    }

    const url = this.dataset.url;
    if (!url) return;

    const facetsForm = form ? document.getElementById(form) : this.closest('facets-form-component');

    if (!(facetsForm instanceof FacetsFormComponent)) return;

    facetsForm.updateFiltersByURL(url, {
      applyDefaultFilters: false,
      suppressRemovedDefaultFilters: true,
      suppressAllDefaultFilters: this.hasAttribute('data-clear-all-filters'),
    });
  }

  /**
   * Toggle clear button visibility when filters are applied. Happens before the
   * Section Rendering Request resolves.
   *
   * @param {FilterUpdateEvent} event
   */
  #handleFilterUpdate = (event) => {
    const { clearButton } = this.refs;
    if (clearButton instanceof Element) {
      const activeClass = this.getAttribute('active-class') || 'active';
      clearButton.classList.toggle(activeClass, event.shouldShowClearAll());
    }
  };
}

if (!customElements.get('facet-remove-component')) {
  customElements.define('facet-remove-component', FacetRemoveComponent);
}

/**
 * Handles sorting filter functionality
 *
 * @typedef {Object} SortingFilterRefs
 * @property {HTMLDetailsElement} details - The details element
 * @property {HTMLElement} summary - The summary element
 * @property {HTMLElement} listbox - The listbox element
 *
 * @extends {Component}
 */
class SortingFilterComponent extends Component {
  requiredRefs = ['details', 'summary', 'listbox'];

  /**
   * Handles keyboard navigation in the sorting dropdown
   * @param {KeyboardEvent} event - The keyboard event
   */
  handleKeyDown = (event) => {
    const { listbox } = this.refs;
    if (!(listbox instanceof Element)) return;

    const options = Array.from(listbox.querySelectorAll('[role="option"]'));
    const currentFocused = options.find((option) => option instanceof HTMLElement && option.tabIndex === 0);
    let newFocusIndex = currentFocused ? options.indexOf(currentFocused) : 0;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        newFocusIndex = Math.min(newFocusIndex + 1, options.length - 1);
        this.#moveFocus(options, newFocusIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        newFocusIndex = Math.max(newFocusIndex - 1, 0);
        this.#moveFocus(options, newFocusIndex);
        break;

      case 'Enter':
      case ' ':
        if (event.target instanceof Element) {
          const targetOption = event.target.closest('[role="option"]');
          if (targetOption) {
            event.preventDefault();
            this.#selectOption(targetOption);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.#closeDropdown();
        break;
    }
  };

  /**
   * Handles details toggle event
   */
  handleToggle = () => {
    const { details, summary, listbox } = this.refs;
    if (!(details instanceof HTMLDetailsElement) || !(summary instanceof HTMLElement)) return;

    const isOpen = details.open;
    summary.setAttribute('aria-expanded', isOpen.toString());

    if (isOpen && listbox instanceof Element) {
      // Move focus to selected option when dropdown opens
      const selectedOption = listbox.querySelector('[aria-selected="true"]');
      if (selectedOption instanceof HTMLElement) {
        selectedOption.focus();
      }
    }
  };

  /**
   * Moves focus between options
   * @param {Element[]} options - The option elements
   * @param {number} newIndex - The index of the option to focus
   */
  #moveFocus(options, newIndex) {
    // Remove tabindex from all options
    options.forEach((option) => {
      if (option instanceof HTMLElement) {
        option.tabIndex = -1;
      }
    });

    // Set tabindex and focus on new option
    const targetOption = options[newIndex];
    if (targetOption instanceof HTMLElement) {
      targetOption.tabIndex = 0;
      targetOption.focus();
    }
  }

  /**
   * Selects an option and triggers form submission
   * @param {Element} option - The option element to select
   */
  #selectOption(option) {
    const input = option.querySelector('input[type="radio"]');
    if (input instanceof HTMLInputElement && option instanceof HTMLElement) {
      // Update aria-selected states
      this.querySelectorAll('[role="option"]').forEach((opt) => {
        opt.setAttribute('aria-selected', 'false');
      });
      option.setAttribute('aria-selected', 'true');

      // Trigger click on the input to ensure normal form behavior
      input.click();

      // Close dropdown and return focus (handles tabIndex reset)
      this.#closeDropdown();
    }
  }

  /**
   * Closes the dropdown and returns focus to summary
   */
  #closeDropdown() {
    const { details, summary } = this.refs;
    if (details instanceof HTMLDetailsElement) {
      // Reset focus to match the actual selected option
      const options = this.querySelectorAll('[role="option"]');
      const selectedOption = this.querySelector('[aria-selected="true"]');

      options.forEach((opt) => {
        if (opt instanceof HTMLElement) {
          opt.tabIndex = -1;
        }
      });

      if (selectedOption instanceof HTMLElement) {
        selectedOption.tabIndex = 0;
      }

      details.open = false;
      if (summary instanceof HTMLElement) {
        summary.focus();
      }
    }
  }

  /**
   * Updates filter and sorting
   * @param {Event} event - The change event
   */
  updateFilterAndSorting(event) {
    const facetsForm =
      this.closest('facets-form-component') || this.closest('.shopify-section')?.querySelector('facets-form-component');

    if (!(facetsForm instanceof FacetsFormComponent)) return;
    const isMobile = window.innerWidth < 750;

    const shouldDisable = this.dataset.shouldUseSelectOnMobile === 'true';

    // Because we have a select element on mobile and a bunch of radio buttons on desktop,
    // we need to disable the input during "form-submission" to prevent duplicate entries.
    if (shouldDisable) {
      if (isMobile) {
        const inputs = this.querySelectorAll('input[name="sort_by"]');
        inputs.forEach((input) => {
          if (!(input instanceof HTMLInputElement)) return;
          input.disabled = true;
        });
      } else {
        const selectElement = this.querySelector('select[name="sort_by"]');
        if (!(selectElement instanceof HTMLSelectElement)) return;
        selectElement.disabled = true;
      }
    }

    facetsForm.updateFilters();
    this.updateFacetStatus(event);

    // Re-enable the input after the form-submission
    if (shouldDisable) {
      if (isMobile) {
        const inputs = this.querySelectorAll('input[name="sort_by"]');
        inputs.forEach((input) => {
          if (!(input instanceof HTMLInputElement)) return;
          input.disabled = false;
        });
      } else {
        const selectElement = this.querySelector('select[name="sort_by"]');
        if (!(selectElement instanceof HTMLSelectElement)) return;
        selectElement.disabled = false;
      }
    }

    // Close the details element when a value is selected
    const { details } = this.refs;
    if (!(details instanceof HTMLDetailsElement)) return;
    details.open = false;

    // Close the sort sheet dialog if we're inside one
    this.closest('dialog-component')?.closeDialog();
  }

  /**
   * Updates the facet status
   * @param {Event} event - The change event
   */
  updateFacetStatus(event) {
    if (!(event.target instanceof HTMLSelectElement)) return;

    const details = this.querySelector('details');
    if (!details) return;

    const facetStatus = details.querySelector('facet-status-component');
    if (!(facetStatus instanceof FacetStatusComponent)) return;

    facetStatus.textContent =
      event.target.value !== details.dataset.defaultSortBy ? event.target.dataset.optionName ?? '' : '';
  }
}

if (!customElements.get('sorting-filter-component')) {
  customElements.define('sorting-filter-component', SortingFilterComponent);
}

/**
 * @typedef {Object} FacetStatusRefs
 * @property {HTMLElement} facetStatus - The facet status element
 */

/**
 * Handles facet status display
 * @extends {Component<FacetStatusRefs>}
 */
class FacetStatusComponent extends Component {
  /**
   * Updates the list summary
   * @param {HTMLInputElement[]} checkedInputElements - The checked input elements
   */
  updateListSummary(checkedInputElements) {
    const checkedInputElementsCount = checkedInputElements.length;

    this.getAttribute('facet-type') === 'swatches'
      ? this.#updateSwatchSummary(checkedInputElements, checkedInputElementsCount)
      : this.#updateBubbleSummary(checkedInputElements, checkedInputElementsCount);
  }

  /**
   * Updates the swatch summary
   * @param {HTMLInputElement[]} checkedInputElements - The checked input elements
   * @param {number} checkedInputElementsCount - The number of checked inputs
   */
  #updateSwatchSummary(checkedInputElements, checkedInputElementsCount) {
    const { facetStatus } = this.refs;
    facetStatus.classList.remove('bubble', 'facets__bubble');

    if (checkedInputElementsCount === 0) {
      facetStatus.innerHTML = '';
      return;
    }

    if (checkedInputElementsCount > 3) {
      facetStatus.innerHTML = checkedInputElementsCount.toString();
      facetStatus.classList.add('bubble', 'facets__bubble');
      return;
    }

    facetStatus.innerHTML = Array.from(checkedInputElements)
      .map((inputElement) => {
        const swatch = inputElement.parentElement?.querySelector('span.swatch');
        const span = document.createElement('span');
        span.className = 'visually-hidden';
        span.textContent = inputElement.getAttribute('aria-label') ?? '';
        return (swatch?.outerHTML ?? '') + span.outerHTML;
      })
      .join('');
  }

  /**
   * Updates the bubble summary
   * @param {HTMLInputElement[]} checkedInputElements - The checked input elements
   * @param {number} checkedInputElementsCount - The number of checked inputs
   */
  #updateBubbleSummary(checkedInputElements, checkedInputElementsCount) {
    const { facetStatus } = this.refs;
    const filterStyle = this.dataset.filterStyle;

    facetStatus.classList.remove('bubble', 'facets__bubble');

    if (checkedInputElementsCount === 0) {
      facetStatus.innerHTML = '';
      return;
    }

    if (filterStyle === 'horizontal' && checkedInputElementsCount === 1) {
      facetStatus.textContent = checkedInputElements[0]?.dataset.label ?? '';
      return;
    }

    facetStatus.innerHTML = checkedInputElementsCount.toString();
    facetStatus.classList.add('bubble', 'facets__bubble');
  }

  /**
   * Updates the price summary
   * @param {HTMLInputElement} minInput - The minimum price input
   * @param {HTMLInputElement} maxInput - The maximum price input
   */
  updatePriceSummary(minInput, maxInput) {
    const minInputValue = minInput.value;
    const maxInputValue = maxInput.value;
    const { facetStatus } = this.refs;

    if (!minInputValue && !maxInputValue) {
      facetStatus.innerHTML = '';
      return;
    }

    const currency = facetStatus.dataset.currency || '';
    const minInputNum = this.#parseCents(minInputValue, '0', currency);
    const maxInputNum = this.#parseCents(maxInputValue, facetStatus.dataset.rangeMax, currency);
    facetStatus.innerHTML = `${this.#formatMoney(minInputNum)}–${this.#formatMoney(maxInputNum)}`;
  }

  /**
   * Parses a decimal number as minor units (cents for most currencies, but adjusted for zero-decimal currencies)
   * @param {string} value - The stringified decimal number to parse
   * @param {string} fallback - The fallback value in case `value` is invalid (formatted string like "11,400")
   * @param {string} currency - The currency code (e.g., 'USD', 'JPY', 'KRW')
   * @returns {number} The money value in minor units
   */
  #parseCents(value, fallback = '0', currency = '') {
    // Try to parse the value
    const result = convertMoneyToMinorUnits(value, currency);
    if (result !== null) return result;

    // Fall back to parsing the fallback string (which may have formatting like "11,400")
    const fallbackResult = convertMoneyToMinorUnits(fallback, currency);
    if (fallbackResult !== null) return fallbackResult;

    // Last resort: clean and parse as integer
    const cleanFallback = fallback.replace(/[^\d]/g, '');
    return parseInt(cleanFallback, 10) || 0;
  }

  /**
   * Formats money, replicated the implementation of the `money` liquid filters
   * @param {number} moneyValue - The money value
   * @returns {string} The formatted money value
   */
  #formatMoney(moneyValue) {
    if (!(this.refs.moneyFormat instanceof HTMLTemplateElement)) return '';

    const format = this.refs.moneyFormat.content.textContent || '{{amount}}';
    const currency = this.refs.facetStatus.dataset.currency || '';

    return formatMoney(moneyValue, format, currency);
  }

  /**
   * Clears the summary
   */
  clearSummary() {
    this.refs.facetStatus.innerHTML = '';
  }
}

if (!customElements.get('facet-status-component')) {
  customElements.define('facet-status-component', FacetStatusComponent);
}
