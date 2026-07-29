/**
 * ============================================================
 * Strategy: Collection
 * ============================================================
 */

export class CollectionStrategy {
  supports(sellable) {
    return sellable.type === 'collection';
  }

  explode(sellable, configuration) {
    return [];
  }
}
