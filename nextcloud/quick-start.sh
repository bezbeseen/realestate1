#!/bin/bash

# Quick Start Script for Nextcloud on images.getbeseen.com
# This script automates the entire setup process

set -e

echo "🚀 Quick Start: Nextcloud Setup for images.getbeseen.com"
echo "=================================================="

# Check if we're running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    exit 1
fi

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Installing PHP..."
    brew install php
fi

# Check if Apache is installed
if ! command -v httpd &> /dev/null; then
    echo "❌ Apache is not installed. Installing Apache..."
    brew install httpd
fi

echo "✅ Prerequisites check complete"

# Run the setup script
echo "📦 Installing Nextcloud..."
chmod +x setup-nextcloud.sh
./setup-nextcloud.sh

# Configure Apache
echo "🔧 Configuring Apache..."

# Determine Apache configuration directory
if [ -d "/usr/local/etc/httpd" ]; then
    APACHE_CONF_DIR="/usr/local/etc/httpd"
    APACHE_VHOST_DIR="$APACHE_CONF_DIR/vhosts"
elif [ -d "/etc/apache2" ]; then
    APACHE_CONF_DIR="/etc/apache2"
    APACHE_VHOST_DIR="$APACHE_CONF_DIR/vhosts"
else
    echo "❌ Apache configuration directory not found"
    exit 1
fi

# Create vhosts directory if it doesn't exist
sudo mkdir -p "$APACHE_VHOST_DIR"

# Copy virtual host configuration
sudo cp apache-vhost.conf "$APACHE_VHOST_DIR/images.getbeseen.com.conf"

# Enable virtual host
echo "Include $APACHE_VHOST_DIR/*.conf" | sudo tee -a "$APACHE_CONF_DIR/httpd.conf"

# Enable required modules
echo "📝 Enabling Apache modules..."
sudo sed -i '' 's/#LoadModule rewrite_module/LoadModule rewrite_module/' "$APACHE_CONF_DIR/httpd.conf"
sudo sed -i '' 's/#LoadModule headers_module/LoadModule headers_module/' "$APACHE_CONF_DIR/httpd.conf"

# Start Apache service
echo "🔄 Starting Apache service..."
brew services start httpd

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS: Add A record for 'images' pointing to your server IP"
echo "2. Access Nextcloud: http://images.getbeseen.com"
echo "3. Complete the web-based setup wizard"
echo "4. Set up SSL certificate for production use"
echo ""
echo "🔧 Configuration files:"
echo "   - Apache config: $APACHE_VHOST_DIR/images.getbeseen.com.conf"
echo "   - Nextcloud dir: $(pwd)"
echo ""
echo "📖 For detailed instructions, see: README.md" 