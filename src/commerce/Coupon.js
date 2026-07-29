/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Coupon
 * Purpose: Discount coupon code
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Coupon {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'coupon');
    this.code = data.code || '';
    this.type = data.type || 'percentage';
    this.value = data.value || 0;
    this.usageLimit = data.usageLimit || null;
    this.usageCount = data.usageCount || 0;
    this.activeFrom = data.activeFrom || null;
    this.activeTo = data.activeTo || null;
    this.conditions = Object.freeze(data.conditions || {});
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get isActive() {
    if (!this.activeFrom || !this.activeTo) return true;
    const now = new Date();
    const from = new Date(this.activeFrom);
    const to = new Date(this.activeTo);
    return now >= from && now <= to;
  }

  get isPercentage() {
    return this.type === 'percentage';
  }

  get isFixed() {
    return this.type === 'fixed';
  }

  get isUsed() {
    return this.usageCount >= this.usageLimit;
  }

  get discountAmount() {
    if (this.isPercentage) return this.value / 100;
    if (this.isFixed) return this.value;
    return 0;
  }

  equals(other) {
    return other instanceof Coupon && this.id === other.id;
  }

  static percentage(code, value) {
    return new Coupon({ code, type: 'percentage', value });
  }

  static fixed(code, value) {
    return new Coupon({ code, type: 'fixed', value });
  }
}
