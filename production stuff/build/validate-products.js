const path = require('path');

function isKebab(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');
}

function isProductId(value) {
  return /^[a-z0-9_]+$/.test(value || '');
}

function basenameSlug(filePath) {
  return path.basename(filePath || '', '.html');
}

function hasConfiguratorShape(config) {
  return !!(
    config &&
    typeof config === 'object' &&
    typeof config.name === 'string' &&
    typeof config.unitPrice === 'number' &&
    typeof config.unitLabel === 'string'
  );
}

function hasNonEmptyText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function resolveImageKey(productId, imageProducts, directImageAliases, prefixImageMap) {
  if (imageProducts[productId]) return productId;
  if (directImageAliases[productId]) return directImageAliases[productId];
  for (const [prefix, key] of Object.entries(prefixImageMap)) {
    if (productId.startsWith(prefix)) return key;
  }
  return null;
}

function collectImagePaths(node, acc = []) {
  if (!node || typeof node !== 'object') return acc;
  if (hasNonEmptyText(node.path)) acc.push(node.path);
  for (const value of Object.values(node)) {
    if (value && typeof value === 'object') {
      collectImagePaths(value, acc);
    }
  }
  return acc;
}

function hasPricingData(product) {
  if (typeof product?.configurator_config?.unitPrice === 'number' && product.configurator_config.unitPrice > 0) {
    return true;
  }
  if (hasNonEmptyText(product?.price)) return true;
  if (hasNonEmptyText(product?.product_details?.price)) return true;
  if (Array.isArray(product?.catalog_products)) {
    for (const cp of product.catalog_products) {
      if (hasNonEmptyText(cp?.price)) return true;
      if (Array.isArray(cp?.options) && cp.options.some(opt => hasNonEmptyText(opt?.price))) return true;
    }
  }
  return false;
}

function validateProductsData(products, source = 'products.json') {
  if (!Array.isArray(products)) {
    throw new Error(`[validate-products] ${source}: expected array root`);
  }

  const errors = [];
  const seenIds = new Map();
  const seenPaths = new Map();
  const productByPath = new Map();

  products.forEach((p, i) => {
    const where = `index ${i}${p?.product_id ? ` (${p.product_id})` : ''}`;
    if (!p || typeof p !== 'object') {
      errors.push(`${where}: product must be an object`);
      return;
    }

    if (!p.product_id) {
      errors.push(`${where}: missing product_id`);
    } else {
      if (!isProductId(p.product_id)) {
        errors.push(`${where}: invalid product_id "${p.product_id}"`);
      }
      if (seenIds.has(p.product_id)) {
        errors.push(`${where}: duplicate product_id "${p.product_id}"`);
      }
      seenIds.set(p.product_id, i);
    }

    if (!p.path) {
      errors.push(`${where}: missing path`);
    } else {
      if (!p.path.endsWith('.html')) {
        errors.push(`${where}: path must end with .html -> "${p.path}"`);
      }
      if (seenPaths.has(p.path)) {
        errors.push(`${where}: duplicate path "${p.path}"`);
      }
      seenPaths.set(p.path, i);
      productByPath.set(p.path, p);
    }

    if (Array.isArray(p.catalog_products)) {
      for (const cp of p.catalog_products) {
        if (cp?.slug && !isKebab(cp.slug)) {
          errors.push(`${where}: catalog slug "${cp.slug}" must be kebab-case`);
        }
      }
    }
  });

  products.forEach((p, i) => {
    const where = `index ${i} (${p.product_id || 'unknown'})`;

    if (p.hide_from_category === true && Array.isArray(p.catalog_products) && p.catalog_products.length === 1) {
      const cpSlug = p.catalog_products[0]?.slug;
      const pathSlug = basenameSlug(p.path);
      if (cpSlug && pathSlug !== cpSlug) {
        errors.push(`${where}: child path slug "${pathSlug}" must match catalog slug "${cpSlug}"`);
      }
    }

    if (p.is_hub === true) {
      if (!Array.isArray(p.child_products) || p.child_products.length === 0) {
        errors.push(`${where}: hub missing child_products`);
        return;
      }

      const hubDir = p.path.replace(/[^/]+$/, '');
      const childSlugs = new Set();

      for (const child of p.child_products) {
        if (!child?.slug || !child?.path) {
          errors.push(`${where}: child requires slug + path`);
          continue;
        }

        if (!isKebab(child.slug)) {
          errors.push(`${where}: child slug "${child.slug}" must be kebab-case`);
        }

        const childPathSlug = basenameSlug(child.path);
        if (childPathSlug !== child.slug) {
          errors.push(`${where}: child path "${child.path}" must end with "${child.slug}.html"`);
        }

        if (!child.path.startsWith(hubDir)) {
          errors.push(`${where}: child path "${child.path}" should be under "${hubDir}"`);
        }

        if (childSlugs.has(child.slug)) {
          errors.push(`${where}: duplicate child slug "${child.slug}"`);
        }
        childSlugs.add(child.slug);

        const childProduct = productByPath.get(child.path);
        if (!childProduct) {
          errors.push(`${where}: child path "${child.path}" has no matching product`);
        } else if (childProduct.hide_from_category !== true) {
          errors.push(`${where}: child "${childProduct.product_id}" must set hide_from_category=true`);
        }
      }
    }
  });

  if (errors.length) {
    throw new Error(
      `[validate-products] ${source}: ${errors.length} issue(s)\n` +
      errors.map(e => `- ${e}`).join('\n')
    );
  }
}

function collectProductsWarnings(products, imageLibrary, options = {}) {
  if (!Array.isArray(products)) {
    return ['products root is not an array; warning checks skipped'];
  }

  const warnings = [];
  const imageProducts = imageLibrary && imageLibrary.products ? imageLibrary.products : {};
  const contentStems = options.contentStems || new Set();
  const directImageAliases = {
    photos: 'canvas_prints',
    window_clings: 'window_graphics',
    real_estate_business_cards: 'business_cards',
    real_estate_banners: 'banners',
    real_estate_flags: 'flags',
    real_estate_lawn_signs: 'yard_signs',
    real_estate_a_frames: 'a_frames',
    tension_fabric_stand: 'retractable_banners',
    standard_retractable: 'retractable_banners',
    deluxe_retractable: 'retractable_banners',
    sd_retractable: 'retractable_banners',
    x_stand: 'retractable_banners',
    step_repeat_backdrop: 'retractable_banners',
    table_top_banner_stand: 'retractable_banners',
    yard_sign_and_h_stake: 'yard_signs',
    real_estate_a_frame_yard: 'yard_signs',
    real_estate_post: 'yard_signs',
    real_estate_frame: 'yard_signs',
  };

  const prefixImageMap = {
    a_frames_: 'a_frames',
    banners_: 'banners',
    light_boxes_: 'light_boxes',
    retractable_banners_: 'retractable_banners',
    yard_signs_: 'yard_signs',
    commercial_signage_: 'commercial_signage',
    channel_lettering_: 'channel_lettering',
    '3d_lettering_': '3d_lettering',
    window_graphics_: 'window_graphics',
    aluminum_signs_: 'aluminum_signs',
    magnets_: 'magnets',
  };
  const primaryImageToProducts = new Map();

  products.forEach((p, i) => {
    const pid = p && p.product_id ? p.product_id : `index-${i}`;
    const where = `${pid}${p?.path ? ` (${p.path})` : ''}`;

    // Strict image checks: missing image coverage and duplicate image usage.
    const mappedImageKey = resolveImageKey(pid, imageProducts, directImageAliases, prefixImageMap);
    const imageNode = mappedImageKey ? imageProducts[mappedImageKey] : null;
    const imagePaths = imageNode ? collectImagePaths(imageNode, []) : [];
    if (!mappedImageKey || !imageNode || imagePaths.length === 0) {
      warnings.push(`[no-images] ${where}: no IMAGE_LIBRARY image coverage found`);
    } else {
      const firstPath = imagePaths[0];
      if (hasNonEmptyText(firstPath)) {
        if (!primaryImageToProducts.has(firstPath)) primaryImageToProducts.set(firstPath, []);
        primaryImageToProducts.get(firstPath).push(where);
      }
      if (new Set(imagePaths).size < imagePaths.length) {
        warnings.push(`[duplicate-images] ${where}: IMAGE_LIBRARY entry repeats one or more image paths`);
      }
    }

    // Warning: banner child pages are expected to carry sqft calculator configuration.
    if (pid.startsWith('banners_')) {
      if (!p.configurator_config) {
        warnings.push(`${where}: missing configurator_config for banner child page`);
      } else if (!hasConfiguratorShape(p.configurator_config)) {
        warnings.push(`${where}: configurator_config should include name, unitPrice(number), unitLabel`);
      }
    }

    // Warning: hub child slugs and catalog slugs should stay in sync.
    if (p?.is_hub === true && Array.isArray(p.child_products) && Array.isArray(p.catalog_products)) {
      const childSlugSet = new Set(
        p.child_products.map(c => c && c.slug).filter(Boolean)
      );
      const catalogSlugSet = new Set(
        p.catalog_products.map(c => c && c.slug).filter(Boolean)
      );

      childSlugSet.forEach(slug => {
        if (!catalogSlugSet.has(slug)) {
          warnings.push(`${where}: child slug "${slug}" missing from catalog_products`);
        }
      });
      catalogSlugSet.forEach(slug => {
        if (!childSlugSet.has(slug)) {
          warnings.push(`${where}: catalog slug "${slug}" missing from child_products`);
        }
      });
    }

    // Strict verbiage checks: inline copy or dedicated content file.
    const contentStem = String(pid || '').replace(/_/g, '-');
    const hasDedicatedContent = contentStems.has(contentStem);
    const hasInlineCopy =
      hasNonEmptyText(p?.base_description) ||
      hasNonEmptyText(p?.description) ||
      hasNonEmptyText(p?.seo_description) ||
      hasNonEmptyText(p?.meta_description) ||
      hasNonEmptyText(p?.product_details?.description_short) ||
      hasNonEmptyText(p?.product_details?.description_long);
    if (!hasInlineCopy && !hasDedicatedContent) {
      warnings.push(`[no-verbiage] ${where}: missing description source (no copy fields and no content/products/${contentStem}.html|.md)`);
    }

    // Strict pricing checks: needs catalog/configurator/product price signal.
    if (!hasPricingData(p)) {
      warnings.push(`[no-pricing] ${where}: missing price data (catalog/configurator/product price)`);
    }
  });

  for (const [imagePath, productList] of primaryImageToProducts.entries()) {
    if (productList.length > 1) {
      const preview = productList.slice(0, 5).join('; ');
      const more = productList.length > 5 ? `; +${productList.length - 5} more` : '';
      warnings.push(
        `[duplicate-images] shared primary image "${imagePath}" across ${productList.length} products: ${preview}${more}`
      );
    }
  }

  return warnings;
}

module.exports = {
  validateProductsData,
  collectProductsWarnings,
};

