# SEMrush Audit Follow-up (getbeseen.com)

Quick reference for what was fixed in code vs what needs more info or server/config.

---

## ✅ Fixed in templates/source (deploy to see)

- **Canonical tags** on product and category pages (helps duplicate content).
- **Multiple H1** on Products and Services pages (second heading set to H2).
- **Missing meta description** on Cart, Success, Sign Shop Requirements Form.
- **Duplicate schema injection** removed (one LocalBusiness block, no GMB/Yelp fetch).
- **Shared product banner** so all product/category pages use the same layout.
- **llms.txt** created and copied to site root by build — confirm it’s uploaded so **https://getbeseen.com/llms.txt** works (fixes “Lims.txt not found” if SEMrush means llms.txt).

---

- **Service pages (mega export):** Meta now uses **seo_description** from data; canonical and OG/Twitter use **path**. Fixes duplicate title/meta for Fonts & Typography, Print Layout, SEO.
- **Industries template broken links:** `/services/commercial-signage` → `/products/signs/commercial-signage.html`; added `.html` to service links; `/services/real-estate/` → `/industries/real-estate.html`.

---

## 🔴 Need URLs/details from SEMrush to fix

- **8 broken internal links** — open the issue in SEMrush, export or copy the list of broken URLs, then we can fix links in templates/includes.
- **2 broken internal images** — same: get the image URLs from the report and we can fix paths (e.g. in `includes/image-helpers.html` or templates).
- **1 page with 4XX** — get the URL so we can redirect or fix the page.
- **85 invalid structured data items** — in SEMrush (or Google Rich Results Test), open the issue and see which pages and which property/type are invalid (e.g. missing `url`, wrong `@type`). With that list we can fix the JSON-LD in `includes/seo.html`, `index-template.html`, or product templates.

---

## 🟡 Duplicate titles / duplicate meta descriptions / duplicate content

- Product and category data in `data/products.json` and `data/categories.json` already have unique `page_title` and `seo_description` per item.
- Duplicates may be from: services sharing a pattern, location pages, or old URLs. To fix precisely we need either:
  - The list of **URLs that share the same title** (or same meta description) from SEMrush, or  
  - A decision to make titles/metas more unique (e.g. always append “| Santa Clara, CA” or category name) in templates.

---

## 🟠 Server / config (not in repo)

- **Uncached JS/CSS (2,143)** — set cache headers for `/assets/` on Bluehost (e.g. in .htaccess or cPanel).
- **Unminified JS/CSS (1,033)** — add a build step to minify, or use a CDN/plugin that minifies.
- **Low text/word count, content optimization** — add or expand text on the affected pages (need the page list from SEMrush).
- **HSTS (2 subdomains)** — enable HSTS in Bluehost/cPanel or server config for the subdomains.
- **Blocked external resources (41)** — if they’re needed for the site, adjust `robots.txt` or hosting so those URLs aren’t blocked.

---

## Next steps

1. **Re-upload** after the latest build so all template fixes and **llms.txt** are live.
2. **Confirm** https://getbeseen.com/llms.txt loads (fixes “Lims.txt not found” if that’s llms.txt).
3. **From SEMrush**, export or copy:
   - Broken internal links (URLs)
   - Broken internal images (URLs)
   - The 4XX page URL
   - For “invalid structured data,” which pages and what’s wrong (or share a sample of the errors).
4. **Optional:** In SEMrush, open “duplicate title” / “duplicate meta description” and note which URLs share the same value so we can make them unique in code or data.
