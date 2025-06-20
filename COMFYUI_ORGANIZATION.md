# ComfyUI File Organization
*Organized on: June 19, 2025*

## 📁 Folder Structure

### ✅ `comfyui-working/` 
**Contains ONLY confirmed working files**
- `comfyui-workflow-lowmem.json` - Main working workflow
- `comfyui-workflow-lowmem-BACKUP-20250619.json` - Backup
- `COMFYUI_WORKING_SETUP.md` - Complete documentation
- `README.md` - Usage instructions

### 🗃️ `comfyui-archive/`
**Contains non-working, untested, or experimental files**
- Python scripts with issues
- Alternative workflows (untested)
- Experimental and Colab-related files
- Test scripts
- `README.md` - Archive documentation

## 🎯 Quick Start

### To Generate Images:
1. Use files from `comfyui-working/` folder only
2. Follow instructions in `comfyui-working/README.md`
3. Start server: `cd /Users/bez/Documents/ComfyUI && source venv/bin/activate && python main.py --listen --port 8188 --cpu-vae --force-fp16`
4. Open: http://localhost:8188
5. Load: `comfyui-working/comfyui-workflow-lowmem.json`

### To Experiment:
1. Copy (don't move) files from `comfyui-archive/` to test
2. If they work, move to `comfyui-working/`
3. If they don't work, leave in archive

## 🔒 Safety Rules:
- **NEVER modify** files in `comfyui-working/` without backing up first
- **ALWAYS test** archived files in a safe environment
- **DOCUMENT** any new working files before adding to working folder

---
*This organization protects your working setup while keeping experimental files accessible.*