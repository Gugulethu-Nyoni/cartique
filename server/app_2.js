import Cartique from './cartique_3.js';
import { products } from './cars.js';

const currencySymbol = 'R';

function extractVariantFilters(products, currencySymbol = '$') {
  const filters = {};
  const prices = [];
  
  // Single pass to collect everything
  products.forEach(p => p.variants?.forEach(v => {
    const priceNum = parseFloat(v.price);
    if (!isNaN(priceNum)) prices.push(priceNum);
    
    v.attributes?.forEach(a => {
      (filters[a.key] = filters[a.key] || new Set()).add(a.value);
    });
  }));
  
  // Add price ranges
  if (prices.length) {
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const step = (max - min) / 6;
    
    filters.priceRange = new Set([
      `Under ${currencySymbol}${Math.floor(min + step)}`,
      `${currencySymbol}${Math.floor(min + step) + 1}-${currencySymbol}${Math.floor(min + step * 2)}`,
      `${currencySymbol}${Math.floor(min + step * 2) + 1}-${currencySymbol}${Math.floor(min + step * 3)}`,
      `${currencySymbol}${Math.floor(min + step * 3) + 1}-${currencySymbol}${Math.floor(min + step * 4)}`,
      `${currencySymbol}${Math.floor(min + step * 4) + 1}-${currencySymbol}${Math.floor(min + step * 5)}`,
      `Over ${currencySymbol}${Math.floor(min + step * 5)}`
    ]);
  }
  
  // Convert to arrays
  return Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, Array.from(v).sort()])
  );
}


const productFilters = extractVariantFilters(products, currencySymbol); 
console.log(productFilters);

const features = {
  // Layout & Display
  grid: true,                // Use grid layout
  pagination: false,         // Disable pagination
  columns: 2,                // 3 columns in grid layout
  rows: 6,                   // Show 6 products per page
  theme: '#fff',             // Theme color
  sale: true,                // Enable sale badges
  search: true,              // Enable search
  sorting: true,             // Enable sorting
  currencySymbol: currencySymbol,
  itemsPerPage: 4,
  
  // Checkout & Navigation
  checkoutUrl: 'https://www.google.com/',
  checkoutUrlMode: '_blank', // options: 'self' or '_blank'
  
  // UI Components
  sidebar: true,
  footer: true,
  // containerId: 'customId', // Optional: Use custom container ID
  
  // NEW: Dynamic Catalog Menu Configuration
  menu: {
    enabled: true,                // Enable/disable catalog menu
    type: 'mega',                 // 'mega', 'inline', or 'stacked'
    position: 'top',              // 'top', 'sidebar', or 'custom'
    containerId: 'cartique-catalogue-menu', // For custom position
    label: 'Shop Categories',     // Label for stacked menu
    maxVisibleItems: 5,           // For inline menu
    showCounts: true,             // Show product counts
    collapseOnMobile: true,       // Adapt to mobile screens
    megaMenuColumns: 3            // Number of columns for mega menu
  },
  
  // Product Filters Configuration
  
  sidebarFeatures: {
    enabled: true,
    priceRange: true,
    search: true,
    filters: productFilters
  }
  
};

// Single consolidated instance with ALL features
const shopUI = new Cartique(products, features);
