# Manual Upload Guide for Nextcloud

Since FTP upload is restricted, here's how to manually upload Nextcloud to your server:

## 📁 Files to Upload

The Nextcloud files are ready in: `/tmp/nextcloud-setup/images.getbeseen.com/`

## 🔧 Manual Upload Steps

### 1. Access File Manager
1. Log into your Bluehost cPanel
2. Go to "Files & Access" → "File Manager"
3. Navigate to your website directory (either `website_05984e31` or `website_8df97692`)

### 2. Create Directory Structure
1. Create a new folder called `images.getbeseen.com`
2. Inside that folder, create these subdirectories:
   - `data/`
   - `config/`
   - `apps/`
   - `core/`
   - `lib/`
   - `templates/`
   - `themes/`

### 3. Upload Core Files
Upload these essential files to the `images.getbeseen.com/` folder:

**Main Files:**
- `index.php` (Nextcloud main entry point)
- `.htaccess` (Apache configuration)
- `config.php` (Nextcloud configuration)

**Core Directories:**
- `core/` (Nextcloud core files)
- `lib/` (Library files)
- `apps/` (Applications)
- `templates/` (Template files)
- `themes/` (Theme files)

### 4. Set Permissions
After uploading:
1. **Main folder**: `755`
2. **data/ folder**: `777`
3. **config/ folder**: `777`
4. **All other folders**: `755`
5. **All files**: `644`

## 🚀 Quick Alternative

If manual upload is too complex, I can create a simple Nextcloud installation script that you can run directly on your server via SSH or cPanel Terminal.

Would you like me to:
1. Create a simple installation script?
2. Provide the individual files for manual upload?
3. Try a different approach?

## 📋 Current Status
- ✅ Nextcloud files prepared
- ❌ FTP upload restricted
- ⏳ Need manual upload or alternative method 