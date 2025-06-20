import os
import json
import requests

# Set the local path to all pipeline files
PIPELINE_DIR = './pipelines'
# ComfyUI Web API endpoint
COMFYUI_API = 'http://127.0.0.1:8188/prompt'

def get_available_models():
    """Get list of available models from ComfyUI"""
    try:
        response = requests.get('http://127.0.0.1:8188/object_info')
        if response.status_code == 200:
            data = response.json()
            models = data.get('CheckpointLoaderSimple', {}).get('input', {}).get('required', {}).get('ckpt_name', [[]])[0]
            return models
        return []
    except:
        return []

def convert_custom_to_comfyui_format(custom_pipeline, model_name):
    """Convert custom pipeline format to ComfyUI workflow format"""
    # Extract the prompt from your custom format
    prompt_text = "Professional product photography, high quality, studio lighting, white background"
    
    # Find the prompt in the custom pipeline
    for node in custom_pipeline.get('nodes', []):
        if node.get('type') == 'PromptGenerator':
            prompt_text = node.get('data', {}).get('prompt', prompt_text)
            break
    
    # Adjust settings based on model type
    if 'turbo' in model_name.lower():
        steps = 4  # Turbo models need fewer steps
        cfg = 1.0  # Lower CFG for turbo
    else:
        steps = 20
        cfg = 7.0
    
    # Create a basic ComfyUI workflow with CORRECT connections
    workflow = {
        "prompt": {
            "1": {
                "inputs": {
                    "text": prompt_text,
                    "clip": ["4", 1]  # CLIP output from CheckpointLoaderSimple
                },
                "class_type": "CLIPTextEncode"
            },
            "2": {
                "inputs": {
                    "text": "blurry, low quality, dark background",
                    "clip": ["4", 1]  # CLIP output from CheckpointLoaderSimple
                },
                "class_type": "CLIPTextEncode"
            },
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": steps,
                    "cfg": cfg,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["4", 0],  # MODEL output from CheckpointLoaderSimple
                    "positive": ["1", 0],
                    "negative": ["2", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": model_name
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": 1024,
                    "height": 1024,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            },
            "6": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]  # VAE output from CheckpointLoaderSimple
                },
                "class_type": "VAEDecode"
            },
            "7": {
                "inputs": {
                    "filename_prefix": f"product_{os.path.basename(os.path.dirname(custom_pipeline.get('file_path', 'unknown')))}",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage"
            }
        }
    }
    
    return workflow

def run_pipeline(file_path, model_name):
    """Load custom pipeline and convert to ComfyUI format"""
    try:
        with open(file_path, 'r') as f:
            custom_pipeline = json.load(f)
        
        # Add file path for naming
        custom_pipeline['file_path'] = file_path
        
        # Convert to ComfyUI format
        comfyui_workflow = convert_custom_to_comfyui_format(custom_pipeline, model_name)
        
        # Send to ComfyUI API
        response = requests.post(COMFYUI_API, json=comfyui_workflow)
        
        if response.status_code == 200:
            print(f"✅ Successfully ran pipeline: {os.path.basename(file_path)}")
            return True
        else:
            print(f"❌ Failed to run {file_path} - Status: {response.status_code}")
            if response.text:
                print(f"   Error: {response.text[:200]}...")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return False

def main():
    print("🔍 Checking available models...")
    models = get_available_models()
    
    if not models:
        print("❌ No models found! Please download a model first.")
        print("💡 Try: curl -L -o sd_turbo.safetensors 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/sd_turbo.safetensors'")
        return
    
    print(f"📋 Found {len(models)} model(s): {', '.join(models)}")
    
    # Use the first available model
    model_name = models[0]
    print(f"🎯 Using model: {model_name}")
    
    success_count = 0
    total_count = 0
    
    for root, _, files in os.walk(PIPELINE_DIR):
        for filename in files:
            if filename.endswith('.json'):
                total_count += 1
                file_path = os.path.join(root, filename)
                if run_pipeline(file_path, model_name):
                    success_count += 1
    
    print(f"\n📊 Summary: {success_count}/{total_count} pipelines ran successfully")
    print(f"🖼️  Generated images should be in: /Users/bez/Documents/ComfyUI/output/")

if __name__ == "__main__":
    main() 