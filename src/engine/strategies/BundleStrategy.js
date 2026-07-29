/**
 * ============================================================
 * Strategy: Bundle
 * ============================================================
 */

export class BundleStrategy {
  supports(sellable) {
    return sellable.type === 'bundle';
  }

  explode(sellable, configuration) {
    // Will be implemented
    return [];
  }
}
