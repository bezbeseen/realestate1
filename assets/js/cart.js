/**
 * A comprehensive, self-contained script for managing the shopping cart.
 * It handles adding items, storing the cart in localStorage, and rendering
 * the cart on the product page sidebar and the main shopping cart page.
 */
document.addEventListener('DOMContentLoaded', () => {

    const CART_STORAGE_KEY = 'shoppingCart';

    // --- Core Cart Logic ---
    const getCart = () => JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    const saveCart = (cart) => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

    const addItemToCart = (item) => {
        const cart = getCart();
        const existingItem = cart.find(i => i.id === item.id && i.variant === item.variant);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }
        saveCart(cart);
        renderCart();
        openCartSidebar();
    };

    const updateCartItemQuantity = (id, variant, quantity) => {
        const cart = getCart();
        const item = cart.find(i => i.id === id && i.variant === variant);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                // Remove item if quantity is zero or less
                removeItemFromCart(id, variant);
            } else {
                saveCart(cart);
                renderCart();
            }
        }
    };

    const removeItemFromCart = (id, variant) => {
        let cart = getCart();
        cart = cart.filter(i => i.id !== id || i.variant !== variant);
        saveCart(cart);
        renderCart();
    };


    // --- Rendering Logic ---
    const renderCart = () => {
        const cart = getCart();
        const cartSidebarContainer = document.querySelector('.cart_sidebar_items');
        const mainCartContainer = document.querySelector('.main_cart_container');
        const cartCounter = document.querySelector('.cart_counter');
        const subtotalEl = document.querySelector('.subtotal_text');
        const totalEl = document.querySelector('.total_text');

        // Always clear containers before rendering
        if (cartSidebarContainer) cartSidebarContainer.innerHTML = '';
        if (mainCartContainer) mainCartContainer.innerHTML = '';

        if (cart.length === 0) {
            const emptyMessage = '<p class="p-4 text-center">Your cart is empty.</p>';
            if (cartSidebarContainer) cartSidebarContainer.innerHTML = emptyMessage;
            if (mainCartContainer) mainCartContainer.innerHTML = emptyMessage;
        } else {
            const cartHtml = cart.map(item => `
                <div class="cart_item">
                    <div class="item_image">
                        <img src="${item.image || '/assets/images/placeholder.jpg'}" alt="${item.name}">
                    </div>
                    <div class="item_content">
                        <h4 class="item_title">${item.name} (${item.variant})</h4>
                        <span class="item_price">${item.quantity} x $${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove_btn" data-id="${item.id}" data-variant="${item.variant}">
                        <i class="fal fa-times"></i>
                    </button>
                </div>
            `).join('');

            if (cartSidebarContainer) {
                cartSidebarContainer.innerHTML = cartHtml;
            }
            if (mainCartContainer) {
                mainCartContainer.innerHTML = cartHtml; 
            }
        }

        // Update counter
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCounter) {
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'inline-block' : 'none';
        }
        
        // Update totals on the main cart page
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (subtotalEl) {
            subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (totalEl) {
            // For now, total is same as subtotal. Can add tax/shipping later.
            totalEl.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Add event listeners to new remove buttons
        document.querySelectorAll('.remove_btn').forEach(button => {
            button.addEventListener('click', function() {
                const { id, variant } = this.dataset;
                removeItemFromCart(id, variant);
            });
        });
    };

    const openCartSidebar = () => document.body.classList.add('sidebar-open');
    const closeCartSidebar = () => document.body.classList.remove('sidebar-open');


    // --- Event Listeners ---
    // Close sidebar
    const closeBtn = document.querySelector('.cart_sidebar .close_btn');
    const overlay = document.querySelector('.sidebar-menu-wrapper .overlay');
    if(closeBtn) closeBtn.addEventListener('click', closeCartSidebar);
    if(overlay) overlay.addEventListener('click', closeCartSidebar);

    // --- Product Interaction Logic ---
    const productContainers = document.querySelectorAll('.product-container');
    productContainers.forEach(container => {
        // Option Selection
        const variantOptions = container.querySelectorAll('.variant-option');
        variantOptions.forEach(option => {
            option.addEventListener('click', () => {
                variantOptions.forEach(opt => opt.classList.remove('border-primary'));
                option.classList.add('border-primary');
            });
        });

        const quantityOptions = container.querySelectorAll('.quantity-option');
        quantityOptions.forEach(option => {
            option.addEventListener('click', () => {
                quantityOptions.forEach(opt => opt.classList.remove('border-primary'));
                option.classList.add('border-primary');
            });
        });

        // Add to Cart Button
        const addToCartBtn = container.querySelector('.addtocart_btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const selectedVariantEl = container.querySelector('.variant-option.border-primary');
                if (!selectedVariantEl) {
                    alert('Please select an option.');
                    return;
                }
                const variantsData = window.productVariants || [];
                const selectedVariantData = variantsData.find(v => v.name === selectedVariantEl.dataset.variant);
                
                const item = {
                    id: container.dataset.productId,
                    name: container.dataset.productName,
                    price: parseFloat(container.dataset.productPrice),
                    quantity: 1, // Add quantity selector later
                    variant: selectedVariantData.name,
                    image: selectedVariantData.image_url,
                };
                addItemToCart(item);
            });
        }
    });

    // Initial render on page load
    renderCart();
}); 