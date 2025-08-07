require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8001;

// --- Middleware ---
// 1. Enable CORS for all routes
app.use(cors());

// 2. Middleware to parse JSON bodies. This MUST come before any routes that need it.
app.use(express.json());

// 3. Simple logger to see all incoming requests
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// --- API Routes ---
// 4. Define and use the API routes BEFORE any static or catch-all routes.
const stripeRoutes = require('../api/create-checkout-session.js');
app.use('/api', stripeRoutes);

// --- Static Asset Serving ---
// 5. Serve static files (CSS, JS, images) from the 'generated' directory.
// The path '/assets' will be mapped to the '/generated/assets' directory.
app.use(express.static(path.join(__dirname, '..', 'generated')));

// --- HTML Page Catch-All ---
// 6. Catch-all route for serving HTML files. This comes last.
app.get('*', (req, res) => {
    let filePath = path.join(__dirname, '..', 'generated', req.path);

    // If the direct path doesn't end in .html, try adding it
    if (!req.path.endsWith('.html')) {
        filePath += '.html';
    }

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // If the file doesn't exist, serve the main index.html as a fallback
        res.sendFile(path.join(__dirname, '..', 'generated', 'index.html'));
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Serving files from:', path.join(__dirname, '..', 'generated'));
});