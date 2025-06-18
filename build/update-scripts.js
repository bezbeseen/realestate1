const fs = require('fs');
const path = require('path');

// Directories to scan
const directories = [
    'products/prints',
    'products/signs',
    'products/promotional',
    'services'
];

// Scripts to add
const scriptsToAdd = `
    <script src="/assets/js/include.js"></script>
    <script>
        includeHTML();
    </script>
`;

// Function to process a file
function processFile(filePath) {
    try {
        // Read the file
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if the file already has the scripts
        if (content.includes('include.js') && content.includes('includeHTML()')) {
            console.log(`Skipping ${filePath} - already has required scripts`);
            return;
        }
        
        // Find the last script tag
        const lastScriptIndex = content.lastIndexOf('</script>');
        if (lastScriptIndex === -1) {
            console.log(`Skipping ${filePath} - no script tags found`);
            return;
        }
        
        // Insert the new scripts after the last script tag
        const newContent = content.slice(0, lastScriptIndex + 9) + scriptsToAdd + content.slice(lastScriptIndex + 9);
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Function to recursively scan directories
function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            scanDirectory(fullPath);
        } else if (item.endsWith('.html')) {
            processFile(fullPath);
        }
    }
}

// Main execution
console.log('Starting script update process...');

// Process each directory
for (const dir of directories) {
    if (fs.existsSync(dir)) {
        console.log(`\nScanning directory: ${dir}`);
        scanDirectory(dir);
    } else {
        console.log(`Directory not found: ${dir}`);
    }
}

console.log('\nScript update process completed!'); 