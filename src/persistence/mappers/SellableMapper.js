/**
 * ============================================================
 * @semantq/cartique-persistence/mappers
 * ============================================================
 *
 * Mapper: Sellable
 * Purpose: Transform LoadedProduct → Sellable
 * ============================================================
 */

import { Sellable } from '../../commerce/Sellable.js';
import { Variant } from '../../commerce/Variant.js';
import { Identifier } from '../../core/Identifier.js';

export class SellableMapper {
  static fromLoadedProduct(loaded) {
    if (!loaded || !loaded.product) return null;

    const product = loaded.product;
    const variants = loaded.variants || [];
    const pricingRules = loaded.pricingRules || [];

    // Build variants with their pricing rules
    const commerceVariants = variants.map(v => {
      const variantRules = pricingRules.filter(r => r.variantId === v.id);
      
      const pricing = {
        base: v.price || 0
      };

      const customerGroupRules = variantRules.filter(r => r.type === 'customer_group');
      if (customerGroupRules.length > 0) {
        customerGroupRules.forEach(rule => {
          const group = rule.conditions?.customerGroup;
          if (group && !pricing[group]) {
            pricing[group] = rule.price;
          }
        });
      }

      const bulkRules = variantRules.filter(r => r.type === 'bulk');
      if (bulkRules.length > 0) {
        pricing.bulk = bulkRules.map(r => ({
          minQuantity: r.conditions?.minQuantity || 0,
          price: r.price
        })).sort((a, b) => a.minQuantity - b.minQuantity);
      }

      return new Variant({
        id: Identifier.from(String(v.id), 'variant'),
        sellableId: Identifier.from(String(v.productId), 'product'),
        sku: v.sku || '',
        title: v.title || '',
        attributes: v.attributes || {},
        pricing: pricing,
        inventory: v.inventory || 0,
        isDefault: v.isDefault || false,
        metadata: {
          weight_kg: v.weight_kg || 0,
          dimensions: {
            length: v.length_cm || 0,
            width: v.width_cm || 0,
            height: v.height_cm || 0
          },
          compareAtPrice: v.compareAtPrice || null,
          costPrice: v.costPrice || null,
          barcode: v.barcode || null,
          variantImage: v.variantImage || null
        }
      });
    });

    const defaultVariant = commerceVariants.find(v => v.isDefault) || commerceVariants[0] || null;

    return new Sellable({
      id: Identifier.from(String(product.id), 'product'),
      type: 'product',
      title: product.title || '',
      sku: product.sku || '',
      pricing: {
        base: defaultVariant?.basePrice || 0,
        wholesale: defaultVariant?.wholesalePrice || null
      },
      variants: commerceVariants,
      inventory: loaded.totalAvailableInventory || 0,
      metadata: {
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        brand: product.metadata?.brand || '',
        image: product.image || null,
        currency: product.currency || 'ZAR',
        status: product.status || 'active',
        categories: loaded.categories || [],
        reviews: loaded.reviews || [],
        attributes: product.attributes || {},
        unit: product.metadata?.unit || 'each',
        precision: product.metadata?.precision || 0
      }
    });
  }
}
