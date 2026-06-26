// @ts-nocheck




(function() {

document.addEventListener("DOMContentLoaded", function()
{
	var shop = Shopify.shop.split(".")[0];
	const cellw = 120;

	class Distribution extends HTMLElement {
		constructor()
		{
			super();
			this.cart = {};
			this.addresses = [];
			this.groupedItems = [];
			this.updateTimeout = null;
			this.moneyFormat = '';
			this.customerId = '';
			this.b2bEntity = null;
			this.marketHandle = '';
			this.groupProducts = this.dataset.groupProducts;
			this._w0 = 0;      // cached sticky-left width; avoids re-measuring in auto-layout
			this._headMaxH = 0; // tallest header height seen; prevents shrink during filter

			//disable any parent node transform otherwise the popup dlg will be distorted.
			let node = this.parentNode;
			while (node != document.body)
			{
				let style = getComputedStyle(node);
				if (style.animationName != "none" || style.transform != "none")
				{
					node.style.animation = "none";
					node.style.transform = "none";
					node.style.opacity = "1";
					node.style.visibility = "initial";
				}
				node = node.parentNode;
			}
		}
		async reloadTable()
		{
			const loadingOverlay = this.querySelector('.cart-loading-overlay');
			if (loadingOverlay) loadingOverlay.classList.add('active');
			const nextBtn = this.querySelector('.cart-sum .table-next');
			if (nextBtn) nextBtn.setAttribute('disabled', '');
			this.moneyFormat = JSON.parse(this.querySelector("[data-money-format]").textContent);
			let cid = this.querySelector("[data-customer-id]").textContent.trim();
			if (cid == "")
				this.customerId = null;
			else
				this.customerId = JSON.parse(cid);

			const b2bRaw = this.querySelector('[data-b2b-entity]');
			if (b2bRaw) this.b2bEntity = JSON.parse(b2bRaw.textContent.trim());

			this._addressLoadFailed = false;
			if (this.customerId != null)
			{
				//load ship-to addresses from ERP proxy.
				const auth = window.__cartDistributionAuth;
				if (auth) {
					const [addrResult, customerInfo] = await Promise.all([
						fetch(auth.proxy, {
							method: "POST", headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop, action: "address-list", include_children: true })
						}).then(r => r.ok ? r.json() : null).catch(() => null),
						window.__vaCustomerInfo
					]);
					if (addrResult?.ok && addrResult.addresses?.length > 0) {
						this.parentCustomerNo = customerInfo?.parentCustomerNo || addrResult.erpNo || '';
						this.addresses = addrResult.addresses.map(a => ({
							id:           a.code,
							bcSystemId:   a.systemId    || '',
							bcCustomerNo: a.customerNo  || addrResult.erpNo || '',
							bcShipToCode: a.code        || '',
							salesForceId: a.salesForceId || '',
							name:         a.name        || '',
							contact:      a.contact     || '',
							addr:         [a.address, a.address2, a.city, a.county, a.postCode].filter(Boolean).join(", "),
							address1:     a.address           || '',
							address2:     a.address2          || '',
							city:         a.city              || '',
							state:        a.county            || '',
							zip:          a.postCode          || '',
							country:      a.countryRegionCode || '',
							phone:        a.phoneNo           || '',
						}));
					} else {
						this._addressLoadFailed = true;
					}
					this.marketHandle = ((customerInfo?.shopifyMarketHandle) || '').toUpperCase();
				}
			}

			let cartForRender = null;
			// Append additional addresses stored in cart attributes (_extra_addresses)
			try {
				const cartRes = await fetch('/cart.js');
				if (cartRes.ok) {
					const cartData = await cartRes.json();
					const extra = JSON.parse(cartData.attributes?._extra_addresses || '[]');
					if (extra.length > 0) {
						const presetAddrs = new Set(this.addresses.map((a) => (a.addr || '').toLowerCase().replace(/\s+/g, '')));
						this.addresses.push(...extra.filter((a) => !presetAddrs.has((a.addr || '').toLowerCase().replace(/\s+/g, ''))).map((a) => {
							const parts = (a.addr || '').split(',').map((s) => s.trim()).filter(Boolean);
							const stateZip = (parts[2] || '').split(/\s+/).filter(Boolean);
							return {
								id:       a.id,
								name:     a.name      || '',
								addr:     a.addr      || '',
								address1: parts[0]    || '',
								address2: '',
								city:     parts[1]    || '',
								state:    stateZip[0] || '',
								zip:      stateZip[1] || '',
								country:  parts[3]    || 'US',
								phone:    a.phone     || ''
							};
						}));
					}
					if (cartData.items.length > 0) cartForRender = cartData;
				}
			} catch (_) {}

			this.tableHead1.querySelectorAll("th:not(.sticky-left)").forEach(item => item.remove());
			this.tableFoot1.querySelectorAll("td:not(.sticky-left)").forEach(item => item.remove());
			for (let i = 0; i < this.addresses.length; i ++)
			{
				const th = document.createElement("th");
				th.className = "cart-distribution__address-header";
				th.setAttribute("data-address-id", this.addresses[i].id);
				th.style.width = cellw + 'px';
				th.innerHTML = `<div class="cart-distribution__address-name">${ this.addresses[i].bcShipToCode ? `<span class="cart-distribution__address-code">${ this.addresses[i].bcShipToCode }</span>` : '' }${ this.addresses[i].name },<br>${ this.addresses[i].addr }</div>`;
				this.tableHead1.querySelector("tr").appendChild(th);

				const td = document.createElement("td");
				td.style.width = cellw + 'px';
				td.innerHTML = `<span class="cart-distribution__address-total" data-address-id="${ this.addresses[i].id }">0</span>`;
				this.tableFoot1.querySelector("tr").appendChild(td);
			}
			// Permanent filler cells — always in the DOM, visibility toggled via display style
			const fillerTh = document.createElement("th");
			fillerTh.className = 'addr-filler-col';
			this.tableHead1.querySelector("tr").appendChild(fillerTh);
			const fillerTd = document.createElement("td");
			fillerTd.className = 'addr-filler-col';
			this.tableFoot1.querySelector("tr").appendChild(fillerTd);

			if (cartForRender) await this.renderCartItems(cartForRender);
			else await this.onCartUpdate();
			this._headMaxH = 0;
			this.tableHead1.querySelector("table").style.minHeight = '';
			this.syncCartWidth();
			if (loadingOverlay) loadingOverlay.classList.remove('active');
			if (this.marketHandle === 'CRICKET-WIRELESS') {
				this.querySelector('.ship-sum').classList.add('no-checkout');
				this.querySelectorAll('.sticky-sum').forEach(function(el) { el.classList.add('no-checkout'); });
			}
			document.dispatchEvent(new CustomEvent('multiship:ready', { detail: { addressCount: this.addresses.length } }));
			// [warmup ping disabled — no cold start on Azure]
			// if (window.__cartDistributionAuth?.customer_id) {
			// 	const auth = window.__cartDistributionAuth;
			// 	fetch(auth.proxy, {
			// 		method: 'POST',
			// 		headers: { 'Content-Type': 'application/json' },
			// 		body: JSON.stringify({ customer_id: auth.customer_id, ts: auth.ts, token: auth.token, shop: Shopify.shop, action: 'ping' })
			// 	}).catch(() => {});
			// }
		}
		connectedCallback()
		{
			this.emptySVG = document.querySelector("#icon-placeholder")?.innerHTML || '';
			this.discountSvg = document.querySelector("#icon-discount")?.innerHTML || '';
			this.resizeBar = this.querySelector(".resize-handle");
			this.tableHead1 = this.querySelector(".cart-distribution-wrapper .cart-distribution__table-head");
			this.tableBody1 = this.querySelector(".cart-distribution-wrapper .cart-distribution__table-body");
			this.tableFoot1 = this.querySelector(".cart-distribution-wrapper .cart-distribution__table-foot");
			this.tableHead2 = this.querySelector(".cart-distribution-carrier .cart-distribution__table-head");
			this.tableBody2 = this.querySelector(".cart-distribution-carrier .cart-distribution__table-body");
			this.tableFoot2 = this.querySelector(".cart-distribution-carrier .cart-distribution__table-foot");
			this.resizeStyle = document.querySelector('.resize-style');
			this.prevButton = this.querySelector('.table-slide-prev');
			this.nextButton = this.querySelector('.table-slide-next');
			this.slideBtns = this.querySelector('.table-slide-ctrls');
			this.currentSlide = 0;

			this._onCartUpdated = async (e) => this.onCartUpdate(e);
			document.addEventListener('cart:update', this._onCartUpdated);
			this.tableHead1.addEventListener('scroll', () => {
				this.tableBody1.scrollLeft = this.tableHead1.scrollLeft;
				this.tableFoot1.scrollLeft = this.tableHead1.scrollLeft;
				this.currentSlide = Math.ceil(this.tableBody1.scrollLeft / cellw);
				this.prevButton.setAttribute("disabled", this.tableBody1.scrollLeft === 0);
				this.nextButton.setAttribute("disabled", this.tableBody1.scrollWidth - this.tableBody1.scrollLeft - 2 < this.tableBody1.clientWidth);
			});
			this.tableFoot1.addEventListener('scroll', () => {
				this.tableHead1.scrollLeft = this.tableFoot1.scrollLeft;
				this.tableBody1.scrollLeft = this.tableFoot1.scrollLeft;
				this.currentSlide = Math.ceil(this.tableBody1.scrollLeft / cellw);
				this.prevButton.setAttribute("disabled", this.tableBody1.scrollLeft === 0);
				this.nextButton.setAttribute("disabled", this.tableBody1.scrollWidth - this.tableBody1.scrollLeft - 2 < this.tableBody1.clientWidth);
			});
			this.prevButton.addEventListener('click', () => this.prevSlide());
			this.nextButton.addEventListener('click', () => this.nextSlide());
			const addrSearch = this.querySelector('.addr-search-input');
			if (addrSearch) addrSearch.addEventListener('input', () => this.filterAddresses(addrSearch.value));
			this.resizeBar.addEventListener('mousedown', this.onResizeStart.bind(this));
			this.querySelector(".ship-sum .table-prev").addEventListener('click', (e) => {
			    this.querySelector(".cart-distribution-carrier").style.display = "none";
			    this.querySelector(".cart-distribution-wrapper").style.display = "block";
				this.syncCartWidth();
			    this.querySelector(".cart-sum").style.display = "flex";
			    this.querySelector(".ship-sum").style.display = "none";
			});
			this.querySelector(".cart-sum .table-next").addEventListener('click', async (e) => {
				if (e.currentTarget.hasAttribute('disabled')) return;
				await this.saveCart(null, false);
				const shortages = this.detectInventoryShortages();
				if (shortages.length > 0) {
					this.showInventoryShortageDialog(shortages);
					return;
				}
				this.querySelector(".cart-distribution-carrier").style.display = "block";
				this.querySelector(".cart-distribution-wrapper").style.display = "none";
				this.renderAddrBody();
				this.updateAddrCalc();
				this.querySelector(".cart-sum").style.display = "none";
				this.querySelector(".ship-sum").style.display = "flex";
			});
			this.querySelector(".cart-sum .table-prev").addEventListener('click', (e) => {window.location.href = "/"});
			this.querySelector(".ship-sum .table-next").addEventListener('click', async (e) => {
				if (e.currentTarget.hasAttribute('disabled')) return;
				const errorAddresses = this.getErrorAddresses();
				if (errorAddresses.length > 0)
					this.showCheckoutErrorDialog(errorAddresses);
				else
					this.saveCart(null, true);
			});
			this.querySelector(".ship-sum .table-export")?.addEventListener('click', () => this.exportXLS());

			// Import CSV
			const importBtn  = this.querySelector('.table-import');
			const importFile = this.querySelector('.table-import-file');
			if (importBtn && importFile) {
				importBtn.addEventListener('click', () => importFile.click());
				importFile.addEventListener('change', async (e) => {
					const file = e.target.files[0];
					e.target.value = '';
					if (file) await this.importFromCSV(file);
				});
			}
			this.querySelector('.table-import-modal-backdrop')?.addEventListener('click', () => this.closeImportModal());
			this.querySelector('.table-import-modal-close')?.addEventListener('click',    () => this.closeImportModal());

			requestAnimationFrame(() => this.syncHeaderOffset());
			if (document.readyState === 'complete') {
				this.reloadTable();
				this.syncHeaderOffset();
			} else {
				window.addEventListener('load', () => { this.reloadTable(); this.syncHeaderOffset(); });
			}
			this.setupAddrEvents();
			this._onResize = () => { this.syncCartWidth(); this.syncHeaderOffset(); };
			window.addEventListener('resize', this._onResize); //in case the font size changes.
		}
		async importFromCSV(file) {
			let rows2d;
			if (file.name.toLowerCase().endsWith('.xlsx')) {
				if (!window.XLSX) return this.showImportResult(0, ['Excel support not loaded. Please refresh and try again.']);
				const ab = await file.arrayBuffer();
				const wb = XLSX.read(ab);
				const ws = wb.Sheets[wb.SheetNames[0]];
				rows2d = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
					.map(r => r.map(c => String(c ?? '').trim()));
			} else {
				const text = await file.text();
				const lines = text.split(/\r?\n/).filter(l => l.trim());
				const sep = lines[0].includes('	') ? '	' : ',';
				const parseRow = l => {
					const fields = []; let cur = '', inQ = false;
					for (let i = 0; i < l.length; i++) {
						const ch = l[i];
						if (ch === '"'  && !inQ)        { inQ = true; }
						else if (ch === '"'  && inQ && l[i+1] === '"'){ cur += '"'  ; i++; }
						else if (ch === '"'  && inQ)        { inQ = false; }
						else if (ch === sep && !inQ) { fields.push(cur.trim()); cur = ''; }
						else { cur += ch; }
					}
					fields.push(cur.trim());
					return fields;
				};
				rows2d = lines.map(parseRow);
			}

			if (rows2d.length < 2) return this.showImportResult(0, ['File is empty or has no data rows.']);

			const headers = rows2d[0].map(h => h.toLowerCase());

			// Find required columns by keyword
			const sfidCol = headers.findIndex(h => h.includes('sfid'));
			const skuCol  = headers.findIndex(h => h.includes('sku'));
			const qtyCol  = headers.findIndex(h => h.includes('qty') || h.includes('quantity'));

			const missing = [sfidCol < 0 && 'SFID', skuCol < 0 && 'SKU', qtyCol < 0 && 'QTY'].filter(Boolean);
			if (missing.length) return this.showImportResult(0, [`Missing required column(s): ${missing.join(', ')}`]);

			// Parse data rows
			const rows = [];
			for (let i = 1; i < rows2d.length; i++) {
				const cols = rows2d[i];
				const sfid = (cols[sfidCol] || '').trim();
				const sku  = (cols[skuCol]  || '').trim();
				const qty  = parseInt(cols[qtyCol]) || 0;
				if (!sfid && !sku) continue;
				rows.push({ sfid, sku, qty, line: i + 1 });
			}

			// Build O(1) lookup maps to handle large import files efficiently
			const sfidByKey = new Map();
			for (const a of this.addresses) {
				if (a.salesForceId && !sfidByKey.has(a.salesForceId)) sfidByKey.set(a.salesForceId, a);
				if (!sfidByKey.has(a.id))                              sfidByKey.set(a.id, a);
				if (a.bcShipToCode && !sfidByKey.has(a.bcShipToCode)) sfidByKey.set(a.bcShipToCode, a);
				if (a.bcSystemId   && !sfidByKey.has(a.bcSystemId))   sfidByKey.set(a.bcSystemId, a);
				if (!sfidByKey.has(a.name.toLowerCase()))               sfidByKey.set(a.name.toLowerCase(), a);
			}
			const skuMap = new Map();
			for (const g of this.groupedItems)
				for (const item of g.items)
					if (item.sku) skuMap.set(item.sku.toLowerCase(), item);

			// errors: { line: number|null, msg: string }
			const errors  = [];
			const matched = [];

			for (const row of rows) {
				const sfidKey = row.sfid.toLowerCase();
				const addr = sfidByKey.get(row.sfid) || sfidByKey.get(sfidKey);
				if (!addr) { errors.push({ line: row.line, msg: `SFID "${row.sfid}" not found` }); continue; }

				const variant = skuMap.get(row.sku.toLowerCase());
				if (!variant) { errors.push({ line: row.line, msg: `SKU "${row.sku}" is not in the cart` }); continue; }

				matched.push({ ...row, addr, variant });
			}

			// Server-side availability check
			const variantIds = [...new Set(matched.map(m => m.variant.variant_id))];
			if (variantIds.length) {
				try {
					const auth = window.__cartDistributionAuth;
					const proxyBase = auth?.proxy || '/valor/proxy';
					const shop = Shopify.shop.split('.')[0];
					const res  = await fetch(`${proxyBase}?action=variants&shop=${shop}&ids=${variantIds.join(',')}`);
					const data = await res.json();
					const invMap = {};
					data.forEach(v => { invMap[String(v.id)] = v.available; });
					matched.forEach(m => {
						const avail = invMap[String(m.variant.variant_id)];
						if (avail != null && m.qty > avail)
							errors.push({ line: m.line, msg: `SKU "${m.sku}" only has ${avail} available (requested ${m.qty})` });
					});
				} catch(e) {
					errors.push({ line: null, msg: 'Warning: inventory check failed — quantities were not validated against stock.' });
				}
			}

			const errLines = new Set(errors.filter(e => e.line !== null).map(e => e.line));
			const valid = matched.filter(m => !errLines.has(m.line));

			if (errors.length) {
				// Deduplicate by message text and collect row numbers
				const grouped = new Map();
				for (const e of errors) {
					if (!grouped.has(e.msg)) grouped.set(e.msg, []);
					if (e.line !== null) grouped.get(e.msg).push(e.line);
				}
				const displayErrors = [...grouped.entries()].map(([msg, lines]) => {
					if (!lines.length) return msg;
					return lines.length > 1
						? `${msg} (rows ${lines.join(', ')})`
						: `${msg} (row ${lines[0]})`;
				});
				const proceed = await this.showImportConfirm(displayErrors, valid.length);
				if (!proceed) return;
			}

			// Build input DOM map once — avoids 3000 individual querySelector calls
			const inputMap = new Map();
			this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input').forEach(inp => {
				inputMap.set(`${inp.dataset.variantId}:${inp.dataset.addressId}`, inp);
			});

			const fillErrors = [];
			let filled = 0;
			for (const m of valid) {
				const input = inputMap.get(`${m.variant.variant_id}:${m.addr.id}`);
				if (input) {
					// Clamp to max; skip per-input events — recalc runs once after the loop
					const max = parseInt(input.getAttribute('max'));
					input.value = (!isNaN(max) && m.qty > max) ? max : Math.max(0, m.qty);
					filled++;
				} else {
					fillErrors.push(`No cell found for SKU "${m.sku}" / SFID "${m.sfid}"`);
				}
			}

			// Single recalc + debounced save after all inputs are set
			if (filled > 0) {
				this.updateCartCalc();
				clearTimeout(this.updateTimeout);
				this.updateTimeout = setTimeout(() => { this.saveCart(null, false); }, 2000);
			}

			this.showImportResult(filled, fillErrors);
		}
		escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
		showImportConfirm(displayErrors, validCount) {
			return new Promise(resolve => {
				const modal    = this.querySelector('.table-import-modal');
				const title    = this.querySelector('.table-import-modal-title');
				const body     = this.querySelector('.table-import-modal-body');
				const closeBtn = this.querySelector('.table-import-modal-close');
				const backdrop = this.querySelector('.table-import-modal-backdrop');

				const n = displayErrors.length;
				title.textContent = n === 1 ? '1 Issue Found' : `${n} Issues Found`;
				body.innerHTML = `<div class="table-import-err-head">${n} issue${n > 1 ? 's' : ''} — affected rows will be skipped:</div>`
					+ displayErrors.map(e => `<div class="table-import-err-item">${this.escHtml(e)}</div>`).join('');

				closeBtn.style.display = 'none';
				const actions = document.createElement('div');
				actions.className = 'table-import-confirm-actions';
				actions.innerHTML =
					(validCount > 0
						? `<button class="tb-button table-import-confirm-proceed">Proceed with ${validCount} row${validCount > 1 ? 's' : ''}</button>`
						: `<button class="tb-button table-import-confirm-proceed">Proceed</button>`)
					+ `<button class="tb-button table-import-confirm-cancel">Cancel</button>`;
				closeBtn.parentNode.appendChild(actions);
				modal.style.display = 'flex';

				let resolved = false;
				const cleanup = (result) => {
					if (resolved) return;
					resolved = true;
					backdrop.removeEventListener('click', onBackdrop);
					actions.remove();
					closeBtn.style.display = '';
					title.textContent = 'Import Result';
					modal.style.display = 'none';
					resolve(result);
				};
				const onBackdrop = () => cleanup(false);
				backdrop.addEventListener('click', onBackdrop);
				actions.querySelector('.table-import-confirm-cancel')?.addEventListener('click', () => cleanup(false));
				actions.querySelector('.table-import-confirm-proceed')?.addEventListener('click', () => cleanup(true));
			});
		}
		showImportResult(filled, errors) {
			const modal = this.querySelector('.table-import-modal');
			const body  = this.querySelector('.table-import-modal-body');
			if (!modal || !body) return;
			let html = filled > 0
				? `<div class="table-import-ok">\u2713 ${filled} row${filled > 1 ? 's' : ''} imported successfully.</div>`
				: `<div class="table-import-ok" style="color:#777">No rows were imported.</div>`;
			if (errors.length) {
				html += `<div class="table-import-err-head">${errors.length} issue${errors.length > 1 ? 's' : ''}:</div>`;
				html += errors.map(e => `<div class="table-import-err-item">${this.escHtml(e)}</div>`).join('');
			}
			body.innerHTML = html;
			modal.style.display = 'flex';
		}
		closeImportModal() {
			const modal = this.querySelector('.table-import-modal');
			if (modal) modal.style.display = 'none';
		}

		disconnectedCallback()
		{
			document.removeEventListener('cart:update', this._onCartUpdated);
			window.removeEventListener('resize', this._onResize);
		}
		///////////////////////////////////////////////////////////////
		getAddressItemImages(addressId)
		{
			const images = [];
			const seen = new Set();
			this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-address-id="${addressId}"]`).forEach(input => {
				if ((parseInt(input.value) || 0) === 0) return;
				const itemKey = input.dataset.itemKey;
				if (seen.has(itemKey)) return;
				seen.add(itemKey);
				const group = this.groupedItems.find(g => String(g.id) === String(input.dataset.productId));
				const item  = group?.items.find(i => i.key === itemKey);
				if (item?.image) images.push({ src: item.image + (item.image.includes('?') ? '&' : '?') + 'width=80', alt: item.title || '' });
			});
			return images;
		}
		async renderAddrBody()
		{
			const totals = this.getAddressTotals();
			let html = '';
			for (const address of this.addresses)
			{
				const t      = totals[address.id] || { qty: 0, subtotal: 0, weight: 0 };
				if (t.qty === 0) continue;
				const images = this.getAddressItemImages(address.id);
				const thumbs = images.map(img => `<img src="${img.src}" alt="${img.alt}" class="carrier-thumb">`).join('');
				const itemsCell = images.length > 0
					? `<div class="carrier-items-inner">
						<button class="carrier-items-btn carrier-items-prev" disabled>&#8249;</button>
						<div class="carrier-items-wrap"><div class="carrier-items-track">${thumbs}</div></div>
						<button class="carrier-items-btn carrier-items-next" ${images.length <= 2 ? 'disabled' : ''}>&#8250;</button>
					</div>`
					: '&mdash;';
				html += `
				<tr class="cart-distribution__address-row" data-address-id="${address.id}">
					<td class="carrier-address">
						<strong>${address.bcShipToCode ? `[${address.bcShipToCode}] ` : ''}${address.name}</strong><br><small>${address.addr}</small>
					</td>
					<td class="carrier-items">${itemsCell}</td>
					<td class="carrier-qty">${t.qty}</td>
					<td class="carrier-subtotal">$${t.subtotal.toFixed(2)}</td>
					<td class="carrier-weight">${t.weight.toFixed(2)}</td>
					<td class="carrier-method">${t.qty > 0 ? '<span class="carrier-loading">Loading\u2026</span>' : '&mdash;'}</td>
					<td class="carrier-cost">&mdash;</td>
					<td class="carrier-total">$${t.subtotal.toFixed(2)}</td>
				</tr>`;
			}
			this.tableBody2.querySelector('tbody').innerHTML = html;
			// After paint: sync address column width to header/footer, and disable overflow next buttons
			requestAnimationFrame(() => {
				const bodyAddrCell = this.tableBody2.querySelector('.carrier-address');
				if (bodyAddrCell) {
					const w = bodyAddrCell.getBoundingClientRect().width;
					[this.tableHead2, this.tableFoot2].forEach(t =>
						t.querySelectorAll('.carrier-address').forEach(el => el.style.minWidth = w + 'px')
					);
				}
				this.tableBody2.querySelectorAll('.carrier-items-inner').forEach(inner => {
					const wrap  = inner.querySelector('.carrier-items-wrap');
					const track = inner.querySelector('.carrier-items-track');
					inner.querySelector('.carrier-items-next').disabled = track.scrollWidth <= wrap.clientWidth;
				});
			});

			// Fetch carrier rates in batches of 20 (parallel within batch, delay between batches)
			const checkoutBtn = this.querySelector('.ship-sum .table-next');
			if (checkoutBtn) checkoutBtn.setAttribute('disabled', '');
			(async () => {
				const active = this.addresses.filter(a => (totals[a.id]?.qty || 0) > 0);
				const batchSize = 20;
				for (let i = 0; i < active.length; i += batchSize) {
					if (i > 0) await new Promise(r => setTimeout(r, 500));
					const batch = active.slice(i, i + batchSize);
					await Promise.all(batch.map(a => this.fetchCarrierRates(a, totals[a.id])));
				}
				if (checkoutBtn) checkoutBtn.removeAttribute('disabled');
			})();
		}
		getAddressTotals()
		{
			const totals = {};
			for (const address of this.addresses)
				totals[address.id] = { qty: 0, subtotal: 0, weight: 0 };

			this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input[data-address-id]').forEach(input =>
			{
				const qty = parseInt(input.value) || 0;
				if (qty === 0) return;
				const addressId = input.dataset.addressId;
				if (!totals[addressId]) return;
				totals[addressId].qty      += qty;
				totals[addressId].subtotal += qty * (parseInt(input.dataset.itemPrice) || 0) / 100;
				totals[addressId].weight   += qty * (parseInt(input.dataset.itemGrams) || 0) / 453.592;
			});
			return totals;
		}
		async fetchCarrierRates(address, t)
		{
			const auth  = window.__cartDistributionAuth;
			const row   = this.tableBody2.querySelector(`tr[data-address-id="${address.id}"]`);
			if (!auth || !row) return;

			// Skip addresses missing required SS API fields
			if (!address.address1 || !address.city || !address.state || !address.zip) {
				row.querySelector('.carrier-method').textContent = 'Address incomplete';
				return;
			}

			// Check session cache (keyed by address + subtotal + weight)
			const cacheKey = `carrier_${address.id}_${Math.round(t.subtotal * 100)}_${Math.round(t.weight * 1000)}`;
			let data = null;
			try { const c = sessionStorage.getItem(cacheKey); if (c) data = JSON.parse(c); } catch (_) {}

			if (!data)
			{
				const reqBody = {
					customer_id: auth.customer_id,
					ts:          auth.ts,
					token:       auth.token,
					shop:        Shopify.shop,
					action:      'checkout-options',
					subtotal:    t.subtotal,
					weight:      t.weight || 0.01,
					ship_to: {
						name:     address.name,
						address1: address.address1,
						address2: address.address2,
						city:     address.city,
						state:    address.state,
						zip:      address.zip,
						country:  address.country,
						phone:    address.phone,
					}
				};
				const doFetch = async () => {
					const response = await fetch(auth.proxy, {
						method:  'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(reqBody)
					});
					const result = await response.json();
					if (!result.ok) throw new Error(result.error || 'API error');
					return result.data || {};
				};
				try
				{
					try { data = await doFetch(); }
					catch (_) { data = await doFetch(); } // retry once
					try { sessionStorage.setItem(cacheKey, JSON.stringify(data)); } catch (_) {}
				}
				catch (err)
				{
					const selectCell = row.querySelector('.carrier-method');
					if (selectCell) {
						let msg = err.message.replace(/^HTTP \d+ - /, '');
						msg = msg.replace(/^[^:]+:\s*/, '').replace(/\s*\([^)]+\)\s*$/, '').trim();
						selectCell.textContent = msg;
					}
					console.error('[fetchCarrierRates]', err);
					return;
				}
			}

			// Render rates from data (fresh or cached)
			const rates      = data.rateOptions || [];
			const selectCell = row.querySelector('.carrier-method');
			const hasFree    = data.freeShippingPolicyActive && data.subtotalQualifiesForFreeShipping;
			const validRates = rates.filter(r => {
			if (r.errorMessages && r.errorMessages.length > 0) return false;
			const name = (r.serviceDisplayName || ((r.carrierFriendlyName || '') + ' ' + (r.serviceCode || ''))).toLowerCase();
			return !name.includes('pickup');
		});

			if (!hasFree && validRates.length === 0)
			{
				selectCell.textContent = 'No rates available';
				return;
			}

			const select = document.createElement('select');
			select.className         = 'carrier-select-input';
			select.dataset.addressId = address.id;
			select.dataset.subtotal  = t.subtotal;

			/*if (hasFree)
			{
				const opt = document.createElement('option');
				opt.value       = '0';
				opt.textContent = 'Free Shipping ($0.00)';
				select.appendChild(opt);
			}*/
			for (const rate of validRates)
			{
				const price = rate.buyerFreightChargeLCY ?? rate.amount ?? 0;
				const name  = rate.serviceDisplayName || (rate.carrierFriendlyName + ' ' + rate.serviceCode).trim();
				const opt   = document.createElement('option');
				opt.value      = price;
				opt.dataset.erp = JSON.stringify({
					agent:    rate.bcShippingAgentCode        ?? null,
					service:  rate.bcShippingAgentServiceCode ?? null,
					buyer:    rate.buyerFreightChargeLCY      ?? null,
					estimate: rate.estimatedFreightLCY        ?? null,
					quote:    rate.quotedFreightChargeLCY     ?? null,
					free:     rate.isFreeShipping             ?? false,
					fixed:    rate.isFixedFreightCharge       ?? false,
				});
				if (price == 0)
					opt.textContent = `${name} - Free Shipping`;
				else
					opt.textContent = `${name} - $${Number(price).toFixed(2)}`;
				select.appendChild(opt);
			}

			selectCell.innerHTML = '';
			selectCell.appendChild(select);
			this.updateRowTotals(row);
			this.updateAddrCalc();
		}
		updateRowTotals(row)
		{
			const select   = row.querySelector('.carrier-select-input');
			if (!select) return;
			const subtotal = parseFloat(select.dataset.subtotal) || 0;
			const shipping = parseFloat(select.value) || 0;
			row.querySelector('.carrier-cost').textContent  = `$${shipping.toFixed(2)}`;
			row.querySelector('.carrier-total').textContent = `$${(subtotal + shipping).toFixed(2)}`;
		}
		setupAddrEvents()
		{
			this.tableHead2.addEventListener('scroll', () => {
				this.tableBody2.scrollLeft = this.tableHead2.scrollLeft;
				this.tableFoot2.scrollLeft = this.tableHead2.scrollLeft;
			});
			this.tableBody2.addEventListener('scroll', () => {
				this.tableHead2.scrollLeft = this.tableBody2.scrollLeft;
				this.tableFoot2.scrollLeft = this.tableBody2.scrollLeft;
			});
			this.tableFoot2.addEventListener('scroll', () => {
				this.tableHead2.scrollLeft = this.tableFoot2.scrollLeft;
				this.tableBody2.scrollLeft = this.tableFoot2.scrollLeft;
			});
			this.tableBody2.addEventListener('change', (e) =>
			{
				if (e.target.classList.contains('carrier-select-input'))
				{
					this.updateRowTotals(e.target.closest('tr'));
					this.updateAddrCalc();
				}
			});
			this.tableBody2.addEventListener('click', (e) =>
			{
				// Scroll thumbnail strip
				const btn = e.target.closest('.carrier-items-btn');
				if (btn)
				{
					const inner = btn.closest('.carrier-items-inner');
					const wrap  = inner.querySelector('.carrier-items-wrap');
					const track = inner.querySelector('.carrier-items-track');
					const thumbW    = 36;
					const maxScroll = Math.max(0, track.scrollWidth - wrap.clientWidth);
					let offset = parseFloat(track.dataset.offset || '0');
					offset = btn.classList.contains('carrier-items-prev')
						? Math.min(0, offset + thumbW * 2)
						: Math.max(-maxScroll, offset - thumbW * 2);
					track.dataset.offset = offset;
					track.style.transform = `translateX(${offset}px)`;
					inner.querySelector('.carrier-items-prev').disabled = offset >= 0;
					inner.querySelector('.carrier-items-next').disabled = offset <= -maxScroll;
					return;
				}
				// Zoom thumbnail image
				if (e.target.classList.contains('carrier-thumb'))
					this.showImagePopup(e.target);
			});
		}
		updateAddrCalc()
		{
			let totalQty      = 0;
			let totalSubtotal = 0;
			let totalWeight   = 0;
			let totalShipping = 0;

			this.tableBody2.querySelectorAll('.cart-distribution__address-row').forEach(row =>
			{
				totalQty      += parseInt(row.querySelector('.carrier-qty')?.textContent)                           || 0;
				totalSubtotal += parseFloat(row.querySelector('.carrier-subtotal')?.textContent?.replace('$', '')) || 0;
				totalWeight   += parseFloat(row.querySelector('.carrier-weight')?.textContent)                     || 0;
				const sel      = row.querySelector('.carrier-select-input');
				totalShipping += sel ? (parseFloat(sel.value) || 0) : 0;
			});

			const foot = this.tableFoot2.querySelector('tr');
			if (!foot) return;
			const c = foot.cells;
			if (c.length >= 8)
			{
				c[2].textContent = totalQty;
				c[3].textContent = `$${totalSubtotal.toFixed(2)}`;
				c[4].textContent = `${totalWeight.toFixed(2)} lbs`;
				c[6].textContent = `$${totalShipping.toFixed(2)}`;
				c[7].textContent = `$${(totalSubtotal + totalShipping).toFixed(2)}`;
			}

			const shipSumEl = this.querySelector('.ship-sum .cart-sum-total');
			if (shipSumEl) shipSumEl.textContent = `$${(totalSubtotal + totalShipping).toFixed(2)}`;
		}
		syncHeaderOffset()
		{
			let offset = 0;
			document.querySelectorAll('sticky-header, header, [class*="header"], [id*="header"]').forEach(el => {
				if (this.contains(el)) return;
				const pos = getComputedStyle(el).position;
				if (pos === 'sticky' || pos === 'fixed')
					offset = Math.max(offset, el.offsetHeight);
			});
			document.documentElement.style.setProperty('--page-header-height', offset + 'px');
		}
		///////////////////////////////////////////////////////////////
		syncCartWidth()
		{
			// Hide filler before measuring so it doesn't skew cell widths.
			[this.tableHead1, this.tableBody1, this.tableFoot1].forEach(t =>
				t.querySelectorAll('.addr-filler-col').forEach(el => el.style.display = ''));
			// Clear previous minWidth so getBoundingClientRect() reflects natural
			// content widths, not the inflated value from the previous call.
			this.tableHead1.querySelector("table").style.minWidth = '';
			this.tableBody1.querySelector("table").style.minWidth = '';
			this.tableFoot1.querySelector("table").style.minWidth = '';
			let headCells = this.tableHead1.querySelector('tr')?.cells;
			let bodyCells = this.tableBody1.querySelector('tr')?.cells;
			let footCells = this.tableFoot1.querySelector('tr')?.cells;
			if (!headCells)
				return;
			if (bodyCells == null)
				bodyCells = headCells;
			const hasBodyRows = this.tableBody1.querySelector('tr') != null;
			if (hasBodyRows && footCells)
			{
				//reset visible header column widths (skip hidden/filler columns)
				for (let i = 1; i < headCells.length; i ++)
					if (!headCells[i].classList.contains('addr-col--hidden') && !headCells[i].classList.contains('addr-filler-col')) headCells[i].style.width = `${cellw}px`;
				//update using first visible address column's measured width
				let w1 = cellw;
				for (let i = 1; i < headCells.length; i++) {
					if (!headCells[i].classList.contains('addr-col--hidden') && !headCells[i].classList.contains('addr-filler-col')) {
						const mw = Math.round(headCells[i].getBoundingClientRect().width);
						if (mw > 0) w1 = mw;
						break;
					}
				}
				for (let i = 1; i < headCells.length; i ++)
				{
					if (headCells[i].classList.contains('addr-col--hidden') || headCells[i].classList.contains('addr-filler-col')) continue;
					headCells[i].style.width = `${w1}px`;
					bodyCells[i].style.width = `${w1}px`;
					footCells[i].style.width = `${w1}px`;
				}
				// Determine w0 from the resize CSS rule when present, else from the
				// cached first-call measurement. Re-measuring via getBoundingClientRect()
				// after clearing minWidth inflates w0 when few addr cols are visible:
				// table-layout:auto distributes spare container space to sticky-left.
				const resizeMatch = this.resizeStyle?.innerHTML.match(/width:\s*(\d+(?:\.\d+)?)px/);
				let w0;
				if (resizeMatch) {
					w0 = parseFloat(resizeMatch[1]); // always authoritative when resize has been used
				} else if (this._w0 > 0) {
					w0 = this._w0; // stable cached value from first call
				} else {
					w0 = Math.round(bodyCells[0].getBoundingClientRect().width); // first call only
					this._w0 = w0;
				}
				headCells[0].style.width = `${w0}px`;
				bodyCells[0].style.width = `${w0}px`;
				footCells[0].style.width = `${w0}px`;
			}
			const tableWidth = Array.from(headCells).reduce((sum, c) => {
				if (c.classList.contains('addr-col--hidden') || c.classList.contains('addr-filler-col')) return sum;
				return sum + (parseFloat(c.style.width) || Math.round(c.getBoundingClientRect().width) || cellw);
			}, 0);
			this.tableHead1.querySelector("table").style.minWidth = tableWidth + 'px';
			this.tableBody1.querySelector("table").style.minWidth = tableWidth + 'px';
			this.tableFoot1.querySelector("table").style.minWidth = tableWidth + 'px';
			const showFiller = tableWidth < this.tableBody1.clientWidth;
			[this.tableHead1, this.tableBody1, this.tableFoot1].forEach(t =>
				t.querySelectorAll('.addr-filler-col').forEach(el => el.style.display = showFiller ? 'initial' : ''));
			this.resizeBar.style.left = Math.round(headCells[0].getBoundingClientRect().width) + 'px';

			//if (this.tableBody1.clientWidth > headCells[0].clientWidth)
			let w = Math.floor(this.tableBody1.clientWidth - Math.round(headCells[0].getBoundingClientRect().width));
			this.slideBtns.style.width = w + 'px';
			this.slideBtns.style.display = w < 10 ? "none" : "";
			this.visibleSlides = Math.floor((this.tableBody1.clientWidth - this.resizeBar.offsetLeft) / cellw);
			//this.updateSlide();
			this.prevButton.setAttribute("disabled", this.currentSlide === 0);
			this.nextButton.setAttribute("disabled", this.tableBody1.scrollWidth - this.tableBody1.scrollLeft - 2 < this.tableBody1.clientWidth);
			// Pin header table to its tallest state so filtering never shrinks it
			const headTable = this.tableHead1.querySelector("table");
			const headH = headTable.offsetHeight;
			if (headH > (this._headMaxH || 0)) {
				this._headMaxH = headH;
				headTable.style.minHeight = headH + 'px';
			}
		}
		onResizeStart(e)
		{
			this.resizeStart = this.resizeBar.getBoundingClientRect().left - this.tableBody1.getBoundingClientRect().left - e.clientX; //bodyCells.cells[0].getBoundingClientRect().width;
			const onResizeMove = (e) =>
			{
				const neww = this.resizeStart + e.clientX;
				if (neww <= 50)
					return;
				if (neww >= this.tableBody1.getBoundingClientRect().width - 100)
					return;
				this.resizeStyle.innerHTML = `
					.cart-distribution__table .sticky-left {
						width: ${neww}px; 
						max-width: ${neww}px; 
					}`;
				this.syncCartWidth();
			}
			const onResizeStop = (e) =>
			{
				this.syncCartWidth();
				window.removeEventListener('mousemove', onResizeMove);
				window.removeEventListener('mouseup', onResizeStop);
			}
			window.addEventListener('mousemove', onResizeMove);
			window.addEventListener('mouseup', onResizeStop);
		}
		///////////////////////////////////////////////////////////////
		async onCartUpdate(e)
		{
			try {
				const detail = e?.detail;
				// Use cart data already in the event (fired by valor-quick-add after its own _sync),
				// falling back to a fetch only when the event carries no usable cart.
				const cart = (detail?.resource?.items ? detail.resource : null)
					?? await fetch('/cart.js').then(r => { if (!r.ok) throw new Error(`HTTP error status: ${r.status}`); return r.json(); });
				if (cart.items.length === 0)
					return;
				//update the component's data and re-render the table.
				await this.renderCartItems(cart);
				this.syncCartWidth();
			}
			catch (error) {
				console.error('Failed to update cart:', error);
			}
		}
		async renderCartItems(cart)
		{
			this.cart = cart;
			//group line items by products.
			const grouped = {};
			this.cart.items.forEach(item => {
				const productId = item.product_id;
				if (!grouped[productId])
				{
					grouped[productId] = {
						id: productId,
						title: item.product_title,
						image: item.image,
						items: []
					};
				}
				grouped[productId].items.push(item);
			});
			this.groupedItems = Object.values(grouped);

			await this.renderCartBody();
			this.setupCartEvents();

			//load distribution from _lineitems + _order.
			if (this.cart.attributes?._lineitems && this.cart.attributes?._order)
			{
				const lineitems = JSON.parse(this.cart.attributes._lineitems.replace(/&quot;/g, '"') || '{}');
				const order     = JSON.parse(this.cart.attributes._order.replace(/&quot;/g, '"') || '[]');
				if (!Array.isArray(order) || order.length === 0) return;
				for (const entry of order)
				{
					// entry.id was saved as bcSystemId (fallback: address code); resolve to the code used in data-address-id
					const addrMeta  = this.addresses.find(a => (a.bcSystemId && a.bcSystemId === entry.id) || String(a.id) === entry.id);
					const addressId = addrMeta ? String(addrMeta.id) : entry.id;
					const items = entry.items || {};
					for (const variantId in items)
					{
						const hash    = lineitems[variantId];
						if (!hash) continue;
						const itemKey = `${variantId}:${hash}`;
						const input   = this.tableBody1.querySelector(`td > .cart-distribution__quantity-input[data-item-key="${itemKey}"][data-address-id="${addressId}"]`);
						if (input) input.value = items[variantId] ?? 0;
					}
				}
			}
			this.updateCartCalc();
		}
		async renderCartBody()
		{
			let html = '';
			const allIds = this.groupedItems.flatMap(g => g.items.map(i => i.id));
			let allVars = new Map();
			if (allIds.length) {
				try {
					const r = await fetch(window.__vaProxy + "?action=variants&shop=" + shop + "&ids=" + allIds.join(','));
					if (r.ok) {
						const d = await r.json();
						if (Array.isArray(d)) allVars = new Map(d.map(v => [v.id, v]));
					}
				} catch (_) {}
			}
			for (let j = 0; j < this.groupedItems.length; j ++)
			{
				let group = this.groupedItems[j];
				if (this.groupProducts == "true")
					html += `
						<tr class="cart-distribution__group-header" data-product-id="${group.id}">
							<td class="sticky-left">
								<div class="cart-distribution__product-cell">
									<span class="cart-distribution__group-toggle-icon">
										<svg viewBox="0 0 10 6" width="12"><path fill="currentColor" fill-rule="evenodd" d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" clip-rule="evenodd"></path>
										</svg>
									</span>
									<!--div class="cart-distribution__product-image">${group.image ? `<img src="${group.image}" alt="${group.title}" loading="lazy">` : this.emptySVG}</div-->
									<div class="cart-distribution__product-info">
										<div class="cart-distribution__product-title">${group.title}</div>
										<!--div class="cart-distribution__product-total">Total in cart: ${group.items.reduce((s, i) => s + i.quantity, 0)}</div-->
									</div>
								</div>
							</td>
							${this.addresses.map(address => `
								<td class="cart-distribution__group-header-total">
									<span class="cart-distribution__product-address-total" data-product-id="${group.id}" data-address-id="${address.id}"></span>
								</td>
							`).join('')}
							<td class="addr-filler-col"></td>
						</tr>`;
				/*<td colspan="${this.addresses.length}"></td>*/

				const vars = allVars;

				for (let i = 0; i < group.items.length; i ++)
				{
					let item = group.items[i];
					let price = (item.original_price && item.original_price !== item.price ? `<s>$${(item.original_price / 100).toFixed(2)}</s>&nbsp;&nbsp;` : '') + `$${(item.price / 100).toFixed(2)}`;					
					let discount = `<ul class="discounts list-unstyled" role="list" aria-label="discounts">`;
					for (let i = 0; item.discounts && i < item.discounts.length; i ++)
						discount += `<li class="discounts__discount">${this.discountSvg}${item.discounts[i].discount_application.title}</li>`;
					discount += `</ul>`;
					html += `
						<tr class="cart-distribution__variant-row" data-item-key="${item.key}" data-product-id="${group.id}" data-variant-id="${item.variant_id}">
							<td class="sticky-left">
								<div class="cart-distribution__product-cell">
									<div class="cart-distribution__product-image">
										${item.image ? `<img src="${item.image + (item.image.includes('?') ? '&' : '?') + 'width=80'}" alt="${item.title}" loading="lazy" data-product-url="${item.url || ''}">` : this.emptySVG}
									</div>
									<div class="cart-distribution__product-info">
										${this.groupProducts == "true" ? "" : `<div class="distribution-list-item-row distribution-list-item-variant">${group.title}</div>`}
										<div class="distribution-list-item-row distribution-list-item-variant">${item.variant_title !== 'Default Title' ? `${item.variant_title}` : ""}</div>
										${this.dataset.showSku == "false" ? "" : `<div class="distribution-list-item-row distribution-list-item-sku">${item.sku ? `SKU: ${item.sku}` : ""}</div>`}
										<div class="distribution-list-item-row distribution-list-item-coupon">${discount}</div>
										<div class="distribution-list-item-row distribution-list-item-price">${price}<span data-max-inv="${vars?.get(String(item.variant_id))?.inventory ?? 99999}">(0)</span></div>
										<div class="cart-distribution__product-remove" data-item-key="${item.key}">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<line x1="18" y1="6" x2="6" y2="18"></line>
												<line x1="6" y1="6" x2="18" y2="18"></line>
											</svg>
										</div>
										<div class="distribution-list-item-row distribution-list-item-setall">
											<input type="number" min="0" value="0" class="cart-distribution__quantity-input"/>
											<div data-item-key="${item.key}" data-variant-id="${item.variant_id}"><?xml version="1.0" encoding="utf-8"?>
												<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</div>
										</div>
									</div>
								</div>
							</td>
							${this.addresses.map(address => `
								<td style="width:${cellw}px;">
									<input type="number" min="0" ${vars?.get(String(item.variant_id))?.inventory ? `max="${vars?.get(String(item.variant_id))?.inventory}"` : ''} value="0"
										class="cart-distribution__quantity-input"
										data-item-key="${item.key}" data-variant-id="${item.variant_id}" data-address-id="${address.id}"
										data-product-id="${group.id}"
										data-item-price="${item.price}" data-item-grams="${item.grams || 0}"
										 ${this.dataset.checkoutUrl ? "" : "disabled"}
										aria-label="Quantity for ${item.title} to ${address.name}"/>
									<!--div class="cart-distribution__subtotal" data-subtotal-for-item="${item.key}" data-address-id="${address.id}">${this.formatMoney(0)}</div-->
								</td>
							`).join('')}
							<td class="addr-filler-col"></td>
						</tr>`;
				}
			}
			this.tableBody1.querySelector('tbody').innerHTML = html;
			if (this._filterQuery) this.filterAddresses(this._filterQuery);
		}
		showImagePopup(img)
		{
			// Strip Shopify size suffix to get full-resolution URL
			const src = img.src
				.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|master|\d+x\d*|\d*x\d+)\./i, '.')
				.replace(/[?&]width=\d+/g, '');
			const overlay = document.createElement('div');
			overlay.className = 'cart-dist-img-overlay';
			overlay.innerHTML = `<div class="cart-dist-img-popup"><img src="${src}" alt="${img.alt}"></div>`;
			document.body.appendChild(overlay);
			const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
			const onKey = (e) => { if (e.key === 'Escape') close(); };
			overlay.addEventListener('click', close);
			overlay.querySelector('.cart-dist-img-popup').addEventListener('click', (e) => e.stopPropagation());
			document.addEventListener('keydown', onKey);
		}
		async openQuickView(img)
		{
			await window.openQuickViewDialog(img.dataset.productUrl);
		}
		getErrorAddresses()
		{
			const errors = [];
			this.tableBody2.querySelectorAll('.cart-distribution__address-row').forEach(row => {
				const qty = parseInt(row.querySelector('.carrier-qty')?.textContent) || 0;
				if (qty > 0 && !row.querySelector('.carrier-select-input')) {
					const addr = this.addresses.find(a => String(a.id) === row.dataset.addressId);
					if (addr) errors.push(addr);
				}
			});
			return errors;
		}
		showCheckoutErrorDialog(errorAddresses)
		{
			const addrList = errorAddresses.map(a =>
				`<li>${a.name} — ${[a.address1, a.city, a.state, a.zip].filter(Boolean).join(', ')}</li>`
			).join('');
			const overlay = document.createElement('div');
			overlay.className = 'cart-dist-dialog-overlay';
			overlay.innerHTML = `
				<div class="cart-dist-dialog">
					<h3 class="cart-dist-dialog__title">Shipping Rate Error</h3>
					<p class="cart-dist-dialog__body">The following ${errorAddresses.length === 1 ? 'address has' : 'addresses have'} encountered errors while loading shipping rates:</p>
					<ul class="cart-dist-dialog__list">${addrList}</ul>
					<p class="cart-dist-dialog__note">${this.dataset.rateErrorNotice || 'Our customer service team will be notified and will contact you to resolve these issues. You may still proceed with checkout.'}</p>
					<div class="cart-dist-dialog__actions">
						<button class="tb-button cart-dist-dialog__proceed">Proceed</button>
						<button class="tb-button cart-dist-dialog__cancel">Cancel</button>
					</div>
				</div>`;
			document.body.appendChild(overlay);
			const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
			const onKey = (e) => { if (e.key === 'Escape') close(); };
			document.addEventListener('keydown', onKey);
			overlay.querySelector('.cart-dist-dialog__cancel').addEventListener('click', close);
			overlay.querySelector('.cart-dist-dialog__proceed').addEventListener('click', async () => {
				close();
				try {
					const auth  = window.__cartDistributionAuth;
					if (auth) {
						await fetch(auth.proxy, {
							method:  'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								customer_id: auth.customer_id,
								ts:          auth.ts,
								token:       auth.token,
								shop:        Shopify.shop,
								action:      'rate-error-notify',
								addresses:   errorAddresses,
							}),
						});
					}
				} catch (_) {}
				this.saveCart(null, true);
			});
		}
		detectInventoryShortages()
		{
			const shortages = [];
			const keys = new Set(Array.from(this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input')).map(input => input.dataset.itemKey));
			keys.forEach(itemKey =>
			{
				const inputs = this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-item-key="${itemKey}"]`);
				const distributedTotal = Array.from(inputs).reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
				if (distributedTotal === 0) return;
				const row = this.tableBody1.querySelector(`tr[data-item-key="${itemKey}"]`);
				const maxInv = parseInt(row?.querySelector('[data-max-inv]')?.dataset.maxInv) || 99999;
				if (maxInv >= 99999) return;
				if (distributedTotal > maxInv)
				{
					const cartItem = this.groupedItems.flatMap(g => g.items).find(i => i.key === itemKey);
					shortages.push({
						itemKey,
						distributedTotal,
						actualQty: maxInv,
						variantTitle: cartItem?.variant_title || '',
						productTitle: cartItem?.product_title || '',
					});
				}
			});
			return shortages;
		}
		applyInventoryAdjustments(shortages)
		{
			shortages.forEach(({ itemKey, actualQty }) =>
			{
				const inputs = Array.from(this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-item-key="${itemKey}"]`));
				const total = inputs.reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
				if (total === 0 || actualQty >= total) return;

				// Proportionally scale down using largest-remainder method
				const newQtys = inputs.map(input => Math.floor((parseInt(input.value) || 0) * actualQty / total));
				const allocated = newQtys.reduce((s, q) => s + q, 0);
				const fractions = inputs.map((input, i) => ({
					i,
					frac: ((parseInt(input.value) || 0) * actualQty / total) - newQtys[i],
				})).sort((a, b) => b.frac - a.frac);
				for (let k = 0; k < actualQty - allocated; k++)
					newQtys[fractions[k].i]++;
				inputs.forEach((input, i) => { input.value = newQtys[i]; });
			});
		}
		showInventoryShortageDialog(shortages)
		{
			const itemList = shortages.map(s => {
				const label = [s.productTitle, s.variantTitle].filter(Boolean).join(' \u2013 ');
				return `<li><strong>${label}</strong>: ${s.distributedTotal} in cart, ${s.actualQty} available</li>`;
			}).join('');
			const overlay = document.createElement('div');
			overlay.className = 'cart-dist-dialog-overlay';
			overlay.innerHTML = `
				<div class="cart-dist-dialog">
					<h3 class="cart-dist-dialog__title">Insufficient Inventory</h3>
					<p class="cart-dist-dialog__body">The following ${shortages.length === 1 ? 'item has' : 'items have'} more quantity distributed than is available in your cart:</p>
					<ul class="cart-dist-dialog__list">${itemList}</ul>
					<p class="cart-dist-dialog__note">Would you like to automatically reduce the quantities to match what is available?</p>
					<div class="cart-dist-dialog__actions">
						<button class="tb-button cart-dist-dialog__proceed">Proceed</button>
						<button class="tb-button cart-dist-dialog__cancel">Cancel</button>
					</div>
				</div>`;
			document.body.appendChild(overlay);
			const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
			const onKey = (e) => { if (e.key === 'Escape') close(); };
			document.addEventListener('keydown', onKey);
			overlay.querySelector('.cart-dist-dialog__cancel').addEventListener('click', close);
			overlay.querySelector('.cart-dist-dialog__proceed').addEventListener('click', async () => {
				close();
				this.applyInventoryAdjustments(shortages);
				this.updateCartCalc();
				await this.saveCart(null, false);
				this.querySelector(".cart-distribution-carrier").style.display = "block";
				this.querySelector(".cart-distribution-wrapper").style.display = "none";
				this.renderAddrBody();
				this.updateAddrCalc();
				this.querySelector(".cart-sum").style.display = "none";
				this.querySelector(".ship-sum").style.display = "flex";
			});
		}
		async exportXLS()
		{
			const vendorId = '2012';

			// Build itemKey -> SKU lookup
			const skuByKey = new Map(this.groupedItems.flatMap(g => g.items).map(i => [i.key, i.sku || '']));

			const SHIP_VIA_MAP = [
				['Pick-Up',           'PICK-UP', 'PICK-UP'],
				['Ground Shipping',   'FEDEX',   'GND'],
				['Next-Day Shipping', 'FEDEX',   '1DP'],
				['2-Day Shipping',    'FEDEX',   '2DA'],
				['3-Day Shipping',    'FEDEX',   '3DS'],
			];
			const resolveShipVia = (agent, service) => {
				for (const [out, a, s] of SHIP_VIA_MAP)
					if (agent === a && service === s) return out;
				return agent && service ? `${agent} ${service}` : agent || service || '';
			};

			// Read bcShippingAgentCode / bcShippingAgentServiceCode from selected option
			const shipViaByAddr = {};
			this.tableBody2.querySelectorAll('.cart-distribution__address-row').forEach(row => {
				const sel = row.querySelector('.carrier-select-input');
				if (sel) {
					let erp = {};
					try { erp = JSON.parse(sel.options[sel.selectedIndex]?.dataset.erp || '{}'); } catch (_) {}
					shipViaByAddr[row.getAttribute('data-address-id')] = { agent: erp.agent || '', service: erp.service || '' };
				}
			});

			const headers = ['SHIP_TO_LOCATION_ID', 'VENDOR_ID', 'SKU', 'ORDER_QUANTITY', 'SHIP_VIA', 'VENDOR_ACCOUNT_ID', 'VENDOR_ACCOUNT_EMAIL'];
			const rows = [headers];

			const acctId = this.parentCustomerNo || this.addresses[0]?.bcCustomerNo || '';
			const keys = new Set(Array.from(this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input')).map(i => i.getAttribute('data-item-key')));

			for (const address of this.addresses)
			{
				const shipTo  = address.bcShipToCode || '';
				const { agent = '', service = '' } = shipViaByAddr[String(address.id)] || {};
				const shipVia = resolveShipVia(agent, service);

				for (const itemKey of keys)
				{
					const input = this.tableBody1.querySelector(`td > .cart-distribution__quantity-input[data-item-key="${itemKey}"][data-address-id="${address.id}"]`);
					const qty   = parseInt(/** @type {HTMLInputElement|null} */ (input)?.value) || 0;
					if (qty === 0) continue;
					rows.push([shipTo, vendorId, skuByKey.get(itemKey) || '', qty, shipVia, acctId, '']);
				}
			}

			if (rows.length <= 1) return;

			const xl = /** @type {any} */ (window)['XLSX'];
			const wb = xl.utils.book_new();
			const ws = xl.utils.aoa_to_sheet(rows);
			xl.utils.book_append_sheet(wb, ws, 'Order');
			xl.writeFile(wb, 'cart-export.xls');
		}
		toggleProductGroup(headerRow)
		{
			const productId = headerRow.dataset.productId;
			const toggleIcon = headerRow.querySelector('.cart-distribution__group-toggle-icon');
			if (!productId || !toggleIcon) return;

			const variantRows = this.tableBody1.querySelectorAll(`.cart-distribution__variant-row[data-product-id="${productId}"]`);
			variantRows.forEach(row => row.classList.toggle('cart-distribution__variant-row--collapsed'));
			toggleIcon.classList.toggle('cart-distribution__group-toggle-icon--collapsed');
			this.syncCartWidth();
		}
		setupCartEvents()
		{
			//move focus to the next set all btn.
			this.tableBody1.querySelectorAll('.distribution-list-item-setall > .cart-distribution__quantity-input').forEach(input =>
			{
				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter')
					{
						e.currentTarget.nextElementSibling.click();
						let next = e.currentTarget.closest("tr").nextElementSibling;
						if (!next)
							return;
						if (next.classList.contains("cart-distribution__group-header"))
							next = next.nextElementSibling;
						if (!next)
							return;
						next.querySelector('.distribution-list-item-setall > .cart-distribution__quantity-input').focus();
						next.querySelector('.distribution-list-item-setall > .cart-distribution__quantity-input').select();
					}
				});
			});
			//move focus to the next address input.
			this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input').forEach(input =>
			{
				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter')
					{
						let inputs = this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-address-id="${e.currentTarget.dataset.addressId}"]`);
						let current = Array.from(inputs).findIndex(item => item === e.currentTarget);
						if (current !== -1 && current < inputs.length - 1)
						{
							inputs[current + 1].focus();
							inputs[current + 1].select();
						}
					}
				});
				input.addEventListener('input', (e) => this.onQuantityChange(e.target));
				input.addEventListener('focus', (e) => {
					this.tableHead1.scrollLeft = this.tableBody1.scrollLeft;
					this.tableFoot1.scrollLeft = this.tableBody1.scrollLeft;
				});
			});
			//open quick view on click.
			this.tableBody1.querySelectorAll('.cart-distribution__product-image img').forEach(img =>
			{
				img.style.cursor = 'pointer';
				img.addEventListener('click', (e) => this.openQuickView(e.currentTarget));
			});
			//collapse products
			this.tableBody1.querySelectorAll('.cart-distribution__group-header').forEach(header =>
			{
				header.addEventListener('click', (e) => this.toggleProductGroup(e.currentTarget));
			});
			//copy value to all address input.
			this.tableBody1.querySelectorAll('.distribution-list-item-setall div').forEach(button =>
			{
				button.addEventListener('click', (e) => 
				{
					const inputs = this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-item-key="${e.currentTarget.dataset.itemKey}"]`);
					const value = parseInt(e.currentTarget.previousElementSibling.value) || 0;
					inputs.forEach(ip => {
						if (!ip.closest('td').classList.contains('addr-col--hidden')) ip.value = value;
					});

					this.updateCartCalc();
					this.saveCart(null, false);
				});
			});
			//remove cart item.
			this.tableBody1.querySelectorAll('.cart-distribution__product-remove').forEach(button =>
			{
				button.addEventListener('click', (e) =>
				{
					const itemKey = button.dataset.itemKey;
					if (!itemKey)
						return;
					button.textContent = 'Removing...';
					button.disabled = true;
					this.saveCart(itemKey, false);

					/*/set all quantities for this item to 0.
					this.querySelectorAll(`.cart-distribution__quantity-input[data-item-key="${itemKey}"]`).forEach(input => input.value = 0);
					//update cart.
					const response = await fetch('/cart/change.js', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							id: itemKey,
							quantity: 0
						})
					});
					//update the component's data and re-render the table.
					if (!response.ok)
						return;
					const cart = await response.json();
					this.renderCartItems(cart);
					this.syncCartWidth();*/
				});
			});
		}
		async saveCart(removeKey, checkout)
		{
			this.classList.add('cart-distribution--saving');

			//loop by cart item keys.
			let updates  = {};
			let order    = {};
			let shipping = {};

			// Build variantId -> hash lookup (needed for cart restore)
			const lineitems = {};
			this.cart.items?.forEach(item => {
				const colon = item.key.indexOf(':');
				if (colon !== -1) lineitems[String(item.variant_id)] = item.key.slice(colon + 1);
			});
			if (removeKey != null)
			{
				this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-item-key="${removeKey}"]`).forEach(input => input.value = 0);
				//update cart item.
				const cartItem = this.groupedItems.flatMap(g => g.items).find(i => i.key === removeKey);
				if (cartItem)
					updates[cartItem.variant_id] = 0;
			}
			const keys = new Set(Array.from(this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input')).map(input => input.dataset.itemKey));
			const itemByKey = new Map(this.groupedItems.flatMap(g => g.items).map(i => [i.key, i]));
			keys.forEach(itemKey =>
			{
				const inputs = this.tableBody1.querySelectorAll(`td > .cart-distribution__quantity-input[data-item-key="${itemKey}"]`);

				const cartItem = itemByKey.get(itemKey);
				if (!cartItem) return;
				const variantId = String(cartItem.variant_id);

				//also update cart items.
				if (checkout)
				{
					const total = Array.from(inputs).reduce((sum, input) => sum + (parseInt(input.value) || 0), 0);
					updates[cartItem.variant_id] = total;
				}

				//build address-keyed order table.
				inputs.forEach(input => {
					const qty = parseInt(input.value) || 0;
					if (qty === 0) return;
					const addressId = input.dataset.addressId;
					if (!order[addressId]) order[addressId] = { items: {} };
					order[addressId].items[variantId] = qty;
				});
			});
			
			// Collect per-address shipping selections.
			if (checkout) {
				this.tableBody2.querySelectorAll('.cart-distribution__address-row').forEach(row => {
					const sel = row.querySelector('.carrier-select-input');
					if (!sel) return;
					const selectedOpt = sel.options[sel.selectedIndex];
					const addrMeta = this.addresses.find(a => String(a.id) === row.dataset.addressId);
					let erpData = {};
					try { erpData = JSON.parse(selectedOpt?.dataset.erp || '{}'); } catch(_) {}
					shipping[row.dataset.addressId] = {
						...erpData,
						bc_customer: addrMeta?.bcCustomerNo || '',
						bc_ship_to:  addrMeta?.bcShipToCode || '',
						addr:        addrMeta?.addr         || '',
						contact:     { name: addrMeta?.contact || '', phone: addrMeta?.phone || '' },
					};
				});
			}
			// Merge ERP shipping data into order entries (checkout only).
			if (checkout) {
				Object.entries(shipping).forEach(([addressId, shippingData]) => {
					if (order[addressId]) {
						const { items } = order[addressId];
						order[addressId] = { ...shippingData, items };
					}
				});
				// Backfill address metadata for entries that had no shipping rate
				// (e.g. zero-weight items produce no carrier-select-input, so they
				// are skipped by the loop above and end up with only { items }).
				Object.keys(order).forEach(addressId => {
					if (!order[addressId].bc_customer) {
						const addrMeta = this.addresses.find(a => String(a.id) === addressId);
						if (addrMeta) {
							order[addressId].bc_customer = addrMeta.bcCustomerNo || '';
							order[addressId].bc_ship_to  = addrMeta.bcShipToCode || '';
							order[addressId].addr        = addrMeta.addr         || '';
							order[addressId].contact     = { name: addrMeta.contact || '', phone: addrMeta.phone || '' };
						}
					}
				});
			}
			//update the entire cart.
			try {
				const response = await fetch('/cart/update.js', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						updates: updates,
						attributes: {
						'_lineitems': JSON.stringify(lineitems),
						'_order': JSON.stringify(Object.entries(order).map(([addrId, data]) => {
							const addrMeta = this.addresses.find(a => String(a.id) === addrId);
							return { id: addrMeta?.bcSystemId || addrId, ...data };
						})),
						'_address': JSON.stringify(Object.keys(order).map(addrId => {
							const a = this.addresses.find(a => String(a.id) === addrId);
							return {
								id:          a?.bcSystemId   || addrId,
								bc_customer: a?.bcCustomerNo || '',
								bc_ship_to:  a?.bcShipToCode || '',
								company:     a?.name         || '',
								address:     a?.address1     || '',
								address2:    a?.address2     || '',
								city:        a?.city         || '',
								contact:     a?.contact      || '',
								phone:       a?.phone        || '',
								country:     a?.country      || '',
								zip:         a?.zip          || '',
								state:       a?.state        || '',
							};
						})),
					}
					})
				});
				if (!response.ok)
					throw new Error('Failed to save cart state.');
				const updatedCart = await response.json();

				if (checkout)
				{
					// Totals needed by both checkout modes
					const usedIds = new Set(Object.keys(order));
					const totalShipping = Object.values(shipping).reduce((s, v) => s + (v.buyer ?? 0), 0);

					if (this.dataset.checkoutMode === 'direct') {
						const auth  = window.__cartDistributionAuth;
						// Save pre-calculated total server-side so shipping.php can return it.
						// Key = sorted variantId:qty pairs — derivable from rate.items in the
						// carrier service payload, so no extra API call is needed.
						if (auth) {
							const variantKey = Object.entries(updates)
								.filter(([, qty]) => qty > 0)
								.map(([vid, qty]) => `${vid}:${qty}`)
								.sort()
								.join(',');
							await fetch(auth.proxy, {
								method:  'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									customer_id:    auth.customer_id,
									ts:             auth.ts,
									token:          auth.token,
									shop:           Shopify.shop,
									action:         'save-shipping-total',
									variant_key:    variantKey,
									shipping_total: Math.round(totalShipping * 100),
								}),
							});
						}
						// Touch one line item property to bust Shopify's carrier service rate cache.
						// Use updatedCart (from /cart/update.js response) for correct post-distribution quantities.
						const _lastIdx = (updatedCart.items?.length || 1) - 1;
						const firstItem = updatedCart.items?.[_lastIdx];
						if (firstItem) {
							const bustRes = await fetch('/cart/change.js', {
								method:  'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ id: firstItem.key, quantity: firstItem.quantity, properties: { ...firstItem.properties, _dist_v: Date.now() } }),
							});
							// Shopify assigns a new line-item key when properties are added for the first
							// time (the key hash includes properties). If the key changed, patch
							// _lineitems so the restore logic finds the right input on return.
							try {
								const bustCart = await bustRes.json();
								const newItem = bustCart.items?.find(i => i.variant_id === firstItem.variant_id);
								if (newItem && newItem.key !== firstItem.key) {
									const vid     = String(firstItem.variant_id);
									const newHash = newItem.key.split(':')[1];
									if (newHash && lineitems[vid]) {
										lineitems[vid] = newHash;
										await fetch('/cart/update.js', {
											method:  'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify({ attributes: { _lineitems: JSON.stringify(lineitems) } }),
										});
									}
								}
							} catch (_) {}
						}
						window.location.href = '/checkout';
					} else {
						// Draft order checkout (default)
						const lineItems = Object.entries(updates)
							.filter(([, qty]) => qty > 0)
							.map(([variantId, qty]) => {
							const cartItem = this.groupedItems.flatMap(g => g.items).find(i => String(i.variant_id) === variantId);
							return {
								variant_id:     parseInt(variantId),
								quantity:       qty,
								...(cartItem ? { price_override: (cartItem.price / 100).toFixed(2) } : {}),
							};
						});
						const primaryAddr = this.addresses.find(a => usedIds.has(String(a.id))) || this.addresses[0];
						const draftPayload = {
							line_items: lineItems,
							customer:   { id: parseInt(this.customerId) },
							shipping_address: {
								first_name:   primaryAddr.name,
								address1:     primaryAddr.address1,
								address2:     primaryAddr.address2  || '',
								city:         primaryAddr.city,
								province:     primaryAddr.state,
								zip:          primaryAddr.zip,
								country_code: primaryAddr.country   || 'US',
								phone:        primaryAddr.phone     || '',
							},
							currency_code: Shopify.currency?.active || 'USD',
							shipping_line: {
								title: 'Multi-address shipping',
								price: totalShipping.toFixed(2),
							},
							note_attributes: [
								{ name: 'ship_to_count', value: String(usedIds.size) },
								...this.getErrorAddresses().map(a => ({
									name:  'rate_error',
									value: [a.name, a.address1, a.city, a.state, a.zip].filter(Boolean).join(', '),
								})),
							],
							metafields: [
								{ namespace: 'cart_distribution', key: 'order',    value: JSON.stringify(order),    type: 'json' },
								{ namespace: 'cart_distribution', key: 'shipping',     value: JSON.stringify(shipping),     type: 'json' },
							],
						};
						if (this.b2bEntity) {
							draftPayload.purchasing_entity = { purchasingCompany: this.b2bEntity };
						}
						const auth  = window.__cartDistributionAuth;
						const draftRes = await fetch(auth.proxy, {
							method:  'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								customer_id: auth.customer_id,
								ts:          auth.ts,
								token:       auth.token,
								shop:        Shopify.shop,
								action:      'create-draft-order',
								draft_order: draftPayload,
							}),
						});
						const draftData = await draftRes.json();
						if (draftData.ok && draftData.invoice_url)
							window.location.href = draftData.invoice_url;
						else
							throw new Error(draftData.error || 'Failed to create checkout session');
					}
				}
				else
				{
					if (updatedCart.items.length !== this.cart.items.length)
					{
						await this.renderCartItems(updatedCart);
						this.syncCartWidth();
					}
					return updatedCart;
				}
			}
			catch (error) {
				console.error('Failed to update cart:', error);
			}
			finally {
				this.classList.remove('cart-distribution--saving');
			}
		}
		onQuantityChange(input)
		{
			let value = parseInt(input.value) || 0;
			const max = parseInt(input.getAttribute('max'));
			if (value < 0) value = 0;
			if (!isNaN(max) && value > max) value = max;
			input.value = value;

			this.updateCartCalc();
			clearTimeout(this.updateTimeout);
			this.updateTimeout = setTimeout(() => { this.saveCart(null, false); }, 2000);
		}
		updateCartCalc()
		{
			let addressItems = {};
			let varItems = {};
			let addressTotals = {};
			let grandTotalPrice = 0;
			this.addresses.forEach(addr => {addressItems[addr.id] = 0; addressTotals[addr.id] = 0});
			const items = this.tableBody1.querySelectorAll(`.cart-distribution__variant-row`)
			items.forEach(item => {varItems[item.dataset.itemKey] = 0});

			this.tableBody1.querySelectorAll('td > .cart-distribution__quantity-input').forEach(input => {
				const qty = parseInt(input.value) || 0;
				const price = parseInt(input.dataset.itemPrice);
				const addrId = input.dataset.addressId;
				const itemKey = input.dataset.itemKey;
				varItems[itemKey] += qty;
				const subtotal = qty * price;
				addressTotals[addrId] += subtotal;
				addressItems[addrId] += qty;
				grandTotalPrice += subtotal;
				let subtotalEl = this.tableBody1.querySelector(`[data-subtotal-for-item="${itemKey}"][data-address-id="${addrId}"]`);
				if (subtotalEl)
					subtotalEl.textContent = this.formatMoney(subtotal);
			});

			Object.keys(varItems).forEach(id => {
				const sum = this.tableBody1.querySelector(`.cart-distribution__variant-row[data-item-key="${id}"] .distribution-list-item-price span`);
				sum.textContent = ` (${varItems[id]})`;
				if (varItems[id] > sum.dataset.maxInv)
					sum.style.color = 'red';
				else
					sum.style.color = '';
			});
			Object.keys(addressItems).forEach(id => {
				this.tableFoot1.querySelector(`.cart-distribution__address-total[data-address-id="${id}"]`).textContent = `$${(addressTotals[id] / 100).toFixed(2)} / ${addressItems[id]}`;
			});
			this.querySelector('.cart-sum .cart-sum-total').textContent = this.formatMoney(grandTotalPrice);
			this.querySelector('.ship-sum .cart-sum-total').textContent = this.formatMoney(grandTotalPrice);
			const totalAllocated = Object.values(varItems).reduce((s, v) => s + v, 0);
			const nextBtn = this.querySelector('.cart-sum .table-next');
			if (nextBtn) nextBtn.toggleAttribute('disabled', totalAllocated === 0);
		}
		formatMoney(cents, format)
		{
			if (typeof cents == 'string')
				cents = cents.replace('.', '');
			let value = '';
			const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
			const formatString = (format || this.moneyFormat);
			function formatWithDelimiters(number, precision, thousands, decimal) {
				thousands = thousands || ',';
				decimal = decimal || '.';
				if (isNaN(number) || number == null) { return 0; }
				number = (number / 100.0).toFixed(precision);
				let parts = number.split('.');
				let dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
				return dollars + (parts[1] ? (decimal + parts[1]) : '');
			}
			switch(formatString.match(placeholderRegex)[1]) {
				case 'amount': value = formatWithDelimiters(cents, 2); break;
				case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
				case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
				case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
			}
			return formatString.replace(placeholderRegex, value);
		}
		updateSlide()
		{
			let left = (this.tableBody1.scrollWidth - this.resizeBar.offsetLeft) * this.currentSlide / this.addresses.length;
			this.tableHead1.scrollLeft = left;
			this.tableBody1.scrollLeft = left;
			this.tableFoot1.scrollLeft = left;
			this.prevButton.setAttribute("disabled", this.tableBody1.scrollLeft === 0);
			this.nextButton.setAttribute("disabled", this.tableBody1.scrollWidth - this.tableBody1.scrollLeft - 2 < this.tableBody1.clientWidth);
		}
		nextSlide()
		{
			this.currentSlide += this.visibleSlides;
			if (this.currentSlide > this.addresses.length - this.visibleSlides)
				this.currentSlide = this.addresses.length - this.visibleSlides;
			this.updateSlide();
		}
		prevSlide()
		{
			this.currentSlide -= this.visibleSlides;
			if (this.currentSlide < 0)
				this.currentSlide = 0;
			this.updateSlide();
		}
		filterAddresses(query)
		{
			this._filterQuery = query;
			const q = query.trim().toLowerCase();

			this.addresses.forEach(a => {
				const match = !q
					|| a.name.toLowerCase().includes(q)
					|| a.addr.toLowerCase().includes(q)
					|| (a.bcShipToCode || '').toLowerCase().includes(q);
				const id = String(a.id);
				this.tableHead1.querySelectorAll(`th[data-address-id="${id}"]`).forEach(el => el.classList.toggle('addr-col--hidden', !match));
				this.tableFoot1.querySelectorAll(`[data-address-id="${id}"]`).forEach(el => el.closest('td').classList.toggle('addr-col--hidden', !match));
				this.tableBody1.querySelectorAll(`[data-address-id="${id}"]`).forEach(el => el.closest('td').classList.toggle('addr-col--hidden', !match));
			});

			this.syncCartWidth();
		}
	}
	customElements.define('multi-ship', Distribution);

	class AddProductDlg extends HTMLElement {
		constructor()
		{
			super();
			this.isLoading = false;
			this.productsPerPage = 10;
			this.searchDelay = 300;
			this.currentFilter = 'all';
			this.isOverlayMousedown = false;
			this.searchTimeout = null;
			this.currentPage = 1;
			this.totalPages = 1;
		}
		connectedCallback()
		{
			this.searchUrl = this.dataset.searchUrl;
			this.currentFilter = this.dataset.defaultCollection || 'all';
			this.emptySVG = document.querySelector("#icon-placeholder").innerHTML;
			this.dialog = this.querySelector('[data-dialog]');
			this.closeBtn = this.querySelector('[data-dialog-close]');
			this.filterSelect = this.querySelector('[data-filter-type]');
			this.listContainer = this.querySelector('[data-result-type]');
			this.listFooter = this.querySelector('.distribution-dlg-footer');
			this.table = this.closest("multi-ship");
			this.addProductBtn = this.table.querySelector('.add-product-btn');
			this.paginationPrev = this.querySelector('[data-page-prev]');
			this.paginationNext = this.querySelector('[data-page-next]');
			this.paginationInfo = this.querySelector('[data-page-info]');
			this.searchInput = this.querySelector('[data-filter-search]');
			this.searchResults = this.querySelector('[data-result-search]');
			this.searchClear = this.querySelector('[data-search-clear]');
		    this.dialog.querySelector(".distribution-dlg-content").addEventListener("mousedown", (e) => {
		        if (e.target != e.currentTarget && e.target.className != "distribution-dlg-header" && e.target.className != "distribution-dlg-footer")
		            return;
                let offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
                let offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;
                let dlg = e.currentTarget;
                function mouseMoveHandler(ee) {
                    let left = ee.clientX - offsetX;
                    if (left < 0) left = 0;
                    if (left > document.documentElement.clientWidth - dlg.clientWidth) left = document.documentElement.clientWidth - dlg.clientWidth;
                    let top = ee.clientY - offsetY;
                    if (top < 0) top = 0;
                    if (top > document.documentElement.clientHeight - dlg.clientHeight) top = document.documentElement.clientHeight - dlg.clientHeight;
                    dlg.style.left = left + 'px';
                    dlg.style.top = top + 'px';
                    dlg.style.transform = "none";
                }
                function reset() {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', reset);
                }
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', reset);
		    });
            this.dialog.querySelector(".distribution-dlg-content .dlg-resizer").addEventListener('mousedown', function(e) {
                e.preventDefault();
                let dlg = e.currentTarget.parentNode;
                let offsetX = dlg.offsetLeft + dlg.offsetWidth - e.clientX;
                let offsetY = dlg.offsetTop + dlg.offsetHeight - e.clientY;
                function resize(ee) {
                    dlg.style.width = (ee.clientX + offsetX - dlg.offsetLeft) + 'px';
                    dlg.style.height = (ee.clientY + offsetY - dlg.offsetTop) + 'px';
                }
                function stopResize() {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                }
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            });
			this.addProductBtn.addEventListener('click', () => {
				this.openDialog();
				//document.getElementById('search-modal')?.showDialog();
			});
			this.closeBtn.addEventListener('click', this.closeDialog.bind(this));
			this.dialog.addEventListener('mousedown', (e) => {
				if (e.target === this.dialog)
					this.isOverlayMousedown = true;
			});
			this.dialog.addEventListener('click', (e) => {
				if (e.target.classList.contains("distribution-dlg-list-item-cart"))
					return;
				//hide the dialog if clicked on background.
				if (e.target === this.dialog && this.isOverlayMousedown)
					this.closeDialog();
				this.isOverlayMousedown = false;

				/*/hide search results, show the product list.
				if (e.target == this.searchInput || e.target == this.searchResults || this.searchResults.contains(e.target))
					return;
				this.searchResults.style.display = 'none';
				this.listContainer.style.display = 'block';
				this.listFooter.style.display = 'flex';
				this.filterSelect.removeAttribute("disabled");
				*/
			});

			this.querySelector('.distribution-dlg-footer').addEventListener('click', (e) => {
				if (e.target.matches('[data-page-number]'))
					this.changePage(parseInt(e.target.dataset.pageNumber));
				else if (e.target.matches('[data-page-prev]'))
					this.changePage(1);
				else if (e.target.matches('[data-page-next]'))
					this.changePage(this.totalPages);
			});
			this.filterSelect.addEventListener('change', this.onFilterChange.bind(this));
			//this.paginationNext.addEventListener('click', () => this.changePage('next'));
			//this.paginationPrev.addEventListener('click', () => this.changePage('prev'));

			this.searchClear.addEventListener('click', () => {
				this.searchInput.value = '';
				this.searchClear.style.display = 'none';
				this.listContainer.style.display = 'block';
				this.listFooter.style.display = 'flex';
				this.searchResults.innerHTML = '';
				this.searchResults.style.display = 'none';
				this.filterSelect.removeAttribute('disabled');
				this.searchInput.focus();
			});
			this.searchInput.addEventListener('input', this.onSearch.bind(this));
			this.searchInput.addEventListener('focus', (e) => {
				if (!this.searchInput.value.trim())
					return;
				if (this.searchResults.querySelector(".distribution-dlg-empty") != null)
					return;
				this.searchResults.style.display = 'block';
				this.listContainer.style.display = 'none';
				this.listFooter.style.display = 'none';
				this.filterSelect.setAttribute("disabled", "1");
			});
		}
		disconnectedCallback() {
		}
		/////////////////////////////////////////////////////////////
		onSearch(e)
		{
			clearTimeout(this.searchTimeout);
			const query = e.target.value.trim();
			this.searchClear.style.display = query.length > 0 ? 'block' : 'none';
			if (query.length > 2)
			{
				this.listContainer.style.display = 'none';
				this.listFooter.style.display = 'none';
				this.searchResults.innerHTML = `<div class="distribution-dlg-empty">Searching...</div>`;
				this.searchResults.style.display = 'block';
				this.filterSelect.setAttribute("disabled", "1");
				this.searchTimeout = setTimeout(() => this.searchProducts(query), this.searchDelay);
			}
			else
			{
				this.listContainer.style.display = 'block';
				this.listFooter.style.display = 'flex';
				this.searchResults.innerHTML = '';
				this.searchResults.style.display = 'none';
				this.filterSelect.removeAttribute("disabled");
			}
		}
		onFilterChange()
		{
			this.currentFilter = this.filterSelect.value;
			this.currentPage = 1;
			this.loadProducts();
		}
		showImagePopup(img)
		{
			const src = img.src
				.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|master|\d+x\d*|\d*x\d+)\./i, '.')
				.replace(/[?&]width=\d+/g, '');
			const overlay = document.createElement('div');
			overlay.className = 'cart-dist-img-overlay';
			const popup = document.createElement('div');
			popup.className = 'cart-dist-img-popup';
			const imgEl = document.createElement('img');
			imgEl.src = src;
			imgEl.alt = img.alt;
			popup.appendChild(imgEl);
			overlay.appendChild(popup);
			document.body.appendChild(overlay);
			const close = () => { overlay.remove(); document.removeEventListener('keydown', onKey); };
			const onKey = (e) => { if (e.key === 'Escape') close(); };
			overlay.addEventListener('click', close);
			popup.addEventListener('click', (e) => e.stopPropagation());
			document.addEventListener('keydown', onKey);
		}
		/////////////////////////////////////////////////////////////
		async searchProducts(query)
		{
			//const response = await fetch(`${this.searchUrl}?q=${encodeURIComponent(query)}&section_id=distribution-search`);
			const response = await fetch(`${this.searchUrl}.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=10&resources[options][unavailable_products]=hide&resources[options][fields]=title,product_type,vendor,variants.sku,variants.barcode`);
			if (!response.ok)
			{
				this.searchResults.innerHTML = `<div class="distribution-dlg-empty">No product was found.</div>`;
				return;
			}

			/*/parse search result page and get handles.
			let productHandles = [];
			const parser = new DOMParser();
			const html = await response.text();
			const doc = parser.parseFromString(html, 'text/html');
			const products = doc.querySelector('ul#predictive-search-results-products-list');
			if (products)
			{
				const listItems = products.querySelectorAll('li.predictive-search__list-item a.predictive-search__item');
				listItems.forEach(link => {
					const productIdMatch = link.href.match(/\/products\/([a-zA-Z0-9-]+)/);
					if (productIdMatch && productIdMatch[1])
						productHandles.push(productIdMatch[1]);
				});
			}
			//const promises = productHandles.map(handle => fetch(`/products/${handle}.json`).then(res => res.json())); //no variant image in json return.
			*/
			let json = await response.json();
			let products = json["resources"]["results"]["products"];
			if (products == null || products.length === 0)
			{
				this.searchResults.innerHTML = `<div class="distribution-dlg-empty">No product was found for "${query}".</div>`;
				return;
			}

			//export product variants by handles.
			const promises = products.map(p => fetch(`/products/${p["handle"]}.js`).then(res => res.json()));
			try {
				const data = await Promise.all(promises);
				//this.searchResults.innerHTML = this.renderProducts(data.map(item => item.product)); //for ${handle}.json.
				this.searchResults.innerHTML = this.renderProducts(data);
				this.searchResults.querySelectorAll('.distribution-dlg-list-item-cart').forEach(button => {
					button.addEventListener('click', this.onAddToCart.bind(this));
				});
				this.searchResults.querySelectorAll('.distribution-dlg-list-item-info.product').forEach(button => {
					button.addEventListener('click', (e) => {e.currentTarget.parentNode.classList.toggle("collapse")});
				});
				this.searchResults.querySelectorAll('.distribution-list-item-image img').forEach(img => {
					img.style.cursor = 'zoom-in';
					img.addEventListener('click', (e) => { e.stopPropagation(); const t = e.currentTarget; if (t.dataset.productUrl && window.openQuickViewDialog) window.openQuickViewDialog(t.dataset.productUrl); else this.showImagePopup(t); });
				});
			}
			catch(error) {
				this.searchResults.innerHTML = `<div class="distribution-dlg-empty">No product was found.</div>`;
			}
		}
		async loadProducts()
		{
			if (this.isLoading)
				return;
			this.isLoading = true;
			this.listContainer.innerHTML = '<div class="distribution-dlg-empty">Loading products...</div>';
			
			try {
				//fetch product total.
				let response = await fetch(`/collections/${this.currentFilter}.json`);
				let data = await response.json();
				this.totalPages = Math.ceil(data.collection.products_count / this.productsPerPage);

				//fetch and render products.
				const url = `/collections/${this.currentFilter}/products.json?limit=${this.productsPerPage}&page=${this.currentPage}`;
				response = await fetch(url);
				data = await response.json();
				this.listContainer.innerHTML = this.renderProducts(data.products);
				this.listContainer.querySelectorAll('.distribution-dlg-list-item-cart').forEach(button => {
					button.addEventListener('click', this.onAddToCart.bind(this));
				});
				this.listContainer.querySelectorAll('.distribution-dlg-list-item-info.product').forEach(button => {
					button.addEventListener('click', (e) => {e.currentTarget.parentNode.classList.toggle("collapse")});
				});
				this.listContainer.querySelectorAll('.distribution-list-item-image img').forEach(img => {
					img.style.cursor = 'zoom-in';
					img.addEventListener('click', (e) => { e.stopPropagation(); const t = e.currentTarget; if (t.dataset.productUrl && window.openQuickViewDialog) window.openQuickViewDialog(t.dataset.productUrl); else this.showImagePopup(t); });
				});

				//render pages entries.
				if (true)
				{
					let html = '';
					let start = Math.max(1, this.currentPage - 4);
					let end = Math.min(this.totalPages, start + 8);
					start = Math.max(1, end - 8);
					for (let i = start; i <= end; i ++)
						html += `<div class="distribution-dlg-page-num${i === this.currentPage ? ' active' : ''}" data-page-number="${i}">${i}</div>`;
					this.paginationInfo.innerHTML = html;
					this.paginationPrev.textContent = '1';
					this.paginationNext.textContent = `${this.totalPages}`;
					if (this.currentPage == 1)
						this.paginationPrev.setAttribute("disabled", "1");
					else
						this.paginationPrev.removeAttribute("disabled");
					if (this.currentPage == this.totalPages)
						this.paginationNext.setAttribute("disabled", "1");
					else
						this.paginationNext.removeAttribute("disabled");
				}
			}
			catch (error) {
				console.error('Error loading products:', error);
				this.listContainer.innerHTML = '<div class="distribution-dlg-empty">No product was found.</div>';
			}
			finally {
				this.isLoading = false;
			}
		}
		renderProducts(products)
		{
			return products.map(product => {
				const productImage = product.featured_image || product.images[0]?.src || null;
				const variantsHtml = product.variants.map(variant => {
					const cprice = typeof variant.compare_at_price === 'string' ? variant.compare_at_price : (variant.compare_at_price / 100).toFixed(2);
					const oprice = typeof variant.price === 'string' ? variant.price : (variant.price / 100).toFixed(2);
					const price = (variant.compare_at_price && variant.compare_at_price !== variant.price ? `<s>$${cprice}</s>&nbsp;&nbsp;` : '') + `$${oprice}`;
					const variantImage = variant.featured_image ? variant.featured_image.src : productImage;
					return `
						<div class="distribution-dlg-list-item-info">
							<div class="distribution-list-item-row distribution-list-item-image">${variantImage ? `<img src="${variantImage}&width=40" alt="${variant.title}" data-product-url="/products/${product.handle}">` : this.emptySVG}</div>
							<div class="distribution-list-item-row distribution-list-item-variant">${variant.title !== 'Default Title' ? `${variant.title}` : ''}</div>
							<div class="distribution-list-item-row distribution-list-item-sku">${variant.sku ? `SKU: ${variant.sku}` : ''}</div>
							<div class="distribution-list-item-row distribution-list-item-price">${price}</div>
							<div class="distribution-list-item-row distribution-dlg-list-item-cart tb-button"
								data-variant-id="${variant.id}" ${!variant.available ? 'disabled' : ''}>${variant.available ? 'Add to Cart' : 'Out of Stock'}</div>
						</div>
					`;
				}).join('');

				return `
					<div class="distribution-dlg-list-item">
						<div class="distribution-dlg-list-item-info product">
							<svg viewBox="0 0 10 6" width="12"><path fill="currentColor" fill-rule="evenodd" d="M9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708" clip-rule="evenodd"></path>
							</svg>
							<div class="distribution-list-item-row distribution-list-item-image" style="display: none;">
								${productImage ? `<img src="${productImage}&width=40" alt="${product.title}" loading="lazy">` : this.emptySVG}</div>
							<div class="distribution-dlg-list-item-title">${product.title}</div>
						</div>
						${variantsHtml}
					</div>`;
			}).join('') || `<div class="distribution-dlg-empty">No product was found.</div>`;
		}
		/////////////////////////////////////////////////////////////
		changePage(page)
		{
			if (page < 1 || page > this.totalPages || page === this.currentPage)
				return;
			this.currentPage = page;
			this.loadProducts();
			if (this.currentPage == 1)
				this.paginationPrev.setAttribute("disabled", "1");
			else
				this.paginationPrev.removeAttribute("disabled");
			if (this.currentPage == this.totalPages)
				this.paginationNext.setAttribute("disabled", "1");
			else
				this.paginationNext.removeAttribute("disabled");
		}
		openDialog()
		{
			this.dialog.classList.add('active');
			// Load initial products if the list is empty
			if (this.listContainer.querySelector('.distribution-dlg-empty'))
				this.loadProducts();
		}
		closeDialog()
		{
			this.dialog.classList.remove('active');
			document.body.style.overflow = '';
		}
		async onAddToCart(e)
		{
			if (e.target.hasAttribute("disabled") == true)
				return;
			const button = e.target;
			const variantId = button.dataset.variantId;
			const originalText = button.textContent;
			button.textContent = 'Adding...';
			button.disabled = true;
			try {
				const response = await fetch('/cart/add.js', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }]})
				});
				if (response.ok) {
					button.textContent = 'Item Added';
					const cart = await fetch('/cart.js').then(r => r.json());
					this.table._onCartUpdated({ detail: { resource: cart } });
				}
				else { throw new Error('Failed to add to cart'); }
			}
			catch (error) {
				console.error(error);
				button.textContent = 'Error Occured';
			}
			finally {
				setTimeout(() => {
					button.textContent = originalText;
					button.disabled = false;
				}, 1000);
			}
		}
	}
	customElements.define('add-product', AddProductDlg);

	class AddressList extends HTMLElement {
		constructor() {
			super();
			this.data = [];
			this.container = this.querySelector('.bubble-container');
			this.input = this.querySelector('.bubble-input');
			this.list = this.querySelector('.bubble-list');
		}
		connectedCallback()
		{
			this.container.addEventListener('click', (e) => {
				//focus input when clicking anywhere on the container
				if(e.target === this.container || e.target === this.list)
				{
					this.input.focus();
				}
			});
			this.input.addEventListener('paste', (e) => {
				e.preventDefault();
				//split clipboard by newlines and filter out empty lines
				const text = (e.clipboardData || window.clipboardData).getData('text');
				const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
				this.importText(lines);
			});
			this.input.addEventListener('keydown', (e) => {
				if (e.key === 'Enter')
				{
					e.preventDefault(); //prevent actual newline
					const text = this.input.innerText.trim();
					if (text)
					{
						this.addBubble(text, 0);
						this.input.innerText = ''; //clear input
					}
				}
			});
		}
		importText(lines)
		{
			if (lines.length > 0)
			{
				for (let i = 0; i < lines.length; i ++)
					this.addBubble(lines[i], i);
				this.input.innerText = '';
			}
		}
		toTitleCase(text)
		{
			return text.trim().split(' ').map(word => {
				//if word has two consecutive caps together (e.g., "AJ", "P.O.", "USA"), skip transform
				if (/[A-Z]{1}\.?[A-Z]/.test(word))
					return word;
				//otherwise, perform title case transform
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			}).join(' ');
		}
		normalizeAddress(addr)
		{
			//remove extra whitespace
			let clean = this.toTitleCase(addr.replace(/\s+/g, ' ').trim());
			
			//strip Country Suffix (USA, United States, etc.) if present at end
			const countryRegex = /(?:,\s*)?(US|USA|United States)$/i;
			clean = clean.replace(countryRegex, '').trim();
		
			//locate Zip and State
			// Look for: [State Name or Code] followed by [Zip 5+4] at the end
			// State: 2 letters OR 3+ letters for full name
			const geoRegex = /([A-Za-z\s]{2,})\s+(\d{5}(?:-\d{4})?)$/i;
			const match = clean.match(geoRegex);
		
			if (match)
			{
				//if it's a 2-letter state code, force uppercase
				let state = match[1].trim();
				// Format state: uppercase for codes, Title Case for full names
				state = state.length === 2 ? state.toUpperCase() : this.toTitleCase(state);
		
				const zip = match[2];
				//remove the matched state/zip from the remaining part to parse City/Street
				let remaining = clean.replace(geoRegex, '').trim().replace(/,$/, '');
		
				//try to find a comma-separated city, or assume last word before state is city
				//let parts = remaining.split(/,|\s(?=[^\s]+$)/).map(p => p.trim());
				let parts = remaining.split(',').map(p => p.trim());
				
				if (parts.length >= 3)
					return `${parts[0]}, ${parts[1]}, ${parts[2]}, ${state} ${zip}`;
				else if (parts.length === 2)
					return `${parts[0]}, ${parts[1]}, ${state} ${zip}`;
			}
		
			//fallback: If regex fails, just comma-separate chunks if they aren't already
			//return clean.includes(',') ? clean : clean.split(' ').join(', ');
			return clean.split(',').map(s => s.trim()).filter(Boolean).join(', ');
		}
		addBubble(entry, index)
		{
			if (entry.raw == undefined)
			{
				let pos = entry.search(/\d/);
				if (pos < 0)
					return;
				let name = entry.slice(0, pos).trim().replace(/,\s*$/, '');
				let addr = this.normalizeAddress(entry.slice(pos).trim());
				entry = {
					id: Date.now() * 1000 + index, //Math.floor(Math.random() * 1000), //crypto.randomUUID(),
					raw: entry,
					name: name,
					addr: addr,
					timestamp: new Date().toISOString()
				};
			}
			this.data.push(entry);

			const div = document.createElement('div');
			div.className = 'bubble-line';
			div.setAttribute('data-id', entry.id);
			div.innerHTML = `
				<span>${entry.name}, ${entry.addr}</span>
				<span class="bubble-close">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg></span>
			`;
			div.querySelector('.bubble-close').onclick = (e) => {
				e.stopPropagation();
				this.removeBubble(entry.id);
			};
			div.children[0].addEventListener('dblclick', (e) => {
				const span = e.currentTarget;
				const currentText = span.innerText;

				//find the character index where the user clicked
				let charIndex = currentText.length; // Default to end
				if (document.caretRangeFromPoint)
				{
					const range = document.caretRangeFromPoint(e.clientX, e.clientY);
					charIndex = range.startOffset;
				}
				else if (document.caretPositionFromPoint)
				{
					const position = document.caretPositionFromPoint(e.clientX, e.clientY);
					charIndex = position.offset;
				}
				span.parentNode.classList.add("edit");
				
				//create the input element
				const input = document.createElement('input');
				input.type = 'text';
				input.value = currentText;
				input.className = 'bubble-edit';

				//listen for Enter key or Blur (clicking away)
				const saveChange = () => {
					span.innerText = input.value.trim() || currentText;
					input.replaceWith(span);

					//update the properties
					const item = this.data.find(entry => String(entry.id) === span.parentNode.dataset.id);
					let pos = span.innerText.search(/\d/);
					if (item && index >= 0)
					{
						item.name = span.innerText.slice(0, pos).trim().replace(/,\s*$/, '');
						item.addr = this.normalizeAddress(span.innerText.slice(pos).trim());
						item.raw = span.innerText.trim();
						item.timestamp = new Date().toISOString();
					}
					span.parentNode.classList.remove("edit");
				};
				input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') saveChange();
					if (e.key === 'Escape') input.replaceWith(span);
				});
				input.addEventListener('blur', saveChange);

				//swap the span for the input and focus it
				span.replaceWith(input);
				//put the cursor at the calculated index
				input.focus();
				input.setSelectionRange(charIndex, charIndex);
			});
			this.list.appendChild(div);
		}
		removeBubble(id)
		{
			this.data = this.data.filter(item => item.id !== id);
			const element = this.querySelector(`[data-id="${id}"]`);
			if (element)
				element.remove();
		}
	}
	customElements.define('address-list', AddressList);

	class EditAddressDlg extends HTMLElement {
		constructor() {
			super();
			this.dialog = this.querySelector('[data-dialog]');
			this.closeButton = this.querySelector('[data-dialog-close]');
			this.list = this.querySelector('address-list');
			this.successMessage = this.querySelector('[data-success-message]');
			this.errorMessage = this.querySelector('[data-error-message]');
			this.table = this.closest("multi-ship");
			this.openButton = this.table.querySelector('.edit-address-btn');
			this.isOverlayMousedown = false;
			this.needRefresh = false;
		}
		connectedCallback()
		{
		    this.dialog.querySelector(".distribution-dlg-content").addEventListener("mousedown", (e) => {
		        if (e.target != e.currentTarget && e.target.className != "distribution-dlg-header" && e.target.className != "button-group")
		            return;
                let offsetX = e.clientX - e.currentTarget.getBoundingClientRect().left;
                let offsetY = e.clientY - e.currentTarget.getBoundingClientRect().top;
                let dlg = e.currentTarget;
                function mouseMoveHandler(ee) {
                    let left = ee.clientX - offsetX;
                    if (left < 0) left = 0;
                    if (left > document.documentElement.clientWidth - dlg.clientWidth) left = document.documentElement.clientWidth - dlg.clientWidth;
                    let top = ee.clientY - offsetY;
                    if (top < 0) top = 0;
                    if (top > document.documentElement.clientHeight - dlg.clientHeight) top = document.documentElement.clientHeight - dlg.clientHeight;
                    dlg.style.left = left + 'px';
                    dlg.style.top = top + 'px';
                    dlg.style.transform = "none";
                }
                function reset() {
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', reset);
                }
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', reset);
		    });
            this.dialog.querySelector(".distribution-dlg-content .dlg-resizer").addEventListener('mousedown', function(e) {
                e.preventDefault();
                let dlg = e.currentTarget.parentNode;
                let offsetX = dlg.offsetLeft + dlg.offsetWidth - e.clientX;
                let offsetY = dlg.offsetTop + dlg.offsetHeight - e.clientY;
                function resize(ee) {
                    dlg.style.width = (ee.clientX + offsetX - dlg.offsetLeft) + 'px';
                    dlg.style.height = (ee.clientY + offsetY - dlg.offsetTop) + 'px';
                }
                function stopResize() {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResize);
                }
                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResize);
            });
			this.openButton.addEventListener('click', this.openModal.bind(this));
			this.closeButton.addEventListener('click', this.closeModal.bind(this));
			this.dialog.addEventListener('mousedown', (e) => {
				if (e.target === this.dialog)
					this.isOverlayMousedown = true;
			});
			this.dialog.addEventListener('click', (e) => {
				if (e.target != this.list.input && this.list.input.innerText.trim() != "")
				{
					const text = this.list.input.innerText.trim();
					if (text)
					{
						this.list.addBubble(text, 0);
						this.list.input.innerText = '';
					}
				}
			});
			this.dialog.addEventListener('click', (e) => {
				if (e.target === this.dialog && this.isOverlayMousedown)
					this.closeModal();
				this.isOverlayMousedown = false;
			});
			this.querySelector(".address-submit").addEventListener('click', this.onSubmit.bind(this));
			this.querySelector(".address-cancel").addEventListener('click', this.closeModal.bind(this));
		}
		/*
		function parseAddresses(rawText) {
			const lines = rawText.split('\n').filter(line => line.trim() !== '');
			return lines.map(line => {
				const parts = line.split(',').map(p => p.trim());
				return {
					address1: parts[0],
					city:	 parts[1],
					province: parts[2],
					zip:	  parts[3],
					country:  parts[4]
				};
			});
		}*/
		async openModal()
		{
			this.list.data.forEach(line => this.list.removeBubble(line.id));

			try {
				const cartRes = await fetch('/cart.js');
				if (cartRes.ok) {
					const cartData = await cartRes.json();
					const addrs = JSON.parse(cartData.attributes?._extra_addresses || '[]');
					if (addrs.length > 0) this.list.importText(addrs);
				}
			} catch (_) {}
			this.dialog.classList.add('active');
			this.querySelector('.bubble-input').focus();
		}
		closeModal()
		{
			this.dialog.classList.remove('active');
			document.body.style.overflow = '';
			//document.dispatchEvent(new CustomEvent('cart:updated', { bubbles: true}));
			if (this.needRefresh == true)
				this.table.reloadTable();
			this.needRefresh = false;
		}
		validateForm()
		{
			if (this.list.input.innerText.trim() != "")
			{
				const text = this.list.input.innerText.trim();
				if (text)
				{
					this.list.addBubble(text, 0);
					this.list.input.innerText = '';
				}
			}
			/*const requiredFields = this.form.querySelectorAll('[required]');
			let isValid = true;

			requiredFields.forEach(field => {
				if (!field.value.trim()) {
					isValid = false;
					field.style.borderColor = '#dc3545';
				}
				else {
					field.style.borderColor = '';
				}
			});
			return isValid;*/
			return true;
		}
		async onSubmit(e)
		{
			e.preventDefault();
			if (this.validateForm() == false)
			{
				this.showError('Format incorrect. Please check your input.');
				return;
			}
			try {
				await fetch('/cart/update.js', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ attributes: { '_extra_addresses': JSON.stringify(this.list.data) } })
				});
				this.showSuccess('Address has been saved.');
				this.needRefresh = true;
				setTimeout(() => { this.hideMessages(); this.closeModal(); }, 1000);
			} catch (error) {
				this.showError('Failed to save address. Please try again.');
			}
		}
		showSuccess(message)
		{
			this.hideMessages();
			this.successMessage.textContent = message;
			this.successMessage.style.display = 'block';
		}
		showError(message)
		{
			this.hideMessages();
			this.errorMessage.textContent = message;
			this.errorMessage.style.display = 'block';
		}
		hideMessages()
		{
			this.successMessage.style.display = '';
			this.errorMessage.style.display = '';
		}
	}
	customElements.define('edit-address', EditAddressDlg);
});

})();
console.log(3);
