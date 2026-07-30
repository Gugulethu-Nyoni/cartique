/**
 * Full Cartique Demo
 * 
 * Uses the unified Cartique entry point with the original storefront UI
 */

import Cartique from '../../../cartique.js';
import products from './products.js';

// Create storefront with full UI
const storefront = new Cartique(products, {
    kernelMode: true,
    debug: true,
    diagnostics: true,
    resolutionJournal: true,
    theme: 'default',
    currencySymbol: 'R',
    grid: true,
    columns: 2,
    itemsPerPage: 4,
    containerId: 'cartique',
    sidebar: false,
    footer: true,
    search: true,
    sorting: true,
    sale: true,
    
    // ✅ Tell the loader where the CSS actually lives
    // Relative to the HTML page: /storefront/demo/full-demo/
    // CSS is at: /storefront/src/themes/default/theme.css
    themeCSS: '../../src/themes/default/theme.css',
    
    menu: {
        enabled: true,
        type: 'inline',
        position: 'top',
        label: 'Shop Categories',
        showCounts: true
    },
    sidebarFeatures: {
        enabled: false,
        priceRange: true,
        search: true
    }
});

// Initialize the storefront
await storefront.init();

// Expose for debugging
window.__storefront = storefront;
window.__cartique = window.__cartique || {};
window.__cartique.storefront = storefront;

console.log('🛍️ Full Cartique Demo Started');
console.log(`📦 ${products.length} products loaded`);
console.log('🔧 Debug: window.__storefront, window.__cartique');
