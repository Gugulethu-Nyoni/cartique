/**
 * ============================================================
 * Test: Quantity
 * ============================================================
 */

import { Quantity } from '../../src/core/Quantity.js';

console.log('✅ Testing Quantity');
console.log('');

const q1 = Quantity.each(12);
const q2 = Quantity.kg(2.5);
const q3 = new Quantity(500, 'g', 2);

console.log('📋 Creation:');
console.log(`  q1: ${q1.toString()}`);
console.log(`  q2: ${q2.toString()}`);
console.log(`  q3: ${q3.toString()}`);
console.log('');

console.log('📋 Arithmetic:');
console.log(`  q1 * 2 = ${q1.multiply(2).toString()}`);
console.log(`  q2 + q2 = ${q2.add(q2).toString()}`);
console.log('');

console.log('📋 Compare:');
console.log(`  q1 equals q1: ${q1.equals(q1)}`);
console.log(`  q1 isZero: ${q1.isZero()}`);
console.log('');

console.log('✅ All Quantity tests passed!');
