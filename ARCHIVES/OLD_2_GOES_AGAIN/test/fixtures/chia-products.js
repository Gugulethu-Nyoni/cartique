/**
 * ============================================================
 * Test Fixtures: Chia Seeds with Variants
 * ============================================================
 *
 * Purpose: Test data for variant resolution with independent pricing
 * 
 * Product: Organic Chia Seeds
 * Variants: 100g, 250g, 500g, 1kg
 * Each variant has its own price and bulk pricing rules
 * ============================================================
 */

import { createProduct } from '../../src/commerce/catalog/product.js';

// ============================================================
// Product Definition
// ============================================================

export const ChiaSeeds = createProduct({
  id: 'chia-seeds',
  sku: 'CHIA-001',
  slug: 'organic-chia-seeds',
  metadata: {
    title: 'Organic Chia Seeds',
    description: 'Premium organic chia seeds, rich in Omega-3, fiber, and protein.',
    brand: 'Botaniq'
  },
  media: {
    images: ['chia-seeds.png'],
    videos: []
  },
  dimensions: {
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  },
  attributes: {
    origin: 'South Africa',
    organic: true,
    glutenFree: true,
    vegan: true
  },
  // Each variant has its own pricing
  variants: [
    {
      id: 'chia-100g',
      sku: 'CHIA-100G',
      title: '100g Bag',
      attributes: { weight: '100g' },
      pricing: {
        base: 25,
        wholesale: 22,
        bulk: [
          { minQuantity: 10, price: 20 },
          { minQuantity: 50, price: 18 }
        ]
      },
      inventory: 100
    },
    {
      id: 'chia-250g',
      sku: 'CHIA-250G',
      title: '250g Bag',
      attributes: { weight: '250g' },
      pricing: {
        base: 45,
        wholesale: 38,
        bulk: [
          { minQuantity: 10, price: 35 },
          { minQuantity: 50, price: 30 }
        ]
      },
      inventory: 80
    },
    {
      id: 'chia-500g',
      sku: 'CHIA-500G',
      title: '500g Bag',
      attributes: { weight: '500g' },
      pricing: {
        base: 80,
        wholesale: 68,
        bulk: [
          { minQuantity: 10, price: 60 },
          { minQuantity: 25, price: 55 }
        ]
      },
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
  relationships: {
    related: [],
    upsells: [],
    crossSells: []
  }
});

// ============================================================
// Export for testing
// ============================================================

export const VariantTestData = {
  product: ChiaSeeds,
  variants: ChiaSeeds.variants,
  scenarios: {
    retail: {
      name: 'Retail Customer',
      customer: { group: 'retail' },
      expectations: {
        '100g': { unitPrice: 25, bulk: { 10: 20, 50: 18 } },
        '250g': { unitPrice: 45, bulk: { 10: 35, 50: 30 } },
        '500g': { unitPrice: 80, bulk: { 10: 60, 25: 55 } },
        '1kg': { unitPrice: 140, bulk: { 5: 110, 10: 100 } }
      }
    },
    wholesale: {
      name: 'Wholesale Customer',
      customer: { group: 'wholesale' },
      expectations: {
        '100g': { unitPrice: 22, bulk: { 10: 20, 50: 18 } },
        '250g': { unitPrice: 38, bulk: { 10: 35, 50: 30 } },
        '500g': { unitPrice: 68, bulk: { 10: 60, 25: 55 } },
        '1kg': { unitPrice: 120, bulk: { 5: 110, 10: 100 } }
      }
    }
  }
};

export default VariantTestData;
