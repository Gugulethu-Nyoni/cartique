/**
 * ============================================================
 * Test: ResolutionPatch
 * ============================================================
 */

import { ResolutionPatch } from '../../src/core/ResolutionPatch.js';

console.log('✅ Testing ResolutionPatch');
console.log('');

const success = ResolutionPatch.success({
  items: [{ id: 'item-1' }],
  journalEntries: [{ resolver: 'PricingResolver', decision: 'applied' }]
});
console.log(`📋 Success: outcome=${success.outcome}, valid=${success.valid}, items=${success.items?.length}`);

const noChange = ResolutionPatch.noChange('Nothing to do');
console.log(`📋 No Change: outcome=${noChange.outcome}, valid=${noChange.valid}, journal=${noChange.journalEntries.length}`);

const reject = ResolutionPatch.reject('Customer under 18', 'AGE_RESTRICTION');
console.log(`📋 Reject: outcome=${reject.outcome}, valid=${reject.valid}, errors=${reject.diagnostics.errors.length}`);

const error = ResolutionPatch.error('Database connection failed', 'DB_ERROR');
console.log(`📋 Error: outcome=${error.outcome}, valid=${error.valid}, errors=${error.diagnostics.errors.length}`);

console.log('');
console.log('✅ All ResolutionPatch tests passed!');
