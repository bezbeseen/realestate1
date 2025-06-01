// Generate SVG placeholder for products
function generatePlaceholderSVG(text, filename) {
    const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="800" height="600" fill="#f8f9fa"/>
    <text x="400" y="300" font-family="Arial" font-size="24" fill="#6c757d" text-anchor="middle">${text}</text>
</svg>`;

    // Convert SVG to base64
    const base64 = btoa(svg);
     
    // Create data URL   
    return `data:image/svg+xml;base64,${base64}`;       
}

// Product placeholders
const products = [
    { name: 'Sign Riders', filename: 'sign-riders-default.jpg' },
    { name: 'Business Cards', filename: 'business-cards-default.jpg' },
    { name: 'A-Frame Signs', filename: 'a-frames-default.jpg' },
    { name: 'Lawn Signs', filename: 'lawn-signs-default.jpg' },
    { name: 'Flags & Banners', filename: 'flags-default.jpg' },
    { name: 'Presentation Folders', filename: 'folders-default.jpg' },
    { name: 'Corrugated Signs', filename: 'corrugated-default.jpg' },
    { name: 'Custom Banners', filename: 'banners-default.jpg' }
];

// Generate placeholders
products.forEach(product => {
    const placeholder = generatePlaceholderSVG(product.name);
    // Here you would save the placeholder to a file
    console.log(`Generated placeholder for ${product.name}: ${product.filename}`);
});   