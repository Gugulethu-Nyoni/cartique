/**
 * ============================================================
 * Example: Fashion Store — Checkout Flow
 * ============================================================
 *
 * Scenario: Retail customer buys 2 x Medium Blue T-Shirts
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

import { TShirt } from './catalog/products.js';

console.log('==================================================');
console.log('Fashion Store Example: Retail T-Shirt Purchase');
console.log('==================================================');
console.log('');

// 1. Create customer
const retailCustomer = createPersona({
  id: 'retail-customer',
  name: 'Retail Customer',
  group: 'retail',
  metadata: {
    requiresLogin: true,
    loyaltyTier: 'bronze'
  }
});

// 2. Create place (South Africa)
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

console.log('📦 Product: Cotton T-Shirt');
console.log('👤 Customer: Retail');
console.log('📋 Configuration: 2 × Medium Blue');
console.log('');

// 4. Resolve
const resolution = resolver.resolve({
  product: TShirt,
  customer: retailCustomer,
  place: place,
  configuration: {
    quantity: 2,
    selections: { size: 'M', color: 'Blue' }
  },
  contexts: [],
  metadata: { now: new Date() }
});

console.log('📊 Resolution:');
console.log(`  Valid: ${resolution.valid}`);
console.log(`  Variant: ${resolution.variant?.attributes?.size} ${resolution.variant?.attributes?.color}`);
console.log(`  Unit Price: R${resolution.pricing?.unitPrice || 0}`);
console.log(`  Subtotal: R${resolution.pricing?.subtotal || 0}`);
console.log(`  Tax: R${resolution.tax?.amount || 0}`);
console.log(`  Total: R${resolution.total?.amount || 0}`);
console.log('');

// 5. Runtime
const runtime = new CommerceRuntime();
const checkout = runtime.checkout(resolution);

// 6. Projections
import { OrderDTO } from '../../src/projections/api/OrderDTO.js';

const orderDto = OrderDTO.project(checkout);

console.log('💳 Checkout:');
console.log(`  Status: ${checkout.status}`);
console.log(`  Total: R${checkout.total?.amount || 0}`);
console.log(`  Valid: ${checkout.valid}`);
console.log('');

console.log('✅ Fashion Store example complete!');
