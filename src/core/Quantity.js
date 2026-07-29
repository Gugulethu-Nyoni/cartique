/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: Quantity
 * Purpose: Immutable quantity with unit and precision
 * ============================================================
 */

export class Quantity {
  constructor(value, unit = 'each', precision = 0) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error(`Quantity must be a non-negative number: ${value}`);
    }
    if (!unit || typeof unit !== 'string') {
      throw new Error(`Quantity unit must be a non-empty string: ${unit}`);
    }
    this.value = value;
    this.unit = unit;
    this.precision = precision;
    Object.freeze(this);
  }

  toString() {
    return `${this.value.toFixed(this.precision)} ${this.unit}`;
  }

  add(other) {
    if (this.unit !== other.unit) {
      throw new Error(`Cannot add quantities with different units: ${this.unit} vs ${other.unit}`);
    }
    return new Quantity(this.value + other.value, this.unit, this.precision);
  }

  subtract(other) {
    if (this.unit !== other.unit) {
      throw new Error(`Cannot subtract quantities with different units: ${this.unit} vs ${other.unit}`);
    }
    const result = this.value - other.value;
    if (result < 0) throw new Error(`Result would be negative: ${result}`);
    return new Quantity(result, this.unit, this.precision);
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error(`Factor must be a non-negative number: ${factor}`);
    }
    return new Quantity(this.value * factor, this.unit, this.precision);
  }

  isZero() { return this.value === 0; }

  equals(other) {
    return other instanceof Quantity &&
      this.value === other.value &&
      this.unit === other.unit;
  }

  static each(value) { return new Quantity(value, 'each', 0); }
  static kg(value) { return new Quantity(value, 'kg', 3); }
  static g(value) { return new Quantity(value, 'g', 2); }
  static L(value) { return new Quantity(value, 'L', 3); }
  static mL(value) { return new Quantity(value, 'mL', 2); }
}
