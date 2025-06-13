const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'FPSXa4f54291a1c68d77624fc2bedb15d2ef';
const BASE_URL = 'https://api.freepik.com/v1';

async function testFreepikAPI() {
    try {
        console.log('Testing Freepik AI Image Generation API...');
        console.log('Using API Key:', API_KEY.substring(0, 5) + '...');
        
        // Generate image using AI with minimal parameters
        const response = await axios.post(`${BASE_URL}/ai/mystic`, {
            prompt: "A simple business card with a clean design",
            structure_strength: 50,
            adherence: 50,
            hdr: 50,
            resolution: "2k",
            aspect_ratio: "classic_4_3",
            model: "realism",
            creative_detailing: 50,
            engine: "automatic",
            fixed_generation: false,
            filter_nsfw: true
        }, {
            headers: {
                'X-Freepik-API-Key': API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Initial API Response:', JSON.stringify(response.data, null, 2));

        // If we get a task_id, wait a moment and then check the status
        if (response.data.data?.task_id) {
            console.log('Task created, waiting 10 seconds before checking status...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            await checkTaskStatus(response.data.data.task_id);
        } else {
            console.log('No task_id received in response');
        }
    } catch (error) {
        if (error.response?.data?.invalid_params) {
            console.error('Invalid parameters:', JSON.stringify(error.response.data.invalid_params, null, 2));
        }
        console.error('API Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    }
}

async function checkTaskStatus(taskId, attempt = 1) {
    try {
        console.log(`Checking task status (attempt ${attempt})...`);
        
        const response = await axios.get(`${BASE_URL}/ai/mystic/${taskId}`, {
            headers: {
                'X-Freepik-API-Key': API_KEY,
                'Accept': 'application/json'
            }
        });

        console.log('Status Response:', JSON.stringify(response.data, null, 2));

        const status = response.data.data?.status;
        const generated = response.data.data?.generated || [];

        if (!status) {
            console.log('No status received, waiting 5 seconds before retrying...');
            if (attempt < 6) { // Try up to 6 times (30 seconds total)
                await new Promise(resolve => setTimeout(resolve, 5000));
                await checkTaskStatus(taskId, attempt + 1);
            } else {
                console.log('Max attempts reached without getting a status');
            }
            return;
        }

        switch (status) {
            case 'IN_PROGRESS':
                console.log('Task still in progress, waiting 5 seconds...');
                await new Promise(resolve => setTimeout(resolve, 5000));
                await checkTaskStatus(taskId, attempt + 1);
                break;
            case 'COMPLETED':
                console.log('Task completed! Generated images:', generated);
                if (generated.length > 0) {
                    await downloadImage(generated[0], 'generated-business-card.png');
                }
                break;
            case 'FAILED':
                console.log('Task failed:', response.data.data?.error || 'Unknown error');
                break;
            default:
                console.log('Unknown status:', status);
        }
    } catch (error) {
        console.error('Task Status Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    }
}

async function downloadImage(url, filename) {
    try {
        console.log('Downloading image...');
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(path.join(__dirname, filename));
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log(`Image downloaded successfully: ${filename}`);
                resolve();
            });
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading image:', error.message);
    }
}

testFreepikAPI(); 