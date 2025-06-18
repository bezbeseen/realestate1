import requests
import json
import time

def test_simple_workflow():
    """Test a very simple workflow to verify ComfyUI is working"""
    
    # Simple text-to-image workflow
    workflow = {
        "prompt": {
            "1": {
                "inputs": {
                    "text": "a simple red apple on white background, product photography",
                    "clip": ["4", 1]
                },
                "class_type": "CLIPTextEncode"
            },
            "2": {
                "inputs": {
                    "text": "blurry, low quality, dark background",
                    "clip": ["4", 1]
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
                    "model": ["4", 0],
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
                    "vae": ["4", 2]
                },
                "class_type": "VAEDecode"
            },
            "7": {
                "inputs": {
                    "filename_prefix": "test_image",
                    "images": ["6", 0]
                },
                "class_type": "SaveImage"
            }
        }
    }
    
    try:
        print("🧪 Testing simple workflow...")
        response = requests.post('http://127.0.0.1:8188/prompt', json=workflow)
        
        if response.status_code == 200:
            print("✅ Simple workflow submitted successfully!")
            result = response.json()
            print(f"📋 Prompt ID: {result.get('prompt_id', 'Unknown')}")
            return True
        else:
            print(f"❌ Failed to submit workflow - Status: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_simple_workflow() 