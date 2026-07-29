/**
 * ============================================================
 * @semantq/cartique/projections/api
 * ============================================================
 *
 * Projection: Product DTO
 * Purpose: Transform product for REST API responses
 * ============================================================
 */

export class ProductDTO {
  /**
   * Project product for API
   */
  static project(product) {
    if (!product) return null;

    const variants = product.variants || [];

    return {
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.metadata?.title || product.title,
      description: product.metadata?.description || '',
      brand: product.metadata?.brand,
      images: product.media?.images || [],
      attributes: product.attributes || {},
      categories: product.categories || [],
      variants: variants.map(v => ({
        id: v.id,
        sku: v.sku,
        title: v.title || v.id,
        attributes: v.attributes || {},
        price: v.pricing?.base || 0,
        wholesalePrice: v.pricing?.wholesale || null,
        inventory: v.inventory || 0,
        bulkPricing: v.pricing?.bulk || []
      })),
      priceRange: {
        min: variants.length > 0 ? Math.min(...variants.map(v => v.pricing?.base || 0)) : 0,
        max: variants.length > 0 ? Math.max(...variants.map(v => v.pricing?.base || 0)) : 0
      },
      inStock: variants.some(v => (v.inventory || 0) > 0)
    };
  }

  /**
   * Project multiple products
   */
  static projectMany(products) {
    return products.map(p => this.project(p)).filter(p => p !== null);
  }
}
