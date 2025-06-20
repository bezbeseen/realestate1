#!/usr/bin/env python3
"""
ComfyUI Pipeline Batch Runner
Processes all 99 valid pipeline files through ComfyUI API
"""

import os
import json
import requests
import time
import pandas as pd
from pathlib import Path

# --- Configuration ---
# Get the directory where this script is located
SCRIPT_DIR = Path(__file__).parent.resolve()

COMFYUI_URL = "http://localhost:8188"
PROMPTS_CSV = SCRIPT_DIR / "product-prompts.csv"
PIPELINES_DIR = SCRIPT_DIR / "comfyui_pipeline_pack_v2/pipelines"
OUTPUT_DIR = SCRIPT_DIR / "generated/images/products"

def load_workflow_template(pipeline_name):
    """Loads a workflow template JSON file."""
    filepath = Path(PIPELINES_DIR) / f"{pipeline_name}.json"
    if not filepath.exists():
        # Fallback for category/variant style names
        parts = pipeline_name.split('/')
        if len(parts) == 2:
            filepath = Path(PIPELINES_DIR) / parts[0] / f"{parts[1]}_pipeline.json"

    if not filepath.exists():
        print(f"  - ⚠️  Workflow template not found: {filepath}")
        return None
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        print(f"  - ❌  Invalid JSON in template: {filepath}")
        return None
    except Exception as e:
        print(f"  - ❌  Error loading template {filepath}: {e}")
        return None

def inject_prompt_and_prepare_workflow(template, prompt_text, filename_prefix):
    """
    Injects the prompt and filename and correctly formats the final API payload with links.
    """
    try:
        api_prompt = {
            "4": {
                "inputs": {"ckpt_name": "v1-5-pruned-emaonly.safetensors"},
                "class_type": "CheckpointLoaderSimple"
            },
            "6": {
                "inputs": {"width": 1024, "height": 1024, "batch_size": 1},
                "class_type": "EmptyLatentImage"
            },
            "9": {
                "inputs": {"text": prompt_text, "clip": ["4", 1]},
                "class_type": "CLIPTextEncode"
            },
            "10": {
                "inputs": {"text": "text, watermark, low quality, ugly, deformed", "clip": ["4", 1]},
                "class_type": "CLIPTextEncode"
            },
            "5": {
                "inputs": {
                    "model": ["4", 0],
                    "positive": ["9", 0],
                    "negative": ["10", 0],
                    "latent_image": ["6", 0],
                    "seed": 123,
                    "steps": 20,
                    "cfg": 8.0,
                    "sampler_name": "dpmpp_2m",
                    "scheduler": "karras",
                    "denoise": 1.0
                },
                "class_type": "KSampler"
            },
            "7": {
                "inputs": {"samples": ["5", 0], "vae": ["4", 2]},
                "class_type": "VAEDecode"
            },
            "8": {
                "inputs": {"filename_prefix": filename_prefix, "images": ["7", 0]},
                "class_type": "SaveImage"
            }
        }
        return api_prompt
    except Exception as e:
        print(f"  - ❌  Error processing workflow template: {e}")
        return None

def queue_prompt(workflow_api):
    """Sends the prepared workflow to the ComfyUI server."""
    try:
        p = {"prompt": workflow_api}
        response = requests.post(f"{COMFYUI_URL}/prompt", json=p)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Connection to ComfyUI failed: {e}")
        return None

def main():
    """Main function to drive the batch processing."""
    print("🚀 Starting ComfyUI Batch Image Generator")

    # 1. Check if ComfyUI is running
    try:
        print(f"📡 Pinging ComfyUI server at {COMFYUI_URL}...")
        requests.get(f"{COMFYUI_URL}/history").raise_for_status()
        print("✅ ComfyUI is running.")
    except requests.exceptions.RequestException:
        print("\n❌ FATAL: Could not connect to ComfyUI server.")
        print(f"   Please ensure ComfyUI is running and accessible at {COMFYUI_URL}")
        return

    # 2. Load prompts from CSV
    try:
        print(f"📚 Loading prompts from {PROMPTS_CSV}...")
        prompts_df = pd.read_csv(PROMPTS_CSV)
        print(f"👍 Found {len(prompts_df)} prompts to process.")
    except FileNotFoundError:
        print(f"\n❌ FATAL: {PROMPTS_CSV} not found.")
        print("   Please make sure the prompt CSV file is in the same directory.")
        return
    except Exception as e:
        print(f"\n❌ FATAL: Error reading {PROMPTS_CSV}: {e}")
        return

    # 3. Create output directory if it doesn't exist
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    print(f"🖼️  Images will be saved to: {OUTPUT_DIR}")

    # 4. Process each prompt
    print("\n🔥 Starting generation process...")
    for index, row in prompts_df.iterrows():
        product_id = row['product_id']
        prompt = row['prompt']
        filename_prefix = Path(row['filename']).stem
        pipeline_name = row['pipeline']

        print(f"\n[{index + 1}/{len(prompts_df)}] ----------------------------------------")
        print(f"  - Pipeline: {pipeline_name}")
        print(f"  - Output prefix: {filename_prefix}")

        # Load the base workflow
        template = load_workflow_template(pipeline_name)
        if not template:
            continue

        # Inject the specific prompt and filename
        api_workflow = inject_prompt_and_prepare_workflow(template, prompt, filename_prefix)
        if not api_workflow:
            continue

        # Send to the queue
        result = queue_prompt(api_workflow)
        if result:
            print(f"  - ✅ Successfully queued prompt ID: {result.get('prompt_id')}")
        else:
            print("  - ❌ Failed to queue prompt.")

        # Give the server a moment to breathe
        time.sleep(2)

    print("\n\n🎉 Batch processing complete!")
    print(f"Check the '{OUTPUT_DIR}' directory for your generated images.")

if __name__ == "__main__":
    main() 