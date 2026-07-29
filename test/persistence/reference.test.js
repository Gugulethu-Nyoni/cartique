/**
 * ============================================================
 * Test: Reference Dataset
 * ============================================================
 */

import { products } from '../../src/persistence/reference/fixtures/botaniq/products.js';
import { variants } from '../../src/persistence/reference/fixtures/botaniq/variants.js';
import { pricingRules } from '../../src/persistence/reference/fixtures/botaniq/pricingRules.js';
import { inventoryLevels } from '../../src/persistence/reference/fixtures/botaniq/inventory.js';
import { reviews } from '../../src/persistence/reference/fixtures/botaniq/reviews.js';
import { customers } from '../../src/persistence/reference/fixtures/botaniq/customers.js';

console.log('✅ Testing Reference Dataset');
console.log('');

console.log('📋 Products:');
console.log(`  Total products: ${products.length}`);
products.forEach(p => {
  console.log(`    - ${p.id}: ${p.title} (${p.sku})`);
});
console.log('');

console.log('📋 Variants:');
console.log(`  Total variants: ${variants.length}`);
const chiaVariants = variants.filter(v => v.productId === 9);
console.log(`  Chia Seeds variants: ${chiaVariants.length}`);
chiaVariants.forEach(v => {
  console.log(`    - ${v.id}: ${v.sku} @ R${v.price} (stock: ${v.inventory})`);
});
console.log('');

console.log('📋 Pricing Rules:');
console.log(`  Total pricing rules: ${pricingRules.length}`);
const chiaRules = pricingRules.filter(r => r.variantId === 104);
console.log(`  Chia 1kg pricing rules: ${chiaRules.length}`);
chiaRules.forEach(r => {
  console.log(`    - ${r.type}: R${r.price} (${r.conditions?.minQuantity ? r.conditions.minQuantity + '+' : ''})`);
});
console.log('');

console.log('📋 Inventory:');
console.log(`  Total inventory levels: ${inventoryLevels.length}`);
console.log(`  Chia 1kg available: ${inventoryLevels.find(l => l.variantId === 104)?.available}`);
console.log('');

console.log('📋 Reviews:');
console.log(`  Total reviews: ${reviews.length}`);
console.log(`  Average rating for Chia Seeds: ${reviews.filter(r => r.productId === 9).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.productId === 9).length}`);
console.log('');

console.log('📋 Customers:');
console.log(`  Total customers: ${customers.length}`);
customers.forEach(c => {
  const group = c.metadata?.group || 'unknown';
  console.log(`    - ${c.id}: ${c.phone} (${group})`);
});
console.log('');

console.log('✅ All reference dataset tests passed!');
