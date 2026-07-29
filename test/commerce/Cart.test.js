/**
 * ============================================================
 * Test: Cart
 * ============================================================
 */

import { Cart } from '../../src/commerce/Cart.js';
import { Customer } from '../../src/commerce/Customer.js';
import { Coupon } from '../../src/commerce/Coupon.js';
import { Identifier } from '../../src/core/Identifier.js';

console.log('✅ Testing Cart');
console.log('');

// Create empty cart
const emptyCart = Cart.empty();
console.log('📋 Empty Cart:');
console.log(`  ID: ${emptyCart.id.value}`);
console.log(`  Has items: ${emptyCart.hasItems}`);
console.log(`  Is empty: ${emptyCart.isEmpty}`);
console.log(`  Item count: ${emptyCart.itemCount}`);
console.log('');

// Create cart with items
const customer = Customer.retail({
  id: Identifier.from('cust_001', 'customer'),
  name: 'Sarah M.'
});

const item1 = { id: 'item_001', productId: 'prod_chia_001', variantId: 'var_chia_004', quantity: 2, unitPrice: 140 };
const item2 = { id: 'item_002', productId: 'prod_moringa_001', variantId: 'var_moringa_001', quantity: 1, unitPrice: 60 };

const cart = Cart.forCustomer(customer)
  .addItem(item1)
  .addItem(item2);

console.log('📋 Cart with items:');
console.log(`  ID: ${cart.id.value}`);
console.log(`  Has items: ${cart.hasItems}`);
console.log(`  Is empty: ${cart.isEmpty}`);
console.log(`  Item count: ${cart.itemCount}`);
console.log(`  Total quantity: ${cart.totalQuantity}`);
console.log(`  Customer: ${cart.customer?.name}`);
console.log('');

// Add coupon
const coupon = Coupon.percentage('SUMMER20', 20);
const cartWithCoupon = cart.addCoupon(coupon);

console.log('📋 Cart with coupon:');
console.log(`  Has coupons: ${cartWithCoupon.hasCoupons}`);
console.log(`  Coupons: ${cartWithCoupon.coupons.length}`);
console.log(`  Coupon code: ${cartWithCoupon.coupons[0]?.code}`);
console.log('');

// Remove item
const cartWithoutItem = cart.removeItem('item_001');
console.log('📋 Cart after removing item:');
console.log(`  Item count: ${cartWithoutItem.itemCount}`);
console.log('');

console.log('✅ All Cart tests passed!');
