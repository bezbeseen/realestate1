# Production – Catalog Source Data

This folder is the **production** instance: data and conventions used to build the catalog. The **generated** folder is the current static output for preview.

## Data

- **data/categories.json** – Top-level groups and category tree (sidebar nav).
- **data/products.json** – Products per category: slug, name, price type (per ft² or fixed), options for configurator.

## Page types

1. **Homepage** – Banners strip, Top Categories grid, Feature Products grid.
2. **Category hub** – One heading, one line of copy, product cards (image, bullets, “Starting at $X” or fixed price).
3. **Product detail** – Configurator (width/height → area, options) + Description / Spec / File Setup tabs; “Get quote” or “Add to cart” with current config.

## Build (future)

A build script would:

1. Load `data/categories.json` and `data/products.json`.
2. For each category → write `generated/<slug>.html` (category hub).
3. For each product with configurator → write `generated/<slug>.html` (product detail).
4. Write `generated/index.html` from a homepage template + featured lists.

No build script is included in this demo; **generated** is written by hand for preview.
