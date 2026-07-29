/**
 * ============================================================
 * @semantq/cartique/projections/api
 * ============================================================
 *
 * Projection: Order DTO
 * Purpose: Transform checkout result for REST API responses
 * ============================================================
 */

export class OrderDTO {
  /**
   * Project checkout result for API
   */
  static project(checkoutResult) {
    if (!checkoutResult) return null;

    const resolution = checkoutResult.resolution || {};
    const items = resolution.items || [];

    return {
      id: checkoutResult.id,
      status: checkoutResult.status,
      valid: checkoutResult.valid,
      customerId: resolution.customer?.id || null,
      items: items.map(item => ({
        productId: item.product?.id || 'unknown',
        variantId: item.variant?.id || null,
        title: item.product?.title || 'Product',
        quantity: item.quantity?.value || 1,
        unitPrice: item.pricing?.unitPrice?.amount || 0,
        totalPrice: item.pricing?.totalPrice?.amount || 0
      })),
      totals: {
        subtotal: checkoutResult.subtotal?.amount || 0,
        tax: checkoutResult.taxAmount?.amount || 0,
        shipping: checkoutResult.shippingAmount?.amount || 0,
        total: checkoutResult.total?.amount || 0
      },
      currency: checkoutResult.totals?.subtotal?.currency || 'ZAR',
      createdAt: checkoutResult.timestamp,
      errors: checkoutResult.errors || [],
      warnings: checkoutResult.warnings || []
    };
  }

  /**
   * Project multiple checkout results
   */
  static projectMany(checkoutResults) {
    return checkoutResults.map(r => this.project(r)).filter(r => r !== null);
  }
}
