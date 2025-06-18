document.addEventListener('DOMContentLoaded', function() {
    // Get the product container
    const productContainer = document.querySelector('.product-container');
    if (!productContainer) return;

    // Get product data from data attributes
    const productId = productContainer.dataset.productId;
    const productName = productContainer.dataset.productName;
    const basePrice = parseFloat(productContainer.dataset.productPrice);
    const productImage = productContainer.dataset.productImage;

    // Get the add to cart button
    const addToCartBtn = productContainer.querySelector('.addtocart_btn');
    if (!addToCartBtn) return;

    // Add click event listener to the add to cart button
    addToCartBtn.addEventListener('click', function() {
        const selectedVariant = document.getElementById('selectedVariant').value;
        const selectedQuantity = parseInt(document.getElementById('selectedQuantity').value);
        const variantPriceChange = parseFloat(document.querySelector(`.variant-option[data-variant="${selectedVariant}"]`).dataset.priceChange);
        const finalPrice = basePrice + variantPriceChange;

        // Add item to cart
        Cart.addItem({
            id: productId,
            name: productName,
            price: finalPrice,
            quantity: selectedQuantity,
            variant: selectedVariant,
            image: productImage
        });
        // Open sidebar and render cart
        var sidebar = document.querySelector('.cart_sidebar')?.closest('.sidebar-menu-wrapper');
        if (sidebar) {
            sidebar.classList.add('active');
            document.body.classList.add('sidebar-open');
        }
        if (window.CartDisplay) CartDisplay.render();
    });

    // Add click event listeners to variant options
    const variantOptions = productContainer.querySelectorAll('.variant-option');
    variantOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove border-primary class from all options
            variantOptions.forEach(opt => opt.classList.remove('border-primary'));
            // Add border-primary class to selected option
            this.classList.add('border-primary');
            // Update hidden input
            document.getElementById('selectedVariant').value = this.dataset.variant;
        });
    });

    // Add click event listeners to quantity options
    const quantityOptions = productContainer.querySelectorAll('.quantity-option');
    quantityOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove border-primary class from all options
            quantityOptions.forEach(opt => opt.classList.remove('border-primary'));
            // Add border-primary class to selected option
            this.classList.add('border-primary');
            // Update hidden input
            document.getElementById('selectedQuantity').value = this.dataset.quantity;
        });
    });

    // Cart icon click handler
    var cartBtn = document.querySelector('.cart_btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Open the sidebar
            var sidebar = document.querySelector('.sidebar-menu-wrapper');
            if (sidebar) {
                sidebar.classList.add('active');
                document.body.classList.add('sidebar-open');
            }
            // Render the cart contents
            if (window.CartDisplay) CartDisplay.render();
        });
    }
}); 