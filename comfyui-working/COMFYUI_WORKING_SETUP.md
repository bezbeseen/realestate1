# ComfyUI Working Setup Documentation
*Created: January 2025*
*Status: ✅ WORKING*

## 🎯 Current Working State
- ComfyUI server is running and generating images successfully
- Web interface accessible at http://localhost:8188
- Generated test image: `business_cards_lowmem_00001_.png` 
- Generation time: ~135 seconds per image
- Image quality: Basic but functional

## 🖥️ Server Setup

### Start Command (WORKING)
```bash
cd /Users/bez/Documents/ComfyUI && source venv/bin/activate && python main.py --listen --port 8188 --cpu-vae --force-fp16
```

### System Info
- **OS**: macOS 15.5 (Darwin 24.5.0)
- **Python**: 3.12.11
- **PyTorch**: 2.2.2 (older version but working)
- **ComfyUI**: 0.3.41
- **Frontend**: 1.22.2
- **Device**: MPS (Apple Silicon GPU)
- **VRAM**: 32GB shared
- **Memory Mode**: SHARED

### Server Status Indicators
- ✅ **Good**: "Starting server" message appears
- ⚠️ **Warning but OK**: "address already in use" = server already running
- ⚠️ **Warning but OK**: API node import failures (doesn't affect core functionality)

## 📁 Key Files

### Working Files
- `comfyui-workflow-lowmem.json` - Main workflow file (✅ WORKING)
- `business_cards_lowmem_00001_.png` - Successfully generated image
- `/Users/bez/Documents/ComfyUI/output/` - Generated images location

### Workflow Structure
```json
{
  "nodes": [
    {"id": 1, "type": "CheckpointLoaderSimple"},
    {"id": 2, "type": "CLIPTextEncode"}, // Positive prompt
    {"id": 3, "type": "CLIPTextEncode"}, // Negative prompt  
    {"id": 4, "type": "EmptyLatentImage"},
    {"id": 5, "type": "KSampler"},
    {"id": 6, "type": "VAEDecode"},
    {"id": 8, "type": "SaveImage"}
  ]
}
```

## 🎨 Image Generation Process

### Method: Web Interface (✅ WORKING)
1. Open http://localhost:8188 in browser
2. Load workflow file (`comfyui-workflow-lowmem.json`)
3. Modify prompts in CLIPTextEncode nodes if needed
4. Click "Queue Prompt"
5. Wait ~135 seconds for generation
6. Image appears in interface and saves to output folder

### Current Prompts
- **Positive**: "Professional product photography of business cards, premium style, clean white background, commercial photography style, high resolution, sharp focus"
- **Negative**: "blurry, low quality, distorted, cropped, bad lighting, text, watermark"

## 🚨 Known Issues (Non-Breaking)
- PyTorch version warning (upgrade recommended but not required)
- API node import failures (doesn't affect core functionality)
- Server startup shows errors but still works

## 📂 File Organization

### Working Directory Structure
```
/Users/bez/Documents/GIT HTML/realestate1/
├── comfyui-workflow-lowmem.json ✅
├── comfyui-workflow-lowmem-BACKUP-20250619.json ✅ (backup)
├── assets/images/products/
│   └── business_cards_lowmem_00001_.png ✅
└── [various Python scripts - see status below]

/Users/bez/Documents/ComfyUI/
├── output/ ✅ (generated images)
├── venv/ ✅ (Python environment)
└── main.py ✅ (server startup)
```

### File Status Summary

#### ✅ Working Files
- `comfyui-workflow-lowmem.json` - Main workflow (WORKING)
- `comfyui-workflow-lowmem-BACKUP-20250619.json` - Backup
- `COMFYUI_WORKING_SETUP.md` - This documentation

#### 🔧 Modified/Fixed Files  
- `generate_and_deploy_images.py` - Fixed but web interface preferred
- `generate_and_deploy_images_fixed.py` - Alternative script

#### ❓ Status Unknown (Need Testing)
- `alternative_generation.py`
- `batch_generate_products.py` 
- `comfyui_batch_runner_fixed.py`
- `comfyui_batch_runner_smart.py`
- `run_all_pipelines.py`
- `test_simple_workflow.py`
- `test_single_workflow.py`

#### 📚 Documentation Files
- `AI-GENERATION-TECH-KIT.md`
- `AI-PHOTO-GENERATION-GUIDE.md`
- `comfyui-setup-guide.md`
- Various other guides

#### 🗂️ Configuration Files
- `comfyui-workflow.json` - Alternative workflow
- `simple_test_workflow.json` - Test workflow
- `test_workflow.json` - Test workflow

## ⚡ Quick Start Commands

### Check if server is running
```bash
curl -s http://localhost:8188/system_stats
```

### Open web interface
```bash
open http://localhost:8188
```

### Start server (if not running)
```bash
cd /Users/bez/Documents/ComfyUI && source venv/bin/activate && python main.py --listen --port 8188 --cpu-vae --force-fp16
```

## 🎯 Next Steps (When Ready)
1. Improve prompts for better image quality
2. Test different product types
3. Automate image deployment to website
4. Clean up non-working scripts

---
**⚠️ IMPORTANT**: This setup is working! Don't change anything without backing up first. 