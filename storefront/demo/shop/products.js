//storefront/demo/shop/products.js

export const products = [
    {
        id: 9,
        sku: 'CHIA-001',
        slug: 'chia-seeds',
        short_description: 'Premium chia seeds rich in Omega-3 and fiber.',
        description:
            "Boost your daily nutrition with our premium Chia Seeds, nature's richest plant source of Omega-3 fatty acids, fiber, and protein. Promotes fullness and sustained energy.",
        status: 'active',

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

        createdAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://sevenhillswholefoods.com/cdn/shop/files/MAIN_2_88a267ce-48c6-4986-830f-0d4faa9c2cd6.png',

        title: 'Chia Seeds',

        product_images: [
            'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=500',
            'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?w=500',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
            'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?w=500'
        ],

        variants: [
            {
                id: 9,
                productId: 9,
                sku: 'CHS001',
                barcode: null,

                attributes: [
                    { key: 'form', value: 'Seeds', dataType: 'string' },
                    { key: 'weight', value: '250g', dataType: 'string' },
                    {
                        key: 'pouch_size',
                        value: '160x240mm + 80mm gusset',
                        dataType: 'string'
                    }
                ],

                variant_image: null,

                price: 160,
                compareAtPrice: null,
                costPrice: 80,

                bulkPrice: 140,
                bulkMinimumQty: 10,

                inventory: 59,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 16,
                width_cm: 8,
                height_cm: 24,
                weight_kg: 0.28,

                isDefault: true,

                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },

            {
                id: 104,
                productId: 9,
                sku: 'CHIA-1KG',
                barcode: null,

                attributes: [
                    { key: 'weight', value: '1kg', dataType: 'string' }
                ],

                variant_image: null,

                price: 140,
                compareAtPrice: null,
                costPrice: 70,

                bulkPrice: 110,
                bulkMinimumQty: 5,

                inventory: 30,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 20,
                width_cm: 12,
                height_cm: 28,
                weight_kg: 1.0,

                isDefault: false,

                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 5,
                name: 'Seeds & Grains',
                slug: 'seeds-grains',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            }
        ],

        media: [],

        reviews: [
            {
                id: 1,
                productId: 9,
                customerId: 1,
                rating: 5,
                comment:
                    'These chia seeds are fantastic! I add them to my morning smoothie and they keep me full until lunch. Great quality!',
                status: 'approved',
                createdAt: '2026-05-15T10:30:00.000Z',
                updatedAt: '2026-05-15T10:30:00.000Z',

                customer: {
                    id: 1,
                    phone: null,
                    metadata: null,
                    createdAt: '2026-01-01T10:00:00.000Z',
                    loyaltyPoints: 0,
                    updatedAt: '2026-01-01T10:00:00.000Z',
                    userId: 1,

                    users: {
                        id: 1,
                        name: 'Sarah',
                        surname: 'M.',
                        email: 'sarah@example.com'
                    }
                }
            },

            {
                id: 2,
                productId: 9,
                customerId: 2,
                rating: 4,
                comment:
                    'Good quality seeds. The 250g pack lasts me about 2 weeks. Will definitely buy again.',
                status: 'approved',
                createdAt: '2026-06-01T14:20:00.000Z',
                updatedAt: '2026-06-01T14:20:00.000Z',

                customer: {
                    id: 2,
                    phone: null,
                    metadata: null,
                    createdAt: '2026-01-01T10:00:00.000Z',
                    loyaltyPoints: 0,
                    updatedAt: '2026-01-01T10:00:00.000Z',
                    userId: 2,

                    users: {
                        id: 2,
                        name: 'John',
                        surname: 'D.',
                        email: 'john@example.com'
                    }
                }
            }
        ]
    },

    {
        id: 14,
        sku: 'SOURSOP-001',
        slug: 'soursop-leaves',
        short_description:
            'Hand-picked soursop leaves for traditional tea.',
        description:
            'Hand-picked soursop leaves for brewing a potent, traditional herbal tea. Known for their natural immune-modulating, anti-inflammatory, and calming properties.',
        status: 'active',

        attributes: {
            origin: 'South Africa',
            organic: true,
            glutenFree: true,
            vegan: true
        },

        metadata: {
            brand: 'Botaniq',
            unit: 'g',
            precision: 2
        },

        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://media.takealot.com/covers_images/b7f38d9042d14bd388379d8bdb2ce41b/s-zoom.file',

        title: 'Soursop Leaves',

        product_images: [
            'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&h=600&fit=crop',
            'https://images.pexels.com/photos/4198021/pexels-photo-4198021.jpeg?w=600&h=600&fit=crop',
            'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?w=600&h=600&fit=crop'
        ],
        variants: [
            {
                id: 14,
                productId: 14,
                sku: 'SHR002',
                barcode: null,

                attributes: [
                    { key: 'form', value: 'Leaves', dataType: 'string' },
                    { key: 'weight', value: '50g', dataType: 'string' },
                    {
                        key: 'pouch_size',
                        value: '160x240mm + 80mm gusset',
                        dataType: 'string'
                    },
                    {
                        key: 'quantity',
                        value: 'Pack of 10 leaves',
                        dataType: 'string'
                    }
                ],

                variant_image: null,

                price: 200,
                compareAtPrice: null,
                costPrice: 100,

                bulkPrice: 175,
                bulkMinimumQty: 10,

                inventory: 30,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 16,
                width_cm: 8,
                height_cm: 24,
                weight_kg: 0.07,

                isDefault: true,

                createdAt: '2026-01-15T10:00:00.000Z',
                updatedAt: '2026-01-15T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 2,
                name: 'Teas & Infusions',
                slug: 'teas-infusions',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },
            {
                id: 1,
                name: 'Immune Boosters',
                slug: 'immune-boosters',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            }
        ],

        media: [],

        reviews: [
            {
                id: 3,
                productId: 14,
                customerId: 1,
                rating: 5,
                comment:
                    'This soursop tea is amazing! It has a very soothing effect and helps me sleep better at night.',
                status: 'approved',
                createdAt: '2026-06-10T09:15:00.000Z',
                updatedAt: '2026-06-10T09:15:00.000Z',

                customer: {
                    id: 1,
                    phone: null,
                    metadata: null,
                    createdAt: '2026-01-01T10:00:00.000Z',
                    loyaltyPoints: 0,
                    updatedAt: '2026-01-01T10:00:00.000Z',
                    userId: 1,

                    users: {
                        id: 1,
                        name: 'Sarah',
                        surname: 'M.',
                        email: 'sarah@example.com'
                    }
                }
            }
        ]
    },

    {
        id: 25,
        sku: 'MORINGA-001',
        slug: 'moringa-powder',
        short_description: 'Organic moringa leaf powder - nature\'s multivitamin.',
        description:
            'Premium organic moringa leaf powder, sustainably sourced and hand-harvested. Packed with vitamins A, C, and E, calcium, potassium, and protein. A powerful superfood for daily wellness.',
        status: 'active',

        attributes: {
            origin: 'South Africa',
            organic: true,
            glutenFree: true,
            vegan: true
        },

        metadata: {
            brand: 'Botaniq',
            unit: 'g',
            precision: 2
        },

        createdAt: '2026-02-01T10:00:00.000Z',
        updatedAt: '2026-02-01T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop&crop=center',

        title: 'Moringa Powder',

        product_images: [],

        variants: [
            {
                id: 25,
                productId: 25,
                sku: 'MOR001',
                barcode: null,

                attributes: [
                    { key: 'form', value: 'Powder', dataType: 'string' },
                    { key: 'weight', value: '100g', dataType: 'string' },
                    {
                        key: 'pouch_size',
                        value: '160x240mm + 80mm gusset',
                        dataType: 'string'
                    }
                ],

                variant_image: null,

                price: 180,
                compareAtPrice: null,
                costPrice: 90,

                bulkPrice: 150,
                bulkMinimumQty: 10,

                inventory: 45,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 16,
                width_cm: 8,
                height_cm: 24,
                weight_kg: 0.12,

                isDefault: true,

                createdAt: '2026-02-01T10:00:00.000Z',
                updatedAt: '2026-02-01T10:00:00.000Z'
            },

            {
                id: 26,
                productId: 25,
                sku: 'MOR002',
                barcode: null,

                attributes: [
                    { key: 'form', value: 'Powder', dataType: 'string' },
                    { key: 'weight', value: '250g', dataType: 'string' }
                ],

                variant_image: null,

                price: 350,
                compareAtPrice: null,
                costPrice: 175,

                bulkPrice: 300,
                bulkMinimumQty: 5,

                inventory: 20,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 20,
                width_cm: 12,
                height_cm: 28,
                weight_kg: 0.30,

                isDefault: false,

                createdAt: '2026-02-01T10:00:00.000Z',
                updatedAt: '2026-02-01T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 3,
                name: 'Superfoods',
                slug: 'superfoods',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },
            {
                id: 1,
                name: 'Immune Boosters',
                slug: 'immune-boosters',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            }
        ],

        media: [],

        reviews: [
            {
                id: 4,
                productId: 25,
                customerId: 2,
                rating: 5,
                comment:
                    'I\'ve been adding this moringa powder to my smoothies for a month now. I feel more energetic and my skin looks clearer!',
                status: 'approved',
                createdAt: '2026-06-20T11:30:00.000Z',
                updatedAt: '2026-06-20T11:30:00.000Z',

                customer: {
                    id: 2,
                    phone: null,
                    metadata: null,
                    createdAt: '2026-01-01T10:00:00.000Z',
                    loyaltyPoints: 0,
                    updatedAt: '2026-01-01T10:00:00.000Z',
                    userId: 2,

                    users: {
                        id: 2,
                        name: 'John',
                        surname: 'D.',
                        email: 'john@example.com'
                    }
                }
            },

            {
                id: 5,
                productId: 25,
                customerId: 3,
                rating: 4,
                comment:
                    'Good quality moringa. I use it in my morning tea. The 100g pack lasts me about 3 weeks.',
                status: 'approved',
                createdAt: '2026-07-01T08:45:00.000Z',
                updatedAt: '2026-07-01T08:45:00.000Z',

                customer: {
                    id: 3,
                    phone: null,
                    metadata: null,
                    createdAt: '2026-01-01T10:00:00.000Z',
                    loyaltyPoints: 0,
                    updatedAt: '2026-01-01T10:00:00.000Z',
                    userId: 3,

                    users: {
                        id: 3,
                        name: 'Lisa',
                        surname: 'R.',
                        email: 'lisa@example.com'
                    }
                }
            }
        ]
    }
];

export default products;