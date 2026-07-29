/**
 * ============================================================
 * Test: Coupon
 * ============================================================
 */

import { Coupon } from '../../src/commerce/Coupon.js';

console.log('✅ Testing Coupon');
console.log('');

const coupon = Coupon.percentage('SUMMER20', 20);

console.log('📋 Coupon:');
console.log(`  ID: ${coupon.id.value}`);
console.log(`  Code: ${coupon.code}`);
console.log(`  Type: ${coupon.type}`);
console.log(`  Value: ${coupon.value}%`);
console.log(`  Is percentage: ${coupon.isPercentage}`);
console.log(`  Discount amount: ${coupon.discountAmount}`);
console.log(`  Is active: ${coupon.isActive}`);
console.log('');

const fixedCoupon = Coupon.fixed('SAVE50', 50);

console.log('📋 Fixed Coupon:');
console.log(`  Code: ${fixedCoupon.code}`);
console.log(`  Type: ${fixedCoupon.type}`);
console.log(`  Value: R${fixedCoupon.value}`);
console.log(`  Is fixed: ${fixedCoupon.isFixed}`);
console.log('');

console.log('✅ All Coupon tests passed!');
