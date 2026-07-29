/**
 * ============================================================
 * @semantq/cartique/core
 * ============================================================
 *
 * Value Object: TraceEntry
 * Purpose: Immutable trace entry for audit trail
 * ============================================================
 */

export class TraceEntry {
  constructor(data) {
    this.resolver = data.resolver;
    this.operation = data.operation;
    this.before = data.before !== undefined ? Object.freeze(data.before) : null;
    this.after = data.after !== undefined ? Object.freeze(data.after) : null;
    this.message = data.message || '';
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
  }
}
