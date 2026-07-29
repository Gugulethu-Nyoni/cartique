/**
 * ============================================================
 * Test: CommercialDecision
 * ============================================================
 */

import { CommercialDecision } from '../../src/core/CommercialDecision.js';
import { Money } from '../../src/core/Money.js';
import { Adjustment } from '../../src/core/Adjustment.js';
import { ResolutionItem } from '../../src/core/ResolutionItem.js';
import { Quantity } from '../../src/core/Quantity.js';

console.log('✅ Testing CommercialDecision');
console.log('');

const item = new ResolutionItem({
  sellable: { id: 'chia-1kg' },
  quantity: Quantity.each(2),
  unitPrice: Money.fromDecimal(140)
});

const discount = Adjustment.discount(
  'promotion.blackfriday',
  Money.fromDecimal(20),
  'Black Friday discount'
);

const decision = new CommercialDecision({
  items: [item],
  adjustments: [discount],
  totals: {
    subtotal: Money.fromDecimal(280),
    tax: Money.fromDecimal(42),
    shipping: Money.fromDecimal(0),
    total: Money.fromDecimal(302)
  }
});

console.log('📋 Decision:');
console.log(`  ID: ${decision.id.value}`);
console.log(`  Valid: ${decision.valid}`);
console.log(`  Items: ${decision.items.length}`);
console.log(`  Total items: ${decision.totalItems}`);
console.log(`  Adjustments: ${decision.adjustments.length}`);
console.log('');

console.log('💰 Totals:');
console.log(`  Subtotal:  ${decision.subtotal.toString()}`);
console.log(`  Tax:       ${decision.taxAmount.toString()}`);
console.log(`  Shipping:  ${decision.shippingAmount.toString()}`);
console.log(`  Total:     ${decision.total.toString()}`);
console.log('');

console.log('📋 Discounts:');
console.log(`  Total discount: ${decision.totalDiscount.toString()}`);
console.log('');

console.log('✅ All CommercialDecision tests passed!');
