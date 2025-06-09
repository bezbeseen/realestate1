# Website Structure

This document outlines the primary file and directory structure for the Real Estate 1 website project.

## Root Directory

The root directory contains top-level pages, primary asset folders, and configuration files.

```
/
├── 📄 index.html
├── 📄 about.html
├── 📄 contact.html
├── 📄 cart.html
├── 📁 assets/
├── 📁 products/
├── 📁 includes_new/
└── ... (other pages and configuration files)
```

## `products/`

This directory contains all product pages and the main product template.

```
products/
├── 📄 TEMPLATE2.html      (✨ **Primary Product Template**)
├── 📄 TEMPLATE.html         (Legacy Template)
├── 📄 a-frames.html
├── 📄 banners.html
└── ... (other product-specific pages)
```

## `includes_new/`

This directory holds all the modern, reusable HTML partials that are included across the site. This is key for maintainability.

```
includes_new/
├── 📄 header.html         (Site header and main navigation)
├── 📄 footer.html         (Site footer and navigation links)
├── 📄 mobile-menu.html    (Pop-out mobile navigation)
├── 📄 cart-sidebar.html   (Slide-out cart display)
└── 📄 seo.html            (Handles all SEO meta tags and Google Analytics)
```

## `assets/`

This directory contains all static assets like stylesheets, JavaScript files, and images.

```
assets/
├── 📁 css/
│   ├── 📄 style.css       (Main stylesheet)
│   └── ... (Framework and library CSS)
├── 📁 js/
│   ├── 📄 app-initializer.js (🚀 **Core application logic for templates**)
│   ├── 📄 cart.js
│   ├── 📄 cart-display.js
│   └── ... (Vendor scripts)
├── 📁 images/
│   ├── 📁 logo/
│   ├── 📁 favicon/
│   └── ... (Product and site images)
└── 📁 fonts/
```

---

### How It Works:

1.  A user visits a page like `products/banners.html`.
2.  That page uses the `<div w3-include-html="..."></div>` tag to pull in components from `includes_new/` (like the header, footer, and SEO tags).
3.  The `assets/js/app-initializer.js` script runs, which handles:
    -   Executing the HTML includes.
    -   Initializing the mobile menu.
    -   Making product options (variants, quantity) interactive.
    -   Handling "Add to Cart" functionality.
    -   Dynamically populating SEO tags from the product data.

This structure ensures that the site is clean, fast, and easy to update. 