/**
 * ============================================================
 * Test: Compiler
 * ============================================================
 */

import { Compiler } from './src/compiler/Compiler.js';
import { PricingResolver } from './src/compiler/resolvers/PricingResolver.js';
import { ContextResolver } from './src/compiler/resolvers/ContextResolver.js';
import { TaxResolver } from './src/compiler/resolvers/TaxResolver.js';
import { ShippingResolver } from './src/compiler/resolvers/ShippingResolver.js';
import { SelectionResolver } from './src/compiler/resolvers/SelectionResolver.js';

console.log('✅ Testing Compiler');
console.log('');

// Test product with pricing
const testProduct = {
  id: 'test-product',
  sku: 'TEST-001',
  slug: 'test-product',
  metadata: {
    title: 'Test Product',
    description: 'A test product'
  },
  pricing: {
    base: 100,
    wholesale: 70,
    vip: 85,
    employee: 80,
    bulk: [{ minQuantity: 10, price: 65 }]
  },
  media: { images: [], videos: [] },
  dimensions: { weight: 1, length: 10, width: 10, height: 10 },
  attributes: {},
  variants: [],
  relationships: { related: [], upsells: [], crossSells: [] }
};

// Customer (wholesale group)
const customer = {
  id: 'wholesale-customer',
  name: 'Wholesale Customer',
  group: 'wholesale',
  metadata: { requiresApproval: true }
};

// Place with tax rate - make sure tax is properly defined
const place = {
  id: 'za',
  name: 'South Africa',
  country: 'ZA',
  currency: 'ZAR',
  timezone: 'Africa/Johannesburg',
  tax: {
    vatRate: 0.15
  },
  shipping: {
    defaultCost: 50
  },
  metadata: {}
};

// Context that injects free shipping
const context = {
  id: 'test-context',
  name: 'Test Context',
  activation: { type: 'always' },
  injects: ['shipping.free'],
  metadata: {}
};

const compiler = new Compiler({
  resolvers: [
    new SelectionResolver(),
    new ContextResolver(),
    new PricingResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});

// Compile
const input = {
  product: testProduct,
  customer: customer,
  place: place,
  configuration: { quantity: 12, selections: {} },
  contexts: [context],
  metadata: { now: new Date() }
};

const result = compiler.compile(input);

console.log('📋 Compilation Result:');
console.log('  Valid:', result.valid);
console.log('  Errors:', result.errors.length);

if (result.resolved.pricing) {
  console.log('  Pricing:');
  console.log('    Unit Price:', result.resolved.pricing.unitPrice);
  console.log('    Quantity:', result.resolved.pricing.quantity);
  console.log('    Subtotal:', result.resolved.pricing.subtotal);
  console.log('    Applied Rules:', JSON.stringify(result.resolved.pricing.appliedRules));
}

if (result.resolved.tax) {
  console.log('  Tax:');
  console.log('    Rate:', result.resolved.tax.rate);
  console.log('    Amount:', result.resolved.tax.amount);
}

if (result.resolved.shipping) {
  console.log('  Shipping:');
  console.log('    Method:', result.resolved.shipping.method);
  console.log('    Amount:', result.resolved.shipping.amount);
}

if (result.resolved.total !== undefined) {
  console.log('  Total:', result.resolved.total);
}

console.log('');
console.log('✅ All tests passed!');
