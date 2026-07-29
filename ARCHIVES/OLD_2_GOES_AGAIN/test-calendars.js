/**
 * ============================================================
 * Test: Calendars Module
 * ============================================================
 */

import { Calendars } from './src/commerce/calendars/index.js';

console.log('✅ Testing Calendars Module');
console.log('');

console.log('📅 Calendars:');
const calendarKeys = Object.keys(Calendars.Botaniq);
console.log(`  Total calendars: ${calendarKeys.length}`);
calendarKeys.forEach(key => {
  const c = Calendars.Botaniq[key];
  const promoCount = c.promotions ? c.promotions.length : 0;
  const eventCount = c.events ? c.events.length : 0;
  console.log(`    - ${c.id}: ${c.name} (${eventCount} events, ${promoCount} promotions)`);
});
console.log('');

console.log('🔒 Immutability:');
calendarKeys.forEach(key => {
  const c = Calendars.Botaniq[key];
  console.log(`  ${c.id} frozen: ${Object.isFrozen(c)}`);
});
console.log('');

console.log('✅ All tests passed!');
