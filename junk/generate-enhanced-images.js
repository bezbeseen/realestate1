const axios = require('axios');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const FREEPIK_API_URL = 'https://api.freepik.com/v1/ai/generate';

// Enhanced prompt templates based on industry leaders (B2Sign, 4over, 777sign)
const ENHANCED_PROMPTS = {
    'business-cards': {
        base: "Professional trade printing quality business cards, clean product photography suitable for reseller catalogs, neutral background, industry-standard presentation",
        'Standard': "Stack of professional 16pt business cards on clean white surface, trade printing quality, soft shadows, catalog-style photography",
        'Premium': "Premium business cards with enhanced paper stock, professional arrangement on neutral surface, trade printing catalog style",
        'Spot UV': "Business cards with spot UV coating, professional lighting highlighting glossy elements, trade printing showcase",
        'Gold Foil': "Luxury business cards with metallic foil elements, premium trade printing quality, professional catalog presentation",
        'Embossed': "Embossed business cards showing raised lettering, trade printing quality detail shot, professional lighting"
    },
    'window-clings': {
        base: "Professional window graphics and clings, commercial storefront applications, trade printing quality vinyl materials, architectural installation context",
        'Static Cling': "Static cling window graphics on storefront glass, removable adhesive-free installation, professional retail application, trade printing catalog style",
        'Clear Vinyl': "Clear vinyl window clings on commercial glass windows, transparent substrate with opaque graphics, professional storefront branding showcase",
        'Perforated Vinyl': "Perforated vinyl window graphics demonstrating one-way vision, commercial building installation, privacy with visibility, trade printing quality",
        'White Vinyl': "White vinyl window clings with full coverage opacity, professional storefront installation, solid background for graphics, trade printing showcase",
        'Frosted Film': "Frosted window film installation on office glass, privacy and branding solution, elegant translucent effect, architectural application"
    },
    'banners': {
        base: "Professional vinyl banner printing, trade quality materials, industry-standard presentation for reseller catalogs",
        'Standard 13 oz': "13oz vinyl banner professionally displayed, outdoor installation context, trade printing quality, wind-resistant material showcase",
        'Mesh': "Mesh vinyl banner with wind-through design, professional outdoor installation, trade printing catalog style",
        'Fabric': "Fabric banner with premium finish, wrinkle-resistant display, trade show context, professional presentation",
        'Backlit': "Backlit translucent banner with even illumination, professional light box installation, trade printing quality"
    },
    'retractable-banners': {
        base: "Professional retractable banner stands, trade show quality hardware, industry-standard presentation",
        'Standard': "Standard retractable banner with aluminum base, trade show setting, professional display, catalog-style photography",
        'Deluxe': "Premium retractable banner with upgraded hardware, professional trade show context, high-end presentation",
        'X-Stand': "X-stand banner display system, lightweight portable design, trade printing catalog style"
    },
    'a-frames': {
        base: "Professional A-frame signs, real estate and retail quality, industry-standard sidewalk display",
        'Standard': "Classic A-frame sidewalk sign, professional retail/real estate context, durable construction showcase",
        'Deluxe': "Premium A-frame with enhanced features, professional outdoor display, trade printing catalog quality"
    },
    'channel-lettering': {
        base: "Professional illuminated channel letters, commercial signage quality, architectural installation context",
        'Standard': "Front-lit channel letters on building facade, professional commercial installation, trade signage quality",
        'Halo/Reverse Lit': "Halo-lit channel letters with back illumination, professional architectural lighting, premium signage",
        'Premium': "Premium channel letters with advanced LED systems, high-end commercial installation"
    },
    'table-cloths': {
        base: "Professional trade show table covers, event display quality, industry-standard presentation",
        '4\' Table Cloth': "4-foot table cover in trade show setting, professional event display, fitted design showcase",
        '6\' Table Cloth': "6-foot table cover at professional event, trade show context, branded display presentation",
        '8\' Table Cloth': "8-foot table cover in conference setting, professional event display, full coverage design"
    },
    'flags': {
        base: "Professional advertising flags, outdoor promotional displays, trade printing quality materials",
        'Feather Flag': "Feather flag in outdoor commercial setting, wind action display, professional promotional context",
        'Teardrop Flag': "Teardrop flag with stable base, retail/event context, professional outdoor advertising",
        'Rectangle Flag': "Rectangle promotional flag, commercial display setting, trade printing quality showcase"
    },
    'stickers': {
        base: "Professional custom stickers, trade printing quality adhesive products, versatile application showcase",
        'Standard': "Die-cut vinyl stickers arranged professionally, various sizes and applications, trade printing catalog style",
        'Premium': "Premium stickers with special finishes, high-quality materials, professional product photography",
        'Embossed': "Embossed stickers with raised elements, tactile quality showcase, trade printing detail photography"
    },
    'yard-signs': {
        base: "Professional corrugated yard signs, real estate and campaign quality, outdoor durability showcase",
        'Single Sided': "Single-sided yard sign with H-stakes, real estate context, professional outdoor display",
        'Double Sided': "Double-sided yard sign installation, political/real estate setting, durable construction showcase"
    }
};

// Function to generate enhanced prompt
function createEnhancedPrompt(productType, option) {
    const templates = ENHANCED_PROMPTS[productType];
    if (!templates) {
        return `Professional ${productType} mockup showcasing ${option} style, high-quality presentation, realistic lighting, clean modern design`;
    }
    
    const basePrompt = templates.base;
    const specificPrompt = templates[option] || `Professional ${productType} showcasing ${option} style, high-quality presentation`;
    
    return `${specificPrompt}, ${basePrompt}, photorealistic, studio quality, professional photography, 4K resolution`;
}

// Function to generate image using Freepik AI
async function generateImage(prompt) {
    try {
        console.log(`🎨 Generating with prompt: ${prompt.substring(0, 100)}...`);
        
        const response = await axios.post(FREEPIK_API_URL, {
            prompt: prompt,
            style: "realistic",
            aspect_ratio: "4:3",
            quality: "premium"
        }, {
            headers: {
                'Authorization': `Bearer ${FREEPIK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.task_id) {
            return response.data.task_id;
        }
        throw new Error('No task ID received');
    } catch (error) {
        console.error('❌ Error generating image:', error.response?.data || error.message);
        throw error;
    }
}

// Function to check task status
async function checkTaskStatus(taskId) {
    try {
        const response = await axios.get(`${FREEPIK_API_URL}/status/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${FREEPIK_API_KEY}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('❌ Error checking task status:', error.message);
        throw error;
    }
}

// Function to download image
async function downloadImage(url, filename) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        // Ensure directory exists
        await fs.promises.mkdir(path.dirname(filename), { recursive: true });

        const writer = fs.createWriteStream(filename);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('❌ Error downloading image:', error.message);
        throw error;
    }
}

// Function to generate multiple views for a product option
async function generateProductImages(productType, option, outputDir) {
    const basePrompt = createEnhancedPrompt(productType, option);
    
    const imageVariations = [
        { name: 'main.jpg', prompt: `${basePrompt}, hero shot, primary product image` },
        { name: 'view2.jpg', prompt: `${basePrompt}, different angle, detail view` },
        { name: 'view3.jpg', prompt: `${basePrompt}, lifestyle context, in-use scenario` },
        { name: 'view4.jpg', prompt: `${basePrompt}, close-up detail, texture and quality focus` }
    ];

    const results = [];

    for (const variation of imageVariations) {
        try {
            console.log(`\n🎯 Generating ${variation.name} for ${productType} - ${option}`);
            
            const taskId = await generateImage(variation.prompt);
            console.log(`⏳ Task ID: ${taskId}`);

            let status = null;
            let attempts = 0;
            const maxAttempts = 10;

            while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
                status = await checkTaskStatus(taskId);
                console.log(`📊 Status: ${status.status}`);

                if (status.status === 'COMPLETED') {
                    const outputPath = path.join(outputDir, variation.name);
                    await downloadImage(status.result.url, outputPath);
                    results.push({
                        file: variation.name,
                        path: outputPath,
                        url: status.result.url
                    });
                    break;
                } else if (status.status === 'FAILED') {
                    console.log(`❌ Generation failed for ${variation.name}`);
                    break;
                }

                attempts++;
            }

            if (attempts === maxAttempts) {
                console.log(`⏰ Timeout reached for ${variation.name}`);
            }

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`❌ Error generating ${variation.name}:`, error.message);
        }
    }

    return results;
}

// Function to process a product from CSV
async function processProduct(productType) {
    const csvPath = path.join(__dirname, 'data', 'csv', `${productType}.csv`);
    const outputDir = path.join(__dirname, 'assets', 'images', 'products', productType);

    if (!fs.existsSync(csvPath)) {
        console.log(`❌ CSV file not found: ${csvPath}`);
        return;
    }

    console.log(`\n🚀 Processing ${productType}...`);
    
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const { data: rows } = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

    for (const row of rows) {
        if (!row.product_option) continue;

        console.log(`\n📦 Processing option: ${row.product_option}`);
        
        const optionDir = path.join(outputDir, row.product_option.toLowerCase().replace(/\s+/g, '-'));
        await generateProductImages(productType, row.product_option, optionDir);
        
        // Long delay between options to avoid rate limiting
        console.log('⏸️ Waiting 10 seconds before next option...');
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

// Main execution
async function main() {
    if (!FREEPIK_API_KEY) {
        console.error('❌ Error: FREEPIK_API_KEY environment variable is not set');
        console.log('💡 Set it with: export FREEPIK_API_KEY=your_api_key');
        process.exit(1);
    }

    const productType = process.argv[2];
    
    if (!productType) {
        console.log('📋 Usage: node generate-enhanced-images.js [product-type]');
        console.log('📋 Available products: business-cards, brochures, flyers, stickers, banners, etc.');
        return;
    }

    console.log(`🎨 Starting enhanced image generation for: ${productType}`);
    await processProduct(productType);
    console.log(`\n✅ Completed processing ${productType}!`);
}

main().catch(console.error); 