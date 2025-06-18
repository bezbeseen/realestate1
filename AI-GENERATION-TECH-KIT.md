# ✅ AI PRODUCT IMAGE GENERATION TECH KIT

## 🧠 1. ComfyUI Pipeline Template (comfyui-workflow.json)
A modular ComfyUI workflow configured for:
- ✅ Realistic Vision V6 model for product photography
- ✅ Square format (1024x1024) with upscaling to 1200x1200
- ✅ White background enforcement
- ✅ Professional studio lighting setup
- ✅ Batch processing with {product} and {variant} placeholders
- ✅ Automatic file naming logic

**Features:**
- Positive prompt with product photography keywords
- Negative prompt to avoid text/watermarks
- DPM++ 2M Karras sampler for quality
- CFG Scale 7 for balanced creativity/adherence

## 📄 2. Prompt Template File (product-prompts.csv)
Complete CSV with all 115 product image prompts:
- ✅ 38 products with all variants
- ✅ Professional photography prompts for each
- ✅ Exact filenames for organization
- ✅ Real-world context (office, outdoor, events)

**Sample:**
```csv
product,variant,prompt,filename
business-cards,premium,"Professional product photography of premium business cards, 32pt thick cardstock with glossy UV coating...",business-cards_premium.jpg
```

## 🗂 3. Folder Structure Template (folder-structure.txt)
Organized directory structure:
```
/assets/images/products/
├── business-cards/
│   ├── business-cards_standard.jpg
│   ├── business-cards_premium.jpg
│   └── ...
├── banners/
├── yard-signs/
└── ... (38 folders total)
```

**Naming Convention:**
- Format: `{product}_{variant}.jpg`
- All lowercase with hyphens
- Consistent across entire project

## 🛠 4. Setup Guide (comfyui-setup-guide.md)
Complete instructions for:
- Installing ComfyUI locally
- Setting up Realistic Vision V6 model
- Batch processing with CSV
- Cloud deployment options
- Troubleshooting tips

## 🚀 5. Quick Start Commands

### Local Setup:
```bash
# Clone ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt

# Start ComfyUI
python main.py

# Load workflow and start generating!
```

### Cloud Options:
- **RunPod.io**: ~$1-2 for all 115 images
- **Vast.ai**: More control, similar pricing
- **Hugging Face Spaces**: For lightweight testing

## 📊 6. Production Stats
- **Total Images**: ~115
- **Categories**: 5 (Prints, Signs, Promotional, Materials, Real Estate)
- **Products**: 38
- **Estimated Time**: 1-2 hours on GPU
- **Estimated Cost**: $0.50-2.00 on cloud

## 🎯 7. Priority Batch Order
1. **Business Cards** (4 variants) - Most important
2. **Yard Signs** (3 variants)
3. **Banners** (4 variants)
4. **Retractable Banners** (4 variants)
5. All other products

## 💡 8. Pro Tips
- Generate test batch of 5-10 first
- Use ControlNet for consistency
- Keep same seed for variants
- Monitor every 20 images
- Save best generations as style references

## 📦 9. Deliverables
1. `comfyui-workflow.json` - Ready-to-use workflow
2. `product-prompts.csv` - All 115 prompts
3. `folder-structure.txt` - Organization guide
4. `comfyui-setup-guide.md` - Complete setup instructions
5. `AI-PHOTO-GENERATION-GUIDE.md` - Manual prompt reference

## ✨ 10. Next Steps
1. Install ComfyUI (or use cloud)
2. Load the workflow
3. Point to CSV file
4. Start batch generation
5. Organize outputs into folder structure
6. Update products.json with image paths

Ready to generate professional product photos at scale! 🚀 