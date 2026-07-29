/**
 * ============================================================
 * @semantq/cartique/resolution
 * ============================================================
 *
 * Module: ResolutionItem
 * Purpose: Immutable resolution item
 * ============================================================
 */

import { Quantity, Money } from '../core/index.js';

export class ResolutionItem {
  constructor(data) {
    this.product = data.product ? Object.freeze(data.product) : null;
    this.variant = data.variant ? Object.freeze(data.variant) : null;
    this.quantity = data.quantity instanceof Quantity ? data.quantity : new Quantity(data.quantity || 1);
    this.pricing = data.pricing ? Object.freeze(data.pricing) : null;
    this.tax = data.tax ? Object.freeze(data.tax) : null;
    this.shipping = data.shipping ? Object.freeze(data.shipping) : null;
    this.capabilities = Object.freeze(data.capabilities || []);
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get unitPrice() {
    return this.pricing?.unitPrice || Money.zero();
  }

  get totalPrice() {
    return this.pricing?.totalPrice || Money.zero();
  }

  get subtotal() {
    return this.pricing?.subtotal || Money.zero();
  }
}
