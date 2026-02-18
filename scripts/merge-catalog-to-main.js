#!/usr/bin/env node
/**
 * Merge Catalog Data into Main Site Products
 *
 * Enriches main site products.json with catalog data (bullets, prices, options).
 * Not all products align 1:1 — some main site products map to multiple catalog products.
 * Adds search-compatible fields (name, description, meta_description) for search-results.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN_PRODUCTS = path.join(ROOT, 'production stuff/data/products.json');
const CATALOG_PRODUCTS = path.join(ROOT, 'catalog-demo/production/data/products.json');
const OUTPUT = path.join(ROOT, 'production stuff/data/products.json');

/**
 * Maps main site product_id to catalog category slugs.
 * Multiple categories = catalog products from all will be merged as sub-products.
 */
const PRODUCT_TO_CATALOG = {
  // Signs
  channel_lettering: ['channel-letter'],
  flags: ['advertising-flags'],
  convex_flag: ['advertising-flags'],
  feather_angled_flag: ['advertising-flags'],
  teardrop_flag: ['advertising-flags'],
  rectangle_flag: ['advertising-flags'],
  econo_feather_flag: ['advertising-flags'],
  custom_pole_flag: ['advertising-flags'],
  retractable_banners: ['banner-stands'],
  a_frames: ['a-frame-and-sign-holders', 'signicade-a-frame'],
  yard_signs: ['real-estate'],  // yard-sign-and-h-stake
  commercial_signage: ['channel-letter', 'signicade-a-frame'],
  light_boxes: ['seg-products', 'backlit-film'],  // SEG backlit + backlit film configurator
  '3d_lettering': ['channel-letter'],
  window_graphics: ['premium-window-cling', 'adhesive-products'],
  aluminum_signs: ['rigid-signs-and-magnets'],
  magnets: ['rigid-signs-and-magnets'],
  // Prints
  banners: ['banners'],
  posters: ['posters'],
  decals: ['adhesive-products'],
  stickers: ['adhesive-products'],
  window_clings: ['premium-window-cling'],
  canvas_prints: ['wall-art'],
  photos: ['wall-art'],
  // Materials
  corrugated: ['rigid-signs-and-magnets'],  // coroplast
  foam_board: ['rigid-signs-and-magnets'],
  styrene: ['styrene', 'rigid-signs-and-magnets'],
  acrylic: ['rigid-signs-and-magnets', 'wall-art'],
  pvc_board: ['rigid-signs-and-magnets'],
  // Promotional
  booths: ['trade-show-products', 'seg-products'],
  table_cloths: ['table-throw'],
  tents: ['custom-event-tents'],
  // Real estate
  real_estate_business_cards: ['real-estate'],
  real_estate_banners: ['banners'],
  real_estate_flags: ['advertising-flags'],
  real_estate_convex_flag: ['advertising-flags'],
  real_estate_feather_angled_flag: ['advertising-flags'],
  real_estate_teardrop_flag: ['advertising-flags'],
  real_estate_rectangle_flag: ['advertising-flags'],
  real_estate_econo_feather_flag: ['advertising-flags'],
  real_estate_custom_pole_flag: ['advertising-flags'],
  real_estate_lawn_signs: ['real-estate'],
  real_estate_a_frames: ['real-estate', 'a-frame-and-sign-holders'],
};

/**
 * Preferred configurator slug per main product (when category has multiple configurator options).
 * Ensures we show the correct configurator, e.g. acrylic → acrylic-prints not magnets.
 */
const CONFIGURATOR_PREFERRED_SLUG = {
  banners: '13oz-vinyl-banner',
  real_estate_banners: '13oz-vinyl-banner',
  channel_lettering: 'standard-channel-letter',
  corrugated: 'coroplast',
  foam_board: 'foamcore',
  acrylic: 'acrylic-prints',
  aluminum_signs: 'aluminum-sandwich-board',
  decals: 'adhesive-vinyl',
  stickers: 'adhesive-vinyl',
  window_clings: 'premium-window-cling',
  window_graphics: 'premium-window-cling',
  canvas_prints: 'canvas-roll',
  photos: 'canvas-roll',
  posters: 'posters',
  magnets: 'magnets',
  pvc_board: 'pvc-board',
  light_boxes: 'backlit-film',
};

/** When set, only this catalog product (by slug) is merged; otherwise all from category. */
const CATALOG_SINGLE_SLUG = {
  convex_flag: 'convex-flag',
  feather_angled_flag: 'feather-angled-flag',
  teardrop_flag: 'teardrop-flag',
  rectangle_flag: 'rectangle-flag',
  econo_feather_flag: 'econo-feather-flag',
  custom_pole_flag: 'custom-pole-flag',
  real_estate_convex_flag: 'convex-flag',
  real_estate_feather_angled_flag: 'feather-angled-flag',
  real_estate_teardrop_flag: 'teardrop-flag',
  real_estate_rectangle_flag: 'rectangle-flag',
  real_estate_econo_feather_flag: 'econo-feather-flag',
  real_estate_custom_pole_flag: 'custom-pole-flag',
};

const CATALOG_SKIP_KEYS = new Set(['configuratorProducts']);

function loadJson(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function getCatalogProductsByCategory(catalog) {
  const byCategory = {};
  for (const [key, value] of Object.entries(catalog)) {
    if (CATALOG_SKIP_KEYS.has(key) || !value || !value.products) continue;
    byCategory[key] = value.products;
  }
  return byCategory;
}

function slugToProductId(slug) {
  return slug.replace(/-/g, '_');
}

function mergeProduct(mainProduct, catalogProducts, configuratorProducts) {
  const merged = { ...mainProduct };

  // Search-compatible aliases (search-results.html expects these)
  merged.name = mainProduct.product_name;
  merged.description = mainProduct.base_description || '';
  merged.meta_description = mainProduct.seo_description || '';

  if (!catalogProducts || catalogProducts.length === 0) {
    return merged;
  }

  merged.catalog_products = catalogProducts.map((p) => ({
    name: p.name,
    slug: p.slug,
    bullets: p.bullets || [],
    price: p.price,
    priceType: p.priceType,
    unit: p.unit || null,
    options: p.options || null,
  }));

  // If single catalog product with price, surface at top level for search
  if (catalogProducts.length === 1) {
    const p = catalogProducts[0];
    merged.bullets = p.bullets || [];
    merged.price = p.price;
    merged.priceType = p.priceType;
    merged.catalog_slug = p.slug;
  }

  // Add configurator_config if any catalog product has configurator data
  const cfgProducts = configuratorProducts || {};
  const preferredSlug = CONFIGURATOR_PREFERRED_SLUG[mainProduct.product_id];
  let cfg = null;
  if (preferredSlug && cfgProducts[preferredSlug] && (cfgProducts[preferredSlug].unitPrice != null || cfgProducts[preferredSlug].unitPrice === 0)) {
    cfg = cfgProducts[preferredSlug];
  } else {
    for (const p of catalogProducts) {
      const c = cfgProducts[p.slug];
      if (c && (c.unitPrice != null || c.unitPrice === 0)) { cfg = c; break; }
    }
  }
  if (cfg && (cfg.unitPrice != null || cfg.unitPrice === 0)) {
    merged.configurator_config = {
      unitPrice: cfg.unitPrice,
      minCharge: cfg.minCharge ?? null,
      perInch: cfg.perInch === true,
      unitLabel: cfg.unitLabel || 'per ft²',
      grommetOnly: cfg.grommetOnly === true,
      name: cfg.name || merged.product_name,
      bullets: cfg.bullets || [],
    };
  }

  return merged;
}

function run() {
  const mainProducts = loadJson(MAIN_PRODUCTS);
  const catalog = loadJson(CATALOG_PRODUCTS);
  const byCategory = getCatalogProductsByCategory(catalog);

  const merged = mainProducts.map((p) => {
    const categorySlugs = PRODUCT_TO_CATALOG[p.product_id];
    let catalogProducts = [];
    const seenSlugs = new Set();

    if (categorySlugs) {
      const singleSlug = CATALOG_SINGLE_SLUG[p.product_id];
      for (const catSlug of categorySlugs) {
        const prods = byCategory[catSlug] || [];
        for (const prod of prods) {
          if (prod.priceType === 'see-all') continue;
          if (singleSlug && prod.slug !== singleSlug) continue;
          if (seenSlugs.has(prod.slug)) continue;
          seenSlugs.add(prod.slug);
          catalogProducts.push(prod);
        }
      }
    }

    return mergeProduct(p, catalogProducts, catalog.configuratorProducts);
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(merged, null, 2));
  console.log(`Merged ${merged.length} products. Output: ${OUTPUT}`);
}

run();
