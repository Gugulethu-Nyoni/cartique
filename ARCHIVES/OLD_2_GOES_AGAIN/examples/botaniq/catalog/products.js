/**
 * ============================================================
 * Example: Botaniq — Products
 * ============================================================
 *
 * Validates:
 * - Variants (weights: 100g, 250g, 500g, 1kg)
 * - Bulk pricing (MOQ)
 * - Wholesale pricing
 * - VAT
 * - Contexts (Black Friday, etc.)
 * ============================================================
 */

import { createProduct } from '../../../src/commerce/catalog/Product.js';

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

export const MoringaPowder = createProduct({
  id: 'moringa-powder',
  sku: 'MORINGA-001',
  slug: 'organic-moringa-powder',
  metadata: {
    title: 'Organic Moringa Powder',
    description: 'Pure organic moringa powder, packed with vitamins and minerals.',
    brand: 'Botaniq'
  },
  media: {
    images: ['moringa-powder.png'],
    videos: []
  },
  dimensions: {
    weight: 0.2,
    length: 12,
    width: 8,
    height: 15
  },
  attributes: {
    origin: 'South Africa',
    organic: true,
    glutenFree: true,
    vegan: true
  },
  variants: [
    {
      id: 'moringa-100g',
      sku: 'MORINGA-100G',
      title: '100g Bag',
      attributes: { weight: '100g' },
      pricing: {
        base: 60,
        wholesale: 50,
        bulk: [
          { minQuantity: 10, price: 45 }
        ]
      },
      inventory: 200
    },
    {
      id: 'moringa-250g',
      sku: 'MORINGA-250G',
      title: '250g Bag',
      attributes: { weight: '250g' },
      pricing: {
        base: 120,
        wholesale: 100,
        bulk: [
          { minQuantity: 5, price: 90 }
        ]
      },
      inventory: 80
    }
  ],
  relationships: {
    related: [],
    upsells: [],
    crossSells: []
  }
});
