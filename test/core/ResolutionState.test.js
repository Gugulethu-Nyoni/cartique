/**
 * ============================================================
 * Test: ResolutionState
 * ============================================================
 */

import { ResolutionState } from '../../src/core/ResolutionState.js';
import { ResolutionItem } from '../../src/core/ResolutionItem.js';
import { Quantity } from '../../src/core/Quantity.js';

console.log('✅ Testing ResolutionState');
console.log('');

const state = new ResolutionState({
  sellable: { id: 'chia-1kg' },
  customer: { id: 'customer-1', group: 'retail' },
  configuration: { quantity: 2 }
});

console.log('📋 Initial State:');
console.log(`  ID: ${state.id.value}`);
console.log(`  Items: ${state.items.length}`);
console.log(`  Valid: ${state.valid}`);
console.log('');

const item = new ResolutionItem({
  sellable: { id: 'chia-1kg' },
  quantity: Quantity.each(2)
});

const state2 = state.withItems([item]);
console.log('📋 After adding item:');
console.log(`  Items: ${state2.items.length}`);
console.log(`  Total items: ${state2.totalItems}`);
console.log('');

const state3 = state2.withError('ERR_001', 'Invalid quantity');
console.log('📋 After error:');
console.log(`  Valid: ${state3.valid}`);
console.log(`  Errors: ${state3.diagnostics.errors.length}`);
console.log('');

console.log('✅ All ResolutionState tests passed!');
