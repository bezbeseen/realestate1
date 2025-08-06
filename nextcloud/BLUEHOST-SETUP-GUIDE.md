# Bluehost Nextcloud Setup Guide for images.getbeseen.com

## 🚀 Quick Start

### Step 1: Prepare Files (Already Done)
```bash
cd /Users/bezmorid/GIT\ HTML/realestate1/nextcloud
./bluehost-setup.sh
```

### Step 2: Upload to Server
```bash
./upload-nextcloud.sh
# Enter your FTP password when prompted
```

### Step 3: Configure on Server
1. Log into Bluehost cPanel
2. Go to File Manager
3. Navigate to `/home1/bezdesig/public_html/website_8df97692/`
4. Extract `images.getbeseen.com.tar.gz`
5. Set permissions (see below)

### Step 4: Configure DNS
Add A record in your DNS settings:
- **Name**: `images`
- **Type**: `A`
- **Value**: `162.241.218.181`
- **TTL**: `3600`

### Step 5: Access Nextcloud
Visit: `http://images.getbeseen.com`

---

## 📋 Detailed Setup Instructions

### Server Configuration

#### File Permissions (via cPanel File Manager)
1. Right-click on `images.getbeseen.com` folder
2. Select "Change Permissions"
3. Set the following:
   - **Folders**: `755`
   - **Files**: `644`
   - **Special**: Check "Recurse through subdirectories"

#### Specific Directory Permissions
```bash
# Via SSH or cPanel Terminal
chmod -R 755 /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/
chmod -R 777 /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data/
chmod -R 777 /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/config/
```

### DNS Configuration

#### Bluehost DNS Manager
1. Log into Bluehost cPanel
2. Go to "Domains" → "Zone Editor"
3. Select your domain: `getbeseen.com`
4. Add A Record:
   - **Name**: `images`
   - **TTL**: `14400`
   - **Type**: `A`
   - **Points to**: `162.241.218.181`

#### Alternative: External DNS Provider
If using external DNS (Cloudflare, etc.):
```
Type: A
Name: images
Value: 162.241.218.181
TTL: 3600
```

### SSL Certificate Setup

#### Let's Encrypt (Recommended)
1. In cPanel, go to "Security" → "SSL/TLS"
2. Click "Install SSL Certificate"
3. Select "Let's Encrypt"
4. Domain: `images.getbeseen.com`
5. Click "Install Certificate"

#### Manual SSL Setup
1. Purchase SSL certificate
2. Upload certificate files via cPanel
3. Configure for `images.getbeseen.com`

### Nextcloud Configuration

#### Initial Setup
1. Visit `http://images.getbeseen.com`
2. Create admin account
3. Choose database type (SQLite recommended for simplicity)
4. Complete setup wizard

#### Advanced Configuration
Edit `/home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/config/config.php`:

```php
<?php
$CONFIG = array (
  'instanceid' => 'oc' . uniqid(),
  'passwordsalt' => 'your-salt-here',
  'secret' => 'your-secret-here',
  'trusted_domains' => 
  array (
    0 => 'images.getbeseen.com',
    1 => 'www.images.getbeseen.com',
  ),
  'datadirectory' => '/home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data',
  'dbtype' => 'sqlite3',
  'version' => '28.0.0.0',
  'overwrite.cli.url' => 'https://images.getbeseen.com',
  'htaccess.RewriteBase' => '/',
  'installed' => true,
);
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error
- Check PHP version (Nextcloud requires PHP 8.0+)
- Verify file permissions
- Check error logs in cPanel

#### 2. 403 Forbidden
- Verify file permissions (755 for folders, 644 for files)
- Check .htaccess file exists
- Ensure PHP is enabled

#### 3. Database Connection Error
- Verify database credentials
- Check if database exists
- Ensure proper permissions

#### 4. Subdomain Not Loading
- Verify DNS propagation (can take up to 24 hours)
- Check if subdomain is properly configured
- Test with `nslookup images.getbeseen.com`

### Log Files
- **Nextcloud Log**: `/home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data/nextcloud.log`
- **PHP Error Log**: Available in cPanel → "Errors" section
- **Apache Error Log**: Available in cPanel → "Errors" section

---

## 🔒 Security Best Practices

### File Permissions
```bash
# Directories
find /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/ -type d -exec chmod 755 {} \;

# Files
find /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/ -type f -exec chmod 644 {} \;

# Special directories
chmod -R 777 /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data/
chmod -R 777 /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/config/
```

### SSL Configuration
- Always use HTTPS in production
- Enable HSTS headers
- Configure secure cipher suites

### Backup Strategy
```bash
# Backup Nextcloud data
tar -czf nextcloud-backup-$(date +%Y%m%d).tar.gz \
  /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data/ \
  /home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/config/
```

---

## 📊 Performance Optimization

### Apache Configuration
- Enable gzip compression
- Configure browser caching
- Optimize worker processes

### Nextcloud Optimization
- Enable OPcache
- Configure Redis for caching
- Optimize database queries
- Use CDN for static assets

---

## 🔗 Integration with Main Site

### Cross-Domain Authentication
Configure SSO between your main site and Nextcloud:

1. **Shared Session**: Configure shared session storage
2. **OAuth Integration**: Use OAuth for authentication
3. **API Integration**: Use Nextcloud's WebDAV API

### File Sharing
```php
// Example: Link to Nextcloud files from main site
$nextcloud_url = 'https://images.getbeseen.com';
$file_path = '/path/to/file.jpg';
$share_url = $nextcloud_url . '/index.php/s/' . $share_token;
```

---

## 📞 Support

### Bluehost Support
- **Phone**: 1-888-401-4678
- **Live Chat**: Available in cPanel
- **Knowledge Base**: help.bluehost.com

### Nextcloud Support
- **Documentation**: docs.nextcloud.com
- **Community**: help.nextcloud.com
- **GitHub**: github.com/nextcloud/server

### DNS Propagation Check
- **whatsmydns.net**: Check DNS propagation
- **dnschecker.org**: Verify DNS records
- **mxtoolbox.com**: Comprehensive DNS tools

---

## ✅ Checklist

- [ ] Files uploaded to server
- [ ] Archive extracted in correct location
- [ ] File permissions set correctly
- [ ] DNS A record added for `images`
- [ ] SSL certificate installed
- [ ] Nextcloud web setup completed
- [ ] Admin account created
- [ ] Test file upload/download
- [ ] Backup strategy implemented
- [ ] Security settings configured 