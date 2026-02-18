/**
 * Size-based configurator: width/height inputs → live total price.
 * Requires: .configurator[data-unit-price], #config-width, #config-height, #config-area, #config-total
 * Optional: data-min-charge, data-per-inch, #config-sides (for 1/2 sided)
 */
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
  if (heightIn) heightIn.addEventListener('change', update);
  if (heightIn) heightIn.addEventListener('input', update);
  if (widthIn) widthIn.addEventListener('change', update);
  if (sidesSelect) sidesSelect.addEventListener('change', update);
  update();
})();
