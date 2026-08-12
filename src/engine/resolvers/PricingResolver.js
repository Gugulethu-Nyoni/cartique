/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Pricing
 * Purpose: Apply pricing rules to the resolution items
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { Money } from '../../core/Money.js';
import { ResolutionItem } from '../../core/ResolutionItem.js';

export class PricingResolver {
  resolve(state) {
    // Get items from state
    const items = state.items || [];
    const customer = state.customer || {};
    const configuration = state.configuration || {};
    const quantity = configuration.quantity || 1;
    
    // Get selected variant from resolved state (set by VariantResolver)
    const selectedVariant = state.resolved?.selections?.variant;
    
    // If we have a selected variant, use it
    if (selectedVariant) {
      return this._resolveFromVariant(state, selectedVariant, quantity, customer);
    }
    
    // Fallback: use items from state
    if (items.length === 0) {
      return ResolutionPatch.error('No items to price');
    }

    return this._resolveFromItems(state, items, quantity, customer);
  }

  /**
   * Resolve pricing from a selected variant
   */
  _resolveFromVariant(state, variant, quantity, customer = null) {
    let unitPrice = variant.basePrice || 0;
    const appliedRules = [];

    // Customer-group pricing
    const customerGroup = customer?.group || 'retail';

    if (customerGroup === 'wholesale' && variant.wholesalePrice !== null) {
        unitPrice = variant.wholesalePrice;

        appliedRules.push({
            type: 'customer_group',
            group: 'wholesale'
        });
    }

    // Bulk pricing — highest applicable tier wins
    const bulkPricing = variant.bulkPricing || [];

    const matchingTier = [...bulkPricing]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(tier => quantity >= tier.minQuantity);

    if (matchingTier) {
        unitPrice = matchingTier.price;

        appliedRules.push({
            type: 'bulk',
            minQuantity: matchingTier.minQuantity
        });
    }

    // Money uses decimal currency values
    const unitPriceMoney = Money.fromDecimal(unitPrice, 'ZAR', 2);
    const subtotal = Money.fromDecimal(
        unitPrice * quantity,
        'ZAR',
        2
    );

    const isBulk = Boolean(matchingTier);
    const bulkPrice = matchingTier?.price ?? null;
    const bulkMinQty = matchingTier?.minQuantity ?? null;

    const item = new ResolutionItem({
        sellable: state.sellable,
        variant: variant,
        quantity: quantity,
        unitPrice: unitPriceMoney,
        origin: { type: 'direct' },
        metadata: {
            appliedRules,
            bulkPrice,
            bulkMinimumQty: bulkMinQty,
            isBulk,
            basePrice: variant.basePrice,
            wholesalePrice: variant.wholesalePrice,
            selectedPrice: unitPrice
        }
    });

    const resolvedData = {
        pricing: {
            unitPrice,
            quantity,
            subtotal,
            appliedRules,
            bulkPrice,
            bulkMinimumQty: bulkMinQty,
            isBulk
        }
    };

    return ResolutionPatch.success({
        items: [item],
        resolved: resolvedData,
        journalEntries: [{
            resolver: 'PricingResolver',
            capability: 'pricing',
            decision: isBulk ? 'bulk-applied' : 'retail-applied',
            reason: isBulk
                ? `Bulk pricing applied: ${unitPrice} each (min: ${bulkMinQty})`
                : `Retail pricing applied: ${unitPrice} each`,
            confidence: 100
        }]
    });
  }

  /**
   * Resolve pricing from items (fallback)
   */
  _resolveFromItems(state, items, quantity, customer) {
    const pricedItems = items.map(item => {
      const variant = item.variant;
      if (!variant) {
        return item;
      }

      let unitPrice = variant.price || variant.basePrice || 0;
      const appliedRules = [];

      const customerGroup = customer.group;
      if (customerGroup === 'wholesale' && variant.wholesalePrice) {
        unitPrice = variant.wholesalePrice;
        appliedRules.push({ type: 'customer_group', group: 'wholesale' });
      }

      const bulkPricing = variant.bulkPricing || [];
      if (bulkPricing.length > 0) {
        const matchingTier = [...bulkPricing]
          .sort((a, b) => b.minQuantity - a.minQuantity)
          .find(t => quantity >= t.minQuantity);

        if (matchingTier) {
          unitPrice = matchingTier.price;
          appliedRules.push({ type: 'bulk', minQuantity: matchingTier.minQuantity });
        }
      }

      const money = new Money(unitPrice, 'ZAR', 2);
      return item.withUnitPrice(money);
    });

    let totalCents = 0;
    pricedItems.forEach(item => {
      const sub = item.subtotal;
      if (sub) {
        totalCents += sub.amount;
      }
    });
    const subtotalMoney = new Money(totalCents, 'ZAR', 2);

    const resolvedData = {
      pricing: {
        unitPrice: pricedItems[0]?.unitPrice?.amount || 0,
        quantity: quantity,
        subtotal: subtotalMoney,
        appliedRules: []
      }
    };

    return ResolutionPatch.success({
      items: pricedItems,
      resolved: resolvedData,
      journalEntries: [{
        resolver: 'PricingResolver',
        capability: 'pricing',
        decision: 'applied',
        reason: `Pricing applied: ${pricedItems[0]?.unitPrice?.toFormatted?.() || 'R0.00'}`,
        confidence: 100
      }]
    });
  }
}

export default PricingResolver;
