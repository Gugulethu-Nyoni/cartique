export const products = [
  {
    id: 1,
    title: '2026 Audi RS6 Avant GT',
    description: 'A carbon-clad, limited-edition tribute to the IMSA GTO legend with a 4.0L biturbo V8.',
    price: 198000,
    currency: '$',
    image: 'https://s1.cdn.autoevolution.com/images/news/2026-audi-rs6-is-en-route-to-become-a-plug-in-hybrid-last-rs6-with-an-ice-195471-7.jpg',
    sale_price: 195000,
    slug: 'audi-rs6-avant-gt-2026',
    hasVariants: true,
    product_images: [
      'https://media.audiusa.com/content/dam/audiusa/my26/rs6-avant-gt/interior.jpg',
      'https://media.audiusa.com/content/dam/audiusa/my26/rs6-avant-gt/rear.jpg'
    ],
    categories: [
      { id: 1, name: 'Wagons' },
      { id: 2, name: 'Performance' },
      { id: 3, name: 'Limited Edition' }
    ],
    variants: [
      {
        id: 101,
        productId: 1,
        sku: 'AUDI-RS6-GT-WHT',
        price: 198000,
        costPrice: 160000,
        inventory: 1,
        weight: 2075,
        attributes: [
          { key: 'color', value: 'Arkona White', dataType: 'color' },
          { key: 'engine', value: '4.0L Twin-Turbo V8', dataType: 'string' },
          { key: 'power', value: '621 hp', dataType: 'string' },
          { key: 'year', value: '2026', dataType: 'number' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '2026 Porsche 911 Turbo S (992.2)',
    description: 'The definitive everyday supercar, now featuring a 3.6L T-Hybrid flat-six with instant response.',
    price: 270300,
    currency: '$',
    image: 'https://files.porsche.com/filestore/image/multimedia/none/992-2-turbo-s-modelimage/normal/porsche-normal.jpg',
    slug: 'porsche-911-turbo-s-2026',
    hasVariants: true,
    product_images: [
      'https://files.porsche.com/filestore/image/multimedia/none/992-2-turbo-s-interior/normal/porsche-normal.jpg'
    ],
    categories: [
      { id: 4, name: 'Supercar' },
      { id: 5, name: 'Hybrid' }
    ],
    variants: [
      {
        id: 201,
        productId: 2,
        sku: 'PORSCHE-911-T-S-2026',
        price: 270300,
        costPrice: 210000,
        inventory: 2,
        attributes: [
          { key: 'color', value: 'Gentian Blue Metallic', dataType: 'color' },
          { key: 'power', value: '701 hp', dataType: 'string' },
          { key: '0-100', value: '2.5s', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: '2026 Ferrari Purosangue',
    description: 'Ferrari’s first four-door, four-seater. A high-riding thoroughbred with a screaming V12.',
    price: 398000,
    currency: '$',
    image: 'https://cdn.ferrari.com/cms/network/media/img/ferrari-purosangue-ext.jpg',
    slug: 'ferrari-purosangue-2026',
    hasVariants: false,
    categories: [
      { id: 6, name: 'Exotic' },
      { id: 7, name: 'SUV' }
    ],
    variants: [
      {
        id: 301,
        productId: 3,
        sku: 'FERRARI-PURO-V12',
        price: 398000,
        attributes: [
          { key: 'engine', value: '6.5L Naturally Aspirated V12', dataType: 'string' },
          { key: 'top_speed', value: '310 km/h', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: '2026 BMW M5 Touring (G99)',
    description: 'The return of the long-roof M5. 727hp V8 hybrid power meets extreme utility.',
    price: 121500,
    currency: '$',
    image: 'https://www.bmw.co.za/content/dam/bmw/common/all-models/m-series/m5-touring/2024/navigation/bmw-m5-touring-modelfinder.png',
    slug: 'bmw-m5-touring-2026',
    hasVariants: true,
    categories: [
      { id: 1, name: 'Wagons' },
      { id: 5, name: 'Hybrid' }
    ],
    variants: [
      {
        id: 401,
        productId: 4,
        sku: 'BMW-M5-G99-TOUR',
        price: 121500,
        attributes: [
          { key: 'color', value: 'Marina Bay Blue', dataType: 'color' },
          { key: 'cargo', value: '500L', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 5,
    title: '2026 Land Rover Defender 130 V8',
    description: 'Luxury for eight. The ultimate expedition vehicle with a supercharged 5.0L V8 heartbeat.',
    price: 118000,
    currency: '$',
    image: 'https://www.landrover.com/content/dam/landrover/common/vehicles/defender/130-v8-ext.jpg',
    slug: 'defender-130-v8-2026',
    hasVariants: true,
    categories: [
      { id: 7, name: 'SUV' },
      { id: 8, name: '4x4' }
    ],
    variants: [
      {
        id: 501,
        productId: 5,
        sku: 'LR-DEF-130-V8',
        price: 118000,
        attributes: [
          { key: 'seats', value: '8', dataType: 'number' },
          { key: 'suspension', value: 'Electronic Air', dataType: 'string' }
        ]
      }
    ]
  },
  {
    id: 6,
    title: '2026 Lamborghini Revuelto',
    description: 'The flagship High Performance Electrified Vehicle (HPEV) with a hybrid V12.',
    price: 608000,
    currency: '$',
    image: 'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_gw/revuelto/revuelto_og.jpg',
    slug: 'lamborghini-revuelto-2026',
    hasVariants: false,
    categories: [{ id: 4, name: 'Supercar' }, { id: 5, name: 'Hybrid' }],
    variants: [{ id: 601, productId: 6, sku: 'LAMBO-REV-V12H', price: 608000, attributes: [{ key: 'power', value: '1015 CV', dataType: 'string' }] }]
  },
  {
    id: 7,
    title: '2026 Rolls-Royce Spectre',
    description: 'The ultra-luxury electric coupe. Silent, effortless, and impossibly smooth.',
    price: 422000,
    currency: '$',
    image: 'https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketSpecific/global/spectre/spectre-exterior.jpg',
    slug: 'rolls-royce-spectre-2026',
    hasVariants: false,
    categories: [{ id: 2, name: 'Luxury' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 701, productId: 7, sku: 'RR-SPECTRE-EV', price: 422000, attributes: [{ key: 'range', value: '530 km', dataType: 'string' }] }]
  },
  {
    id: 8,
    title: '2026 Tesla Model 3 Performance',
    description: 'The refreshed Highland flagship with 0-100 in under 3 seconds.',
    price: 54990,
    currency: '$',
    image: 'https://www.tesla.com/sites/default/files/model3-performance-main.jpg',
    slug: 'tesla-model-3-performance-2026',
    hasVariants: true,
    categories: [{ id: 10, name: 'Sedan' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 801, productId: 8, sku: 'TESLA-M3P-2026', price: 54990, attributes: [{ key: 'drive', value: 'Dual Motor AWD', dataType: 'string' }] }]
  },
  {
    id: 9,
    title: '2026 Hyundai Ioniq 5 N',
    description: 'The electric car for people who love driving. Includes virtual gear shifts.',
    price: 66000,
    currency: '$',
    image: 'https://www.hyundai.com/content/dam/hyundai/ww/en/images/find-a-car/ioniq-5-n/ioniq-5-n-visualizer.jpg',
    slug: 'hyundai-ioniq-5-n-2026',
    hasVariants: false,
    categories: [{ id: 2, name: 'Performance' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 901, productId: 9, sku: 'HYUNDAI-I5N', price: 66000, attributes: [{ key: 'mode', value: 'N Drift Optimizer', dataType: 'string' }] }]
  },
  {
    id: 10,
    title: '2026 Toyota Land Cruiser 300 GR-S',
    description: 'The king of Africa. Rugged reliability meets modern luxury and E-KDSS suspension.',
    price: 112000,
    currency: '$',
    image: 'https://www.toyota.co.za/content/dam/toyota/south-africa/models/land-cruiser-300/land-cruiser-300-gr-s.png',
    slug: 'toyota-land-cruiser-300-grs',
    hasVariants: true,
    categories: [{ id: 7, name: 'SUV' }, { id: 8, name: '4x4' }],
    variants: [{ id: 1001, productId: 10, sku: 'TOY-LC300-GRS', price: 112000, attributes: [{ key: 'engine', value: '3.3L V6 Diesel', dataType: 'string' }] }]
  },
  {
    id: 11,
    title: '2026 Aston Martin Vantage',
    description: 'Re-engineered for 656hp. A visceral sports car with a Mercedes-AMG heart.',
    price: 191000,
    currency: '$',
    image: 'https://www.astonmartin.com/content/dam/vantage-ext-hero.jpg',
    slug: 'aston-martin-vantage-2026',
    hasVariants: false,
    categories: [{ id: 2, name: 'Performance' }, { id: 4, name: 'Supercar' }],
    variants: [{ id: 1101, productId: 11, sku: 'AM-VANTAGE-V8', price: 191000, attributes: [{ key: 'torque', value: '800 Nm', dataType: 'string' }] }]
  },
  {
    id: 12,
    title: '2026 Mercedes-Maybach S680',
    description: 'The pinnacle of the S-Class. V12 power and more legroom than a private jet.',
    price: 234000,
    currency: '$',
    image: 'https://www.mercedes-benz.com/content/dam/maybach-s680-ext.jpg',
    slug: 'mercedes-maybach-s680-2026',
    hasVariants: false,
    categories: [{ id: 2, name: 'Luxury' }, { id: 10, name: 'Sedan' }],
    variants: [{ id: 1201, productId: 12, sku: 'MB-MAYBACH-V12', price: 234000, attributes: [{ key: 'engine', value: '6.0L V12', dataType: 'string' }] }]
  },
  {
    id: 13,
    title: '2026 Volvo EX90 Ultra',
    description: 'The safest Volvo ever made. Fully electric with built-in LiDAR technology.',
    price: 89000,
    currency: '$',
    image: 'https://www.volvocars.com/images/ex90-exterior.jpg',
    slug: 'volvo-ex90-ultra-2026',
    hasVariants: true,
    categories: [{ id: 7, name: 'SUV' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 1301, productId: 13, sku: 'VOLVO-EX90-UL', price: 89000, attributes: [{ key: 'safety', value: 'LiDAR System', dataType: 'string' }] }]
  },
  {
    id: 14,
    title: '2026 Ford Ranger Raptor 3.0 V6',
    description: 'The ultimate performance bakkie. Jump-ready suspension and V6 growl.',
    price: 82000,
    currency: '$',
    image: 'https://www.ford.co.za/content/dam/ranger-raptor-v6.jpg',
    slug: 'ford-ranger-raptor-2026',
    hasVariants: false,
    categories: [{ id: 11, name: 'Bakkie' }, { id: 8, name: '4x4' }],
    variants: [{ id: 1401, productId: 14, sku: 'FORD-RAPTOR-V6', price: 82000, attributes: [{ key: 'shocks', value: 'FOX Live Valve', dataType: 'string' }] }]
  },
  {
    id: 15,
    title: '2026 Kia EV9 GT-Line',
    description: 'A bold, futuristic 7-seater EV that redefines the family SUV.',
    price: 75000,
    currency: '$',
    image: 'https://www.kia.com/content/dam/kia/ev9-ext.jpg',
    slug: 'kia-ev9-gt-line-2026',
    hasVariants: true,
    categories: [{ id: 7, name: 'SUV' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 1501, productId: 15, sku: 'KIA-EV9-GT', price: 75000, attributes: [{ key: 'seats', value: '7', dataType: 'number' }] }]
  },
  {
    id: 16,
    title: '2026 BMW M4 CS',
    description: 'Lighter, faster, and more aggressive. The ultimate track-focused M4.',
    price: 124000,
    currency: '$',
    image: 'https://www.bmw.com/content/dam/m4-cs-ext.jpg',
    slug: 'bmw-m4-cs-2026',
    hasVariants: false,
    categories: [{ id: 2, name: 'Performance' }, { id: 12, name: 'Coupe' }],
    variants: [{ id: 1601, productId: 16, sku: 'BMW-M4-CS-2026', price: 124000, attributes: [{ key: 'weight_reduction', value: 'Carbon Hood', dataType: 'string' }] }]
  },
  {
    id: 17,
    title: '2026 Lucid Gravity',
    description: 'The luxury EV SUV that promises over 700km of range.',
    price: 95000,
    currency: '$',
    image: 'https://www.lucidmotors.com/gravity-exterior.jpg',
    slug: 'lucid-gravity-2026',
    hasVariants: false,
    categories: [{ id: 7, name: 'SUV' }, { id: 9, name: 'Electric' }],
    variants: [{ id: 1701, productId: 17, sku: 'LUCID-GRAV-2026', price: 95000, attributes: [{ key: 'range', value: '440 miles', dataType: 'string' }] }]
  },
  {
    id: 18,
    title: '2026 Ineos Grenadier Trailmaster',
    description: 'No-nonsense off-roading. Built for the world’s toughest terrains.',
    price: 79000,
    currency: '$',
    image: 'https://ineosgrenadier.com/grenadier-trailmaster.jpg',
    slug: 'ineos-grenadier-2026',
    hasVariants: true,
    categories: [{ id: 8, name: '4x4' }, { id: 7, name: 'SUV' }],
    variants: [{ id: 1801, productId: 18, sku: 'INEOS-GREN-TRAIL', price: 79000, attributes: [{ key: 'locking_diffs', value: 'Front, Center, Rear', dataType: 'string' }] }]
  },
  {
    id: 19,
    title: '2026 Audi RS Q8 Performance',
    description: 'The fastest SUV around the Nürburgring. 631hp of brute force.',
    price: 145000,
    currency: '$',
    image: 'https://www.audi.com/rs-q8-perf.jpg',
    slug: 'audi-rs-q8-perf-2026',
    hasVariants: false,
    categories: [{ id: 7, name: 'SUV' }, { id: 2, name: 'Performance' }],
    variants: [{ id: 1901, productId: 19, sku: 'AUDI-RSQ8-P', price: 145000, attributes: [{ key: 'engine', value: '4.0L V8', dataType: 'string' }] }]
  },
  {
    id: 20,
    title: '2026 Volkswagen Golf 8.5 GTI',
    description: 'The definitive hot hatch, refined with more power and physical buttons.',
    price: 48000,
    currency: '$',
    image: 'https://www.vw.co.za/golf-8-5-gti.jpg',
    slug: 'vw-golf-8-5-gti-2026',
    hasVariants: true,
    categories: [{ id: 13, name: 'Hatchback' }, { id: 2, name: 'Performance' }],
    variants: [{ id: 2001, productId: 20, sku: 'VW-GOLF-GTI-85', price: 48000, attributes: [{ key: 'power', value: '261 hp', dataType: 'string' }] }]
  }
];