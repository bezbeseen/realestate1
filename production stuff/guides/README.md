# Production Website Files

This folder contains all the essential files needed to build and run the website.

## 🚀 Quick Start

1. **Build the website:**
   ```bash
   cd "production stuff"
   node build/build.js
   ```

2. **Start local server:**
   ```bash
   cd ../generated
   python3 -m http.server 8002
   ```

3. **View website:**
   Open http://localhost:8002

## 📁 Folder Structure

### Core Production Files:
- **`build/`** - Build scripts and configuration
- **`templates/`** - HTML templates for pages
- **`data/`** - Product and category data (JSON)
- **`includes/`** - Shared HTML components
- **`assets/`** - CSS, JavaScript, images, fonts
- **`content/`** - Enhanced product content (HTML)
- **`api/`** - Stripe checkout and API endpoints
- **`generated/`** - Built website files (auto-generated; output is at project root, not inside `production stuff`)
- **`guides/`** - Documentation and guides (see [INDEX.md](./INDEX.md)); **[BUILD.md](./BUILD.md)** for build system details

### Configuration Files:
- **`package.json`** - Node.js dependencies
- **`.env copy.example`** - Environment variables template
- **`sitemap.xml`** - SEO sitemap (auto-generated in both locations)

## 🔧 Development Workflow

1. **Make changes** to templates, data, or content (only in `production stuff/`)
2. **Run build** with `node build/build.js` (from inside `production stuff`)
3. **Test locally** by serving from `generated/` folder (`cd ../generated && python3 -m http.server 8002`)
4. **Deploy** the `generated/` folder contents to your web server

**Build behavior:** The build **empties** the `generated/` folder (does not delete the folder itself). This avoids failures when the project is on Google Drive or other sync. See **[BUILD.md](./BUILD.md)** for full build system details and troubleshooting.

## 📊 Current Features
- ✅ 42 products across 5 categories
- ✅ Stripe checkout integration
- ✅ Responsive design with Bebas Neue font
- ✅ SEO optimized with sitemap
- ✅ Professional banner images
- ✅ Enhanced product content 