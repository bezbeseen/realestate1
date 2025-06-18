#!/bin/bash

# BeSeen SAFE Staging Deployment Script
# This backs up existing files first, then deploys new version

echo "🛡️  BeSeen SAFE Staging Deployment"
echo "=================================="
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
STAGING_HOST="ftp.beseensignshop.com"
STAGING_USER="bezcursor@staging.beseensignshop.com"
STAGING_PATH="/home1/bezcursor@staging.beseensignshop.com/bezcursor/"

echo "🎯 Deployment Target:"
echo "   Host: $STAGING_HOST"
echo "   Path: $STAGING_PATH"
echo "   URL: https://staging.beseensignshop.com/"
echo ""
echo "🛡️  Safety Process:"
echo "   1. Create 'old' folder on server"
echo "   2. Move existing files to 'old' folder"
echo "   3. Deploy new version"
echo "   4. Keep old version accessible at /old/"
echo ""

read -p "Continue with SAFE deployment? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔄 Step 1: Backing up existing files..."

# Connect via SSH and backup existing files
ssh $STAGING_USER@$STAGING_HOST << 'EOF'
cd /home1/bezcursor@staging.beseensignshop.com/bezcursor/

# Create old folder with timestamp
OLD_FOLDER="old_$(date +%Y%m%d_%H%M%S)"
mkdir -p $OLD_FOLDER

# Move existing files to old folder (but not if they're already old backups)
for item in *; do
  if [[ "$item" != old_* ]] && [[ "$item" != "." ]] && [[ "$item" != ".." ]]; then
    mv "$item" "$OLD_FOLDER/" 2>/dev/null
  fi
done

echo "✅ Existing files backed up to $OLD_FOLDER"
ls -la $OLD_FOLDER
EOF

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
else
    echo "❌ Backup failed! Stopping deployment for safety."
    exit 1
fi

echo ""
echo "🔄 Step 2: Deploying new version..."

# Deploy the new files
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
      generated/ $STAGING_USER@$STAGING_HOST:$STAGING_PATH

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SAFE deployment successful!"
    echo ""
    echo "🌐 Your NEW staging site is live at:"
    echo "   https://staging.beseensignshop.com/"
    echo ""
    echo "🛡️  Your OLD site is backed up at:"
    echo "   https://staging.beseensignshop.com/old_[timestamp]/"
    echo ""
    echo "🧪 Test these key pages:"
    echo "   • Main page: https://staging.beseensignshop.com/"
    echo "   • Services: https://staging.beseensignshop.com/services.html"
    echo "   • Real Estate: https://staging.beseensignshop.com/services/real-estate/"
    echo "   • Shopping Cart: https://staging.beseensignshop.com/shopping-cart.html"
    echo ""
    echo "💡 If anything goes wrong, you can:"
    echo "   • Access your old site backup"
    echo "   • Restore files if needed"
    echo "   • Everything is safely preserved!"
else
    echo "❌ Deployment failed!"
    echo "But don't worry - your existing site is safely backed up."
    echo "Check your credentials and try again."
fi 