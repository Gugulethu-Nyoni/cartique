/**
 * ============================================================
 * Assertions — Decision validation engine
 * ============================================================
 */

export class AssertionResult {
  constructor(name, passed, expected, actual, message = '') {
    this.name = name;
    this.passed = passed;
    this.expected = expected;
    this.actual = actual;
    this.message = message;
  }
}

export function assertUnitPrice(resolution, expected) {
  const actual = resolution.pricing?.unitPrice || 0;
  const passed = actual === expected;
  return new AssertionResult(
    'Unit Price',
    passed,
    expected,
    actual,
    passed ? '' : `Expected ${expected}, got ${actual}`
  );
}

export function assertSubtotal(resolution, expected) {
  const actual = resolution.subtotal || 0;
  const passed = actual === expected;
  return new AssertionResult(
    'Subtotal',
    passed,
    expected,
    actual,
    passed ? '' : `Expected ${expected}, got ${actual}`
  );
}

export function assertTotal(resolution, expected) {
  const actual = resolution.total || 0;
  const passed = actual === expected;
  return new AssertionResult(
    'Total',
    passed,
    expected,
    actual,
    passed ? '' : `Expected ${expected}, got ${actual}`
  );
}

export function assertRuleApplied(resolution, ruleId) {
  const rules = resolution.pricing?.appliedRules || [];
  const actual = rules.some(r => r.type === ruleId || r.id === ruleId);
  const passed = actual === true;
  return new AssertionResult(
    `Rule: ${ruleId}`,
    passed,
    true,
    actual,
    passed ? '' : `Rule "${ruleId}" not found`
  );
}

export function assertRulesApplied(resolution, expectedRules) {
  const results = expectedRules.map(rule => assertRuleApplied(resolution, rule));
  const allPassed = results.every(r => r.passed);
  return new AssertionResult(
    `Rules: ${expectedRules.join(', ')}`,
    allPassed,
    expectedRules,
    resolution.pricing?.appliedRules || [],
    allPassed ? '' : `Missing: ${results.filter(r => !r.passed).map(r => r.name).join(', ')}`
  );
}

export function assertVariant(resolution, expectedVariantId) {
  const actual = resolution.variant?.id || 'none';
  const passed = actual === expectedVariantId;
  return new AssertionResult(
    'Variant',
    passed,
    expectedVariantId,
    actual,
    passed ? '' : `Expected ${expectedVariantId}, got ${actual}`
  );
}

export function assertValid(resolution, expected = true) {
  const actual = resolution.valid;
  const passed = actual === expected;
  return new AssertionResult(
    'Valid',
    passed,
    expected,
    actual,
    passed ? '' : `Expected ${expected}, got ${actual}`
  );
}

export function runAssertions(resolution, expectations) {
  const results = [];

  if (expectations.unitPrice !== undefined) {
    results.push(assertUnitPrice(resolution, expectations.unitPrice));
  }

  if (expectations.subtotal !== undefined) {
    results.push(assertSubtotal(resolution, expectations.subtotal));
  }

  if (expectations.total !== undefined) {
    results.push(assertTotal(resolution, expectations.total));
  }

  if (expectations.variant) {
    results.push(assertVariant(resolution, expectations.variant));
  }

  if (expectations.valid !== undefined) {
    results.push(assertValid(resolution, expectations.valid));
  }

  if (expectations.rules && expectations.rules.length > 0) {
    results.push(assertRulesApplied(resolution, expectations.rules));
  }

  return results;
}
