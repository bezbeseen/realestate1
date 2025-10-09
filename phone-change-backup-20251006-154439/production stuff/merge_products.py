import json

# Load the new products (from staging)
with open('production stuff/data/products.json', 'r') as f:
    new_products = json.load(f)

# Load the old products (complete list)
with open('old-products.json', 'r') as f:
    old_products = json.load(f)

# Create a dictionary of the new products for easy lookup
new_products_dict = {p['product_id']: p for p in new_products}

# Create the final merged list
merged_products = []

# Iterate through the old products, and update with new data where available
for old_product in old_products:
    if old_product['product_id'] in new_products_dict:
        # This product exists in the new data, so use the new data
        merged_products.append(new_products_dict[old_product['product_id']])
    else:
        # This product only exists in the old data, so keep it
        merged_products.append(old_product)

# Write the final merged list to the products.json file
with open('production stuff/data/products.json', 'w') as f:
    json.dump(merged_products, f, indent=2)

print(f"Merge complete. Total products: {len(merged_products)}")
