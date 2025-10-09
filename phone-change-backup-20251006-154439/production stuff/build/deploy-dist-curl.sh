#!/bin/bash

# BeSeen Dist Folder Upload Script (using curl)
# Uploads the entire dist folder to your Bluehost server

echo "🚀 BeSeen Dist Folder Upload (curl version)"
echo "============================================"

# Server Details
FTP_HOST="beseensignshop.com"
FTP_USER="beseenshop@shop.getbeseen.com"
REMOTE_DIR="/home1/bezdesig/public_html/shopbeseen"

# Ask for password
echo "🔐 Enter your FTP password:"
read -s FTP_PASS

echo "📁 Preparing to upload dist folder..."

# Verify dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found!"
    echo "Please make sure you're running this from the project root directory."
    exit 1
fi

echo "📦 Starting upload to $FTP_HOST..."
echo "This may take a few minutes depending on file sizes..."

# Function to upload a file
upload_file() {
    local file="$1"
    local remote_path="$2"
    
    echo "Uploading: $file -> $remote_path"
    curl -T "$file" "ftp://$FTP_HOST$remote_path" --user "$FTP_USER:$FTP_PASS" --ftp-create-dirs
}

# Function to upload directory recursively
upload_directory() {
    local local_dir="$1"
    local remote_dir="$2"
    
    for item in "$local_dir"/*; do
        if [ -f "$item" ]; then
            filename=$(basename "$item")
            upload_file "$item" "$remote_dir/$filename"
        elif [ -d "$item" ]; then
            dirname=$(basename "$item")
            upload_directory "$item" "$remote_dir/$dirname"
        fi
    done
}

# Start upload
cd dist

# Upload all files in dist root
for file in *.html; do
    if [ -f "$file" ]; then
        upload_file "$file" "$REMOTE_DIR/$file"
    fi
done

# Upload directories
for dir in */; do
    if [ -d "$dir" ]; then
        dirname=$(basename "$dir")
        echo "📁 Uploading directory: $dirname"
        upload_directory "$dir" "$REMOTE_DIR/$dirname"
    fi
done

# Check if upload was successful
if [ $? -eq 0 ]; then
    echo "✅ Upload completed successfully!"
    echo ""
    echo "🌐 Your website should now be updated at:"
    echo "   https://beseensignshop.com"
    echo ""
    echo "🧪 Test your analytics with:"
    echo "   https://beseensignshop.com/?debug=analytics"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Visit your website to verify everything looks correct"
    echo "   2. Test the analytics debug panel (Ctrl+Alt+A)"
    echo "   3. Check that all navigation links work properly"
else
    echo "❌ Upload failed!"
    echo "Please check your FTP credentials and try again."
fi

cd ..

echo ""
echo "📊 Analytics files that should be active:"
echo "   ✓ Enhanced analytics tracking"
echo "   ✓ Lead scoring system"  
echo "   ✓ Mobile interaction tracking"
echo "   ✓ Business-specific event tracking"
echo ""
echo "Done! 🎯" 