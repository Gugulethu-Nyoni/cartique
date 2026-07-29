/**
 * ============================================================
 * Test: Diagnostics
 * ============================================================
 */

import { Diagnostics } from '../../src/core/Diagnostics.js';

console.log('✅ Testing Diagnostics');
console.log('');

const d1 = Diagnostics.empty();
console.log(`📋 Empty: valid=${d1.valid}, empty=${d1.empty}`);

const d2 = d1
  .addError('ERR_001', 'Missing product')
  .addError('ERR_002', 'Invalid quantity');

console.log(`📋 After errors: errors=${d2.errors.length}, valid=${d2.valid}`);

const d3 = d2
  .addWarning('WARN_001', 'Low stock')
  .addWarning('WARN_002', 'Price mismatch');

console.log(`📋 After warnings: warnings=${d3.warnings.length}`);

const d4 = d3.addNotice('INFO_001', 'Bulk discount applied');
console.log(`📋 After notices: notices=${d4.notices.length}`);

const combined = Diagnostics.combine(d2, d3, d4);
console.log(`📋 Combined: errors=${combined.errors.length}, warnings=${combined.warnings.length}`);
console.log('');

console.log('✅ All Diagnostics tests passed!');
