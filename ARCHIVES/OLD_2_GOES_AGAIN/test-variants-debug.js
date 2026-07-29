/**
 * ============================================================
 * Test: Variant Resolution with Debugging
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

console.log('✅ Testing Variant Resolution (Debug)');
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

const retailCustomer = createPersona({
  id: 'retail-customer',
  name: 'Retail Customer',
  group: 'retail',
  metadata: { requiresLogin: true }
});

const place = createPlace({
  id: 'za',
  name: 'South Africa',
  country: 'ZA',
  currency: 'ZAR',
  timezone: 'Africa/Johannesburg',
  tax: { vatRate: 0.15 },
  shipping: { defaultCost: 50 }
});

// ============================================================
// Test a single scenario with full debug
// ============================================================

console.log('📋 Debug: 1x 100g Chia Seeds');
console.log('─────────────────────────────');

const configuration = {
  quantity: 1,
  selections: { weight: '100g' }
};

console.log('Input:');
console.log('  Product ID:', ChiaSeeds.id);
console.log('  Product Variants:', ChiaSeeds.variants.length);
console.log('  Customer Group:', retailCustomer.group);
console.log('  Configuration:', JSON.stringify(configuration, null, 2));
console.log('');

const result = compiler.compile({
  product: ChiaSeeds,
  customer: retailCustomer,
  place: place,
  configuration: configuration,
  contexts: [],
  metadata: { now: new Date() }
});

console.log('Result:');
console.log('  Valid:', result.valid);
console.log('  Errors:', JSON.stringify(result.errors, null, 2));
console.log('  Resolved:', JSON.stringify(result.resolved, null, 2));
console.log('');

// Check what happened in each step
console.log('Pipeline State:');
console.log('  Product variants exist:', !!result.input?.product?.variants);
console.log('  Selected variant:', result.resolved?.selections?.variant?.id || 'none');
console.log('  Variant pricing:', result.resolved?.selections?.variant?.pricing || 'none');
console.log('  Product pricing:', result.product?.pricing || 'none');
console.log('');

console.log('✅ Debug complete');
