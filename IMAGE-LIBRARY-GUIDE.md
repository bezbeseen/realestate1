# 📸 Image Library Guide

## Overview
The Image Library system provides centralized image management for the BE SEEN website. It ensures consistent image paths, easy maintenance, and fallback handling across all pages.

## 📁 Files

### 1. `includes/image-library.html`
- **Purpose**: JavaScript-based image library with utility functions
- **Usage**: Include in pages that need dynamic image handling
- **Features**: 
  - Centralized image path definitions
  - Utility functions for image retrieval
  - Fallback handling for missing images
  - Global functions for use in JavaScript

### 2. `includes/image-helpers.html`
- **Purpose**: Handlebars helpers for template-based image handling
- **Usage**: Include in templates that need image helpers
- **Features**:
  - Handlebars helper functions
  - Template-safe image path generation
  - Automatic fallback handling

## 🚀 Quick Start

### Include the Image Library
Add to your HTML pages:
```html
{{> image-library}}
```

### Include Handlebars Helpers
Add to your templates:
```html
{{> image-helpers}}
```

## 📋 Usage Examples

### 1. JavaScript Usage

```javascript
// Get product image
const productImg = getProductImage('business_cards');

// Get service image
const serviceImg = getServiceImage('graphic_design');

// Get breadcrumb background
const breadcrumbImg = getBreadcrumbImage('prints');

// Get review image
const reviewImg = getReviewImagePath('businessCards', 'standard business card.jpg');

// Check if image exists
const exists = await imageExists('/assets/images/product.jpg');

// Get image with fallback
const safeImg = await getImageWithFallback('/assets/images/product.jpg', '/assets/images/placeholder.jpg');
```

### 2. Handlebars Template Usage

```handlebars
<!-- Product Images -->
<img src="{{getProductImage product_id}}" alt="{{product_name}}">

<!-- Service Images -->
<img src="{{getServiceImage service_id}}" alt="{{service_name}}">

<!-- Breadcrumb Backgrounds -->
<section style="background-image: {{formatImageUrl (getBreadcrumbImage category)}}">

<!-- Category Hero Images -->
<div style="background-image: {{formatImageUrl (getCategoryHeroImage category)}}">

<!-- Logo -->
<img src="{{getLogoImage}}" alt="BE SEEN Logo">

<!-- Review Images -->
<img src="{{getReviewImagePath category imageName}}" alt="Review Image">

<!-- Image with Fallback -->
<img src="{{getImageWithFallback imagePath '/assets/images/placeholder.jpg'}}" alt="Image">

<!-- Product Category Images -->
<img src="{{getProductCategoryImage category}}" alt="{{category}} Products">
```

## 🗂️ Image Categories

### Product Images
- **Prints**: Business cards, banners, brochures, flyers, posters, stickers, canvas prints, photos
- **Signs**: A-frames, channel letters, yard signs, window graphics, aluminum signs, magnets
- **Promotional**: Flags, tents, table cloths, apparel, pens, bags, booths
- **Materials**: Corrugated, foam board, styrene, acrylic, PVC board
- **Real Estate**: Business cards, banners, flags, lawn signs, A-frames

### Service Images
- **Graphic Design**: Logo design, branding, photo editing, print layout, fonts/typography
- **Web Design**: Websites, web services, custom email design, marketing campaigns, social media, SEO
- **Mailing**: EDDM, newsletters, postcards, direct mailers, contact list cleaning, interactive mail

### Background Images
- **Breadcrumbs**: Category-specific background images
- **Hero Images**: Category hero backgrounds
- **General Backgrounds**: Standard background images

### Brand Images
- **Logo**: Main BE SEEN logo
- **Favicon**: Site favicon
- **Feature Icons**: Various feature icons

## 🔧 Configuration

### Adding New Images
1. **Add to Image Library**:
   ```javascript
   // In includes/image-library.html
   products: {
       newCategory: {
           newProduct: "/assets/images/new-category/new-product.jpg"
       }
   }
   ```

2. **Add to Handlebars Helpers**:
   ```javascript
   // In includes/image-helpers.html
   const productImages = {
       'new_product': '/assets/images/new-category/new-product.jpg'
   };
   ```

3. **Update Product Mapping**:
   ```javascript
   // In getProductImage function
   'new_product': IMAGE_LIBRARY.products.newCategory.newProduct
   ```

### Updating Image Paths
1. **Single Image**: Update the path in the appropriate category
2. **Category Images**: Update all paths in that category
3. **Global Changes**: Update the base path in the library

## 🛡️ Error Handling

### Fallback Images
- All image functions return a placeholder if the requested image doesn't exist
- Default placeholder: `/assets/images/placeholder.jpg`
- Custom fallbacks can be specified per function call

### Image Validation
```javascript
// Check if image exists before using
const exists = await imageExists('/assets/images/product.jpg');
if (exists) {
    // Use the image
} else {
    // Use fallback
}
```

## 📊 Performance Benefits

### 1. **Centralized Management**
- All image paths in one place
- Easy to update and maintain
- Consistent naming conventions

### 2. **Automatic Fallbacks**
- Missing images handled gracefully
- No broken image links
- Better user experience

### 3. **Type Safety**
- Structured image references
- Prevents typos in image paths
- IDE autocomplete support

### 4. **Caching Benefits**
- Consistent image paths improve caching
- Reduced server requests
- Faster page loads

## 🔄 Migration Guide

### From Hardcoded Paths
**Before**:
```html
<img src="/assets/images/printing/business%20card.jpg" alt="Business Cards">
```

**After**:
```html
<img src="{{getProductImage 'business_cards'}}" alt="Business Cards">
```

### From Inline Styles
**Before**:
```html
<div style="background-image: url('/assets/images/breadcrumb/bg_02.jpg')">
```

**After**:
```html
<div style="background-image: {{formatImageUrl (getBreadcrumbImage 'prints')}}">
```

## 🧪 Testing

### Test Image Functions
```javascript
// Test product images
console.log(getProductImage('business_cards')); // Should return path

// Test service images
console.log(getServiceImage('graphic_design')); // Should return path

// Test breadcrumb images
console.log(getBreadcrumbImage('prints')); // Should return path

// Test fallback
console.log(getProductImage('nonexistent')); // Should return placeholder
```

### Test Handlebars Helpers
```javascript
// Test in template
const template = Handlebars.compile('<img src="{{getProductImage product_id}}">');
const result = template({product_id: 'business_cards'});
console.log(result); // Should contain correct image path
```

## 📝 Best Practices

### 1. **Use Helper Functions**
- Always use the helper functions instead of hardcoded paths
- This ensures consistency and easier maintenance

### 2. **Provide Alt Text**
- Always include meaningful alt text for accessibility
- Use the product/service name in alt text

### 3. **Handle Missing Images**
- Use fallback images for missing content
- Log warnings for missing images in development

### 4. **Optimize Images**
- Use appropriate image formats (JPG for photos, PNG for graphics)
- Compress images for web use
- Use responsive images where appropriate

### 5. **Version Control**
- Keep image library changes in version control
- Document any image path changes
- Test image functions after updates

## 🚨 Troubleshooting

### Common Issues

1. **Image Not Found**
   - Check if the image path exists in the library
   - Verify the image file exists in the assets folder
   - Check for typos in the image ID

2. **Helper Not Working**
   - Ensure Handlebars is loaded before the helpers
   - Check if the helper is properly registered
   - Verify the template syntax

3. **Fallback Not Working**
   - Check if the fallback image exists
   - Verify the fallback path is correct
   - Test the imageExists function

### Debug Commands
```javascript
// Check if image library is loaded
console.log(typeof IMAGE_LIBRARY);

// Check if helpers are registered
console.log(Handlebars.helpers.getProductImage);

// Test image existence
imageExists('/assets/images/test.jpg').then(exists => console.log(exists));
```

## 📈 Future Enhancements

### Planned Features
1. **Image Optimization**: Automatic image compression and format conversion
2. **Responsive Images**: Automatic generation of different sizes
3. **Lazy Loading**: Built-in lazy loading for images
4. **CDN Integration**: Support for CDN image URLs
5. **Image Analytics**: Track image usage and performance

### Contributing
When adding new images or updating the library:
1. Update both `image-library.html` and `image-helpers.html`
2. Test the changes thoroughly
3. Update this documentation
4. Follow the naming conventions established

---

**Last Updated**: July 25, 2025
**Version**: 1.0.0
**Maintainer**: BE SEEN Development Team 