#!/bin/bash

# BeSeen Staging Deployment Script
# Deploy to staging.getbeseen.com or getbeseen.com/staging/

echo "🚀 BeSeen Staging Deployment"
echo "============================"
echo ""

# Build first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Server Configuration 
STAGING_HOST="ftp.beseensignshop.com"                    # Your FTP server
STAGING_USER="bezcursor@staging.beseensignshop.com"      # Your username
STAGING_PATH="/home1/bezcursor@staging.beseensignshop.com/bezcursor/"  # Path for staging

echo "🎯 Deployment Target:"
echo "   Host: $STAGING_HOST"
echo "   Path: $STAGING_PATH"
echo "   URL: https://staging.beseensignshop.com/"
echo ""

read -p "Continue with deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔄 Deploying to staging..."

# Deploy using rsync (faster, only changed files)
rsync -avz --progress \
      --exclude '.git/' \
      --exclude '.DS_Store' \
      --exclude 'node_modules/' \
      --exclude '*.log' \
      --exclude 'deploy*.sh' \
      --exclude 'package*.json' \
      --exclude 'build.js' \
      --exclude 'server.js' \
      --exclude '*.md' \
      dist/ $STAGING_USER@$STAGING_HOST:$STAGING_PATH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Staging deployment successful!"
    echo ""
    echo "🌐 Your staging site should be live at:"
    echo "   https://staging.beseensignshop.com/"
    echo ""
    echo "🧪 Test these key pages:"
    echo "   • Main page: https://staging.beseensignshop.com/"
    echo "   • Services: https://staging.beseensignshop.com/services.html"
    echo "   • Real Estate: https://staging.beseensignshop.com/services/real-estate/"
    echo "   • Shopping Cart: https://staging.beseensignshop.com/shopping-cart.html"
    echo ""
    echo "🔍 Check for:"
    echo "   • All images loading correctly"
    echo "   • Navigation working"
    echo "   • Forms functioning"
    echo "   • Analytics loading (use ?debug=analytics)"
else
    echo "❌ Deployment failed!"
    echo "Check your credentials and server settings."
fi 