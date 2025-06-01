// @ts-nocheck

(function() {
    const UNSPLASH_ACCESS_KEY = 'CNmzr5U3uHDlPXAJ1HBN30W2IkILU8grzgPZKHTmVHg';

    // Configuration object for different pages
    const PAGE_CONFIGS = {
        'business-cards': { 
            gallery: {
                query: 'business-card-mockup-stationery',
                collections: '8961162,1417351',
                count: 4
            },
            products: {
                query: 'business-card-design-stack',
                collections: '8961162',
                count: 4
            }
        },
        'real-estate-signs': {
            gallery: {
                query: 'real+estate+sign+property',
                collections: '8961162',
                count: 4
            },
            products: {
                query: 'real+estate+signage+professional',
                collections: '8961162',
                count: 4
            }
        },
        'banners': {
            gallery: {
                query: 'vinyl-banner-display-advertising',
                collections: '8961162',
                count: 4
            },
            products: {
                query: 'banner-printing-display',
                collections: '8961162',
                count: 4
            }
        },
        'presentation-folders': {
            gallery: {
                query: 'paper+folder',
                collections: '',
                count: 4 
            },
            products: {
                query: 'corporate+folder+design',
                collections: '8961162',  
                count: 4
            }
        },
        'lawn-signs': {
            gallery: {  
                query: 'yard+sign+real+estate',
                collections: '8961162',
                count: 4
            },
            products: {
                query: 'lawn+sign+display',
                collections: '8961162',
                count: 4   
            },
        },
        'a-frames': {
            gallery: {
                query: 'real-estate-a-frame-sign+open-house+for-sale',
                collections: '317099,8961162,1417351,11645424',
                count: 4
            },
            products: {
                query: 'real-estate-sandwich-board+sidewalk-sign+professional',
                collections: '317099,8961162,11645424',
                count: 4
            }  
        },
        'window-clings': {
            gallery: {
                query: 'window+decal+storefront',  
                collections: '8961162',
                count: 4
            },
            products: {
                query: 'window+graphics+retail',
                collections: '8961162',
                count: 4
            }
        }
    };

    // Helper function to create attribution
    function createAttribution(photoData) {
        const attribution = document.createElement('div');
        attribution.className = 'unsplash-attribution';
        attribution.style.cssText = 'font-size: 12px; color: #666; margin-top: 10px; text-align: center;';
        attribution.innerHTML = `Photo by <a href="${photoData.user.links.html}?utm_source=be_seen&utm_medium=referral" target="_blank">${photoData.user.name}</a> on <a href="https://unsplash.com/?utm_source=be_seen&utm_medium=referral" target="_blank">Unsplash</a>`;
        return attribution;
    }

    // Function to fetch images from Unsplash
    async function fetchUnsplashImages(query, collections, count) {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${query}&collections=${collections}&orientation=landscape&content_filter=high&per_page=${count}`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch images from Unsplash');
        }
        
        return response.json();
    }

    // Function to update images in containers
    function updateImages(containers, imageData, useThumb = false) {
        containers.forEach((img, index) => {
            if (imageData.results[index]) {
                // Store original src as fallback
                const originalSrc = img.src;
                
                // Try to load new image
                const newImage = new Image();
                newImage.onload = function() {
                    img.src = this.src;
                    img.alt = imageData.results[index].alt_description || 'Product Image';
                    
                    // Add attribution for main images only
                    if (!useThumb) {
                        const existingAttribution = img.parentElement.querySelector('.unsplash-attribution');
                        if (existingAttribution) {
                            existingAttribution.remove();
                        }
                        img.parentElement.appendChild(createAttribution(imageData.results[index]));
                    }
                };
                newImage.onerror = function() {
                    console.warn('Failed to load Unsplash image, keeping original');
                    img.src = originalSrc;
                };
                newImage.src = useThumb ? imageData.results[index].urls.thumb : imageData.results[index].urls.regular;
            }
        });
    }

    // Main function to load images
    async function loadUnsplashImages() {
        // Determine current page from URL
        const currentPath = window.location.pathname;
        const pageName = Object.keys(PAGE_CONFIGS).find(page => currentPath.includes(page));
        
        if (!pageName || !PAGE_CONFIGS[pageName]) {
            console.warn('No configuration found for current page');
            return;
        }
        
        const config = PAGE_CONFIGS[pageName];
        
        // Updated selectors to handle different page layouts
        const imageSelectors = [
            '.details_image img',           // Main content images
            '.tab-pane img',               // Gallery images
            '.product_card .item_image img', // Product images
            '.service_image img',          // Service images
            '.banner_image img',           // Banner images
            '.gallery_grid img'            // Gallery grid images
        ];
        
        const thumbnailSelectors = [
            '.nav.ul_li_block img',        // Gallery thumbnails
            '.thumbnail_grid img'          // Other thumbnails
        ];
        
        try {
            // Collect all main images
            const mainImages = [];
            imageSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                if (images.length > 0) {
                    mainImages.push(...images);
                }
            });
            
            // Collect all thumbnails
            const thumbnails = [];
            thumbnailSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                if (images.length > 0) {
                    thumbnails.push(...images);
                }
            });
            
            // Load images if we found any containers
            if (mainImages.length > 0) {
                const imageData = await fetchUnsplashImages(
                    config.gallery.query,
                    config.gallery.collections,
                    Math.max(mainImages.length, 4) // Ensure we get enough images
                );
                updateImages(mainImages, imageData);
                
                // Update thumbnails if they exist
                if (thumbnails.length > 0) {
                    updateImages(thumbnails, imageData, true);
                }
            }
            
        } catch (error) {
            console.error('Error loading Unsplash images:', error);
            // Original images will be kept as fallback
        }
    }

    // Load images when the DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Unsplash image loader initialized');
        loadUnsplashImages();
    });

    // Export for use in other scripts if needed
    window.reloadPageImages = loadUnsplashImages;
})();   