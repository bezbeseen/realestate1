/**
 * Optional: apply master pricing to configurator blocks by product slug.
 * Include after product-pricing.js and before configurator.js.
 *
 * If the configurator container has data-product-slug="styrene" (and no data-unit-price),
 * this script reads from ProductPricing and sets data-unit-price, data-min-charge, data-per-inch
 * so configurator.js can run without hardcoding prices in the HTML.
 */
(function () {
  'use strict';
  if (typeof ProductPricing === 'undefined') return;

  var boxes = document.querySelectorAll('.configurator[data-product-slug]');
  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    if (box.hasAttribute('data-unit-price')) continue; // already set (e.g. server-rendered)
    var slug = box.getAttribute('data-product-slug');
    var config = ProductPricing.getConfiguratorConfig(slug);
    if (!config) continue;
    box.setAttribute('data-unit-price', String(config.unitPrice));
    if (config.minCharge != null) box.setAttribute('data-min-charge', String(config.minCharge));
    if (config.perInch) box.setAttribute('data-per-inch', 'true');
  }
})();
