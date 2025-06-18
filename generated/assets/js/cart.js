/**
 * Simple Cart System
 * Vanilla JavaScript with localStorage persistence
 * Follows AI guide: simple, clean, no heavy frameworks
 */

class Cart {
    constructor() {
        this.items = this.loadFromStorage();
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

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
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

    // Show notification
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 200px;';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
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
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <h5>Total: <span id="cart-total">$0.00</span></h5>
                                <div>
                                    <button class="btn btn-outline-secondary me-2" onclick="cart.clearCart()">Clear Cart</button>
                                    <button class="btn btn-primary" onclick="cart.checkout()">Checkout</button>
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
        const cartTotal = document.getElementById('cart-total');
        
        if (cartTotal) {
            cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
        }
        
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

    // Checkout function (placeholder for Stripe integration)
    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // TODO: Integrate with Stripe
        alert('Checkout functionality coming soon!');
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

