/**
 * ============================================================
 * @semantq/cartique-commerce
 * ============================================================
 *
 * Domain Object: Context
 * Purpose: Commercial conditions (promotions, seasons, etc.)
 * ============================================================
 */

import { Identifier } from '../core/Identifier.js';

export class Context {
  constructor(data = {}) {
    this.id = data.id || Identifier.from('unknown', 'context');
    this.name = data.name || '';
    this.type = data.type || 'promotion';
    this.activation = data.activation !== undefined ? Object.freeze(data.activation) : null;
    this.injects = Object.freeze(data.injects || []);
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get isActive() {
    if (!this.activation) return false;
    return true;
  }

  get hasInjects() {
    return this.injects.length > 0;
  }

  equals(other) {
    return other instanceof Context && this.id === other.id;
  }

  static promotion(data) {
    return new Context({ ...data, type: 'promotion' });
  }

  static season(data) {
    return new Context({ ...data, type: 'season' });
  }

  static channel(data) {
    return new Context({ ...data, type: 'channel' });
  }
}
