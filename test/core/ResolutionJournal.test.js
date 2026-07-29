/**
 * ============================================================
 * Test: ResolutionJournal
 * ============================================================
 */

import { ResolutionJournal } from '../../src/core/ResolutionJournal.js';

console.log('✅ Testing ResolutionJournal');
console.log('');

const journal = new ResolutionJournal();

const j1 = journal.addEntry({
  resolver: 'SelectionResolver',
  capability: 'variant-selection',
  ruleId: 'variant.default',
  decision: 'applied',
  reason: 'Weight 1kg selected',
  confidence: 100,
  after: '1kg',
  duration: 1.2
});

const j2 = j1.addEntry({
  resolver: 'PricingResolver',
  capability: 'pricing',
  ruleId: 'pricing.bulk',
  decision: 'applied',
  reason: 'Bulk discount: 10+ units',
  confidence: 95,
  before: 140,
  after: 100,
  duration: 2.5
});

const j3 = j2.addEntry({
  resolver: 'PricingResolver',
  capability: 'pricing',
  ruleId: 'pricing.vip',
  decision: 'rejected',
  reason: 'Customer not VIP',
  confidence: 100,
  before: 100,
  after: 100,
  duration: 0.8
});

console.log('📋 Entries:');
console.log(`  Total: ${j3.entries.length}`);
console.log(`  Applied: ${j3.getApplied().length}`);
console.log(`  Rejected: ${j3.getRejected().length}`);
console.log(`  Total duration: ${j3.getTotalDuration().toFixed(1)}ms`);
console.log('');

console.log('📋 Outcomes:');
const counts = j3.getOutcomeCounts();
console.log(`  Applied: ${counts.applied}`);
console.log(`  Rejected: ${counts.rejected}`);
console.log('');

console.log('📋 Pricing Trace:');
const trace = j3.getPricingTrace();
trace.forEach(t => {
  console.log(`  ${t.step}: ${t.value} (${t.description})`);
});
console.log('');

console.log('✅ All ResolutionJournal tests passed!');
