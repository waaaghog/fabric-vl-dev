(function () {
  'use strict';

  var TABS = ['dashboard', 'orders', 'invoices', 'rma', 'bulk', 'favorites', 'lists', 'addresses', 'payment', 'team', 'profile'];

  // ── Shared credit-card brand icon ────────────────────────
  var _ccBrandPaths = {
    visa:       '<rect width="52" height="34" rx="5" fill="#1A1F71"/><text x="26" y="23" text-anchor="middle" fill="white" font-size="16" font-style="italic" font-weight="700" font-family="Arial,sans-serif" letter-spacing="-0.5">VISA</text>',
    mastercard: '<rect width="52" height="34" rx="5" fill="#252525"/><circle cx="21" cy="17" r="10" fill="#EB001B"/><circle cx="31" cy="17" r="10" fill="#F79E1B" fill-opacity="0.9"/>',
    amex:       '<rect width="52" height="34" rx="5" fill="#007BC1"/><text x="26" y="16" text-anchor="middle" fill="white" font-size="8" font-weight="700" font-family="Arial,sans-serif" letter-spacing="0.5">AMERICAN</text><text x="26" y="26" text-anchor="middle" fill="white" font-size="8" font-weight="700" font-family="Arial,sans-serif" letter-spacing="0.5">EXPRESS</text>',
    discover:   '<rect width="52" height="34" rx="5" fill="#231F20"/><circle cx="37" cy="17" r="16" fill="#F76F20"/><text x="19" y="21" text-anchor="middle" fill="white" font-size="8" font-weight="700" font-family="Arial,sans-serif">DISC</text>',
  };
  function brandIcon(brand, w, h) {
    var paths = _ccBrandPaths[brand];
    var svg = paths
      ? '<svg viewBox="0 0 52 34" width="' + w + '" height="' + h + '">' + paths + '</svg>'
      : '<svg viewBox="0 0 52 34" width="' + w + '" height="' + h + '" fill="none"><rect width="52" height="34" rx="5" stroke="#ccc" stroke-width="1.5"/><path d="M0 11h52" stroke="#ccc" stroke-width="1.5"/><rect x="4" y="15" width="10" height="6" rx="1" fill="#d0d8e4"/></svg>';
    return '<div class="va-pay-icon' + (paths ? ' va-cc-brand-icon' : '') + '">' + svg + '</div>';
  }

  // ── Market handle + company info ─────────────────────────
  var vaMarketHandle = null;
  var vaCompanyName  = null;
  var vaHasChildren  = false;
  // window.__vaCustomerInfo is set by theme.liquid before any section script runs
  var vaMarketReady = window.__vaCustomerInfo.then(function (data) {
    if (data) {
      vaMarketHandle = (data.shopifyMarketHandle || '').toUpperCase();
      vaCompanyName  = data.Name || data.name || null;
      vaHasChildren  = (data.childCount || 0) > 0;
      // Show team & permissions nav entry only for multi-location accounts
      var teamNavLink = document.querySelector('.va-side-link[data-tab="team"]');
      if (teamNavLink) teamNavLink.style.display = vaHasChildren ? '' : 'none';
      // Apply company name to sidebar and profile panel
      if (vaCompanyName) {
        var sideInfo = document.querySelector('.va-side-info');
        if (sideInfo && !sideInfo.querySelector('.va-side-company')) {
          var nameEl = sideInfo.querySelector('.va-side-name');
          var compEl = document.createElement('div');
          compEl.className = 'va-side-company';
          compEl.textContent = vaCompanyName;
          if (nameEl && nameEl.nextSibling) sideInfo.insertBefore(compEl, nameEl.nextSibling);
          else sideInfo.appendChild(compEl);
        }
        var profileCompany = document.getElementById('va-profile-company-name');
        if (profileCompany) profileCompany.textContent = vaCompanyName;
        var customerNoVal = data.No || data.no || '';
        var customerNoEl = document.getElementById('va-profile-company-no');
        if (customerNoEl && customerNoVal) {
          customerNoEl.textContent = customerNoVal;
          var customerNoRow = document.getElementById('va-profile-company-no-row');
          if (customerNoRow) customerNoRow.hidden = false;
        }
        var sideNoEl = document.getElementById('va-side-customer-no');
        if (sideNoEl && customerNoVal) { sideNoEl.textContent = 'Customer # ' + customerNoVal; sideNoEl.hidden = false; }
        var marketEl = document.getElementById('va-profile-company-market');
        if (marketEl && vaMarketHandle) {
          marketEl.textContent = vaMarketHandle.toLowerCase().replace(/[-_]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
          var marketRow = document.getElementById('va-profile-company-market-row');
          if (marketRow) marketRow.hidden = false;
        }
        // Address from BC
        var dd = data;
        var addrParts = [
          dd.Address  || dd.address  || '',
          dd.Address2 || dd.address2 || '',
          [dd.City || dd.city || '', dd.County || dd.county || '', dd.PostCode || dd.postCode || '', dd.CountryRegionCode || dd.countryRegionCode || ''].filter(Boolean).join(', '),
        ].filter(Boolean);
        var addrEl = document.getElementById('va-profile-company-addr');
        if (addrEl && addrParts.length) {
          addrEl.textContent = addrParts.join('\n');
          addrEl.style.whiteSpace = 'pre-line';
          var addrRow = document.getElementById('va-profile-company-addr-row');
          if (addrRow) addrRow.hidden = false;
        }
        var phoneVal = dd.PhoneNo || dd.phoneNo || '';
        var phoneEl = document.getElementById('va-profile-company-phone');
        if (phoneEl && phoneVal) {
          phoneEl.textContent = phoneVal;
          var phoneRow = document.getElementById('va-profile-company-phone-row');
          if (phoneRow) phoneRow.hidden = false;
        }
        var profilePanel = document.getElementById('va-profile-company-panel');
        if (profilePanel) profilePanel.hidden = false;
      }

      // Dashboard address widget
      var addrCount   = data.addressCount || 0;
      var defShipTo   = data.defaultShipTo || null;
      var metricEl    = document.getElementById('va-metric-addr-count');
      var dashSubEl   = document.getElementById('va-dash-addr-sub');
      var dashListEl  = document.getElementById('va-dash-addr-list');
      if (metricEl)  metricEl.textContent = addrCount || '';
      if (dashSubEl) dashSubEl.textContent = addrCount + ' ship-to location' + (addrCount !== 1 ? 's' : '');
      if (dashListEl) {
        if (!defShipTo) {
          dashListEl.innerHTML = '<div class="va-empty">No addresses on file.</div>';
        } else {
          var addrHtml = '<div class="va-list-item">'
            + '<div class="va-list-item-icon" style="background:var(--va-parchment);color:var(--va-steel);">'
            + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
            + '</div>'
            + '<div class="va-list-info">'
            + '<div class="va-list-name">' + escHtml(defShipTo.company || '') + '</div>'
            + '<div class="va-list-meta">' + escHtml([defShipTo.city, defShipTo.state].filter(Boolean).join(', ')) + '</div>'
            + '</div></div>';
          if (addrCount > 1) {
            addrHtml += '<div class="va-list-item va-list-item--more">'
              + '<span style="font-size:13px;color:var(--va-steel);padding:6px 10px;">+ ' + (addrCount - 1) + ' more location' + (addrCount - 1 !== 1 ? 's' : '') + '</span>'
              + '</div>';
          }
          dashListEl.innerHTML = addrHtml;
        }
      }

      return vaMarketHandle;
    }
    return null;
  });

  // [warmup ping disabled — no cold start on Azure]
  // window.__vaWarmupPing = (function () {
  //   var auth = window.__vaAuth || {};
  //   if (!auth.proxy) return Promise.resolve();
  //   return fetch(auth.proxy, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ action: 'ping', customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop })
  //   }).catch(function () {});
  // })();

  // ── Tab activation ──────────────────────────────────────
  function activateTab(tab) {
    if (TABS.indexOf(tab) === -1) tab = 'dashboard';
    TABS.forEach(function (t) {
      var el = document.getElementById('va-tab-' + t);
      if (el) el.classList.toggle('va-tab--active', t === tab);
    });
    document.querySelectorAll('.va-side-link[data-tab]').forEach(function (link) {
      link.classList.toggle('va-side-link--active', link.dataset.tab === tab);
    });
  }

  // ── Order detail panel state ─────────────────────────────
  var odPanel     = document.getElementById('va-od-panel');
  var odContent   = document.getElementById('va-od-content');
  var odBack      = document.getElementById('va-od-back');
  var odTopName   = document.getElementById('va-od-topbar-name');
  var odTopNum    = document.getElementById('va-od-topbar-num');
  var odTopExt    = document.getElementById('va-od-topbar-ext');
  var ordersSub   = document.getElementById('va-orders-page-sub');
  var ordersPanel = document.getElementById('va-orders-list-panel');
  var odCache     = {};
  var odFromTab   = null; // track which tab opened the detail panel

  function showOrderDetail(orderId, name, source, sellTo) {
    console.log('[showOrderDetail] orderId=' + orderId + ' source=' + source + ' panel=' + !!odPanel + ' content=' + !!odContent);
    if (!odPanel || !odContent) { console.error('[showOrderDetail] panel/content missing, aborting'); return; }
    odFromTab = getTabFromHash();
    // Hide orders-specific chrome only when coming from the orders tab
    if (odFromTab === 'orders') {
      ordersSub   && (ordersSub.hidden   = true);
      ordersPanel && (ordersPanel.hidden = true);
    }
    odPanel.hidden = false;
    if (odTopName) odTopName.textContent = name || '';
    if (odTopNum) { odTopNum.hidden = true; odTopNum.textContent = ''; }
    if (odTopExt) { odTopExt.hidden = true; odTopExt.textContent = ''; }
    if (odCache[orderId]) {
      odContent.innerHTML = odCache[orderId];
      initDetailPanel();
      return;
    }
    odContent.innerHTML = '<div class="va-od-skeleton"><div class="va-od-skel va-od-skel--short"></div><div class="va-od-skel"></div><div class="va-od-skel va-od-skel--wide"></div><div class="va-od-skel va-od-skel--short"></div></div>';
    var auth = window.__vaAuth || {};
    console.log('[showOrderDetail] fetching proxy=' + (auth.proxy || '(empty)') + ' orderId=' + orderId);
    fetch(auth.proxy || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:      'order-detail',
        customer_id: auth.customer_id,
        ts:          auth.ts,
        token:       auth.token,
        shop:        Shopify.shop,
        order_id:             orderId,
        source:               source || '',
        sell_to_customer_no:  sellTo || ''
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error(data.error || 'Error');
        var orderData = data.data;
        if (odTopName && orderData.name) odTopName.textContent = orderData.name;
        if (odTopNum && orderData.orderNo) {
          odTopNum.textContent = 'Order# \u00a0' + orderData.orderNo;
          odTopNum.hidden = false;
        }
        if (odTopExt && orderData.externalDocumentNo) {
          odTopExt.textContent = 'Reference# \u00a0' + orderData.externalDocumentNo;
          odTopExt.hidden = false;
        }
        vaMarketReady.then(function () {
          odCache[orderId] = renderOrderDetailHtml(orderData);
          odContent.innerHTML = odCache[orderId];
          initDetailPanel();
        });
      })
      .catch(function (err) {
        console.error('[showOrderDetail] fetch/parse error:', err);
        odContent.innerHTML = '<div class="va-empty" style="flex-direction:column;gap:10px;"><p>Could not load order details: ' + escHtml(err.message) + '</p></div>';
      });
  }

  function closeOrderDetail() {
    if (!odPanel) return;
    odPanel.hidden = true;
    if (odFromTab === 'orders') {
      ordersSub   && (ordersSub.hidden   = false);
      ordersPanel && (ordersPanel.hidden = false);
    }
    odFromTab = null;
  }

  function initDetailPanel() {
    odContent.querySelectorAll('.va-multiship-detail[data-order]:not([data-rendered])').forEach(function (ms) {
      try {
        var orderData = JSON.parse(ms.dataset.order    || '[]');
        var liMap     = JSON.parse(ms.dataset.lineitems || '{}');
        renderMultiship(ms, orderData, liMap);
        ms.dataset.rendered = '1';
      } catch (e) {
        ms.innerHTML = '<div class="va-empty"><p>Could not parse distribution data.</p></div>';
      }
    });

    // CC authorization wiring — loads stored cards and lets customer pick one (ORDER_ON_CREDIT_HOLD)
    odContent.querySelectorAll('.va-od-pay-section').forEach(function (section) {
      var methodInfo = section.querySelector('.va-od-pay-method-info');
      var authBtn    = section.querySelector('.va-od-cc-authorize');
      var chooseBtn  = section.querySelector('.va-od-pay-choose-btn');
      var payList    = section.querySelector('.va-od-pay-list');
      var errEl      = section.querySelector('.va-od-cc-form-err');
      var selectedId = null;
      var allAccts   = [];

      function showErr(msg) { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } }
      function _acctLabel(acct) {
        // Decode literal \u{XXXX} and \uXXXX sequences stored by PHP single-quoted strings.
        var name = (acct.bankName || '')
          .replace(/\\u\{([0-9a-fA-F]+)\}/g, function (_, hex) {
            return String.fromCharCode(parseInt(hex, 16));
          })
          .replace(/\\u([0-9a-fA-F]{4})/g, function (_, hex) {
            return String.fromCharCode(parseInt(hex, 16));
          });
        if (!name && acct.last4) {
          var br = acct.brand ? acct.brand.charAt(0).toUpperCase() + acct.brand.slice(1) : 'Card';
          name = br + ' \u2022\u2022\u2022\u2022' + acct.last4;
        }
        return name || 'Payment card';
      }
      function renderSelected(acct) {
        if (!methodInfo) return;
        methodInfo.innerHTML = brandIcon(acct.brand, 36, 23)
          + '<span class="va-od-pay-acct-name">' + escHtml(_acctLabel(acct)) + '</span>';
      }

      // Fetch stored credit cards
      var auth = window.__vaAuth || {};
      fetch(auth.proxy || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ach-list', customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop })
      })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Error');
        allAccts = (d.accounts || []).filter(function (a) { return a.accountType === 'CreditCard'; });
        if (!allAccts.length) {
          if (methodInfo) methodInfo.innerHTML = '<span class="va-od-pay-empty">No credit cards saved. <a href="#payment">Add a card</a> in Payment &amp; Terms.</span>';
          return;
        }
        var def = allAccts.find(function (a) { return a.autoPayForABO; }) || allAccts[0];
        selectedId = def.id;
        renderSelected(def);
        if (authBtn) authBtn.disabled = false;
        if (allAccts.length > 1 && chooseBtn) {
          chooseBtn.hidden = false;
          if (payList) payList.innerHTML = allAccts.map(function (a) {
            return '<div class="va-od-pay-list-item' + (a.id === def.id ? ' va-od-pay-list-item--selected' : '') + '" data-acct-id="' + escHtml(a.id) + '">'
              + brandIcon(a.brand, 36, 23)
              + '<span class="va-od-pay-acct-name">' + escHtml(_acctLabel(a)) + '</span>'
              + '</div>';
          }).join('');
        }
      })
      .catch(function () {
        if (methodInfo) methodInfo.innerHTML = '<span class="va-od-pay-empty">Could not load payment methods.</span>';
      });

      // Toggle account chooser list
      if (chooseBtn) chooseBtn.addEventListener('click', function () {
        if (!payList) return;
        payList.hidden = !payList.hidden;
        chooseBtn.textContent = payList.hidden ? 'Change \u25be' : 'Change \u25b4';
      });

      // Select a different account from the list
      if (payList) payList.addEventListener('click', function (e) {
        var item = e.target.closest && e.target.closest('.va-od-pay-list-item');
        if (!item) return;
        selectedId = item.dataset.acctId;
        var acct = allAccts.find(function (a) { return a.id === selectedId; });
        if (acct) renderSelected(acct);
        payList.querySelectorAll('.va-od-pay-list-item').forEach(function (el) {
          el.classList.toggle('va-od-pay-list-item--selected', el.dataset.acctId === selectedId);
        });
        payList.hidden = true;
        if (chooseBtn) chooseBtn.textContent = 'Change \u25be';
      });

      // Authorize with selected stored card
      if (authBtn) authBtn.addEventListener('click', function () {
        if (!selectedId) return;
        if (errEl) errEl.hidden = true;
        authBtn.disabled = true;
        authBtn.textContent = 'Authorizing\u2026';
        fetch(auth.proxy || '', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action:                  'cc-authorize-order',
            customer_id:             auth.customer_id,
            ts:                      auth.ts,
            token:                   auth.token,
            shop:                    Shopify.shop,
            order_id:                section.dataset.orderId,
            order_name:              section.dataset.orderName,
            bank_account_system_id:  selectedId
          })
        })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d.ok) throw new Error(d.error || 'Authorization failed');
          section.innerHTML = '<div class="va-od-cc-success">\u2713 Payment authorized successfully.</div>';
          delete odCache[section.dataset.orderId];
        })
        .catch(function (err) {
          authBtn.disabled = false;
          authBtn.textContent = 'Authorize payment';
          showErr(err.message || 'Authorization failed. Please try again.');
        });
      });
    });
  }

  if (odBack) {
    odBack.addEventListener('click', function () {
      history.pushState(null, '', '#orders');
      closeOrderDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Hash routing ─────────────────────────────────────────
  function getTabFromHash() {
    var hash = location.hash.replace('#', '');
    if (hash.indexOf('orders/') === 0) return 'orders';
    return TABS.indexOf(hash) !== -1 ? hash : 'dashboard';
  }

  var _vaPendingOrderSlug = null;

  function applyHash() {
    var hash = location.hash.replace('#', '');
    var tab  = getTabFromHash();
    activateTab(tab);
    console.log('[applyHash] hash="' + hash + '" tab=' + tab);
    if (hash.indexOf('orders/') === 0) {
      var slug = hash.slice('orders/'.length);
      var row  = document.querySelector('.va-order-row[data-order-slug="' + slug + '"]');
      console.log('[applyHash] slug="' + slug + '" rowFound=' + !!row);
      if (row) {
        console.log('[applyHash] using row orderId=' + row.dataset.orderId + ' source=' + row.dataset.source);
        showOrderDetail(row.dataset.orderId, row.dataset.orderName, row.dataset.source, row.dataset.sellTo);
      } else {
        // Row not in DOM yet (orders still loading) or order is on another page.
        // Infer source from slug pattern so the proxy uses the right lookup path.
        var inferredSource = /^PSI/i.test(slug) ? 'invoice' : 'order';
        var inferredId     = inferredSource === 'invoice' ? 'INV-' + slug : slug;
        console.log('[applyHash] no row, inferred source=' + inferredSource + ' id=' + inferredId);
        // Keep pending so orderRender can re-call with accurate row data if the order appears on page 1.
        _vaPendingOrderSlug = slug;
        showOrderDetail(inferredId, slug, inferredSource, '');
      }
    } else {
      _vaPendingOrderSlug = null;
      closeOrderDetail();
    }
  }

  // ── Dashboard: recent invoices (last 30 days, slim endpoint) ────────────
  function dashLoad() {
    var auth = window.__vaAuth || {};
    fetch(auth.proxy || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dash-recent', customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.ok) throw new Error(data.error || 'Error');
      var orders = data.orders || [];
      var dashEl   = document.getElementById('va-dash-order-list');
      var dashSubEl = document.getElementById('va-dash-order-sub');
      var emptyDash = '<div class="va-empty"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/></svg>No invoices in the last 30 days.</div>';
      if (dashEl) dashEl.innerHTML = orders.length
        ? orders.map(function (o) { return renderOrderRowHtml(o, true); }).join('')
        : emptyDash;
      if (dashSubEl) dashSubEl.textContent = orders.length
        ? orders.length + ' invoice' + (orders.length !== 1 ? 's' : '') + ' in the last 30 days'
        : 'Last 30 days';
    })
    .catch(function (err) {
      var dashEl = document.getElementById('va-dash-order-list');
      if (dashEl) dashEl.innerHTML = '<div class="va-empty">Could not load recent orders: ' + escHtml(err.message) + '</div>';
    });
  }

  // ── Order list: fetch + render (paginated) ───────────────
  var orderState = { page: 1, hasMore: false, totalPages: null, totalCount: 0, loading: false, dashLoaded: true };

  applyHash();
  dashLoad();
  orderLoad(1);

  window.addEventListener('hashchange', function () {
    applyHash();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('.va-side-link[data-tab], .va-side-link-trigger[data-tab]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var tab = this.dataset.tab;
      if (TABS.indexOf(tab) === -1) return;
      e.preventDefault();
      history.pushState(null, '', '#' + tab);
      activateTab(tab);
      closeOrderDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Order row click (delegated — works with dynamically rendered rows) ───
  document.addEventListener('click', function (e) {
    var row = e.target.closest && e.target.closest('.va-order-row[data-order-id]');
    if (!row) return;
    if (e.target.closest('a, button:not(.va-order-chev)')) return;
    var orderId = row.dataset.orderId;
    activateTab('orders');
    var slug = row.dataset.orderSlug || (row.dataset.orderId || '').replace(/^INV-/, '');
    history.pushState(null, '', slug ? '#orders/' + slug : '#orders');
    showOrderDetail(orderId, row.dataset.orderName, row.dataset.source, row.dataset.sellTo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function orderLoad(pg) {
    if (orderState.loading) return;
    orderState.loading = true;
    pg = pg || 1;
    var listEl  = document.getElementById('va-orders-list');
    var pagerEl = document.getElementById('va-orders-pager');
    if (listEl)  listEl.innerHTML = '<div class="va-empty">Loading orders\u2026</div>';
    if (pagerEl) pagerEl.hidden = true;
    var auth = window.__vaAuth || {};
    fetch(auth.proxy || '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:      'order-list',
        customer_id: auth.customer_id,
        ts:          auth.ts,
        token:       auth.token,
        shop:        Shopify.shop,
        page:        pg
      })
    })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.ok) throw new Error(data.error || 'Error');
      orderState.loading    = false;
      orderState.page       = data.page || pg;
      orderState.hasMore    = !!data.hasMore;
      orderState.totalPages = data.totalPages || null;
      orderState.totalCount = data.totalCount || 0;
      var orders = data.orders || [];
      orderRender(orders);
      ordersApplyFilter();
      updateOrderSubs(orderState.totalCount);
    })
    .catch(function (err) {
      orderState.loading = false;
      var errHtml = '<div class="va-empty">Could not load orders: ' + escHtml(err.message) + '</div>';
      var el = document.getElementById('va-dash-order-list');
      if (el && !orderState.dashLoaded) el.innerHTML = errHtml;
      el = document.getElementById('va-orders-list');
      if (el) el.innerHTML = errHtml;
    });
  }

  function orderRender(orders) {
    var listEl  = document.getElementById('va-orders-list');
    var pagerEl = document.getElementById('va-orders-pager');
    var emptyFull = '<div class="va-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>No orders yet.</div>';
    if (listEl) listEl.innerHTML = orders.length
      ? orders.map(function (o) { return renderOrderRowHtml(o, false); }).join('')
      : emptyFull;
    if (pagerEl) {
      var pg = orderState.page, tp = orderState.totalPages, pagerNums = '', pgLast = null, delta = 2;
      if (tp && tp > 1) {
        for (var pi = 1; pi <= tp; pi++) {
          if (pi === 1 || pi === tp || (pi >= pg - delta && pi <= pg + delta)) {
            if (pgLast !== null && pi - pgLast > 1) pagerNums += '<span class="va-inv-pg-ellipsis">\u2026</span>';
            pagerNums += '<button class="va-inv-pg-num' + (pi === pg ? ' va-inv-pg-num--active' : '') + '" data-order-page="' + pi + '"' + (pi === pg ? ' disabled' : '') + '>' + pi + '</button>';
            pgLast = pi;
          }
        }
      }
      var pagerContent = '<button class="va-inv-pager-btn" id="va-order-prev"' + (pg <= 1 ? ' disabled' : '') + '>\u2190 Prev</button>'
        + (pagerNums || '<span class="va-inv-pager-info">Page ' + pg + (tp ? ' of ' + tp : '') + '</span>')
        + '<button class="va-inv-pager-btn" id="va-order-next"' + (!orderState.hasMore ? ' disabled' : '') + '>Next \u2192</button>';
      pagerEl.innerHTML = pagerContent;
      pagerEl.hidden = !orders.length || (pg <= 1 && !orderState.hasMore);
      var pagerTopEl = document.getElementById('va-orders-pager-top');
      if (pagerTopEl) {
        pagerTopEl.innerHTML = '<button class="va-inv-pager-btn" id="va-order-prev-top"' + (pg <= 1 ? ' disabled' : '') + '>\u2190 Prev</button>'
          + (pagerNums || '<span class="va-inv-pager-info">Page ' + pg + (tp ? ' of ' + tp : '') + '</span>')
          + '<button class="va-inv-pager-btn" id="va-order-next-top"' + (!orderState.hasMore ? ' disabled' : '') + '>Next \u2192</button>';
        pagerTopEl.hidden = !orders.length || (pg <= 1 && !orderState.hasMore);
      }
    }
    if (_vaPendingOrderSlug) {
      var pendingRow = document.querySelector('.va-order-row[data-order-slug="' + _vaPendingOrderSlug + '"]');
      _vaPendingOrderSlug = null;
      // Re-call with accurate row data (correct orderName, sellTo, source) if the row is on this page.
      // If not found here, the inferred call from applyHash already fired with the correct source.
      if (pendingRow) { showOrderDetail(pendingRow.dataset.orderId, pendingRow.dataset.orderName, pendingRow.dataset.source, pendingRow.dataset.sellTo); }
    }
  }

  // Update just the active page number in all pagers without touching the list.
  function orderPagerSync() {
    var pg = orderState.page, tp = orderState.totalPages;
    [document.getElementById('va-orders-pager'), document.getElementById('va-orders-pager-top')].forEach(function (el) {
      if (!el) return;
      el.querySelectorAll('[data-order-page]').forEach(function (btn) {
        var p = parseInt(btn.dataset.orderPage, 10);
        btn.classList.toggle('va-inv-pg-num--active', p === pg);
        btn.disabled = p === pg;
      });
      var info = el.querySelector('.va-inv-pager-info');
      if (info) info.textContent = 'Page ' + pg + (tp ? ' of ' + tp : '');
    });
  }

  document.addEventListener('click', function (e) {
    var newPg = null;
    if ((e.target.id === 'va-order-prev' || e.target.id === 'va-order-prev-top') && orderState.page > 1) newPg = orderState.page - 1;
    else if ((e.target.id === 'va-order-next' || e.target.id === 'va-order-next-top') && orderState.hasMore) newPg = orderState.page + 1;
    else { var pgBtn = e.target.closest && e.target.closest('[data-order-page]'); if (pgBtn && !pgBtn.disabled) newPg = parseInt(pgBtn.dataset.orderPage, 10); }
    if (newPg !== null) { orderState.page = newPg; orderPagerSync(); orderLoad(newPg); }
  });

  function renderOrderRowHtml(order, isDash) {
    var sc    = odStatusClass(order);
    var id    = order.id || '';
    var slug  = (order.orderNo || order.name || id.replace(/^INV-/, '') || '').replace('#', '');
    var lines = order.lineItemsCount || 0;
    var po    = (order.customAttributes || []).find(function (a) {
      return a.key === 'po_number' || a.key === 'PO Number' || a.key === 'PO #';
    });
    var isMs = (order.customAttributes || []).some(function (a) { return a.key === '_order' && a.value; });
    var metaParts = [];
    if (po) metaParts.push(escHtml(po.value));
    if (lines > 0) metaParts.push(lines + ' line' + (lines !== 1 ? 's' : ''));
    if (isMs) metaParts.push('multiship');
    var meta = metaParts.join(' \u00b7 ');
    var money = order.totalPriceSet ? order.totalPriceSet.shopMoney : null;
    var moneyStr = (money && parseFloat(money.amount) > 0) ? escHtml(odFmtMoney(money.amount, money.currencyCode)) : '';
    var searchStr = [order.name || '', po ? po.value : '', order._shipToAddress || ''].filter(Boolean).join(' ').toLowerCase();
    return '<div class="va-order-row" data-order-id="' + escHtml(id) + '"' +
      ' data-order-name="' + escHtml(order.name || '') + '"' +
      ' data-order-slug="' + escHtml(slug) + '"' +
      ' data-source="' + escHtml(order._source || '') + '"' +
      ' data-sell-to="' + escHtml(order._sellToCustomerNo || '') + '"' +
      ' data-search="' + escHtml(searchStr) + '"' +
      (isDash ? ' data-dash="1"' : '') + '>' +
      '<div class="va-order-id">' +
      '<div class="va-order-num">' + escHtml(order.name || '') + '</div>' +
      '<div class="va-order-po">' + meta + '</div></div>' +
      '<div class="va-order-cell">' + escHtml(fmtDate(order.createdAt)) + '</div>' +
      '<div class="va-order-cell">' + moneyStr + '</div>' +
      '<div><span class="va-status-pill ' + sc.cls + '"><span class="va-sd"></span>' + escHtml(sc.label) + '</span></div>' +
      '<div class="va-order-chev"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></div>' +
      '</div>';
  }

  function updateOrderSubs(totalCount) {
    var subEl      = document.getElementById('va-dash-head-sub');
    var ordSubEl   = document.getElementById('va-orders-page-sub');
    var metricEl   = document.getElementById('va-metric-total-orders');
    if (subEl)    subEl.textContent    = totalCount + ' total order' + (totalCount !== 1 ? 's' : '') + '.';
    if (ordSubEl) ordSubEl.textContent = totalCount + ' total order' + (totalCount !== 1 ? 's' : '') + ' \u00b7 click a row to expand';
    if (metricEl) metricEl.textContent = totalCount;
  }

  // kept for future use
  function updateOrderMetrics(orders) {}

  function ordersApplyFilter() {
    var searchEl = document.getElementById('va-orders-search');
    var q = searchEl ? searchEl.value.toLowerCase().replace(/[,\/]/g, ' ').replace(/\s+/g, ' ').trim() : '';
    var listEl = document.getElementById('va-orders-list');
    if (!listEl) return;
    var rows = listEl.querySelectorAll('.va-order-row[data-order-id]');
    var shown = 0;
    rows.forEach(function (row) {
      var visible = !q || (row.dataset.search || '').includes(q);
      row.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    var subEl = document.getElementById('va-orders-page-sub');
    if (subEl) {
      if (q && rows.length > 0) {
        subEl.textContent = shown + ' of ' + rows.length + ' order' + (rows.length !== 1 ? 's' : '') + ' on this page';
      } else {
        updateOrderSubs(orderState.totalCount);
      }
    }
  }

  // ── Order detail renderer ────────────────────────────────
  function renderOrderDetailHtml(order) {
    var isMs   = (order.customAttributes || []).some(function (a) { return a.key === '_order' && a.value; });
    var html   = '<div class="va-od">';

    // Status + meta
    var sc = odStatusClass(order);
    html += '<div class="va-od-meta">';
    html += '<span class="va-status-pill ' + sc.cls + '"><span class="va-sd"></span>' + escHtml(sc.label) + '</span>';
    var fst = (order.displayFulfillmentStatus || '').toLowerCase();
    if (fst && fst !== 'unfulfilled') {
      var fstLabelMap = { delivered: 'Shipped', partial: 'Partially shipped' };
      var fstLabel = fstLabelMap[fst] || fst.replace(/_/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
      html += '<span class="va-status-pill ' + fst + '"><span class="va-sd"></span>' + escHtml(fstLabel) + '</span>';
    }
    html += '<span class="va-od-date-chip">' + escHtml(fmtDate(order.createdAt, true)) + '</span>';
    var po = (order.customAttributes || []).find(function (a) { return a.key === 'po_number' || a.key === 'PO Number' || a.key === 'PO #'; });
    if (po) html += '<span class="va-od-date-chip">PO: ' + escHtml(po.value) + '</span>';
    html += '</div>';

    // Pay section for orders awaiting credit card authorization
    //if (order.orderStatus === 'ORDER_ON_CREDIT_HOLD' && vaMarketHandle === 'CRICKET-WIRELESS') {
    if (order.authorizationCode === '' && order.paymentMethodCode === 'CLOVER') {
      html += '<div class="va-od-pay-section"'
            + ' data-order-id="'   + escHtml(order.id   || '') + '"'
            + ' data-order-name="' + escHtml(order.name || '') + '">';
      html += '<div class="va-od-pay-notice"><strong>Action required:</strong>'
            + ' This order is awaiting payment authorization.</div>';
      // Method row: card display on left, action buttons on right
      html += '<div class="va-od-pay-method-row">'
            + '<div class="va-od-pay-method-info"><span class="va-od-pay-empty">Loading\u2026</span></div>'
            + '<div class="va-od-pay-actions">'
            + '<button class="va-od-pay-choose-btn" hidden>Change \u25be</button>'
            + '<button class="va-od-cc-authorize" disabled>Authorize payment</button>'
            + '</div></div>';
      // Expandable account chooser list
      html += '<div class="va-od-pay-list" hidden></div>';
      // Manual form kept hidden for future use
      html += '<div class="va-od-cc-form" hidden>';
      html += '<div class="va-od-cc-form-consent">'
            + 'By entering your credit card you authorize Valor Communication, Inc. to charge this card for the order total.'
            + '<p><input type="checkbox" name="od_cc_consent">&nbsp;&nbsp;I understand and agree</p></div>';
      html += '<div class="va-od-cc-form-row">'
            + '<input name="od_cc_number" placeholder="Card number" autocomplete="cc-number" inputmode="numeric" maxlength="19">'
            + '</div>';
      html += '<div class="va-od-cc-form-row">'
            + '<input name="od_cc_holder" placeholder="Cardholder name" autocomplete="cc-name">'
            + '<input name="od_cc_expiry" placeholder="MM/YY" autocomplete="cc-exp" maxlength="5" style="max-width:90px;">'
            + '<input name="od_cc_cvv" placeholder="CVV" type="password" autocomplete="cc-csc" maxlength="4" style="max-width:80px;">'
            + '<input name="od_cc_zip" placeholder="ZIP" maxlength="10" style="max-width:110px;">'
            + '</div>';
      html += '<div class="va-od-cc-form-actions">'
            + '<button class="va-od-cc-cancel-auth" type="button">Cancel</button>'
            + '</div>';
      html += '</div>';
      html += '<div class="va-od-cc-form-err" hidden></div>';
      html += '</div>';
    }

    // Multiship distribution
    var orderAttr = (order.customAttributes || []).find(function (a) { return a.key === '_order'; });
    if (orderAttr && orderAttr.value) {
      var liMap = odBuildLiMap(order.lineItems ? order.lineItems.nodes : []);
      html += '<div class="va-od-section"><div class="va-od-section-title">Multiship distribution</div>';
      html += '<div class="va-multiship-detail" data-order="' + escHtml(orderAttr.value).replace(/"/g, '&quot;') + '" data-lineitems="' + escHtml(JSON.stringify(liMap)).replace(/"/g, '&quot;') + '">';
      html += '<div class="va-od-loading-inline">Loading\u2026</div></div></div>';
    }

    // Line items
    var nodes = (order.lineItems ? order.lineItems.nodes : []) || [];
    html += '<div class="va-od-section"><div class="va-od-section-title">';
    html += isMs ? 'All items (' + nodes.length + ')' : 'Order items';
    html += '</div><div class="va-od-lineitems">';
    nodes.forEach(function (li) {
      var imgUrl  = li.image ? li.image.url + '?width=100' : null;
      var zoomUrl = li.image ? li.image.url + '?width=800' : null;
      var handle  = li.variant && li.variant.product ? li.variant.product.handle : null;
      var prodUrl = handle ? '/products/' + handle : null;
      var money   = li.originalUnitPriceSet ? li.originalUnitPriceSet.shopMoney : null;
      html += '<div class="va-od-li">';
      html += '<div class="va-od-li-img">';
      if (imgUrl) html += '<img src="' + escHtml(imgUrl) + '" data-zoom="' + escHtml(zoomUrl) + '" alt="' + escHtml(li.title) + '" loading="lazy" width="56" height="56" class="va-zoomable">';
      html += '</div><div class="va-od-li-info">';
      var nm = prodUrl ? '<a href="' + escHtml(prodUrl) + '" class="va-product-link">' + escHtml(li.title) + '</a>' : escHtml(li.title);
      html += '<div class="va-od-li-name">' + nm + '</div>';
      var metaHtml = escHtml(li.meta || '');
      if (li.variantTitle && li.variantTitle !== 'Default Title') {
        if (metaHtml) metaHtml += ' \u00b7 ';
        metaHtml += escHtml(li.variantTitle);
      }
      html += '<div class="va-od-li-meta">' + metaHtml + '</div>';
      html += '</div><div class="va-od-li-right">';
      html += '<div class="va-od-li-qty">\u00d7 ' + li.quantity + '</div>';
      if (money) html += '<div class="va-od-li-price">' + escHtml(odFmtMoney(money.amount, money.currencyCode)) + '</div>';
      html += '</div></div>';
    });
    html += '</div></div>';

    // Bottom: addresses + totals
    html += '<div class="va-od-bottom"><div class="va-od-addresses">';
    if (!isMs && order.shippingAddress) {
      html += '<div class="va-od-addr-block"><div class="va-od-section-title">Ship to</div>' + odRenderAddr(order.shippingAddress) + '</div>';
    }
    if (order.billingAddress) {
      html += '<div class="va-od-addr-block"><div class="va-od-section-title">Bill to</div>' + odRenderAddr(order.billingAddress) + '</div>';
    }
    var pmTxns = (order.transactions || []).filter(function (t) {
      return (t.kind === 'SALE' || t.kind === 'AUTHORIZATION') && t.status === 'SUCCESS';
    });
    if (pmTxns.length || (order.paymentGatewayNames || []).length) {
      html += '<div class="va-od-addr-block"><div class="va-od-section-title">Payment method</div>';
      if (pmTxns.length) {
        pmTxns.forEach(function (t) {
          var d = t.paymentDetails;
          html += '<div class="va-od-payment-method">';
          if (d && d.company) {
            html += escHtml(d.company);
            if (d.number) html += '<span class="va-od-payment-digits"> ' + escHtml(d.number) + '</span>';
          } else {
            html += escHtml(t.formattedGateway || t.gateway || '');
          }
          html += '</div>';
        });
      } else {
        var pmNames = (order.paymentGatewayNames || []).map(function (n) {
          return n.replace(/_/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
        });
        html += '<div class="va-od-payment-method">' + escHtml(pmNames.join(', ')) + '</div>';
      }
      html += '</div>';
    }
    html += '</div><div class="va-od-totals">';
    function trow(label, money, extraCls) {
      if (!money) return '';
      return '<div class="va-od-trow' + (extraCls ? ' ' + extraCls : '') + '"><span>' + escHtml(label) + '</span><span>' + escHtml(odFmtMoney(money.amount, money.currencyCode)) + '</span></div>';
    }
    html += trow('Subtotal', order.subtotalPriceSet ? order.subtotalPriceSet.shopMoney : null);
    var ship = order.totalShippingPriceSet ? order.totalShippingPriceSet.shopMoney : null;
    if (ship && parseFloat(ship.amount) > 0) html += trow('Shipping', ship);
    var tax = order.totalTaxSet ? order.totalTaxSet.shopMoney : null;
    if (tax && parseFloat(tax.amount) > 0) html += trow('Tax', tax);
    (order.discountApplications ? order.discountApplications.nodes : []).forEach(function (d) {
      var lbl = 'Discount' + (d.code ? ' (' + d.code + ')' : d.title ? ' (' + d.title + ')' : '');
      var val = d.value;
      var amt = val && val.amount ? '\u2212' + odFmtMoney(val.amount, val.currencyCode) : val && val.percentage ? '\u2212' + val.percentage + '%' : '';
      if (amt) html += '<div class="va-od-trow va-od-trow--discount"><span>' + escHtml(lbl) + '</span><span>' + escHtml(amt) + '</span></div>';
    });
    html += trow('Total', order.totalPriceSet ? order.totalPriceSet.shopMoney : null, 'va-od-trow--grand');
    html += '</div></div>';

    // Tracking
    var fulfillments = order.fulfillments || [];
    var hasTracking = fulfillments.some(function (f) { return (f.trackingInfo || []).length > 0; });
    if (hasTracking) {
      var truckIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
      html += '<div class="va-od-section"><div class="va-od-section-title">Tracking</div><div class="va-od-tracking-list">';
      fulfillments.forEach(function (f) {
        (f.trackingInfo || []).forEach(function (t) {
          if (!t.number) return;
          var lbl = escHtml((t.company || 'Carrier') + ': ' + t.number);
          html += '<div class="va-od-tracking">' + truckIcon;
          html += t.url ? '<a href="' + escHtml(t.url) + '" target="_blank" rel="noopener" class="va-od-tracking-link">' + lbl + '</a>' : lbl;
          html += '</div>';
        });
      });
      html += '</div></div>';
    }

    // Note
    if (order.note) {
      html += '<div class="va-od-section"><div class="va-od-section-title">Order note</div>';
      html += '<div class="va-od-note">' + escHtml(order.note) + '</div></div>';
    }
    html += '</div>';
    return html;
  }

  function odStatusClass(order) {
    if (order.cancelledAt) return { cls: 'cancelled', label: 'Cancelled' };
    if (order.authorizationCode === '' && order.paymentMethodCode === 'CLOVER') return { cls: 'auth-hold', label: 'Awaiting authorization' };
    var fs = order.displayFulfillmentStatus || '';
    if (fs === 'FULFILLED') return { cls: 'delivered', label: 'Shipped' };
    if (fs === 'PARTIAL')   return { cls: 'shipped',   label: 'Partially shipped' };
    return { cls: 'processing', label: 'Processing' };
  }

  function odBuildLiMap(nodes) {
    var map = {};
    (nodes || []).forEach(function (li) {
      if (!li.variant) return;
      var variantId = li.variant.id.replace('gid://shopify/ProductVariant/', '');
      var money = li.originalUnitPriceSet ? li.originalUnitPriceSet.shopMoney : {};
      var handle = li.variant.product ? li.variant.product.handle : null;
      map[variantId] = {
        title:   li.title,
        variant: li.variantTitle || '',
        sku:     li.sku || '',
        qty:     li.quantity,
        price:   money.amount ? odFmtMoney(money.amount, money.currencyCode) : '',
        img:     li.image ? li.image.url + '?width=60'  : null,
        zoom:    li.image ? li.image.url + '?width=800' : null,
        url:     handle ? '/products/' + handle : null
      };
    });
    return map;
  }

  function odFmtMoney(amount, currency) {
    var n = parseFloat(amount);
    if (isNaN(n)) return String(amount);
    var sym = (!currency || currency === 'USD') ? '$' : currency + '\u00a0';
    return sym + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


  function odRenderAddr(a) {
    var parts = [a.name, a.address1, a.address2, [a.city, a.provinceCode].filter(Boolean).join(', ') + (a.zip ? ' ' + a.zip : ''), a.countryCode].filter(Boolean);
    return '<address class="va-od-addr">' + parts.map(function (p) { return '<div>' + escHtml(p) + '</div>'; }).join('') + '</address>';
  }

  // ── Multiship renderer ──────────────────────────────────
  function renderMultiship(container, orderData, liMap) {
    if (!Array.isArray(orderData) || orderData.length === 0) {
      container.innerHTML = '<div class="va-empty"><p>No distribution data.</p></div>';
      return;
    }
    var html = '';
    orderData.forEach(function (entry) {
      var items      = entry.items || {};
      var totalUnits = Object.keys(items).reduce(function (s, k) { return s + (items[k] || 0); }, 0);
      var addrLabel  = entry.addr || entry.id || 'Address';
      html += '<div class="va-ms-group">';
      html += '<div class="va-ms-group-head">';
      html += '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
      html += '<span>' + escHtml(addrLabel) + '</span>';
      html += '<span class="va-ms-badge">' + totalUnits + ' unit' + (totalUnits !== 1 ? 's' : '') + '</span>';
      html += '</div>';
      if (entry.bc_ship_to) {
        html += '<div class="va-ms-addr-sub">Ship-to: ' + escHtml(entry.bc_ship_to);
        if (entry.bc_customer) html += ' &middot; Customer: ' + escHtml(entry.bc_customer);
        html += '</div>';
      }
      html += '<div class="va-ms-items">';
      Object.keys(items).forEach(function (variantId) {
        var qty  = items[variantId];
        var li   = liMap[variantId] || {};
        var name = li.title || ('Variant ' + variantId);
        if (li.variant && li.variant !== '' && li.variant !== 'Default Title') name += ' \u2014 ' + li.variant;
        var imgHtml;
        if (li.img) {
          imgHtml = '<div class="va-ms-item-img"><img src="' + escHtml(li.img) + '"' + (li.zoom ? ' data-zoom="' + escHtml(li.zoom) + '"' : '') + ' alt="' + escHtml(name) + '" loading="lazy" width="60" height="60" class="va-zoomable"></div>';
        } else {
          imgHtml = '<div class="va-ms-item-img va-ms-item-img--empty"></div>';
        }
        var nameHtml = li.url
          ? '<a href="' + escHtml(li.url) + '" class="va-ms-item-title-link">' + escHtml(name) + '</a>'
          : escHtml(name);
        html += '<div class="va-ms-item">';
        html += imgHtml;
        html += '<span class="va-ms-item-name">' + nameHtml + '</span>';
        html += '<span class="va-ms-item-qty">\u00d7 ' + qty + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });
    container.innerHTML = html;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Reusable in-page confirm dialog (replaces browser confirm())
  // vaConfirm({ msg, okLabel, danger }) returns a Promise<boolean>
  function vaConfirm(opts) {
    var dlg    = document.getElementById('va-confirm-dialog');
    var msgEl  = document.getElementById('va-confirm-msg');
    var okBtn  = document.getElementById('va-confirm-ok');
    var canBtn = document.getElementById('va-confirm-cancel');
    if (!dlg) return Promise.resolve(window.confirm(opts.msg || ''));
    msgEl.textContent = opts.msg || '';
    okBtn.textContent = opts.okLabel || 'OK';
    okBtn.classList.toggle('danger', !!opts.danger);
    dlg.showModal();
    return new Promise(function (resolve) {
      function cleanup() { dlg.close(); okBtn.removeEventListener('click', onOk); canBtn.removeEventListener('click', onCancel); dlg.removeEventListener('cancel', onCancel); }
      function onOk()     { cleanup(); resolve(true);  }
      function onCancel() { cleanup(); resolve(false); }
      okBtn.addEventListener('click',  onOk);
      canBtn.addEventListener('click', onCancel);
      dlg.addEventListener('cancel',   onCancel);
    });
  }

  function fmtDate(str, withTime) {
    if (!str) return '';
    var d = new Date(str.includes('T') || str.includes('Z') ? str : str + 'T00:00:00');
    if (isNaN(d)) return '';
    var opts = { month: 'short', day: 'numeric', year: 'numeric' };
    if (withTime) { opts.hour = 'numeric'; opts.minute = '2-digit'; opts.hour12 = true; }
    return withTime ? d.toLocaleString('en-US', opts) : d.toLocaleDateString('en-US', opts);
  }

  // ── Image zoom lightbox ──────────────────────────────────
  (function () {
    var lb    = document.getElementById('va-lightbox');
    var lbImg = lb && lb.querySelector('.va-lightbox-img');
    if (!lb || !lbImg) return;

    function open(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.classList.add('va-lightbox--open');
      lb.setAttribute('aria-hidden', 'false');
      document.addEventListener('keydown', onKey);
    }
    function close() {
      lb.classList.remove('va-lightbox--open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('.va-lightbox-close')) close();
    });

    document.addEventListener('click', function (e) {
      var img = e.target.closest ? e.target.closest('.va-zoomable') : null;
      if (!img) return;
      e.preventDefault();
      open(img.dataset.zoom || img.src, img.alt);
    });
  }());

  // ── Customer bulk order import ────────────────────────────
  (function () {
    var panel = document.getElementById('va-tab-bulk');
    if (!panel) return;

    var root       = panel.querySelector('.va-bulk-panel');
    var fileInput  = panel.querySelector('.va-bulk-file');
    var achSelect  = panel.querySelector('.va-bulk-ach');
    var checkBtn   = panel.querySelector('.va-bulk-check');
    var importBtn  = panel.querySelector('.va-bulk-import');
    var rulesBtn   = panel.querySelector('.va-bulk-rules');
    var rulesDlg   = panel.querySelector('.va-bulk-rules-dialog');
    var rulesText  = panel.querySelector('.va-bulk-rules-text');
    var rulesSave  = panel.querySelector('.va-bulk-rules-save');
    var rulesCancel = panel.querySelector('.va-bulk-rules-cancel');
    var statusEl   = panel.querySelector('.va-bulk-status');
    var summaryEl  = panel.querySelector('.va-bulk-summary-cards');
    var progressEl = panel.querySelector('.va-bulk-progress');
    var previewEl  = panel.querySelector('.va-bulk-preview');
    var resultsEl  = panel.querySelector('.va-bulk-results');
    var apiBase    = (root.dataset.apiBase || '').replace(/\/$/, '');
    var state = { contextLoaded: false, loadingContext: false, fileName: '', csv: '', canImport: false, busy: false, jobId: '', jobToken: '', pollTimer: null, activeFilter: 'all' };

    function setStatus(message, kind, allowHtml) {
      statusEl.className = 'va-bulk-status' + (kind ? ' va-bulk-status--' + kind : '');
      if (allowHtml) statusEl.innerHTML = message;
      else statusEl.textContent = message;
    }

    function refreshButtons() {
      checkBtn.disabled = state.busy || !state.csv || !state.contextLoaded;
      importBtn.disabled = state.busy || !state.canImport || !achSelect.value;
      rulesBtn.disabled = state.busy || !state.contextLoaded;
      fileInput.disabled = state.busy;
      achSelect.disabled = state.busy || !state.contextLoaded || achSelect.options.length <= 1;
    }

    function basePayload() {
      var auth = window.__vaAuth || {};
      var info = window.__vaCustomerInfoData || {};
      return {
        shop: Shopify.shop,
        customer_id: auth.customer_id,
        customer_no: info.No || info.no || '',
        market_handle: vaMarketHandle || info.shopifyMarketHandle || '',
        ts: auth.ts,
        token: auth.token
      };
    }

    function filePayload() {
      return Object.assign(basePayload(), {
        file_name: state.fileName,
        csv_content: state.csv,
        ach_account_system_id: achSelect.value || ''
      });
    }

    function post(path, payload) {
      if (!apiBase) return Promise.reject(new Error('Bulk order API URL is not configured.'));
      return fetch(apiBase + '/' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.text().then(function (text) {
          var data;
          try { data = text ? JSON.parse(text) : {}; }
          catch (_) { data = { error: text || ('HTTP ' + response.status) }; }
          if (!response.ok || data.ok === false) {
            var details = (data.errors || []).join(' ');
            throw new Error([data.error || 'Bulk order request failed.', details].filter(Boolean).join(' '));
          }
          return data;
        });
      });
    }

    function loadContext() {
      if (state.contextLoaded || state.loadingContext) return;
      state.loadingContext = true;
      setStatus('Loading your customer and payment information…');
      window.__vaCustomerInfo.then(function (info) {
        window.__vaCustomerInfoData = info || {};
        return post('context', basePayload());
      }).then(function (data) {
        state.contextLoaded = true;
        achSelect.innerHTML = '<option value="">Select an ACH account</option>';
        (data.accounts || []).forEach(function (account) {
          var option = document.createElement('option');
          option.value = account.id;
          option.textContent = [account.nickName || account.bankName || 'Bank account', account.last4 ? '•••• ' + account.last4 : 'ACH'].filter(Boolean).join(' · ');
          if (account.isDefault) option.selected = true;
          achSelect.appendChild(option);
        });
        if (!(data.accounts || []).length) {
          setStatus('No active ACH account is available. <a href="#payment">Add or review an ACH account in Payment &amp; terms.</a>', 'error', true);
        } else {
          setStatus('Customer ' + (data.customerNo || '') + ' is ready. Choose a CSV to begin validation.');
        }
        refreshButtons();
        if (state.csv) validateFile();
      }).catch(function (err) {
        setStatus('Could not load customer payment context: ' + err.message, 'error');
      }).finally(function () {
        state.loadingContext = false;
        refreshButtons();
      });
    }

    function money(value) {
      return value == null ? '' : Number(value).toFixed(2);
    }

    function openRules() {
      if (!state.contextLoaded || state.busy) return;
      rulesBtn.disabled = true;
      post('rules/get', basePayload()).then(function (data) {
        rulesText.value = (data.groups || []).map(function (group) {
          var cells = [group.device || '', group.product || ''];
          (group.skus || []).sort(function (a, b) { return Number(a.sortOrder || 0) - Number(b.sortOrder || 0); })
            .forEach(function (item) { cells.push(item.sku || ''); });
          return cells.join(',');
        }).join('\n');
        rulesDlg.showModal();
      }).catch(function (err) {
        setStatus('Could not load substitution rules: ' + err.message, 'error');
      }).finally(function () { rulesBtn.disabled = false; });
    }

    function saveRules() {
      var groups = String(rulesText.value || '').split(/\r?\n/).map(function (line, index) {
        var cells = line.split(',').map(function (cell) { return cell.trim(); });
        var skus = cells.slice(2).filter(Boolean).map(function (sku, skuIndex) { return { sku: sku, sortOrder: skuIndex + 1 }; });
        return { device: cells[0] || '', product: cells[1] || '', sortOrder: index + 1, skus: skus };
      }).filter(function (group) { return group.skus.length; });
      rulesSave.disabled = true;
      post('rules/save', Object.assign(basePayload(), { groups: groups })).then(function () {
        rulesDlg.close();
        setStatus('Substitution rules saved for this customer group.', 'success');
        if (state.csv) validateFile();
      }).catch(function (err) {
        setStatus('Could not save substitution rules: ' + err.message, 'error');
      }).finally(function () { rulesSave.disabled = false; });
    }

    function summaryIcon(type) {
      if (type === 'ready') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      if (type === 'subbed') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M16 3l4 4-4 4M20 7H8a4 4 0 0 0-4 4M8 21l-4-4 4-4M4 17h12a4 4 0 0 0 4-4"></path></svg>';
      if (type === 'short') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6M12 17h.01"></path></svg>';
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M8 13h8M8 17h6"></path></svg>';
    }

    function summaryCard(filter, label, value, description, deltaClass) {
      return '<button type="button" class="va-bulk-summary-card' + (filter === 'all' ? ' is-active' : '') + '" data-bulk-filter="' + filter + '" aria-pressed="' + (filter === 'all' ? 'true' : 'false') + '">'
        + '<span class="va-bulk-summary-head"><span class="va-bulk-summary-label">' + label + '</span><span class="va-bulk-summary-icon">' + summaryIcon(filter) + '</span></span>'
        + '<span class="va-bulk-summary-value">' + value + '</span>'
        + '<span class="va-bulk-summary-delta' + (deltaClass ? ' va-bulk-summary-delta--' + deltaClass : '') + '">' + description + '</span></button>';
    }

    function applyBulkFilter(filter) {
      var selected = filter || 'all';
      state.activeFilter = selected;
      summaryEl.querySelectorAll('[data-bulk-filter]').forEach(function (card) {
        var active = card.dataset.bulkFilter === selected;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      var visibleRows = 0;
      previewEl.querySelectorAll('.va-bulk-location').forEach(function (location) {
        var locationVisible = 0;
        location.querySelectorAll('tbody tr[data-bulk-status]').forEach(function (row) {
          var show = selected === 'all' || row.dataset.bulkStatus === selected;
          row.hidden = !show;
          if (show) { locationVisible += 1; visibleRows += 1; }
        });
        location.hidden = locationVisible === 0;
      });
      var empty = previewEl.querySelector('.va-bulk-filter-empty');
      if (empty) empty.hidden = visibleRows !== 0;
    }

    function renderValidation(data) {
      var rows = data.rows || [];
      var errors = data.errors || [];
      summaryEl.innerHTML = ''
        + summaryCard('all', 'Uploaded items', data.rowCount == null ? rows.length : data.rowCount, 'Total spreadsheet rows', '')
        + summaryCard('ready', 'Ready to ship', data.readyCount || 0, '✅ 100% Core stock allocated', 'success')
        + summaryCard('subbed', 'Substitutions run', data.substitutionCount || 0, '⚠️ Swapped with rules list', 'alert')
        + summaryCard('short', 'Action required', (data.actionRequiredCount || 0) + (data.blockingErrorCount || 0), '❌ Completely out of stock', 'danger');
      summaryEl.hidden = false;

      var html = '';

      if (errors.length) {
        html += '<div class="va-bulk-status va-bulk-status--error" style="margin-top:10px;">'
          + errors.map(function (error) { return '<div>' + escHtml(error) + '</div>'; }).join('') + '</div>';
      }

      var groups = {};
      rows.forEach(function (row) {
        var key = row.addressCode || 'Unknown location';
        (groups[key] || (groups[key] = [])).push(row);
      });
      Object.keys(groups).forEach(function (location) {
        var groupRows = groups[location];
        var first = groupRows[0] || {};
        html += '<section class="va-bulk-location"><div class="va-bulk-location-head">'
          + '<strong>Location ' + escHtml(location) + '</strong>'
          + '<span>' + escHtml(first.customerNo || '') + (first.customerName ? ' · ' + escHtml(first.customerName) : '') + '</span></div>'
          + '<div class="va-bulk-table-wrap"><table class="va-bulk-table"><thead><tr>'
          + '<th>Line</th><th>Original SKU</th><th class="va-bulk-number">Qty</th><th>Status</th><th>Fulfillment SKU</th><th>Action / Override</th>'
          + '</tr></thead><tbody>';
        groupRows.forEach(function (row) {
          var rowErrors = row.errors || [];
          var warnings = row.warnings || [];
          var fulfillmentSku = row.actualSku || row.originalSku || '';
          var status = rowErrors.length ? 'Blocked' : (row.wasReplaced ? 'Substituted' : (Number(row.importQuantity || 0) > 0 ? 'Ready' : 'Action required'));
          var filterStatus = rowErrors.length || warnings.length || Number(row.importQuantity || 0) <= 0 ? 'short' : (row.wasReplaced ? 'subbed' : 'ready');
          var statusClass = rowErrors.length ? 'va-bulk-badge--blocked' : (status === 'Ready' ? 'va-bulk-badge--ready' : '');
          html += '<tr data-bulk-status="' + filterStatus + '"' + (rowErrors.length ? ' class="has-error"' : '') + '>'
            + '<td>' + escHtml(row.rowNumber) + '</td>'
            + '<td><strong>' + escHtml(row.originalSku || '') + '</strong><div class="va-bulk-row-msg">' + escHtml(row.itemNo || '') + '</div></td>'
            + '<td class="va-bulk-number">' + escHtml(row.quantity == null ? '' : row.quantity) + '</td>'
            + '<td><span class="va-bulk-badge ' + statusClass + '">' + escHtml(status) + '</span></td>'
            + '<td><strong>' + escHtml(fulfillmentSku) + '</strong><div class="va-bulk-row-msg">' + escHtml(row.actualItemNo || row.itemNo || '') + '</div></td><td>';
          if (!rowErrors.length && !warnings.length) html += '<span class="va-bulk-row-msg">No action needed</span>';
          if (!rowErrors.length && Number(row.importQuantity || 0) <= 0) html += '<div class="va-bulk-row-msg va-bulk-row-msg--warning"><strong>Skip this line on submit</strong></div>';
          rowErrors.forEach(function (message) { html += '<div class="va-bulk-row-msg va-bulk-row-msg--error">' + escHtml(message) + '</div>'; });
          warnings.forEach(function (message) { html += '<div class="va-bulk-row-msg va-bulk-row-msg--warning">' + escHtml(message) + '</div>'; });
          html += '</td></tr>';
        });
        html += '</tbody></table></div></section>';
      });
      html += '<div class="va-bulk-filter-empty" hidden>No rows match this filter.</div>';
      previewEl.innerHTML = html;
      previewEl.hidden = false;
      applyBulkFilter('all');
    }

    function validateFile() {
      if (!state.csv || !state.contextLoaded || state.busy) return;
      state.busy = true;
      state.canImport = false;
      resultsEl.hidden = true;
      setStatus('Checking every SFID, SKU, inventory quantity, price, and ACH account…');
      refreshButtons();
      post('validate', filePayload()).then(function (data) {
        state.canImport = data.canImport === true;
        renderValidation(data);
        setStatus(
          state.canImport ? 'File checked successfully. Ready to import bulk orders.' : 'File checked. Resolve the highlighted items before importing.',
          state.canImport ? 'success' : 'error'
        );
      }).catch(function (err) {
        setStatus('Validation failed: ' + err.message, 'error');
      }).finally(function () {
        state.busy = false;
        refreshButtons();
      });
    }

    function importOrders() {
      if (!state.canImport || state.busy) return;
      state.busy = true;
      setStatus('Queueing validated location orders for Business Central...');
      refreshButtons();
      post('import', filePayload()).then(function (data) {
        state.jobId = data.jobId || '';
        state.jobToken = data.jobToken || '';
        if (!state.jobId || !state.jobToken) throw new Error('The API did not return a queue job.');
        progressEl.hidden = false;
        setStatus('Order job queued. You can keep this page open while locations are processed.');
        pollJob(data.pollAfterMs || 1500);
      }).catch(function (err) {
        setStatus('Import failed: ' + err.message, 'error');
        state.busy = false;
        refreshButtons();
      });
    }

    function renderJob(job) {
      var complete = Number(job.completedGroups || 0);
      var total = Number(job.totalGroups || 0);
      var percent = Math.max(0, Math.min(100, Number(job.percentComplete || 0)));
      progressEl.querySelector('.va-bulk-progress-label').textContent = job.status + (job.currentLocation ? ' · ' + job.currentLocation : '');
      progressEl.querySelector('.va-bulk-progress-count').textContent = complete + ' / ' + total + ' locations';
      progressEl.querySelector('.va-bulk-progress-bar').style.width = percent + '%';

      var results = job.results || [];
      resultsEl.innerHTML = results.map(function (result) {
        var failed = result.status !== 'Success' && result.status !== 'Skipped';
        return '<div class="va-bulk-result' + (failed ? ' va-bulk-result--failed' : '') + '">'
          + '<strong>' + escHtml(result.addressCode || '') + '</strong>'
          + '<span>' + escHtml(result.salesOrderNo || result.status || '') + '</span>'
          + '<span>' + escHtml(result.details || '') + '</span></div>';
      }).join('');
      resultsEl.hidden = !results.length;
    }

    function pollJob(delay) {
      clearTimeout(state.pollTimer);
      state.pollTimer = setTimeout(function () {
        fetch(apiBase + '/jobs/' + encodeURIComponent(state.jobId) + '?token=' + encodeURIComponent(state.jobToken))
          .then(function (response) {
            return response.json().then(function (data) {
              if (!response.ok) throw new Error(data.error || 'Could not read job status.');
              return data;
            });
          })
          .then(function (data) {
            var job = data.job || {};
            renderJob(job);
            var terminal = job.status === 'Completed' || job.status === 'CompletedWithErrors' || job.status === 'Failed';
            if (!terminal) { pollJob(1500); return; }
            state.busy = false;
            state.canImport = false;
            refreshButtons();
            setStatus(
              job.status === 'Completed'
                ? 'All ' + (job.totalGroups || 0) + ' location orders were processed.'
                : (job.failedGroups || 0) + ' location order(s) need review. Successful locations were still submitted.',
              job.status === 'Completed' ? 'success' : 'error'
            );
          }).catch(function (err) {
            setStatus('Progress check failed; retrying: ' + err.message, 'error');
            pollJob(3000);
          });
      }, delay || 1500);
    }

    fileInput.addEventListener('change', function () {
      var file = fileInput.files && fileInput.files[0];
      state.fileName = '';
      state.csv = '';
      state.canImport = false;
      clearTimeout(state.pollTimer);
      state.jobId = '';
      state.jobToken = '';
      progressEl.hidden = true;
      summaryEl.hidden = true;
      previewEl.hidden = true;
      resultsEl.hidden = true;
      if (!file) { refreshButtons(); return; }
      if (file.size > 25 * 1024 * 1024) {
        setStatus('CSV file exceeds the 25 MB limit.', 'error');
        refreshButtons();
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        state.fileName = file.name;
        state.csv = String(reader.result || '');
        refreshButtons();
        if (state.contextLoaded) validateFile();
        else loadContext();
      };
      reader.onerror = function () { setStatus('Could not read the selected CSV.', 'error'); };
      reader.readAsText(file);
    });

    achSelect.addEventListener('change', function () {
      state.canImport = false;
      refreshButtons();
      if (state.csv) validateFile();
    });
    summaryEl.addEventListener('click', function (event) {
      var card = event.target.closest('[data-bulk-filter]');
      if (card && summaryEl.contains(card)) applyBulkFilter(card.dataset.bulkFilter);
    });
    checkBtn.addEventListener('click', validateFile);
    importBtn.addEventListener('click', importOrders);
    rulesBtn.addEventListener('click', openRules);
    rulesCancel.addEventListener('click', function () { rulesDlg.close(); });
    rulesSave.addEventListener('click', saveRules);

    new MutationObserver(function () {
      if (panel.classList.contains('va-tab--active')) loadContext();
    }).observe(panel, { attributes: true, attributeFilter: ['class'] });
    if (panel.classList.contains('va-tab--active')) loadContext();
  }());

  // ── ACH accounts + Credit cards (Payment tab) ────────────
  (function () {
    var panel = document.getElementById('va-tab-payment');
    if (!panel) return;
    var $ = function (s) { return panel.querySelector(s); };

    var isCricket = true; //show cc to all customers now.
    var achState  = { loaded: false, accounts: [] };
    var listWrap  = $('.va-ach-accounts');
    var ccWrap    = $('.va-cc-accounts');
    var ccPanel   = $('.va-cc-panel');
    var ccAddForm = $('.va-cc-add-form');
    var ccFormErr = $('.va-cc-form-err');
    var achForm   = $('.va-ach-add-form');
    var achFormErr = $('.va-ach-form-err');

    function achProxy(payload, onOk, onErr) {
      var auth = window.__vaAuth || {};
      fetch(auth.proxy || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop }, payload))
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Error');
        onOk(d);
      }).catch(onErr);
    }

    var bankIcon = '<div class="va-pay-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg></div>';

    function detectBrand(n) {
      if (/^4/.test(n))              return 'visa';
      if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
      if (/^3[47]/.test(n))          return 'amex';
      if (/^(6011|65|64[4-9]|622)/.test(n)) return 'discover';
      return '';
    }
    // Format expiration date → "MM/YY"
    // Accepts BC format (YYYY-MM-DD) or user-input format (MM/YY)
    function fmtExpiry(s) {
      if (!s) return '';
      var m = String(s).match(/^(\d{4})-(\d{2})/);       // BC: YYYY-MM-DD
      if (m) return m[2] + '/' + m[1].slice(2);
      m = String(s).match(/^(\d{1,2})\/(\d{2})$/);        // user: MM/YY
      if (m) return (m[1].length < 2 ? '0' + m[1] : m[1]) + '/' + m[2];
      return '';
    }

    function achRender() {
      var ccAccs  = achState.accounts.filter(function (a) { return a.accountType === 'CreditCard'; });
      var achAccs = achState.accounts.filter(function (a) { return a.accountType !== 'CreditCard'; });

      // Credit card section (visibility controlled by ccPanel.hidden — see vaMarketReady.then)
      if (ccWrap) {
        if (!ccAccs.length) {
          ccWrap.innerHTML = '<div class="va-pay-empty">No credit cards on file.</div>';
        } else {
          var ccHtml = '<div class="va-pay-list">';
          ccAccs.forEach(function (a) {
            var name    = escHtml(a.cardHolderName || a.bankName || 'Credit card');
            var cardNum = a.last4 ? '\u2022\u2022\u2022\u2022\u00a0\u2022\u2022\u2022\u2022\u00a0\u2022\u2022\u2022\u2022\u00a0' + escHtml(a.last4) : '';
            var expiry  = fmtExpiry(a.expirationDate);
            ccHtml += '<div class="va-pay-item">' + brandIcon(a.brand || '', 52, 34)
              + '<div class="va-pay-item-info">'
              + '<span class="va-pay-item-name">' + name + '</span>'
              + (cardNum ? '<span class="va-pay-item-sep">&middot;</span><span class="va-pay-item-sub">' + cardNum + '</span>' : '')
              + (expiry ? '<span class="va-pay-item-sep">&middot;</span><span class="va-pay-item-sub">Exp.\u00a0' + escHtml(expiry) + '</span>' : '')
              + (a.zip ? '<span class="va-pay-item-sep">&middot;</span><span class="va-pay-item-sub">' + escHtml(a.zip) + '</span>' : '')
              + '</div>'
              + (vaHasChildren ? '<button class="va-set-perm-btn" data-id="' + escHtml(a.id) + '">Set permission</button>' : '')
              + (a.autoPayForABO
                ? '<span class="va-cc-default-badge">Default</span>'
                : '<button class="va-cc-set-default-btn" data-id="' + escHtml(a.id) + '">Set as default</button>')
              + '<button class="va-ach-remove-btn" data-id="' + escHtml(a.id) + '">Remove</button>'
              + '</div>';
          });
          ccWrap.innerHTML = ccHtml + '</div>';
        }
      }

      // ACH section
      if (!listWrap) return;
      if (!achAccs.length) {
        listWrap.innerHTML = '<div class="va-pay-empty">No saved bank accounts.</div>';
        return;
      }
      var html = '<div class="va-pay-list">';
      achAccs.forEach(function (a) {
        var sub = a.last4 ? '\u2022\u2022\u2022\u2022\u00a0' + escHtml(a.last4) : 'ACH';
        html += '<div class="va-pay-item">' + bankIcon
          + '<div class="va-pay-item-info">'
          + '<span class="va-pay-item-name">' + escHtml(a.bankName || 'Bank account') + '</span>'
          + '<span class="va-pay-item-sep">&middot;</span>'
          + '<span class="va-pay-item-sub">' + sub + '</span>'
          + (a.nickName ? '<span class="va-pay-item-sep">&middot;</span><span class="va-pay-item-sub">' + escHtml(a.nickName) + '</span>' : '')
          + '</div>'
          + (vaHasChildren ? '<button class="va-set-perm-btn" data-id="' + escHtml(a.id) + '">Set permission</button>' : '')
          + (isCricket
            ? (a.autoPayForABO
              ? '<span class="va-cc-default-badge">Default</span>'
              : '<button class="va-cc-set-default-btn" data-id="' + escHtml(a.id) + '">Set as default</button>')
            : '')
          + '<button class="va-ach-remove-btn" data-id="' + escHtml(a.id) + '">Remove</button></div>';
      });
      listWrap.innerHTML = html + '</div>';
    }

    function achLoad() {
      if (listWrap) listWrap.innerHTML = '<div class="va-pay-loading">Loading accounts\u2026</div>';
      if (ccWrap) ccWrap.innerHTML = '<div class="va-pay-loading">Loading\u2026</div>';
      achProxy({ action: 'ach-list' }, function (d) {
        achState.accounts = d.accounts || [];
        achState.loaded = true;
        achRender();
      }, function (err) {
        if (listWrap) listWrap.innerHTML = '<div class="va-pay-error">' + escHtml('Could not load accounts: ' + err.message) + '</div>';
      });
    }

    function achDelete(id, btn) {
      vaConfirm({ msg: 'Remove this bank account?', okLabel: 'Remove', danger: true }).then(function (ok) { if (ok) _achDelete(id, btn); });
    }
    function _achDelete(id, btn) {
      btn.disabled = true; btn.textContent = 'Removing\u2026';
      achProxy({ action: 'ach-delete', system_id: id }, function () {
        achState.accounts = achState.accounts.filter(function (a) { return a.id !== id; });
        achRender();
      }, function (err) {
        btn.disabled = false; btn.textContent = 'Remove';
        if (listWrap) listWrap.insertAdjacentHTML('afterend', '<div class="va-pay-error">' + escHtml(err.message) + '</div>');
      });
    }

    function ccSetDefault(id, btn) {
      btn.disabled = true; btn.textContent = 'Saving\u2026';
      achProxy({ action: 'cc-set-default', system_id: id }, function () {
        achState.accounts.forEach(function (a) { a.autoPayForABO = (a.id === id); });
        achRender();
      }, function (err) {
        btn.disabled = false; btn.textContent = 'Set as default';
        panel.insertAdjacentHTML('afterbegin', '<div class="va-pay-error" style="margin:12px 22px;">' + escHtml(err.message) + '</div>');
      });
    }

    function ccShowAddForm(show) {
      if (ccAddForm) ccAddForm.hidden = !show;
      var openBtn = $('.va-cc-open-add');
      if (openBtn) openBtn.hidden = show;
      if (ccFormErr) { ccFormErr.hidden = true; ccFormErr.textContent = ''; }
      if (show && ccAddForm) { var first = ccAddForm.querySelector('input'); if (first) first.focus(); }
    }

    function ccSave() {
      var f       = ccAddForm;
      var holder  = (f && f.querySelector('[name=cc_holder]')  || {value:''}).value.trim();
      var cardNum = (f && f.querySelector('[name=cc_number]')  || {value:''}).value.replace(/\D/g,'');
      var expiry  = (f && f.querySelector('[name=cc_expiry]')  || {value:''}).value.trim();
      var cvv     = (f && f.querySelector('[name=cc_cvv]')     || {value:''}).value.trim(); // forwarded to ERP via NoSeries
      var zip     = (f && f.querySelector('[name=cc_zip]')     || {value:''}).value.trim();
      var street  = (f && f.querySelector('[name=cc_street]')  || {value:''}).value.trim();
      var city    = (f && f.querySelector('[name=cc_city]')    || {value:''}).value.trim();
      var state   = (f && f.querySelector('[name=cc_state]')   || {value:''}).value.trim();
      var consent = f && f.querySelector('[name=cc_consent]');
      function showErr(msg) { if (ccFormErr) { ccFormErr.textContent = msg; ccFormErr.hidden = false; } }
      if (!holder)                              { showErr('Cardholder name is required.'); return; }
      if (cardNum.length < 13)                  { showErr('Please enter a valid card number.'); return; }
      if (!/^\d{2}\/\d{2}$/.test(expiry))      { showErr('Please enter expiry as MM/YY.'); return; }
      if (!cvv || cvv.length < 3)              { showErr('Please enter the CVV.'); return; }
      if (!zip)                                 { showErr('Billing ZIP is required.'); return; }
      if (!consent || !consent.checked)         { showErr('Please agree to the authorization terms to continue.'); return; }
      if (ccFormErr) ccFormErr.hidden = true;
      var saveBtn = ccPanel && ccPanel.querySelector('.va-cc-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving\u2026'; }
      var last4 = cardNum.slice(-4);
      achProxy({ action: 'cc-create', holder: holder, card_number: cardNum, last4: last4, expiry: expiry, cvv: cvv, zip: zip, street: street, city: city, state: state },
        function (d) {
          achState.accounts.push({ id: d.bc_system_id, code: d.code, bankName: d.bankName || '', last4: last4, accountType: 'CreditCard', autoPayForABO: false, cardHolderName: holder, brand: detectBrand(cardNum), zip: zip, expirationDate: expiry });
          achRender();
          ccShowAddForm(false);
          if (f) { f.querySelectorAll('input[type=text],input[type=checkbox]').forEach(function(i){ if(i.type==='checkbox') i.checked=false; else i.value=''; }); }
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save card'; }
        },
        function (err) {
          if (ccFormErr) { ccFormErr.textContent = err.message; ccFormErr.hidden = false; }
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save card'; }
        }
      );
    }

    function achShowForm(show) {
      if (achForm) achForm.hidden = !show;
      var openBtn = $('.va-ach-open');
      if (openBtn) openBtn.hidden = show;
      if (achFormErr) { achFormErr.hidden = true; achFormErr.textContent = ''; }
      if (show) { var first = achForm && achForm.querySelector('input'); if (first) first.focus(); }
    }

    function achSave() {
      var holder   = (achForm.querySelector('[name=holder]')   || {}).value || '';
      var routing  = (achForm.querySelector('[name=routing]')  || {}).value || '';
      var account  = (achForm.querySelector('[name=account]')  || {}).value || '';
      var nickName = (achForm.querySelector('[name=nickName]') || {}).value || '';
      if (!holder.trim() || !routing.trim() || !account.trim()) {
        if (achFormErr) { achFormErr.textContent = 'Please fill in all fields.'; achFormErr.hidden = false; }
        return;
      }
      if (achFormErr) achFormErr.hidden = true;
      var saveBtn = $('.va-ach-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving\u2026'; }
      achProxy({ action: 'ach-create', holder: holder.trim(), routing: routing.trim(), account: account.trim(), nick_name: nickName.trim() },
        function (d) {
          achState.accounts.push({ id: d.bc_system_id, code: d.code || '', bankName: d.bankName || 'Bank account', last4: d.last4 || null, accountType: 'ACH', autoPayForABO: false, nickName: d.nickName || '' });
          achRender();
          achShowForm(false);
          achForm.querySelectorAll('input').forEach(function (i) { i.value = ''; });
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save bank account'; }
        },
        function (err) {
          if (achFormErr) { achFormErr.textContent = err.message; achFormErr.hidden = false; }
          if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save bank account'; }
        }
      );
    }

    // Permission popup
    var permModal = document.getElementById('va-perm-modal');
    var permState = { account: null, maps: [], children: [] };

    function permUpdateAllChk() {
      var btn = permModal.querySelector('.va-perm-select-all-btn');
      if (!btn) return;
      var visible = Array.from(permModal.querySelectorAll('.va-perm-item')).filter(function (el) { return el.style.display !== 'none'; });
      var allChecked = visible.length > 0 && visible.every(function (el) { return el.querySelector('input[type=checkbox]').checked; });
      btn.textContent = allChecked ? 'Unselect all' : 'Select all';
    }

    function permApplyFilter() {
      var searchEl  = permModal.querySelector('.va-perm-search');
      var searchWrap = searchEl && searchEl.closest('.va-perm-search-wrap');
      var q = searchEl ? searchEl.value.toLowerCase().trim() : '';
      if (searchWrap) searchWrap.classList.toggle('has-value', q.length > 0);
      permModal.querySelectorAll('.va-perm-item').forEach(function (el) {
        var text = el.textContent.toLowerCase();
        el.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
      permUpdateAllChk();
    }

    function achPermOpen(account) {
      permState.account  = account;
      permState.maps     = [];
      permState.children = [];
      var listEl   = permModal.querySelector('.va-perm-list');
      var subEl    = permModal.querySelector('.va-perm-sub');
      var errEl    = permModal.querySelector('.va-perm-error');
      var searchEl = permModal.querySelector('.va-perm-search');
      var searchWrap = searchEl && searchEl.closest('.va-perm-search-wrap');
      if (searchEl)  { searchEl.value = ''; }
      if (searchWrap) searchWrap.classList.remove('has-value');
      var _sub = account.last4 ? '\u2022\u2022\u2022\u2022\u00a0' + account.last4 : 'ACH';
      var _subParts = [account.bankName || 'Bank account', _sub];
      if (account.nickName) _subParts.push(account.nickName);
      subEl.textContent  = _subParts.join(' \u00b7 ');
      listEl.innerHTML   = '<div class="va-pay-loading">Loading\u2026</div>';
      errEl.hidden       = true;
      var defaultNote = permModal.querySelector('.va-perm-default-note');
      if (defaultNote) defaultNote.hidden = true;
      permModal.hidden   = false;
      achProxy({ action: 'ach-perm-list', bank_account_system_id: account.id }, function (d) {
        permState.maps     = d.maps     || [];
        permState.children = d.children || [];
        if (!permState.children.length) {
          listEl.innerHTML = '<div class="va-pay-empty">No child companies found.</div>';
          return;
        }
        var enabledNos = {};
        permState.maps.forEach(function (m) { if (m.customerNo !== 'C0000105') enabledNos[m.customerNo] = true; });
        if (defaultNote) defaultNote.hidden = permState.maps.length > 0;
        var html = '';
        permState.children.forEach(function (c) {
          var chk = enabledNos[c.customerNo] ? ' checked' : '';
          html += '<label class="va-perm-item">'
            + '<input type="checkbox" value="' + escHtml(c.customerNo) + '"' + chk + '>'
            + '<span class="va-perm-item-name">' + escHtml(c.name || c.customerNo) + '</span>'
            + '<span class="va-perm-item-no">' + escHtml(c.customerNo) + '</span>'
            + '</label>';
        });
        listEl.innerHTML = html;
        permUpdateAllChk();
      }, function (err) {
        listEl.innerHTML = '<div class="va-pay-error">' + escHtml(err.message) + '</div>';
      });
    }

    function achPermSave(btn) {
      var listEl = permModal.querySelector('.va-perm-list');
      var errEl  = permModal.querySelector('.va-perm-error');
      var checkedNos = {};
      listEl.querySelectorAll('input[type=checkbox]:checked').forEach(function (el) { checkedNos[el.value] = true; });
      var prevByNo = {};
      permState.maps.forEach(function (m) { if (m.customerNo !== 'C0000105') prevByNo[m.customerNo] = m.systemId; });
      var toAdd = [], toDelete = [];
      Object.keys(checkedNos).forEach(function (no) { if (!prevByNo[no]) toAdd.push(no); });
      Object.keys(prevByNo).forEach(function (no)  { if (!checkedNos[no]) toDelete.push(prevByNo[no]); });
      if (!toAdd.length && !toDelete.length) { permModal.hidden = true; return; }
      btn.disabled = true; btn.textContent = 'Saving\u2026';
      errEl.hidden = true;
      achProxy({
        action: 'ach-perm-save',
        bank_account_system_id: permState.account.id,
        to_add:    toAdd,
        to_delete: toDelete,
      }, function () {
        btn.disabled = false; btn.textContent = 'Save';
        permModal.hidden = true;
      }, function (err) {
        btn.disabled = false; btn.textContent = 'Save';
        errEl.textContent = err.message; errEl.hidden = false;
      });
    }

    // Single event listener via delegation
    panel.addEventListener('click', function (e) {
      if (e.target.closest('.va-ach-open'))     { achShowForm(true);  return; }
      if (e.target.closest('.va-ach-cancel'))   { achShowForm(false); return; }
      if (e.target.closest('.va-ach-save'))     { achSave();          return; }
      if (e.target.closest('.va-cc-open-add'))  { ccShowAddForm(true);  return; }
      if (e.target.closest('.va-cc-cancel-add')){ ccShowAddForm(false); return; }
      if (e.target.closest('.va-cc-save'))      { ccSave();             return; }
      var setBtn = e.target.closest('.va-cc-set-default-btn');
      if (setBtn) { ccSetDefault(setBtn.dataset.id, setBtn); return; }
      var permBtn = e.target.closest('.va-set-perm-btn');
      if (permBtn) {
        var acct = achState.accounts.find(function (a) { return a.id === permBtn.dataset.id; });
        if (acct) achPermOpen(acct);
        return;
      }
      if (e.target.closest('.va-perm-save'))   { achPermSave(e.target.closest('.va-perm-save')); return; }
      if (e.target.closest('.va-perm-cancel') || e.target.closest('.va-perm-close')) { permModal.hidden = true; return; }
      var rb = e.target.closest('.va-ach-remove-btn');
      if (rb) achDelete(rb.dataset.id, rb);
    });
    // Close permission modal on backdrop click
    permModal.addEventListener('click', function (e) { if (e.target === permModal) permModal.hidden = true; });

    // Perm modal: filter input
    var permSearchEl = permModal.querySelector('.va-perm-search');
    if (permSearchEl) {
      permSearchEl.addEventListener('input', permApplyFilter);
    }
    // Perm modal: clear filter button
    var permClearBtn = permModal.querySelector('.va-perm-search-clear');
    if (permClearBtn) {
      permClearBtn.addEventListener('click', function () {
        if (permSearchEl) { permSearchEl.value = ''; permSearchEl.focus(); }
        permApplyFilter();
      });
    }
    // Perm modal: select-all / unselect-all button
    permModal.addEventListener('click', function (e) {
      var btn = e.target.closest('.va-perm-select-all-btn');
      if (!btn) return;
      var visible = Array.from(permModal.querySelectorAll('.va-perm-item')).filter(function (el) { return el.style.display !== 'none'; });
      var allChecked = visible.every(function (el) { return el.querySelector('input[type=checkbox]').checked; });
      visible.forEach(function (el) { el.querySelector('input[type=checkbox]').checked = !allChecked; });
      permUpdateAllChk();
    });
    // Perm modal: individual checkbox → update select-all button label
    permModal.addEventListener('change', function (e) {
      if (e.target.matches('.va-perm-item input[type=checkbox]')) permUpdateAllChk();
    });

    // Load accounts when tab becomes active
    vaMarketReady.then(function () {
      //isCricket = (vaMarketHandle === 'CRICKET-WIRELESS'); //show cc to all customers now.
      if (isCricket && ccPanel) ccPanel.hidden = false;
      if (panel.classList.contains('va-tab--active')) achLoad();
      new MutationObserver(function () {
        if (panel.classList.contains('va-tab--active') && !achState.loaded) achLoad();
      }).observe(panel, { attributes: true, attributeFilter: ['class'] });
    });
  }());

  // ── ERP addresses (Address tab) ─────────────────────────
  (function () {
    var addrTab = document.getElementById('va-tab-addresses');
    if (!addrTab) return;
    var listEl    = addrTab.querySelector('.va-erp-addr-list');
    var actionsEl = addrTab.querySelector('.va-erp-addr-actions');
    if (!listEl) return;

    var addrState = { loaded: false, addresses: [], editing: null, adding: false, page: 0 };
    var ADDR_PAGE_SIZE = 40;
    var locIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

    function addrProxy(payload, onOk, onErr) {
      var auth = window.__vaAuth || {};
      fetch(auth.proxy || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop }, payload))
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Error');
        onOk(d);
      }).catch(onErr);
    }

    function fmtAddr(a) {
      var line1 = [a.address, a.address2].filter(Boolean).join(', ');
      var line2 = [a.city, a.county].filter(Boolean).join(', ') + (a.postCode ? ' ' + a.postCode : '');
      return [line1, line2, a.countryRegionCode].filter(Boolean).join('<br>');
    }

    var ADDR_COUNTRIES = [
      ['US','United States'],['CA','Canada'],['MX','Mexico'],['GB','United Kingdom'],
      ['AU','Australia'],['NZ','New Zealand'],['JP','Japan'],['CN','China'],['IN','India'],
      ['SG','Singapore'],['HK','Hong Kong'],['TW','Taiwan'],['KR','South Korea'],
      ['MY','Malaysia'],['PH','Philippines'],['ID','Indonesia'],['TH','Thailand'],
      ['VN','Vietnam'],['IL','Israel'],['AE','United Arab Emirates'],['SA','Saudi Arabia'],
      ['DE','Germany'],['FR','France'],['IT','Italy'],['ES','Spain'],['NL','Netherlands'],
      ['BE','Belgium'],['SE','Sweden'],['NO','Norway'],['DK','Denmark'],['CH','Switzerland'],
      ['AT','Austria'],['PL','Poland'],['PT','Portugal'],['IE','Ireland'],
      ['BR','Brazil'],['AR','Argentina'],['CL','Chile'],['CO','Colombia'],['PE','Peru'],
      ['GT','Guatemala'],['CR','Costa Rica'],['DO','Dominican Republic'],['PR','Puerto Rico'],
    ];
    function countrySelectHtml(name, selectedCode) {
      var sel = '<select name="' + name + '">';
      sel += '<option value="">— Select country —</option>';
      ADDR_COUNTRIES.forEach(function(c) {
        var code = c[0], label = c[1];
        sel += '<option value="' + code + '"' + (code === (selectedCode || '') ? ' selected' : '') + '>' + label + '</option>';
      });
      sel += '</select>';
      return '<label class="va-field">' + 'Country' + sel + '</label>';
    }

    function editFormHtml(a) {
      function f(name, label, val, full) {
        return '<label class="va-field' + (full ? ' va-erp-full' : '') + '">' + label
          + '<input type="text" name="' + name + '" value="' + escHtml(val || '') + '"></label>';
      }
      return '<div class="va-erp-edit" data-edit="' + escHtml(a.code) + '">'
        + '<div class="va-erp-edit-grid">'
        + f('name',              'Name',            a.name)
        + f('phoneNo',           'Phone',           a.phoneNo)
        + f('address',           'Address',         a.address)
        + f('address2',          'Suite / Unit',    a.address2)
        + f('city',              'City',            a.city)
        + f('county',            'State / Province', a.county)
        + f('postCode',          'Zip code',     	a.postCode)
        + countrySelectHtml('countryRegionCode',    a.countryRegionCode)
        + '</div>'
        + '<div class="va-pay-actions">'
        + '<button class="va-btn va-btn--primary va-erp-save" data-code="' + escHtml(a.code) + '">Save changes</button>'
        + '<button class="va-btn va-erp-cancel" data-code="' + escHtml(a.code) + '">Cancel</button>'
        + '</div>'
        + '<div class="va-erp-form-err va-pay-error" hidden></div>'
        + '</div>';
    }

    function newAddrFormHtml() {
      function f(name, label, full) {
        return '<label class="va-field' + (full ? ' va-erp-full' : '') + '">' + label
          + '<input type="text" name="' + name + '" value=""></label>';
      }
      return '<div class="va-erp-edit va-erp-new-form">'
        + '<div class="va-erp-edit-grid">'
        + f('name',              'Name')
        + f('phoneNo',           'Phone')
        + f('address',           'Address')
        + f('address2',          'Suite / Unit')
        + f('city',              'City')
        + f('county',            'State / Province')
        + f('postCode',          'Zip code')
        + countrySelectHtml('countryRegionCode', 'US')
        + '</div>'
        + '<div class="va-pay-actions">'
        + '<button class="va-btn va-btn--primary va-erp-create">Add address</button>'
        + '<button class="va-btn va-erp-new-cancel">Cancel</button>'
        + '</div>'
        + '<div class="va-erp-form-err va-pay-error" hidden></div>'
        + '</div>';
    }

    function addrRender() {
      if (actionsEl) {
        if (vaMarketHandle !== 'BOOST-MOBILE') {
          actionsEl.innerHTML = addrState.adding
            ? newAddrFormHtml()
            : '<button class="va-btn va-btn--ghost va-erp-add-btn">&#43; Add address</button>';
        } else {
          actionsEl.innerHTML = '';
        }
      }
      var total     = addrState.addresses.length;
      var totalPages = Math.ceil(total / ADDR_PAGE_SIZE) || 1;
      if (addrState.page >= totalPages) addrState.page = Math.max(0, totalPages - 1);
      var pageStart = addrState.page * ADDR_PAGE_SIZE;
      var pageAddrs = addrState.addresses.slice(pageStart, pageStart + ADDR_PAGE_SIZE);

      var html = '';
      if (!total && !addrState.adding) {
        html += '<div class="va-pay-empty">No ship-to addresses on file.</div>';
      }
      pageAddrs.forEach(function (a) {
        html += '<div class="va-erp-item">'
          + '<div class="va-erp-row">'
          + '<div class="va-erp-icon">' + locIcon + '</div>'
          + '<div class="va-erp-info">'
          + '<div class="va-erp-name">' + escHtml(a.name || a.code) + '</div>'
          + '<div class="va-erp-addr">' + fmtAddr(a) + '</div>'
          + '<div class="va-erp-code">' + escHtml(a.code) + '</div>'
          + '</div>'
          + (vaMarketHandle === 'BOOST-MOBILE' ? '' :
            '<div class="va-erp-actions">'
            + '<button class="va-erp-btn va-erp-edit-btn" data-code="' + escHtml(a.code) + '">'
            + (addrState.editing === a.code ? 'Cancel' : 'Edit') + '</button>'
            + '<button class="va-erp-btn danger va-erp-del-btn" data-code="' + escHtml(a.code) + '" data-system-id="' + escHtml(a.systemId || a.SystemId || '') + '">Remove</button>'
            + '</div>')
          + '</div>'
          + (addrState.editing === a.code ? editFormHtml(a) : '')
          + '</div>';
      });
      if (totalPages > 1) {
        html += '<div class="va-inv-pager">'
          + '<button class="va-inv-pager-btn va-addr-pager-prev"' + (addrState.page === 0 ? ' disabled' : '') + '>\u2190 Prev</button>'
          + '<span class="va-inv-pager-info">Page ' + (addrState.page + 1) + ' of ' + totalPages + '</span>'
          + '<button class="va-inv-pager-btn va-addr-pager-next"' + (addrState.page >= totalPages - 1 ? ' disabled' : '') + '>Next \u2192</button>'
          + '</div>';
      }
      listEl.innerHTML = html;
    }

    function addrLoad() {
      listEl.innerHTML = '<div class="va-pay-loading">Loading addresses\u2026</div>';
      vaMarketReady.then(function () {
        addrProxy({ action: 'address-list', include_children: true }, function (d) {
          addrState.addresses = d.addresses || [];
          addrState.loaded = true;
          addrRender();
          var cnt = addrState.addresses.length;
          var metricEl = document.getElementById('va-metric-addr-count');
          var subEl    = document.getElementById('va-dash-addr-sub');
          var listEl   = document.getElementById('va-dash-addr-list');
          if (metricEl) metricEl.textContent = cnt;
          if (subEl)    subEl.textContent    = cnt + ' saved location' + (cnt !== 1 ? 's' : '');
          if (listEl) {
            if (cnt === 0) {
              listEl.innerHTML = '<div class="va-empty">No addresses saved.</div>';
            } else {
              listEl.innerHTML = addrState.addresses.slice(0, 4).map(function (a) {
                return '<div class="va-list-item">'
                  + '<div class="va-list-item-icon" style="background:var(--va-parchment);color:var(--va-steel);">'
                  + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
                  + '</div>'
                  + '<div class="va-list-info">'
                  + '<div class="va-list-name">' + escHtml(a.name || '') + '</div>'
                  + '<div class="va-list-meta">' + escHtml([a.city, a.state].filter(Boolean).join(', ')) + '</div>'
                  + '</div></div>';
              }).join('');
            }
          }
        }, function (err) {
          listEl.innerHTML = '<div class="va-pay-error">' + escHtml('Could not load: ' + err.message) + '</div>';
        });
      });
    }

    function addrSave(code) {
      var form = listEl.querySelector('[data-edit="' + code + '"]');
      if (!form) return;
      var addrMeta = addrState.addresses.find(function (x) { return x.code === code; });
      var payload = { action: 'address-update', code: code, system_id: addrMeta?.systemId || addrMeta?.SystemId || '', bc_customer_no: addrMeta?.customerNo || '' };
      form.querySelectorAll('input[name]').forEach(function (i) { payload[i.name] = i.value.trim(); });
      var saveBtn = form.querySelector('.va-erp-save');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving\u2026'; }
      addrProxy(payload, function () {
        var a = addrState.addresses.find(function (x) { return x.code === code; });
        if (a) ['name','address','address2','city','county','postCode','countryRegionCode','phoneNo'].forEach(function (k) { if (k in payload) a[k] = payload[k]; });
        addrState.editing = null;
        addrRender();
      }, function (err) {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save changes'; }
        var errEl = form.querySelector('.va-erp-form-err');
        if (errEl) { errEl.textContent = err.message; errEl.hidden = false; }
      });
    }

    function addrDelete(code, systemId, btn) {
      vaConfirm({ msg: 'Remove this ship-to address from ERP?', okLabel: 'Remove', danger: true }).then(function (ok) { if (ok) _addrDelete(code, systemId, btn); });
    }
    function _addrDelete(code, systemId, btn) {
      btn.disabled = true; btn.textContent = 'Removing\u2026';
      addrProxy({ action: 'address-delete', system_id: systemId }, function () {
        addrState.addresses = addrState.addresses.filter(function (a) { return a.code !== code; });
        if (addrState.editing === code) addrState.editing = null;
        addrRender();
      }, function (err) {
        btn.disabled = false; btn.textContent = 'Remove';
        listEl.insertAdjacentHTML('afterbegin', '<div class="va-pay-error">' + escHtml(err.message) + '</div>');
      });
    }

    function addrCreate() {
      var form = listEl.querySelector('.va-erp-new-form');
      if (!form) return;
      var payload = { action: 'address-create' };
      form.querySelectorAll('input[name]').forEach(function (i) { payload[i.name] = i.value.trim(); });
      var saveBtn = form.querySelector('.va-erp-create');
      if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Adding\u2026'; }
      addrProxy(payload, function (d) {
        if (d.address) addrState.addresses.push(d.address);
        addrState.adding = false;
        addrState.page = Math.max(0, Math.ceil(addrState.addresses.length / ADDR_PAGE_SIZE) - 1);
        addrRender();
      }, function (err) {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Add address'; }
        var errEl = form.querySelector('.va-erp-form-err');
        if (errEl) { errEl.textContent = err.message; errEl.hidden = false; }
      });
    }

    function addrHandleClick(e) {
      var eb = e.target.closest('.va-erp-edit-btn');
      if (eb) { addrState.editing = addrState.editing === eb.dataset.code ? null : eb.dataset.code; addrRender(); return; }
      var db = e.target.closest('.va-erp-del-btn');
      if (db) { addrDelete(db.dataset.code, db.dataset.systemId, db); return; }
      var sb = e.target.closest('.va-erp-save');
      if (sb) { addrSave(sb.dataset.code); return; }
      var cb = e.target.closest('.va-erp-cancel');
      if (cb) { addrState.editing = null; addrRender(); return; }
      var ab = e.target.closest('.va-erp-add-btn');
      if (ab) { addrState.adding = true; addrState.editing = null; addrRender(); return; }
      var nc = e.target.closest('.va-erp-new-cancel');
      if (nc) { addrState.adding = false; addrRender(); return; }
      var cr = e.target.closest('.va-erp-create');
      if (cr) { addrCreate(); return; }
      var pp = e.target.closest('.va-addr-pager-prev');
      if (pp && addrState.page > 0) { addrState.page--; addrState.editing = null; addrRender(); return; }
      var pn = e.target.closest('.va-addr-pager-next');
      if (pn) { addrState.page++; addrState.editing = null; addrRender(); return; }
    }
    listEl.addEventListener('click', addrHandleClick);
    if (actionsEl) actionsEl.addEventListener('click', addrHandleClick);

    if (addrTab.classList.contains('va-tab--active')) addrLoad();
    new MutationObserver(function () {
      if (addrTab.classList.contains('va-tab--active') && !addrState.loaded) addrLoad();
    }).observe(addrTab, { attributes: true, attributeFilter: ['class'] });
  }());

  // ── Invoices ─────────────────────────────────────────────
  (function () {
    var invTab = document.getElementById('va-tab-invoices');
    if (!invTab) return;
    var listEl = document.getElementById('va-inv-list');
    if (!listEl) return;

    var invState = { page: 1, hasMore: false, totalPages: null, totalCount: null, invoices: [], loaded: false, loading: false };

    // Filter bar wiring (inputs are in static HTML, set up once)
    ;(function () {
      var searchEl  = document.getElementById('va-inv-search');
      var searchWrap = searchEl && searchEl.closest('.va-inv-search-wrap');
      var searchClear = document.getElementById('va-inv-search-clear');
      var minEl    = document.getElementById('va-inv-min');
      var maxEl    = document.getElementById('va-inv-max');
      if (searchEl) searchEl.addEventListener('input', function () {
        if (searchWrap) searchWrap.classList.toggle('has-value', searchEl.value.length > 0);
        invApplyFilter();
      });
      if (searchClear) searchClear.addEventListener('click', function () {
        if (searchEl) { searchEl.value = ''; searchEl.focus(); }
        if (searchWrap) searchWrap.classList.remove('has-value');
        invApplyFilter();
      });
      if (minEl) minEl.addEventListener('input', invApplyFilter);
      if (maxEl) maxEl.addEventListener('input', invApplyFilter);
    }());

    // Order filter bar wiring
    ;(function () {
      var searchEl    = document.getElementById('va-orders-search');
      var searchWrap  = searchEl && searchEl.closest('.va-inv-search-wrap');
      var searchClear = document.getElementById('va-orders-search-clear');
      if (searchEl) searchEl.addEventListener('input', function () {
        if (searchWrap) searchWrap.classList.toggle('has-value', searchEl.value.length > 0);
        ordersApplyFilter();
      });
      if (searchClear) searchClear.addEventListener('click', function () {
        if (searchEl) { searchEl.value = ''; searchEl.focus(); }
        if (searchWrap) searchWrap.classList.remove('has-value');
        ordersApplyFilter();
      });
    }());

    function invProxy(payload, onOk, onErr) {
      var auth = window.__vaAuth || {};
      fetch(auth.proxy || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({}, { customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop }, payload))
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.ok) onOk(d); else onErr(new Error(d.error || 'Unknown error'));
      }).catch(onErr);
    }


    var dlIcon  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
    var pdfIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>';
    var spinIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:va-spin 1s linear infinite"><circle cx="12" cy="12" r="9" stroke-dasharray="28 57" stroke-linecap="round"/></svg>';

    function buildLinesTable(lines, cur) {
      var fmtA = function(v) {
        if (v == null) return '\u2014';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD' }).format(v);
      };
      var html = '<table class="va-inv-doc-lines"><thead><tr>'
        + '<th style="width:26px;text-align:center">#</th>'
        + '<th>Item / SKU</th>'
        + '<th style="width:52px;text-align:center">Qty</th>'
        + '<th style="width:90px;text-align:right">Unit Price</th>'
        + '<th style="width:90px;text-align:right">Amount</th>'
        + '</tr></thead><tbody>';
      var lineIdx = 0;
      (lines || []).forEach(function(line) {
        if ((line.type || '').toLowerCase() === 'comment') return;
        var lTitle = line.title || '';
        if (!lTitle && !line.meta) return;
        lineIdx++;
        var lQty = line.quantity   != null ? line.quantity  : '';
        var lUp  = line.unitPrice  != null ? fmtA(line.unitPrice)  : '\u2014';
        var lAmt = line.lineAmount != null ? fmtA(line.lineAmount) : (line.amount != null ? fmtA(line.amount) : '\u2014');
        var metaHtml = escHtml(line.meta || '');
        var cell = '<div class="va-inv-line-sku">' + escHtml(lTitle || 'Unknown product') + '</div>'
                 + (metaHtml ? '<div class="va-inv-line-desc">' + metaHtml + '</div>' : '');
        html += '<tr>'
          + '<td style="text-align:center;color:var(--va-steel);font-size:11px">' + lineIdx + '</td>'
          + '<td>' + cell + '</td>'
          + '<td style="text-align:center">' + escHtml(String(lQty)) + '</td>'
          + '<td style="text-align:right">' + lUp + '</td>'
          + '<td style="text-align:right;font-weight:500">' + lAmt + '</td>'
          + '</tr>';
      });
      html += '</tbody></table>';
      return lineIdx > 0 ? html : '';
    }

    function invUpdateSub() {
      var subEl = document.getElementById('va-invoices-page-sub');
      if (!subEl) return;
      var n = invState.totalCount != null ? invState.totalCount : invState.invoices.length;
      subEl.textContent = n + ' invoice' + (n !== 1 ? 's' : '') + ' \u00b7 click a row to expand';
    }

    function invApplyFilter() {
      var searchEl = document.getElementById('va-inv-search');
      var minEl    = document.getElementById('va-inv-min');
      var maxEl    = document.getElementById('va-inv-max');
      var q    = searchEl ? searchEl.value.trim().toLowerCase() : '';
      var minA = minEl && minEl.value !== '' ? parseFloat(minEl.value) : null;
      var maxA = maxEl && maxEl.value !== '' ? parseFloat(maxEl.value) : null;
      var active = !!(q || minA !== null || maxA !== null);

      var rows = listEl.querySelectorAll('.va-inv-row:not(.va-inv-head)');
      var shown = 0;
      rows.forEach(function (row) {
        var panelId = row.dataset.invPanel;
        var detail  = panelId ? document.getElementById(panelId) : null;
        var amt     = parseFloat(row.dataset.amount || '0');
        var textOk  = !q || (row.dataset.search || '').includes(q);
        var amtOk   = (minA === null || amt >= minA) && (maxA === null || amt <= maxA);
        var visible = textOk && amtOk;
        row.style.display = visible ? '' : 'none';
        if (detail) {
          if (!visible) detail.style.display = 'none';
          else detail.style.display = detail.classList.contains('open') ? 'block' : '';
        }
        if (visible) shown++;
      });

      var subEl = document.getElementById('va-invoices-page-sub');
      if (subEl) {
        if (active && rows.length > 0) {
          subEl.textContent = shown + ' of ' + rows.length + ' invoice' + (rows.length !== 1 ? 's' : '') + ' on this page';
        } else {
          invUpdateSub();
        }
      }
    }

    function invRender() {
      if (!invState.invoices.length) {
        listEl.innerHTML = '<div class="va-pay-empty" style="padding:20px 22px;">No invoices found.</div>';
        var subEl = document.getElementById('va-invoices-page-sub');
        if (subEl) subEl.textContent = 'No invoices found.';
        return;
      }
      var chevronIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>';
      var html = '<div class="va-inv-row va-inv-head">'
        + '<div>Invoice</div><div>Date</div><div>Due</div><div style="text-align:right">Amount</div><div></div>'
        + '</div>';
      invState.invoices.forEach(function (inv) {
        var invNo      = inv.no || inv.number || '';
        var invOrderNo = inv.orderNo || '';
        var invDate = inv.postingDate || inv.invoiceDate || inv.documentDate || '';
        var invDue  = inv.dueDate || '';
        var invPo   = inv.externalDocumentNo || inv.externalDocumentNumber || '';
        var panelId = 'va-inv-d-' + invNo.replace(/[^a-zA-Z0-9]/g, '-');

        // Build full invoice document
        var cur = inv.currencyCode || 'USD';
        var fmtAmt = function(v) {
          if (v == null) return '\u2014';
          return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(v);
        };
        var total     = inv.amountIncludingVAT != null ? inv.amountIncludingVAT : (inv.amount != null ? inv.amount : null);
        var subtotal  = inv.amount != null ? inv.amount : null;
        var remaining = inv.remainingAmount != null ? inv.remainingAmount : null;
        var terms     = inv.paymentTermsCode || '';
        var shipName  = inv.shipToName || '';
        var shipParts = [inv.shipToAddress, inv.shipToCity, inv.shipToCounty, inv.shipToPostCode, inv.shipToCountryRegionCode].filter(Boolean);
        var billName  = inv.billToName || inv.sellToCustomerName || '';
        var billParts = [
          inv.billToAddress  || inv.sellToAddress,
          inv.billToCity     || inv.sellToCity,
          inv.billToCounty   || inv.sellToCounty,
          inv.billToPostCode || inv.sellToPostCode,
          inv.billToCountryRegionCode || inv.sellToCountryRegionCode
        ].filter(Boolean);

        // Header summary (right side)
        var sumRows = '';
        sumRows += '<div class="va-inv-doc-sum-row"><span>Date</span><strong>' + fmtDate(invDate) + '</strong></div>';
        if (invDue) sumRows += '<div class="va-inv-doc-sum-row"><span>Due</span><strong>' + fmtDate(invDue) + '</strong></div>';
        if (terms)  sumRows += '<div class="va-inv-doc-sum-row"><span>Terms</span><strong>' + escHtml(terms) + '</strong></div>';
        if (invPo)  sumRows += '<div class="va-inv-doc-sum-row"><span>PO\u00a0#</span><strong>' + escHtml(invPo) + '</strong></div>';

        // Bill-to / Ship-to
        var addrHtml = '';
        if (billName || billParts.length) {
          addrHtml += '<div class="va-inv-doc-addr"><div class="va-inv-doc-addr-label">Bill To</div><div class="va-inv-doc-addr-body">';
          if (billName) addrHtml += '<strong>' + escHtml(billName) + '</strong><br>';
          if (billParts.length) addrHtml += escHtml(billParts.join(', '));
          addrHtml += '</div></div>';
        }
        if (shipName || shipParts.length) {
          addrHtml += '<div class="va-inv-doc-addr"><div class="va-inv-doc-addr-label">Ship To</div><div class="va-inv-doc-addr-body">';
          if (shipName) addrHtml += '<strong>' + escHtml(shipName) + '</strong><br>';
          if (shipParts.length) addrHtml += escHtml(shipParts.join(', '));
          addrHtml += '</div></div>';
        }

        // Tracking
        var trackingHtml = '';
        var trackNo = inv.packageTrackingNo || '';
        var carrier = inv.shippingAgentCode || '';
        if (trackNo) {
          var trackUrl = '';
          var c = carrier.toUpperCase();
          if (c === 'USPS')       trackUrl = 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' + encodeURIComponent(trackNo);
          else if (c === 'FEDEX') trackUrl = 'https://www.fedex.com/apps/fedextrack/?tracknumbers=' + encodeURIComponent(trackNo);
          else if (c === 'UPS')   trackUrl = 'https://www.ups.com/track?tracknum=' + encodeURIComponent(trackNo);
          var truckIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
          var trackLabel = escHtml((carrier || 'Carrier') + ': ' + trackNo);
          trackingHtml = '<div class="va-inv-doc-addr"><div class="va-inv-doc-addr-label">Tracking</div><div class="va-inv-doc-addr-body">'
            + '<div class="va-od-tracking">' + truckIcon
            + (trackUrl ? '<a href="' + escHtml(trackUrl) + '" target="_blank" rel="noopener" class="va-od-tracking-link">' + trackLabel + '</a>' : trackLabel)
            + '</div></div></div>';
        }

        // Line items (lazy-loaded on panel open)
        var linesHtml = '<div class="va-inv-lines-area"></div>';

        // Totals
        var totalsHtml = '';
        if (subtotal != null && total != null && Math.abs(subtotal - total) > 0.005) {
          totalsHtml += '<div class="va-inv-doc-total-row"><span>Subtotal</span><span>' + fmtAmt(subtotal) + '</span></div>';
        }
        if (total != null) {
          totalsHtml += '<div class="va-inv-doc-total-row va-inv-doc-total-grand"><span>Total</span><span>' + fmtAmt(total) + '</span></div>';
        }
        if (remaining != null && Math.abs(remaining) > 0.005) {
          totalsHtml += '<div class="va-inv-doc-total-row va-inv-doc-total-due"><span>Remaining</span><span>' + fmtAmt(remaining) + '</span></div>';
        }

        // Assemble document
        var invDocHtml = '<div class="va-inv-doc">'
          + '<div class="va-inv-doc-top">'
          + '<div><div class="va-inv-doc-company">Valor Communication, Inc.<br>18071 ARENTH AVE., CITY OF INDUSTRY, CA 91748</div><div class="va-inv-doc-title">Invoice</div><div class="va-inv-doc-num">' + escHtml(invNo) + (invOrderNo ? '<span class="va-inv-doc-order"> ·&nbsp; Order#\u00a0' + escHtml(invOrderNo) + '</span>' : '') + '</div></div>'
          + '<div class="va-inv-doc-sum">' + sumRows + '</div>'
          + '</div>'
          + (addrHtml ? '<div class="va-inv-doc-addresses">' + addrHtml + '</div>' : '')
          + (trackingHtml ? '<div class="va-inv-doc-tracking">' + trackingHtml + '</div>' : '')
          + linesHtml
          + (totalsHtml ? '<div class="va-inv-doc-totals">' + totalsHtml + '</div>' : '')
          + '</div>';

        var searchStr = [invNo, invPo, shipName, shipParts.join(' '), billName].filter(Boolean).join(' ').toLowerCase();
        var amtVal    = total != null ? total : 0;
        html += '<div class="va-inv-row" data-inv-panel="' + panelId + '" data-search="' + escHtml(searchStr) + '" data-amount="' + amtVal + '">'
          + '<div class="va-inv-num">'
          + '<div class="va-order-num">' + escHtml(invNo) + '</div>'
          + (invPo ? '<div class="va-order-po">PO\u00a0' + escHtml(invPo) + '</div>' : '')
          + '</div>'
          + '<div class="va-order-cell">' + fmtDate(invDate) + '</div>'
          + '<div class="va-order-cell">' + fmtDate(invDue) + '</div>'
          + '<div class="va-inv-amt-cell">' + (total != null ? fmtAmt(total) : '\u2014') + '</div>'
          + '<div class="va-inv-row-btns">'
          + '<button class="va-inv-dl-btn va-inv-pdf-btn" data-inv-no="' + escHtml(invNo) + '" title="Download PDF">' + pdfIcon + '</button>'
          + '<button class="va-inv-dl-btn" data-inv-no="' + escHtml(invNo) + '" title="Download XLS">' + dlIcon + '</button>'
          + '<button class="va-inv-expand-btn" data-inv-panel="' + panelId + '" title="Show details">' + chevronIcon + '</button>'
          + '</div>'
          + '</div>'
          + '<div class="va-inv-detail" id="' + panelId + '" data-inv-no="' + escHtml(invNo) + '">' + invDocHtml + '</div>';
      });

      // Pagination footer
      var pg = invState.page;
      var tp = invState.totalPages;
      var pagerNums = '';
      if (tp && tp > 1) {
        var delta = 2, pgLast = null;
        for (var pi = 1; pi <= tp; pi++) {
          if (pi === 1 || pi === tp || (pi >= pg - delta && pi <= pg + delta)) {
            if (pgLast !== null && pi - pgLast > 1) pagerNums += '<span class="va-inv-pg-ellipsis">\u2026</span>';
            pagerNums += '<button class="va-inv-pg-num' + (pi === pg ? ' va-inv-pg-num--active' : '') + '" data-inv-page="' + pi + '"' + (pi === pg ? ' disabled' : '') + '>' + pi + '</button>';
            pgLast = pi;
          }
        }
      }
      html += '<div class="va-inv-pager">'
        + '<button class="va-inv-pager-btn" id="va-inv-prev"' + (pg <= 1 ? ' disabled' : '') + '>\u2190 Prev</button>'
        + (pagerNums || '<span class="va-inv-pager-info">Page ' + pg + (tp ? ' of ' + tp : '') + '</span>')
        + '<button class="va-inv-pager-btn" id="va-inv-next"' + (!invState.hasMore ? ' disabled' : '') + '>Next \u2192</button>'
        + '</div>';

      listEl.innerHTML = html;
      var invPagerTop = document.getElementById('va-inv-pager-top');
      if (invPagerTop) {
        invPagerTop.innerHTML = '<button class="va-inv-pager-btn" id="va-inv-prev-top"' + (pg <= 1 ? ' disabled' : '') + '>\u2190 Prev</button>'
          + (pagerNums || '<span class="va-inv-pager-info">Page ' + pg + (tp ? ' of ' + tp : '') + '</span>')
          + '<button class="va-inv-pager-btn" id="va-inv-next-top"' + (!invState.hasMore ? ' disabled' : '') + '>Next \u2192</button>';
        invPagerTop.hidden = pg <= 1 && !invState.hasMore;
      }
      invUpdateSub();

    }

    function invLoad(pg) {
      if (invState.loading) return;
      invState.loading = true;
      pg = pg || 1;
      listEl.innerHTML = '<div class="va-pay-loading" style="padding:16px 22px;">Loading invoices\u2026</div>';
      var subEl = document.getElementById('va-invoices-page-sub');
      if (subEl) subEl.textContent = 'Loading invoices\u2026';
      invProxy({ action: 'invoice-list', page: pg }, function (d) {
        invState.loading    = false;
        invState.loaded     = true;
        invState.page       = d.page || pg;
        invState.hasMore     = !!d.hasMore;
        invState.totalPages  = d.totalPages || null;
        invState.totalCount  = d.totalCount != null ? +d.totalCount : null;
        invState.invoices    = d.invoices || [];
        invRender();
        invUpdateSub();
        invApplyFilter();
      }, function (err) {
        invState.loading = false;
        listEl.innerHTML = '<div class="va-pay-error" style="margin:16px 22px;">' + escHtml('Could not load invoices: ' + err.message) + '</div>';
      });
    }

    function invDownloadPdf(invNo, btn) {
      btn.disabled = true;
      btn.innerHTML = spinIcon;
      var inv = invState.invoices.find(function (i) { return (i.no || i.number || '') === invNo; });
      var sellTo = inv ? (inv.sellToCustomerNo || inv.billToCustomerNo || '') : '';
      invProxy({ action: 'invoice-report', invoice_no: invNo, format: 'PDF', sell_to_customer_no: sellTo }, function (d) {
        try {
          var bytes = atob(d.content);
          var arr = new Uint8Array(bytes.length);
          for (var i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
          var blob = new Blob([arr], { type: d.mimeType || 'application/pdf' });
          var url  = URL.createObjectURL(blob);
          var a    = document.createElement('a');
          a.href = url; a.download = d.filename || ('Invoice-' + invNo + '.pdf');
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        } catch (e) { alert('PDF download failed.'); }
        btn.disabled = false; btn.innerHTML = pdfIcon;
      }, function (err) {
        alert('PDF generation failed: ' + err.message);
        btn.disabled = false; btn.innerHTML = pdfIcon;
      });
    }

    function invDownload(invNo, btn) {
      var inv = invState.invoices.find(function (i) { return (i.no || i.number || '') === invNo; });
      if (!inv) { alert('Invoice data not loaded.'); return; }

      btn.disabled = true;
      btn.innerHTML = spinIcon;

      var loadXlsx = window.XLSX
        ? Promise.resolve()
        : new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';
            s.onload = resolve; s.onerror = reject;
            document.head.appendChild(s);
          });

      var invSellTo = inv.sellToCustomerNo || inv.billToCustomerNo || '';
      var loadLines = Array.isArray(inv._lines)
        ? Promise.resolve(inv._lines)
        : new Promise(function (res) {
            invProxy({ action: 'invoice-lines', invoice_no: invNo, sell_to_customer_no: invSellTo },
              function (d) { inv._lines = d.lines || []; res(inv._lines); },
              function ()  { inv._lines = []; res([]); }
            );
          });

      Promise.all([loadXlsx, loadLines]).then(function (results) {
        var lineItems = results[1];
        var XL    = window.XLSX;
        var cur   = inv.currencyCode || 'USD';
        var fmtNum = function (v) { return v != null ? parseFloat(v) : ''; };

        var invDate     = fmtDate(inv.postingDate || inv.invoiceDate || inv.documentDate || '');
        var invDue      = fmtDate(inv.dueDate || '');
        var invPo       = inv.externalDocumentNo || inv.externalDocumentNumber || '';
        var companyName = 'Valor Communication, Inc.';
        var total       = inv.amountIncludingVAT != null ? inv.amountIncludingVAT : inv.amount;

        // Addresses
        var billName  = inv.billToName || inv.sellToCustomerName || '';
        var billLines = [inv.billToAddress || inv.sellToAddress || '',
                         [inv.billToCity    || inv.sellToCity,
                          inv.billToCounty  || inv.sellToCounty,
                          inv.billToPostCode || inv.sellToPostCode,
                          inv.billToCountryRegionCode || inv.sellToCountryRegionCode].filter(Boolean).join(', ')
                        ].filter(Boolean);
        var shipName  = inv.shipToName || '';
        var shipLines = [inv.shipToAddress || '',
                         [inv.shipToCity, inv.shipToCounty, inv.shipToPostCode,
                          inv.shipToCountryRegionCode].filter(Boolean).join(', ')
                        ].filter(Boolean);

        var rows   = [];
        var merges = [];
        var r      = 0;

        // ── Header block ────────────────────────────────────────────────
        // A-D merged for left content; E = label, F = value
        var headerStart = r;
        rows.push(['INVOICE', '', '', '', 'Date', invDate]); merges.push({s:{r:r,c:0},e:{r:r,c:3}}); r++;
        rows.push(['#' + invNo, '', '', '', 'Due', invDue]); merges.push({s:{r:r,c:0},e:{r:r,c:3}}); r++;
        if (inv.paymentTermsCode) {
          rows.push(['', '', '', '', 'Terms', inv.paymentTermsCode]);
          merges.push({s:{r:r,c:0},e:{r:r,c:3}}); r++;
        }
        // Company name sits on the left of the PO# row; if no PO# it gets its own row
        if (invPo) {
          rows.push([companyName, '', '', '', 'PO #', invPo]);
          merges.push({s:{r:r,c:0},e:{r:r,c:3}}); r++;
        } else {
          rows.push([companyName, '', '', '', '', '']);
          merges.push({s:{r:r,c:0},e:{r:r,c:3}}); r++;
        }
        var headerEnd = r - 1;

        rows.push([]); r++;

        // ── Address block ───────────────────────────────────────────────
        // A-C = Bill To (0~2), D-F = Ship To (3~5)
        var addrStart = r;
        rows.push(['BILL TO','','','SHIP TO','','']); merges.push({s:{r:r,c:0},e:{r:r,c:2}}); merges.push({s:{r:r,c:3},e:{r:r,c:5}}); r++;
        rows.push([billName,'','',shipName,'','']);   merges.push({s:{r:r,c:0},e:{r:r,c:2}}); merges.push({s:{r:r,c:3},e:{r:r,c:5}}); r++;
        var maxAddrLines = Math.max(billLines.length, shipLines.length);
        for (var ai = 0; ai < maxAddrLines; ai++) {
          rows.push([billLines[ai]||'','','', shipLines[ai]||'','','']);
          merges.push({s:{r:r,c:0},e:{r:r,c:2}}); merges.push({s:{r:r,c:3},e:{r:r,c:5}}); r++;
        }
        var addrEnd = r - 1;

        rows.push([]); r++;

        // ── Line items block ────────────────────────────────────────────
        var linesStart = r;
        rows.push(['#', 'UPC', 'SKU', 'Qty', 'Unit Price (' + cur + ')', 'Amount (' + cur + ')']); r++;

        var lineIdx = 0;
        lineItems.forEach(function (line) {
          if ((line.type || '').toLowerCase() === 'comment') return;
          var upc = line.itemNo || line.no || '';
          var sku = line.description || '';
          if (!upc && !sku) return;
          lineIdx++;
          rows.push([lineIdx, upc, sku,
            line.quantity != null ? line.quantity : '',
            fmtNum(line.unitPrice),
            fmtNum(line.lineAmount != null ? line.lineAmount : line.amount)]);
          r++;
        });

        rows.push([]); r++;
        if (inv.amount != null && inv.amountIncludingVAT != null && inv.amount !== inv.amountIncludingVAT) {
          rows.push(['','','','','Subtotal', fmtNum(inv.amount)]); r++;
          rows.push(['','','','','Tax',      fmtNum(inv.amountIncludingVAT - inv.amount)]); r++;
        }
        if (total != null)              { rows.push(['','','','','Total',      fmtNum(total)]); r++; }
        if (inv.remainingAmount != null) { rows.push(['','','','','Amount Due', fmtNum(inv.remainingAmount)]); r++; }
        var linesEnd = r - 1;

        // ── Build sheet ─────────────────────────────────────────────────
        var wb = XL.utils.book_new();
        var ws = XL.utils.aoa_to_sheet(rows);
        ws['!cols']   = [{wch:4},{wch:16},{wch:32},{wch:8},{wch:18},{wch:16}];
        ws['!merges'] = merges;

        XL.utils.book_append_sheet(wb, ws, 'Invoice');
        XL.writeFile(wb, 'Invoice-' + invNo + '.xls');
      }).catch(function () {
        alert('Failed to load export library.');
      }).finally(function () {
        btn.disabled = false;
        btn.innerHTML = dlIcon;
      });
    }

    listEl.addEventListener('click', function (e) {
      // PDF download button
      var pdfBtn = e.target.closest('.va-inv-pdf-btn');
      if (pdfBtn) { invDownloadPdf(pdfBtn.dataset.invNo, pdfBtn); return; }
      // XLS download button
      var dlBtn = e.target.closest('.va-inv-dl-btn');
      if (dlBtn) { invDownload(dlBtn.dataset.invNo, dlBtn); return; }

      // Row click (includes expand button) — toggle detail panel
      var row = e.target.closest('.va-inv-row[data-inv-panel]');
      if (row) {
        var panelId = row.dataset.invPanel;
        var panel   = panelId && listEl.querySelector('#' + panelId);
        var isOpen  = panel && panel.classList.contains('open');
        listEl.querySelectorAll('.va-inv-detail.open').forEach(function (p) { p.classList.remove('open'); });
        listEl.querySelectorAll('.va-inv-expand-btn.open').forEach(function (b) { b.classList.remove('open'); });
        if (!isOpen && panel) {
          panel.classList.add('open');
          var expandBtn = row.querySelector('.va-inv-expand-btn');
          if (expandBtn) expandBtn.classList.add('open');
          // Lazy-load line items on first open
          var rowInvNo = panel.dataset.invNo;
          var rowInv = invState.invoices.find(function(i) { return (i.no || i.number || '') === rowInvNo; });
          if (rowInv && rowInv._lines === undefined) {
            var linesArea = panel.querySelector('.va-inv-lines-area');
            if (linesArea) linesArea.innerHTML = '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">Loading\u2026</div>';
            rowInv._lines = null;
            var rowSellTo = rowInv ? (rowInv.sellToCustomerNo || rowInv.billToCustomerNo || '') : '';
            invProxy({ action: 'invoice-lines', invoice_no: rowInvNo, sell_to_customer_no: rowSellTo }, function(d) {
              rowInv._lines = d.lines || [];
              var tbl = buildLinesTable(rowInv._lines, rowInv.currencyCode || 'USD');
              if (linesArea) linesArea.innerHTML = tbl || '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">Line items not available for this invoice.</div>';
            }, function() {
              rowInv._lines = [];
              if (linesArea) linesArea.innerHTML = '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">Could not load line items.</div>';
            });
          }
        }
        return;
      }

    });

    // Update just the active page number in both pagers immediately on click.
    function invPagerSync() {
      var pg = invState.page, tp = invState.totalPages;
      [document.getElementById('va-inv-pager-top'), listEl.querySelector('.va-inv-pager')].forEach(function (el) {
        if (!el) return;
        el.querySelectorAll('[data-inv-page]').forEach(function (btn) {
          var p = parseInt(btn.dataset.invPage, 10);
          btn.classList.toggle('va-inv-pg-num--active', p === pg);
          btn.disabled = p === pg;
        });
        var info = el.querySelector('.va-inv-pager-info');
        if (info) info.textContent = 'Page ' + pg + (tp ? ' of ' + tp : '');
      });
    }

    // All pagination handled at document level (both top and bottom pagers)
    document.addEventListener('click', function (e) {
      var newPg = null;
      if ((e.target.id === 'va-inv-prev' || e.target.id === 'va-inv-prev-top') && invState.page > 1) newPg = invState.page - 1;
      else if ((e.target.id === 'va-inv-next' || e.target.id === 'va-inv-next-top') && invState.hasMore) newPg = invState.page + 1;
      else { var pgBtn = e.target.closest && e.target.closest('[data-inv-page]'); if (pgBtn && !pgBtn.disabled) newPg = parseInt(pgBtn.dataset.invPage, 10); }
      if (newPg !== null) { invState.page = newPg; invPagerSync(); invLoad(newPg); }
    });

    if (invTab.classList.contains('va-tab--active')) invLoad(1);
    new MutationObserver(function () {
      if (invTab.classList.contains('va-tab--active') && !invState.loaded) invLoad(1);
    }).observe(invTab, { attributes: true, attributeFilter: ['class'] });
  }());

  // ── Channel theming ──────────────────────────────────────
  (function () {
    var CHANNELS = ['cricket', 'boost', 'total'];
    function getChannel() {
      var urlCh = new URLSearchParams(location.search).get('channel');
      if (urlCh && CHANNELS.indexOf(urlCh) !== -1) {
        try { localStorage.setItem('va_channel', urlCh); } catch (e) {}
        return urlCh;
      }
      try {
        var stored = localStorage.getItem('va_channel');
        if (stored && CHANNELS.indexOf(stored) !== -1) return stored;
      } catch (e) {}
      return null;
    }
    var ch = getChannel();
    if (ch) document.documentElement.setAttribute('data-channel', ch);
  })();

  // ── Saved carts tab ─────────────────────────────────────
  (function () {
    var scTab   = document.getElementById('va-tab-lists');
    if (!scTab) return;
    var listEl    = document.getElementById('va-sc-list');
    var scopeEl   = document.getElementById('va-sc-scope');
    var pagerEl   = document.getElementById('va-sc-pager');
    var pagerTopEl = document.getElementById('va-sc-pager-top');
    var searchEl  = document.getElementById('va-sc-search');
    var searchClear = document.getElementById('va-sc-search-clear');
    if (!listEl) return;
    var scope = 'mine';
    var SC_PER_PAGE = 10;
    var scState = { allCarts: [], page: 1 };

    function loadCarts() {
      listEl.innerHTML = '<div class="va-empty" style="padding:28px;">Loading\u2026</div>';
      if (pagerEl) pagerEl.hidden = true;
      if (pagerTopEl) pagerTopEl.hidden = true;
      var auth = window.__vaAuth || {};
      if (!auth.proxy || !auth.customer_id) {
        listEl.innerHTML = '<div class="va-empty" style="padding:28px;">Not available.</div>';
        return;
      }
      fetch(auth.proxy, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop, action: 'saved-carts-list', scope: scope })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Failed');
        scState.allCarts = d.carts || [];
        scState.page = 1;
        if (searchEl) { searchEl.value = ''; searchEl.closest('.va-inv-search-wrap').classList.remove('has-value'); }
        scRender();
      }).catch(function () {
        listEl.innerHTML = '<div class="va-empty" style="padding:28px;">Failed to load saved carts.</div>';
      });
    }

    function scFilteredCarts() {
      var q = searchEl ? searchEl.value.toLowerCase().trim() : '';
      if (!q) return scState.allCarts;
      return scState.allCarts.filter(function (c) {
        return (c.name || '').toLowerCase().includes(q)
          || (c.owner_name || '').toLowerCase().includes(q);
      });
    }

    function scRender() {
      var filtered = scFilteredCarts();
      var total    = filtered.length;
      var pg       = scState.page;
      var pages    = Math.max(1, Math.ceil(total / SC_PER_PAGE));
      if (pg > pages) { scState.page = pg = pages; }
      var start    = (pg - 1) * SC_PER_PAGE;
      var pageCarts = filtered.slice(start, start + SC_PER_PAGE);
      renderCarts(pageCarts);

      // Build pager HTML
      var showPager = pages > 1;
      var pagerHtml = '<button class="va-inv-pager-btn" id="va-sc-prev"' + (pg <= 1 ? ' disabled' : '') + '>\u2190 Prev</button>'
        + '<span class="va-inv-pager-info">Page ' + pg + ' of ' + pages + '</span>'
        + '<button class="va-inv-pager-btn" id="va-sc-next"' + (pg >= pages ? ' disabled' : '') + '>Next \u2192</button>';
      if (pagerEl) { pagerEl.innerHTML = pagerHtml; pagerEl.hidden = !showPager; }
      if (pagerTopEl) { pagerTopEl.innerHTML = '<span class="va-inv-pager-info">Page ' + pg + ' of ' + pages + '</span>'; pagerTopEl.hidden = !showPager; }
    }

    function buildScItemsTable(items) {
      var fmtP = function(cents) {
        if (cents == null) return '\u2014';
        return '$' + (cents / 100).toFixed(2);
      };
      var html = '<div class="va-sc-items">';
      (items || []).forEach(function(item) {
        var img = item.image
          ? '<img src="' + escHtml(item.image) + '" alt="" loading="lazy">'
          : '';
        var sku = item.sku ? 'SKU: ' + escHtml(item.sku) : '';
        html += '<div class="va-sc-item">'
          + '<div class="va-sc-item-img">' + img + '</div>'
          + '<div class="va-sc-item-info">'
          +   '<div class="va-sc-item-title">' + escHtml(item.title || 'Unknown') + '</div>'
          +   (sku ? '<div class="va-sc-item-sku">' + sku + '</div>' : '')
          + '</div>'
          + '<div class="va-sc-item-right">'
          +   '<div class="va-sc-item-qty">\u00d7 ' + (item.qty || 0) + '</div>'
          +   '<div class="va-sc-item-price">' + fmtP(item.price) + '</div>'
          + '</div>'
          + '</div>';
      });
      html += '</div>';
      return html;
    }

    function renderCarts(carts) {
      if (!carts.length) {
        listEl.innerHTML = '<div class="va-empty" style="padding:28px;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg><p style="margin-top:12px;">No saved carts yet.<br>Use the <strong>Save cart</strong> button on the cart page.</p></div>';
        return;
      }
      var showOwner = scope === 'org' && carts.some(function (c) { return c.owner_name; });
      var ownerCls  = showOwner ? ' has-owner' : '';
      var chevronIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
      var html = '<div class="va-sc-row-head' + ownerCls + '">'
        + '<div>Name</div>'
        + (showOwner ? '<div>Company</div>' : '')
        + '<div>Items</div><div>Saved</div><div></div><div></div>'
        + '</div>';
      carts.forEach(function (c, idx) {
        var name     = escHtml(c.name);
        var ownerErp = escHtml(c.owner_erp_no || '');
        var isMine   = !c.owner_name;
        var panelId  = 'sc-panel-' + idx;
        var previews = (c.previews || []).map(function(src) {
          return '<img class="va-sc-preview-img" src="' + escHtml(src) + '" alt="" loading="lazy">';
        }).join('');
        html += '<div class="va-sc-row' + ownerCls + '" data-sc-panel="' + panelId + '">'
          + '<div class="va-order-id">'
          +   '<div class="va-order-num">' + name + '</div>'
          +   (previews ? '<div class="va-sc-previews">' + previews + '</div>' : '')
          + '</div>'
          + (showOwner ? '<div class="va-order-cell">' + (c.owner_name ? escHtml(c.owner_name) : '<span style="color:var(--va-steel);font-style:italic">My company</span>') + '</div>' : '')
          + '<div class="va-order-cell">' + c.item_count + ' line item' + (c.item_count != 1 ? 's' : '') + '</div>'
          + '<div class="va-order-cell">' + new Date(c.saved_at).toLocaleDateString() + '</div>'
          + '<div style="display:flex;gap:10px;align-items:center;justify-content:flex-end;white-space:nowrap;">'
          +   '<button class="va-erp-btn" data-sc-load="' + name + '" data-sc-erp="' + ownerErp + '">Load to cart</button>'
          +   (isMine ? '<button class="va-erp-btn danger" data-sc-del="' + name + '">Delete</button>' : '')
          + '</div>'
          + '<div><button class="va-sc-expand-btn" data-sc-expand="' + panelId + '" title="Show items">' + chevronIcon + '</button></div>'
          + '</div>'
          + '<div class="va-sc-detail" id="' + panelId + '" data-sc-name="' + name + '" data-sc-erp="' + ownerErp + '">'
          +   '<div class="va-sc-detail-inner"></div>'
          + '</div>';
      });
      listEl.innerHTML = html;
    }

    if (scopeEl) {
      scopeEl.addEventListener('click', function (e) {
        var btn = e.target.closest('.va-sc-scope-btn');
        if (!btn || btn.getAttribute('data-scope') === scope) return;
        scope = btn.getAttribute('data-scope');
        scopeEl.querySelectorAll('.va-sc-scope-btn').forEach(function (b) {
          b.classList.toggle('va-sc-scope-btn--active', b === btn);
        });
        loadCarts();
      });
    }

    listEl.addEventListener('click', function (e) {
      var auth      = window.__vaAuth || {};
      var loadBtn   = e.target.closest('[data-sc-load]');
      var delBtn    = e.target.closest('[data-sc-del]');
      var expandBtn = e.target.closest('[data-sc-expand]');
      var row       = e.target.closest('.va-sc-row[data-sc-panel]');

      if (loadBtn) {
        var name     = loadBtn.getAttribute('data-sc-load');
        var ownerErp = loadBtn.getAttribute('data-sc-erp') || '';
        try { sessionStorage.setItem('vc_load_cart', JSON.stringify({ name: name, ownerErp: ownerErp })); } catch (_) {}
        window.location.href = '/cart';
        return;
      }

      if (delBtn) {
        var name = delBtn.getAttribute('data-sc-del');
        vaConfirm({ msg: 'Delete saved cart "' + name + '"?', okLabel: 'Delete', danger: true }).then(function (ok) {
          if (!ok) return;
          delBtn.disabled = true;
          fetch(auth.proxy, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop, action: 'saved-carts-delete', name: name })
          }).then(function (r) { return r.json(); }).then(function (d) {
            if (!d.ok) throw new Error(d.error || 'Delete failed');
            loadCarts();
          }).catch(function (err) {
            alert(err.message || 'Delete failed.');
            delBtn.disabled = false;
          });
        });
        return;
      }

      if (expandBtn || (row && !e.target.closest('button'))) {
        var panelId = expandBtn ? expandBtn.dataset.scExpand : row.dataset.scPanel;
        var panel   = document.getElementById(panelId);
        if (!panel) return;
        var isOpen  = panel.classList.contains('open');
        listEl.querySelectorAll('.va-sc-detail.open').forEach(function (p) { p.classList.remove('open'); });
        listEl.querySelectorAll('.va-sc-row--open').forEach(function (r) { r.classList.remove('va-sc-row--open'); });
        listEl.querySelectorAll('.va-sc-expand-btn.open').forEach(function (b) { b.classList.remove('open'); });
        if (!isOpen) {
          panel.classList.add('open');
          if (row) row.classList.add('va-sc-row--open');
          var btn = expandBtn || row.querySelector('.va-sc-expand-btn');
          if (btn) btn.classList.add('open');
          var inner = panel.querySelector('.va-sc-detail-inner');
          if (inner && !panel.dataset.loaded) {
            inner.innerHTML = '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">Loading\u2026</div>';
            var cartName = panel.dataset.scName;
            var cartErp  = panel.dataset.scErp || '';
            fetch(auth.proxy, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop, action: 'saved-carts-load', name: cartName, owner_erp_no: cartErp })
            }).then(function(r) { return r.json(); }).then(function(d) {
              panel.dataset.loaded = '1';
              inner.innerHTML = (d.ok && d.items && d.items.length)
                ? buildScItemsTable(d.items)
                : '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">No items in this cart.</div>';
            }).catch(function() {
              inner.innerHTML = '<div style="padding:8px 0;color:var(--va-steel);font-size:13px">Could not load items.</div>';
            });
          }
        }
      }
    });

    // Search wiring
    if (searchEl) {
      var searchWrap = searchEl.closest('.va-inv-search-wrap');
      searchEl.addEventListener('input', function () {
        if (searchWrap) searchWrap.classList.toggle('has-value', searchEl.value.length > 0);
        scState.page = 1;
        scRender();
      });
    }
    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchEl) { searchEl.value = ''; searchEl.focus(); }
        if (searchEl && searchEl.closest('.va-inv-search-wrap')) searchEl.closest('.va-inv-search-wrap').classList.remove('has-value');
        scState.page = 1;
        scRender();
      });
    }

    // Pager wiring
    document.addEventListener('click', function (e) {
      var id = e.target.id;
      if (id === 'va-sc-prev' || id === 'va-sc-prev-top') { if (scState.page > 1) { scState.page--; scRender(); } }
      else if (id === 'va-sc-next' || id === 'va-sc-next-top') { scState.page++; scRender(); }
    });

    var tabLoaded = false;
    new MutationObserver(function () {
      if (scTab.classList.contains('va-tab--active') && !tabLoaded) { tabLoaded = true; loadCarts(); }
    }).observe(scTab, { attributes: true, attributeFilter: ['class'] });

    if (scTab.classList.contains('va-tab--active')) { tabLoaded = true; loadCarts(); }
  }());

  // ── Team & Permissions tab ───────────────────────────────
  (function () {
    var teamTab    = document.getElementById('va-tab-team');
    var listEl     = document.getElementById('va-team-list');
    var subEl      = document.getElementById('va-team-sub');
    var noteEl     = document.getElementById('va-team-access-note');
    var errEl      = document.getElementById('va-team-error');
    var saveBtn    = document.getElementById('va-team-save');
    var resetBtn   = document.getElementById('va-team-reset');
    var searchEl   = document.getElementById('va-team-search');
    var searchClear= document.getElementById('va-team-search-clear');
    var selectAllBtn = document.getElementById('va-team-select-all');
    if (!teamTab || !listEl) return;

    var userSelectEl = document.getElementById('va-team-user-select');
    var teamState = { links: [], locations: [], isFullAccess: true, loaded: false, cachedAddresses: null };

    function proxy(payload, onOk, onErr) {
      var auth = window.__vaAuth || {};
      fetch(auth.proxy || '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop }, payload))
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d.ok) throw new Error(d.error || 'Error');
        if (onOk) onOk(d);
      }).catch(function (e) { if (onErr) onErr(e); });
    }

    function getCheckedNos() {
      var nos = {};
      listEl.querySelectorAll('input[type=checkbox]:checked').forEach(function (el) { nos[el.value] = true; });
      return nos;
    }

    function updateSelectAll() {
      if (!selectAllBtn) return;
      var items = Array.from(listEl.querySelectorAll('.va-perm-item')).filter(function (el) { return el.style.display !== 'none'; });
      var allChecked = items.length > 0 && items.every(function (el) { return el.querySelector('input[type=checkbox]').checked; });
      selectAllBtn.textContent = allChecked ? 'Unselect all' : 'Select all';
    }

    function applySearch() {
      var q = searchEl ? searchEl.value.toLowerCase().trim() : '';
      if (searchEl && searchEl.closest('.va-perm-search-wrap')) {
        searchEl.closest('.va-perm-search-wrap').classList.toggle('has-value', q.length > 0);
      }
      listEl.querySelectorAll('.va-perm-item').forEach(function (el) {
        el.style.display = (!q || el.textContent.toLowerCase().includes(q)) ? '' : 'none';
      });
      updateSelectAll();
    }

    function render() {
      var prevByNo = {};
      teamState.links.forEach(function (l) { prevByNo[l.customerNo] = l.systemId; });
      var checkedNos = teamState.isFullAccess ? null : prevByNo; // null = all checked

      var html = '';
      teamState.locations.forEach(function (loc) {
        var chk = (!checkedNos || checkedNos[loc.customerNo]) ? ' checked' : '';
        html += '<label class="va-perm-item">'
          + '<input type="checkbox" value="' + escHtml(loc.customerNo) + '"' + chk + '>'
          + '<span class="va-perm-item-name">' + escHtml(loc.name || loc.customerNo)
          + (loc.addr ? '<span class="va-perm-item-addr">' + escHtml(loc.addr) + '</span>' : '')
          + '</span>'
          + '<span class="va-perm-item-no">' + escHtml(loc.customerNo) + '</span>'
          + '</label>';
      });
      listEl.innerHTML = html || '<div class="va-empty">No locations found.</div>';

      if (noteEl) {
        if (teamState.isFullAccess) {
          noteEl.textContent = 'You currently have full access to all locations. Uncheck any location to restrict your view.';
          noteEl.hidden = false;
        } else {
          noteEl.hidden = true;
        }
      }
      if (subEl) {
        subEl.textContent = teamState.locations.length + ' location' + (teamState.locations.length !== 1 ? 's' : '')
          + (teamState.isFullAccess ? ' · full access' : ' · ' + teamState.links.length + ' selected');
      }
      updateSelectAll();
    }

    function isFullAccess(links, locations) {
      if (!links.length) return true;
      var locationNos = {};
      locations.forEach(function (l) { locationNos[l.customerNo] = true; });
      return !links.some(function (l) { return locationNos[l.customerNo]; });
    }

    function buildLocations(addresses) {
      var byNo = {};
      addresses.forEach(function (a) {
        var cno = a.customerNo || '';
        if (!cno || byNo[cno]) return;
        var addrParts = [a.address || a.Address || '', a.city || a.City || '', a.county || a.County || '', a.postCode || a.PostCode || ''].filter(Boolean);
        byNo[cno] = { customerNo: cno, name: a.name || a.Name || cno, addr: addrParts.join(', ') };
      });
      return Object.values(byNo);
    }

    function selectedEmail() {
      var auth = window.__vaAuth || {};
      return (userSelectEl && userSelectEl.value) ? userSelectEl.value : (auth.customer_email || '');
    }

    function loadLinks(email) {
      listEl.innerHTML = '<div class="va-empty">Loading\u2026</div>';
      if (errEl) errEl.hidden = true;
      proxy({ action: 'user-perm-list', customer_email: email }, function (d) {
        teamState.links     = d.links || [];
        teamState.locations = buildLocations(teamState.cachedAddresses || []);
        teamState.isFullAccess = isFullAccess(teamState.links, teamState.locations);
        render();
      }, function (err) {
        listEl.innerHTML = '<div class="va-empty">Could not load permissions: ' + escHtml(err.message) + '</div>';
        if (subEl) subEl.textContent = '';
      });
    }

    function load() {
      var auth = window.__vaAuth || {};
      listEl.innerHTML = '<div class="va-empty">Loading\u2026</div>';
      if (errEl) errEl.hidden = true;

      // Fire address-list, user-list and user-perm-list in parallel; render once all return
      var results = {};
      function tryApply() {
        if (!('addresses' in results) || !('links' in results) || !('users' in results)) return;
        teamState.cachedAddresses = results.addresses;
        teamState.links        = results.links;
        teamState.locations    = buildLocations(results.addresses);
        teamState.isFullAccess = isFullAccess(results.links, teamState.locations);
        teamState.loaded          = true;
        // Populate user dropdown
        if (userSelectEl) {
          var currentEmail = auth.customer_email || '';
          userSelectEl.innerHTML = results.users.map(function (u) {
            var label = u.name ? u.name + ' (' + u.email + ')' : u.email;
            var sel   = u.email === currentEmail ? ' selected' : '';
            return '<option value="' + escHtml(u.email) + '"' + sel + '>' + escHtml(label) + '</option>';
          }).join('');
        }
        render();
      }

      proxy({ action: 'address-list', include_children: true }, function (d) {
        results.addresses = d.addresses || [];
        tryApply();
      }, function (err) {
        listEl.innerHTML = '<div class="va-empty">Could not load locations: ' + escHtml(err.message) + '</div>';
        if (subEl) subEl.textContent = '';
      });

      proxy({ action: 'user-list' }, function (d) {
        results.users = d.users || [];
        tryApply();
      }, function () {
        // Non-fatal: fall back to current user only
        results.users = [{ email: auth.customer_email || '', name: '' }];
        tryApply();
      });

      proxy({ action: 'user-perm-list', customer_email: auth.customer_email || '' }, function (d) {
        results.links = d.links || [];
        tryApply();
      }, function (err) {
        listEl.innerHTML = '<div class="va-empty">Could not load permissions: ' + escHtml(err.message) + '</div>';
        if (subEl) subEl.textContent = '';
      });
    }

    function save() {
      var auth = window.__vaAuth || {};
      var checkedNos  = getCheckedNos();
      var allNos      = teamState.locations.map(function (l) { return l.customerNo; });
      var isNowAll    = allNos.every(function (no) { return checkedNos[no]; });
      var prevByNo    = {};
      teamState.links.forEach(function (l) { prevByNo[l.customerNo] = l.systemId; });

      var toAdd    = [];
      var toDelete = [];

      if (isNowAll && teamState.isFullAccess) {
        // No change
        return;
      } else if (isNowAll && !teamState.isFullAccess) {
        // Remove all restrictions → delete all links
        toDelete = teamState.links.map(function (l) { return l.systemId; });
      } else {
        // Restrict to selection
        allNos.forEach(function (no) {
          if (checkedNos[no] && !prevByNo[no])  toAdd.push(no);
          if (!checkedNos[no] && prevByNo[no])  toDelete.push(prevByNo[no]);
        });
      }

      if (!toAdd.length && !toDelete.length) return;

      saveBtn.disabled = true; saveBtn.textContent = 'Saving\u2026';
      if (errEl) errEl.hidden = true;
      proxy({
        action: 'user-perm-save',
        customer_email: selectedEmail(),
        to_add:    toAdd,
        to_delete: toDelete
      }, function () {
        saveBtn.textContent = 'Saved \u2713';
        saveBtn.classList.add('va-btn--saved');
        loadLinks(selectedEmail());
        setTimeout(function () {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save';
          saveBtn.classList.remove('va-btn--saved');
        }, 2000);
      }, function (err) {
        saveBtn.disabled = false; saveBtn.textContent = 'Save';
        if (errEl) { errEl.textContent = err.message; errEl.hidden = false; }
      });
    }

    function resetToFullAccess() {
      if (teamState.isFullAccess) return; // already full access
      vaConfirm({ msg: 'Remove all location restrictions and restore full access?', okLabel: 'Reset', danger: true }).then(function (ok) {
        if (!ok) return;
        _resetToFullAccess();
      });
    }
    function _resetToFullAccess() {
      var toDelete = teamState.links.map(function (l) { return l.systemId; });
      if (!toDelete.length) return;
      var auth = window.__vaAuth || {};
      resetBtn.disabled = true; resetBtn.textContent = 'Resetting\u2026';
      if (errEl) errEl.hidden = true;
      proxy({
        action: 'user-perm-save',
        customer_email: selectedEmail(),
        to_add:    [],
        to_delete: toDelete
      }, function () {
        resetBtn.disabled = false; resetBtn.textContent = 'Reset to full access';
        loadLinks(selectedEmail());
      }, function (err) {
        resetBtn.disabled = false; resetBtn.textContent = 'Reset to full access';
        if (errEl) { errEl.textContent = err.message; errEl.hidden = false; }
      });
    }

    if (userSelectEl) userSelectEl.addEventListener('change', function () { loadLinks(userSelectEl.value); });
    if (saveBtn)  saveBtn.addEventListener('click', save);
    if (resetBtn) resetBtn.addEventListener('click', resetToFullAccess);
    if (searchEl) searchEl.addEventListener('input', applySearch);
    if (searchClear) searchClear.addEventListener('click', function () { if (searchEl) { searchEl.value = ''; searchEl.focus(); } applySearch(); });
    if (selectAllBtn) selectAllBtn.addEventListener('click', function () {
      var items = Array.from(listEl.querySelectorAll('.va-perm-item')).filter(function (el) { return el.style.display !== 'none'; });
      var allChecked = items.every(function (el) { return el.querySelector('input[type=checkbox]').checked; });
      items.forEach(function (el) { el.querySelector('input[type=checkbox]').checked = !allChecked; });
      updateSelectAll();
    });
    listEl.addEventListener('change', function (e) { if (e.target.matches('input[type=checkbox]')) updateSelectAll(); });

    new MutationObserver(function () {
      if (teamTab.classList.contains('va-tab--active') && !teamState.loaded) load();
    }).observe(teamTab, { attributes: true, attributeFilter: ['class'] });
    if (teamTab.classList.contains('va-tab--active')) load();
  }());

})();
