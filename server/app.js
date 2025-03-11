import Cartique from './cartique.js';

// Example Usage:
const products = [
  {
    id: 1,
    title: 'Nike Air Max 270',
    description: "Men's running shoes with a full-length air unit.",
    price: 299.99,
    currency: '$',
    image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/ab2d4e7f-2f9d-49c9-8e4e-7a3d8c32e0d/air-max-270-running-shoe-BQ1028-002.jpg',
    sale_price: 129.99,
  },
  {
    id: 2,
    title: 'Adidas Superstar',
    description: 'Classic shell-toed sneakers for men and women.',
    price: 79.99,
    currency: '$',
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto:sensitive,fl_lossy/0d6e0f2a9b34a23a3b4ab30006d9d3_9366/Superstar_Shoes_White_GZ1182_01_standard.jpg',
  },
  {
    id: 3,
    title: 'The North Face Thermoball Jacket',
    description: 'Water-resistant and breathable insulated jacket for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://images.thenorthface.com/is/image/TheNorthFace/tnf-thermoball-jacket-ayf4-her.jpg',
    sale_price: 80.99,
  },
  {
    id: 4,
    title: "Levi's 501 Original Fit Jeans",
    description: 'Classic straight-fit jeans for men.',
    price: 69.99,
    currency: '$',
    image: 'https://www.levi.com/dw/image/v2/BCZS_PRD/on/demandware.static/-/Sites-levi-master-catalog/default/dw9d7e9f2a/501-Original-Fit-Jeans_2301_001_b01.jpg',
  },
  {
    id: 5,
    title: 'Vans Old Skool',
    description: 'Classic skateboarding shoes for men and women.',
    price: 59.99,
    currency: '$',
    image: 'https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$VF_PDP_MAIN$',
  },
  {
    id: 6,
    title: 'Champion Life Hoodie',
    description: 'Soft and comfortable hoodie for men and women.',
    price: 29.99,
    currency: '$',
    image: 'https://championproducts.wdsglobal.com/images/products/medium/CHM2180.jpg',
  },
  {
    id: 7,
    title: 'Reebok Classic Leather',
    description: 'Iconic and versatile sneakers for men and women.',
    price: 69.99,
    currency: '$',
    image: 'https://www.reebok.com/us/en/images/products/medium/BS7661.jpg',
  },
  {
    id: 8,
    title: 'Patagonia Tres 3-in-1 Parka',
    description: 'Versatile and sustainable parka for men and women.',
    price: 229.99,
    currency: '$',
    image: 'https://www.patagonia.com/dw/image/v2/ABBM_PRD/on/demandware.static/-/Sites-patagonia-master/default/dw0f9d7f2a/images/hi-res/23410ALT.jpg',
  },
  {
    id: 9,
    title: 'Converse Chuck Taylor All Star',
    description: 'Classic and iconic sneakers for men and women.',
    price: 49.99,
    currency: '$',
    image: 'https://www.converse.com/dw/image/v2/ABBM_PRD/on/demandware.static/-/Sites-converse-master-catalog/default/dwae2b5e77/Chuck-Taylor-All-Star-Classic-Design-Black-162053C_01.jpg',
  },
  {
    id: 10,
    title: 'The North Face Venture 2 Jacket',
    description: 'Water-resistant and breathable jacket for men and women.',
    price: 99.99,
    currency: '$',
    image: 'https://images.thenorthface.com/is/image/TheNorthFace/tnf-venture-2-jacket-ayf4-her.jpg',
  },
  {
    id: 11,
    title: 'Adidas Ultraboost',
    description: 'High-performance running shoes for men and women.',
    price: 179.99,
    currency: '$',
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto:sensitive,fl_lossy/5d0c0f',
  }
];



const features = {
  grid: true, // Use grid layout
  pagination: false, // Disable pagination
  columns: 3, // 3 columns in grid layout
  rows: 6, // Show 6 products per page
  theme: '#fff', // Set theme to blue
  sale: true, // Enable sale badges
  search: true, // Enable search
  sorting: true, // Enable sorting
  checkoutUrl: 'https://developer.yoco.com/online/api-reference/checkout/payments/accept-payments/',
  checkoutUrlMode: '_blank', // options are self or blank
  //containerId: 'customId', // Use custom container ID
};

const productFilters = {
  color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Black', 'White'],
  size: ['S', 'M', 'L', 'XL', 'XXL', 'XS'],
  brand: ['Adidas', 'Nike', 'Puma', 'Reebok', 'Converse', 'Vans', 'New Balance'],
  category: ['Shoes', 'T-Shirts', 'Hoodies', 'Pants', 'Shorts', 'Dresses', 'Jackets'],
  priceRange: ['Under $20', '$20-$50', '$50-$100', '$100-$200', 'Over $200'],
  rating: ['1-2 stars', '2-3 stars', '3-4 stars', '4-5 stars'],
  material: ['Cotton', 'Polyester', 'Leather', 'Synthetic', 'Wool'],
  style: ['Casual', 'Formal', 'Sporty', 'Vintage', 'Streetwear']
};



const shopUI = new Cartique(products, {
  ...features,
  sidebarFeatures: {
    priceFilter: true,
    colorFilter: true,
    sizeFilter: true,
    brandFilter: true,
    filters: productFilters
  }
});


