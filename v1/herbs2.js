export const products = [
  // Product 1: Chia Seeds (Grams-based pricing)
  {
    id: 9,
    title: 'Chia Seeds',
    description: 'Boost your daily nutrition with our premium Chia Seeds, nature\'s richest plant source of Omega-3 fatty acids, fiber, and protein. Promotes fullness and sustained energy.',
    price: 160,
    currency: 'ZAR',
    image: 'https://gobotaniq.com/images/products/chia_seeds.png',
    sale_price: null,
    slug: 'chia-seeds',
    hasVariants: true,
    product_images: [],
    categories: [
      { id: 5, name: 'Seeds & Grains' }
    ],
    variants: [
      {
        id: 9,
        productId: 9,
        sku: 'CHS001',
        price: 160,
        compareAtPrice: null,
        costPrice: 80,
        inventoryPolicy: 'deny',
        inventory: 59,
        weight_kg: 0.28,
        length_cm: 16,
        width_cm: 8,
        height_cm: 24,
        bulkPrice: 140,        // R160 - 12.5% = R140
        bulkMinimumQty: 10,    // 10+ units triggers bulk pricing
        attributes: [
          { key: 'form', value: 'Seeds', dataType: 'string' },
          { key: 'weight', value: '250g', dataType: 'string' },
          { key: 'pouch_size', value: '160x240mm + 80mm gusset', dataType: 'string' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        productId: 9,
        customerId: 1,
        customer: { id: 1, name: 'Sarah M.', email: 'sarah@example.com' },
        rating: 5,
        comment: 'These chia seeds are fantastic! I add them to my morning smoothie and they keep me full until lunch. Great quality!',
        status: 'approved',
        createdAt: '2026-05-15T10:30:00Z',
        updatedAt: '2026-05-15T10:30:00Z'
      },
      {
        id: 2,
        productId: 9,
        customerId: 2,
        customer: { id: 2, name: 'John D.', email: 'john@example.com' },
        rating: 4,
        comment: 'Good quality seeds. The 250g pack lasts me about 2 weeks. Will definitely buy again.',
        status: 'approved',
        createdAt: '2026-06-01T14:20:00Z',
        updatedAt: '2026-06-01T14:20:00Z'
      }
    ]
  },

  // Product 2: Soursop Leaves (Leaves-based pricing)
  {
    id: 14,
    title: 'Soursop Leaves',
    description: 'Hand-picked soursop leaves for brewing a potent, traditional herbal tea. Known for their natural immune-modulating, anti-inflammatory, and calming properties.',
    price: 200,
    currency: 'ZAR',
    image: 'https://gobotaniq.com/images/products/soursop_leaves.png',
    sale_price: null,
    slug: 'soursop-leaves',
    hasVariants: true,
    product_images: [],
    categories: [
      { id: 2, name: 'Teas & Infusions' },
      { id: 1, name: 'Immune Boosters' }
    ],
    variants: [
      {
        id: 14,
        productId: 14,
        sku: 'SHR002',
        price: 200,
        compareAtPrice: null,
        costPrice: 100,
        inventoryPolicy: 'deny',
        inventory: 30,
        weight_kg: 0.07,
        length_cm: 16,
        width_cm: 8,
        height_cm: 24,
        bulkPrice: 175,        // R200 - 12.5% = R175
        bulkMinimumQty: 10,    // 10+ units triggers bulk pricing
        attributes: [
          { key: 'form', value: 'Leaves', dataType: 'string' },
          { key: 'weight', value: '50g', dataType: 'string' },
          { key: 'pouch_size', value: '160x240mm + 80mm gusset', dataType: 'string' },
          { key: 'quantity', value: 'Pack of 10 leaves', dataType: 'string' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        productId: 14,
        customerId: 3,
        customer: { id: 3, name: 'Thandi N.', email: 'thandi@example.com' },
        rating: 5,
        comment: 'Traditional healing at its best! I brew this tea every evening and it helps me relax after a long day. The leaves are fresh and aromatic.',
        status: 'approved',
        createdAt: '2026-05-20T16:45:00Z',
        updatedAt: '2026-05-20T16:45:00Z'
      },
      {
        id: 2,
        productId: 14,
        customerId: 4,
        customer: { id: 4, name: 'Peter K.', email: 'peter@example.com' },
        rating: 4,
        comment: 'Great quality leaves. The tea has a mild, pleasant taste. It\'s become part of my daily routine.',
        status: 'approved',
        createdAt: '2026-06-05T09:15:00Z',
        updatedAt: '2026-06-05T09:15:00Z'
      },
      {
        id: 3,
        productId: 14,
        customerId: 5,
        customer: { id: 5, name: 'Linda M.', email: 'linda@example.com' },
        rating: 5,
        comment: 'Perfect for making soursop tea. The leaves are dried to perfection and the flavor is amazing. Highly recommend!',
        status: 'approved',
        createdAt: '2026-06-10T11:00:00Z',
        updatedAt: '2026-06-10T11:00:00Z'
      }
    ]
  }
];