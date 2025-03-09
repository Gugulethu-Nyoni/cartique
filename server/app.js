import Cartique from './cartique.js';

// Example Usage:
const products = [
  {
    title: 'Product 1',
    description: 'This is the first product.',
    price: 19.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
    normal_price: 29.99,
    sale_price: 19.99,
  },
  {
    title: 'Product 2',
    description: 'This is the second product.',
    price: 29.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 3',
    description: 'This is the third product.',
    price: 49.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 4',
    description: 'This is the fourth product.',
    price: 39.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 5',
    description: 'This is the fifth product.',
    price: 59.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
    normal_price: 69.99,
    sale_price: 59.99,
  },
  {
    title: 'Product 6',
    description: 'This is the sixth product.',
    price: 24.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 7',
    description: 'This is the seventh product.',
    price: 39.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
    normal_price: 49.99,
    sale_price: 39.99,
  },
  {
    title: 'Product 8',
    description: 'This is the eighth product.',
    price: 79.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 9',
    description: 'This is the ninth product.',
    price: 89.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
    normal_price: 99.99,
    sale_price: 89.99,
  },
  {
    title: 'Product 10',
    description: 'This is the tenth product.',
    price: 19.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 11',
    description: 'This is the eleventh product.',
    price: 69.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
    normal_price: 79.99,
    sale_price: 69.99,
  },
  {
    title: 'Product 12',
    description: 'This is the twelfth product.',
    price: 34.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 13',
    description: 'This is the thirteenth product.',
    price: 44.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
  },
  {
    title: 'Product 14',
    description: 'This is the fourteenth product.',
    price: 14.99,
    currency: '$',
    image: 'https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Glossary.svg',
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


