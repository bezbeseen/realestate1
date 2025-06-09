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

        container.innerHTML = '';
        let subtotal = 0;

        if (cart.length === 0) {
            const emptyLi = document.createElement('li');
            emptyLi.innerHTML = '<p class="text-center m-0">Your cart is empty.</p>';
            container.appendChild(emptyLi);
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                const itemLi = document.createElement('li');
                itemLi.innerHTML = `
                    <div class="cart_item clearfix">
                        <button type="button" class="remove_btn" data-index="${index}"><i class="fal fa-times"></i></button>
                        <div class="item_image">
                            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}">
                        </div>
                        <div class="item_content">
                            <h3 class="item_title">${item.name}</h3>
                            <span class="item_price">$${item.price.toFixed(2)} x ${item.quantity}</span>
                            <small>${item.variant || ''}</small>
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
        let cart = Cart.getCart();
        cart.splice(index, 1);
        Cart.saveCart(cart);
        this.render();
    }
};

// Initial render on page load, if cart.js is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.Cart) {
        CartDisplay.render();
    }
});

function checkout() {
    alert('Checkout is not implemented yet.');
} 