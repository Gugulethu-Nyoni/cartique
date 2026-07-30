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
  _resolveFromVariant(state, variant, quantity, customer) {
    let unitPrice = variant.price || 0;
    const appliedRules = [];

    // Check customer group pricing
    const customerGroup = customer.group;
    if (customerGroup === 'wholesale' && variant.wholesalePrice) {
      unitPrice = variant.wholesalePrice;
      appliedRules.push({ type: 'customer_group', group: 'wholesale' });
    }

    // Check bulk pricing
    const bulkPrice = variant.bulkPrice || null;
    const bulkMinQty = variant.bulkMinimumQty || null;
    if (bulkPrice !== null && bulkMinQty !== null && quantity >= bulkMinQty) {
      unitPrice = bulkPrice;
      appliedRules.push({ type: 'bulk', minQuantity: bulkMinQty });
    }

    // Create money objects
    const unitPriceMoney = new Money(unitPrice, 'ZAR', 2);
    const subtotal = new Money(unitPrice * quantity, 'ZAR', 2);

    // Create resolution item
    const item = new ResolutionItem({
      sellable: state.sellable,
      variant: variant,
      quantity: quantity,
      unitPrice: unitPriceMoney,
      origin: { type: 'direct' },
      metadata: {
        appliedRules: appliedRules,
        bulkPrice: bulkPrice,
        bulkMinimumQty: bulkMinQty,
        isBulk: appliedRules.some(r => r.type === 'bulk')
      }
    });

    // Build resolved data
    const resolvedData = {
      pricing: {
        unitPrice: unitPrice,
        quantity: quantity,
        subtotal: subtotal,
        appliedRules: appliedRules,
        bulkPrice: bulkPrice,
        bulkMinimumQty: bulkMinQty,
        isBulk: appliedRules.some(r => r.type === 'bulk')
      }
    };

    const isBulk = appliedRules.some(r => r.type === 'bulk');

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
