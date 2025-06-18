# Be Seen Print Sign and Design - AI Guide

## Project Overview

**Business:** Be Seen Print Sign and Design - Printing, Design, Web Design, Signs, Sign Installation, Sign Permits and Mail services  
**Website:** Lets generate this after all the things are filled out  
**Tech Stack:** Static HTML using BOOTSTRAP library, using a building framework with includes W3.CSS framework, vanilla JavaScript -- All HTML structure started from a template "Frintem"   
**Build System:** Node.js build script that generates pages from templates and copies assets  

### Additional Notes
I have an existing website @getbeseen.com but am working to rebuild the site to add all product pages and specific sub domains for different target audiences like real estate, sports, contsruction, events, conventions, and restaurants -- if its smart/effective each audience will have a subdomain like realestate.getbeseen.com. with its own SEO to get better search results 


## System Architecture

### Template System
- **Products:** Generated from `templates/product.html` using data from `products.json`
- **Industries:** Generated from `templates/industry.html` using content from `content/industries/`
- **Build Process:** Run `node build.js` to generate all pages into `dist/`

#### Template Notes
Since we are using this it is CRITICAL that we only edit the template files and not the built files 


### Include System
- **Homepage & Static Pages:** Use `w3-include-html` for header, footer, mobile menu
- **Includes Location:** `includes_new/` directory (copied to `dist/includes_new/` during build)

#### Include Notes
CRITICAL that we priorities these include and MAKE SURE that ALL PAGES HAVE THE SAME INCLUDE STRUCTURE/CALLS


## Navigation Structure
- **Main Nav:** Products, Services, Industries, Contact, Promo Store
- **Services Dropdown:** 
  - Graphic Design (Logo Design, Branding, Photo Editing, Print Layout, Typography)
  - Web Design (Website Development, Web Services, Email Design, Digital Marketing, Social Media, SEO)
  - Mailing Services (EDDM, Newsletters, Postcards, Direct Mail, List Cleaning, Interactive Mail)
- **Products Dropdown:** Prints, Signs, Materials, Promotional, Real Estate
- **Industries Dropdown:** Real Estate
- **Product Categories:** business-cards, banners, flags, lawn-signs, a-frames, and 33+ more



## Development Workflow

### Local Development
```bash
node server.js    # Start dev server on localhost:8001
node build.js     # Build site to dist/
```



## DOS AND DON'TS

### ✅ DO

**File Management:**
- Always use the existing template system for products and industries
- Keep all includes in includes_new/ directory
- Use the build system - never edit files in dist/ directly
- Follow the established naming conventions (kebab-case for slugs)

**Code Standards:**
- CRITICAL always use bootstrap styling
- CRITICAL follow the "Frintem" template structure no need to rebuild things
- Use W3.CSS classes for styling consistency
- Keep JavaScript vanilla (no frameworks)
- Use semantic HTML structure
- Maintain responsive design principles
- Reuse/relook at existing framework

**Additional DOs:**
BEFORE making big changes: please communicate plan first for approve


### ❌ DON'T

**File Management:**
- Don't create standalone HTML files for products (use templates)
- Don't edit generated files in dist/ directory
- Don't create new include systems - use existing w3-include-html
- Don't break the established directory structure

**Code Standards:**
- Don't add heavy JavaScript frameworks
- Don't use inline styles (use CSS classes)
- Don't hardcode paths - use relative paths
- Don't create overly complex nested structures
- Don't create new JS files if not necessary this gets out of control 



## Common Tasks

### Adding a New Product
1. Edit products.json to add product definition
2. Create content/products/[product-slug].html with product details
3. Add product image to assets/images/products/
4. Run npm run build
5. Test at http://localhost:8080/products/[category]/[product-slug].html



### Adding a New Service
1. Edit services.json to add service definition with proper parent category
2. Set parent_service to "graphic-design", "web-design", or "mailing" 
3. Add service image to assets/images/services/
4. Run npm run build
5. Test at http://localhost:8080/services/[parent-service]/[service-slug].html



### Adding a New Industry
1. Edit categories.json to add industry definition
2. Create content/industries/[industry-slug].html with industry content
3. Update navigation in includes_new/header.html
4. Add industry-specific products to products.json with industry in their industries array
5. Run node build.js



## Troubleshooting

### Build Issues
- **Missing includes:**  Check that build.js copies includes_new/ to dist/includes_new/
- **Missing assets:**  Verify asset paths in build.js copy operations
- **Template errors:**  Check JSON syntax in data files

### Navigation Issues
- **Broken dropdowns:**  Check JavaScript includes and W3.CSS classes
- **Mobile menu problems:**  Don't modify structure without understanding existing implementation
- **Missing pages:**  Ensure build process generated the page and check URL structure



## Key Conventions

- **URLs:** `/products/[category]/[product-slug]/`
- **Industries:** `/industries/[industry-slug]/`
- **Images:** `/assets/images/[category]/[filename]`
- **File naming:** kebab-case for all slugs and filenames



## Helpful printing websites for reference 

b2sign.com
4over.com
vistaprint.com
printfirm.com
https://www.777sign.com/

My website: 
getbeseen.com

Helpful resources:
https://go.4over.com/mymarketing



## Helpful printing websites for reference 

b2sign.com
4over.com
vistaprint.com
printfirm.com
https://www.777sign.com/

My website: 
getbeseen.com

Helpful resources:
https://go.4over.com/mymarketing



## API's

Freepik
Stripe

## Pain Points

- Finding product specific images - this has been hard because it is so specific
- Cart integration 
- General AI generating errors - Not following the plan/structure (includes, editing generated files instead of template files) 

## Contact & Support

**Project Owner:** Bez 

**Repository:** https://github.com/bezbeseen/getbeseen (main website), https://github.com/bezbeseen/realestate1 (real estate sub domain) 




This is a static website with a build system. For major structural changes, always:
1. Understand the existing system first
2. Test changes locally
3. Use the established patterns
4. Document any new conventions

Remember: The system is designed to be maintainable and scalable. Don't break established patterns without good reason.