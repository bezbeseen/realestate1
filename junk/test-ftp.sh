#!/bin/bash

# FTP Connection Tester
# This helps you figure out your FTP settings safely

echo "🔍 FTP Connection Tester"
echo "========================"
echo ""

echo "Let's test your FTP connection step by step..."
echo ""

# Get connection details
read -p "🌐 FTP Host (e.g., ftp.getbeseen.com or getbeseen.com): " FTP_HOST
read -p "👤 Username: " FTP_USER
echo ""

echo "🧪 Testing connection to $FTP_HOST..."
echo ""

# Test 1: Basic connection test
echo "Test 1: Basic connectivity..."
ping -c 3 $FTP_HOST

if [ $? -eq 0 ]; then
    echo "✅ Host is reachable!"
else
    echo "❌ Host not reachable. Try:"
    echo "   - ftp.getbeseen.com"
    echo "   - getbeseen.com" 
    echo "   - Ask your host for the FTP server address"
    exit 1
fi

echo ""
echo "Test 2: FTP connection..."

# Test FTP connection (will prompt for password)
ftp -n $FTP_HOST << EOF
user $FTP_USER
quit
EOF

echo ""
echo "Test 3: SSH/SFTP connection (if FTP didn't work)..."
echo "This might be more secure and common nowadays..."

ssh -o ConnectTimeout=10 $FTP_USER@$FTP_HOST "echo 'SSH connection works!'"

if [ $? -eq 0 ]; then
    echo "✅ SSH/SFTP works! Use this for deployment."
    echo ""
    echo "📝 Your settings for deploy-staging.sh:"
    echo "STAGING_HOST=\"$FTP_HOST\""
    echo "STAGING_USER=\"$FTP_USER\""
    echo "STAGING_PATH=\"/public_html/staging/\"  # or /public_html/ for main site"
else
    echo ""
    echo "🤔 If both failed, you might need:"
    echo "   • Different host address"
    echo "   • Different port (try 22 for SSH, 21 for FTP)"
    echo "   • Check with your hosting provider"
fi

echo ""
echo "💡 Common hosting FTP patterns:"
echo "   • GoDaddy: ftp.yoursite.com"
echo "   • Bluehost: yoursite.com or ftp.yoursite.com"
echo "   • SiteGround: yoursite.com"
echo "   • HostGator: gator####.hostgator.com"
echo ""
echo "🔐 If you're still stuck:"
echo "   1. Check your hosting welcome email"
echo "   2. Login to your hosting control panel"
echo "   3. Contact your hosting support" 