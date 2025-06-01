// Cart Management
const Cart = { 
    items: [],

    // Initialize cart from localStorage
    init() {
        const savedCart = localStorage.getItem('beseenCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
        this.updateCartCount();   
    },

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => 
            item.id === product.id && 
            item.variant === product.variant
        );

        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartCount();
        this.showAddedToCartMessage(product);
    },

    // Remove item from cart
    removeItem(productId, variant) {
        this.items = this.items.filter(item => 
            !(item.id === productId && item.variant === variant)
        );
        this.saveCart();
        this.updateCartCount();
    },

    // Update item quantity
    updateQuantity(productId, variant, quantity) {
        const item = this.items.find(item => 
            item.id === productId && 
            item.variant === variant
        );
        if (item) {
            item.quantity = quantity;
            this.saveCart();
        }
    },

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('beseenCart', JSON.stringify(this.items));
    },

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    },

    // Update cart count in header
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
        }
    },

    // Show added to cart message
    showAddedToCartMessage(product) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.added-to-cart-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-success added-to-cart-message';
        messageDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${product.name}</strong> (${product.variant})<br>
                    <small>Quantity: ${product.quantity} - $${(product.price * product.quantity).toFixed(2)}</small>
                </div>
                <a href="../shopping-cart.html" class="btn btn-sm btn-primary">View Cart</a>
            </div>
        `;
        document.body.appendChild(messageDiv);

        // Remove the message after 3 seconds with fade out animation
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease-out';
            messageDiv.style.transform = 'translateX(100%)';
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
};

// Initialize cart when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
});

// Add to cart functionality for product pages
function addToCart(button) {
    const productContainer = button.closest('.product-container');
    if (!productContainer) return;

    const product = {
        id: productContainer.dataset.productId,
        name: productContainer.dataset.productName,
        price: parseFloat(productContainer.dataset.productPrice),
        image: productContainer.dataset.productImage,
        variant: productContainer.querySelector('select.product-variant')?.value || 'default',
        quantity: parseInt(productContainer.querySelector('input.quantity-input')?.value || 1)
    };

    Cart.addItem(product);
} 