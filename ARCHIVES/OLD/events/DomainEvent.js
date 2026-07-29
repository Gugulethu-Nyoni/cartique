/**
 * ============================================================
 * @semantq/cartique/events
 * ============================================================
 *
 * Module: DomainEvent
 * Purpose: Immutable domain event base
 * ============================================================
 */

import { Identifier } from '../core/index.js';

export class DomainEvent {
  constructor(type, payload) {
    this.type = type;
    this.payload = Object.freeze(payload || {});
    this.timestamp = new Date().toISOString();
    this.id = Identifier.generate('event');
    Object.freeze(this);
  }
}
