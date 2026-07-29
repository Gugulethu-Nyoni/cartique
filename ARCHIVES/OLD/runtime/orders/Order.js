/**
 * ============================================================
 * @semantq/cartique/runtime/orders
 * ============================================================
 *
 * Module: Order
 * Purpose: Order entity — immutable commercial record
 * ============================================================
 */

export class Order {
  constructor(config) {
    this.id = config.id || `ord-${Date.now()}`;
    this.customerId = config.customerId || null;
    this.items = config.items || [];
    this.totals = config.totals || {};
    this.snapshot = config.snapshot || {};
    this.state = config.state || 'created';
    this.status = config.status || 'pending';
    this.createdAt = config.createdAt || new Date();
    this.updatedAt = config.updatedAt || new Date();

    if (config.snapshot) {
      Object.freeze(config.snapshot);
    }

    Object.freeze(this);
  }

  static fromCheckoutResult(checkoutResult) {
    const order = new Order({
      id: `ord-${Date.now()}`,
      customerId: checkoutResult.customerId,
      items: checkoutResult.cart?.items || [],
      totals: {
        subtotal: checkoutResult.cart?.subtotal || 0,
        tax: checkoutResult.cart?.tax || 0,
        shipping: checkoutResult.cart?.shipping || 0,
        total: checkoutResult.cart?.total || 0
      },
      snapshot: {
        resolution: checkoutResult.cart?.resolution,
        checkoutResult: checkoutResult,
        timestamp: new Date().toISOString()
      },
      state: 'created'
    });

    return order;
  }
}
