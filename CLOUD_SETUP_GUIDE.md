# ☁️ Cloud AI Image Generation Setup Guide

## 🚀 **Option 1: Google Colab (Recommended - Easiest)**

### **Step 1: Upload the Notebook**
1. Go to [Google Colab](https://colab.research.google.com/)
2. Click "Upload" and select `ComfyUI_Batch_Generator.ipynb`
3. **IMPORTANT**: Change runtime to GPU
   - Click `Runtime` → `Change runtime type` → `Hardware accelerator: GPU`

### **Step 2: Run the Cells**
1. **Run each cell in order** (click the ▶️ play button)
2. **First run takes ~5-10 minutes** (installing everything)
3. **Subsequent runs are much faster**

### **Step 3: Download Your Images**
1. **Images generate automatically**
2. **ZIP file downloads at the end**
3. **Extract and upload to your website**

### **💰 Cost:**
- **Free tier**: 12+ hours/month (enough for 50-100 images)
- **Colab Pro**: $10/month (unlimited for 100s of images)

---

## 🔥 **Option 2: RunPod (Fastest Performance)**

### **Step 1: Create Account**
1. Go to [RunPod.io](https://runpod.io/)
2. Add $10-20 credit
3. Choose "Community Cloud" → "RTX 4090" pod

### **Step 2: Setup**
```bash
# Install ComfyUI
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt

# Download model
wget -O models/checkpoints/v1-5-pruned-emaonly-fp16.safetensors \
  https://huggingface.co/runwayml/stable-diffusion-v1-5/resolve/main/v1-5-pruned-emaonly.safetensors

# Start ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

### **Step 3: Use Your Scripts**
- Upload your `batch_generate_products.py`
- Run it like on your Mac, but **10x faster**

### **💰 Cost:**
- **RTX 4090**: ~$0.80/hour
- **100 images**: ~$5-10 total
- **Much faster**: 5-10 seconds per image

---

## 💡 **Option 3: Vast.ai (Cheapest)**

### **Similar to RunPod but:**
- **Cheaper**: $0.20-0.50/hour
- **Community GPUs**: Variable quality
- **Good for**: Large batches on budget

---

## 🎯 **Speed Comparison:**

| Platform | Speed per Image | 100 Images Cost | 100 Images Time |
|----------|----------------|------------------|-----------------|
| **Your Mac** | 135 seconds | Free | 3.75 hours |
| **Google Colab Free** | 15-30 seconds | Free | 45 minutes |
| **Google Colab Pro** | 10-20 seconds | $10/month | 30 minutes |
| **RunPod RTX 4090** | 5-10 seconds | ~$8 | 15 minutes |
| **Vast.ai** | 10-15 seconds | ~$3 | 25 minutes |

---

## 🚀 **Recommendation:**

### **For Testing (20-50 images):**
- Use **Google Colab Free** with the notebook I created

### **For Production (100+ images):**
- Use **Google Colab Pro** ($10/month) 
- Or **RunPod** for maximum speed

### **For Massive Batches (500+ images):**
- Use **RunPod** or **Vast.ai**
- Set up overnight batch processing

---

## 📁 **Getting Images to Your Website:**

1. **Download ZIP** from cloud platform
2. **Extract images** to your computer
3. **Upload to website**: Copy to `assets/images/products/`
4. **Update HTML**: Use the images in your product pages

**No more waiting hours on your Mac!** ⚡ 