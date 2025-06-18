const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const Handlebars = require('handlebars');
const Papa = require('papaparse');
const { marked } = require('marked');

const config = {
    dataDir: path.join(__dirname, '..', 'data'),
    templatesDir: path.join(__dirname, '..', 'templates'),
    outputDir: path.join(__dirname, '..', 'generated'),
    assetsDir: path.join(__dirname, '..', 'assets'),
    includesDir: path.join(__dirname, '..', 'includes'),
    baseDir: path.join(__dirname, '..'),
};

async function build() {
    try {
        console.log('Starting CSV-enhanced build...');

        // Register Handlebars partials with tracking comments
        const partialsDir = config.includesDir;
        if (fs.existsSync(partialsDir)) {
            const partialFiles = fs.readdirSync(partialsDir);
            partialFiles.forEach(file => {
                if (file.endsWith('.html')) {
                    const partialName = path.basename(file, '.html');
                    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8');
                    
                    // Wrap partial content with tracking comments
                    const wrappedContent = `<!-- INCLUDE START: ${partialName} -->\n${partialContent}\n<!-- INCLUDE END: ${partialName} -->`;
                    
                    Handlebars.registerPartial(partialName, wrappedContent);
                }
            });
        }
        
        // Clean and recreate the output directory
        if (fs.existsSync(config.outputDir)) {
            try {
        fs.removeSync(config.outputDir);
            } catch (err) {
                console.log('Warning: Could not fully remove output directory, continuing...');
            }
        }
        fs.ensureDirSync(config.outputDir);

        // Copy static assets
        if (fs.existsSync(config.assetsDir)) {
            fs.copySync(config.assetsDir, path.join(config.outputDir, 'assets'), { overwrite: true });
        }
        if (fs.existsSync(config.dataDir)) {
            fs.copySync(config.dataDir, path.join(config.outputDir, 'data'), { overwrite: true });
        }
        if (fs.existsSync(config.templatesDir)) {
            fs.copySync(config.templatesDir, path.join(config.outputDir, 'templates'), { overwrite: true });
        }
        if (fs.existsSync(config.includesDir)) {
            fs.copySync(config.includesDir, path.join(config.outputDir, 'includes'), { overwrite: true });
        }
        
        // Copy services directory
        const servicesDir = path.join(__dirname, '..', 'services');
        if (fs.existsSync(servicesDir)) {
            fs.copySync(servicesDir, path.join(config.outputDir, 'services'), { overwrite: true });
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
            const mdPath = path.join(__dirname, '..', 'content', 'products', `${product.id}.md`);
            if (fs.existsSync(mdPath)) {
                console.log(`  -> Merging Markdown content for ${product.id}`);
                const mdContent = fs.readFileSync(mdPath, 'utf8');
                product.product_content = marked(mdContent);
            }

            // Merge HTML content for the product body (overwrites Markdown if present)
            const htmlPath = path.join(__dirname, '..', 'content', 'products', `${product.id}.html`);
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
                    
                    // Convert path from /products/category/product/index.html to /products/category/product.html
                    let cleanPath = product.path;
                    if (cleanPath.endsWith('/index.html')) {
                        cleanPath = cleanPath.replace('/index.html', '.html');
                    }
                    
                    const outputPath = path.join(config.outputDir, cleanPath);
                    fs.ensureDirSync(path.dirname(outputPath));
                    fs.writeFileSync(outputPath, compiledHtml);
                    console.log(`-> Generated product page: ${cleanPath}`);
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

        // --- Generate Products Page from template ---\
        const productsPageTemplatePath = path.join(config.templatesDir, 'products-page-template.html');
        if (fs.existsSync(productsPageTemplatePath)) {
            const productsPageTemplate = Handlebars.compile(fs.readFileSync(productsPageTemplatePath, 'utf8'));
            const compiledHtml = productsPageTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'products.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated products.html from template');
        }

        // --- Generate Services Page from template ---
        const servicesPageTemplatePath = path.join(config.templatesDir, 'services-page-template.html');
        if (fs.existsSync(servicesPageTemplatePath)) {
            const servicesPageTemplate = Handlebars.compile(fs.readFileSync(servicesPageTemplatePath, 'utf8'));
            const compiledHtml = servicesPageTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'services.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated services.html from template');
        }

        // --- Generate Industries Page from template ---
        const industriesPageTemplatePath = path.join(config.templatesDir, 'industries-template.html');
        if (fs.existsSync(industriesPageTemplatePath)) {
            const industriesPageTemplate = Handlebars.compile(fs.readFileSync(industriesPageTemplatePath, 'utf8'));
            const compiledHtml = industriesPageTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'industries.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated industries.html from template');
        }

        // --- Generate Promotional Products Page from template ---
        const promotionalTemplatePath = path.join(config.templatesDir, 'promotional-template.html');
        if (fs.existsSync(promotionalTemplatePath)) {
            const promotionalTemplate = Handlebars.compile(fs.readFileSync(promotionalTemplatePath, 'utf8'));
            const compiledHtml = promotionalTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'products', 'promotional.html');
            fs.ensureDirSync(path.dirname(outputPath));
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated products/promotional.html from template');
        }

        // --- Generate Individual Service Pages ---
        const serviceDetailsTemplatePath = path.join(config.templatesDir, 'service-details-template.html');
        const servicesFilePath = path.join(config.dataDir, 'services.json');
        
        if (fs.existsSync(serviceDetailsTemplatePath) && fs.existsSync(servicesFilePath)) {
            const serviceDetailsTemplate = Handlebars.compile(fs.readFileSync(serviceDetailsTemplatePath, 'utf8'));
            const services = JSON.parse(fs.readFileSync(servicesFilePath, 'utf8'));
            
            // Ensure services directory exists in output
            fs.ensureDirSync(path.join(config.outputDir, 'services'));
            
            for (const service of services) {
                const compiledHtml = serviceDetailsTemplate(service);
                const outputPath = path.join(config.outputDir, service.path);
                fs.ensureDirSync(path.dirname(outputPath));
                fs.writeFileSync(outputPath, compiledHtml);
                console.log(`-> Generated service page: ${service.path}`);
            }
        }

        // --- Generate Individual Industry Pages ---
        const industryDetailsTemplatePath = path.join(config.templatesDir, 'industry-details-template.html');
        const industriesContentDir = path.join(__dirname, '..', 'content', 'industries');
        
        if (fs.existsSync(industryDetailsTemplatePath) && fs.existsSync(industriesContentDir)) {
            const industryDetailsTemplate = Handlebars.compile(fs.readFileSync(industryDetailsTemplatePath, 'utf8'));
            const industryFiles = fs.readdirSync(industriesContentDir).filter(file => file.endsWith('.html'));
            
            // Ensure industries directory exists in output
            fs.ensureDirSync(path.join(config.outputDir, 'industries'));
            
            for (const industryFile of industryFiles) {
                const industryName = path.basename(industryFile, '.html');
                const industryContent = fs.readFileSync(path.join(industriesContentDir, industryFile), 'utf8');
                
                // Create page title from filename
                const pageTitle = industryName.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                const industryData = {
                    page_title: pageTitle,
                    industry_content: industryContent
                };
                
                const compiledHtml = industryDetailsTemplate(industryData);
                const outputPath = path.join(config.outputDir, 'industries', industryFile);
                fs.writeFileSync(outputPath, compiledHtml);
                console.log(`-> Generated industry page: industries/${industryFile}`);
            }
        }

        // --- Generate Index Page from template ---
        const indexTemplatePath = path.join(config.templatesDir, 'index-template.html');
        if (fs.existsSync(indexTemplatePath)) {
            const indexTemplate = Handlebars.compile(fs.readFileSync(indexTemplatePath, 'utf8'));
            const compiledHtml = indexTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'index.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated index.html from template');
        }

        // --- Generate Customer Homepage from template ---
        const homepageTemplatePath = path.join(config.templatesDir, 'homepage-template.html');
        if (fs.existsSync(homepageTemplatePath)) {
            const homepageTemplate = Handlebars.compile(fs.readFileSync(homepageTemplatePath, 'utf8'));
            const compiledHtml = homepageTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'homepage.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated homepage.html from template');
        }

        // --- Generate About Page from template ---
        const aboutTemplatePath = path.join(config.templatesDir, 'about-template.html');
        if (fs.existsSync(aboutTemplatePath)) {
            const aboutTemplate = Handlebars.compile(fs.readFileSync(aboutTemplatePath, 'utf8'));
            const compiledHtml = aboutTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'about.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated about.html from template');
        }

        // --- Generate Contact Page from template ---
        const contactTemplatePath = path.join(config.templatesDir, 'contact-template.html');
        if (fs.existsSync(contactTemplatePath)) {
            const contactTemplate = Handlebars.compile(fs.readFileSync(contactTemplatePath, 'utf8'));
            const compiledHtml = contactTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'contact.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated contact.html from template');
        }

        // --- Generate Blog Page from template ---
        const blogTemplatePath = path.join(config.templatesDir, 'blog-template.html');
        if (fs.existsSync(blogTemplatePath)) {
            const blogTemplate = Handlebars.compile(fs.readFileSync(blogTemplatePath, 'utf8'));
            const compiledHtml = blogTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'blog.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated blog.html from template');
        }

        // --- Generate Search Results Page from template ---
        const searchResultsTemplatePath = path.join(config.templatesDir, 'search-results-template.html');
        if (fs.existsSync(searchResultsTemplatePath)) {
            const searchResultsTemplate = Handlebars.compile(fs.readFileSync(searchResultsTemplatePath, 'utf8'));
            const compiledHtml = searchResultsTemplate({}); // No specific data needed for this page
            const outputPath = path.join(config.outputDir, 'search-results.html');
            fs.writeFileSync(outputPath, compiledHtml);
            console.log('-> Generated search-results.html from template');
        }

        // Copy root HTML files (excluding the now-templated pages and index files)
        const otherHtmlFiles = await glob('*.html', { cwd: config.baseDir, ignore: ['products.html', 'services.html', 'products/promotional.html', 'index.html', 'staging-index.html', 'about.html', 'contact.html', 'blog.html'] });
        for (const file of otherHtmlFiles) {
             fs.copySync(path.join(config.baseDir, file), path.join(config.outputDir, file));
        }

        // Copy developer tools page
        const devToolsSource = path.join(__dirname, '..', 'developer-tools.html');
        const devToolsDest = path.join(config.outputDir, 'developer-tools.html');
        if (fs.existsSync(devToolsSource)) {
            fs.copyFileSync(devToolsSource, devToolsDest);
            console.log('-> Copied developer-tools.html');
        }

        // --- Generate Sitemap ---
        try {
            const { generateSitemap } = require('./generate-sitemap.js');
            generateSitemap();
            console.log('-> Generated sitemap.xml');
        } catch (error) {
            console.warn('Warning: Could not generate sitemap:', error.message);
        }

        console.log('Build successful!');
    } catch (error) {
        console.error('Build failed:', error);
    }
}

build(); 