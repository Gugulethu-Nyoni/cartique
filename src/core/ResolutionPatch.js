/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: ResolutionPatch
 * Purpose: Immutable patch returned by resolvers
 * ============================================================
 */

import { Diagnostics } from './Diagnostics.js';

export class ResolutionPatch {
  constructor(data = {}) {
    this.items = data.items !== undefined ? Object.freeze(data.items) : null;
    this.adjustments = data.adjustments !== undefined ? Object.freeze(data.adjustments) : null;
    this.resolved = data.resolved !== undefined ? Object.freeze(data.resolved) : null;
    this.metadata = data.metadata !== undefined ? Object.freeze(data.metadata) : null;
    this.journalEntries = Object.freeze(data.journalEntries || []);
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.outcome = data.outcome || 'success';
    this.valid = data.valid !== false;
    Object.freeze(this);
  }

  get isSuccess() { return this.outcome === 'success' && this.valid; }
  get isNoChange() { return this.outcome === 'no-change'; }
  get isReject() { return this.outcome === 'reject'; }
  get isError() { return this.outcome === 'error'; }

  hasItems() { return this.items !== null && this.items.length > 0; }
  hasAdjustments() { return this.adjustments !== null && this.adjustments.length > 0; }
  hasResolved() { return this.resolved !== null && Object.keys(this.resolved).length > 0; }
  hasJournal() { return this.journalEntries.length > 0; }

  static success(data = {}) {
    return new ResolutionPatch({ ...data, outcome: 'success', valid: true });
  }

  static noChange(reason = 'No action required') {
    return new ResolutionPatch({
      outcome: 'no-change',
      valid: true,
      journalEntries: [{ resolver: 'Resolver', decision: 'no-change', reason }]
    });
  }

  static reject(reason, code = 'REJECTED') {
    return new ResolutionPatch({
      outcome: 'reject',
      valid: false,
      diagnostics: Diagnostics.error(code, reason)
    });
  }

  static error(message, code = 'RESOLVER_ERROR') {
    return new ResolutionPatch({
      outcome: 'error',
      valid: false,
      diagnostics: Diagnostics.error(code, message)
    });
  }
}
