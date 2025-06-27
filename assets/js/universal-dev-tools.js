(function() {
    'use strict';

    // --- START: UI Injection and Core Logic ---

    // 1. Create and inject the control panel UI
    function createControlPanel() {
        // Avoid creating multiple panels
        if (document.getElementById('universal-dev-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'universal-dev-panel';
        panel.innerHTML = `
            <div id="dev-panel-header">
                🚀 Universal Dev Tools
                <button id="dev-panel-close" style="float: right; border: none; background: transparent; color: white; cursor: pointer; font-size: 16px;">&times;</button>
            </div>
            <div id="dev-panel-content">
                <div id="dev-panel-buttons"></div>
                <div id="dev-panel-results">
                    <p>Welcome! Click a tool to start.</p>
                    <p>This tool will scan all internal links found on the current page.</p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        const style = document.createElement('style');
        style.textContent = `
            #universal-dev-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                max-height: 90vh;
                background-color: #2c3e50;
                color: #ecf0f1;
                border-radius: 8px;
                box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                z-index: 99999;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            #dev-panel-header {
                padding: 10px 15px;
                background-color: #34495e;
                cursor: grab;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                font-weight: bold;
            }
            #dev-panel-content {
                padding: 15px;
                overflow-y: auto;
            }
            #dev-panel-buttons button {
                display: block;
                width: 100%;
                padding: 12px;
                margin-bottom: 10px;
                border: none;
                border-radius: 5px;
                background-color: #3498db;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
            }
            #dev-panel-buttons button:hover {
                background-color: #2980b9;
            }
            #dev-panel-results {
                margin-top: 15px;
                padding: 10px;
                background-color: #34495e;
                border-radius: 5px;
                font-size: 13px;
                line-height: 1.6;
            }
        `;
        document.head.appendChild(style);

        // Make the panel draggable
        makeDraggable(panel);

        // Add close functionality
        document.getElementById('dev-panel-close').onclick = () => panel.remove();

        // Add tool buttons
        addToolButtons();

        console.log("Control Panel Initialized.");
    }
    
    function makeDraggable(panelElement) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        const header = panelElement.querySelector("#dev-panel-header");

        if (header) {
            header.onmousedown = dragMouseDown;
        } else {
            console.error("Dev Tools Error: Could not find draggable header.");
            return;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            header.style.cursor = 'grabbing';
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            panelElement.style.top = (panelElement.offsetTop - pos2) + "px";
            panelElement.style.left = (panelElement.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            header.style.cursor = 'grab';
        }
    }

    function addToolButtons() {
        const buttonContainer = document.getElementById('dev-panel-buttons');
        const resultsContainer = document.getElementById('dev-panel-results');

        const tools = [
            { name: 'Open All Pages', func: openAllPages },
            { name: 'Check Navigation Links', func: checkAllNavLinks },
            { name: 'Extract Product Pricing', func: extractAllPricing },
            { name: 'Scrape PrintFirm Prices', func: scrapePrintFirmPricing },
            { name: 'Check Images', func: checkAllImages },
            { name: 'Validate Forms', func: validateAllForms },
            { name: 'Check Page Speeds', func: checkPageSpeeds },
            { name: 'Generate SEO Report', func: generateSEOReport },
            { name: 'Find Duplicate Content', func: findDuplicateContent }
        ];

        tools.forEach(tool => {
            const button = document.createElement('button');
            button.textContent = tool.name;
            button.onclick = async () => {
                resultsContainer.innerHTML = '<p>Discovering pages...</p>';
                const pages = getAllInternalLinks();
                resultsContainer.innerHTML = `<p>Found ${pages.length} pages. Starting tool: ${tool.name}...</p>`;
                
                // For 'open all', we don't need the async/await structure for results
                if (tool.name === 'Open All Pages') {
                    tool.func(pages);
                    resultsContainer.innerHTML += `<p>Attempting to open ${pages.length} pages in new tabs.</p>`;
                } else {
                    await tool.func(pages, resultsContainer);
                }
            };
            buttonContainer.appendChild(button);
        });
    }

    // 2. Function to find all unique, internal links on the current page
    function getAllInternalLinks() {
        const links = new Set();
        const currentOrigin = window.location.origin;

        document.querySelectorAll('a').forEach(a => {
            try {
                if (a.href) {
                    const linkUrl = new URL(a.href, window.location.href); // Resolve relative URLs
                    // Check if the link is on the same domain, is a web link, and not a fragment
                    if (linkUrl.protocol.startsWith('http') && linkUrl.origin === currentOrigin && !a.href.includes('#')) {
                        links.add(linkUrl.href);
                    }
                }
            } catch (e) {
                // Ignore invalid URLs like mailto:, tel:, etc.
                console.warn(`Skipping invalid URL: ${a.href}`);
            }
        });
        
        // Also add the current page if it's a web page
        if (window.location.protocol.startsWith('http')) {
            links.add(window.location.href);
        }

        // If no other links are found, it might be a single page.
        // Add the root as a fallback to ensure there's at least one page to test.
        if (links.size === 0 && window.location.protocol.startsWith('http')) {
            links.add(currentOrigin);
        }

        return Array.from(links);
    }

    // --- END: UI Injection and Core Logic ---


    // --- START: Tool Functions (to be refactored) ---

    function openAllPages(pages) {
        if (confirm(`This will attempt to open ${pages.length} browser tabs. Are you sure?`)) {
            pages.forEach((page, index) => {
                setTimeout(() => {
                    window.open(page, '_blank');
                }, index * 100); // Stagger opening
            });
        }
    }

    async function checkAllNavLinks(pages, resultsContainer) {
        let pagesChecked = 0;
        const navLinks = new Set();
        const brokenLinks = [];
        const workingLinks = [];

        // 1. Extract navigation links from all pages
        resultsContainer.innerHTML = '<p>Step 1/2: Scanning pages for navigation links...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #3498db;"></div>';
        const progressBar = document.getElementById('progress-bar');

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                doc.querySelectorAll('a').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                        const fullUrl = new URL(href, window.location.origin + page).href;
                        navLinks.add(fullUrl);
                    }
                });
            } catch (error) {
                console.error(`Error extracting links from ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }

        // 2. Check each unique navigation link
        resultsContainer.innerHTML += `<p>Found ${navLinks.size} unique links. Step 2/2: Checking each link status...</p><div id="progress-bar-2" style="width: 0; height: 5px; background-color: #2ecc71;"></div>`;
        const progressBar2 = document.getElementById('progress-bar-2');
        const navLinksArray = Array.from(navLinks);
        let linksChecked = 0;

        for (const link of navLinksArray) {
            try {
                const response = await fetch(link, { method: 'HEAD', mode: 'no-cors' }); // Use HEAD for efficiency, no-cors for cross-origin
                // We can't know the status with no-cors, but it's the best we can do client-side
                // to avoid CORS errors. We'll assume if it doesn't throw, it's likely okay.
                workingLinks.push(link);
            } catch (error) {
                // This will catch network errors, but not 404s due to no-cors.
                // For a more robust solution, a server-side proxy would be needed.
                brokenLinks.push({ url: link, error: 'Potential issue (CORS or network error)' });
            }
            linksChecked++;
            progressBar2.style.width = `${(linksChecked / navLinksArray.length) * 100}%`;
        }
        
        // 3. Display results
        let report = `
            <h3>🔗 Link Check Results</h3>
            <p><strong>Total Links Found:</strong> ${navLinks.size}</p>
            <p><strong style="color: #27ae60;">✅ Working / Accessible:</strong> ${workingLinks.length}</p>
            <p><strong style="color: #c0392b;">❌ Potentially Broken:</strong> ${brokenLinks.length}</p>
            <small>Note: Due to browser security (CORS), this tool can't definitively check cross-origin links or get HTTP error codes (like 404). It primarily checks for network accessibility.</small>
        `;

        if (brokenLinks.length > 0) {
            report += `<h4>Potentially Broken Links:</h4><ul>`;
            brokenLinks.forEach(link => {
                report += `<li><a href="${link.url}" target="_blank">${link.url}</a> - ${link.error}</li>`;
            });
            report += `</ul>`;
        }
        
        resultsContainer.innerHTML = report;
    }

    async function checkAllImages(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>Scanning pages for image issues...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #3498db;"></div>';
        const progressBar = document.getElementById('progress-bar');
        
        let totalImages = 0, missingAlt = 0, brokenImages = 0, pagesChecked = 0;

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                
                const images = doc.querySelectorAll('img');
                totalImages += images.length;

                for (const img of images) {
                    if (!img.alt) missingAlt++;
                    // Basic check for broken images
                    if (img.naturalWidth === 0 && img.naturalHeight === 0 && img.src) {
                         // This check is often unreliable when run like this. A better check is fetching the image.
                        try {
                            const imgResponse = await fetch(img.src, {method: 'HEAD', mode: 'no-cors'});
                        } catch(e) {
                            brokenImages++;
                        }
                    }
                }
            } catch (error) {
                console.error(`Error checking images on ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }

        resultsContainer.innerHTML = `
            <h3>🖼️ Image Check Results</h3>
            <p><strong>Total Images Found:</strong> ${totalImages}</p>
            <p><strong>⚠️ Missing Alt Text:</strong> ${missingAlt}</p>
            <p><strong>❌ Potentially Broken:</strong> ${brokenImages}</p>
            <p><strong>📊 Alt Text Coverage:</strong> ${totalImages > 0 ? (((totalImages - missingAlt) / totalImages) * 100).toFixed(1) : 'N/A'}%</p>
        `;
    }

    async function validateAllForms(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>Scanning pages for form issues...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #3498db;"></div>';
        const progressBar = document.getElementById('progress-bar');
        let totalForms = 0, withoutAction = 0, withoutMethod = 0, pagesChecked = 0;

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const forms = doc.querySelectorAll('form');
                totalForms += forms.length;
                forms.forEach(form => {
                    if (!form.action) withoutAction++;
                    if (!form.method) withoutMethod++;
                });
            } catch (error) {
                console.error(`Error validating forms on ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }
        
        resultsContainer.innerHTML = `
            <h3>📝 Form Validation Results</h3>
            <p><strong>Total Forms Found:</strong> ${totalForms}</p>
            <p><strong>⚠️ Forms without 'action':</strong> ${withoutAction}</p>
            <p><strong>⚠️ Forms without 'method':</strong> ${withoutMethod}</p>
        `;
    }

    async function checkPageSpeeds(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>Measuring page load speeds (TTFB)...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #3498db;"></div>';
        const progressBar = document.getElementById('progress-bar');
        
        let totalTime = 0, fastPages = 0, slowPages = 0, pageCount = 0;
        
        for (const page of pages) {
            const startTime = performance.now();
            try {
                await fetch(page, {mode: 'no-cors'});
                const loadTime = performance.now() - startTime;
                totalTime += loadTime;
                if (loadTime < 500) fastPages++;
                else if (loadTime > 1500) slowPages++;
            } catch (error) {
                console.error(`Error loading ${page}:`, error);
            }
            pageCount++;
            progressBar.style.width = `${(pageCount / pages.length) * 100}%`;
        }

        const avgTime = pageCount > 0 ? totalTime / pageCount : 0;
        
        resultsContainer.innerHTML = `
            <h3>⚡ Page Speed Results (TTFB)</h3>
            <p><strong>Average Load Time:</strong> ${avgTime.toFixed(0)}ms</p>
            <p><strong>🚀 Fast Pages (&lt;500ms):</strong> ${fastPages}</p>
            <p><strong>🐌 Slow Pages (&gt;1.5s):</strong> ${slowPages}</p>
        `;
    }

    async function generateSEOReport(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>Analyzing basic SEO metrics...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #3498db;"></div>';
        const progressBar = document.getElementById('progress-bar');
        
        let withTitle = 0, withMeta = 0, withH1 = 0, multipleH1s = 0, pagesChecked = 0;
        
        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                if (doc.querySelector('title')?.textContent.trim()) withTitle++;
                if (doc.querySelector('meta[name="description"]')) withMeta++;
                const h1s = doc.querySelectorAll('h1');
                if (h1s.length > 0) withH1++;
                if (h1s.length > 1) multipleH1s++;

            } catch (error) {
                console.error(`Error analyzing SEO for ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }

        resultsContainer.innerHTML = `
            <h3>📊 Basic SEO Report</h3>
            <p><strong>Pages with Title:</strong> ${withTitle} / ${pages.length}</p>
            <p><strong>Pages with Meta Description:</strong> ${withMeta} / ${pages.length}</p>
            <p><strong>Pages with H1 Tag:</strong> ${withH1} / ${pages.length}</p>
            <p><strong>⚠️ Pages with Multiple H1s:</strong> ${multipleH1s}</p>
        `;
    }
    
    async function findDuplicateContent(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>This tool is highly complex and best run on a server. A client-side version would be too slow and unreliable. It involves fetching all page content, stripping common templates, and comparing the remaining text, which is resource-intensive.</p>';
    }

    async function extractAllPricing(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>🕵️‍♂️ Scanning pages for pricing information...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #9b59b6;"></div>';
        const progressBar = document.getElementById('progress-bar');
        
        const pricingData = [];
        let pagesChecked = 0;

        // Common selectors for price elements
        const priceSelectors = [
            '.price', '[class*="price"]', '.amount', '[class*="amount"]', 
            '.product-price', '.product__price', '.price-tag', '.final-price'
        ];
        // Regex to find price-like text (e.g., $19.99, 19.99, $19)
        const priceRegex = /\$?(\d{1,3}(,\d{3})*|\d+)(\.\d{2})?/;

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                let priceFound = null;
                const pageTitle = doc.querySelector('title')?.textContent.trim() || 'No Title';

                // 1. Try to find price with common selectors
                const priceElement = doc.querySelector(priceSelectors.join(', '));
                if (priceElement) {
                    const match = priceElement.textContent.match(priceRegex);
                    if (match) {
                        priceFound = match[0];
                    }
                }
                
                // 2. If no element found, search the whole body text as a fallback
                if (!priceFound) {
                    const bodyText = doc.body.innerText;
                    const match = bodyText.match(priceRegex);
                     if (match) {
                        // This can be noisy, so we're more strict. Look for prices near "product" or "cart" keywords.
                         if (bodyText.toLowerCase().includes('product') || bodyText.toLowerCase().includes('cart')) {
                            priceFound = match[0];
                         }
                    }
                }

                // Only add if we found a price and it's likely a product page
                if (priceFound) {
                    pricingData.push({
                        title: pageTitle,
                        url: page,
                        price: priceFound
                    });
                }

            } catch (error) {
                console.error(`Error extracting price from ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }

        // 3. Display results
        let report = `
            <h3>💰 Pricing Extraction Results</h3>
            <p>Found <strong>${pricingData.length}</strong> pages with potential pricing information.</p>
            <small>Disclaimer: This is a best-effort tool and may not be 100% accurate.</small>
            <div id="download-container" style="margin-top: 10px;"></div>
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
                <thead style="text-align: left; background-color: #34495e;">
                    <tr>
                        <th style="padding: 8px;">Product / Page</th>
                        <th style="padding: 8px;">Price</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (pricingData.length > 0) {
            pricingData.forEach(item => {
                report += `
                    <tr style="border-bottom: 1px solid #34495e;">
                        <td style="padding: 8px;"><a href="${item.url}" target="_blank" style="color: #3498db;">${item.title}</a></td>
                        <td style="padding: 8px;">${item.price}</td>
                    </tr>
                `;
            });
        } else {
            report += `<tr><td colspan="2" style="padding: 8px;">No pricing information could be extracted with common patterns.</td></tr>`;
        }
        
        report += `</tbody></table>`;
        resultsContainer.innerHTML = report;

        // 4. Add Download CSV button if there is data
        if (pricingData.length > 0) {
            const downloadButton = document.createElement('button');
            downloadButton.textContent = '📄 Download Results as CSV';
            downloadButton.style.cssText = 'background-color: #27ae60; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;';

            downloadButton.onclick = function() {
                let csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Product/Page,URL,Price\r\n"; // Header row

                pricingData.forEach(function(item) {
                    const title = `"${item.title.replace(/"/g, '""')}"`;
                    const url = `"${item.url}"`;
                    const price = `"${item.price}"`;
                    csvContent += [title, url, price].join(",") + "\r\n";
                });

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                const date = new Date().toISOString().slice(0, 10);
                link.setAttribute("download", `price_extract_${date}.csv`);
                document.body.appendChild(link); // Required for Firefox

                link.click();
                document.body.removeChild(link);
            };

            resultsContainer.querySelector('#download-container').appendChild(downloadButton);
        }
    }

    async function scrapePrintFirmPricing(pages, resultsContainer) {
        resultsContainer.innerHTML = '<p>🕵️‍♂️ Scraping PrintFirm pricing data...</p><div id="progress-bar" style="width: 0; height: 5px; background-color: #e67e22;"></div>';
        const progressBar = document.getElementById('progress-bar');
        
        const pricingData = [];
        let pagesChecked = 0;

        for (const page of pages) {
            try {
                const response = await fetch(page);
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                const pageTitle = doc.querySelector('title')?.textContent.trim() || 'No Title';

                // Find the script containing 'product_forms'
                const scripts = doc.querySelectorAll('script');
                let targetScriptContent = null;
                scripts.forEach(script => {
                    if (script.textContent.includes('product_forms')) {
                        targetScriptContent = script.textContent;
                    }
                });

                if (targetScriptContent) {
                    // This is a bit of a hack to extract the JS object. It's fragile.
                    const match = targetScriptContent.match(/product_forms\['0'\] = new Product\('0', (\{.*\})\);/);
                    if (match && match[1]) {
                        const productData = JSON.parse(match[1]);
                        
                        if (productData && productData.variants) {
                            for (const variantId in productData.variants) {
                                const variant = productData.variants[variantId];
                                pricingData.push({
                                    page: pageTitle,
                                    productCode: variant.productcode,
                                    price: variant.price,
                                    options: JSON.stringify(variant.options)
                                });
                            }
                        }
                    }
                }

            } catch (error) {
                console.error(`Error scraping PrintFirm page ${page}:`, error);
            }
            pagesChecked++;
            progressBar.style.width = `${(pagesChecked / pages.length) * 100}%`;
        }

        // Display results
        let report = `
            <h3>🖨️ PrintFirm Pricing Results</h3>
            <p>Extracted <strong>${pricingData.length}</strong> price variants.</p>
            <div id="download-container-pf"></div>
            <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
                <thead><tr><th>Page</th><th>Product Code</th><th>Price</th><th>Options</th></tr></thead>
                <tbody>
        `;
        pricingData.forEach(item => {
            report += `<tr><td>${item.page}</td><td>${item.productCode}</td><td>$${item.price}</td><td>${item.options}</td></tr>`;
        });
        report += `</tbody></table>`;
        resultsContainer.innerHTML = report;

        // Add Download CSV button
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '📄 Download as CSV';
        downloadButton.onclick = function() {
            let csvContent = "data:text/csv;charset=utf-8,Page,ProductCode,Price,Options\r\n";
            pricingData.forEach(item => {
                csvContent += `"${item.page}","${item.productCode}","${item.price}","${JSON.stringify(item.options).replace(/"/g, '""')}"\r\n`;
            });
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `printfirm_pricing.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        resultsContainer.querySelector('#download-container-pf').appendChild(downloadButton);
    }


    // --- END: Tool Functions ---

    // Initialize the tool
    createControlPanel();

})(); 