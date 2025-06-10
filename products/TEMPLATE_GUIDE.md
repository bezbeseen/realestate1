# Product Page Template Guide

This guide explains how to use the unified product template to create new product pages.

## Quick Start

1. Copy `product-template-unified.html` to create your new product page
2. Replace all `[PLACEHOLDER]` values with your product information
3. Update images and content
4. Test the page functionality

## Placeholder Guide

### Basic Information
- `[PRODUCT_TITLE]` - Full product title (e.g., "Professional Real Estate Business Cards")
- `[PRODUCT_NAME]` - Short product name for breadcrumbs (e.g., "Business Cards")
- `[PRODUCT_SUBTITLE]` - Brief product subtitle (e.g., "Professional Marketing Materials for Real Estate")
- `[PRODUCT_DESCRIPTION]` - Meta description for SEO
- `[PRODUCT_ID]` - Unique product identifier (e.g., "business-cards-premium")
- `[BASE_PRICE]` - Starting price without options
- `[PRICE]` - Display price (can include currency symbol)

### Images
- `[MAIN_IMAGE]` - Primary product image URL
- `[IMAGE_2]` - Second product image URL
- `[IMAGE_3]` - Third product image URL
- `[IMAGE_4]` - Fourth product image URL
- `[THUMBNAIL_1]` - First thumbnail image URL
- `[THUMBNAIL_2]` - Second thumbnail image URL
- `[THUMBNAIL_3]` - Third thumbnail image URL
- `[THUMBNAIL_4]` - Fourth thumbnail image URL

### Product Details
- `[PRODUCT_SHORT_DESCRIPTION]` - Brief product description
- `[PRODUCT_FEATURES]` - Key product features
- `[OPTION_1_LABEL]` - Label for first option (e.g., "Select Finish")
- `[OPTION_1_VARIANTS]` - HTML for variant options
- `[DEFAULT_VARIANT]` - Default selected variant
- `[QUANTITY_OPTIONS]` - HTML for quantity options
- `[DEFAULT_QUANTITY]` - Default selected quantity

### Tab Content
#### Overview Tab
- `[OVERVIEW_TITLE]` - Overview section title
- `[FEATURES_TITLE]` - Features section title
- `[FEATURES_LIST]` - HTML list of features
- `[ADDONS_TITLE]` - Add-ons section title
- `[ADDONS_LIST]` - HTML list of add-ons
- `[BENEFITS_TITLE]` - Benefits section title
- `[BENEFITS_DESCRIPTION]` - Main benefits description
- `[ADDITIONAL_BENEFITS]` - Additional benefits text

#### FAQ Tab
- `[FAQ_ITEMS]` - HTML for FAQ accordion items

#### Specs Tab
- `[SPECS_TITLE]` - Specifications section title
- `[SPECS_LIST]` - HTML list of specifications
- `[REQUIREMENTS_TITLE]` - Requirements section title
- `[REQUIREMENTS_LIST]` - HTML list of requirements
- `[TEMPLATES_DESCRIPTION]` - Description of available templates
- `[TEMPLATE_LINKS]` - HTML list of template download links

## Example Usage

### Basic Product Information
```html
<title>[PRODUCT_TITLE] | BE SEEN</title>
<meta name="description" content="[PRODUCT_DESCRIPTION]">
```

### Product Container
```html
<div class="details_content product-container" 
     data-product-id="[PRODUCT_ID]"
     data-product-name="[PRODUCT_NAME]"
     data-product-price="[BASE_PRICE]" 
     data-product-image="[MAIN_IMAGE]">
```

### Variant Options
```html
<div class="variant-options d-grid gap-2">
    <div class="variant-option card p-2 border-primary" data-variant="standard" data-price-change="0">
        <div class="d-flex justify-content-between">
            <span>Standard</span>
            <span>(Included)</span>
        </div>
    </div>
    <div class="variant-option card p-2" data-variant="premium" data-price-change="5">
        <div class="d-flex justify-content-between">
            <span>Premium</span>
            <span>+$5.00</span>
        </div>
    </div>
</div>
```

### Quantity Options
```html
<div class="quantity-options d-grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));">
    <div class="quantity-option card p-2 text-center border-primary" data-quantity="100">100</div>
    <div class="quantity-option card p-2 text-center" data-quantity="250">250</div>
    <div class="quantity-option card p-2 text-center" data-quantity="500">500</div>
</div>
```

## Best Practices

1. **Images**
   - Use consistent image dimensions
   - Optimize images for web
   - Include descriptive alt text
   - Maintain aspect ratios

2. **Content**
   - Keep descriptions concise
   - Use bullet points for features
   - Include relevant specifications
   - Update FAQs based on customer feedback

3. **Options**
   - Limit variants to essential choices
   - Use clear pricing increments
   - Set reasonable quantity options
   - Include default selections

4. **SEO**
   - Use descriptive titles
   - Include relevant keywords
   - Write unique descriptions
   - Optimize image alt text

## Common Issues

1. **Image Display**
   - Ensure all image URLs are correct
   - Check image dimensions
   - Verify thumbnail functionality
   - Test image loading

2. **Price Updates**
   - Verify base price
   - Check variant price changes
   - Test quantity calculations
   - Validate total price display

3. **Cart Functionality**
   - Test add to cart
   - Verify variant selection
   - Check quantity updates
   - Validate price calculations

## Support

For assistance with the template:
1. Check this guide first
2. Review existing product pages
3. Contact the development team
4. Submit issues through the support system 