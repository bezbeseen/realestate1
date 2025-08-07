# Pricing Logic Guide

This guide explains how the dynamic pricing system works on the product pages. It's designed to be flexible, allowing for both a base price and additional costs for different product options.

## 1. Core Concepts

The pricing logic is built on two key fields in the `data/products.json` file:

*   **`price`**: This is the base price for the product. It's the starting price before any options are selected.
*   **`price_change`**: This is a numeric value associated with a product *variant*. It represents how much the base price should be adjusted when that specific variant is chosen. It can be positive (to add to the price) or negative (to subtract from it).

### How It Works:

1.  **Initial Price**: When a product page loads, the price displayed is the `price` defined in the `product_details` object in `products.json`.

2.  **User Selection**: When a user clicks on a product variant (e.g., a different size or a special finish), the JavaScript on the page reads the `data-price-change` attribute associated with that variant.

3.  **Dynamic Update**: The JavaScript then adds the `price_change` value to the base price and instantly updates the displayed price on the page. This is handled by the `updatePrice()` function in the script at the bottom of `templates/product-template.html`.

---

## 2. Managing Product Prices

All pricing is managed in the `data/products.json` file. To change a product's price or the cost of its variants, you must edit its entry in this file.

### Step-by-Step Guide to Updating Prices:

1.  **Locate the Product**: Open `data/products.json` and find the product you want to edit by its `product_id`.

2.  **Set the Base Price**: In the `product_details` object for that product, set the `price` field to the base price you want. This should be a string containing the numerical value (e.g., `"49.99"`).

    ```json
    "product_details": {
      "price": "49.99",
      ...
    }
    ```

3.  **Set Variant Price Changes**:
    *   Find the `options` array within `product_details`. Each object in this array represents a group of choices (like "Size").
    *   Within the `variants` array for an option, you can add a `price_change` property to any variant that should modify the base price.
    *   The value of `price_change` is the amount to add to the base price. For the default or base variant, this should be `0`.

### Example:

In this example, the base price for a banner is **$49.99**.
*   The **2' x 4'** size is the default and has no additional cost (`"price_change": 0`).
*   The **3' x 6'** size costs **$40 more** than the base price (`"price_change": 40`).
*   The **4' x 8'** size costs **$100 more** than the base price (`"price_change": 100`).

```json
"product_details": {
  "price": "49.99",
  "options": [
    {
      "name": "Size",
      "variants": [
        { "name": "2' x 4' Banner", "price_change": 0 },
        { "name": "3' x 6' Banner", "price_change": 40 },
        { "name": "4' x 8' Banner", "price_change": 100 }
      ]
    }
  ]
}
```

---

## 3. How the Code Works (`templates/product-template.html`)

The dynamic pricing is made possible by a combination of Handlebars templating and client-side JavaScript.

### Data Attributes in the HTML:

The build process uses the `product-template.html` template to generate the product pages. It embeds the pricing information directly into the HTML using `data-` attributes:

1.  **Base Price**: The main product container stores the base price.
    ```html
    <div class="details_content product-container" 
         data-product-price="{{product_details.price}}">
    ```

2.  **Price Change**: Each variant `div` stores its `price_change` value.
    ```html
    <div class="variant-option" 
         data-price-change="{{price_change}}">
    ```

### The JavaScript Logic:

A script at the bottom of the template handles the dynamic updates:

*   It sets the `basePrice` by reading the `data-product-price` from the main container.
*   It adds a click event listener to each `.variant-option`.
*   When an option is clicked, the `updatePrice()` function loops through all *selected* variants, sums up their `data-price-change` values, adds the total to the `basePrice`, and updates the displayed price.

This approach ensures that the pricing logic is both flexible and easy to manage directly from your central `products.json` file.

