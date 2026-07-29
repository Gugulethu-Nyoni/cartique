/**
 * ============================================================
 * Test: ResolutionEngine
 * ============================================================
 */

import { ProductRepository } from '../../src/persistence/repositories/ProductRepository.js';
import { SellableMapper } from '../../src/persistence/mappers/SellableMapper.js';
import { Customer } from '../../src/commerce/Customer.js';
import { Place } from '../../src/commerce/Place.js';
import { ResolutionEngine } from '../../src/engine/ResolutionEngine.js';
import { VariantResolver, PricingResolver, TaxResolver, ShippingResolver } from '../../src/engine/resolvers/index.js';
import { Money } from '../../src/core/Money.js';

console.log('✅ Testing ResolutionEngine');
console.log('');

// 1. Load data
console.log('📋 Loading data...');
const loaded = ProductRepository.loadById(9);
const sellable = SellableMapper.fromLoadedProduct(loaded);
const customer = Customer.wholesale({
  id: 'cust_wholesale_001',
  name: 'Wholesale Foods Inc.'
});
const place = Place.southAfrica();

console.log(`  Product: ${sellable.title}`);
console.log(`  Customer: ${customer.name}`);
console.log(`  Place: ${place.name}`);
console.log('');

// 2. Create engine
console.log('📋 Creating engine...');
const engine = new ResolutionEngine({
  resolvers: [
    new VariantResolver(),
    new PricingResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});
console.log('  Engine created with 4 resolvers');
console.log('');

// 3. Resolve
console.log('📋 Resolving...');
const decision = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 12,
    selections: { weight: '1kg' }
  },
  contexts: []
});

console.log('  Decision created!');
console.log('');

// 4. Display results with proper Money formatting
console.log('📊 Resolution Results:');
console.log(`  Valid: ${decision.valid}`);
console.log(`  Items: ${decision.items.length}`);
console.log(`  Adjustments: ${decision.adjustments.length}`);

// Format Money properly
const subtotal = decision.subtotal instanceof Money ? decision.subtotal : Money.fromDecimal(decision.subtotal || 0);
const tax = decision.taxAmount instanceof Money ? decision.taxAmount : Money.fromDecimal(decision.taxAmount || 0);
const shipping = decision.shippingAmount instanceof Money ? decision.shippingAmount : Money.fromDecimal(decision.shippingAmount || 0);
const total = decision.total instanceof Money ? decision.total : Money.fromDecimal(decision.total || 0);

console.log(`  Subtotal: ${subtotal.toFormatted()}`);
console.log(`  Tax: ${tax.toFormatted()}`);
console.log(`  Shipping: ${shipping.toFormatted()}`);
console.log(`  Total: ${total.toFormatted()}`);
console.log('');

if (decision.journal) {
  console.log('📋 Journal Entries:');
  decision.journal.entries.forEach(e => {
    console.log(`  ${e.decision}: ${e.resolver} — ${e.reason}`);
  });
}

console.log('');
console.log('✅ ResolutionEngine test passed!');
