/**
 * ============================================================
 * @semantq/cartique/runtime/results
 * ============================================================
 *
 * Module: PaymentResult
 * Purpose: Immutable payment result
 * ============================================================
 */

import { Identifier, Diagnostics, Money } from '../../core/index.js';

export class PaymentResult {
  constructor(data) {
    this.id = data.id || Identifier.generate('payment');
    this.status = data.status || 'pending';
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.timestamp = new Date().toISOString();
    
    this.transactionId = data.transactionId || null;
    this.amount = data.amount instanceof Money ? data.amount : Money.fromDecimal(data.amount || 0);
    this.currency = data.currency || 'ZAR';
    this.provider = data.provider || null;
    this.providerReference = data.providerReference || null;
    this.method = data.method || null;
    
    Object.freeze(this);
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
