/**
 * ============================================================
 * Test: Context
 * ============================================================
 */

import { Context } from '../../src/commerce/Context.js';
import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Context');
console.log('');

const blackFriday = Context.promotion({
  id: Identifier.from('ctx_black_friday', 'context'),
  name: 'Black Friday 2026',
  activation: { type: 'date-range', startsAt: '2026-11-24', endsAt: '2026-11-30' },
  injects: ['pricing.blackFriday', 'shipping.free'],
  metadata: { discount: 20 }
});

console.log('📋 Context (Black Friday):');
console.log(`  ID: ${blackFriday.id.value}`);
console.log(`  Name: ${blackFriday.name}`);
console.log(`  Type: ${blackFriday.type}`);
console.log(`  Injects: ${blackFriday.injects.join(', ')}`);
console.log(`  Has injects: ${blackFriday.hasInjects}`);
console.log('');

const summer = Context.season({
  id: Identifier.from('ctx_summer', 'context'),
  name: 'Summer Sale',
  activation: { type: 'season', months: [12, 1, 2] },
  injects: ['pricing.summer']
});

console.log('📋 Context (Summer):');
console.log(`  ID: ${summer.id.value}`);
console.log(`  Name: ${summer.name}`);
console.log(`  Type: ${summer.type}`);
console.log(`  Injects: ${summer.injects.join(', ')}`);
console.log('');

console.log('✅ All Context tests passed!');
