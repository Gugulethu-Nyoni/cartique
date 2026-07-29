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

export class PricingResolver {
  resolve(state) {
    const items = state.items || [];
    const customer = state.customer || {};
    const configuration = state.configuration || {};
    const quantity = configuration.quantity || 1;

    if (items.length === 0) {
      return ResolutionPatch.error('No items to price');
    }

    const pricedItems = items.map(item => {
      const variant = item.variant;
      if (!variant) {
        return item;
      }

      let unitPrice = variant.basePrice || 0;
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

      const money = Money.fromDecimal(unitPrice);
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

    // Build the resolved data explicitly
    const resolvedData = {
      pricing: {
        unitPrice: pricedItems[0]?.unitPrice?.decimal || 0,
        quantity: quantity,
        subtotal: subtotalMoney,
        appliedRules: []
      }
    };

    return ResolutionPatch.success({
      items: pricedItems,
      resolved: resolvedData,  // ✅ Explicitly include resolved data
      journalEntries: [{
        resolver: 'PricingResolver',
        capability: 'pricing',
        decision: 'applied',
        reason: `Pricing applied: ${pricedItems[0]?.unitPrice?.toFormatted() || 'R0.00'}`,
        confidence: 100
      }]
    });
  }
}
