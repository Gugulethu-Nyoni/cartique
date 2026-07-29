/**
 * ============================================================
 * @semantq/cartique/compiler/pipeline
 * ============================================================
 *
 * Step: Validate
 * Purpose: Validate input has required fields
 * ============================================================
 */

export class Validate {
  haltOnError = true;

  process(state) {
    const errors = [];

    if (!state.product) {
      errors.push({ code: 'MISSING_PRODUCT', message: 'Product is required' });
    }

    if (!state.customer) {
      errors.push({ code: 'MISSING_CUSTOMER', message: 'Customer is required' });
    }

    // Product pricing is only required if there are no variants
    // If there are variants, pricing will be resolved from the selected variant
    if (state.product && !state.product.variants && !state.product.pricing) {
      errors.push({ code: 'MISSING_PRICING', message: 'Product pricing is required for products without variants' });
    }

    if (state.configuration?.quantity < 1) {
      errors.push({ code: 'INVALID_QUANTITY', message: 'Quantity must be at least 1' });
    }

    if (errors.length > 0) {
      state.valid = false;
      state.errors = errors;
    }

    return state;
  }
}
