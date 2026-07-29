/**
 * ============================================================
 * @semantq/cartique/core
 * ============================================================
 *
 * Value Object: Quantity
 * Purpose: Immutable quantity with unit and precision
 * ============================================================
 */

export class Quantity {
  constructor(value, unit = 'each', precision = 0) {
    if (typeof value !== 'number' || value < 0) {
      throw new Error('Quantity must be a non-negative number');
    }
    this.value = value;
    this.unit = unit;
    this.precision = precision;
    Object.freeze(this);
  }

  get formatted() {
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
    if (result < 0) throw new Error('Result would be negative');
    return new Quantity(result, this.unit, this.precision);
  }

  multiply(factor) {
    return new Quantity(this.value * factor, this.unit, this.precision);
  }

  equals(other) {
    return other instanceof Quantity && 
           this.value === other.value && 
           this.unit === other.unit;
  }

  isZero() {
    return this.value === 0;
  }

  isPositive() {
    return this.value > 0;
  }

  static each(value) {
    return new Quantity(value, 'each', 0);
  }

  static kg(value) {
    return new Quantity(value, 'kg', 3);
  }

  static g(value) {
    return new Quantity(value, 'g', 2);
  }

  static l(value) {
    return new Quantity(value, 'L', 3);
  }

  static ml(value) {
    return new Quantity(value, 'mL', 2);
  }
}
