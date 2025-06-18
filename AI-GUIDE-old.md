# BeSeen Printing Business Website - AI Guide

## Project Overview

**Business:** BeSeen - Printing, Design, Code, and Mail services  
**Website:** Professional business website with product catalog and industry-specific pages  
**Tech Stack:** Static HTML with includes system, W3.CSS framework, vanilla JavaScript  
**Build System:** Node.js build script that generates pages from templates and copies assets  

## Project Structure

```
/
├── assets/                     # Static assets
│   ├── css/                   # Stylesheets (W3.CSS + custom)
│   ├── js/                    # JavaScript files
│   └── images/                # Image assets organized by category
├── content/                   # Content files for template system
│   ├── industries/            # Industry-specific content (HTML fragments)
│   └── products/              # Product content (HTML fragments)
├── data/                      # JSON data files
│   ├── products.json          # Product definitions with categories
│   └── categories.json        # Category definitions
├── includes_new/              # Include fragments for w3-include-html
│   ├── header.html           # Site header with navigation
│   ├── footer.html           # Site footer
│   └── mobile-menu.html      # Mobile navigation menu
├── templates/                 # Template files for page generation
│   ├── product.html          # Product page template
│   └── industry.html         # Industry page template
├── dist/                     # Generated/built website (auto-generated)
├── build.js                  # Build script
├── server.js                 # Development server
└── index.html                # Homepage (uses includes, not templates)
```

## System Architecture

### 1. Template System
- **Products:** Generated from `templates/product.html` using data from `products.json`
- **Industries:** Generated from `templates/industry.html` using content from `content/industries/`
- **Build Process:** Run `node build.js` to generate all pages into `dist/`

### 2. Include System
- **Homepage & Static Pages:** Use `w3-include-html` for header, footer, mobile menu
- **Includes Location:** `includes_new/` directory (copied to `dist/includes_new/` during build)

### 3. Navigation Structure
- **Main Nav:** Print, Design, Code, Mail, Industries (dropdown)
- **Industries Dropdown:** Real Estate (expandable for more industries)
- **Product Categories:** business-cards, banners, flags, lawn-signs, a-frames, etc.

## Data Structure

### products.json Format
```json
{
  "business-cards": {
    "name": "Business Cards",
    "category": "print",
    "industries": ["real-estate"],
    "description": "Professional business cards...",
    "features": ["High-quality printing", "Multiple finishes"],
    "image": "/assets/images/products/business-cards.jpg"
  }
}
```

### categories.json Format
```json
{
  "real-estate": {
    "name": "Real Estate",
    "description": "Marketing materials for real estate professionals",
    "icon": "fa-home"
  }
}
```

## Development Workflow

### 1. Local Development
```bash
node server.js          # Start dev server on localhost:8001
node build.js           # Build site to dist/
```

### 2. Adding New Products
1. Add product definition to `products.json`
2. Create content file in `content/products/[product-slug].html`
3. Add product images to `assets/images/products/`
4. Run `node build.js` to generate product page

### 3. Adding New Industries
1. Add industry to `categories.json`
2. Create content file in `content/industries/[industry-slug].html`
3. Update navigation in `includes_new/header.html`
4. Run `node build.js` to generate industry page

## DOS AND DON'TS

### ✅ DO

**File Management:**
- Always use the existing template system for products and industries
- Keep all includes in `includes_new/` directory
- Use the build system - never edit files in `dist/` directly
- Follow the established naming conventions (kebab-case for slugs)

**Code Standards:**
- Use W3.CSS classes for styling consistency
- Keep JavaScript vanilla (no frameworks)
- Use semantic HTML structure
- Maintain responsive design principles

**Content Management:**
- Add new products through `products.json` + content files
- Use the industry categorization system
- Keep image assets organized in appropriate subdirectories
- Write descriptive alt text for all images

**Development Process:**
- Test changes with `node server.js` before building
- Run `node build.js` after making template/data changes
- Check that all includes are properly copied during build

### ❌ DON'T

**File Management:**
- Don't create standalone HTML files for products (use templates)
- Don't edit generated files in `dist/` directory
- Don't create new include systems - use existing `w3-include-html`
- Don't break the established directory structure

**Code Standards:**
- Don't add heavy JavaScript frameworks
- Don't use inline styles (use CSS classes)
- Don't hardcode paths - use relative paths
- Don't create overly complex nested structures

**Content Management:**
- Don't duplicate product information across files
- Don't create products without proper categorization
- Don't use inconsistent naming conventions
- Don't forget to optimize images before adding

**Mobile/Responsive:**
- Don't break mobile navigation structure
- Don't add desktop-only features without mobile alternatives
- Don't ignore responsive design principles
- Don't modify mobile menu structure without understanding the existing system

## Common Tasks

### Adding a New Product
1. Edit `products.json` to add product definition
2. Create `content/products/[product-slug].html` with product details
3. Add product image to `assets/images/products/`
4. Run `node build.js`
5. Test at `http://localhost:8001/products/[category]/[product-slug]/`

### Adding a New Industry
1. Edit `categories.json` to add industry definition
2. Create `content/industries/[industry-slug].html` with industry content
3. Update navigation in `includes_new/header.html`
4. Add industry-specific products to `products.json` with industry in their `industries` array
5. Run `node build.js`

### Modifying Site-wide Elements
1. **Header/Navigation:** Edit `includes_new/header.html`
2. **Footer:** Edit `includes_new/footer.html`
3. **Mobile Menu:** Edit `includes_new/mobile-menu.html` (be careful with structure)
4. **Styles:** Edit files in `assets/css/`
5. Run `node build.js` to copy includes to dist

## Troubleshooting

### Build Issues
- **Missing includes:** Check that `build.js` copies `includes_new/` to `dist/includes_new/`
- **Missing assets:** Verify asset paths in `build.js` copy operations
- **Template errors:** Check JSON syntax in data files

### Navigation Issues
- **Broken dropdowns:** Check JavaScript includes and W3.CSS classes
- **Mobile menu problems:** Don't modify structure without understanding existing implementation
- **Missing pages:** Ensure build process generated the page and check URL structure

### Performance Issues
- **Large images:** Optimize images before adding to assets
- **Slow loading:** Check for unnecessary JavaScript or CSS
- **Build time:** Large number of products may slow build process

## Key Conventions

- **URLs:** `/products/[category]/[product-slug]/`
- **Industries:** `/industries/[industry-slug]/`
- **Images:** `/assets/images/[category]/[filename]`
- **File naming:** kebab-case for all slugs and filenames
- **JSON structure:** Consistent property names across data files

## Contact & Support

This is a static website with a build system. For major structural changes, always:
1. Understand the existing system first
2. Test changes locally
3. Use the established patterns
4. Document any new conventions

Remember: The system is designed to be maintainable and scalable. Don't break established patterns without good reason. 