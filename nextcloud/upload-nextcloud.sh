#!/bin/bash

# Upload Nextcloud to Bluehost Server
echo "📤 Uploading Nextcloud to Bluehost..."

# Check if the archive exists
if [ ! -f "/tmp/nextcloud-setup/images.getbeseen.com.tar.gz" ]; then
    echo "❌ Archive not found. Please run bluehost-setup.sh first."
    exit 1
fi

# Upload using curl
echo "📤 Uploading to beseensignshop.com..."
echo "🔑 You will be prompted for your FTP password..."

cd /tmp/nextcloud-setup
curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/website_8df97692/ --user canvas@website-8df97692.kui.opy.mybluehost.me

echo ""
echo "✅ Upload complete!"
echo ""
echo "📋 Next steps on your server:"
echo "1. Log into your Bluehost cPanel"
echo "2. Go to File Manager"
echo "3. Navigate to /home1/bezdesig/public_html/website_8df97692/"
echo "4. Extract images.getbeseen.com.tar.gz"
echo "5. Set permissions: chmod -R 755 images.getbeseen.com/"
echo "6. Set permissions: chmod -R 777 images.getbeseen.com/data/"
echo "7. Set permissions: chmod -R 777 images.getbeseen.com/config/"
echo ""
echo "🌐 DNS Configuration:"
echo "   Add A record: images -> 162.241.218.181"
echo ""
echo "🔗 Access Nextcloud:"
echo "   http://images.getbeseen.com"
echo ""
echo "📖 Complete setup guide: nextcloud/README.md" 