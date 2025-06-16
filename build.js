const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

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

async function build() {
    try {
        console.log('Starting full site build...');
        
        // Configuration for the build
        const config = {
            sourceDir: '.',
            outputDir: 'dist',
            htmlFiles: '**/*.html',
            exclude: ['node_modules/**', 'dist/**', '**/index-static.html'],
            assetsDir: 'assets'
        };

        // 1. Clean and create the output directory
        await fs.rm(config.outputDir, { recursive: true, force: true });
        await fs.mkdir(config.outputDir, { recursive: true });
        console.log(`Cleaned and created output directory: ${config.outputDir}`);

        // 2. Find all HTML files to process
        const files = await glob(config.htmlFiles, { cwd: config.sourceDir, ignore: config.exclude });
        console.log(`Found ${files.length} HTML files to process.`);

        // 3. Process each HTML file
        for (const file of files) {
            const sourcePath = path.join(config.sourceDir, file);
            const outputPath = path.join(config.outputDir, file);
            
            console.log(`Processing ${sourcePath}...`);
            let content = await fs.readFile(sourcePath, 'utf8');

            const includeRegex = /<div\s+w3-include-html="([^"]+)"\s*><\/div>|<header[^>]*\s+w3-include-html="([^"]+)"[^>]*><\/header>|<footer[^>]*\s+w3-include-html="([^"]+)"[^>]*><\/footer>/g;
            const matches = Array.from(content.matchAll(includeRegex));

            for (const match of matches) {
                const placeholder = match[0];
                const includePath = match[1] || match[2] || match[3];

                if (includePath) {
                    const fullIncludePath = path.resolve(path.dirname(sourcePath), includePath);
                    try {
                        const includeContent = await fs.readFile(fullIncludePath, 'utf8');
                        content = content.replace(placeholder, includeContent);
                        // console.log(`  -> Included ${fullIncludePath}`); // Optional: uncomment for verbose logging
                    } catch (err) {
                        console.warn(`  -> WARN: Could not include ${includePath}. File not found at ${fullIncludePath}.`);
                        content = content.replace(placeholder, `<!-- INCLUDE FAILED: ${includePath} -->`);
                    }
                }
            }
            
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, content);
        }

        // 4. Copy the assets directory
        const assetsSource = path.join(config.sourceDir, config.assetsDir);
        const assetsDest = path.join(config.outputDir, config.assetsDir);
        await copyDir(assetsSource, assetsDest);
        console.log(`Successfully copied assets to ${assetsDest}`);

        console.log(`\nFull build successful! ${files.length} pages processed.`);

    } catch (err) {
        console.error('\nBuild failed:', err);
    }
}

build(); 