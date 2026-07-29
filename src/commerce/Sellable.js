/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Sellable
 * Purpose: Everything that can be sold — unified commerce abstraction
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Sellable {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'sellable');
    this.type = data.type || 'product';
    this.title = data.title || '';
    this.sku = data.sku || '';
    this.pricing = data.pricing || { base: 0 };
    this.composition = data.composition !== undefined ? Object.freeze(data.composition) : null;
    this.variants = data.variants !== undefined ? Object.freeze(data.variants) : null;
    this.inventory = data.inventory !== undefined ? data.inventory : null;
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get isComposable() {
    return this.composition !== null && this.composition !== undefined;
  }

  get hasVariants() {
    return this.variants !== null && this.variants !== undefined && this.variants.length > 0;
  }

  get hasInventory() {
    return this.inventory !== null && this.inventory !== undefined;
  }

  get basePrice() {
    return this.pricing.base || 0;
  }

  get wholesalePrice() {
    return this.pricing.wholesale || null;
  }

  get bulkPricing() {
    return this.pricing.bulk || [];
  }

  equals(other) {
    return other instanceof Sellable && this.id === other.id;
  }

  static product(data) {
    return new Sellable({ ...data, type: 'product' });
  }

  static bundle(data) {
    return new Sellable({ ...data, type: 'bundle' });
  }

  static service(data) {
    return new Sellable({ ...data, type: 'service' });
  }

  static digital(data) {
    return new Sellable({ ...data, type: 'digital' });
  }

  static giftCard(data) {
    return new Sellable({ ...data, type: 'gift-card' });
  }
}
