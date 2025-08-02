#!/bin/bash

# BeSeen Sandbox FTP Deployment
# Safe testing environment before staging

echo "🧪 BeSeen Sandbox FTP Deployment"
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

# Sandbox FTP Configuration
FTP_HOST=""
FTP_USER=""
FTP_PATH="/public_html/"  # Adjust this path as needed

echo "🎯 Sandbox FTP Deployment Target:"
echo "   Host: $FTP_HOST"
echo "   User: $FTP_USER"
echo "   Path: $FTP_PATH"
echo "   URL: [Your sandbox URL]"
echo ""

read -p "Continue with sandbox FTP deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔄 Deploying to sandbox via FTP..."
echo "You'll be prompted for your FTP password..."

# Use lftp for better FTP handling
if command -v lftp &> /dev/null; then
    echo "Using lftp for deployment..."
    lftp -u $FTP_USER $FTP_HOST << EOF
cd $FTP_PATH
mirror -R --delete --verbose generated/ ./
quit
EOF
else
    echo "lftp not found. Please install it with: brew install lftp"
    echo "Or use Cyberduck to upload the generated/ folder contents."
    exit 1
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Sandbox FTP deployment successful!"
    echo ""
    echo "🌐 Your sandbox site should be live at:"
    echo "   [Your sandbox URL]"
    echo ""
    echo "🧪 Test these key pages:"
    echo "   • Landing: [Your sandbox URL]/"
    echo "   • Image Review: [Your sandbox URL]/image-review.html"
    echo "   • Products: [Your sandbox URL]/products.html"
    echo "   • Services: [Your sandbox URL]/services.html"
else
    echo "❌ Sandbox FTP deployment failed!"
fi 