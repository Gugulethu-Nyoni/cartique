/**
 * ============================================================
 * Test: Projections
 * ============================================================
 */

import { ProductProjection } from './src/projections/storefront/ProductProjection.js';
import { CartProjection } from './src/projections/storefront/CartProjection.js';
import { ProductDTO } from './src/projections/api/ProductDTO.js';
import { OrderDTO } from './src/projections/api/OrderDTO.js';
import { PrismaProjection } from './src/projections/persistence/PrismaProjection.js';
import { OrderAnalyticsProjection } from './src/projections/analytics/OrderAnalyticsProjection.js';
import { InvoiceProjection } from './src/projections/invoices/InvoiceProjection.js';
import { ChiaSeeds } from './test/fixtures/chia-products.js';
import { Money, Identifier } from './src/core/index.js';
import { Resolution } from './src/resolution/Resolution.js';
import { ResolutionItem } from './src/resolution/ResolutionItem.js';
import { CheckoutResult } from './src/runtime/results/CheckoutResult.js';

console.log('✅ Testing Projections');
console.log('');

// ============================================================
// 1. Storefront Product Projection
// ============================================================

console.log('📋 Storefront Product Projection:');
const storefrontProduct = ProductProjection.project(ChiaSeeds);
console.log('  Title:', storefrontProduct.title);
console.log('  Price Range:', storefrontProduct.priceRange.min, '-', storefrontProduct.priceRange.max);
console.log('  Options:', storefrontProduct.options.map(o => o.name).join(', '));
console.log('  Variants:', storefrontProduct.variants.length);
console.log('  In Stock:', storefrontProduct.inStock);
console.log('');

// ============================================================
// 2. Create a Resolution with items[]
// ============================================================

const resolution = new Resolution({
  items: [
    new ResolutionItem({
      product: { id: 'chia-100g', title: 'Chia Seeds 100g' },
      variant: { id: 'chia-100g', attributes: { weight: '100g' } },
      quantity: 2,
      pricing: {
        unitPrice: Money.fromDecimal(25),
        totalPrice: Money.fromDecimal(50),
        subtotal: Money.fromDecimal(50),
        appliedRules: []
      }
    })
  ],
  customer: { id: 'cust-456', group: 'retail' },
  contexts: [],
  diagnostics: {},
  totals: {
    subtotal: Money.fromDecimal(50),
    tax: Money.fromDecimal(7.5),
    shipping: Money.fromDecimal(0),
    total: Money.fromDecimal(57.5)
  }
}).freeze();

// ============================================================
// 3. Create CheckoutResult
// ============================================================

const checkoutResult = new CheckoutResult({
  id: Identifier.generate('checkout'),
  resolution: resolution,
  cart: {
    id: 'cart-123',
    items: [
      { id: 'item-1', productId: 'chia-100g', quantity: 2, unitPrice: 25, title: 'Chia Seeds 100g' }
    ]
  },
  status: 'completed',
  totals: {
    subtotal: Money.fromDecimal(50),
    tax: Money.fromDecimal(7.5),
    shipping: Money.fromDecimal(0),
    total: Money.fromDecimal(57.5)
  },
  diagnostics: {}
});

// ============================================================
// 4. Cart Projection
// ============================================================

console.log('📋 Cart Projection:');
const projectedCart = CartProjection.project(checkoutResult.cart);
console.log('  Cart ID:', projectedCart.id);
console.log('  Item Count:', projectedCart.itemCount);
console.log('  Total:', projectedCart.totals.total);
console.log('  Empty:', projectedCart.isEmpty);
console.log('');

// ============================================================
// 5. API Product DTO
// ============================================================

console.log('📋 API Product DTO:');
const apiProduct = ProductDTO.project(ChiaSeeds);
console.log('  ID:', apiProduct.id);
console.log('  Title:', apiProduct.title);
console.log('  Variants:', apiProduct.variants.length);
console.log('  Price Range:', apiProduct.priceRange.min, '-', apiProduct.priceRange.max);
console.log('');

// ============================================================
// 6. API Order DTO
// ============================================================

console.log('📋 API Order DTO:');
const apiOrder = OrderDTO.project(checkoutResult);
console.log('  Order ID:', apiOrder.id);
console.log('  Status:', apiOrder.status);
console.log('  Total:', apiOrder.totals.total);
console.log('  Items:', apiOrder.items.length);
console.log('');

// ============================================================
// 7. Prisma Projection
// ============================================================

console.log('📋 Prisma Projection:');
const prismaOrder = PrismaProjection.projectOrder(checkoutResult, 'cust-456');
console.log('  Order:', prismaOrder.customerId, prismaOrder.total);
const prismaItems = prismaOrder.items;
console.log('  Items:', prismaItems.length);
console.log('');

// ============================================================
// 8. Analytics Projection
// ============================================================

console.log('📋 Analytics Projection:');
const analytics = OrderAnalyticsProjection.project(checkoutResult);
console.log('  Event:', analytics.event);
console.log('  Revenue:', analytics.revenue);
console.log('  Customer Segment:', analytics.customerSegment);
console.log('  Quantity:', analytics.quantity);
console.log('');

// ============================================================
// 9. Invoice Projection
// ============================================================

console.log('📋 Invoice Projection:');
const invoice = InvoiceProjection.project(checkoutResult);
console.log('  Invoice:', invoice.invoiceNumber);
console.log('  Total:', invoice.total);
console.log('  Lines:', invoice.lines.length);
const pdfInvoice = InvoiceProjection.formatForPDF(invoice);
console.log('  PDF Ready:', !!pdfInvoice.formattedTotal);
console.log('');

console.log('✅ All projections tested!');
