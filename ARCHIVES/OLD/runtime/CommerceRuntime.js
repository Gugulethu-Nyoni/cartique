/**
 * ============================================================
 * @semantq/cartique/runtime
 * ============================================================
 *
 * Module: CommerceRuntime
 * Purpose: Commerce execution runtime
 * ============================================================
 */

import { CheckoutResult } from './results/CheckoutResult.js';
import { PaymentResult } from './results/PaymentResult.js';
import { RefundResult } from './results/RefundResult.js';
import { EventBus } from '../events/EventBus.js';
import { OrderCreated } from '../events/OrderCreated.js';
import { PaymentAuthorized } from '../events/PaymentAuthorized.js';

export class CommerceRuntime {
  constructor(options = {}) {
    this.eventBus = options.eventBus || new EventBus();
    this.carts = new Map();
  }

  /**
   * Create a cart from a resolution
   */
  createCart(resolution) {
    const cart = {
      id: `cart-${Date.now()}`,
      resolution: resolution,
      items: resolution.items || [],
      subtotal: resolution.subtotal || 0,
      tax: resolution.taxAmount || 0,
      shipping: resolution.shippingAmount || 0,
      total: resolution.total || 0,
      createdAt: new Date()
    };

    this.carts.set(cart.id, cart);

    // Emit cart created event
    this.eventBus.publish({
      type: 'cart.created',
      payload: { cartId: cart.id }
    });

    return cart;
  }

  /**
   * Get a cart by ID
   */
  getCart(cartId) {
    return this.carts.get(cartId);
  }

  /**
   * Checkout a cart or resolution
   */
  checkout(input) {
    let resolution;
    let cart;

    // If input is a cart, use its resolution
    if (input && input.resolution) {
      cart = input;
      resolution = input.resolution;
    } else {
      resolution = input;
      cart = this.createCart(resolution);
    }

    // Validate resolution
    if (!resolution || !resolution.valid) {
      return new CheckoutResult({
        status: 'failed',
        diagnostics: {
          errors: [{ code: 'INVALID_RESOLUTION', message: 'Resolution is invalid' }]
        },
        resolution: resolution,
        cart: cart
      });
    }

    // Create payment intent
    const paymentIntent = {
      id: `pi-${Date.now()}`,
      amount: resolution.total || 0,
      currency: 'ZAR',
      status: 'succeeded'
    };

    // Emit payment authorized event
    this.eventBus.publish(new PaymentAuthorized({
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount
    }));

    // Create checkout result
    const result = new CheckoutResult({
      status: 'completed',
      resolution: resolution,
      cart: cart,
      paymentIntent: paymentIntent,
      totals: {
        subtotal: resolution.subtotal || 0,
        tax: resolution.taxAmount || 0,
        shipping: resolution.shippingAmount || 0,
        total: resolution.total || 0
      },
      diagnostics: {}
    });

    // Emit order created event
    this.eventBus.publish(new OrderCreated({
      orderId: result.id,
      amount: result.total
    }));

    // Clean up cart
    if (cart && cart.id) {
      this.carts.delete(cart.id);
    }

    return result;
  }

  /**
   * Authorize a payment
   */
  authorizePayment(checkoutResult) {
    return new PaymentResult({
      status: 'completed',
      transactionId: `txn-${Date.now()}`,
      amount: checkoutResult.total,
      currency: 'ZAR',
      provider: 'stripe',
      providerReference: `ref-${Date.now()}`
    });
  }

  /**
   * Capture a payment
   */
  capturePayment(paymentResult) {
    return new PaymentResult({
      status: 'completed',
      transactionId: paymentResult.transactionId,
      amount: paymentResult.amount,
      currency: paymentResult.currency,
      provider: paymentResult.provider,
      providerReference: paymentResult.providerReference
    });
  }

  /**
   * Refund a transaction
   */
  refund(transactionId, amount) {
    return new RefundResult({
      status: 'completed',
      originalTransactionId: transactionId,
      amount: amount,
      currency: 'ZAR',
      reason: 'Customer requested refund'
    });
  }

  /**
   * Cancel a transaction
   */
  cancel(transactionId) {
    return new RefundResult({
      status: 'completed',
      originalTransactionId: transactionId,
      amount: 0,
      currency: 'ZAR',
      reason: 'Transaction cancelled'
    });
  }

  /**
   * Subscribe to events
   */
  on(eventType, handler) {
    this.eventBus.subscribe(eventType, handler);
    return this;
  }
}
