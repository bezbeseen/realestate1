const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://realestate.getbeseen.com';
const OUTPUT_FILE = 'sitemap.xml';

// Read products data
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/products.json'), 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/categories.json'), 'utf8'));

// Generate sitemap
function generateSitemap() {
    const urls = [];
    
    // Homepage
    urls.push({
        loc: `${DOMAIN}/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '1.0'
    });
    
    // Main category pages
    urls.push({
        loc: `${DOMAIN}/products/`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
    });
    
    // Products category pages
    const productCategories = [...new Set(productsData.map(product => product.category))];
    productCategories.forEach(category => {
        urls.push({
            loc: `${DOMAIN}/products/${category}/`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
        });
    });
    
    // Individual product pages
    productsData.forEach(product => {
        if (product.path) {
            // Convert path from /products/category/product/index.html to /products/category/product.html
            let cleanPath = product.path;
            if (cleanPath.endsWith('/index.html')) {
                cleanPath = cleanPath.replace('/index.html', '.html');
            }
            // Convert to URL (remove .html for cleaner URLs in sitemap)
            const url = cleanPath.replace('.html', '/');
            urls.push({
                loc: `${DOMAIN}/${url}`,
                lastmod: new Date().toISOString().split('T')[0],
                changefreq: 'monthly',
                priority: '0.7'
            });
        }
    });
    
    // Industry pages
    Object.keys(categoriesData).forEach(industrySlug => {
        urls.push({
            loc: `${DOMAIN}/industries/${industrySlug}/`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.8'
        });
    });
    
    // Additional important pages
    const additionalPages = [
        { path: '/about/', priority: '0.6' },
        { path: '/contact/', priority: '0.6' },
        { path: '/services/', priority: '0.7' }
    ];
    
    additionalPages.forEach(page => {
        urls.push({
            loc: `${DOMAIN}${page.path}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: page.priority
        });
    });
    
    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(url => {
        xml += '  <url>\n';
        xml += `    <loc>${url.loc}</loc>\n`;
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
        xml += `    <priority>${url.priority}</priority>\n`;
        xml += '  </url>\n';
    });
    
    xml += '</urlset>';
    
    // Write to file
    fs.writeFileSync(path.join(__dirname, '..', OUTPUT_FILE), xml);
    
    // Also write to generated folder if it exists
    if (fs.existsSync(path.join(__dirname, '..', 'generated'))) {
        fs.writeFileSync(path.join(__dirname, '..', 'generated', OUTPUT_FILE), xml);
    }
    
    console.log(`✅ Sitemap generated with ${urls.length} URLs`);
    console.log(`📄 Saved to: ${OUTPUT_FILE}`);
    
    // Generate a summary report
    const summary = {
        total_urls: urls.length,
        homepage: urls.filter(u => u.priority === '1.0').length,
        category_pages: urls.filter(u => u.priority === '0.8').length,
        product_pages: urls.filter(u => u.priority === '0.7').length,
        other_pages: urls.filter(u => u.priority === '0.6').length
    };
    
    console.log('\n📊 Sitemap Summary:');
    console.log(`   Homepage: ${summary.homepage}`);
    console.log(`   Category Pages: ${summary.category_pages}`);
    console.log(`   Product Pages: ${summary.product_pages}`);
    console.log(`   Other Pages: ${summary.other_pages}`);
    console.log(`   Total URLs: ${summary.total_urls}`);
    
    return xml;
}

// Run if called directly
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap }; 