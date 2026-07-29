/**
 * ============================================================
 * @semantq/cartique-core
 * ============================================================
 *
 * Value Object: Adjustment
 * Purpose: Immutable adjustment to a commercial decision
 * ============================================================
 */

import { Identifier } from './Identifier.js';
import { Money } from './Money.js';

export class Adjustment {
  constructor(data) {
    if (!data.type) throw new Error('Adjustment: type is required');
    if (!data.ruleId) throw new Error('Adjustment: ruleId is required');
    if (!data.amount || !(data.amount instanceof Money)) {
      throw new Error('Adjustment: amount must be a Money object');
    }

    this.id = data.id || Identifier.generate('adjustment');
    this.type = data.type;
    this.ruleId = data.ruleId;
    this.description = data.description || '';
    this.amount = data.amount;
    this.appliesTo = data.appliesTo || 'order';
    this.itemId = data.itemId || null;
    this.reason = data.reason || '';
    this.metadata = Object.freeze(data.metadata || {});
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
  }

  isDiscount() { return this.amount.isNegative(); }
  isSurcharge() { return this.amount.isPositive(); }
  isItemAdjustment() { return this.appliesTo === 'item' && this.itemId !== null; }
  isOrderAdjustment() { return this.appliesTo === 'order'; }

  equals(other) {
    return other instanceof Adjustment &&
      this.id === other.id &&
      this.type === other.type &&
      this.amount.equals(other.amount);
  }

  static discount(ruleId, amount, description, reason = '') {
    const money = amount instanceof Money ? amount : Money.fromDecimal(amount);
    return new Adjustment({
      type: 'promotion',
      ruleId,
      amount: money.isPositive() ? new Money(-money.amount, money.currency, money.precision) : money,
      description: description || `Discount from ${ruleId}`,
      reason
    });
  }

  static surcharge(ruleId, amount, description, reason = '') {
    const money = amount instanceof Money ? amount : Money.fromDecimal(amount);
    return new Adjustment({
      type: 'surcharge',
      ruleId,
      amount: money,
      description: description || `Surcharge from ${ruleId}`,
      reason
    });
  }

  static coupon(ruleId, amount, description, reason = '') {
    const money = amount instanceof Money ? amount : Money.fromDecimal(amount);
    return new Adjustment({
      type: 'coupon',
      ruleId,
      amount: money.isPositive() ? new Money(-money.amount, money.currency, money.precision) : money,
      description: description || `Coupon: ${ruleId}`,
      reason
    });
  }

  static storeCredit(amount, description, reason = '') {
    const money = amount instanceof Money ? amount : Money.fromDecimal(amount);
    return new Adjustment({
      type: 'store-credit',
      ruleId: 'store-credit',
      amount: money.isPositive() ? new Money(-money.amount, money.currency, money.precision) : money,
      description: description || 'Store credit applied',
      reason
    });
  }
}
