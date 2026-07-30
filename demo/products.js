/**
 * Demo Products for Cartique
 */

export const products = [
  {
    id: 9,
    title: 'Chia Seeds',
    description: 'Boost your daily nutrition with our premium Chia Seeds.',
    image: 'https://gobotaniq.com/images/products/chia_seeds.png',
    price: 160,
    currency: 'ZAR',
    sale_price: null,
    slug: 'chia-seeds',
    hasVariants: true,
    categories: [
      { id: 5, name: 'Seeds & Grains' }
    ],
    variants: [
      {
        id: 9,
        sku: 'CHS001',
        price: 160,
        inventory: 59,
        bulkPrice: 140,
        bulkMinimumQty: 10,
        attributes: [
          { key: 'form', value: 'Seeds' },
          { key: 'weight', value: '250g' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        customer: { id: 1, name: 'Sarah M.' },
        rating: 5,
        comment: 'These chia seeds are fantastic!',
        status: 'approved',
        createdAt: '2026-05-15T10:30:00Z'
      }
    ]
  },
  {
    id: 14,
    title: 'Soursop Leaves',
    description: 'Hand-picked soursop leaves for brewing a potent, traditional herbal tea.',
    image: 'https://gobotaniq.com/images/products/soursop_leaves.png',
    price: 200,
    currency: 'ZAR',
    sale_price: null,
    slug: 'soursop-leaves',
    hasVariants: true,
    categories: [
      { id: 2, name: 'Teas & Infusions' }
    ],
    variants: [
      {
        id: 14,
        sku: 'SHR002',
        price: 200,
        inventory: 30,
        bulkPrice: 175,
        bulkMinimumQty: 10,
        attributes: [
          { key: 'form', value: 'Leaves' },
          { key: 'weight', value: '50g' }
        ]
      }
    ],
    reviews: []
  }
];

export default products;
