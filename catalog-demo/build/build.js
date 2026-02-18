#!/usr/bin/env node
/**
 * Build script: reads production/data and writes all HTML into generated/.
 * Keeps generated/assets/ (css, js) unchanged.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRODUCTION = path.join(ROOT, 'production', 'data');
const GENERATED = path.join(ROOT, 'generated');

const categories = JSON.parse(fs.readFileSync(path.join(PRODUCTION, 'categories.json'), 'utf8'));
const productsData = JSON.parse(fs.readFileSync(path.join(PRODUCTION, 'products.json'), 'utf8'));
const productDetailsPath = path.join(PRODUCTION, 'product-details.json');
const productDetails = fs.existsSync(productDetailsPath)
  ? JSON.parse(fs.readFileSync(productDetailsPath, 'utf8'))
  : {};
const configuratorProducts = productsData.configuratorProducts || {};
const categoryData = { ...productsData };
delete categoryData.configuratorProducts;

// slug -> group id for contextual footer/CTA
const slugToGroup = {};
for (const group of categories.groups || []) {
  for (const item of group.items || []) {
    slugToGroup[item.slug] = group.id;
  }
}
function getFooterForSlug(slug) {
  return slugToGroup[slug] === 'banners'
    ? { href: 'banners.html', label: 'SHOP ALL BANNERS' }
    : { href: 'index.html', label: 'View full catalog' };
}

function escape(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sidebarHtml() {
  let out = '';
  for (const group of categories.groups) {
    out += `      <h3>${escape(group.name)}</h3>\n      <ul>\n`;
    for (const item of group.items) {
      out += `        <li><a href="${escape(item.slug)}.html">${escape(item.name)}</a></li>\n`;
    }
    out += '      </ul>\n';
  }
  return out;
}

function headerNavHtml() {
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'real-estate.html', label: 'Real Estate' },
    { href: 'banners.html', label: 'Banners' },
  ];
  return links.map(l => `<a href="${l.href}">${escape(l.label)}</a>`).join('\n        ');
}

function wrapPage(title, mainContent, options = {}) {
  const script = options.configurator ? '\n  <script src="assets/js/configurator.js"></script>' : '';
  const footer = options.footerLink || { href: 'index.html', label: 'View full catalog' };
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} – Online Catalog</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="index.html">Online Catalog</a>
      <nav>
        ${headerNavHtml()}
      </nav>
    </div>
  </header>

  <div class="layout">
    <aside class="sidebar">
${sidebarHtml()}    </aside>

    <main class="main">
${mainContent}
    </main>
  </div>

  <footer class="footer">
    <a href="${escape(footer.href)}">${escape(footer.label)}</a>
  </footer>${script}
</body>
</html>
`;
}

function writeFile(slug, html) {
  const file = path.join(GENERATED, slug + '.html');
  fs.writeFileSync(file, html, 'utf8');
  console.log('  ' + slug + '.html');
}

// ---------- Index ----------
const indexMain = `
      <h1 class="page-title">Welcome</h1>
      <p class="page-subtitle">Online Catalog – signs, displays, banners, and large format.</p>

      <p><a href="demo-pricing.html" class="btn-primary">Pricing demo (master sheet instance)</a> — configurator driven by product-pricing.js only.</p>

      <h2 class="section-title">Banners – See All</h2>
      <div class="strip">
        <a href="13oz-vinyl-banner.html">13oz Vinyl Banner</a>
        <a href="pole-banner-set.html">Pole Banner</a>
        <a href="mesh-banners.html">Mesh Banner</a>
        <a href="fabric-banner-9oz-wrinkle-free.html">9oz Fabric Banner</a>
      </div>

      <h2 class="section-title">Large Format</h2>
      <div class="strip">
        <a href="wall-art.html">Wall Art</a>
        <a href="wall-murals.html">Wall Murals</a>
        <a href="adhesive-products.html">Adhesive Products</a>
        <a href="rigid-signs-and-magnets.html">Rigid Signs and Magnets</a>
        <a href="reflective-products.html">Reflective</a>
        <a href="dry-erase-products.html">Dry Erase</a>
      </div>

      <h2 class="section-title">Top Categories</h2>
      <div class="grid">
        <a href="banner-stands.html"><span class="name">Banner Stands</span></a>
        <a href="advertising-flags.html"><span class="name">Advertising Flags</span></a>
        <a href="trade-show-products.html"><span class="name">Trade Show Products</span></a>
        <a href="table-throw.html"><span class="name">Table Throw</span></a>
        <a href="rigid-signs-and-magnets.html"><span class="name">Rigid Signs and Magnets</span></a>
        <a href="custom-event-tents.html"><span class="name">Custom Event Tents</span></a>
        <a href="adhesive-products.html"><span class="name">Adhesive Products</span></a>
        <a href="wall-art.html"><span class="name">Wall Art</span></a>
      </div>

      <h2 class="section-title">Feature Products</h2>
      <div class="grid">
        <a href="step-repeat-backdrop.html"><span class="name">Step and Repeat Backdrop</span></a>
        <a href="real-estate.html"><span class="name">Yard Sign</span></a>
        <a href="signicade-a-frame.html"><span class="name">Signicade A-Frame</span></a>
        <a href="posters.html"><span class="name">Posters</span></a>
        <a href="premium-window-cling.html"><span class="name">Premium Window Cling</span></a>
        <a href="13oz-vinyl-banner.html"><span class="name">13oz Vinyl Banner</span></a>
      </div>

      <p style="margin-top: 2rem;"><a href="banners.html" class="btn-primary">SHOP ALL BANNERS</a></p>
`;
writeFile('index', wrapPage('Welcome', indexMain));

// ---------- Category hubs ----------
// simpleProductMain is used below for single-product-same-slug hubs; define paragraph helper first
function paragraphsToHtml(val, fallback) {
  const str = typeof val === 'string' ? val : (Array.isArray(val) && val.length ? val.map(String).join('\n') : '');
  if (!str || !str.trim()) return `<p>${escape(fallback || 'Contact us for details and pricing.')}</p>`;
  const arr = Array.isArray(val) ? val : [val];
  return arr.map(p => `<p>${escape(String(p).trim())}</p>`).join('\n        ');
}
const detailFallbacks = {
  description: 'Product overview and features. Contact us for full description and usage details.',
  spec: 'Materials, dimensions, and specifications. Contact us for complete specs.',
  fileSetup: 'Artwork and file requirements. Contact us for file setup and prep guidelines.'
};
function simpleProductMainForHub(name, product, detail) {
  const bullets = (product.bullets || []).map(b => `<li>${escape(b)}</li>`).join('\n        ');
  const options = product.options && product.options.length > 0 ? product.options : null;
  let orderBoxPrice;
  if (options && options.length > 0) {
    orderBoxPrice = '<ul class="product-options-list">' + options.map(o => `<li><span class="option-unit">${escape(o.unit)}</span> <span class="total">${escape(o.price)}</span></li>`).join('') + '</ul>';
  } else if (product.price) {
    orderBoxPrice = `<div class="config-summary">Price: <span class="total">${escape(product.price)}${product.unit ? ' ' + escape(product.unit) : ''}</span></div>`;
  } else {
    orderBoxPrice = '<div class="config-summary">Contact us for pricing</div>';
  }
  const desc = paragraphsToHtml(detail && detail.description, detailFallbacks.description);
  const spec = paragraphsToHtml(detail && detail.spec, detailFallbacks.spec);
  const fileSetup = paragraphsToHtml(detail && detail.fileSetup, detailFallbacks.fileSetup);
  return `
      <h1 class="page-title">${escape(name)}</h1>
      <p class="page-subtitle">${escape(product.subtitle || '')}</p>
      <ul style="margin: 0 0 1.5rem 1.25rem; color: var(--text-muted);">
        ${bullets}
      </ul>

      <div class="configurator product-order-box">
        <h3>${escape(name)}</h3>
        ${orderBoxPrice}
        <button type="button" class="btn-primary">Get quote for this product</button>
      </div>

      <div class="tabs">
        <a href="#description" class="active">Description</a>
        <a href="#spec">Spec</a>
        <a href="#file-setup">File Setup</a>
      </div>
      <div class="tab-content">
        <h4 id="description">Description</h4>
        ${desc}
        <h4 id="spec">Spec</h4>
        ${spec}
        <h4 id="file-setup">File Setup</h4>
        ${fileSetup}
      </div>

      <p style="margin-top: 2rem;"><a href="index.html">← Back to catalog</a></p>
`;
}

for (const [catSlug, cat] of Object.entries(categoryData)) {
  if (!cat.products || !Array.isArray(cat.products)) continue;

  // Single product with same slug as category → render as full product page (description/spec/file setup)
  const singleProductSameSlug = cat.products.length === 1 && cat.products[0].slug === catSlug;
  if (singleProductSameSlug) {
    const p = cat.products[0];
    const detail = productDetails[catSlug] || null;
    const main = simpleProductMainForHub(cat.title, { ...p, subtitle: cat.subtitle }, detail);
    writeFile(catSlug, wrapPage(cat.title, main, { footerLink: getFooterForSlug(catSlug) }));
    continue;
  }

  let cards = '';
  for (const p of cat.products) {
    const priceHtml = p.priceType === 'see-all'
      ? `<span class="cta">${escape(p.cta || 'See All')} →</span>`
      : p.price
        ? `<span class="price">${(p.priceType === 'per-sqft' || p.priceType === 'per-inch') ? 'Starting at ' + escape(p.price) + ' ' + (p.unit || (p.priceType === 'per-inch' ? 'per inch' : 'per ft²')) : escape(p.price)}${p.unit && p.priceType !== 'per-sqft' && p.priceType !== 'per-inch' ? ' ' + escape(p.unit) : ''}</span>\n            <span class="cta">View product →</span>`
        : `<span class="cta">Get quote →</span>`;
    const bullets = (p.bullets || []).map(b => `<li>${escape(b)}</li>`).join('\n            ');
    cards += `
        <article class="product-card">
          <a href="${escape(p.slug)}.html">
            <div class="thumb">${escape(p.name)}</div>
            <h3>${escape(p.name)}</h3>
            <ul>
            ${bullets}
            </ul>
            ${priceHtml}
          </a>
        </article>`;
  }
  const cta = getFooterForSlug(catSlug);
  const main = `
      <h1 class="page-title">${escape(cat.title)}</h1>
      <p class="page-subtitle">${escape(cat.subtitle)}</p>

      <div class="product-grid">
${cards}
      </div>

      <p style="margin-top: 2rem;"><a href="${escape(cta.href)}" class="btn-primary">${escape(cta.label)}</a></p>
`;
  writeFile(catSlug, wrapPage(cat.title, main, { footerLink: cta }));
}

// ---------- Product pages ----------
const configuratorSqftBlock = (name, unitPrice, fullOptions, opts = {}) => {
  const minCharge = opts.minCharge != null ? Number(opts.minCharge) : null;
  const grommetOnly = opts.grommetOnly === true;
  const perInch = opts.perInch === true;
  const areaLabel = perInch ? 'Linear inches' : 'Area';
  const areaUnit = perInch ? 'in.' : 'ft²';
  const materialOption = fullOptions && !grommetOnly && !perInch ? `
        <div class="config-row">
          <label>Material</label>
          <select>
            <option>13oz. Matte Vinyl Banner</option>
          </select>
        </div>` : '';
  const sidesBlock = (grommetOnly || perInch) ? '' : `
        <div class="config-row">
          <label for="config-sides"># of Sides</label>
          <select id="config-sides">
            <option value="1">1 Side</option>
            <option value="2">2 Sides</option>
          </select>
        </div>`;
  const poleHemGrommet = (grommetOnly || perInch) ? (grommetOnly ? `
        <div class="config-row">
          <label for="config-grommet">Grommets</label>
          <select id="config-grommet">
            <option value="0">None</option>
            <option value="1">Grommets (All four corners)</option>
            <option value="2">Grommets (Top two corners)</option>
          </select>
        </div>
        <div class="config-row">
          <label>Material</label>
          <p style="margin: 0;">.020" White Polystyrene Film</p>
        </div>
        <div class="config-row">
          <label>Print</label>
          <p style="margin: 0;">UV Ink – Matte Finish</p>
        </div>` : perInch ? `
        <div class="config-row">
          <label>Material</label>
          <p style="margin: 0;">.040 aluminum returns, acrylic faces</p>
        </div>
        <div class="config-row">
          <label>Illumination</label>
          <p style="margin: 0;">Front lit / Dual lit, LED</p>
        </div>` : '') : `
        <div class="config-row">
          <label>Pole Pocket</label>
          <select>
            <option>No Pole Pockets</option>
            <option>4" – Top Only (fits 2" pole)</option>
            <option>3" – Top Only (fits 1.5" pole)</option>
            <option>2" – Top Only (fits 1" pole)</option>
            <option>4" – Top and Bottom</option>
            <option>3" – Top and Bottom</option>
            <option>2" – Top and Bottom</option>
          </select>
        </div>
        <div class="config-row">
          <label>Hem</label>
          <select>
            <option>All Sides</option>
            <option>No Hem</option>
          </select>
        </div>
        <div class="config-row">
          <label>Grommet</label>
          <select>
            <option>Every 2' All Sides</option>
            <option>No Grommet</option>
            <option>4 Corner Only</option>
            <option>Every 2' Left & Right</option>
            <option>Every 2' Top & Bottom</option>
          </select>
        </div>`;
  const minChargeAttr = minCharge != null ? ` data-min-charge="${escape(String(minCharge))}"` : '';
  const perInchAttr = perInch ? ' data-per-inch="true"' : '';
  const minChargeNote = minCharge != null ? `<p style="margin: 0.25rem 0 0; font-size: 0.9em; color: var(--text-muted);">min charge $${minCharge.toFixed(2)}</p>` : '';
  const areaDisplay = perInch ? `<span id="config-area">0</span> in. (perimeter)` : `<span id="config-area">0.00</span> ft²`;
  return `
      <div class="configurator" data-unit-price="${escape(String(unitPrice))}"${minChargeAttr}${perInchAttr}>
        <h3>${escape(name)}</h3>
        <div class="config-row inline">
          <div class="config-row">
            <label for="config-width">Width (in.)</label>
            <input type="number" id="config-width" min="0" step="1" value="${(grommetOnly || perInch) ? '0' : '24'}" placeholder="0">
          </div>
          <div class="config-row">
            <label for="config-height">Height (in.)</label>
            <input type="number" id="config-height" min="0" step="1" value="${(grommetOnly || perInch) ? '0' : '36'}" placeholder="0">
          </div>
        </div>
        <div class="config-row">
          <label>${areaLabel}</label>
          <p style="margin: 0;">${areaDisplay}</p>
          ${minChargeNote}
        </div>${sidesBlock}${materialOption}${poleHemGrommet}
        <div class="config-summary">
          Total: <span id="config-total" class="total">$0.00</span>
        </div>
        <button type="button" class="btn-primary">Get quote for this configuration</button>
      </div>`;
};

const configuratorMain = (name, unitPrice, bullets, fullOptions, detail, configOpts = {}, ctaLink = { href: 'index.html', label: 'View full catalog' }) => {
  const bulletList = (bullets || []).map(b => `<li>${escape(b)}</li>`).join('\n        ');
  const desc = paragraphsToHtml(detail && detail.description, detailFallbacks.description);
  const spec = paragraphsToHtml(detail && detail.spec, detailFallbacks.spec);
  const fileSetup = paragraphsToHtml(detail && detail.fileSetup, detailFallbacks.fileSetup);
  const defaultDesc = '<p>We use a premium heavyweight 13 oz. scrim vinyl banner. This material looks great indoors and is designed to stand up to the elements outdoors. Typically used for billboards, building wraps, banners, event flags, trade show signage, parades, and more.</p><p>Standard hems and grommets are no extra charge.</p>';
  const defaultSpec = '<p><strong>Features:</strong> Double sided = single-ply printed front and back. Indoor and outdoor use, waterproof and UV safe.</p>';
  const defaultFile = '<p>Double sided = two separate files. No crop marks or bleeds. Artwork to ordered size. Max 300MB. Resolution 150 dpi. Color space CMYK. Formats: JPEG or PDF.</p>';
  return `
      <h1 class="page-title">${escape(name)}</h1>
      <p class="page-subtitle"><strong>$${unitPrice} ${configOpts.perInch ? 'per inch' : 'per ft²'}</strong>${configOpts.minCharge != null ? ` &nbsp;|&nbsp; min charge $${Number(configOpts.minCharge).toFixed(2)}` : ''}</p>
      <ul style="margin: 0 0 1.5rem 1.25rem; color: var(--text-muted);">
        ${bulletList}
      </ul>

      ${configuratorSqftBlock(name, unitPrice, fullOptions, configOpts)}

      <div class="tabs">
        <a href="#description" class="active">Description</a>
        <a href="#spec">Spec</a>
        <a href="#file-setup">File Setup</a>
      </div>
      <div class="tab-content">
        <h4 id="description">Description</h4>
        ${detail && detail.description ? desc : defaultDesc}
        <h4 id="spec">Spec</h4>
        ${detail && detail.spec ? spec : defaultSpec}
        <h4 id="file-setup">File Setup</h4>
        ${detail && detail.fileSetup ? fileSetup : defaultFile}
      </div>

      <p style="margin-top: 2rem;"><a href="${escape(ctaLink.href)}" class="btn-primary">${escape(ctaLink.label)}</a></p>
`;
};

const simpleProductMain = (name, product, backSlug, backTitle, detail, ctaLink = { href: 'index.html', label: 'View full catalog' }) => {
  const bullets = (product.bullets || []).map(b => `<li>${escape(b)}</li>`).join('\n        ');
  const options = product.options && product.options.length > 0 ? product.options : null;
  const hasMultipleOptions = options && options.length > 1;
  const minPriceOption = hasMultipleOptions && options.reduce((min, o) => {
    const p = parseFloat(String(o.price).replace(/[^0-9.]/g, '')) || 0;
    const m = parseFloat(String(min.price).replace(/[^0-9.]/g, '')) || 0;
    return p < m ? o : min;
  });
  const priceLine = product.price
    ? (hasMultipleOptions && minPriceOption ? `<p class="page-subtitle"><strong>From ${escape(minPriceOption.price)}</strong> – multiple sizes</p>` : `<p class="page-subtitle"><strong>${escape(product.price)}${product.unit ? ' ' + escape(product.unit) : ''}</strong></p>`)
    : '';
  let orderBoxPrice;
  if (options && options.length > 0) {
    orderBoxPrice = '<ul class="product-options-list">' + options.map(o => `<li><span class="option-unit">${escape(o.unit)}</span> <span class="total">${escape(o.price)}</span></li>`).join('') + '</ul>';
  } else if (product.price) {
    orderBoxPrice = `<div class="config-summary">Price: <span class="total">${escape(product.price)}${product.unit ? ' ' + escape(product.unit) : ''}</span></div>`;
  } else {
    orderBoxPrice = '<div class="config-summary">Contact us for pricing</div>';
  }
  const desc = paragraphsToHtml(detail && detail.description, detailFallbacks.description);
  const spec = paragraphsToHtml(detail && detail.spec, detailFallbacks.spec);
  const fileSetup = paragraphsToHtml(detail && detail.fileSetup, detailFallbacks.fileSetup);
  return `
      <h1 class="page-title">${escape(name)}</h1>
      ${priceLine}
      <ul style="margin: 0 0 1.5rem 1.25rem; color: var(--text-muted);">
        ${bullets}
      </ul>

      <div class="configurator product-order-box">
        <h3>${escape(name)}</h3>
        ${orderBoxPrice}
        <button type="button" class="btn-primary">Get quote for this product</button>
      </div>

      <div class="tabs">
        <a href="#description" class="active">Description</a>
        <a href="#spec">Spec</a>
        <a href="#file-setup">File Setup</a>
      </div>
      <div class="tab-content">
        <h4 id="description">Description</h4>
        ${desc}
        <h4 id="spec">Spec</h4>
        ${spec}
        <h4 id="file-setup">File Setup</h4>
        ${fileSetup}
      </div>

      <p style="margin-top: 1rem;"><a href="${escape(backSlug)}.html">← Back to ${escape(backTitle)}</a></p>
      <p style="margin-top: 0.5rem;"><a href="${escape(ctaLink.href)}" class="btn-primary">${escape(ctaLink.label)}</a></p>
`;
};

function getCategorySlugForProduct(productSlug) {
  for (const [catSlug, cat] of Object.entries(categoryData)) {
    if (!cat.products) continue;
    if (cat.products.some(p => p.slug === productSlug)) return catSlug;
  }
  return 'index';
}

const writtenProducts = new Set();
for (const [catSlug, cat] of Object.entries(categoryData)) {
  if (!cat.products || !Array.isArray(cat.products)) continue;
  for (const p of cat.products) {
    if (writtenProducts.has(p.slug)) continue;
    if (categoryData[p.slug] && !configuratorProducts[p.slug]) continue; // slug is a category hub; keep hub unless we have a configurator product page for it
    writtenProducts.add(p.slug);
    const config = configuratorProducts[p.slug];
    const backSlug = getCategorySlugForProduct(p.slug);
    const backTitle = (categoryData[backSlug] && categoryData[backSlug].title) || 'Catalog';
    const cta = getFooterForSlug(backSlug);
    if (config) {
      const configOpts = { minCharge: config.minCharge, grommetOnly: config.grommetOnly === true, perInch: config.perInch === true };
      writeFile(p.slug, wrapPage(config.name, configuratorMain(config.name, config.unitPrice, config.bullets, config.fullOptions === true, productDetails[p.slug], configOpts, cta), { configurator: true, footerLink: cta }));
    } else {
      const detail = productDetails[p.slug] || null;
      writeFile(p.slug, wrapPage(p.name, simpleProductMain(p.name, p, backSlug, backTitle, detail, cta), { footerLink: cta }));
    }
  }
}

console.log('\nDone. Generated index + ' + Object.keys(categoryData).length + ' category hubs + ' + writtenProducts.size + ' product pages.');
