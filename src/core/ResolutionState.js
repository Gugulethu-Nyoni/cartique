/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: ResolutionState
 * Purpose: Immutable state passed between resolvers
 * ============================================================
 */

import { Identifier } from './Identifier.js';
import { Diagnostics } from './Diagnostics.js';
import { ResolutionJournal } from './ResolutionJournal.js';
import { Money } from './Money.js';

export class ResolutionState {
  constructor(data = {}) {
    this.id = data.id || Identifier.generateEphemeral('resolution-state');
    this.sellable = data.sellable || null;
    this.customer = data.customer || null;
    this.place = data.place || null;
    this.configuration = data.configuration || { quantity: 1 };
    this.contexts = Object.freeze(data.contexts || []);
    this.items = Object.freeze(data.items || []);
    this.adjustments = Object.freeze(data.adjustments || []);
    this.resolved = Object.freeze(data.resolved || {});
    this.capabilities = Object.freeze(data.capabilities || []);
    this.journal = data.journal instanceof ResolutionJournal ? data.journal : new ResolutionJournal();
    this.diagnostics = data.diagnostics instanceof Diagnostics ? data.diagnostics : new Diagnostics(data.diagnostics);
    this.metadata = Object.freeze(data.metadata || {});
    this.valid = data.valid !== false;
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
  }

  withItems(items) {
    return new ResolutionState({ ...this, items: Object.freeze(items) });
  }

  withAdjustments(adjustments) {
    return new ResolutionState({ ...this, adjustments: Object.freeze(adjustments) });
  }

  // MERGE: Preserve existing resolved data and add/update the key
  withResolved(key, value) {
    const newResolved = {
      ...this.resolved,    // Preserve all existing resolved data
      [key]: value         // Add/update the new key
    };
    return new ResolutionState({
      ...this,
      resolved: Object.freeze(newResolved)
    });
  }

  withJournalEntry(entry) {
    return new ResolutionState({
      ...this,
      journal: this.journal.addEntry(entry)
    });
  }

  withDiagnostics(diagnostics) {
    return new ResolutionState({
      ...this,
      diagnostics,
      valid: diagnostics.valid && this.valid
    });
  }

  withError(code, message, details = {}) {
    return this.withDiagnostics(this.diagnostics.addError(code, message, details));
  }

  withWarning(code, message, details = {}) {
    return this.withDiagnostics(this.diagnostics.addWarning(code, message, details));
  }

  hasItems() { return this.items.length > 0; }
  hasAdjustments() { return this.adjustments.length > 0; }
  isValid() { return this.valid && this.diagnostics.valid; }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + (item.quantity?.value || 1), 0);
  }

  toString() {
    return `ResolutionState(${this.id.value}) items: ${this.items.length}, valid: ${this.valid}`;
  }
}
