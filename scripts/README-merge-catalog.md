# Catalog → Main Site Merge

This script merges catalog data into the main site’s `products.json` so product pages and search can use catalog bullets, prices, and options.

## Run

```bash
node scripts/merge-catalog-to-main.js
```

Output: `production stuff/data/products.json`

## What’s added

| Field | Purpose |
|-------|---------|
| `name` | Alias for `product_name` (used by search-results) |
| `description` | Alias for `base_description` |
| `meta_description` | Alias for `seo_description` |
| `catalog_products` | Array of catalog sub-products with `name`, `slug`, `bullets`, `price`, `priceType`, `unit`, `options` |
| `bullets`, `price`, `catalog_slug` | Top-level only when a main site product maps to a single catalog product |

## Product mapping

Main site products are mapped to catalog categories in `PRODUCT_TO_CATALOG` inside the script. Edit that object to change which catalog data is merged.

## Next steps

- Product pages can render `catalog_products` to show bullets and prices.
- For configurators, add `product-pricing.js` and `configurator.js` from `catalog-demo/generated/assets/js/` and use `catalog_slug` or product slugs from `catalog_products` (see `DYNAMIC-PRICING-MAIN-SITE-INTEGRATION.md`).
