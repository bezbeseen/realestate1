const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../production stuff/data/products.json');
const imageLibraryFile = path.join(__dirname, '../production stuff/data/image-library.json');

// Load Data
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
const imageLibrary = JSON.parse(fs.readFileSync(imageLibraryFile, 'utf8'));

// Hardcoded Slug Map (mirrors build.js logic)
const slugMap = {
    // Flags
    'feather-angled-flag': true, 'convex-flag': true, 'econo-feather-flag': true,
    'teardrop-flag': true, 'rectangle-flag': true, 'custom-pole-flag': true,
    'real_estate_feather_angled_flag': true, 'real_estate_convex_flag': true,
    'real_estate_econo_feather_flag': true, 'real_estate_teardrop_flag': true,
    'real_estate_rectangle_flag': true, 'real_estate_custom_pole_flag': true,
    // Banners
    '13oz-vinyl-banner': true, 'vinyl-banner-18oz-blockout': true, 'vinyl-banner-backlit': true,
    'mesh-banners': true, 'super-smooth-indoor-banner': true, 'pole-banner-set': true,
    'fabric-banner-9oz-wrinkle-free': true, 'fabric-block-out': true, 'tension-fabric': true,
    'hand-banner': true,
    // Signs
    'standard-channel-letter': true, 'reverse-lit': true, 'reverse-acrylic-lit': true,
    'full-acrylic-face-lit': true, 'inset-acrylic-face-lit': true,
    '3d_lettering_standard_channel_letter': true, '3d_lettering_reverse-lit': true,
    '3d_lettering_reverse-acrylic-lit': true, '3d_lettering_full-acrylic-face-lit': true,
    '3d_lettering_inset-acrylic-face-lit': true,
    'banner-a-frame': true, 'snap-poster-hanger': true, 'poster-stand': true,
    'wood-frame-hanger': true, 'white-standard-signicade': true, 'deluxe-signicade-a-frame': true,
    'white-simposign-a-frame': true,
    'aluminum-sign': true, 'aluminum-sandwich-board': true, 'acrylic-prints': true,
    'coroplast-sign-panel': true, 'foam-board-sign-panel': true, 'gatorfoam-sign-panel': true,
    'magnets': true, 'flexible-car-magnets': true, 'pvc-sign-board': true, 'styrene-sign-board': true,
    '3ft-seg-fabric-stand': true, '10ft-seg-fabric-display': true, '20ft-seg-fabric-display': true,
    '10ft-seg-backlit-fabric-display': true, '8ft-seg-backlit-popup-display': true,
    '10ft-seg-backlit-popup-display': true, 'custom-seg-fabric': true, 'wall-mount-seg': true,
    'backlit-film': true,
    'standard-retractable': true, 'deluxe-retractable': true, 'sd-retractable': true,
    'x-stand': true, 'tension-fabric-stand': true, 'step-repeat-backdrop': true,
    'table-top-banner-stand': true,
    'adhesive-window-perf': true, 'premium-window-cling': true, 'adhesive-clear-vinyl': true,
    'adhesive-vinyl': true, 'wall-graphics': true, 'floor-graphics': true,
    'adhesive-translucent-vinyl': true, 'adhesive-vinyl-high-performance': true,
    'vehicle-wrap-3m-cast': true, 'etched-printable-frosted-vinyl': true,
    'reflective-adhesive-vinyl': true, 'dry-erase-adhesive-vinyl': true,
    'yard-sign-and-h-stake': true, 'real-estate-a-frame': true, 'real-estate-frame': true,
    'real-estate-post': true
};

const missingImages = [];
const coveredImages = [];

console.log(`Scanning ${products.length} products for images...`);

products.forEach(p => {
    let hasImage = false;
    let source = '';

    // 1. Check Manual Override
    if (p.product_image) {
        hasImage = true;
        source = 'Manual Override';
    }

    // 2. Check Image Library
    if (!hasImage && imageLibrary.products[p.product_id]) {
        hasImage = true;
        source = 'Image Library';
    }

    // 3. Check Slug Map (approximate check based on ID or child slugs)
    if (!hasImage) {
        let slug = p.product_id;
        if (p.catalog_products && p.catalog_products.length > 0) {
            slug = p.catalog_products[0].slug;
        }
        
        // Check if slug exists in our map (or if we have a fallback logic)
        if (slugMap[slug] || slugMap[p.product_id]) {
            hasImage = true;
            source = 'Slug Map';
        }
        
        // Check fuzzy matches from build.js
        if (!hasImage) {
             if (slug && (slug.includes('flag') || slug.includes('banner') || slug.includes('channel'))) {
                 hasImage = true;
                 source = 'Fuzzy Match';
             }
        }
    }

    if (hasImage) {
        coveredImages.push({ name: p.product_name, id: p.product_id, source });
    } else {
        missingImages.push({ name: p.product_name, id: p.product_id, path: p.path });
    }
});

console.log(`\n✅ Covered: ${coveredImages.length}`);
console.log(`❌ Missing: ${missingImages.length}`);

if (missingImages.length > 0) {
    console.log('\n--- Products Missing Images ---');
    missingImages.forEach(m => {
        console.log(`[${m.id}] ${m.name} (${m.path})`);
    });
}
