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

# FTP Configuration (matches your main site - getbeseen.com on Bluehost)
# Optional: set these in production stuff/.env (FTP_HOST, FTP_USER, FTP_PATH) so you don't commit credentials
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
if [ -f "$SCRIPT_DIR/../.env" ]; then
  set -a
  source "$SCRIPT_DIR/../.env"
  set +a
fi
FTP_HOST="${FTP_HOST:-ftp.getbeseen.com}"
FTP_USER="${FTP_USER:-behzaad.morid@gmail.com}"
FTP_PATH="${FTP_PATH:-/public_html/getbeseem}"

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
if [ -z "$FTP_PASS" ]; then
  echo "You'll be prompted for your FTP password."
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp not found. Install with: brew install lftp"
    exit 1
fi

# Navigate to project root (parent of production stuff)
cd "$PROJECT_ROOT"

# Upload using lftp with exclusions
if [ -n "$FTP_PASS" ]; then
  lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" << EOF
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
else
  lftp -u "$FTP_USER" "$FTP_HOST" << EOF
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
fi

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

