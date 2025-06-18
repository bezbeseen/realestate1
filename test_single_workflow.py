import requests
import json
import time

def test_single_workflow():
    """Test a single workflow to see if image generation works"""
    
    workflow = {
        "prompt": {
            "1": {
                "inputs": {
                    "text": "a red apple on white background, product photography",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "2": {
                "inputs": {
                    "text": "blurry, low quality",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "3": {
                "inputs": {
                    "seed": 42,
                    "steps": 4,
                    "cfg": 1.0,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1.0,
                    "model": ["4", 0],
                    "positive": ["1", 0],
                    "negative": ["2", 0],
                    "latent_image": ["5", 0]
                },
                "class_type": "KSampler"
            },
            "4": {
                "inputs": {
                    "ckpt_name": "sd_turbo.safetensors"
                },
                "class_type": "CheckpointLoaderSimple"
            },
            "5": {
                "inputs": {
                    "width": 512,
                    "height": 512,
                    "batch_size": 1
                },
                "class_type": "EmptyLatentImage"
            },
            "6": {
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["4", 2]
                },
                "class_type": "VAEDecode"
            },
            "7": {
                "inputs": {
                    "filename_prefix": "test_apple",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage"
            }
        }
    }
    
    try:
        print("🧪 Testing single workflow...")
        response = requests.post('http://127.0.0.1:8188/prompt', json=workflow)
        
        if response.status_code == 200:
            result = response.json()
            prompt_id = result.get('prompt_id', 'Unknown')
            print(f"✅ Workflow submitted! Prompt ID: {prompt_id}")
            
            # Wait a bit and check for output
            print("⏳ Waiting 30 seconds for generation...")
            time.sleep(30)
            
            # Check if image was generated
            import os
            import glob
            
            output_files = glob.glob('/Users/bez/Documents/ComfyUI/output/test_apple*.png')
            if output_files:
                print(f"🖼️  SUCCESS! Generated image: {output_files[0]}")
                return True
            else:
                print("❌ No output image found")
                return False
                
        else:
            print(f"❌ Failed to submit workflow - Status: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_single_workflow() 