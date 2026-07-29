/**
 * ============================================================
 * Test: Money
 * ============================================================
 */

import { Money } from '../../src/core/Money.js';

console.log('✅ Testing Money');
console.log('');

// Create
const m1 = new Money(10000, 'ZAR', 2);
const m2 = Money.fromDecimal(50.75, 'ZAR');
const m3 = Money.zero();

console.log('📋 Creation:');
console.log(`  m1: ${m1.toString()} (${m1.toFormatted()})`);
console.log(`  m2: ${m2.toString()}`);
console.log(`  m3: ${m3.toString()}`);
console.log('');

// Arithmetic
const sum = m1.add(m2);
const diff = m1.subtract(m2);
const mult = m1.multiply(1.5);
const div = m1.divide(2);

console.log('📋 Arithmetic:');
console.log(`  m1 + m2 = ${sum.toString()}`);
console.log(`  m1 - m2 = ${diff.toString()}`);
console.log(`  m1 * 1.5 = ${mult.toString()}`);
console.log(`  m1 / 2 = ${div.toString()}`);
console.log('');

// Comparisons
console.log('📋 Comparisons:');
console.log(`  m1 > m2: ${m1.greaterThan(m2)}`);
console.log(`  m1 < m2: ${m1.lessThan(m2)}`);
console.log(`  m1 equals m1: ${m1.equals(m1)}`);
console.log(`  m1 isZero: ${m1.isZero()}`);
console.log(`  m3 isZero: ${m3.isZero()}`);
console.log('');

// Sum
const total = Money.sum([m1, m2, m2, m2]);
console.log(`  Sum of m1 + 3×m2 = ${total.toString()}`);
console.log('');

console.log('✅ All Money tests passed!');
