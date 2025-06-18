const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const Papa = require('papaparse');
const sharp = require('sharp');

const API_KEY = 'FPSXa4f54291a1c68d77624fc2bedb15d2ef';
const BASE_URL = 'https://api.freepik.com/v1';
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

const config = {
    csvPath: path.join(__dirname, 'data', 'csv', 'window-clings.csv'),
    outputDir: path.join(__dirname, 'assets', 'images', 'products', 'window-clings')
};

async function downloadAndResizeImage(imageUrl, outputPath) {
    try {
        const response = await axios({
            url: imageUrl,
            responseType: 'arraybuffer'
        });
        const buffer = Buffer.from(response.data, 'binary');

        await fs.ensureDir(path.dirname(outputPath));

        await sharp(buffer)
            .resize(IMAGE_WIDTH, IMAGE_HEIGHT)
            .toFile(outputPath);
        
        console.log(`  ✅ Saved: ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.error(`  ❌ Failed to download: ${error.message}`);
        return false;
    }
}

async function findStockImage(searchTerm) {
    try {
        console.log(`🔍 Searching: "${searchTerm}"`);
        const response = await axios.get(`${BASE_URL}/resources`, {
            headers: { 'X-Freepik-API-Key': API_KEY, 'Accept': 'application/json' },
            params: {
                'term': searchTerm,
                'filters[content_type][photo]': 1,
                'limit': 3,
                'order': 'relevance'
            }
        });

        const images = response.data.data;
        if (images && images.length > 0) {
            // Return multiple images for different views
            return images.map(img => img.image?.source?.url).filter(Boolean);
        } else {
            console.log('  ⚠️  No images found');
            return [];
        }
    } catch (error) {
        console.error('  ❌ API Error:', error.response?.data || error.message);
        return [];
    }
}

async function generateImagesForOption(option, prompt) {
    console.log(`\n📦 Processing: ${option}`);
    
    const imageUrls = await findStockImage(prompt);
    
    if (imageUrls.length === 0) {
        console.log('  ⚠️  No images found for this option');
        return;
    }

    // Create different views using available images
    const viewNames = ['main.jpg', 'view2.jpg', 'view3.jpg', 'view4.jpg'];
    const results = [];

    for (let i = 0; i < Math.min(viewNames.length, imageUrls.length); i++) {
        const outputPath = path.join(config.outputDir, option.toLowerCase().replace(/\s+/g, '-'), viewNames[i]);
        const success = await downloadAndResizeImage(imageUrls[i], outputPath);
        
        if (success) {
            results.push({
                view: viewNames[i],
                path: outputPath,
                url: imageUrls[i]
            });
        }
        
        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
}

async function main() {
    console.log('🎨 Generating Stock Images for Window Clings');
    console.log('='.repeat(50));

    // Read CSV file
    const csvContent = fs.readFileSync(config.csvPath, 'utf8');
    const { data: rows } = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

    for (const row of rows) {
        if (!row.product_option || !row.freepik_prompt) continue;

        await generateImagesForOption(row.product_option, row.freepik_prompt);
        
        // Delay between options
        console.log('⏸️  Waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('\n🎉 Window clings image generation complete!');
    console.log(`📁 Check: ${config.outputDir}`);
}

main().catch(console.error); 