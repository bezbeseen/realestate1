#!/bin/bash

# Global Phone Number Changer for GetBeSeen
# Usage: ./change-phone-number.sh "NEW_PHONE_NUMBER"

echo "📞 GetBeSeen Global Phone Number Changer"
echo "========================================"
echo ""

# Check if new phone number provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide the new phone number"
    echo ""
    echo "Usage:"
    echo "   ./change-phone-number.sh \"(555) 123-4567\""
    echo "   ./change-phone-number.sh \"555-123-4567\""
    echo "   ./change-phone-number.sh \"5551234567\""
    echo ""
    exit 1
fi

NEW_PHONE="$1"
OLD_PHONE="(669) 273-1583"
OLD_PHONE_CLEAN="6692731583"

echo "📋 Current phone number: $OLD_PHONE"
echo "📋 New phone number: $NEW_PHONE"
echo ""

# Confirm before proceeding
read -p "⚠️  This will change the phone number in ALL files. Continue? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Phone number change cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting global phone number replacement..."
echo ""

# Count current occurrences
OLD_COUNT=$(grep -r "$OLD_PHONE" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | wc -l | tr -d ' ')
echo "📍 Found $OLD_COUNT occurrences of current phone number"
echo ""

# Backup first
echo "💾 Creating backup..."
BACKUP_DIR="phone-change-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "production stuff" "$BACKUP_DIR/"
echo "✅ Backup created: $BACKUP_DIR/"
echo ""

# Replace in production stuff directory
echo "🔄 Replacing phone numbers in production files..."

# Replace formatted phone numbers (669) 273-1583
find "production stuff" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.php" \) -exec sed -i '' "s/(669) 273-1583/$NEW_PHONE/g" {} \;

# Replace tel: links tel:(669)273-1583
find "production stuff" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.php" \) -exec sed -i '' "s/tel:(669)273-1583/tel:$(echo $NEW_PHONE | tr -d ' ()-' | sed 's/\([0-9]\{3\}\)\([0-9]\{3\}\)\([0-9]\{4\}\)/\1\2\3/')/g" {} \;

# Replace clean numbers 6692731583
find "production stuff" -type f \( -name "*.html" -o -name "*.json" -o -name "*.js" -o -name "*.php" \) -exec sed -i '' "s/6692731583/$(echo $NEW_PHONE | tr -d ' ()-' | sed 's/\([0-9]\{3\}\)\([0-9]\{3\}\)\([0-9]\{4\}\)/\1\2\3/')/g" {} \;

# Replace in templates specifically
echo "🔄 Updating template files..."
find "production stuff/templates" -type f -name "*.html" -exec sed -i '' "s/(669) 273-1583/$NEW_PHONE/g" {} \;
find "production stuff/templates" -type f -name "*.html" -exec sed -i '' "s/(669)273-1583/$NEW_PHONE/g" {} \;

# Replace in includes
echo "🔄 Updating include files..."
find "production stuff/includes" -type f -name "*.html" -exec sed -i '' "s/(669) 273-1583/$NEW_PHONE/g" {} \;
find "production stuff/includes" -type f -name "*.html" -exec sed -i '' "s/(669)273-1583/$NEW_PHONE/g" {} \;

# Replace in data files
echo "🔄 Updating data files..."
find "production stuff/data" -type f -name "*.json" -exec sed -i '' "s/(669) 273-1583/$NEW_PHONE/g" {} \;
find "production stuff/data" -type f -name "*.json" -exec sed -i '' "s/(669)273-1583/$NEW_PHONE/g" {} \;

echo ""
echo "✅ Phone number replacement complete!"
echo ""

# Count new occurrences
NEW_COUNT=$(grep -r "$NEW_PHONE" "production stuff" 2>/dev/null | wc -l | tr -d ' ')
echo "📍 New phone number appears $NEW_COUNT times in production files"
echo ""

# Check for any remaining old numbers
REMAINING=$(grep -r "$OLD_PHONE" "production stuff" 2>/dev/null | wc -l | tr -d ' ')
if [ "$REMAINING" -gt 0 ]; then
    echo "⚠️  Warning: $REMAINING occurrences of old phone number still found"
    echo "   These might be in comments or special formats"
    grep -r "$OLD_PHONE" "production stuff" 2>/dev/null | head -5
    echo ""
fi

echo "🎯 Next steps:"
echo "   1. Review the changes: git diff"
echo "   2. Test locally: npm run build"
echo "   3. Upload changes: ./deploy-no-assets.sh"
echo ""
echo "📁 Backup location: $BACKUP_DIR/"
echo ""
echo "✅ Global phone number change completed!"
