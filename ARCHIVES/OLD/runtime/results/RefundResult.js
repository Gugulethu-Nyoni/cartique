/**
 * ============================================================
 * @semantq/cartique/runtime/results
 * ============================================================
 *
 * Module: RefundResult
 * Purpose: Immutable refund result
 * ============================================================
 */

import { Identifier, Diagnostics, Money } from '../../core/index.js';

export class RefundResult {
  constructor(data) {
    this.id = data.id || Identifier.generate('refund');
    this.status = data.status || 'pending';
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.timestamp = new Date().toISOString();
    
    this.originalTransactionId = data.originalTransactionId || null;
    this.amount = data.amount instanceof Money ? data.amount : Money.fromDecimal(data.amount || 0);
    this.currency = data.currency || 'ZAR';
    this.reason = data.reason || null;
    
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
