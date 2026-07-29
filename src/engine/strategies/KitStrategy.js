/**
 * ============================================================
 * Strategy: Kit
 * ============================================================
 */

export class KitStrategy {
  supports(sellable) {
    return sellable.type === 'kit';
  }

  explode(sellable, configuration) {
    return [];
  }
}
