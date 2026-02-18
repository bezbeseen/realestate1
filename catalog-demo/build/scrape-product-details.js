#!/usr/bin/env node
/**
 * Scrape product Description, Spec, File Setup from getbeseen.bs.run for each
 * product slug in products.json. Merges into product-details.json.
 * Usage: node build/scrape-product-details.js
 * Requires Node 18+ (fetch).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRODUCTION = path.join(ROOT, 'production', 'data');
const BASE_URL = 'https://getbeseen.bs.run';
const DELAY_MS = 800;

const productsData = JSON.parse(fs.readFileSync(path.join(PRODUCTION, 'products.json'), 'utf8'));
const categoryData = { ...productsData };
delete categoryData.configuratorProducts;
const categorySlugs = new Set(Object.keys(categoryData));

const productSlugs = new Set();
for (const cat of Object.values(categoryData)) {
  if (!cat.products || !Array.isArray(cat.products)) continue;
  for (const p of cat.products) {
    if (p.slug && !categorySlugs.has(p.slug)) productSlugs.add(p.slug);
  }
}
const slugs = process.env.SCRAPE_LIMIT ? [...productSlugs].sort().slice(0, Number(process.env.SCRAPE_LIMIT)) : [...productSlugs].sort();

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Parse SPA payload: div#app-data data-page is base64(URL-encoded(JSON)). item.description = [{ html, tab: "Description"|"Spec"|"File Setup" }] */
function parseAppDataPayload(html) {
  const m = html.match(/id=["']app-data["']\s+data-page=["']([^"']+)["']/);
  if (!m) return null;
  let str = m[1];
  try {
    if (/^[A-Za-z0-9+/=]+$/.test(str)) str = Buffer.from(str, 'base64').toString('utf8');
    str = decodeURIComponent(str);
    const data = JSON.parse(str);
    const item = data?.props?.page?.props?.item ?? data?.props?.item ?? data?.item ?? null;
    return item;
  } catch (_) {
    return null;
  }
}

async function fetchProduct(slug) {
  const url = `${BASE_URL}/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CatalogScraper/1.0 (compatible; build)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error(`  ${slug}: fetch failed`, err.message);
    return null;
  }
}

function parseProductPage(html) {
  const item = parseAppDataPayload(html);
  if (item && Array.isArray(item.description)) {
    let description = null, spec = null, fileSetup = null;
    for (const block of item.description) {
      const tab = (block.tab || '').trim();
      const text = stripHtml(block.html || '');
      if (!text) continue;
      if (/^description$/i.test(tab)) description = text;
      else if (/^spec$/i.test(tab)) spec = text;
      else if (/^file\s*setup$/i.test(tab)) fileSetup = text;
    }
    if (description || spec || fileSetup) return { description, spec, fileSetup };
  }
  return { description: null, spec: null, fileSetup: null };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const detailsPath = path.join(PRODUCTION, 'product-details.json');
  const existing = fs.existsSync(detailsPath)
    ? JSON.parse(fs.readFileSync(detailsPath, 'utf8'))
    : {};

  const updated = { ...existing };
  let ok = 0;
  let fail = 0;

  console.log(`Scraping ${slugs.length} product pages from ${BASE_URL}...\n`);

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    process.stdout.write(`  [${i + 1}/${slugs.length}] ${slug} ... `);
    const html = await fetchProduct(slug);
    await sleep(DELAY_MS);

    if (!html) {
      console.log('skip (no content)');
      fail++;
      continue;
    }

    const parsed = parseProductPage(html);
    const hasAny = parsed.description || parsed.spec || parsed.fileSetup;
    if (hasAny) {
      updated[slug] = {
        ...(existing[slug] || {}),
        ...parsed,
      };
      console.log('ok');
      ok++;
    } else {
      console.log('skip (no sections found)');
      fail++;
    }
  }

  fs.writeFileSync(detailsPath, JSON.stringify(updated, null, 2), 'utf8');
  console.log(`\nDone. Updated ${detailsPath}`);
  console.log(`  Scraped: ${ok}, skipped/failed: ${fail}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
