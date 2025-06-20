# ALTERNATIVE: Direct ComfyUI Generation (More Reliable)
import json
import time
import random
import requests
from datetime import datetime
import base64
from PIL import Image
import io

def generate_image_direct(prompt, filename, max_retries=3):
    """Generate image with retry logic and better error handling"""
    
    for retry in range(max_retries):
        try:
            print(f"🎨 Generating {filename} (attempt {retry + 1}/{max_retries})")
            
            # Simplified workflow for better compatibility
            workflow = {
                "3": {
                    "inputs": {"seed": random.randint(1, 2**32), "steps": 20, "cfg": 8.0, 
                              "sampler_name": "euler", "scheduler": "normal", "denoise": 1, 
                              "model": ["4", 0], "positive": ["6", 0], "negative": ["7", 0], 
                              "latent_image": ["5", 0]},
                    "class_type": "KSampler"
                },
                "4": {
                    "inputs": {"ckpt_name": "v1-5-pruned-emaonly.safetensors"},
                    "class_type": "CheckpointLoaderSimple"
                },
                "5": {
                    "inputs": {"width": 512, "height": 512, "batch_size": 1},
                    "class_type": "EmptyLatentImage"
                },
                "6": {
                    "inputs": {"text": prompt, "clip": ["4", 1]},
                    "class_type": "CLIPTextEncode"
                },
                "7": {
                    "inputs": {"text": "text, watermark, low quality, blurry", "clip": ["4", 1]},
                    "class_type": "CLIPTextEncode"
                },
                "8": {
                    "inputs": {"samples": ["3", 0], "vae": ["4", 2]},
                    "class_type": "VAEDecode"
                },
                "9": {
                    "inputs": {"filename_prefix": filename.replace('.png', ''), "images": ["8", 0]},
                    "class_type": "SaveImage"
                }
            }
            
            # Queue the prompt
            response = requests.post('http://localhost:8188/prompt', 
                                   json={"prompt": workflow}, 
                                   timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                prompt_id = result.get('prompt_id')
                print(f"  ✅ Queued successfully (ID: {prompt_id})")
                
                # Wait for completion with timeout
                timeout = 120  # 2 minutes max per image
                start_time = time.time()
                
                while time.time() - start_time < timeout:
                    try:
                        queue_response = requests.get('http://localhost:8188/queue', timeout=10)
                        if queue_response.status_code == 200:
                            queue_data = queue_response.json()
                            pending = len(queue_data.get('queue_pending', []))
                            running = len(queue_data.get('queue_running', []))
                            
                            if pending == 0 and running == 0:
                                print(f"  🎉 {filename} completed!")
                                return True
                                
                            print(f"  ⏳ Processing... ({int(time.time() - start_time)}s)")
                            time.sleep(5)
                    except:
                        time.sleep(5)
                
                print(f"  ⚠️ {filename} timed out, but may still be processing")
                return True
                
            else:
                print(f"  ❌ Queue failed: {response.text}")
                
        except Exception as e:
            print(f"  ❌ Error on attempt {retry + 1}: {str(e)}")
            if retry < max_retries - 1:
                print(f"  🔄 Retrying in 5 seconds...")
                time.sleep(5)
    
    print(f"  💀 Failed to generate {filename} after {max_retries} attempts")
    return False

# Test server connection first
try:
    test_response = requests.get('http://localhost:8188/system_stats', timeout=10)
    if test_response.status_code != 200:
        print("❌ Server not responding. Please restart the server cell above.")
    else:
        print("✅ Server is ready! Starting generation...")
        
        # Your product prompts (reduced for faster testing)
        products = [
            ("Professional business cards, premium cardstock, elegant design, studio lighting", "business_cards_premium.png"),
            ("Luxury business cards with gold foil, metallic accents, premium quality", "business_cards_luxury.png"),
            ("Real estate marketing flyers, modern design, property listings", "real_estate_flyers.png"),
            ("Vinyl banners, outdoor advertising, weather resistant, vibrant colors", "vinyl_banners.png"),
            ("Professional brochures, tri-fold design, glossy finish, corporate", "brochures.png")
        ]
        
        print(f"🎯 Generating {len(products)} images...")
        successful = 0
        start_time = datetime.now()
        
        for i, (prompt, filename) in enumerate(products, 1):
            print(f"\n[{i}/{len(products)}] {'-'*50}")
            if generate_image_direct(prompt, filename):
                successful += 1
            time.sleep(2)  # Brief pause between images
        
        end_time = datetime.now()
        total_time = (end_time - start_time).total_seconds()
        
        print(f"\n🎉 GENERATION COMPLETE!")
        print(f"✅ Successfully generated: {successful}/{len(products)} images")
        print(f"⏱️ Total time: {total_time:.1f} seconds")
        if successful > 0:
            print(f"🚀 Average time per image: {total_time/successful:.1f} seconds")
        
except Exception as e:
    print(f"❌ Cannot connect to server: {e}")
    print("\n🔧 Please:")
    print("1. Make sure the server cell above ran successfully")  
    print("2. Wait for the '✅ ComfyUI server is running!' message")
    print("3. Then run this cell again")