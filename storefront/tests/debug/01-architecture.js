/**
 * CARTIQUE ARCHITECTURE TEST
 * 
 * Validates the object graph before testing behaviour.
 * This discovers what exists and what's missing.
 */

import StorefrontCore from '../../src/StorefrontCore.js';
import { products } from '../../demo/full-demo/products.js';

function inspect(label, value) {
    console.log('\n', label);

    if (!value) {
        console.log('❌ MISSING');
        return;
    }

    console.log('✅ EXISTS');
    console.log('Type:', typeof value);

    if (typeof value === 'object' && value !== null) {
        const keys = Object.keys(value);
        console.log('Keys:', keys.slice(0, 30));
        if (keys.length > 30) {
            console.log(`  ... and ${keys.length - 30} more`);
        }
    }
}

console.log('\n' + '='.repeat(60));
console.log(' CARTIQUE ARCHITECTURE SNAPSHOT ');
console.log('='.repeat(60));

// ==========================================================
// 1. Create Storefront
// ==========================================================

console.log('\n📦 Creating Storefront...');

const storefront = new StorefrontCore(products, {
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
    menu: { enabled: true },
    sidebarFeatures: { enabled: true }
});

console.log('✅ Storefront created');

// ==========================================================
// 2. Inspect Renderers
// ==========================================================

console.log('\n' + '-'.repeat(60));
console.log(' RENDERERS ');
console.log('-'.repeat(60));

inspect('StorefrontCore', storefront);
inspect('ProductRenderer', storefront.productRenderer);
inspect('CollectionRenderer', storefront.collectionRenderer);
inspect('CartRenderer', storefront.cartRenderer);

// ==========================================================
// 3. Inspect Services
// ==========================================================

console.log('\n' + '-'.repeat(60));
console.log(' SERVICES ');
console.log('-'.repeat(60));

inspect('Services', storefront.services);
inspect('CartService', storefront.services?.cart);
inspect('PricingService', storefront.services?.pricing);
inspect('LocaleService', storefront.services?.locale);

// ==========================================================
// 4. Inspect Callbacks
// ==========================================================

console.log('\n' + '-'.repeat(60));
console.log(' CALLBACKS ');
console.log('-'.repeat(60));

const callbacks = [
    { renderer: 'ProductRenderer', method: 'onSearch' },
    { renderer: 'ProductRenderer', method: 'onSort' },
    { renderer: 'ProductRenderer', method: 'onBackToList' },
    { renderer: 'ProductRenderer', method: 'onFilterChange' },
    { renderer: 'ProductRenderer', method: 'onClearFilters' },
    { renderer: 'CollectionRenderer', method: 'onFilterApplied' },
    { renderer: 'CollectionRenderer', method: 'onCategorySelect' },
    { renderer: 'CartService', method: 'onCartUpdated' }
];

for (const cb of callbacks) {
    const obj = cb.renderer === 'CartService' 
        ? storefront.services?.cart 
        : storefront[cb.renderer.toLowerCase()];
    
    const exists = obj && typeof obj[cb.method] === 'function';
    console.log(`${cb.renderer}.${cb.method}: ${exists ? '✅' : '❌'} ${exists ? 'function' : 'missing'}`);
}

// ==========================================================
// 5. Inspect State
// ==========================================================

console.log('\n' + '-'.repeat(60));
console.log(' STATE ');
console.log('-'.repeat(60));

const stateKeys = [
    'products',
    'filteredProducts',
    'currentLayout',
    'currentSearchQuery',
    'currentSortType',
    'singleProductViewActive',
    'activeCategoryId',
    'activeFilters'
];

console.log('\n┌─────────────────────┬─────────────┬─────────────┬─────────────┐');
console.log('│ Key                 │ Storefront  │ Product     │ Collection  │');
console.log('├─────────────────────┼─────────────┼─────────────┼─────────────┤');

for (const key of stateKeys) {
    const sf = storefront[key];
    const pr = storefront.productRenderer?.[key];
    const cr = storefront.collectionRenderer?.[key];
    
    const sfStr = sf !== undefined ? String(sf).padEnd(11) : 'undefined  ';
    const prStr = pr !== undefined ? String(pr).padEnd(11) : 'undefined  ';
    const crStr = cr !== undefined ? String(cr).padEnd(11) : 'undefined  ';
    
    console.log(`│ ${key.padEnd(19)} │ ${sfStr} │ ${prStr} │ ${crStr} │`);
}

console.log('└─────────────────────┴─────────────┴─────────────┴─────────────┘');

// ==========================================================
// 6. Inspect Methods
// ==========================================================

console.log('\n' + '-'.repeat(60));
console.log(' METHODS ');
console.log('-'.repeat(60));

const methodMap = {
    'ProductRenderer': [
        'setLayout',
        'renderProductDisplays',
        'renderSingleProduct',
        'returnToListView',
        'renderMainFrame',
        'renderControls',
        'renderFooter',
        'renderSidebar'
    ],
    'CollectionRenderer': [
        'handleSearch',
        'handleSort',
        'applyAllFilters',
        'handleBackToList',
        'renderCatalogueMenu',
        'renderSidebarFilters'
    ],
    'CartRenderer': [
        'showCart',
        'closeCart',
        'showCartPage',
        'closeCartPage',
        'renderCartSlider',
        'renderCartPage'
    ],
    'CartService': [
        'addToCart',
        'checkout'
    ]
};

for (const [name, methods] of Object.entries(methodMap)) {
    const obj = name === 'CartService' 
        ? storefront.services?.cart 
        : storefront[name.toLowerCase()];
    
    console.log(`\n📋 ${name}:`);
    if (!obj) {
        console.log('  ❌ MISSING');
        continue;
    }
    for (const method of methods) {
        const exists = typeof obj[method] === 'function';
        console.log(`  ${method}: ${exists ? '✅' : '❌'}`);
    }
}

// ==========================================================
// 7. Summary
// ==========================================================

console.log('\n' + '='.repeat(60));
console.log(' SUMMARY ');
console.log('='.repeat(60));

const renderers = [
    storefront.productRenderer,
    storefront.collectionRenderer,
    storefront.cartRenderer
];

const rendererCount = renderers.filter(r => r !== undefined).length;
console.log(`✅ ${rendererCount}/3 renderers exist`);

const services = [
    storefront.services?.pricing,
    storefront.services?.cart,
    storefront.services?.locale
];

const serviceCount = services.filter(s => s !== undefined).length;
console.log(`✅ ${serviceCount}/3 services exist`);

console.log(`\n📊 Status: ${rendererCount === 3 && serviceCount === 3 ? '✅ READY' : '⚠️ INCOMPLETE'}`);

console.log('\n🔍 Next: Run 02-interaction.js to test interactions');
