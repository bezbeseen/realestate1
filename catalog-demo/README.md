# Catalog Demo – Partner-Style Online Catalog

Standalone project with the **full** [getbeseen.bs.run](https://getbeseen.bs.run/) style catalog: production data + generated HTML. Everything is imported and generated from **production/data**.

## Structure

- **`production/`** – Source of truth: **data/categories.json** (sidebar nav) and **data/products.json** (all categories and products).
- **`build/build.js`** – Build script: reads production data and writes all HTML into **generated/**.
- **`generated/`** – Static site: index, **25 category hubs**, **27 product pages**, plus **assets/** (CSS, JS). One product (13oz Vinyl Banner) has a full configurator.

## Build (regenerate everything)

From the **catalog-demo** folder:

```bash
node build/build.js
```

This writes **index.html**, every **category hub** (e.g. real-estate, banners, advertising-flags, wall-art), and every **product page** (e.g. yard-sign-and-h-stake, 13oz-vinyl-banner, feather-flags). Existing **generated/assets/** (CSS, JS) are left unchanged.

## How to view

1. **Open in browser:** Open **`generated/index.html`** (double-click or File → Open).
2. **Local server:** From **catalog-demo**: `npx serve generated -l 3333` then open **http://localhost:3333**.

Links use `.html` so everything works from the file system (no server required).

## What’s included

- **Signs / Letters:** Channel Letters
- **Indoor / Outdoor Displays:** Advertising Flags, Banner Stands, Step and Repeat, Real Estate, A-Frames, Signicade, SEG, Trade Show, Event Tents, Table Throws, Hardware Only
- **Banners:** 13oz Vinyl (with configurator), 18oz Blockout, Backlit, Mesh, Indoor, Pole, 9oz Fabric, Blockout Fabric, Tension Fabric, Hand Banner
- **Large Format:** Wall Art, Murals, Adhesive, Rigid Signs/Magnets, Reflective, Dry Erase, DTF/UV DTF, Backlit Film, Window Cling, Posters, Styrene, Popup

See **production/README.md** for the data format and page types.
