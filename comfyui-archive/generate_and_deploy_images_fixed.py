#!/usr/bin/env python3
"""
Generate AI images with ComfyUI and deploy them to the website - FIXED VERSION
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
    """Update the text prompts in a workflow - FIXED for correct structure"""
    # The workflow has nodes as an array, not a dictionary
    for node in workflow["nodes"]:
        if node.get("type") == "CLIPTextEncode":
            # Check if this is the positive prompt node (usually has longer text)
            current_text = node.get("widgets_values", [""])[0]
            if len(current_text) > 20:  # Assume longer text is positive prompt
                node["widgets_values"] = [positive_prompt]
                print(f"✅ Updated positive prompt: {positive_prompt[:50]}...")
            elif negative_prompt and len(current_text) <= 20:  # Shorter text is negative
                node["widgets_values"] = [negative_prompt]
                print(f"✅ Updated negative prompt: {negative_prompt[:30]}...")
    return workflow

def convert_workflow_for_api(workflow):
    """Convert UI workflow format to API format"""
    api_workflow = {}
    
    # Convert nodes array to API format
    for node in workflow["nodes"]:
        node_id = str(node["id"])
        api_workflow[node_id] = {
            "inputs": {},
            "class_type": node["type"]
        }
        
        # Add widget values as inputs
        if "widgets_values" in node:
            # Map widget values to input names based on node type
            if node["type"] == "CheckpointLoaderSimple":
                api_workflow[node_id]["inputs"]["ckpt_name"] = node["widgets_values"][0]
            elif node["type"] == "CLIPTextEncode":
                api_workflow[node_id]["inputs"]["text"] = node["widgets_values"][0]
            elif node["type"] == "EmptyLatentImage":
                api_workflow[node_id]["inputs"]["width"] = node["widgets_values"][0]
                api_workflow[node_id]["inputs"]["height"] = node["widgets_values"][1]
                api_workflow[node_id]["inputs"]["batch_size"] = node["widgets_values"][2]
            elif node["type"] == "KSampler":
                api_workflow[node_id]["inputs"]["seed"] = node["widgets_values"][0]
                api_workflow[node_id]["inputs"]["steps"] = node["widgets_values"][2]
                api_workflow[node_id]["inputs"]["cfg"] = node["widgets_values"][3]
                api_workflow[node_id]["inputs"]["sampler_name"] = node["widgets_values"][4]
                api_workflow[node_id]["inputs"]["scheduler"] = node["widgets_values"][5]
                api_workflow[node_id]["inputs"]["denoise"] = node["widgets_values"][6]
            elif node["type"] == "SaveImage":
                api_workflow[node_id]["inputs"]["filename_prefix"] = node["widgets_values"][0]
    
    # Add connections based on links
    for link in workflow["links"]:
        output_node_id = str(link[1])
        output_slot = link[2]
        input_node_id = str(link[3])
        input_slot = link[4]
        connection_type = link[5]
        
        # Map connection types to input names
        input_name_map = {
            "MODEL": "model",
            "CLIP": "clip", 
            "VAE": "vae",
            "CONDITIONING": "positive" if "positive" in str(link) else "negative",
            "LATENT": "latent_image" if input_node_id == "5" else "samples",
            "IMAGE": "images"
        }
        
        # Determine input name based on node type and connection
        if input_node_id == "2":  # Positive prompt node
            input_name = "clip"
        elif input_node_id == "3":  # Negative prompt node  
            input_name = "clip"
        elif input_node_id == "5":  # KSampler
            if connection_type == "MODEL":
                input_name = "model"
            elif connection_type == "CONDITIONING" and output_node_id == "2":
                input_name = "positive"
            elif connection_type == "CONDITIONING" and output_node_id == "3":
                input_name = "negative"
            elif connection_type == "LATENT":
                input_name = "latent_image"
        elif input_node_id == "6":  # VAEDecode
            if connection_type == "LATENT":
                input_name = "samples"
            elif connection_type == "VAE":
                input_name = "vae"
        elif input_node_id == "8":  # SaveImage
            input_name = "images"
        else:
            input_name = input_name_map.get(connection_type, connection_type.lower())
        
        api_workflow[input_node_id]["inputs"][input_name] = [output_node_id, output_slot]
    
    return api_workflow

def queue_prompt(workflow):
    """Send a workflow to ComfyUI for processing"""
    payload = {"prompt": workflow}
    response = requests.post(f"{COMFYUI_URL}/prompt", json=payload)
    if response.status_code == 200:
        return response.json()["prompt_id"]
    else:
        raise Exception(f"Failed to queue prompt: {response.text}")

def wait_for_completion(prompt_id, timeout=120):
    """Wait for a ComfyUI prompt to complete with timeout"""
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            response = requests.get(f"{COMFYUI_URL}/history/{prompt_id}")
            if response.status_code == 200:
                history = response.json()
                if prompt_id in history:
                    return history[prompt_id]
        except:
            pass
        time.sleep(2)
    raise Exception(f"Timeout waiting for prompt {prompt_id}")

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
    negative_prompt = "blurry, low quality, distorted, cropped, bad lighting, text, watermark"
    
    # Update the workflow with the new prompt
    workflow = update_workflow_prompt(workflow, prompt, negative_prompt)
    
    # Convert to API format
    api_workflow = convert_workflow_for_api(workflow)
    
    # Queue the prompt
    try:
        prompt_id = queue_prompt(api_workflow)
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
        ("vinyl banners", "premium"),
        ("brochures", "standard")
    ]
    
    print("🚀 Starting AI image generation for website...")
    
    # Check if ComfyUI is running
    try:
        response = requests.get(f"{COMFYUI_URL}/system_stats")
        if response.status_code != 200:
            print("❌ ComfyUI is not running. Start it first!")
            return
        else:
            print("✅ ComfyUI server is running")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to ComfyUI. Make sure it's running on http://localhost:8188")
        return
    
    generated_images = []
    
    for i, (product_name, variant) in enumerate(products, 1):
        print(f"\n[{i}/{len(products)}] " + "="*50)
        web_path = generate_product_image(product_name, variant)
        if web_path:
            generated_images.append((product_name, variant, web_path))
        
        # Small delay between generations
        time.sleep(3)
    
    print(f"\n🎉 Generation Summary:")
    print(f"✅ Successfully generated: {len(generated_images)}/{len(products)} images")
    for product_name, variant, web_path in generated_images:
        print(f"  • {product_name} ({variant}): {web_path}")
    
    print(f"\n📁 All images are now in: {WEBSITE_IMAGES_DIR}/")
    print("💡 You can now update your HTML files to use these images!")

if __name__ == "__main__":
    main() 