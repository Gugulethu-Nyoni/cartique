//storefront/demo/shop/products.js

export const products = [
    {
        id: 9,
        sku: 'PREMIUM-HOODIE-001',
        slug: 'premium-hoodie',
        short_description: 'Premium organic cotton hoodie for everyday comfort.',
        description:
            "Our premium organic cotton hoodie combines sustainable fashion with everyday comfort. Ethically sourced, pre-shrunk, and available in multiple colors. Perfect for casual wear or layering.",
        status: 'active',

        attributes: {
            origin: 'Portugal',
            organic: true,
            sustainable: true,
            gender: 'unisex'
        },

        metadata: {
            brand: 'Botaniq Wear',
            unit: 'piece',
            precision: 2
        },

        createdAt: '2026-01-01T10:00:00.000Z',
        updatedAt: '2026-01-01T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop&crop=center',

        title: 'Premium Organic Hoodie',

        product_images: [
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop&crop=center&flip=horizontal'
        ],

        variants: [
            {
                id: 9,
                productId: 9,
                sku: 'HOODIE-M-BLK',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Black', dataType: 'string' },
                    { key: 'size', value: 'M', dataType: 'string' },
                    { key: 'material', value: '100% Organic Cotton', dataType: 'string' },
                    { key: 'weight', value: '450gsm', dataType: 'string' }
                ],

                variant_image: null,

                price: 899,
                compareAtPrice: 1199,
                costPrice: 450,

                bulkPrice: 799,
                bulkMinimumQty: 5,

                inventory: 45,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 70,
                width_cm: 55,
                height_cm: 5,
                weight_kg: 0.8,

                isDefault: true,

                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },

            {
                id: 104,
                productId: 9,
                sku: 'HOODIE-L-BLK',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Black', dataType: 'string' },
                    { key: 'size', value: 'L', dataType: 'string' },
                    { key: 'material', value: '100% Organic Cotton', dataType: 'string' },
                    { key: 'weight', value: '450gsm', dataType: 'string' }
                ],

                variant_image: null,

                price: 899,
                compareAtPrice: 1199,
                costPrice: 450,

                bulkPrice: 799,
                bulkMinimumQty: 5,

                inventory: 30,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 72,
                width_cm: 58,
                height_cm: 5,
                weight_kg: 0.85,

                isDefault: false,

                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },

            {
                id: 105,
                productId: 9,
                sku: 'HOODIE-S-CHARCOAL',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Charcoal', dataType: 'string' },
                    { key: 'size', value: 'S', dataType: 'string' },
                    { key: 'material', value: '100% Organic Cotton', dataType: 'string' },
                    { key: 'weight', value: '450gsm', dataType: 'string' }
                ],

                variant_image: null,

                price: 899,
                compareAtPrice: 1199,
                costPrice: 450,

                bulkPrice: 799,
                bulkMinimumQty: 5,

                inventory: 25,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 68,
                width_cm: 52,
                height_cm: 5,
                weight_kg: 0.75,

                isDefault: false,

                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 5,
                name: 'Hoodies & Sweatshirts',
                slug: 'hoodies-sweatshirts',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },
            {
                id: 2,
                name: 'Sustainable Fashion',
                slug: 'sustainable-fashion',
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
                    'This hoodie is incredibly soft and well-made. The fit is perfect and the fabric feels premium. Definitely worth the price!',
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
                    'Great quality hoodie. The charcoal color looks amazing. Only wish it came in more colors.',
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
        sku: 'LINEN-SHIRT-001',
        slug: 'linen-shirt',
        short_description: 'Premium linen button-down shirt for effortless style.',
        description:
            'Crafted from 100% European linen, this button-down shirt offers breathability and timeless style. Perfect for warm weather or layering. Naturally wrinkle-resistant and eco-friendly.',
        status: 'active',

        attributes: {
            origin: 'Italy',
            organic: true,
            sustainable: true,
            gender: 'men'
        },

        metadata: {
            brand: 'Botaniq Wear',
            unit: 'piece',
            precision: 2
        },

        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center',

        title: 'Premium Linen Shirt',

        product_images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1602810319428-6a75bd8d6aa8?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1602810318456-8c8d4a97b3b5?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=600&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop&crop=center&flip=horizontal'
        ],

        variants: [
            {
                id: 14,
                productId: 14,
                sku: 'SHIRT-M-WHITE',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'White', dataType: 'string' },
                    { key: 'size', value: 'M', dataType: 'string' },
                    { key: 'material', value: '100% Linen', dataType: 'string' },
                    { key: 'weight', value: '160gsm', dataType: 'string' }
                ],

                variant_image: null,

                price: 699,
                compareAtPrice: null,
                costPrice: 350,

                bulkPrice: 599,
                bulkMinimumQty: 5,

                inventory: 35,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 75,
                width_cm: 55,
                height_cm: 3,
                weight_kg: 0.4,

                isDefault: true,

                createdAt: '2026-01-15T10:00:00.000Z',
                updatedAt: '2026-01-15T10:00:00.000Z'
            },

            {
                id: 106,
                productId: 14,
                sku: 'SHIRT-L-WHITE',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'White', dataType: 'string' },
                    { key: 'size', value: 'L', dataType: 'string' },
                    { key: 'material', value: '100% Linen', dataType: 'string' },
                    { key: 'weight', value: '160gsm', dataType: 'string' }
                ],

                variant_image: null,

                price: 699,
                compareAtPrice: null,
                costPrice: 350,

                bulkPrice: 599,
                bulkMinimumQty: 5,

                inventory: 25,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 77,
                width_cm: 58,
                height_cm: 3,
                weight_kg: 0.45,

                isDefault: false,

                createdAt: '2026-01-15T10:00:00.000Z',
                updatedAt: '2026-01-15T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 2,
                name: 'Shirts',
                slug: 'shirts',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },
            {
                id: 1,
                name: 'Sustainable Fashion',
                slug: 'sustainable-fashion',
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
                    'This linen shirt is perfect for summer. Lightweight, breathable, and the quality is outstanding.',
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
        sku: 'LEGACY-DENIM-001',
        slug: 'legacy-denim',
        short_description: 'Classic straight-leg denim jeans with a modern fit.',
        description:
            'Our Legacy Denim jeans blend classic styling with modern comfort. Made from premium Japanese selvedge denim with a touch of stretch for all-day comfort. Ethically manufactured and built to last.',
        status: 'active',

        attributes: {
            origin: 'Japan',
            organic: false,
            sustainable: true,
            gender: 'men'
        },

        metadata: {
            brand: 'Botaniq Wear',
            unit: 'piece',
            precision: 2
        },

        createdAt: '2026-02-01T10:00:00.000Z',
        updatedAt: '2026-02-01T10:00:00.000Z',

        currency: 'ZAR',

        image:
            'https://images.unsplash.com/photo-1542272604-3c1e5c9c3c5e?w=600&h=600&fit=crop&crop=center',

        title: 'Legacy Denim Jeans',

        product_images: [],

        variants: [
            {
                id: 25,
                productId: 25,
                sku: 'DENIM-32-INDIGO',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Indigo', dataType: 'string' },
                    { key: 'waist', value: '32"', dataType: 'string' },
                    { key: 'length', value: '34"', dataType: 'string' },
                    { key: 'material', value: '98% Cotton, 2% Elastane', dataType: 'string' },
                    { key: 'weight', value: '14oz', dataType: 'string' }
                ],

                variant_image: null,

                price: 1299,
                compareAtPrice: null,
                costPrice: 650,

                bulkPrice: 1099,
                bulkMinimumQty: 3,

                inventory: 40,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 105,
                width_cm: 40,
                height_cm: 4,
                weight_kg: 0.8,

                isDefault: true,

                createdAt: '2026-02-01T10:00:00.000Z',
                updatedAt: '2026-02-01T10:00:00.000Z'
            },

            {
                id: 26,
                productId: 25,
                sku: 'DENIM-33-INDIGO',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Indigo', dataType: 'string' },
                    { key: 'waist', value: '33"', dataType: 'string' },
                    { key: 'length', value: '34"', dataType: 'string' },
                    { key: 'material', value: '98% Cotton, 2% Elastane', dataType: 'string' },
                    { key: 'weight', value: '14oz', dataType: 'string' }
                ],

                variant_image: null,

                price: 1299,
                compareAtPrice: null,
                costPrice: 650,

                bulkPrice: 1099,
                bulkMinimumQty: 3,

                inventory: 35,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 105,
                width_cm: 42,
                height_cm: 4,
                weight_kg: 0.85,

                isDefault: false,

                createdAt: '2026-02-01T10:00:00.000Z',
                updatedAt: '2026-02-01T10:00:00.000Z'
            },

            {
                id: 27,
                productId: 25,
                sku: 'DENIM-34-INDIGO',
                barcode: null,

                attributes: [
                    { key: 'color', value: 'Indigo', dataType: 'string' },
                    { key: 'waist', value: '34"', dataType: 'string' },
                    { key: 'length', value: '34"', dataType: 'string' },
                    { key: 'material', value: '98% Cotton, 2% Elastane', dataType: 'string' },
                    { key: 'weight', value: '14oz', dataType: 'string' }
                ],

                variant_image: null,

                price: 1299,
                compareAtPrice: null,
                costPrice: 650,

                bulkPrice: 1099,
                bulkMinimumQty: 3,

                inventory: 25,
                inventoryPolicy: 'deny',
                low_stock_threshold: 5,

                length_cm: 105,
                width_cm: 44,
                height_cm: 4,
                weight_kg: 0.9,

                isDefault: false,

                createdAt: '2026-02-01T10:00:00.000Z',
                updatedAt: '2026-02-01T10:00:00.000Z'
            }
        ],

        categories: [
            {
                id: 3,
                name: 'Denim & Jeans',
                slug: 'denim-jeans',
                description: null,
                parent_id: null,
                metadata: null,
                sortOrder: 0,
                createdAt: '2026-01-01T10:00:00.000Z',
                updatedAt: '2026-01-01T10:00:00.000Z'
            },
            {
                id: 1,
                name: 'Sustainable Fashion',
                slug: 'sustainable-fashion',
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
                    'These are the best jeans I\'ve ever owned. The selvedge denim quality is exceptional and they fit perfectly. Worth every cent.',
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
                    'Great quality denim. The 34" length is perfect for me. I\'ll definitely be buying another pair in a different wash.',
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