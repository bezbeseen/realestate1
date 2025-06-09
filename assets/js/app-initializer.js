function initializeApp() {
    // Product option selection logic
    const productContainer = document.querySelector('.product-container');
    if (productContainer) {
        const priceElement = document.querySelector('.price_text strong');
        const variantOptions = document.querySelectorAll('.variant-option');
        const quantityOptions = document.querySelectorAll('.quantity-option');
        const selectedVariantInput = document.getElementById('selectedVariant');
        const selectedQuantityInput = document.getElementById('selectedQuantity');

        // Price mapping for quantities
        const quantityPrices = {
            '50': 45.00,
            '100': 69.00,
            '250': 99.00,
            '500': 129.00,
        };

        const updatePrice = () => {
            const selectedQuantityEl = document.querySelector('.quantity-option.border-primary');
            const selectedVariantEl = document.querySelector('.variant-option.border-primary');

            if (selectedQuantityEl && selectedVariantEl && priceElement) {
                const quantity = selectedQuantityEl.dataset.quantity;
                const quantityPrice = quantityPrices[quantity] || 0;
                const variantPriceChange = parseFloat(selectedVariantEl.dataset.priceChange) || 0;
                const totalPrice = quantityPrice + variantPriceChange;
                priceElement.textContent = `$${totalPrice.toFixed(2)}`;
            }
        };

        variantOptions.forEach(option => {
            option.addEventListener('click', () => {
                variantOptions.forEach(opt => opt.classList.remove('border-primary'));
                option.classList.add('border-primary');
                selectedVariantInput.value = option.dataset.variant;
                updatePrice();
            });
        });

        quantityOptions.forEach(option => {
            option.addEventListener('click', () => {
                quantityOptions.forEach(opt => opt.classList.remove('border-primary'));
                option.classList.add('border-primary');
                selectedQuantityInput.value = option.dataset.quantity;
                updatePrice();
            });
        });
        
        // Set initial price
        updatePrice();
    }

    // Add to Cart Logic
    const addToCartButton = document.querySelector('.addtocart_btn');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const productContainer = document.querySelector('.product-container');
            const selectedVariantEl = document.querySelector('.variant-option.border-primary');
            const selectedQuantityEl = document.querySelector('.quantity-option.border-primary');
            const priceText = document.querySelector('.price_text strong').textContent;

            if (!productContainer || !selectedVariantEl || !selectedQuantityEl || !priceText) {
                alert('Please select product options before adding to cart.');
                return;
            }

            const currentPrice = parseFloat(priceText.replace('$', ''));

            const productData = {
                id: `${productContainer.dataset.productId}-${selectedVariantEl.dataset.variant}-${selectedQuantityEl.dataset.quantity}`,
                name: productContainer.dataset.productName,
                price: currentPrice,
                quantity: 1, // We add one "pack" at a time
                variant: `${selectedVariantEl.dataset.variant} / ${selectedQuantityEl.dataset.quantity} pcs`,
                image: productContainer.dataset.productImage
            };
            
            Cart.addItem(productData);
            CartDisplay.render(); // Re-render the cart display
        });
    }

    // Mobile menu event handlers (vanilla JS)
    const mobileMenu = document.querySelector('.sidebar_mobile_menu');
    const mobileMenuBtn = document.querySelector('.mobile_menu_btn');
    const closeBtn = document.querySelector('.sidebar_mobile_menu .close_btn');
    const overlay = document.querySelector('.sidebar-menu-wrapper .overlay');

    if (mobileMenu && mobileMenuBtn && closeBtn && overlay) {
        const openMenu = () => {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
        };

        mobileMenuBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }

    // Cart sidebar event handlers (vanilla JS)
    const cartSidebar = document.querySelector('.cart_sidebar');
    const cartBtn = document.querySelectorAll('.cart_btn'); // Select all cart buttons
    const cartCloseBtn = document.querySelector('.cart_sidebar .close_btn');
    const cartOverlay = document.querySelector('.sidebar-menu-wrapper .overlay');

    if (cartSidebar && cartBtn.length && cartCloseBtn && cartOverlay) {
        const openCart = () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        };

        const closeCart = () => {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
        };

        cartBtn.forEach(btn => btn.addEventListener('click', openCart));
        cartCloseBtn.addEventListener('click', closeCart);
        // Also close cart if overlay is clicked and mobile menu is not active
        cartOverlay.addEventListener('click', () => {
            if (!document.querySelector('.sidebar_mobile_menu.active')) {
                closeCart();
            }
        });
    }

    // Initial Cart Display Render
    if (window.CartDisplay) {
        CartDisplay.render();
    }

    // SEO Meta Tag Population
    const productContainerForSEO = document.querySelector('.product-container');
    if (productContainerForSEO) {
        const productName = productContainerForSEO.dataset.productName || 'Product';
        const productDescription = document.querySelector('.details_content p')?.textContent || 'Check out this amazing product.';
        const productImage = productContainerForSEO.dataset.productImage || '/assets/images/logo/favourite_icon_01.png';
        const productUrl = window.location.href;

        // Update Title
        document.title = `${productName} - BeSeen`;

        // Update Meta Tags
        document.querySelector('meta[name="description"]')?.setAttribute('content', productDescription);
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', productName);
        document.querySelector('meta[property="og:description"]')?.setAttribute('content', productDescription);
        document.querySelector('meta[property="og:image"]')?.setAttribute('content', productImage);
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', productUrl);
        document.querySelector('meta[property="twitter:title"]')?.setAttribute('content', productName);
        document.querySelector('meta[property="twitter:description"]')?.setAttribute('content', productDescription);
        document.querySelector('meta[property="twitter:image"]')?.setAttribute('content', productImage);
        document.querySelector('meta[property="twitter:url"]')?.setAttribute('content', productUrl);
    }

    // Sticky Header (from original template)
    const stickyHeader = document.querySelector('.sticky_header');
    if (stickyHeader) {
        window.onscroll = function() {
            if (window.pageYOffset > 120) {
                stickyHeader.classList.add("stuck");
            } else {
                stickyHeader.classList.remove("stuck");
            }
        };
    }

    // Background images (vanilla JS)
    const backgroundElements = document.querySelectorAll('[data-background]');
    backgroundElements.forEach(el => {
        el.style.backgroundImage = `url(${el.getAttribute('data-background')})`;
    });
}

function includeHTML(callback) {
    const promises = [];
    const elements = document.querySelectorAll('[w3-include-html]');
    
    elements.forEach(el => {
        const file = el.getAttribute('w3-include-html');
        const promise = fetch(file)
            .then(response => {
                if (!response.ok) throw new Error(`Page not found: ${file}`);
                return response.text();
            })
            .then(html => {
                const fragment = document.createRange().createContextualFragment(html);
                el.parentNode.replaceChild(fragment, el);
            })
            .catch(error => {
                console.error(error);
                el.remove();
            });
        promises.push(promise);
    });

    Promise.all(promises).then(() => {
        if (callback) {
            callback();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    includeHTML(initializeApp);
}); 