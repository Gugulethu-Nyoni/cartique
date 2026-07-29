/**
 * ============================================================
 * Strategy: Subscription
 * ============================================================
 */

export class SubscriptionStrategy {
  supports(sellable) {
    return sellable.type === 'subscription';
  }

  explode(sellable, configuration) {
    return [];
  }
}
