/**
 * Simple Cart System - Fresh Start
 * Clean, simple, works with your existing site
 */

// Simple cart object
const SimpleCart = {
    items: [],
    
    // Initialize cart
    init() {
        this.loadFromStorage();
        this.updateCartCounter();
        this.connectAddToCartButtons();
    },
    
    // Load cart from localStorage
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('simpleCart');
            this.items = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.log('No saved cart found, starting fresh');
            this.items = [];
        }
    },
    
    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('simpleCart', JSON.stringify(this.items));
    },
    
    // Add item to cart
    addItem(productData) {
        const existingItem = this.items.find(item => item.id === productData.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                quantity: 1
            });
        }
        
        this.saveToStorage();
        this.updateCartCounter();
        this.showNotification('Added to cart!');
    },
    
    // Remove item from cart
    removeItem(productId) {
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
            cartCounter.textContent = totalItems > 0 ? totalItems : '';
            cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    },
    
    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    // Connect "Add to Cart" buttons
    connectAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.addtocart_btn');
        
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
        const productContainer = button.closest('.product-container') || button.closest('.details_content');
        
        if (productContainer) {
            const productData = {
                id: productContainer.dataset.productId || 'unknown',
                name: productContainer.dataset.productName || 'Product',
                price: parseFloat(productContainer.dataset.productPrice) || 0,
                image: productContainer.dataset.productImage || '/assets/images/placeholder.jpg'
            };
            
            this.addItem(productData);
        } else {
            // Fallback: try to get data from page elements
            const productData = {
                id: window.location.pathname.split('/').pop() || 'unknown',
                name: document.querySelector('h1.page_title')?.textContent || 'Product',
                price: 29.99, // Default price
                image: document.querySelector('.details_image img')?.src || '/assets/images/placeholder.jpg'
            };
            
            this.addItem(productData);
        }
    },
    
    // Open cart sidebar
    openCartSidebar() {
        this.updateCartDisplay();
        
        // Find existing cart sidebar
        const cartSidebar = document.querySelector('.cart_sidebar');
        if (cartSidebar) {
            cartSidebar.style.display = 'flex';
            document.querySelector('.sidebar-menu-wrapper').classList.add('active');
        }
    },
    
    // Update cart display
    updateCartDisplay() {
        const cartItemsList = document.querySelector('.cart_items_list ul');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        const cartTotal = document.querySelector('.cart-total');
        
        if (cartItemsList) {
            if (this.items.length === 0) {
                cartItemsList.innerHTML = '<li class="text-center p-4">Your cart is empty</li>';
            } else {
                cartItemsList.innerHTML = this.items.map(item => `
                    <li>
                        <div class="cart_item clearfix">
                            <button type="button" class="remove_btn" onclick="SimpleCart.removeItem('${item.id}')">
                                <i class="fal fa-times"></i>
                            </button>
                            <div class="item_image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="item_content">
                                <h3 class="item_title">${item.name}</h3>
                                <span class="item_price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                            </div>
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
    
    // Clear cart
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartCounter();
        this.updateCartDisplay();
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    SimpleCart.init();
});

// Make cart functions globally available
window.SimpleCart = SimpleCart; 