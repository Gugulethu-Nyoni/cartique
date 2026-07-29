/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Shipping
 * Purpose: Calculate shipping for the resolution
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { Money } from '../../core/Money.js';

export class ShippingResolver {
  resolve(state) {
    const place = state.place || {};
    const shippingCost = place.defaultShippingCost || 0;

    // Check for free shipping context
    const contexts = state.contexts || [];
    const hasFreeShipping = contexts.some(c => 
      c.injects?.includes('shipping.free')
    );

    const finalCost = hasFreeShipping ? 0 : shippingCost;
    const shippingMoney = Money.fromDecimal(finalCost, 'ZAR', 2);

    return ResolutionPatch.success({
      resolved: {
        shipping: {
          method: hasFreeShipping ? 'free' : 'standard',
          amount: shippingMoney,
          quantity: state.configuration?.quantity || 1
        }
      },
      journalEntries: [{
        resolver: 'ShippingResolver',
        capability: 'shipping',
        decision: 'applied',
        reason: hasFreeShipping ? 'Free shipping applied' : `Standard shipping: ${shippingMoney.toFormatted()}`,
        confidence: 100,
        after: finalCost
      }]
    });
  }
}
