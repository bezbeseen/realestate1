# IMPROVED ComfyUI Server Startup
import subprocess
import time
import requests
import os
from IPython.display import clear_output

# Kill any existing processes on port 8188
!pkill -f "main.py"
!lsof -ti:8188 | xargs -r kill -9
time.sleep(2)

print("🚀 Starting ComfyUI server...")

# Start ComfyUI with proper settings for Colab
process = subprocess.Popen([
    'python', 'main.py', 
    '--listen', '0.0.0.0', 
    '--port', '8188',
    '--dont-upcast-attention',
    '--use-split-cross-attention',
    '--disable-xformers'
], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Wait for server to be ready
max_attempts = 60
for attempt in range(max_attempts):
    try:
        response = requests.get('http://localhost:8188/system_stats', timeout=5)
        if response.status_code == 200:
            clear_output(wait=True)
            print("✅ ComfyUI server is running successfully!")
            server_info = response.json()
            print(f"🖥️  Device: {server_info['devices'][0]['name']}")
            print(f"💾 VRAM: {server_info['devices'][0]['vram_total'] / (1024**3):.1f} GB")
            print("🎯 Ready for image generation!")
            break
    except Exception as e:
        print(f"⏳ Starting server... ({attempt + 1}/{max_attempts})")
        if attempt % 10 == 0 and attempt > 0:
            print(f"   Still working... Server can take up to {max_attempts} seconds to start")
        time.sleep(1)
else:
    print("❌ Server startup failed. Let's try troubleshooting:")
    print("\n🔧 Troubleshooting steps:")
    print("1. Runtime → Restart runtime")
    print("2. Make sure you selected GPU runtime")
    print("3. Re-run all cells from the beginning")
    
    # Show any error output
    stdout, stderr = process.communicate()
    if stderr:
        print(f"\n📋 Error details:\n{stderr.decode()}")