import json
import pandas as pd
from pathlib import Path
import itertools

SCRIPT_DIR = Path(__file__).parent.resolve()
PRODUCTS_JSON = SCRIPT_DIR / "data/products.json"
PROMPTS_CSV = SCRIPT_DIR / "product-prompts.csv"

def generate_prompts():
    """
    Reads the structured products.json file, generates all possible variant
    combinations, and creates a detailed CSV file for the image generation script.
    """
    try:
        print(f"Loading product data from: {PRODUCTS_JSON}")
        with open(PRODUCTS_JSON, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌  Error loading {PRODUCTS_JSON}: {e}")
        return

    all_prompts = []

    for product in data:
        option_variants = [opt['variants'] for opt in product['options']]
        
        # Get all unique combinations of variants
        for combo in itertools.product(*option_variants):
            
            prompt_parts = [product['base_description']]
            filename_parts = [product['product_id']]
            
            for variant in combo:
                prompt_parts.append(variant['generation_keywords'])
                filename_parts.append(variant['id'])
            
            final_prompt = ", ".join(prompt_parts)
            final_filename = "_".join(filename_parts) + ".png"
            
            all_prompts.append({
                "product_id": product['product_id'],
                "variant_combination": "+".join([v['name'] for v in combo]),
                "pipeline": product['generation_pipeline'],
                "prompt": final_prompt,
                "filename": final_filename
            })

    df = pd.DataFrame(all_prompts)
    
    try:
        df.to_csv(PROMPTS_CSV, index=False)
        print(f"✅ Successfully generated {len(df)} prompts.")
        print(f"   Saved to: {PROMPTS_CSV}")
    except Exception as e:
        print(f"❌  Error saving CSV file: {e}")


if __name__ == "__main__":
    generate_prompts() 