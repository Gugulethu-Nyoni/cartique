/**
 * ============================================================
 * Example: Subscriptions — Checkout Flow
 * ============================================================
 *
 * Scenario: Enterprise customer buys yearly subscription
 * ============================================================
 */

import { CommerceResolver } from '../../src/resolution/CommerceResolver.js';
import { CommerceRuntime } from '../../src/runtime/CommerceRuntime.js';
import { 
  SelectionResolver,
  ContextResolver,
  PricingResolver,
  TaxResolver,
  ShippingResolver 
} from '../../src/resolution/resolvers/index.js';

import { createPersona } from '../../src/commerce/personas/Persona.js';
import { createPlace } from '../../src/commerce/places/Place.js';

import { CRMPlan } from './catalog/products.js';

console.log('==================================================');
console.log('Subscriptions Example: SaaS CRM Purchase');
console.log('==================================================');
console.log('');

// 1. Create customer
const enterpriseCustomer = createPersona({
  id: 'enterprise-customer',
  name: 'Enterprise Customer',
  group: 'enterprise',
  metadata: {
    requiresApproval: true,
    accountManager: 'Sarah Johnson'
  }
});

// 2. Create place (UK)
const place = createPlace({
  id: 'uk',
  name: 'United Kingdom',
  country: 'GB',
  currency: 'GBP',
  timezone: 'Europe/London',
  tax: { vatRate: 0.20 },
  shipping: { defaultCost: 0 }, // Digital product, no shipping
  metadata: { region: 'Western Europe' }
});

// 3. Create resolver
const resolver = new CommerceResolver({
  resolvers: [
    new SelectionResolver(),
    new ContextResolver(),
    new PricingResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});

console.log('📦 Product: CRM Subscription');
console.log('👤 Customer: Enterprise');
console.log('📋 Configuration: Enterprise Plan (Yearly)');
console.log('');

// 4. Resolve
const resolution = resolver.resolve({
  product: CRMPlan,
  customer: enterpriseCustomer,
  place: place,
  configuration: {
    quantity: 1,
    selections: { plan: 'Enterprise' }
  },
  contexts: [],
  metadata: {
    now: new Date(),
    billingInterval: 'yearly'  // Custom metadata for subscriptions
  }
});

console.log('📊 Resolution:');
console.log(`  Valid: ${resolution.valid}`);
console.log(`  Plan: ${resolution.variant?.attributes?.plan}`);
console.log(`  Unit Price: ${resolution.pricing?.unitPrice || 0} GBP`);
console.log(`  Subtotal: ${resolution.pricing?.subtotal || 0} GBP`);
console.log(`  Tax: ${resolution.tax?.amount || 0} GBP`);
console.log(`  Total: ${resolution.total?.amount || 0} GBP`);
console.log('');

// 5. Runtime
const runtime = new CommerceRuntime();
const checkout = runtime.checkout(resolution);

// 6. Projections
import { OrderDTO } from '../../src/projections/api/OrderDTO.js';

const orderDto = OrderDTO.project(checkout);

console.log('💳 Checkout:');
console.log(`  Status: ${checkout.status}`);
console.log(`  Total: ${checkout.total?.amount || 0} GBP`);
console.log(`  Valid: ${checkout.valid}`);
console.log('');

console.log('✅ Subscriptions example complete!');
