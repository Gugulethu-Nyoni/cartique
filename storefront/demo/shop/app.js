/**
 * Full Cartique Demo
 * Complete storefront configuration with all features
 */

import Cartique from '../../../cartique.js';
import products from './products_clothing.js';

// ==========================================================
// 1. CURRENCY & HELPERS
// ==========================================================

const currencySymbol = 'R';

/**
 * Extract variant filters from products
 * Creates price range and attribute filters
 */
function extractVariantFilters(products, currencySymbol = 'R') {
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

// ==========================================================
// 2. COMPLETE FEATURES CONFIGURATION
// ==========================================================

const features = {
    // ----- Kernel & Debug -----
    kernelMode: true,
    debug: true,
    diagnostics: true,
    resolutionJournal: true,

    // ----- Behavior Tracking (Stage A) -----
    behavior: {
        enabled: true,
        transport: 'mock',
        batchSize: 10,
        batchInterval: 5000
    },
    
    // ----- Theme -----
    theme: 'light',
    themeColor: '#655793',
    catalogPath: '/storefront/src/theme/catalog/',
    
    // ----- Layout & Display -----
    grid: true,
    pagination: false,
    columns: 2,
    rows: 6,
    itemsPerPage: 4,
    containerId: 'cartique',
    currencySymbol: currencySymbol,
    
    // ----- Features -----
    sale: true,
    search: true,
    sorting: true,
    sidebar: true,
    footer: true,
    
    // ----- Checkout & Navigation -----
    checkoutUrl: '/auth/dashboard',
    checkoutUrlMode: '_blank',
    
    // ----- Catalog Menu -----
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
    
    // ----- Sidebar Filters -----
    sidebarFeatures: {
        enabled: true,
        priceRange: true,
        search: true,
        filters: productFilters
    },
    
    // ----- Reviews -----
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

// ==========================================================
// 3. INITIALIZE STOREFRONT
// ==========================================================


const storefrontData = {
    brand: { name: 'Botaniq', tagline: 'Natural wellness, thoughtfully sourced.' },
    announcement: { enabled: true, text: 'Free delivery on orders over R1,000', href: null },
    navigation: {
        menu: [
            { label: 'Shop', href: '#shop' },
            { label: 'Categories', href: '#categories' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' }
        ]
    },
    hero: {
        enabled: true,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1600&h=600&fit=crop',
        eyebrow: 'New Season',
        heading: 'Designed for everyday living.',
        description: 'Discover our latest collection.',
        ctaText: 'Shop Now',
        ctaLink: '#shop'
    },
    usps: [
        { icon: '🚚', title: 'Free Delivery', description: 'On orders over R1,000' },
        { icon: '🔒', title: 'Secure Payments', description: 'SSL encrypted' },
        { icon: '🔄', title: 'Easy Returns', description: '30-day policy' },
        { icon: '💬', title: 'Support', description: 'Mon-Fri 9am-5pm' }
    ],
    promotionalBlock: {
        enabled: true,
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
        eyebrow: 'Sustainable by design',
        heading: 'Discover the collection',
        description: 'Ethically sourced materials.',
        ctaLabel: 'Explore',
        ctaHref: '#shop'
    },
    testimonials: [
        { quote: 'Excellent quality and fast delivery.', customer: 'Jane D.' },
        { quote: 'My go-to store for wellness products.', customer: 'Mark S.' }
    ],
    newsletter: {
        enabled: true,
        heading: 'Stay in the loop',
        description: 'Get new products, offers and announcements.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe'
    },
    footer: {
        columns: [
            {
                heading: 'Shop',
                links: [
                    { label: 'All Products', href: '#shop' },
                    { label: 'Categories', href: '#categories' },
                    { label: 'New Arrivals', href: '#new' }
                ]
            },
            {
                heading: 'Customer Care',
                links: [
                    { label: 'Contact', href: '#contact' },
                    { label: 'Shipping', href: '#shipping' },
                    { label: 'Returns', href: '#returns' },
                    { label: 'FAQs', href: '#faqs' }
                ]
            }
        ]
    },
    customContent: {
        enabled: true,
        html: ''
    }
};


const storefront = new Cartique(products, features, storefrontData);

// Initialize
await storefront.init();

// ==========================================================
// 4. EXPOSE TO GLOBAL
// ==========================================================

window.__storefront = storefront;
window.__behavior = storefront.services.behavior;
window.__cartique = window.__cartique || {};
window.__cartique.storefront = storefront;

// ==========================================================
// 5. THEME DEMO — Visual Testing
// ==========================================================

// Theme indicator — log when theme changes
storefront.themeManager.on('theme:switched', ({ from, to }) => {
    console.log(
        `%c🔄 Theme changed: ${from} → ${to}`,
        'background:#222;color:#fff;padding:5px 10px;font-weight:bold;border-radius:4px;'
    );
    document.body.dataset.theme = to;
});

// Set initial theme
document.body.dataset.theme = 'light';

// Theme information
console.log('📦 Available themes:', storefront.listThemes());
console.log('🎨 Current theme:', storefront.getTheme());
console.log('ℹ️ Theme info (fashion):', storefront.getThemeInfo('fashion'));

// ==========================================================
// 6. DEMO API — Console Testing
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
    },
    
    // Feature info
    getFeatures: () => {
        console.log('⚙️ Features:', storefront.features);
        return storefront.features;
    },
    getCheckoutUrl: () => {
        console.log('🔗 Checkout URL:', storefront.features?.checkoutUrl);
        return storefront.features?.checkoutUrl;
    }
};

// ==========================================================
// 7. STARTUP LOG
// ==========================================================

console.log('🛍️ Full Cartique Demo Started');
console.log(`📦 ${products.length} products loaded`);
console.log(`💰 Currency: ${currencySymbol}`);
console.log(`🔗 Checkout URL: ${features.checkoutUrl}`);
console.log(`📐 Layout: ${features.columns} columns, ${features.itemsPerPage} items per page`);
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
console.log('  __demo.getFeatures()       - View all features');
console.log('  __demo.getCheckoutUrl()    - Get checkout URL');