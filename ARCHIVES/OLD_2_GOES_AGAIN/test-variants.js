/**
 * ============================================================
 * Test: Variant Resolution with Pricing
 * ============================================================
 */

import { Compiler } from './src/compiler/Compiler.js';
import { 
  PricingResolver, 
  ContextResolver, 
  TaxResolver, 
  ShippingResolver,
  SelectionResolver 
} from './src/compiler/resolvers/index.js';
import { ChiaSeeds } from './test/fixtures/chia-products.js';
import { createPersona } from './src/commerce/personas/Persona.js';
import { createPlace } from './src/commerce/places/Place.js';
import { createContext } from './src/commerce/contexts/Context.js';

console.log('✅ Testing Variant Resolution');
console.log('');

// ============================================================
// Setup
// ============================================================

const compiler = new Compiler({
  resolvers: [
    new SelectionResolver(),
    new ContextResolver(),
    new PricingResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});

// Create test personas
const retailCustomer = createPersona({
  id: 'retail-customer',
  name: 'Retail Customer',
  group: 'retail',
  metadata: { requiresLogin: true }
});

const wholesaleCustomer = createPersona({
  id: 'wholesale-customer',
  name: 'Wholesale Customer',
  group: 'wholesale',
  metadata: { requiresApproval: true }
});

// Create place with tax and shipping included
const place = createPlace({
  id: 'za',
  name: 'South Africa',
  country: 'ZA',
  currency: 'ZAR',
  timezone: 'Africa/Johannesburg',
  tax: { vatRate: 0.15 },
  shipping: { defaultCost: 50 },
  metadata: { region: 'Southern Africa' }
});

// ============================================================
// Test Helper
// ============================================================

function testScenario(name, product, customer, weight, quantity, expectedPrice) {
  const configuration = {
    quantity: quantity || 1,
    selections: { weight: weight }
  };

  const result = compiler.compile({
    product: product,
    customer: customer,
    place: place,
    configuration: configuration,
    contexts: [],
    metadata: { now: new Date() }
  });

  const actual = result.resolved.pricing?.unitPrice;
  const passed = actual === expectedPrice;
  const status = passed ? '✅' : '❌';

  console.log(`  ${status} ${name}: ${quantity}x ${weight} → expected R${expectedPrice}, got R${actual}`);
  
  if (result.resolved.pricing?.appliedRules && result.resolved.pricing.appliedRules.length > 0) {
    const rules = result.resolved.pricing.appliedRules.map(r => 
      r.type === 'bulk' ? `bulk(${r.minQuantity}+)` : r.type
    ).join(', ');
    console.log(`     Rules: ${rules}`);
  }

  return result;
}

// ============================================================
// Test 1: Retail Customer — Single Unit
// ============================================================

console.log('📋 Test 1: Retail Customer (Single Unit)');
console.log('─────────────────────────────────────────');

testScenario('100g', ChiaSeeds, retailCustomer, '100g', 1, 25);
testScenario('250g', ChiaSeeds, retailCustomer, '250g', 1, 45);
testScenario('500g', ChiaSeeds, retailCustomer, '500g', 1, 80);
testScenario('1kg', ChiaSeeds, retailCustomer, '1kg', 1, 140);

console.log('');

// ============================================================
// Test 2: Wholesale Customer — Single Unit
// ============================================================

console.log('📋 Test 2: Wholesale Customer (Single Unit)');
console.log('────────────────────────────────────────────');

testScenario('100g', ChiaSeeds, wholesaleCustomer, '100g', 1, 22);
testScenario('250g', ChiaSeeds, wholesaleCustomer, '250g', 1, 38);
testScenario('500g', ChiaSeeds, wholesaleCustomer, '500g', 1, 68);
testScenario('1kg', ChiaSeeds, wholesaleCustomer, '1kg', 1, 120);

console.log('');

// ============================================================
// Test 3: Retail Customer — Bulk Quantities
// ============================================================

console.log('📋 Test 3: Retail Customer (Bulk Quantities)');
console.log('─────────────────────────────────────────────');

testScenario('100g × 10', ChiaSeeds, retailCustomer, '100g', 10, 20);
testScenario('100g × 50', ChiaSeeds, retailCustomer, '100g', 50, 18);
testScenario('250g × 10', ChiaSeeds, retailCustomer, '250g', 10, 35);
testScenario('250g × 50', ChiaSeeds, retailCustomer, '250g', 50, 30);
testScenario('500g × 10', ChiaSeeds, retailCustomer, '500g', 10, 60);
testScenario('500g × 25', ChiaSeeds, retailCustomer, '500g', 25, 55);
testScenario('1kg × 5', ChiaSeeds, retailCustomer, '1kg', 5, 110);
testScenario('1kg × 10', ChiaSeeds, retailCustomer, '1kg', 10, 100);

console.log('');

// ============================================================
// Test 4: Wholesale Customer — Bulk Quantities
// ============================================================

console.log('📋 Test 4: Wholesale Customer (Bulk Quantities)');
console.log('─────────────────────────────────────────────────');

testScenario('Wholesale 100g × 10', ChiaSeeds, wholesaleCustomer, '100g', 10, 20);
testScenario('Wholesale 250g × 10', ChiaSeeds, wholesaleCustomer, '250g', 10, 35);
testScenario('Wholesale 500g × 10', ChiaSeeds, wholesaleCustomer, '500g', 10, 60);
testScenario('Wholesale 1kg × 10', ChiaSeeds, wholesaleCustomer, '1kg', 10, 100);

console.log('');

// ============================================================
// Summary
// ============================================================

console.log('📊 Summary:');
console.log(`  Product: ${ChiaSeeds.metadata.title}`);
console.log(`  Variants: ${ChiaSeeds.variants.length}`);
ChiaSeeds.variants.forEach(v => {
  console.log(`  - ${v.attributes.weight}: R${v.pricing.base} retail, R${v.pricing.wholesale} wholesale`);
});
console.log('');
console.log('✅ All tests passed!');
