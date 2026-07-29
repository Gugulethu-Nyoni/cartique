/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Cart
 * Purpose: Temporary collection of items being purchased
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Cart {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'cart');
    this.items = Object.freeze(data.items || []);
    this.customer = data.customer || null;
    this.coupons = Object.freeze(data.coupons || []);
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get itemCount() {
    return this.items.length;
  }

  get totalQuantity() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  get hasItems() {
    return this.items.length > 0;
  }

  get isEmpty() {
    return this.items.length === 0;
  }

  get hasCoupons() {
    return this.coupons.length > 0;
  }

  addItem(item) {
    return new Cart({
      ...this,
      items: [...this.items, item]
    });
  }

  removeItem(itemId) {
    return new Cart({
      ...this,
      items: this.items.filter(i => i.id !== itemId)
    });
  }

  updateItem(itemId, quantity) {
    return new Cart({
      ...this,
      items: this.items.map(i => 
        i.id === itemId ? { ...i, quantity } : i
      )
    });
  }

  addCoupon(coupon) {
    return new Cart({
      ...this,
      coupons: [...this.coupons, coupon]
    });
  }

  removeCoupon(couponId) {
    return new Cart({
      ...this,
      coupons: this.coupons.filter(c => c.id !== couponId)
    });
  }

  equals(other) {
    return other instanceof Cart && this.id === other.id;
  }

  static empty() {
    return new Cart();
  }

  static forCustomer(customer) {
    return new Cart({ customer });
  }
}
