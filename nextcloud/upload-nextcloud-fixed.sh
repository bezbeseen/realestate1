#!/bin/bash

# Upload Nextcloud to Bluehost Server (Fixed for Bluehost directory structure)
echo "📤 Uploading Nextcloud to Bluehost..."

# Check if the archive exists
if [ ! -f "/tmp/nextcloud-setup/images.getbeseen.com.tar.gz" ]; then
    echo "❌ Archive not found. Please run bluehost-setup.sh first."
    exit 1
fi

# Upload using curl with proper Bluehost path
echo "📤 Uploading to beseensignshop.com..."
echo "🔑 You will be prompted for your FTP password..."

cd /tmp/nextcloud-setup

# Try uploading to the root directory first
echo "📤 Attempting upload to root directory..."
curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/ --user canvas@website-8df97692.kui.opy.mybluehost.me

if [ $? -eq 0 ]; then
    echo "✅ Upload successful to root directory!"
else
    echo "⚠️  Upload to root failed, trying public_html..."
    # Try public_html directory
    curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/public_html/ --user canvas@website-8df97692.kui.opy.mybluehost.me
    
    if [ $? -eq 0 ]; then
        echo "✅ Upload successful to public_html!"
    else
        echo "⚠️  Upload to public_html failed, trying website directory..."
        # Try the specific website directory
        curl -T images.getbeseen.com.tar.gz ftp://beseensignshop.com/website_8df97692/ --user canvas@website-8df97692.kui.opy.mybluehost.me
        
        if [ $? -eq 0 ]; then
            echo "✅ Upload successful to website directory!"
        else
            echo "❌ All upload attempts failed."
            echo "📋 Manual upload instructions:"
            echo "1. Use an FTP client (FileZilla, Cyberduck, etc.)"
            echo "2. Connect to: beseensignshop.com"
            echo "3. Username: canvas@website-8df97692.kui.opy.mybluehost.me"
            echo "4. Navigate to your website directory"
            echo "5. Upload: /tmp/nextcloud-setup/images.getbeseen.com.tar.gz"
            exit 1
        fi
    fi
fi

echo ""
echo "✅ Upload complete!"
echo ""
echo "📋 Next steps on your server:"
echo "1. Log into your Bluehost cPanel"
echo "2. Go to File Manager"
echo "3. Look for images.getbeseen.com.tar.gz in your website directory"
echo "4. Extract the archive"
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