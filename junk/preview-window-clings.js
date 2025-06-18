const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');

// Same enhanced prompts from the main script
const ENHANCED_PROMPTS = {
    'window-clings': {
        base: "Professional window graphics and clings, commercial storefront applications, trade printing quality vinyl materials, architectural installation context",
        'Static Cling': "Static cling window graphics on storefront glass, removable adhesive-free installation, professional retail application, trade printing catalog style",
        'Clear Vinyl': "Clear vinyl window clings on commercial glass windows, transparent substrate with opaque graphics, professional storefront branding showcase",
        'Perforated Vinyl': "Perforated vinyl window graphics demonstrating one-way vision, commercial building installation, privacy with visibility, trade printing quality",
        'White Vinyl': "White vinyl window clings with full coverage opacity, professional storefront installation, solid background for graphics, trade printing showcase",
        'Frosted Film': "Frosted window film installation on office glass, privacy and branding solution, elegant translucent effect, architectural application"
    }
};

function createEnhancedPrompt(productType, option) {
    const templates = ENHANCED_PROMPTS[productType];
    if (!templates) {
        return `Professional ${productType} mockup showcasing ${option} style, high-quality presentation, realistic lighting, clean modern design`;
    }
    
    const basePrompt = templates.base;
    const specificPrompt = templates[option] || `Professional ${productType} showcasing ${option} style, high-quality presentation`;
    
    return `${specificPrompt}, ${basePrompt}, photorealistic, studio quality, professional photography, 4K resolution`;
}

// Preview the prompts for window-clings
console.log("🎨 WINDOW CLINGS - Enhanced Image Generation Preview");
console.log("=".repeat(60));

const csvPath = path.join(__dirname, 'data', 'csv', 'window-clings.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const { data: rows } = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

rows.forEach((row, index) => {
    if (!row.product_option) return;
    
    console.log(`\n📦 ${index + 1}. ${row.product_option}`);
    console.log(`📁 Current Image: ${row.image_url}`);
    console.log(`🎯 Enhanced Prompt:`);
    
    const basePrompt = createEnhancedPrompt('window-clings', row.product_option);
    
    // Show all 4 variations that would be generated
    const variations = [
        { name: 'main.jpg', suffix: 'hero shot, primary product image' },
        { name: 'view2.jpg', suffix: 'different angle, detail view' },
        { name: 'view3.jpg', suffix: 'lifestyle context, in-use scenario' },
        { name: 'view4.jpg', suffix: 'close-up detail, texture and quality focus' }
    ];
    
    variations.forEach(variation => {
        const fullPrompt = `${basePrompt}, ${variation.suffix}`;
        console.log(`   📸 ${variation.name}: ${fullPrompt.substring(0, 100)}...`);
    });
});

console.log(`\n🚀 Ready to generate enhanced images!`);
console.log(`💡 Run: export FREEPIK_API_KEY=your_key && node generate-enhanced-images.js window-clings`); 