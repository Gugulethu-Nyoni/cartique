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
    // Use canonical contract: price, bulkPrice, bulkMinimumQty
    let unitPrice = variant.price ?? 0;
    const appliedRules = [];

    // Bulk pricing
    const bulkPrice = variant.bulkPrice ?? null;
    const bulkMinimumQty = variant.bulkMinimumQty ?? null;

    const isBulk =
        bulkPrice !== null &&
        bulkMinimumQty !== null &&
        quantity >= bulkMinimumQty;

    if (isBulk) {
        unitPrice = bulkPrice;
        appliedRules.push({
            type: 'bulk',
            minQuantity: bulkMinimumQty
        });
    }

    const currency = state.sellable?.currency || 'ZAR';

    const unitPriceMoney = Money.fromDecimal(unitPrice, currency, 2);
    const subtotal = Money.fromDecimal(unitPrice * quantity, currency, 2);

    const item = new ResolutionItem({
        sellable: state.sellable,
        variant,
        quantity,
        unitPrice: unitPriceMoney,
        origin: { type: 'direct' },
        metadata: {
            appliedRules,
            bulkPrice,
            bulkMinimumQty,
            isBulk,
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
            bulkMinimumQty,
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
                ? `Bulk pricing applied: ${unitPrice} each (min: ${bulkMinimumQty})`
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
