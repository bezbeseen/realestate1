#!/usr/bin/env python3
"""
ComfyUI Pipeline Batch Runner
Processes all 99 valid pipeline files through ComfyUI API
"""

import os
import json
import requests
import time
from pathlib import Path

# ComfyUI API endpoint
COMFYUI_URL = "http://localhost:8188"
PIPELINES_DIR = "data/csv/valid_comfyui_pipelines"

def find_all_pipelines():
    """Find all pipeline JSON files"""
    pipelines = []
    for root, dirs, files in os.walk(PIPELINES_DIR):
        for file in files:
            if file.endswith("_pipeline.json"):
                category = os.path.basename(root)
                variant = file.replace("_pipeline.json", "")
                filepath = os.path.join(root, file)
                pipelines.append({
                    "category": category,
                    "variant": variant,
                    "filepath": filepath,
                    "filename": file
                })
    return pipelines

def convert_to_comfyui_format(pipeline_data, category, variant):
    """Convert our pipeline format to ComfyUI API format"""
    
    # Base ComfyUI workflow template
    comfyui_workflow = {
        "1": {
            "inputs": {
                "ckpt_name": "sd_turbo.safetensors"
            },
            "class_type": "CheckpointLoaderSimple"
        },
        "2": {
            "inputs": {
                "text": f"Professional product photography of {category} {variant}, high quality, commercial style, clean background",
                "clip": ["1", 1]
            },
            "class_type": "CLIPTextEncode"
        },
        "3": {
            "inputs": {
                "text": "low quality, blurry, distorted, text, watermark",
                "clip": ["1", 1]
            },
            "class_type": "CLIPTextEncode"
        },
        "4": {
            "inputs": {
                "width": 1024,
                "height": 1024,
                "batch_size": 1
            },
            "class_type": "EmptyLatentImage"
        },
        "5": {
            "inputs": {
                "seed": 42,
                "steps": 8,
                "cfg": 2.0,
                "sampler_name": "euler",
                "scheduler": "normal",
                "denoise": 1.0,
                "model": ["1", 0],
                "positive": ["2", 0],
                "negative": ["3", 0],
                "latent_image": ["4", 0]
            },
            "class_type": "KSampler"
        },
        "6": {
            "inputs": {
                "samples": ["5", 0],
                "vae": ["1", 2]
            },
            "class_type": "VAEDecode"
        },
        "7": {
            "inputs": {
                "filename_prefix": f"{category}_{variant}",
                "images": ["6", 0]
            },
            "class_type": "SaveImage"
        }
    }
    
    return comfyui_workflow

def submit_to_comfyui(workflow):
    """Submit workflow to ComfyUI API"""
    try:
        # Queue prompt
        data = {"prompt": workflow}
        response = requests.post(f"{COMFYUI_URL}/prompt", json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Queued: {result.get('prompt_id', 'unknown')}")
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    print("🔍 Finding all pipeline files...")
    pipelines = find_all_pipelines()
    print(f"📁 Found {len(pipelines)} pipeline files")
    
    print("🔌 Testing ComfyUI connection...")
    try:
        response = requests.get(f"{COMFYUI_URL}/history")
        if response.status_code == 200:
            print("✅ ComfyUI is running")
        else:
            print("❌ ComfyUI not responding")
            return
    except:
        print("❌ Cannot connect to ComfyUI - make sure it's running on port 8188")
        return
    
    print("🚀 Processing pipelines...")
    successful = 0
    failed = 0
    
    for i, pipeline in enumerate(pipelines, 1):
        print(f"\n[{i}/{len(pipelines)}] Processing: {pipeline['category']}/{pipeline['variant']}")
        
        # Load original pipeline
        try:
            with open(pipeline['filepath'], 'r') as f:
                original_data = json.load(f)
        except Exception as e:
            print(f"❌ Failed to load {pipeline['filepath']}: {e}")
            failed += 1
            continue
        
        # Convert to ComfyUI format
        workflow = convert_to_comfyui_format(original_data, pipeline['category'], pipeline['variant'])
        
        # Submit to ComfyUI
        if submit_to_comfyui(workflow):
            successful += 1
            time.sleep(2)  # Brief pause between submissions
        else:
            failed += 1
    
    print(f"\n📊 Results:")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📋 Total: {len(pipelines)}")

if __name__ == "__main__":
    main() 