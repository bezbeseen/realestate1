// Function to update breadcrumb content
function updateBreadcrumb(title, currentPage) {
    // Update the page title
    const titleElement = document.querySelector('[data-breadcrumb-title]');
    if (titleElement) {
        titleElement.textContent = title;
    }

    // Update the current page in breadcrumb
    const currentPageElement = document.querySelector('[data-breadcrumb-current]');
    if (currentPageElement) {
        currentPageElement.textContent = currentPage;
    }
}

// Initialize breadcrumb after the include is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the include to be processed
    setTimeout(() => {
        // Get the product name from the product container
        const productContainer = document.querySelector('.product-container');
        if (productContainer) {
            const productName = productContainer.dataset.productName || 'Product Name';
            updateBreadcrumb(productName, productName);
        }
    }, 100);
}); 