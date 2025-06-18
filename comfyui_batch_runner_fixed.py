import os
import json
import requests

# Set the local path to all pipeline files
PIPELINE_DIR = './pipelines'
# ComfyUI Web API endpoint
COMFYUI_API = 'http://127.0.0.1:8188/prompt'

def convert_custom_to_comfyui_format(custom_pipeline):
    """Convert custom pipeline format to ComfyUI workflow format"""
    # For now, let's create a simple text-to-image workflow
    # Since your pipelines are for product photography, we'll use a basic workflow
    
    # Extract the prompt from your custom format
    prompt_text = "Professional product photography, high quality, studio lighting, white background"
    
    # Find the prompt in the custom pipeline
    for node in custom_pipeline.get('nodes', []):
        if node.get('type') == 'PromptGenerator':
            prompt_text = node.get('data', {}).get('prompt', prompt_text)
            break
    
    # Create a basic ComfyUI workflow with CORRECT connections
    workflow = {
        "prompt": {
            "1": {
                "inputs": {
                    "text": prompt_text,
                    "clip": ["4", 1]  # FIXED: Use CLIP output (index 1) from CheckpointLoaderSimple
                },
                "class_type": "CLIPTextEncode"
            },
            "2": {
                "inputs": {
                    "text": "blurry, low quality, dark background",
                    "clip": ["4", 1]  # FIXED: Use CLIP output (index 1) from CheckpointLoaderSimple
                },
                "class_type": "CLIPTextEncode"
            },
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": 20,
                    "cfg": 7.0,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["4", 0],  # MODEL output (index 0) from CheckpointLoaderSimple
                    "positive": ["1", 0],
                    "negative": ["2", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": "sd_xl_base_1.0.safetensors"
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
                    "vae": ["4", 2]  # VAE output (index 2) from CheckpointLoaderSimple
                },
                "class_type": "VAEDecode"
            },
            "7": {
                "inputs": {
                    "filename_prefix": "ComfyUI",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage"
            }
        }
    }
    
    return workflow

def run_pipeline(file_path):
    """Load custom pipeline and convert to ComfyUI format"""
    try:
        with open(file_path, 'r') as f:
            custom_pipeline = json.load(f)
        
        # Convert to ComfyUI format
        comfyui_workflow = convert_custom_to_comfyui_format(custom_pipeline)
        
        # Send to ComfyUI API
        response = requests.post(COMFYUI_API, json=comfyui_workflow)
        
        if response.status_code == 200:
            print(f"✅ Successfully ran pipeline: {os.path.basename(file_path)}")
            return True
        else:
            print(f"❌ Failed to run {file_path} - Status: {response.status_code}")
            if response.text:
                print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return False

def main():
    success_count = 0
    total_count = 0
    
    for root, _, files in os.walk(PIPELINE_DIR):
        for filename in files:
            if filename.endswith('.json'):
                total_count += 1
                file_path = os.path.join(root, filename)
                if run_pipeline(file_path):
                    success_count += 1
    
    print(f"\n📊 Summary: {success_count}/{total_count} pipelines ran successfully")

if __name__ == "__main__":
    main() 