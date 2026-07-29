/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: ResolutionItem
 * Purpose: Immutable commercial resolution item
 * ============================================================
 */

import { Identifier } from './Identifier.js';
import { Money } from './Money.js';
import { Quantity } from './Quantity.js';

export class ResolutionItem {
  constructor(data) {
    this.id = data.id || Identifier.generate('resolution-item');
    this.sellable = data.sellable || null;
    this.variant = data.variant || null;
    this.quantity = data.quantity instanceof Quantity ? data.quantity : new Quantity(data.quantity || 1);
    this.unitPrice = data.unitPrice instanceof Money ? data.unitPrice : null;
    this.inventory = data.inventory !== undefined ? Object.freeze(data.inventory) : null;
    this.shipping = data.shipping !== undefined ? Object.freeze(data.shipping) : null;
    this.tax = data.tax !== undefined ? Object.freeze(data.tax) : null;
    this.origin = Object.freeze(data.origin || { type: 'direct', id: data.sellable?.id || 'unknown' });
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get subtotal() {
    if (!this.unitPrice) return null;
    return this.unitPrice.multiply(this.quantity.value);
  }

  get isPriced() { return this.unitPrice !== null; }
  get hasInventory() { return this.inventory !== null; }
  get hasShipping() { return this.shipping !== null; }
  get hasTax() { return this.tax !== null; }

  withUnitPrice(unitPrice) {
    if (!(unitPrice instanceof Money)) throw new Error('unitPrice must be a Money object');
    return new ResolutionItem({ ...this, unitPrice });
  }

  withInventory(inventory) {
    return new ResolutionItem({ ...this, inventory });
  }

  withShipping(shipping) {
    return new ResolutionItem({ ...this, shipping });
  }

  withTax(tax) {
    return new ResolutionItem({ ...this, tax });
  }

  withOrigin(origin) {
    return new ResolutionItem({ ...this, origin: Object.freeze(origin) });
  }

  equals(other) {
    return other instanceof ResolutionItem &&
      this.id === other.id &&
      this.sellable?.id === other.sellable?.id &&
      this.quantity.equals(other.quantity);
  }
}
