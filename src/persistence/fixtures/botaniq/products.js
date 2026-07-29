/**
 * ============================================================
 * Fixture: Products
 * ============================================================
 */

export const products = [
  {
    id: 9,
    sku: 'CHIA-001',
    slug: 'organic-chia-seeds',
    title: 'Organic Chia Seeds',
    description: 'Boost your daily nutrition with our premium Chia Seeds...',
    shortDescription: 'Premium organic chia seeds rich in Omega-3 and fiber.',
    currency: 'ZAR',
    image: 'https://gobotaniq.com/images/products/chia_seeds.png',
    attributes: {
      origin: 'South Africa',
      organic: true,
      glutenFree: true,
      vegan: true
    },
    metadata: {
      brand: 'Botaniq',
      unit: 'kg',
      precision: 2
    },
    status: 'active',
    createdAt: new Date('2026-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-01T10:00:00Z').toISOString()
  },
  {
    id: 14,
    sku: 'SOURSOP-001',
    slug: 'organic-soursop-leaves',
    title: 'Organic Soursop Leaves',
    description: 'Hand-picked soursop leaves for brewing a potent, traditional herbal tea...',
    shortDescription: 'Hand-picked soursop leaves for traditional tea.',
    currency: 'ZAR',
    image: 'https://gobotaniq.com/images/products/soursop_leaves.png',
    attributes: {
      origin: 'South Africa',
      organic: true,
      glutenFree: true,
      vegan: true
    },
    metadata: {
      brand: 'Botaniq',
      unit: 'g',
      precision: 0
    },
    status: 'active',
    createdAt: new Date('2026-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-01-15T10:00:00Z').toISOString()
  }
];
