# Manual FTP Upload Guide for Nextcloud

## 🔧 FTP Connection Details
- **Host**: `beseensignshop.com`
- **Username**: `canvas@website-8df97692.kui.opy.mybluehost.me`
- **Password**: `kryAg?2txg`
- **Port**: `21` (FTP) or `22` (SFTP)

## 📁 What to Upload

### Option 1: Upload the Archive (Recommended)
1. **File to upload**: `images.getbeseen.com.tar.gz`
2. **Location**: `/tmp/nextcloud-setup/images.getbeseen.com.tar.gz`
3. **Upload to**: Your website root directory
4. **Then extract** on the server via File Manager

### Option 2: Upload Individual Files
Upload the entire `images.getbeseen.com/` folder contents to your website directory.

## 🚀 Step-by-Step Instructions

### 1. Connect via FTP
1. Open your FTP client (FileZilla, Cyberduck, etc.)
2. Enter connection details:
   - Host: `beseensignshop.com`
   - Username: `canvas@website-8df97692.kui.opy.mybluehost.me`
   - Password: `kryAg?2txg`
   - Port: `21`

### 2. Navigate to Website Directory
1. Connect to the server
2. Navigate to your website directory (likely `public_html/` or similar)
3. Look for folders like `website_05984e31` or `website_8df97692`

### 3. Upload Files
**Option A - Upload Archive:**
1. Upload `images.getbeseen.com.tar.gz` to the website directory
2. Log into cPanel File Manager
3. Extract the archive in place

**Option B - Upload Folder:**
1. Upload the entire `images.getbeseen.com/` folder
2. Make sure all subdirectories are included

### 4. Set Permissions
After upload, set these permissions:
- **Main folder**: `755`
- **data/ folder**: `777`
- **config/ folder**: `777`
- **All other folders**: `755`
- **All files**: `644`

## 📋 File Structure to Upload

```
images.getbeseen.com/
├── index.php
├── .htaccess
├── config.php
├── core/
├── lib/
├── apps/
├── templates/
├── themes/
├── data/
└── config/
```

## 🔍 Troubleshooting

### If Upload Fails:
1. **Check connection**: Verify host, username, password
2. **Try SFTP**: Use port 22 instead of 21
3. **Check directory permissions**: Make sure you can write to the target directory
4. **Try smaller files**: Upload in smaller chunks if needed

### If Files Don't Appear:
1. **Refresh directory listing** in your FTP client
2. **Check for hidden files** (like .htaccess)
3. **Verify upload location** is correct

## ✅ After Upload

1. **Test the subdomain**: `http://images.getbeseen.com`
2. **Complete Nextcloud setup** via web interface
3. **Configure DNS** if not already done
4. **Set up SSL certificate** for production use

## 📞 Need Help?

If you encounter issues:
1. Check the FTP connection details
2. Verify the upload location
3. Test with a simple text file first
4. Contact Bluehost support if needed 