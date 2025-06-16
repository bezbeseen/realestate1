const Cart = {
  
    // Load cart from localStorage
    getCart: function() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartCounter();
            // Trigger a custom event when cart is updated
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    },

    // Add an item to the cart
    addItem: function(productData) {
        if (!productData || !productData.id || !productData.name || isNaN(productData.price) || isNaN(productData.quantity)) {
            console.error('Invalid product data provided to addItem:', productData);
            return false;
        }

        try {
            const cart = this.getCart();
            
            // Use a more generic ID if variant is not specified
            const cartItemId = productData.variant ? `${productData.id}-${productData.variant}` : productData.id;

            const existingItemIndex = cart.findIndex(item => item.id === cartItemId);

            if (existingItemIndex > -1) {
                // Item with same ID and variant already in cart, just update quantity
                cart[existingItemIndex].quantity += productData.quantity;
            } else {
                // Add new item
                cart.push({
                    id: cartItemId,
                    name: productData.name,
                    price: productData.price,
                    quantity: productData.quantity,
                    variant: productData.variant || 'Standard',
                    image: productData.image
                });
            }

            this.saveCart(cart);
            this.openCartSidebar();
            return true;
        } catch (error) {
            console.error('Error adding item to cart:', error);
            return false;
        }
    },

    // Open cart sidebar
    openCartSidebar: function() {
        // Update cart display
        if (typeof CartDisplay !== 'undefined') {
            CartDisplay.render();
        }
        
        // Open the sidebar
        const sidebar = document.querySelector('.sidebar-menu-wrapper');
        if (sidebar) {
            // Ensure the cart sidebar is visible
            const cartSidebar = sidebar.querySelector('.cart_sidebar');
            if (cartSidebar) {
                cartSidebar.style.display = 'flex';
            }
            
            sidebar.classList.add('active');
            document.body.classList.add('sidebar-open');
            
            // Add event listener for escape key
            document.addEventListener('keydown', this.handleEscapeKey);
        } else {
            console.error('Cart sidebar element not found');
        }
    },

    // Close cart sidebar
    closeCartSidebar: function() {
        const sidebar = document.querySelector('.sidebar-menu-wrapper');
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            
            // Remove event listener for escape key
            document.removeEventListener('keydown', this.handleEscapeKey);
        }
    },

    // Handle escape key press
    handleEscapeKey: function(e) {
        if (e.key === 'Escape') {
            Cart.closeCartSidebar();
        }
    },

    // Get total number of items in the cart
    getTotalItems: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Update the cart counter in the header
    updateCartCounter: function() {
        const totalItems = this.getTotalItems();
        const cartCounterElement = document.querySelector('.cart_counter');
        if (cartCounterElement) {
            cartCounterElement.textContent = totalItems > 0 ? totalItems : '';
            cartCounterElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
    },

    // Clear the entire cart
    clearCart: function() {
        this.saveCart([]);
        if (typeof CartDisplay !== 'undefined') {
            CartDisplay.render();
        }
    }
};

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart counter
    Cart.updateCartCounter();
    
    // Add click event listener to close buttons
    const closeButtons = document.querySelectorAll('.sidebar-menu-wrapper .close_btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            Cart.closeCartSidebar();
        });
    });

    // Add click event listener to overlay
    const overlay = document.querySelector('.sidebar-menu-wrapper .overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            Cart.closeCartSidebar();
        });
    }

    // Listen for cart updates
    window.addEventListener('cartUpdated', () => {
        Cart.updateCartCounter();
        if (typeof CartDisplay !== 'undefined') {
            CartDisplay.render();
        }
    });
});

