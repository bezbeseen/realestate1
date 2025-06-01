// Freepik Image Loader with Proxy
const FreepikAPI = {
    config: {
        proxyUrl: 'https://api.getbeseen.com/freepik-proxy', 
        maxRetries: 3,
        delayBetweenRequests: 1000,
        defaultImagePath: '../assets/images/products/',
        placeholderImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23f8f9fa"/%3E%3Ctext x="400" y="300" font-family="Arial" font-size="24" fill="%236c757d" text-anchor="middle"%3ELoading...%3C/text%3E%3C/svg%3E',
        errorImage: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23fee"/%3E%3Ctext x="400" y="300" font-family="Arial" font-size="24" fill="%23c33" text-anchor="middle"%3EImage Unavailable%3C/text%3E%3C/svg%3E'
    },

    // Search for images using proxy    
    async search(query) { 
        let retries = 0; 
        const img = document.createElement('img');  
        
        while (retries < this.config.maxRetries) { 
            try { 
                // Show placeholder while loading
                const result = this.config.placeholderImage;
                
                // Try to load from Freepik proxy
                const response = await fetch(`${this.config.proxyUrl}/search`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                return data.imageUrl || this.getFallbackImage(query);
            } catch (error) {
                console.warn('FreePik image search failed:', error);
                retries++;
                
                if (retries === this.config.maxRetries) {
                    return this.getFallbackImage(query);
                }
                
                await new Promise(resolve => setTimeout(resolve, this.config.delayBetweenRequests));
            }
        }
        
        return this.getFallbackImage(query);
    },

    // Get a fallback image based on category
    getFallbackImage(query) {
        // Default images mapping
        const fallbackImages = {
            'sign riders': 'sign-riders-default.jpg',
            'business cards': 'business-cards-default.jpg',
            'a-frame signs': 'a-frames-default.jpg',
            'lawn signs': 'lawn-signs-default.jpg',
            'flags': 'flags-default.jpg',
            'presentation folders': 'folders-default.jpg',
            'corrugated signs': 'corrugated-default.jpg',
            'banners': 'banners-default.jpg'
        };

        // Find matching fallback image or return placeholder
        const category = Object.keys(fallbackImages).find(key => 
            query.toLowerCase().includes(key.toLowerCase())
        );

        if (category) {
            return this.config.defaultImagePath + fallbackImages[category];
        }

        // If no matching category found, generate a placeholder
        return this.generatePlaceholder(800, 600, query);
    },

    // Generate a placeholder SVG
    generatePlaceholder(width = 800, height = 600, text = 'Loading...') {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23f8f9fa'/%3E%3Ctext x='${width/2}' y='${height/2}' font-family='Arial' font-size='24' fill='%236c757d' text-anchor='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
    }
};

// Image Loading Function
async function loadFreePikImages() {
    const images = document.querySelectorAll('.freepik-target');
    
    for (const img of images) {
        try {
            const searchQuery = img.dataset.search || img.alt;
            if (!searchQuery) continue;

            // Show loading state
            img.style.opacity = '0.5';
            img.style.transition = 'opacity 0.3s ease';
            
            // Load image
            const imageUrl = await FreepikAPI.search(searchQuery);
            if (imageUrl) {
                const tempImg = new Image();
                tempImg.onload = () => {
                    img.src = imageUrl;
                    img.style.opacity = '1';
                };
                tempImg.onerror = () => {
                    img.src = FreepikAPI.config.errorImage;
                    img.style.opacity = '1';
                };
                tempImg.src = imageUrl;
            }
        } catch (error) {
            console.error('Error loading image:', error);
            img.src = FreepikAPI.config.errorImage;
            img.style.opacity = '1';
        }
    }
}

// Load images when DOM is ready
document.addEventListener('DOMContentLoaded', loadFreePikImages);

// Export for use in other scripts
window.FreepikAPI = FreepikAPI; 