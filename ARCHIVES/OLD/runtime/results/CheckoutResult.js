/**
 * ============================================================
 * @semantq/cartique/runtime/results
 * ============================================================
 *
 * Module: CheckoutResult
 * Purpose: Immutable checkout result
 * ============================================================
 */

import { Identifier, Diagnostics, Money } from '../../core/index.js';

export class CheckoutResult {
  constructor(data) {
    this.id = data.id || Identifier.generate('checkout');
    this.status = data.status || 'pending';
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.timestamp = new Date().toISOString();
    
    this.resolution = data.resolution ? Object.freeze(data.resolution) : null;
    this.cart = data.cart ? Object.freeze(data.cart) : null;
    this.paymentIntent = data.paymentIntent ? Object.freeze(data.paymentIntent) : null;
    
    this.totals = {
      subtotal: data.totals?.subtotal instanceof Money ? data.totals.subtotal : Money.fromDecimal(data.totals?.subtotal || 0),
      tax: data.totals?.tax instanceof Money ? data.totals.tax : Money.fromDecimal(data.totals?.tax || 0),
      shipping: data.totals?.shipping instanceof Money ? data.totals.shipping : Money.fromDecimal(data.totals?.shipping || 0),
      total: data.totals?.total instanceof Money ? data.totals.total : Money.fromDecimal(data.totals?.total || 0)
    };
    
    Object.freeze(this);
    Object.freeze(this.totals);
  }

  get valid() {
    return this.diagnostics.valid;
  }

  get errors() {
    return this.diagnostics.errors;
  }

  get warnings() {
    return this.diagnostics.warnings;
  }

  get total() {
    return this.totals.total;
  }

  get subtotal() {
    return this.totals.subtotal;
  }

  get taxAmount() {
    return this.totals.tax;
  }

  get shippingAmount() {
    return this.totals.shipping;
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isPending() {
    return this.status === 'pending';
  }

  isFailed() {
    return this.status === 'failed';
  }
}
