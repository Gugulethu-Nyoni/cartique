/**
 * ============================================================
 * @semantq/cartique-engine/resolvers
 * ============================================================
 *
 * Resolver: Tax
 * Purpose: Calculate tax for the resolution
 * ============================================================
 */

import { ResolutionPatch } from '../../core/ResolutionPatch.js';
import { Money } from '../../core/Money.js';

export class TaxResolver {
  resolve(state) {
    const place = state.place || {};
    const pricing = state.resolved?.pricing || {};
    const subtotal = pricing.subtotal || new Money(0, 'ZAR', 2);

    // Get tax rate from place
    const taxRate = place.taxRate || 0;
    const taxAmount = subtotal.amount * taxRate;
    const taxMoney = new Money(Math.round(taxAmount), 'ZAR', 2);

    return ResolutionPatch.success({
      resolved: {
        tax: {
          rate: taxRate,
          amount: taxMoney,
          subtotal: subtotal,
          country: place.country || 'unknown'
        }
      },
      journalEntries: [{
        resolver: 'TaxResolver',
        capability: 'tax',
        decision: 'applied',
        reason: `Tax rate: ${taxRate * 100}% applied`,
        confidence: 100,
        after: taxMoney.decimal
      }]
    });
  }
}
