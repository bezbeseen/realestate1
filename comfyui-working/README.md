# ComfyUI Working Files
*Status: ✅ CONFIRMED WORKING*

## Files in this folder:

### 🎯 Main Workflow
- `comfyui-workflow-lowmem.json` - **WORKING** workflow file
- `comfyui-workflow-lowmem-BACKUP-20250619.json` - Backup of working workflow

### 📚 Documentation  
- `COMFYUI_WORKING_SETUP.md` - Complete setup documentation
- `README.md` - This file

## How to Use:

1. **Start ComfyUI Server:**
   ```bash
   cd /Users/bez/Documents/ComfyUI && source venv/bin/activate && python main.py --listen --port 8188 --cpu-vae --force-fp16
   ```

2. **Open Web Interface:**
   ```bash
   open http://localhost:8188
   ```

3. **Load Workflow:**
   - Drag and drop `comfyui-workflow-lowmem.json` into the web interface
   - Or use Load button in the interface

4. **Generate Images:**
   - Modify prompts if needed
   - Click "Queue Prompt"
   - Wait ~135 seconds for generation

## ⚠️ Important:
- **DO NOT MODIFY** files in this folder without backing up first
- These files are confirmed working as of June 19, 2025
- See `COMFYUI_WORKING_SETUP.md` for complete documentation 