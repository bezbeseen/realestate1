const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Freepik API configuration
const FREEPIK_API_BASE = 'https://api.freepik.com/v1';
const apiKey = process.env.FREEPIK_API_KEY;

if (!apiKey) {
    console.error('FREEPIK_API_KEY environment variable is not set');
    process.exit(1);
}

// Search endpoint
app.get('/api/freepik/search', async (req, res) => {
    try {
        const { q, limit = 1, page = 1 } = req.query;
        
        console.log('Search request:', { q, limit, page });
        
        const response = await axios.get(`${FREEPIK_API_BASE}/resources/search`, {
            params: {
                q,
                limit: parseInt(limit),
                page: parseInt(page),
                format: 'json',
                language: 'en',
                type: 'photo',
                order: 'trending'
            },
            headers: {
                'X-Freepik-API-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        console.log('Freepik API response:', {
            status: response.status,
            data: response.data
        });

        res.json(response.data);
    } catch (error) {
        console.error('Freepik API error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        res.status(error.response?.status || 500).json({
            error: 'Freepik API error',
            message: error.response?.data?.message || error.message
        });
    }
});

// Download endpoint
app.get('/api/freepik/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Download request for ID:', id);

        const response = await axios.get(`${FREEPIK_API_BASE}/resources/${id}/download`, {
            headers: {
                'X-Freepik-API-Key': apiKey,
                'Accept': 'application/json'
            }
        });

        console.log('Download response:', {
            status: response.status,
            data: response.data
        });

        res.json(response.data);
    } catch (error) {
        console.error('Download error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        res.status(error.response?.status || 500).json({
            error: 'Download error',
            message: error.response?.data?.message || error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Freepik API configured at ${FREEPIK_API_BASE}`);
}); 