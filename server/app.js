import Cartique from './cartique.js';

// Example Usage:
const products = [
  {
    title: 'Product 1',
    description: 'This is the first product.',
    price: 19.99,
    currency: '$',
    image: 'https://via.placeholder.com/150',
    normal_price: 29.99,
    sale_price: 19.99,
  },
  {
    title: 'Product 2',
    description: 'This is the second product.',
    price: 29.99,
    currency: '$',
    image: 'https://via.placeholder.com/150',
  },
  // Add more products
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


