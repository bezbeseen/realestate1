# Dynamic Pricing & Product Options — Main Site Integration

This doc captures the **configurator and dynamic pricing** behavior from the catalog-demo so you can reuse it on your main site. No catalog-specific context required.

**Main-site integration:** You do **not** need to deploy the full catalog-demo. Add the master pricing script (`product-pricing.js`), the apply script (`apply-pricing-from-master.js`), and the configurator snippet (or `configurator.js`) to your main site; the rest of this doc describes the HTML/data pattern.

---

## 1. What you get

- **Size-based pricing**: User enters width (in.) and height (in.). Total updates live.
- **Two pricing modes**:
  - **Per square foot**: `total = (width × height / 144) × unitPrice × sides` (optional 1 or 2 sides).
  - **Per linear inch** (e.g. channel letters): `total = 2 × (width + height) × unitPrice`.
- **Minimum charge**: If set, `total = max(minCharge, calculatedTotal)`.
- **Product options**: Fixed options with prices (e.g. size A = $X, size B = $Y) for non-calculated products.

---

## 2. Script (drop-in)

Use **one** configurator block per page. The script looks for `.configurator[data-unit-price]`.

**Required IDs:** `config-width`, `config-height`, `config-area`, `config-total`.  
**Optional:** `config-sides` (select with value `"1"` or `"2"`) for per-ft² pricing.

```js
// configurator.js — include on any product page with a size-based configurator
(function () {
  var box = document.querySelector('.configurator[data-unit-price]');
  if (!box) return;
  var unitPrice = parseFloat(box.getAttribute('data-unit-price')) || 0;
  var minCharge = box.hasAttribute('data-min-charge') ? parseFloat(box.getAttribute('data-min-charge')) : null;
  var perInch = box.getAttribute('data-per-inch') === 'true';
  var widthIn = document.getElementById('config-width');
  var heightIn = document.getElementById('config-height');
  var areaEl = document.getElementById('config-area');
  var totalEl = document.getElementById('config-total');
  var sidesSelect = document.getElementById('config-sides');

  function toNum(val) { return Math.max(0, parseFloat(val) || 0); }
  function sqft(w, h) { return (w * h) / 144; }
  function perimeterInches(w, h) { return 2 * (w + h); }

  function update() {
    var w = toNum(widthIn && widthIn.value);
    var h = toNum(heightIn && heightIn.value);
    var total;
    if (perInch) {
      var linearIn = perimeterInches(w, h);
      total = linearIn * unitPrice;
      if (areaEl) areaEl.textContent = Math.round(linearIn);
    } else {
      var area = sqft(w, h);
      var sides = sidesSelect && sidesSelect.value === '2' ? 2 : 1;
      total = area * unitPrice * sides;
      if (areaEl) areaEl.textContent = area.toFixed(2);
    }
    if (minCharge != null && !isNaN(minCharge)) total = Math.max(minCharge, total);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  if (widthIn) widthIn.addEventListener('input', update);
  if (heightIn) heightIn.addEventListener('input', update);
  if (sidesSelect) sidesSelect.addEventListener('change', update);
  update();
})();
```

---

## 3. HTML pattern and data attributes

**Container:** one element with class `configurator` and the data attributes below.

| Attribute           | Required | Meaning |
|--------------------|----------|---------|
| `data-unit-price`  | Yes      | Price per ft² or per inch (number, e.g. `19.8` or `4.39`). |
| `data-min-charge`  | No       | Minimum total (e.g. `32`). |
| `data-per-inch`    | No       | If `"true"`, use perimeter × unit price instead of area. |

**Per square foot (e.g. banners, styrene):**

```html
<div class="configurator" data-unit-price="19.8" data-min-charge="32">
  <h3>Product Name</h3>
  <div class="config-row">
    <label for="config-width">Width (in.)</label>
    <input type="number" id="config-width" min="0" step="1" value="24">
  </div>
  <div class="config-row">
    <label for="config-height">Height (in.)</label>
    <input type="number" id="config-height" min="0" step="1" value="36">
  </div>
  <div class="config-row">
    <label>Area</label>
    <p><span id="config-area">0.00</span> ft²</p>
  </div>
  <div class="config-row">
    <label for="config-sides"># of Sides</label>
    <select id="config-sides">
      <option value="1">1 Side</option>
      <option value="2">2 Sides</option>
    </select>
  </div>
  <div class="config-summary">
    Total: <span id="config-total" class="total">$0.00</span>
  </div>
  <button type="button" class="btn-primary">Get quote</button>
</div>
<script src="path/to/configurator.js"></script>
```

**Per inch (e.g. channel letters):**

```html
<div class="configurator" data-unit-price="4.39" data-per-inch="true" data-min-charge="50">
  <!-- same width/height inputs -->
  <p><span id="config-area">0</span> in. (perimeter)</p>
  <div class="config-summary">Total: <span id="config-total" class="total">$0.00</span></div>
</div>
```

On the main site, output `data-unit-price`, `data-min-charge`, and `data-per-inch` from your product/CMS data so each product page gets the right values.

---

## 4. Product options (fixed sizes/prices)

For products with fixed options (e.g. “Small 9 ft = $196.83”, “Large 14 ft = $209.85”), no script is needed — just show the list and use your existing “Get quote” or add-to-cart. Example structure you can drive from data:

```html
<div class="configurator product-order-box">
  <h3>Feather Flag</h3>
  <ul class="product-options-list">
    <li><span class="option-unit">Small 9 ft</span> <span class="total">$196.83</span></li>
    <li><span class="option-unit">Medium 10.5 ft</span> <span class="total">$196.83</span></li>
    <li><span class="option-unit">Large 14 ft</span> <span class="total">$209.85</span></li>
  </ul>
  <button type="button" class="btn-primary">Get quote for this product</button>
</div>
```

You can later wire the selected option to a form or cart.

---

## 5. Marrying with the main site

1. **Add the script** to your main site (e.g. `assets/js/configurator.js`) and include it on product pages that have a size-based configurator.
2. **Store per-product values** in your CMS or product data: `unitPrice`, `minCharge` (optional), `perInch` (optional boolean).
3. **Render one configurator block per product** with the correct `data-unit-price`, `data-min-charge`, and `data-per-inch` from that product.
4. **Keep IDs** `config-width`, `config-height`, `config-area`, `config-total` (and `config-sides` if you use sides). If you have multiple configurators on one page, you’d need to either use one block per page or extend the script to support multiple instances (e.g. by looping over `.configurator[data-unit-price]` and scoping inputs by container).

---

## 6. File reference (in this repo)

- **Script:** `catalog-demo/generated/assets/js/configurator.js`
- **Example per-ft² + min charge:** `generated/styrene.html` (around line 82).
- **Example per-ft² + sides:** `generated/vinyl-banner-backlit.html` (around line 80).
- **Product options list:** any hub or product page with `product-options-list` (e.g. built from `products.json` `options` array).

Use this doc as the single reference when implementing dynamic pricing and product options on the main site.

---

## 7. Master pricing — three sheets (JS)

One JS file, **three sheets** by pricing model. Edit in one place; use on the main site or in builds.

**File:** `catalog-demo/generated/assets/js/product-pricing.js` (or copy to your main site)

**Sheets:**

| Sheet | Use case | Shape |
|-------|----------|--------|
| **BY_SQFT** | Vinyl banners, styrene, rigid, adhesive, reflective, DTF, channel letters | `name`, `unitPrice`, `minCharge?`, `perInch?` |
| **STATIC_BY_SIZE** | A-frames, tents, flags — fixed price per size/style | `name`, `options: [ { unit, price } ]` or `price`, `unit` |
| **BY_QUANTITY_VARIANTS** | Business cards: quantity tiers + variants | `name`, `quantityTiers: [ { qty, price } ]`, `variants: [ { id, name, priceMod } ]` |

**API (global `ProductPricing`):**

| Method | Returns |
|--------|--------|
| `ProductPricing.getProduct(slug)` | Full product + `pricingType: 'bySqFt' \| 'staticBySize' \| 'byQuantityVariants'` |
| `ProductPricing.getPricingType(slug)` | `'bySqFt'`, `'staticBySize'`, `'byQuantityVariants'`, or `null` |
| `ProductPricing.getConfiguratorConfig(slug)` | `{ unitPrice, minCharge, perInch }` for BY_SQFT only |
| `ProductPricing.getOptions(slug)` | Options array for STATIC_BY_SIZE |
| `ProductPricing.BY_SQFT` / `.STATIC_BY_SIZE` / `.BY_QUANTITY_VARIANTS` | Raw objects (for reference tool or iteration) |

**Pricing reference (dev tool):** Open `pricing-reference.html` to see all three sheets laid out in one page — like a developer view of the data. No navigation to product pages; just the master data by type.

**Using the master sheet on the page:**

1. **Server/main site:** When rendering HTML, call `getConfiguratorConfig(slug)` (or require the module in Node) and output `data-unit-price`, `data-min-charge`, `data-per-inch` on the configurator block. No extra script in the browser.
2. **Client only:** Load `product-pricing.js`, then `apply-pricing-from-master.js`, then `configurator.js`. In HTML use `data-product-slug="<slug>"` (any slug in BY_SQFT, e.g. `vinyl-banner-backlit`, `styrene`) on the configurator div; the apply script sets the pricing attributes from the sheet before the configurator runs.

**Apply script:** `apply-pricing-from-master.js` — sets `data-unit-price` / `data-min-charge` / `data-per-inch` on any `.configurator[data-product-slug]` from the BY_SQFT sheet.
