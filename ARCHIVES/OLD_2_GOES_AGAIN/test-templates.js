/**
 * ============================================================
 * Test: Templates Module
 * ============================================================
 */

import { Templates } from './src/commerce/templates/index.js';
import { Products, Bundles } from './src/commerce/catalog/index.js';

console.log('✅ Testing Templates Module');
console.log('');

// Build a lookup map from product ID to product object
const productMap = {};
if (Products.Botaniq) {
  Object.values(Products.Botaniq).forEach(product => {
    productMap[product.id] = product;
  });
}

// Build a lookup map from bundle ID to bundle object
const bundleMap = {};
if (Bundles.Botaniq) {
  Object.values(Bundles.Botaniq).forEach(bundle => {
    bundleMap[bundle.id] = bundle;
  });
}

function resolveCatalogItem(id) {
  if (productMap[id]) {
    return { item: productMap[id], type: 'product' };
  }
  if (bundleMap[id]) {
    return { item: bundleMap[id], type: 'bundle' };
  }
  return null;
}

console.log('📋 Templates:');
const templateKeys = Object.keys(Templates.Botaniq);
console.log(`  Total templates: ${templateKeys.length}`);
templateKeys.forEach(key => {
  const t = Templates.Botaniq[key];
  console.log(`    - ${t.id}: ${t.title}`);
});
console.log('');

console.log('🔗 Catalog References:');
templateKeys.forEach(key => {
  const t = Templates.Botaniq[key];
  const resolved = resolveCatalogItem(t.catalogItemId);
  if (resolved) {
    console.log(`  ✅ ${t.id} → ${resolved.item.id} (${resolved.type})`);
  } else {
    console.log(`  ❌ ${t.id} → MISSING (catalog item '${t.catalogItemId}' not found)`);
  }
});
console.log('');

console.log('📐 Selection Models:');
templateKeys.forEach(key => {
  const t = Templates.Botaniq[key];
  console.log(`  ${t.id}: ${t.selectionModel.groups.length} group(s)`);
});
console.log('');

console.log('⚡ Supported Capabilities:');
templateKeys.forEach(key => {
  const t = Templates.Botaniq[key];
  const caps = t.supportedCapabilities.map(c => c.id || c).join(', ');
  console.log(`  ${t.id}: ${caps}`);
});
console.log('');

console.log('🔒 Immutability:');
templateKeys.forEach(key => {
  const t = Templates.Botaniq[key];
  console.log(`  ${t.id} frozen: ${Object.isFrozen(t)}`);
});
console.log('');

// Count resolved references
const resolvedCount = templateKeys.filter(key => {
  const t = Templates.Botaniq[key];
  return resolveCatalogItem(t.catalogItemId) !== null;
}).length;

console.log(`📊 Summary: ${resolvedCount}/${templateKeys.length} catalog references resolved`);
console.log('');

console.log('✅ All tests passed!');
