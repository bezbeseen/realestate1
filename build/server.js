const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8001;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'generated')));

// Catch-all route for HTML files
app.get('*', (req, res, next) => {
    const requestedPath = req.path;
    let filePath = requestedPath;
    
    // If the path doesn't end with .html, try adding it
    if (!filePath.endsWith('.html')) {
        filePath = filePath + '.html';
    }
    
    // Remove leading slash
    filePath = filePath.replace(/^\//, '');
    
    // Check if file exists in generated directory
    const generatedFilePath = path.join(__dirname, '..', 'generated', filePath);
    if (fs.existsSync(generatedFilePath)) {
        res.sendFile(generatedFilePath);
    } else {
        // If file doesn't exist, try index.html in that directory
        const indexPath = path.join(__dirname, '..', 'generated', path.dirname(filePath), 'index.html');
        if (fs.existsSync(indexPath)) {
            res.sendFile(indexPath);
        } else {
            next(); // Pass to next middleware if file not found
        }
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 