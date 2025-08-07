document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const emptyCartDiv = document.getElementById('cart-empty');
    const cart = new Cart(); // Assumes cart.js is loaded and Cart class is available
    const items = cart.items;

    if (!items || items.length === 0) {
        cartContainer.style.display = 'none';
        emptyCartDiv.style.display = 'block';
        return;
    }

    const renderCart = () => {
        if (items.length === 0) {
            cartContainer.style.display = 'none';
            emptyCartDiv.style.display = 'block';
            return;
        }

        const subtotal = cart.getSubtotal();

        cartContainer.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th colspan="2">Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td style="width: 100px;"><img src="${item.image}" alt="${item.name}" class="img-fluid"></td>
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>
                                <input type="number" value="${item.quantity}" min="1" class="form-control" style="width: 80px;" onchange="cart.updateQuantity('${item.id}', this.valueAsNumber); renderCart();">
                            </td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem('${item.id}'); renderCart();">&times;</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="row justify-content-end">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Cart Summary</h5>
                            <div class="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <span>$${subtotal}</span>
                            </div>
                            <hr>
                            <div class="d-grid">
                                <a href="/checkout.html" class="btn btn-primary">Proceed to Checkout</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    renderCart();

    // Re-render the cart if it's updated from another source (like the sidebar)
    window.addEventListener('storage', () => {
        cart.items = cart.loadFromStorage();
        renderCart();
    });
});

