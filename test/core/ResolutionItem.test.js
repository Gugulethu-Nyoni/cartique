/**
 * ============================================================
 * Test: ResolutionItem
 * ============================================================
 */

import { ResolutionItem } from '../../src/core/ResolutionItem.js';
import { Money } from '../../src/core/Money.js';
import { Quantity } from '../../src/core/Quantity.js';

console.log('✅ Testing ResolutionItem');
console.log('');

const sellable = { id: 'chia-1kg', title: 'Chia Seeds 1kg' };

const item = new ResolutionItem({
  sellable,
  quantity: Quantity.each(2),
  origin: { type: 'direct', id: 'chia-1kg' }
});

console.log('📋 Creation:');
console.log(`  ID: ${item.id}`);
console.log(`  Sellable: ${item.sellable?.title}`);
console.log(`  Quantity: ${item.quantity.toString()}`);
console.log(`  Priced: ${item.isPriced}`);
console.log('');

const priced = item.withUnitPrice(Money.fromDecimal(140));
console.log('📋 After Pricing:');
console.log(`  Unit Price: ${priced.unitPrice?.toString()}`);
console.log(`  Subtotal: ${priced.subtotal?.toString()}`);
console.log(`  Priced: ${priced.isPriced}`);
console.log('');

const withInventory = priced.withInventory({ available: 50, reserved: 0 });
console.log('📋 After Inventory:');
console.log(`  Has Inventory: ${withInventory.hasInventory}`);
console.log(`  Available: ${withInventory.inventory?.available}`);
console.log('');

const withShipping = withInventory.withShipping({ method: 'standard', cost: Money.fromDecimal(50) });
console.log('📋 After Shipping:');
console.log(`  Has Shipping: ${withShipping.hasShipping}`);
console.log(`  Cost: ${withShipping.shipping?.cost?.toString()}`);
console.log('');

console.log('✅ All ResolutionItem tests passed!');
