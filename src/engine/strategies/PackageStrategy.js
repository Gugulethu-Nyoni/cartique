/**
 * ============================================================
 * Strategy: Package
 * ============================================================
 */

export class PackageStrategy {
  supports(sellable) {
    return sellable.type === 'package';
  }

  explode(sellable, configuration) {
    return [];
  }
}
