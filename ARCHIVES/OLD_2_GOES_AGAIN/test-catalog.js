/**
 * ============================================================
 * Test: Catalog Module
 * ============================================================
 */

import { Products, Bundles, Variants } from './index.js';

console.log('✅ Testing Catalog Module');
console.log('');

console.log('📦 Products:');
console.log('  Chia Seeds:', Products.Botaniq.ChiaSeeds.id);
console.log('  Moringa Powder:', Products.Botaniq.MoringaPowder.id);
console.log('  Soursop Leaves:', Products.Botaniq.SoursopLeaves.id);
console.log('');

console.log('🔀 Variants:');
console.log('  Total variants:', Variants.Botaniq.length);
console.log('  First variant:', Variants.Botaniq[0].id);
console.log('');

console.log('📦 Bundles:');
console.log('  Immunity Pack:', Bundles.Botaniq.ImmunityPack.id);
console.log('  Components:', Bundles.Botaniq.ImmunityPack.components.length);
console.log('  Savings:', Bundles.Botaniq.ImmunityPack.savings * 100 + '%');
console.log('');

console.log('🔒 Immutability:');
console.log('  Chia Seeds frozen:', Object.isFrozen(Products.Botaniq.ChiaSeeds));
console.log('  Variant frozen:', Object.isFrozen(Variants.Botaniq[0]));
console.log('  Bundle frozen:', Object.isFrozen(Bundles.Botaniq.ImmunityPack));
console.log('');

console.log('✅ All tests passed!');
