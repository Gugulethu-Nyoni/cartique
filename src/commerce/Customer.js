/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Customer
 * Purpose: Buyer entity
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Customer {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'customer');
    this.name = data.name || '';
    this.email = data.email || '';
    this.group = data.group || 'guest';
    this.segment = data.segment || 'standard';
    this.contracts = Object.freeze(data.contracts || []);
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get isWholesale() {
    return this.group === 'wholesale';
  }

  get isRetail() {
    return this.group === 'retail';
  }

  get isVip() {
    return this.group === 'vip' || this.segment === 'premium';
  }

  get isGuest() {
    return this.group === 'guest';
  }

  get hasContracts() {
    return this.contracts.length > 0;
  }

  equals(other) {
    return other instanceof Customer && this.id === other.id;
  }

  static guest() {
    return new Customer({ group: 'guest', segment: 'standard' });
  }

  static retail(data) {
    return new Customer({ ...data, group: 'retail' });
  }

  static wholesale(data) {
    return new Customer({ ...data, group: 'wholesale' });
  }

  static vip(data) {
    return new Customer({ ...data, group: 'vip', segment: 'premium' });
  }
}
