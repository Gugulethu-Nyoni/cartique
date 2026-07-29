/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Promotion
 * Purpose: Apply active promotions as Adjustments
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { Adjustment } from '../../core/Adjustment.js';
import { Money } from '../../core/Money.js';

export class PromotionResolver {
  resolve(state) {
    const contexts = state.contexts || [];
    const pricing = state.resolved?.pricing || {};
    const subtotal = pricing.subtotal || 0;

    const subtotalAmount = subtotal instanceof Money ? subtotal.decimal : subtotal;

    const promotions = contexts.filter(c => {
      const isPromotion = c.type === 'promotion' || 
                         (c.injects && c.injects.includes('pricing.promotion'));
      return isPromotion;
    });

    if (promotions.length === 0) {
      return ResolutionPatch.noChange('No active promotions');
    }

    const adjustments = [];
    const journalEntries = [];

    for (const promotion of promotions) {
      const promoType = promotion.metadata?.type || promotion.type || 'percentage';
      const promoValue = promotion.metadata?.value || promotion.value || 0;
      const conditions = promotion.metadata?.conditions || promotion.conditions || {};

      const eligible = this._isEligible(conditions, state);
      if (!eligible) {
        journalEntries.push({
          resolver: 'PromotionResolver',
          capability: 'promotion',
          ruleId: promotion.id?.value || promotion.id,
          decision: 'rejected',
          reason: `Promotion not eligible: ${promotion.name}`,
          confidence: 100
        });
        continue;
      }

      const discount = this._calculateDiscount(promoType, promoValue, subtotalAmount);
      
      if (!discount || discount.amount <= 0) {
        journalEntries.push({
          resolver: 'PromotionResolver',
          capability: 'promotion',
          ruleId: promotion.id?.value || promotion.id,
          decision: 'rejected',
          reason: `No discount calculated for: ${promotion.name}`,
          confidence: 100
        });
        continue;
      }

      // Create adjustment with negative amount (discount)
      const adjustment = new Adjustment({
        type: 'promotion',
        ruleId: promotion.id?.value || promotion.id,
        amount: new Money(-Math.round(discount.amount * 100), 'ZAR', 2),
        description: discount.description || promotion.name || 'Promotion applied',
        reason: discount.reason || 'Active promotion',
        metadata: {
          promotionId: promotion.id?.value || promotion.id,
          promotionName: promotion.name,
          type: promoType,
          value: promoValue
        }
      });

      adjustments.push(adjustment);
      journalEntries.push({
        resolver: 'PromotionResolver',
        capability: 'promotion',
        ruleId: promotion.id?.value || promotion.id,
        decision: 'applied',
        reason: `${promotion.name}: ${discount.description}`,
        confidence: 100,
        after: -discount.amount
      });
    }

    if (adjustments.length === 0) {
      return ResolutionPatch.noChange('No promotions applied');
    }

    return ResolutionPatch.success({
      adjustments: adjustments,
      journalEntries: journalEntries
    });
  }

  _isEligible(conditions, state) {
    const customer = state.customer || {};
    const items = state.items || [];
    const totalItems = items.reduce((sum, item) => sum + (item.quantity?.value || 1), 0);
    const subtotal = state.resolved?.pricing?.subtotal || 0;
    const subtotalAmount = subtotal instanceof Money ? subtotal.decimal : subtotal;

    if (conditions.activeFrom && conditions.activeTo) {
      const now = new Date();
      const from = new Date(conditions.activeFrom);
      const to = new Date(conditions.activeTo);
      if (now < from || now > to) return false;
    }

    if (conditions.customerGroup) {
      const customerGroup = customer.group || 'guest';
      if (customerGroup !== conditions.customerGroup) return false;
    }

    if (conditions.minQuantity) {
      if (totalItems < conditions.minQuantity) return false;
    }

    if (conditions.minSubtotal) {
      if (subtotalAmount < conditions.minSubtotal) return false;
    }

    return true;
  }

  _calculateDiscount(type, value, subtotal) {
    if (value <= 0) return null;
    if (!subtotal || subtotal <= 0) return null;

    let discountAmount = 0;
    let description = '';
    let reason = '';

    switch (type) {
      case 'percentage':
        discountAmount = subtotal * (value / 100);
        description = `${value}% off`;
        reason = `Percentage discount: ${value}%`;
        break;

      case 'fixed':
        discountAmount = Math.min(value, subtotal);
        description = `R${value} off`;
        reason = `Fixed discount: R${value}`;
        break;

      case 'free_shipping':
        return null;

      default:
        return null;
    }

    if (discountAmount <= 0) return null;

    return {
      amount: discountAmount,
      description: description,
      reason: reason
    };
  }
}
