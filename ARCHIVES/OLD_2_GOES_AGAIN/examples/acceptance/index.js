/**
 * ============================================================
 * Cartique Commercial Acceptance Suite
 * ============================================================
 */

import { createRunner } from './runner.js';
import { printAcceptanceReport } from './reporter.js';
import { botaniqScenarios } from './golden/botaniq.js';

console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('🧪 Cartique Commercial Acceptance Suite');
console.log('═══════════════════════════════════════════════════════════════');

const runner = createRunner({ verbose: true });

// Run Botaniq scenarios
botaniqScenarios.forEach(scenario => {
  runner.run(scenario);
});

// Print report
const summary = runner.getSummary();
printAcceptanceReport(summary);

process.exit(summary.failed === 0 ? 0 : 1);
