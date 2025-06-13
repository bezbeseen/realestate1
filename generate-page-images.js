const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY;
const FREEPIK_API_URL = 'https://api.freepik.com/v1/ai/generate';

// Function to extract alt texts from HTML file
async function extractAltTexts(htmlFile) {
    const html = fs.readFileSync(htmlFile, 'utf8');
    const $ = cheerio.load(html);
    const altTexts = [];

    // Get all images in the tab content
    $('.tab-content img').each((index, element) => {
        const alt = $(element).attr('alt');
        const src = $(element).attr('src');
        if (alt && src) {
            altTexts.push({
                alt: alt,
                src: src,
                index: index + 1
            });
        }
    });

    return altTexts;
}

// Function to generate image using Freepik AI
async function generateImage(prompt) {
    try {
        const response = await axios.post(FREEPIK_API_URL, {
            prompt: prompt,
            style: "realistic",
            aspect_ratio: "4:3"
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
        console.error('Error generating image:', error.message);
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
        console.error('Error checking task status:', error.message);
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

        const writer = fs.createWriteStream(filename);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw error;
    }
}

// Function to generate images for a page
async function generateImagesForPage(htmlFile) {
    try {
        const altTexts = await extractAltTexts(htmlFile);
        console.log(`Found ${altTexts.length} images to generate`);

        for (const item of altTexts) {
            console.log(`\nGenerating image ${item.index} of ${altTexts.length}`);
            console.log(`Prompt: ${item.alt}`);

            const taskId = await generateImage(item.alt);
            console.log(`Task ID: ${taskId}`);

            let status = null;
            let attempts = 0;
            const maxAttempts = 6;

            while (attempts < maxAttempts) {
                status = await checkTaskStatus(taskId);
                console.log(`Status: ${status.status}`);

                if (status.status === 'COMPLETED') {
                    const filename = path.basename(item.src);
                    const outputPath = path.join('assets/images/products/brochures', filename);
                    
                    console.log(`Downloading image to ${outputPath}`);
                    await downloadImage(status.result.url, outputPath);
                    console.log('Image downloaded successfully');
                    break;
                } else if (status.status === 'FAILED') {
                    throw new Error('Image generation failed');
                }

                attempts++;
                if (attempts < maxAttempts) {
                    console.log(`Waiting 5 seconds before next attempt...`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }

            if (attempts === maxAttempts) {
                console.log('Max attempts reached, moving to next image');
            }

            // Add a delay between requests to avoid rate limiting
            if (item.index < altTexts.length) {
                console.log('Waiting 10 seconds before next image...');
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }
    } catch (error) {
        console.error('Error in generateImagesForPage:', error.message);
    }
}

// Main execution
const htmlFile = process.argv[2] || 'products/prints/brochures/index.html';
console.log(`Processing file: ${htmlFile}`);

if (!FREEPIK_API_KEY) {
    console.error('Error: FREEPIK_API_KEY environment variable is not set');
    process.exit(1);
}

generateImagesForPage(htmlFile); 