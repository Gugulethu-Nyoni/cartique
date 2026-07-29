/**
 * ============================================================
 * Golden Master: Botaniq
 * ============================================================
 *
 * Commercial scenarios for Botaniq health food store.
 * ============================================================
 */

import { ScenarioBuilder } from '../ScenarioBuilder.js';
import { createProduct } from '../../../src/commerce/catalog/Product.js';
import { 
  retailCustomer, 
  wholesaleCustomer, 
  vipCustomer,
  southAfrica 
} from '../utils/setup.js';

// Create Chia Seeds product with variants
const ChiaSeeds = createProduct({
  id: 'chia-seeds',
  sku: 'CHIA-001',
  slug: 'organic-chia-seeds',
  metadata: {
    title: 'Organic Chia Seeds',
    description: 'Premium organic chia seeds, rich in Omega-3, fiber, and protein.',
    brand: 'Botaniq'
  },
  media: { images: ['chia-seeds.png'], videos: [] },
  dimensions: { weight: 0, length: 0, width: 0, height: 0 },
  attributes: { origin: 'South Africa', organic: true },
  variants: [
    {
      id: 'chia-100g',
      sku: 'CHIA-100G',
      title: '100g Bag',
      attributes: { weight: '100g' },
      pricing: { base: 25 },
      inventory: 100
    },
    {
      id: 'chia-250g',
      sku: 'CHIA-250G',
      title: '250g Bag',
      attributes: { weight: '250g' },
      pricing: { base: 45 },
      inventory: 80
    },
    {
      id: 'chia-500g',
      sku: 'CHIA-500G',
      title: '500g Bag',
      attributes: { weight: '500g' },
      pricing: { base: 80 },
      inventory: 50
    },
    {
      id: 'chia-1kg',
      sku: 'CHIA-1KG',
      title: '1kg Bag',
      attributes: { weight: '1kg' },
      pricing: {
        base: 140,
        wholesale: 120,
        bulk: [
          { minQuantity: 5, price: 110 },
          { minQuantity: 10, price: 100 }
        ]
      },
      inventory: 30
    }
  ],
  relationships: { related: [], upsells: [], crossSells: [] }
});

export const botaniqScenarios = [
  // ============================================================
  // Weight Variants
  // ============================================================

  ScenarioBuilder
    .named('Retail — 1 × 100g Chia')
    .category('catalog')
    .tags(['variant', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(1)
    .variant('100g')
    .expectPrice(25)
    .expectSubtotal(25)
    .expectTotal(25)
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Retail — 1 × 250g Chia')
    .category('catalog')
    .tags(['variant', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(1)
    .variant('250g')
    .expectPrice(45)
    .expectSubtotal(45)
    .expectTotal(45)
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Retail — 1 × 500g Chia')
    .category('catalog')
    .tags(['variant', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(1)
    .variant('500g')
    .expectPrice(80)
    .expectSubtotal(80)
    .expectTotal(80)
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Retail — 1 × 1kg Chia')
    .category('catalog')
    .tags(['variant', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(1)
    .variant('1kg')
    .expectPrice(140)
    .expectSubtotal(140)
    .expectTotal(140)
    .expectValid(true)
    .build(),

  // ============================================================
  // Bulk Pricing (MOQ)
  // ============================================================

  ScenarioBuilder
    .named('Retail — 1 × 1kg (no bulk)')
    .category('pricing')
    .tags(['bulk', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(1)
    .variant('1kg')
    .expectPrice(140)
    .expectSubtotal(140)
    .expectTotal(140)
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Retail — 5 × 1kg (bulk tier 5+)')
    .category('pricing')
    .tags(['bulk', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(5)
    .variant('1kg')
    .expectPrice(110)
    .expectSubtotal(550)
    .expectTotal(550)
    .expectRule('bulk')
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Retail — 10 × 1kg (bulk tier 10+)')
    .category('pricing')
    .tags(['bulk', 'retail'])
    .product(ChiaSeeds)
    .customer(retailCustomer)
    .quantity(10)
    .variant('1kg')
    .expectPrice(100)
    .expectSubtotal(1000)
    .expectTotal(1000)
    .expectRule('bulk')
    .expectValid(true)
    .build(),

  // ============================================================
  // Customer Groups
  // ============================================================

  ScenarioBuilder
    .named('Wholesale — 1 × 1kg')
    .category('pricing')
    .tags(['customer_group', 'wholesale'])
    .product(ChiaSeeds)
    .customer(wholesaleCustomer)
    .quantity(1)
    .variant('1kg')
    .expectPrice(120)
    .expectSubtotal(120)
    .expectTotal(120)
    .expectRule('customer_group')
    .expectValid(true)
    .build(),

  ScenarioBuilder
    .named('Wholesale — 10 × 1kg (wholesale + bulk)')
    .category('pricing')
    .tags(['customer_group', 'wholesale', 'bulk'])
    .product(ChiaSeeds)
    .customer(wholesaleCustomer)
    .quantity(10)
    .variant('1kg')
    .expectPrice(100)
    .expectSubtotal(1000)
    .expectTotal(1000)
    .expectRules(['customer_group', 'bulk'])
    .expectValid(true)
    .build()
];
