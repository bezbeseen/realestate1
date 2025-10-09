const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const DOMAIN = 'https://getbeseen.com';
const OUTPUT_FILE = 'sitemap.xml';

// Generate sitemap
function generateSitemap() {
    const urls = [];
    const outputDir = path.join(__dirname, '..', '..', 'generated');
    
    // Get all HTML files using find command (more reliable)
    const findCommand = `find "${outputDir}" -name "*.html" | grep -v templates | grep -v assets | grep -v developer-tools | grep -v homepage.html | grep -v checkout.html | grep -v cart.html`;
    
    let htmlFiles = [];
    try {
        const result = execSync(findCommand, { encoding: 'utf8' });
        htmlFiles = result.trim().split('\n').filter(file => file.length > 0);
    } catch (error) {
        console.error('Error finding HTML files:', error.message);
        return;
    }
    
    console.log(`Found ${htmlFiles.length} HTML files for sitemap`);
    
    htmlFiles.forEach(filePath => {
        // Convert absolute path to relative URL
        const relativePath = path.relative(outputDir, filePath).replace(/\\/g, '/');
        let url = relativePath === 'index.html' ? '/' : `/${relativePath}`;
        
        // Determine priority and changefreq based on path
        let priority = '0.5';
        let changefreq = 'monthly';
        
        if (url === '/') {
            priority = '1.0';
            changefreq = 'weekly';
        } else if (url.includes('/products/') && url.split('/').length === 3) {
            // Category pages like /products/prints.html
            priority = '0.8';
            changefreq = 'weekly';
        } else if (url.includes('/products/')) {
            // Individual product pages
            priority = '0.7';
        } else if (url.includes('/services/') && url.split('/').length === 3) {
            // Main service pages
            priority = '0.8';
        } else if (url.includes('/services/')) {
            // Service sub-pages
            priority = '0.7';
        } else if (url.includes('/industries/')) {
            priority = '0.8';
        } else if (['/products.html', '/services.html', '/industries.html'].includes(url)) {
            priority = '0.8';
            changefreq = 'weekly';
        } else if (['/about.html', '/contact.html', '/blog.html'].includes(url)) {
            priority = '0.6';
        } else if (['/search-results.html', '/success.html'].includes(url)) {
            priority = '0.3';
        }
        
        urls.push({
            loc: `${DOMAIN}${url}`,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: changefreq,
            priority: priority
        });
    });
    
    // Sort URLs by priority (descending) then alphabetically
    urls.sort((a, b) => {
        if (b.priority !== a.priority) {
            return parseFloat(b.priority) - parseFloat(a.priority);
        }
        return a.loc.localeCompare(b.loc);
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
    
    // Write sitemap
    const outputPath = path.join(__dirname, '..', '..', 'generated', OUTPUT_FILE);
    fs.writeFileSync(outputPath, xml);
    
    // Generate summary
    const summary = {
        homepage: urls.filter(u => u.loc.endsWith('/')).length,
        categoryPages: urls.filter(u => u.priority === '0.8').length,
        productPages: urls.filter(u => u.loc.includes('/products/') && u.priority === '0.7').length,
        servicePages: urls.filter(u => u.loc.includes('/services/')).length,
        otherPages: urls.filter(u => !u.loc.includes('/products/') && !u.loc.includes('/services/') && !u.loc.includes('/industries/') && !u.loc.endsWith('/')).length,
        totalUrls: urls.length
    };
    
    console.log('✅ Sitemap generated with', summary.totalUrls, 'URLs');
    console.log('📄 Saved to:', OUTPUT_FILE);
    console.log('');
    console.log('📊 Sitemap Summary:');
    console.log(`   Homepage: ${summary.homepage}`);
    console.log(`   Category Pages: ${summary.categoryPages}`);
    console.log(`   Product Pages: ${summary.productPages}`);
    console.log(`   Service Pages: ${summary.servicePages}`);
    console.log(`   Other Pages: ${summary.otherPages}`);
    console.log(`   Total URLs: ${summary.totalUrls}`);
}

module.exports = { generateSitemap };