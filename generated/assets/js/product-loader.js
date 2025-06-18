// This script will handle loading product data from CSV files and generating the UI.
console.log("Product loader script loaded.");

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.querySelector('.product-container');
    if (productContainer) {
        const csvPath = productContainer.dataset.csvPath;
        if (csvPath) {
            loadProductOptions(csvPath);
        }
    }
});

function loadProductOptions(csvPath) {
    Papa.parse(csvPath, {
        download: true,
        header: true,
        complete: function(results) {
            const productOptionsContainer = document.getElementById('product-options-container');
            const productImagesContainer = document.getElementById('productTabContent');
            const productThumbnailsContainer = document.getElementById('productTab');

            if (productOptionsContainer && productImagesContainer && productThumbnailsContainer) {
                // Clear existing hardcoded options
                productOptionsContainer.innerHTML = '<label class="form-label d-block"><strong>Select Option</strong></label>';
                productImagesContainer.innerHTML = '';
                productThumbnailsContainer.innerHTML = '';

                const optionsWrapper = document.createElement('div');
                optionsWrapper.className = 'variant-options d-grid gap-2';
                optionsWrapper.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
                productOptionsContainer.appendChild(optionsWrapper);

                results.data.forEach((option, index) => {
                    if (option.product_option) {
                        const optionId = option.product_option.toLowerCase().replace(/ /g, '-');

                        // Create and append product option button
                        const optionElement = document.createElement('div');
                        optionElement.className = `variant-option border p-2 text-center cursor-pointer ${option.default === 'true' ? 'active' : ''}`;
                        optionElement.dataset.variant = option.product_option;
                        optionElement.textContent = option.product_option;
                        optionsWrapper.appendChild(optionElement);

                        // Create and append product image
                        const imageElement = document.createElement('div');
                        imageElement.className = `tab-pane fade ${index === 0 ? 'show active' : ''}`;
                        imageElement.id = `${optionId}-image`;
                        imageElement.setAttribute('role', 'tabpanel');
                        imageElement.innerHTML = `<img src="${option.image_url || '/assets/images/placeholder.jpg'}" alt="${option.product_option}" class="img-fluid" width="800" height="600">`;
                        productImagesContainer.appendChild(imageElement);

                        // Create and append product thumbnail
                        const thumbnailElement = document.createElement('li');
                        thumbnailElement.className = 'nav-item';
                        thumbnailElement.setAttribute('role', 'presentation');
                        thumbnailElement.innerHTML = `
                            <button class="nav-link ${index === 0 ? 'active' : ''}" id="${optionId}-tab" data-bs-toggle="tab" data-bs-target="#${optionId}-image" type="button" role="tab">
                                <img src="${option.image_url || '/assets/images/placeholder.jpg'}" alt="${option.product_option}" class="img-fluid" width="100" height="75">
                            </button>
                        `;
                        productThumbnailsContainer.appendChild(thumbnailElement);
                    }
                });
            }
        }
    });
} 