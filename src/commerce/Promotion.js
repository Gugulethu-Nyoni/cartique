/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Promotion
 * Purpose: Marketing promotion/offer
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Promotion {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'promotion');
    this.name = data.name || '';
    this.type = data.type || 'percentage';
    this.value = data.value || 0;
    this.activeFrom = data.activeFrom || null;
    this.activeTo = data.activeTo || null;
    this.priority = data.priority || 0;
    this.stackable = data.stackable || false;
    this.conditions = Object.freeze(data.conditions || {});
    this.effect = Object.freeze(data.effect || { type: 'discount', applyTo: 'order' });
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get isActive() {
    if (!this.activeFrom || !this.activeTo) return false;
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

  get isFreeShipping() {
    return this.type === 'free_shipping';
  }

  get isOrderLevel() {
    return this.effect.applyTo === 'order';
  }

  get isItemLevel() {
    return this.effect.applyTo === 'item';
  }

  get discountAmount() {
    if (this.isPercentage) return this.value / 100;
    if (this.isFixed) return this.value;
    return 0;
  }

  equals(other) {
    return other instanceof Promotion && this.id === other.id;
  }

  static percentage(value, name, conditions = {}) {
    return new Promotion({
      type: 'percentage',
      value,
      name,
      conditions,
      effect: { type: 'discount', applyTo: 'order' }
    });
  }

  static fixed(value, name, conditions = {}) {
    return new Promotion({
      type: 'fixed',
      value,
      name,
      conditions,
      effect: { type: 'discount', applyTo: 'order' }
    });
  }

  static freeShipping(name, conditions = {}) {
    return new Promotion({
      type: 'free_shipping',
      value: 100,
      name,
      conditions,
      effect: { type: 'free_shipping', applyTo: 'order' }
    });
  }
}
