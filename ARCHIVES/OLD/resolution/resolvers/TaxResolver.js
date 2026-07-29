/**
 * ============================================================
 * @semantq/cartique/compiler/resolvers
 * ============================================================
 *
 * Resolver: Tax
 * Purpose: Resolve tax based on place and product
 * ============================================================
 */

export class TaxResolver {
  resolve(state) {
    const subtotal = state.resolved.pricing?.subtotal || 0;
    const place = state.place || state.metadata?.place || {};
    const product = state.product || {};

    let taxRate = 0;
    let taxAmount = 0;
    let taxExempt = false;

    // Check product tax exemption
    if (product?.metadata?.taxExempt) {
      taxExempt = true;
    }

    // Get tax rate from place
    if (place && place.tax && typeof place.tax === 'object') {
      if (place.tax.vatRate !== undefined) {
        taxRate = place.tax.vatRate;
      } else if (place.tax.rate !== undefined) {
        taxRate = place.tax.rate;
      }
    } else if (place?.metadata?.taxRate !== undefined) {
      taxRate = place.metadata.taxRate;
    } else if (place?.taxRate !== undefined) {
      taxRate = place.taxRate;
    } else if (place?.vatRate !== undefined) {
      taxRate = place.vatRate;
    }

    // Calculate tax
    if (!taxExempt && taxRate > 0) {
      taxAmount = Math.round((subtotal * taxRate) * 100) / 100;
    }

    state.resolved.tax = {
      rate: taxRate,
      amount: taxAmount,
      subtotal: subtotal,
      taxExempt: taxExempt,
      country: place?.country || place?.id || 'unknown'
    };

    return state;
  }
}
