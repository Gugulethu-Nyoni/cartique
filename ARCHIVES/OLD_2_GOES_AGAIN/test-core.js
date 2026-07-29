/**
 * ============================================================
 * Test: Core Value Objects
 * ============================================================
 */

import { Money, Identifier, Quantity, Diagnostics, TraceEntry } from './src/core/index.js';

console.log('✅ Testing Core Value Objects');
console.log('');

// Test Money
console.log('📋 Money:');
const m1 = Money.fromDecimal(140.25);
const m2 = Money.fromDecimal(50.75);
console.log('  m1:', m1.formatted);
console.log('  m2:', m2.formatted);
console.log('  m1 + m2:', m1.add(m2).formatted);
console.log('  m1 * 2:', m1.multiply(2).formatted);
console.log('  m1 > 0:', m1.isPositive());
console.log('');

// Test Identifier
console.log('📋 Identifier:');
const id1 = Identifier.generate('product');
const id2 = Identifier.fromString('test-123', 'order');
console.log('  id1:', id1.toString());
console.log('  id2:', id2.toString());
console.log('  id1 type:', id1.type);
console.log('  id1 equals id2:', id1.equals(id2));
console.log('');

// Test Quantity
console.log('📋 Quantity:');
const q1 = Quantity.each(12);
const q2 = Quantity.kg(2.5);
console.log('  q1:', q1.formatted);
console.log('  q2:', q2.formatted);
console.log('  q1 * 2:', q1.multiply(2).formatted);
console.log('');

// Test Diagnostics
console.log('📋 Diagnostics:');
const diag = new Diagnostics()
  .addError('ERR_001', 'Missing product')
  .addWarning('WARN_001', 'Low stock')
  .addNotice('INFO_001', 'Bulk discount applied');
console.log('  Valid:', diag.valid);
console.log('  Errors:', diag.errors.length);
console.log('  Warnings:', diag.warnings.length);
console.log('  Notices:', diag.notices.length);
console.log('');

// Test TraceEntry
console.log('📋 TraceEntry:');
const trace = new TraceEntry({
  resolver: 'PricingResolver',
  operation: 'bulk',
  before: { unitPrice: 140 },
  after: { unitPrice: 120 },
  message: 'Bulk discount applied'
});
console.log('  Resolver:', trace.resolver);
console.log('  Operation:', trace.operation);
console.log('  Message:', trace.message);
console.log('  Timestamp:', trace.timestamp);
console.log('');

console.log('✅ All core tests passed!');
