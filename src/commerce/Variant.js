/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Variant
 * Purpose: Specific configuration of a sellable
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Variant {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'variant');
    this.sellableId = data.sellableId || '';
    this.sku = data.sku || '';
    this.title = data.title || '';
    this.attributes = Object.freeze(data.attributes || {});
    this.pricing = data.pricing || { base: 0 };
    this.inventory = data.inventory !== undefined ? data.inventory : 0;
    this.isDefault = data.isDefault || false;
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
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

  get hasInventory() {
    return this.inventory !== undefined && this.inventory !== null;
  }

  get isInStock() {
    return this.inventory > 0;
  }

  get isLowStock() {
    return this.inventory > 0 && this.inventory <= 5;
  }

  equals(other) {
    return other instanceof Variant && this.id === other.id;
  }

  static withAttributes(sellableId, attributes, pricing) {
    return new Variant({ sellableId, attributes, pricing });
  }
}
