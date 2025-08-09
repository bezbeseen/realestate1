const fs = require('fs');
const path = require('path');

const currentProductsPath = path.join(__dirname, 'data', 'products.json');
const oldProductsPath = path.join(__dirname, 'old-products.json');

const currentProducts = JSON.parse(fs.readFileSync(currentProductsPath, 'utf8'));
const oldProducts = JSON.parse(fs.readFileSync(oldProductsPath, 'utf8'));

const productMap = new Map(currentProducts.map(p => [p.product_id, p]));

oldProducts.forEach(oldProduct => {
    if (!productMap.has(oldProduct.product_id)) {
        productMap.set(oldProduct.product_id, oldProduct);
    }
});

const mergedProducts = Array.from(productMap.values());

fs.writeFileSync(currentProductsPath, JSON.stringify(mergedProducts, null, 2));

console.log(`Merge complete. Total products: ${mergedProducts.length}`); 