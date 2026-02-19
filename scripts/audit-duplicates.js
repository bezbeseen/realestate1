const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../production stuff/data/products.json');
const imageLibraryFile = path.join(__dirname, '../production stuff/data/image-library.json');

// Load Data
const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
const imageLibrary = JSON.parse(fs.readFileSync(imageLibraryFile, 'utf8'));

// Hardcoded Slug Map (mirrors build.js logic for simulation)
const slugMap = {
    // Flags
    'feather-angled-flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'convex-flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'econo-feather-flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'teardrop-flag': { path: '/assets/Be seen image review updated/Flags/Teardrop Flags.jpg' },
    'rectangle-flag': { path: '/assets/Be seen image review updated/Flags/Rectangle Flags.jpg' },
    'custom-pole-flag': { path: '/assets/Be seen image review updated/Flags/Rectangle Flags.jpg' },
    'real_estate_feather_angled_flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'real_estate_convex_flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'real_estate_econo_feather_flag': { path: '/assets/Be seen image review updated/Flags/Feather Flags.jpg' },
    'real_estate_teardrop_flag': { path: '/assets/Be seen image review updated/Flags/Teardrop Flags.jpg' },
    'real_estate_rectangle_flag': { path: '/assets/Be seen image review updated/Flags/Rectangle Flags.jpg' },
    'real_estate_custom_pole_flag': { path: '/assets/Be seen image review updated/Flags/Rectangle Flags.jpg' },

    // Banners
    '13oz-vinyl-banner': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },
    'vinyl-banner-18oz-blockout': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },
    'vinyl-banner-backlit': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },
    'mesh-banners': { path: '/assets/Be seen image review updated/Banners/mesh banner.jpg' },
    'super-smooth-indoor-banner': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },
    'pole-banner-set': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },
    'fabric-banner-9oz-wrinkle-free': { path: '/assets/Be seen image review updated/Banners/fabric banner.jpg' },
    'fabric-block-out': { path: '/assets/Be seen image review updated/Banners/fabric banner.jpg' },
    'tension-fabric': { path: '/assets/Be seen image review updated/Banners/fabric banner.jpg' },
    'hand-banner': { path: '/assets/Be seen image review updated/Banners/vinyl banner.jpg' },

    // Channel Lettering
    'standard-channel-letter': { path: '/assets/Be seen image review updated/Specialty Signs/Channel Specialty Signs.jpg' },
    'reverse-lit': { path: '/assets/Be seen image review updated/Specialty Signs/Channel Specialty Signs.jpg' },
    'reverse-acrylic-lit': { path: '/assets/Be seen image review updated/Specialty Signs/Channel Specialty Signs.jpg' },
    'full-acrylic-face-lit': { path: '/assets/Be seen image review updated/Specialty Signs/Channel Specialty Signs.jpg' },
    'inset-acrylic-face-lit': { path: '/assets/Be seen image review updated/Specialty Signs/Channel Specialty Signs.jpg' },

    // 3D Lettering
    '3d_lettering_standard_channel_letter': { path: '/assets/Be seen image review updated/Specialty Signs/3D Specialty Signs.jpg' },
    '3d_lettering_reverse_lit': { path: '/assets/Be seen image review updated/Specialty Signs/3D Specialty Signs.jpg' },
    '3d_lettering_reverse_acrylic_lit': { path: '/assets/Be seen image review updated/Specialty Signs/3D Specialty Signs.jpg' },
    '3d_lettering_full_acrylic_face_lit': { path: '/assets/Be seen image review updated/Specialty Signs/3D Specialty Signs.jpg' },
    '3d_lettering_inset_acrylic_face_lit': { path: '/assets/Be seen image review updated/Specialty Signs/3D Specialty Signs.jpg' },

    // A-Frames
    'banner-a-frame': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'snap-poster-hanger': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'poster-stand': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'wood-frame-hanger': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'white-standard-signicade': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'deluxe-signicade-a-frame': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'white-simposign-a-frame': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },

    // Aluminum Signs & Magnets
    'aluminum-sign': { path: '/assets/Be seen image review updated/Aluminum Signs/Custom Aluminum Signs.jpg' },
    'aluminum-sandwich-board': { path: '/assets/Be seen image review updated/Aluminum Signs/18x24 Aluminum Signs.jpg' },
    'acrylic-prints': { path: '/assets/Be seen image review updated/Styrene & Acrylic/Acrylic Clear.jpg' },
    'coroplast-sign-panel': { path: '/assets/Be seen image review updated/Corrugated Plastic/4mm Corrugated Plastic.jpg' },
    'foam-board-sign-panel': { path: '/assets/Be seen image review updated/Foam Board/Standard Foam Board.jpg' },
    'gatorfoam-sign-panel': { path: '/assets/Be seen image review updated/Foam Board/Premium Foam Board.jpg' },
    'magnets': { path: '/assets/Be seen image review updated/Specialty Signs/Magnets Specialty Signs.jpg' },
    'flexible-car-magnets': { path: '/assets/Be seen image review updated/Specialty Signs/Magnets Specialty Signs.jpg' },
    'pvc-sign-board': { path: '/assets/Be seen image review updated/PVC Board/standard pvc board.jpg' },
    'styrene-sign-board': { path: '/assets/Be seen image review updated/Styrene & Acrylic/Styrene Plate.jpg' },

    // Light Boxes
    '3ft-seg-fabric-stand': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    '10ft-seg-fabric-display': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    '20ft-seg-fabric-display': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    '10ft-seg-backlit-fabric-display': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    '8ft-seg-backlit-popup-display': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    '10ft-seg-backlit-popup-display': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    'custom-seg-fabric': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    'wall-mount-seg': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },
    'backlit-film': { path: '/assets/Be seen image review updated/Specialty Signs/Light Boxes Specialty Signs.jpg' },

    // Retractable Banners
    'standard-retractable': { path: '/assets/Be seen image review updated/Retractable Banners/Standard retractable banners.jpg' },
    'deluxe-retractable': { path: '/assets/Be seen image review updated/Retractable Banners/deluxe retractable banners.jpg' },
    'sd-retractable': { path: '/assets/Be seen image review updated/Retractable Banners/premium retractable banners.jpg' },
    'x-stand': { path: '/assets/Be seen image review updated/Retractable Banners/economy retractable banners.jpg' },
    'tension-fabric-stand': { path: '/assets/Be seen image review updated/Retractable Banners/Standard retractable banners.jpg' },
    'step-repeat-backdrop': { path: '/assets/Be seen image review updated/Retractable Banners/Standard retractable banners.jpg' },
    'table-top-banner-stand': { path: '/assets/Be seen image review updated/Retractable Banners/Standard retractable banners.jpg' },

    // Window Graphics
    'adhesive-window-perf': { path: '/assets/Be seen image review updated/Window Graphics/Perforated Window Graphics.jpg' },
    'premium-window-cling': { path: '/assets/Be seen image review updated/Window Graphics/One Way Vision Window Graphics.jpg' },
    'adhesive-clear-vinyl': { path: '/assets/Be seen image review updated/Window Graphics/One Way Vision Window Graphics.jpg' },
    'adhesive-vinyl': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'wall-graphics': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'floor-graphics': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'adhesive-translucent-vinyl': { path: '/assets/Be seen image review updated/Window Graphics/One Way Vision Window Graphics.jpg' },
    'adhesive-vinyl-high-performance': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'vehicle-wrap-3m-cast': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'etched-printable-frosted-vinyl': { path: '/assets/Be seen image review updated/Window Graphics/One Way Vision Window Graphics.jpg' },
    'reflective-adhesive-vinyl': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },
    'dry-erase-adhesive-vinyl': { path: '/assets/Be seen image review updated/Stickers & Decals/vinyl stickers & decals.jpg' },

    // Yard Signs
    'yard-sign-and-h-stake': { path: '/assets/Be seen image review updated/Yard Signs/standard yard signs.jpg' },
    'real-estate-a-frame': { path: '/assets/Be seen image review updated/Specialty Signs/A Frames Specialty Signs.jpg' },
    'real-estate-frame': { path: '/assets/Be seen image review updated/Yard Signs/premium yard signs.jpg' },
    'real-estate-post': { path: '/assets/Be seen image review updated/Yard Signs/double sided yard signs.jpg' }
};

const imageUsage = {};

products.forEach(p => {
    let imagePath = null;

    // 1. Manual Override
    if (p.product_image) {
        imagePath = p.product_image;
    }

    // 2. Image Library
    if (!imagePath && imageLibrary.products[p.product_id]) {
        const libEntry = imageLibrary.products[p.product_id];
        // Just take the first one found
        const firstKey = Object.keys(libEntry)[0];
        if (firstKey) imagePath = libEntry[firstKey].path;
    }

    // 3. Slug Map
    if (!imagePath) {
        let slug = p.product_id;
        if (p.catalog_products && p.catalog_products.length > 0) {
            slug = p.catalog_products[0].slug;
        }
        if (!slug && slugMap[p.product_id]) slug = p.product_id;

        if (slug && slugMap[slug]) {
            imagePath = slugMap[slug].path;
        }
    }

    if (imagePath) {
        if (!imageUsage[imagePath]) {
            imageUsage[imagePath] = [];
        }
        imageUsage[imagePath].push(p.product_name);
    }
});

console.log('--- Duplicate Image Usage Report ---');
let duplicateGroups = 0;
for (const [img, productList] of Object.entries(imageUsage)) {
    if (productList.length > 1) {
        duplicateGroups++;
        console.log(`\n🖼️  ${img}`);
        console.log(`   Used by ${productList.length} products:`);
        productList.forEach(name => console.log(`   - ${name}`));
    }
}

console.log(`\nFound ${duplicateGroups} groups of products sharing images.`);
