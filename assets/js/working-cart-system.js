/**
 * Working Cart System - Connects to existing Add to Cart buttons and shows UI feedback
 */

// Cart system that works with existing sidebar
const WorkingCart = {
    items: [],
    
    // Initialize the cart system
    init() {
        this.loadFromStorage();
        this.updateCartCounter();
        this.connectAddToCartButtons();
        this.setupCartSidebar();
        console.log('🛒 Working Cart System Initialized');
    },
    
    // Load cart from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('workingCart');
            this.items = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.log('Starting with empty cart');
            this.items = [];
        }
    },
    
    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('workingCart', JSON.stringify(this.items));
    },
    
    // Add item to cart with UI feedback
    addItem(productData) {
        const existingItem = this.items.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification(`Updated ${productData.name} quantity!`, 'success');
        } else {
            this.items.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1
            });
            this.showNotification(`Added ${productData.name} to cart!`, 'success');
        }
        
        this.saveToStorage();
        this.updateCartCounter();
        this.updateCartDisplay();
    },
    
    // Remove item from cart
    removeItem(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.showNotification(`Removed ${item.name} from cart`, 'info');
        }
        
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartCounter();
        this.updateCartDisplay();
    },
    
    // Update cart counter in header
    updateCartCounter() {
        const cartCounter = document.querySelector('.cart_counter');
        if (cartCounter) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    },
    
    // Show notification with better styling
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.cart-notification');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        
        const colors = {
            success: { bg: '#28a745', icon: '✓' },
            info: { bg: '#17a2b8', icon: 'ℹ' },
            warning: { bg: '#ffc107', icon: '⚠' }
        };
        
        const color = colors[type] || colors.success;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${color.bg};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            font-weight: 500;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 16px;">${color.icon}</span>
            <span>${message}</span>
        `;
        
        // Add CSS animation
        if (!document.querySelector('#cart-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'cart-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds with animation
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Connect to existing "Add to Cart" buttons
    connectAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.addtocart_btn');
        console.log(`Found ${addToCartButtons.length} Add to Cart buttons`);
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleAddToCart(button);
            });
        });
    },
    
    // Handle add to cart button click
    handleAddToCart(button) {
        // Get product data from the page
        const productContainer = button.closest('.product-container') || 
                               button.closest('.details_content') ||
                               button.closest('[data-product-id]');
        
        let productData;
        
        if (productContainer) {
            // Get data from container attributes
            productData = {
                id: productContainer.dataset.productId || this.generateProductId(),
                name: productContainer.dataset.productName || this.getProductName(),
                price: parseFloat(productContainer.dataset.productPrice) || this.getProductPrice(),
                image: productContainer.dataset.productImage || this.getProductImage()
            };
        } else {
            // Fallback: extract from page elements
            productData = {
                id: this.generateProductId(),
                name: this.getProductName(),
                price: this.getProductPrice(),
                image: this.getProductImage()
            };
        }
        
        console.log('Adding product:', productData);
        this.addItem(productData);
    },
    
    // Helper functions to extract product data
    generateProductId() {
        return window.location.pathname.split('/').pop().replace('.html', '') || 'product-' + Date.now();
    },
    
    getProductName() {
        return document.querySelector('h1.page_title')?.textContent?.trim() ||
               document.querySelector('.item_title')?.textContent?.trim() ||
               document.querySelector('h1')?.textContent?.trim() ||
               'Product';
    },
    
    getProductPrice() {
        const priceElement = document.querySelector('.price_text strong') ||
                           document.querySelector('[data-product-price]') ||
                           document.querySelector('.price');
        
        if (priceElement) {
            const priceText = priceElement.textContent || priceElement.dataset.productPrice;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
            return isNaN(price) ? 29.99 : price;
        }
        return 29.99;
    },
    
    getProductImage() {
        return document.querySelector('.details_image img')?.src ||
               document.querySelector('.product_image img')?.src ||
               document.querySelector('img')?.src ||
               '/assets/images/placeholder.jpg';
    },
    
    // Setup cart sidebar functionality
    setupCartSidebar() {
        // Update cart display on init
        this.updateCartDisplay();
        
        // Connect close button
        const closeButton = document.querySelector('.cart_sidebar .close_btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                document.querySelector('.sidebar-menu-wrapper').classList.remove('active');
            });
        }
        
        // Connect overlay
        const overlay = document.querySelector('.sidebar-menu-wrapper .overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                document.querySelector('.sidebar-menu-wrapper').classList.remove('active');
            });
        }
    },
    
    // Update the cart sidebar display
    updateCartDisplay() {
        const cartItemsList = document.querySelector('.cart_items_list ul');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cartItemsList) {
            if (this.items.length === 0) {
                cartItemsList.innerHTML = '<li class="text-center p-4" style="color: #666;">Your cart is empty</li>';
            } else {
                cartItemsList.innerHTML = this.items.map(item => `
                    <li>
                        <div class="cart_item clearfix" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                            <div class="item_image" style="width: 60px; height: 60px; margin-right: 15px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
                            </div>
                            <div class="item_content" style="flex: 1;">
                                <h4 class="item_title" style="font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">${item.name}</h4>
                                <span class="item_price" style="font-size: 13px; color: #666;">$${item.price.toFixed(2)} × ${item.quantity}</span>
                                <div style="font-weight: 600; color: #333;">$${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                            <button type="button" class="remove_btn" onclick="WorkingCart.removeItem('${item.id}')" style="background: #dc3545; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; font-size: 12px; cursor: pointer;">×</button>
                        </div>
                    </li>
                `).join('');
            }
        }
        
        // Update totals
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    },
    
    // Open cart sidebar
    openCartSidebar() {
        this.updateCartDisplay();
        const sidebarWrapper = document.querySelector('.sidebar-menu-wrapper');
        if (sidebarWrapper) {
            sidebarWrapper.classList.add('active');
        }
    },
    
    // Clear cart
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartCounter();
        this.updateCartDisplay();
        this.showNotification('Cart cleared!', 'info');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    WorkingCart.init();
});

// Make globally available
window.WorkingCart = WorkingCart;
window.Cart = { openCartSidebar: () => WorkingCart.openCartSidebar() }; // Compatibility 