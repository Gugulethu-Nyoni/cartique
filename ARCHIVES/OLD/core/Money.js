/**
 * ============================================================
 * @semantq/cartique/core
 * ============================================================
 *
 * Value Object: Money
 * Purpose: Immutable monetary value with currency
 * ============================================================
 */

export class Money {
  constructor(minorAmount, currency = 'ZAR') {
    if (typeof minorAmount !== 'number' || !Number.isInteger(minorAmount)) {
      throw new Error('Money must be created with an integer minor amount');
    }
    this.minorAmount = minorAmount;
    this.currency = currency;
    Object.freeze(this);
  }

  get amount() {
    return this.minorAmount / 100;
  }

  get formatted() {
    return `${this.currency} ${(this.minorAmount / 100).toFixed(2)}`;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add currencies: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.minorAmount + other.minorAmount, this.currency);
  }

  subtract(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot subtract currencies: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.minorAmount - other.minorAmount, this.currency);
  }

  multiply(factor) {
    return new Money(Math.round(this.minorAmount * factor), this.currency);
  }

  divide(divisor) {
    if (divisor === 0) throw new Error('Cannot divide by zero');
    return new Money(Math.round(this.minorAmount / divisor), this.currency);
  }

  equals(other) {
    return other instanceof Money && 
           this.minorAmount === other.minorAmount && 
           this.currency === other.currency;
  }

  isZero() {
    return this.minorAmount === 0;
  }

  isPositive() {
    return this.minorAmount > 0;
  }

  isNegative() {
    return this.minorAmount < 0;
  }

  static fromDecimal(amount, currency = 'ZAR') {
    return new Money(Math.round(amount * 100), currency);
  }

  static fromMinor(minorAmount, currency = 'ZAR') {
    return new Money(minorAmount, currency);
  }

  static zero(currency = 'ZAR') {
    return new Money(0, currency);
  }
}
