/**
 * Phase 1.5: Import Test
 * 
 * Verifies that all modules can be imported correctly.
 * This does NOT test functionality — only module resolution.
 */

import * as Storefront from '../src/index.js';

console.log('✅ All modules imported successfully');
console.log('📦 Exports:', Object.keys(Storefront));

// Verify key exports exist
const requiredExports = [
    'StorefrontCore',
    'ProductRenderer',
    'CollectionRenderer',
    'CartRenderer',
    'LocaleService',
    'NotificationService',
    'PricingService',
    'CartService',
    'Reviews',
    'DefaultTheme',
    'CartiqueAdapter',
    'deepMerge',
    'isObject',
    'debounce',
    'addEventListener',
    'cleanupEventListeners'
];

const missing = requiredExports.filter(name => !Storefront[name]);

if (missing.length === 0) {
    console.log('✅ All required exports found');
    process.exit(0);
} else {
    console.error('❌ Missing exports:', missing);
    process.exit(1);
}
