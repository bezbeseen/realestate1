const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'data', 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const missingProducts = [
    {
        "product_id": "commercial_signs",
        "product_name": "Commercial Signs",
        "base_description": "Custom signs for commercial businesses.",
        "category": "signs",
        "path": "products/signs/commercial-signs.html",
        "page_title": "Commercial Signs | Business Signage | BE SEEN",
        "seo_description": "Custom signs for commercial businesses, including storefront signs, pylon signs, and monument signs.",
        "long_description": "...",
        "features": [],
        "use_cases": [],
        "hero_image_url": "/assets/images/backgrounds/bg.png",
        "breadcrumbs": [
            { "name": "Home", "link": "/index.html" },
            { "name": "Products", "link": "/products.html" },
            { "name": "Signs", "link": "/products/signs.html" },
            { "name": "Commercial Signs" }
        ],
        "generation_pipeline": "standard_product_v1"
    },
    {
        "product_id": "corrugated_signs_deluxe",
        "product_name": "Corrugated Plastic Signs",
        "base_description": "Promote your business, event, or campaign with lightweight yet durable corrugated plastic signs.",
        "category": "signs",
        "path": "products/signs/corrugated-signs-deluxe.html",
        "page_title": "Corrugated Plastic Signs | BE SEEN",
        "seo_description": "Lightweight and durable corrugated plastic signs, perfect for outdoor or temporary indoor use.",
        "long_description": "Our full-color, UV-printed signs are ideal for outdoor or temporary indoor use, and are fully customizable to match your branding.",
        "features": ["Lightweight", "Durable", "Full-color UV printing", "Customizable"],
        "use_cases": ["Real estate", "Political campaigns", "Events", "Promotions"],
        "breadcrumbs": [
            { "name": "Home", "link": "/index.html" },
            { "name": "Products", "link": "/products.html" },
            { "name": "Signs", "link": "/products/signs.html" },
            { "name": "Corrugated Signs" }
        ],
        "product_details": {
            "price": "19.99",
            "description_short": "Lightweight and durable corrugated plastic signs.",
            "description_long": "Our full-color, UV-printed signs are ideal for outdoor or temporary indoor use, and are fully customizable to match your branding.",
            "quantity_options": [ 1, 5, 10, 25, 50, 100 ],
            "options": [
                {
                    "name": "Size",
                    "variants": [
                        { "name": "18\" x 24\"", "price_change": 0 },
                        { "name": "24\" x 36\"", "price_change": 15 }
                    ]
                }
            ],
            "id": "corrugated_signs_deluxe",
            "title": "Corrugated Plastic Signs"
        }
    },
    {
        "product_id": "real_estate_business_cards_deluxe",
        "product_name": "Premium Real Estate Business Cards",
        "base_description": "Make a lasting impression with our premium real estate business cards. Each card is crafted using high-quality materials and finished with your choice of professional coatings.",
        "category": "real-estate",
        "path": "products/real-estate/business-cards-deluxe.html",
        "page_title": "Real Estate Business Cards | BE SEEN",
        "seo_description": "Premium business cards for real estate agents. Choose from various finishes like matte, glossy, and soft-touch.",
        "long_description": "Choose from various finishes including matte, glossy, or soft-touch coating. Available in standard or custom sizes with options for specialty features like spot UV, foil stamping, and embossing.",
        "features": ["Matte, glossy, and soft-touch finishes", "Spot UV, foil stamping, and embossing available", "Standard and custom sizes"],
        "use_cases": ["Networking", "Client meetings", "Open houses"],
        "breadcrumbs": [
            { "name": "Home", "link": "/index.html" },
            { "name": "Products", "link": "/products.html" },
            { "name": "Real Estate", "link": "/products/real-estate.html" },
            { "name": "Business Cards" }
        ],
        "product_details": {
            "price": "25.83",
            "description_short": "Premium business cards for real estate professionals.",
            "description_long": "Choose from various finishes including matte, glossy, or soft-touch coating. Available in standard or custom sizes with options for specialty features like spot UV, foil stamping, and embossing.",
            "quantity_options": [ 250, 500, 1000, 2500 ],
            "options": [
                {
                    "name": "Finish",
                    "variants": [
                        { "name": "Standard Matte", "price_change": 0 },
                        { "name": "Premium Spot UV", "price_change": 15 },
                        { "name": "Luxury Gold Foil", "price_change": 30 }
                    ]
                }
            ],
            "id": "real_estate_business_cards_deluxe",
            "title": "Premium Real Estate Business Cards"
        }
    },
    {
        "product_id": "real_estate_banners_deluxe",
        "product_name": "Professional Real Estate Banners",
        "base_description": "Make your properties stand out with our high-quality real estate banners. Perfect for open houses, property listings, and special promotions.",
        "category": "real-estate",
        "path": "products/real-estate/banners-deluxe.html",
        "page_title": "Real Estate Banners | BE SEEN",
        "seo_description": "High-quality real estate banners for open houses and property listings. Weather-resistant and durable.",
        "long_description": "Choose from various sizes, materials, and finishing options. Weather-resistant and durable for both indoor and outdoor use, with professional installation available.",
        "features": ["Weather-resistant", "Durable", "Indoor and outdoor use", "Professional installation available"],
        "use_cases": ["Open houses", "Property listings", "Special promotions"],
        "breadcrumbs": [
            { "name": "Home", "link": "/index.html" },
            { "name": "Products", "link": "/products.html" },
            { "name": "Real Estate", "link": "/products/real-estate.html" },
            { "name": "Banners" }
        ],
        "product_details": {
            "price": "49.99",
            "description_short": "High-quality banners for real estate.",
            "description_long": "Choose from various sizes, materials, and finishing options. Weather-resistant and durable for both indoor and outdoor use, with professional installation available.",
            "quantity_options": [ 1, 2, 5, 10, 25, 50 ],
            "options": [
                {
                    "name": "Size",
                    "variants": [
                        { "name": "2' x 4' Banner", "price_change": 0 },
                        { "name": "3' x 6' Banner", "price_change": 40 },
                        { "name": "4' x 8' Banner", "price_change": 100 }
                    ]
                }
            ],
            "id": "real_estate_banners_deluxe",
            "title": "Professional Real Estate Banners"
        }
    },
    {
        "product_id": "real_estate_a_frames_deluxe",
        "product_name": "Professional A-Frame Signs",
        "base_description": "Drive traffic to your open houses with our premium A-Frame signs, built with durable materials and designed for maximum visibility.",
        "category": "real-estate",
        "path": "products/real-estate/a-frames-deluxe.html",
        "page_title": "Real Estate A-Frame Signs | BE SEEN",
        "seo_description": "Premium A-Frame signs for real estate. Durable, high-visibility, and perfect for open houses and property marketing.",
        "long_description": "Choose from various sizes and styles, including quick-change inserts, weather-resistant materials, and custom branding options. Perfect for open houses, directional signage, and property marketing.",
        "features": ["Quick-change inserts", "Weather-resistant", "Custom branding", "High-visibility design"],
        "use_cases": ["Open houses", "Directional signage", "Property marketing"],
        "breadcrumbs": [
            { "name": "Home", "link": "/index.html" },
            { "name": "Products", "link": "/products.html" },
            { "name": "Real Estate", "link": "/products/real-estate.html" },
            { "name": "A-Frame Signs" }
        ],
        "product_details": {
            "price": "89.99",
            "description_short": "Premium A-Frame signs for real estate marketing.",
            "description_long": "Choose from various sizes and styles, including quick-change inserts, weather-resistant materials, and custom branding options. Perfect for open houses, directional signage, and property marketing.",
            "quantity_options": [ 1, 2, 5, 10, 25, 50 ],
            "options": [
                {
                    "name": "Style",
                    "variants": [
                        { "name": "Standard A-Frame", "price_change": 0 },
                        { "name": "With Replaceable Panels", "price_change": 20 },
                        { "name": "With LED Lights", "price_change": 30 },
                        { "name": "Deluxe Package (Panels + LED)", "price_change": 45 }
                    ]
                }
            ],
            "id": "real_estate_a_frames_deluxe",
            "title": "Professional A-Frame Signs"
        }
    }
];

const productIds = new Set(products.map(p => p.product_id));

missingProducts.forEach(missingProduct => {
    if (!productIds.has(missingProduct.product_id)) {
        products.push(missingProduct);
    }
});

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

console.log(`Product list fixed. Total products: ${products.length}`); 