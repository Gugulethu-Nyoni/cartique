/**
 * ============================================================
 * @semantq/cartique/projections/storefront
 * ============================================================
 *
 * Projection: Checkout
 * Purpose: Transform checkout session for storefront display
 * ============================================================
 */

import { Money } from '../../core/index.js';

export class CheckoutProjection {
  /**
   * Project checkout session for storefront
   */
  static project(checkoutResult) {
    if (!checkoutResult) return null;

    const resolution = checkoutResult.resolution || {};
    const items = resolution.items || [];

    return {
      id: checkoutResult.id,
      status: checkoutResult.status,
      valid: checkoutResult.valid,
      errors: checkoutResult.errors || [],
      warnings: checkoutResult.warnings || [],
      items: items.map(item => ({
        id: item.id || `item-${Date.now()}`,
        productId: item.product?.id || 'unknown',
        title: item.product?.title || 'Product',
        quantity: item.quantity?.value || 1,
        unitPrice: item.pricing?.unitPrice?.amount || 0,
        total: item.pricing?.totalPrice?.amount || 0
      })),
      totals: {
        subtotal: checkoutResult.subtotal?.amount || 0,
        tax: checkoutResult.taxAmount?.amount || 0,
        shipping: checkoutResult.shippingAmount?.amount || 0,
        total: checkoutResult.total?.amount || 0
      },
      paymentIntent: checkoutResult.paymentIntent || null,
      createdAt: checkoutResult.timestamp
    };
  }
}
