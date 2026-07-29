/**
 * ============================================================
 * @semantq/cartique/projections/storefront
 * ============================================================
 *
 * Projection: Product
 * Purpose: Transform product for storefront display
 * ============================================================
 */

export class ProductProjection {
  /**
   * Project product for storefront
   */
  static project(product) {
    if (!product) return null;

    const variants = product.variants || [];
    const prices = variants.map(v => v.pricing?.base || 0);

    return {
      id: product.id,
      title: product.metadata?.title || product.title,
      description: product.metadata?.description || '',
      slug: product.slug,
      images: product.media?.images || [],
      
      // Price range
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      
      // Options for variant selection
      options: this._extractOptions(variants),
      
      // Variants summary
      variants: variants.map(v => ({
        id: v.id,
        label: v.title || v.attributes?.weight || v.id,
        price: v.pricing?.base || 0,
        wholesalePrice: v.pricing?.wholesale || null,
        attributes: v.attributes || {},
        available: (v.inventory || 0) > 0
      })),
      
      // Availability
      inStock: variants.some(v => (v.inventory || 0) > 0),
      
      // Metadata
      brand: product.metadata?.brand,
      categories: product.categories || [],
      attributes: product.attributes || {}
    };
  }

  /**
   * Extract options from variants for UI selection
   */
  static _extractOptions(variants) {
    const optionMap = {};

    variants.forEach(variant => {
      const attrs = variant.attributes || {};
      Object.keys(attrs).forEach(key => {
        if (!optionMap[key]) {
          optionMap[key] = [];
        }
        const value = attrs[key];
        if (!optionMap[key].includes(value)) {
          optionMap[key].push(value);
        }
      });
    });

    return Object.keys(optionMap).map(key => ({
      name: key,
      values: optionMap[key]
    }));
  }

  /**
   * Project multiple products
   */
  static projectMany(products) {
    return products.map(p => this.project(p)).filter(p => p !== null);
  }
}
