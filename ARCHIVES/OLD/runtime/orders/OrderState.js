/**
 * ============================================================
 * @semantq/cartique/runtime/orders
 * ============================================================
 *
 * Module: OrderState
 * Purpose: Order state constants
 * ============================================================
 */

export const OrderState = Object.freeze({
  CREATED: 'created',
  PENDING: 'pending',
  PAID: 'paid',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
});
