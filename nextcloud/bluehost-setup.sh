#!/bin/bash

# Bluehost Nextcloud Setup Script for images.getbeseen.com
# This script will download Nextcloud and prepare it for upload to Bluehost

set -e

echo "🚀 Bluehost Nextcloud Setup for images.getbeseen.com"
echo "=================================================="

# Configuration
NEXTCLOUD_VERSION="28.0.0"
NEXTCLOUD_URL="https://download.nextcloud.com/server/releases/nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"
TEMP_DIR="/tmp/nextcloud-setup"
BLUEHOST_FTP_HOST="beseensignshop.com"
BLUEHOST_FTP_USER="canvas@website-8df97692.kui.opy.mybluehost.me"
BLUEHOST_HOME_DIR="/home1/bezdesig/public_html/website_8df97692"

echo "📋 Bluehost Server Details:"
echo "   Host: $BLUEHOST_FTP_HOST"
echo "   User: $BLUEHOST_FTP_USER"
echo "   Home Directory: $BLUEHOST_HOME_DIR"
echo ""

# Create temporary directory
echo "📁 Creating temporary directory..."
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Download Nextcloud
echo "📥 Downloading Nextcloud ${NEXTCLOUD_VERSION}..."
curl -O "$NEXTCLOUD_URL"

# Extract Nextcloud
echo "📦 Extracting Nextcloud..."
tar -xjf "nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"

# Create images subdomain directory structure
echo "📁 Creating subdomain directory structure..."
mkdir -p images.getbeseen.com
mv nextcloud/* images.getbeseen.com/
rm -rf nextcloud
rm "nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"

# Create .htaccess for Nextcloud
echo "📝 Creating .htaccess file..."
cat > images.getbeseen.com/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    RewriteCond %{REQUEST_URI} !^/\.well-known/acme-challenge/.*$
    RewriteCond %{REQUEST_URI} !^/\.well-known/cpanel-dcv/.*$
    RewriteCond %{REQUEST_URI} !^/\.well-known/pki-validation/(?:\ Ballot169)?
    RewriteCond %{REQUEST_URI} !^/\.well-known/pki-validation/[A-F0-9]{32}\.txt(?:\ Comodo\ DCV)?$
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
    RewriteCond %{ENV:REDIRECT_STATUS} ^$
    RewriteRule ^index\.php(?:/(.*)|$) /index.php [QSA,L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.php [QSA,L]
</IfModule>
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

# Create subdomain .htaccess
echo "📝 Creating subdomain .htaccess..."
cat > images.getbeseen.com/.htaccess.subdomain << 'EOF'
# Subdomain configuration for images.getbeseen.com
RewriteEngine On

# Force HTTPS (uncomment when SSL is configured)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# PHP configuration
<FilesMatch "\.php$">
    SetHandler application/x-httpd-php
</FilesMatch>

# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

# Create configuration files
echo "📝 Creating configuration files..."
cat > images.getbeseen.com/config.php << 'EOF'
<?php
$CONFIG = array (
  'instanceid' => 'oc' . uniqid(),
  'passwordsalt' => '',
  'secret' => '',
  'trusted_domains' => 
  array (
    0 => 'images.getbeseen.com',
    1 => 'localhost',
  ),
  'datadirectory' => '/home1/bezdesig/public_html/website_8df97692/images.getbeseen.com/data',
  'dbtype' => 'sqlite3',
  'version' => '28.0.0.0',
  'overwrite.cli.url' => '  https://images.getbeseen.com',
  'htaccess.RewriteBase' => '/',
  'installed' => false,
);
EOF

# Create data and config directories
mkdir -p images.getbeseen.com/data
mkdir -p images.getbeseen.com/config

# Set proper permissions (will be set on server)
echo "🔐 Setting local permissions..."
chmod -R 755 images.getbeseen.com/
chmod -R 777 images.getbeseen.com/data/
chmod -R 777 images.getbeseen.com/config/

# Create upload script
echo "📝 Creating upload script..."
cat > upload-to-bluehost.sh << 'EOF'
#!/bin/bash

# Upload script for Bluehost
echo "📤 Uploading Nextcloud to Bluehost..."

# Upload using curl (you'll need to enter password when prompted)
curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/website_8df97692/ --user canvas@website-8df97692.kui.opy.mybluehost.me

echo "✅ Upload complete!"
echo ""
echo "📋 Next steps:"
echo "1. Extract the archive on your server"
echo "2. Set proper permissions: chmod -R 755 images.getbeseen.com/"
echo "3. Configure DNS: Add A record for 'images' pointing to your server"
echo "4. Access Nextcloud: http://images.getbeseen.com"
echo "5. Complete the web-based setup wizard"
EOF

chmod +x upload-to-bluehost.sh

# Create archive
echo "📦 Creating upload archive..."
tar -czf images.getbeseen.com.tar.gz images.getbeseen.com/

echo ""
echo "✅ Setup complete!"
echo ""
echo "📁 Files created in: $TEMP_DIR"
echo "📦 Upload archive: $TEMP_DIR/images.getbeseen.com.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Run: cd $TEMP_DIR && ./upload-to-bluehost.sh"
echo "2. Enter your FTP password when prompted"
echo "3. Extract the archive on your server"
echo "4. Configure DNS for images.getbeseen.com"
echo "5. Access Nextcloud and complete setup"
echo ""
echo "🔧 Server configuration:"
echo "   - Extract to: $BLUEHOST_HOME_DIR/images.getbeseen.com/"
echo "   - Set permissions: chmod -R 755 images.getbeseen.com/"
echo "   - Set permissions: chmod -R 777 images.getbeseen.com/data/"
echo "   - Set permissions: chmod -R 777 images.getbeseen.com/config/" 