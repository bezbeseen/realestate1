const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const Papa = require('papaparse');

const API_KEY = 'FPSXa4f54291a1c68d77624fc2bedb15d2ef'; // From our previous scripts
const BASE_URL = 'https://api.freepik.com/v1';

const config = {
    csvDir: path.join(__dirname, 'data', 'csv'),
    // We don't need an assetsDir because we'll be using the direct URLs from Freepik.
};

async function findStockImage(searchTerm) {
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
            console.log(`  ** Found image: ${imageUrl}`);
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

async function processProduct(productId) {
    console.log(`\nProcessing product: ${productId}`);
    const csvPath = path.join(config.csvDir, `${productId}.csv`);
    if (!fs.existsSync(csvPath)) {
        console.log(`  -> CSV not found for ${productId}, skipping.`);
        return;
    }

    const csvFile = fs.readFileSync(csvPath, 'utf8');
    const { data: rows } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
    let csvUpdated = false;

    for (const [index, row] of rows.entries()) {
        if (!row.product_option) continue;

        if (row.image_url) {
            console.log(`  -> Skipping "${row.product_option}", image URL already exists.`);
            continue;
        }

        const searchTerm = `${productId} ${row.product_option}`;
        const imageUrl = await findStockImage(searchTerm);

        if (imageUrl) {
            rows[index].image_url = imageUrl;
            csvUpdated = true;
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
    const productId = process.argv[2];
    if (!productId) {
        console.error("Please provide a product ID to process (e.g., 'banners').");
        return;
    }

    await processProduct(productId);
    console.log('\nStock image fetching process complete.');
}

main(); 