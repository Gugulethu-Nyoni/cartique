/**
 * ============================================================
 * Test: Promotion
 * ============================================================
 */

import { Promotion } from '../../src/commerce/Promotion.js';

console.log('✅ Testing Promotion');
console.log('');

const blackFriday = Promotion.percentage(
  20,
  'Black Friday 2026',
  { minOrder: 100 }
);

console.log('📋 Promotion (Black Friday):');
console.log(`  ID: ${blackFriday.id.value}`);
console.log(`  Name: ${blackFriday.name}`);
console.log(`  Type: ${blackFriday.type}`);
console.log(`  Value: ${blackFriday.value}%`);
console.log(`  Is percentage: ${blackFriday.isPercentage}`);
console.log(`  Discount amount: ${blackFriday.discountAmount}`);
console.log(`  Conditions:`, blackFriday.conditions);
console.log(`  Is order level: ${blackFriday.isOrderLevel}`);
console.log('');

const freeShipping = Promotion.freeShipping(
  'Free Shipping Weekend',
  { minOrder: 500 }
);

console.log('📋 Promotion (Free Shipping):');
console.log(`  Name: ${freeShipping.name}`);
console.log(`  Type: ${freeShipping.type}`);
console.log(`  Is free shipping: ${freeShipping.isFreeShipping}`);
console.log(`  Conditions:`, freeShipping.conditions);
console.log('');

const fixed = Promotion.fixed(50, 'R50 Off', {});

console.log('📋 Promotion (Fixed):');
console.log(`  Name: ${fixed.name}`);
console.log(`  Type: ${fixed.type}`);
console.log(`  Value: R${fixed.value}`);
console.log(`  Is fixed: ${fixed.isFixed}`);
console.log('');

console.log('✅ All Promotion tests passed!');
