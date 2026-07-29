/**
 * ============================================================
 * @semantq/cartique/compiler/resolvers
 * ============================================================
 *
 * Resolver: Shipping
 * Purpose: Resolve shipping based on place and product
 * ============================================================
 */

export class ShippingResolver {
  resolve(state) {
    const product = state.product;
    const place = state.place || state.metadata?.place;
    const quantity = state.configuration?.quantity || 1;

    let shippingMethod = 'standard';
    let shippingAmount = 0;

    // Default shipping
    if (place?.shipping?.defaultCost) {
      shippingAmount = place.shipping.defaultCost;
    }

    // Product-specific shipping
    if (product?.shipping?.cost) {
      shippingAmount = product.shipping.cost * quantity;
    }

    // Free shipping for certain contexts
    if (state.resolved.capabilities?.includes('shipping.free')) {
      shippingAmount = 0;
      shippingMethod = 'free';
    }

    state.resolved.shipping = {
      method: shippingMethod,
      amount: shippingAmount,
      quantity: quantity
    };

    return state;
  }
}
