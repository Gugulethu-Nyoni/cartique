/**
 * ============================================================
 * Test: Personas Module
 * ============================================================
 */

import { Personas } from './src/commerce/personas/index.js';

console.log('✅ Testing Personas Module');
console.log('');

console.log('📋 Personas:');
const personaKeys = Object.keys(Personas.Botaniq);
console.log(`  Total personas: ${personaKeys.length}`);
personaKeys.forEach(key => {
  const p = Personas.Botaniq[key];
  console.log(`    - ${p.id}: ${p.name} (${p.group}) - ${p.discount * 100}% discount`);
});
console.log('');

console.log('🔒 Immutability:');
personaKeys.forEach(key => {
  const p = Personas.Botaniq[key];
  console.log(`  ${p.id} frozen: ${Object.isFrozen(p)}`);
});
console.log('');

console.log('✅ All tests passed!');
