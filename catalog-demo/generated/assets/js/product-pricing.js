/**
 * Master pricing — three sheets by pricing model.
 * 1. By sq ft: vinyl banners, styrene, rigid, adhesive, etc. (unitPrice, minCharge, perInch)
 * 2. Static by size/style: a-frames, tents, flags (fixed options: size/style → price)
 * 3. By quantity + variants: business cards, etc. (quantity tiers, variants)
 */

(function (root) {
  'use strict';

  // —— Sheet 1: By sq ft (and per-inch for channel letters) ——
  // Optional: attributes = product options (dropdowns). Many products on getbeseen.bs.run use these.
  // Shared finishing options for vinyl/fabric banners (Pole Pocket, Hem, Grommet, Webbing, Corners, Rope, Windslit).
  var BANNER_FINISHING = {
    sides: [
      { value: '1', label: '1 Side' },
      { value: '2', label: '2 Sides' }
    ],
    polePocket: [
      { value: '0', label: 'No Pole Pockets' },
      { value: '2TB', label: '2" - Top and Bottom', desc: 'Fits 1" diameter pole' },
      { value: '3TB', label: '3" - Top and Bottom', desc: 'Fits 1.5" diameter pole' },
      { value: '4TB', label: '4" - Top and Bottom', desc: 'Fits 2" diameter pole' },
      { value: '2T', label: '2" - Top Only', desc: 'Fits 1" diameter pole' },
      { value: '3T', label: '3" - Top Only', desc: 'Fits 1.5" diameter pole' },
      { value: '4T', label: '4" - Top Only', desc: 'Fits 2" diameter pole' },
      { value: 'custom', label: 'Custom Pole Pocket' }
    ],
    hem: [
      { value: 'A', label: 'All Sides' },
      { value: 'N', label: 'No Hem' }
    ],
    grommet: [
      { value: '24/TBLR', label: 'Every 2\' All Sides' },
      { value: '24/TB', label: 'Every 2\' Top & Bottom' },
      { value: '24/LR', label: 'Every 2\' Left & Right' },
      { value: '4', label: '4 Corner Only' },
      { value: '0', label: 'No Grommet' },
      { value: 'custom', label: 'Custom Grommets' }
    ],
    webbing: [
      { value: '0', label: 'No Webbing, No D-rings' },
      { value: '1', label: '1" Webbing' },
      { value: '1D', label: '1" Webbing w/ D-rings' },
      { value: 'velcro', label: '1" Velcro - All Sides' }
    ],
    corners: [
      { value: '0', label: 'No Reinforced Corners' },
      { value: 'T', label: 'Reinforce Top Only' },
      { value: 'B', label: 'Reinforce Bottom Only' },
      { value: 'A', label: 'Reinforce All Corners' }
    ],
    rope: [
      { value: 'v1', label: 'No Rope' },
      { value: '316T', label: '3/16" - Top Only' },
      { value: '316B', label: '3/16" - Bottom Only' },
      { value: '316TB', label: '3/16" - Top and Bottom' },
      { value: '516T', label: '5/16" - Top Only' },
      { value: '516B', label: '5/16" - Bottom Only' },
      { value: '516TB', label: '5/16" - Top and Bottom' }
    ],
    windslit: [
      { value: '0', label: 'No Windslits' },
      { value: '1', label: 'Standard Windslits' }
    ]
  };

  function withBannerOptions(materialLabel) {
    var a = { material: [{ value: 'default', label: materialLabel }] };
    Object.keys(BANNER_FINISHING).forEach(function (k) { a[k] = BANNER_FINISHING[k]; });
    return a;
  }

  var BY_SQFT = {
    '13oz-vinyl-banner': {
      name: '13oz Vinyl Banner',
      unitPrice: 5.45,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('13oz. Matte Vinyl Banner')
    },
    'vinyl-banner-18oz-blockout': {
      name: '18oz Blockout Banner',
      unitPrice: 9.10,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('18oz. Blockout Vinyl Banner')
    },
    'vinyl-banner-backlit': {
      name: 'Backlit Banner',
      unitPrice: 19.80,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('15oz. Translucent Vinyl (Backlit)')
    },
    'mesh-banners': {
      name: 'Mesh Banner',
      unitPrice: 4.84,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('Mesh Vinyl Banner')
    },
    'super-smooth-indoor-banner': {
      name: 'Indoor Banner',
      unitPrice: 7.28,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('Super Smooth Indoor Vinyl')
    },
    'pole-banner-set': {
      name: 'Pole Banner',
      unitPrice: 8.72,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('18oz. Vinyl (Pole Banner)')
    },
    'fabric-banner-9oz-wrinkle-free': {
      name: '9oz Fabric Banner',
      unitPrice: 7.92,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('9oz. Wrinkle-Free Fabric')
    },
    'fabric-block-out': {
      name: 'Blockout Fabric Banner',
      unitPrice: 19.80,
      minCharge: null,
      perInch: false,
      attributes: withBannerOptions('Blockout Fabric')
    },
    'tension-fabric': { name: 'Tension Fabric', unitPrice: 15.40, minCharge: null, perInch: false },
    'custom-seg-fabric': { name: 'Custom SEG Fabric', unitPrice: 5.25, minCharge: null, perInch: false },
    'canvas-roll': { name: 'Canvas Roll', unitPrice: 14.52, minCharge: null, perInch: false },
    'styrene': { name: 'Styrene', unitPrice: 16.96, minCharge: 32, perInch: false },
    'standard-channel-letter': { name: 'Standard Channel Letters', unitPrice: 4.39, minCharge: null, perInch: true },
    'posters': { name: 'Posters', unitPrice: 12, minCharge: 25, perInch: false },
    'premium-window-cling': { name: 'Premium Window Cling', unitPrice: 12.12, minCharge: 28, perInch: false },
    'backlit-film': { name: 'Backlit Film', unitPrice: 18, minCharge: 35, perInch: false },
    'wall-graphics': { name: 'Adhesive Wall Fabric', unitPrice: 14.52, minCharge: 30, perInch: false },
    'non_woven_wallpapper': { name: 'Non-Woven Wallpaper', unitPrice: 11.96, minCharge: 25, perInch: false },
    'adhesive-vinyl': { name: 'Adhesive Vinyl', unitPrice: 6.60, minCharge: 20, perInch: false },
    'adhesive-vinyl-high-performance': { name: 'High Performance Vinyl', unitPrice: 14.52, minCharge: 28, perInch: false },
    'vehicle-wrap-3m-cast': { name: '3M IJ-180Cv3 Controltac', unitPrice: 19.80, minCharge: 35, perInch: false },
    'adhesive-window-perf': { name: 'Adhesive Window Perf', unitPrice: 10.12, minCharge: 25, perInch: false },
    'adhesive-clear-vinyl': { name: 'Adhesive Clear Vinyl', unitPrice: 15.20, minCharge: 28, perInch: false },
    'adhesive-translucent-vinyl': { name: 'Adhesive Translucent Vinyl', unitPrice: 19.80, minCharge: 35, perInch: false },
    'floor-graphics': { name: 'Floor Graphics', unitPrice: 24.20, minCharge: 40, perInch: false },
    'etched-printable-frosted-vinyl': { name: 'Frosted Vinyl', unitPrice: 19.80, minCharge: 35, perInch: false },
    'reflective-adhesive-vinyl': { name: 'Reflective Adhesive Vinyl', unitPrice: 19.80, minCharge: 35, perInch: false },
    'dry-erase-adhesive-vinyl': { name: 'Dry Erase Adhesive Vinyl', unitPrice: 16.52, minCharge: 28, perInch: false },
    'magnets': { name: 'Magnets', unitPrice: 15.96, minCharge: 30, perInch: false },
    'coroplast': { name: 'Coroplast', unitPrice: 15.40, minCharge: 28, perInch: false },
    'aluminum-sandwich-board': { name: 'Aluminum Sandwich Board', unitPrice: 19.80, minCharge: 35, perInch: false },
    'pvc-board': { name: 'PVC Board', unitPrice: 15.40, minCharge: 28, perInch: false },
    'foamcore': { name: 'Foam Board', unitPrice: 15.40, minCharge: 28, perInch: false },
    'gatorfoam': { name: 'GatorFoam', unitPrice: 20.04, minCharge: 35, perInch: false },
    'reflective-car-magnet': { name: 'Reflective Car Magnet', unitPrice: 44.00, minCharge: 50, perInch: false },
    'reflective-coroplast': { name: 'Reflective Coroplast', unitPrice: 35.20, minCharge: 45, perInch: false },
    'reflective-aluminum-sandwich-board': { name: 'Reflective Aluminum Sandwich Board', unitPrice: 30.80, minCharge: 40, perInch: false },
    'dry-erase-magnet': { name: 'Dry Erase Magnet', unitPrice: 30.80, minCharge: 40, perInch: false },
    'dry-erase-coroplast': { name: 'Dry Erase Coroplast', unitPrice: 24.20, minCharge: 35, perInch: false },
    'dry-erase-aluminum-sandwich-board': { name: 'Dry Erase Aluminum Sandwich Board', unitPrice: 19.80, minCharge: 30, perInch: false },
    'dry-erase-foamcore': { name: 'Dry Erase Foamcore', unitPrice: 24.20, minCharge: 35, perInch: false },
    'dry-erase-pvc-board': { name: 'Dry Erase PVC Board', unitPrice: 24.20, minCharge: 35, perInch: false },
    'direct-to-film': { name: 'DTF Transfer', unitPrice: 3.96, minCharge: 15, perInch: false },
    'uv-dtf': { name: 'UV DTF', unitPrice: 11.96, minCharge: 25, perInch: false }
  };

  // —— Sheet 2: Static by size/style (a-frames, tents, flags) ——
  var STATIC_BY_SIZE = {
    'feather-angled-flag': {
      name: 'Feather Angled Flag',
      options: [
        { unit: 'Small 9 ft', price: '$196.83' },
        { unit: 'Medium 10.5 ft', price: '$196.83' },
        { unit: 'Large 14 ft', price: '$209.85' },
        { unit: 'X-Large 18 ft', price: '$263.64' }
      ]
    },
    'teardrop-flag': {
      name: 'Teardrop Flag',
      options: [
        { unit: 'Small 7 ft', price: '$196.83' },
        { unit: 'Medium 9 ft', price: '$196.83' },
        { unit: 'Large 11.2 ft', price: '$209.85' },
        { unit: 'X-Large 13.5 ft', price: '$263.64' }
      ]
    },
    'rectangle-flag': {
      name: 'Rectangle Flag',
      options: [
        { unit: 'Small 8.5 ft', price: '$308.85' },
        { unit: 'Medium 11.8 ft', price: '$343.17' },
        { unit: 'Large 15 ft', price: '$377.49' }
      ]
    },
    'standard-retractable': {
      name: 'Standard Retractable',
      options: [
        { unit: '23"x66"', price: '$206.22' },
        { unit: '24"x81"', price: '$214.50' },
        { unit: '33"x81"', price: '$164.97' },
        { unit: '47"x81"', price: '$336.30' }
      ]
    },
    'banner-a-frame': {
      name: 'Banner A-Frame',
      options: [
        { unit: '4ft', price: '$302.20' },
        { unit: '8ft', price: '$359.65' }
      ]
    },
    'tension-fabric-stand': {
      name: 'Tension Fabric Stand',
      options: [
        { unit: '36"x90"', price: '$428.97' },
        { unit: '48"x90"', price: '$494.97' }
      ]
    },
    '10x10-custom-booth': { name: '10\' x 10\' Booth', price: '$1,428.90' },
    '10x20-custom-booth': { name: '10\' x 20\' Booth', price: '$3,408.90' },
    '10x20-event-tent': { name: '10\' x 20\' Event Tent', price: null, options: [] },
    'yard-sign-and-h-stake': { name: 'Yard Sign and H-Stake', price: '$22.86', unit: '24"x18"' },
    'step-repeat-backdrop': { name: 'Step and Repeat Backdrop', price: '$590.70', unit: '10\' x 8\'' },
    'wall_mount_seg': { name: 'Wall Mount SEG', price: '$147.96' },
    'white-standard-signicade': { name: 'Standard Signicade', price: '$355.27' },
    'deluxe-signicade-a-frame': { name: 'Deluxe Signicade', price: '$448.77' }
  };

  // —— Sheet 3: By quantity + variants (e.g. business cards) ——
  var BY_QUANTITY_VARIANTS = {
    'business-cards': {
      name: 'Business Cards',
      quantityTiers: [
        { qty: 100, price: '$15.00' },
        { qty: 250, price: '$22.50' },
        { qty: 500, price: '$35.00' },
        { qty: 1000, price: '$55.00' }
      ],
      variants: [
        { id: 'standard', name: 'Standard 14pt', priceMod: 0 },
        { id: 'premium', name: 'Premium 16pt', priceMod: 5 },
        { id: 'uv', name: 'UV Coated', priceMod: 8 }
      ]
    }
  };

  function getProduct(slug) {
    if (BY_SQFT[slug]) return { pricingType: 'bySqFt', slug: slug, ...BY_SQFT[slug] };
    if (STATIC_BY_SIZE[slug]) return { pricingType: 'staticBySize', slug: slug, ...STATIC_BY_SIZE[slug] };
    if (BY_QUANTITY_VARIANTS[slug]) return { pricingType: 'byQuantityVariants', slug: slug, ...BY_QUANTITY_VARIANTS[slug] };
    return null;
  }

  function getPricingType(slug) {
    var p = getProduct(slug);
    return p ? p.pricingType : null;
  }

  function getConfiguratorConfig(slug) {
    var p = BY_SQFT[slug];
    if (!p || p.unitPrice == null) return null;
    return {
      unitPrice: Number(p.unitPrice),
      minCharge: p.minCharge != null ? Number(p.minCharge) : null,
      perInch: Boolean(p.perInch)
    };
  }

  function getOptions(slug) {
    var p = STATIC_BY_SIZE[slug];
    return (p && p.options && p.options.length) ? p.options : null;
  }

  function isConfiguratorProduct(slug) {
    return !!BY_SQFT[slug];
  }

  /** Get product options/attributes for BY_SQFT products (e.g. pole pocket, hem, grommet, webbing). */
  function getAttributes(slug) {
    var p = BY_SQFT[slug];
    return (p && p.attributes) ? p.attributes : null;
  }

  /** List of slugs that have options (for reference / UI). */
  function getProductsWithOptions() {
    return Object.keys(BY_SQFT).filter(function (slug) { return BY_SQFT[slug].attributes; });
  }

  var api = {
    BANNER_FINISHING: BANNER_FINISHING,
    BY_SQFT: BY_SQFT,
    STATIC_BY_SIZE: STATIC_BY_SIZE,
    BY_QUANTITY_VARIANTS: BY_QUANTITY_VARIANTS,
    getProduct: getProduct,
    getPricingType: getPricingType,
    getConfiguratorConfig: getConfiguratorConfig,
    getOptions: getOptions,
    getAttributes: getAttributes,
    getProductsWithOptions: getProductsWithOptions,
    isConfiguratorProduct: isConfiguratorProduct
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ProductPricing = api;
  }
})(typeof window !== 'undefined' ? window : global);
