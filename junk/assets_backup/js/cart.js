const Cart = {
  
    // Load cart from localStorage
    getCart: function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateCartCounter();
    },

    // Add an item to the cart
    addItem: function(productData) {
        if (!productData || !productData.id || !productData.name || isNaN(productData.price) || isNaN(productData.quantity)) {
            console.error('Invalid product data provided to addItem:', productData);
            alert('Could not add product to cart. Invalid data.');
            return;
        }

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
        this.showToast(`Added ${productData.quantity} x "${productData.name}" to cart.`);
    },

    // Show a toast notification
    showToast: function(message) {
        const toastElement = document.getElementById('cartToast');
        if (toastElement) {
            const toastMessage = toastElement.querySelector('.toast-message');
            toastMessage.textContent = message;
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
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
    }
};

// Initialize cart counter on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartCounter();
});

