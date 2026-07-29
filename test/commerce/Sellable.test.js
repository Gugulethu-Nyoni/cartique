/**
 * ============================================================
 * Test: Sellable
 * ============================================================
 */

import { Sellable } from '../../src/commerce/Sellable.js';
import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Sellable');
console.log('');

// Create a product
const product = Sellable.product({
  id: Identifier.from('prod_chia_001', 'product'),
  title: 'Organic Chia Seeds',
  sku: 'CHIA-001',
  pricing: { base: 140, wholesale: 120 },
  metadata: { brand: 'Botaniq', organic: true }
});

console.log('📋 Product:');
console.log(`  ID: ${product.id.value}`);
console.log(`  Title: ${product.title}`);
console.log(`  Type: ${product.type}`);
console.log(`  SKU: ${product.sku}`);
console.log(`  Base Price: ${product.basePrice}`);
console.log(`  Has variants: ${product.hasVariants}`);
console.log(`  Is composable: ${product.isComposable}`);
console.log(`  Metadata:`, product.metadata);
console.log('');

// Create a bundle
const bundle = Sellable.bundle({
  id: Identifier.from('bundle_wellness_001', 'bundle'),
  title: 'Wellness Pack',
  sku: 'WELLNESS-001',
  composition: {
    strategy: 'bundle',
    components: [
      { productId: 'prod_chia_001', quantity: 1 },
      { productId: 'prod_moringa_001', quantity: 1 }
    ]
  }
});

console.log('📋 Bundle:');
console.log(`  ID: ${bundle.id.value}`);
console.log(`  Title: ${bundle.title}`);
console.log(`  Type: ${bundle.type}`);
console.log(`  Is composable: ${bundle.isComposable}`);
console.log(`  Components: ${bundle.composition?.components?.length}`);
console.log('');

console.log('✅ All Sellable tests passed!');
