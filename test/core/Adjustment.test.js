/**
 * ============================================================
 * Test: Adjustment
 * ============================================================
 */

import { Adjustment } from '../../src/core/Adjustment.js';
import { Money } from '../../src/core/Money.js';

console.log('✅ Testing Adjustment');
console.log('');

const discount = Adjustment.discount(
  'promotion.blackfriday',
  Money.fromDecimal(20),
  'Black Friday 20% off',
  'Applied to order'
);

console.log('📋 Discount:');
console.log(`  ID: ${discount.id}`);
console.log(`  Type: ${discount.type}`);
console.log(`  Rule: ${discount.ruleId}`);
console.log(`  Amount: ${discount.amount.toString()}`);
console.log(`  Is discount: ${discount.isDiscount()}`);
console.log('');

const surcharge = Adjustment.surcharge(
  'shipping.express',
  Money.fromDecimal(50),
  'Express shipping',
  'Customer selected express'
);

console.log('📋 Surcharge:');
console.log(`  Rule: ${surcharge.ruleId}`);
console.log(`  Amount: ${surcharge.amount.toString()}`);
console.log(`  Is surcharge: ${surcharge.isSurcharge()}`);
console.log('');

const coupon = Adjustment.coupon(
  'coupon.SUMMER20',
  Money.fromDecimal(15),
  'SUMMER20 coupon',
  'Applied to order'
);

console.log('📋 Coupon:');
console.log(`  Rule: ${coupon.ruleId}`);
console.log(`  Amount: ${coupon.amount.toString()}`);
console.log(`  Is discount: ${coupon.isDiscount()}`);
console.log('');

const credit = Adjustment.storeCredit(
  Money.fromDecimal(25),
  'Store credit',
  'Customer had store credit'
);

console.log('📋 Store Credit:');
console.log(`  Amount: ${credit.amount.toString()}`);
console.log(`  Is discount: ${credit.isDiscount()}`);
console.log('');

console.log('✅ All Adjustment tests passed!');
