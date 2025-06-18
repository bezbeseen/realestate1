// This script assumes that 'cart' variable and 'updateCartCounter' function
// are already globally available, loaded by 'assets/js/cart.js' before this script.

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('cart-container');
    const totalElement = document.getElementById('cart-total');

    if (!container || !totalElement) {
        console.error('Cart container or total element not found.');
        return;
    }

    function renderCart() {
        const cart = Cart.getCart();
        container.innerHTML = '';
        let grandTotal = 0;

        if (cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty.</p>';
            totalElement.textContent = '';
            return;
        }

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'border-bottom', 'py-3');
            itemDiv.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}" width="100" class="me-3">
                    <div>
                        <h5>${item.name}</h5>
                        <p class="mb-1"><strong>Variant:</strong> ${item.variant}</p>
                        <p class="mb-0"><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <input type="number" value="${item.quantity}" min="1" class="form-control quantity-input me-3" style="width: 70px;" data-index="${index}">
                    <p class="mb-0 me-3"><strong>Total:</strong> $${itemTotal.toFixed(2)}</p>
                    <button class="btn btn-sm btn-outline-danger remove-btn" data-index="${index}">🗑</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });

        totalElement.textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
    }

    function updateQuantity(index, newQuantity) {
        const cart = Cart.getCart();
        if (cart[index] && newQuantity > 0) {
            cart[index].quantity = newQuantity;
            Cart.saveCart(cart);
            renderCart();
        }
    }

    function removeItem(index) {
        const cart = Cart.getCart();
        cart.splice(index, 1);
        Cart.saveCart(cart);
        renderCart();
    }

    // Event delegation for quantity changes and item removal
    container.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const index = e.target.dataset.index;
            const newQuantity = parseInt(e.target.value);
            updateQuantity(index, newQuantity);
        }
    });

    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const index = e.target.dataset.index;
            removeItem(index);
        }
    });

    // Initial render
    renderCart();
});

function checkout() {
    alert('Checkout is not implemented yet.');
} 