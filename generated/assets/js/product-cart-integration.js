/**
 * Product Cart Integration
 * Simple integration between product pages and cart system
 * Follows AI guide: clean, simple, no heavy frameworks
 */

class ProductCartIntegration {
    constructor() {
        this.currentProduct = null;
        this.init();
    }

    // Initialize the integration
    init() {
        // Load product data for current page
        this.loadProductData();
        
        // Add cart functionality to product pages
        this.addCartButtons();
        
        // Add quantity selectors
        this.addQuantitySelectors();
    }

    // Load product data for the current page
    loadProductData() {
        // Get product ID from URL or page data
        const productId = this.getProductIdFromPage();
        
        if (productId) {
            // In a real implementation, you'd fetch this from products.json
            // For now, we'll use a simple approach
            this.currentProduct = {
                id: productId,
                name: this.getProductNameFromPage(),
                price: this.getProductPriceFromPage(),
                image: this.getProductImageFromPage()
            };
        }
    }

    // Get product ID from the current page
    getProductIdFromPage() {
        // Try to get from URL path
        const path = window.location.pathname;
        const matches = path.match(/\/products\/[^\/]+\/([^\/]+)/);
        
        if (matches) {
            return matches[1];
        }
        
        // Fallback: try to get from page title or data attribute
        const productElement = document.querySelector('[data-product-id]');
        if (productElement) {
            return productElement.dataset.productId;
        }
        
        return null;
    }

    // Get product name from page
    getProductNameFromPage() {
        const titleElement = document.querySelector('h1.page_title');
        if (titleElement) {
            return titleElement.textContent.trim();
        }
        
        // Fallback to page title
        return document.title.split('|')[0].trim();
    }

    // Get product price from page
    getProductPriceFromPage() {
        const priceElement = document.querySelector('.product-price, .price, [data-price]');
        if (priceElement) {
            const priceText = priceElement.textContent || priceElement.dataset.price;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            return isNaN(price) ? 29.99 : price; // Default fallback
        }
        
        return 29.99; // Default price
    }

    // Get product image from page
    getProductImageFromPage() {
        const imageElement = document.querySelector('.details_image img, .product-image img');
        if (imageElement) {
            return imageElement.src;
        }
        
        // Fallback to first image in gallery
        const galleryImage = document.querySelector('.gallery img, .product-gallery img');
        if (galleryImage) {
            return galleryImage.src;
        }
        
        return '/assets/images/placeholder.jpg'; // Default image
    }

    // Add cart buttons to product pages
    addCartButtons() {
        // Find product details section
        const productSection = document.querySelector('.shop_details, .product-details');
        
        if (productSection && this.currentProduct) {
            // Create add to cart button
            const addToCartBtn = this.createAddToCartButton();
            
            // Insert button into product section
            this.insertCartButton(productSection, addToCartBtn);
        }
    }

    // Create the add to cart button
    createAddToCartButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-primary btn-lg add-to-cart-btn';
        button.innerHTML = `
            <i class="fal fa-shopping-cart me-2"></i>
            Add to Cart - $${this.currentProduct.price.toFixed(2)}
        `;
        
        button.onclick = () => this.addToCart();
        
        return button;
    }

    // Insert cart button into product section
    insertCartButton(productSection, button) {
        // Try to find a good place to insert the button
        const priceSection = productSection.querySelector('.product-price, .price-section');
        const detailsSection = productSection.querySelector('.product-details, .details');
        
        if (priceSection) {
            priceSection.appendChild(button);
        } else if (detailsSection) {
            detailsSection.appendChild(button);
        } else {
            // Insert at the beginning of the product section
            productSection.insertBefore(button, productSection.firstChild);
        }
    }

    // Add quantity selectors
    addQuantitySelectors() {
        if (!this.currentProduct) return;
        
        const productSection = document.querySelector('.shop_details, .product-details');
        if (productSection) {
            const quantitySelector = this.createQuantitySelector();
            
            // Insert before the add to cart button
            const addToCartBtn = productSection.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.parentNode.insertBefore(quantitySelector, addToCartBtn);
            } else {
                productSection.appendChild(quantitySelector);
            }
        }
    }

    // Create quantity selector
    createQuantitySelector() {
        const container = document.createElement('div');
        container.className = 'quantity-selector mb-3';
        container.innerHTML = `
            <label for="product-quantity" class="form-label">Quantity:</label>
            <div class="input-group" style="max-width: 200px;">
                <button class="btn btn-outline-secondary" type="button" onclick="productCart.updateQuantity(-1)">-</button>
                <input type="number" class="form-control text-center" id="product-quantity" value="1" min="1" max="100">
                <button class="btn btn-outline-secondary" type="button" onclick="productCart.updateQuantity(1)">+</button>
            </div>
        `;
        
        return container;
    }

    // Update quantity
    updateQuantity(change) {
        const quantityInput = document.getElementById('product-quantity');
        if (quantityInput) {
            let newQuantity = parseInt(quantityInput.value) + change;
            newQuantity = Math.max(1, Math.min(100, newQuantity)); // Clamp between 1-100
            quantityInput.value = newQuantity;
            
            // Update button text with new total
            this.updateAddToCartButton(newQuantity);
        }
    }

    // Update add to cart button with quantity
    updateAddToCartButton(quantity) {
        const button = document.querySelector('.add-to-cart-btn');
        if (button && this.currentProduct) {
            const total = (this.currentProduct.price * quantity).toFixed(2);
            button.innerHTML = `
                <i class="fal fa-shopping-cart me-2"></i>
                Add to Cart - $${total}
            `;
        }
    }

    // Add current product to cart
    addToCart() {
        if (!this.currentProduct) return;
        
        const quantityInput = document.getElementById('product-quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
        
        // Add to cart multiple times for quantity
        for (let i = 0; i < quantity; i++) {
            cart.addItem({
                id: this.currentProduct.id,
                name: this.currentProduct.name,
                price: this.currentProduct.price,
                image: this.currentProduct.image
            });
        }
        
        // Show success message
        this.showSuccessMessage(quantity);
    }

    // Show success message
    showSuccessMessage(quantity) {
        const message = quantity === 1 
            ? `${this.currentProduct.name} added to cart!`
            : `${quantity}x ${this.currentProduct.name} added to cart!`;
            
        cart.showNotification(message);
    }
}

// Initialize product cart integration when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on product pages
    if (window.location.pathname.includes('/products/')) {
        window.productCart = new ProductCartIntegration();
    }
}); 