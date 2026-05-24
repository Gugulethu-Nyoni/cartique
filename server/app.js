import Cartique from './cartique.js';
import { products } from './clothes.js';

const currencySymbol = 'R';

function extractVariantFilters(products, currencySymbol = '$') {
  const filters = {};
  const prices = [];
  
  products.forEach(p => p.variants?.forEach(v => {
    const priceNum = parseFloat(v.price);
    if (!isNaN(priceNum)) prices.push(priceNum);
    v.attributes?.forEach(a => {
      (filters[a.key] = filters[a.key] || new Set()).add(a.value);
    });
  }));
  
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
  
  return Object.fromEntries(
    Object.entries(filters).map(([k, v]) => [k, Array.from(v).sort()])
  );
}

const productFilters = extractVariantFilters(products, currencySymbol);

const features = {
  // Layout & Display
  grid: true,
  pagination: false,
  columns: 2,
  rows: 6,
  theme: 'light',              // 'light' | 'dark'
  themeColor: '#655793',       // Accent color
  sale: true,
  search: true,
  sorting: true,
  currencySymbol: currencySymbol,
  itemsPerPage: 4,
  
  // Checkout & Navigation
  checkoutUrl: '/auth/dashboard',
  checkoutUrlMode: '_blank',
  
  // UI Components
  sidebar: true,
  footer: true,
  
  // Catalog Menu
  menu: {
    enabled: true,
    type: 'mega',
    position: 'top',
    containerId: 'cartique-catalogue-menu',
    label: 'Shop Categories',
    maxVisibleItems: 5,
    showCounts: true,
    collapseOnMobile: true,
    megaMenuColumns: 3
  },
  
  // Sidebar Filters
  sidebarFeatures: {
    enabled: true,
    priceRange: true,
    search: true,
    filters: productFilters
  },

  // Reviews
  reviews: {
    enabled: true,
    allowGuestReviews: false,
    requireApproval: false,
    apiEndpoint: 'productreview/productReviews',
    ratingsScale: 5,
    showRatingDistribution: true,
    sortOrder: 'newest'
  }
};

const shopUI = new Cartique(products, features);