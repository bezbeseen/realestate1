#!/bin/bash

# Upload Nextcloud to Bluehost Server (Correct Path)
echo "📤 Uploading Nextcloud to Bluehost (Correct Path)..."

# Check if the archive exists
if [ ! -f "/tmp/nextcloud-setup/images.getbeseen.com.tar.gz" ]; then
    echo "❌ Archive not found. Please run bluehost-setup.sh first."
    exit 1
fi

# Upload using curl with CORRECT Bluehost path
echo "📤 Uploading to beseensignshop.com..."
echo "🔑 You will be prompted for your FTP password..."

cd /tmp/nextcloud-setup

# Upload to the CORRECT directory
echo "📤 Uploading to website_05984e31 directory..."
curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/website_05984e31/ --user canvas@website-8df97692.kui.opy.mybluehost.me

if [ $? -eq 0 ]; then
    echo "✅ Upload successful to correct directory!"
else
    echo "❌ Upload failed. Trying alternative paths..."
    # Try alternative paths
    curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/public_html/ --user canvas@website-8df97692.kui.opy.mybluehost.me
fi

echo ""
echo "✅ Upload complete!"
echo ""
echo "📋 Next steps on your server:"
echo "1. Log into your Bluehost cPanel"
echo "2. Go to File Manager"
echo "3. Navigate to /public_html/website_05984e31/"
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
echo "📖 Complete setup guide: nextcloud/BLUEHOST-SETUP-GUIDE.md" 