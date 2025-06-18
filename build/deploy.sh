#!/bin/bash

# BeSeen Website Deployment Script
# Replace the variables below with your actual server details

# ===========================================
# CONFIGURE THESE SETTINGS FOR YOUR SERVER
# ===========================================

# Your server details (CHANGE THESE!)
SERVER_HOST="your-server.com"           # e.g., "ftp.getbeseen.com" or IP address
SERVER_USER="your-username"             # Your FTP/SSH username
SERVER_PATH="/public_html/"             # Path on server (usually /public_html/ or /www/)

# Local project path (usually current directory)
LOCAL_PATH="."

# ===========================================
# DEPLOYMENT OPTIONS - CHOOSE ONE METHOD
# ===========================================

echo "🚀 BeSeen Website Deployment Tool"
echo "=================================="
echo ""
echo "Choose deployment method:"
echo "1) RSYNC (recommended - fast, only uploads changed files)"
echo "2) SCP (simple - uploads everything)"
echo "3) Test connection only"
echo ""
read -p "Enter choice (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🔄 Using RSYNC - Syncing files..."
        echo "This will only upload files that have changed."
        echo ""
        
        # RSYNC method (recommended)
        rsync -avz --progress \
              --exclude '.git/' \
              --exclude '.DS_Store' \
              --exclude 'node_modules/' \
              --exclude '*.log' \
              --exclude 'deploy.sh' \
              $LOCAL_PATH/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH
        
        echo ""
        echo "✅ RSYNC deployment complete!"
        ;;
        
    2)
        echo ""
        echo "📁 Using SCP - Uploading all files..."
        echo "This will upload the entire project."
        echo ""
        
        # SCP method (uploads everything)
        scp -r \
            -o StrictHostKeyChecking=no \
            $LOCAL_PATH/* $SERVER_USER@$SERVER_HOST:$SERVER_PATH
        
        echo ""
        echo "✅ SCP deployment complete!"
        ;;
        
    3)
        echo ""
        echo "🔍 Testing connection to server..."
        
        # Test SSH connection
        ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo 'Connection successful! 🎉'"
        
        if [ $? -eq 0 ]; then
            echo "✅ Connection test passed!"
        else
            echo "❌ Connection failed. Check your settings."
        fi
        ;;
        
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🌐 If successful, your site should be live at:"
echo "   https://your-domain.com"
echo ""
echo "💡 Tips:"
echo "   - Test the analytics debug panel with ?debug=analytics"
echo "   - Check browser console for any errors"
echo "   - Verify all analytics files loaded correctly"
echo ""

# ===========================================
# TROUBLESHOOTING SECTION
# ===========================================

echo "🔧 Having issues? Try these:"
echo ""
echo "Connection Problems:"
echo "  • Check username/password"
echo "  • Verify server hostname"
echo "  • Try port 22 (SSH) or 21 (FTP)"
echo ""
echo "Permission Problems:"
echo "  • Make sure you have write access to the server path"
echo "  • Check if the path exists: $SERVER_PATH"
echo ""
echo "File Problems:"
echo "  • Ensure all analytics files are in place:"
echo "    - assets/js/analytics-tracker.js"
echo "    - assets/js/enhanced-analytics.js"
echo "    - includes_new/analytics-loader.html"
echo ""

# Check if analytics files exist locally
echo "📊 Checking analytics files locally..."
if [ -f "assets/js/analytics-tracker.js" ]; then
    echo "✅ analytics-tracker.js found"
else
    echo "❌ analytics-tracker.js missing!"
fi

if [ -f "assets/js/enhanced-analytics.js" ]; then
    echo "✅ enhanced-analytics.js found"  
else
    echo "❌ enhanced-analytics.js missing!"
fi

if [ -f "includes_new/analytics-loader.html" ]; then
    echo "✅ analytics-loader.html found"
else
    echo "❌ analytics-loader.html missing!"
fi

echo ""
echo "📝 Remember to update your pages to include:"
echo '   <div w3-include-html="includes_new/analytics-loader.html"></div>'
echo ""
echo "Done! 🎯" 