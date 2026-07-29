/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Place
 * Purpose: Geographic place/region
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Place {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'place');
    this.name = data.name || '';
    this.country = data.country || '';
    this.currency = data.currency || 'ZAR';
    this.timezone = data.timezone || 'UTC';
    this.tax = data.tax !== undefined ? Object.freeze(data.tax) : null;
    this.shipping = data.shipping !== undefined ? Object.freeze(data.shipping) : null;
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get hasTax() {
    return this.tax !== null && this.tax !== undefined;
  }

  get taxRate() {
    return this.tax?.vatRate || this.tax?.rate || 0;
  }

  get hasShipping() {
    return this.shipping !== null && this.shipping !== undefined;
  }

  get defaultShippingCost() {
    return this.shipping?.defaultCost || 0;
  }

  equals(other) {
    return other instanceof Place && this.id === other.id;
  }

  static southAfrica() {
    return new Place({
      id: Identifier.from('za', 'place'),
      name: 'South Africa',
      country: 'ZA',
      currency: 'ZAR',
      timezone: 'Africa/Johannesburg',
      tax: { vatRate: 0.15 },
      shipping: { defaultCost: 50 }
    });
  }

  static uk() {
    return new Place({
      id: Identifier.from('uk', 'place'),
      name: 'United Kingdom',
      country: 'GB',
      currency: 'GBP',
      timezone: 'Europe/London',
      tax: { vatRate: 0.20 },
      shipping: { defaultCost: 10 }
    });
  }

  static usa() {
    return new Place({
      id: Identifier.from('us', 'place'),
      name: 'United States',
      country: 'US',
      currency: 'USD',
      timezone: 'America/New_York',
      tax: { rate: 0 },
      shipping: { defaultCost: 15 }
    });
  }
}
