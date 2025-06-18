const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const Papa = require('papaparse');
const sharp = require('sharp');
const { glob } = require('glob');

const API_KEY = 'FPSXa4f54291a1c68d77624fc2bedb15d2ef';
const BASE_URL = 'https://api.freepik.com/v1';
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 600;

const config = {
    csvDir: path.join(__dirname, 'data', 'csv'),
    outputDir: path.join(__dirname, 'assets', 'images', 'products')
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
        
        console.log(`  ** Saved and resized image to: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`  !! Failed to download or resize image from ${imageUrl}`, error.message);
        return false;
    }
}

async function findAndProcessImage(searchTerm) {
    try {
        console.log(`-> Searching for stock image with term: "${searchTerm}"`);
        const response = await axios.get(`${BASE_URL}/resources`, {
            headers: { 'X-Freepik-API-Key': API_KEY, 'Accept': 'application/json' },
            params: {
                'term': searchTerm,
                'filters[content_type][photo]': 1,
                'limit': 1,
                'order': 'relevance'
            }
        });

        const imageUrl = response.data.data?.[0]?.image?.source?.url;
        if (imageUrl) {
            console.log(`  ** Found image source: ${imageUrl}`);
            return imageUrl;
        } else {
            console.log('  -- No image found for this term.');
            return null;
        }
    } catch (error) {
        console.error('  !! API Error during image search:', error.response?.data || error.message);
        return null;
    }
}

async function processCsvFile(csvPath) {
    const productId = path.basename(csvPath, '.csv');
    console.log(`\nProcessing product: ${productId}`);
    
    const csvFile = fs.readFileSync(csvPath, 'utf8');
    const { data: rows } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    let csvUpdated = false;

    for (const [index, row] of rows.entries()) {
        if (!row.product_option) continue;

        if (row.image_url) {
            console.log(`  -> Skipping "${row.product_option}", image URL already exists.`);
            continue;
        }

        // Use the Freepik prompt if it exists, otherwise generate a search term
        const searchTerm = row.freepik_prompt ? row.freepik_prompt : `${productId} ${row.product_option}`;
        const imageUrl = await findAndProcessImage(searchTerm);

        if (imageUrl) {
            // Sanitize the option name to create a valid filename
            const safeOptionName = row.product_option.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const outputFileName = `${safeOptionName}.jpg`;
            const localOutputPath = path.join(config.outputDir, productId, outputFileName);
            
            const success = await downloadAndResizeImage(imageUrl, localOutputPath);

            if (success) {
                // Update the CSV with the local, root-relative path
                rows[index].image_url = `/assets/images/products/${productId}/${outputFileName}`;
                csvUpdated = true;
            }
        }
    }

    if (csvUpdated) {
        console.log(`\n-> Updating CSV file for ${productId}...`);
        const updatedCsv = Papa.unparse(rows, { header: true });
        fs.writeFileSync(csvPath, updatedCsv, 'utf8');
        console.log(`  ** ${productId}.csv has been updated.`);
    } else {
        console.log(`\n-> No changes made to ${productId}.csv.`);
    }
}

async function main() {
    console.log('Starting stock image fetching and processing for all products...');
    
    const csvFiles = await glob('*.csv', { cwd: config.csvDir });

    if (csvFiles.length === 0) {
        console.log("No CSV files found to process.");
        return;
    }

    for (const csvFile of csvFiles) {
        await processCsvFile(path.join(config.csvDir, csvFile));
    }

    console.log('\n\n-----------------------------------------');
    console.log('Stock image fetching process complete.');
    console.log('-----------------------------------------');
}

main(); 