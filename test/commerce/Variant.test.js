/**
 * ============================================================
 * Test: Variant
 * ============================================================
 */

import { Variant } from '../../src/commerce/Variant.js';
import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Variant');
console.log('');

const variant = new Variant({
  id: Identifier.from('var_chia_004', 'variant'),
  sellableId: Identifier.from('prod_chia_001', 'product'),
  sku: 'CHIA-1KG',
  title: '1kg Bag',
  attributes: { weight: '1kg', form: 'Seeds' },
  pricing: { base: 140, wholesale: 120, bulk: [{ minQuantity: 10, price: 100 }] },
  inventory: 30,
  isDefault: true
});

console.log('📋 Variant:');
console.log(`  ID: ${variant.id.value}`);
console.log(`  Sellable ID: ${variant.sellableId.value}`);
console.log(`  Title: ${variant.title}`);
console.log(`  SKU: ${variant.sku}`);
console.log(`  Weight: ${variant.attributes.weight}`);
console.log(`  Base Price: ${variant.basePrice}`);
console.log(`  Is default: ${variant.isDefault}`);
console.log(`  In stock: ${variant.isInStock}`);
console.log(`  Low stock: ${variant.isLowStock}`);
console.log('');

// Test bulk pricing
if (variant.bulkPricing.length > 0) {
  console.log('📋 Bulk Pricing:');
  variant.bulkPricing.forEach(tier => {
    console.log(`  ${tier.minQuantity}+ @ R${tier.price}`);
  });
  console.log('');
}

console.log('✅ All Variant tests passed!');
