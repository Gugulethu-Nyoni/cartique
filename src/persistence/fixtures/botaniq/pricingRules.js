/**
 * ============================================================
 * Fixture: Pricing Rules
 * ============================================================
 */

export const pricingRules = [
  { id: 1001, variantId: 101, type: 'base', priority: 10, price: 25.00, conditions: {} },
  { id: 1002, variantId: 101, type: 'customer_group', priority: 50, price: 22.00, conditions: { customerGroup: 'wholesale' } },
  { id: 1003, variantId: 101, type: 'bulk', priority: 60, price: 20.00, conditions: { minQuantity: 10 } },
  { id: 1004, variantId: 104, type: 'base', priority: 10, price: 140.00, conditions: {} },
  { id: 1005, variantId: 104, type: 'customer_group', priority: 50, price: 120.00, conditions: { customerGroup: 'wholesale' } },
  { id: 1006, variantId: 104, type: 'bulk', priority: 60, price: 110.00, conditions: { minQuantity: 5 } },
  { id: 1007, variantId: 104, type: 'bulk', priority: 70, price: 100.00, conditions: { minQuantity: 10 } }
];
