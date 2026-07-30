/**
 * Full Cartique Demo
 */

import Cartique from '../../../cartique.js';
import products from './products.js';

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
    sidebar: true,
    footer: true,
    search: true,
    sorting: true,
    sale: true,
    catalogPath: '/storefront/src/theme/catalog/',
    menu: {
        enabled: true,
        type: 'inline',
        position: 'top',
        label: 'Shop Categories',
        showCounts: true
    },
    sidebarFeatures: {
        enabled: true,
        priceRange: true,
        search: true
    }
});

// Initialize the storefront
await storefront.init();

window.__storefront = storefront;
window.__cartique = window.__cartique || {};
window.__cartique.storefront = storefront;

// Theme information
console.log('Available themes:', storefront.listThemes());
console.log('Current theme:', storefront.getTheme());
console.log('Theme info:', storefront.getThemeInfo('fashion'));

// Expose theme API for console testing
window.__demo = {
    switchTheme: (name) => storefront.setTheme(name),
    previewTheme: (name) => storefront.previewTheme(name),
    listThemes: () => storefront.listThemes(),
    currentTheme: () => storefront.getTheme(),
    getThemeInfo: (name) => storefront.getThemeInfo(name)
};

console.log('Full Cartique Demo Started');
console.log('Products loaded:', products.length);
console.log('Debug: window.__storefront, window.__cartique, window.__demo');
console.log('Theme commands: __demo.switchTheme("fashion"), __demo.previewTheme("fashion")');
