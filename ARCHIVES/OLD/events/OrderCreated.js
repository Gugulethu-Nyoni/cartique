/**
 * ============================================================
 * @semantq/cartique/events
 * ============================================================
 *
 * Event: OrderCreated
 * Purpose: Order created domain event
 * ============================================================
 */

import { DomainEvent } from './DomainEvent.js';

export class OrderCreated extends DomainEvent {
  constructor(order) {
    super('order.created', { order });
  }
}
