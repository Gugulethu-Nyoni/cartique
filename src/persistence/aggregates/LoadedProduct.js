/**
 * ============================================================
 * Persistence Aggregate: LoadedProduct
 * ============================================================
 * 
 * This is what the repository returns.
 * It is a fully assembled persistence object.
 * 
 * The mapper transforms this into a Sellable.
 * ============================================================
 */

export class LoadedProduct {
  constructor(data) {
    this.product = data.product || null;
    this.variants = Object.freeze(data.variants || []);
    this.pricingRules = Object.freeze(data.pricingRules || []);
    this.inventoryLevels = Object.freeze(data.inventoryLevels || []);
    this.categories = Object.freeze(data.categories || []);
    this.reviews = Object.freeze(data.reviews || []);
    this.media = Object.freeze(data.media || []);
    this.metadata = Object.freeze(data.metadata || {});
    Object.freeze(this);
  }

  get id() { return this.product?.id || null; }
  get sku() { return this.product?.sku || ''; }
  get title() { return this.product?.title || ''; }
  get description() { return this.product?.description || ''; }
  get hasVariants() { return this.variants.length > 0; }
  get hasPricingRules() { return this.pricingRules.length > 0; }
  get hasInventory() { return this.inventoryLevels.length > 0; }
  get hasCategories() { return this.categories.length > 0; }
  get hasReviews() { return this.reviews.length > 0; }
  get hasMedia() { return this.media.length > 0; }

  get defaultVariant() {
    return this.variants.find(v => v.isDefault === true) || this.variants[0] || null;
  }

  get totalAvailableInventory() {
    return this.inventoryLevels.reduce((sum, level) => sum + (level.available - level.reserved || 0), 0);
  }

  get isInStock() {
    return this.totalAvailableInventory > 0;
  }

  get averageRating() {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  get reviewCount() {
    return this.reviews.length;
  }

  getPricingRulesForVariant(variantId) {
    return this.pricingRules.filter(r => r.variantId === variantId);
  }

  getInventoryForVariant(variantId) {
    return this.inventoryLevels.filter(l => l.variantId === variantId);
  }

  getSortedPricingRules() {
    return [...this.pricingRules].sort((a, b) => b.priority - a.priority);
  }
}
