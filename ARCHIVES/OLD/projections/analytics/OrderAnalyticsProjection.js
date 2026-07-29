/**
 * ============================================================
 * @semantq/cartique/projections/analytics
 * ============================================================
 *
 * Projection: Order Analytics
 * Purpose: Transform checkout result for analytics/BI
 * ============================================================
 */

import { Money } from '../../core/index.js';

export class OrderAnalyticsProjection {
  /**
   * Project checkout result for analytics
   */
  static project(checkoutResult) {
    if (!checkoutResult) return null;

    const resolution = checkoutResult.resolution || {};
    const items = resolution.items || [];
    const customer = resolution.customer || {};
    const pricing = items[0]?.pricing || {};

    return {
      event: 'purchase',
      timestamp: checkoutResult.timestamp || new Date().toISOString(),
      orderId: checkoutResult.id,
      customerId: customer.id || 'unknown',
      customerSegment: customer.group || 'unknown',
      productId: items[0]?.product?.id || 'unknown',
      variantId: items[0]?.variant?.id || null,
      quantity: items.reduce((sum, item) => sum + (item.quantity?.value || 0), 0),
      revenue: checkoutResult.total?.amount || 0,
      subtotal: checkoutResult.subtotal?.amount || 0,
      tax: checkoutResult.taxAmount?.amount || 0,
      shipping: checkoutResult.shippingAmount?.amount || 0,
      currency: checkoutResult.totals?.subtotal?.currency || 'ZAR',
      appliedRules: pricing.appliedRules || [],
      contexts: resolution.contexts || [],
      status: checkoutResult.status
    };
  }

  /**
   * Project for revenue reporting
   */
  static projectRevenue(checkoutResult) {
    if (!checkoutResult) return null;

    const period = checkoutResult.timestamp 
      ? new Date(checkoutResult.timestamp).toISOString().slice(0, 7)
      : new Date().toISOString().slice(0, 7);

    return {
      period: period,
      orderId: checkoutResult.id,
      revenue: checkoutResult.total?.amount || 0,
      items: checkoutResult.resolution?.items?.length || 0,
      quantity: checkoutResult.resolution?.items?.reduce(
        (sum, item) => sum + (item.quantity?.value || 0), 0
      ) || 0
    };
  }
}
