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
  constructor(amount, currency = 'ZAR', precision = 2) {
    if (typeof amount !== 'number' || !Number.isInteger(amount)) {
      throw new Error(`Money amount must be an integer: ${amount}`);
    }
    this.amount = amount;
    this.currency = currency;
    this.precision = precision;
    Object.freeze(this);
  }

  get decimal() {
    return this.amount / Math.pow(10, this.precision);
  }

  toString() {
    return `${this.currency} ${this.decimal.toFixed(this.precision)}`;
  }

  toFormatted() {
    const symbols = { ZAR: 'R', USD: '$', EUR: '€', GBP: '£' };
    const symbol = symbols[this.currency] || this.currency;
    return `${symbol}${this.decimal.toFixed(this.precision)}`;
  }

  add(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot add currencies: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.amount + other.amount, this.currency, this.precision);
  }

  subtract(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot subtract currencies: ${this.currency} vs ${other.currency}`);
    }
    return new Money(this.amount - other.amount, this.currency, this.precision);
  }

  multiply(factor) {
    if (typeof factor !== 'number' || factor < 0) {
      throw new Error(`Factor must be a positive number: ${factor}`);
    }
    return new Money(Math.round(this.amount * factor), this.currency, this.precision);
  }

  divide(divisor) {
    if (typeof divisor !== 'number' || divisor <= 0) {
      throw new Error(`Divisor must be a positive number: ${divisor}`);
    }
    return new Money(Math.round(this.amount / divisor), this.currency, this.precision);
  }

  isZero() { return this.amount === 0; }
  isPositive() { return this.amount > 0; }
  isNegative() { return this.amount < 0; }

  equals(other) {
    return other instanceof Money &&
      this.amount === other.amount &&
      this.currency === other.currency;
  }

  greaterThan(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot compare currencies: ${this.currency} vs ${other.currency}`);
    }
    return this.amount > other.amount;
  }

  lessThan(other) {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot compare currencies: ${this.currency} vs ${other.currency}`);
    }
    return this.amount < other.amount;
  }

  static fromDecimal(decimal, currency = 'ZAR', precision = 2) {
    if (typeof decimal === 'string') decimal = parseFloat(decimal);
    if (typeof decimal !== 'number' || isNaN(decimal)) {
      throw new Error(`Invalid decimal value: ${decimal}`);
    }
    const amount = Math.round(decimal * Math.pow(10, precision));
    return new Money(amount, currency, precision);
  }

  static zero(currency = 'ZAR', precision = 2) {
    return new Money(0, currency, precision);
  }

  static sum(items, currency = 'ZAR') {
    const total = items.reduce((sum, item) => {
      if (!(item instanceof Money)) throw new Error(`Item must be Money: ${item}`);
      if (item.currency !== currency) throw new Error(`Currency mismatch: ${item.currency} vs ${currency}`);
      return sum + item.amount;
    }, 0);
    return new Money(total, currency);
  }
}
