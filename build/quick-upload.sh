#!/bin/bash

# BeSeen Analytics Quick Upload Script
# Usage: ./quick-upload.sh

echo "🚀 BeSeen Analytics Upload Tool"
echo "================================"

# FTP Settings (EDIT THESE!)
FTP_HOST="beseensignshop.com"
FTP_USER="beseenshop@shop.getbeseen.com"
FTP_PASS="S0mething!!"
REMOTE_DIR="/home1/bezdesig/public_html/shopbeseen"

echo "📁 Uploading analytics files..."

# Create FTP command file
cat > ftp_commands.txt << EOF
open $FTP_HOST
user $FTP_USER $FTP_PASS
binary
cd $REMOTE_DIR
mkdir assets
cd assets
mkdir js
cd js
put assets/js/analytics-tracker.js
put assets/js/enhanced-analytics.js
cd ../..
mkdir includes_new
cd includes_new
put includes_new/analytics-loader.html
put includes_new/header-with-analytics.html
put includes_new/header.html
cd ..
put index-with-analytics.html
put test-upload.txt
quit
EOF

# Run FTP upload
echo "⬆️  Starting upload..."
ftp -n < ftp_commands.txt

# Cleanup
rm ftp_commands.txt

echo "✅ Upload complete!"
echo "🌐 Check your website to see the analytics working!" 