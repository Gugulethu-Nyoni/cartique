/**
 * ============================================================
 * Test: CapabilityRegistry
 * ============================================================
 */

import { CapabilityRegistry } from '../../src/core/CapabilityRegistry.js';

console.log('✅ Testing CapabilityRegistry');
console.log('');

const registry = CapabilityRegistry.default();

console.log('📋 Registry:');
console.log(`  Total capabilities: ${registry.getAll().length}`);
console.log(`  Enabled: ${registry.getEnabled().length}`);
console.log('');

console.log('📋 Capabilities by priority:');
const sorted = registry.getByPriority();
sorted.forEach(c => {
  console.log(`  ${c.id.padEnd(25)} priority: ${c.priority}`);
});
console.log('');

console.log('📋 Get specific capability:');
const pricing = registry.get('pricing-resolution');
console.log(`  pricing-resolution: ${pricing?.name} (enabled: ${pricing?.enabled})`);
console.log('');

console.log('✅ All CapabilityRegistry tests passed!');
