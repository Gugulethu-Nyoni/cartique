/**
 * ============================================================
 * @semantq/cartique/runtime/results
 * ============================================================
 *
 * Module: TransactionResult
 * Purpose: Base transaction result utilities
 * ============================================================
 */

import { Identifier, Diagnostics } from '../../core/index.js';

export class TransactionResult {
  constructor(data) {
    this.id = data.id || Identifier.generate('transaction');
    this.status = data.status || 'pending';
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.timestamp = new Date().toISOString();
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
