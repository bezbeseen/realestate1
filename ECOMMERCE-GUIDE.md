# E-commerce Integration Guide

This guide provides a comprehensive overview of the e-commerce functionality integrated into this static site, which is powered by a Node.js build system. It covers product management, the shopping cart, and the Stripe-powered checkout process.

## 1. System Overview

The e-commerce system is designed to seamlessly integrate with the existing static site generator. It leverages a combination of data files, HTML templates, and client-side JavaScript to provide a dynamic shopping experience on a static site.

### Key Components:

*   **`data/products.json`**: The central data source for all product information. This file is the "single source of truth" for everything from product names and prices to the options and variants available.
*   **`templates/product-template.html`**: The Handlebars template responsible for generating every product page on the site. It dynamically renders product information from `products.json`.
*   **`assets/js/cart.js`**: The core JavaScript file that manages all shopping cart functionality. It handles adding, removing, and updating items, and it persists the cart's state using the browser's `localStorage`.
*   **`assets/js/checkout.js`**: The JavaScript file that powers the `/checkout.html` page. It communicates with the backend to create a secure Stripe checkout session.
*   **`api/create-checkout-session.js`**: A Node.js server-side script that securely communicates with the Stripe API to create payment sessions. This script is essential for keeping your secret API keys safe.
*   **`build/build.js`**: The main build script that reads the data and templates and generates the final static HTML pages into the `/generated` directory.

---

## 2. Product Management

All products are managed centrally through the `data/products.json` file. To add, remove, or update a product, you must edit this file. The build system will then automatically regenerate the necessary product pages.

### Product Data Structure:

Each product in `products.json` is a JSON object with two main parts:

1.  **Top-Level Properties**: These define the basic information about the product, such as its `product_id`, `product_name`, and `category`. The `product_id` is especially important as it's the unique identifier used by the shopping cart.

2.  **`product_details` Object**: This nested object contains all the information needed for the "Add to Cart" functionality. If a product is missing this object, it will not be available for purchase.

    *   `price`: The base price of the product.
    *   `quantity_options`: An array of numbers that defines the available quantities (e.g., `[1, 5, 10, 25]`).
    *   `options`: An array of product options (like "Size" or "Style"), each with its own set of `variants`.

### Example Product:

```json
{
  "product_id": "a_frames",
  "product_name": "A-Frame Signs",
  "category": "signs",
  "product_details": {
    "price": "45.00",
    "quantity_options": [1, 5, 10, 25, 50, 100],
    "options": [
      {
        "name": "Size",
        "variants": [
          { "name": "Standard" },
          { "name": "Large" }
        ]
      }
    ]
  }
}
```

---

## 3. Shopping Cart (`assets/js/cart.js`)

The shopping cart is managed entirely on the client side with JavaScript. It uses the browser's `localStorage` to remember the items in the cart, even if the user closes the page and comes back later.

### How It Works:

1.  **Adding an Item**: When a user clicks the "Add to Cart" button on a product page, the `addProductToCart()` function in `product-template.html` is called. This function reads the product's details (ID, name, price) from the `data-` attributes on the page and passes them to the `cart.addItem()` method.

2.  **Cart State**: The `cart.js` script maintains an array of cart items in `localStorage`. This array is updated whenever an item is added, removed, or has its quantity changed.

3.  **Displaying the Cart**: The cart is displayed in two ways:
    *   **Cart Sidebar**: A pop-up sidebar that shows a summary of the items in the cart.
    *   **Cart Page (`/cart.html`)**: A dedicated page that displays the full cart and allows users to manage their items before checkout.

---

## 4. Checkout and Payments

The checkout process is handled by Stripe, a secure and reliable payment processor. The integration is designed to be secure by keeping your secret API keys off the frontend.

### Checkout Flow:

1.  **Initiating Checkout**: When the user clicks the "Proceed to Checkout" button, they are taken to `/checkout.html`.

2.  **Creating a Session**: The `checkout.js` script on this page sends a request to our backend API at `/api/create-checkout-session`. This request includes all the items in the cart.

3.  **Secure Backend**: The `create-checkout-session.js` script, running on the server, receives the cart data. It then securely communicates with the Stripe API to create a checkout session. This is where your **Stripe Secret Key** is used. Because this script runs on the server, your secret key is never exposed to the user's browser.

4.  **Stripe's Embedded Checkout**: The backend sends the checkout session ID back to the `checkout.js` script. The script then uses this ID to initialize Stripe's Embedded Checkout, which is a secure payment form hosted by Stripe.

### API Keys and Security:

*   **Publishable Key (`pk_...`)**: This key is safe to use in the frontend. It's used by `checkout.js` to initialize Stripe.
*   **Secret Key (`sk_...`)**: This key must be kept secret. It's only used on the server by `create-checkout-session.js`.

These keys are managed in a `.env` file at the root of the project, which is included in the `.gitignore` to prevent it from being committed to the repository.

---

## 5. Development Workflow

When making changes to the e-commerce system, it's crucial to follow the correct workflow to ensure your changes are applied correctly.

### The Build and Restart Process:

Because this is a static site generator, you must **rebuild the site and restart the server** after making any changes to the data or templates.

1.  **Make Your Changes**: Edit the relevant files (e.g., `data/products.json` or `templates/product-template.html`).

2.  **Rebuild the Site**: Run the build script to regenerate the static HTML pages:
    ```bash
    node build/build.js
    ```

3.  **Restart the Server**: Stop the current server and start a new one to serve the updated files:
    ```bash
    # Stop the old server (if it's running)
    pkill -f 'node build/server.js'
    
    # Start the new server
    node build/server.js
    ```

This three-step process is essential for your changes to take effect.

