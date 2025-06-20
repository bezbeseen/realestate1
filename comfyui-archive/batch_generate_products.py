#!/usr/bin/env python3
"""
OPTIMIZED Batch AI Image Generation for Website Products
Generates hundreds of images efficiently by keeping models loaded
"""

import os
import json
import requests
import time
import shutil
import csv
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import threading

# Configuration
COMFYUI_URL = "http://localhost:8188"
COMFYUI_OUTPUT_DIR = "/Users/bez/Documents/ComfyUI/output"
WEBSITE_IMAGES_DIR = "assets/images/products"
BATCH_SIZE = 10  # Generate 10 images before checking outputs

class BatchImageGenerator:
    def __init__(self):
        self.session = requests.Session()
        self.generated_count = 0
        self.lock = threading.Lock()
    
    def load_product_data(self):
        """Load product data from CSV files"""
        products = []
        
        # Load from your existing CSV files
        csv_files = [
            "data/csv/business-cards.csv",
            "data/csv/banners.csv", 
            "data/csv/flyers.csv",
            "data/csv/brochures.csv"
        ]
        
        for csv_file in csv_files:
            if os.path.exists(csv_file):
                with open(csv_file, 'r') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        products.append({
                            'name': row.get('name', ''),
                            'category': row.get('category', ''),
                            'variant': row.get('variant', 'standard'),
                            'description': row.get('description', ''),
                            'keywords': row.get('keywords', '')
                        })
        
        return products
    
    def create_optimized_workflow(self, prompt, seed=None):
        """Create an optimized workflow for batch generation"""
        if seed is None:
            seed = int(time.time()) + self.generated_count
        
        workflow = {
            "1": {
                "inputs": {
                    "ckpt_name": "v1-5-pruned-emaonly-fp16.safetensors"
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "2": {
                "inputs": {
                    "text": prompt,
                    "clip": ["1", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "3": {
                "inputs": {
                    "text": "blurry, low quality, text, watermark, signature, logo, bad anatomy",
                    "clip": ["1", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "4": {
                "inputs": {
                    "seed": seed,
                    "steps": 12,  # Reduced from 15 for speed
                    "cfg": 7.0,
                    "sampler_name": "euler",  # Fastest sampler
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["1", 0],
                    "positive": ["2", 0],
                    "negative": ["3", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "5": {
                "inputs": {
                    "width": 512,  # Keep small for speed
                    "height": 512,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            },
            "6": {
                "inputs": {
                    "samples": ["4", 0],
                    "vae": ["1", 2]
                },
                "class_type": "VAEDecode"
            },
            "7": {
                "inputs": {
                    "filename_prefix": f"batch_product_{self.generated_count:04d}",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage"
            }
        }
        
        return workflow
    
    def queue_multiple_prompts(self, prompts, batch_size=BATCH_SIZE):
        """Queue multiple prompts at once for efficiency"""
        prompt_ids = []
        
        print(f"🚀 Queuing {len(prompts)} prompts in batch...")
        
        for i, prompt in enumerate(prompts):
            workflow = self.create_optimized_workflow(prompt, seed=i+1000)
            
            try:
                payload = {"prompt": workflow}
                response = self.session.post(f"{COMFYUI_URL}/prompt", json=payload)
                
                if response.status_code == 200:
                    prompt_id = response.json()["prompt_id"]
                    prompt_ids.append((prompt_id, prompt))
                    print(f"  ✅ Queued {i+1}/{len(prompts)}: {prompt[:50]}...")
                else:
                    print(f"  ❌ Failed to queue prompt {i+1}: {response.text}")
                
                # Small delay to avoid overwhelming the server
                time.sleep(0.1)
                
            except Exception as e:
                print(f"  ❌ Error queuing prompt {i+1}: {e}")
        
        return prompt_ids
    
    def wait_for_batch_completion(self, prompt_ids):
        """Wait for all prompts in a batch to complete"""
        completed = set()
        total = len(prompt_ids)
        
        print(f"⏳ Waiting for {total} images to generate...")
        
        while len(completed) < total:
            for prompt_id, prompt in prompt_ids:
                if prompt_id in completed:
                    continue
                
                try:
                    response = self.session.get(f"{COMFYUI_URL}/history/{prompt_id}")
                    if response.status_code == 200:
                        history = response.json()
                        if prompt_id in history:
                            completed.add(prompt_id)
                            print(f"  ✅ Completed {len(completed)}/{total}: {prompt[:30]}...")
                except Exception as e:
                    print(f"  ⚠️ Error checking prompt {prompt_id}: {e}")
            
            if len(completed) < total:
                time.sleep(2)
        
        print(f"🎉 Batch of {total} images completed!")
    
    def deploy_batch_images(self, start_count, end_count):
        """Deploy a batch of generated images to website"""
        output_path = Path(COMFYUI_OUTPUT_DIR)
        deployed = []
        
        # Get all images generated in this batch
        pattern = f"batch_product_*.png"
        image_files = list(output_path.glob(pattern))
        
        # Sort by modification time to get the most recent ones
        image_files.sort(key=os.path.getmtime, reverse=True)
        
        # Take the most recent images (up to batch size)
        recent_images = image_files[:end_count-start_count]
        
        for i, image_path in enumerate(recent_images):
            web_filename = f"ai_product_{start_count + i:04d}.png"
            destination = Path(WEBSITE_IMAGES_DIR) / web_filename
            
            try:
                shutil.copy2(image_path, destination)
                deployed.append(f"{WEBSITE_IMAGES_DIR}/{web_filename}")
                print(f"  📁 Deployed: {web_filename}")
            except Exception as e:
                print(f"  ❌ Failed to deploy {image_path}: {e}")
        
        return deployed
    
    def generate_product_prompts(self, products, target_count=100):
        """Generate optimized prompts for products"""
        prompts = []
        
        base_templates = [
            "Professional commercial photography of {product}, {variant} quality, clean white background, studio lighting, detailed",
            "High-end product photography of {product}, {variant} finish, professional lighting, commercial style, clean background",
            "Studio photograph of {product}, {variant} grade, professional presentation, white background, detailed view",
            "Commercial product shot of {product}, {variant} quality, professional lighting, clean presentation, high resolution",
            "Professional {product} photography, {variant} finish, studio lighting, commercial grade, white background"
        ]
        
        # Generate prompts by cycling through products and templates
        for i in range(target_count):
            product = products[i % len(products)]
            template = base_templates[i % len(base_templates)]
            
            prompt = template.format(
                product=product['name'],
                variant=product['variant']
            )
            
            # Add specific keywords if available
            if product.get('keywords'):
                prompt += f", {product['keywords']}"
            
            prompts.append(prompt)
        
        return prompts
    
    def run_batch_generation(self, target_count=100):
        """Run the complete batch generation process"""
        print(f"🎯 Starting batch generation of {target_count} images...")
        
        # Check if ComfyUI is running
        try:
            response = self.session.get(f"{COMFYUI_URL}/system_stats")
            if response.status_code != 200:
                print("❌ ComfyUI is not running!")
                return
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to ComfyUI!")
            return
        
        # Load product data
        products = self.load_product_data()
        if not products:
            # Use default products if no CSV data
            products = [
                {'name': 'business cards', 'variant': 'premium', 'keywords': 'professional, corporate'},
                {'name': 'real estate flyers', 'variant': 'standard', 'keywords': 'property, marketing'},
                {'name': 'banners', 'variant': 'premium', 'keywords': 'advertising, promotional'},
                {'name': 'brochures', 'variant': 'standard', 'keywords': 'informational, tri-fold'},
                {'name': 'postcards', 'variant': 'standard', 'keywords': 'direct mail, marketing'}
            ]
        
        print(f"📊 Loaded {len(products)} product types")
        
        # Generate prompts
        prompts = self.generate_product_prompts(products, target_count)
        print(f"📝 Generated {len(prompts)} prompts")
        
        # Process in batches
        total_deployed = []
        
        for batch_start in range(0, len(prompts), BATCH_SIZE):
            batch_end = min(batch_start + BATCH_SIZE, len(prompts))
            batch_prompts = prompts[batch_start:batch_end]
            
            print(f"\n🔄 Processing batch {batch_start//BATCH_SIZE + 1}/{(len(prompts)-1)//BATCH_SIZE + 1}")
            print(f"   Images {batch_start+1}-{batch_end} of {len(prompts)}")
            
            # Queue the batch
            prompt_ids = self.queue_multiple_prompts(batch_prompts)
            
            if prompt_ids:
                # Wait for completion
                self.wait_for_batch_completion(prompt_ids)
                
                # Deploy images
                deployed = self.deploy_batch_images(batch_start, batch_end)
                total_deployed.extend(deployed)
                
                self.generated_count += len(batch_prompts)
                
                print(f"✅ Batch complete! Total generated: {self.generated_count}")
            
            # Short break between batches
            time.sleep(5)
        
        print(f"\n🎉 BATCH GENERATION COMPLETE!")
        print(f"📊 Total images generated: {len(total_deployed)}")
        print(f"📁 Images deployed to: {WEBSITE_IMAGES_DIR}/")
        print(f"⏱️  Average time per image: ~{(time.time() - start_time) / len(total_deployed):.1f} seconds")

def main():
    generator = BatchImageGenerator()
    
    print("🚀 OPTIMIZED BATCH IMAGE GENERATOR")
    print("This will generate hundreds of images efficiently!")
    print("=" * 50)
    
    # Ask user how many images they want
    try:
        target = input("How many images do you want to generate? (default: 100): ")
        target_count = int(target) if target.strip() else 100
    except ValueError:
        target_count = 100
    
    start_time = time.time()
    generator.run_batch_generation(target_count)
    
    total_time = time.time() - start_time
    print(f"\n⏱️  Total time: {total_time/60:.1f} minutes")
    print(f"🚀 Average: {total_time/target_count:.1f} seconds per image")

if __name__ == "__main__":
    main() 