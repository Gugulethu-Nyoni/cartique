export const products = [
  {
    id: 1,
    title: 'Classic Fit Cotton Oxford Shirt',
    description: 'A timeless button-down oxford shirt crafted from premium breathable cotton. Features a button-down collar and chest pocket.',
    price: 89,
    currency: '$',
    image: '',
    sale_price: 69,
    slug: 'classic-fit-cotton-oxford-shirt',
    hasVariants: true,
    product_images: ['', ''],
    categories: [
      { id: 1, name: 'Shirts' },
      { id: 2, name: 'Mens' }
    ],
    variants: [
      {
        id: 101, productId: 1, sku: 'OXF-WHT-M', price: 89,
        costPrice: 45, inventory: 25, weight: 0.3,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'material', value: '100% Cotton', dataType: 'string' }
        ]
      },
      {
        id: 102, productId: 1, sku: 'OXF-BLU-L', price: 89,
        costPrice: 45, inventory: 18, weight: 0.3,
        attributes: [
          { key: 'color', value: 'Light Blue', dataType: 'color' },
          { key: 'size', value: 'L', dataType: 'string' },
          { key: 'material', value: '100% Cotton', dataType: 'string' }
        ]
      }
    ],
    reviews: [
  {
    id: 1,
    productId: 1,
    customerId: 101,
    customer: { id: 101, name: 'James M.', email: 'james@example.com' },
    rating: 5,
    comment: 'Perfect fit and the cotton is incredibly soft. Washed it three times already and it still looks brand new. Highly recommend for office wear.',
    status: 'approved',
    createdAt: '2025-12-15T10:30:00Z',
    updatedAt: '2025-12-15T10:30:00Z'
  },
  {
    id: 2,
    productId: 1,
    customerId: 102,
    customer: { id: 102, name: 'Sarah K.', email: 'sarah@example.com' },
    rating: 4,
    comment: 'Great quality shirt, but runs slightly large. I usually wear a medium but had to exchange for a small. The exchange process was smooth though.',
    status: 'approved',
    createdAt: '2026-01-08T14:15:00Z',
    updatedAt: '2026-01-08T14:15:00Z'
  },
  {
    id: 3,
    productId: 1,
    customerId: 103,
    customer: { id: 103, name: 'David L.', email: 'david@example.com' },
    rating: 5,
    comment: 'Bought two of these - white and light blue. Both are excellent. The button-down collar keeps its shape all day. Worth every penny.',
    status: 'approved',
    createdAt: '2026-02-20T09:45:00Z',
    updatedAt: '2026-02-20T09:45:00Z'
  }
]
  },
  {
    id: 2,
    title: 'Slim Fit Stretch Chinos',
    description: 'Modern slim-fit chinos with 2% elastane for all-day comfort. Tapered leg with a mid-rise waist.',
    price: 120,
    currency: '$',
    image: '',
    slug: 'slim-fit-stretch-chinos',
    hasVariants: true,
    product_images: ['', ''],
    categories: [
      { id: 3, name: 'Pants' },
      { id: 2, name: 'Mens' }
    ],
    variants: [
      {
        id: 201, productId: 2, sku: 'CHN-KHK-32', price: 120,
        costPrice: 60, inventory: 30, weight: 0.5,
        attributes: [
          { key: 'color', value: 'Khaki', dataType: 'color' },
          { key: 'size', value: '32', dataType: 'string' },
          { key: 'fit', value: 'Slim', dataType: 'string' }
        ]
      },
      {
        id: 202, productId: 2, sku: 'CHN-NAV-34', price: 120,
        costPrice: 60, inventory: 22, weight: 0.5,
        attributes: [
          { key: 'color', value: 'Navy', dataType: 'color' },
          { key: 'size', value: '34', dataType: 'string' },
          { key: 'fit', value: 'Slim', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Merino Wool Crew Neck Sweater',
    description: 'Ultra-soft fine merino wool sweater. Temperature-regulating, lightweight, and perfect for layering.',
    price: 150,
    currency: '$',
    image: '',
    slug: 'merino-wool-crew-neck-sweater',
    hasVariants: true,
    categories: [
      { id: 4, name: 'Knitwear' },
      { id: 2, name: 'Mens' },
      { id: 5, name: 'Womens' }
    ],
    variants: [
      {
        id: 301, productId: 3, sku: 'MWL-GRY-M', price: 150,
        costPrice: 80, inventory: 15, weight: 0.4,
        attributes: [
          { key: 'color', value: 'Charcoal Grey', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'material', value: '100% Merino Wool', dataType: 'string' }
        ]
      },
      {
        id: 302, productId: 3, sku: 'MWL-BLK-S', price: 150,
        costPrice: 80, inventory: 20, weight: 0.4,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'S', dataType: 'string' },
          { key: 'material', value: '100% Merino Wool', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'High-Waist Wide Leg Linen Trousers',
    description: 'Breezy high-waisted wide-leg trousers in premium French linen. Elasticated back waistband for comfort.',
    price: 135,
    currency: '$',
    image: '',
    sale_price: 99,
    slug: 'high-waist-wide-leg-linen-trousers',
    hasVariants: true,
    product_images: ['', '', ''],
    categories: [
      { id: 3, name: 'Pants' },
      { id: 5, name: 'Womens' }
    ],
    variants: [
      {
        id: 401, productId: 4, sku: 'LIN-BGE-8', price: 135,
        costPrice: 65, inventory: 12, weight: 0.35,
        attributes: [
          { key: 'color', value: 'Beige', dataType: 'color' },
          { key: 'size', value: '8', dataType: 'string' },
          { key: 'material', value: '100% Linen', dataType: 'string' }
        ]
      },
      {
        id: 402, productId: 4, sku: 'LIN-WHT-10', price: 135,
        costPrice: 65, inventory: 8, weight: 0.35,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '10', dataType: 'string' },
          { key: 'material', value: '100% Linen', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Oversized Denim Jacket',
    description: 'A relaxed-fit denim jacket with a washed finish. Features button cuffs, chest pockets, and a pointed collar.',
    price: 175,
    currency: '$',
    image: '',
    slug: 'oversized-denim-jacket',
    hasVariants: true,
    categories: [
      { id: 6, name: 'Outerwear' },
      { id: 5, name: 'Womens' },
      { id: 7, name: 'Unisex' }
    ],
    variants: [
      {
        id: 501, productId: 5, sku: 'DNM-BLU-M', price: 175,
        costPrice: 90, inventory: 10, weight: 0.9,
        attributes: [
          { key: 'color', value: 'Vintage Blue', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'material', value: '100% Cotton Denim', dataType: 'string' }
        ]
      },
      {
        id: 502, productId: 5, sku: 'DNM-BLK-L', price: 175,
        costPrice: 90, inventory: 14, weight: 0.9,
        attributes: [
          { key: 'color', value: 'Black Wash', dataType: 'color' },
          { key: 'size', value: 'L', dataType: 'string' },
          { key: 'material', value: '100% Cotton Denim', dataType: 'string' }
        ]
      }
    ],
  reviews: [
  {
    id: 4,
    productId: 5,
    customerId: 104,
    customer: { id: 104, name: 'Emma R.', email: 'emma@example.com' },
    rating: 5,
    comment: 'This jacket is EVERYTHING! The oversized fit is perfect - roomy enough for a sweater underneath but still looks structured. The vintage blue wash is gorgeous.',
    status: 'approved',
    createdAt: '2026-03-01T16:20:00Z',
    updatedAt: '2026-03-01T16:20:00Z'
  },
  {
    id: 5,
    productId: 5,
    customerId: 105,
    customer: { id: 105, name: 'Michael T.', email: 'michael@example.com' },
    rating: 3,
    comment: 'Jacket looks great but the denim is thinner than expected. For the price, I was hoping for something more substantial. Still, it looks good styled open over a hoodie.',
    status: 'approved',
    createdAt: '2026-03-12T11:30:00Z',
    updatedAt: '2026-03-12T11:30:00Z'
  },
  {
    id: 6,
    productId: 5,
    customerId: 106,
    customer: { id: 106, name: 'Lisa W.', email: 'lisa@example.com' },
    rating: 4,
    comment: 'Love the black wash version! Perfect for dressing up or down. Only giving 4 stars because the sleeves are quite long - had to roll them up.',
    status: 'approved',
    createdAt: '2026-04-05T08:00:00Z',
    updatedAt: '2026-04-05T08:00:00Z'
  },
  {
    id: 7,
    productId: 5,
    customerId: 107,
    customer: { id: 107, name: 'Chris B.', email: 'chris@example.com' },
    rating: 5,
    comment: 'Best denim jacket I\'ve owned. The chest pockets are actually functional and the washed finish means no breaking in period. Unisex fit is spot on.',
    status: 'approved',
    createdAt: '2026-04-18T13:45:00Z',
    updatedAt: '2026-04-18T13:45:00Z'
  }
]
  },
  {
    id: 6,
    title: 'Ribbed Midi Dress',
    description: 'A form-fitting ribbed knit midi dress with a square neckline. Stretchy, comfortable, and effortlessly chic.',
    price: 95,
    currency: '$',
    image: '',
    slug: 'ribbed-midi-dress',
    hasVariants: false,
    categories: [
      { id: 8, name: 'Dresses' },
      { id: 5, name: 'Womens' }
    ],
    variants: [
      {
        id: 601, productId: 6, sku: 'RIB-BLK-S', price: 95,
        costPrice: 48, inventory: 20, weight: 0.4,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'S', dataType: 'string' },
          { key: 'material', value: 'Ribbed Viscose Blend', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Leather Crossbody Bag',
    description: 'A compact crossbody bag in full-grain Italian leather. Adjustable strap, magnetic flap closure, and internal card slots.',
    price: 210,
    currency: '$',
    image: '',
    slug: 'leather-crossbody-bag',
    hasVariants: true,
    categories: [
      { id: 9, name: 'Accessories' },
      { id: 7, name: 'Unisex' }
    ],
    variants: [
      {
        id: 701, productId: 7, sku: 'BAG-TAN-OS', price: 210,
        costPrice: 110, inventory: 8, weight: 0.5,
        attributes: [
          { key: 'color', value: 'Tan', dataType: 'color' },
          { key: 'size', value: 'One Size', dataType: 'string' },
          { key: 'material', value: 'Full-Grain Leather', dataType: 'string' }
        ]
      },
      {
        id: 702, productId: 7, sku: 'BAG-BLK-OS', price: 210,
        costPrice: 110, inventory: 12, weight: 0.5,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'One Size', dataType: 'string' },
          { key: 'material', value: 'Full-Grain Leather', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'Organic Cotton Graphic Tee',
    description: 'A relaxed-fit graphic t-shirt in soft organic cotton. Features a screen-printed artist collaboration design on the back.',
    price: 55,
    currency: '$',
    image: '',
    slug: 'organic-cotton-graphic-tee',
    hasVariants: true,
    product_images: ['', ''],
    categories: [
      { id: 10, name: 'T-Shirts' },
      { id: 7, name: 'Unisex' }
    ],
    variants: [
      {
        id: 801, productId: 8, sku: 'TEE-WHT-M', price: 55,
        costPrice: 22, inventory: 40, weight: 0.2,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'material', value: '100% Organic Cotton', dataType: 'string' }
        ]
      },
      {
        id: 802, productId: 8, sku: 'TEE-BLK-XL', price: 55,
        costPrice: 22, inventory: 35, weight: 0.2,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'XL', dataType: 'string' },
          { key: 'material', value: '100% Organic Cotton', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'Tailored Wool Blend Blazer',
    description: 'A sharp single-breasted blazer in a wool-polyester blend. Notch lapel, two-button closure, and fully lined interior.',
    price: 280,
    currency: '$',
    image: '',
    sale_price: 220,
    slug: 'tailored-wool-blend-blazer',
    hasVariants: true,
    categories: [
      { id: 6, name: 'Outerwear' },
      { id: 2, name: 'Mens' },
      { id: 5, name: 'Womens' }
    ],
    variants: [
      {
        id: 901, productId: 9, sku: 'BLZ-NAV-40R', price: 280,
        costPrice: 140, inventory: 6, weight: 0.8,
        attributes: [
          { key: 'color', value: 'Navy', dataType: 'color' },
          { key: 'size', value: '40R', dataType: 'string' },
          { key: 'material', value: '60% Wool, 40% Polyester', dataType: 'string' }
        ]
      },
      {
        id: 902, productId: 9, sku: 'BLZ-CHR-42R', price: 280,
        costPrice: 140, inventory: 4, weight: 0.8,
        attributes: [
          { key: 'color', value: 'Charcoal', dataType: 'color' },
          { key: 'size', value: '42R', dataType: 'string' },
          { key: 'material', value: '60% Wool, 40% Polyester', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Classic Leather Sneakers',
    description: 'Minimalist low-top leather sneakers with a cushioned insole and rubber cupsole. Pairs with everything.',
    price: 160,
    currency: '$',
    image: '',
    slug: 'classic-leather-sneakers',
    hasVariants: true,
    product_images: ['', '', '', ''],
    categories: [
      { id: 11, name: 'Footwear' },
      { id: 7, name: 'Unisex' }
    ],
    variants: [
      {
        id: 1001, productId: 10, sku: 'SNK-WHT-42', price: 160,
        costPrice: 75, inventory: 20, weight: 0.9,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '42', dataType: 'string' },
          { key: 'material', value: 'Full-Grain Leather Upper', dataType: 'string' }
        ]
      },
      {
        id: 1002, productId: 10, sku: 'SNK-BLK-43', price: 160,
        costPrice: 75, inventory: 15, weight: 0.9,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '43', dataType: 'string' },
          { key: 'material', value: 'Full-Grain Leather Upper', dataType: 'string' }
        ]
      }
    ]
  }
];