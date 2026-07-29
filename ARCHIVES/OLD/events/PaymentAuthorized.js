/**
 * ============================================================
 * @semantq/cartique/events
 * ============================================================
 *
 * Event: PaymentAuthorized
 * Purpose: Payment authorized domain event
 * ============================================================
 */

import { DomainEvent } from './DomainEvent.js';

export class PaymentAuthorized extends DomainEvent {
  constructor(payment) {
    super('payment.authorized', { payment });
  }
}
