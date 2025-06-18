AI Product Image Pipelines – Batch Generation

Instructions:
1. Load JSON files in ComfyUI from /pipelines/{product}/{variant}_pipeline.json
2. Or run them in bulk with comfyui_batch_runner.py (requires API mode)
3. Each pipeline references anchor images hosted externally
4. Images will save into /outputs/{product}/{variant}/ based on filename structure

Customization Tips:
- Edit prompts inside each JSON to fine-tune lighting, angle, or product style
- To automate scaling, edit the batch runner to loop and update version numbers
