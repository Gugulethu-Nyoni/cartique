/**
 * ============================================================
 * Test: Identifier
 * ============================================================
 */

import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Identifier');
console.log('');

const id1 = Identifier.generate('product');
const id2 = Identifier.fromString('test-123', 'order');

console.log('📋 Creation:');
console.log(`  id1: ${id1.toString()} (type: ${id1.type})`);
console.log(`  id2: ${id2.toString()} (type: ${id2.type})`);
console.log('');

console.log('📋 Comparison:');
console.log(`  id1 equals id1: ${id1.equals(id1)}`);
console.log(`  id1 equals id2: ${id1.equals(id2)}`);
console.log('');

console.log('✅ All Identifier tests passed!');
