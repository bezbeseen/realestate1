#!/bin/bash

# BeSeen Quick FTP Upload (HTML & Code Only - NO ASSETS)
# Perfect for analytics updates and content changes

echo "⚡ BeSeen Quick Upload (No Assets)"
echo "===================================="
echo ""
echo "📌 This script uploads:"
echo "   ✓ All HTML files"
echo "   ✓ includes/ (analytics, headers)"
echo "   ✓ data/ (JSON/CSV)"
echo "   ✓ robots.txt, sitemap.xml"
echo ""
echo "📌 This script SKIPS:"
echo "   ✗ assets/ folder (images, CSS, JS)"
echo ""

# FTP Configuration (matches your main site)
FTP_HOST="ftp.getbeseen.com"
FTP_USER="your-ftp-username"  # UPDATE THIS!
FTP_PATH="/public_html/"

echo "🎯 Upload Target:"
echo "   Host: $FTP_HOST"
echo "   User: $FTP_USER"
echo "   Path: $FTP_PATH"
echo "   URL: https://getbeseen.com/"
echo ""

read -p "Continue with quick upload? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "Upload cancelled."
    exit 0
fi

echo ""
echo "🔄 Uploading via FTP (excluding assets)..."
echo "You'll be prompted for your FTP password..."

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp not found. Installing with Homebrew..."
    brew install lftp
fi

# Navigate to project root
cd "$(dirname "$0")/../.."

# Upload using lftp with exclusions
lftp -u $FTP_USER $FTP_HOST << EOF
cd $FTP_PATH
mirror -R --verbose \
  --exclude assets/ \
  --exclude node_modules/ \
  --exclude .git/ \
  --exclude .DS_Store \
  --exclude '*.log' \
  generated/ ./
quit
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Quick upload successful!"
    echo ""
    echo "🌐 Your site should now have:"
    echo "   ✓ Updated analytics (Clarity: t4cugujh39)"
    echo "   ✓ All HTML content"
    echo "   ✓ Updated includes & data"
    echo ""
    echo "⏱️  Time saved: ~90% faster (no assets uploaded)"
    echo ""
    echo "🧪 Test the Clarity fix:"
    echo "   • Visit: https://getbeseen.com/"
    echo "   • Open Console (F12)"
    echo "   • Look for: '👁️ Microsoft Clarity loaded: t4cugujh39'"
    echo "   • Should NOT see: s1g9ngbmhd or lkihe2qcle"
else
    echo "❌ Upload failed!"
    echo ""
    echo "Troubleshooting:"
    echo "   1. Check your FTP username/password"
    echo "   2. Verify FTP_HOST and FTP_PATH are correct"
    echo "   3. Or use Cyberduck to manually upload:"
    echo "      - Upload all files/folders from: generated/"
    echo "      - EXCEPT: the assets/ folder"
fi

