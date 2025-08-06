#!/bin/bash

# Nextcloud Setup Script for images.getbeseen.com
# This script will download, install, and configure Nextcloud

set -e

NEXTCLOUD_DIR="/Users/bezmorid/GIT HTML/realestate1/nextcloud"
NEXTCLOUD_VERSION="28.0.0"
NEXTCLOUD_URL="https://download.nextcloud.com/server/releases/nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"

echo "🚀 Setting up Nextcloud for images.getbeseen.com..."

# Check if we're in the right directory
if [ ! -d "$NEXTCLOUD_DIR" ]; then
    echo "❌ Nextcloud directory not found. Please run this script from the project root."
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 8.0 or higher."
    echo "   You can install it using Homebrew: brew install php"
    exit 1
fi

# Check PHP version
PHP_VERSION=$(php -r "echo PHP_VERSION;")
echo "✅ PHP version: $PHP_VERSION"

# Download Nextcloud
echo "📥 Downloading Nextcloud ${NEXTCLOUD_VERSION}..."
cd "$NEXTCLOUD_DIR"
curl -O "$NEXTCLOUD_URL"

# Extract Nextcloud
echo "📦 Extracting Nextcloud..."
tar -xjf "nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"

# Move files to the correct location
echo "📁 Moving files..."
mv nextcloud/* .
rmdir nextcloud
rm "nextcloud-${NEXTCLOUD_VERSION}.tar.bz2"

# Set proper permissions
echo "🔐 Setting permissions..."
chmod -R 755 .
chmod -R 777 data/
chmod -R 777 config/
chmod -R 777 apps/

# Create .htaccess for Nextcloud
echo "📝 Creating .htaccess file..."
cat > .htaccess << 'EOF'
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

echo "✅ Nextcloud setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your DNS to point images.getbeseen.com to your server"
echo "2. Set up Apache virtual host (see apache-vhost.conf)"
echo "3. Install SSL certificate for HTTPS"
echo "4. Access Nextcloud at http://images.getbeseen.com"
echo "5. Complete the web-based setup wizard"
echo ""
echo "🔧 Apache configuration file: $NEXTCLOUD_DIR/apache-vhost.conf"
echo "📁 Nextcloud directory: $NEXTCLOUD_DIR" 