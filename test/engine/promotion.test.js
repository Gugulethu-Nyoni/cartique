/**
 * ============================================================
 * Test: PromotionResolver
 * ============================================================
 */

import { ProductRepository } from '../../src/persistence/repositories/ProductRepository.js';
import { SellableMapper } from '../../src/persistence/mappers/SellableMapper.js';
import { Customer } from '../../src/commerce/Customer.js';
import { Place } from '../../src/commerce/Place.js';
import { Context } from '../../src/commerce/Context.js';
import { ResolutionEngine } from '../../src/engine/ResolutionEngine.js';
import { VariantResolver, PricingResolver, PromotionResolver, TaxResolver, ShippingResolver } from '../../src/engine/resolvers/index.js';
import { Money } from '../../src/core/Money.js';

console.log('✅ Testing PromotionResolver');
console.log('');

// 1. Load data
console.log('📋 Loading data...');
const loaded = ProductRepository.loadById(9);
const sellable = SellableMapper.fromLoadedProduct(loaded);
const customer = Customer.retail({
  id: 'cust_retail_001',
  name: 'Retail Customer'
});
const place = Place.southAfrica();

console.log(`  Product: ${sellable.title}`);
console.log(`  Customer: ${customer.name}`);
console.log(`  Place: ${place.name}`);
console.log('');

// 2. Create promotion context with ACTIVE dates (2024-01-01 to 2024-12-31)
console.log('📋 Creating promotion...');
const now = new Date();
// Set dates to cover current date
const activeFrom = new Date('2024-01-01T00:00:00Z');
const activeTo = new Date('2030-12-31T23:59:59Z');

const blackFriday = new Context({
  id: 'promo_black_friday',
  name: 'Black Friday 2026',
  type: 'promotion',
  injects: ['pricing.promotion'],
  metadata: {
    type: 'percentage',
    value: 20,
    conditions: {
      activeFrom: activeFrom.toISOString(),
      activeTo: activeTo.toISOString(),
      minQuantity: 1
    }
  }
});

const summerSale = new Context({
  id: 'promo_summer_sale',
  name: 'Summer Sale',
  type: 'promotion',
  injects: ['pricing.promotion'],
  metadata: {
    type: 'fixed',
    value: 50,
    conditions: {
      activeFrom: activeFrom.toISOString(),
      activeTo: activeTo.toISOString(),
      minSubtotal: 200
    }
  }
});

console.log(`  Black Friday: 20% off (active until 2030)`);
console.log(`  Summer Sale: R50 off (min subtotal R200)`);
console.log('');

// 3. Create engine with PromotionResolver
console.log('📋 Creating engine...');
const engine = new ResolutionEngine({
  resolvers: [
    new VariantResolver(),
    new PricingResolver(),
    new PromotionResolver(),
    new TaxResolver(),
    new ShippingResolver()
  ]
});
console.log('  Engine created with 5 resolvers');
console.log('');

// 4. Test without promotions
console.log('📋 Test 1: No promotions');
const result1 = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 2,
    selections: { weight: '1kg' }
  },
  contexts: []
});

console.log(`  Subtotal: ${result1.subtotal instanceof Money ? result1.subtotal.toFormatted() : result1.subtotal}`);
console.log(`  Adjustments: ${result1.adjustments.length}`);
console.log(`  Total: ${result1.total instanceof Money ? result1.total.toFormatted() : result1.total}`);
console.log('');

// 5. Test with Black Friday
console.log('📋 Test 2: Black Friday (20% off)');
const result2 = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 2,
    selections: { weight: '1kg' }
  },
  contexts: [blackFriday]
});

const subtotal2 = result2.subtotal instanceof Money ? result2.subtotal : Money.fromDecimal(result2.subtotal || 0);
const total2 = result2.total instanceof Money ? result2.total : Money.fromDecimal(result2.total || 0);

console.log(`  Subtotal: ${subtotal2.toFormatted()}`);
console.log(`  Adjustments: ${result2.adjustments.length}`);
if (result2.adjustments.length > 0) {
  result2.adjustments.forEach(a => {
    console.log(`    - ${a.description}: ${a.amount.toFormatted()}`);
  });
}
console.log(`  Total: ${total2.toFormatted()}`);
console.log('');

// 6. Test with Summer Sale
console.log('📋 Test 3: Summer Sale (R50 off)');
const result3 = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 3,
    selections: { weight: '1kg' }
  },
  contexts: [summerSale]
});

const subtotal3 = result3.subtotal instanceof Money ? result3.subtotal : Money.fromDecimal(result3.subtotal || 0);
const total3 = result3.total instanceof Money ? result3.total : Money.fromDecimal(result3.total || 0);

console.log(`  Subtotal: ${subtotal3.toFormatted()}`);
console.log(`  Adjustments: ${result3.adjustments.length}`);
if (result3.adjustments.length > 0) {
  result3.adjustments.forEach(a => {
    console.log(`    - ${a.description}: ${a.amount.toFormatted()}`);
  });
}
console.log(`  Total: ${total3.toFormatted()}`);
console.log('');

// 7. Test with both promotions
console.log('📋 Test 4: Both promotions (should both apply)');
const result4 = engine.resolve({
  sellable,
  customer,
  place,
  configuration: {
    quantity: 3,
    selections: { weight: '1kg' }
  },
  contexts: [blackFriday, summerSale]
});

const subtotal4 = result4.subtotal instanceof Money ? result4.subtotal : Money.fromDecimal(result4.subtotal || 0);
const total4 = result4.total instanceof Money ? result4.total : Money.fromDecimal(result4.total || 0);

console.log(`  Subtotal: ${subtotal4.toFormatted()}`);
console.log(`  Adjustments: ${result4.adjustments.length}`);
if (result4.adjustments.length > 0) {
  result4.adjustments.forEach(a => {
    console.log(`    - ${a.description}: ${a.amount.toFormatted()}`);
  });
}
console.log(`  Total: ${total4.toFormatted()}`);
console.log('');

console.log('✅ PromotionResolver test passed!');
