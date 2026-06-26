const EXPORT_SECTION_ID = 'dailyfeed-export';
const PAGE_SIZE = 250;
const CONCURRENCY = 3;

const CSV_COLUMNS = [
  ['collection', 'Collection'],
  ['product_title', 'Product Title'],
  ['brand', 'Brand'],
  ['model', 'Model'],
  ['product_type', 'Product Type'],
  ['variant_title', 'Variant Title'],
  ['sku', 'SKU'],
  ['upc', 'UPC'],
  ['price', 'Price'],
  ['msrp', 'MSRP'],
  ['stock', 'Stock'],
  ['inventory_quantity', 'Inventory Quantity'],
  ['available', 'Available'],
  ['product_url', 'Product URL'],
  ['image_url', 'Image URL'],
];

function setButtonState(button, state, label) {
  const text = button.querySelector('.dailyfeed-download-button__text, .vc-dailyfeed-button-text');
  button.classList.toggle('is-loading', state === 'loading');
  button.classList.toggle('is-complete', state === 'complete');
  button.classList.toggle('is-error', state === 'error');
  button.disabled = state === 'loading';
  button.setAttribute('aria-busy', state === 'loading' ? 'true' : 'false');
  if (text && label) text.textContent = label;
}

function resetButton(button) {
  setButtonState(button, 'idle', 'Download this collection');
}

function buildExportUrl(page) {
  const url = new URL(window.location.href);
  url.searchParams.set('section_id', EXPORT_SECTION_ID);
  url.searchParams.set('page', String(page));
  url.searchParams.set('view', '');
  url.searchParams.delete('view');
  return url;
}

function parseExportPayload(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const script = doc.querySelector('[data-dailyfeed-export]');
  if (!script) throw new Error('Dailyfeed export section was not found.');
  return JSON.parse(script.textContent);
}

async function fetchExportPage(page) {
  const response = await fetch(buildExportUrl(page).toString(), {
    headers: { Accept: 'text/html' },
    credentials: 'same-origin',
  });
  if (!response.ok) throw new Error(`Dailyfeed export failed on page ${page}.`);
  return parseExportPayload(await response.text());
}

async function mapWithConcurrency(items, limit, callback, onProgress) {
  const results = new Array(items.length);
  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await callback(items[index]);
      completed += 1;
      if (onProgress) onProgress(completed, items.length);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function csvEscape(value) {
  const stringValue = value == null ? '' : String(value);
  if (/[",\r\n]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

function rowsToCsv(rows) {
  const header = CSV_COLUMNS.map(([, label]) => csvEscape(label)).join(',');
  const body = rows.map((row) => CSV_COLUMNS.map(([key]) => csvEscape(row[key])).join(','));
  return [header, ...body].join('\r\n');
}

function downloadCsv(csv, collectionHandle) {
  const date = new Date().toISOString().slice(0, 10);
  const safeHandle = collectionHandle || 'collection';
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `dailyfeed-${safeHandle}-${date}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

async function handleDownload(button) {
  try {
    setButtonState(button, 'loading', 'Preparing...');

    const firstPage = await fetchExportPage(1);
    const totalPages = Math.max(1, Number(firstPage.pagination?.pages || 1));
    const payloads = [firstPage];

    if (totalPages > 1) {
      setButtonState(button, 'loading', `Preparing 1/${totalPages}`);
      const pages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
      const rest = await mapWithConcurrency(
        pages,
        CONCURRENCY,
        fetchExportPage,
        (done) => setButtonState(button, 'loading', `Preparing ${done + 1}/${totalPages}`)
      );
      payloads.push(...rest);
    }

    const rows = payloads.flatMap((payload) => payload.rows || []);
    const collectionHandle = firstPage.collection?.handle || button.dataset.collectionHandle || 'collection';
    downloadCsv(rowsToCsv(rows), collectionHandle);

    setButtonState(button, 'complete', `Downloaded ${rows.length}`);
    window.setTimeout(() => resetButton(button), 1800);
  } catch (error) {
    console.error(error);
    setButtonState(button, 'error', 'Download failed');
    window.setTimeout(() => resetButton(button), 2600);
  }
}

function initDailyfeedButtons() {
  document.querySelectorAll('[data-dailyfeed-download]').forEach((button) => {
    if (button.dataset.dailyfeedBound === 'true') return;
    button.dataset.dailyfeedBound = 'true';
    button.addEventListener('click', () => handleDownload(button));
  });
}

initDailyfeedButtons();
document.addEventListener('shopify:section:load', initDailyfeedButtons);
