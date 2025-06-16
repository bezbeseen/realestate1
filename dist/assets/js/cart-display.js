// This script assumes that 'cart' variable and 'updateCartCounter' function
// are already globally available, loaded by 'assets/js/cart.js' before this script.

const CartDisplay = {
    render: function() {
        const container = document.querySelector('.cart_items_list ul');
        const subtotalEl = document.querySelector('.cart-subtotal');
        const totalEl = document.querySelector('.cart-total');
        const cart = Cart.getCart();

        if (!container || !subtotalEl || !totalEl) {
            console.error('Cart display elements not found.');
            return;
        }

        try {
            container.innerHTML = '';
            let subtotal = 0;

            if (cart.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.innerHTML = `
                    <div class="text-center p-4">
                        <i class="fas fa-shopping-cart fa-3x mb-3 text-muted"></i>
                        <p class="mb-0">Your cart is empty</p>
                        <a href="/products.html" class="btn btn-primary mt-3">Continue Shopping</a>
                    </div>
                `;
                container.appendChild(emptyLi);
            } else {
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;

                    const itemLi = document.createElement('li');
                    itemLi.innerHTML = `
                        <div class="cart_item clearfix">
                            <button type="button" class="remove_btn" data-index="${index}">
                                <i class="fal fa-times"></i>
                            </button>
                            <div class="item_image">
                                <img src="${item.image || 'https://via.placeholder.com/150'}" 
                                     alt="${item.name}"
                                     onerror="this.src='https://via.placeholder.com/150'">
                            </div>
                            <div class="item_content">
                                <h3 class="item_title">${item.name}</h3>
                                <span class="item_price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                                <small class="text-muted">${item.variant || ''}</small>
                                <div class="item_total mt-2">
                                    <strong>Total: $${itemTotal.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    `;
                    container.appendChild(itemLi);
                });
            }

            // For now, VAT is 0. This can be changed later.
            const vat = 0;
            const total = subtotal + vat;

            subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
            totalEl.textContent = `$${total.toFixed(2)}`;

            this.addRemoveListeners();
        } catch (error) {
            console.error('Error rendering cart:', error);
            container.innerHTML = '<li class="text-center text-danger">Error loading cart. Please try again.</li>';
        }
    },

    addRemoveListeners: function() {
        const container = document.querySelector('.cart_items_list ul');
        if (!container) return;

        container.querySelectorAll('.remove_btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                this.removeItem(index);
            });
        });
    },

    removeItem: function(index) {
        try {
            let cart = Cart.getCart();
            cart.splice(index, 1);
            Cart.saveCart(cart);
            this.render();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    }
};

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    if (window.Cart) {
        CartDisplay.render();
    }

    // Cart page render
    const cartPageContainer = document.getElementById('cart-page-container');
    if (cartPageContainer) {
        try {
            const cart = Cart.getCart();
            if (cart.length === 0) {
                cartPageContainer.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-cart fa-4x mb-3 text-muted"></i>
                        <h3>Your cart is empty</h3>
                        <p class="text-muted">Looks like you haven't added any items to your cart yet.</p>
                        <a href="/products.html" class="btn btn-primary mt-3">Continue Shopping</a>
                    </div>
                `;
            } else {
                let html = `
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th>Product</th>
                                    <th>Variant</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                `;

                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    html += `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.image || 'https://via.placeholder.com/80'}" 
                                         alt="${item.name}" 
                                         class="me-3"
                                         style="width:60px; height:40px; object-fit:cover;"
                                         onerror="this.src='https://via.placeholder.com/80'">
                                    <span>${item.name}</span>
                                </div>
                            </td>
                            <td>${item.variant || 'Standard'}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${itemTotal.toFixed(2)}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                });

                const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const vat = 0; // Can be changed later
                const total = subtotal + vat;

                html += `
                            </tbody>
                        </table>
                    </div>
                    <div class="row justify-content-end mt-4">
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <strong>$${subtotal.toFixed(2)}</strong>
                                    </div>
                                    <div class="d-flex justify-content-between mb-2">
                                        <span>VAT:</span>
                                        <strong>$${vat.toFixed(2)}</strong>
                                    </div>
                                    <hr>
                                    <div class="d-flex justify-content-between">
                                        <span>Total:</span>
                                        <strong>$${total.toFixed(2)}</strong>
                                    </div>
                                    <button class="btn btn-primary w-100 mt-3" onclick="checkout()">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                cartPageContainer.innerHTML = html;

                // Add remove item listeners
                cartPageContainer.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.currentTarget.dataset.index;
                        CartDisplay.removeItem(index);
                    });
                });
            }
        } catch (error) {
            console.error('Error rendering cart page:', error);
            cartPageContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error loading cart. Please try refreshing the page.
                </div>
            `;
        }
    }
});

function checkout() {
    // TODO: Implement checkout functionality
    alert('Checkout functionality will be implemented soon.');
} 