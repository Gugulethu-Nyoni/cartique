/**
 * ============================================================
 * @semantq/cartique-persistence
 * ============================================================
 *
 * Repository: Product
 * Purpose: Load product data from fixtures
 * Returns: LoadedProduct aggregate
 * ============================================================
 */

import { LoadedProduct } from '../aggregates/LoadedProduct.js';
import { products } from '../fixtures/botaniq/products.js';
import { variants } from '../fixtures/botaniq/variants.js';
import { pricingRules } from '../fixtures/botaniq/pricingRules.js';
import { inventoryLevels } from '../fixtures/botaniq/inventory.js';
import { reviews } from '../fixtures/botaniq/reviews.js';
import { categories } from '../fixtures/botaniq/categories.js';

export class ProductRepository {
  static loadById(id) {
    const product = products.find(p => p.id === id);
    if (!product) return null;

    const productVariants = variants.filter(v => v.productId === id);
    const productPricingRules = pricingRules.filter(r => 
      productVariants.some(v => v.id === r.variantId)
    );
    const productInventory = inventoryLevels.filter(l =>
      productVariants.some(v => v.id === l.variantId)
    );
    const productReviews = reviews.filter(r => r.productId === id);

    return new LoadedProduct({
      product,
      variants: productVariants,
      pricingRules: productPricingRules,
      inventoryLevels: productInventory,
      reviews: productReviews,
      categories: categories,
      media: []
    });
  }

  static loadBySlug(slug) {
    const product = products.find(p => p.slug === slug);
    if (!product) return null;
    return this.loadById(product.id);
  }

  static loadAll() {
    return products.map(p => this.loadById(p.id));
  }

  static loadByCategory(categoryId) {
    return products
      .filter(p => p.categories?.some(c => c.id === categoryId))
      .map(p => this.loadById(p.id));
  }
}
