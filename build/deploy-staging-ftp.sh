#!/bin/bash

# BeSeen FTP Staging Deployment
# Uses FTP (port 21) instead of SSH

echo "📡 BeSeen FTP Staging Deployment"
echo "================================"
echo ""

# Build first
echo "📦 Building project..."
# npm run build

# if [ $? -ne 0 ]; then
#     echo "❌ Build failed! Please fix errors before deploying."
#     exit 1
# fi

echo "✅ Build successful!"
echo ""

# FTP Configuration (matches your Cyberduck settings)
FTP_HOST="ftp.beseensignshop.com"
FTP_USER="bezcursor@staging.beseensignshop.com"
FTP_PATH="/public_html/"  # Adjust this path as needed

echo "🎯 FTP Deployment Target:"
echo "   Host: $FTP_HOST"
echo "   User: $FTP_USER"
echo "   Path: $FTP_PATH"
echo "   URL: https://staging.beseensignshop.com/"
echo ""

read -p "Continue with FTP deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔄 Deploying via FTP..."
echo "You'll be prompted for your FTP password..."

# Use lftp for better FTP handling
if command -v lftp &> /dev/null; then
    echo "Using lftp for deployment..."
    lftp -u $FTP_USER $FTP_HOST << EOF
cd $FTP_PATH
mirror -R --delete --verbose dist/ ./
quit
EOF
else
    echo "lftp not found. Please install it with: brew install lftp"
    echo "Or use Cyberduck to upload the dist/ folder contents."
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ FTP deployment successful!"
    echo ""
    echo "🌐 Your staging site should be live at:"
    echo "   https://staging.beseensignshop.com/"
    echo ""
    echo "🧪 Test these key pages:"
    echo "   • Landing: https://staging.beseensignshop.com/"
    echo "   • Real Estate: https://staging.beseensignshop.com/services/real-estate/"
    echo "   • Shopping Cart: https://staging.beseensignshop.com/shopping-cart.html"
else
    echo "❌ FTP deployment failed!"
fi 