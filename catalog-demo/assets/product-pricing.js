/**
 * Master pricing and product sheet — single source of truth for product options
 * and dynamic pricing. Use on the main site or catalog; update prices here only.
 *
 * Usage:
 *   - Configurator (size-based): product has unitPrice, optional minCharge, optional perInch.
 *   - Fixed options: product has options[] with { unit, price }.
 *   - Fixed single price: product has price (and optional unit).
 */

(function (root) {
  'use strict';

  var PRODUCT_PRICING = {
    // —— Configurator products (size-based dynamic pricing) ——
    '13oz-vinyl-banner': {
      name: '13oz Vinyl Banner',
      unitPrice: 5.45,
      minCharge: null,
      perInch: false,
      bullets: ['Welded oversized banners available', 'Free hemming and grommets', '13 oz Matte Scrim Banner']
    },
    'vinyl-banner-18oz-blockout': {
      name: '18oz Blockout Banner',
      unitPrice: 9.10,
      minCharge: null,
      perInch: false,
      bullets: ['Our most durable banner']
    },
    'vinyl-banner-backlit': {
      name: 'Backlit Banner',
      unitPrice: 19.80,
      minCharge: null,
      perInch: false,
      bullets: ['15 oz. translucent vinyl for lit signage']
    },
    'mesh-banners': {
      name: 'Mesh Banner',
      unitPrice: 4.84,
      minCharge: null,
      perInch: false,
      bullets: ['Best option for windy conditions']
    },
    'super-smooth-indoor-banner': {
      name: 'Indoor Banner',
      unitPrice: 7.28,
      minCharge: null,
      perInch: false,
      bullets: ['Great for closeup detail', 'Flat and smooth surface vinyl']
    },
    'pole-banner-set': {
      name: 'Pole Banner',
      unitPrice: 8.72,
      minCharge: null,
      perInch: false,
      bullets: ['Ready to install hardware kit', 'Durable 18 oz banners']
    },
    'fabric-banner-9oz-wrinkle-free': {
      name: '9oz Fabric Banner',
      unitPrice: 7.92,
      minCharge: null,
      perInch: false,
      bullets: ['Wrinkle resistant and washable', 'Dye sublimation print']
    },
    'fabric-block-out': {
      name: 'Blockout Fabric Banner',
      unitPrice: 19.80,
      minCharge: null,
      perInch: false,
      bullets: ['Blocks back lighting', 'Dye sublimation print']
    },
    'tension-fabric': {
      name: 'Tension Fabric',
      unitPrice: 15.40,
      minCharge: null,
      perInch: false,
      bullets: ['2-way stretch for wraps', 'Dye sublimation print']
    },
    'custom-seg-fabric': {
      name: 'Custom SEG Fabric',
      unitPrice: 5.25,
      minCharge: null,
      perInch: false,
      bullets: ['Custom size', 'Fabric graphic only']
    },
    'canvas-roll': {
      name: 'Canvas Roll',
      unitPrice: 14.52,
      minCharge: null,
      perInch: false,
      bullets: ['15 mil. semigloss artist canvas']
    },
    'styrene': {
      name: 'Styrene',
      unitPrice: 16.96,
      minCharge: 32,
      perInch: false,
      bullets: ['.020" High Impact Polystyrene', 'Blockout material', 'Matte finish', 'Direct UV printing in full color', 'Indoor and outdoor safe', 'Lays flat after being rolled']
    },
    'standard-channel-letter': {
      name: 'Standard Channel Letters',
      unitPrice: 4.39,
      minCharge: null,
      perInch: true,
      bullets: ['Front lit & Dual lit', '.040 aluminum returns', 'Acrylic faces with trimcaps']
    },
    'posters': {
      name: 'Posters',
      unitPrice: 12,
      minCharge: 25,
      perInch: false,
      bullets: ['Multiple sizes and substrates', 'UV or solvent print', 'Matte or gloss finish']
    },
    'premium-window-cling': {
      name: 'Premium Window Cling',
      unitPrice: 12.12,
      minCharge: 28,
      perInch: false,
      bullets: ['Easy to reposition and reuse', 'Premium cling, water-free installation']
    },
    'backlit-film': {
      name: 'Backlit Film',
      unitPrice: 18,
      minCharge: 35,
      perInch: false,
      bullets: ['Light box compatible', 'Vibrant colors', 'Translucent for backlit displays']
    },
    'wall-graphics': {
      name: 'Adhesive Wall Fabric',
      unitPrice: 14.52,
      minCharge: 30,
      perInch: false,
      bullets: ['Low tack - easy to remove and reposition', 'Never falls down', 'Designed for interior walls']
    },
    'non_woven_wallpapper': {
      name: 'Non-Woven Wallpaper',
      unitPrice: 11.96,
      minCharge: 25,
      perInch: false,
      bullets: ['Not self adhesive', 'Digitally printed PVC-free wallpaper', 'Tear-resistant non-woven']
    },
    'adhesive-vinyl': {
      name: 'Adhesive Vinyl',
      unitPrice: 6.60,
      minCharge: 20,
      perInch: false,
      bullets: ['Permanent adhesive indoor and outdoor', '4mil white PVC calendar film']
    },
    'adhesive-vinyl-high-performance': {
      name: 'High Performance Vinyl',
      unitPrice: 14.52,
      minCharge: 28,
      perInch: false,
      bullets: ['Long term installs', 'Low tack repositioning', '3mil ultra-calendared PVC']
    },
    'vehicle-wrap-3m-cast': {
      name: '3M IJ-180Cv3 Controltac',
      unitPrice: 19.80,
      minCharge: 35,
      perInch: false,
      bullets: ['Vehicle wrap', '2mil Cast vinyl + overlaminate']
    },
    'adhesive-window-perf': {
      name: 'Adhesive Window Perf',
      unitPrice: 10.12,
      minCharge: 25,
      perInch: false,
      bullets: ['One-way visibility', '30% perforated window film']
    },
    'adhesive-clear-vinyl': {
      name: 'Adhesive Clear Vinyl',
      unitPrice: 15.20,
      minCharge: 28,
      perInch: false,
      bullets: ['Light pass through', 'Crystal clear CMYK']
    },
    'adhesive-translucent-vinyl': {
      name: 'Adhesive Translucent Vinyl',
      unitPrice: 19.80,
      minCharge: 35,
      perInch: false,
      bullets: ['Double layer print option', '3mil illumination film']
    },
    'floor-graphics': {
      name: 'Floor Graphics',
      unitPrice: 24.20,
      minCharge: 40,
      perInch: false,
      bullets: ['Easy install and clean removal', '7mil non-slip floor lamination']
    },
    'etched-printable-frosted-vinyl': {
      name: 'Frosted Vinyl',
      unitPrice: 19.80,
      minCharge: 35,
      perInch: false,
      bullets: ['Privacy on windows', 'Full color frosted vinyl']
    },
    'reflective-adhesive-vinyl': {
      name: 'Reflective Adhesive Vinyl',
      unitPrice: 19.80,
      minCharge: 35,
      perInch: false,
      bullets: ['Highly visible metallic surface', '4mil reflective permanent adhesive']
    },
    'dry-erase-adhesive-vinyl': {
      name: 'Dry Erase Adhesive Vinyl',
      unitPrice: 16.52,
      minCharge: 28,
      perInch: false,
      bullets: ['4mil white PVC with dry erase coating']
    },
    'magnets': {
      name: 'Magnets',
      unitPrice: 15.96,
      minCharge: 30,
      perInch: false,
      bullets: ['High strength indoor/outdoor', 'Flexible 30 mil magnet']
    },
    'coroplast': {
      name: 'Coroplast',
      unitPrice: 15.40,
      minCharge: 28,
      perInch: false,
      bullets: ['Custom size indoor/outdoor', '4mm coroplast, H-Stake option']
    },
    'aluminum-sandwich-board': {
      name: 'Aluminum Sandwich Board',
      unitPrice: 19.80,
      minCharge: 35,
      perInch: false,
      bullets: ['DiBond/ACP', '1/8" aluminum composite']
    },
    'pvc-board': {
      name: 'PVC Board',
      unitPrice: 15.40,
      minCharge: 28,
      perInch: false,
      bullets: ['Durable indoor and short term outdoor']
    },
    'foamcore': {
      name: 'Foam Board',
      unitPrice: 15.40,
      minCharge: 28,
      perInch: false,
      bullets: ['Lightweight poster board', 'Indoor use only']
    },
    'gatorfoam': {
      name: 'GatorFoam',
      unitPrice: 20.04,
      minCharge: 35,
      perInch: false,
      bullets: ['Lightweight indoor', 'Extra heavy-duty surface']
    },
    'reflective-car-magnet': {
      name: 'Reflective Car Magnet',
      unitPrice: 44.00,
      minCharge: 50,
      perInch: false,
      bullets: ['Vehicle magnets', 'Reflective surface']
    },
    'reflective-coroplast': {
      name: 'Reflective Coroplast',
      unitPrice: 35.20,
      minCharge: 45,
      perInch: false,
      bullets: ['Reflective coroplast signs']
    },
    'reflective-aluminum-sandwich-board': {
      name: 'Reflective Aluminum Sandwich Board',
      unitPrice: 30.80,
      minCharge: 40,
      perInch: false,
      bullets: ['Reflective ACP/diBond']
    },
    'dry-erase-magnet': {
      name: 'Dry Erase Magnet',
      unitPrice: 30.80,
      minCharge: 40,
      perInch: false,
      bullets: ['Dry erase magnetic surface']
    },
    'dry-erase-coroplast': {
      name: 'Dry Erase Coroplast',
      unitPrice: 24.20,
      minCharge: 35,
      perInch: false,
      bullets: ['Dry erase coroplast signs']
    },
    'dry-erase-aluminum-sandwich-board': {
      name: 'Dry Erase Aluminum Sandwich Board',
      unitPrice: 19.80,
      minCharge: 30,
      perInch: false,
      bullets: ['Dry erase ACP']
    },
    'dry-erase-foamcore': {
      name: 'Dry Erase Foamcore',
      unitPrice: 24.20,
      minCharge: 35,
      perInch: false,
      bullets: ['Dry erase foam board']
    },
    'dry-erase-pvc-board': {
      name: 'Dry Erase PVC Board',
      unitPrice: 24.20,
      minCharge: 35,
      perInch: false,
      bullets: ['Dry erase PVC board']
    },
    'direct-to-film': {
      name: 'DTF Transfer',
      unitPrice: 3.96,
      minCharge: 15,
      perInch: false,
      bullets: ['Quick melt - Cold Peel', 'CMYK + White Ink', 'Direct to Film fabric transfers']
    },
    'uv-dtf': {
      name: 'UV DTF',
      unitPrice: 11.96,
      minCharge: 25,
      perInch: false,
      bullets: ['Instant adhesion, no heating', 'CMYK + White + Gloss', 'Permanent UV stickers']
    },

    // —— Fixed-price products with options (dropdown / list) ——
    'feather-angled-flag': {
      name: 'Feather Angled Flag',
      price: '$196.83',
      unit: 'Small 9 ft',
      options: [
        { unit: 'Small 9 ft', price: '$196.83' },
        { unit: 'Medium 10.5 ft', price: '$196.83' },
        { unit: 'Large 14 ft', price: '$209.85' },
        { unit: 'X-Large 18 ft', price: '$263.64' }
      ]
    },
    'teardrop-flag': {
      name: 'Teardrop Flag',
      price: '$196.83',
      unit: 'Small 7 ft',
      options: [
        { unit: 'Small 7 ft', price: '$196.83' },
        { unit: 'Medium 9 ft', price: '$196.83' },
        { unit: 'Large 11.2 ft', price: '$209.85' },
        { unit: 'X-Large 13.5 ft', price: '$263.64' }
      ]
    },
    'standard-retractable': {
      name: 'Standard Retractable',
      price: '$164.97',
      unit: '33"x81"',
      options: [
        { unit: '23"x66"', price: '$206.22' },
        { unit: '24"x81"', price: '$214.50' },
        { unit: '33"x81"', price: '$164.97' },
        { unit: '47"x81"', price: '$336.30' }
      ]
    },
    'banner-a-frame': {
      name: 'Banner A-Frame',
      price: '$302.20',
      unit: '4ft',
      options: [
        { unit: '4ft', price: '$302.20' },
        { unit: '8ft', price: '$359.65' }
      ]
    },

    // —— Fixed single price ——
    'yard-sign-and-h-stake': {
      name: 'Yard Sign and H-Stake',
      price: '$22.86',
      unit: '24"x18"'
    },
    'step-repeat-backdrop': {
      name: 'Step and Repeat Backdrop',
      price: '$590.70',
      unit: '10\' W x 8\' H'
    },
    'wall_mount_seg': {
      name: 'Wall Mount SEG',
      price: '$147.96'
    }
  };

  /**
   * Get full product by slug.
   * @param {string} slug - Product slug (e.g. 'styrene', '13oz-vinyl-banner')
   * @returns {object|null}
   */
  function getProduct(slug) {
    return PRODUCT_PRICING[slug] || null;
  }

  /**
   * Get config for size-based configurator (unitPrice, minCharge, perInch).
   * Use when rendering the configurator block or when initializing the configurator script.
   * @param {string} slug
   * @returns {{ unitPrice: number, minCharge: number|null, perInch: boolean }|null}
   */
  function getConfiguratorConfig(slug) {
    var p = PRODUCT_PRICING[slug];
    if (!p || p.unitPrice == null) return null;
    return {
      unitPrice: Number(p.unitPrice),
      minCharge: p.minCharge != null ? Number(p.minCharge) : null,
      perInch: Boolean(p.perInch)
    };
  }

  /**
   * Get options for fixed-price products (e.g. size dropdown).
   * @param {string} slug
   * @returns {Array<{unit: string, price: string}>|null}
   */
  function getOptions(slug) {
    var p = PRODUCT_PRICING[slug];
    return (p && p.options) ? p.options : null;
  }

  /**
   * Check if product uses size-based configurator (has unitPrice).
   */
  function isConfiguratorProduct(slug) {
    var p = PRODUCT_PRICING[slug];
    return !!(p && p.unitPrice != null);
  }

  // Export for use in browser or Node
  var api = {
    PRODUCT_PRICING: PRODUCT_PRICING,
    getProduct: getProduct,
    getConfiguratorConfig: getConfiguratorConfig,
    getOptions: getOptions,
    isConfiguratorProduct: isConfiguratorProduct
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.ProductPricing = api;
  }
})(typeof window !== 'undefined' ? window : global);
