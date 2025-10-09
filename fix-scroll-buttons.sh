#!/bin/bash

# Fix scroll-to-top button accessibility across all templates
# This removes dead clicks from href="#" and adds proper accessibility

echo "🔧 Fixing scroll-to-top button accessibility..."
echo ""

# Find and fix all scroll-to-top buttons in templates
find "production stuff/templates" -name "*.html" -exec sed -i '' 's/href="#" id="scroll"/href="#thetop" id="scroll" title="Back to top" aria-label="Back to top"/g' {} \;

echo "✅ Fixed scroll-to-top buttons in all templates"
echo ""

# Count how many were fixed
FIXED_COUNT=$(grep -r 'href="#thetop" id="scroll"' "production stuff/templates" | wc -l | tr -d ' ')
echo "📍 Updated $FIXED_COUNT scroll-to-top buttons"
echo ""

echo "🎯 Changes made:"
echo "   • Changed href='#' to href='#thetop'"
echo "   • Added title='Back to top'"
echo "   • Added aria-label='Back to top'"
echo "   • Maintains JavaScript functionality"
echo ""

echo "✅ Scroll-to-top accessibility improvements complete!"
