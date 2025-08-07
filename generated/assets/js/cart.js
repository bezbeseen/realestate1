/**
 * Shopping Cart using localStorage with a sidebar modal
 */
class Cart {
    constructor() {
        this.items = this.loadFromStorage();
        this.updateCartDisplay();
    }

    loadFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveToStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
        this.renderCartItems(); // Re-render items if sidebar is open
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
            } else {
                this.removeItem(productId);
            }
        }
        this.saveToStorage();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
    
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }

    updateCartDisplay() {
        const cartCounter = document.querySelector('.cart_counter');
        if (cartCounter) {
            const count = this.getItemCount();
            cartCounter.textContent = count;
            cartCounter.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success position-fixed';
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1056;'; // High z-index for visibility
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // --- Cart Drawer (Sidebar) Logic ---
    openCartSidebar() {
        this.createCartModal(); // Ensure modal exists
        const cartModal = new bootstrap.Modal(document.getElementById('cartSidebarModal'));
        this.renderCartItems(); // Update content before showing
        cartModal.show();
    }

    createCartModal() {
        if (document.getElementById('cartSidebarModal')) {
            return; // Modal already exists
        }

        const modalHTML = `
            <div class="modal fade" id="cartSidebarModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-end modal-dialog-scrollable" style="width: 400px; margin-right: 0;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Your Cart</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div id="cart-sidebar-items">
                                <!-- Cart items will be rendered here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                           <div class="w-100">
                                <div class="d-flex justify-content-between">
                                    <strong>Subtotal:</strong>
                                    <strong id="cart-sidebar-subtotal">$0.00</strong>
                                </div>
                                <hr>
                                <a href="/checkout.html" class="btn btn-primary w-100">Proceed to Checkout</a>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    renderCartItems() {
        const container = document.getElementById('cart-sidebar-items');
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Your cart is empty.</p>';
        } else {
            container.innerHTML = this.items.map(item => `
                <div class="d-flex align-items-center mb-3">
                    <img src="${item.image}" alt="${item.name}" width="60" class="me-3">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" value="${item.quantity}" min="1" class="form-control form-control-sm" style="width: 60px;" onchange="cart.updateQuantity('${item.id}', this.valueAsNumber)">
                        <button class="btn btn-sm btn-outline-danger ms-2" onclick="cart.removeItem('${item.id}')">&times;</button>
                    </div>
                </div>
            `).join('');
        }
        
        const subtotalEl = document.getElementById('cart-sidebar-subtotal');
        if (subtotalEl) {
            subtotalEl.textContent = '$' + this.getSubtotal();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.cart = new Cart();
    
    // Attach event listener to header cart button
    const cartBtn = document.querySelector('.cart_btn');
    if(cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent link from navigating
            window.cart.openCartSidebar();
        });
    }
});