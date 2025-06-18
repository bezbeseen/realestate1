#!/bin/bash

# BeSeen Generated Folder Upload Script
# Uploads the entire generated folder to your Bluehost server

echo "🚀 BeSeen Generated Folder Upload"
echo "============================"

# Server Details
FTP_HOST="beseensignshop.com"
FTP_USER="beseenshop@shop.getbeseen.com"
REMOTE_DIR="/home1/bezdesig/public_html/shopbeseen"

# Ask for password
echo "🔐 Enter your FTP password:"
read -s FTP_PASS

echo "📁 Preparing to upload generated folder..."

# Verify generated folder exists
if [ ! -d "../generated" ]; then
echo "❌ Error: generated folder not found!"
    echo "Please make sure you're running this from the project root directory."
    exit 1
fi

# Change to dist directory
cd dist

echo "📦 Contents to upload:"
ls -la

echo ""
echo "⬆️  Starting upload to $FTP_HOST..."
echo "This may take a few minutes depending on file sizes..."

# Create FTP batch file
cat > ../ftp_upload.txt << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_DIR
mput *
cd assets
mput assets/*
cd js
mput assets/js/*
cd ../..
cd includes_new
mput includes_new/*
cd ..
cd services
mput services/*
cd ..
cd products
mput products/*
quit
EOF

# Execute FTP upload
ftp -i -n < ../ftp_upload.txt

# Check if upload was successful
if [ $? -eq 0 ]; then
    echo "✅ Upload completed successfully!"
    echo ""
    echo "🌐 Your website should now be updated at:"
    echo "   https://beseensignshop.com"
    echo ""
    echo "🧪 Test your analytics with:"
    echo "   https://beseensignshop.com/?debug=analytics"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Visit your website to verify everything looks correct"
    echo "   2. Test the analytics debug panel (Ctrl+Alt+A)"
    echo "   3. Check that all navigation links work properly"
else
    echo "❌ Upload failed!"
    echo "Please check your FTP credentials and try again."
fi

# Clean up
rm ../ftp_upload.txt
cd ..

echo ""
echo "📊 Analytics files that should be active:"
echo "   ✓ Enhanced analytics tracking"
echo "   ✓ Lead scoring system"  
echo "   ✓ Mobile interaction tracking"
echo "   ✓ Business-specific event tracking"
echo ""
echo "Done! 🎯" 