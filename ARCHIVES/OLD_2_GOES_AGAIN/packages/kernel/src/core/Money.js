/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: Money
 * Purpose: Immutable monetary value with currency
 * ============================================================
 */

export class Money {
  /**
   * @param {number} amount - Amount in smallest currency unit (e.g., cents)
   * @param {string} currency - ISO currency code (default: 'ZAR')
   * @param {number} precision - Decimal places (default: 2)
   */
  constructor(amount, currency = 'ZAR', precision = 2) {
    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      throw new Error(`Money amount must be an integer: ${amount}`);
    }
    this.amount = amount;
    this.currency = currency;
    this.precision = precision;
    Object.freeze(this);
  }

  /**
   * Get the decimal amount
   */
  get decimal() {
    return this.amount / Math.pow(10, this.precision);
  }

  /**
   * Format as string
   */
  toString() {
    return `${this.currency} ${this.decimal.toFixed(this.precision)}`;
  }

  /**
   * Format as string with symbol
   */
  toFormatted() {
    const symbols = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[this.currency] || this.currency;
    return `${symbol}${this.decimal.toFixed(this.precision)}`;
  }

  /**
   * Add two Money objects
   */
  add(other) {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot add currencies: ${this.currency} vs ${other.currency}`
      );
    }
    return new Money(this.amount + other.amount, this.currency, this.precision);
  }

  /**
   * Subtract two Money objects
   */
  subtract(other) {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot subtract currencies: ${this.currency} vs ${other.currency}`
      );
    }
    return new Money(this.amount - other.amount, this.currency, this.precision);
  }

  /**
   * Multiply by a factor
   */
  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error(`Factor must be a positive number: ${factor}`);
    }
    return new Money(Math.round(this.amount * factor), this.currency, this.precision);
  }

  /**
   * Divide by a divisor
   */
  divide(divisor) {
    if (typeof divisor !== 'number' || divisor <= 0) {
      throw new Error(`Divisor must be a positive number: ${divisor}`);
    }
    return new Money(Math.round(this.amount / divisor), this.currency, this.precision);
  }

  /**
   * Check if zero
   */
  isZero() {
    return this.amount === 0;
  }

  /**
   * Check if positive
   */
  isPositive() {
    return this.amount > 0;
  }

  /**
   * Check if negative
   */
  isNegative() {
    return this.amount < 0;
  }

  /**
   * Compare equality
   */
  equals(other) {
    return (
      other instanceof Money &&
      this.amount === other.amount &&
      this.currency === other.currency
    );
  }

  /**
   * Compare greater than
   */
  greaterThan(other) {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot compare currencies: ${this.currency} vs ${other.currency}`
      );
    }
    return this.amount > other.amount;
  }

  /**
   * Compare less than
   */
  lessThan(other) {
    if (this.currency !== other.currency) {
      throw new Error(
        `Cannot compare currencies: ${this.currency} vs ${other.currency}`
      );
    }
    return this.amount < other.amount;
  }

  /**
   * Create from decimal string
   */
  static fromDecimal(decimal, currency = 'ZAR', precision = 2) {
    if (typeof decimal === 'string') {
      decimal = parseFloat(decimal);
    }
    if (typeof decimal !== 'number' || isNaN(decimal)) {
      throw new Error(`Invalid decimal value: ${decimal}`);
    }
    const amount = Math.round(decimal * Math.pow(10, precision));
    return new Money(amount, currency, precision);
  }

  /**
   * Create zero
   */
  static zero(currency = 'ZAR', precision = 2) {
    return new Money(0, currency, precision);
  }

  /**
   * Sum an array of Money objects
   */
  static sum(items, currency = 'ZAR') {
    const total = items.reduce((sum, item) => {
      if (!(item instanceof Money)) {
        throw new Error(`Item must be Money: ${item}`);
      }
      if (item.currency !== currency) {
        throw new Error(`Currency mismatch: ${item.currency} vs ${currency}`);
      }
      return sum + item.amount;
    }, 0);
    return new Money(total, currency);
  }
}
