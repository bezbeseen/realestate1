#!/bin/bash

# Real Estate Subdomain Deployment Script
# Deploy to realestate.getbeseen.com

echo "🏠 Real Estate Subdomain Deployment"
echo "===================================="
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

# Server Configuration for Real Estate Subdomain
RE_HOST="ftp.getbeseen.com"
RE_USER="your-username"
RE_PATH="/public_html/realestate/"  # This should be the path for realestate.getbeseen.com

echo "🎯 Real Estate Deployment Target:"
echo "   Host: $RE_HOST"
echo "   Path: $RE_PATH"
echo "   URL: https://realestate.getbeseen.com/"
echo ""

# Create a temporary directory for real estate files
echo "📁 Preparing real estate files..."
mkdir -p temp_realestate

# Copy necessary files for the real estate subdomain
cp -r dist/assets temp_realestate/
cp -r dist/data temp_realestate/
cp -r dist/templates temp_realestate/

# Copy real estate specific pages
cp dist/real-estate-home-page.html temp_realestate/index.html
cp -r dist/services/real-estate temp_realestate/services/

# Copy essential includes
mkdir -p temp_realestate/includes_new
cp dist/include-*.html temp_realestate/
cp -r dist/includes_new temp_realestate/ 2>/dev/null || true

# Copy shopping cart and success pages (needed for purchases)
cp dist/shopping-cart.html temp_realestate/
cp dist/success.html temp_realestate/
cp dist/cancel.html temp_realestate/

echo "📋 Files prepared for real estate subdomain:"
echo "   • Real estate home page (as index.html)"
echo "   • All real estate service pages"
echo "   • Shopping cart functionality"
echo "   • Assets and includes"
echo ""

read -p "Continue with real estate subdomain deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    rm -rf temp_realestate
    exit 0
fi

echo ""
echo "🔄 Deploying to realestate.getbeseen.com..."

# Deploy the real estate files
rsync -avz --progress \
      --delete \
      temp_realestate/ $RE_USER@$RE_HOST:$RE_PATH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Real Estate subdomain deployment successful!"
    echo ""
    echo "🌐 Your real estate site should be live at:"
    echo "   https://realestate.getbeseen.com/"
    echo ""
    echo "🏠 Test these real estate pages:"
    echo "   • Home: https://realestate.getbeseen.com/"
    echo "   • Business Cards: https://realestate.getbeseen.com/services/real-estate/real-estate-business-cards.html"
    echo "   • Lawn Signs: https://realestate.getbeseen.com/services/real-estate/real-estate-lawn-signs.html"
    echo "   • Flags: https://realestate.getbeseen.com/services/real-estate/real-estate-flags.html"
    echo "   • Banners: https://realestate.getbeseen.com/services/real-estate/real-estate-banners.html"
    echo "   • A-Frames: https://realestate.getbeseen.com/services/real-estate/real-estate-a-frames.html"
    echo ""
    echo "🛒 Shopping functionality:"
    echo "   • Cart: https://realestate.getbeseen.com/shopping-cart.html"
    echo ""
    echo "📊 SEO Benefits:"
    echo "   • Dedicated domain for real estate keywords"
    echo "   • Focused content silo"
    echo "   • Location-specific targeting potential"
else
    echo "❌ Real Estate deployment failed!"
    echo "Check your credentials and server settings."
fi

# Clean up temp directory
rm -rf temp_realestate
echo "🧹 Cleaned up temporary files." 