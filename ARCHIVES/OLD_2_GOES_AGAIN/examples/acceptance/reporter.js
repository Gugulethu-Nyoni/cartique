/**
 * ============================================================
 * Reporter — Acceptance report generator
 * ============================================================
 */

export function printScenarioHeader(scenario) {
  console.log('');
  console.log('┌─────────────────────────────────────────────────────────────');
  console.log(`│ 🧪 ${scenario.name}`);
  if (scenario.category) console.log(`│ 📂 ${scenario.category}`);
  if (scenario.tags && scenario.tags.length > 0) console.log(`│ 🏷️  ${scenario.tags.join(', ')}`);
  console.log('├─────────────────────────────────────────────────────────────');
  console.log(`│ 📦 Product: ${scenario.given.product.metadata?.title || 'Unknown'}`);
  console.log(`│ 📋 Variant: ${scenario.given.variant || 'Default'}`);
  console.log(`│ 📊 Quantity: ${scenario.given.quantity}`);
  console.log(`│ 👤 Customer: ${scenario.given.customer.group || 'Unknown'}`);
  if (scenario.given.contexts && scenario.given.contexts.length > 0) {
    console.log(`│ 🎯 Contexts: ${scenario.given.contexts.map(c => c.name).join(', ')}`);
  }
  console.log('└─────────────────────────────────────────────────────────────');
}

export function printResolutionTree(resolution) {
  console.log('');
  console.log('┌─────────────────────────────────────────────────────────────');
  console.log('│ 📊 RESOLUTION TREE');
  console.log('├─────────────────────────────────────────────────────────────');

  const pricing = resolution.pricing || {};
  const tax = resolution.tax || {};
  const shipping = resolution.shipping || {};

  console.log(`│ 💰 Pricing:`);
  console.log(`│    Unit Price:    R${pricing.unitPrice || 0}`);
  console.log(`│    Subtotal:      R${resolution.subtotal || 0}`);
  if (pricing.appliedRules && pricing.appliedRules.length > 0) {
    const ruleNames = pricing.appliedRules.map(r => r.type || r.id || 'unknown').join(', ');
    console.log(`│    Rules:         ${ruleNames}`);
  }

  console.log(`│ 🧾 Tax:`);
  console.log(`│    Rate:          ${(tax.rate || 0) * 100}%`);
  console.log(`│    Amount:        R${tax.amount || 0}`);

  console.log(`│ 🚚 Shipping:`);
  console.log(`│    Method:        ${shipping.method || 'standard'}`);
  console.log(`│    Amount:        R${shipping.amount || 0}`);

  console.log(`│ 📦 Variant:`);
  console.log(`│    ID:            ${resolution.variant?.id || 'none'}`);
  console.log(`│    Title:         ${resolution.variant?.title || 'none'}`);

  console.log(`│ ✅ Validity:`);
  console.log(`│    Valid:         ${resolution.valid ? '✅' : '❌'}`);

  console.log('└─────────────────────────────────────────────────────────────');
}

export function printAssertionResults(results) {
  const passed = results.filter(r => r.passed);
  const failed = results.filter(r => !r.passed);

  console.log('');
  console.log('┌─────────────────────────────────────────────────────────────');
  console.log('│ 📋 ASSERTIONS');
  console.log('├─────────────────────────────────────────────────────────────');

  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    // Handle expected/actual values that might be objects
    const expectedStr = typeof r.expected === 'object' ? JSON.stringify(r.expected) : r.expected;
    const actualStr = typeof r.actual === 'object' ? JSON.stringify(r.actual) : r.actual;
    console.log(`│ ${icon} ${r.name.padEnd(25)} expected: ${expectedStr}, got: ${actualStr}`);
    if (!r.passed && r.message) {
      console.log(`│    ${r.message}`);
    }
  });

  console.log('├─────────────────────────────────────────────────────────────');
  console.log(`│ 📊 ${passed.length}/${results.length} passed`);
  if (failed.length > 0) {
    console.log(`│ ❌ ${failed.length} failed`);
  }
  console.log('└─────────────────────────────────────────────────────────────');

  return failed.length === 0;
}

export function printAcceptanceReport(summary) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 ACCEPTANCE REPORT');
  console.log('═══════════════════════════════════════════════════════════════');

  summary.categories.forEach(cat => {
    console.log('');
    console.log(`📂 ${cat.name}`);
    console.log(`   ${cat.passed}/${cat.total} passed`);
    if (cat.failed > 0) {
      console.log(`   ❌ ${cat.failed} failed`);
    }
  });

  console.log('');
  console.log('───────────────────────────────────────────────────────────────');
  console.log(`📊 TOTAL: ${summary.passed}/${summary.total} passed`);

  if (summary.passed === summary.total) {
    console.log('');
    console.log('✅ ALL TESTS PASSED — COMMERCE ACCEPTANCE CONFIRMED');
  } else {
    console.log('');
    console.log(`❌ ${summary.total - summary.passed} TESTS FAILED — REVIEW REQUIRED`);
  }
}
