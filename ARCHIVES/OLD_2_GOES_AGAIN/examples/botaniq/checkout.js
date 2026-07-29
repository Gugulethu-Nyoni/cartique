/**
 * ============================================================
 * Example: Botaniq — Checkout Flow
 * ============================================================
 *
 * Scenario: Wholesale customer buys 12 x 1kg Chia Seeds
 * during Black Friday
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

import { ChiaSeeds } from './catalog/products.js';
import { BlackFriday } from './contexts/index.js';

console.log('==================================================');
console.log('Botaniq Example: Wholesale Chia Purchase');
console.log('==================================================');
console.log('');

// 1. Create customer
const wholesaleCustomer = createPersona({
  id: 'wholesale-customer',
  name: 'Wholesale Customer',
  group: 'wholesale',
  metadata: {
    requiresApproval: true,
    accountManager: 'John Smith'
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

console.log('📦 Product: Organic Chia Seeds');
console.log('👤 Customer: Wholesale');
console.log('📋 Configuration: 12 × 1kg');
console.log('🎯 Context: Black Friday');
console.log('');

// 4. Resolve
const resolution = resolver.resolve({
  product: ChiaSeeds,
  customer: wholesaleCustomer,
  place: place,
  configuration: {
    quantity: 12,
    selections: { weight: '1kg' }
  },
  contexts: [BlackFriday],
  metadata: { now: new Date() }
});

console.log('📊 Resolution:');
console.log(`  Valid: ${resolution.valid}`);
console.log(`  Unit Price: R${resolution.pricing?.unitPrice || 0}`);
console.log(`  Subtotal: R${resolution.subtotal}`);
console.log(`  Tax: R${resolution.taxAmount}`);
console.log(`  Total: R${resolution.total}`);
console.log(`  Applied Rules: ${resolution.pricing?.appliedRules?.map(r => r.type).join(', ') || 'none'}`);
console.log('');

// 5. Runtime
const runtime = new CommerceRuntime();
const checkout = runtime.checkout(resolution);

console.log('💳 Checkout:');
console.log(`  Status: ${checkout.status}`);
console.log(`  Total: R${checkout.total?.amount || 0}`);
console.log(`  Valid: ${checkout.valid}`);
console.log('');

// 6. Projections
import { OrderDTO } from '../../src/projections/api/OrderDTO.js';
import { InvoiceProjection } from '../../src/projections/invoices/InvoiceProjection.js';
import { OrderAnalyticsProjection } from '../../src/projections/analytics/OrderAnalyticsProjection.js';
import { PrismaProjection } from '../../src/projections/persistence/PrismaProjection.js';

const orderDto = OrderDTO.project(checkout);
const invoice = InvoiceProjection.project(checkout);
const analytics = OrderAnalyticsProjection.project(checkout);
const prismaOrder = PrismaProjection.projectOrder(checkout, wholesaleCustomer.id);

console.log('📋 Projections:');
console.log(`  Order DTO: ID ${orderDto.id}, Total R${orderDto.totals.total}`);
console.log(`  Invoice: ${invoice.invoiceNumber}, Total R${invoice.total}`);
console.log(`  Analytics: ${analytics.event}, Revenue R${analytics.revenue}`);
console.log(`  Prisma: Customer ${prismaOrder.customerId}, Total R${prismaOrder.total}`);
console.log('');

console.log('✅ Botaniq example complete!');
