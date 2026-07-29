/**
 * ============================================================
 * @semantq/cartique/compiler/pipeline
 * ============================================================
 *
 * Step: Normalize
 * Purpose: Normalize input into consistent format
 * ============================================================
 */

export class Normalize {
  haltOnError = false;

  process(state) {
    // Ensure configuration has quantity
    if (!state.configuration) {
      state.configuration = { quantity: 1 };
    }

    if (!state.configuration.quantity) {
      state.configuration.quantity = 1;
    }

    // Ensure contexts is an array
    if (!state.contexts) {
      state.contexts = [];
    }

    // Ensure metadata exists
    if (!state.metadata) {
      state.metadata = {};
    }

    // Ensure place is preserved
    if (state.input?.place) {
      state.place = state.input.place;
    }

    // Ensure customer is preserved
    if (state.input?.customer) {
      state.customer = state.input.customer;
    }

    // Ensure product is preserved
    if (state.input?.product) {
      state.product = state.input.product;
    }

    return state;
  }
}
