const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const Handlebars = require('handlebars');
const Papa = require('papaparse');
const { marked } = require('marked');

const config = {
    dataDir: path.join(__dirname, 'data'),
    templatesDir: path.join(__dirname, 'templates'),
    outputDir: path.join(__dirname, 'dist'),
    assetsDir: path.join(__dirname, 'assets'),
    includesDir: path.join(__dirname, 'includes_new'),
    baseDir: __dirname,
};

async function build() {
    try {
        console.log('Starting CSV-enhanced build...');

        // Register Handlebars partials
        const partialsDir = config.includesDir;
        if (fs.existsSync(partialsDir)) {
            const partialFiles = fs.readdirSync(partialsDir);
            partialFiles.forEach(file => {
                if (file.endsWith('.html')) {
                    const partialName = path.basename(file, '.html');
                    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8');
                    Handlebars.registerPartial(partialName, partialContent);
                }
            });
        }
        
        // Clean and recreate the output directory
        fs.removeSync(config.outputDir);
        fs.mkdirSync(config.outputDir, { recursive: true });

        // Copy static assets
        if (fs.existsSync(config.assetsDir)) {
            fs.copySync(config.assetsDir, path.join(config.outputDir, 'assets'));
        }
        if (fs.existsSync(config.dataDir)) {
            fs.copySync(config.dataDir, path.join(config.outputDir, 'data'));
        }
         if (fs.existsSync(config.templatesDir)) {
            fs.copySync(config.templatesDir, path.join(config.outputDir, 'templates'));
        }

        // Load main data file
        const productsFilePath = path.join(config.dataDir, 'products.json');
        if (!fs.existsSync(productsFilePath)) {
            console.log('products.json not found. Skipping product page generation.');
            return;
        }
        let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
        
        console.log(`Found ${products.length} products to process.`);

        // --- Merge CSV and Markdown data into products ---
        for (const product of products) {
            console.log(`Processing product: ${product.id}`);
            // Merge CSV data for product options
            const csvPath = path.join(config.dataDir, 'csv', `${product.id}.csv`);
            if (fs.existsSync(csvPath)) {
                console.log(`  -> Merging CSV data for ${product.id}`);
                const csvFile = fs.readFileSync(csvPath, 'utf8');
                const { data: csvData } = Papa.parse(csvFile, { header: true, skipEmptyLines: true });
                
                if (csvData.length > 0) {
                    const variants = csvData.map(row => {
                        if (!row.product_option) return null;
                        return {
                            name: row.product_option,
                            image_url: row.image_url,
                            quantity: row.quantity,
                            price_change: 0, 
                            default: row.default?.toLowerCase() === 'true',
                            alt_tag: row.product_option,
                            label: row.product_option,
                            freepik_prompt: row.freepik_prompt,
                        };
                    }).filter(v => v);

                    if (variants.length > 0) {
                        product.product_details.options = [{
                            name: "Select Option",
                            variants: variants
                        }];

                        // Find the default variant or the first one with an image url
                        const defaultVariant = variants.find(v => v.default && v.image_url);
                        const firstImageVariant = variants.find(v => v.image_url);
                        const primaryVariant = defaultVariant || firstImageVariant;

                        if (primaryVariant) {
                            product.product_image = primaryVariant.image_url;
                        }

                        // --- Dynamically build the gallery from variants ---
                        const galleryImages = variants.map((variant, index) => {
                            if (!variant.image_url) return null;
                            return {
                                id: `image_${index + 1}`,
                                src: variant.image_url,
                                alt: variant.alt_tag || variant.name
                            };
                        }).filter(Boolean);

                        const galleryThumbnails = variants.map((variant, index) => {
                            if (!variant.image_url) return null;
                            return {
                                target: `#image_${index + 1}`,
                                src: variant.image_url,
                                alt: variant.alt_tag || variant.name,
                                label: variant.label || variant.name
                            };
                        }).filter(Boolean);
                        
                        if (galleryImages.length > 0) {
                            product.gallery = {
                                main_images: galleryImages,
                                thumbnails: galleryThumbnails
                            };
                        }
                    }
                }
            }

            // Merge Markdown content for the product body
            const mdPath = path.join(__dirname, 'content', 'products', `${product.id}.md`);
            if (fs.existsSync(mdPath)) {
                console.log(`  -> Merging Markdown content for ${product.id}`);
                const mdContent = fs.readFileSync(mdPath, 'utf8');
                product.product_content = marked(mdContent);
            }

            // Merge HTML content for the product body (overwrites Markdown if present)
            const htmlPath = path.join(__dirname, 'content', 'products', `${product.id}.html`);
            if (fs.existsSync(htmlPath)) {
                console.log(`  -> Merging HTML content for ${product.id}`);
                product.product_content = fs.readFileSync(htmlPath, 'utf8');
            }
        }

        // Compile and generate product pages
        const productTemplatePath = path.join(config.templatesDir, 'product-template.html');
        if (fs.existsSync(productTemplatePath)) {
            const productTemplate = Handlebars.compile(fs.readFileSync(productTemplatePath, 'utf8'));
            for (const product of products) {
                if(product.path) {
                    const compiledHtml = productTemplate(product);
                    const outputPath = path.join(config.outputDir, product.path);
                    fs.ensureDirSync(path.dirname(outputPath));
                    fs.writeFileSync(outputPath, compiledHtml);
                }
            }
        }

        // --- Generate Category Pages ---
        const categoryTemplatePath = path.join(config.templatesDir, 'category-template.html');
        const categoriesFilePath = path.join(config.dataDir, 'categories.json');

        if (fs.existsSync(categoryTemplatePath) && fs.existsSync(categoriesFilePath)) {
            const categoryTemplate = Handlebars.compile(fs.readFileSync(categoryTemplatePath, 'utf8'));
            const categories = JSON.parse(fs.readFileSync(categoriesFilePath, 'utf8'));

            for (const category of categories) {
                // Filter products that belong to the current category
                category.products = products.filter(p => p.category === category.id);
                
                // Generate the page
                const compiledHtml = categoryTemplate(category);
                const outputPath = path.join(config.outputDir, category.path);
                fs.ensureDirSync(path.dirname(outputPath));
                fs.writeFileSync(outputPath, compiledHtml);
                console.log(`-> Generated category page: ${category.path}`);
            }
        }

        // Copy root HTML files
        const otherHtmlFiles = await glob('*.html', { cwd: config.baseDir });
        for (const file of otherHtmlFiles) {
             fs.copySync(path.join(config.baseDir, file), path.join(config.outputDir, file));
        }

        console.log('Build successful!');
    } catch (error) {
        console.error('Build failed:', error);
    }
}

build(); 