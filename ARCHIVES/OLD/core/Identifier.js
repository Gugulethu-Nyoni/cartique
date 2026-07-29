/**
 * ============================================================
 * @semantq/cartique/core
 * ============================================================
 *
 * Value Object: Identifier
 * Purpose: Immutable typed identifier
 * ============================================================
 */

export class Identifier {
  constructor(value, type = 'unknown') {
    if (!value) throw new Error('Identifier value is required');
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

  static generate(type = 'unknown') {
    return new Identifier(crypto.randomUUID(), type);
  }

  static fromString(value, type = 'unknown') {
    return new Identifier(value, type);
  }
}
