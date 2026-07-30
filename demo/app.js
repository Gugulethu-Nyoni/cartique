/**
 * Cartique Demo — Simple Storefront
 * 
 * Uses SimpleStorefront to render products with kernel decisions
 */

import { SimpleStorefront } from './simple-storefront.js';
import { products } from './products.js';

// Create storefront
const storefront = new SimpleStorefront(products, {
    currencySymbol: 'R',
    columns: 2
});

// Render
await storefront.render('#cartique');

// Expose for debugging
window.__storefront = storefront;

console.log('🛍️ Cartique Demo Started');
console.log(`📦 ${products.length} products loaded`);
console.log('🔧 Debug: window.__storefront');
console.log('🔧 Decisions: window.__storefront.decisions');
