/**
 * ============================================================
 * Example: Subscriptions — Products
 * ============================================================
 *
 * Validates:
 * - Subscription pricing (monthly, yearly)
 * - Digital products
 * - No inventory constraints
 * ============================================================
 */

import { createProduct } from '../../../src/commerce/catalog/Product.js';

export const CRMPlan = createProduct({
  id: 'crm-plan',
  sku: 'CRM-001',
  slug: 'crm-subscription',
  metadata: {
    title: 'CRM Subscription',
    description: 'Cloud-based CRM software',
    brand: 'TechCorp'
  },
  media: {
    images: ['crm.png'],
    videos: []
  },
  dimensions: {
    weight: 0,
    length: 0,
    width: 0,
    height: 0
  },
  attributes: {
    digital: true,
    subscription: true
  },
  variants: [
    {
      id: 'starter',
      sku: 'CRM-STARTER',
      title: 'Starter Plan',
      attributes: { plan: 'Starter', interval: 'monthly' },
      pricing: {
        base: 99,
        yearly: 900  // 12 × 99 = 1188, so 900 is a discount
      },
      inventory: 999
    },
    {
      id: 'business',
      sku: 'CRM-BUSINESS',
      title: 'Business Plan',
      attributes: { plan: 'Business', interval: 'monthly' },
      pricing: {
        base: 299,
        yearly: 2700
      },
      inventory: 999
    },
    {
      id: 'enterprise',
      sku: 'CRM-ENTERPRISE',
      title: 'Enterprise Plan',
      attributes: { plan: 'Enterprise', interval: 'monthly' },
      pricing: {
        base: 999,
        yearly: 9000,
        bulk: [
          { minQuantity: 10, price: 850 }
        ]
      },
      inventory: 999
    }
  ],
  relationships: {
    related: [],
    upsells: [],
    crossSells: []
  }
});
