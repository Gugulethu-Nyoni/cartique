/**
 * ============================================================
 * @semantq/cartique/resolution
 * ============================================================
 *
 * Module: Resolution
 * Purpose: Immutable commerce AST — canonical commercial truth
 * ============================================================
 */

import { Money, Diagnostics, Identifier } from '../core/index.js';

export class Resolution {
  constructor(data) {
    this.id = data.id || Identifier.generate('resolution');
    this.items = Object.freeze(data.items || []);
    this.customer = data.customer ? Object.freeze(data.customer) : null;
    this.contexts = Object.freeze(data.contexts || []);
    this.activeCapabilities = Object.freeze(data.activeCapabilities || []);
    
    // Ensure totals is properly set
    this.totals = data.totals ? Object.freeze({
      subtotal: data.totals.subtotal || 0,
      tax: data.totals.tax || 0,
      shipping: data.totals.shipping || 0,
      total: data.totals.total || 0
    }) : Object.freeze({ subtotal: 0, tax: 0, shipping: 0, total: 0 });
    
    this.trace = Object.freeze(data.trace || { pricing: [], tax: [], shipping: [] });
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.valid = data.valid !== false;
    
    // Store pricing directly for easy access
    if (data.items && data.items.length > 0 && data.items[0].pricing) {
      this.pricing = Object.freeze(data.items[0].pricing);
    } else {
      this.pricing = null;
    }
    
    if (data.items && data.items.length > 0 && data.items[0].tax) {
      this.tax = Object.freeze(data.items[0].tax);
    } else {
      this.tax = null;
    }
    
    if (data.items && data.items.length > 0 && data.items[0].shipping) {
      this.shipping = Object.freeze(data.items[0].shipping);
    } else {
      this.shipping = null;
    }
    
    console.log('🔧 Resolution constructed:');
    console.log('  totals:', JSON.stringify(this.totals));
    console.log('  total value:', this.totals.total);
    console.log('  pricing unit price:', this.pricing?.unitPrice);
    
    Object.freeze(this);
  }

  get total() {
    return this.totals?.total || 0;
  }

  get subtotal() {
    return this.totals?.subtotal || 0;
  }

  get taxAmount() {
    return this.totals?.tax || 0;
  }

  get shippingAmount() {
    return this.totals?.shipping || 0;
  }

  get errors() {
    return this.diagnostics.errors;
  }

  get warnings() {
    return this.diagnostics.warnings;
  }

  get isValid() {
    return this.valid && this.diagnostics.valid;
  }

  // Convenience for single-product resolution
  get product() {
    return this.items[0]?.product || null;
  }

  get variant() {
    return this.items[0]?.variant || null;
  }

  get quantity() {
    return this.items[0]?.quantity || 0;
  }

  get hasMultipleItems() {
    return this.items.length > 1;
  }
}
