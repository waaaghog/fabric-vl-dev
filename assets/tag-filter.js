// @ts-nocheck
// tag-filter.js
// Adds tag-based filter support to fabric-vl.
// Tags are formatted as FILTER_Category:Value (e.g. FILTER_Power:20W).
// Uses Shopify native tag-path routing: /collections/handle/tag1+tag2.
// Integrates with fabric-vl's facets-form-component AJAX system.

if (!window.TagFilterInitialized) {
  window.TagFilterInitialized = true;

  const CLOSE_SVG =
    '<span class="svg-wrapper svg-wrapper--smaller">' +
    '<svg aria-hidden="true" width="7" height="8" viewBox="0 0 7 8" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<g opacity="var(--close-icon-opacity)">' +
    '<path d="M6 1.5L1 6.5" stroke="currentColor" stroke-width="var(--icon-stroke-width)" stroke-linecap="round"/>' +
    '<path d="M1 1.5L6 6.5" stroke="currentColor" stroke-width="var(--icon-stroke-width)" stroke-linecap="round"/>' +
    '</g></svg></span>' +
    '<span class="visually-hidden">Remove</span>';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  class TagFilterHandler {
    #containerSelector = '[data-tag-active-filters]';
    #inputSelector = '.tag-filter__input';
    #labelCache = Object.create(null);
    #renderingBubbles = false;

    constructor() {
      this.#buildLabelCache(document);
      this.#renderBubbles();
      this.#updateBuiltinFilterUrls();
      this.#setupListeners();
    }

    // ── URL helpers ──────────────────────────────────────────────────────────

    #getBaseCollectionUrl() {
      // The facets form action is always the base collection URL (no tag path).
      const form = document.querySelector('form[ref="facetsForm"]');
      if (form) {
        try { return new URL(form.action).pathname; } catch (_) { /* ignore */ }
      }
      return this.#stripTagsFromPath(window.location.pathname);
    }

    #stripTagsFromPath(pathname) {
      // /en/collections/handle/tag1+tag2 → /en/collections/handle
      const parts = pathname.split('/').filter(Boolean);
      const colIdx = parts.indexOf('collections');
      if (colIdx === -1 || colIdx + 1 >= parts.length) return '/' + parts.join('/');
      return '/' + parts.slice(0, colIdx + 2).join('/');
    }

    #getActiveTagsFromPath() {
      const base = this.#getBaseCollectionUrl();
      const pathname = window.location.pathname;
      if (!pathname.startsWith(base)) return [];
      const rest = pathname.slice(base.length).replace(/^\//, '');
      return rest ? rest.split('+').filter(Boolean) : [];
    }

    #buildUrlWithTags(tags) {
      const base = this.#getBaseCollectionUrl();
      const path = tags.length > 0 ? `${base}/${tags.join('+')}` : base;
      return path + window.location.search;
    }

    // ── Navigation ───────────────────────────────────────────────────────────

    #syncFromCheckboxes(changedCheckbox) {
      // Use the URL path as source of truth to avoid double-counting
      // the same tag from both the desktop and drawer forms.
      const activeTags = new Set(this.#getActiveTagsFromPath());

      if (changedCheckbox) {
        const value = changedCheckbox.dataset.tagValue;
        if (changedCheckbox.checked) {
          activeTags.add(value);
        } else {
          activeTags.delete(value);
        }
      }

      const newUrl = this.#buildUrlWithTags([...activeTags]);

      const facetsForm =
        changedCheckbox?.closest('facets-form-component') ??
        document.querySelector('facets-form-component[section-id]');

      if (facetsForm && typeof facetsForm.updateFiltersByURL === 'function') {
        facetsForm.updateFiltersByURL(newUrl);
      } else {
        window.location.href = newUrl;
      }
    }

    // ── Label cache ──────────────────────────────────────────────────────────

    #buildLabelCache(root) {
      root.querySelectorAll?.(`${this.#inputSelector}[data-tag-label]`).forEach((input) => {
        if (input.dataset.tagValue && input.dataset.tagLabel) {
          this.#labelCache[input.dataset.tagValue] = input.dataset.tagLabel;
        }
      });
    }

    #getLabelForTag(tagValue) {
      return this.#labelCache[tagValue] ??
        tagValue.replace(/^filter-/, '').replace(/-/g, ' ');
    }

    // ── Active pills ─────────────────────────────────────────────────────────

    #renderBubbles() {
      const containers = document.querySelectorAll(this.#containerSelector);
      if (!containers.length) return;

      const activeTags = this.#getActiveTagsFromPath();

      this.#renderingBubbles = true;

      containers.forEach((container) => {
        container.innerHTML = '';

        activeTags.forEach((tagValue) => {
          const label = this.#getLabelForTag(tagValue);
          const removeUrl = this.#buildUrlWithTags(activeTags.filter(t => t !== tagValue));

          const pill = document.createElement('facet-remove-component');
          const formId = container.closest('[data-remove-form]')?.dataset.removeForm || '';
          pill.className = 'pills__pill pills__pill--desktop-small facets-remove__pill';
          pill.setAttribute('data-url', removeUrl);
          pill.setAttribute('tabindex', '0');
          pill.setAttribute('role', 'button');
          pill.setAttribute('on:click', `/removeFilter?form=${formId}`);
          pill.setAttribute('on:keydown', `/removeFilter?form=${formId}`);
          pill.setAttribute('data-tag-pill', tagValue);
          pill.innerHTML = escapeHtml(label) + CLOSE_SVG;
          container.appendChild(pill);
        });
      });

      this.#renderingBubbles = false;
    }

    // ── Update built-in filter remove URLs ───────────────────────────────────
    // Shopify's url_to_remove does not include the tag path segment.
    // Proactively update data-url on existing facet-remove-component elements
    // so removing a regular filter preserves active tag filters.

    #updateBuiltinFilterUrls() {
      const activeTags = this.#getActiveTagsFromPath();
      if (!activeTags.length) return;
      const base = this.#getBaseCollectionUrl();

      document.querySelectorAll('facet-remove-component:not([data-tag-pill]):not([data-clear-all-filters])').forEach((btn) => {
        const url = btn.dataset.url;
        if (!url) return;
        try {
          const parsed = new URL(url, window.location.origin);
          if (parsed.pathname === base || parsed.pathname === base + '/') {
            parsed.pathname = `${base}/${activeTags.join('+')}`;
            btn.dataset.url = parsed.pathname + parsed.search;
          }
        } catch (_) { /* ignore */ }
      });
    }

    // ── Listeners ────────────────────────────────────────────────────────────

    #setupListeners() {
      // Tag checkbox changes — optimistically sync all checkboxes with the same
      // tag value (desktop + drawer) before the AJAX response arrives.
      document.addEventListener('change', (e) => {
        if (!e.target.matches?.(this.#inputSelector)) return;
        this.#buildLabelCache(document);

        const { tagValue } = e.target.dataset;
        const { checked } = e.target;
        document.querySelectorAll(`${this.#inputSelector}[data-tag-value="${CSS.escape(tagValue)}"]`).forEach((input) => {
          input.checked = checked;
        });

        this.#syncFromCheckboxes(e.target);
      });

      // URL changes (pushState from facets-form-component, or back/forward)
      const rerender = () => {
        this.#buildLabelCache(document);
        this.#renderBubbles();
        this.#updateBuiltinFilterUrls();
      };

      const origPushState = history.pushState.bind(history);
      history.pushState = (state, title, url) => {
        origPushState(state, title, url);
        rerender();
      };

      window.addEventListener('popstate', rerender);

      // DOM updates — morph patches the container in-place, removing our JS-added pills.
      // Watch for childList changes on the container itself (morph empties it),
      // and also watch for new checkboxes / filter buttons added anywhere.
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          // morph cleared our pills from the container — re-render
          if (
            mutation.type === 'childList' &&
            mutation.target.matches?.(this.#containerSelector) &&
            !this.#renderingBubbles &&
            mutation.removedNodes.length > 0 &&
            mutation.target.children.length === 0
          ) {
            this.#renderBubbles();
            this.#updateBuiltinFilterUrls();
            continue;
          }

          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;

            // New tag-filter checkboxes (e.g. drawer opened)
            if (
              node.matches?.(this.#inputSelector) ||
              node.querySelector?.(this.#inputSelector)
            ) {
              this.#buildLabelCache(node);
            }

            // New built-in filter remove buttons
            if (node.querySelector?.('facet-remove-component:not([data-tag-pill])')) {
              this.#updateBuiltinFilterUrls();
            }
          }
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TagFilterHandler());
  } else {
    new TagFilterHandler();
  }
}
