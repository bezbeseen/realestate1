# ComfyUI Setup Guide for Product Image Generation

## 🚀 Quick Start

### 1. Install ComfyUI
```bash
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
```

### 2. Download Required Model
- **Recommended**: Realistic Vision V6.0 B1
- Download from: https://civitai.com/models/4201/realistic-vision-v60-b1
- Place in: `ComfyUI/models/checkpoints/`

### 3. Load the Workflow
1. Open ComfyUI: `python main.py`
2. Navigate to: http://127.0.0.1:8188
3. Load `comfyui-workflow.json`

### 4. Install Custom Nodes (for batch processing)
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/WASasquatch/was-node-suite-comfyui
git clone https://github.com/pythongosssss/ComfyUI-Custom-Scripts
```

## 📊 Batch Processing Setup

### Option 1: CSV Batch Loader (Recommended)
1. Install CSV loader node:
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/Suzie1/ComfyUI_Comfyroll_CustomNodes
```

2. Update workflow to use "CR Load CSV" node
3. Point to `product-prompts.csv`

### Option 2: Python Script Automation
```python
import json
import requests
import csv
import time

# Load prompts from CSV
with open('product-prompts.csv', 'r') as file:
    reader = csv.DictReader(file)
    prompts = list(reader)

# ComfyUI API endpoint
API_URL = "http://127.0.0.1:8188/prompt"

# Load workflow
with open('comfyui-workflow.json', 'r') as f:
    workflow = json.load(f)

# Process each prompt
for prompt_data in prompts:
    # Update prompt in workflow
    workflow["2"]["widgets_values"][0] = prompt_data['prompt']
    workflow["8"]["widgets_values"][0] = prompt_data['filename'].replace('.jpg', '')
    
    # Send to ComfyUI
    response = requests.post(API_URL, json={"prompt": workflow})
    print(f"Processing: {prompt_data['filename']}")
    
    # Wait between generations
    time.sleep(5)
```

## 🎨 Consistency Tips

### Using ControlNet for Style Consistency
1. Generate your first "hero" image for each category
2. Install ControlNet:
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/Fannovel16/comfyui_controlnet_aux
```

3. Use Canny or Depth ControlNet to maintain composition
4. Keep same seed for similar products

### Style Anchoring
- Use same checkpoint model throughout
- Keep CFG scale at 7
- Use same sampler (DPM++ 2M Karras)
- Maintain consistent negative prompts

## 🖼️ Output Settings

### Image Specifications
- **Resolution**: 1024x1024 (will be upscaled to 1200x1200)
- **Format**: JPEG
- **Quality**: 95%
- **Background**: Pure white (#FFFFFF)

### File Organization
```bash
# Create folder structure
mkdir -p assets/images/products/{business-cards,banners,yard-signs,etc}

# Move generated images
python organize_images.py
```

## 🔧 Advanced Workflow Features

### 1. Add Watermark Removal
- Add "VAE Encode" → "Inpaint" nodes for clean backgrounds

### 2. Auto White Background
- Add "Background Remover" node
- Composite on white canvas

### 3. Batch Variations
- Use "Seed Control" node
- Generate 3-5 variations per product
- Pick best one

## 💡 Pro Tips

### For Best Results:
1. **Test First**: Generate 5-10 test images, refine prompts
2. **Batch Similar**: Group similar products (all business cards, then all banners)
3. **Monitor Quality**: Check every 10-20 images
4. **Save Checkpoints**: Backup good generations

### Common Issues:
- **Text in images**: Add "no text, no watermarks" to negative prompt
- **Wrong aspect**: Ensure EmptyLatentImage is 1024x1024
- **Inconsistent style**: Use same seed for product variants
- **Slow generation**: Reduce batch size, use GPU

## 🌐 Cloud Deployment

### RunPod Setup (Recommended)
1. Create RunPod account
2. Deploy "ComfyUI" template
3. Upload workflow and CSV
4. Run batch processing
5. Download via SFTP

### Pricing Estimate:
- ~115 images × 30 seconds = ~1 hour GPU time
- Cost: ~$0.50-2.00 on RunPod

### Alternative: Vast.ai
- More control, slightly cheaper
- Manual setup required
- Good for large batches

## 📋 Checklist Before Starting

- [ ] ComfyUI installed and running
- [ ] Realistic Vision V6 model downloaded
- [ ] Workflow loaded successfully
- [ ] CSV file prepared with all prompts
- [ ] Output folders created
- [ ] Test generation successful
- [ ] Backup system in place

## 🎯 Quick Test

1. Load workflow
2. Set product to "business-cards"
3. Set variant to "standard"
4. Generate one image
5. Verify: Square format, white background, professional quality

Ready to generate all 115+ product images! 🚀 