/**
 * BE SEEN Cart System with Stripe Integration
 * Vanilla JavaScript with localStorage persistence
 * Follows AI guide: Bootstrap styling, vanilla JS, template system
 */

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.taxRate = 0.0825; // 8.25% default tax rate
        this.stripe = window.Stripe ? window.Stripe('pk_test_51RYGJPQ67OoMep3yKwHEZgm4ryGehWXH2MzkE2GeSg0otn9O8jxDfcpUHMfKTlmjQpYBveOZ5NPl1NOVUqfIQPem00DPrC8jrN') : null;
        this.updateCartDisplay();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveToStorage();
        this.updateCartDisplay();
        this.showNotification('Item added to cart!');
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartDisplay();
            }
        }
    }

    // Get cart subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get tax amount
    getTax() {
        return this.getSubtotal() * this.taxRate;
    }

    // Get cart total (subtotal + tax)
    getTotal() {
        return this.getSubtotal() + this.getTax();
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartDisplay();
    }

    // Update cart display
    updateCartDisplay() {
        const cartCounter = document.querySelector('.cart_counter');
        
        if (cartCounter) {
            const count = this.getItemCount();
            cartCounter.textContent = count > 0 ? count : '';
            cartCounter.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    // Show notification (Bootstrap alerts)
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 250px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Open cart sidebar (works with existing cart button)
    openCartSidebar() {
        // Create cart modal if it doesn't exist
        this.createCartModal();
        
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('cartModal'));
        modal.show();
    }

    // Create cart modal
    createCartModal() {
        if (!document.getElementById('cartModal')) {
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.id = 'cartModal';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Shopping Cart</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="cart-items"></div>
                        </div>
                        <div class="modal-footer">
                            <div class="w-100">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Subtotal:</span>
                                    <span id="cart-subtotal">$0.00</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Tax:</span>
                                    <span id="cart-tax">$0.00</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3">
                                    <strong>Total:</strong>
                                    <strong id="cart-total">$0.00</strong>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-outline-secondary" onclick="cart.clearCart()">Clear Cart</button>
                                    <button class="btn btn-primary" onclick="cart.checkout()">Secure Checkout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        // Update cart items display
        this.renderCartItems();
    }

    // Render cart items in the cart modal
    renderCartItems() {
        const cartItems = document.getElementById('cart-items');
        const cartSubtotal = document.getElementById('cart-subtotal');
        const cartTax = document.getElementById('cart-tax');
        const cartTotal = document.getElementById('cart-total');
        
        // Update pricing displays
        if (cartSubtotal) cartSubtotal.textContent = `$${this.getSubtotal().toFixed(2)}`;
        if (cartTax) cartTax.textContent = `$${this.getTax().toFixed(2)}`;
        if (cartTotal) cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        
        
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="text-muted text-center">Your cart is empty</p>';
                return;
            }

            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${item.name}</h6>
                        <p class="text-muted mb-0">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="cart.removeItem('${item.id}')">
                            <i class="fal fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Stripe checkout integration
    async checkout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        if (!this.stripe) {
            this.showNotification('Payment system not available', 'error');
            return;
        }

        try {
            // Prepare line items for Stripe
            const lineItems = this.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        description: item.variant ? `Variant: ${item.variant}` : '',
                        images: item.image ? [item.image] : []
                    },
                    unit_amount: Math.round(item.price * 100) // Convert to cents
                },
                quantity: item.quantity
            }));

            // Create checkout session
            const response = await fetch('/api/create-checkout-session.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    line_items: lineItems,
                    success_url: window.location.origin + '/success.html?session_id={CHECKOUT_SESSION_ID}',
                    cancel_url: window.location.origin + '/cart.html'
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: data.id
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Checkout failed: ' + error.message, 'danger');
        }
    }

    // Initialize cart
    init() {
        // Update display
        this.updateCartDisplay();
        
        // Add click handler to existing cart button
        const cartBtn = document.querySelector('.cart_btn');
        if (cartBtn) {
            cartBtn.onclick = () => this.openCartSidebar();
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cart = new Cart();
    cart.init();
});

// Add to cart function (to be called from product pages)
function addToCart(productId, productName, productPrice, productImage) {
    cart.addItem({
        id: productId,
        name: productName,
        price: parseFloat(productPrice),
        image: productImage
    });
}

