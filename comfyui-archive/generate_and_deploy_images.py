#!/usr/bin/env python3
"""
Generate AI images with ComfyUI and deploy them to the website
"""

import os
import json
import requests
import time
import shutil
from pathlib import Path

# Configuration
COMFYUI_URL = "http://localhost:8188"
COMFYUI_OUTPUT_DIR = "/Users/bez/Documents/ComfyUI/output"
WEBSITE_IMAGES_DIR = "assets/images/products"

def load_workflow(workflow_file):
    """Load a ComfyUI workflow JSON file"""
    with open(workflow_file, 'r') as f:
        return json.load(f)

def update_workflow_prompt(workflow, positive_prompt, negative_prompt=None):
    """Update the text prompts in a workflow"""
    for node in workflow["nodes"]:
        if node.get("type") == "CLIPTextEncode":
            # Node 2 is positive prompt, Node 3 is negative prompt
            if node["id"] == 2:
                node["widgets_values"] = [positive_prompt]
            elif node["id"] == 3 and negative_prompt:
                node["widgets_values"] = [negative_prompt]
    return workflow

def queue_prompt(workflow):
    """Send a workflow to ComfyUI for processing"""
    payload = {"prompt": workflow}
    response = requests.post(f"{COMFYUI_URL}/prompt", json=payload)
    if response.status_code == 200:
        return response.json()["prompt_id"]
    else:
        raise Exception(f"Failed to queue prompt: {response.text}")

def wait_for_completion(prompt_id):
    """Wait for a ComfyUI prompt to complete"""
    while True:
        response = requests.get(f"{COMFYUI_URL}/history/{prompt_id}")
        if response.status_code == 200:
            history = response.json()
            if prompt_id in history:
                return history[prompt_id]
        time.sleep(2)

def get_latest_output_image():
    """Get the most recently generated image from ComfyUI output"""
    output_path = Path(COMFYUI_OUTPUT_DIR)
    if not output_path.exists():
        return None
    
    image_files = list(output_path.glob("*.png")) + list(output_path.glob("*.jpg"))
    if not image_files:
        return None
    
    # Return the most recently modified image
    return max(image_files, key=os.path.getmtime)

def deploy_image_to_website(image_path, product_name):
    """Copy generated image to website assets"""
    if not image_path or not image_path.exists():
        print(f"Image not found: {image_path}")
        return None
    
    # Create a web-friendly filename
    web_filename = f"{product_name.lower().replace(' ', '_')}_ai_generated.png"
    destination = Path(WEBSITE_IMAGES_DIR) / web_filename
    
    # Copy the image
    shutil.copy2(image_path, destination)
    print(f"✅ Image deployed to: {destination}")
    
    return f"{WEBSITE_IMAGES_DIR}/{web_filename}"

def generate_product_image(product_name, variant="premium"):
    """Generate an AI image for a specific product"""
    print(f"🎨 Generating image for: {product_name} ({variant})")
    
    # Load the low-memory workflow (more reliable)
    workflow = load_workflow("comfyui-workflow-lowmem.json")
    
    # Create a product-specific prompt
    prompt = f"Professional commercial photography of {product_name}, {variant} quality, clean white background, studio lighting, product photography, high resolution, detailed"
    
    # Update the workflow with the new prompt
    workflow = update_workflow_prompt(workflow, prompt)
    
    # Queue the prompt
    try:
        prompt_id = queue_prompt(workflow)
        print(f"⏳ Queued prompt: {prompt_id}")
        
        # Wait for completion
        result = wait_for_completion(prompt_id)
        print(f"✅ Generation complete!")
        
        # Get the generated image
        image_path = get_latest_output_image()
        if image_path:
            # Deploy to website
            web_path = deploy_image_to_website(image_path, f"{product_name}_{variant}")
            return web_path
        else:
            print("❌ No output image found")
            return None
            
    except Exception as e:
        print(f"❌ Error generating image: {e}")
        return None

def main():
    """Main function - generate images for different products"""
    products = [
        ("business cards", "premium"),
        ("business cards", "luxury"),
        ("real estate flyers", "standard"),
        ("banners", "premium"),
        ("brochures", "standard")
    ]
    
    print("🚀 Starting AI image generation for website...")
    
    # Check if ComfyUI is running
    try:
        response = requests.get(f"{COMFYUI_URL}/system_stats")
        if response.status_code != 200:
            print("❌ ComfyUI is not running. Start it first with:")
            print("cd /Users/bez/Documents/ComfyUI && source venv/bin/activate && python main.py --listen --port 8188 --cpu-vae --force-fp16")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to ComfyUI. Make sure it's running on http://localhost:8188")
        return
    
    generated_images = []
    
    for product_name, variant in products:
        web_path = generate_product_image(product_name, variant)
        if web_path:
            generated_images.append((product_name, variant, web_path))
        
        # Small delay between generations
        time.sleep(5)
    
    print("\n🎉 Generation Summary:")
    for product_name, variant, web_path in generated_images:
        print(f"  ✅ {product_name} ({variant}): {web_path}")
    
    print(f"\n📁 All images are now in: {WEBSITE_IMAGES_DIR}/")
    print("💡 You can now update your HTML files to use these images!")

if __name__ == "__main__":
    main() 