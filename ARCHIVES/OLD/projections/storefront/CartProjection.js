/**
 * ============================================================
 * @semantq/cartique/projections/storefront
 * ============================================================
 *
 * Projection: Cart
 * Purpose: Transform cart for storefront display
 * ============================================================
 */

import { Money } from '../../core/index.js';

export class CartProjection {
  /**
   * Project cart for storefront
   */
  static project(cart) {
    if (!cart) return null;

    const items = cart.items || [];
    const resolution = cart.resolution || {};

    // Get items from resolution if available
    const resolutionItems = resolution.items || [];
    const cartItems = resolutionItems.length > 0 ? resolutionItems : items;

    return {
      id: cart.id,
      items: cartItems.map(item => ({
        id: item.id || `item-${Date.now()}`,
        productId: item.product?.id || item.productId,
        variantId: item.variant?.id || item.variantId,
        title: item.product?.title || item.title || item.productId,
        quantity: item.quantity?.value || item.quantity || 1,
        unitPrice: item.pricing?.unitPrice?.amount || item.unitPrice || 0,
        totalPrice: item.pricing?.totalPrice?.amount || (item.unitPrice || 0) * (item.quantity || 1),
        attributes: item.variant?.attributes || item.attributes || {}
      })),
      totals: {
        subtotal: cart.subtotal?.amount || cart.subtotal || 0,
        tax: cart.tax?.amount || cart.tax || 0,
        shipping: cart.shipping?.amount || cart.shipping || 0,
        total: cart.total?.amount || cart.total || 0
      },
      itemCount: cartItems.reduce((sum, item) => sum + (item.quantity?.value || item.quantity || 0), 0),
      isEmpty: cartItems.length === 0,
      createdAt: cart.createdAt
    };
  }
}
