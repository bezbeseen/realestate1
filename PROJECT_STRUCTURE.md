# 🎯 BeSeen Website - Clean Project Structure

## 🏗️ **CORE DEVELOPMENT FILES:**

### **📋 Templates & Data (Your "Source Code"):**
```
📁 templates/          ← Your HTML templates (like Jinja)
📁 data/              ← CSV/JSON data files (your variables)  
📁 includes/          ← Header/footer/nav pieces
📁 includes_new/      ← Enhanced includes (analytics)
```

### **🎨 Assets (Your Styling & Media):**
```
📁 assets/            ← Source CSS, JS, images
📁 frintem-template/  ← Reference template (keep!)
```

### **⚡ Build System:**
```
📄 build.js           ← Your compiler (like sass compiler)
📄 package.json       ← Dependencies & scripts
📁 node_modules/      ← Installed packages (ignore)
```

## 🚀 **OUTPUT & DEPLOYMENT:**

### **📦 Built Website:**
```
📁 dist/              ← Your compiled website (UPLOAD THIS!)
```

### **🛠️ Deployment Scripts:**
```
📄 deploy-staging-safe.sh     ← Safe deployment with backup
📄 deploy-staging-ftp.sh      ← FTP deployment  
📄 deploy-realestate.sh       ← Real estate subdomain
```

## 📝 **WORKING FILES:**
```
📄 staging-index.html          ← Your landing page
📄 index.html                  ← Main homepage
📄 shopping-cart.html          ← E-commerce cart
📄 commercial-signage.html     ← Service page
📄 real-estate-*.html          ← Real estate pages
```

## 🗑️ **JUNK FOLDER:**
```
📁 junk/              ← Everything else (old files, tests, etc.)
```

## 🔄 **YOUR WORKFLOW:**

1. **Edit:** `templates/` + `data/` + `includes/`
2. **Build:** `npm run build` 
3. **Deploy:** `./deploy-staging-safe.sh`
4. **Live Site:** `staging.beseensignshop.com`

---

**🎯 Focus on: templates, data, assets, build.js**
**🚀 Deploy: Only dist/ folder**
**🗑️ Ignore: Everything in junk/** 