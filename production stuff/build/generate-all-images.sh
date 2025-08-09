#!/bin/bash

# Enhanced Image Generation Script for BE SEEN Products
# Usage: ./generate-all-images.sh

echo "🎨 BE SEEN - Enhanced Image Generation"
echo "======================================"

# Check if API key is set
if [ -z "$FREEPIK_API_KEY" ]; then
    echo "❌ Error: FREEPIK_API_KEY not set"
    echo "💡 Please set your API key first:"
    echo "   export FREEPIK_API_KEY=your_actual_api_key"
    exit 1
fi

# Products to generate images for (in priority order)
PRODUCTS=(
    "stickers"
    "flyers" 
    "business-cards"
    "banners"
    "posters"
    "decals"
    "flags"
    "yard-signs"
    "retractable-banners"
)

echo "📋 Products to process: ${#PRODUCTS[@]}"
echo "⏰ Estimated time: ~30-60 minutes (depending on API speed)"
echo ""

# Ask for confirmation
read -p "🚀 Start image generation? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Process each product
for product in "${PRODUCTS[@]}"; do
    echo ""
    echo "🎯 Processing: $product"
    echo "----------------------------------------"
    
    # Check if CSV exists
    if [ ! -f "data/csv/$product.csv" ]; then
        echo "⚠️  Skipping $product - CSV file not found"
        continue
    fi
    
    # Generate images
    node generate-enhanced-images.js "$product"
    
    if [ $? -eq 0 ]; then
        echo "✅ Completed: $product"
    else
        echo "❌ Failed: $product"
    fi
    
    echo "⏸️  Cooling down for 30 seconds..."
    sleep 30
done

echo ""
echo "🎉 Image generation complete!"
echo "📁 Check: assets/images/products/"
echo "💡 Update your CSVs to use the new local image paths" 