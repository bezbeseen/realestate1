// Product Image Generator
const ProductImageGenerator = {
    colors: {
        primary: '#ff5e14',
        secondary: '#2c3e50', 
        light: '#f8f9fa',
        dark: '#343a40',
        white: '#ffffff'
    },

    generateProductImage(category, width = 800, height = 600) {
        const designs = {
            'sign-riders': this.generateSignRiderDesign(),
            'business-cards': this.generateBusinessCardDesign(),
            'a-frames': this.generateAFrameDesign(),
            'lawn-signs': this.generateLawnSignDesign(),
            'flags': this.generateFlagDesign(),
            'folders': this.generateFolderDesign(),
            'corrugated': this.generateCorrugatedDesign(),
            'banners': this.generateBannerDesign()
        };

        const design = designs[category] || this.generateDefaultDesign();
        return `data:image/svg+xml,${encodeURIComponent(design)}`;
    },

    generateSignRiderDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="100" y="150" width="600" height="150" fill="${this.colors.primary}"/>
            <text x="400" y="240" font-family="Arial" font-size="48" fill="${this.colors.white}" text-anchor="middle">OPEN HOUSE</text>
            <rect x="300" y="300" width="200" height="200" fill="${this.colors.secondary}"/>
            <text x="400" y="420" font-family="Arial" font-size="24" fill="${this.colors.white}" text-anchor="middle">Professional Sign Rider</text>
        </svg>`;
    },

    generateBusinessCardDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="200" y="150" width="400" height="250" fill="${this.colors.white}" stroke="${this.colors.primary}" stroke-width="2"/>
            <text x="400" y="250" font-family="Arial" font-size="24" fill="${this.colors.secondary}" text-anchor="middle">REAL ESTATE PROFESSIONAL</text>
            <line x1="250" y1="280" x2="550" y2="280" stroke="${this.colors.primary}" stroke-width="2"/>
            <text x="400" y="320" font-family="Arial" font-size="18" fill="${this.colors.dark}" text-anchor="middle">Premium Business Cards</text>
        </svg>`;
    },

    generateAFrameDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <path d="M400,100 L200,500 L600,500 Z" fill="${this.colors.secondary}"/>
            <text x="400" y="350" font-family="Arial" font-size="36" fill="${this.colors.white}" text-anchor="middle">OPEN HOUSE</text>
            <text x="400" y="400" font-family="Arial" font-size="24" fill="${this.colors.white}" text-anchor="middle">A-Frame Sign</text>
        </svg>`;
    },

    generateLawnSignDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="150" y="150" width="500" height="300" fill="${this.colors.primary}"/>
            <text x="400" y="280" font-family="Arial" font-size="48" fill="${this.colors.white}" text-anchor="middle">FOR SALE</text>
            <path d="M380,450 L420,450 L400,500 Z" fill="${this.colors.secondary}"/>
            <text x="400" y="350" font-family="Arial" font-size="24" fill="${this.colors.white}" text-anchor="middle">Lawn Sign</text>
        </svg>`;
    },

    generateFlagDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="150" y="100" width="100" height="400" fill="${this.colors.secondary}"/>
            <path d="M250,100 L550,200 L250,300" fill="${this.colors.primary}"/>
            <text x="400" y="220" font-family="Arial" font-size="36" fill="${this.colors.white}" text-anchor="middle">OPEN</text>
            <text x="400" y="500" font-family="Arial" font-size="24" fill="${this.colors.dark}" text-anchor="middle">Feather Flag</text>
        </svg>`;
    },

    generateFolderDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <path d="M200,150 L600,150 L600,450 L200,450 Z" fill="${this.colors.white}" stroke="${this.colors.primary}" stroke-width="2"/>
            <path d="M200,150 L300,150 L350,200 L600,200 L600,450 L200,450 Z" fill="${this.colors.secondary}"/>
            <text x="400" y="350" font-family="Arial" font-size="24" fill="${this.colors.white}" text-anchor="middle">Presentation Folder</text>
        </svg>`;
    },

    generateCorrugatedDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="150" y="150" width="500" height="300" fill="${this.colors.white}" stroke="${this.colors.primary}" stroke-width="4"/>
            <pattern id="corrugated" patternUnits="userSpaceOnUse" width="20" height="20">
                <path d="M0,10 L20,10" fill="none" stroke="${this.colors.secondary}" stroke-width="1"/>
            </pattern>
            <rect x="150" y="150" width="500" height="300" fill="url(#corrugated)"/>
            <text x="400" y="320" font-family="Arial" font-size="36" fill="${this.colors.primary}" text-anchor="middle">Corrugated Sign</text>
        </svg>`;
    },

    generateBannerDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <rect x="100" y="200" width="600" height="200" fill="${this.colors.primary}"/>
            <text x="400" y="320" font-family="Arial" font-size="48" fill="${this.colors.white}" text-anchor="middle">CUSTOM BANNER</text>
            <circle cx="150" cy="200" r="10" fill="${this.colors.secondary}"/>
            <circle cx="650" cy="200" r="10" fill="${this.colors.secondary}"/>
            <circle cx="150" cy="400" r="10" fill="${this.colors.secondary}"/>
            <circle cx="650" cy="400" r="10" fill="${this.colors.secondary}"/>
        </svg>`;
    },

    generateDefaultDesign() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="${this.colors.light}"/>
            <text x="400" y="300" font-family="Arial" font-size="24" fill="${this.colors.secondary}" text-anchor="middle">Product Image</text>
        </svg>`;
    }
};

// Generate all product images
function generateAllProductImages() {
    const products = [
        'sign-riders',
        'business-cards',
        'a-frames',
        'lawn-signs',
        'flags',
        'folders',
        'corrugated',
        'banners'
    ];

    products.forEach(product => {
        const imageData = ProductImageGenerator.generateProductImage(product);
        const img = new Image();
        img.src = imageData;
        img.onload = () => {
            // Convert SVG to canvas to save as JPG
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            
            // Create download link
            const link = document.createElement('a');
            link.download = `${product}-default.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.9);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    });
}

// Export for use in other scripts
window.ProductImageGenerator = ProductImageGenerator;
window.generateAllProductImages = generateAllProductImages;

// Product Image Loading System
document.addEventListener('DOMContentLoaded', function() {
    const productImages = document.querySelectorAll('.product-image');
    
    productImages.forEach(img => {
        const originalSrc = img.src;
        const fallbackSrc = generatePlaceholder(img.alt || 'Product Image');
        
        img.onerror = function() {
            if (img.src !== fallbackSrc) {
                console.warn(`Failed to load image: ${img.src}`);
                img.src = fallbackSrc;
            }
        };
        
        // Add loading animation
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
        
        img.onload = function() {
            img.style.opacity = '1';
        };
    });
});

// Generate placeholder SVG
function generatePlaceholder(text) {
    return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
            <rect width="800" height="600" fill="#f8f9fa"/>
            <text x="400" y="300" font-family="Arial" font-size="24" fill="#6c757d" text-anchor="middle">${text}</text>
        </svg>
    `)}`;
}

// Export for use in other scripts
window.ProductImages = { 
    generatePlaceholder
}; 

// Product Image System with Freepik Integration
const ProductImageSystem = {
    // Debug mode for verbose logging
    debug: true,

    // Default placeholder images
    defaultImages: {
        'a-frames': {
            standard: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                    <rect width="800" height="600" fill="#f8f9fa"/>
                    <path d="M400,100 L200,500 L600,500 Z" fill="#e9ecef"/>
                    <text x="400" y="350" font-family="Arial" font-size="36" fill="#6c757d" text-anchor="middle">Standard A-Frame</text>
                </svg>
            `),
            custom: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                    <rect width="800" height="600" fill="#f8f9fa"/>
                    <path d="M400,100 L200,500 L600,500 Z" fill="#e9ecef"/>
                    <text x="400" y="350" font-family="Arial" font-size="36" fill="#6c757d" text-anchor="middle">Custom A-Frame</text>
                </svg>
            `),
            deluxe: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                    <rect width="800" height="600" fill="#f8f9fa"/>
                    <path d="M400,100 L200,500 L600,500 Z" fill="#e9ecef"/>
                    <text x="400" y="350" font-family="Arial" font-size="36" fill="#6c757d" text-anchor="middle">Deluxe A-Frame</text>
                </svg>
            `),
            premium: 'data:image/svg+xml,' + encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                    <rect width="800" height="600" fill="#f8f9fa"/>
                    <path d="M400,100 L200,500 L600,500 Z" fill="#e9ecef"/>
                    <text x="400" y="350" font-family="Arial" font-size="36" fill="#6c757d" text-anchor="middle">Premium A-Frame</text>
                </svg>
            `)
        }
    },

    // Logger utility
    log(type, message, data = null) {
        const styles = {
            info: 'color: #0066cc',
            success: 'color: #00cc66',
            warning: 'color: #ff9900',
            error: 'color: #cc0000'
        };

        if (this.debug || type === 'error') {
            console.groupCollapsed(`%c[ProductImageSystem] ${message}`, styles[type]);
            if (data) console.log('Details:', data);
            console.trace('Stack trace:');
            console.groupEnd();
        }
    },

    // Get appropriate image based on type and availability
    async getImage(type, category) {
        // First try Freepik   
        try {
            const freepikUrl = await this.loadFreepikImage(type);
            if (freepikUrl) return freepikUrl;
        } catch (error) {
            this.log('warning', 'Freepik image load failed, trying local', { type, category, error });
        }

        // Then try local
        const localPath = `../images/products/${category}/${type}.jpg`;   
        try {
            const response = await fetch(localPath, { method: 'HEAD' });
            if (response.ok) return localPath;
        } catch (error) {
            this.log('warning', 'Local image not found', { localPath, error });
        }

        // Finally use default placeholder
        return this.defaultImages[category]?.[type] || this.generatePlaceholder(`${type} Image`);
    },

    // Base API URL based on environment
    getApiUrl() {
        const hostname = window.location.hostname;
        const isProduction = hostname === 'realestate.getbeseen.com';
        const url = isProduction 
            ? 'https://realestate.getbeseen.com/api/freepik-proxy.php'
            : '/api/freepik-proxy.php';
        
        this.log('info', 'API URL determined', { hostname, isProduction, url });
        return url;
    },

    // Freepik image IDs for different categories
    freepikImages: {
        'a-frames': [
            '9464155',  // A-frame sign mockup
            '9464156',  // Premium A-frame design
            '9464157',  // Deluxe A-frame variant
            '9464158'   // Standard A-frame display
        ]
    },

    async loadFreepikImage(imageId) {
        this.log('info', 'Starting image load', { imageId });
        
        try {
            const apiUrl = this.getApiUrl();
            this.log('info', 'Fetching from Freepik API', { url: `${apiUrl}?action=get_image&id=${imageId}` });
            
            const response = await fetch(`${apiUrl}?action=get_image&id=${imageId}`);
            this.log('info', 'Received API response', { 
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            this.log('info', 'Parsed API response', { result });
            
            if (!result.success) {
                this.log('error', 'Freepik API error', {
                    error: result.error,
                    response: result.response,
                    imageId
                });
                throw new Error(result.error);
            }
            
            if (result.data?.data?.url) {
                this.log('success', 'Successfully loaded Freepik image', {
                    imageId,
                    url: result.data.data.url
                });
                return result.data.data.url;
            } else {
                this.log('error', 'Invalid API response format', { result });
                throw new Error('Invalid response format from Freepik API');
            }
        } catch (error) {
            this.log('error', 'Failed to load Freepik image', {
                imageId,
                error: error.message,
                stack: error.stack
            });
            throw error; // Let the calling function handle the fallback
        }
    },

    generatePlaceholder(text) {
        this.log('info', 'Generating placeholder SVG', { text });
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                <rect width="800" height="600" fill="#f8f9fa"/>
                <text x="400" y="300" font-family="Arial" font-size="24" fill="#6c757d" text-anchor="middle">${text}</text>
            </svg>
        `)}`;
    }
};

// Initialize product images when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    ProductImageSystem.log('info', 'Initializing product images');
    const productImages = document.querySelectorAll('.product-image');
    
    for (const img of productImages) {
        // Add loading state
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
        
        // Extract image type from src or data attribute
        const src = img.src || '';
        const type = src.split('/').pop().replace('.jpg', '') || 'standard';
        const category = img.dataset.category || 'a-frames';
        
        try {
            const imageUrl = await ProductImageSystem.getImage(type, category);
            img.src = imageUrl;
            img.style.opacity = '1';
            ProductImageSystem.log('success', 'Image loaded', { type, category, url: imageUrl });
        } catch (error) {
            ProductImageSystem.log('error', 'Failed to load image', { type, category, error });
            img.src = ProductImageSystem.defaultImages[category]?.[type] || 
                     ProductImageSystem.generatePlaceholder(img.alt || 'Image Load Error');
            img.style.opacity = '1';
        }
    }
});

// Export for use in other scripts
window.ProductImageSystem 