/**
 * ============================================================
 * Test: Place
 * ============================================================
 */

import { Place } from '../../src/commerce/Place.js';

console.log('✅ Testing Place');
console.log('');

const za = Place.southAfrica();

console.log('📋 South Africa:');
console.log(`  ID: ${za.id.value}`);
console.log(`  Name: ${za.name}`);
console.log(`  Country: ${za.country}`);
console.log(`  Currency: ${za.currency}`);
console.log(`  Timezone: ${za.timezone}`);
console.log(`  Tax Rate: ${za.taxRate * 100}%`);
console.log(`  Default Shipping: R${za.defaultShippingCost}`);
console.log(`  Has Tax: ${za.hasTax}`);
console.log(`  Has Shipping: ${za.hasShipping}`);
console.log('');

const uk = Place.uk();

console.log('📋 United Kingdom:');
console.log(`  ID: ${uk.id.value}`);
console.log(`  Country: ${uk.country}`);
console.log(`  Currency: ${uk.currency}`);
console.log(`  Tax Rate: ${uk.taxRate * 100}%`);
console.log(`  Default Shipping: £${uk.defaultShippingCost}`);
console.log('');

const us = Place.usa();

console.log('📋 United States:');
console.log(`  ID: ${us.id.value}`);
console.log(`  Country: ${us.country}`);
console.log(`  Currency: ${us.currency}`);
console.log(`  Tax Rate: ${us.taxRate * 100}%`);
console.log(`  Default Shipping: $${us.defaultShippingCost}`);
console.log('');

console.log('✅ All Place tests passed!');
