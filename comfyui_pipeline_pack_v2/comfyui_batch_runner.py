
import os
import json
import requests

# Set the local path to all pipeline files
PIPELINE_DIR = './pipelines'
# If using ComfyUI Web API:
COMFYUI_API = 'http://localhost:8188/prompt'

# Function to load and run each pipeline
def run_pipeline(file_path):
    with open(file_path, 'r') as f:
        payload = json.load(f)
    response = requests.post(COMFYUI_API, json=payload)
    if response.status_code == 200:
        print(f"✅ Ran pipeline: {os.path.basename(file_path)}")
    else:
        print(f"❌ Failed to run {file_path} - Status: {response.status_code}")

def main():
    for root, _, files in os.walk(PIPELINE_DIR):
        for filename in files:
            if filename.endswith('.json'):
              	 run_pipeline(os.path.join(root, filename))


if __name__ == "__main__":
    main()
