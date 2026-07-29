/**
 * ============================================================
 * @semantq/cartique/projections/persistence
 * ============================================================
 *
 * Projection: Prisma
 * Purpose: Transform checkout result for Prisma ORM
 * ============================================================
 */

import { Money } from '../../core/index.js';

export class PrismaProjection {
  /**
   * Project checkout result for Prisma order creation
   */
  static projectOrder(checkoutResult, customerId) {
    if (!checkoutResult) return null;

    const resolution = checkoutResult.resolution || {};
    const items = resolution.items || [];

    return {
      id: checkoutResult.id,
      customerId: customerId || resolution.customer?.id || 'guest',
      status: checkoutResult.status || 'pending',
      subtotal: checkoutResult.subtotal?.amount || 0,
      tax: checkoutResult.taxAmount?.amount || 0,
      shipping: checkoutResult.shippingAmount?.amount || 0,
      total: checkoutResult.total?.amount || 0,
      currency: checkoutResult.totals?.subtotal?.currency || 'ZAR',
      items: items.map(item => ({
        productId: item.product?.id || 'unknown',
        variantId: item.variant?.id || null,
        quantity: item.quantity?.value || 1,
        unitPrice: item.pricing?.unitPrice?.amount || 0,
        total: item.pricing?.totalPrice?.amount || 0
      })),
      metadata: {
        resolution: resolution,
        resolvedAt: checkoutResult.timestamp
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Project product for Prisma upsert
   */
  static projectProduct(product) {
    if (!product) return null;

    return {
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.metadata?.title || '',
      description: product.metadata?.description || '',
      brand: product.metadata?.brand || '',
      images: product.media?.images || [],
      attributes: product.attributes || {},
      metadata: product.metadata || {}
    };
  }

  /**
   * Project variant for Prisma upsert
   */
  static projectVariant(variant, productId) {
    if (!variant) return null;

    return {
      id: variant.id,
      productId: productId || variant.productId,
      sku: variant.sku,
      title: variant.title || '',
      attributes: variant.attributes || {},
      price: variant.pricing?.base || 0,
      wholesalePrice: variant.pricing?.wholesale || null,
      inventory: variant.inventory || 0,
      pricingRules: variant.pricing?.bulk || []
    };
  }
}
