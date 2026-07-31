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
    sidebar: false,
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
        enabled: false,
        priceRange: true,
        search: true
    }
});

// Initialize the storefront
await storefront.init();

window.__storefront = storefront;
window.__cartique = window.__cartique || {};
window.__cartique.storefront = storefront;

// ==========================================================
// THEME DEMO — Visual Testing
// ==========================================================

// ✅ Theme indicator — log when theme changes
storefront.themeManager.on('theme:switched', ({ from, to }) => {
    console.log(
        `%c🔄 Theme changed: ${from} → ${to}`,
        'background:#222;color:#fff;padding:5px 10px;font-weight:bold;border-radius:4px;'
    );
    document.body.dataset.theme = to;
});

// ✅ Set initial theme
document.body.dataset.theme = 'default';

// ✅ Theme information
console.log('📦 Available themes:', storefront.listThemes());
console.log('🎨 Current theme:', storefront.getTheme());
console.log('ℹ️ Theme info (fashion):', storefront.getThemeInfo('fashion'));

// ==========================================================
// DEMO API — Console Testing
// ==========================================================

window.__demo = {
    // Theme controls
    switchTheme: (name) => {
        console.log(`🔄 Switching to theme: ${name}`);
        return storefront.setTheme(name);
    },
    previewTheme: (name) => {
        console.log(`👀 Previewing theme: ${name}`);
        return storefront.previewTheme(name);
    },
    listThemes: () => {
        const themes = storefront.listThemes();
        console.log('📦 Available themes:', themes);
        return themes;
    },
    currentTheme: () => {
        const theme = storefront.getTheme();
        console.log('🎨 Current theme:', theme);
        return theme;
    },
    getThemeInfo: (name) => {
        const info = storefront.getThemeInfo(name);
        console.log(`ℹ️ Theme info for "${name}":`, info);
        return info;
    },
    restoreTheme: () => {
        console.log('↩️ Restoring default theme');
        return storefront.setTheme('default');
    },
    
    // Storefront info
    getStorefront: () => {
        console.log('🏪 Storefront:', storefront);
        return storefront;
    },
    getCart: () => {
        const cart = JSON.parse(localStorage.getItem('cartiqueCart') || '[]');
        console.log('🛒 Cart:', cart);
        return cart;
    },
    clearCart: () => {
        localStorage.removeItem('cartiqueCart');
        console.log('🗑️ Cart cleared');
        storefront.cartRenderer.showCart();
    }
};

console.log('🛍️ Full Cartique Demo Started');
console.log(`📦 ${products.length} products loaded`);
console.log('🔧 Debug: window.__storefront, window.__cartique, window.__demo');
console.log('🎨 Theme commands:');
console.log('  __demo.listThemes()        - List all themes');
console.log('  __demo.currentTheme()      - Get current theme');
console.log('  __demo.switchTheme("fashion") - Switch theme');
console.log('  __demo.previewTheme("fashion") - Preview theme');
console.log('  __demo.restoreTheme()      - Restore default theme');
console.log('  __demo.getThemeInfo("fashion") - Get theme info');
console.log('  __demo.getCart()           - View cart');
console.log('  __demo.clearCart()         - Clear cart');