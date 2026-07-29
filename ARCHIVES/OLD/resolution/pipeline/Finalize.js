/**
 * ============================================================
 * @semantq/cartique/compiler/pipeline
 * ============================================================
 *
 * Step: Finalize
 * Purpose: Finalize resolved state
 * ============================================================
 */

export class Finalize {
  haltOnError = false;

  process(state) {
    // Calculate total if pricing and shipping are resolved
    if (state.resolved.pricing && state.resolved.shipping) {
      state.resolved.total =
        (state.resolved.pricing.subtotal || 0) +
        (state.resolved.tax?.amount || 0) +
        (state.resolved.shipping?.amount || 0);
    }

    return state;
  }
}
