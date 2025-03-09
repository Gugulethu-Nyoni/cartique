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
  theme: 'blue', // Set theme to blue
  sale: true, // Enable sale badges
  search: true, // Enable search
  sorting: true, // Enable sorting
  containerId: 'customId', // Use custom container ID
};

const shopUI = new Cartique(products, features);