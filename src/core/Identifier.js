/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: Identifier
 * Purpose: Immutable typed identifier
 * ============================================================
 */

export class Identifier {
  constructor(value, type = 'unknown') {
    if (!value || typeof value !== 'string') {
      throw new Error(`Identifier value must be a non-empty string: ${value}`);
    }
    this.value = value;
    this.type = type;
    Object.freeze(this);
  }

  toString() {
    return this.value;
  }

  equals(other) {
    return other instanceof Identifier &&
      this.value === other.value &&
      this.type === other.type;
  }

  /**
   * Wrap an external ID from the database
   * This is the ONLY way Cartique should receive permanent IDs
   */
  static from(value, type = 'unknown') {
    return new Identifier(value, type);
  }

  /**
   * Generate an ephemeral ID — ONLY for computation
   * (ResolutionItem, Journal, Correlation, etc.)
   * These are NEVER stored in the database.
   */
  static generateEphemeral(type = 'ephemeral') {
    const uuid = crypto.randomUUID();
    return new Identifier(uuid, type);
  }

  /**
   * Legacy alias for generateEphemeral
   * @deprecated Use generateEphemeral instead
   */
  static generate(type = 'unknown') {
    return this.generateEphemeral(type);
  }
}
