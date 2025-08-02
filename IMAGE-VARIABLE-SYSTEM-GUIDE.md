# 🖼️ Image Variable System Guide

## 📋 Overview

The new image variable system uses organized naming conventions to manage all images across the website. This system replaces hardcoded image paths with centralized variables for easier management and maintenance.

## 🏗️ System Structure

### Variable Naming Convention
- **`WEBSITE_`** - Main site images (logo, services, features)
- **`CATEGORY_`** - Category images (yard signs, banners, etc.)
- **`PRODUCTS_`** - Product variants (standard, premium, luxury)
- **`EXTERNAL_`** - Cloud-hosted images

### Image Object Structure
Each image in the library has this structure:
```javascript
{
    path: "/assets/images/logo/BeSeen_1.png",
    alt: "BeSeen Logo - Professional Printing Services",
    variable: "WEBSITE_LOGO_MAIN"
}
```

## 📝 Usage in Templates

### Handlebars Template Examples

#### Website Images
```handlebars
<!-- Logo -->
<img src="{{getWebsiteImage 'logo.main.path'}}" alt="{{getWebsiteImage 'logo.main.alt'}}">

<!-- Services -->
<img src="{{getWebsiteImage 'services.graphicDesign.path'}}" alt="{{getWebsiteImage 'services.graphicDesign.alt'}}">
<img src="{{getWebsiteImage 'services.webDesign.path'}}" alt="{{getWebsiteImage 'services.webDesign.alt'}}">
<img src="{{getWebsiteImage 'services.mailing.path'}}" alt="{{getWebsiteImage 'services.mailing.alt'}}">
```

#### Category Images
```handlebars
<!-- Category Hero Images -->
<img src="{{getCategoryHeroImage 'yard_signs'}}" alt="Yard Signs Category">
<img src="{{getCategoryHeroImage 'business_cards'}}" alt="Business Cards Category">
<img src="{{getCategoryHeroImage 'banners'}}" alt="Banners Category">
```

#### Product Images
```handlebars
<!-- Product Variants -->
<img src="{{getProductImage 'business_cards'}}" alt="Standard Business Cards">
<img src="{{getProductImage 'banners'}}" alt="Vinyl Banners">
<img src="{{getProductImage 'yard_signs'}}" alt="Standard Yard Signs">
```

#### Service Images
```handlebars
<!-- Service Icons -->
<img src="{{getServiceImage 'graphic_design'}}" alt="Graphic Design Service">
<img src="{{getServiceImage 'web_design'}}" alt="Web Design Service">
<img src="{{getServiceImage 'mailing'}}" alt="Mailing Service">
```

## ⚡ JavaScript Usage

### Direct Variable Access
```javascript
// Website Images
const logoPath = IMAGE_LIBRARY.website.logo.main.path;
const logoAlt = IMAGE_LIBRARY.website.logo.main.alt;
const logoVariable = IMAGE_LIBRARY.website.logo.main.variable;

// Category Images
const yardSignsPath = IMAGE_LIBRARY.categories.yardSigns.path;
const yardSignsAlt = IMAGE_LIBRARY.categories.yardSigns.alt;
const yardSignsVariable = IMAGE_LIBRARY.categories.yardSigns.variable;

// Product Images
const businessCardsPath = IMAGE_LIBRARY.products.businessCards.standard.path;
const businessCardsAlt = IMAGE_LIBRARY.products.businessCards.standard.alt;
const businessCardsVariable = IMAGE_LIBRARY.products.businessCards.standard.variable;
```

### Utility Functions
```javascript
// Using utility functions
const productImage = ImageUtils.getProductImage('business_cards');
const serviceImage = ImageUtils.getServiceImage('graphic_design');
const categoryImage = ImageUtils.getCategoryImage('yard_signs');
const websiteImage = ImageUtils.getWebsiteImage('logo.main.path');
const altText = ImageUtils.getAltText('/assets/images/logo/BeSeen_1.png');
```

## 🔄 Migration Guide

### From Old System to New Variables

#### OLD WAY (hardcoded paths)
```html
<img src="/assets/images/logo/BeSeen_1.png" alt="logo">
<img src="/assets/images/services/graphic-design.png" alt="Graphic Design">
<img src="/assets/images/printing/business%20card.jpg" alt="Business Cards">
```

#### NEW WAY (variable system)
```html
<img src="{{getWebsiteImage 'logo.main.path'}}" alt="{{getWebsiteImage 'logo.main.alt'}}">
<img src="{{getWebsiteImage 'services.graphicDesign.path'}}" alt="{{getWebsiteImage 'services.graphicDesign.alt'}}">
<img src="{{getProductImage 'business_cards'}}" alt="Standard Business Cards">
```

## 📁 File Structure

### Image Library Files
- `includes/image-library.html` - Main image library with all variables
- `includes/image-helpers.html` - Handlebars helpers for template usage
- `generated/data/image-library-optimized.json` - Complete image library in JSON format

### Demo Files
- `generated/image-variable-demo.html` - Live demonstration of the system
- `generated/image-library-test.html` - Test page for variable functionality
- `templates/image-variable-test.html` - Template example for testing

## 🎯 Key Benefits

### ✅ Centralized Management
- All image paths in one place
- Easy to update and maintain
- Consistent naming across the site

### ✅ Professional Organization
- `WEBSITE_` prefix for main site images
- `CATEGORY_` prefix for category images
- `PRODUCTS_` prefix for product variants
- `EXTERNAL_` prefix for cloud-hosted images

### ✅ Easy Testing
- Visual confirmation of variable loading
- Success/error status for each image
- Real-time test results

### ✅ Future-Proof
- Easy to switch to cloud hosting
- Simple to update image paths
- Scalable for new products and categories

## 🧪 Testing

### Test Pages
1. **Demo Page**: `http://localhost:8001/generated/image-variable-demo.html`
2. **Test Page**: `http://localhost:8001/generated/image-library-test.html`
3. **Updated Service Pages**: 
   - `http://localhost:8001/services/graphic-design.html`
   - `http://localhost:8001/services/web-design.html`
   - `http://localhost:8001/services/mailing.html`

### What to Test
- ✅ Image loading from variables
- ✅ Alt text from variables
- ✅ Variable naming consistency
- ✅ Utility function functionality
- ✅ Template helper integration

## 🚀 Next Steps

### For Template Updates
1. Replace hardcoded paths with variable helpers
2. Update alt text to use variable system
3. Test all pages with new variables
4. Verify image loading and display

### For JavaScript Updates
1. Replace direct path references with variable access
2. Use utility functions for common operations
3. Update any image-related functionality
4. Test JavaScript functionality

### For Build System
1. Update build.js helpers to use new system
2. Test template generation with new variables
3. Verify all generated pages work correctly
4. Update any build-specific image handling

## 📊 Current Status

### ✅ Completed
- [x] Image library structure with new naming convention
- [x] Handlebars helpers for template usage
- [x] Utility functions for JavaScript access
- [x] Demo pages for testing
- [x] Migration examples
- [x] Updated service pages with variables

### 🔄 In Progress
- [ ] Update all templates to use new variables
- [ ] Update build system helpers
- [ ] Test all generated pages
- [ ] Complete migration of all image references

### 📋 To Do
- [ ] Update product templates
- [ ] Update category templates
- [ ] Update homepage template
- [ ] Update all remaining pages
- [ ] Final testing and validation

## 🆘 Troubleshooting

### Common Issues

#### Images Not Loading
- Check if variable exists in `IMAGE_LIBRARY`
- Verify path is correct in image library
- Ensure helper function is properly registered

#### Template Errors
- Check Handlebars syntax
- Verify helper function names
- Ensure partials are included

#### JavaScript Errors
- Check if `IMAGE_LIBRARY` is loaded
- Verify utility function names
- Ensure proper object structure

### Debug Tips
1. Use browser console to check `IMAGE_LIBRARY` object
2. Test individual variables in console
3. Check network tab for 404 errors
4. Verify file paths exist on server

## 📞 Support

For questions or issues with the image variable system:
1. Check the demo pages for examples
2. Review the migration guide
3. Test with the provided test pages
4. Consult the troubleshooting section

---

**🎯 Goal**: Complete migration to the new variable system for easier image management and future cloud hosting integration. 