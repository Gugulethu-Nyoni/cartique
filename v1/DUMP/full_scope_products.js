export const products = [
  {
    id: 1,
    title: 'Nike Air Max 270',
    description: "Men's running shoes with a full-length air unit.",
    price: 299.99,
    currency: '$',
    image: 'https://assets.superbalistcdn.co.za/500x720/filters:quality(75):format(jpg)/3974860/original.jpg',
    sale_price: 129.99,
    slug: 'nike-air-max-270',
    hasVariants: true,
    product_images: [
      'https://assets.superbalistcdn.co.za/500x720/filters:quality(75):format(jpg)/3974860/original.jpg',
      'https://assets.superbalistcdn.co.za/500x720/filters:quality(75):format(jpg)/3974861/side.jpg',
      'https://assets.superbalistcdn.co.za/500x720/filters:quality(75):format(jpg)/3974862/bottom.jpg'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 3, name: 'Running Shoes' }
    ],
    variants: [
      {
        id: 101,
        productId: 1,
        sku: 'NIKE-AM270-8-BLACK',
        price: 299.99,
        costPrice: 150.00,
        inventory: 25,
        weight: 0.8,
        dimensions: { length: 30, width: 15, height: 10 },
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '8', dataType: 'number' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'material', value: 'Mesh/Synthetic', dataType: 'string' },
          { key: 'style', value: 'Running', dataType: 'string' },
          { key: 'air_unit', value: 'Full-length', dataType: 'string' }
        ]
      },
      {
        id: 102,
        productId: 1,
        sku: 'NIKE-AM270-9-BLACK',
        price: 299.99,
        costPrice: 150.00,
        inventory: 18,
        weight: 0.8,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '9', dataType: 'number' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'material', value: 'Mesh/Synthetic', dataType: 'string' }
        ]
      },
      {
        id: 103,
        productId: 1,
        sku: 'NIKE-AM270-10-WHITE',
        price: 299.99,
        costPrice: 150.00,
        inventory: 12,
        weight: 0.8,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '10', dataType: 'number' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'material', value: 'Mesh/Synthetic', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Adidas Superstar',
    description: 'Classic shell-toed sneakers for men and women.',
    price: 79.99,
    currency: '$',
    image: 'https://www.side-step.co.za/media/catalog/product/cache/60023b40f56fdff39b9c495b8e044aef/a/d/add6022gt-adidas-retropy-f2-black-grey-white-ig9986-v1_jpg.jpg',
    slug: 'adidas-superstar',
    hasVariants: true,
    product_images: [
      'https://www.side-step.co.za/media/catalog/product/cache/60023b40f56fdff39b9c495b8e044aef/a/d/add6022gt-adidas-retropy-f2-black-grey-white-ig9986-v1_jpg.jpg',
      'https://www.side-step.co.za/media/catalog/product/cache/60023b40f56fdff39b9c495b8e044aef/a/d/add6022gt-adidas-retropy-f2-black-grey-white-ig9986-v2_jpg.jpg',
      'https://www.side-step.co.za/media/catalog/product/cache/60023b40f56fdff39b9c495b8e044aef/a/d/add6022gt-adidas-retropy-f2-black-grey-white-ig9986-v3_jpg.jpg'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 4, name: 'Casual Shoes' }
    ],
    variants: [
      {
        id: 201,
        productId: 2,
        sku: 'ADID-SS-7-WHITE',
        price: 79.99,
        costPrice: 35.00,
        inventory: 42,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '7', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'shell_toe', value: 'true', dataType: 'boolean' },
          { key: 'style', value: 'Casual', dataType: 'string' }
        ]
      },
      {
        id: 202,
        productId: 2,
        sku: 'ADID-SS-8-BLACK',
        price: 79.99,
        costPrice: 35.00,
        inventory: 36,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '8', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'shell_toe', value: 'true', dataType: 'boolean' }
        ]
      },
      {
        id: 203,
        productId: 2,
        sku: 'ADID-SS-9-RED',
        price: 84.99,
        costPrice: 38.00,
        inventory: 8,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'Red', dataType: 'color' },
          { key: 'size', value: '9', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'shell_toe', value: 'true', dataType: 'boolean' },
          { key: 'limited_edition', value: 'true', dataType: 'boolean' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'The North Face Thermoball Jacket',
    description: 'Water-resistant and breathable insulated jacket for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://www.younglifestore.com/cdn/shop/products/CL09041TheNorthFaceMen_sThermoBallTrekkerJacket6.jpg?v=1631912778&width=450',
    sale_price: 80.99,
    slug: 'north-face-thermoball-jacket',
    hasVariants: true,
    product_images: [
      'https://www.younglifestore.com/cdn/shop/products/CL09041TheNorthFaceMen_sThermoBallTrekkerJacket6.jpg?v=1631912778&width=450',
      'https://www.younglifestore.com/cdn/shop/products/CL09041TheNorthFaceMen_sThermoBallTrekkerJacket2.jpg?v=1631912778&width=450',
      'https://www.younglifestore.com/cdn/shop/products/CL09041TheNorthFaceMen_sThermoBallTrekkerJacket3.jpg?v=1631912778&width=450'
    ],
    categories: [
      { id: 5, name: 'Outerwear' },
      { id: 6, name: 'Jackets' },
      { id: 7, name: 'Insulated Jackets' }
    ],
    variants: [
      {
        id: 301,
        productId: 3,
        sku: 'TNF-TB-M-BLACK',
        price: 179.99,
        sale_price: 80.99,
        costPrice: 65.00,
        inventory: 15,
        weight: 0.9,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'insulation', value: 'ThermoBall', dataType: 'string' },
          { key: 'water_resistant', value: 'true', dataType: 'boolean' },
          { key: 'fill_power', value: '600', dataType: 'number', unit: 'fill' }
        ]
      },
      {
        id: 302,
        productId: 3,
        sku: 'TNF-TB-L-NAVY',
        price: 179.99,
        sale_price: 80.99,
        costPrice: 65.00,
        inventory: 9,
        weight: 0.95,
        attributes: [
          { key: 'color', value: 'Navy Blue', dataType: 'color' },
          { key: 'size', value: 'L', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'insulation', value: 'ThermoBall', dataType: 'string' },
          { key: 'water_resistant', value: 'true', dataType: 'boolean' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Levi's 501 Original Fit Jeans",
    description: 'Classic straight-fit jeans for men.',
    price: 69.99,
    currency: '$',
    image: 'https://assets.woolworthsstatic.co.za/501-Original-Fit-Jeans-INDIGO-506356158.jpg?V=hpEA&o=eyJidWNrZXQiOiJ3dy1vbmxpbmUtaW1hZ2UtcmVzaXplIiwia2V5IjoiaW1hZ2VzL2VsYXN0aWNlcmEvcHJvZHVjdHMvaGVyby8yMDIyLTA4LTAyLzUwNjM1NjE1OF9JTkRJR09faGVyby5qcGcifQ&w=800&q=85',
    slug: 'levis-501-original-fit-jeans',
    hasVariants: true,
    product_images: [
      'https://assets.woolworthsstatic.co.za/501-Original-Fit-Jeans-INDIGO-506356158.jpg',
      'https://assets.woolworthsstatic.co.za/501-Original-Fit-Jeans-INDIGO-506356159.jpg',
      'https://assets.woolworthsstatic.co.za/501-Original-Fit-Jeans-INDIGO-506356160.jpg'
    ],
    categories: [
      { id: 9, name: 'Apparel' },
      { id: 10, name: 'Bottoms' },
      { id: 11, name: 'Jeans' }
    ],
    variants: [
      {
        id: 401,
        productId: 4,
        sku: 'LEVI-501-30x32-IND',
        price: 69.99,
        costPrice: 28.00,
        inventory: 32,
        weight: 0.6,
        attributes: [
          { key: 'color', value: 'Indigo', dataType: 'color' },
          { key: 'waist', value: '30', dataType: 'number' },
          { key: 'length', value: '32', dataType: 'number' },
          { key: 'fit', value: 'Original', dataType: 'string' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'material', value: '100% Cotton', dataType: 'string' },
          { key: 'rise', value: 'Mid', dataType: 'string' }
        ]
      },
      {
        id: 402,
        productId: 4,
        sku: 'LEVI-501-32x32-IND',
        price: 69.99,
        costPrice: 28.00,
        inventory: 28,
        weight: 0.65,
        attributes: [
          { key: 'color', value: 'Indigo', dataType: 'color' },
          { key: 'waist', value: '32', dataType: 'number' },
          { key: 'length', value: '32', dataType: 'number' },
          { key: 'fit', value: 'Original', dataType: 'string' },
          { key: 'gender', value: 'Men', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Vans Old Skool',
    description: 'Classic skateboarding shoes for men and women.',
    price: 59.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/178901246-1200-1600?v=638759944272900000&width=1200&height=1600&aspect=true',
    slug: 'vans-old-skool',
    hasVariants: true,
    product_images: [
      'https://thefoschini.vtexassets.com/arquivos/ids/178901246-1200-1600?v=638759944272900000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/178901247-1200-1600?v=638759944272900000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/178901248-1200-1600?v=638759944272900000&width=1200&height=1600&aspect=true'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 14, name: 'Skate Shoes' }
    ],
    variants: [
      {
        id: 501,
        productId: 5,
        sku: 'VANS-OS-8-BLACKWHITE',
        price: 59.99,
        costPrice: 25.00,
        inventory: 48,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'Black/White', dataType: 'color' },
          { key: 'size', value: '8', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'style', value: 'Skate', dataType: 'string' },
          { key: 'sidestripe', value: 'true', dataType: 'boolean' }
        ]
      },
      {
        id: 502,
        productId: 5,
        sku: 'VANS-OS-9-NAVY',
        price: 59.99,
        costPrice: 25.00,
        inventory: 36,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'Navy', dataType: 'color' },
          { key: 'size', value: '9', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'style', value: 'Skate', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Champion Life Hoodie',
    description: 'Soft and comfortable hoodie for men and women.',
    price: 29.99,
    currency: '$',
    image: 'https://cdn.shopify.com/s/files/1/0802/5836/7772/files/VN000D3HY28-HERO.jpg?v=1718880696',
    slug: 'champion-life-hoodie',
    hasVariants: true,
    product_images: [
      'https://cdn.shopify.com/s/files/1/0802/5836/7772/files/VN000D3HY28-HERO.jpg?v=1718880696',
      'https://cdn.shopify.com/s/files/1/0802/5836/7772/files/VN000D3HY28-BACK.jpg?v=1718880696',
      'https://cdn.shopify.com/s/files/1/0802/5836/7772/files/VN000D3HY28-SIDE.jpg?v=1718880696'
    ],
    categories: [
      { id: 9, name: 'Apparel' },
      { id: 12, name: 'Tops' },
      { id: 13, name: 'Hoodies' }
    ],
    variants: [
      {
        id: 601,
        productId: 6,
        sku: 'CHAMP-LH-M-GREY',
        price: 29.99,
        costPrice: 12.00,
        inventory: 62,
        weight: 0.8,
        attributes: [
          { key: 'color', value: 'Heather Grey', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'material', value: 'Cotton/Polyester', dataType: 'string' },
          { key: 'hood', value: 'true', dataType: 'boolean' },
          { key: 'pouch_pocket', value: 'true', dataType: 'boolean' }
        ]
      },
      {
        id: 602,
        productId: 6,
        sku: 'CHAMP-LH-L-BLACK',
        price: 29.99,
        costPrice: 12.00,
        inventory: 45,
        weight: 0.85,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'L', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'material', value: 'Cotton/Polyester', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Reebok Classic Leather',
    description: 'Iconic and versatile sneakers for men and women.',
    price: 69.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/179098005-1200-1600?v=638760030876370000&width=1200&height=1600&aspect=true',
    slug: 'reebok-classic-leather',
    hasVariants: true,
    product_images: [
      'https://thefoschini.vtexassets.com/arquivos/ids/179098005-1200-1600?v=638760030876370000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/179098006-1200-1600?v=638760030876370000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/179098007-1200-1600?v=638760030876370000&width=1200&height=1600&aspect=true'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 4, name: 'Casual Shoes' }
    ],
    variants: [
      {
        id: 701,
        productId: 7,
        sku: 'REE-CL-9-WHITE',
        price: 69.99,
        costPrice: 30.00,
        inventory: 34,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '9', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'material', value: 'Leather', dataType: 'string' },
          { key: 'style', value: 'Retro', dataType: 'string' }
        ]
      },
      {
        id: 702,
        productId: 7,
        sku: 'REE-CL-10-BLUE',
        price: 69.99,
        costPrice: 30.00,
        inventory: 22,
        weight: 0.7,
        attributes: [
          { key: 'color', value: 'Royal Blue', dataType: 'color' },
          { key: 'size', value: '10', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'material', value: 'Leather', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'Patagonia Tres 3-in-1 Parka',
    description: 'Versatile and sustainable parka for men and women.',
    price: 229.99,
    currency: '$',
    image: 'https://contents.mediadecathlon.com/p2077593/1cr1/k$82c176d3de769da9c2a8fe8c5329de0b/m-3-in-1-waterproof-comfort-10c-travel-trekking-jacket-travel-500-black.jpg?format=auto&f=1200x0',
    slug: 'patagonia-tres-3-in-1-parka',
    hasVariants: true,
    product_images: [
      'https://contents.mediadecathlon.com/p2077593/1cr1/k$82c176d3de769da9c2a8fe8c5329de0b/m-3-in-1-waterproof-comfort-10c-travel-trekking-jacket-travel-500-black.jpg?format=auto&f=1200x0',
      'https://contents.mediadecathlon.com/p2077593/1cr1/k$82c176d3de769da9c2a8fe8c5329de0b/m-3-in-1-waterproof-comfort-10c-travel-trekking-jacket-travel-500-back.jpg?format=auto&f=1200x0',
      'https://contents.mediadecathlon.com/p2077593/1cr1/k$82c176d3de769da9c2a8fe8c5329de0b/m-3-in-1-waterproof-comfort-10c-travel-trekking-jacket-travel-500-detail.jpg?format=auto&f=1200x0'
    ],
    categories: [
      { id: 5, name: 'Outerwear' },
      { id: 6, name: 'Jackets' },
      { id: 15, name: '3-in-1 Jackets' }
    ],
    variants: [
      {
        id: 801,
        productId: 8,
        sku: 'PAT-TR-M-GREEN',
        price: 229.99,
        costPrice: 110.00,
        inventory: 9,
        weight: 1.2,
        attributes: [
          { key: 'color', value: 'Forest Green', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'style', value: '3-in-1', dataType: 'string' },
          { key: 'waterproof', value: 'true', dataType: 'boolean' },
          { key: 'recycled_materials', value: 'true', dataType: 'boolean' },
          { key: 'detachable_lining', value: 'true', dataType: 'boolean' }
        ]
      },
      {
        id: 802,
        productId: 8,
        sku: 'PAT-TR-L-BLUE',
        price: 229.99,
        costPrice: 110.00,
        inventory: 6,
        weight: 1.3,
        attributes: [
          { key: 'color', value: 'Deep Blue', dataType: 'color' },
          { key: 'size', value: 'L', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'style', value: '3-in-1', dataType: 'string' },
          { key: 'waterproof', value: 'true', dataType: 'boolean' }
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'Converse Chuck Taylor All Star',
    description: 'Classic and iconic sneakers for men and women.',
    price: 49.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/173440242-1200-1600?v=638725619779270000&width=1200&height=1600&aspect=true',
    slug: 'converse-chuck-taylor-all-star',
    hasVariants: true,
    product_images: [
      'https://thefoschini.vtexassets.com/arquivos/ids/173440242-1200-1600?v=638725619779270000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/173440243-1200-1600?v=638725619779270000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/173440244-1200-1600?v=638725619779270000&width=1200&height=1600&aspect=true'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 4, name: 'Casual Shoes' }
    ],
    variants: [
      {
        id: 901,
        productId: 9,
        sku: 'CONV-CT-7-HIGH',
        price: 49.99,
        costPrice: 22.00,
        inventory: 72,
        weight: 0.6,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '7', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'height', value: 'High Top', dataType: 'string' },
          { key: 'style', value: 'Classic', dataType: 'string' }
        ]
      },
      {
        id: 902,
        productId: 9,
        sku: 'CONV-CT-8-LOW',
        price: 49.99,
        costPrice: 22.00,
        inventory: 58,
        weight: 0.5,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '8', dataType: 'number' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'height', value: 'Low Top', dataType: 'string' },
          { key: 'style', value: 'Classic', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'The North Face Venture 2 Jacket',
    description: 'Water-resistant and breathable jacket for men and women.',
    price: 99.99,
    currency: '$',
    image: 'https://thenorthface.co.za/cdn/shop/files/7QEYLFW2_960x_crop_center.png?v=1738400547',
    slug: 'north-face-venture-2-jacket',
    hasVariants: true,
    product_images: [
      'https://thenorthface.co.za/cdn/shop/files/7QEYLFW2_960x_crop_center.png?v=1738400547',
      'https://thenorthface.co.za/cdn/shop/files/7QEYLFW2_back_960x_crop_center.png?v=1738400547',
      'https://thenorthface.co.za/cdn/shop/files/7QEYLFW2_detail_960x_crop_center.png?v=1738400547'
    ],
    categories: [
      { id: 5, name: 'Outerwear' },
      { id: 6, name: 'Jackets' },
      { id: 8, name: 'Rain Jackets' }
    ],
    variants: [
      {
        id: 1001,
        productId: 10,
        sku: 'TNF-V2-S-BLACK',
        price: 99.99,
        costPrice: 45.00,
        inventory: 24,
        weight: 0.5,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: 'S', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'waterproof', value: 'true', dataType: 'boolean' },
          { key: 'breathable', value: 'true', dataType: 'boolean' },
          { key: 'hood', value: 'true', dataType: 'boolean' }
        ]
      },
      {
        id: 1002,
        productId: 10,
        sku: 'TNF-V2-M-BLUE',
        price: 99.99,
        costPrice: 45.00,
        inventory: 18,
        weight: 0.55,
        attributes: [
          { key: 'color', value: 'Blue', dataType: 'color' },
          { key: 'size', value: 'M', dataType: 'string' },
          { key: 'gender', value: 'Unisex', dataType: 'string' },
          { key: 'waterproof', value: 'true', dataType: 'boolean' }
        ]
      }
    ]
  },
  {
    id: 11,
    title: 'Adidas Ultraboost',
    description: 'High-performance running shoes for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://thefoschini.vtexassets.com/arquivos/ids/173406258-1200-1600?v=638725600565000000&width=1200&height=1600&aspect=true',
    slug: 'adidas-ultraboost',
    hasVariants: true,
    product_images: [
      'https://thefoschini.vtexassets.com/arquivos/ids/173406258-1200-1600?v=638725600565000000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/173406259-1200-1600?v=638725600565000000&width=1200&height=1600&aspect=true',
      'https://thefoschini.vtexassets.com/arquivos/ids/173406260-1200-1600?v=638725600565000000&width=1200&height=1600&aspect=true'
    ],
    categories: [
      { id: 1, name: 'Footwear' },
      { id: 2, name: 'Sneakers' },
      { id: 3, name: 'Running Shoes' }
    ],
    variants: [
      {
        id: 1101,
        productId: 11,
        sku: 'ADID-UB-9-BLACK',
        price: 179.99,
        costPrice: 85.00,
        inventory: 16,
        weight: 0.75,
        attributes: [
          { key: 'color', value: 'Black', dataType: 'color' },
          { key: 'size', value: '9', dataType: 'number' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'technology', value: 'Boost', dataType: 'string' },
          { key: 'purpose', value: 'Running', dataType: 'string' },
          { key: 'energy_return', value: 'high', dataType: 'string' }
        ]
      },
      {
        id: 1102,
        productId: 11,
        sku: 'ADID-UB-10-WHITE',
        price: 179.99,
        costPrice: 85.00,
        inventory: 14,
        weight: 0.75,
        attributes: [
          { key: 'color', value: 'White', dataType: 'color' },
          { key: 'size', value: '10', dataType: 'number' },
          { key: 'gender', value: 'Men', dataType: 'string' },
          { key: 'technology', value: 'Boost', dataType: 'string' }
        ]
      }
    ]
  }
];