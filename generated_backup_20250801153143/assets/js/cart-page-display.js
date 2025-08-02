const CartPageDisplay = {
    render: function() {
        const container = document.getElementById('cart-page-container');
        if (!container) {
            console.error('Cart page container not found.');
            return;
        }

        const cart = Cart.getCart();
        if (cart.length === 0) {
            container.innerHTML = '<div class="alert alert-info" role="alert">Your cart is empty.</div>';
            return;
        }

        let subtotal = 0;
        const tableRows = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            return `
                <tr>
                    <td>
                        <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}" width="100">
                    </td>
                    <td>
                        <strong>${item.name}</strong>
                        <p class="text-muted small">${item.variant}</p>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    </td>
                    <td class="item-total">$${itemTotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // For now, VAT is 0. This can be changed later.
        const vat = 0;
        const total = subtotal + vat;

        container.innerHTML = `
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th scope="col" colspan="2">Product</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-end"><strong>Subtotal:</strong></td>
                        <td colspan="2" class="subtotal-price">$${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-end"><strong>VAT:</strong></td>
                        <td colspan="2" class="vat-price">$${vat.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-end"><strong>Total:</strong></td>
                        <td colspan="2" class="total-price"><strong>$${total.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                        <td colspan="6" class="text-end">
                            <button class="btn btn-primary" onclick="CartPageDisplay.checkout()">Proceed to Checkout</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        `;
        
        this.addEventListeners();
    },

    addEventListeners: function() {
        const container = document.getElementById('cart-page-container');
        if (!container) return;

        container.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const index = e.target.dataset.index;
                const newQuantity = parseInt(e.target.value);
                this.updateQuantity(index, newQuantity);
            });
        });

        container.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.closest('button').dataset.index;
                this.removeItem(index);
            });
        });
    },

    updateQuantity: function(index, newQuantity) {
        const cart = Cart.getCart();
        if (cart[index] && newQuantity > 0) {
            cart[index].quantity = newQuantity;
            Cart.saveCart(cart);
            this.render();
        }
    },

    removeItem: function(index) {
        let cart = Cart.getCart();
        cart.splice(index, 1);
        Cart.saveCart(cart);
        this.render();
    },

    checkout: function() {
        alert('Checkout functionality is not yet implemented.');
    }
}; 