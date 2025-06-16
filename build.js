const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');
const Handlebars = require('handlebars');

// A function to recursively copy a directory
async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ? await copyDir(srcPath, destPath) : await fs.copyFile(srcPath, destPath);
    }
}

// Function to process includes
async function processIncludes(html, sourceDir) {
    const includeRegex = /<div w3-include-html="(.+?)"><\/div>|<footer w3-include-html="(.+?)"(.+?)><\/footer>/g;
    let match;
    let processedHtml = html;

    while ((match = includeRegex.exec(html)) !== null) {
        const includePath = match[1] || match[2];
        const fullPath = path.join(sourceDir, includePath);
        try {
            const includeContent = await fs.readFile(fullPath, 'utf8');
            processedHtml = processedHtml.replace(match[0], includeContent);
        } catch (error) {
            console.warn(`  -> WARN: Could not include ${includePath}. File not found at ${fullPath}.`);
            processedHtml = processedHtml.replace(match[0], `<!-- WARN: Include not found: ${includePath} -->`);
        }
    }
    return processedHtml;
}

async function build() {
    try {
        console.log('Starting template-based site build...');
        
        const config = {
            outputDir: 'dist',
            assetsDir: 'assets',
            dataDir: 'data',
            templatesDir: 'templates',
            sourceDir: '.' // Relative to project root
        };

        // 1. Clean and create the output directory
        await fs.rm(config.outputDir, { recursive: true, force: true });
        await fs.mkdir(config.outputDir, { recursive: true });
        console.log(`Cleaned and created output directory: ${config.outputDir}`);

        // 2. Read product data and the main template
        const productDataPath = path.join(config.dataDir, 'products.json');
        const products = JSON.parse(await fs.readFile(productDataPath, 'utf-8'));
        console.log(`Loaded ${products.length} products from ${productDataPath}`);

        const templatePath = path.join(config.templatesDir, 'product-template.html');
        const productTemplateSource = await fs.readFile(templatePath, 'utf-8');
        const productTemplate = Handlebars.compile(productTemplateSource);
        console.log(`Loaded product template from ${templatePath}`);

        // 3. Generate product pages from the template
        for (const product of products) {
            console.log(`Processing product: ${product.product_name}...`);
            const generatedHtml = productTemplate(product);
            const finalHtml = await processIncludes(generatedHtml, config.sourceDir);
            
            const outputPath = path.join(config.outputDir, product.path);
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, finalHtml);
            console.log(`  -> Generated page at ${outputPath}`);
        }

        // 4. Find and process all other non-template HTML files (like index.html, about.html, etc.)
        const otherHtmlFiles = await glob('**/*.html', { 
            cwd: config.sourceDir, 
            ignore: [`${config.templatesDir}/**`, 'node_modules/**', `${config.outputDir}/**`]
        });

        console.log(`\nProcessing ${otherHtmlFiles.length} other HTML files...`);
        for (const file of otherHtmlFiles) {
             // Skip files that are generated from product data
            if (products.some(p => p.path === file)) {
                continue;
            }
            console.log(`Processing ${file}...`);
            const filePath = path.join(config.sourceDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            const processedContent = await processIncludes(content, path.dirname(filePath));
            
            const destPath = path.join(config.outputDir, file);
            await fs.mkdir(path.dirname(destPath), { recursive: true });
            await fs.writeFile(destPath, processedContent);
        }

        // 5. Copy the assets directory
        const sourceAssets = path.join(config.sourceDir, config.assetsDir);
        const destAssets = path.join(config.outputDir, config.assetsDir);
        await copyDir(sourceAssets, destAssets);
        console.log(`Successfully copied assets to ${destAssets}`);

        console.log('\nFull build successful!');

    } catch (error) {
        console.error('Build failed:', error);
    }
}

build(); 