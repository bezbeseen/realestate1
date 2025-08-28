# Be Seen Print Sign and Design - AI Guide

## Project Overview

**Business:** Be Seen Print Sign and Design - Printing, Design, Web Design, Signs, Sign Installation, Sign Permits and Mail services  
**Tech Stack:** Static HTML using BOOTSTRAP library, Node.js build system, vanilla JavaScript  
**Template Base:** "Frintem" template structure  
**Build System:** Node.js build script that generates pages from templates and copies assets  

### Recent Major Update (August 2025)
The project has been **completely reorganized** for better navigation and maintenance:
- **Production files** moved to `/production stuff/` folder
- **Generated website** outputs to external `/generated/` folder  
- **Archive files** moved to `/archive/` with organized subfolders

## 🗂️ New Project Structure

### Root Directory (`/realestate1/`)
```
realestate1/
├── production stuff/          # ← ALL PRODUCTION FILES HERE
│   ├── build/                # Build scripts
│   ├── templates/            # HTML templates
│   ├── data/                 # JSON data files
│   ├── includes/             # Shared components
│   ├── assets/               # CSS, JS, images, fonts
│   ├── content/              # Enhanced product content
│   ├── api/                  # Stripe checkout endpoints
│   ├── package.json          # Dependencies
│   └── AI-GUIDE.md          # This guide
├── generated/                 # ← EXTERNAL OUTPUT FOLDER
│   └── [built website files] # Auto-generated, don't edit
├── archive/                   # Organized archive
│   ├── documentation/        # Markdown guides
│   ├── testing/              # Test files
│   ├── legacy/               # Old templates/backups
│   └── comfyui/              # AI generation tools
├── .git/                      # Git repository
└── [system files]            # .gitignore, .htaccess, etc.
```

## 🚀 Updated Development Workflow

### Build & Serve Process
```bash
# 1. Navigate to production folder
cd "production stuff"

# 2. Build the website
node build/build.js

# 3. Start local server (from project root)
cd ../generated
python3 -m http.server 8002

# 4. View at http://localhost:8002
```

### Key File Locations
- **Edit source files:** `/production stuff/`
- **View built website:** `/generated/`
- **Archive/reference:** `/archive/`

## 📁 Production Folder Details

### Core Production Files:
- **`build/build.js`** - Main build script
- **`templates/`** - HTML templates for all page types
- **`data/`** - JSON data (products.json, categories.json, etc.)
- **`includes/`** - Shared HTML components (header, footer, etc.)
  - **`analytics-loader.html`** - GA4, Clarity, marketing tracking (EDIT HERE for analytics)
  - **`image-helpers.html`** - Product image path mappings (EDIT HERE for image fixes)
  - **`header.html`** - Main navigation and branding
  - **`footer.html`** - Footer content and links
- **`assets/`** - CSS, JavaScript, images, fonts
- **`content/`** - Enhanced HTML content for specific products
- **`api/`** - Stripe checkout and payment processing

### Current Features:
- ✅ **38 products** across 5 categories (prints, signs, materials, promotional, real-estate)
- ✅ **Dynamic description tabs** populated from `products.json` (`long_description`, `features`, `use_cases`)
- ✅ **Stripe cart integration** with checkout functionality
- ✅ **Professional banner images** with hero_image_url system
- ✅ **Enhanced product content** for key products (business cards, banners, a-frames)
- ✅ **Responsive design** with Bootstrap framework

## System Architecture

### Template System
- **Products:** Generated from `templates/product-template.html` using data from `data/products.json`
- **Categories:** Generated from `templates/category-template.html`
- **Services:** Generated from `templates/services-page-template.html`
- **Build Process:** Run `node build/build.js` from production folder

### Include System
- **Shared Components:** Located in `includes/` directory
- **Header/Footer:** Automatically included via Handlebars partials
- **Related Products:** `includes/related-products.html` with local images

## Navigation Structure
- **Main Nav:** Products, Services, Industries, Contact
- **Services Dropdown:** 
  - Graphic Design (Logo Design, Branding, Photo Editing, Print Layout, Typography)
  - Web Design (Website Development, Web Services, Email Design, Digital Marketing, Social Media, SEO)
  - Mailing Services (EDDM, Newsletters, Postcards, Direct Mail, List Cleaning, Interactive Mail)
- **Products Dropdown:** Prints, Signs, Materials, Promotional, Real Estate
- **Product Categories:** business-cards, banners, flags, lawn-signs, a-frames, and 39+ more

## ✅ DOS AND DON'TS

### ✅ DO

**File Management:**
- **ALWAYS work in `/production stuff/` folder** for source files
- **CRITICAL:** Fix issues at the SOURCE level in templates/includes, NOT in generated files
- Use the existing template system for products and categories
- Run build process after making changes: `node build/build.js`
- Test changes by serving from `/generated/` folder
- Follow established naming conventions (kebab-case for slugs)

**Code Standards:**
- Use Bootstrap styling consistently
- Follow the "Frintem" template structure
- Keep JavaScript vanilla (no frameworks)
- Use semantic HTML structure
- Maintain responsive design principles

**Workflow:**
- **CRITICAL:** Always build after making changes
- Test locally before deploying
- Use relative paths for assets
- Communicate plan before major structural changes

### ❌ DON'T

**File Management:**
- **NEVER edit files in `/generated/` directory** (they get overwritten by builds)
- **NEVER make "quick fixes" in generated files** - they'll be lost on next build
- Don't create standalone HTML files for products (use templates)
- Don't break the new organized directory structure
- Don't move files out of `/production stuff/` without updating paths
- **NEVER delete image folders without checking dependencies** - build system uses them

**Code Standards:**
- Don't add heavy JavaScript frameworks
- Don't use inline styles (use CSS classes)
- Don't hardcode paths - use relative paths
- Don't create overly complex nested structures

## Common Tasks

### Adding a New Product
1. Edit `production stuff/data/products.json` to add product definition
2. Optionally create `production stuff/content/products/[product-slug].html` for enhanced content
3. Add product images to `production stuff/assets/images/`
4. Run `cd "production stuff" && node build/build.js`
5. Test at http://localhost:8002/products/[category]/[product-slug].html

### Adding a New Service
1. Edit service data files in `production stuff/data/`
2. Add service images to `production stuff/assets/images/services/`
3. Run build process
4. Test at http://localhost:8002/services/[service-slug].html

### Updating Styling
1. Edit CSS in `production stuff/assets/css/style.css`
2. Run `node build/build.js` to copy to generated folder
3. Refresh browser to see changes

### Updating Templates
1. Edit templates in `production stuff/templates/`
2. Run `node build/build.js` to regenerate all pages
3. Test affected pages

## Troubleshooting

### Build Issues
- **"No such file or directory":** Check you're in `/production stuff/` folder
- **Missing assets:** Verify paths in build script are correct
- **Template errors:** Check JSON syntax in data files

### Server Issues
- **Server won't start:** Make sure you're in `/generated/` folder
- **Files not updating:** Run build process first, then refresh browser
- **404 errors:** Check that build process completed successfully

### Path Issues
- **Images not loading:** Check asset paths are relative to generated folder
- **CSS not applying:** Verify build process copied assets correctly

### Common Fix Patterns
- **Analytics not working:** Update `includes/analytics-loader.html` in production stuff, then rebuild
- **Image paths broken:** Check `includes/image-helpers.html` for hardcoded paths
- **Build overwrites fixes:** Always fix at SOURCE level (production stuff/), never in generated/
- **"Fixes keep disappearing":** You're editing generated files - edit the templates instead

### Emergency Recovery
- **Accidentally deleted images:** Rebuild from production stuff to restore all assets
- **Site completely broken:** Check if you edited generated/ instead of production stuff/
- **Analytics reverted:** Check if GA4 IDs are set in source templates, not just generated files

## Key Conventions

- **URLs:** `/products/[category]/[product-slug]/`
- **Industries:** `/industries/[industry-slug]/`
- **Images:** `/assets/images/[category]/[filename]`
- **File naming:** kebab-case for all slugs and filenames

## API Integration

### Current APIs:
- **Stripe:** Payment processing and checkout
- **Freepik:** Image resources (when needed)

### Stripe Configuration:
- API endpoints in `production stuff/api/`
- Checkout integration in cart.js
- Success/cancel pages generated automatically

## Deployment Notes

### For Production Deployment:
1. Build the site: `cd "production stuff" && node build/build.js`
2. Upload contents of `/generated/` folder to web server
3. Ensure server can serve static files
4. Configure environment variables for Stripe (if using)

### For Development:
1. Always work in `/production stuff/`
2. Always build after changes
3. Always test in `/generated/` folder
4. Keep archive files for reference only

## Contact & Support

**Project Owner:** Bez  
**Repository:** https://github.com/bezbeseen/realestate1 (real estate subdomain)

## Important Reminders

🎯 **NEW STRUCTURE KEY POINTS:**
- **Source files:** `/production stuff/` - Edit here
- **Built website:** `/generated/` - Serve from here, never edit
- **Archive files:** `/archive/` - Reference only
- **Build command:** `cd "production stuff" && node build/build.js`
- **Server command:** `cd generated && python3 -m http.server 8002`

This reorganization makes the project much more maintainable and easier to navigate. The separation of source (`/production stuff/`) and output (`/generated/`) follows industry best practices and prevents accidental editing of generated files. 